import { api } from "./client";
import type {
  RecruiterCandidate,
  RecruiterCompany,
  RecruiterInterview,
  RecruiterJob,
  RecruiterNotification,
  RecruiterOffer,
} from "@/components/dashboard/recruiter/recruiter.types";

interface Envelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RecruiterApplicationRaw {
  id: string;
  status: string;
  appliedAt: string;
  notes?: string | null;
  resumeUrl?: string | null;
  user: { id: string; name: string | null; email: string };
  student: {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    college?: string | null;
    branch?: string | null;
    cgpa?: number | null;
    backlogs?: number;
    graduationYear?: number | null;
    readinessScore?: number | null;
    resumeUrl?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    user: { id: string; name: string | null; email: string; image?: string | null };
  } | null;
  job: { id: string; title: string };
  matchResult: { matchScore?: number | null } | null;
}

// ---------- Status mapping ----------

const STATUS_TO_VIEW: Record<string, RecruiterCandidate["status"]> = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  ASSESSMENT: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  SELECTED: "Selected",
  OFFER_EXTENDED: "Offer",
  ACCEPTED: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Rejected",
};

const VIEW_TO_STATUS: Record<RecruiterCandidate["status"], string> = {
  Applied: "APPLIED",
  "Under Review": "UNDER_REVIEW",
  Shortlisted: "SHORTLISTED",
  Interview: "INTERVIEW",
  Selected: "SELECTED",
  Offer: "OFFER_EXTENDED",
  Rejected: "REJECTED",
};

// ---------- Helpers ----------

function normalizeScore(raw: number | null | undefined): number {
  if (raw == null || Number.isNaN(raw)) return 0;
  const score = raw <= 1 ? raw * 100 : raw;
  return Math.round(score);
}

function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function displayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  fallback: string | null | undefined,
): string {
  const name = [firstName, lastName].filter(Boolean).join(" ");
  return name || fallback || "";
}

function toRecruiterCandidate(raw: RecruiterApplicationRaw): RecruiterCandidate {
  const student = raw.student;

  return {
    id: raw.id,
    studentId: student?.id,
    name: displayName(student?.firstName, student?.lastName, student?.user?.name ?? raw.user?.name),
    email: student?.user?.email ?? raw.user?.email ?? "",
    phone: student?.phone ?? "",
    college: student?.college ?? "",
    branch: student?.branch ?? "",
    cgpa: student?.cgpa ?? 0,
    backlogs: student?.backlogs ?? 0,
    graduationYear: student?.graduationYear ?? 0,
    skills: [],
    matchScore: normalizeScore(raw.matchResult?.matchScore),
    readinessScore: normalizeScore(student?.readinessScore),
    status: STATUS_TO_VIEW[raw.status] ?? "Applied",
    appliedJobId: raw.job?.id ?? "",
    appliedJobTitle: raw.job?.title ?? "",
    appliedDate: dateOnly(raw.appliedAt),
    resumeUrl: student?.resumeUrl ?? raw.resumeUrl ?? undefined,
    githubUrl: student?.githubUrl ?? undefined,
    linkedinUrl: student?.linkedinUrl ?? undefined,
    notes: raw.notes ?? undefined,
  };
}

// ---------- Endpoints ----------

export async function getApplications(): Promise<RecruiterCandidate[]> {
  const response = await api.get<Envelope<RecruiterApplicationRaw[]>>(
    "/api/applications",
  );

  return response.data.data.map(toRecruiterCandidate);
}

export async function updateApplicationStatus(
  id: string,
  status: RecruiterCandidate["status"],
): Promise<void> {
  await api.patch(`/api/applications/${id}/status`, {
    status: VIEW_TO_STATUS[status],
  });
}

// ---------- Recruiter raw types ----------

export interface RecruiterProfileRaw {
  id: string;
  userId: string;
  companyId: string;
  designation?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  isLeadRecruiter: boolean;
  notificationPrefs?: {
    applications?: boolean;
    interviews?: boolean;
    conflicts?: boolean;
    offers?: boolean;
    digest?: boolean;
  } | null;
  company: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    website?: string | null;
    logoUrl?: string | null;
    industry?: string | null;
    location?: string | null;
    linkedinUrl?: string | null;
    verifiedStatus: string;
    tier?: "TIER_1" | "TIER_2" | "TIER_3" | null;
    benefits?: string[];
  };
  user: { id: string; name: string | null; email: string; image?: string | null };
  _count?: { jobs: number; interviews: number };
}

export interface RecruiterJobRaw {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  employmentType?: string | null;
  workMode?: string | null;
  ctc?: string | null;
  openPositions?: number | null;
  minCGPA?: number | null;
  maxBacklogs?: number | null;
  requiredDegree?: string | null;
  requiredBranch?: string | null;
  allowedBranches?: string[];
  graduationYear?: number | null;
  minExperience?: number | null;
  maxExperience?: number | null;
  applicationDeadline?: string | null;
  status: string;
  createdAt: string;
  applicantsCount?: number;
  shortlistedCount?: number;
  interviewCount?: number;
  offersCount?: number;
  skills?: Array<{ skill: { name: string } }>;
}

export interface RecruiterInterviewRaw {
  id: string;
  jobId?: string | null;
  studentId: string;
  roundName: string;
  roundNumber: number;
  scheduledDate: string;
  startTime?: string | null;
  endTime?: string | null;
  durationMinutes?: number | null;
  mode: string;
  venue?: string | null;
  meetingLink?: string | null;
  interviewerName?: string | null;
  interviewerEmail?: string | null;
  interviewerPanel?: string | null;
  status: string;
  hasConflict?: boolean;
  conflictDetails?: string | null;
  student?: {
    id: string;
    rollNo?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    branch?: string | null;
    user?: { id: string; name: string | null; image?: string | null };
  } | null;
  job?: {
    id: string;
    title: string;
    company?: { id: string; name: string } | null;
  } | null;
  application?: { id: string; status: string } | null;
}

export interface ShortlistedApplicationRaw {
  id: string;
  status: string;
  appliedAt: string;
  notes?: string | null;
  resumeUrl?: string | null;
  job: { id: string; title: string; location?: string | null; ctc?: string | null };
  student: {
    id: string;
    rollNo?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    college?: string | null;
    branch?: string | null;
    cgpa?: number | null;
    backlogs?: number;
    graduationYear?: number | null;
    readinessScore?: number | null;
    resumeUrl?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    user: { id: string; name: string | null; email: string; image?: string | null };
  } | null;
  matchResult: { matchScore?: number | null } | null;
}

// ---------- Recruiter mapping ----------

const JOB_STATUS_TO_VIEW: Record<string, RecruiterJob["status"]> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  APPLICATIONS_OPEN: "Applications Open",
  APPLICATIONS_CLOSED: "Applications Closed",
  INTERVIEWING: "Interviewing",
  COMPLETED: "Completed",
  ARCHIVED: "Completed",
};

const INTERVIEW_MODE_TO_VIEW: Record<string, RecruiterInterview["mode"]> = {
  VIRTUAL: "Online Google Meet",
  IN_PERSON: "In-Person Campus Lab",
  HYBRID: "Online Zoom",
};

export const VIEW_TO_INTERVIEW_MODE: Record<RecruiterInterview["mode"], string> = {
  "Online Google Meet": "VIRTUAL",
  "In-Person Campus Lab": "IN_PERSON",
  "Online Zoom": "HYBRID",
};

const INTERVIEW_STATUS_TO_VIEW: Record<string, RecruiterInterview["status"]> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
  NO_SHOW: "Cancelled",
};

function toJobType(employmentType: string | null | undefined): RecruiterJob["jobType"] {
  const value = (employmentType ?? "").toLowerCase();
  if (value.includes("intern")) return "Internship";
  if (value.includes("ppo")) return "PPO";
  return "Full-Time";
}

function toRecruiterCompany(raw: RecruiterProfileRaw): RecruiterCompany {
  const company = raw.company;

  return {
    id: company.id,
    name: company.name,
    logo: company.logoUrl ?? "",
    industry: company.industry ?? "",
    location: company.location ?? "",
    description: company.description ?? "",
    website: company.website ?? "",
    tier: company.tier ?? "TIER_3",
    recruiterName: raw.user.name ?? "",
    recruiterEmail: raw.user.email,
    recruiterPhone: raw.phone ?? "",
    linkedinUrl: raw.linkedinUrl ?? company.linkedinUrl ?? "",
    verifiedStatus:
      company.verifiedStatus === "VERIFIED"
        ? "Verified Campus Partner"
        : "Pending Verification",
    benefits: company.benefits ?? [],
  };
}

function toRecruiterJob(raw: RecruiterJobRaw): RecruiterJob {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    location: raw.location ?? "",
    jobType: toJobType(raw.employmentType),
    ctc: raw.ctc ?? "",
    openPositions: raw.openPositions ?? 1,
    minCGPA: raw.minCGPA ?? 0,
    maxBacklogs: raw.maxBacklogs ?? 0,
    graduationYear: raw.graduationYear ?? 0,
    allowedBranches: raw.allowedBranches ?? [],
    applicationDeadline: raw.applicationDeadline ? dateOnly(raw.applicationDeadline) : "",
    status: JOB_STATUS_TO_VIEW[raw.status] ?? "Draft",
    requiredSkills: raw.skills?.map((entry) => entry.skill.name) ?? [],
    rounds: [],
    applicantsCount: raw.applicantsCount ?? 0,
    shortlistedCount: raw.shortlistedCount ?? 0,
    interviewCount: raw.interviewCount ?? 0,
    offersCount: raw.offersCount ?? 0,
  };
}

function parseConflictDetail(
  raw: string,
): { conflictingWith: string; existingSlot: string; newSlot: string; message: string } {
  const match = /^Overlaps with (.+) \((.+)\)$/.exec(raw);
  return {
    conflictingWith: match?.[1] ?? "",
    existingSlot: match?.[2] ?? "",
    newSlot: "",
    message: raw,
  };
}

function toRecruiterInterview(raw: RecruiterInterviewRaw): RecruiterInterview {
  const time = [raw.startTime, raw.endTime].filter(Boolean).join(" – ");

  return {
    id: raw.id,
    candidateId: raw.studentId,
    candidateName: displayName(raw.student?.firstName, raw.student?.lastName, raw.student?.user?.name),
    candidateEmail: "",
    jobId: raw.job?.id ?? "",
    jobTitle: raw.job?.title ?? "",
    round: raw.roundName,
    date: dateOnly(raw.scheduledDate),
    time,
    duration: raw.durationMinutes ? `${raw.durationMinutes} mins` : "",
    mode: INTERVIEW_MODE_TO_VIEW[raw.mode] ?? "Online Google Meet",
    meetingLink: raw.meetingLink ?? undefined,
    venue: raw.venue ?? undefined,
    interviewerPanel: raw.interviewerPanel ?? "",
    status: INTERVIEW_STATUS_TO_VIEW[raw.status] ?? "Scheduled",
    hasConflict: raw.hasConflict ?? false,
    conflictDetails: raw.conflictDetails ? parseConflictDetail(raw.conflictDetails) : undefined,
  };
}

function toShortlistedCandidate(raw: ShortlistedApplicationRaw): RecruiterCandidate {
  const student = raw.student;

  return {
    id: student?.id ?? raw.id,
    studentId: student?.id,
    name: displayName(student?.firstName, student?.lastName, student?.user?.name),
    email: student?.user?.email ?? "",
    phone: student?.phone ?? "",
    college: student?.college ?? "",
    branch: student?.branch ?? "",
    cgpa: student?.cgpa ?? 0,
    backlogs: student?.backlogs ?? 0,
    graduationYear: student?.graduationYear ?? 0,
    skills: [],
    matchScore: normalizeScore(raw.matchResult?.matchScore),
    readinessScore: normalizeScore(student?.readinessScore),
    status: "Shortlisted",
    appliedJobId: raw.job?.id ?? "",
    appliedJobTitle: raw.job?.title ?? "",
    appliedDate: dateOnly(raw.appliedAt),
    resumeUrl: student?.resumeUrl ?? raw.resumeUrl ?? undefined,
    githubUrl: student?.githubUrl ?? undefined,
    linkedinUrl: student?.linkedinUrl ?? undefined,
    notes: raw.notes ?? undefined,
  };
}

// ---------- Recruiter inputs ----------

export interface UpdateRecruiterProfileInput {
  designation?: string;
  phone?: string;
  linkedinUrl?: string;
  isLeadRecruiter?: boolean;
  notificationPrefs?: {
    applications?: boolean;
    interviews?: boolean;
    conflicts?: boolean;
    offers?: boolean;
    digest?: boolean;
  };
  company?: {
    name?: string;
    description?: string;
    website?: string;
    logoUrl?: string | null;
    industry?: string;
    location?: string;
    linkedinUrl?: string;
    benefits?: string[];
    tier?: "TIER_1" | "TIER_2" | "TIER_3";
  };
}

export interface CreateRecruiterJobInput {
  title: string;
  description: string;
  location?: string;
  employmentType?: string;
  workMode?: string;
  ctc?: string;
  openPositions?: number;
  minCGPA?: number;
  maxBacklogs?: number;
  requiredDegree?: string;
  requiredBranch?: string;
  allowedBranches?: string[];
  requiredSkills?: string[];
  graduationYear?: number;
  minExperience?: number;
  maxExperience?: number;
  applicationDeadline?: string;
  status?: string;
}

export interface CreateRecruiterInterviewInput {
  studentId: string;
  jobId?: string;
  applicationId?: string;
  roundName: string;
  roundNumber?: number;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  mode?: string;
  venue?: string;
  meetingLink?: string;
  interviewerName?: string;
  interviewerEmail?: string;
  interviewerPanel?: string[];
}

export interface UpdateRecruiterInterviewInput {
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
}

// ---------- Recruiter endpoints ----------

export async function getRecruiterProfile(): Promise<RecruiterCompany> {
  const response = await api.get<Envelope<RecruiterProfileRaw>>(
    "/api/recruiter/profile",
  );
  return toRecruiterCompany(response.data.data);
}

export async function updateRecruiterProfile(
  input: UpdateRecruiterProfileInput,
): Promise<RecruiterCompany> {
  const response = await api.patch<Envelope<RecruiterProfileRaw>>(
    "/api/recruiter/profile",
    input,
  );
  return toRecruiterCompany(response.data.data);
}

export async function getMyJobs(): Promise<RecruiterJob[]> {
  const response = await api.get<Envelope<RecruiterJobRaw[]>>(
    "/api/recruiter/jobs",
  );
  return response.data.data.map(toRecruiterJob);
}

export async function createMyJob(
  input: CreateRecruiterJobInput,
): Promise<RecruiterJob> {
  const response = await api.post<Envelope<RecruiterJobRaw>>(
    "/api/recruiter/jobs",
    input,
  );
  return toRecruiterJob(response.data.data);
}

export async function deleteMyJob(jobId: string): Promise<void> {
  await api.delete(`/api/recruiter/jobs/${jobId}`);
}

export async function getMyInterviews(): Promise<RecruiterInterview[]> {
  const response = await api.get<Envelope<RecruiterInterviewRaw[]>>(
    "/api/recruiter/interviews",
  );
  return response.data.data.map(toRecruiterInterview);
}

export async function createMyInterview(
  input: CreateRecruiterInterviewInput,
): Promise<RecruiterInterview> {
  const response = await api.post<Envelope<RecruiterInterviewRaw>>(
    "/api/recruiter/interviews",
    input,
  );
  return toRecruiterInterview(response.data.data);
}

export async function updateMyInterview(
  interviewId: string,
  input: UpdateRecruiterInterviewInput,
): Promise<RecruiterInterview> {
  const response = await api.patch<Envelope<RecruiterInterviewRaw>>(
    `/api/recruiter/interviews/${interviewId}`,
    input,
  );
  return toRecruiterInterview(response.data.data);
}

export async function getShortlistedCandidates(): Promise<RecruiterCandidate[]> {
  const response = await api.get<Envelope<ShortlistedApplicationRaw[]>>(
    "/api/recruiter/shortlisted",
  );
  return response.data.data.map(toShortlistedCandidate);
}

// ---------- Offers / notifications / stats raw types ----------

export interface RecruiterOfferRaw {
  id: string;
  studentId: string;
  companyId: string;
  jobId?: string | null;
  applicationId?: string | null;
  role: string;
  ctc: string;
  baseSalary?: number | null;
  variableBonus?: number | null;
  currency: string;
  offerDate: string;
  responseDeadline?: string | null;
  joiningDate?: string | null;
  offerLetterUrl?: string | null;
  status: string;
  documentStatus: string;
  documentsVerified: boolean;
  joiningStatus: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    rollNo?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    branch?: string | null;
    user: { id: string; name: string | null; image?: string | null };
  };
  company: { id: string; name: string; logoUrl?: string | null };
  job?: { id: string; title: string } | null;
}

export interface RecruiterNotificationRaw {
  id: string;
  recruiterId: string;
  type: string;
  priority?: string | null;
  title: string;
  message: string;
  actionUrl?: string | null;
  actionLabel?: string | null;
  isRead: boolean;
  readAt?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterStats {
  jobs: number;
  candidates: number;
  applications: number;
  shortlisted: number;
  offers: number;
  unreadNotifications: number;
  interviewConflicts: number;
}

// ---------- Offers / notifications status mapping ----------

const OFFER_STATUS_TO_VIEW: Record<string, RecruiterOffer["acceptanceStatus"]> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PENDING_ACCEPTANCE: "Pending Acceptance",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  WITHDRAWN: "Withdrawn",
};

const DOCUMENT_STATUS_TO_VIEW: Record<
  string,
  RecruiterOffer["documentVerification"]
> = {
  PENDING_VERIFICATION: "Pending Review",
  VERIFIED: "Verified",
  REJECTED: "Action Required",
  ACTION_REQUIRED: "Action Required",
};

const JOINING_STATUS_TO_VIEW: Record<string, RecruiterOffer["joiningStatus"]> = {
  CONFIRMED: "Confirmed",
  AWAITING_ONBOARDING: "Awaiting Onboarding",
  JOINED: "Joined",
  DECLINED: "Declined",
};

const NOTIFICATION_TYPE_TO_VIEW: Record<string, RecruiterNotification["type"]> = {
  APPLICATION: "application",
  AI_MATCH: "ai_match",
  INTERVIEW: "interview",
  CONFLICT: "conflict",
  OFFER: "offer",
  SYSTEM: "system",
  DRIVE: "system",
};

// ---------- Offers / notifications helpers ----------

function formatLpa(amount: number): string {
  return `₹${(amount / 100000).toFixed(1)} LPA`;
}

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  if (diffMs < 60_000) return "Just now";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------- Offers / notifications mappers ----------

function toRecruiterOffer(raw: RecruiterOfferRaw): RecruiterOffer {
  const fullName =
    `${raw.student.firstName ?? ""} ${raw.student.lastName ?? ""}`.trim();
  return {
    id: raw.id,
    candidateId: raw.student.id,
    candidateName: fullName || raw.student.user.name || "Unknown Candidate",
    candidateBranch: raw.student.branch ?? "",
    jobId: raw.jobId ?? "",
    role: raw.role,
    ctc: raw.ctc,
    baseSalary: raw.baseSalary != null ? formatLpa(raw.baseSalary) : "",
    variableBonus: raw.variableBonus != null ? formatLpa(raw.variableBonus) : "",
    joiningDate: raw.joiningDate ? formatLongDate(raw.joiningDate) : "",
    offerLetterUrl: raw.offerLetterUrl ?? "",
    acceptanceStatus: OFFER_STATUS_TO_VIEW[raw.status] ?? "Sent",
    documentVerification:
      DOCUMENT_STATUS_TO_VIEW[raw.documentStatus] ?? "Pending Review",
    joiningStatus: JOINING_STATUS_TO_VIEW[raw.joiningStatus] ?? "Awaiting Onboarding",
  };
}

function toRecruiterNotification(
  raw: RecruiterNotificationRaw,
): RecruiterNotification {
  return {
    id: raw.id,
    title: raw.title,
    message: raw.message,
    time: relativeTime(raw.createdAt),
    type: NOTIFICATION_TYPE_TO_VIEW[raw.type] ?? "system",
    isRead: raw.isRead,
    actionUrl: raw.actionUrl ?? undefined,
  };
}

// ---------- Offers / notifications inputs ----------

export interface CreateRecruiterOfferInput {
  studentId: string;
  jobId?: string;
  applicationId?: string;
  role: string;
  ctc: number;
  baseSalary?: number;
  variableBonus?: number;
  joiningDate?: string;
  notes?: string;
}

export interface NotificationFeed {
  notifications: RecruiterNotification[];
  unreadCount: number;
}

// ---------- Offers / notifications / stats endpoints ----------

export async function getMyOffers(): Promise<RecruiterOffer[]> {
  const response = await api.get<Envelope<RecruiterOfferRaw[]>>(
    "/api/recruiter/offers",
  );
  return response.data.data.map(toRecruiterOffer);
}

export async function createMyOffer(
  input: CreateRecruiterOfferInput,
): Promise<RecruiterOffer> {
  const response = await api.post<Envelope<RecruiterOfferRaw>>(
    "/api/recruiter/offers",
    input,
  );
  return toRecruiterOffer(response.data.data);
}

export async function getMyNotifications(): Promise<NotificationFeed> {
  const response = await api.get<
    Envelope<{ notifications: RecruiterNotificationRaw[]; unreadCount: number }>
  >("/api/recruiter/notifications");
  const payload = response.data.data;
  return {
    notifications: payload.notifications.map(toRecruiterNotification),
    unreadCount: payload.unreadCount,
  };
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch("/api/recruiter/notifications/read-all");
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/api/recruiter/notifications/${id}/read`);
}

export async function getRecruiterStats(): Promise<RecruiterStats> {
  const response = await api.get<Envelope<RecruiterStats>>(
    "/api/recruiter/stats",
  );
  return response.data.data;
}

// ---------- Notification prefs ----------

export interface RecruiterNotificationPrefs {
  applications: boolean;
  interviews: boolean;
  conflicts: boolean;
  offers: boolean;
  digest: boolean;
}

export async function getMyNotificationPrefs(): Promise<RecruiterNotificationPrefs> {
  const response = await api.get<Envelope<RecruiterProfileRaw>>(
    "/api/recruiter/profile",
  );
  const stored = response.data.data.notificationPrefs ?? {};
  return {
    applications: stored.applications ?? true,
    interviews: stored.interviews ?? true,
    conflicts: stored.conflicts ?? true,
    offers: stored.offers ?? true,
    digest: stored.digest ?? false,
  };
}
