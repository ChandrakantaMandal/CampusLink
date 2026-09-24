import { db } from "../../services";
import { redis } from "@CampusLink/redis";

import type {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
} from "./application.schema";

const CACHE_TTL = 300;

async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);

  if (!cached) {
    return null;
  }

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

export async function createApplication(
  userId: string,
  data: CreateApplicationInput,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const job = await db.job.findUnique({
    where: {
      id: data.jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  const existingApplication = await db.application.findUnique({
    where: {
      studentId_jobId: {
        studentId: student.id,
        jobId: data.jobId,
      },
    },
  });

  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }

  const application = await db.application.create({
    data: {
      studentId: student.id,
      userId,
      jobId: data.jobId,
      status: "APPLIED",
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
  });

  await redis.del(
    `applications:user:${userId}`,
    `applications:student:${student.id}`,
    `application:job:${data.jobId}`,
    "admin:applications",
    "admin:dashboard:stats",
  );

  return application;
}

export async function getMyApplications(userId: string) {
  const cacheKey = `applications:user:${userId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const applications = await db.application.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
      matchResult: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  await setCache(cacheKey, applications);

  return applications;
}

export async function getApplicationById(applicationId: string) {
  const cacheKey = `application:${applicationId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const application = await db.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      matchResult: true,
    },
  });

  if (application) {
    await setCache(cacheKey, application);
  }

  return application;
}

export async function updateApplicationStatus(
  userId: string,
  applicationId: string,
  data: UpdateApplicationStatusInput,
) {
  const application = await db.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      job: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const recruiter = await db.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  if (recruiter.companyId !== application.job.companyId) {
    throw new Error("You are not authorized to update this application");
  }

  const updatedApplication = await db.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: data.status,
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      matchResult: true,
    },
  });

  await redis.del(
    `application:${applicationId}`,
    `applications:user:${application.userId}`,
    `applications:student:${application.studentId}`,
    `application:job:${application.jobId}`,
    "admin:applications",
    "admin:dashboard:stats",
  );

  return updatedApplication;
}
