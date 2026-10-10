import { Prisma } from "@CampusLink/db";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    $transaction: vi.fn(),

    recruiterProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },

    company: {
      update: vi.fn(),
    },

    studentProfile: {
      findUnique: vi.fn(),
    },

    job: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      create: vi.fn(),
    },

    skill: {
      findMany: vi.fn(),
      create: vi.fn(),
    },

    jobSkill: {
      create: vi.fn(),
    },

    application: {
      groupBy: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },

    assessmentResult: {
      findFirst: vi.fn(),
    },

    offer: {
      groupBy: vi.fn(),
    },

    interview: {
      findMany: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
    },
  },

  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

vi.mock("../../../../src/services", () => ({
  db: mocks.db,
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

mocks.db.$transaction.mockImplementation(
  async (fn: (tx: typeof mocks.db) => Promise<unknown>) => fn(mocks.db),
);

import {
  createInterview,
  createMyJob,
  getMyInterviews,
  getMyJobs,
  getRecruiterProfile,
  getShortlistedCandidates,
  updateRecruiterProfile,
} from "../../../../src/modules/recruiter/recruiter.service";

const recruiter = {
  id: "recruiter-123",
  userId: "user-123",
  companyId: "company-123",
};

const passedApplication = {
  id: "app-123",
  studentId: "stu-1",
  jobId: "job-123",
  status: "SHORTLISTED",
  job: {
    id: "job-123",
    title: "SDE",
    companyId: "company-123",
  },
  student: {
    id: "stu-1",
    assessments: [],
  },
};

describe("recruiter.service", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mocks.db.$transaction.mockImplementation(
      async (fn: (tx: typeof mocks.db) => Promise<unknown>) => fn(mocks.db),
    );

    mocks.db.application.findFirst.mockResolvedValue(passedApplication);

    mocks.db.assessmentResult.findFirst.mockResolvedValue({
      id: "assessment-result-1",
      studentId: "stu-1",
      status: "PASSED",
      passed: true,
      score: 85,
    });
  });

  describe("getRecruiterProfile", () => {
    it("should return the recruiter profile with company and counts", async () => {
      const profile = {
        ...recruiter,
        company: { id: "company-123", name: "CampusLink" },
      };

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(profile);

      const result = await getRecruiterProfile("user-123");

      expect(result).toEqual(profile);

      expect(mocks.db.recruiterProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        include: {
          company: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              jobs: true,
              interviews: true,
            },
          },
        },
      });
    });

    it("should return null when profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const result = await getRecruiterProfile("user-123");

      expect(result).toBeNull();
    });
  });

  describe("updateRecruiterProfile", () => {
    it("should return null when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const result = await updateRecruiterProfile("user-123", {
        designation: "Talent Acquisition Lead",
      });

      expect(result).toBeNull();
      expect(mocks.db.recruiterProfile.update).not.toHaveBeenCalled();
      expect(mocks.db.company.update).not.toHaveBeenCalled();
    });

    it("should update profile fields and company fields together", async () => {
      const updatedProfile = {
        ...recruiter,
        designation: "Talent Acquisition Lead",
        company: { id: "company-123", name: "New Name" },
      };

      mocks.db.recruiterProfile.findUnique
        .mockResolvedValueOnce(recruiter)
        .mockResolvedValueOnce(updatedProfile);

      const result = await updateRecruiterProfile("user-123", {
        designation: "Talent Acquisition Lead",
        phone: "+91 9876543210",
        company: { name: "New Name" },
      });

      expect(result).toEqual(updatedProfile);

      expect(mocks.db.recruiterProfile.update).toHaveBeenCalledWith({
        where: { id: "recruiter-123" },
        data: {
          designation: "Talent Acquisition Lead",
          phone: "+91 9876543210",
        },
      });

      expect(mocks.db.company.update).toHaveBeenCalledWith({
        where: { id: "company-123" },
        data: { name: "New Name" },
      });
    });

    it("should update only company fields when only company is provided", async () => {
      const updatedProfile = {
        ...recruiter,
        company: {
          id: "company-123",
          website: "https://example.com",
        },
      };

      mocks.db.recruiterProfile.findUnique
        .mockResolvedValueOnce(recruiter)
        .mockResolvedValueOnce(updatedProfile);

      const result = await updateRecruiterProfile("user-123", {
        company: { website: "https://example.com" },
      });

      expect(result).toEqual(updatedProfile);
      expect(mocks.db.recruiterProfile.update).not.toHaveBeenCalled();

      expect(mocks.db.company.update).toHaveBeenCalledWith({
        where: { id: "company-123" },
        data: { website: "https://example.com" },
      });
    });

    it("should update only profile fields when no company is provided", async () => {
      const updatedProfile = {
        ...recruiter,
        isLeadRecruiter: true,
      };

      mocks.db.recruiterProfile.findUnique
        .mockResolvedValueOnce(recruiter)
        .mockResolvedValueOnce(updatedProfile);

      const result = await updateRecruiterProfile("user-123", {
        isLeadRecruiter: true,
      });

      expect(result).toEqual(updatedProfile);

      expect(mocks.db.recruiterProfile.update).toHaveBeenCalledWith({
        where: { id: "recruiter-123" },
        data: { isLeadRecruiter: true },
      });

      expect(mocks.db.company.update).not.toHaveBeenCalled();
    });
  });

  describe("getMyJobs", () => {
    it("should return an empty array when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const result = await getMyJobs("user-123");

      expect(result).toEqual([]);
      expect(mocks.db.job.findMany).not.toHaveBeenCalled();
    });

    it("should map applicants, shortlist, interview and offer counts", async () => {
      const jobs = [
        {
          id: "job-1",
          title: "SDE",
          _count: { applications: 5, interviews: 2 },
        },
        {
          id: "job-2",
          title: "Analyst",
          _count: { applications: 0, interviews: 0 },
        },
      ];

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.job.findMany.mockResolvedValue(jobs);

      mocks.db.application.groupBy.mockResolvedValue([
        { jobId: "job-1", _count: { _all: 3 } },
      ]);

      mocks.db.offer.groupBy.mockResolvedValue([
        { jobId: "job-1", _count: { _all: 1 } },
      ]);

      const result = await getMyJobs("user-123");

      expect(result).toHaveLength(2);
      expect(result[0]?.applicantsCount).toBe(5);
      expect(result[0]?.shortlistedCount).toBe(3);
      expect(result[0]?.interviewCount).toBe(2);
      expect(result[0]?.offersCount).toBe(1);
      expect(result[1]?.applicantsCount).toBe(0);
      expect(result[1]?.shortlistedCount).toBe(0);
      expect(result[1]?.offersCount).toBe(0);

      expect(mocks.db.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { companyId: "company-123" },
        }),
      );

      expect(mocks.db.application.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: "SHORTLISTED",
            job: { companyId: "company-123" },
          },
        }),
      );

      expect(mocks.db.offer.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { companyId: "company-123" },
        }),
      );
    });
  });

  describe("createMyJob", () => {
    it("should throw when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      await expect(
        createMyJob("user-123", {
          title: "SDE",
          description: "A full stack software engineer role",
        }),
      ).rejects.toThrow("Recruiter profile not found");

      expect(mocks.db.job.create).not.toHaveBeenCalled();
    });

    it("should create a job scoped to the recruiter's company", async () => {
      const job = {
        id: "job-123",
        title: "SDE",
        companyId: "company-123",
      };

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.job.create.mockResolvedValue(job);
      mocks.db.job.findUniqueOrThrow.mockResolvedValue(job);

      const result = await createMyJob("user-123", {
        title: "SDE",
        description: "A full stack software engineer role",
        ctc: "12-18 LPA",
        status: "DRAFT",
      });

      expect(result).toEqual(job);

      expect(mocks.db.job.create).toHaveBeenCalledWith({
        data: {
          title: "SDE",
          description: "A full stack software engineer role",
          ctc: "12-18 LPA",
          companyId: "company-123",
          recruiterId: "recruiter-123",
          status: "DRAFT",
        },
      });
    });

    it("should omit status when not provided so the Prisma default applies", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.job.create.mockResolvedValue({ id: "job-456" });
      mocks.db.job.findUniqueOrThrow.mockResolvedValue({ id: "job-456" });

      await createMyJob("user-123", {
        title: "Analyst",
        description: "A data analyst role for freshers",
      });

      const createArgs = mocks.db.job.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };

      expect(createArgs.data).not.toHaveProperty("status");
      expect(createArgs.data.companyId).toBe("company-123");
      expect(createArgs.data.recruiterId).toBe("recruiter-123");
    });

    it("should dedupe, reuse and link required skills for the job", async () => {
      const job = { id: "job-789", title: "SDE" };

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.job.create.mockResolvedValue(job);

      mocks.db.skill.findMany.mockResolvedValue([
        {
          id: "skill-python",
          name: "Python",
          normalized: "python",
        },
      ]);

      mocks.db.skill.create.mockResolvedValue({
        id: "skill-sql",
        name: "SQL",
        normalized: "sql",
      });

      mocks.db.job.findUniqueOrThrow.mockResolvedValue({
        ...job,
        skills: [],
      });

      await createMyJob("user-123", {
        title: "SDE",
        description: "A full stack software engineer role",
        requiredSkills: ["Python", "SQL", "python"],
      });

      expect(mocks.db.skill.findMany).toHaveBeenCalledWith({
        where: { normalized: { in: ["python", "sql"] } },
      });

      expect(mocks.db.skill.create).toHaveBeenCalledTimes(1);

      expect(mocks.db.skill.create).toHaveBeenCalledWith({
        data: {
          name: "SQL",
          normalized: "sql",
          type: "OTHER",
        },
      });

      expect(mocks.db.jobSkill.create).toHaveBeenCalledTimes(2);

      expect(mocks.db.jobSkill.create).toHaveBeenCalledWith({
        data: {
          jobId: "job-789",
          skillId: "skill-sql",
        },
      });

      expect(mocks.db.job.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: "job-789" },
        include: {
          skills: {
            include: {
              skill: {
                select: { name: true },
              },
            },
          },
        },
      });
    });
  });

  describe("getMyInterviews", () => {
    it("should return an empty array when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const result = await getMyInterviews("user-123");

      expect(result).toEqual([]);
      expect(mocks.db.interview.findMany).not.toHaveBeenCalled();
    });

    it("should flag overlapping same-day interviews for the same student", async () => {
      const interviews = [
        {
          id: "int-1",
          studentId: "stu-1",
          scheduledDate: new Date("2026-10-05T09:00:00.000Z"),
          startTime: "10:00",
          endTime: "11:00",
          durationMinutes: null,
          roundName: "Round 1",
          job: { title: "SDE" },
        },
        {
          id: "int-2",
          studentId: "stu-1",
          scheduledDate: new Date("2026-10-05T14:00:00.000Z"),
          startTime: "10:30",
          endTime: "11:30",
          durationMinutes: null,
          roundName: "Round 2",
          job: { title: "SDE" },
        },
      ];

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.interview.findMany.mockResolvedValue(interviews);

      const result = await getMyInterviews("user-123");

      expect(result).toHaveLength(2);
      expect(result[0]?.hasConflict).toBe(true);
      expect(result[0]?.conflictDetails).toContain("Overlaps with SDE");
      expect(result[0]?.conflictDetails).toContain("10:30");
      expect(result[1]?.hasConflict).toBe(true);
      expect(result[1]?.conflictDetails).toContain("10:00");
    });

    it("should not flag back-to-back or different-day interviews", async () => {
      const interviews = [
        {
          id: "int-1",
          studentId: "stu-1",
          scheduledDate: new Date("2026-10-05T09:00:00.000Z"),
          startTime: "10:00",
          endTime: "11:00",
          durationMinutes: null,
          roundName: "Round 1",
          job: { title: "SDE" },
        },
        {
          id: "int-2",
          studentId: "stu-1",
          scheduledDate: new Date("2026-10-05T12:00:00.000Z"),
          startTime: "11:00",
          endTime: "12:00",
          durationMinutes: null,
          roundName: "Round 2",
          job: { title: "SDE" },
        },
        {
          id: "int-3",
          studentId: "stu-1",
          scheduledDate: new Date("2026-10-06T09:00:00.000Z"),
          startTime: "10:00",
          endTime: "11:00",
          durationMinutes: null,
          roundName: "Round 3",
          job: { title: "SDE" },
        },
      ];

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.interview.findMany.mockResolvedValue(interviews);

      const result = await getMyInterviews("user-123");

      expect(result[0]?.hasConflict).toBe(false);
      expect(result[0]?.conflictDetails).toBeNull();
      expect(result[1]?.hasConflict).toBe(false);
      expect(result[2]?.hasConflict).toBe(false);
    });

    it("should not flag interviews for different students on the same day", async () => {
      const interviews = [
        {
          id: "int-1",
          studentId: "stu-1",
          scheduledDate: new Date("2026-10-05T09:00:00.000Z"),
          startTime: "10:00",
          endTime: "11:00",
          durationMinutes: null,
          roundName: "Round 1",
          job: { title: "SDE" },
        },
        {
          id: "int-2",
          studentId: "stu-2",
          scheduledDate: new Date("2026-10-05T09:00:00.000Z"),
          startTime: "10:00",
          endTime: "11:00",
          durationMinutes: null,
          roundName: "Round 1",
          job: { title: "SDE" },
        },
      ];

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.interview.findMany.mockResolvedValue(interviews);

      const result = await getMyInterviews("user-123");

      expect(result[0]?.hasConflict).toBe(false);
      expect(result[1]?.hasConflict).toBe(false);
    });
  });

  describe("createInterview", () => {
    it("should throw when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      await expect(
        createInterview("user-123", {
          studentId: "stu-1",
          roundName: "Round 1",
          scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        }),
      ).rejects.toThrow("Recruiter profile not found");

      expect(mocks.db.studentProfile.findUnique).not.toHaveBeenCalled();
      expect(mocks.db.interview.create).not.toHaveBeenCalled();
    });

    it("should throw when student does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        createInterview("user-123", {
          studentId: "stu-1",
          roundName: "Round 1",
          scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        }),
      ).rejects.toThrow("Student not found");

      expect(mocks.db.interview.create).not.toHaveBeenCalled();
    });

    it("should throw when job does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.studentProfile.findUnique.mockResolvedValue({ id: "stu-1" });
      mocks.db.job.findUnique.mockResolvedValue(null);

      await expect(
        createInterview("user-123", {
          studentId: "stu-1",
          jobId: "job-123",
          roundName: "Round 1",
          scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        }),
      ).rejects.toThrow("Job not found");

      expect(mocks.db.interview.create).not.toHaveBeenCalled();
    });

    it("should reject a job belonging to another company", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.studentProfile.findUnique.mockResolvedValue({ id: "stu-1" });

      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-123",
        companyId: "other-company",
      });

      await expect(
        createInterview("user-123", {
          studentId: "stu-1",
          jobId: "job-123",
          roundName: "Round 1",
          scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        }),
      ).rejects.toThrow("Job not found");

      expect(mocks.db.interview.create).not.toHaveBeenCalled();
    });

    it("should throw when application does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.studentProfile.findUnique.mockResolvedValue({ id: "stu-1" });
      mocks.db.application.findUnique.mockResolvedValue(null);

      await expect(
        createInterview("user-123", {
          studentId: "stu-1",
          applicationId: "app-123",
          roundName: "Round 1",
          scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        }),
      ).rejects.toThrow("Application not found");

      expect(mocks.db.interview.create).not.toHaveBeenCalled();
    });

    it("should throw when application belongs to a different student", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.studentProfile.findUnique.mockResolvedValue({ id: "stu-1" });

      mocks.db.application.findUnique.mockResolvedValue({
        id: "app-123",
        studentId: "stu-2",
        job: { title: "SDE" },
      });

      await expect(
        createInterview("user-123", {
          studentId: "stu-1",
          applicationId: "app-123",
          roundName: "Round 1",
          scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        }),
      ).rejects.toThrow("Application not found");

      expect(mocks.db.interview.create).not.toHaveBeenCalled();
    });

    it("should derive jobId from the application when jobId is omitted", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "stu-1",
        assessments: [],
      });

      const application = {
        ...passedApplication,
        jobId: "job-9",
        job: {
          id: "job-9",
          title: "Analyst",
          companyId: "company-123",
        },
      };

      mocks.db.application.findUnique.mockResolvedValue(application);
      mocks.db.application.findFirst.mockResolvedValue(application);
      mocks.db.interview.findMany.mockResolvedValue([]);
      mocks.db.interview.create.mockResolvedValue({ id: "int-123" });

      await createInterview("user-123", {
        studentId: "stu-1",
        applicationId: "app-123",
        roundName: "Round 1",
        scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
      });

      expect(mocks.db.job.findUnique).not.toHaveBeenCalled();

      const createArgs = mocks.db.interview.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };

      expect(createArgs.data.jobId).toBe("job-9");
      expect(createArgs.data.applicationId).toBe("app-123");
    });

    it("should create an interview with conflict detection and joined panel", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);

      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "stu-1",
        assessments: [],
      });

      mocks.db.job.findUnique.mockResolvedValue({
        id: "job-123",
        companyId: "company-123",
        title: "SDE",
      });

      mocks.db.application.findUnique.mockResolvedValue(passedApplication);
      mocks.db.application.findFirst.mockResolvedValue(passedApplication);

      mocks.db.interview.findMany.mockResolvedValue([
        {
          id: "int-existing",
          studentId: "stu-1",
          scheduledDate: new Date("2026-10-05T09:00:00.000Z"),
          startTime: "10:30",
          endTime: "11:30",
          durationMinutes: null,
          roundName: "Technical Round",
          job: { title: "SDE" },
        },
      ]);

      mocks.db.interview.create.mockResolvedValue({ id: "int-123" });

      await createInterview("user-123", {
        studentId: "stu-1",
        jobId: "job-123",
        applicationId: "app-123",
        roundName: "HR Round",
        scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        startTime: "10:00",
        endTime: "11:00",
        interviewerPanel: ["Alice", "Bob"],
      });

      expect(mocks.db.interview.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ studentId: "stu-1" }),
        }),
      );

      const createArgs = mocks.db.interview.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };

      expect(createArgs.data.hasConflict).toBe(true);

      expect(String(createArgs.data.conflictDetails)).toContain(
        "Overlaps with SDE (10:30",
      );

      expect(createArgs.data.interviewerPanel).toBe("Alice, Bob");
      expect(createArgs.data.recruiterId).toBe("recruiter-123");
      expect(createArgs.data.jobId).toBe("job-123");
      expect(createArgs.data.mode).toBe("VIRTUAL");

      expect(mocks.db.interview.updateMany).toHaveBeenCalledTimes(1);

      expect(mocks.db.interview.updateMany).toHaveBeenCalledWith({
        where: { id: "int-existing" },
        data: {
          hasConflict: true,
          conflictDetails: expect.any(String),
        },
      });
    });

    it("should create an interview without conflicts when the slot is free", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);

      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "stu-1",
        assessments: [],
      });

      mocks.db.application.findUnique.mockResolvedValue(passedApplication);
      mocks.db.application.findFirst.mockResolvedValue(passedApplication);
      mocks.db.interview.findMany.mockResolvedValue([]);
      mocks.db.interview.create.mockResolvedValue({ id: "int-456" });

      await createInterview("user-123", {
        studentId: "stu-1",
        applicationId: "app-123",
        roundName: "Round 1",
        scheduledDate: new Date("2026-10-05T00:00:00.000Z"),
        startTime: "10:00",
        endTime: "11:00",
        mode: "IN_PERSON",
        venue: "Campus Hall 2",
      });

      const createArgs = mocks.db.interview.create.mock.calls[0]?.[0] as {
        data: Record<string, unknown>;
      };

      expect(createArgs.data.hasConflict).toBe(false);
      expect(createArgs.data.conflictDetails).toBe(Prisma.DbNull);
      expect(createArgs.data.mode).toBe("IN_PERSON");
      expect(createArgs.data.venue).toBe("Campus Hall 2");

      expect(mocks.db.interview.updateMany).not.toHaveBeenCalled();
    });
  });

  describe("getShortlistedCandidates", () => {
    it("should return an empty array when recruiter profile does not exist", async () => {
      mocks.db.recruiterProfile.findUnique.mockResolvedValue(null);

      const result = await getShortlistedCandidates("user-123");

      expect(result).toEqual([]);
      expect(mocks.db.application.findMany).not.toHaveBeenCalled();
    });

    it("should return shortlisted applications scoped to the company", async () => {
      const applications = [
        {
          id: "app-1",
          status: "SHORTLISTED",
          assessmentOutcome: null,
          job: {
            id: "job-1",
            title: "SDE",
          },
          student: {
            id: "stu-1",
            assessments: [],
            user: {
              id: "user-1",
              name: "Asha",
            },
          },
        },
      ];

      mocks.db.recruiterProfile.findUnique.mockResolvedValue(recruiter);
      mocks.db.application.findMany.mockResolvedValue(applications as never);

      const result = await getShortlistedCandidates("user-123");

      const application = applications[0];

      if (!application) {
        throw new Error("Expected at least one application");
      }

      const { assessments: _assessments, ...expectedStudent } =
        application.student;

      expect(result).toEqual([
        {
          ...application,
          student: expectedStudent,
        },
      ]);

      expect(mocks.db.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: {
              in: ["SHORTLISTED", "ASSESSMENT"],
            },
            job: {
              companyId: "company-123",
            },
          },
          orderBy: {
            appliedAt: "desc",
          },
        }),
      );
    });
  });
});
