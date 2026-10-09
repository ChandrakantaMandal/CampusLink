import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getStudentByUserId: vi.fn(), getJobById: vi.fn() }));
vi.mock("../../../../src/modules/students/student.service", () => ({ getStudentByUserId: mocks.getStudentByUserId }));
vi.mock("../../../../src/modules/jobs/job.service", () => ({ getJobById: mocks.getJobById }));

import { analyzeStudentSkillGap, matchStudentWithJob } from "../../../../src/modules/jobs/job-ai.service";

describe("job AI services", () => {
  afterEach(() => vi.unstubAllGlobals());

  const student = {
    id: "student-1",
    resumeText: "Resume Analysis\nSkills\nPython\nReact\nProjects\nPortal\n",
    skills: [{ skill: { name: "React" } }],
    projects: [{ title: "Campus Portal" }],
  };
  const job = {
    id: "job-1",
    title: "Frontend Engineer",
    description: "Build web applications",
    company: { name: "CampusLink" },
    skills: [{ required: true, skill: { name: "TypeScript" } }, { required: false, skill: { name: "Figma" } }],
  };

  it("sends deduplicated student skills and required job skills to the match service", async () => {
    mocks.getStudentByUserId.mockResolvedValue(student);
    mocks.getJobById.mockResolvedValue(job);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ matchScore: 90 }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(matchStudentWithJob("user-1", "job-1")).resolves.toEqual({ matchScore: 90 });
    const body = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string);
    expect(body.student.skills).toEqual(["React", "Python"]);
    expect(body.student.projects).toEqual(["Campus Portal"]);
    expect(body.job.required_skills).toEqual(["TypeScript"]);
  });

  it("returns skill gap analysis from the analysis service", async () => {
    mocks.getStudentByUserId.mockResolvedValue(student);
    mocks.getJobById.mockResolvedValue(job);
    const analysis = { missing_skills: ["TypeScript"] };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(analysis), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(analyzeStudentSkillGap("user-1", "job-1")).resolves.toEqual(analysis);
    expect(fetchMock.mock.calls[0]![0]).toMatch(/\/skill-gap\/$/);
  });

  it("reports missing student and job records", async () => {
    mocks.getStudentByUserId.mockResolvedValue(null);
    await expect(matchStudentWithJob("user-1", "job-1")).rejects.toThrow("Student profile not found");
    mocks.getStudentByUserId.mockResolvedValue(student);
    mocks.getJobById.mockResolvedValue(null);
    await expect(analyzeStudentSkillGap("user-1", "job-1")).rejects.toThrow("Job not found");
  });
});
