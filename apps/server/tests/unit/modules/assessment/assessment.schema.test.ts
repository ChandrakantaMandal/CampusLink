import { describe, expect, it } from "vitest";

import {
  assessmentTypeSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
  createAssessmentResultSchema,
  updateAssessmentResultSchema,
} from "../../../../src/modules/assessments/assessment.schema";

describe("Assessment Schemas", () => {
  describe("assessmentTypeSchema", () => {
    it("should accept all valid assessment types", () => {
      const types = [
        "TECHNICAL",
        "APTITUDE",
        "CODING",
        "INTERVIEW",
        "COMMUNICATION",
        "OTHER",
      ];

      types.forEach((type) => {
        expect(assessmentTypeSchema.safeParse(type).success).toBe(true);
      });
    });

    it("should reject invalid assessment type", () => {
      expect(assessmentTypeSchema.safeParse("INVALID").success).toBe(false);
    });

    it("should reject empty assessment type", () => {
      expect(assessmentTypeSchema.safeParse("").success).toBe(false);
    });
  });

  describe("createAssessmentSchema", () => {
    it("should accept valid assessment data", () => {
      const data = {
        title: "JavaScript Assessment",
        description: "JavaScript fundamentals assessment",
        type: "TECHNICAL",
        maxScore: 100,
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept assessment without optional fields", () => {
      const data = {
        title: "Aptitude Test",
        type: "APTITUDE",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject title shorter than 2 characters", () => {
      const data = {
        title: "A",
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject empty title", () => {
      const data = {
        title: "",
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject title longer than 200 characters", () => {
      const data = {
        title: "A".repeat(201),
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should accept title with exactly 2 characters", () => {
      const data = {
        title: "AB",
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept title with exactly 200 characters", () => {
      const data = {
        title: "A".repeat(200),
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject description longer than 1000 characters", () => {
      const data = {
        title: "JavaScript Assessment",
        description: "A".repeat(1001),
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should accept description with exactly 1000 characters", () => {
      const data = {
        title: "JavaScript Assessment",
        description: "A".repeat(1000),
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept empty description", () => {
      const data = {
        title: "JavaScript Assessment",
        description: "",
        type: "TECHNICAL",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject missing type", () => {
      const data = {
        title: "JavaScript Assessment",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject invalid type", () => {
      const data = {
        title: "JavaScript Assessment",
        type: "INVALID",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should accept maxScore of zero", () => {
      const data = {
        title: "JavaScript Assessment",
        type: "TECHNICAL",
        maxScore: 0,
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject negative maxScore", () => {
      const data = {
        title: "JavaScript Assessment",
        type: "TECHNICAL",
        maxScore: -1,
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should accept positive maxScore", () => {
      const data = {
        title: "JavaScript Assessment",
        type: "TECHNICAL",
        maxScore: 100,
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject non-number maxScore", () => {
      const data = {
        title: "JavaScript Assessment",
        type: "TECHNICAL",
        maxScore: "100",
      };

      const result = createAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe("updateAssessmentSchema", () => {
    it("should accept an empty update object", () => {
      const result = updateAssessmentSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it("should accept partial assessment update", () => {
      const data = {
        title: "Updated Assessment",
      };

      const result = updateAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept type-only update", () => {
      const data = {
        type: "CODING",
      };

      const result = updateAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept maxScore-only update", () => {
      const data = {
        maxScore: 50,
      };

      const result = updateAssessmentSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject invalid title in partial update", () => {
      const data = {
        title: "A",
      };

      const result = updateAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject invalid type in partial update", () => {
      const data = {
        type: "INVALID",
      };

      const result = updateAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject negative maxScore in partial update", () => {
      const data = {
        maxScore: -10,
      };

      const result = updateAssessmentSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });

  describe("createAssessmentResultSchema", () => {
    it("should accept valid assessment result", () => {
      const data = {
        studentId: "student-1",
        score: 80,
        percentage: 80,
        passed: true,
        feedback: "Good performance",
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept only required studentId", () => {
      const data = {
        studentId: "student-1",
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject missing studentId", () => {
      const data = {
        score: 80,
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject empty studentId", () => {
      const data = {
        studentId: "",
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should accept score of zero", () => {
      const data = {
        studentId: "student-1",
        score: 0,
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject negative score", () => {
      const data = {
        studentId: "student-1",
        score: -1,
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should accept percentage of zero", () => {
      const data = {
        studentId: "student-1",
        percentage: 0,
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept percentage of 100", () => {
      const data = {
        studentId: "student-1",
        percentage: 100,
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject percentage below zero", () => {
      const data = {
        studentId: "student-1",
        percentage: -1,
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject percentage above 100", () => {
      const data = {
        studentId: "student-1",
        percentage: 101,
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject non-boolean passed value", () => {
      const data = {
        studentId: "student-1",
        passed: "true",
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject feedback longer than 2000 characters", () => {
      const data = {
        studentId: "student-1",
        feedback: "A".repeat(2001),
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should accept feedback with exactly 2000 characters", () => {
      const data = {
        studentId: "student-1",
        feedback: "A".repeat(2000),
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept empty feedback", () => {
      const data = {
        studentId: "student-1",
        feedback: "",
      };

      const result = createAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });
  });

  describe("updateAssessmentResultSchema", () => {
    it("should accept an empty update object", () => {
      const result = updateAssessmentResultSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it("should accept score update", () => {
      const data = {
        score: 90,
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept percentage update", () => {
      const data = {
        percentage: 90,
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept passed update", () => {
      const data = {
        passed: false,
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should accept feedback update", () => {
      const data = {
        feedback: "Needs improvement",
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject studentId in update schema", () => {
      const data = {
        studentId: "student-1",
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });

    it("should reject invalid score in update", () => {
      const data = {
        score: -10,
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject percentage above 100 in update", () => {
      const data = {
        percentage: 101,
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject feedback longer than 2000 characters in update", () => {
      const data = {
        feedback: "A".repeat(2001),
      };

      const result = updateAssessmentResultSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });
});
