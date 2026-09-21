import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["STUDENT", "RECRUITER", "ADMIN"]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
