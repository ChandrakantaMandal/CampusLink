import { z } from "zod";

export const skillLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export const addStudentSkillSchema = z
  .object({
    skillId: z.string().min(1, "Skill ID is required").optional(),

    skillName: z
      .string()
      .trim()
      .min(1, "Skill name is required")
      .max(100)
      .optional(),

    level: skillLevelSchema.default("BEGINNER"),

    years: z.number().min(0).optional(),

    source: z.string().max(100).optional(),
  })
  .refine((data) => Boolean(data.skillId ?? data.skillName), {
    message: "Either skillId or skillName is required",
    path: ["skillId"],
  });

export type AddStudentSkillInput = z.infer<typeof addStudentSkillSchema>;
