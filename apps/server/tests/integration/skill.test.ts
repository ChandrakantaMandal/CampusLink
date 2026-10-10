import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    studentProfile: { findUnique: vi.fn() },
    skill: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    studentSkill: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
  redis: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
  invalidateStudentCaches: vi.fn(),
}));

vi.mock("../../src/services", () => ({ db: mocks.db }));
vi.mock("@CampusLink/redis", () => ({ redis: mocks.redis }));
vi.mock("../../src/modules/students/student.service", () => ({
  invalidateStudentCaches: mocks.invalidateStudentCaches,
}));
vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = {
      id: "user-1",
      email: "student@example.com",
      name: "Test Student",
      role: "STUDENT",
    };
    req.session = {
      id: "session-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 3600000),
    };
    next();
  },
}));
vi.mock("../../src/middleware/role.middleware", () => ({
  requireRole:
    (...roles: string[]) =>
    (req: any, res: any, next: any) =>
      roles.includes(req.user?.role)
        ? next()
        : res.status(403).json({ success: false }),
}));

import skillRouter from "../../src/modules/skills/skill.routes";

const app = express();
app.use(express.json());
app.use("/api/skills", skillRouter);

describe("Student skills API integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.db.studentProfile.findUnique.mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });
    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);
    mocks.db.studentSkill.findMany.mockResolvedValue([
      { id: "student-skill-1", skill: { id: "skill-1", name: "TypeScript" } },
    ]);
    mocks.db.skill.findUnique.mockResolvedValue({
      id: "skill-1",
      name: "TypeScript",
      normalized: "typescript",
    });
    mocks.db.skill.findFirst.mockResolvedValue(null);
    mocks.db.studentSkill.findUnique.mockResolvedValue(null);
    mocks.db.studentSkill.create.mockResolvedValue({
      id: "student-skill-1",
      skillId: "skill-1",
    });
    mocks.db.studentSkill.delete.mockResolvedValue({ id: "student-skill-1" });
  });

  it("lists the authenticated student's skills", async () => {
    const response = await request(app).get("/api/skills/student/me");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("validates and adds a skill", async () => {
    const invalid = await request(app)
      .post("/api/skills/student/me")
      .send({ level: "BEGINNER" });
    expect(invalid.status).toBe(400);

    const response = await request(app)
      .post("/api/skills/student/me")
      .send({ skillName: "TypeScript", level: "ADVANCED" });
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe("student-skill-1");
  });

  it("removes a skill from the authenticated student's profile", async () => {
    mocks.db.studentSkill.findUnique.mockResolvedValue({
      id: "student-skill-1",
    });
    const response = await request(app).delete(
      "/api/skills/student/me/skill-1",
    );
    expect(response.status).toBe(200);
    expect(mocks.db.studentSkill.delete).toHaveBeenCalledWith({
      where: { id: "student-skill-1" },
    });
  });
});
