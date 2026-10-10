import { describe, expect, it } from "vitest";
import { updateStudentSchema } from "../../../../src/modules/students/student.schema";

describe("updateStudentSchema", () => {
  it("should accept a valid student update", () => {
    const result = updateStudentSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      dateOfBirth: "2002-05-15",
      gender: "Male",
      college: "ABC College",
      department: "Computer Science",
      graduationYear: 2026,
      cgpa: 8.5,
      bio: "Full stack developer",
      githubUrl: "https://github.com/johndoe",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      portfolioUrl: "https://johndoe.dev",
    });

    expect(result.success).toBe(true);
  });

  it("should accept an empty object", () => {
    const result = updateStudentSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("should accept partial updates", () => {
    const result = updateStudentSchema.safeParse({
      firstName: "John",
      cgpa: 9.2,
    });

    expect(result.success).toBe(true);
  });

  it("should reject an empty first name", () => {
    const result = updateStudentSchema.safeParse({
      firstName: "",
    });

    expect(result.success).toBe(false);
  });

  it("should reject first name longer than 50 characters", () => {
    const result = updateStudentSchema.safeParse({
      firstName: "a".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it("should reject last name longer than 50 characters", () => {
    const result = updateStudentSchema.safeParse({
      lastName: "a".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it("should reject phone longer than 20 characters", () => {
    const result = updateStudentSchema.safeParse({
      phone: "1".repeat(21),
    });

    expect(result.success).toBe(false);
  });

  it("should reject gender longer than 20 characters", () => {
    const result = updateStudentSchema.safeParse({
      gender: "a".repeat(21),
    });

    expect(result.success).toBe(false);
  });

  it("should reject college longer than 150 characters", () => {
    const result = updateStudentSchema.safeParse({
      college: "a".repeat(151),
    });

    expect(result.success).toBe(false);
  });

  it("should reject department longer than 100 characters", () => {
    const result = updateStudentSchema.safeParse({
      department: "a".repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it("should accept graduation year within range", () => {
    expect(
      updateStudentSchema.safeParse({
        graduationYear: 2000,
      }).success,
    ).toBe(true);

    expect(
      updateStudentSchema.safeParse({
        graduationYear: 2100,
      }).success,
    ).toBe(true);
  });

  it("should reject graduation year below 2000", () => {
    const result = updateStudentSchema.safeParse({
      graduationYear: 1999,
    });

    expect(result.success).toBe(false);
  });

  it("should reject graduation year above 2100", () => {
    const result = updateStudentSchema.safeParse({
      graduationYear: 2101,
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-integer graduation year", () => {
    const result = updateStudentSchema.safeParse({
      graduationYear: 2026.5,
    });

    expect(result.success).toBe(false);
  });

  it("should accept cgpa between 0 and 10", () => {
    expect(
      updateStudentSchema.safeParse({
        cgpa: 0,
      }).success,
    ).toBe(true);

    expect(
      updateStudentSchema.safeParse({
        cgpa: 10,
      }).success,
    ).toBe(true);

    expect(
      updateStudentSchema.safeParse({
        cgpa: 8.75,
      }).success,
    ).toBe(true);
  });

  it("should reject cgpa below 0", () => {
    const result = updateStudentSchema.safeParse({
      cgpa: -1,
    });

    expect(result.success).toBe(false);
  });

  it("should reject cgpa above 10", () => {
    const result = updateStudentSchema.safeParse({
      cgpa: 10.1,
    });

    expect(result.success).toBe(false);
  });

  it("should reject bio longer than 1000 characters", () => {
    const result = updateStudentSchema.safeParse({
      bio: "a".repeat(1001),
    });

    expect(result.success).toBe(false);
  });

  it("should accept valid URLs", () => {
    const result = updateStudentSchema.safeParse({
      githubUrl: "https://github.com/user",
      linkedinUrl: "https://linkedin.com/in/user",
      portfolioUrl: "https://example.com",
    });

    expect(result.success).toBe(true);
  });

  it("should accept empty URLs", () => {
    const result = updateStudentSchema.safeParse({
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid GitHub URL", () => {
    const result = updateStudentSchema.safeParse({
      githubUrl: "invalid-url",
    });

    expect(result.success).toBe(false);
  });

  it("should reject invalid LinkedIn URL", () => {
    const result = updateStudentSchema.safeParse({
      linkedinUrl: "invalid-url",
    });

    expect(result.success).toBe(false);
  });

  it("should reject invalid portfolio URL", () => {
    const result = updateStudentSchema.safeParse({
      portfolioUrl: "invalid-url",
    });

    expect(result.success).toBe(false);
  });

  it("should reject invalid data types", () => {
    const result = updateStudentSchema.safeParse({
      firstName: 123,
      graduationYear: "2026",
      cgpa: "8.5",
      bio: 123,
    });

    expect(result.success).toBe(false);
  });

  it("should allow dateOfBirth as a string", () => {
    const result = updateStudentSchema.safeParse({
      dateOfBirth: "2002-05-15",
    });

    expect(result.success).toBe(true);
  });

  it("should reject dateOfBirth when it is not a string", () => {
    const result = updateStudentSchema.safeParse({
      dateOfBirth: 2002,
    });

    expect(result.success).toBe(false);
  });
});
