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

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../../../../src/modules/jobs/job.service";

describe("job.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.redis.get.mockResolvedValue(null);

    mocks.redis.set.mockResolvedValue("OK");

    mocks.redis.del.mockResolvedValue(1);
  });

  describe("createJob", () => {
    const userId = "user-123";

    const jobData = {
      title: "Software Engineer",
      description:
        "We are looking for a software engineer to join our team.",
      location: "Bhubaneswar",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      salaryMin: 500000,
      salaryMax: 900000,
      applicationDeadline: "2026-12-31T23:59:59.000Z",
      companyId: "company-123",
    };

    it("should create a job successfully", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      const createdJob = {
        id: "job-123",
        ...jobData,
        company: {
          id: "company-123",
          name: "CampusLink",
        },
      };

      mocks.job.create.mockResolvedValue(createdJob);

      const result = await createJob(userId, jobData);

      expect(result).toEqual(createdJob);

      expect(mocks.recruiterProfile.findUnique).toHaveBeenCalledWith({
        where: {
          userId,
        },
      });

      expect(mocks.job.create).toHaveBeenCalledWith({
        data: {
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          employmentType: jobData.employmentType,
          workMode: jobData.workMode,
          salaryMin: jobData.salaryMin,
          salaryMax: jobData.salaryMax,
          applicationDeadline: new Date(
            jobData.applicationDeadline,
          ),
          companyId: jobData.companyId,
        },
        include: {
          company: true,
        },
      });
    });

    it("should invalidate company job caches after creating a job", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.create.mockResolvedValue({
        id: "job-123",
        ...jobData,
      });

      await createJob(userId, jobData);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "jobs:all",
        "jobs:company:company-123",
        "company:company-123",
        "admin:jobs",
        "admin:dashboard:stats",
      );
    });

    it("should throw when recruiter profile does not exist", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue(null);

      await expect(createJob(userId, jobData)).rejects.toThrow(
        "Recruiter profile not found",
      );

      expect(mocks.job.create).not.toHaveBeenCalled();
      expect(mocks.redis.del).not.toHaveBeenCalled();
    });

    it("should reject creating a job for another company", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-999",
      });

      await expect(createJob(userId, jobData)).rejects.toThrow(
        "You are not authorized to create a job for this company",
      );

      expect(mocks.job.create).not.toHaveBeenCalled();
      expect(mocks.redis.del).not.toHaveBeenCalled();
    });

    it("should allow optional applicationDeadline to be undefined", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      const dataWithoutDeadline = {
        ...jobData,
        applicationDeadline: undefined,
      };

      mocks.job.create.mockResolvedValue({
        id: "job-123",
        ...dataWithoutDeadline,
      });

      await createJob(userId, dataWithoutDeadline);

      expect(mocks.job.create).toHaveBeenCalledWith({
        data: {
          title: dataWithoutDeadline.title,
          description: dataWithoutDeadline.description,
          location: dataWithoutDeadline.location,
          employmentType: dataWithoutDeadline.employmentType,
          workMode: dataWithoutDeadline.workMode,
          salaryMin: dataWithoutDeadline.salaryMin,
          salaryMax: dataWithoutDeadline.salaryMax,
          applicationDeadline: undefined,
          companyId: dataWithoutDeadline.companyId,
        },
        include: {
          company: true,
        },
      });
    });
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

  describe("updateJob", () => {
    const userId = "user-123";
    const jobId = "job-123";

    const updateData = {
      title: "Senior Software Engineer",
      description: "Updated job description.",
      salaryMin: 800000,
      salaryMax: 1200000,
      applicationDeadline: "2027-01-31T23:59:59.000Z",
    };

    it("should update a job successfully", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        companyId: "company-123",
      });

      const updatedJob = {
        id: jobId,
        ...updateData,
        companyId: "company-123",
        company: {
          id: "company-123",
          name: "CampusLink",
        },
      };

      mocks.job.update.mockResolvedValue(updatedJob);

      const result = await updateJob(userId, jobId, updateData);

      expect(result).toEqual(updatedJob);

      expect(mocks.job.update).toHaveBeenCalledWith({
        where: {
          id: jobId,
        },
        data: {
          ...updateData,
          applicationDeadline: new Date(
            updateData.applicationDeadline,
          ),
        },
        include: {
          company: true,
        },
      });
    });

    it("should throw when recruiter profile does not exist", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue(null);

      await expect(
        updateJob(userId, jobId, updateData),
      ).rejects.toThrow("Recruiter profile not found");

      expect(mocks.job.findUnique).not.toHaveBeenCalled();
      expect(mocks.job.update).not.toHaveBeenCalled();
    });

    it("should throw when job does not exist", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue(null);

      await expect(
        updateJob(userId, jobId, updateData),
      ).rejects.toThrow("Job not found");

      expect(mocks.job.update).not.toHaveBeenCalled();
    });

    it("should reject updating a job belonging to another company", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        companyId: "company-999",
      });

      await expect(
        updateJob(userId, jobId, updateData),
      ).rejects.toThrow("You are not authorized to update this job");

      expect(mocks.job.update).not.toHaveBeenCalled();
    });

    it("should invalidate job caches after updating", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        companyId: "company-123",
      });

      mocks.job.update.mockResolvedValue({
        id: jobId,
        title: "Updated Job",
      });

      await updateJob(userId, jobId, {
        title: "Updated Job",
      });

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "jobs:all",
        `job:${jobId}`,
        "jobs:company:company-123",
        "company:company-123",
        "admin:jobs",
        "admin:dashboard:stats",
      );
    });

    it("should not convert applicationDeadline when it is undefined", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        companyId: "company-123",
      });

      mocks.job.update.mockResolvedValue({
        id: jobId,
        title: "Updated Job",
      });

      await updateJob(userId, jobId, {
        title: "Updated Job",
      });

      expect(mocks.job.update).toHaveBeenCalledWith({
        where: {
          id: jobId,
        },
        data: {
          title: "Updated Job",
          applicationDeadline: undefined,
        },
        include: {
          company: true,
        },
      });
    });
  });

  describe("deleteJob", () => {
    const userId = "user-123";
    const jobId = "job-123";

    it("should delete a job successfully", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        companyId: "company-123",
      });

      mocks.job.delete.mockResolvedValue({
        id: jobId,
      });

      const result = await deleteJob(userId, jobId);

      expect(result).toBeUndefined();

      expect(mocks.job.delete).toHaveBeenCalledWith({
        where: {
          id: jobId,
        },
      });
    });

    it("should throw when recruiter profile does not exist", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue(null);

      await expect(
        deleteJob(userId, jobId),
      ).rejects.toThrow("Recruiter profile not found");

      expect(mocks.job.findUnique).not.toHaveBeenCalled();
      expect(mocks.job.delete).not.toHaveBeenCalled();
    });

    it("should throw when job does not exist", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue(null);

      await expect(
        deleteJob(userId, jobId),
      ).rejects.toThrow("Job not found");

      expect(mocks.job.delete).not.toHaveBeenCalled();
    });

    it("should reject deleting a job belonging to another company", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        companyId: "company-999",
      });

      await expect(
        deleteJob(userId, jobId),
      ).rejects.toThrow("You are not authorized to delete this job");

      expect(mocks.job.delete).not.toHaveBeenCalled();
    });

    it("should invalidate caches after deleting a job", async () => {
      mocks.recruiterProfile.findUnique.mockResolvedValue({
        userId,
        companyId: "company-123",
      });

      mocks.job.findUnique.mockResolvedValue({
        id: jobId,
        companyId: "company-123",
      });

      mocks.job.delete.mockResolvedValue({
        id: jobId,
      });

      await deleteJob(userId, jobId);

      expect(mocks.redis.del).toHaveBeenCalledWith(
        "jobs:all",
        `job:${jobId}`,
        "jobs:company:company-123",
        "company:company-123",
        "admin:jobs",
        "admin:dashboard:stats",
      );
    });
  });
});
