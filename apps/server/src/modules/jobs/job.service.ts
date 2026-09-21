import { db } from "../../services";
import { redis } from "@HireBridge/redis";

import type { CreateJobInput, UpdateJobInput } from "./job.schema";

const CACHE_TTL = 300;

async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);

  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch {
    await redis.del(key);
    return null;
  }
}

async function setCache(
  key: string,
  data: unknown,
  ttl = CACHE_TTL,
): Promise<void> {
  await redis.set(key, JSON.stringify(data), "EX", ttl);
}

function jobCacheKey(jobId: string) {
  return `job:${jobId}`;
}

function companyJobsCacheKey(companyId: string) {
  return `jobs:company:${companyId}`;
}

const JOBS_CACHE_KEY = "jobs:all";

async function invalidateJobCaches(
  jobId?: string,
  companyId?: string,
) {
  const keys = [JOBS_CACHE_KEY];

  if (jobId) {
    keys.push(jobCacheKey(jobId));
  }

  if (companyId) {
    keys.push(companyJobsCacheKey(companyId));
    keys.push(`company:${companyId}`);
  }

  keys.push("admin:jobs", "admin:dashboard:stats");

  await redis.del(...keys);
}

export async function createJob(userId: string, data: CreateJobInput) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  if (recruiter.companyId !== data.companyId) {
    throw new Error("You are not authorized to create a job for this company");
  }

  const job = await db.job.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      employmentType: data.employmentType,
      workMode: data.workMode,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      applicationDeadline: data.applicationDeadline
        ? new Date(data.applicationDeadline)
        : undefined,
      companyId: data.companyId,
    },
    include: {
      company: true,
    },
  });

  await invalidateJobCaches(undefined, data.companyId);

  return job;
}

export async function getJobs() {
  const cached = await getCache(JOBS_CACHE_KEY);

  if (cached) {
    return cached;
  }

  const jobs = await db.job.findMany({
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

  await setCache(JOBS_CACHE_KEY, jobs);

  return jobs;
}

export async function getJobById(id: string) {
  const cacheKey = jobCacheKey(id);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const job = await db.job.findUnique({
    where: {
      id,
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

  if (job) {
    await setCache(cacheKey, job);
  }

  return job;
}

export async function updateJob(
  userId: string,
  jobId: string,
  data: UpdateJobInput,
) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.companyId !== recruiter.companyId) {
    throw new Error("You are not authorized to update this job");
  }

  const updatedJob = await db.job.update({
    where: {
      id: jobId,
    },
    data: {
      ...data,
      applicationDeadline:
        data.applicationDeadline !== undefined
          ? new Date(data.applicationDeadline)
          : undefined,
    },
    include: {
      company: true,
    },
  });

  await invalidateJobCaches(jobId, job.companyId);

  return updatedJob;
}

export async function deleteJob(userId: string, jobId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  if (job.companyId !== recruiter.companyId) {
    throw new Error("You are not authorized to delete this job");
  }

  await db.job.delete({
    where: {
      id: jobId,
    },
  });

  await invalidateJobCaches(jobId, job.companyId);
}

