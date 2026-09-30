import { z } from "zod";

export const createPlacementDriveSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  title: z.string().min(1, "Title is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  tier: z.enum(["TIER_1", "TIER_2", "TIER_3"]).default("TIER_2"),
  type: z.enum(["IN_PERSON", "VIRTUAL", "HYBRID"]).default("IN_PERSON"),
  status: z
    .enum([
      "DRAFT",
      "OPEN",
      "ONGOING",
      "APPLICATIONS_CLOSED",
      "COMPLETED",
      "CANCELLED",
    ])
    .default("OPEN"),
  salary: z.string().optional(),
  minCgpa: z.number().min(0).max(10).optional(),
  backlogsAllowed: z.number().int().min(0).default(0),
  batchEligibility: z.string().optional(),
  allowedBranches: z.array(z.string().min(1)).default([]),
  requiredSkills: z.array(z.string().min(1)).default([]),
  rounds: z.array(z.string().min(1)).default([]),
  openings: z.number().int().min(1).default(1),
  jobIds: z.array(z.string()).default([]),
  driveDate: z.coerce.date(),
  driveTime: z.string().optional(),
  venue: z.string().optional(),
  deadline: z.coerce.date().optional(),
});

export type CreatePlacementDriveInput = z.infer<
  typeof createPlacementDriveSchema
>;

export const updatePlacementDriveSchema = createPlacementDriveSchema.partial();

export type UpdatePlacementDriveInput = z.infer<
  typeof updatePlacementDriveSchema
>;

export const createRecruiterSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  packageRange: z.string().optional(),
  eligibilityCriteria: z.string().optional(),
  tier: z.enum(["TIER_1", "TIER_2", "TIER_3"]).default("TIER_2"),
});

export type CreateRecruiterInput = z.infer<typeof createRecruiterSchema>;
