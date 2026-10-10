import { describe, expect, it } from "vitest";
import { addStudentSkillSchema } from "../../../../src/modules/skills/skill.schema";

describe("addStudentSkillSchema", () => {
  it("accepts a named skill", () => {
    expect(addStudentSkillSchema.safeParse({ skillName: " TypeScript " }).success).toBe(true);
  });

  it("accepts a skill ID", () => {
    expect(addStudentSkillSchema.safeParse({ skillId: "skill-1" }).success).toBe(true);
  });

  it("rejects a record without a skill ID or name", () => {
    expect(addStudentSkillSchema.safeParse({ level: "BEGINNER" }).success).toBe(false);
  });

  it("rejects an invalid skill level", () => {
    expect(addStudentSkillSchema.safeParse({ skillName: "TypeScript", level: "MASTER" }).success).toBe(false);
  });
});
