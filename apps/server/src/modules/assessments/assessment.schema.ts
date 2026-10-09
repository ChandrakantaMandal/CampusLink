import { z } from "zod";

export const assessmentTypeSchema = z.enum([
  "TECHNICAL",
  "APTITUDE",
  "CODING",
  "INTERVIEW",
  "COMMUNICATION",
  "OTHER",
]);

export const assessmentQuestionSchema = z.object({
  questions: z.array(z.object({
    prompt: z.string().min(8),
    options: z.array(z.string().min(1)).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string().min(8),
  })).length(10),
});

export type AssessmentQuestion = z.infer<typeof assessmentQuestionSchema>["questions"][number];

export type AssessmentReview = {
  prompt: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
};

export type AssessmentInviteResult = {
  score: number;
  total: number;
  percentage: number;
  review: AssessmentReview[];
};

export type AssessmentInviteState = {
  applicationId: string;
  studentId: string;
  jobTitle: string;
  companyName: string;
  questions: AssessmentQuestion[];
  expiresAt: number;
  submitted?: AssessmentInviteResult;
};

export const createAssessmentSchema = z.object({
  title: z.string().min(2, "Assessment title is required").max(200),

  description: z.string().max(1000).optional(),

  type: assessmentTypeSchema,

  maxScore: z.number().min(0).optional(),
});

export const updateAssessmentSchema = createAssessmentSchema.partial();

export const createAssessmentResultSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),

  score: z.number().min(0).optional(),

  percentage: z.number().min(0).max(100).optional(),

  passed: z.boolean().optional(),

  feedback: z.string().max(2000).optional(),
});

export const updateAssessmentResultSchema = createAssessmentResultSchema
  .omit({
    studentId: true,
  })
  .partial();

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;

export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;

export type CreateAssessmentResultInput = z.infer<
  typeof createAssessmentResultSchema
>;

export type UpdateAssessmentResultInput = z.infer<
  typeof updateAssessmentResultSchema
>;
