import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },

  db: {
    assessment: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },

    assessmentResult: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },

    studentProfile: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../../../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  createAssessmentResult,
  getMyAssessmentResults,
  getAssessmentResults,
  getAssessmentResultById,
  updateAssessmentResult,
  deleteAssessmentResult,
} from "../../../../src/modules/assessments/assessment.service";

describe("Assessment Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);
  });

  describe("createAssessment", () => {
    it("should create an assessment", async () => {
      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
        description: "JavaScript fundamentals",
        createdAt: new Date(),
      };

      mocks.db.assessment.create.mockResolvedValue(assessment);

      const data = {
        title: "JavaScript Assessment",
        description: "JavaScript fundamentals",
      };

      const result = await createAssessment(data as never);

      expect(result).toEqual(assessment);
      expect(mocks.db.assessment.create).toHaveBeenCalledWith({
        data,
      });
    });

    it("should invalidate assessment caches after creation", async () => {
      mocks.db.assessment.create.mockResolvedValue({
        id: "assessment-1",
      });

      await createAssessment({
        title: "JavaScript Assessment",
      } as never);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessments:all",
        "admin:assessment:stats",
        "admin:dashboard:stats",
      );
    });

    it("should throw when database creation fails", async () => {
      mocks.db.assessment.create.mockRejectedValue(new Error("Database error"));

      await expect(
        createAssessment({
          title: "JavaScript Assessment",
        } as never),
      ).rejects.toThrow("Database error");
    });
  });

  describe("getAssessments", () => {
    it("should return assessments from database when cache is empty", async () => {
      const assessments = [
        {
          id: "assessment-1",
          title: "JavaScript Assessment",
          createdAt: new Date(),
        },
      ];

      mocks.db.assessment.findMany.mockResolvedValue(assessments);

      const result = await getAssessments();

      expect(result).toEqual(assessments);
      expect(mocks.db.assessment.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should cache assessments after database query", async () => {
      const assessments = [
        {
          id: "assessment-1",
          title: "JavaScript Assessment",
          createdAt: new Date(),
        },
      ];

      mocks.db.assessment.findMany.mockResolvedValue(assessments);

      await getAssessments();

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "assessments:all",
        JSON.stringify(assessments),
        "EX",
        300,
      );
    });

    it("should return cached assessments when cache exists", async () => {
      const cachedAssessments = [
        {
          id: "assessment-1",
          title: "JavaScript Assessment",
          createdAt: new Date(),
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(cachedAssessments));

      const result = await getAssessments();

      expect(result).toEqual(JSON.parse(JSON.stringify(cachedAssessments)));
      expect(mocks.db.assessment.findMany).not.toHaveBeenCalled();
    });

    it("should delete invalid cache and query database", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");

      const assessments = [
        {
          id: "assessment-1",
          title: "JavaScript Assessment",
        },
      ];

      mocks.db.assessment.findMany.mockResolvedValue(assessments);

      const result = await getAssessments();

      expect(result).toEqual(assessments);
      expect(mocks.redis.del).toHaveBeenCalledWith("assessments:all");
      expect(mocks.db.assessment.findMany).toHaveBeenCalled();
    });

    it("should throw when database query fails", async () => {
      mocks.db.assessment.findMany.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(getAssessments()).rejects.toThrow("Database error");
    });
  });

  describe("getAssessmentById", () => {
    it("should return assessment from database", async () => {
      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
        createdAt: new Date(),
      };

      mocks.db.assessment.findUnique.mockResolvedValue(assessment);

      const result = await getAssessmentById("assessment-1");

      expect(result).toEqual(assessment);
      expect(mocks.db.assessment.findUnique).toHaveBeenCalledWith({
        where: {
          id: "assessment-1",
        },
      });
    });

    it("should cache assessment after database query", async () => {
      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
      };

      mocks.db.assessment.findUnique.mockResolvedValue(assessment);

      await getAssessmentById("assessment-1");

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "assessment:assessment-1",
        JSON.stringify(assessment),
        "EX",
        300,
      );
    });

    it("should return cached assessment", async () => {
      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
        createdAt: new Date(),
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(assessment));

      const result = await getAssessmentById("assessment-1");

      expect(result).toEqual(JSON.parse(JSON.stringify(assessment)));
      expect(mocks.db.assessment.findUnique).not.toHaveBeenCalled();
    });

    it("should return null when assessment does not exist", async () => {
      mocks.db.assessment.findUnique.mockResolvedValue(null);

      const result = await getAssessmentById("assessment-1");

      expect(result).toBeNull();
      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should delete invalid cache and query database", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");

      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
      };

      mocks.db.assessment.findUnique.mockResolvedValue(assessment);

      const result = await getAssessmentById("assessment-1");

      expect(result).toEqual(assessment);
      expect(mocks.redis.del).toHaveBeenCalledWith("assessment:assessment-1");
    });
  });

  describe("updateAssessment", () => {
    it("should update an assessment", async () => {
      const assessment = {
        id: "assessment-1",
        title: "Updated Assessment",
      };

      mocks.db.assessment.update.mockResolvedValue(assessment);

      const data = {
        title: "Updated Assessment",
      };

      const result = await updateAssessment("assessment-1", data as never);

      expect(result).toEqual(assessment);
      expect(mocks.db.assessment.update).toHaveBeenCalledWith({
        where: {
          id: "assessment-1",
        },
        data,
      });
    });

    it("should invalidate assessment caches after update", async () => {
      mocks.db.assessment.update.mockResolvedValue({
        id: "assessment-1",
      });

      await updateAssessment("assessment-1", {
        title: "Updated Assessment",
      } as never);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:assessment-1",
        "assessments:all",
        "admin:assessment:stats",
        "admin:dashboard:stats",
      );
    });

    it("should throw when update fails", async () => {
      mocks.db.assessment.update.mockRejectedValue(new Error("Update failed"));

      await expect(
        updateAssessment("assessment-1", {
          title: "Updated Assessment",
        } as never),
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deleteAssessment", () => {
    it("should delete an assessment", async () => {
      const assessment = {
        id: "assessment-1",
        title: "JavaScript Assessment",
      };

      mocks.db.assessment.delete.mockResolvedValue(assessment);

      const result = await deleteAssessment("assessment-1");

      expect(result).toEqual(assessment);
      expect(mocks.db.assessment.delete).toHaveBeenCalledWith({
        where: {
          id: "assessment-1",
        },
      });
    });

    it("should invalidate assessment caches after deletion", async () => {
      mocks.db.assessment.delete.mockResolvedValue({
        id: "assessment-1",
      });

      await deleteAssessment("assessment-1");

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:assessment-1",
        "assessments:all",
        "admin:assessment:stats",
        "admin:dashboard:stats",
      );
    });

    it("should throw when deletion fails", async () => {
      mocks.db.assessment.delete.mockRejectedValue(new Error("Delete failed"));

      await expect(deleteAssessment("assessment-1")).rejects.toThrow(
        "Delete failed",
      );
    });
  });

  describe("createAssessmentResult", () => {
    it("should create an assessment result", async () => {
      const assessment = {
        id: "assessment-1",
        maxScore: 100,
      };

      const student = {
        id: "student-1",
      };

      const resultData = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        score: 80,
        percentage: 80,
        passed: true,
      };

      mocks.db.assessment.findUnique.mockResolvedValue(assessment);
      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.db.assessmentResult.create.mockResolvedValue(resultData);

      const data = {
        studentId: "student-1",
        score: 80,
        percentage: 80,
        passed: true,
      };

      const result = await createAssessmentResult(
        "assessment-1",
        data as never,
      );

      expect(result).toEqual(resultData);
      expect(mocks.db.assessment.findUnique).toHaveBeenCalled();
      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          id: "student-1",
        },
      });
    });

    it("should reject when assessment does not exist", async () => {
      mocks.db.assessment.findUnique.mockResolvedValue(null);

      await expect(
        createAssessmentResult("assessment-1", {
          studentId: "student-1",
          score: 80,
        } as never),
      ).rejects.toThrow("Assessment not found");

      expect(mocks.db.assessmentResult.create).not.toHaveBeenCalled();
    });

    it("should reject when student does not exist", async () => {
      mocks.db.assessment.findUnique.mockResolvedValue({
        id: "assessment-1",
        maxScore: 100,
      });

      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        createAssessmentResult("assessment-1", {
          studentId: "student-1",
          score: 80,
        } as never),
      ).rejects.toThrow("Student not found");

      expect(mocks.db.assessmentResult.create).not.toHaveBeenCalled();
    });

    it("should reject score greater than max score", async () => {
      mocks.db.assessment.findUnique.mockResolvedValue({
        id: "assessment-1",
        maxScore: 100,
      });

      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-1",
      });

      await expect(
        createAssessmentResult("assessment-1", {
          studentId: "student-1",
          score: 120,
        } as never),
      ).rejects.toThrow("Score cannot be greater than maximum score");

      expect(mocks.db.assessmentResult.create).not.toHaveBeenCalled();
    });

    it("should create result when max score is not defined", async () => {
      const resultData = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        score: 120,
      };

      mocks.db.assessment.findUnique.mockResolvedValue({
        id: "assessment-1",
        maxScore: null,
      });

      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-1",
      });

      mocks.db.assessmentResult.create.mockResolvedValue(resultData);

      const result = await createAssessmentResult("assessment-1", {
        studentId: "student-1",
        score: 120,
      } as never);

      expect(result).toEqual(resultData);
    });

    it("should invalidate result caches after creation", async () => {
      mocks.db.assessment.findUnique.mockResolvedValue({
        id: "assessment-1",
        maxScore: 100,
      });

      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-1",
      });

      mocks.db.assessmentResult.create.mockResolvedValue({
        id: "result-1",
      });

      await createAssessmentResult("assessment-1", {
        studentId: "student-1",
        score: 80,
      } as never);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:results:assessment-1",
        "assessment:results:student:student-1",
        "admin:assessment:stats",
        "admin:dashboard:stats",
      );
    });
  });

  describe("getMyAssessmentResults", () => {
    it("should return student assessment results", async () => {
      const student = {
        id: "student-1",
      };

      const results = [
        {
          id: "result-1",
          studentId: "student-1",
          assessmentId: "assessment-1",
          takenAt: new Date(),
          assessment: {
            id: "assessment-1",
            title: "JavaScript Assessment",
          },
        },
      ];

      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.db.assessmentResult.findMany.mockResolvedValue(results);

      const result = await getMyAssessmentResults("user-1");

      expect(result).toEqual(results);
      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });
    });

    it("should throw when student does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(getMyAssessmentResults("user-1")).rejects.toThrow(
        "Student profile not found",
      );

      expect(mocks.db.assessmentResult.findMany).not.toHaveBeenCalled();
    });

    it("should cache student assessment results", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-1",
      });

      const results = [
        {
          id: "result-1",
          studentId: "student-1",
          takenAt: new Date(),
        },
      ];

      mocks.db.assessmentResult.findMany.mockResolvedValue(results);

      await getMyAssessmentResults("user-1");

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "assessment:results:student:student-1",
        JSON.stringify(results),
        "EX",
        300,
      );
    });

    it("should return cached student results", async () => {
      const results = [
        {
          id: "result-1",
          studentId: "student-1",
          takenAt: new Date(),
        },
      ];

      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-1",
      });

      mocks.redis.get.mockResolvedValue(JSON.stringify(results));

      const result = await getMyAssessmentResults("user-1");

      expect(result).toEqual(JSON.parse(JSON.stringify(results)));
      expect(mocks.db.assessmentResult.findMany).not.toHaveBeenCalled();
    });

    it("should delete invalid student result cache", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-1",
      });

      mocks.redis.get.mockResolvedValue("invalid-json");

      mocks.db.assessmentResult.findMany.mockResolvedValue([]);

      await getMyAssessmentResults("user-1");

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:results:student:student-1",
      );
    });
  });

  describe("getAssessmentResults", () => {
    it("should return assessment results", async () => {
      const assessment = {
        id: "assessment-1",
      };

      const results = [
        {
          id: "result-1",
          assessmentId: "assessment-1",
          studentId: "student-1",
          takenAt: new Date(),
        },
      ];

      mocks.db.assessment.findUnique.mockResolvedValue(assessment);
      mocks.db.assessmentResult.findMany.mockResolvedValue(results);

      const result = await getAssessmentResults("assessment-1");

      expect(result).toEqual(results);
      expect(mocks.db.assessment.findUnique).toHaveBeenCalled();
    });

    it("should throw when assessment does not exist", async () => {
      mocks.db.assessment.findUnique.mockResolvedValue(null);

      await expect(getAssessmentResults("assessment-1")).rejects.toThrow(
        "Assessment not found",
      );

      expect(mocks.db.assessmentResult.findMany).not.toHaveBeenCalled();
    });

    it("should cache assessment results", async () => {
      mocks.db.assessment.findUnique.mockResolvedValue({
        id: "assessment-1",
      });

      const results = [
        {
          id: "result-1",
          assessmentId: "assessment-1",
          studentId: "student-1",
        },
      ];

      mocks.db.assessmentResult.findMany.mockResolvedValue(results);

      await getAssessmentResults("assessment-1");

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "assessment:results:assessment-1",
        JSON.stringify(results),
        "EX",
        300,
      );
    });

    it("should return cached assessment results", async () => {
      const results = [
        {
          id: "result-1",
          assessmentId: "assessment-1",
          studentId: "student-1",
          takenAt: new Date(),
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(results));

      const result = await getAssessmentResults("assessment-1");

      expect(result).toEqual(JSON.parse(JSON.stringify(results)));
      expect(mocks.db.assessmentResult.findMany).not.toHaveBeenCalled();
      expect(mocks.db.assessment.findUnique).toHaveBeenCalledWith({
        where: {
          id: "assessment-1",
        },
      });
    });

    it("should delete invalid assessment result cache", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");

      mocks.db.assessment.findUnique.mockResolvedValue({
        id: "assessment-1",
      });

      mocks.db.assessmentResult.findMany.mockResolvedValue([]);

      await getAssessmentResults("assessment-1");

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:results:assessment-1",
      );
    });
  });

  describe("getAssessmentResultById", () => {
    it("should return an assessment result", async () => {
      const resultData = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        takenAt: new Date(),
        assessment: {
          id: "assessment-1",
          title: "JavaScript Assessment",
        },
        student: {
          id: "student-1",
        },
      };

      mocks.db.assessmentResult.findUnique.mockResolvedValue(resultData);

      const result = await getAssessmentResultById("result-1");

      expect(result).toEqual(resultData);
      expect(mocks.db.assessmentResult.findUnique).toHaveBeenCalledWith({
        where: {
          id: "result-1",
        },
        include: {
          assessment: true,
          student: true,
        },
      });
    });

    it("should cache assessment result", async () => {
      const resultData = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
      };

      mocks.db.assessmentResult.findUnique.mockResolvedValue(resultData);

      await getAssessmentResultById("result-1");

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "assessment:result:result-1",
        JSON.stringify(resultData),
        "EX",
        300,
      );
    });

    it("should return cached result", async () => {
      const resultData = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        takenAt: new Date(),
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(resultData));

      const result = await getAssessmentResultById("result-1");

      expect(result).toEqual(JSON.parse(JSON.stringify(resultData)));
      expect(mocks.db.assessmentResult.findUnique).not.toHaveBeenCalled();
    });

    it("should return null when result does not exist", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue(null);

      const result = await getAssessmentResultById("result-1");

      expect(result).toBeNull();
      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should delete invalid result cache", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");

      mocks.db.assessmentResult.findUnique.mockResolvedValue({
        id: "result-1",
      });

      await getAssessmentResultById("result-1");

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:result:result-1",
      );
    });
  });

  describe("updateAssessmentResult", () => {
    it("should update an assessment result", async () => {
      const existingResult = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        assessment: {
          id: "assessment-1",
          maxScore: 100,
        },
      };

      const updatedResult = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        score: 90,
      };

      mocks.db.assessmentResult.findUnique.mockResolvedValue(existingResult);
      mocks.db.assessmentResult.update.mockResolvedValue(updatedResult);

      const result = await updateAssessmentResult("result-1", {
        score: 90,
      } as never);

      expect(result).toEqual(updatedResult);
      expect(mocks.db.assessmentResult.update).toHaveBeenCalled();
    });

    it("should throw when result does not exist", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue(null);

      await expect(
        updateAssessmentResult("result-1", {
          score: 90,
        } as never),
      ).rejects.toThrow("Assessment result not found");

      expect(mocks.db.assessmentResult.update).not.toHaveBeenCalled();
    });

    it("should reject score greater than maximum score", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue({
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        assessment: {
          id: "assessment-1",
          maxScore: 100,
        },
      });

      await expect(
        updateAssessmentResult("result-1", {
          score: 120,
        } as never),
      ).rejects.toThrow("Score cannot be greater than maximum score");

      expect(mocks.db.assessmentResult.update).not.toHaveBeenCalled();
    });

    it("should allow score when maximum score is not defined", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue({
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        assessment: {
          id: "assessment-1",
          maxScore: null,
        },
      });

      const updatedResult = {
        id: "result-1",
        score: 120,
      };

      mocks.db.assessmentResult.update.mockResolvedValue(updatedResult);

      const result = await updateAssessmentResult("result-1", {
        score: 120,
      } as never);

      expect(result).toEqual(updatedResult);
    });

    it("should invalidate result caches after update", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue({
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        assessment: {
          id: "assessment-1",
          maxScore: 100,
        },
      });

      mocks.db.assessmentResult.update.mockResolvedValue({
        id: "result-1",
      });

      await updateAssessmentResult("result-1", {
        score: 90,
      } as never);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:result:result-1",
        "assessment:results:assessment-1",
        "assessment:results:student:student-1",
        "admin:assessment:stats",
        "admin:dashboard:stats",
      );
    });

    it("should throw when update fails", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue({
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
        assessment: {
          id: "assessment-1",
          maxScore: 100,
        },
      });

      mocks.db.assessmentResult.update.mockRejectedValue(
        new Error("Update failed"),
      );

      await expect(
        updateAssessmentResult("result-1", {
          score: 90,
        } as never),
      ).rejects.toThrow("Update failed");
    });
  });

  describe("deleteAssessmentResult", () => {
    it("should delete an assessment result", async () => {
      const resultData = {
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
      };

      mocks.db.assessmentResult.findUnique.mockResolvedValue(resultData);
      mocks.db.assessmentResult.delete.mockResolvedValue(resultData);

      const result = await deleteAssessmentResult("result-1");

      expect(result).toEqual(resultData);
      expect(mocks.db.assessmentResult.delete).toHaveBeenCalledWith({
        where: {
          id: "result-1",
        },
      });
    });

    it("should throw when result does not exist", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue(null);

      await expect(deleteAssessmentResult("result-1")).rejects.toThrow(
        "Assessment result not found",
      );

      expect(mocks.db.assessmentResult.delete).not.toHaveBeenCalled();
    });

    it("should invalidate result caches after deletion", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue({
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
      });

      mocks.db.assessmentResult.delete.mockResolvedValue({
        id: "result-1",
      });

      await deleteAssessmentResult("result-1");

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "assessment:result:result-1",
        "assessment:results:assessment-1",
        "assessment:results:student:student-1",
        "admin:assessment:stats",
        "admin:dashboard:stats",
      );
    });

    it("should throw when deletion fails", async () => {
      mocks.db.assessmentResult.findUnique.mockResolvedValue({
        id: "result-1",
        assessmentId: "assessment-1",
        studentId: "student-1",
      });

      mocks.db.assessmentResult.delete.mockRejectedValue(
        new Error("Delete failed"),
      );

      await expect(deleteAssessmentResult("result-1")).rejects.toThrow(
        "Delete failed",
      );
    });
  });
});
