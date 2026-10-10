import { describe, expect, it } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../../../../src/modules/projects/project.schema";

describe("project schemas", () => {
  it("accepts a valid project", () => {
    expect(
      createProjectSchema.safeParse({ title: "Portfolio app" }).success,
    ).toBe(true);
  });

  it("rejects a short title", () => {
    expect(createProjectSchema.safeParse({ title: "x" }).success).toBe(false);
  });

  it("allows partial project updates", () => {
    expect(
      updateProjectSchema.safeParse({ description: "Updated description" })
        .success,
    ).toBe(true);
  });

  it("rejects invalid project URLs", () => {
    expect(
      createProjectSchema.safeParse({
        title: "Portfolio app",
        githubUrl: "not-a-url",
      }).success,
    ).toBe(false);
  });
});
