import { describe, expect, it } from "vitest";

import {
  createJobSchema,
  updateJobSchema,
} from "../../../../src/modules/jobs/job.schema";

describe("createJobSchema", () => {
  const validJob = {
    title: "Software Engineer",
    description:
      "We are looking for a software engineer to join our development team.",
    location: "Bhubaneswar",
    employmentType: "FULL_TIME",
    workMode: "HYBRID",
    salaryMin: 500000,
    salaryMax: 900000,
    applicationDeadline: "2026-12-31T23:59:59.000Z",
    companyId: "company-123",
  };

  it("should accept valid job data", () => {
    const result = createJobSchema.safeParse(validJob);

    expect(result.success).toBe(true);
  });

  it("should reject when title is missing", () => {
    const { title, ...jobWithoutTitle } = validJob;

    const result = createJobSchema.safeParse(jobWithoutTitle);

    expect(result.success).toBe(false);
  });

  it("should reject title shorter than 2 characters", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      title: "A",
    });

    expect(result.success).toBe(false);
  });

  it("should reject title longer than 150 characters", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      title: "A".repeat(151),
    });

    expect(result.success).toBe(false);
  });

  it("should reject when description is missing", () => {
    const { description, ...jobWithoutDescription } = validJob;

    const result = createJobSchema.safeParse(jobWithoutDescription);

    expect(result.success).toBe(false);
  });

  it("should reject description shorter than 10 characters", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      description: "Too short",
    });

    expect(result.success).toBe(false);
  });

  it("should reject description longer than 5000 characters", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      description: "A".repeat(5001),
    });

    expect(result.success).toBe(false);
  });

  it("should accept job without optional fields", () => {
    const result = createJobSchema.safeParse({
      title: "Software Engineer",
      description: "A valid software engineering job description.",
      companyId: "company-123",
    });

    expect(result.success).toBe(true);
  });

  it("should accept an optional location", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      location: "Bhubaneswar",
    });

    expect(result.success).toBe(true);
  });

  it("should reject location longer than 150 characters", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      location: "A".repeat(151),
    });

    expect(result.success).toBe(false);
  });

  it("should accept an optional employment type", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      employmentType: "FULL_TIME",
    });

    expect(result.success).toBe(true);
  });

  it("should reject employment type longer than 50 characters", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      employmentType: "A".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it("should accept an optional work mode", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      workMode: "REMOTE",
    });

    expect(result.success).toBe(true);
  });

  it("should reject work mode longer than 50 characters", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      workMode: "A".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it("should accept non-negative salaryMin", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      salaryMin: 0,
    });

    expect(result.success).toBe(true);
  });

  it("should reject negative salaryMin", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      salaryMin: -1,
    });

    expect(result.success).toBe(false);
  });

  it("should accept non-negative salaryMax", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      salaryMax: 1000000,
    });

    expect(result.success).toBe(true);
  });

  it("should reject negative salaryMax", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      salaryMax: -1,
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-number salaryMin", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      salaryMin: "500000",
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-number salaryMax", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      salaryMax: "900000",
    });

    expect(result.success).toBe(false);
  });

  it("should accept a valid ISO datetime", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      applicationDeadline: "2026-12-31T23:59:59.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("should reject an invalid datetime", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      applicationDeadline: "2026-12-31",
    });

    expect(result.success).toBe(false);
  });

  it("should reject when companyId is missing", () => {
    const { companyId, ...jobWithoutCompanyId } = validJob;

    const result = createJobSchema.safeParse(jobWithoutCompanyId);

    expect(result.success).toBe(false);
  });

  it("should reject an empty companyId", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      companyId: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("updateJobSchema", () => {
  it("should accept an empty object", () => {
    const result = updateJobSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("should accept a partial update", () => {
    const result = updateJobSchema.safeParse({
      title: "Senior Software Engineer",
    });

    expect(result.success).toBe(true);
  });

  it("should accept multiple fields", () => {
    const result = updateJobSchema.safeParse({
      title: "Senior Software Engineer",
      description: "Updated job description for the position.",
      location: "Bangalore",
      salaryMin: 800000,
      salaryMax: 1200000,
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid title during update", () => {
    const result = updateJobSchema.safeParse({
      title: "A",
    });

    expect(result.success).toBe(false);
  });

  it("should reject negative salary during update", () => {
    const result = updateJobSchema.safeParse({
      salaryMin: -5000,
    });

    expect(result.success).toBe(false);
  });

  it("should reject invalid datetime during update", () => {
    const result = updateJobSchema.safeParse({
      applicationDeadline: "invalid-date",
    });

    expect(result.success).toBe(false);
  });

  it("should not accept companyId", () => {
    const result = updateJobSchema.safeParse({
      companyId: "company-123",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).not.toHaveProperty("companyId");
    }
  });
});


