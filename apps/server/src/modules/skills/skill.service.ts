import { db } from "../../services";
import { redis } from "@CampusLink/redis";
import { invalidateStudentCaches } from "../students/student.service";

import type { AddStudentSkillInput } from "./skill.schema";

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

const SKILLS_CACHE_KEY = "skills:all";

function skillCacheKey(skillId: string) {
  return `skill:${skillId}`;
}

function studentSkillsCacheKey(studentId: string) {
  return `skills:student:${studentId}`;
}

async function invalidateSkillCaches(skillId?: string, studentId?: string) {
  const keys: string[] = [SKILLS_CACHE_KEY, "admin:dashboard:stats"];

  if (skillId) {
    keys.push(skillCacheKey(skillId));
  }

  if (studentId) {
    keys.push(studentSkillsCacheKey(studentId));
  }

  await redis.del(...keys);
}

function normalizeSkillName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

async function resolveSkill(data: AddStudentSkillInput) {
  if (data.skillId) {
    const skill = await db.skill.findUnique({
      where: {
        id: data.skillId,
      },
    });

    if (!skill) {
      throw new Error("Skill not found");
    }

    return skill;
  }

  const name = data.skillName?.trim() ?? "";

  if (!name) {
    throw new Error("Either skillId or skillName is required");
  }

  const normalized = normalizeSkillName(name);

  const byNormalized = await db.skill.findUnique({
    where: {
      normalized,
    },
  });

  if (byNormalized) {
    return byNormalized;
  }

  const byName = await db.skill.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (byName) {
    return byName;
  }

  try {
    const skill = await db.skill.create({
      data: {
        name,
        normalized,
        type: "OTHER",
      },
    });

    await invalidateSkillCaches(skill.id);

    return skill;
  } catch {
    const raced = await db.skill.findUnique({
      where: {
        normalized,
      },
    });

    if (raced) {
      return raced;
    }

    throw new Error("Failed to create skill");
  }
}

export async function addStudentSkill(
  userId: string,
  data: AddStudentSkillInput,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const skill = await resolveSkill(data);

  const existing = await db.studentSkill.findUnique({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId: skill.id,
      },
    },
  });

  if (existing) {
    throw new Error("Student already has this skill");
  }

  const studentSkill = await db.studentSkill.create({
    data: {
      studentId: student.id,
      skillId: skill.id,
      level: data.level,
      years: data.years,
      source: data.source,
    },
    include: {
      skill: true,
    },
  });

  await invalidateSkillCaches(skill.id, student.id);
  await invalidateStudentCaches(userId, student.id);

  return studentSkill;
}

export async function getMySkills(userId: string) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const cacheKey = studentSkillsCacheKey(student.id);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const studentSkills = await db.studentSkill.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      skill: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(cacheKey, studentSkills);

  return studentSkills;
}

export async function removeStudentSkill(userId: string, skillId: string) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const studentSkill = await db.studentSkill.findUnique({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId,
      },
    },
  });

  if (!studentSkill) {
    throw new Error("Student skill not found");
  }

  await db.studentSkill.delete({
    where: {
      id: studentSkill.id,
    },
  });

  await invalidateSkillCaches(skillId, student.id);
  await invalidateStudentCaches(userId, student.id);
}
