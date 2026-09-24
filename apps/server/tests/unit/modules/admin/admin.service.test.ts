import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteUser,
  getApplications,
  getAssessmentStats,
  getCompanies,
  getDashboardStats,
  getJobs,
  getRecruiters,
  getStudents,
  getUserById,
  getUsers,
  updateUserRole,
} from "../../../../src/modules/admin/admin.service";

import { db } from "../../../../src/services";
import { redis } from "@HireBridge/redis";

vi.mock("../../../../src/services", () => ({
  db: {
    user: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    studentProfile: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    recruiterProfile: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    adminProfile: {
      count: vi.fn(),
    },
    company: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    job: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    application: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    assessment: {
      count: vi.fn(),
    },
    assessmentResult: {
      count: vi.fn(),
    },
  },
}));

vi.mock("@HireBridge/redis", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

describe("admin.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(redis.get).mockResolvedValue(null);
    vi.mocked(redis.set).mockResolvedValue("OK");
    vi.mocked(redis.del).mockResolvedValue(1);
  });

  describe("getDashboardStats", () => {
    it("should return cached dashboard stats", async () => {
      const cachedStats = {
        users: {
          total: 10,
          students: 6,
          recruiters: 3,
          admins: 1,
        },
        companies: 2,
        jobs: 5,
        applications: 20,
        assessments: 4,
      };

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(cachedStats));

      const result = await getDashboardStats();

      expect(result).toEqual(cachedStats);
      expect(db.user.count).not.toHaveBeenCalled();
      expect(redis.set).not.toHaveBeenCalled();
    });

    it("should fetch dashboard stats when cache is empty", async () => {
      vi.mocked(db.user.count).mockResolvedValue(10);
      vi.mocked(db.studentProfile.count).mockResolvedValue(6);
      vi.mocked(db.recruiterProfile.count).mockResolvedValue(3);
      vi.mocked(db.adminProfile.count).mockResolvedValue(1);
      vi.mocked(db.company.count).mockResolvedValue(2);
      vi.mocked(db.job.count).mockResolvedValue(5);
      vi.mocked(db.application.count).mockResolvedValue(20);
      vi.mocked(db.assessment.count).mockResolvedValue(4);

      const result = await getDashboardStats();

      expect(result).toEqual({
        users: {
          total: 10,
          students: 6,
          recruiters: 3,
          admins: 1,
        },
        companies: 2,
        jobs: 5,
        applications: 20,
        assessments: 4,
      });

      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getUsers", () => {
    it("should return cached users", async () => {
      const users = [
        {
          id: "user-1",
          name: "John",
          email: "john@example.com",
          role: "STUDENT",
        },
      ];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(users));

      const result = await getUsers();

      expect(result).toEqual(users);
      expect(db.user.findMany).not.toHaveBeenCalled();
    });

    it("should fetch users when cache is empty", async () => {
      const users = [
        {
          id: "user-1",
          name: "John",
          email: "john@example.com",
          role: "STUDENT",
        },
      ];

      vi.mocked(db.user.findMany).mockResolvedValue(users as never);

      const result = await getUsers();

      expect(result).toEqual(users);
      expect(db.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return cached user", async () => {
      const user = {
        id: "user-1",
        name: "John",
        email: "john@example.com",
        role: "STUDENT",
      };

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(user));

      const result = await getUserById("user-1");

      expect(result).toEqual(user);
      expect(db.user.findUnique).not.toHaveBeenCalled();
    });

    it("should fetch user from database when cache is empty", async () => {
      const user = {
        id: "user-1",
        name: "John",
        email: "john@example.com",
        role: "STUDENT",
      };

      vi.mocked(db.user.findUnique).mockResolvedValue(user as never);

      const result = await getUserById("user-1");

      expect(result).toEqual(user);
      expect(db.user.findUnique).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalled();
    });

    it("should return null when user does not exist", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      const result = await getUserById("unknown-user");

      expect(result).toBeNull();
      expect(redis.set).not.toHaveBeenCalled();
    });
  });

  describe("updateUserRole", () => {
    it("should throw an error when user does not exist", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      await expect(
        updateUserRole("unknown-user", {
          role: "ADMIN",
        }),
      ).rejects.toThrow("User not found");

      expect(db.user.update).not.toHaveBeenCalled();
    });

    it("should update user role and invalidate caches", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue({
        id: "user-1",
      } as never);

      const updatedUser = {
        id: "user-1",
        name: "John",
        email: "john@example.com",
        role: "ADMIN",
        updatedAt: new Date(),
      };

      vi.mocked(db.user.update).mockResolvedValue(updatedUser as never);

      const result = await updateUserRole("user-1", {
        role: "ADMIN",
      });

      expect(result).toEqual(updatedUser);

      expect(db.user.update).toHaveBeenCalledWith({
        where: {
          id: "user-1",
        },
        data: {
          role: "ADMIN",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          updatedAt: true,
        },
      });

      expect(redis.del).toHaveBeenCalledWith(
        "admin:user:user-1",
        "admin:users",
        "admin:students",
        "admin:recruiters",
        "admin:dashboard:stats",
      );
    });
  });

  describe("deleteUser", () => {
    it("should throw an error when user does not exist", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      await expect(deleteUser("unknown-user")).rejects.toThrow(
        "User not found",
      );

      expect(db.user.delete).not.toHaveBeenCalled();
    });

    it("should delete user and invalidate caches", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue({
        id: "user-1",
      } as never);

      vi.mocked(db.user.delete).mockResolvedValue({
        id: "user-1",
      } as never);

      const result = await deleteUser("user-1");

      expect(result).toEqual({
        id: "user-1",
      });

      expect(db.user.delete).toHaveBeenCalledWith({
        where: {
          id: "user-1",
        },
      });

      expect(redis.del).toHaveBeenCalled();
    });
  });

  describe("getStudents", () => {
    it("should return cached students", async () => {
      const students = [{ id: "student-1" }];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(students));

      const result = await getStudents();

      expect(result).toEqual(students);
      expect(db.studentProfile.findMany).not.toHaveBeenCalled();
    });

    it("should fetch students when cache is empty", async () => {
      const students = [{ id: "student-1" }];

      vi.mocked(db.studentProfile.findMany).mockResolvedValue(
        students as never,
      );

      const result = await getStudents();

      expect(result).toEqual(students);
      expect(db.studentProfile.findMany).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getRecruiters", () => {
    it("should return cached recruiters", async () => {
      const recruiters = [{ id: "recruiter-1" }];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(recruiters));

      const result = await getRecruiters();

      expect(result).toEqual(recruiters);
      expect(db.recruiterProfile.findMany).not.toHaveBeenCalled();
    });

    it("should fetch recruiters when cache is empty", async () => {
      const recruiters = [{ id: "recruiter-1" }];

      vi.mocked(db.recruiterProfile.findMany).mockResolvedValue(
        recruiters as never,
      );

      const result = await getRecruiters();

      expect(result).toEqual(recruiters);
      expect(db.recruiterProfile.findMany).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getCompanies", () => {
    it("should return cached companies", async () => {
      const companies = [{ id: "company-1" }];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(companies));

      const result = await getCompanies();

      expect(result).toEqual(companies);
      expect(db.company.findMany).not.toHaveBeenCalled();
    });

    it("should fetch companies when cache is empty", async () => {
      const companies = [{ id: "company-1" }];

      vi.mocked(db.company.findMany).mockResolvedValue(companies as never);

      const result = await getCompanies();

      expect(result).toEqual(companies);
      expect(db.company.findMany).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getJobs", () => {
    it("should return cached jobs", async () => {
      const jobs = [{ id: "job-1" }];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(jobs));

      const result = await getJobs();

      expect(result).toEqual(jobs);
      expect(db.job.findMany).not.toHaveBeenCalled();
    });

    it("should fetch jobs when cache is empty", async () => {
      const jobs = [{ id: "job-1" }];

      vi.mocked(db.job.findMany).mockResolvedValue(jobs as never);

      const result = await getJobs();

      expect(result).toEqual(jobs);
      expect(db.job.findMany).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getApplications", () => {
    it("should return cached applications", async () => {
      const applications = [{ id: "application-1" }];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(applications));

      const result = await getApplications();

      expect(result).toEqual(applications);
      expect(db.application.findMany).not.toHaveBeenCalled();
    });

    it("should fetch applications when cache is empty", async () => {
      const applications = [{ id: "application-1" }];

      vi.mocked(db.application.findMany).mockResolvedValue(
        applications as never,
      );

      const result = await getApplications();

      expect(result).toEqual(applications);
      expect(db.application.findMany).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("getAssessmentStats", () => {
    it("should return cached assessment stats", async () => {
      const stats = {
        totalAssessments: 10,
        totalResults: 20,
        passedResults: 15,
        failedResults: 5,
      };

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(stats));

      const result = await getAssessmentStats();

      expect(result).toEqual(stats);
      expect(db.assessment.count).not.toHaveBeenCalled();
      expect(db.assessmentResult.count).not.toHaveBeenCalled();
    });

    it("should fetch assessment stats when cache is empty", async () => {
      vi.mocked(db.assessment.count).mockResolvedValue(10);

      vi.mocked(db.assessmentResult.count)
        .mockResolvedValueOnce(20)
        .mockResolvedValueOnce(15)
        .mockResolvedValueOnce(5);

      const result = await getAssessmentStats();

      expect(result).toEqual({
        totalAssessments: 10,
        totalResults: 20,
        passedResults: 15,
        failedResults: 5,
      });

      expect(db.assessmentResult.count).toHaveBeenCalledTimes(3);
      expect(redis.set).toHaveBeenCalled();
    });
  });
});
