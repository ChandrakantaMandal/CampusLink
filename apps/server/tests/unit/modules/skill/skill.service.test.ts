import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  studentProfile: { findUnique: vi.fn() },
  skill: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
  studentSkill: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
  redis: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
  invalidateStudentCaches: vi.fn(),
}));

vi.mock("../../../../src/services", () => ({ db: { studentProfile: mocks.studentProfile, skill: mocks.skill, studentSkill: mocks.studentSkill } }));
vi.mock("@CampusLink/redis", () => ({ redis: mocks.redis }));
vi.mock("../../../../src/modules/students/student.service", () => ({ invalidateStudentCaches: mocks.invalidateStudentCaches }));

import { addStudentSkill, getMySkills, removeStudentSkill } from "../../../../src/modules/skills/skill.service";

describe("skill.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.studentProfile.findUnique.mockResolvedValue({ id: "student-1" });
    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);
  });

  it("lists and caches the current student's skills", async () => {
    const skills = [{ id: "student-skill-1", skill: { id: "skill-1", name: "TypeScript" } }];
    mocks.studentSkill.findMany.mockResolvedValue(skills);
    await expect(getMySkills("user-1")).resolves.toEqual(skills);
    expect(mocks.redis.set).toHaveBeenCalledWith("skills:student:student-1", JSON.stringify(skills), "EX", 300);
  });

  it("adds a normalized skill name and invalidates student caches", async () => {
    const skill = { id: "skill-1", name: "TypeScript", normalized: "typescript" };
    const studentSkill = { id: "student-skill-1", skill };
    mocks.skill.findUnique.mockResolvedValue(null);
    mocks.skill.findFirst.mockResolvedValue(null);
    mocks.skill.create.mockResolvedValue(skill);
    mocks.studentSkill.findUnique.mockResolvedValue(null);
    mocks.studentSkill.create.mockResolvedValue(studentSkill);
    await expect(addStudentSkill("user-1", { skillName: " TypeScript ", level: "BEGINNER" })).resolves.toEqual(studentSkill);
    expect(mocks.studentSkill.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ skillId: "skill-1", studentId: "student-1" }) }));
    expect(mocks.invalidateStudentCaches).toHaveBeenCalledWith("user-1", "student-1");
  });

  it("rejects duplicate student skills", async () => {
    mocks.skill.findUnique.mockResolvedValue({ id: "skill-1", name: "TypeScript" });
    mocks.studentSkill.findUnique.mockResolvedValue({ id: "already-added" });
    await expect(addStudentSkill("user-1", { skillId: "skill-1", level: "BEGINNER" })).rejects.toThrow("already has this skill");
    expect(mocks.studentSkill.create).not.toHaveBeenCalled();
  });

  it("removes a student skill by its join-record ID", async () => {
    mocks.studentSkill.findUnique.mockResolvedValue({ id: "student-skill-1" });
    await expect(removeStudentSkill("user-1", "skill-1")).resolves.toBeUndefined();
    expect(mocks.studentSkill.delete).toHaveBeenCalledWith({ where: { id: "student-skill-1" } });
  });
});
