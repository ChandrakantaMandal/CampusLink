import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2, "Project title is required").max(150),

  description: z.string().max(2000).optional(),

  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),

  liveUrl: z.string().url("Invalid live URL").optional().or(z.literal("")),

  startDate: z.string().datetime().optional(),

  endDate: z.string().datetime().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const addProjectSkillSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export type AddProjectSkillInput = z.infer<typeof addProjectSkillSchema>;
