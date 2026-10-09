import { z } from "zod";

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
