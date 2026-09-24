import { db } from "../../services";
import { redis } from "@CampusLink/redis";

import type {
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateAssessmentResultInput,
  UpdateAssessmentResultInput,
} from "./assessment.schema";

const CACHE_TTL = 300;

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
