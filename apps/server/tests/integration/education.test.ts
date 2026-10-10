import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

const mocks = vi.hoisted(() => ({
  db: {
    studentProfile: {
      findUnique: vi.fn(),
    },
    education: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

vi.mock("../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = {
      id: "user-1",
      email: "student@example.com",
      name: "Test Student",
      role: "STUDENT",
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

import educationRouter from "../../src/modules/education/education.routes";

const app = express();

app.use(express.json());
app.use("/api/education", educationRouter);

app.use((error: Error, _req: any, res: any, _next: any) => {
  return res.status(500).json({
    success: false,
    message: error.message,
  });
});

describe("Education Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);

    mocks.db.studentProfile.findUnique.mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });

    mocks.db.education.findMany.mockResolvedValue([]);

    mocks.db.education.findUnique.mockResolvedValue(null);

    mocks.db.education.create.mockResolvedValue({
      id: "education-1",
      studentId: "student-1",
      institution: "ABC University",
      degree: "B.Tech",
      branch: "Computer Science",
      startYear: 2022,
      endYear: 2026,
      cgpa: 8.5,
      percentage: null,
    });

    mocks.db.education.update.mockResolvedValue({
      id: "education-1",
      studentId: "student-1",
      institution: "XYZ University",
      degree: "B.Tech",
      branch: "Computer Science",
      startYear: 2022,
      endYear: 2026,
      cgpa: 9,
      percentage: null,
    });

    mocks.db.education.delete.mockResolvedValue({
      id: "education-1",
    });
  });

  describe("POST /api/education", () => {
    it("should create education", async () => {
      const response = await request(app).post("/api/education").send({
        institution: "ABC University",
        degree: "B.Tech",
        branch: "Computer Science",
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.5,
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        message: "Education added successfully",
        data: {
          id: "education-1",
          studentId: "student-1",
          institution: "ABC University",
          degree: "B.Tech",
          branch: "Computer Science",
          startYear: 2022,
          endYear: 2026,
          cgpa: 8.5,
          percentage: null,
        },
      });

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.education.create).toHaveBeenCalledWith({
        data: {
          studentId: "student-1",
          institution: "ABC University",
          degree: "B.Tech",
          branch: "Computer Science",
          startYear: 2022,
          endYear: 2026,
          cgpa: 8.5,
          percentage: undefined,
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "education:student:student-1",
      );
    });

    it("should create education with only required data", async () => {
      const response = await request(app).post("/api/education").send({
        institution: "ABC University",
      });

      expect(response.status).toBe(201);

      expect(mocks.db.education.create).toHaveBeenCalledWith({
        data: {
          studentId: "student-1",
          institution: "ABC University",
          degree: undefined,
          branch: undefined,
          startYear: undefined,
          endYear: undefined,
          cgpa: undefined,
          percentage: undefined,
        },
      });
    });

    it("should reject invalid education data", async () => {
      const response = await request(app).post("/api/education").send({
        institution: "A",
        cgpa: 11,
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid education data");

      expect(mocks.db.education.create).not.toHaveBeenCalled();
    });

    it("should return an error when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      const response = await request(app).post("/api/education").send({
        institution: "ABC University",
        degree: "B.Tech",
      });

      expect(response.status).toBe(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Student profile not found");

      expect(mocks.db.education.create).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/education/my", () => {
    it("should return current student's education", async () => {
      const education = [
        {
          id: "education-1",
          studentId: "student-1",
          institution: "ABC University",
          degree: "B.Tech",
          branch: "Computer Science",
          startYear: 2022,
          endYear: 2026,
          cgpa: 8.5,
        },
      ];

      mocks.db.education.findMany.mockResolvedValue(education);

      const response = await request(app).get("/api/education/my");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: education,
      });

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.education.findMany).toHaveBeenCalledWith({
        where: {
          studentId: "student-1",
        },
        orderBy: {
          startYear: "desc",
        },
      });
    });

    it("should return cached education", async () => {
      const education = [
        {
          id: "education-1",
          studentId: "student-1",
          institution: "ABC University",
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(education));

      const response = await request(app).get("/api/education/my");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: education,
      });

      expect(mocks.db.education.findMany).not.toHaveBeenCalled();

      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should return an error when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/api/education/my");

      expect(response.status).toBe(500);

      expect(response.body.message).toBe("Student profile not found");
    });
  });

  describe("PATCH /api/education/:id", () => {
    it("should update education", async () => {
      mocks.db.education.findUnique.mockResolvedValue({
        id: "education-1",
        studentId: "student-1",
        institution: "ABC University",
      });

      const response = await request(app)
        .patch("/api/education/education-1")
        .send({
          institution: "XYZ University",
          cgpa: 9,
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Education updated successfully",
        data: {
          id: "education-1",
          studentId: "student-1",
          institution: "XYZ University",
          degree: "B.Tech",
          branch: "Computer Science",
          startYear: 2022,
          endYear: 2026,
          cgpa: 9,
          percentage: null,
        },
      });

      expect(mocks.db.education.update).toHaveBeenCalledWith({
        where: {
          id: "education-1",
        },
        data: {
          institution: "XYZ University",
          cgpa: 9,
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "education:student:student-1",
        "education:education-1",
      );
    });

    it("should reject invalid update data", async () => {
      const response = await request(app)
        .patch("/api/education/education-1")
        .send({
          cgpa: 11,
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid education data");

      expect(mocks.db.education.update).not.toHaveBeenCalled();
    });

    it("should return an error when education does not exist", async () => {
      mocks.db.education.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/education/education-999")
        .send({
          cgpa: 9,
        });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe("Education record not found");

      expect(mocks.db.education.update).not.toHaveBeenCalled();
    });

    it("should reject updating another student's education", async () => {
      mocks.db.education.findUnique.mockResolvedValue({
        id: "education-1",
        studentId: "student-2",
      });

      const response = await request(app)
        .patch("/api/education/education-1")
        .send({
          cgpa: 9,
        });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe(
        "You are not authorized to update this education record",
      );

      expect(mocks.db.education.update).not.toHaveBeenCalled();
    });
  });

  describe("Authentication and authorization", () => {
    it("should allow a STUDENT to access education routes", async () => {
      mocks.db.education.findMany.mockResolvedValue([]);

      const response = await request(app).get("/api/education/my");

      expect(response.status).toBe(200);
    });
  });
});
