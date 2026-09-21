import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(2, "Job title is required").max(150),

  description: z.string().min(10, "Job description is required").max(5000),

  location: z.string().max(150).optional(),

  employmentType: z.string().max(50).optional(),

  workMode: z.string().max(50).optional(),

  salaryMin: z.number().nonnegative().optional(),

  salaryMax: z.number().nonnegative().optional(),

  applicationDeadline: z.string().datetime().optional(),

  companyId: z.string().min(1, "Company ID is required"),
});

export const updateJobSchema = createJobSchema
  .omit({
    companyId: true,
  })
  .partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;

export type UpdateJobInput = z.infer<typeof updateJobSchema>;
