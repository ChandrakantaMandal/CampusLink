import { db } from "../../services";
import { redis } from "@CampusLink/redis";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "crypto";

import type { Prisma } from "@CampusLink/db";

import type {
  CreatePlacementDriveInput,
  UpdatePlacementDriveInput,
  CreateRecruiterInput,
  UpdateInterviewScheduleInput,
  BroadcastNotificationInput,
  UpdateAdminSettingsInput,
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
  offers: "admin:offers",
  interviews: "admin:interviews",
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
    CACHE_KEYS.offers,
    CACHE_KEYS.interviews,
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
      name: data.contactPerson || data.name,
      role: "RECRUITER",
      emailVerified: true,
    },
  });

  await db.account.create({
    data: {
      id: randomUUID(),
      providerId: "credential",
      accountId: user.id,
      userId: user.id,
      password: await hashPassword(data.password),
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

  const { jobIds, ...driveData } = data;

  const drive = await db.placementDrive.create({
    data: {
      ...driveData,
      jobs: {
        connect: (jobIds ?? []).map((id) => ({ id })),
      },
    },
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

  const { jobIds, ...driveData } = data;

  const updated = await db.placementDrive.update({
    where: {
      id: driveId,
    },
    data: {
      ...driveData,
      ...(jobIds !== undefined
        ? { jobs: { set: jobIds.map((id) => ({ id })) } }
        : {}),
    },
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

export async function getOffers() {
  const cached = await getCache(CACHE_KEYS.offers);

  if (cached) {
    return cached;
  }

  const offers = await db.offer.findMany({
    include: {
      student: {
        select: {
          id: true,
          rollNo: true,
          firstName: true,
          lastName: true,
          branch: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      offerDate: "desc",
    },
  });

  await setCache(CACHE_KEYS.offers, offers);

  return offers;
}

function parseTimeToMinutes(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match) {
    return null;
  }

  const hourGroup = match[1];
  const minuteGroup = match[2];

  if (!hourGroup || !minuteGroup) {
    return null;
  }

  let hours = Number.parseInt(hourGroup, 10);
  const minutes = Number.parseInt(minuteGroup, 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) {
    hours += 12;
  }
  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }
  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function toDayKey(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}

type InterviewWithRelations = Awaited<ReturnType<typeof loadInterviews>>[number];

async function loadInterviews() {
  return db.interview.findMany({
    include: {
      student: {
        select: {
          id: true,
          rollNo: true,
          firstName: true,
          lastName: true,
          branch: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      recruiter: {
        select: {
          id: true,
          designation: true,
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
        select: {
          id: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      application: {
        select: {
          id: true,
          status: true,
        },
      },
      drive: {
        select: {
          id: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });
}

function detectInterviewConflicts(
  interviews: InterviewWithRelations[],
): (InterviewWithRelations & {
  hasConflict: boolean;
  conflictDetails: string | null;
})[] {
  interface Window {
    index: number;
    start: number;
    end: number;
    label: string;
  }

  const result = interviews.map((interview) => ({
    ...interview,
    hasConflict: false,
    conflictDetails: null as string | null,
  }));

  const groups = new Map<string, number[]>();

  result.forEach((interview, index) => {
    const key = `${interview.studentId}|${toDayKey(interview.scheduledDate)}`;
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(index);
    } else {
      groups.set(key, [index]);
    }
  });

  const labelFor = (interview: InterviewWithRelations): string =>
    interview.job?.title ??
    interview.drive?.title ??
    interview.roundName ??
    "another interview";

  for (const indexes of groups.values()) {
    if (indexes.length < 2) {
      continue;
    }

    const windows: Window[] = [];

    for (const index of indexes) {
      const interview = result[index];
      if (!interview) {
        continue;
      }
      const start = parseTimeToMinutes(interview.startTime);
      if (start === null) {
        continue;
      }
      const end =
        parseTimeToMinutes(interview.endTime) ??
        start + (interview.durationMinutes ?? 60);
      windows.push({ index, start, end, label: labelFor(interview) });
    }

    for (let i = 0; i < windows.length; i++) {
      for (let j = i + 1; j < windows.length; j++) {
        const a = windows[i];
        const b = windows[j];
        if (!a || !b) {
          continue;
        }

        const itemA = result[a.index];
        const itemB = result[b.index];
        if (!itemA || !itemB) {
          continue;
        }

        if (a.start < b.end && b.start < a.end) {
          const detail = `Overlaps with ${b.label} (${itemB.startTime}–${itemB.endTime ?? "—"})`;
          const detailA = `Overlaps with ${a.label} (${itemA.startTime}–${itemA.endTime ?? "—"})`;

          itemA.hasConflict = true;
          itemA.conflictDetails = itemA.conflictDetails
            ? `${itemA.conflictDetails}; ${detail}`
            : detail;

          itemB.hasConflict = true;
          itemB.conflictDetails = itemB.conflictDetails
            ? `${itemB.conflictDetails}; ${detailA}`
            : detailA;
        }
      }
    }
  }

  return result;
}

export async function getInterviews() {
  const cached = await getCache<
    (InterviewWithRelations & {
      hasConflict: boolean;
      conflictDetails: string | null;
    })[]
  >(CACHE_KEYS.interviews);

  if (cached) {
    return cached;
  }

  const interviews = await loadInterviews();
  const withConflicts = detectInterviewConflicts(interviews);

  await setCache(CACHE_KEYS.interviews, withConflicts);

  return withConflicts;
}

export async function updateInterviewSchedule(
  interviewId: string,
  data: UpdateInterviewScheduleInput,
) {
  const interview = await db.interview.findUnique({
    where: {
      id: interviewId,
    },
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  const { scheduledDate, startTime, endTime, venue, meetingLink, mode, durationMinutes } =
    data;

  const updated = await db.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      ...(scheduledDate !== undefined ? { scheduledDate } : {}),
      ...(startTime !== undefined ? { startTime } : {}),
      ...(endTime !== undefined ? { endTime } : {}),
      ...(venue !== undefined ? { venue } : {}),
      ...(meetingLink !== undefined ? { meetingLink } : {}),
      ...(mode !== undefined ? { mode } : {}),
      ...(durationMinutes !== undefined ? { durationMinutes } : {}),
      ...(interview.status === "SCHEDULED" ? { status: "RESCHEDULED" as const } : {}),
    },
  });

  await redis.del(CACHE_KEYS.interviews);

  return updated;
}

async function resolveAdminProfileId(userId: string): Promise<string> {
  const existing = await db.adminProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing.id;
  }

  const created = await db.adminProfile.create({
    data: { userId },
  });

  return created.id;
}

export async function getAdminNotifications(userId: string) {
  const adminProfileId = await resolveAdminProfileId(userId);

  const [notifications, unreadCount, total] = await Promise.all([
    db.adminNotification.findMany({
      where: { adminId: adminProfileId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.adminNotification.count({
      where: { adminId: adminProfileId, isRead: false },
    }),
    db.adminNotification.count({ where: { adminId: adminProfileId } }),
  ]);

  return { notifications, unreadCount, total };
}

export async function markAdminNotificationRead(
  userId: string,
  notificationId: string,
) {
  const adminProfileId = await resolveAdminProfileId(userId);

  const notification = await db.adminNotification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.adminId !== adminProfileId) {
    return null;
  }

  if (notification.isRead) {
    return notification;
  }

  return db.adminNotification.update({
    where: { id: notificationId },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllAdminNotificationsRead(userId: string) {
  const adminProfileId = await resolveAdminProfileId(userId);

  const result = await db.adminNotification.updateMany({
    where: { adminId: adminProfileId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return result.count;
}

export async function broadcastAdminNotification(
  userId: string,
  data: BroadcastNotificationInput,
) {
  const adminProfileId = await resolveAdminProfileId(userId);

  const targetRoles =
    data.audience === "RECRUITERS"
      ? (["RECRUITER"] as const)
      : (["STUDENT"] as const);

  const targetUsers = await db.user.findMany({
    where: { role: { in: [...targetRoles] } },
    select: { id: true },
  });

  if (targetUsers.length > 0) {
    await db.userNotification.createMany({
      data: targetUsers.map((user) => ({
        userId: user.id,
        type: "SYSTEM" as const,
        priority: data.priority,
        title: data.title,
        message: data.message,
      })),
    });
  }

  const notification = await db.adminNotification.create({
    data: {
      adminId: adminProfileId,
      type: "SYSTEM",
      priority: data.priority,
      title: data.title,
      message: data.message,
      metadata: {
        audience: data.audience,
        recipients: targetUsers.length,
      },
    },
  });

  return { notification, recipients: targetUsers.length };
}

export interface AdminProfileSettings {
  name: string;
  email: string;
  role: string;
  phone: string;
  designation: string;
  department: string;
}

export interface CampusSettings {
  collegeName: string;
  collegeCode: string;
  academicYear: string;
  placementSeason: string;
  activeDepartments: string;
  tpoHead: string;
}

export interface SystemSettings {
  autoEligibilityFilter: boolean;
  strictBacklogRule: boolean;
  aiMatchingThreshold: number;
  conflictAlertSensitivity: "Strict" | "Moderate" | "Lenient";
  emailDigestDaily: boolean;
  scheduleCollisionDetection: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  activeSessions: number;
}

export interface AdminSettingsResult {
  profile: AdminProfileSettings;
  campus: CampusSettings;
  system: SystemSettings;
  security: SecuritySettings;
}

const DEFAULT_CAMPUS_SETTINGS: CampusSettings = {
  collegeName: "Apex Institute of Technology & Management",
  collegeCode: "AITM-751024",
  academicYear: "2025 - 2026",
  placementSeason: "Season 2026",
  activeDepartments: "CSE, IT, ECE, EEE, Mechanical",
  tpoHead: "Dr. Alok Verma",
};

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  autoEligibilityFilter: true,
  strictBacklogRule: true,
  aiMatchingThreshold: 75,
  conflictAlertSensitivity: "Strict",
  emailDigestDaily: true,
  scheduleCollisionDetection: true,
};

function withDefaults<T extends object>(stored: unknown, defaults: T): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return defaults;
  }

  return { ...defaults, ...(stored as unknown as Partial<T>) };
}

async function getOrCreateSetting<T extends object>(
  key: string,
  defaults: T,
): Promise<T> {
  const existing = await db.systemSetting.findUnique({ where: { key } });
  const value = withDefaults(existing?.value, defaults);

  if (!existing) {
    await db.systemSetting.upsert({
      where: { key },
      create: { key, value: value as Prisma.InputJsonValue },
      update: {},
    });
  }

  return value;
}

export async function getAdminSettings(
  userId: string,
): Promise<AdminSettingsResult> {
  const [user, adminProfile, campusRow, systemRow, activeSessions, twoFactor] =
    await Promise.all([
      db.user.findUnique({ where: { id: userId } }),
      db.adminProfile.findUnique({ where: { userId } }),
      getOrCreateSetting("campus", DEFAULT_CAMPUS_SETTINGS),
      getOrCreateSetting("system", DEFAULT_SYSTEM_SETTINGS),
      db.session.count({
        where: { userId, expiresAt: { gt: new Date() } },
      }),
      db.account.findFirst({
        where: { userId, providerId: "two-factor" },
      }),
    ]);

  if (!user) {
    throw new Error("Admin user not found");
  }

  return {
    profile: {
      name: user.name,
      email: user.email,
      role: user.role,
      phone: adminProfile?.phone ?? "",
      designation: adminProfile?.designation ?? "Head of Placements (TPO Cell)",
      department: adminProfile?.department ?? "",
    },
    campus: campusRow,
    system: systemRow,
    security: {
      twoFactorEnabled: twoFactor !== null,
      activeSessions,
    },
  };
}

export async function updateAdminSettings(
  userId: string,
  data: UpdateAdminSettingsInput,
): Promise<AdminSettingsResult> {
  const tasks: Promise<unknown>[] = [];

  if (data.profile) {
    tasks.push(
      db.user.update({
        where: { id: userId },
        data: {
          ...(data.profile.name !== undefined
            ? { name: data.profile.name }
            : {}),
          ...(data.profile.email !== undefined
            ? { email: data.profile.email }
            : {}),
        },
      }),
    );

    tasks.push(
      db.adminProfile.upsert({
        where: { userId },
        create: {
          userId,
          phone: data.profile.phone ?? null,
          designation: data.profile.designation ?? null,
        },
        update: {
          ...(data.profile.phone !== undefined
            ? { phone: data.profile.phone }
            : {}),
          ...(data.profile.designation !== undefined
            ? { designation: data.profile.designation }
            : {}),
        },
      }),
    );
  }

  if (data.campus) {
    tasks.push(
      db.systemSetting.upsert({
        where: { key: "campus" },
        create: {
          key: "campus",
          value: data.campus as Prisma.InputJsonValue,
        },
        update: { value: data.campus as Prisma.InputJsonValue },
      }),
    );
  }

  if (data.system) {
    tasks.push(
      db.systemSetting.upsert({
        where: { key: "system" },
        create: {
          key: "system",
          value: data.system as Prisma.InputJsonValue,
        },
        update: { value: data.system as Prisma.InputJsonValue },
      }),
    );
  }

  if (tasks.length === 0) {
    throw new Error("No settings provided to update");
  }

  await Promise.all(tasks);

  return getAdminSettings(userId);
}
