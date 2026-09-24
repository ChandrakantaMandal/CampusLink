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

  describe("PATCH /api/admin/users/:id/role", () => {
    it("should update a user's role", async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${studentUser.id}/role`)
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          role: "RECRUITER",
        });

      expect(response.status).toBe(200);
    });

    it("should reject an invalid role", async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${studentUser.id}/role`)
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          role: "INVALID_ROLE",
        });

      expect(response.status).toBe(400);
    });

    it("should return 400 when the user ID is invalid", async () => {
      const response = await request(app)
        .patch("/api/admin/users/invalid-id/role")
        .set("Authorization", `Bearer ${adminSessionToken}`)
        .send({
          role: "STUDENT",
        });

      expect(response.status).toBe(400);
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
});
