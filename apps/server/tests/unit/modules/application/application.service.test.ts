import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    studentProfile: {
      findUnique: vi.fn(),
    },
    job: {
      findUnique: vi.fn(),
    },
    application: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
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
}));

vi.mock("../../../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

import {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../../../../src/modules/applications/application.service";

describe("application.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);
  });

  describe("createApplication", () => {
    it("should create an application successfully", async () => {
      const student = {
        id: "student-123",
        userId: "user-123",
      };

      const job = {
        id: "job-123",
        companyId: "company-123",
      };

      const application = {
        id: "application-123",
        studentId: student.id,
        userId: "user-123",
        jobId: job.id,
        status: "APPLIED",
        job: {
          ...job,
          company: {
            id: "company-123",
            name: "CampusLink",
          },
        },
      };

      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.db.job.findUnique.mockResolvedValue(job);
      mocks.db.application.findUnique.mockResolvedValue(null);
      mocks.db.application.create.mockResolvedValue(application);

      const result = await createApplication("user-123", {
        jobId: "job-123",
        coverLetter: "I am interested in this position.",
        resumeId: "resume-123",
      });

      expect(result).toEqual(application);

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
        },
      });

      expect(mocks.db.job.findUnique).toHaveBeenCalledWith({
        where: {
          id: "job-123",
        },
      });

      expect(mocks.db.application.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            studentId: "student-123",
            userId: "user-123",
            jobId: "job-123",
            status: "APPLIED",
          },
        }),
      );

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "applications:user:user-123",
        "applications:student:student-123",
        "application:job:job-123",
        "admin:applications",
        "admin:dashboard:stats",
      );
    });

    it("should throw when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        createApplication("user-123", {
          jobId: "job-123",
        }),
      ).rejects.toThrow("Student profile not found");

      expect(mocks.db.job.findUnique).not.toHaveBeenCalled();
      expect(mocks.db.application.create).not.toHaveBeenCalled();
    });

    it("should throw when job does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-123",
        userId: "user-123",
      });

      mocks.db.job.findUnique.mockResolvedValue(null);

      await expect(
        createApplication("user-123", {
          jobId: "job-123",
        }),
      ).rejects.toThrow("Job not found");

      expect(mocks.db.application.create).not.toHaveBeenCalled();
    });

    it("should throw when student has already applied", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-123",
        userId: "user-123",
      });

      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-123",
        companyId: "company-123",
      });

      mocks.db.application.findUnique.mockResolvedValue({
        id: "existing-application",
      });

      await expect(
        createApplication("user-123", {
          jobId: "job-123",
        }),
      ).rejects.toThrow("You have already applied for this job");

      expect(mocks.db.application.create).not.toHaveBeenCalled();
    });
  });

  describe("getMyApplications", () => {
    it("should return cached applications", async () => {
      const cachedApplications = [
        {
          id: "application-123",
          status: "APPLIED",
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(cachedApplications));

      const result = await getMyApplications("user-123");

      expect(result).toEqual(cachedApplications);

      expect(mocks.db.studentProfile.findUnique).not.toHaveBeenCalled();
      expect(mocks.db.application.findMany).not.toHaveBeenCalled();

      expect(mocks.redis.get).toHaveBeenCalledWith(
        "applications:user:user-123",
      );
    });

    it("should fetch applications from database when cache is empty", async () => {
      const student = {
        id: "student-123",
        userId: "user-123",
      };

      const applications = [
        {
          id: "application-123",
          status: "APPLIED",
          studentId: "student-123",
        },
      ];

      mocks.redis.get.mockResolvedValue(null);
      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.db.application.findMany.mockResolvedValue(applications);

      const result = await getMyApplications("user-123");

      expect(result).toEqual(applications);

      expect(mocks.db.application.findMany).toHaveBeenCalledWith({
        where: {
          studentId: "student-123",
        },
        include: {
          job: {
            include: {
              company: true,
            },
          },
          matchResult: true,
        },
        orderBy: {
          appliedAt: "desc",
        },
      });

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "applications:user:user-123",
        JSON.stringify(applications),
        "EX",
        300,
      );
    });

    it("should throw when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(getMyApplications("user-123")).rejects.toThrow(
        "Student profile not found",
      );

      expect(mocks.db.application.findMany).not.toHaveBeenCalled();
    });

    it("should remove invalid cached JSON and fetch from database", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");

      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-123",
        userId: "user-123",
      });

      mocks.db.application.findMany.mockResolvedValue([]);

      const result = await getMyApplications("user-123");

      expect(result).toEqual([]);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "applications:user:user-123",
      );

      expect(mocks.db.application.findMany).toHaveBeenCalled();
    });
  });

  describe("getApplicationById", () => {
    it("should return cached application", async () => {
      const cachedApplication = {
        id: "application-123",
        status: "APPLIED",
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(cachedApplication));

      const result = await getApplicationById("application-123");

      expect(result).toEqual(cachedApplication);

      expect(mocks.db.application.findUnique).not.toHaveBeenCalled();

      expect(mocks.redis.get).toHaveBeenCalledWith(
        "application:application-123",
      );
    });

    it("should fetch application from database when cache is empty", async () => {
      const application = {
        id: "application-123",
        status: "APPLIED",
        job: {
          id: "job-123",
          company: {
            id: "company-123",
          },
        },
      };

      mocks.redis.get.mockResolvedValue(null);
      mocks.db.application.findUnique.mockResolvedValue(application);

      const result = await getApplicationById("application-123");

      expect(result).toEqual(application);

      expect(mocks.db.application.findUnique).toHaveBeenCalledWith({
        where: {
          id: "application-123",
        },
        include: {
          job: {
            include: {
              company: true,
            },
          },
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          matchResult: true,
        },
      });

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "application:application-123",
        JSON.stringify(application),
        "EX",
        300,
      );
    });

    it("should return null when application does not exist", async () => {
      mocks.redis.get.mockResolvedValue(null);
      mocks.db.application.findUnique.mockResolvedValue(null);

      const result = await getApplicationById("application-123");

      expect(result).toBeNull();

      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should delete invalid cached JSON", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");
      mocks.db.application.findUnique.mockResolvedValue(null);

      const result = await getApplicationById("application-123");

      expect(result).toBeNull();

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "application:application-123",
      );
    });
  });

  describe("updateApplicationStatus", () => {
    it("should update application status successfully", async () => {
      const application = {
        id: "application-123",
        userId: "student-user-123",
        studentId: "student-123",
        jobId: "job-123",
        job: {
          id: "job-123",
          companyId: "company-123",
        },
      };

      const recruiter = {
        id: "recruiter-123",
        userId: "recruiter-user-123",
        companyId: "company-123",
      };

      const updatedApplication = {
        ...application,
        status: "SHORTLISTED",
      };

      mocks.db.application.findUnique.mockResolvedValue(application);
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.application.update.mockResolvedValue(updatedApplication);

      const result = await updateApplicationStatus(
        "recruiter-user-123",
        "application-123",
        {
          status: "SHORTLISTED",
        },
      );

      expect(result).toEqual(updatedApplication);

      expect(mocks.db.application.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: "application-123",
          },
          data: {
            status: "SHORTLISTED",
          },
        }),
      );

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "application:application-123",
        "applications:user:student-user-123",
        "applications:student:student-123",
        "application:job:job-123",
        "admin:applications",
        "admin:dashboard:stats",
      );
    });

    it("should throw when application does not exist", async () => {
      mocks.db.application.findUnique.mockResolvedValue(null);

      await expect(
        updateApplicationStatus("recruiter-user-123", "application-123", {
          status: "SHORTLISTED",
        }),
      ).rejects.toThrow("Application not found");

      expect(mocks.db.recruiterProfile.findUnique).not.toHaveBeenCalled();

      expect(mocks.db.application.update).not.toHaveBeenCalled();
    });

    it("should throw when recruiter profile does not exist", async () => {
      mocks.db.application.findUnique.mockResolvedValue({
        id: "application-123",
        job: {
          companyId: "company-123",
        },
      });

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      await expect(
        updateApplicationStatus("recruiter-user-123", "application-123", {
          status: "SHORTLISTED",
        }),
      ).rejects.toThrow("Recruiter profile not found");

      expect(mocks.db.application.update).not.toHaveBeenCalled();
    });

    it("should reject recruiter from another company", async () => {
      mocks.db.application.findUnique.mockResolvedValue({
        id: "application-123",
        job: {
          companyId: "company-123",
        },
      });

      mocks.db.recruiterProfile.findUnique.mockResolvedValue({
        id: "recruiter-123",
        userId: "recruiter-user-123",
        companyId: "different-company",
      });

      await expect(
        updateApplicationStatus("recruiter-user-123", "application-123", {
          status: "SHORTLISTED",
        }),
      ).rejects.toThrow("You are not authorized to update this application");

      expect(mocks.db.application.update).not.toHaveBeenCalled();
      expect(mocks.redis.del).not.toHaveBeenCalled();
    });
  });
});
