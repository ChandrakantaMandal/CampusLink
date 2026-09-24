import { db } from "../../services";
import { redis } from "@CampusLink/redis";

import type {
  AddStudentSkillInput,
  CreateSkillInput,
  UpdateSkillInput,
  UpdateStudentSkillInput,
} from "./skill.schema";

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

export async function createSkill(data: CreateSkillInput) {
  const existingSkill = await db.skill.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingSkill) {
    throw new Error("A skill with this name already exists");
  }

  const existingNormalized = await db.skill.findUnique({
    where: {
      normalized: data.normalized,
    },
  });

  if (existingNormalized) {
    throw new Error("A skill with this normalized name already exists");
  }

  const skill = await db.skill.create({
    data: {
      name: data.name,
      normalized: data.normalized,
      type: data.type,
      description: data.description,
    },
  });

  await invalidateSkillCaches();

  return skill;
}

export async function getSkills() {
  const cached = await getCache(SKILLS_CACHE_KEY);

  if (cached) {
    return cached;
  }

  const skills = await db.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });

  await setCache(SKILLS_CACHE_KEY, skills);

  return skills;
}

export async function getSkillById(skillId: string) {
  const cacheKey = skillCacheKey(skillId);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const skill = await db.skill.findUnique({
    where: {
      id: skillId,
    },
  });

  if (skill) {
    await setCache(cacheKey, skill);
  }

  return skill;
}

export async function updateSkill(skillId: string, data: UpdateSkillInput) {
  const skill = await db.skill.update({
    where: {
      id: skillId,
    },
    data,
  });

  await invalidateSkillCaches(skillId);

  return skill;
}

export async function deleteSkill(skillId: string) {
  const skill = await db.skill.delete({
    where: {
      id: skillId,
    },
  });

  await invalidateSkillCaches(skillId);

  return skill;
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

  const skill = await db.skill.findUnique({
    where: {
      id: data.skillId,
    },
  });

  if (!skill) {
    throw new Error("Skill not found");
  }

  const existing = await db.studentSkill.findUnique({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId: data.skillId,
      },
    },
  });

  if (existing) {
    throw new Error("Student already has this skill");
  }

  const studentSkill = await db.studentSkill.create({
    data: {
      studentId: student.id,
      skillId: data.skillId,
      level: data.level,
      years: data.years,
      source: data.source,
    },
    include: {
      skill: true,
    },
  });

  await invalidateSkillCaches(data.skillId, student.id);

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

export async function updateStudentSkill(
  userId: string,
  skillId: string,
  data: UpdateStudentSkillInput,
) {
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

  const updatedStudentSkill = await db.studentSkill.update({
    where: {
      id: studentSkill.id,
    },
    data,
    include: {
      skill: true,
    },
  });

  await invalidateSkillCaches(skillId, student.id);

  return updatedStudentSkill;
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
}
