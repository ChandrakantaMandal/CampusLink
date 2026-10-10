import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAssessmentInvite: vi.fn(),
  submitAssessmentInvite: vi.fn(),
}));

vi.mock("../../src/modules/assessments/assessment.service", () => mocks);

import assessmentRouter from "../../src/modules/assessments/assessment.routes";

const app = express();
app.use(express.json());
app.use("/api/assessments", assessmentRouter);

describe("Assessment invite API integration", () => {
  it("loads an invite by token", async () => {
    mocks.getAssessmentInvite.mockResolvedValue({
      jobTitle: "Engineer",
      submitted: false,
      questions: [],
    });
    const response = await request(app).get(
      "/api/assessments/invite/token-value",
    );
    expect(response.status).toBe(200);
    expect(mocks.getAssessmentInvite).toHaveBeenCalledWith("token-value");
  });

  it("rejects malformed answer submissions before calling the service", async () => {
    const response = await request(app)
      .post("/api/assessments/invite/token-value/submit")
      .send({ answers: [0] });
    expect(response.status).toBe(400);
    expect(mocks.submitAssessmentInvite).not.toHaveBeenCalled();
  });

  it("submits exactly ten answers", async () => {
    mocks.submitAssessmentInvite.mockResolvedValue({
      score: 8,
      total: 10,
      percentage: 80,
      review: [],
    });
    const response = await request(app)
      .post("/api/assessments/invite/token-value/submit")
      .send({ answers: Array(10).fill(0) });
    expect(response.status).toBe(200);
    expect(mocks.submitAssessmentInvite).toHaveBeenCalledWith(
      "token-value",
      Array(10).fill(0),
    );
  });
});
