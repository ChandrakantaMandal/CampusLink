import { db } from "../../services";
import { redis } from "@CampusLink/redis";
import { calculateReadiness } from "./readiness.service";
import type { UpdateStudentInput } from "./student.schema";

const CACHE_TTL = 300;
const VOLATILE_TTL = 60;

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

function aggregateCacheKey(userId: string, domain: string) {
  return `student:${domain}:${userId}`;
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);

  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function calculateStudentReadiness(student: {
  cgpa?: number | null;
  resumeText?: string | null;
  skills?: Array<{
    level: string | null;
    years: number | null;
    skill: {
      name: string;
    };
  }> | null;
  projects?: Array<{
    title: string;
    description: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
  }> | null;
  assessments?: Array<{
    percentage?: number | null;
    passed?: boolean | null;
  }> | null;
  resumes?: Array<{
    parsedText: string | null;
    fileUrl: string;
  }> | null;
}) {
  return calculateReadiness({
    cgpa: student.cgpa ?? null,
    resumeText: student.resumeText ?? null,
    skills: (student.skills ?? []).map((item) => ({
      level: item.level,
      years: item.years,
      skill: {
        name: item.skill.name,
      },
    })),
    projects: (student.projects ?? []).map((project) => ({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
    })),
    assessments: (student.assessments ?? []).map((item) => ({
      percentage: item.percentage ?? 0,
      passed: item.passed ?? false,
    })),
    resumes: (student.resumes ?? []).map((resume) => ({
      parsedText: resume.parsedText,
      fileUrl: resume.fileUrl,
    })),
  });
}

export async function invalidateStudentCaches(
  userId?: string,
  studentId?: string,
) {
  const keys: string[] = [];

  if (userId) {
    keys.push(
      studentUserCacheKey(userId),
      aggregateCacheKey(userId, "readiness"),
      aggregateCacheKey(userId, "dashboard"),
      aggregateCacheKey(userId, "drives"),
      aggregateCacheKey(userId, "interviews"),
      aggregateCacheKey(userId, "offers"),
      aggregateCacheKey(userId, "notifications"),
    );
  }

  if (studentId) {
    keys.push(studentCacheKey(studentId));
  }

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function getStudentByUserId(userId: string) {
  const cacheKey = studentUserCacheKey(userId);
  const cached = await getCache<Record<string, unknown>>(cacheKey);

  if (cached !== null) {
    return cached;
  }

  let student = await db.studentProfile.findUnique({
    where: { userId },
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
      assessments: true,
      resumes: true,
    },
  });

  if (!student) {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    student = await db.studentProfile.create({
      data: {
        userId,
        ...splitName(user.name),
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
        assessments: true,
        resumes: true,
      },
    });
  }

  // FIX: Include readiness fields in the user-ID lookup response.
  const readiness = calculateStudentReadiness(student);

  const enriched = {
    ...student,
    readinessScore: readiness.overallScore,
    readinessBreakdown: readiness.breakdown,
  };

  // Cache the same enriched result under both lookup keys.
  await setCache(cacheKey, enriched);
  await setCache(studentCacheKey(student.id), enriched);

  return enriched;
}

export async function getStudentById(id: string) {
  const cacheKey = studentCacheKey(id);
  const cached = await getCache<Record<string, unknown>>(cacheKey);

  if (cached !== null) {
    return cached;
  }

  const student = await db.studentProfile.findUnique({
    where: { id },
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
      assessments: true,
      resumes: true,
    },
  });

  if (!student) {
    return null;
  }

  const readiness = calculateStudentReadiness(student);

  const enriched = {
    ...student,
    readinessScore: readiness.overallScore,
    readinessBreakdown: readiness.breakdown,
  };

  await setCache(cacheKey, enriched);
  await setCache(studentUserCacheKey(student.userId), enriched);

  return enriched;
}

export async function updateStudent(userId: string, data: UpdateStudentInput) {
  const existingStudent = await db.studentProfile.findUnique({
    where: { userId },
  });

  if (!existingStudent) {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Student profile not found");
    }

    const created = await db.studentProfile.create({
      data: {
        userId,
        ...splitName(user.name),
        ...data,
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
        assessments: true,
        resumes: true,
      },
    });

    await invalidateStudentCaches(userId, created.id);

    return created;
  }

  const student = await db.studentProfile.update({
    where: { userId },
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

export function invalidateStudentInterviewCache(userId: string) {
  return redis.del(aggregateCacheKey(userId, "interviews"));
}

export function invalidateStudentOfferCache(userId: string) {
  return redis.del(aggregateCacheKey(userId, "offers"));
}

export function invalidateStudentNotificationsCache(userId: string) {
  return redis.del(aggregateCacheKey(userId, "notifications"));
}

async function withAggregateCache<T>(
  cacheKey: string,
  ttl: number,
  fetcher: () => Promise<T | null>,
): Promise<T | null> {
  const cached = await getCache<T>(cacheKey);

  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();

  if (data === null) {
    return null;
  }

  await setCache(cacheKey, data, ttl);

  return data;
}

type ResolvedStudent = {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  college: string | null;
  department: string | null;
  branch: string | null;
  graduationYear: number | null;
  cgpa: number | null;
  backlogs: number;
  readinessScore: number | null;
  readinessLabel: string | null;
  resumeUrl: string | null;
  resumeText: string | null;
  skills: Array<{
    level: string | null;
    years: number | null;
    skill: {
      name: string;
    };
  }>;
  projects: Array<{
    title: string;
    description: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
  }>;
  assessments: Array<{
    percentage: number;
    passed: boolean;
  }>;
  resumes: Array<{
    parsedText: string | null;
    fileUrl: string;
  }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  } | null;
};

async function resolveStudentForAggregates(
  userId: string,
): Promise<ResolvedStudent | null> {
  const student = await getStudentByUserId(userId);

  if (!student) {
    return null;
  }

  return student as ResolvedStudent;
}

type EligibleStudent = {
  cgpa: number | null;
  backlogs: number;
  branch: string | null;
  department: string | null;
};

type EligibleDrive = {
  minCgpa: number | null;
  backlogsAllowed: number;
  allowedBranches: string[];
};

function studentBranchOf(student: EligibleStudent) {
  return (student.branch ?? student.department ?? "").toLowerCase();
}

function branchMatches(
  studentBranch: string,
  allowedBranches: string[],
): boolean {
  if (!studentBranch) return true;

  return allowedBranches.some(
    (branch) => branch.toLowerCase() === studentBranch,
  );
}

export function isEligibleForDrive(
  student: EligibleStudent,
  drive: EligibleDrive,
): boolean {
  if (
    drive.minCgpa !== null &&
    student.cgpa !== null &&
    student.cgpa < drive.minCgpa
  ) {
    return false;
  }

  if (student.backlogs > drive.backlogsAllowed) {
    return false;
  }

  if (drive.allowedBranches.length > 0) {
    if (!branchMatches(studentBranchOf(student), drive.allowedBranches)) {
      return false;
    }
  }

  return true;
}

const companyCompactSelect = {
  id: true,
  name: true,
  logoUrl: true,
  tier: true,
} as const;

const companyTinySelect = {
  id: true,
  name: true,
  logoUrl: true,
} as const;

export async function getStudentDashboard(userId: string) {
  return withAggregateCache(
    aggregateCacheKey(userId, "dashboard"),
    VOLATILE_TTL,
    async () => {
      const student = await resolveStudentForAggregates(userId);

      if (!student) {
        return null;
      }

      const now = new Date();

      const [
        totalApplications,
        recentApplications,
        totalInterviews,
        upcomingInterviews,
        totalOffers,
        totalDrivesRegistered,
        unreadNotifications,
        recentNotifications,
      ] = await Promise.all([
        db.application.count({
          where: { studentId: student.id },
        }),

        db.application.findMany({
          where: { studentId: student.id },
          orderBy: { appliedAt: "desc" },
          take: 5,
          include: {
            job: {
              select: {
                id: true,
                title: true,
                location: true,
                ctc: true,
                company: {
                  select: companyTinySelect,
                },
              },
            },
          },
        }),

        db.interview.count({
          where: { studentId: student.id },
        }),

        db.interview.findMany({
          where: {
            studentId: student.id,
            scheduledDate: { gte: now },
            status: {
              in: ["SCHEDULED", "RESCHEDULED"],
            },
          },
          orderBy: { scheduledDate: "asc" },
          take: 3,
          include: {
            job: {
              select: {
                id: true,
                title: true,
                company: {
                  select: companyTinySelect,
                },
              },
            },
            drive: {
              select: {
                id: true,
                title: true,
                company: {
                  select: companyTinySelect,
                },
              },
            },
          },
        }),

        db.offer.count({
          where: { studentId: student.id },
        }),

        db.driveRegistration.count({
          where: { studentId: student.id },
        }),

        db.userNotification.count({
          where: {
            userId,
            isRead: false,
          },
        }),

        db.userNotification.findMany({
          where: {
            userId,
            isRead: false,
          },
          orderBy: { createdAt: "desc" },
          take: 3,
        }),
      ]);

      const liveReadiness = calculateStudentReadiness(student);
      const readinessScore = liveReadiness.overallScore;

      return {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          college: student.college,
          branch: student.branch,
          graduationYear: student.graduationYear,
          cgpa: student.cgpa,
          resumeUrl: student.resumeUrl,
          image: student.user?.image ?? null,
        },
        stats: {
          applications: totalApplications,
          interviews: totalInterviews,
          offers: totalOffers,
          drivesRegistered: totalDrivesRegistered,
          unreadNotifications,
          readinessScore,
          readinessLabel: liveReadiness.readinessLabel,
        },
        recentApplications,
        upcomingInterviews,
        recentNotifications,
      };
    },
  );
}

export async function getStudentReadiness(userId: string) {
  return withAggregateCache(
    aggregateCacheKey(userId, "readiness"),
    CACHE_TTL,
    async () => {
      const student = await resolveStudentForAggregates(userId);

      if (!student) {
        return null;
      }

      const readiness = calculateStudentReadiness(student);

      const [latest, history, recentAssessments] = await Promise.all([
        db.readinessResult.findFirst({
          where: { studentId: student.id },
          orderBy: { createdAt: "desc" },
        }),

        db.readinessResult.findMany({
          where: { studentId: student.id },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),

        db.assessmentResult.findMany({
          where: { studentId: student.id },
          orderBy: { takenAt: "desc" },
          take: 5,
          include: {
            assessment: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        }),
      ]);

      // FIX: score/label must come from the same live calculation as the
      // breakdown below — stale readinessResult/studentProfile values took
      // precedence before, so the headline disagreed with the dimensions.
      const score = readiness.overallScore;

      const label = readiness.readinessLabel;

      return {
        score,
        label,
        breakdown: readiness.breakdown,
        weights: readiness.weights,
        explanation: readiness.explanation,
        latest,
        history,
        recentAssessments,
      };
    },
  );
}

export async function getStudentDrives(userId: string) {
  return withAggregateCache(
    aggregateCacheKey(userId, "drives"),
    CACHE_TTL,
    async () => {
      const student = await resolveStudentForAggregates(userId);

      if (!student) {
        return null;
      }

      const [registrations, openDrives] = await Promise.all([
        db.driveRegistration.findMany({
          where: { studentId: student.id },
          orderBy: { registeredAt: "desc" },
          take: 50,
          include: {
            drive: {
              include: {
                company: {
                  select: companyCompactSelect,
                },
              },
            },
          },
        }),

        db.placementDrive.findMany({
          where: {
            status: {
              in: ["OPEN", "ONGOING"],
            },
          },
          orderBy: { driveDate: "asc" },
          take: 20,
          include: {
            company: {
              select: companyCompactSelect,
            },
          },
        }),
      ]);

      const registeredDriveIds = new Set(
        registrations.map((registration) => registration.driveId),
      );

      return {
        registered: registrations.map((registration) => ({
          ...registration,
          eligible: isEligibleForDrive(student, registration.drive),
        })),

        available: openDrives
          .filter((drive) => !registeredDriveIds.has(drive.id))
          .map((drive) => ({
            ...drive,
            isRegistered: false,
            eligible: isEligibleForDrive(student, drive),
          })),
      };
    },
  );
}

export async function getStudentInterviews(userId: string) {
  return withAggregateCache(
    aggregateCacheKey(userId, "interviews"),
    VOLATILE_TTL,
    async () => {
      const student = await resolveStudentForAggregates(userId);

      if (!student) {
        return null;
      }

      const interviews = await db.interview.findMany({
        where: { studentId: student.id },
        orderBy: { scheduledDate: "asc" },
        take: 50,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: {
                select: companyTinySelect,
              },
            },
          },
          drive: {
            select: {
              id: true,
              title: true,
              company: {
                select: companyTinySelect,
              },
            },
          },
        },
      });

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const upcoming = interviews.filter(
        (interview) =>
          interview.scheduledDate >= today &&
          (interview.status === "SCHEDULED" ||
            interview.status === "RESCHEDULED"),
      );

      const past = interviews
        .filter((interview) => !upcoming.includes(interview))
        .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());

      return {
        upcoming,
        past,
      };
    },
  );
}

export async function getStudentOffers(userId: string) {
  return withAggregateCache(
    aggregateCacheKey(userId, "offers"),
    VOLATILE_TTL,
    async () => {
      const student = await resolveStudentForAggregates(userId);

      if (!student) {
        return null;
      }

      const offers = await db.offer.findMany({
        where: {
          studentId: student.id,
          status: { not: "DRAFT" },
        },
        orderBy: { offerDate: "desc" },
        take: 50,
        include: {
          company: {
            select: companyCompactSelect,
          },
          job: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        offers,
        stats: {
          total: offers.length,
          accepted: offers.filter((offer) => offer.status === "ACCEPTED")
            .length,
          pending: offers.filter(
            (offer) =>
              offer.status === "SENT" || offer.status === "PENDING_ACCEPTANCE",
          ).length,
        },
      };
    },
  );
}

type OfferRecord = NonNullable<Awaited<ReturnType<typeof db.offer.findUnique>>>;

export type AcceptOfferResult =
  | { ok: true; offer: OfferRecord }
  | {
      ok: false;
      status: 404 | 409;
      message: string;
    };

export async function acceptStudentOffer(
  userId: string,
  offerId: string,
): Promise<AcceptOfferResult> {
  const student = await resolveStudentForAggregates(userId);

  if (!student) {
    return {
      ok: false,
      status: 404,
      message: "Student profile not found",
    };
  }

  const offer = await db.offer.findUnique({
    where: { id: offerId },
  });

  if (!offer || offer.studentId !== student.id) {
    return {
      ok: false,
      status: 404,
      message: "Offer not found",
    };
  }

  if (offer.status === "ACCEPTED") {
    return {
      ok: true,
      offer,
    };
  }

  if (offer.status !== "SENT" && offer.status !== "PENDING_ACCEPTANCE") {
    return {
      ok: false,
      status: 409,
      message: `Offer cannot be accepted (status: ${offer.status})`,
    };
  }

  const updated = await db.offer.update({
    where: { id: offer.id },
    data: { status: "ACCEPTED" },
    include: {
      company: {
        select: companyCompactSelect,
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  await redis.del(aggregateCacheKey(userId, "offers"));

  return {
    ok: true,
    offer: updated,
  };
}

type DriveRegistrationRecord = NonNullable<
  Awaited<ReturnType<typeof db.driveRegistration.findUnique>>
>;

export type RegisterDriveResult =
  | {
      ok: true;
      registration: DriveRegistrationRecord & { eligible: boolean };
    }
  | {
      ok: false;
      status: 403 | 404 | 409;
      message: string;
    };

export async function registerForDrive(
  userId: string,
  driveId: string,
): Promise<RegisterDriveResult> {
  const student = await resolveStudentForAggregates(userId);

  if (!student) {
    return {
      ok: false,
      status: 404,
      message: "Student profile not found",
    };
  }

  const drive = await db.placementDrive.findUnique({
    where: { id: driveId },
  });

  if (!drive) {
    return {
      ok: false,
      status: 404,
      message: "Drive not found",
    };
  }

  const existing = await db.driveRegistration.findUnique({
    where: {
      driveId_studentId: {
        driveId: drive.id,
        studentId: student.id,
      },
    },
  });

  if (existing) {
    return {
      ok: true,
      registration: {
        ...existing,
        eligible: isEligibleForDrive(student, drive),
      },
    };
  }

  if (drive.status !== "OPEN" && drive.status !== "ONGOING") {
    return {
      ok: false,
      status: 409,
      message: `Drive registration is closed (status: ${drive.status})`,
    };
  }

  if (!isEligibleForDrive(student, drive)) {
    return {
      ok: false,
      status: 403,
      message: "You are not eligible for this drive",
    };
  }

  const registration = await db.driveRegistration.create({
    data: {
      driveId: drive.id,
      studentId: student.id,
    },
    include: {
      drive: {
        include: {
          company: {
            select: companyCompactSelect,
          },
        },
      },
    },
  });

  await redis.del(aggregateCacheKey(userId, "drives"));
  await redis.del(aggregateCacheKey(userId, "dashboard"));

  return {
    ok: true,
    registration: {
      ...registration,
      eligible: true,
    },
  };
}

export async function getStudentNotifications(userId: string) {
  return withAggregateCache(
    aggregateCacheKey(userId, "notifications"),
    VOLATILE_TTL,
    async () => {
      const student = await resolveStudentForAggregates(userId);

      if (!student) {
        return null;
      }

      const [notifications, unreadCount, total] = await Promise.all([
        db.userNotification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),

        db.userNotification.count({
          where: {
            userId,
            isRead: false,
          },
        }),

        db.userNotification.count({
          where: { userId },
        }),
      ]);

      return {
        notifications,
        unreadCount,
        total,
      };
    },
  );
}

export async function markStudentNotificationRead(userId: string, id: string) {
  const notification = await db.userNotification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== userId) {
    return null;
  }

  if (notification.isRead) {
    return notification;
  }

  const updated = await db.userNotification.update({
    where: { id },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  await redis.del(aggregateCacheKey(userId, "notifications"));

  return updated;
}

export async function markAllStudentNotificationsRead(userId: string) {
  const result = await db.userNotification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  await redis.del(aggregateCacheKey(userId, "notifications"));

  return result.count;
}
