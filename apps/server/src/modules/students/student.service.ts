import { db } from "../../services";
import { redis } from "@CampusLink/redis";
import { calculateReadiness } from "./readiness.service";
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

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);

  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

async function invalidateStudentCaches(
  userId?: string,
  studentId?: string,
) {
  const keys: string[] = [];

  if (userId) {
    keys.push(studentUserCacheKey(userId));
  }

  if (studentId) {
    keys.push(studentCacheKey(studentId));
  }

  // Invalidate readiness aggregate cache
  if (userId) {
    keys.push(`student:readiness:${userId}`);
  }

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
export async function getStudentByUserId(userId: string) {
  const cacheKey = studentUserCacheKey(userId);

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  let student = await db.studentProfile.findUnique({
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

      assessments: true,

      resumes: true,
    },
  });

  if (!student) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    const createdStudent = await db.studentProfile.create({
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

    student = createdStudent;
  }

  await setCache(cacheKey, student);
  await setCache(studentCacheKey(student.id), student);

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

      assessments: true,

      resumes: true,
    },
  });

  if (student) {
    await setCache(cacheKey, student);
    await setCache(studentUserCacheKey(student.userId), student);
  }

  return student;
}

export async function updateStudent(
  userId: string,
  data: UpdateStudentInput,
) {
  const existingStudent = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!existingStudent) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
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

  await invalidateStudentCaches(
    userId,
    existingStudent.id,
  );

  return student;
}

const VOLATILE_TTL = 60;

function aggregateCacheKey(userId: string, domain: string) {
  return `student:${domain}:${userId}`;
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
        latestReadiness,
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

          orderBy: {
            scheduledDate: "asc",
          },

          take: 3,

          include: {
            job: {
              select: {
                id: true,
                title: true,
                company: { select: companyTinySelect },
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

          orderBy: {
            createdAt: "desc",
          },

          take: 3,
        }),

        db.readinessResult.findFirst({
          where: {
            studentId: student.id,
          },

          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      const readinessScore =
        latestReadiness?.overallScore ??
        student.readinessScore ??
        0;

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
          readinessLabel: student.readinessLabel ?? null,
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

      const readiness = calculateReadiness({
        cgpa: student.cgpa,
        resumeText: student.resumeText,
        skills: student.skills,
        projects: student.projects,
        assessments: student.assessments.map((item) => ({
          percentage: item.percentage,
          passed: item.passed,
        })),
        resumes: student.resumes,
      });

      const [
        latest,
        history,
        recentAssessments,
      ] = await Promise.all([
        db.readinessResult.findFirst({
          where: {
            studentId: student.id,
          },

          orderBy: {
            createdAt: "desc",
          },
        }),

        db.readinessResult.findMany({
          where: {
            studentId: student.id,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 10,
        }),

        db.assessmentResult.findMany({
          where: {
            studentId: student.id,
          },

          orderBy: {
            takenAt: "desc",
          },

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

      return {
        score: readiness.overallScore,
        label: readiness.readinessLabel,

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

      const [
        registrations,
        openDrives,
      ] = await Promise.all([
        db.driveRegistration.findMany({
          where: {
            studentId: student.id,
          },

          orderBy: {
            registeredAt: "desc",
          },

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

          orderBy: {
            driveDate: "asc",
          },

          take: 20,

          include: {
            company: {
              select: companyCompactSelect,
            },
          },
        }),
      ]);

      const registeredDriveIds = new Set(
        registrations.map(
          (registration) => registration.driveId,
        ),
      );

      return {
        registered: registrations.map(
          (registration) => ({
            ...registration,
            eligible: isEligibleForDrive(
              student,
              registration.drive,
            ),
          }),
        ),

        available: openDrives
          .filter(
            (drive) => !registeredDriveIds.has(drive.id),
          )
          .map((drive) => ({
            ...drive,
            isRegistered: false,
            eligible: isEligibleForDrive(
              student,
              drive,
            ),
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
        where: {
          studentId: student.id,
        },

        orderBy: {
          scheduledDate: "asc",
        },

        take: 50,

        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: { select: companyTinySelect },
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

      const now = new Date();

      const upcoming = interviews.filter(
        (interview) =>
          interview.scheduledDate >= now &&
          (interview.status === "SCHEDULED" ||
            interview.status === "RESCHEDULED"),
      );

      const past = interviews
        .filter(
          (interview) => !upcoming.includes(interview),
        )
        .sort(
          (a, b) =>
            b.scheduledDate.getTime() -
            a.scheduledDate.getTime(),
        );

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
        },

        orderBy: {
          offerDate: "desc",
        },

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

          accepted: offers.filter(
            (offer) => offer.status === "ACCEPTED",
          ).length,

          pending: offers.filter(
            (offer) =>
              offer.status === "SENT" ||
              offer.status === "PENDING_ACCEPTANCE",
          ).length,
        },
      };
    },
  );
}

type OfferRecord = NonNullable<
  Awaited<ReturnType<typeof db.offer.findUnique>>
>;

export type AcceptOfferResult =
  | { ok: true; offer: OfferRecord }
  | { ok: false; status: 404 | 409; message: string };

export async function acceptStudentOffer(
  userId: string,
  offerId: string,
): Promise<AcceptOfferResult> {
  const student = await resolveStudentForAggregates(userId);

  if (!student) {
    return { ok: false, status: 404, message: "Student profile not found" };
  }

  const offer = await db.offer.findUnique({ where: { id: offerId } });

  if (!offer || offer.studentId !== student.id) {
    return { ok: false, status: 404, message: "Offer not found" };
  }

  if (offer.status === "ACCEPTED") {
    return { ok: true, offer };
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
      company: { select: companyCompactSelect },
      job: { select: { id: true, title: true } },
    },
  });

  await redis.del(aggregateCacheKey(userId, "offers"));

  return { ok: true, offer: updated };
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

      const [
        notifications,
        unreadCount,
        total,
      ] = await Promise.all([
        db.userNotification.findMany({
          where: {
            userId,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 50,
        }),
        db.userNotification.count({
          where: { userId, isRead: false },
        }),
        db.userNotification.count({ where: { userId } }),
      ]);

      return {
        notifications,
        unreadCount,
        total,
      };
    },
  );
}

export async function markStudentNotificationRead(
  userId: string,
  id: string,
) {
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
    data: { isRead: true, readAt: new Date() },
  });

  await redis.del(aggregateCacheKey(userId, "notifications"));

  return updated;
}

export async function markAllStudentNotificationsRead(userId: string) {
  const result = await db.userNotification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  await redis.del(aggregateCacheKey(userId, "notifications"));

  return result.count;
}
