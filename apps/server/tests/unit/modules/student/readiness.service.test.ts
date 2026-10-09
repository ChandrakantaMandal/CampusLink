import { describe, expect, it } from "vitest";
import { calculateReadiness } from "../../../../src/modules/students/readiness.service";

const emptyStudent = { cgpa: null, resumeText: null, skills: [], projects: [], assessments: [], resumes: [] };

describe("calculateReadiness", () => {
  it("returns zero and the improvement label for an empty profile", () => {
    expect(calculateReadiness(emptyStudent).overallScore).toBe(0);
    expect(calculateReadiness(emptyStudent).readinessLabel).toBe("Needs Improvement");
  });

  it("applies the weighted profile score and tier label", () => {
    const result = calculateReadiness({
      cgpa: 10,
      resumeText: "skills education experience project github python machine learning sql ".repeat(20),
      skills: [{ level: "expert", years: 2, skill: { name: "TypeScript" } }],
      projects: [{ title: "App", description: "A project", githubUrl: "https://github.com/example", liveUrl: "https://example.com" }],
      assessments: [{ percentage: 100, passed: true }],
      resumes: [],
    });
    expect(result.overallScore).toBeGreaterThanOrEqual(99);
    expect(result.readinessLabel).toBe("Tier-1 Ready");
    expect(result.weights).toEqual({ technical: 30, assessment: 20, projects: 20, academics: 20, resume: 10 });
  });
});
