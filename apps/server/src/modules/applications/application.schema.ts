import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),

  coverLetter: z.string().max(5000, "Cover letter is too long").optional(),

  resumeId: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "APPLIED",
    "SHORTLISTED",
    "ASSESSMENT",
    "INTERVIEW",
    "SELECTED",
    "REJECTED",
    "WITHDRAWN",
  ]),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
