import { db } from "../../services";
import { redis } from "@CampusLink/redis";

import type { UpdateUserRoleInput } from "./admin.schema";

const CACHE_TTL = 300;

const CACHE_KEYS = {
  dashboardStats: "admin:dashboard:stats",
  users: "admin:users",
  students: "admin:students",
  recruiters: "admin:recruiters",
  companies: "admin:companies",
  jobs: "admin:jobs",
  applications: "admin:applications",
  assessmentStats: "admin:assessment:stats",
};

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

async function invalidateAdminCaches(): Promise<void> {
  await redis.del(
    CACHE_KEYS.dashboardStats,
    CACHE_KEYS.users,
    CACHE_KEYS.students,
    CACHE_KEYS.recruiters,
    CACHE_KEYS.companies,
    CACHE_KEYS.jobs,
    CACHE_KEYS.applications,
    CACHE_KEYS.assessmentStats,
  );
}

export async function getDashboardStats() {
  const cached = await getCache(CACHE_KEYS.dashboardStats);

  if (cached) {
    return cached;
  }

  const [
    totalUsers,
    totalStudents,
    totalRecruiters,
    totalAdmins,
    totalCompanies,
    totalJobs,
    totalApplications,
    totalAssessments,
  ] = await Promise.all([
    db.user.count(),
    db.studentProfile.count(),
    db.recruiterProfile.count(),
    db.adminProfile.count(),
    db.company.count(),
    db.job.count(),
    db.application.count(),
    db.assessment.count(),
  ]);

  const stats = {
    users: {
      total: totalUsers,
      students: totalStudents,
      recruiters: totalRecruiters,
      admins: totalAdmins,
    },
    companies: totalCompanies,
    jobs: totalJobs,
    applications: totalApplications,
    assessments: totalAssessments,
  };

  await setCache(CACHE_KEYS.dashboardStats, stats);

  return stats;
}

export async function getUsers() {
  const cached = await getCache(CACHE_KEYS.users);

  if (cached) {
    return cached;
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(CACHE_KEYS.users, users);

  return users;
}

export async function getUserById(userId: string) {
  const cacheKey = `admin:user:${userId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      student: true,
      recruiter: {
        include: {
          company: true,
        },
      },
      admin: true,
    },
  });

  if (user) {
    await setCache(cacheKey, user);
  }

  return user;
}

export async function updateUserRole(
  userId: string,
  data: UpdateUserRoleInput,
) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  await redis.del(
    `admin:user:${userId}`,
    CACHE_KEYS.users,
    CACHE_KEYS.students,
    CACHE_KEYS.recruiters,
    CACHE_KEYS.dashboardStats,
  );

  return updatedUser;
}

export async function deleteUser(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db.user.delete({
    where: {
      id: userId,
    },
  });

  await invalidateAdminCaches();
  await redis.del(`admin:user:${userId}`);

  return {
    id: userId,
  };
}

export async function getStudents() {
  const cached = await getCache(CACHE_KEYS.students);

  if (cached) {
    return cached;
  }

  const students = await db.studentProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(CACHE_KEYS.students, students);

  return students;
}

export async function getRecruiters() {
  const cached = await getCache(CACHE_KEYS.recruiters);

  if (cached) {
    return cached;
  }

  const recruiters = await db.recruiterProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(CACHE_KEYS.recruiters, recruiters);

  return recruiters;
}

export async function getCompanies() {
  const cached = await getCache(CACHE_KEYS.companies);

  if (cached) {
    return cached;
  }

  const companies = await db.company.findMany({
    include: {
      recruiters: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          jobs: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(CACHE_KEYS.companies, companies);

  return companies;
}

export async function getJobs() {
  const cached = await getCache(CACHE_KEYS.jobs);

  if (cached) {
    return cached;
  }

  const jobs = await db.job.findMany({
    include: {
      company: true,
      recruiter: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      skills: {
        include: {
          skill: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(CACHE_KEYS.jobs, jobs);

  return jobs;
}

export async function getApplications() {
  const cached = await getCache(CACHE_KEYS.applications);

  if (cached) {
    return cached;
  }

  const applications = await db.application.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
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

  await setCache(CACHE_KEYS.applications, applications);

  return applications;
}

export async function getAssessmentStats() {
  const cached = await getCache(CACHE_KEYS.assessmentStats);

  if (cached) {
    return cached;
  }

  const [totalAssessments, totalResults, passedResults, failedResults] =
    await Promise.all([
      db.assessment.count(),
      db.assessmentResult.count(),
      db.assessmentResult.count({
        where: {
          passed: true,
        },
      }),
      db.assessmentResult.count({
        where: {
          passed: false,
        },
      }),
    ]);

  const stats = {
    totalAssessments,
    totalResults,
    passedResults,
    failedResults,
  };

  await setCache(CACHE_KEYS.assessmentStats, stats);

  return stats;
}
