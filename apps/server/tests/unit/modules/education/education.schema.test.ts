import { describe, expect, it } from "vitest";

import {
  createEducationSchema,
  updateEducationSchema,
} from "../../../../src/modules/education/education.schema";

describe("createEducationSchema", () => {
  it("should accept valid education data", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      degree: "B.Tech",
      branch: "Computer Science",
      startYear: 2022,
      endYear: 2026,
      cgpa: 8.5,
      percentage: 85,
    });

    expect(result.success).toBe(true);
  });

  it("should accept only institution", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
    });

    expect(result.success).toBe(true);
  });

  it("should reject missing institution", () => {
    const result = createEducationSchema.safeParse({
      degree: "B.Tech",
      branch: "CSE",
    });

    expect(result.success).toBe(false);
  });

  it("should reject institution shorter than 2 characters", () => {
    const result = createEducationSchema.safeParse({
      institution: "A",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Institution name is required",
      );
    }
  });

  it("should reject non-string institution", () => {
    const result = createEducationSchema.safeParse({
      institution: 123,
    });

    expect(result.success).toBe(false);
  });

  it("should reject institution longer than 200 characters", () => {
    const result = createEducationSchema.safeParse({
      institution: "A".repeat(201),
    });

    expect(result.success).toBe(false);
  });

  it("should accept degree within 100 characters", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      degree: "A".repeat(100),
    });

    expect(result.success).toBe(true);
  });

  it("should reject degree longer than 100 characters", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      degree: "A".repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it("should accept branch within 100 characters", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      branch: "A".repeat(100),
    });

    expect(result.success).toBe(true);
  });

  it("should reject branch longer than 100 characters", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      branch: "A".repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it("should accept valid start year", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      startYear: 2022,
    });

    expect(result.success).toBe(true);
  });

  it("should reject start year below 1900", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      startYear: 1899,
    });

    expect(result.success).toBe(false);
  });

  it("should reject start year above 2100", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      startYear: 2101,
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-integer start year", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      startYear: 2022.5,
    });

    expect(result.success).toBe(false);
  });

  it("should accept valid end year", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      endYear: 2026,
    });

    expect(result.success).toBe(true);
  });

  it("should reject end year below 1900", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      endYear: 1899,
    });

    expect(result.success).toBe(false);
  });

  it("should reject end year above 2100", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      endYear: 2101,
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-integer end year", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      endYear: 2026.5,
    });

    expect(result.success).toBe(false);
  });

  it("should accept CGPA of 0", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      cgpa: 0,
    });

    expect(result.success).toBe(true);
  });

  it("should accept CGPA of 10", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      cgpa: 10,
    });

    expect(result.success).toBe(true);
  });

  it("should reject CGPA below 0", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      cgpa: -1,
    });

    expect(result.success).toBe(false);
  });

  it("should reject CGPA above 10", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      cgpa: 10.1,
    });

    expect(result.success).toBe(false);
  });

  it("should accept percentage of 0", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      percentage: 0,
    });

    expect(result.success).toBe(true);
  });

  it("should accept percentage of 100", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      percentage: 100,
    });

    expect(result.success).toBe(true);
  });

  it("should reject percentage below 0", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      percentage: -1,
    });

    expect(result.success).toBe(false);
  });

  it("should reject percentage above 100", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      percentage: 100.1,
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-number CGPA", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      cgpa: "8.5",
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-number percentage", () => {
    const result = createEducationSchema.safeParse({
      institution: "ABC University",
      percentage: "85",
    });

    expect(result.success).toBe(false);
  });
});

describe("updateEducationSchema", () => {
  it("should accept an empty object", () => {
    const result = updateEducationSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("should accept partial education data", () => {
    const result = updateEducationSchema.safeParse({
      cgpa: 9,
    });

    expect(result.success).toBe(true);
  });

  it("should accept updating institution only", () => {
    const result = updateEducationSchema.safeParse({
      institution: "XYZ University",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid partial data", () => {
    const result = updateEducationSchema.safeParse({
      cgpa: 11,
    });

    expect(result.success).toBe(false);
  });

  it("should reject invalid institution when provided", () => {
    const result = updateEducationSchema.safeParse({
      institution: "A",
    });

    expect(result.success).toBe(false);
  });
});
