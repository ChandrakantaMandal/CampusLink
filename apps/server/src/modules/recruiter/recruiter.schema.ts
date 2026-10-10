import { z } from "zod";

export const notificationPrefsSchema = z.object({
  applications: z.boolean().optional(),
  interviews: z.boolean().optional(),
  conflicts: z.boolean().optional(),
  offers: z.boolean().optional(),
  digest: z.boolean().optional(),
});

export const updateRecruiterProfileSchema = z.object({
  designation: z.string().max(120).optional(),
  phone: z.string().max(30).nullable().optional(),
  linkedinUrl: z.string().url().max(300).optional(),
  isLeadRecruiter: z.boolean().optional(),
  notificationPrefs: notificationPrefsSchema.optional(),

  company: z
    .object({
      name: z.string().min(2).max(150).optional(),
      description: z.string().max(5000).optional(),
      website: z.string().url().max(300).optional(),
      logoUrl: z.string().max(500).nullable().optional(),
      industry: z.string().max(120).optional(),
      location: z.string().max(200).optional(),
      linkedinUrl: z.string().url().max(300).optional(),
      benefits: z.array(z.string().max(120)).max(30).optional(),
      tier: z.enum(["TIER_1", "TIER_2", "TIER_3"]).optional(),
    })
    .optional(),
});

export const createRecruiterProfileSchema = z.object({
  designation: z.string().max(120).optional(),
  phone: z.string().max(30).nullable().optional(),
  linkedinUrl: z.string().url().max(300).optional(),
  company: z.object({
    name: z.string().min(2).max(150),
    description: z.string().max(5000).optional(),
    website: z.string().url().max(300).optional(),
    logoUrl: z.string().max(500).nullable().optional(),
    industry: z.string().max(120).optional(),
    location: z.string().max(200).optional(),
    linkedinUrl: z.string().url().max(300).optional(),
    benefits: z.array(z.string().max(120)).max(30).optional(),
    tier: z.enum(["TIER_1", "TIER_2", "TIER_3"]).optional(),
  }),
});

export const createMyJobSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(150),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000),

  location: z.string().max(200).optional(),
  employmentType: z.string().max(50).optional(),
  workMode: z.string().max(50).optional(),

  ctc: z.string().max(120).optional(),
  openPositions: z.number().int().min(1).max(1000).optional(),

  minCGPA: z.number().min(0).max(10).optional(),
  maxBacklogs: z.number().int().min(0).optional(),

  requiredDegree: z.string().max(120).optional(),
  requiredBranch: z.string().max(120).optional(),
  allowedBranches: z.array(z.string().max(120)).max(50).optional(),
  requiredSkills: z.array(z.string().min(1).max(60)).max(30).optional(),
  graduationYear: z.number().int().min(2000).max(2100).optional(),

  minExperience: z.number().int().min(0).optional(),
  maxExperience: z.number().int().min(0).optional(),

  applicationDeadline: z.coerce.date().optional(),

  status: z
    .enum([
      "DRAFT",
      "PUBLISHED",
      "APPLICATIONS_OPEN",
      "APPLICATIONS_CLOSED",
      "INTERVIEWING",
      "COMPLETED",
      "ARCHIVED",
    ])
    .optional(),
});

export const createInterviewSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),

  jobId: z.string().min(1).optional(),
  applicationId: z.string().min(1).optional(),

  roundName: z.string().min(1).max(120),
  roundNumber: z.number().int().min(1).max(50).optional(),

  scheduledDate: z.coerce.date(),
  startTime: z.string().max(10).optional(),
  endTime: z.string().max(10).optional(),
  durationMinutes: z.number().int().min(5).max(600).optional(),

  mode: z.enum(["VIRTUAL", "IN_PERSON", "HYBRID"]).optional(),
  venue: z.string().max(300).optional(),
  meetingLink: z.string().url().max(500).optional(),

  interviewerName: z.string().max(150).optional(),
  interviewerEmail: z.string().email().max(200).optional(),
  interviewerPanel: z.array(z.string().max(150)).max(20).optional(),
});

export const updateInterviewSchema = z.object({
  scheduledDate: z.coerce.date().optional(),
  startTime: z.string().max(10).optional(),
  endTime: z.string().max(10).optional(),
  durationMinutes: z.number().int().min(5).max(600).optional(),

  mode: z.enum(["VIRTUAL", "IN_PERSON", "HYBRID"]).optional(),
  venue: z.string().max(300).optional(),
  meetingLink: z.string().url().max(500).optional(),

  status: z
    .enum(["SCHEDULED", "COMPLETED", "RESCHEDULED", "CANCELLED", "NO_SHOW"])
    .optional(),
});

export const createMyOfferSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),

  jobId: z.string().min(1).optional(),
  applicationId: z.string().min(1).optional(),

  role: z.string().min(1, "Role is required").max(150),

  ctc: z.number().min(0, "CTC must be positive"),
  baseSalary: z.number().min(0).optional(),
  variableBonus: z.number().min(0).optional(),

  joiningDate: z.coerce.date().optional(),
  notes: z.string().max(2000).optional(),
});

export type UpdateRecruiterProfileInput = z.infer<
  typeof updateRecruiterProfileSchema
>;
export type CreateRecruiterProfileInput = z.infer<typeof createRecruiterProfileSchema>;

export type CreateMyJobInput = z.infer<typeof createMyJobSchema>;

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;

export type CreateMyOfferInput = z.infer<typeof createMyOfferSchema>;

export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
