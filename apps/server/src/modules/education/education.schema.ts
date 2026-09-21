import { z } from "zod";

export const createEducationSchema = z.object({
  institution: z.string().min(2, "Institution name is required").max(200),

  degree: z.string().max(100).optional(),

  branch: z.string().max(100).optional(),

  startYear: z.number().int().min(1900).max(2100).optional(),

  endYear: z.number().int().min(1900).max(2100).optional(),

  cgpa: z.number().min(0).max(10).optional(),

  percentage: z.number().min(0).max(100).optional(),
});

export const updateEducationSchema = createEducationSchema.partial();

export type CreateEducationInput = z.infer<typeof createEducationSchema>;

export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
