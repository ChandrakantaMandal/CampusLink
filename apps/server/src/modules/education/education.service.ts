import { db } from "../../services";
import { redis } from "@HireBridge/redis";

import type {
  CreateEducationInput,
  UpdateEducationInput,
} from "./education.schema";

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

function educationCacheKey(studentId: string) {
  return `education:student:${studentId}`;
}

function educationDetailCacheKey(educationId: string) {
  return `education:${educationId}`;
}

export async function createEducation(
  userId: string,
  data: CreateEducationInput,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const education = await db.education.create({
    data: {
      studentId: student.id,
      institution: data.institution,
      degree: data.degree,
      branch: data.branch,
      startYear: data.startYear,
      endYear: data.endYear,
      cgpa: data.cgpa,
      percentage: data.percentage,
    },
  });

  await redis.del(educationCacheKey(student.id));

  return education;
}

export async function getMyEducation(userId: string) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const cacheKey = educationCacheKey(student.id);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const education = await db.education.findMany({
    where: {
      studentId: student.id,
    },
    orderBy: {
      startYear: "desc",
    },
  });

  await setCache(cacheKey, education);

  return education;
}

export async function getEducationById(educationId: string) {
  const cacheKey = educationDetailCacheKey(educationId);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const education = await db.education.findUnique({
    where: {
      id: educationId,
    },
  });

  if (education) {
    await setCache(cacheKey, education);
  }

  return education;
}

export async function updateEducation(
  userId: string,
  educationId: string,
  data: UpdateEducationInput,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const education = await db.education.findUnique({
    where: {
      id: educationId,
    },
  });

  if (!education) {
    throw new Error("Education record not found");
  }

  if (education.studentId !== student.id) {
    throw new Error("You are not authorized to update this education record");
  }

  const updatedEducation = await db.education.update({
    where: {
      id: educationId,
    },
    data,
  });

  await redis.del(
    educationCacheKey(student.id),
    educationDetailCacheKey(educationId),
  );

  return updatedEducation;
}

export async function deleteEducation(userId: string, educationId: string) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const education = await db.education.findUnique({
    where: {
      id: educationId,
    },
  });

  if (!education) {
    throw new Error("Education record not found");
  }

  if (education.studentId !== student.id) {
    throw new Error("You are not authorized to delete this education record");
  }

  await db.education.delete({
    where: {
      id: educationId,
    },
  });

  await redis.del(
    educationCacheKey(student.id),
    educationDetailCacheKey(educationId),
  );
}
