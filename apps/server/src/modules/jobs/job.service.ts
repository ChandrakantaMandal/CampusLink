import { db } from "../../services";
import { redis } from "@CampusLink/redis";



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

export async function invalidateJobCaches(
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

/* =========================
   JOB TYPE
========================= */

type JobWithDetails = Awaited<
  ReturnType<typeof db.job.findMany>
>[number];

/* =========================
   GET ALL JOBS
========================= */

export async function getJobs(): Promise<JobWithDetails[]> {
  const cached = await getCache<JobWithDetails[]>(
    JOBS_CACHE_KEY,
  );

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

/* =========================
   GET JOB BY ID
========================= */

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