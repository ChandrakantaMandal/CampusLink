import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    studentProfile: {
      findUnique: vi.fn(),
    },
    education: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
  createEducation,
  getMyEducation,
  updateEducation,
} from "../../../../src/modules/education/education.service";

describe("Education Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);
    mocks.redis.set.mockResolvedValue("OK");
    mocks.redis.del.mockResolvedValue(1);

    mocks.db.studentProfile.findUnique.mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });

    mocks.db.education.findUnique.mockResolvedValue(null);
    mocks.db.education.findMany.mockResolvedValue([]);

    mocks.db.education.create.mockResolvedValue({
      id: "education-1",
      studentId: "student-1",
      institution: "ABC University",
      degree: "B.Tech",
      branch: "CSE",
      startYear: 2022,
      endYear: 2026,
      cgpa: 8.5,
      percentage: null,
    });

    mocks.db.education.update.mockResolvedValue({
      id: "education-1",
      studentId: "student-1",
      institution: "XYZ University",
      degree: "B.Tech",
      branch: "CSE",
      startYear: 2022,
      endYear: 2026,
      cgpa: 9,
      percentage: null,
    });

    mocks.db.education.delete.mockResolvedValue({
      id: "education-1",
    });
  });

  describe("createEducation", () => {
    it("should create education for a student", async () => {
      const data = {
        institution: "ABC University",
        degree: "B.Tech",
        branch: "CSE",
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.5,
      };

      const result = await createEducation("user-1", data);

      expect(result).toEqual({
        id: "education-1",
        studentId: "student-1",
        institution: "ABC University",
        degree: "B.Tech",
        branch: "CSE",
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.5,
        percentage: null,
      });

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
        },
      });

      expect(mocks.db.education.create).toHaveBeenCalledWith({
        data: {
          studentId: "student-1",
          institution: "ABC University",
          degree: "B.Tech",
          branch: "CSE",
          startYear: 2022,
          endYear: 2026,
          cgpa: 8.5,
          percentage: undefined,
        },
      });
    });

    it("should use the correct user ID", async () => {
      const data = {
        institution: "ABC University",
        degree: "B.Tech",
        branch: "CSE",
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.5,
      };

      await createEducation("user-123", data);

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
        },
      });
    });

    it("should throw when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        createEducation("user-1", {
          institution: "ABC University",
          degree: "B.Tech",
          branch: "CSE",
          startYear: 2022,
          endYear: 2026,
          cgpa: 8.5,
        }),
      ).rejects.toThrow("Student profile not found");

      expect(mocks.db.education.create).not.toHaveBeenCalled();
    });

    it("should invalidate student education cache after creation", async () => {
      await createEducation("user-1", {
        institution: "ABC University",
        degree: "B.Tech",
        branch: "CSE",
        startYear: 2022,
        endYear: 2026,
        cgpa: 8.5,
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "education:student:student-1",
      );
    });
  });

  describe("getMyEducation", () => {
    it("should return cached education", async () => {
      const education = [
        {
          id: "education-1",
          studentId: "student-1",
          institution: "ABC University",
          degree: "B.Tech",
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(education));

      const result = await getMyEducation("user-1");

      expect(result).toEqual(education);

      expect(mocks.db.education.findMany).not.toHaveBeenCalled();
      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should get education from database when cache is empty", async () => {
      const education = [
        {
          id: "education-1",
          studentId: "student-1",
          institution: "ABC University",
          degree: "B.Tech",
        },
      ];

      mocks.db.education.findMany.mockResolvedValue(education);

      const result = await getMyEducation("user-1");

      expect(result).toEqual(education);

      expect(mocks.db.education.findMany).toHaveBeenCalledWith({
        where: {
          studentId: "student-1",
        },
        orderBy: {
          startYear: "desc",
        },
      });
    });

    it("should cache education after database fetch", async () => {
      const education = [
        {
          id: "education-1",
          studentId: "student-1",
          institution: "ABC University",
        },
      ];

      mocks.db.education.findMany.mockResolvedValue(education);

      await getMyEducation("user-1");

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "education:student:student-1",
        JSON.stringify(education),
        "EX",
        300,
      );
    });

    it("should throw when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(getMyEducation("user-1")).rejects.toThrow(
        "Student profile not found",
      );

      expect(mocks.db.education.findMany).not.toHaveBeenCalled();
      expect(mocks.redis.get).not.toHaveBeenCalled();
    });

    it("should return an empty array when student has no education", async () => {
      mocks.db.education.findMany.mockResolvedValue([]);

      const result = await getMyEducation("user-1");

      expect(result).toEqual([]);

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "education:student:student-1",
        "[]",
        "EX",
        300,
      );
    });

    it("should handle invalid cached JSON", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");

      const education = [
        {
          id: "education-1",
          studentId: "student-1",
        },
      ];

      mocks.db.education.findMany.mockResolvedValue(education);

      const result = await getMyEducation("user-1");

      expect(result).toEqual(education);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "education:student:student-1",
      );

      expect(mocks.db.education.findMany).toHaveBeenCalled();
    });
  });

  describe("updateEducation", () => {
    it("should update education", async () => {
      mocks.db.education.findUnique.mockResolvedValue({
        id: "education-1",
        studentId: "student-1",
        institution: "ABC University",
      });

      const data = {
        institution: "XYZ University",
        cgpa: 9,
      };

      const result = await updateEducation("user-1", "education-1", data);

      expect(result).toEqual({
        id: "education-1",
        studentId: "student-1",
        institution: "XYZ University",
        degree: "B.Tech",
        branch: "CSE",
        startYear: 2022,
        endYear: 2026,
        cgpa: 9,
        percentage: null,
      });

      expect(mocks.db.education.update).toHaveBeenCalledWith({
        where: {
          id: "education-1",
        },
        data,
      });
    });

    it("should check the student profile using user ID", async () => {
      mocks.db.education.findUnique.mockResolvedValue({
        id: "education-1",
        studentId: "student-1",
      });

      await updateEducation("user-123", "education-1", {
        cgpa: 9,
      });

      expect(mocks.db.studentProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
        },
      });
    });

    it("should throw when student profile does not exist", async () => {
      mocks.db.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        updateEducation("user-1", "education-1", {
          cgpa: 9,
        }),
      ).rejects.toThrow("Student profile not found");

      expect(mocks.db.education.findUnique).not.toHaveBeenCalled();

      expect(mocks.db.education.update).not.toHaveBeenCalled();
    });

    it("should throw when education record does not exist", async () => {
      mocks.db.education.findUnique.mockResolvedValue(null);

      await expect(
        updateEducation("user-1", "education-999", {
          cgpa: 9,
        }),
      ).rejects.toThrow("Education record not found");

      expect(mocks.db.education.update).not.toHaveBeenCalled();
    });

    it("should reject updating another student's education", async () => {
      mocks.db.education.findUnique.mockResolvedValue({
        id: "education-1",
        studentId: "student-2",
      });

      await expect(
        updateEducation("user-1", "education-1", {
          cgpa: 9,
        }),
      ).rejects.toThrow(
        "You are not authorized to update this education record",
      );

      expect(mocks.db.education.update).not.toHaveBeenCalled();
    });

    it("should invalidate both education caches after update", async () => {
      mocks.db.education.findUnique.mockResolvedValue({
        id: "education-1",
        studentId: "student-1",
      });

      await updateEducation("user-1", "education-1", {
        cgpa: 9,
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "education:student:student-1",
        "education:education-1",
      );
    });
  });
});
