import { beforeEach, describe, expect, it, vi } from "vitest";
import express, { type ErrorRequestHandler } from "express";
import request from "supertest";

const mocks = vi.hoisted(() => ({
  db: {
    studentProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
    company: {
      update: vi.fn(),
    },
    recruiterProfile: {
      findUnique: vi.fn(),
    },
  },

  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },

  imagekitUpload: vi.fn(),

  auth: {
    role: "STUDENT" as string,
  },
}));

vi.mock("../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

vi.mock("../../src/lib/imagekit", () => ({
  isImageKitConfigured: () => true,

  getImageKit: () => ({
    upload: mocks.imagekitUpload,
  }),

  imageKitFolder: (...parts: string[]) =>
    ["campuslink", ...parts.filter(Boolean)].join("/"),
}));

vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: async (req: any, _res: any, next: any) => {
    req.user = {
      id: "user-1",
      email: "user@example.com",
      name: "Test User",
      role: mocks.auth.role,
    };

    req.session = {
      id: "session-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 3600000),
    };

    next();
  },
}));

vi.mock("../../src/middleware/role.middleware", () => ({
  requireRole: (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!allowedRoles.includes(req.user?.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      next();
    };
  },
}));

import {
  IMAGE_MAX_BYTES,
  RESUME_MAX_BYTES,
} from "../../src/middleware/upload.middleware";

import studentRouter from "../../src/modules/students/student.routes";
import recruiterRouter from "../../src/modules/recruiter/recruiter.routes";

const app = express();

app.use(express.json());
app.use("/api/students", studentRouter);
app.use("/api/recruiter", recruiterRouter);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  return res.status(500).json({
    success: false,
    message: error.message,
  });
};

app.use(errorHandler);

const PDF_BYTES = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
);

const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const UPLOAD_URL = "https://cdn.example.com/uploaded-file";

beforeEach(() => {
  vi.clearAllMocks();

  mocks.auth.role = "STUDENT";

  mocks.imagekitUpload.mockResolvedValue({
    url: UPLOAD_URL,
  });

  mocks.db.studentProfile.findUnique.mockResolvedValue({
    id: "student-1",
  });

  mocks.db.studentProfile.update.mockResolvedValue({});
  mocks.db.user.update.mockResolvedValue({});
  mocks.db.company.update.mockResolvedValue({});

  mocks.db.recruiterProfile.findUnique.mockResolvedValue({
    id: "recruiter-1",
    companyId: "company-1",
  });
});

describe("POST /api/students/me/resume", () => {
  it("should upload a valid PDF resume to ImageKit, persist it, and invalidate student caches", async () => {
    const response = await request(app)
      .post("/api/students/me/resume")
      .attach("file", PDF_BYTES, {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "Resume uploaded successfully",
      data: {
        resumeUrl: UPLOAD_URL,
      },
    });

    expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
      },
      select: {
        id: true,
      },
    });

    expect(mocks.imagekitUpload).toHaveBeenCalledWith({
      file: PDF_BYTES,
      fileName: expect.stringMatching(/^resume-\d+-resume\.pdf$/),
      folder: "campuslink/resume",
      useUniqueFileName: true,
    });

    expect(mocks.db.studentProfile.update).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
      },
      data: {
        resumeUrl: UPLOAD_URL,
      },
    });

    expect(mocks.redis.del).toHaveBeenCalledWith(
      "student:user:user-1",
      "student:readiness:user-1",
      "student:dashboard:user-1",
      "student:drives:user-1",
      "student:interviews:user-1",
      "student:offers:user-1",
      "student:notifications:user-1",
      "student:student-1",
    );
  });

  it("should sanitize the original file name before uploading to ImageKit", async () => {
    const response = await request(app)
      .post("/api/students/me/resume")
      .attach("file", PDF_BYTES, {
        filename: "my resume (final).pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(200);

    expect(mocks.imagekitUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: expect.stringMatching(/^resume-\d+-my_resume__final_\.pdf$/),
      }),
    );
  });

  it("should reject a non-PDF file with 400", async () => {
    const response = await request(app)
      .post("/api/students/me/resume")
      .attach("file", PNG_BYTES, {
        filename: "resume.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Invalid Resume file type. Allowed: application/pdf",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();
  });

  it("should reject a resume larger than the size limit with 400", async () => {
    const oversized = Buffer.alloc(RESUME_MAX_BYTES + 1, "a");

    const response = await request(app)
      .post("/api/students/me/resume")
      .attach("file", oversized, {
        filename: "big-resume.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Resume file exceeds the maximum size of 5MB",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();
  });

  it("should reject when no file is attached with 400", async () => {
    const response = await request(app).post("/api/students/me/resume");

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "No resume file uploaded",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();
  });

  it("should return 500 when the student profile does not exist", async () => {
    mocks.db.studentProfile.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/students/me/resume")
      .attach("file", PDF_BYTES, {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      message: "Student profile not found",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();
  });

  it("should return 500 and not persist when ImageKit upload fails", async () => {
    mocks.imagekitUpload.mockRejectedValue(new Error("ImageKit unavailable"));

    const response = await request(app)
      .post("/api/students/me/resume")
      .attach("file", PDF_BYTES, {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      message: "ImageKit unavailable",
    });

    expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();
    expect(mocks.redis.del).not.toHaveBeenCalled();
  });
});

describe("POST /api/students/me/photo", () => {
  it("should upload a valid photo to ImageKit, persist it, and invalidate student caches", async () => {
    const response = await request(app)
      .post("/api/students/me/photo")
      .attach("file", PNG_BYTES, {
        filename: "photo.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "Photo uploaded successfully",
      data: {
        image: UPLOAD_URL,
      },
    });

    expect(mocks.imagekitUpload).toHaveBeenCalledWith({
      file: PNG_BYTES,
      fileName: expect.stringMatching(/^photo-\d+-photo\.png$/),
      folder: "campuslink/photos",
      useUniqueFileName: true,
    });

    expect(mocks.db.user.update).toHaveBeenCalledWith({
      where: {
        id: "user-1",
      },
      data: {
        image: UPLOAD_URL,
      },
    });

    expect(mocks.redis.del).toHaveBeenCalledWith(
      "student:user:user-1",
      "student:readiness:user-1",
      "student:dashboard:user-1",
      "student:drives:user-1",
      "student:interviews:user-1",
      "student:offers:user-1",
      "student:notifications:user-1",
    );
  });

  it("should reject a non-image file with 400", async () => {
    const response = await request(app)
      .post("/api/students/me/photo")
      .attach("file", PDF_BYTES, {
        filename: "photo.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message:
        "Invalid Image file type. Allowed: image/jpeg, image/jpg, image/png, image/webp",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.user.update).not.toHaveBeenCalled();
  });

  it("should reject a photo larger than the size limit with 400", async () => {
    const oversized = Buffer.alloc(IMAGE_MAX_BYTES + 1, "a");

    const response = await request(app)
      .post("/api/students/me/photo")
      .attach("file", oversized, {
        filename: "big-photo.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Image file exceeds the maximum size of 2MB",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.user.update).not.toHaveBeenCalled();
  });

  it("should reject when no file is attached with 400", async () => {
    const response = await request(app).post("/api/students/me/photo");

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "No photo file uploaded",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.user.update).not.toHaveBeenCalled();
  });

  it("should return 500 and not persist when ImageKit upload fails", async () => {
    mocks.imagekitUpload.mockRejectedValue(new Error("ImageKit unavailable"));

    const response = await request(app)
      .post("/api/students/me/photo")
      .attach("file", PNG_BYTES, {
        filename: "photo.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      message: "ImageKit unavailable",
    });

    expect(mocks.db.user.update).not.toHaveBeenCalled();
    expect(mocks.redis.del).not.toHaveBeenCalled();
  });
});

describe("POST /api/recruiter/company/logo", () => {
  beforeEach(() => {
    mocks.auth.role = "RECRUITER";
  });

  it("should upload a valid logo to ImageKit and persist it on the company", async () => {
    const response = await request(app)
      .post("/api/recruiter/company/logo")
      .attach("file", PNG_BYTES, {
        filename: "logo.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "Company logo uploaded successfully",
      data: {
        logoUrl: UPLOAD_URL,
      },
    });

    expect(mocks.db.recruiterProfile.findUnique).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
      },
      select: {
        id: true,
        companyId: true,
      },
    });

    expect(mocks.imagekitUpload).toHaveBeenCalledWith({
      file: PNG_BYTES,
      fileName: expect.stringMatching(/^logo-\d+-logo\.png$/),
      folder: "campuslink/logos",
      useUniqueFileName: true,
    });

    expect(mocks.db.company.update).toHaveBeenCalledWith({
      where: {
        id: "company-1",
      },
      data: {
        logoUrl: UPLOAD_URL,
      },
    });
  });

  it("should return 500 when the recruiter has no company", async () => {
    mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/recruiter/company/logo")
      .attach("file", PNG_BYTES, {
        filename: "logo.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      message: "Recruiter company not found",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.company.update).not.toHaveBeenCalled();
  });

  it("should reject when no file is attached with 400", async () => {
    const response = await request(app).post("/api/recruiter/company/logo");

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "No logo file uploaded",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.company.update).not.toHaveBeenCalled();
  });

  it("should reject a non-image file with 400", async () => {
    const response = await request(app)
      .post("/api/recruiter/company/logo")
      .attach("file", PDF_BYTES, {
        filename: "logo.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message:
        "Invalid Image file type. Allowed: image/jpeg, image/jpg, image/png, image/webp",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.company.update).not.toHaveBeenCalled();
  });
});

describe("role enforcement", () => {
  it("should reject a STUDENT uploading a company logo", async () => {
    const response = await request(app)
      .post("/api/recruiter/company/logo")
      .attach("file", PNG_BYTES, {
        filename: "logo.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      success: false,
      message: "You do not have permission to access this resource",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
  });

  it("should reject a RECRUITER uploading a student resume", async () => {
    mocks.auth.role = "RECRUITER";

    const response = await request(app)
      .post("/api/students/me/resume")
      .attach("file", PDF_BYTES, {
        filename: "resume.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      success: false,
      message: "You do not have permission to access this resource",
    });

    expect(mocks.imagekitUpload).not.toHaveBeenCalled();
    expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();
  });
});
