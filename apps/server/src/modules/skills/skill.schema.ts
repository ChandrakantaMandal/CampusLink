import { z } from "zod";

export const skillTypeSchema = z.enum([
  "PROGRAMMING_LANGUAGE",
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "CLOUD",
  "FRAMEWORK",
  "TOOL",
  "SOFT_SKILL",
  "OTHER",
]);

export const skillLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export const createSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),

  normalized: z.string().min(1, "Normalized skill name is required").max(100),

  type: skillTypeSchema,

  description: z.string().max(500).optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

export const addStudentSkillSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),

  level: skillLevelSchema.default("BEGINNER"),

  years: z.number().min(0).optional(),

  source: z.string().max(100).optional(),
});

export const updateStudentSkillSchema = z.object({
  level: skillLevelSchema.optional(),

  years: z.number().min(0).optional(),

  source: z.string().max(100).optional(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;

export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;

export type AddStudentSkillInput = z.infer<typeof addStudentSkillSchema>;

export type UpdateStudentSkillInput = z.infer<typeof updateStudentSkillSchema>;
