import { describe, expect, it } from "vitest";

import { updateUserRoleSchema } from "../../../../src/modules/admin/admin.schema";

describe("updateUserRoleSchema", () => {
  describe("valid input", () => {
    it("should accept STUDENT role", () => {
      const result = updateUserRoleSchema.safeParse({
        role: "STUDENT",
      });

      expect(result.success).toBe(true);
    });

    it("should accept RECRUITER role", () => {
      const result = updateUserRoleSchema.safeParse({
        role: "RECRUITER",
      });

      expect(result.success).toBe(true);
    });

    it("should accept ADMIN role", () => {
      const result = updateUserRoleSchema.safeParse({
        role: "ADMIN",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("invalid input", () => {
    it("should reject an invalid role", () => {
      const result = updateUserRoleSchema.safeParse({
        role: "USER",
      });

      expect(result.success).toBe(false);
    });

    it("should reject a missing role", () => {
      const result = updateUserRoleSchema.safeParse({});

      expect(result.success).toBe(false);
    });

    it("should reject an empty role", () => {
      const result = updateUserRoleSchema.safeParse({
        role: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject a non-string role", () => {
      const result = updateUserRoleSchema.safeParse({
        role: 123,
      });

      expect(result.success).toBe(false);
    });
  });
});
