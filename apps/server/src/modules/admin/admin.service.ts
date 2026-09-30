import { db } from "../../services";
import { redis } from "@CampusLink/redis";

import type {
  CreatePlacementDriveInput,
  UpdatePlacementDriveInput,
  CreateRecruiterInput,
} from "./admin.schema";

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
  drives: "admin:drives",
};

function getDriveCacheKey(driveId: string): string {
  return `admin:drive:${driveId}`;
}

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
    CACHE_KEYS.drives,
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
    totalDrives,
    totalOffers,
  ] = await Promise.all([
    db.user.count(),
    db.studentProfile.count(),
    db.recruiterProfile.count(),
    db.adminProfile.count(),
    db.company.count(),
    db.job.count(),
    db.application.count(),
    db.assessment.count(),
    db.placementDrive.count(),
    db.application.count({ where: { status: { in: ["OFFER_EXTENDED", "ACCEPTED"] } } }),
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
    drives: totalDrives,
    offers: totalOffers,
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
          image: true,
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
      _count: {
        select: {
          applications: true,
          offers: true,
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
          image: true,
        },
      },
      company: {
        include: {
          _count: {
            select: {
              drives: true,
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

  await setCache(CACHE_KEYS.recruiters, recruiters);

  return recruiters;
}

export async function createRecruiter(data: CreateRecruiterInput) {
  const company = await db.company.create({
    data: {
      name: data.name,
      industry: data.industry,
      website: data.website || null,
      tier: data.tier as any,
    },
  });

  // Create a placeholder user for the recruiter
  const tempEmail = data.email || `recruiter-${Date.now()}@example.com`;
  const user = await db.user.create({
    data: {
      id: `user-${Date.now()}`,
      email: tempEmail,
      name: data.contactPerson,
      role: "RECRUITER",
    },
  });

  const recruiter = await db.recruiterProfile.create({
    data: {
      userId: user.id,
      companyId: company.id,
      phone: data.phone,
      isLeadRecruiter: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
        },
      },
      company: {
        include: {
          _count: {
            select: {
              drives: true,
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
  });

  await invalidateAdminCaches();
  return recruiter;
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

export async function getDrives() {
  const cached = await getCache(CACHE_KEYS.drives);

  if (cached) {
    return cached;
  }

  const drives = await db.placementDrive.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
          industry: true,
          tier: true,
        },
      },
      _count: {
        select: {
          registrations: true,
          jobs: true,
        },
      },
      jobs: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      driveDate: "desc",
    },
  });

  await setCache(CACHE_KEYS.drives, drives);

  return drives;
}

export async function getDriveById(driveId: string) {
  const cacheKey = getDriveCacheKey(driveId);
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const drive = await db.placementDrive.findUnique({
    where: {
      id: driveId,
    },
    include: {
      company: true,
      registrations: {
        include: {
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
        },
        orderBy: {
          registeredAt: "desc",
        },
      },
      _count: {
        select: {
          registrations: true,
          jobs: true,
        },
      },
      jobs: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (drive) {
    await setCache(cacheKey, drive);
  }

  return drive;
}

export async function createPlacementDrive(data: CreatePlacementDriveInput) {
  const company = await db.company.findUnique({
    where: {
      id: data.companyId,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const drive = await db.placementDrive.create({
    data,
  });

  await redis.del(CACHE_KEYS.drives);

  return drive;
}

export async function updatePlacementDrive(
  driveId: string,
  data: UpdatePlacementDriveInput,
) {
  const drive = await db.placementDrive.findUnique({
    where: {
      id: driveId,
    },
  });

  if (!drive) {
    throw new Error("Placement drive not found");
  }

  if (data.companyId) {
    const company = await db.company.findUnique({
      where: {
        id: data.companyId,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }
  }

  const updated = await db.placementDrive.update({
    where: {
      id: driveId,
    },
    data,
  });

  await redis.del(getDriveCacheKey(driveId), CACHE_KEYS.drives);

  return updated;
}

export async function deletePlacementDrive(driveId: string) {
  const drive = await db.placementDrive.findUnique({
    where: {
      id: driveId,
    },
  });

  if (!drive) {
    throw new Error("Placement drive not found");
  }

  await db.placementDrive.delete({
    where: {
      id: driveId,
    },
  });

  await redis.del(getDriveCacheKey(driveId), CACHE_KEYS.drives);

  return { id: driveId };
}
