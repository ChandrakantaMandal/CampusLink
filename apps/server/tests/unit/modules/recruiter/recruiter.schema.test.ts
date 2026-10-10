import { describe, expect, it } from "vitest";

import {
  createInterviewSchema,
  createMyJobSchema,
  updateRecruiterProfileSchema,
} from "../../../../src/modules/recruiter/recruiter.schema";

describe("updateRecruiterProfileSchema", () => {
  it("should validate a valid update with profile and company fields", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      designation: "Talent Acquisition Lead",
      phone: "+91 9876543210",
      linkedinUrl: "https://linkedin.com/in/recruiter",
      isLeadRecruiter: true,
      company: {
        name: "CampusLink",
        description: "A hiring platform for campuses",
        website: "https://campuslink.example.com",
        logoUrl: "https://campuslink.example.com/logo.png",
        industry: "Human Resources",
        location: "Bhubaneswar, Odisha",
        linkedinUrl: "https://linkedin.com/company/campuslink",
        benefits: ["Health insurance", "Remote work"],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should allow an empty update", () => {
    const result = updateRecruiterProfileSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("should allow partial company updates", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { name: "New Name" },
    });

    expect(result.success).toBe(true);
  });

  it("should reject an invalid linkedinUrl", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      linkedinUrl: "not-a-url",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid company website", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { website: "nope" },
    });

    expect(result.success).toBe(false);
  });

  it("should reject a non-boolean isLeadRecruiter", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      isLeadRecruiter: "yes",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a company name shorter than 2 characters", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { name: "X" },
    });

    expect(result.success).toBe(false);
  });

  it("should reject more than 30 company benefits", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { benefits: Array.from({ length: 31 }, (_, i) => `b${i}`) },
    });

    expect(result.success).toBe(false);
  });

  it("should accept a valid company tier", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { tier: "TIER_1" },
    });

    expect(result.success).toBe(true);
  });

  it("should reject an invalid company tier", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { tier: "TIER_4" },
    });

    expect(result.success).toBe(false);
  });

  it("should allow an empty logoUrl to clear the logo", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { logoUrl: "" },
    });

    expect(result.success).toBe(true);
  });

  it("should allow a null logoUrl", () => {
    const result = updateRecruiterProfileSchema.safeParse({
      company: { logoUrl: null },
    });

    expect(result.success).toBe(true);
  });
});

describe("createMyJobSchema", () => {
  it("should validate a job with only required fields", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Build and maintain web applications for campus hiring.",
    });

    expect(result.success).toBe(true);
  });

  it("should validate a fully specified job", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Build and maintain web applications for campus hiring.",
      location: "Bhubaneswar",
      employmentType: "Full-time",
      workMode: "Hybrid",
      ctc: "12-18 LPA",
      openPositions: 3,
      minCGPA: 7.5,
      maxBacklogs: 0,
      requiredDegree: "B.Tech",
      requiredBranch: "CSE",
      allowedBranches: ["CSE", "IT"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      applicationDeadline: "2026-11-30",
      status: "PUBLISHED",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.applicationDeadline).toBeInstanceOf(Date);
    }
  });

  it("should reject a title shorter than 2 characters", () => {
    const result = createMyJobSchema.safeParse({
      title: "X",
      description: "Build and maintain web applications for campus hiring.",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Title must be at least 2 characters",
      );
    }
  });

  it("should reject a description shorter than 10 characters", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Short",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Description must be at least 10 characters",
      );
    }
  });

  it("should reject an invalid status", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Build and maintain web applications for campus hiring.",
      status: "OPEN",
    });

    expect(result.success).toBe(false);
  });

  it("should reject openPositions below 1", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Build and maintain web applications for campus hiring.",
      openPositions: 0,
    });

    expect(result.success).toBe(false);
  });

  it("should reject a CGPA above 10", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Build and maintain web applications for campus hiring.",
      minCGPA: 11,
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid application deadline", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Build and maintain web applications for campus hiring.",
      applicationDeadline: "not-a-date",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a non-string ctc", () => {
    const result = createMyJobSchema.safeParse({
      title: "Software Development Engineer",
      description: "Build and maintain web applications for campus hiring.",
      ctc: 1200000,
    });

    expect(result.success).toBe(false);
  });
});

describe("createInterviewSchema", () => {
  it("should validate an interview with only required fields", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.scheduledDate).toBeInstanceOf(Date);
    }
  });

  it("should validate a fully specified interview", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      jobId: "job-123",
      applicationId: "app-123",
      roundName: "HR Round",
      roundNumber: 2,
      scheduledDate: "2026-10-05",
      startTime: "10:00",
      endTime: "11:00",
      durationMinutes: 60,
      mode: "VIRTUAL",
      venue: "Campus Hall 2",
      meetingLink: "https://meet.example.com/room",
      interviewerName: "Jane Doe",
      interviewerEmail: "jane@example.com",
      interviewerPanel: ["Alice", "Bob"],
    });

    expect(result.success).toBe(true);
  });

  it("should reject a missing studentId", () => {
    const result = createInterviewSchema.safeParse({
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an empty studentId", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Student ID is required");
    }
  });

  it("should reject an empty roundName", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "",
      scheduledDate: "2026-10-05",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a missing scheduledDate", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid scheduledDate", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "not-a-date",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid mode", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
      mode: "PHONE",
    });

    expect(result.success).toBe(false);
  });

  it("should reject a non-integer roundNumber", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
      roundNumber: 1.5,
    });

    expect(result.success).toBe(false);
  });

  it("should reject roundNumber below 1", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
      roundNumber: 0,
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid meetingLink", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
      meetingLink: "not-a-url",
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid interviewerEmail", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
      interviewerEmail: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("should reject more than 20 interviewerPanel members", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
      interviewerPanel: Array.from({ length: 21 }, (_, i) => `member-${i}`),
    });

    expect(result.success).toBe(false);
  });

  it("should reject durationMinutes below 5", () => {
    const result = createInterviewSchema.safeParse({
      studentId: "student-123",
      roundName: "Technical Round",
      scheduledDate: "2026-10-05",
      durationMinutes: 3,
    });

    expect(result.success).toBe(false);
  });
});
