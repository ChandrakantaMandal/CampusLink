import { db } from "../../services";
import { redis } from "@CampusLink/redis";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { createMailer } from "@CampusLink/auth/sendMail/mailer";
import { ENV } from "../../env.server";

import type {
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateAssessmentResultInput,
  UpdateAssessmentResultInput,
  AssessmentQuestion,
  AssessmentInviteState,
} from "./assessment.schema";
import { assessmentQuestionSchema } from "./assessment.schema";

const CACHE_TTL = 300;

function tokenSecret() {
  return process.env.BETTER_AUTH_SECRET || ENV.BETTER_AUTH_SECRET;
}

function signInvite(id: string) {
  return createHmac("sha256", tokenSecret()).update(id).digest("hex");
}

function readInviteToken(token: string) {
  const [id, signature, extra] = token.split(".");
  if (!id || !signature || extra) throw new Error("Invalid assessment link");
  const expected = Buffer.from(signInvite(id), "hex");
  const actual = Buffer.from(signature, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error("Invalid assessment link");
  return id;
}

async function generateJobQuestions(job: { title: string; description: string; skills: { skill: { name: string } }[] }) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ENV.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key is not configured");
  const provider = createGoogleGenerativeAI({ apiKey });
  const result = await generateObject({
    model: provider("gemini-3.5-flash-lite"),
    schema: assessmentQuestionSchema,
    prompt: `Create exactly 10 distinct, technically accurate, single-answer multiple-choice assessment questions for the role ${job.title}. Job description: ${job.description.slice(0, 5000)}. Relevant skills: ${job.skills.map(({ skill }) => skill.name).join(", ") || "infer relevant skills from the role description"}. Mix foundational and applied questions. Each question must have exactly four concise options, one correctIndex from 0 to 3, and a useful explanation. Return no trick questions.`,
  });
  return assessmentQuestionSchema.parse(result.object).questions;
}

export async function sendBatchAssessmentInvites(userId: string, applicationIds: string[], webUrl: string) {
  const recruiter = await db.recruiterProfile.findUnique({ where: { userId }, include: { company: true } });
  if (!recruiter) throw new Error("Recruiter profile not found");
  const applications = await db.application.findMany({
    // Accept student profile IDs as well so older open shortlist pages continue to work.
    where: {
      OR: [{ id: { in: applicationIds } }, { studentId: { in: applicationIds } }],
      status: "SHORTLISTED",
      job: { companyId: recruiter.companyId },
    },
    include: { job: { include: { skills: { include: { skill: true } } } }, student: { include: { user: true } } },
  });
  if (!applications.length) throw new Error("None of the selected records are currently shortlisted for your company");
  const ids = new Set(applications.flatMap(({ id, studentId }) => [id, studentId]));
  const missing = applicationIds.filter((id) => !ids.has(id));
  if (missing.length) throw new Error("Some selected candidates are no longer shortlisted or do not belong to your company");

  const questionsByJob = new Map<string, AssessmentQuestion[]>();
  const mailer = createMailer(ENV);
  let sent = 0;
  for (const application of applications) {
    let questions = questionsByJob.get(application.jobId);
    if (!questions) {
      questions = await generateJobQuestions(application.job);
      questionsByJob.set(application.jobId, questions);
    }
    const id = randomBytes(24).toString("base64url");
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const state: AssessmentInviteState = { applicationId: application.id, studentId: application.studentId, jobTitle: application.job.title, companyName: recruiter.company.name, questions, expiresAt };
    await redis.set(`assessment:invite:${id}`, JSON.stringify(state), "EX", 7 * 24 * 60 * 60);
    const token = `${id}.${signInvite(id)}`;
    const assessmentUrl = `${webUrl.replace(/\/$/, "")}/assessment/${encodeURIComponent(token)}`;
    try {
      await mailer.sendAssessmentLink(application.student.user.email, application.student.user.name || "Student", application.job.title, recruiter.company.name, assessmentUrl);
    } catch (error) {
      await redis.del(`assessment:invite:${id}`);
      throw new Error(`Email delivery failed for ${application.student.user.email}: ${error instanceof Error ? error.message : "unknown error"}. Sent ${sent} of ${applications.length} invitations.`);
    }
    await db.application.update({ where: { id: application.id }, data: { status: "ASSESSMENT" } });
    sent += 1;
  }
  return { sent, total: applications.length };
}

export async function getAssessmentInvite(token: string) {
  const id = readInviteToken(token);
  const raw = await redis.get(`assessment:invite:${id}`);
  if (!raw) throw new Error("Assessment link has expired or is invalid");
  const state = JSON.parse(raw) as AssessmentInviteState;
  if (state.expiresAt <= Date.now()) throw new Error("Assessment link has expired");
  const existing = await db.assessmentResult.findFirst({ where: { studentId: state.studentId, feedback: { contains: `\"inviteId\":\"${id}\"` } } });
  if (state.submitted || existing) return { jobTitle: state.jobTitle, companyName: state.companyName, submitted: true, result: state.submitted ?? JSON.parse(existing!.feedback!).result };
  return { jobTitle: state.jobTitle, companyName: state.companyName, submitted: false, questions: state.questions.map(({ correctIndex: _correctIndex, explanation: _explanation, ...question }) => question) };
}

export async function submitAssessmentInvite(token: string, answers: number[]) {
  if (answers.length !== 10 || answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3)) throw new Error("Answer all 10 questions before submitting");
  const id = readInviteToken(token);
  const key = `assessment:invite:${id}`;
  const raw = await redis.get(key);
  if (!raw) throw new Error("Assessment link has expired or is invalid");
  const state = JSON.parse(raw) as AssessmentInviteState;
  if (state.expiresAt <= Date.now()) throw new Error("Assessment link has expired");
  if (state.submitted) throw new Error("This assessment has already been submitted");
  if (state.questions.length !== 10) throw new Error("This assessment is invalid");
  const review = state.questions.map((question, index) => {
    const selectedIndex = answers[index];
    if (selectedIndex === undefined) throw new Error("Answer all 10 questions before submitting");
    return {
      prompt: question.prompt,
      options: question.options,
      selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect: selectedIndex === question.correctIndex,
      explanation: question.explanation,
    };
  });
  const score = review.filter((answer) => answer.isCorrect).length;
  const assessment = await db.assessment.create({ data: { title: `${state.jobTitle} Assessment`, description: `Assessment invitation ${id}`, type: "TECHNICAL", maxScore: 10 } });
  const result = { score, total: 10, percentage: score * 10, review };
  const passed = score >= 6;
  await db.assessmentResult.create({ data: { assessmentId: assessment.id, studentId: state.studentId, score, percentage: score * 10, passed, feedback: JSON.stringify({ inviteId: id, applicationId: state.applicationId, result }) } });
  if (!passed) {
    await db.application.update({ where: { id: state.applicationId }, data: { status: "REJECTED" } });
  }
  state.submitted = result;
  await redis.set(key, JSON.stringify(state), "EX", Math.max(1, Math.ceil((state.expiresAt - Date.now()) / 1000)));
  return result;
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

export async function createAssessment(data: CreateAssessmentInput) {
  const assessment = await db.assessment.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      maxScore: data.maxScore,
    },
  });

  await redis.del(
    "assessments:all",
    "admin:assessment:stats",
    "admin:dashboard:stats",
  );

  return assessment;
}

export async function getAssessments() {
  const cacheKey = "assessments:all";

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const assessments = await db.assessment.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  await setCache(cacheKey, assessments);

  return assessments;
}

export async function getAssessmentById(assessmentId: string) {
  const cacheKey = `assessment:${assessmentId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const assessment = await db.assessment.findUnique({
    where: {
      id: assessmentId,
    },
  });

  if (assessment) {
    await setCache(cacheKey, assessment);
  }

  return assessment;
}

export async function updateAssessment(
  assessmentId: string,
  data: UpdateAssessmentInput,
) {
  const assessment = await db.assessment.update({
    where: {
      id: assessmentId,
    },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      maxScore: data.maxScore,
    },
  });

  await redis.del(
    `assessment:${assessmentId}`,
    "assessments:all",
    "admin:assessment:stats",
    "admin:dashboard:stats",
  );

  return assessment;
}

export async function deleteAssessment(assessmentId: string) {
  const assessment = await db.assessment.delete({
    where: {
      id: assessmentId,
    },
  });

  await redis.del(
    `assessment:${assessmentId}`,
    "assessments:all",
    "admin:assessment:stats",
    "admin:dashboard:stats",
  );

  return assessment;
}

export async function createAssessmentResult(
  assessmentId: string,
  data: CreateAssessmentResultInput,
) {
  const assessment = await db.assessment.findUnique({
    where: {
      id: assessmentId,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  const student = await db.studentProfile.findUnique({
    where: {
      id: data.studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  if (
    data.score !== undefined &&
    assessment.maxScore !== null &&
    assessment.maxScore !== undefined &&
    data.score > assessment.maxScore
  ) {
    throw new Error(
      `Score cannot be greater than maximum score (${assessment.maxScore})`,
    );
  }

  const result = await db.assessmentResult.create({
    data: {
      assessmentId,
      studentId: data.studentId,
      score: data.score,
      percentage: data.percentage,
      passed: data.passed,
      feedback: data.feedback,
    },
    include: {
      assessment: true,
      student: true,
    },
  });

  await redis.del(
    `assessment:results:${assessmentId}`,
    `assessment:results:student:${data.studentId}`,
    "admin:assessment:stats",
    "admin:dashboard:stats",
  );

  return result;
}

export async function getMyAssessmentResults(userId: string) {
  const student = await db.studentProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const cacheKey = `assessment:results:student:${student.id}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const results = await db.assessmentResult.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      assessment: true,
    },
    orderBy: {
      takenAt: "desc",
    },
  });

  await setCache(cacheKey, results);

  return results;
}

export async function getAssessmentResults(assessmentId: string) {
  const assessment = await db.assessment.findUnique({
    where: {
      id: assessmentId,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  const cacheKey = `assessment:results:${assessmentId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const results = await db.assessmentResult.findMany({
    where: {
      assessmentId,
    },
    include: {
      student: true,
    },
    orderBy: {
      takenAt: "desc",
    },
  });

  await setCache(cacheKey, results);

  return results;
}

export async function getAssessmentResultById(resultId: string) {
  const cacheKey = `assessment:result:${resultId}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const result = await db.assessmentResult.findUnique({
    where: {
      id: resultId,
    },
    include: {
      assessment: true,
      student: true,
    },
  });

  if (result) {
    await setCache(cacheKey, result);
  }

  return result;
}

export async function updateAssessmentResult(
  resultId: string,
  data: UpdateAssessmentResultInput,
) {
  const result = await db.assessmentResult.findUnique({
    where: {
      id: resultId,
    },
    include: {
      assessment: true,
    },
  });

  if (!result) {
    throw new Error("Assessment result not found");
  }

  if (
    data.score !== undefined &&
    result.assessment.maxScore !== null &&
    result.assessment.maxScore !== undefined &&
    data.score > result.assessment.maxScore
  ) {
    throw new Error(
      `Score cannot be greater than maximum score (${result.assessment.maxScore})`,
    );
  }

  const updatedResult = await db.assessmentResult.update({
    where: {
      id: resultId,
    },
    data: {
      score: data.score,
      percentage: data.percentage,
      passed: data.passed,
      feedback: data.feedback,
    },
    include: {
      assessment: true,
      student: true,
    },
  });

  await redis.del(
    `assessment:result:${resultId}`,
    `assessment:results:${result.assessmentId}`,
    `assessment:results:student:${result.studentId}`,
    "admin:assessment:stats",
    "admin:dashboard:stats",
  );

  return updatedResult;
}

export async function deleteAssessmentResult(resultId: string) {
  const result = await db.assessmentResult.findUnique({
    where: {
      id: resultId,
    },
  });

  if (!result) {
    throw new Error("Assessment result not found");
  }

  const deletedResult = await db.assessmentResult.delete({
    where: {
      id: resultId,
    },
  });

  await redis.del(
    `assessment:result:${resultId}`,
    `assessment:results:${result.assessmentId}`,
    `assessment:results:student:${result.studentId}`,
    "admin:assessment:stats",
    "admin:dashboard:stats",
  );

  return deletedResult;
}
