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
  matchStudentWithJob: vi.fn(),
  analyzeStudentSkillGap: vi.fn(),
}));

vi.mock("../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

vi.mock("../../src/modules/jobs/job-ai.service", () => ({
  matchStudentWithJob: mocks.matchStudentWithJob,
  analyzeStudentSkillGap: mocks.analyzeStudentSkillGap,
}));

vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: async (req: any, _res: any, next: any) => {
    req.user = {
      id: "user-1",
      email: "recruiter@example.com",
      name: "Test Recruiter",
      role: req.headers["x-test-role"] || "RECRUITER",
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
      ctc: "₹8 - ₹12 LPA",
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
      ctc: "₹14 - ₹18 LPA",
      company: {
        id: "company-1",
        name: "Google",
      },
    });

    mocks.db.job.delete.mockResolvedValue({
      id: "job-1",
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

  describe("Student job analysis routes", () => {
    it("returns the single-job match result", async () => {
      mocks.matchStudentWithJob.mockResolvedValue({ score: 88 });
      const response = await request(app)
        .post("/api/jobs/job-1/match")
        .set("x-test-role", "STUDENT");
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({ score: 88 });
      expect(mocks.matchStudentWithJob).toHaveBeenCalledWith("user-1", "job-1");
    });

    it("returns the skill-gap result", async () => {
      mocks.analyzeStudentSkillGap.mockResolvedValue({
        missingSkills: ["TypeScript"],
      });
      const response = await request(app)
        .post("/api/jobs/job-1/skill-gap")
        .set("x-test-role", "STUDENT");
      expect(response.status).toBe(200);
      expect(response.body.data.missingSkills).toEqual(["TypeScript"]);
    });
  });
});
