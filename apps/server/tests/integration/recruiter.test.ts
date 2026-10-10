import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

const mocks = vi.hoisted(() => ({
  getShortlistedCandidates: vi.fn(),
  getMyInterviews: vi.fn(),
  sendBatchAssessmentInvites: vi.fn(),
}));

vi.mock("../../src/modules/recruiter/recruiter.service", () => ({
  getRecruiterProfile: vi.fn(),
  updateRecruiterProfile: vi.fn(),
  createRecruiterProfile: vi.fn(),
  getMyJobs: vi.fn(),
  createMyJob: vi.fn(),
  deleteMyJob: vi.fn(),
  getMyInterviews: mocks.getMyInterviews,
  createInterview: vi.fn(),
  updateInterview: vi.fn(),
  getShortlistedCandidates: mocks.getShortlistedCandidates,
  getMyOffers: vi.fn(),
  createMyOffer: vi.fn(),
  sendMyOffer: vi.fn(),
  getMyOfferPdf: vi.fn(),
  getMyNotifications: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
  getRecruiterStats: vi.fn(),
}));
vi.mock("../../src/modules/assessments/assessment.service", () => ({
  sendBatchAssessmentInvites: mocks.sendBatchAssessmentInvites,
}));
vi.mock("../../src/env.server", () => ({
  ENV: { CORS_ORIGIN: "http://localhost:3001" },
}));
vi.mock("../../src/middleware/auth.middleware", () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { id: "recruiter-1" };
    next();
  },
}));
vi.mock("../../src/middleware/role.middleware", () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));
vi.mock("../../src/middleware/upload.middleware", () => ({
  uploadImageFile: (_req: any, _res: any, next: any) => next(),
}));

import recruiterRouter from "../../src/modules/recruiter/recruiter.routes";

const app = express();
app.use(express.json());
app.use("/api/recruiter", recruiterRouter);
app.use((error: Error, _req: any, res: any, _next: any) =>
  res.status(500).json({ success: false, message: error.message }),
);

describe("Recruiter API integration", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the recruiter's shortlisted candidates", async () => {
    mocks.getShortlistedCandidates.mockResolvedValue([{ id: "application-1" }]);
    const response = await request(app).get("/api/recruiter/shortlisted");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ id: "application-1" }]);
    expect(mocks.getShortlistedCandidates).toHaveBeenCalledWith("recruiter-1");
  });

  it("validates batch assessment selections before sending invites", async () => {
    const invalid = await request(app)
      .post("/api/recruiter/shortlisted/assessment-links")
      .send({ applicationIds: [] });
    expect(invalid.status).toBe(400);
    expect(mocks.sendBatchAssessmentInvites).not.toHaveBeenCalled();

    mocks.sendBatchAssessmentInvites.mockResolvedValue({ sent: 2, total: 2 });
    const response = await request(app)
      .post("/api/recruiter/shortlisted/assessment-links")
      .send({ applicationIds: ["app-1", "app-2"] });
    expect(response.status).toBe(200);
    expect(response.body.data.sent).toBe(2);
    expect(mocks.sendBatchAssessmentInvites).toHaveBeenCalledWith(
      "recruiter-1",
      ["app-1", "app-2"],
      "http://localhost:3001",
    );
  });

  it("lists recruiter's interviews", async () => {
    mocks.getMyInterviews.mockResolvedValue([{ id: "interview-1" }]);
    const response = await request(app).get("/api/recruiter/interviews");
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ id: "interview-1" }]);
  });
});
