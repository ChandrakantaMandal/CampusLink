import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    studentProfile: { findUnique: vi.fn() },
    project: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
  redis: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
}));

vi.mock("../../src/services", () => ({ db: mocks.db }));
vi.mock("@CampusLink/redis", () => ({ redis: mocks.redis }));
vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { id: "user-1", email: "student@example.com", name: "Test Student", role: "STUDENT" };
    req.session = { id: "session-1", userId: "user-1", expiresAt: new Date(Date.now() + 3600000) };
    next();
  },
}));
vi.mock("../../src/middleware/role.middleware", () => ({
  requireRole: (...roles: string[]) => (req: any, res: any, next: any) =>
    roles.includes(req.user?.role) ? next() : res.status(403).json({ success: false }),
}));

import projectRouter from "../../src/modules/projects/project.routes";

const app = express();
app.use(express.json());
app.use("/api/projects", projectRouter);

describe("Project API integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.db.studentProfile.findUnique.mockResolvedValue({ id: "student-1", userId: "user-1" });
    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);
    mocks.db.project.findMany.mockResolvedValue([{ id: "project-1", title: "Portfolio app" }]);
    mocks.db.project.create.mockResolvedValue({ id: "project-2", title: "Portfolio app" });
    mocks.db.project.findUnique.mockResolvedValue({ id: "project-1", studentId: "student-1" });
    mocks.db.project.update.mockResolvedValue({ id: "project-1", title: "Updated app" });
    mocks.db.project.delete.mockResolvedValue({ id: "project-1" });
  });

  it("lists the authenticated student's projects", async () => {
    const response = await request(app).get("/api/projects/my");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ id: "project-1", title: "Portfolio app" }]);
  });

  it("validates and creates projects", async () => {
    const invalid = await request(app).post("/api/projects").send({ title: "x" });
    expect(invalid.status).toBe(400);
    expect(mocks.db.project.create).not.toHaveBeenCalled();

    const response = await request(app).post("/api/projects").send({ title: "Portfolio app" });
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe("project-2");
  });

  it("updates an owned project", async () => {
    const response = await request(app).patch("/api/projects/project-1").send({ title: "Updated app" });
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Updated app");
  });

  it("deletes an owned project", async () => {
    const response = await request(app).delete("/api/projects/project-1");
    expect(response.status).toBe(200);
    expect(mocks.db.project.delete).toHaveBeenCalledWith({ where: { id: "project-1" } });
  });
});
