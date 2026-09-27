import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAssessment: vi.fn(),
  getAssessments: vi.fn(),
  getAssessmentById: vi.fn(),
  updateAssessment: vi.fn(),
  deleteAssessment: vi.fn(),
  createAssessmentResult: vi.fn(),
  getMyAssessmentResults: vi.fn(),
  getAssessmentResults: vi.fn(),
  getAssessmentResultById: vi.fn(),
  updateAssessmentResult: vi.fn(),
  deleteAssessmentResult: vi.fn(),
}));

vi.mock("../../src/modules/assessments/assessment.service.ts", () => ({
  createAssessment: mocks.createAssessment,
  getAssessments: mocks.getAssessments,
  getAssessmentById: mocks.getAssessmentById,
  updateAssessment: mocks.updateAssessment,
  deleteAssessment: mocks.deleteAssessment,
  createAssessmentResult: mocks.createAssessmentResult,
  getMyAssessmentResults: mocks.getMyAssessmentResults,
  getAssessmentResults: mocks.getAssessmentResults,
  getAssessmentResultById: mocks.getAssessmentResultById,
  updateAssessmentResult: mocks.updateAssessmentResult,
  deleteAssessmentResult: mocks.deleteAssessmentResult,
}));

vi.mock("../../src/middleware/auth.middleware.ts", () => ({
  requireAuth: vi.fn((req, _res, next) => {
    req.user = {
      id: "user-1",
      role: "ADMIN",
    };
    next();
  }),
}));

vi.mock("../../src/middleware/role.middleware", () => ({
  requireRole: vi.fn(() => (req: any, _res: any, next: any) => {
    next();
  }),
}));

import assessmentRouter from "../../src/modules/assessments/assessment.routes";

const app = express();

app.use(express.json());
app.use("/assessments", assessmentRouter);

describe("Assessment Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /assessments", () => {
    it("should return all assessments", async () => {
      const assessments = [
        {
          id: "assessment-1",
          title: "JavaScript Assessment",
          type: "TECHNICAL",
          maxScore: 100,
        },
        {
          id: "assessment-2",
          title: "Aptitude Test",
          type: "APTITUDE",
          maxScore: 50,
        },
      ];

      mocks.getAssessments.mockResolvedValue(assessments);

      const response = await request(app).get("/assessments");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: assessments,
      });
      expect(mocks.getAssessments).toHaveBeenCalledTimes(1);
    });

    it("should return 500 when service fails", async () => {
      mocks.getAssessments.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/assessments");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Database error",
      });
    });
  });

  describe("POST /assessments", () => {
    it("should create an assessment", async () => {
      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
        description: "JavaScript fundamentals",
        type: "TECHNICAL",
        maxScore: 100,
      };

      mocks.createAssessment.mockResolvedValue(assessment);

      const response = await request(app).post("/assessments").send({
        title: "JavaScript Assessment",
        description: "JavaScript fundamentals",
        type: "TECHNICAL",
        maxScore: 100,
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: "Assessment created successfully",
        data: assessment,
      });

      expect(mocks.createAssessment).toHaveBeenCalledWith({
        title: "JavaScript Assessment",
        description: "JavaScript fundamentals",
        type: "TECHNICAL",
        maxScore: 100,
      });
    });

    it("should reject invalid assessment data", async () => {
      const response = await request(app).post("/assessments").send({
        title: "A",
        type: "INVALID",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(mocks.createAssessment).not.toHaveBeenCalled();
    });
  });

  describe("GET /assessments/:id", () => {
    it("should return an assessment", async () => {
      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
        type: "TECHNICAL",
        maxScore: 100,
      };

      mocks.getAssessmentById.mockResolvedValue(assessment);

      const response = await request(app).get("/assessments/assessment-1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: assessment,
      });

      expect(mocks.getAssessmentById).toHaveBeenCalledWith("assessment-1");
    });

    it("should return 404 when assessment does not exist", async () => {
      mocks.getAssessmentById.mockResolvedValue(null);

      const response = await request(app).get("/assessments/assessment-1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Assessment not found",
      });
    });
  });

  describe("PATCH /assessments/:id", () => {
    it("should update an assessment", async () => {
      const existing = {
        id: "assessment-1",
        title: "JavaScript Assessment",
        type: "TECHNICAL",
      };

      const updated = {
        id: "assessment-1",
        title: "Advanced JavaScript Assessment",
        type: "TECHNICAL",
        maxScore: 100,
      };

      mocks.getAssessmentById.mockResolvedValue(existing);
      mocks.updateAssessment.mockResolvedValue(updated);

      const response = await request(app)
        .patch("/assessments/assessment-1")
        .send({
          title: "Advanced JavaScript Assessment",
          maxScore: 100,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Assessment updated successfully",
        data: updated,
      });

      expect(mocks.updateAssessment).toHaveBeenCalledWith("assessment-1", {
        title: "Advanced JavaScript Assessment",
        maxScore: 100,
      });
    });

    it("should return 404 when assessment does not exist", async () => {
      mocks.getAssessmentById.mockResolvedValue(null);

      const response = await request(app)
        .patch("/assessments/assessment-1")
        .send({
          title: "Updated Assessment",
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Assessment not found",
      });

      expect(mocks.updateAssessment).not.toHaveBeenCalled();
    });

    it("should reject invalid update data", async () => {
      const response = await request(app)
        .patch("/assessments/assessment-1")
        .send({
          title: "A",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(mocks.updateAssessment).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /assessments/:id", () => {
    it("should delete an assessment", async () => {
      mocks.getAssessmentById.mockResolvedValue({
        id: "assessment-1",
      });

      mocks.deleteAssessment.mockResolvedValue({
        id: "assessment-1",
      });

      const response = await request(app).delete("/assessments/assessment-1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Assessment deleted successfully",
      });

      expect(mocks.deleteAssessment).toHaveBeenCalledWith("assessment-1");
    });

    it("should return 404 when assessment does not exist", async () => {
      mocks.getAssessmentById.mockResolvedValue(null);

      const response = await request(app).delete("/assessments/assessment-1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Assessment not found",
      });

      expect(mocks.deleteAssessment).not.toHaveBeenCalled();
    });
  });

  describe("POST /assessments/:id/results", () => {
    it("should create an assessment result", async () => {
      const result = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        score: 85,
        percentage: 85,
        passed: true,
      };

      mocks.createAssessmentResult.mockResolvedValue(result);

      const response = await request(app)
        .post("/assessments/assessment-1/results")
        .send({
          studentId: "student-1",
          score: 85,
          percentage: 85,
          passed: true,
          feedback: "Good performance",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: "Assessment result created successfully",
        data: result,
      });

      expect(mocks.createAssessmentResult).toHaveBeenCalledWith(
        "assessment-1",
        {
          studentId: "student-1",
          score: 85,
          percentage: 85,
          passed: true,
          feedback: "Good performance",
        },
      );
    });

    it("should reject invalid result data", async () => {
      const response = await request(app)
        .post("/assessments/assessment-1/results")
        .send({
          studentId: "",
          percentage: 120,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(mocks.createAssessmentResult).not.toHaveBeenCalled();
    });

    it("should return 400 when service rejects the result", async () => {
      mocks.createAssessmentResult.mockRejectedValue(
        new Error("Student not found"),
      );

      const response = await request(app)
        .post("/assessments/assessment-1/results")
        .send({
          studentId: "student-1",
          score: 80,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: "Student not found",
      });
    });
  });

  describe("GET /assessments/:id/results", () => {
    it("should return assessment results", async () => {
      const results = [
        {
          id: "result-1",
          assessmentId: "assessment-1",
          studentId: "student-1",
          score: 90,
        },
      ];

      mocks.getAssessmentResults.mockResolvedValue(results);

      const response = await request(app).get(
        "/assessments/assessment-1/results",
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: results,
      });

      expect(mocks.getAssessmentResults).toHaveBeenCalledWith("assessment-1");
    });

    it("should return 500 when service fails", async () => {
      mocks.getAssessmentResults.mockRejectedValue(
        new Error("Assessment not found"),
      );

      const response = await request(app).get(
        "/assessments/assessment-1/results",
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Assessment not found",
      });
    });
  });

  describe("GET /assessments/results/my", () => {
    it("should return current student's assessment results", async () => {
      const results = [
        {
          id: "result-1",
          assessmentId: "assessment-1",
          studentId: "student-1",
          score: 90,
        },
      ];

      mocks.getMyAssessmentResults.mockResolvedValue(results);

      const response = await request(app).get("/assessments/results/my");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: results,
      });

      expect(mocks.getMyAssessmentResults).toHaveBeenCalledWith("user-1");
    });

    it("should return 500 when student results fail", async () => {
      mocks.getMyAssessmentResults.mockRejectedValue(
        new Error("Student profile not found"),
      );

      const response = await request(app).get("/assessments/results/my");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Student profile not found",
      });
    });
  });

  describe("GET /assessments/results/:resultId", () => {
    it("should return an assessment result", async () => {
      const result = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        score: 90,
      };

      mocks.getAssessmentResultById.mockResolvedValue(result);

      const response = await request(app).get("/assessments/results/result-1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: result,
      });

      expect(mocks.getAssessmentResultById).toHaveBeenCalledWith("result-1");
    });

    it("should return 404 when result does not exist", async () => {
      mocks.getAssessmentResultById.mockResolvedValue(null);

      const response = await request(app).get("/assessments/results/result-1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Assessment result not found",
      });
    });
  });

  describe("PATCH /assessments/results/:resultId", () => {
    it("should update an assessment result", async () => {
      const existing = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
      };

      const updated = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        score: 95,
        percentage: 95,
        passed: true,
      };

      mocks.getAssessmentResultById.mockResolvedValue(existing);
      mocks.updateAssessmentResult.mockResolvedValue(updated);

      const response = await request(app)
        .patch("/assessments/results/result-1")
        .send({
          score: 95,
          percentage: 95,
          passed: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Assessment result updated successfully",
        data: updated,
      });

      expect(mocks.updateAssessmentResult).toHaveBeenCalledWith("result-1", {
        score: 95,
        percentage: 95,
        passed: true,
      });
    });

    it("should return 404 when result does not exist", async () => {
      mocks.getAssessmentResultById.mockResolvedValue(null);

      const response = await request(app)
        .patch("/assessments/results/result-1")
        .send({
          score: 95,
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Assessment result not found",
      });

      expect(mocks.updateAssessmentResult).not.toHaveBeenCalled();
    });

    it("should reject invalid result update", async () => {
      const response = await request(app)
        .patch("/assessments/results/result-1")
        .send({
          percentage: 150,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(mocks.updateAssessmentResult).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /assessments/results/:resultId", () => {
    it("should delete an assessment result", async () => {
      mocks.getAssessmentResultById.mockResolvedValue({
        id: "result-1",
      });

      mocks.deleteAssessmentResult.mockResolvedValue({
        id: "result-1",
      });

      const response = await request(app).delete(
        "/assessments/results/result-1",
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Assessment result deleted successfully",
      });

      expect(mocks.deleteAssessmentResult).toHaveBeenCalledWith("result-1");
    });

    it("should return 404 when result does not exist", async () => {
      mocks.getAssessmentResultById.mockResolvedValue(null);

      const response = await request(app).delete(
        "/assessments/results/result-1",
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Assessment result not found",
      });

      expect(mocks.deleteAssessmentResult).not.toHaveBeenCalled();
    });
  });

  describe("Authentication", () => {
    it("should pass authenticated user to the student results controller", async () => {
      mocks.getMyAssessmentResults.mockResolvedValue([]);

      const response = await request(app).get("/assessments/results/my");

      expect(response.status).toBe(200);
      expect(mocks.getMyAssessmentResults).toHaveBeenCalledWith("user-1");
    });
  });
});
