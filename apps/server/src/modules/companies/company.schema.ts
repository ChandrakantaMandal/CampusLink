import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(150),

  description: z.string().max(2000).optional(),

  website: z.string().url("Invalid website URL").optional().or(z.literal("")),

  location: z.string().max(150).optional(),

  industry: z.string().max(100).optional(),

  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
});

export const updateCompanySchema = createCompanySchema.partial();

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
