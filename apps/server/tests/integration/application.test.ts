
import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "../../src/index";
import { db, auth } from "../../src/services";

describe("Applications Module - Integration", () => {
  let companyId = "";
  let jobId = "";
  let studentUserId = "";
  let studentProfileId = "";
  let recruiterUserId = "";
  let recruiterProfileId = "";
  let applicationId = "";

  let studentToken = "";
  let recruiterToken = "";

  const studentEmail = `student-${randomUUID()}@test.com`;
  const recruiterEmail = `recruiter-${randomUUID()}@test.com`;

  const studentPassword = "TestPassword123!";
  const recruiterPassword = "TestPassword123!";

  beforeAll(async () => {
    const studentSignup = await auth.api.signUpEmail({
      body: {
        name: "Integration Test Student",
        email: studentEmail,
        password: studentPassword,
      },
    });

    if (!studentSignup.user) {
      throw new Error("Failed to create test student");
    }

    studentUserId = studentSignup.user.id;

    await db.user.update({
      where: {
        id: studentUserId,
      },
      data: {
        emailVerified: true,
        role: "STUDENT",
      },
    });

    const studentProfile = await db.studentProfile.create({
      data: {
        id: randomUUID(),
        userId: studentUserId,
        college: "Integration Test College",
        degree: "B.Tech",
        branch: "Computer Science",
        graduationYear: 2027,
      },
    });

    studentProfileId = studentProfile.id;

    const recruiterSignup = await auth.api.signUpEmail({
      body: {
        name: "Integration Test Recruiter",
        email: recruiterEmail,
        password: recruiterPassword,
      },
    });

    if (!recruiterSignup.user) {
      throw new Error("Failed to create test recruiter");
    }

    recruiterUserId = recruiterSignup.user.id;

    await db.user.update({
      where: {
        id: recruiterUserId,
      },
      data: {
        emailVerified: true,
        role: "RECRUITER",
      },
    });

    const company = await db.company.create({
      data: {
        id: randomUUID(),
        name: "Integration Test Company",
        description: "Company used for integration tests",
        website: "https://example.com",
      },
    });

    companyId = company.id;

    const recruiterProfile = await db.recruiterProfile.create({
      data: {
        id: randomUUID(),
        userId: recruiterUserId,
        companyId,
      },
    });

    recruiterProfileId = recruiterProfile.id;

    const job = await db.job.create({
      data: {
        id: randomUUID(),
        title: "Integration Test Software Engineer",
        description: "Software engineering position for integration testing",
        companyId,
      },
    });

    jobId = job.id;

    const studentSignIn = await auth.api.signInEmail({
      body: {
        email: studentEmail,
        password: studentPassword,
      },
    });

    if (!studentSignIn.token) {
      throw new Error("Failed to create student session");
    }

    studentToken = studentSignIn.token;

    const recruiterSignIn = await auth.api.signInEmail({
      body: {
        email: recruiterEmail,
        password: recruiterPassword,
      },
    });

    if (!recruiterSignIn.token) {
      throw new Error("Failed to create recruiter session");
    }

    recruiterToken = recruiterSignIn.token;
  });

  afterAll(async () => {
    if (applicationId) {
      await db.application.deleteMany({
        where: {
          id: applicationId,
        },
      });
    }

    if (jobId) {
      await db.job.deleteMany({
        where: {
          id: jobId,
        },
      });
    }

    if (recruiterProfileId) {
      await db.recruiterProfile.deleteMany({
        where: {
          id: recruiterProfileId,
        },
      });
    }

    if (studentProfileId) {
      await db.studentProfile.deleteMany({
        where: {
          id: studentProfileId,
        },
      });
    }

    if (companyId) {
      await db.company.deleteMany({
        where: {
          id: companyId,
        },
      });
    }

    if (recruiterUserId) {
      await db.user.deleteMany({
        where: {
          id: recruiterUserId,
        },
      });
    }

    if (studentUserId) {
      await db.user.deleteMany({
        where: {
          id: studentUserId,
        },
      });
    }

    await db.$disconnect();
  });

  describe("POST /api/applications", () => {
    it("should allow a student to submit an application", async () => {
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          jobId,
          coverLetter: "I am interested in this position.",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.jobId).toBe(jobId);
      expect(response.body.data.status).toBe("APPLIED");

      applicationId = response.body.data.id;
    });

    it("should reject invalid application data", async () => {
      const response = await request(app)
        .post("/api/applications")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          coverLetter: "Missing job ID",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/applications/my", () => {
    it("should return the student's applications", async () => {
      const response = await request(app)
        .get("/api/applications/my")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/applications/:id", () => {
    it("should return an application by ID", async () => {
      const response = await request(app)
        .get(`/api/applications/${applicationId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(applicationId);
    });

    it("should return 404 for a non-existent application", async () => {
      const response = await request(app)
        .get(`/api/applications/${randomUUID()}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PATCH /api/applications/:id/status", () => {
    it("should allow a recruiter to update application status", async () => {
      const response = await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send({
          status: "SHORTLISTED",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("SHORTLISTED");
    });

    it("should reject an invalid application status", async () => {
      const response = await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set("Authorization", `Bearer ${recruiterToken}`)
        .send({
          status: "INVALID_STATUS",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

