import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createPlacementDrive,
  deletePlacementDrive,
  deleteUser,
  getApplications,
  getAssessmentStats,
  getCompanies,
  getDashboardStats,
  getDrives,
  getDriveById,
  getJobs,
  getOffers,
  getRecruiters,
  getStudents,
  getUserById,
  getUsers,
  updatePlacementDrive,
} from "../../../../src/modules/admin/admin.service";

import { db } from "../../../../src/services";
import { redis } from "@CampusLink/redis";

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
      findUnique: vi.fn(),
    },
    placementDrive: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
    offer: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@CampusLink/redis", () => ({
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
      vi.mocked(db.placementDrive.count).mockResolvedValue(3);

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
        drives: 3,
        offers: 20,
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

  describe("getDrives", () => {
    it("should return cached drives", async () => {
      const drives = [{ id: "drive-1" }];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(drives));

      const result = await getDrives();

      expect(result).toEqual(drives);
      expect(db.placementDrive.findMany).not.toHaveBeenCalled();
      expect(redis.set).not.toHaveBeenCalled();
    });

    it("should fetch drives when cache is empty", async () => {
      const drives = [{ id: "drive-1" }];

      vi.mocked(db.placementDrive.findMany).mockResolvedValue(
        drives as never,
      );

      const result = await getDrives();

      expect(result).toEqual(drives);
      expect(db.placementDrive.findMany).toHaveBeenCalledWith({
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              industry: true,
              tier: true,
            },
          },
          _count: {
            select: {
              registrations: true,
              jobs: true,
            },
          },
          jobs: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          driveDate: "desc",
        },
      });
      expect(redis.set).toHaveBeenCalledWith(
        "admin:drives",
        JSON.stringify(drives),
        "EX",
        300,
      );
    });
  });

  describe("getDriveById", () => {
    it("should return cached drive", async () => {
      const drive = { id: "drive-1", title: "SDE Intern" };

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(drive));

      const result = await getDriveById("drive-1");

      expect(result).toEqual(drive);
      expect(db.placementDrive.findUnique).not.toHaveBeenCalled();
      expect(redis.set).not.toHaveBeenCalled();
    });

    it("should fetch drive from database when cache is empty", async () => {
      const drive = { id: "drive-1", title: "SDE Intern" };

      vi.mocked(db.placementDrive.findUnique).mockResolvedValue(
        drive as never,
      );

      const result = await getDriveById("drive-1");

      expect(result).toEqual(drive);
      expect(db.placementDrive.findUnique).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalledWith(
        "admin:drive:drive-1",
        JSON.stringify(drive),
        "EX",
        300,
      );
    });

    it("should return null when drive does not exist", async () => {
      vi.mocked(db.placementDrive.findUnique).mockResolvedValue(null);

      const result = await getDriveById("unknown-drive");

      expect(result).toBeNull();
      expect(redis.set).not.toHaveBeenCalled();
    });
  });

  describe("getOffers", () => {
    it("should return cached offers", async () => {
      const offers = [
        {
          id: "offer-1",
          studentId: "student-1",
          companyId: "company-1",
          role: "SDE",
        },
      ];

      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(offers));

      const result = await getOffers();

      expect(result).toEqual(offers);
      expect(db.offer.findMany).not.toHaveBeenCalled();
      expect(redis.set).not.toHaveBeenCalled();
    });

    it("should fetch offers when cache is empty", async () => {
      const offers = [
        {
          id: "offer-1",
          studentId: "student-1",
          companyId: "company-1",
          role: "SDE",
        },
      ];

      vi.mocked(db.offer.findMany).mockResolvedValue(offers as never);

      const result = await getOffers();

      expect(result).toEqual(offers);
      expect(db.offer.findMany).toHaveBeenCalledWith({
        include: {
          student: {
            select: {
              id: true,
              rollNo: true,
              firstName: true,
              lastName: true,
              branch: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          offerDate: "desc",
        },
      });
      expect(redis.set).toHaveBeenCalledWith(
        "admin:offers",
        JSON.stringify(offers),
        "EX",
        300,
      );
    });

    it("should return an empty array when there are no offers", async () => {
      vi.mocked(db.offer.findMany).mockResolvedValue([] as never);

      const result = await getOffers();

      expect(result).toEqual([]);
      expect(db.offer.findMany).toHaveBeenCalled();
      expect(redis.set).toHaveBeenCalledWith("admin:offers", "[]", "EX", 300);
    });
  });

  describe("createPlacementDrive", () => {
    const input = {
      companyId: "company-1",
      title: "SDE Intern",
      role: "Software Engineer Intern",
      driveDate: new Date("2026-10-01T10:00:00.000Z"),
      tier: "TIER_2" as const,
      type: "IN_PERSON" as const,
      status: "OPEN" as const,
      backlogsAllowed: 0,
      allowedBranches: [],
      requiredSkills: [],
      rounds: [],
      openings: 1,
      jobIds: [],
    };

    it("should throw an error when company does not exist", async () => {
      vi.mocked(db.company.findUnique).mockResolvedValue(null);

      await expect(createPlacementDrive(input)).rejects.toThrow(
        "Company not found",
      );

      expect(db.placementDrive.create).not.toHaveBeenCalled();
    });

    it("should create drive and invalidate the drives list cache", async () => {
      vi.mocked(db.company.findUnique).mockResolvedValue({
        id: "company-1",
        name: "Acme",
      } as never);

      const drive = { id: "drive-1", ...input };

      vi.mocked(db.placementDrive.create).mockResolvedValue(drive as never);

      const result = await createPlacementDrive(input);

      expect(result).toEqual(drive);

      const { jobIds: _jobIds, ...rest } = input;

      expect(db.placementDrive.create).toHaveBeenCalledWith({
        data: { ...rest, jobs: { connect: [] } },
      });
      expect(redis.del).toHaveBeenCalledWith("admin:drives");
    });
  });

  describe("updatePlacementDrive", () => {
    it("should throw an error when drive does not exist", async () => {
      vi.mocked(db.placementDrive.findUnique).mockResolvedValue(null);

      await expect(
        updatePlacementDrive("unknown-drive", { title: "New" }),
      ).rejects.toThrow("Placement drive not found");

      expect(db.placementDrive.update).not.toHaveBeenCalled();
    });

    it("should throw an error when new company does not exist", async () => {
      vi.mocked(db.placementDrive.findUnique).mockResolvedValue({
        id: "drive-1",
        companyId: "company-1",
      } as never);

      vi.mocked(db.company.findUnique).mockResolvedValue(null);

      await expect(
        updatePlacementDrive("drive-1", { companyId: "unknown-company" }),
      ).rejects.toThrow("Company not found");

      expect(db.placementDrive.update).not.toHaveBeenCalled();
    });

    it("should update drive and invalidate caches", async () => {
      vi.mocked(db.placementDrive.findUnique).mockResolvedValue({
        id: "drive-1",
        companyId: "company-1",
      } as never);

      const updated = { id: "drive-1", title: "New Title" };

      vi.mocked(db.placementDrive.update).mockResolvedValue(updated as never);

      const result = await updatePlacementDrive("drive-1", {
        title: "New Title",
      });

      expect(result).toEqual(updated);
      expect(db.placementDrive.update).toHaveBeenCalledWith({
        where: { id: "drive-1" },
        data: { title: "New Title" },
      });
      expect(redis.del).toHaveBeenCalledWith(
        "admin:drive:drive-1",
        "admin:drives",
      );
    });
  });

  describe("deletePlacementDrive", () => {
    it("should throw an error when drive does not exist", async () => {
      vi.mocked(db.placementDrive.findUnique).mockResolvedValue(null);

      await expect(deletePlacementDrive("unknown-drive")).rejects.toThrow(
        "Placement drive not found",
      );

      expect(db.placementDrive.delete).not.toHaveBeenCalled();
    });

    it("should delete drive and invalidate caches", async () => {
      vi.mocked(db.placementDrive.findUnique).mockResolvedValue({
        id: "drive-1",
      } as never);

      vi.mocked(db.placementDrive.delete).mockResolvedValue({
        id: "drive-1",
      } as never);

      const result = await deletePlacementDrive("drive-1");

      expect(result).toEqual({ id: "drive-1" });
      expect(db.placementDrive.delete).toHaveBeenCalledWith({
        where: { id: "drive-1" },
      });
      expect(redis.del).toHaveBeenCalledWith(
        "admin:drive:drive-1",
        "admin:drives",
      );
    });
  });
});
