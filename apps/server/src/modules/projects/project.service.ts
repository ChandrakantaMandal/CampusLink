import { db } from "../../services";
import { redis } from "@HireBridge/redis";

import type {
  AddProjectSkillInput,
  CreateProjectInput,
  UpdateProjectInput,
} from "./project.schema";

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

function projectCacheKey(projectId: string) {
  return `project:${projectId}`;
}

function studentProjectsCacheKey(studentId: string) {
  return `projects:student:${studentId}`;
}

async function invalidateProjectCaches(projectId?: string, studentId?: string) {
  const keys: string[] = [];

  if (projectId) {
    keys.push(projectCacheKey(projectId));
  }

  if (studentId) {
    keys.push(studentProjectsCacheKey(studentId));
  }

  await redis.del(...keys);
}

export async function createProject(userId: string, data: CreateProjectInput) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const project = await db.project.create({
    data: {
      studentId: student.id,
      title: data.title,
      description: data.description,
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  await invalidateProjectCaches(undefined, student.id);

  return project;
}

export async function getMyProjects(userId: string) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const cacheKey = studentProjectsCacheKey(student.id);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const projects = await db.project.findMany({
    where: {
      studentId: student.id,
    },
    include: {
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

  await setCache(cacheKey, projects);

  return projects;
}

export async function getProjectById(projectId: string) {
  const cacheKey = projectCacheKey(projectId);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (project) {
    await setCache(cacheKey, project);
  }

  return project;
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: UpdateProjectInput,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.studentId !== student.id) {
    throw new Error("You are not authorized to update this project");
  }

  const updatedProject = await db.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...data,
      startDate:
        data.startDate !== undefined ? new Date(data.startDate) : undefined,
      endDate: data.endDate !== undefined ? new Date(data.endDate) : undefined,
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  await invalidateProjectCaches(projectId, student.id);

  return updatedProject;
}

export async function deleteProject(userId: string, projectId: string) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.studentId !== student.id) {
    throw new Error("You are not authorized to delete this project");
  }

  await db.project.delete({
    where: {
      id: projectId,
    },
  });

  await invalidateProjectCaches(projectId, student.id);
}

export async function addProjectSkill(
  userId: string,
  projectId: string,
  data: AddProjectSkillInput,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.studentId !== student.id) {
    throw new Error("You are not authorized to modify this project");
  }

  const skill = await db.skill.findUnique({
    where: {
      id: data.skillId,
    },
  });

  if (!skill) {
    throw new Error("Skill not found");
  }

  const existing = await db.projectSkill.findUnique({
    where: {
      projectId_skillId: {
        projectId,
        skillId: data.skillId,
      },
    },
  });

  if (existing) {
    throw new Error("This skill is already added to the project");
  }

  const projectSkill = await db.projectSkill.create({
    data: {
      projectId,
      skillId: data.skillId,
    },
    include: {
      skill: true,
    },
  });

  await invalidateProjectCaches(projectId, student.id);

  return projectSkill;
}

export async function removeProjectSkill(
  userId: string,
  projectId: string,
  skillId: string,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.studentId !== student.id) {
    throw new Error("You are not authorized to modify this project");
  }

  const projectSkill = await db.projectSkill.findUnique({
    where: {
      projectId_skillId: {
        projectId,
        skillId,
      },
    },
  });

  if (!projectSkill) {
    throw new Error("Project skill not found");
  }

  await db.projectSkill.delete({
    where: {
      id: projectSkill.id,
    },
  });

  await invalidateProjectCaches(projectId, student.id);
}
