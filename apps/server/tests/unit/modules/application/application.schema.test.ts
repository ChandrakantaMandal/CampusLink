import { describe, expect, it } from "vitest";

import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from "../../../../src/modules/applications/application.schema";

describe("createApplicationSchema", () => {
  it("should validate a valid application", () => {
    const result = createApplicationSchema.safeParse({
      jobId: "job-123",
      coverLetter: "I am interested in this position.",
      resumeId: "resume-123",
    });

    expect(result.success).toBe(true);
  });

  it("should validate application with only required fields", () => {
    const result = createApplicationSchema.safeParse({
      jobId: "job-123",
    });

    expect(result.success).toBe(true);
  });

  it("should reject an empty jobId", () => {
    const result = createApplicationSchema.safeParse({
      jobId: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toBeDefined();
      expect(result.error.issues[0]?.message).toBe("Job ID is required");
    }
  });

  it("should reject a missing jobId", () => {
    const result = createApplicationSchema.safeParse({
      coverLetter: "My cover letter",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a cover letter longer than 5000 characters", () => {
    const result = createApplicationSchema.safeParse({
      jobId: "job-123",
      coverLetter: "a".repeat(5001),
    });

    expect(result.success).toBe(false);
  });

  it("should accept a cover letter with exactly 5000 characters", () => {
    const result = createApplicationSchema.safeParse({
      jobId: "job-123",
      coverLetter: "a".repeat(5000),
    });

    expect(result.success).toBe(true);
  });

  it("should allow coverLetter to be omitted", () => {
    const result = createApplicationSchema.safeParse({
      jobId: "job-123",
    });

    expect(result.success).toBe(true);
  });

  it("should allow resumeId to be omitted", () => {
    const result = createApplicationSchema.safeParse({
      jobId: "job-123",
      coverLetter: "My cover letter",
    });

    expect(result.success).toBe(true);
  });
});

describe("updateApplicationStatusSchema", () => {
  const validStatuses = [
    "APPLIED",
    "SHORTLISTED",
    "ASSESSMENT",
    "INTERVIEW",
    "SELECTED",
    "REJECTED",
    "WITHDRAWN",
  ] as const;

  it.each(validStatuses)("should accept valid status: %s", (status) => {
    const result = updateApplicationStatusSchema.safeParse({
      status,
    });

    expect(result.success).toBe(true);
  });

  it("should reject an invalid status", () => {
    const result = updateApplicationStatusSchema.safeParse({
      status: "PENDING",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a missing status", () => {
    const result = updateApplicationStatusSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("should reject an empty status", () => {
    const result = updateApplicationStatusSchema.safeParse({
      status: "",
    });

    expect(result.success).toBe(false);
  });

  it("should reject lowercase status", () => {
    const result = updateApplicationStatusSchema.safeParse({
      status: "applied",
    });

    expect(result.success).toBe(false);
  });
});
