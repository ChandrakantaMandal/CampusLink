import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
    studentProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    application: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    interview: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    offer: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    driveRegistration: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    placementDrive: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    userNotification: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    readinessResult: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    assessmentResult: {
      findMany: vi.fn(),
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

import {
  getStudentByUserId,
  getStudentById,
  updateStudent,
  getStudentDashboard,
  getStudentReadiness,
  getStudentDrives,
  getStudentInterviews,
  getStudentOffers,
  getStudentNotifications,
  isEligibleForDrive,
  registerForDrive,
} from "../../../../src/modules/students/student.service";

const student = {
  id: "student-1",
  userId: "user-1",
  firstName: "John",
  lastName: "Doe",
  college: "BPUT",
  department: null,
  branch: "CSE",
  graduationYear: 2026,
  cgpa: 8.5,
  backlogs: 0,
  readinessScore: 65,
  readinessLabel: "GOOD",
  resumeUrl: null,
  user: {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://example.com/avatar.png",
    role: "STUDENT",
  },
  skills: [],
  education: [],
  projects: [],
};

describe("Student Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStudentByUserId", () => {
    it("should return student from Redis cache when cache exists", async () => {
      const cachedStudent = {
        id: "student-1",
        userId: "user-1",
        name: "John Doe",
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(cachedStudent));

      const result = await getStudentByUserId("user-1");

      expect(result).toEqual(cachedStudent);
      expect(mocks.redis.get).toHaveBeenCalledWith("student:user:user-1");
      expect(mocks.db.studentProfile.findUnique).not.toHaveBeenCalled();
    });

    it("should fetch student from database when cache misses", async () => {
      const student = {
        id: "student-1",
        userId: "user-1",
        user: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          image: null,
          role: "STUDENT",
        },
        skills: [],
        education: [],
        projects: [],
      };

      mocks.redis.get.mockResolvedValue(null);
      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.redis.set.mockResolvedValue("OK");

      const result = await getStudentByUserId("user-1");

      expect(result).toEqual(student);

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          education: true,
          projects: {
            include: {
              skills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },
      });

      expect(mocks.redis.set).toHaveBeenCalledTimes(2);

      expect(mocks.redis.set).toHaveBeenNthCalledWith(
        1,
        "student:user:user-1",
        JSON.stringify(student),
        "EX",
        300,
      );

      expect(mocks.redis.set).toHaveBeenNthCalledWith(
        2,
        "student:student-1",
        JSON.stringify(student),
        "EX",
        300,
      );
    });

    it("should return null when student does not exist", async () => {
      mocks.redis.get.mockResolvedValue(null);
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);
      mocks.db.user.findUnique.mockResolvedValue(null);

      const result = await getStudentByUserId("user-1");

      expect(result).toBeNull();
      expect(mocks.db.studentProfile.create).not.toHaveBeenCalled();
      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should create a student profile when missing but the user exists", async () => {
      const createdStudent = {
        id: "student-1",
        userId: "user-1",
        firstName: "John",
        lastName: "Doe",
        skills: [],
        education: [],
        projects: [],
      };

      mocks.redis.get.mockResolvedValue(null);
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);
      mocks.db.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "STUDENT",
      });
      mocks.db.studentProfile.create.mockResolvedValue(createdStudent);
      mocks.redis.set.mockResolvedValue("OK");

      const result = await getStudentByUserId("user-1");

      expect(result).toEqual(createdStudent);

      expect(mocks.db.studentProfile.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          firstName: "John",
          lastName: "Doe",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          education: true,
          projects: {
            include: {
              skills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },
      });

      expect(mocks.redis.set).toHaveBeenCalledTimes(2);

      expect(mocks.redis.set).toHaveBeenNthCalledWith(
        1,
        "student:user:user-1",
        JSON.stringify(createdStudent),
        "EX",
        300,
      );

      expect(mocks.redis.set).toHaveBeenNthCalledWith(
        2,
        "student:student-1",
        JSON.stringify(createdStudent),
        "EX",
        300,
      );
    });

    it("should delete invalid JSON cache and fetch from database", async () => {
      const student = {
        id: "student-1",
        userId: "user-1",
      };

      mocks.redis.get.mockResolvedValue("invalid-json");
      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.redis.del.mockResolvedValue(1);
      mocks.redis.set.mockResolvedValue("OK");

      const result = await getStudentByUserId("user-1");

      expect(result).toEqual(student);

      expect(mocks.redis.del).toHaveBeenCalledWith("student:user:user-1");

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalled();
    });
  });

  describe("getStudentById", () => {
    it("should return student from Redis cache when cache exists", async () => {
      const cachedStudent = {
        id: "student-1",
        userId: "user-1",
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(cachedStudent));

      const result = await getStudentById("student-1");

      expect(result).toEqual(cachedStudent);

      expect(mocks.redis.get).toHaveBeenCalledWith("student:student-1");

      expect(mocks.db.studentProfile.findUnique).not.toHaveBeenCalled();
    });

    it("should fetch student from database when cache misses", async () => {
      const student = {
        id: "student-1",
        userId: "user-1",
        user: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          image: null,
          role: "STUDENT",
        },
        skills: [],
        education: [],
        projects: [],
      };

      mocks.redis.get.mockResolvedValue(null);
      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.redis.set.mockResolvedValue("OK");

      const result = await getStudentById("student-1");

      expect(result).toEqual(student);

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          id: "student-1",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          education: true,
          projects: {
            include: {
              skills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },
      });

      expect(mocks.redis.set).toHaveBeenCalledTimes(2);

      expect(mocks.redis.set).toHaveBeenNthCalledWith(
        1,
        "student:student-1",
        JSON.stringify(student),
        "EX",
        300,
      );

      expect(mocks.redis.set).toHaveBeenNthCalledWith(
        2,
        "student:user:user-1",
        JSON.stringify(student),
        "EX",
        300,
      );
    });

    it("should return null when student does not exist", async () => {
      mocks.redis.get.mockResolvedValue(null);
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      const result = await getStudentById("student-1");

      expect(result).toBeNull();
      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should delete invalid JSON cache and fetch from database", async () => {
      const student = {
        id: "student-1",
        userId: "user-1",
      };

      mocks.redis.get.mockResolvedValue("broken-json");
      mocks.db.studentProfile.findUnique.mockResolvedValue(student);
      mocks.redis.del.mockResolvedValue(1);
      mocks.redis.set.mockResolvedValue("OK");

      const result = await getStudentById("student-1");

      expect(result).toEqual(student);

      expect(mocks.redis.del).toHaveBeenCalledWith("student:student-1");
    });
  });

  describe("updateStudent", () => {
    it("should throw error when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);
      mocks.db.user.findUnique.mockResolvedValue(null);

      const updateData = {
        bio: "Updated bio",
      };

      await expect(updateStudent("user-1", updateData)).rejects.toThrow(
        "Student profile not found",
      );

      expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();

      expect(mocks.redis.del).not.toHaveBeenCalled();
    });

    it("should update student and invalidate both caches", async () => {
      const existingStudent = {
        id: "student-1",
        userId: "user-1",
      };

      const updatedStudent = {
        id: "student-1",
        userId: "user-1",
        bio: "Updated bio",
        user: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          image: null,
          role: "STUDENT",
        },
      };

      const updateData = {
        bio: "Updated bio",
      };

      mocks.db.studentProfile.findUnique.mockResolvedValue(existingStudent);

      mocks.db.studentProfile.update.mockResolvedValue(updatedStudent);

      mocks.redis.del.mockResolvedValue(2);

      const result = await updateStudent("user-1", updateData);

      expect(result).toEqual(updatedStudent);

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.studentProfile.update).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          education: true,
          projects: {
            include: {
              skills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "student:user:user-1",
        "student:student-1",
      );
    });

    it("should create the student profile when it is missing but the user exists", async () => {
      const createdStudent = {
        id: "student-1",
        userId: "user-1",
        firstName: "John",
        lastName: "Doe",
        bio: "Updated bio",
      };

      mocks.db.studentProfile.findUnique.mockResolvedValue(null);
      mocks.db.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "STUDENT",
      });
      mocks.db.studentProfile.create.mockResolvedValue(createdStudent);
      mocks.redis.del.mockResolvedValue(2);

      const updateData = {
        bio: "Updated bio",
      };

      const result = await updateStudent("user-1", updateData);

      expect(result).toEqual(createdStudent);

      expect(mocks.db.studentProfile.update).not.toHaveBeenCalled();

      expect(mocks.db.studentProfile.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          firstName: "John",
          lastName: "Doe",
          bio: "Updated bio",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          education: true,
          projects: {
            include: {
              skills: {
                include: {
                  skill: true,
                },
              },
            },
          },
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "student:user:user-1",
        "student:student-1",
      );
    });

    it("should invalidate cache using the existing student id", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue({
        id: "student-123",
        userId: "user-123",
      });

      mocks.db.studentProfile.update.mockResolvedValue({
        id: "student-123",
        userId: "user-123",
        bio: "New bio",
      });

      mocks.redis.del.mockResolvedValue(2);

      await updateStudent("user-123", {
        bio: "New bio",
      });

      expect(mocks.redis.del).toHaveBeenCalledTimes(1);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "student:user:user-123",
        "student:student-123",
      );
    });
  });
});

describe("Student Aggregates Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.db.studentProfile.findUnique.mockResolvedValue(student);
  });

  describe("getStudentDashboard", () => {
    it("should aggregate dashboard data and cache it with a 60s TTL on a miss", async () => {
      const recentApplication = {
        id: "app-1",
        status: "APPLIED",
        job: { id: "job-1", title: "SDE" },
      };
      const upcomingInterview = {
        id: "int-1",
        status: "SCHEDULED",
        job: { id: "job-1", title: "SDE" },
      };
      const recentNotification = { id: "notif-1", isRead: false };

      mocks.db.application.count.mockResolvedValue(12);
      mocks.db.application.findMany.mockResolvedValue([recentApplication]);
      mocks.db.interview.count.mockResolvedValue(4);
      mocks.db.interview.findMany.mockResolvedValue([upcomingInterview]);
      mocks.db.offer.count.mockResolvedValue(2);
      mocks.db.driveRegistration.count.mockResolvedValue(3);
      mocks.db.userNotification.count.mockResolvedValue(5);
      mocks.db.userNotification.findMany.mockResolvedValue([
        recentNotification,
      ]);
      mocks.db.readinessResult.findFirst.mockResolvedValue({
        overallScore: 72,
      });

      const result = await getStudentDashboard("user-1");

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        student: {
          id: "student-1",
          firstName: "John",
          lastName: "Doe",
          college: "BPUT",
          branch: "CSE",
          graduationYear: 2026,
          cgpa: 8.5,
          resumeUrl: null,
          image: "https://example.com/avatar.png",
        },
        stats: {
          applications: 12,
          interviews: 4,
          offers: 2,
          drivesRegistered: 3,
          unreadNotifications: 5,
          readinessScore: 72,
          readinessLabel: "GOOD",
        },
        recentApplications: [recentApplication],
        upcomingInterviews: [upcomingInterview],
        recentNotifications: [recentNotification],
      });

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "student:dashboard:user-1",
        JSON.stringify(result),
        "EX",
        60,
      );
    });

    it("should return the cached dashboard without hitting the database", async () => {
      const cached = { stats: { applications: 1 }, recentApplications: [] };

      mocks.redis.get.mockResolvedValue(JSON.stringify(cached));

      const result = await getStudentDashboard("user-1");

      expect(result).toEqual(cached);
      expect(mocks.redis.get).toHaveBeenCalledWith(
        "student:dashboard:user-1",
      );
      expect(mocks.db.studentProfile.findUnique).not.toHaveBeenCalled();
      expect(mocks.db.application.count).not.toHaveBeenCalled();
      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should return null when the student does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);
      mocks.db.user.findUnique.mockResolvedValue(null);

      const result = await getStudentDashboard("user-1");

      expect(result).toBeNull();
      expect(mocks.redis.set).not.toHaveBeenCalled();
      expect(mocks.db.application.count).not.toHaveBeenCalled();
    });
  });

  describe("getStudentReadiness", () => {
    it("should return readiness aggregates and cache with a 300s TTL", async () => {
      const latest = { id: "readiness-1", overallScore: 72 };
      const history = [latest, { id: "readiness-2", overallScore: 60 }];
      const recentAssessments = [
        { id: "ar-1", assessment: { id: "as-1", title: "Aptitude" } },
      ];

      mocks.db.readinessResult.findFirst.mockResolvedValue(latest);
      mocks.db.readinessResult.findMany.mockResolvedValue(history);
      mocks.db.assessmentResult.findMany.mockResolvedValue(
        recentAssessments,
      );

      const result = await getStudentReadiness("user-1");

      expect(result).toEqual({
        score: 72,
        label: "GOOD",
        latest,
        history,
        recentAssessments,
      });

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "student:readiness:user-1",
        JSON.stringify(result),
        "EX",
        300,
      );
    });

    it("should fall back to the stored readiness score when no result exists", async () => {
      mocks.db.readinessResult.findFirst.mockResolvedValue(null);
      mocks.db.readinessResult.findMany.mockResolvedValue([]);
      mocks.db.assessmentResult.findMany.mockResolvedValue([]);

      const result = await getStudentReadiness("user-1");

      expect(result?.score).toBe(65);
      expect(result?.latest).toBeNull();
      expect(result?.history).toEqual([]);
    });
  });

  describe("getStudentDrives", () => {
    it("should split registered and available drives with eligibility flags", async () => {
      const registeredDrive = {
        id: "drive-1",
        driveId: "drive-1",
        drive: {
          id: "drive-1",
          title: "Campus Drive A",
          minCgpa: 7.0,
          backlogsAllowed: 0,
          allowedBranches: ["CSE"],
          company: { id: "comp-1", name: "Acme" },
        },
      };
      const ineligibleDrive = {
        id: "drive-2",
        title: "Campus Drive B",
        minCgpa: 9.0,
        backlogsAllowed: 0,
        allowedBranches: ["CSE"],
        status: "OPEN",
        company: { id: "comp-2", name: "Globex" },
      };
      const eligibleDrive = {
        id: "drive-3",
        title: "Campus Drive C",
        minCgpa: 7.5,
        backlogsAllowed: 1,
        allowedBranches: [],
        status: "OPEN",
        company: { id: "comp-3", name: "Initech" },
      };

      mocks.db.driveRegistration.findMany.mockResolvedValue([
        registeredDrive,
      ]);
      mocks.db.placementDrive.findMany.mockResolvedValue([
        registeredDrive.drive,
        ineligibleDrive,
        eligibleDrive,
      ]);

      const result = await getStudentDrives("user-1");

      expect(result).not.toBeNull();
      expect(result?.registered).toHaveLength(1);
      expect(result?.registered[0]).toMatchObject({
        driveId: "drive-1",
        eligible: true,
      });

      // registered drive is excluded from available
      expect(result?.available.map((drive) => drive.id)).toEqual([
        "drive-2",
        "drive-3",
      ]);
      expect(result?.available[0]?.eligible).toBe(false);
      expect(result?.available[1]?.eligible).toBe(true);
      expect(result?.available[0]?.isRegistered).toBe(false);

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "student:drives:user-1",
        JSON.stringify(result),
        "EX",
        300,
      );
    });
  });

  describe("getStudentInterviews", () => {
    it("should split upcoming and past interviews and sort past descending", async () => {
      const pastInterview = {
        id: "int-past",
        scheduledDate: new Date("2026-01-10T10:00:00.000Z"),
        status: "COMPLETED",
      };
      const cancelledFuture = {
        id: "int-cancelled-future",
        scheduledDate: new Date("2027-01-10T10:00:00.000Z"),
        status: "CANCELLED",
      };
      const futureScheduled = {
        id: "int-future",
        scheduledDate: new Date("2028-01-10T10:00:00.000Z"),
        status: "SCHEDULED",
      };

      mocks.db.interview.findMany.mockResolvedValue([
        pastInterview,
        cancelledFuture,
        futureScheduled,
      ]);

      const result = await getStudentInterviews("user-1");

      expect(result?.upcoming.map((interview) => interview.id)).toEqual([
        "int-future",
      ]);

      expect(result?.past.map((interview) => interview.id)).toEqual([
        "int-cancelled-future",
        "int-past",
      ]);

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "student:interviews:user-1",
        JSON.stringify(result),
        "EX",
        60,
      );
    });

    it("should treat a future RESCHEDULED interview as upcoming", async () => {
      const rescheduled = {
        id: "int-rescheduled",
        scheduledDate: new Date("2028-06-01T10:00:00.000Z"),
        status: "RESCHEDULED",
      };

      mocks.db.interview.findMany.mockResolvedValue([rescheduled]);

      const result = await getStudentInterviews("user-1");

      expect(result?.upcoming).toHaveLength(1);
      expect(result?.past).toHaveLength(0);
    });
  });

  describe("getStudentOffers", () => {
    it("should return offers with total/accepted/pending stats", async () => {
      const offers = [
        { id: "offer-1", status: "ACCEPTED" },
        { id: "offer-2", status: "SENT" },
        { id: "offer-3", status: "PENDING_ACCEPTANCE" },
        { id: "offer-4", status: "DECLINED" },
      ];

      mocks.db.offer.findMany.mockResolvedValue(offers);

      const result = await getStudentOffers("user-1");

      expect(result).toEqual({
        offers,
        stats: {
          total: 4,
          accepted: 1,
          pending: 2,
        },
      });

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "student:offers:user-1",
        JSON.stringify(result),
        "EX",
        60,
      );
    });
  });

  describe("getStudentNotifications", () => {
    it("should return notifications with unread and total counts", async () => {
      const notifications = [
        { id: "notif-1", isRead: false },
        { id: "notif-2", isRead: true },
      ];

      mocks.db.userNotification.findMany.mockResolvedValue(notifications);
      mocks.db.userNotification.count
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(7);

      const result = await getStudentNotifications("user-1");

      expect(result).toEqual({
        notifications,
        unreadCount: 3,
        total: 7,
      });

      expect(mocks.db.userNotification.count).toHaveBeenNthCalledWith(1, {
        where: { userId: "user-1", isRead: false },
      });
      expect(mocks.db.userNotification.count).toHaveBeenNthCalledWith(2, {
        where: { userId: "user-1" },
      });

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "student:notifications:user-1",
        JSON.stringify(result),
        "EX",
        60,
      );
    });
  });

  describe("isEligibleForDrive", () => {
    const baseStudent = {
      cgpa: 8.5,
      backlogs: 0,
      branch: "CSE",
      department: null,
    };

    it("should pass when all criteria are met", () => {
      expect(
        isEligibleForDrive(baseStudent, {
          minCgpa: 8.0,
          backlogsAllowed: 0,
          allowedBranches: ["CSE"],
        }),
      ).toBe(true);
    });

    it("should fail when cgpa is below the minimum", () => {
      expect(
        isEligibleForDrive(baseStudent, {
          minCgpa: 9.0,
          backlogsAllowed: 0,
          allowedBranches: ["CSE"],
        }),
      ).toBe(false);
    });

    it("should skip the cgpa check when the student cgpa is null", () => {
      expect(
        isEligibleForDrive(
          { ...baseStudent, cgpa: null },
          {
            minCgpa: 9.0,
            backlogsAllowed: 0,
            allowedBranches: ["CSE"],
          },
        ),
      ).toBe(true);
    });

    it("should fail when backlogs exceed the allowed limit", () => {
      expect(
        isEligibleForDrive(
          { ...baseStudent, backlogs: 2 },
          {
            minCgpa: 7.0,
            backlogsAllowed: 0,
            allowedBranches: ["CSE"],
          },
        ),
      ).toBe(false);
    });

    it("should fail when the branch is not allowed", () => {
      expect(
        isEligibleForDrive(baseStudent, {
          minCgpa: 7.0,
          backlogsAllowed: 0,
          allowedBranches: ["ECE"],
        }),
      ).toBe(false);
    });

    it("should pass the branch check when the student branch is unknown", () => {
      expect(
        isEligibleForDrive(
          { ...baseStudent, branch: null, department: null },
          {
            minCgpa: 7.0,
            backlogsAllowed: 0,
            allowedBranches: ["CSE"],
          },
        ),
      ).toBe(true);
    });

    it("should pass when the drive has no branch restrictions", () => {
      expect(
        isEligibleForDrive(baseStudent, {
          minCgpa: 7.0,
          backlogsAllowed: 0,
          allowedBranches: [],
        }),
      ).toBe(true);
    });
  });

  describe("registerForDrive", () => {
    const drive = {
      id: "drive-1",
      title: "Campus Drive A",
      status: "OPEN",
      minCgpa: 7.0,
      backlogsAllowed: 0,
      allowedBranches: ["CSE"],
    };

    beforeEach(() => {
      mocks.redis.get.mockResolvedValue(JSON.stringify(student));
      mocks.db.placementDrive.findUnique.mockResolvedValue(drive);
      mocks.db.driveRegistration.findUnique.mockResolvedValue(null);
      mocks.db.driveRegistration.create.mockResolvedValue({
        id: "reg-1",
        driveId: "drive-1",
        studentId: "student-1",
        status: "REGISTERED",
        drive,
      });
    });

    it("should return 404 when the student profile is not found", async () => {
      mocks.redis.get.mockResolvedValue(null);
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);
      mocks.db.user.findUnique.mockResolvedValue(null);

      const result = await registerForDrive("user-1", "drive-1");

      expect(result).toEqual({
        ok: false,
        status: 404,
        message: "Student profile not found",
      });
      expect(mocks.db.placementDrive.findUnique).not.toHaveBeenCalled();
      expect(mocks.db.driveRegistration.create).not.toHaveBeenCalled();
    });

    it("should return 404 when the drive does not exist", async () => {
      mocks.db.placementDrive.findUnique.mockResolvedValue(null);

      const result = await registerForDrive("user-1", "missing-drive");

      expect(result).toEqual({
        ok: false,
        status: 404,
        message: "Drive not found",
      });
      expect(mocks.db.driveRegistration.findUnique).not.toHaveBeenCalled();
      expect(mocks.db.driveRegistration.create).not.toHaveBeenCalled();
    });

    it("should return the existing registration without creating a duplicate", async () => {
      mocks.db.driveRegistration.findUnique.mockResolvedValue({
        id: "reg-1",
        driveId: "drive-1",
        studentId: "student-1",
        status: "REGISTERED",
      });

      const result = await registerForDrive("user-1", "drive-1");

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.registration).toMatchObject({
          id: "reg-1",
          eligible: true,
        });
      }

      expect(mocks.db.driveRegistration.create).not.toHaveBeenCalled();
      expect(mocks.redis.del).not.toHaveBeenCalled();
    });

    it("should flag an existing registration as ineligible when criteria are no longer met", async () => {
      mocks.db.placementDrive.findUnique.mockResolvedValue({
        ...drive,
        minCgpa: 9.5,
      });
      mocks.db.driveRegistration.findUnique.mockResolvedValue({
        id: "reg-1",
        driveId: "drive-1",
        studentId: "student-1",
        status: "REGISTERED",
      });

      const result = await registerForDrive("user-1", "drive-1");

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.registration.eligible).toBe(false);
      }

      expect(mocks.db.driveRegistration.create).not.toHaveBeenCalled();
    });

    it("should return 409 when the drive is not open for registration", async () => {
      mocks.db.placementDrive.findUnique.mockResolvedValue({
        ...drive,
        status: "CLOSED",
      });

      const result = await registerForDrive("user-1", "drive-1");

      expect(result).toEqual({
        ok: false,
        status: 409,
        message: "Drive registration is closed (status: CLOSED)",
      });
      expect(mocks.db.driveRegistration.create).not.toHaveBeenCalled();
    });

    it("should return 403 when the student is not eligible", async () => {
      mocks.db.placementDrive.findUnique.mockResolvedValue({
        ...drive,
        minCgpa: 9.5,
      });

      const result = await registerForDrive("user-1", "drive-1");

      expect(result).toEqual({
        ok: false,
        status: 403,
        message: "You are not eligible for this drive",
      });
      expect(mocks.db.driveRegistration.create).not.toHaveBeenCalled();
      expect(mocks.redis.del).not.toHaveBeenCalled();
    });

    it("should create a registration and invalidate drives/dashboard caches on success", async () => {
      const result = await registerForDrive("user-1", "drive-1");

      expect(mocks.db.driveRegistration.create).toHaveBeenCalledWith({
        data: {
          driveId: "drive-1",
          studentId: "student-1",
        },
        include: {
          drive: {
            include: {
              company: {
                select: expect.any(Object),
              },
            },
          },
        },
      });

      expect(mocks.redis.del).toHaveBeenCalledWith("student:drives:user-1");
      expect(mocks.redis.del).toHaveBeenCalledWith("student:dashboard:user-1");

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.registration).toMatchObject({
          id: "reg-1",
          eligible: true,
        });
      }
    });
  });
});