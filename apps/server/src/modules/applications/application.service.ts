import { db } from "../../services";
import { redis } from "@CampusLink/redis";
import { invalidateStudentCaches } from "../students/student.service";
import { matchStudentWithJob } from "../jobs/job-ai.service";

import type {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
} from "./application.schema";

const CACHE_TTL = 300;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

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

export async function createApplication(
  userId: string,
  data: CreateApplicationInput,
) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const job = await db.job.findUnique({
    where: {
      id: data.jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  const existingApplication = await db.application.findUnique({
    where: {
      studentId_jobId: {
        studentId: student.id,
        jobId: data.jobId,
      },
    },
  });

  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }

  const application = await db.application.create({
    data: {
      studentId: student.id,
      userId,
      jobId: data.jobId,
      status: "APPLIED",
    },
    include: {
      job: {
        include: {
          company: true,
          skills: { include: { skill: true } },
        },
      },
    },
  });

  await redis.del(
    `applications:user:${userId}`,
    `applications:student:${student.id}`,
    `application:job:${data.jobId}`,
    `applications:company:${job.companyId}`,
    "admin:applications",
    "admin:dashboard:stats",
  );

  return application;
}

export async function getMyApplications(userId: string) {
  const cacheKey = `applications:user:${userId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const applications = await db.application.findMany({
    where: {
      studentId: student.id,
    },
    include: {
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

  await setCache(cacheKey, applications);

  return applications;
}

export async function getRecruiterApplications(userId: string) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!recruiter || !recruiter.companyId) {
    return [];
  }

  const applications = await db.application.findMany({
    where: {
      job: {
        companyId: recruiter.companyId,
      },
    },
    include: {
      job: {
        include: {
          company: true,
          skills: { include: { skill: true } },
        },
      },
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
              image: true,
            },
          },
          skills: { include: { skill: true } },
          education: true,
          projects: true,
          certifications: true,
          readiness: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
      matchResult: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  // Use the same matcher and profile inputs as /student/jobs so recruiter
  // scores include structured skills, resume skills, and project titles.
  for (const application of applications) {
    try {
      const response = await matchStudentWithJob(application.student.userId, application.job.id) as {
        data?: unknown;
        match_score?: number;
        matchScore?: number;
        matched_skills?: string[];
        matchedSkills?: string[];
        missing_skills?: string[];
        missingSkills?: string[];
        explanation?: string;
      };
      const result = (response.data && typeof response.data === "object" ? response.data : response) as {
        match_score?: number;
        matchScore?: number;
        matched_skills?: string[];
        matchedSkills?: string[];
        missing_skills?: string[];
        missingSkills?: string[];
        explanation?: string;
      };
      const matchScore = result.match_score ?? result.matchScore;
      if (typeof matchScore !== "number") continue;
      const matchedSkills = result.matched_skills ?? result.matchedSkills ?? [];
      const missingSkills = result.missing_skills ?? result.missingSkills ?? [];
      const saved = await db.matchResult.upsert({
        where: { applicationId: application.id },
        create: {
          applicationId: application.id,
          eligible: true,
          matchScore,
          skillMatchScore: matchScore,
          matchedSkills,
          missingSkills,
          positiveSignals: matchedSkills,
          gaps: missingSkills,
          explanation: result.explanation ?? "",
        },
        update: {
          eligible: true,
          matchScore,
          skillMatchScore: matchScore,
          matchedSkills,
          missingSkills,
          positiveSignals: matchedSkills,
          gaps: missingSkills,
          explanation: result.explanation ?? "",
        },
      });
      application.matchResult = saved;
    } catch {
      // Keep the application visible if the AI service is temporarily unavailable.
    }
  }

  // Readiness is calculated once per student by the AI readiness endpoint and
  // saved with its source marker so later candidate-list visits can reuse it.
  // Every application row has a separate student object, so propagate the
  // same student-level score to each row for candidates with multiple jobs.
  const readinessByStudent = new Map<string, number | null>();
  for (const application of applications) {
    const student = application.student;
    if (readinessByStudent.has(student.id)) {
      const score = readinessByStudent.get(student.id) ?? null;
      Object.assign(student, { aiReadinessAvailable: score !== null });
      if (score !== null) student.readinessScore = score;
      continue;
    }
    const latest = student.readiness[0];
    const breakdown = latest?.breakdown;
    if (
      typeof breakdown === "object" && breakdown !== null &&
      !Array.isArray(breakdown) && "source" in breakdown &&
      breakdown.source === "ai-service-v2"
    ) {
      student.readinessScore = latest.overallScore;
      Object.assign(student, { aiReadinessAvailable: true });
      readinessByStudent.set(student.id, latest.overallScore);
      continue;
    }

    try {
      const response = await fetch(`${AI_SERVICE_URL}/readiness/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          name: [student.firstName, student.lastName].filter(Boolean).join(" "),
          skills: student.skills.map(({ skill }) => skill.name),
          projects: student.projects.map(({ title }) => title),
          education: student.education.map((item) => [item.degree, item.branch, item.institution].filter(Boolean).join(" ")).join("; "),
          branch: student.branch,
          cgpa: student.cgpa,
          certifications: student.certifications.map(({ name }) => name),
          target_role: student.targetRole,
          resume_text: student.resumeText ?? "",
        }),
      });
      if (!response.ok) {
        readinessByStudent.set(student.id, null);
        continue;
      }
      const result = await response.json() as {
        readiness_score?: number;
        strengths?: string[];
        weaknesses?: string[];
        recommendations?: string[];
      };
      if (typeof result.readiness_score !== "number") {
        readinessByStudent.set(student.id, null);
        continue;
      }
      await db.readinessResult.create({
        data: {
          studentId: student.id,
          overallScore: result.readiness_score,
          explanation: result.strengths?.join("; ") ?? null,
          breakdown: {
            source: "ai-service-v2",
            strengths: result.strengths ?? [],
            weaknesses: result.weaknesses ?? [],
            recommendations: result.recommendations ?? [],
          },
        },
      });
      await db.studentProfile.update({
        where: { id: student.id },
        data: { readinessScore: result.readiness_score },
      });
      await invalidateStudentCaches(student.userId, student.id);
      student.readinessScore = result.readiness_score;
      Object.assign(student, { aiReadinessAvailable: true });
      readinessByStudent.set(student.id, result.readiness_score);
    } catch {
      // Preserve candidate visibility when the AI service is temporarily down.
      readinessByStudent.set(student.id, null);
    }
  }

  return applications;
}

export async function getApplicationById(applicationId: string) {
  const cacheKey = `application:${applicationId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const application = await db.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
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
      },
      matchResult: true,
    },
  });

  if (application) {
    await setCache(cacheKey, application);
  }

  return application;
}

export async function updateApplicationStatus(
  userId: string,
  applicationId: string,
  data: UpdateApplicationStatusInput,
) {
  const application = await db.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      job: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const recruiter = await db.recruiterProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!recruiter) {
    throw new Error("Recruiter profile not found");
  }

  if (recruiter.companyId !== application.job.companyId) {
    throw new Error("You are not authorized to update this application");
  }

  const updatedApplication = await db.$transaction(async (tx) => {
    const updated = await tx.application.update({
      where: { id: applicationId },
      data: { status: data.status },
      include: {
        job: { include: { company: true } },
        student: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        matchResult: true,
      },
    });

    if (data.status === "OFFER_EXTENDED") {
      await tx.offer.upsert({
        where: { applicationId },
        create: {
          applicationId,
          studentId: application.studentId,
          companyId: application.job.companyId,
          jobId: application.jobId,
          role: application.job.title,
          ctc: application.job.ctc ?? "To be discussed",
          status: "DRAFT",
        },
        update: {},
      });
    }

    return updated;
  });

  await redis.del(
    `application:${applicationId}`,
    `applications:user:${application.userId}`,
    `applications:student:${application.studentId}`,
    `application:job:${application.jobId}`,
    `applications:company:${application.job.companyId}`,
    "admin:applications",
    "admin:dashboard:stats",
  );

  return updatedApplication;
}

export async function invalidateApplicationCaches(applicationId: string) {
  const application = await db.application.findUnique({
    where: { id: applicationId },
    select: {
      userId: true,
      studentId: true,
      jobId: true,
      job: { select: { companyId: true } },
    },
  });

  if (!application) {
    return;
  }

  await redis.del(
    `application:${applicationId}`,
    `applications:user:${application.userId}`,
    `applications:student:${application.studentId}`,
    `application:job:${application.jobId}`,
    `applications:company:${application.job.companyId}`,
    "admin:applications",
    "admin:dashboard:stats",
  );
}
