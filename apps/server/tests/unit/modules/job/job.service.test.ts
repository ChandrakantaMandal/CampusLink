import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  recruiterProfile: {
    findUnique: vi.fn(),
  },

  job: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },

  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

vi.mock("../../../../src/services", () => ({
  db: {
    recruiterProfile: mocks.recruiterProfile,
    job: mocks.job,
  },
}));

vi.mock("@CampusLink/redis", () => ({
  redis: mocks.redis,
}));

import { getJobs, getJobById } from "../../../../src/modules/jobs/job.service";

describe("job.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);

    mocks.redis.set.mockResolvedValue("OK");

    mocks.redis.del.mockResolvedValue(1);
  });

  describe("getJobs", () => {
    it("should return cached jobs when cache exists", async () => {
      const cachedJobs = [
        {
          id: "job-1",
          title: "Frontend Developer",
        },
        {
          id: "job-2",
          title: "Backend Developer",
        },
      ];

      mocks.redis.get.mockResolvedValue(JSON.stringify(cachedJobs));

      const result = await getJobs();

      expect(result).toEqual(cachedJobs);

      expect(mocks.redis.get).toHaveBeenCalledWith("jobs:all");

      expect(mocks.job.findMany).not.toHaveBeenCalled();
    });

    it("should fetch jobs from database on cache miss", async () => {
      const jobs = [
        {
          id: "job-1",
          title: "Frontend Developer",
          company: {
            id: "company-1",
            name: "Company A",
          },
          skills: [],
        },
      ];

      mocks.redis.get.mockResolvedValue(null);
      mocks.job.findMany.mockResolvedValue(jobs);

      const result = await getJobs();

      expect(result).toEqual(jobs);

      expect(mocks.job.findMany).toHaveBeenCalledWith({
        include: {
          company: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should cache jobs after fetching from database", async () => {
      const jobs = [
        {
          id: "job-1",
          title: "Frontend Developer",
        },
      ];

      mocks.job.findMany.mockResolvedValue(jobs);

      await getJobs();

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "jobs:all",
        JSON.stringify(jobs),
        "EX",
        300,
      );
    });

    it("should return an empty array when no jobs exist", async () => {
      mocks.job.findMany.mockResolvedValue([]);

      const result = await getJobs();

      expect(result).toEqual([]);

      expect(mocks.redis.set).toHaveBeenCalledWith(
        "jobs:all",
        JSON.stringify([]),
        "EX",
        300,
      );
    });

    it("should delete invalid cached JSON and fetch from database", async () => {
      mocks.redis.get.mockResolvedValue("invalid-json");

      const jobs = [
        {
          id: "job-1",
          title: "Frontend Developer",
        },
      ];

      mocks.job.findMany.mockResolvedValue(jobs);

      const result = await getJobs();

      expect(result).toEqual(jobs);

      expect(mocks.redis.del).toHaveBeenCalledWith("jobs:all");

      expect(mocks.job.findMany).toHaveBeenCalled();
    });
  });

  describe("getJobById", () => {
    const jobId = "job-123";

    it("should return cached job when cache exists", async () => {
      const cachedJob = {
        id: jobId,
        title: "Software Engineer",
      };

      mocks.redis.get.mockResolvedValue(JSON.stringify(cachedJob));

      const result = await getJobById(jobId);

      expect(result).toEqual(cachedJob);

      expect(mocks.redis.get).toHaveBeenCalledWith(`job:${jobId}`);

      expect(mocks.job.findUnique).not.toHaveBeenCalled();
    });

    it("should fetch job from database on cache miss", async () => {
      const job = {
        id: jobId,
        title: "Software Engineer",
        company: {
          id: "company-123",
          name: "CampusLink",
        },
        skills: [],
      };

      mocks.job.findUnique.mockResolvedValue(job);

      const result = await getJobById(jobId);

      expect(result).toEqual(job);

      expect(mocks.job.findUnique).toHaveBeenCalledWith({
        where: {
          id: jobId,
        },
        include: {
          company: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });
    });

    it("should cache the job after database lookup", async () => {
      const job = {
        id: jobId,
        title: "Software Engineer",
      };

      mocks.job.findUnique.mockResolvedValue(job);

      await getJobById(jobId);

      expect(mocks.redis.set).toHaveBeenCalledWith(
        `job:${jobId}`,
        JSON.stringify(job),
        "EX",
        300,
      );
    });

    it("should return null when job does not exist", async () => {
      mocks.job.findUnique.mockResolvedValue(null);

      const result = await getJobById(jobId);

      expect(result).toBeNull();

      expect(mocks.redis.set).not.toHaveBeenCalled();
    });

    it("should delete invalid cached JSON", async () => {
      mocks.redis.get.mockResolvedValue("{invalid-json");

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        title: "Software Engineer",
      });

      await getJobById(jobId);

      expect(mocks.redis.del).toHaveBeenCalledWith(`job:${jobId}`);
      expect(mocks.job.findUnique).toHaveBeenCalled();
    });
  });
});
