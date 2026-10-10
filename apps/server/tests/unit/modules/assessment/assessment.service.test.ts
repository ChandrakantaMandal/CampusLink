import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    recruiterProfile: { findUnique: vi.fn() },
    application: { findMany: vi.fn(), update: vi.fn() },
    assessment: { create: vi.fn() },
    assessmentResult: { findFirst: vi.fn(), create: vi.fn() },
  },
  redis: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
  generateObject: vi.fn(),
  mailer: { sendAssessmentLink: vi.fn() },
}));

vi.mock("../../../../src/services", () => ({ db: mocks.db }));
vi.mock("@CampusLink/redis", () => ({ redis: mocks.redis }));
vi.mock("../../../../src/env.server", () => ({
  ENV: {
    BETTER_AUTH_SECRET: "assessment-test-secret",
    GOOGLE_GENERATIVE_AI_API_KEY: "google-test-key",
  },
}));
vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: () => () => ({}),
}));
vi.mock("ai", () => ({ generateObject: mocks.generateObject }));
vi.mock("@CampusLink/auth/sendMail/mailer", () => ({
  createMailer: () => mocks.mailer,
}));

import {
  getAssessmentInvite,
  sendBatchAssessmentInvites,
  submitAssessmentInvite,
} from "../../../../src/modules/assessments/assessment.service";

const questionSet = () =>
  Array.from({ length: 10 }, (_, index) => ({
    prompt: `Question number ${index + 1}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
    explanation: "Option A is correct for this example.",
  }));

function makeToken(id: string) {
  const signature = createHmac("sha256", "assessment-test-secret")
    .update(id)
    .digest("hex");
  return `${id}.${signature}`;
}

function inviteState(overrides: Record<string, unknown> = {}) {
  return {
    applicationId: "application-1",
    studentId: "student-1",
    jobTitle: "Software Engineer",
    companyName: "CampusLink",
    questions: questionSet(),
    expiresAt: Date.now() + 60_000,
    ...overrides,
  };
}

describe("assessment invite service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BETTER_AUTH_SECRET = "assessment-test-secret";
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "google-test-key";
    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);
    mocks.db.assessmentResult.findFirst.mockResolvedValue(null);
    mocks.db.assessment.create.mockResolvedValue({ id: "assessment-1" });
    mocks.db.assessmentResult.create.mockResolvedValue({ id: "result-1" });
    mocks.db.application.update.mockResolvedValue({ id: "application-1" });
    mocks.generateObject.mockResolvedValue({
      object: { questions: questionSet() },
    });
    mocks.mailer.sendAssessmentLink.mockResolvedValue(undefined);
  });

  it("sends an invite, stores its state, and moves the shortlisted application to assessment", async () => {
    mocks.db.recruiterProfile.findUnique.mockResolvedValue({
      userId: "recruiter-1",
      companyId: "company-1",
      company: { name: "CampusLink" },
    });
    mocks.db.application.findMany.mockResolvedValue([
      {
        id: "application-1",
        studentId: "student-1",
        jobId: "job-1",
        job: {
          title: "Software Engineer",
          description: "Build applications",
          skills: [],
        },
        student: { user: { email: "student@example.com", name: "A Student" } },
      },
    ]);

    await expect(
      sendBatchAssessmentInvites(
        "recruiter-1",
        ["application-1"],
        "http://localhost:3001/",
      ),
    ).resolves.toEqual({ sent: 1, total: 1 });
    expect(mocks.redis.set).toHaveBeenCalledWith(
      expect.stringMatching(/^assessment:invite:/),
      expect.any(String),
      "EX",
      604800,
    );
    expect(mocks.mailer.sendAssessmentLink).toHaveBeenCalledWith(
      "student@example.com",
      "A Student",
      "Software Engineer",
      "CampusLink",
      expect.stringMatching(/^http:\/\/localhost:3001\/assessment\//),
    );
    expect(mocks.db.application.update).toHaveBeenCalledWith({
      where: { id: "application-1" },
      data: { status: "ASSESSMENT" },
    });
  });

  it("returns invite questions without revealing answers or explanations", async () => {
    const id = "invite-1";
    mocks.redis.get.mockResolvedValue(JSON.stringify(inviteState()));
    const result = await getAssessmentInvite(makeToken(id));
    expect(result).toMatchObject({
      jobTitle: "Software Engineer",
      companyName: "CampusLink",
      submitted: false,
    });
    expect("correctIndex" in result.questions![0]!).toBe(false);
    expect("explanation" in result.questions![0]!).toBe(false);
  });

  it("scores submitted answers, stores the review, and records a pass", async () => {
    const id = "invite-2";
    mocks.redis.get.mockResolvedValue(JSON.stringify(inviteState()));
    const result = await submitAssessmentInvite(
      makeToken(id),
      Array(10).fill(0),
    );
    expect(result).toMatchObject({ score: 10, total: 10, percentage: 100 });
    expect(mocks.db.assessmentResult.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ passed: true, score: 10 }),
      }),
    );
    expect(mocks.db.application.update).not.toHaveBeenCalled();
  });

  it("rejects an unsuccessful assessment application", async () => {
    mocks.redis.get.mockResolvedValue(JSON.stringify(inviteState()));
    await submitAssessmentInvite(makeToken("invite-3"), Array(10).fill(1));
    expect(mocks.db.application.update).toHaveBeenCalledWith({
      where: { id: "application-1" },
      data: { status: "REJECTED" },
    });
  });

  it("rejects invalid tokens and incomplete answers", async () => {
    await expect(getAssessmentInvite("invalid.token")).rejects.toThrow(
      "Invalid assessment link",
    );
    await expect(submitAssessmentInvite("id.signature", [0])).rejects.toThrow(
      "Answer all 10 questions",
    );
  });
});
