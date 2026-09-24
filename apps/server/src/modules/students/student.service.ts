import { db } from "../../services";
import { redis } from "@CampusLink/redis";

import type { UpdateStudentInput } from "./student.schema";

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

function studentUserCacheKey(userId: string) {
  return `student:user:${userId}`;
}

function studentCacheKey(studentId: string) {
  return `student:${studentId}`;
}

async function invalidateStudentCaches(userId?: string, studentId?: string) {
  const keys: string[] = [];

  if (userId) {
    keys.push(studentUserCacheKey(userId));
  }

  if (studentId) {
    keys.push(studentCacheKey(studentId));
  }

  await redis.del(...keys);
}

export async function getStudentByUserId(userId: string) {
  const cacheKey = studentUserCacheKey(userId);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const student = await db.studentProfile.findUnique({
    where: {
      userId,
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

  if (student) {
    await setCache(cacheKey, student);
    await setCache(studentCacheKey(student.id), student);
  }

  return student;
}

export async function getStudentById(id: string) {
  const cacheKey = studentCacheKey(id);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const student = await db.studentProfile.findUnique({
    where: {
      id,
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

  if (student) {
    await setCache(cacheKey, student);
    await setCache(studentUserCacheKey(student.userId), student);
  }

  return student;
}

export async function updateStudent(userId: string, data: UpdateStudentInput) {
  const existingStudent = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!existingStudent) {
    throw new Error("Student profile not found");
  }

  const student = await db.studentProfile.update({
    where: {
      userId,
    },
    data,
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

  await invalidateStudentCaches(userId, existingStudent.id);

  return student;
}
