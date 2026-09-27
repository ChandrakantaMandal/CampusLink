import { describe, expect, it } from "vitest";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../../../../src/modules/companies/company.schema";

describe("Company Schemas", () => {
  describe("createCompanySchema", () => {
    it("should accept valid company data", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        description: "Technology company",
        website: "https://www.google.com",
        location: "Bangalore",
        industry: "Technology",
        logoUrl: "https://www.google.com/logo.png",
      });

      expect(result.success).toBe(true);
    });

    it("should accept only the required name field", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
      });

      expect(result.success).toBe(true);
    });

    it("should reject missing company name", () => {
      const result = createCompanySchema.safeParse({
        description: "Technology company",
      });

      expect(result.success).toBe(false);
    });

    it("should reject company name shorter than 2 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "G",
      });

      expect(result.success).toBe(false);
    });

    it("should accept company name with exactly 2 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "AB",
      });

      expect(result.success).toBe(true);
    });

    it("should reject company name longer than 150 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "A".repeat(151),
      });

      expect(result.success).toBe(false);
    });

    it("should accept company name with exactly 150 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "A".repeat(150),
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid website URL", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        website: "invalid-url",
      });

      expect(result.success).toBe(false);
    });

    it("should accept valid website URL", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        website: "https://www.google.com",
      });

      expect(result.success).toBe(true);
    });

    it("should accept empty website URL", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        website: "",
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid logo URL", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        logoUrl: "invalid-url",
      });

      expect(result.success).toBe(false);
    });

    it("should accept valid logo URL", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        logoUrl: "https://example.com/logo.png",
      });

      expect(result.success).toBe(true);
    });

    it("should accept empty logo URL", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        logoUrl: "",
      });

      expect(result.success).toBe(true);
    });

    it("should reject description longer than 2000 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        description: "A".repeat(2001),
      });

      expect(result.success).toBe(false);
    });

    it("should accept description with exactly 2000 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        description: "A".repeat(2000),
      });

      expect(result.success).toBe(true);
    });

    it("should reject location longer than 150 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        location: "A".repeat(151),
      });

      expect(result.success).toBe(false);
    });

    it("should reject industry longer than 100 characters", () => {
      const result = createCompanySchema.safeParse({
        name: "Google",
        industry: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("should accept valid optional fields", () => {
      const result = createCompanySchema.safeParse({
        name: "Microsoft",
        description: "Software company",
        website: "https://www.microsoft.com",
        location: "Hyderabad",
        industry: "Software",
        logoUrl: "https://example.com/microsoft.png",
      });

      expect(result.success).toBe(true);
    });

    it("should reject non-string company name", () => {
      const result = createCompanySchema.safeParse({
        name: 123,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("updateCompanySchema", () => {
    it("should accept an empty update object", () => {
      const result = updateCompanySchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it("should accept partial company data", () => {
      const result = updateCompanySchema.safeParse({
        name: "Amazon",
      });

      expect(result.success).toBe(true);
    });

    it("should accept updating only the website", () => {
      const result = updateCompanySchema.safeParse({
        website: "https://www.amazon.com",
      });

      expect(result.success).toBe(true);
    });

    it("should accept updating only the location", () => {
      const result = updateCompanySchema.safeParse({
        location: "Bangalore",
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid website during update", () => {
      const result = updateCompanySchema.safeParse({
        website: "invalid-url",
      });

      expect(result.success).toBe(false);
    });

    it("should reject invalid logo URL during update", () => {
      const result = updateCompanySchema.safeParse({
        logoUrl: "invalid-url",
      });

      expect(result.success).toBe(false);
    });

    it("should reject company name shorter than 2 characters during update", () => {
      const result = updateCompanySchema.safeParse({
        name: "A",
      });

      expect(result.success).toBe(false);
    });

    it("should accept empty website during update", () => {
      const result = updateCompanySchema.safeParse({
        website: "",
      });

      expect(result.success).toBe(true);
    });

    it("should accept empty logo URL during update", () => {
      const result = updateCompanySchema.safeParse({
        logoUrl: "",
      });

      expect(result.success).toBe(true);
    });
  });
});