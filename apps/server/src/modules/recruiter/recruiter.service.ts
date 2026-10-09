import { Prisma } from "@CampusLink/db";

import { db } from "../../services";
import { invalidateApplicationCaches } from "../applications/application.service";
import { invalidateInterviewCache } from "../admin/admin.service";
import { invalidateJobCaches } from "../jobs/job.service";

import type {
  CreateInterviewInput,
  CreateMyJobInput,
  CreateMyOfferInput,
  CreateRecruiterProfileInput,
  UpdateInterviewInput,
  UpdateRecruiterProfileInput,
} from "./recruiter.schema";

type ConflictSource = {
  id: string;
  studentId: string;
  scheduledDate: Date;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number | null;
  roundName: string;
  job?: { title: string } | null;
};

type ConflictFlagged<T> = T & {
  hasConflict: boolean;
  conflictDetails: string | null;
};

function parseTimeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(time.trim());

  if (!match) {
    return null;
  }

  const [, rawHours, rawMinutes, rawMeridiem] = match;

  if (rawHours === undefined || rawMinutes === undefined) {
    return null;
  }

  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  const meridiem = rawMeridiem?.toUpperCase();

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

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function windowOf(row: ConflictSource): { start: number; end: number } | null {
  if (!row.startTime) {
    return null;
  }

  const start = parseTimeToMinutes(row.startTime);

  if (start === null) {
    return null;
  }

  let end = start + (row.durationMinutes ?? 60);

  if (row.endTime) {
    const parsedEnd = parseTimeToMinutes(row.endTime);

    if (parsedEnd !== null) {
      end = parsedEnd;
    }
  }

  return { start, end };
}

function labelOf(row: ConflictSource): string {
  return row.job?.title ?? row.roundName;
}

function pushDetail(map: Map<string, string[]>, id: string, detail: string) {
  const existing = map.get(id);

  if (existing) {
    if (!existing.includes(detail)) {
      existing.push(detail);
    }
  } else {
    map.set(id, [detail]);
  }
}

function computeConflicts<T extends ConflictSource>(
  rows: T[],
): ConflictFlagged<T>[] {
  const groups = new Map<string, T[]>();

  for (const row of rows) {
    const key = `${row.studentId}|${toDayKey(row.scheduledDate)}`;
    const group = groups.get(key);

    if (group) {
      group.push(row);
    } else {
      groups.set(key, [row]);
    }
  }

  const detailsById = new Map<string, string[]>();

  for (const group of groups.values()) {
    for (let i = 0; i < group.length; i += 1) {
      for (let j = i + 1; j < group.length; j += 1) {
        const a = group[i];
        const b = group[j];

        if (!a || !b) {
          continue;
        }

        const windowA = windowOf(a);
        const windowB = windowOf(b);

        if (!windowA || !windowB) {
          continue;
        }

        if (windowA.start < windowB.end && windowB.start < windowA.end) {
          pushDetail(
            detailsById,
            a.id,
            `Overlaps with ${labelOf(b)} (${b.startTime}–${b.endTime ?? "—"})`,
          );
          pushDetail(
            detailsById,
            b.id,
            `Overlaps with ${labelOf(a)} (${a.startTime}–${a.endTime ?? "—"})`,
          );
        }
      }
    }
  }

  return rows.map((row) => {
    const details = detailsById.get(row.id);

    return {
      ...row,
      hasConflict: details !== undefined && details.length > 0,
      conflictDetails: details && details.length > 0 ? details.join("; ") : null,
    };
  });
}

export async function getRecruiterProfile(userId: string) {
  return db.recruiterProfile.findUnique({
    where: { userId },
    include: {
      company: true,
      user: { select: { id: true, name: true, email: true, image: true } },
      _count: { select: { jobs: true, interviews: true } },
    },
  });
}

export async function createRecruiterProfile(
  userId: string,
  data: CreateRecruiterProfileInput,
) {
  const existing = await db.recruiterProfile.findUnique({ where: { userId } });
  if (existing) return getRecruiterProfile(userId);

  const { company, ...profile } = data;
  const created = await db.$transaction(async (tx) => {
    const newCompany = await tx.company.create({
      data: {
        name: company.name,
        description: company.description,
        website: company.website,
        logoUrl: company.logoUrl,
        industry: company.industry,
        location: company.location,
        linkedinUrl: company.linkedinUrl,
        benefits: company.benefits,
        tier: company.tier,
      },
    });
    return tx.recruiterProfile.create({
      data: {
        userId,
        companyId: newCompany.id,
        designation: profile.designation,
        phone: profile.phone === "" ? null : profile.phone,
        linkedinUrl: profile.linkedinUrl,
        isLeadRecruiter: true,
      },
      include: {
        company: true,
        user: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { jobs: true, interviews: true } },
      },
    });
  });
  return created;
}

export async function updateRecruiterProfile(
  userId: string,
  data: UpdateRecruiterProfileInput,
) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return null;
  }

  const { company, ...profileFields } = data;

  if (profileFields.phone === "") {
    profileFields.phone = null;
  }

  if (company && company.logoUrl === "") {
    company.logoUrl = null;
  }

  if (Object.keys(profileFields).length > 0) {
    await db.recruiterProfile.update({
      where: { id: recruiter.id },
      data: profileFields,
    });
  }

  if (company && Object.keys(company).length > 0) {
    await db.company.update({
      where: { id: recruiter.companyId },
      data: company,
    });
  }

  return getRecruiterProfile(userId);
}

export async function getMyJobs(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return [];
  }

  const [jobs, shortlistedGroups, offerGroups] = await Promise.all([
    db.job.findMany({
      where: { companyId: recruiter.companyId },
      include: {
        _count: { select: { applications: true, interviews: true } },
        skills: { include: { skill: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.application.groupBy({
      by: ["jobId"],
      where: {
        status: "SHORTLISTED",
        job: { companyId: recruiter.companyId },
      },
      _count: { _all: true },
    }),
    db.offer.groupBy({
      by: ["jobId"],
      where: { companyId: recruiter.companyId },
      _count: { _all: true },
    }),
  ]);

  const shortlistedByJob = new Map(
    shortlistedGroups.map((group) => [group.jobId, group._count._all]),
  );
  const offersByJob = new Map(
    offerGroups.map((group) => [group.jobId, group._count._all]),
  );

  return jobs.map((job) => ({
    ...job,
    applicantsCount: job._count.applications,
    shortlistedCount: shortlistedByJob.get(job.id) ?? 0,
    interviewCount: job._count.interviews,
    offersCount: offersByJob.get(job.id) ?? 0,
  }));
}

export async function createMyJob(userId: string, data: CreateMyJobInput) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  const { status, requiredSkills, ...rest } = data;

  const skillNames = [
    ...new Map(
      (requiredSkills ?? [])
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => [name.toLowerCase(), name] as const),
    ).values(),
  ];

  const job = await db.$transaction(async (tx) => {
    const created = await tx.job.create({
      data: {
        ...rest,
        companyId: recruiter.companyId,
        recruiterId: recruiter.id,
        ...(status ? { status } : {}),
      },
    });

    if (skillNames.length > 0) {
      const existing = await tx.skill.findMany({
        where: {
          normalized: { in: skillNames.map((name) => name.toLowerCase()) },
        },
      });
      const byNormalized = new Map(
        existing.map((skill) => [skill.normalized, skill]),
      );

      for (const name of skillNames) {
        const key = name.toLowerCase();
        const skill =
          byNormalized.get(key) ??
          (await tx.skill.create({
            data: { name, normalized: key, type: "OTHER" },
          }));
        byNormalized.set(key, skill);
        await tx.jobSkill.create({
          data: { jobId: created.id, skillId: skill.id },
        });
      }
    }

    return created;
  });

  await invalidateJobCaches(job.id, recruiter.companyId);

  return db.job.findUniqueOrThrow({
    where: { id: job.id },
    include: { skills: { include: { skill: { select: { name: true } } } } },
  });
}

export type DeleteJobResult =
  | { ok: true }
  | { ok: false; reason: "HAS_APPLICATIONS"; count: number };

export async function deleteMyJob(
  userId: string,
  jobId: string,
): Promise<DeleteJobResult | null> {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return null;
  }

  const job = await db.job.findUnique({
    where: { id: jobId },
    select: { id: true, companyId: true },
  });

  if (!job || job.companyId !== recruiter.companyId) {
    return null;
  }

  const count = await db.application.count({ where: { jobId } });

  if (count > 0) {
    return { ok: false, reason: "HAS_APPLICATIONS", count };
  }

  await db.job.delete({ where: { id: job.id } });

  await invalidateJobCaches(job.id, job.companyId);

  return { ok: true };
}

export async function getMyInterviews(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return [];
  }

  const interviews = await db.interview.findMany({
    where: {
      OR: [
        { recruiterId: recruiter.id },
        { job: { companyId: recruiter.companyId } },
      ],
    },
    include: {
      student: {
        select: {
          id: true,
          rollNo: true,
          firstName: true,
          lastName: true,
          branch: true,
          user: { select: { id: true, name: true, image: true } },
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          company: { select: { id: true, name: true } },
        },
      },
      application: { select: { id: true, status: true } },
    },
    orderBy: { scheduledDate: "asc" },
  });

  return computeConflicts(interviews);
}

export async function createInterview(
  userId: string,
  data: CreateInterviewInput,
) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  const student = await db.studentProfile.findUnique({
    where: { id: data.studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  let jobId = data.jobId;
  let jobTitle: string | null = null;

  if (data.jobId) {
    const job = await db.job.findUnique({ where: { id: data.jobId } });

    if (!job || job.companyId !== recruiter.companyId) {
      throw new Error("Job not found");
    }

    jobTitle = job.title;
  }

  if (data.applicationId) {
    const application = await db.application.findUnique({
      where: { id: data.applicationId },
      include: { job: { select: { title: true } } },
    });

    if (!application || application.studentId !== data.studentId) {
      throw new Error("Application not found");
    }

    if (!jobId) {
      jobId = application.jobId;
      jobTitle = application.job.title;
    }
  }

  const startOfDay = new Date(data.scheduledDate);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  const sameDayInterviews = await db.interview.findMany({
    where: {
      studentId: data.studentId,
      scheduledDate: { gte: startOfDay, lt: endOfDay },
    },
    select: {
      id: true,
      studentId: true,
      scheduledDate: true,
      startTime: true,
      endTime: true,
      durationMinutes: true,
      roundName: true,
      job: { select: { title: true } },
    },
  });

  const flagged = computeConflicts<ConflictSource>([
    {
      id: "__new__",
      studentId: data.studentId,
      scheduledDate: data.scheduledDate,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      durationMinutes: data.durationMinutes ?? null,
      roundName: data.roundName,
      job: jobTitle ? { title: jobTitle } : null,
    },
    ...sameDayInterviews,
  ]);

  const created = flagged[0];

  if (!created) {
    throw new Error("Failed to create interview");
  }

  const createdInterview = await db.interview.create({
    data: {
      studentId: data.studentId,
      recruiterId: recruiter.id,
      jobId: jobId ?? undefined,
      applicationId: data.applicationId ?? undefined,
      roundName: data.roundName,
      roundNumber: data.roundNumber ?? 1,
      scheduledDate: data.scheduledDate,
      startTime: data.startTime,
      endTime: data.endTime,
      durationMinutes: data.durationMinutes,
      mode: data.mode ?? "VIRTUAL",
      venue: data.venue,
      meetingLink: data.meetingLink,
      interviewerName: data.interviewerName,
      interviewerEmail: data.interviewerEmail,
      interviewerPanel: data.interviewerPanel?.join(", "),
      hasConflict: created.hasConflict,
      conflictDetails: created.conflictDetails ?? Prisma.DbNull,
    },
    include: {
      student: {
        select: {
          id: true,
          rollNo: true,
          firstName: true,
          lastName: true,
          branch: true,
          user: { select: { id: true, name: true, image: true } },
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          company: { select: { id: true, name: true } },
        },
      },
      application: { select: { id: true, status: true } },
    },
  });

  await Promise.all(
    flagged.slice(1).map((row) =>
      db.interview.updateMany({
        where: { id: row.id },
        data: {
          hasConflict: row.hasConflict,
          conflictDetails: row.conflictDetails ?? Prisma.DbNull,
        },
      }),
    ),
  );

  const application =
    createdInterview.application ??
    (createdInterview.jobId
      ? await db.application.findFirst({
          where: {
            studentId: createdInterview.studentId,
            jobId: createdInterview.jobId,
          },
          select: { id: true, status: true },
        })
      : null);

  if (
    application &&
    ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "ASSESSMENT"].includes(
      application.status,
    )
  ) {
    await db.application.update({
      where: { id: application.id },
      data: { status: "INTERVIEW" },
    });

    await invalidateApplicationCaches(application.id);
  }

  await invalidateInterviewCache();

  return createdInterview;
}

export async function updateInterview(
  userId: string,
  interviewId: string,
  data: UpdateInterviewInput,
) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return null;
  }

  const existing = await db.interview.findUnique({
    where: { id: interviewId },
    select: {
      id: true,
      studentId: true,
      recruiterId: true,
      roundName: true,
      scheduledDate: true,
      startTime: true,
      endTime: true,
      durationMinutes: true,
      job: { select: { id: true, title: true, companyId: true } },
    },
  });

  if (
    !existing ||
    (existing.recruiterId !== recruiter.id &&
      existing.job?.companyId !== recruiter.companyId)
  ) {
    return null;
  }

  const schedulingChanged =
    data.scheduledDate !== undefined ||
    data.startTime !== undefined ||
    data.endTime !== undefined ||
    data.durationMinutes !== undefined;

  const scheduledDate = data.scheduledDate ?? existing.scheduledDate;
  const startTime = data.startTime ?? existing.startTime;
  const endTime = data.endTime ?? existing.endTime;
  const durationMinutes = data.durationMinutes ?? existing.durationMinutes;

  const dayStart = new Date(scheduledDate);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  const sameDayInterviews = await db.interview.findMany({
    where: {
      studentId: existing.studentId,
      scheduledDate: { gte: dayStart, lt: dayEnd },
      id: { not: interviewId },
    },
    select: {
      id: true,
      studentId: true,
      scheduledDate: true,
      startTime: true,
      endTime: true,
      durationMinutes: true,
      roundName: true,
      job: { select: { title: true } },
    },
  });

  const flagged = computeConflicts<ConflictSource>([
    {
      id: existing.id,
      studentId: existing.studentId,
      scheduledDate,
      startTime: startTime ?? null,
      endTime: endTime ?? null,
      durationMinutes: durationMinutes ?? null,
      roundName: existing.roundName,
      job: existing.job ? { title: existing.job.title } : null,
    },
    ...sameDayInterviews,
  ]);

  const recomputed = flagged[0];

  if (!recomputed) {
    throw new Error("Failed to update interview");
  }

  const updated = await db.interview.update({
    where: { id: interviewId },
    data: {
      scheduledDate,
      startTime,
      endTime,
      durationMinutes,
      mode: data.mode ?? undefined,
      venue: data.venue ?? undefined,
      meetingLink: data.meetingLink ?? undefined,
      status: schedulingChanged ? "RESCHEDULED" : (data.status ?? undefined),
      hasConflict: recomputed.hasConflict,
      conflictDetails: recomputed.conflictDetails ?? Prisma.DbNull,
    },
    include: {
      student: {
        select: {
          id: true,
          rollNo: true,
          firstName: true,
          lastName: true,
          branch: true,
          user: { select: { id: true, name: true, image: true } },
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          company: { select: { id: true, name: true } },
        },
      },
      application: { select: { id: true, status: true } },
    },
  });

  await Promise.all(
    flagged.slice(1).map((row) =>
      db.interview.updateMany({
        where: { id: row.id },
        data: {
          hasConflict: row.hasConflict,
          conflictDetails: row.conflictDetails ?? Prisma.DbNull,
        },
      }),
    ),
  );

  await invalidateInterviewCache();

  return updated;
}

export async function getShortlistedCandidates(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return [];
  }

  return db.application.findMany({
    where: {
      status: "SHORTLISTED",
      job: { companyId: recruiter.companyId },
    },
    include: {
      job: { select: { id: true, title: true, location: true, ctc: true } },
      student: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
      matchResult: true,
    },
    orderBy: { appliedAt: "desc" },
  });
}

const offerInclude = {
  student: {
    select: {
      id: true,
      rollNo: true,
      firstName: true,
      lastName: true,
      branch: true,
      user: { select: { id: true, name: true, image: true } },
    },
  },
  company: { select: { id: true, name: true, logoUrl: true } },
  job: { select: { id: true, title: true } },
} as const;

export async function getMyOffers(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return [];
  }

  return db.offer.findMany({
    where: { companyId: recruiter.companyId },
    include: offerInclude,
    orderBy: { offerDate: "desc" },
  });
}

export async function createMyOffer(userId: string, data: CreateMyOfferInput) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  const student = await db.studentProfile.findUnique({
    where: { id: data.studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  let jobId = data.jobId ?? null;

  if (data.jobId) {
    const job = await db.job.findUnique({ where: { id: data.jobId } });

    if (!job || job.companyId !== recruiter.companyId) {
      throw new Error("Job not found");
    }
  }

  if (data.applicationId) {
    const application = await db.application.findUnique({
      where: { id: data.applicationId },
    });

    if (!application || application.studentId !== data.studentId) {
      throw new Error("Application not found");
    }

    if (!jobId) {
      jobId = application.jobId;
    }
  }

  const studentName =
    `${student.firstName} ${student.lastName}`.trim() || "Candidate";

  const offer = await db.offer.create({
    data: {
      studentId: data.studentId,
      companyId: recruiter.companyId,
      jobId: jobId ?? undefined,
      applicationId: data.applicationId ?? undefined,
      role: data.role,
      ctc: `₹${data.ctc.toFixed(1)} LPA`,
      baseSalary:
        data.baseSalary !== undefined ? data.baseSalary * 100000 : undefined,
      variableBonus:
        data.variableBonus !== undefined
          ? data.variableBonus * 100000
          : undefined,
      joiningDate: data.joiningDate,
      notes: data.notes,
      status: "SENT",
    },
    include: offerInclude,
  });

  await db.recruiterNotification.create({
    data: {
      recruiterId: recruiter.id,
      type: "OFFER",
      priority: "MEDIUM",
      title: "Offer issued",
      message: `Offer for the role of ${data.role} was issued to ${studentName}.`,
      actionUrl: "/recruiter/offers",
      actionLabel: "View offers",
      metadata: { offerId: offer.id },
    },
  });

  return offer;
}

export async function getMyNotifications(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return { notifications: [], unreadCount: 0 };
  }

  const [notifications, unreadCount] = await Promise.all([
    db.recruiterNotification.findMany({
      where: { recruiterId: recruiter.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.recruiterNotification.count({
      where: { recruiterId: recruiter.id, isRead: false },
    }),
  ]);

  return { notifications, unreadCount };
}

export async function markNotificationRead(userId: string, id: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return null;
  }

  const notification = await db.recruiterNotification.findUnique({
    where: { id },
  });

  if (!notification || notification.recruiterId !== recruiter.id) {
    return null;
  }

  if (notification.isRead) {
    return notification;
  }

  return db.recruiterNotification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return null;
  }

  const result = await db.recruiterNotification.updateMany({
    where: { recruiterId: recruiter.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return result.count;
}

export async function getRecruiterStats(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    return null;
  }

  const companyId = recruiter.companyId;

  const [
    jobs,
    applications,
    shortlisted,
    offers,
    unreadNotifications,
    candidateGroups,
    interviewRows,
  ] = await Promise.all([
    db.job.count({ where: { companyId } }),
    db.application.count({ where: { job: { companyId } } }),
    db.application.count({
      where: { job: { companyId }, status: "SHORTLISTED" },
    }),
    db.offer.count({ where: { companyId } }),
    db.recruiterNotification.count({
      where: { recruiterId: recruiter.id, isRead: false },
    }),
    db.application.findMany({
      where: { job: { companyId } },
      distinct: ["studentId"],
      select: { studentId: true },
    }),
    db.interview.findMany({
      where: {
        OR: [
          { recruiterId: recruiter.id },
          { job: { companyId } },
        ],
      },
      select: {
        id: true,
        studentId: true,
        scheduledDate: true,
        startTime: true,
        endTime: true,
        durationMinutes: true,
        roundName: true,
        job: { select: { title: true } },
      },
    }),
  ]);

  const flagged = computeConflicts(interviewRows);

  return {
    jobs,
    candidates: candidateGroups.length,
    applications,
    shortlisted,
    offers,
    unreadNotifications,
    interviewConflicts: flagged.filter((row) => row.hasConflict).length,
  };
}
