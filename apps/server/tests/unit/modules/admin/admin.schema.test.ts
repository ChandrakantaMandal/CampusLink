import { describe, expect, it } from "vitest";

import {
  createPlacementDriveSchema,
  updatePlacementDriveSchema,
} from "../../../../src/modules/admin/admin.schema";

describe("createPlacementDriveSchema", () => {
  const validDrive = {
    companyId: "company-1",
    title: "SDE Intern",
    role: "Software Engineer Intern",
    driveDate: "2026-10-01T10:00:00.000Z",
  };

  describe("valid input", () => {
    it("should accept minimal required fields", () => {
      const result = createPlacementDriveSchema.safeParse(validDrive);

      expect(result.success).toBe(true);
    });

    it("should apply defaults for optional fields", () => {
      const result = createPlacementDriveSchema.safeParse(validDrive);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.tier).toBe("TIER_2");
        expect(result.data.type).toBe("IN_PERSON");
        expect(result.data.status).toBe("OPEN");
        expect(result.data.backlogsAllowed).toBe(0);
        expect(result.data.openings).toBe(1);
        expect(result.data.allowedBranches).toEqual([]);
        expect(result.data.requiredSkills).toEqual([]);
        expect(result.data.rounds).toEqual([]);
      }
    });

    it("should accept a full payload", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        description: "Summer internship",
        tier: "TIER_1",
        type: "HYBRID",
        status: "DRAFT",
        salary: "₹50,000/month",
        minCgpa: 7.5,
        backlogsAllowed: 1,
        batchEligibility: "2027 batch",
        allowedBranches: ["CSE", "IT"],
        requiredSkills: ["React", "Node.js"],
        rounds: ["OA", "Technical", "HR"],
        openings: 10,
        driveTime: "10:00 AM",
        venue: "Auditorium",
        deadline: "2026-09-25T00:00:00.000Z",
      });

      expect(result.success).toBe(true);
    });

    it("should coerce a Date instance for driveDate", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        driveDate: new Date("2026-10-01T10:00:00.000Z"),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("invalid input", () => {
    it("should reject a missing companyId", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        companyId: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject a missing title", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        title: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject a missing role", () => {
      const { role: _role, ...rest } = validDrive;

      const result = createPlacementDriveSchema.safeParse(rest);

      expect(result.success).toBe(false);
    });

    it("should reject a missing driveDate", () => {
      const { driveDate: _driveDate, ...rest } = validDrive;

      const result = createPlacementDriveSchema.safeParse(rest);

      expect(result.success).toBe(false);
    });

    it("should reject an invalid driveDate", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        driveDate: "not-a-date",
      });

      expect(result.success).toBe(false);
    });

    it("should reject an invalid tier", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        tier: "TIER_4",
      });

      expect(result.success).toBe(false);
    });

    it("should reject an invalid type", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        type: "ONSITE",
      });

      expect(result.success).toBe(false);
    });

    it("should reject an invalid status", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        status: "CLOSED",
      });

      expect(result.success).toBe(false);
    });

    it("should reject minCgpa greater than 10", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        minCgpa: 11,
      });

      expect(result.success).toBe(false);
    });

    it("should reject openings below 1", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        openings: 0,
      });

      expect(result.success).toBe(false);
    });

    it("should reject negative backlogsAllowed", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        backlogsAllowed: -1,
      });

      expect(result.success).toBe(false);
    });

    it("should reject non-array requiredSkills", () => {
      const result = createPlacementDriveSchema.safeParse({
        ...validDrive,
        requiredSkills: "React",
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("updatePlacementDriveSchema", () => {
  describe("valid input", () => {
    it("should accept a partial payload", () => {
      const result = updatePlacementDriveSchema.safeParse({
        title: "Updated Title",
        status: "APPLICATIONS_CLOSED",
      });

      expect(result.success).toBe(true);
    });

    it("should accept an empty payload", () => {
      const result = updatePlacementDriveSchema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe("invalid input", () => {
    it("should reject an invalid tier", () => {
      const result = updatePlacementDriveSchema.safeParse({
        tier: "TIER_4",
      });

      expect(result.success).toBe(false);
    });

    it("should reject an empty title", () => {
      const result = updatePlacementDriveSchema.safeParse({
        title: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject an invalid driveDate", () => {
      const result = updatePlacementDriveSchema.safeParse({
        driveDate: "not-a-date",
      });

      expect(result.success).toBe(false);
    });
  });
});
