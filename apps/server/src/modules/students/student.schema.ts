import { z } from "zod";

export const updateStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50).optional(),

  lastName: z.string().max(50).optional(),

  phone: z.string().max(20).optional(),

  dateOfBirth: z.string().optional(),

  gender: z.string().max(20).optional(),

  college: z.string().max(150).optional(),

  department: z.string().max(100).optional(),

  graduationYear: z.number().int().min(2000).max(2100).optional(),

  cgpa: z.number().min(0).max(10).nullish(),

  bio: z.string().max(1000).optional(),

  location: z.string().max(150).optional(),

  isPublic: z.boolean().optional(),

  githubUrl: z.string().url().optional().or(z.literal("")),

  linkedinUrl: z.string().url().optional().or(z.literal("")),

  portfolioUrl: z.string().url().optional().or(z.literal("")),

  leetcodeUrl: z.string().url().optional().or(z.literal("")),

  hackerrankUrl: z.string().url().optional().or(z.literal("")),

  otherWebsiteUrl: z.string().url().optional().or(z.literal("")),
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
