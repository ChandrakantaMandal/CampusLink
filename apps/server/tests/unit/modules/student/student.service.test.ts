import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: {
    studentProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
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
} from "../../../../src/modules/students/student.service";

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

      const result = await getStudentByUserId("user-1");

      expect(result).toBeNull();
      expect(mocks.redis.set).not.toHaveBeenCalled();
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