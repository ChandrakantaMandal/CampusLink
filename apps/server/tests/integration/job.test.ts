

import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

const mocks = vi.hoisted(() => ({
  db: {
    job: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

vi.mock("../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: async (req: any, _res: any, next: any) => {
    req.user = {
      id: "user-1",
      email: "recruiter@example.com",
      name: "Test Recruiter",
      role: "RECRUITER",
    };

    req.session = {
      id: "session-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 3600000),
    };

    next();
  },
}));

import jobRouter from "../../src/modules/jobs/job.routes";

const app = express();

app.use(express.json());
app.use("/api/jobs", jobRouter);

app.use((error: Error, _req: any, res: any, _next: any) => {
  return res.status(500).json({
    success: false,
    message: error.message,
  });
});

describe("Job Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);

    mocks.db.recruiterProfile.findUnique.mockResolvedValue({
      id: "recruiter-profile-1",
      userId: "user-1",
      companyId: "company-1",
    });

    mocks.db.job.findUnique.mockResolvedValue(null);

    mocks.db.job.findMany.mockResolvedValue([]);

    mocks.db.job.create.mockResolvedValue({
      id: "job-1",
      companyId: "company-1",
      recruiterId: "recruiter-profile-1",
      title: "Software Engineer",
      description: "Build scalable web applications",
      location: "Bangalore",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      salaryMin: 600000,
      salaryMax: 1200000,
      applicationDeadline: new Date("2026-12-31T23:59:59.000Z"),
      company: {
        id: "company-1",
        name: "Google",
      },
    });

    mocks.db.job.update.mockResolvedValue({
      id: "job-1",
      companyId: "company-1",
      recruiterId: "recruiter-profile-1",
      title: "Senior Software Engineer",
      description: "Build scalable web applications",
      location: "Bangalore",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      salaryMin: 800000,
      salaryMax: 1500000,
      company: {
        id: "company-1",
        name: "Google",
      },
    });

    mocks.db.job.delete.mockResolvedValue({
      id: "job-1",
    });
  });

  describe("POST /api/jobs", () => {
    it("should create a job", async () => {
      const response = await request(app).post("/api/jobs").send({
        title: "Software Engineer",
        description: "Build scalable web applications",
        location: "Bangalore",
        employmentType: "FULL_TIME",
        workMode: "HYBRID",
        salaryMin: 600000,
        salaryMax: 1200000,
        applicationDeadline: "2026-12-31T23:59:59.000Z",
        companyId: "company-1",
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        message: "Job created successfully",
        data: {
          id: "job-1",
          companyId: "company-1",
          recruiterId: "recruiter-profile-1",
          title: "Software Engineer",
          description: "Build scalable web applications",
          location: "Bangalore",
          employmentType: "FULL_TIME",
          workMode: "HYBRID",
          salaryMin: 600000,
          salaryMax: 1200000,
          applicationDeadline: "2026-12-31T23:59:59.000Z",
          company: {
            id: "company-1",
            name: "Google",
          },
        },
      });

      expect(mocks.db.recruiterProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.job.create).toHaveBeenCalledWith({
        data: {
          title: "Software Engineer",
          description: "Build scalable web applications",
          location: "Bangalore",
          employmentType: "FULL_TIME",
          workMode: "HYBRID",
          salaryMin: 600000,
          salaryMax: 1200000,
          applicationDeadline: new Date("2026-12-31T23:59:59.000Z"),
          companyId: "company-1",
        },
        include: {
          company: true,
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "jobs:all",
        "jobs:company:company-1",
        "company:company-1",
        "admin:jobs",
        "admin:dashboard:stats",
      );
    });

    it("should reject invalid job data", async () => {
      const response = await request(app).post("/api/jobs").send({
        title: "A",
        description: "Short",
        companyId: "company-1",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid job data");

      expect(mocks.db.job.create).not.toHaveBeenCalled();
    });

    it("should reject missing company ID", async () => {
      const response = await request(app).post("/api/jobs").send({
        title: "Software Engineer",
        description: "Build scalable web applications",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid job data");

      expect(mocks.db.job.create).not.toHaveBeenCalled();
    });

    it("should reject recruiter without a recruiter profile", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const response = await request(app).post("/api/jobs").send({
        title: "Software Engineer",
        description: "Build scalable web applications",
        companyId: "company-1",
      });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe("Recruiter profile not found");

      expect(mocks.db.job.create).not.toHaveBeenCalled();
    });

    it("should reject recruiter creating a job for another company", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue({
        id: "recruiter-profile-1",
        userId: "user-1",
        companyId: "company-2",
      });

      const response = await request(app).post("/api/jobs").send({
        title: "Software Engineer",
        description: "Build scalable web applications",
        companyId: "company-1",
      });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe(
        "You are not authorized to create a job for this company",
      );

      expect(mocks.db.job.create).not.toHaveBeenCalled();
    });
  });

  // ====================================================
  // GET /api/jobs
  // ====================================================

  describe("GET /api/jobs", () => {
    it("should return all jobs", async () => {
      const jobs = [
        {
          id: "job-1",
          title: "Software Engineer",
          companyId: "company-1",
        },
        {
          id: "job-2",
          title: "Frontend Developer",
          companyId: "company-2",
        },
      ];

      mocks.db.job.findMany.mockResolvedValue(jobs);

      const response = await request(app).get("/api/jobs");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: jobs,
      });

      expect(mocks.db.job.findMany).toHaveBeenCalledWith({
        include: {
          company: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(mocks.redis.set).toHaveBeenCalled();
    });

    it("should return cached jobs", async () => {
      const jobs = [
        {
          id: "job-1",
          title: "Software Engineer",
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(jobs));

      const response = await request(app).get("/api/jobs");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: jobs,
      });

      expect(mocks.db.job.findMany).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/jobs/:id", () => {
    it("should return a job by ID", async () => {
      const job = {
        id: "job-1",
        companyId: "company-1",
        recruiterId: "recruiter-profile-1",
        title: "Software Engineer",
        description: "Build scalable web applications",
        company: {
          id: "company-1",
          name: "Google",
        },
        skills: [],
      };

      mocks.db.job.findUnique.mockResolvedValue(job);

      const response = await request(app).get("/api/jobs/job-1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: job,
      });

      expect(mocks.db.job.findUnique).toHaveBeenCalledWith({
        where: {
          id: "job-1",
        },
        include: {
          company: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });

      expect(mocks.redis.set).toHaveBeenCalled();
    });

    it("should return cached job", async () => {
      const job = {
        id: "job-1",
        title: "Software Engineer",
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(job));

      const response = await request(app).get("/api/jobs/job-1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: job,
      });

      expect(mocks.db.job.findUnique).not.toHaveBeenCalled();
    });

    it("should return 404 when job does not exist", async () => {
      mocks.db.job.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/api/jobs/job-999");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Job not found",
      });
    });

    it("should handle the jobs collection route", async () => {
      const response = await request(app).get("/api/jobs/");

      expect(response.status).toBe(200);
    });
  });

  describe("PATCH /api/jobs/:id", () => {
    beforeEach(() => {
      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-1",
        companyId: "company-1",
        recruiterId: "recruiter-profile-1",
        title: "Software Engineer",
        description: "Build scalable web applications",
      });
    });

    it("should update a job", async () => {
      const response = await request(app).patch("/api/jobs/job-1").send({
        title: "Senior Software Engineer",
        workMode: "REMOTE",
        salaryMin: 800000,
        salaryMax: 1500000,
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Job updated successfully",
        data: {
          id: "job-1",
          companyId: "company-1",
          recruiterId: "recruiter-profile-1",
          title: "Senior Software Engineer",
          description: "Build scalable web applications",
          location: "Bangalore",
          employmentType: "FULL_TIME",
          workMode: "REMOTE",
          salaryMin: 800000,
          salaryMax: 1500000,
          company: {
            id: "company-1",
            name: "Google",
          },
        },
      });

      expect(mocks.db.recruiterProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.job.update).toHaveBeenCalledWith({
        where: {
          id: "job-1",
        },
        data: {
          title: "Senior Software Engineer",
          workMode: "REMOTE",
          salaryMin: 800000,
          salaryMax: 1500000,
          applicationDeadline: undefined,
        },
        include: {
          company: true,
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "jobs:all",
        "job:job-1",
        "jobs:company:company-1",
        "company:company-1",
        "admin:jobs",
        "admin:dashboard:stats",
      );
    });

    it("should reject invalid update data", async () => {
      const response = await request(app).patch("/api/jobs/job-1").send({
        title: "A",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid job data");

      expect(mocks.db.job.update).not.toHaveBeenCalled();
    });

    it("should return error when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const response = await request(app).patch("/api/jobs/job-1").send({
        title: "Senior Software Engineer",
      });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe("Recruiter profile not found");

      expect(mocks.db.job.update).not.toHaveBeenCalled();
    });

    it("should return error when job does not exist", async () => {
      mocks.db.job.findUnique.mockResolvedValue(null);

      const response = await request(app).patch("/api/jobs/job-999").send({
        title: "Senior Software Engineer",
      });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe("Job not found");

      expect(mocks.db.job.update).not.toHaveBeenCalled();
    });

    it("should reject recruiter updating another company's job", async () => {
      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-1",
        companyId: "company-2",
        title: "Software Engineer",
        description: "Build scalable web applications",
      });

      const response = await request(app).patch("/api/jobs/job-1").send({
        title: "Senior Software Engineer",
      });

      expect(response.status).toBe(500);

      expect(response.body.message).toBe(
        "You are not authorized to update this job",
      );

      expect(mocks.db.job.update).not.toHaveBeenCalled();
    });

    it("should convert applicationDeadline to Date", async () => {
      const deadline = "2026-12-31T23:59:59.000Z";

      await request(app).patch("/api/jobs/job-1").send({
        applicationDeadline: deadline,
      });

      expect(mocks.db.job.update).toHaveBeenCalledWith({
        where: {
          id: "job-1",
        },
        data: {
          applicationDeadline: new Date(deadline),
        },
        include: {
          company: true,
        },
      });
    });
  });

  describe("DELETE /api/jobs/:id", () => {
    beforeEach(() => {
      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-1",
        companyId: "company-1",
        recruiterId: "recruiter-profile-1",
        title: "Software Engineer",
        description: "Build scalable web applications",
      });
    });

    it("should delete a job", async () => {
      const response = await request(app).delete("/api/jobs/job-1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Job deleted successfully",
      });

      expect(mocks.db.recruiterProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.job.delete).toHaveBeenCalledWith({
        where: {
          id: "job-1",
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "jobs:all",
        "job:job-1",
        "jobs:company:company-1",
        "company:company-1",
        "admin:jobs",
        "admin:dashboard:stats",
      );
    });

    it("should return error when job does not exist", async () => {
      mocks.db.job.findUnique.mockResolvedValue(null);

      const response = await request(app).delete("/api/jobs/job-999");

      expect(response.status).toBe(500);

      expect(response.body.message).toBe("Job not found");

      expect(mocks.db.job.delete).not.toHaveBeenCalled();
    });

    it("should reject recruiter deleting another company's job", async () => {
      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-1",
        companyId: "company-2",
        title: "Software Engineer",
        description: "Build scalable web applications",
      });

      const response = await request(app).delete("/api/jobs/job-1");

      expect(response.status).toBe(500);

      expect(response.body.message).toBe(
        "You are not authorized to delete this job",
      );

      expect(mocks.db.job.delete).not.toHaveBeenCalled();
    });
  });

  describe("Authentication and authorization", () => {
    beforeEach(() => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue({
        id: "recruiter-profile-1",
        userId: "user-1",
        companyId: "company-1",
      });

      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-1",
        companyId: "company-1",
        recruiterId: "recruiter-profile-1",
        title: "Software Engineer",
        description: "Build scalable web applications",
      });
    });

    it("should allow recruiter to create a job", async () => {
      const response = await request(app).post("/api/jobs").send({
        title: "Backend Engineer",
        description: "Build backend services",
        companyId: "company-1",
      });

      expect(response.status).toBe(201);
    });

    it("should allow recruiter to update their job", async () => {
      const response = await request(app).patch("/api/jobs/job-1").send({
        title: "Updated Backend Engineer",
      });

      expect(response.status).toBe(200);
    });

    it("should allow recruiter to delete their job", async () => {
      const response = await request(app).delete("/api/jobs/job-1");

      expect(response.status).toBe(200);
    });
  });
});



