import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getStudentByUserId: vi.fn(),
  getStudentById: vi.fn(),
  updateStudent: vi.fn(),
  userRole: "STUDENT",
}));

vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction,
  ) => {
    (req as any).user = {
      id: "user-1",
      role: mocks.userRole,
    };

    next();
  },
}));

vi.mock("../../src/middleware/role.middleware", () => ({
  requireRole:
    (...roles: string[]) =>
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const user = (req as any).user;

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      next();
    },
}));

vi.mock("../../src/modules/students/student.service", () => ({
  getStudentByUserId: mocks.getStudentByUserId,
  getStudentById: mocks.getStudentById,
  updateStudent: mocks.updateStudent,
}));

import studentRouter from "../../src/modules/students/student.routes";

function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/students", studentRouter);

  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    },
  );

  return app;
}

describe("Student API Integration", () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.userRole = "STUDENT";
  });

  describe("GET /students/me", () => {
    it("should return the authenticated student's profile", async () => {
      const student = {
        id: "student-1",
        userId: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        college: "ABC College",
        department: "Computer Science",
        cgpa: 8.5,
      };

      mocks.getStudentByUserId.mockResolvedValue(student);

      const response = await request(app).get("/students/me");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: student,
      });

      expect(mocks.getStudentByUserId).toHaveBeenCalledWith("user-1");
    });

    it("should return 404 when student profile does not exist", async () => {
      mocks.getStudentByUserId.mockResolvedValue(null);

      const response = await request(app).get("/students/me");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Student profile not found",
      });
    });

    it("should return 500 when service throws an error", async () => {
      mocks.getStudentByUserId.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/students/me");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Database error",
      });
    });
  });

  describe("PATCH /students/me", () => {
    it("should update the authenticated student's profile", async () => {
      const updateData = {
        firstName: "John",
        lastName: "Doe",
        phone: "9876543210",
        college: "ABC College",
        department: "Computer Science",
        graduationYear: 2026,
        cgpa: 8.8,
        bio: "Full stack developer",
        githubUrl: "https://github.com/johndoe",
        linkedinUrl: "https://linkedin.com/in/johndoe",
        portfolioUrl: "https://johndoe.dev",
      };

      const updatedStudent = {
        id: "student-1",
        userId: "user-1",
        ...updateData,
      };

      mocks.updateStudent.mockResolvedValue(updatedStudent);

      const response = await request(app)
        .patch("/students/me")
        .send(updateData);

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Student profile updated successfully",
        data: updatedStudent,
      });

      expect(mocks.updateStudent).toHaveBeenCalledWith("user-1", updateData);
    });

    it("should accept partial updates", async () => {
      const updateData = {
        firstName: "John",
        cgpa: 9,
      };

      const updatedStudent = {
        id: "student-1",
        userId: "user-1",
        ...updateData,
      };

      mocks.updateStudent.mockResolvedValue(updatedStudent);

      const response = await request(app)
        .patch("/students/me")
        .send(updateData);

      expect(response.status).toBe(200);

      expect(mocks.updateStudent).toHaveBeenCalledWith("user-1", updateData);
    });

    it("should return 400 for invalid student data", async () => {
      const response = await request(app).patch("/students/me").send({
        firstName: "",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid student data");

      expect(mocks.updateStudent).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid graduation year", async () => {
      const response = await request(app).patch("/students/me").send({
        graduationYear: 1999,
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(mocks.updateStudent).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid cgpa", async () => {
      const response = await request(app).patch("/students/me").send({
        cgpa: 11,
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(mocks.updateStudent).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid URL", async () => {
      const response = await request(app).patch("/students/me").send({
        githubUrl: "invalid-url",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(mocks.updateStudent).not.toHaveBeenCalled();
    });

    it("should return 500 when update service throws an error", async () => {
      mocks.updateStudent.mockRejectedValue(new Error("Database error"));

      const response = await request(app).patch("/students/me").send({
        firstName: "John",
      });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Database error",
      });
    });
  });

  describe("GET /students/:id", () => {
    beforeEach(() => {
      mocks.userRole = "RECRUITER";
    });

    it("should return a student by ID", async () => {
      const student = {
        id: "student-1",
        userId: "user-1",
        firstName: "John",
        lastName: "Doe",
        college: "ABC College",
        department: "Computer Science",
        cgpa: 8.5,
      };

      mocks.getStudentById.mockResolvedValue(student);

      const response = await request(app).get("/students/student-1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: student,
      });

      expect(mocks.getStudentById).toHaveBeenCalledWith("student-1");
    });

    it("should return 404 when student is not found", async () => {
      mocks.getStudentById.mockResolvedValue(null);

      const response = await request(app).get("/students/student-1");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Student not found",
      });
    });

    it("should return 500 when service throws an error", async () => {
      mocks.getStudentById.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/students/student-1");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Database error",
      });
    });

    it("should reject missing student ID", async () => {
      const response = await request(app).get("/students/");

      expect(response.status).toBe(404);

      expect(mocks.getStudentById).not.toHaveBeenCalled();
    });
  });

  describe("Student authorization", () => {
    it("should allow STUDENT to access /students/me", async () => {
      mocks.userRole = "STUDENT";

      mocks.getStudentByUserId.mockResolvedValue({
        id: "student-1",
        userId: "user-1",
      });

      const response = await request(app).get("/students/me");

      expect(response.status).toBe(200);
    });

    it("should allow STUDENT to update /students/me", async () => {
      mocks.userRole = "STUDENT";

      mocks.updateStudent.mockResolvedValue({
        id: "student-1",
        userId: "user-1",
        firstName: "John",
      });

      const response = await request(app).patch("/students/me").send({
        firstName: "John",
      });

      expect(response.status).toBe(200);
    });
  });
});