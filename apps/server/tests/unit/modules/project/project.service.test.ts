import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  studentProfile: { findUnique: vi.fn() },
  project: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  redis: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
}));

vi.mock("../../../../src/services", () => ({
  db: { studentProfile: mocks.studentProfile, project: mocks.project },
}));
vi.mock("@CampusLink/redis", () => ({ redis: mocks.redis }));

import {
  createProject,
  deleteProject,
  getMyProjects,
  updateProject,
} from "../../../../src/modules/projects/project.service";

describe("project.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.studentProfile.findUnique.mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });
    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);
  });

  it("creates a project for the current student and invalidates the list cache", async () => {
    const project = {
      id: "project-1",
      studentId: "student-1",
      title: "Portfolio app",
    };
    mocks.project.create.mockResolvedValue(project);
    await expect(
      createProject("user-1", { title: "Portfolio app" }),
    ).resolves.toEqual(project);
    expect(mocks.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          studentId: "student-1",
          title: "Portfolio app",
        }),
      }),
    );
    expect(mocks.redis.del).toHaveBeenCalledWith("projects:student:student-1");
  });

  it("lists and caches the current student's projects", async () => {
    const projects = [{ id: "project-1" }];
    mocks.project.findMany.mockResolvedValue(projects);
    await expect(getMyProjects("user-1")).resolves.toEqual(projects);
    expect(mocks.redis.set).toHaveBeenCalledWith(
      "projects:student:student-1",
      JSON.stringify(projects),
      "EX",
      300,
    );
  });

  it("updates an owned project", async () => {
    mocks.project.findUnique.mockResolvedValue({
      id: "project-1",
      studentId: "student-1",
    });
    mocks.project.update.mockResolvedValue({
      id: "project-1",
      title: "Updated",
    });
    await expect(
      updateProject("user-1", "project-1", { title: "Updated" }),
    ).resolves.toEqual({ id: "project-1", title: "Updated" });
  });

  it("rejects updates to another student's project", async () => {
    mocks.project.findUnique.mockResolvedValue({
      id: "project-1",
      studentId: "someone-else",
    });
    await expect(
      updateProject("user-1", "project-1", { title: "Updated" }),
    ).rejects.toThrow("not authorized");
    expect(mocks.project.update).not.toHaveBeenCalled();
  });

  it("deletes an owned project", async () => {
    mocks.project.findUnique.mockResolvedValue({
      id: "project-1",
      studentId: "student-1",
    });
    await expect(deleteProject("user-1", "project-1")).resolves.toBeUndefined();
    expect(mocks.project.delete).toHaveBeenCalledWith({
      where: { id: "project-1" },
    });
  });
});
