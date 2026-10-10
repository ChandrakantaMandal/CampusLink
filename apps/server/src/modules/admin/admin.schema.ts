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
  contactPerson: z.string().min(1).optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  packageRange: z.string().optional(),
  eligibilityCriteria: z.string().optional(),
  tier: z.enum(["TIER_1", "TIER_2", "TIER_3"]).default("TIER_2"),
});

export type CreateRecruiterInput = z.infer<typeof createRecruiterSchema>;

export const updateInterviewScheduleSchema = z.object({
  scheduledDate: z.coerce.date().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().optional(),
  meetingLink: z.string().optional(),
  mode: z.enum(["VIRTUAL", "IN_PERSON", "HYBRID"]).optional(),
  durationMinutes: z.number().int().min(5).max(600).optional(),
});

export type UpdateInterviewScheduleInput = z.infer<
  typeof updateInterviewScheduleSchema
>;

export const broadcastNotificationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  message: z.string().min(1, "Message is required"),
  audience: z.enum(["ALL_STUDENTS", "RECRUITERS"]).default("ALL_STUDENTS"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export type BroadcastNotificationInput = z.infer<
  typeof broadcastNotificationSchema
>;

export const updateAdminSettingsSchema = z.object({
  profile: z
    .object({
      name: z.string().min(1, "Name is required").max(120).optional(),
      email: z.string().email("Invalid email").optional(),
      phone: z.string().max(30).optional(),
      designation: z.string().max(120).optional(),
    })
    .optional(),
  campus: z
    .object({
      collegeName: z.string().min(1, "College name is required").max(200),
      collegeCode: z.string().max(50),
      academicYear: z.string().max(50),
      placementSeason: z.string().max(50),
      activeDepartments: z.string().max(300),
      tpoHead: z.string().max(120),
    })
    .optional(),
  system: z
    .object({
      autoEligibilityFilter: z.boolean(),
      strictBacklogRule: z.boolean(),
      aiMatchingThreshold: z.number().int().min(50).max(90),
      conflictAlertSensitivity: z.enum(["Strict", "Moderate", "Lenient"]),
      emailDigestDaily: z.boolean(),
      scheduleCollisionDetection: z.boolean(),
    })
    .optional(),
});

export type UpdateAdminSettingsInput = z.infer<
  typeof updateAdminSettingsSchema
>;

export const verifyStudentSchema = z.object({
  verified: z.boolean(),
});

export type VerifyStudentInput = z.infer<typeof verifyStudentSchema>;

export const verifyRecruiterSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
});

export type VerifyRecruiterInput = z.infer<typeof verifyRecruiterSchema>;
