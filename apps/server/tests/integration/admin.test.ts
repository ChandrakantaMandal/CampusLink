import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import app from "../../src/index";
import { auth, db } from "../../src/services";

vi.mock("@CampusLink/redis", () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
    del: vi.fn().mockResolvedValue(1),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
  },
}));

describe("Admin API Integration Tests", () => {
  let adminUser: {
    id: string;
    email: string;
  };

  let studentUser: {
    id: string;
    email: string;
  };

  let adminSessionToken: string;
  let studentSessionToken: string;

  beforeAll(async () => {
    const adminEmail = `admin-test-${Date.now()}@example.com`;
    const adminPassword = "TestPassword123!";

    const adminSignup = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin Test",
      },
    });

    if (!adminSignup.user) {
      throw new Error("Failed to create admin user");
    }

    adminUser = {
      id: adminSignup.user.id,
      email: adminSignup.user.email,
    };

    await db.user.update({
      where: {
        id: adminUser.id,
      },
      data: {
        emailVerified: true,
        role: "ADMIN",
      },
    });

    const adminSession = await auth.api.signInEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
      },
    });

    if (!adminSession.token) {
      throw new Error("Failed to create admin session");
    }

    adminSessionToken = adminSession.token;

    const studentEmail = `student-test-${Date.now()}@example.com`;

    const studentSignup = await auth.api.signUpEmail({
      body: {
        email: studentEmail,
        password: adminPassword,
        name: "Student Test",
      },
    });

    if (!studentSignup.user) {
      throw new Error("Failed to create student user");
    }

    studentUser = {
      id: studentSignup.user.id,
      email: studentSignup.user.email,
    };

    await db.user.update({
      where: {
        id: studentUser.id,
      },
      data: {
        emailVerified: true,
      },
    });

    const studentSession = await auth.api.signInEmail({
      body: {
        email: studentEmail,
        password: adminPassword,
      },
    });

    if (!studentSession.token) {
      throw new Error("Failed to create student session");
    }

    studentSessionToken = studentSession.token;
  }, 30_000);

  afterAll(async () => {
    if (adminUser?.id) {
      await db.user.deleteMany({
        where: {
          id: adminUser.id,
        },
      });
    }

    if (studentUser?.id) {
      await db.user.deleteMany({
        where: {
          id: studentUser.id,
        },
      });
    }

    await db.$disconnect();
  });

  describe("Authentication and authorization", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/admin/dashboard");

      expect(response.status).toBe(401);
    });

    it("should reject authenticated non-admin users", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${studentSessionToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/admin/dashboard", () => {
    it("should return dashboard statistics for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/users", () => {
    it("should return all users for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/users/:id", () => {
    it("should return a user by ID", async () => {
      const response = await request(app)
        .get(`/api/admin/users/${studentUser.id}`)
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it("should return 404 for a non-existent user", async () => {
      const response = await request(app)
        .get("/api/admin/users/non-existent-user-id")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect([400, 404]).toContain(response.status);
    });
  });


  describe("DELETE /api/admin/users/:id", () => {
    it("should delete a user", async () => {
      const email = `delete-test-${Date.now()}@example.com`;

      const created = await auth.api.signUpEmail({
        body: {
          email,
          password: "TestPassword123!",
          name: "Delete Test User",
        },
      });

      if (!created.user) {
        throw new Error("Failed to create delete test user");
      }

      const response = await request(app)
        .delete(`/api/admin/users/${created.user.id}`)
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
    }, 15_000);

    it("should return 500 when deleting a non-existent user", async () => {
      const response = await request(app)
        .delete("/api/admin/users/non-existent-user-id")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe("GET /api/admin/students", () => {
    it("should return students for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/students")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/recruiters", () => {
    it("should return recruiters for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/recruiters")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/companies", () => {
    it("should return companies for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/companies")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/jobs", () => {
    it("should return jobs for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/jobs")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/applications", () => {
    it("should return applications for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/applications")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/assessments/stats", () => {
    it("should return assessment statistics for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/assessments/stats")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /api/admin/offers", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/admin/offers");

      expect(response.status).toBe(401);
    });

    it("should reject non-admin users", async () => {
      const response = await request(app)
        .get("/api/admin/offers")
        .set("Authorization", `Bearer ${studentSessionToken}`);

      expect(response.status).toBe(403);
    });

    it("should return all offers for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/offers")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should include seeded offer with student, company and job data", async () => {
      const user = await db.user.create({
        data: {
          id: `offer-student-${Date.now()}`,
          email: `offer-student-${Date.now()}@example.com`,
          name: "Offer Test Student",
          emailVerified: true,
          role: "STUDENT",
        },
      });

      const studentProfile = await db.studentProfile.create({
        data: {
          userId: user.id,
          rollNo: `ROLL-${Date.now()}`,
          firstName: "Offer",
          lastName: "Test",
          branch: "CSE",
        },
      });

      const company = await db.company.create({
        data: {
          name: `Offer Test Co ${Date.now()}`,
        },
      });

      const offer = await db.offer.create({
        data: {
          studentId: studentProfile.id,
          companyId: company.id,
          role: "Software Engineer",
          ctc: "7.5",
          offerDate: new Date(),
          status: "SENT",
        },
      });

      try {
        const response = await request(app)
          .get("/api/admin/offers")
          .set("Authorization", `Bearer ${adminSessionToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const created = response.body.data.find(
          (item: { id: string }) => item.id === offer.id,
        );

        expect(created).toBeDefined();
        expect(created.company.id).toBe(company.id);
        expect(created.student.id).toBe(studentProfile.id);
        expect(created.role).toBe("Software Engineer");
      } finally {
        await db.offer.deleteMany({
          where: { id: offer.id },
        });
        await db.company.deleteMany({
          where: { id: company.id },
        });
        await db.studentProfile.deleteMany({
          where: { id: studentProfile.id },
        });
        await db.user.deleteMany({
          where: { id: user.id },
        });
      }
    }, 15_000);
  });

  describe("Placement drives", () => {
    let companyId: string;
    let driveId: string;

    beforeAll(async () => {
      const company = await db.company.create({
        data: {
          name: `Drive Test Co ${Date.now()}`,
        },
      });

      companyId = company.id;
    }, 15_000);

    afterAll(async () => {
      if (companyId) {
        await db.company.deleteMany({
          where: {
            id: companyId,
          },
        });
      }
    });

    it("should reject unauthenticated drive creation", async () => {
      const response = await request(app).post("/api/admin/drives").send({
        companyId,
        title: "Unauth Drive",
        role: "SDE",
        driveDate: new Date().toISOString(),
      });

      expect(response.status).toBe(401);
    });

    it("should reject drive creation by non-admin users", async () => {
      const response = await request(app)
        .post("/api/admin/drives")
        .set("Authorization", `Bearer ${studentSessionToken}`)
        .send({
          companyId,
          title: "Student Drive",
          role: "SDE",
          driveDate: new Date().toISOString(),
        });

      expect(response.status).toBe(403);
    });

    it("should create a placement drive", async () => {
      const response = await request(app)
        .post("/api/admin/drives")
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          companyId,
          title: "Campus Placement Drive",
          role: "Software Engineer",
          driveDate: new Date().toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();

      driveId = response.body.data.id;
    }, 15_000);

    it("should return 400 when creating a drive for an unknown company", async () => {
      const response = await request(app)
        .post("/api/admin/drives")
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          companyId: "00000000-0000-0000-0000-000000000000",
          title: "Orphan Drive",
          role: "SDE",
          driveDate: new Date().toISOString(),
        });

      expect(response.status).toBe(400);
    });

    it("should return 400 when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/admin/drives")
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          companyId,
        });

      expect(response.status).toBe(400);
    });

    it("should return all placement drives for an admin", async () => {
      const response = await request(app)
        .get("/api/admin/drives")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return a placement drive by ID", async () => {
      const response = await request(app)
        .get(`/api/admin/drives/${driveId}`)
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(driveId);
    });

    it("should return 404 for a non-existent drive", async () => {
      const response = await request(app)
        .get("/api/admin/drives/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(404);
    });

    it("should update a placement drive", async () => {
      const response = await request(app)
        .patch(`/api/admin/drives/${driveId}`)
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          title: "Updated Placement Drive",
          status: "ONGOING",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe("Updated Placement Drive");
    });

    it("should reject an invalid tier", async () => {
      const response = await request(app)
        .patch(`/api/admin/drives/${driveId}`)
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          tier: "TIER_9",
        });

      expect(response.status).toBe(400);
    });

    it("should return 400 when updating a non-existent drive", async () => {
      const response = await request(app)
        .patch("/api/admin/drives/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          title: "Ghost Drive",
        });

      expect(response.status).toBe(400);
    });

    it("should delete a placement drive", async () => {
      const response = await request(app)
        .delete(`/api/admin/drives/${driveId}`)
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(200);
    });

    it("should return 500 when deleting a non-existent drive", async () => {
      const response = await request(app)
        .delete("/api/admin/drives/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${adminSessionToken}`);

      expect(response.status).toBe(500);
    });
  });
});
