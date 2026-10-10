import { api } from "./client";
import type {
  AdminStudent,
  AdminRecruiter,
  ApplicationItem,
  OfferItem,
  PlacementDrive,
  InterviewScheduleItem,
  SystemNotification,
} from "@/components/dashboard/admin/admin.types";

interface Envelope<T> {
  success: boolean;
  data: T;
  message?: string;
}



export interface AdminUserRef {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image?: string | null;
}

export interface CompanyRaw {
  id: string;
  name: string;
  logoUrl: string | null;
  industry: string | null;
  website: string | null;
  tier: string;
  verifiedStatus: string;
  _count?: { drives: number };
}

export interface AdminStudentRaw {
  id: string;
  userId: string;
  rollNo: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  branch: string | null;
  cgpa: number | null;
  backlogs: number;
  targetRole: string | null;
  isVerified: boolean;
  readinessScore: number | null;
  readinessBreakdown?: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  } | null;
  resumeUrl: string | null;
  user: AdminUserRef;
  skills: { skill: { id: string; name: string } }[];
  _count?: { applications: number; offers: number };
}

export interface RecruiterRaw {
  id: string;
  phone: string | null;
  designation: string | null;
  isLeadRecruiter: boolean;
  user: AdminUserRef;
  company: CompanyRaw;
  _count?: { jobs: number };
}

export interface AdminApplicationRaw {
  id: string;
  status: string;
  appliedAt: string;
  user: { id: string; name: string | null; email: string };
  student: {
    id: string;
    rollNo: string | null;
    firstName: string | null;
    lastName: string | null;
    branch: string | null;
    cgpa: number | null;
    user: { id: string; name: string | null; email: string };
  } | null;
  job: {
    id: string;
    title: string;
    company: CompanyRaw;
  };
  matchResult: { matchScore: number | null } | null;
}

export interface DriveRaw {
  id: string;
  companyId: string;
  title: string;
  role: string;
  description: string | null;
  tier: string;
  type: string;
  status: string;
  salary: string | null;
  minCgpa: number | null;
  backlogsAllowed: number;
  batchEligibility: string | null;
  allowedBranches: string[];
  requiredSkills: string[];
  rounds: string[];
  openings: number;
  driveDate: string;
  driveTime: string | null;
  venue: string | null;
  deadline: string | null;
  company: CompanyRaw;
  jobIds: string[];
  jobs?: { id: string; title: string }[];
  _count?: { registrations: number };
}

export interface OfferRaw {
  id: string;
  role: string;
  ctc: string;
  offerDate: string;
  joiningDate: string | null;
  status: string;
  documentStatus: string;
  offerLetterUrl: string | null;
  student: {
    id: string;
    rollNo: string | null;
    firstName: string | null;
    lastName: string | null;
    branch: string | null;
    user: { id: string; name: string | null; image: string | null };
  };
  company: { id: string; name: string; logoUrl: string | null };
  job: { id: string; title: string } | null;
}

export interface InterviewRaw {
  id: string;
  roundName: string | null;
  scheduledDate: string;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number | null;
  mode: string;
  venue: string | null;
  meetingLink: string | null;
  interviewerName: string | null;
  interviewerPanel: string | null;
  status: string;
  hasConflict: boolean;
  conflictDetails: string | null;
  student: {
    id: string;
    rollNo: string | null;
    firstName: string | null;
    lastName: string | null;
    branch: string | null;
    user: { id: string; name: string | null; image: string | null };
  } | null;
  recruiter: {
    id: string;
    designation: string | null;
    user: { id: string; name: string | null; email: string };
  } | null;
  job: { id: string; title: string; company: { id: string; name: string } } | null;
  application: { id: string; status: string } | null;
  drive: { id: string; title: string; company: { id: string; name: string } } | null;
}

export interface DashboardStats {
  users: {
    total: number;
    students: number;
    recruiters: number;
    admins: number;
  };
  companies: number;
  jobs: number;
  applications: number;
  assessments: number;
  drives: number;
  offers: number;
}

// ---------- Payloads ----------

export interface CreatePlacementDrivePayload {
  companyId: string;
  title: string;
  role: string;
  description?: string;
  tier?: string;
  type?: string;
  status?: string;
  salary?: string;
  minCgpa?: number;
  backlogsAllowed?: number;
  batchEligibility?: string;
  allowedBranches?: string[];
  requiredSkills?: string[];
  rounds?: string[];
  openings?: number;
  driveDate: string;
  driveTime?: string;
  venue?: string;
  deadline?: string;
  jobIds?: string[];
}

export type UpdatePlacementDrivePayload = Partial<CreatePlacementDrivePayload>;

export interface CreateRecruiterPayload {
  name: string;
  contactPerson?: string;
  email: string;
  password: string;
  phone?: string;
  industry?: string;
  website?: string;
  packageRange?: string;
  eligibilityCriteria?: string;
  tier?: string;
}

// ---------- Status / enum maps ----------

const TIER_TO_VIEW: Record<string, PlacementDrive["tier"]> = {
  TIER_1: "Super Dream",
  TIER_2: "Dream",
  TIER_3: "Regular",
};

export const VIEW_TO_TIER: Record<PlacementDrive["tier"], string> = {
  "Super Dream": "TIER_1",
  Dream: "TIER_2",
  Regular: "TIER_3",
};

const APPLICATION_STATUS_TO_VIEW: Record<string, ApplicationItem["status"]> = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Applied",
  SHORTLISTED: "Shortlisted",
  ASSESSMENT: "Shortlisted",
  INTERVIEW: "Interview",
  SELECTED: "Selected",
  OFFER_EXTENDED: "Offer",
  ACCEPTED: "Joined",
  REJECTED: "Rejected",
  WITHDRAWN: "Rejected",
};

const VIEW_TO_APPLICATION_STATUS: Record<
  ApplicationItem["status"],
  string
> = {
  Applied: "APPLIED",
  Shortlisted: "SHORTLISTED",
  Interview: "INTERVIEW",
  Selected: "SELECTED",
  Offer: "OFFER_EXTENDED",
  Joined: "ACCEPTED",
  Rejected: "REJECTED",
};

const DRIVE_STATUS_TO_VIEW: Record<string, PlacementDrive["status"]> = {
  DRAFT: "Draft",
  OPEN: "Open",
  ONGOING: "Ongoing",
  APPLICATIONS_CLOSED: "Applications Closed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const VIEW_TO_DRIVE_STATUS: Record<PlacementDrive["status"], string> = {
  Draft: "DRAFT",
  Open: "OPEN",
  Ongoing: "ONGOING",
  "Applications Closed": "APPLICATIONS_CLOSED",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
};

const RECRUITER_STATUS_TO_VIEW: Record<
  string,
  AdminRecruiter["status"]
> = {
  VERIFIED: "Active",
  PENDING: "Pending",
  NOT_VERIFIED: "Pending",
  REJECTED: "Inactive",
};

const OFFER_STATUS_TO_VIEW: Record<string, OfferItem["status"]> = {
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
};

const DOCUMENT_STATUS_TO_VIEW: Record<string, OfferItem["documentStatus"]> = {
  VERIFIED: "Verified",
  PENDING_VERIFICATION: "Pending Verification",
  REJECTED: "Action Required",
  ACTION_REQUIRED: "Action Required",
};

const INTERVIEW_STATUS_TO_VIEW: Record<string, InterviewScheduleItem["status"]> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
  NO_SHOW: "Cancelled",
};

const MODE_TO_VENUE: Record<string, string> = {
  VIRTUAL: "Virtual",
  IN_PERSON: "In Person",
  HYBRID: "Hybrid",
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

function toApplicationItem(raw: AdminApplicationRaw): ApplicationItem {
  const student = raw.student;

  return {
    id: raw.id,
    studentName: student
      ? displayName(student.firstName, student.lastName, student.user?.name)
      : (raw.user?.name ?? ""),
    studentRoll: student?.rollNo ?? "",
    branch: student?.branch ?? "",
    cgpa: student?.cgpa ?? 0,
    company: raw.job?.company?.name ?? "",
    role: raw.job?.title ?? "",
    appliedDate: dateOnly(raw.appliedAt),
    status: APPLICATION_STATUS_TO_VIEW[raw.status] ?? "Applied",
    matchScore: normalizeScore(raw.matchResult?.matchScore),
  };
}

function toAdminStudent(raw: AdminStudentRaw): AdminStudent {
  const readiness = raw.readinessScore ?? 0;
  const offersCount = raw._count?.offers ?? 0;

  let status: AdminStudent["status"] = "Eligible";
  if (offersCount > 0) {
    status = "Placed";
  } else if (raw.backlogs > 0) {
    status = "Needs Attention";
  } else if (!raw.isVerified) {
    status = "In Review";
  }

  return {
    id: raw.id,
    name: displayName(raw.firstName, raw.lastName, raw.user?.name),
    rollNo: raw.rollNo ?? "",
    avatar: raw.user?.image ?? "",
    email: raw.user?.email ?? "",
    phone: raw.phone ?? "",
    branch: raw.branch ?? "",
    cgpa: raw.cgpa ?? 0,
    backlogs: raw.backlogs,
    status,
    readinessScore: readiness,
    skills: (raw.skills ?? []).map((entry) => entry.skill?.name).filter(Boolean),
    missingSkills: [],
    applicationsCount: raw._count?.applications ?? 0,
    offersCount,
    verified: raw.isVerified,
    resumeUrl: raw.resumeUrl ?? "",
    targetRole: raw.targetRole ?? "",
    readinessBreakdown: raw.readinessBreakdown ?? {
      technical: readiness,
      assessment: readiness,
      projects: readiness,
      academics: readiness,
      resume: readiness,
    },
  };
}

function toAdminRecruiter(raw: RecruiterRaw): AdminRecruiter {
  const company = raw.company;

  return {
    id: raw.id,
    name: company?.name ?? "",
    logo: company?.logoUrl ?? "",
    contactPerson: raw.user?.name ?? "",
    email: raw.user?.email ?? "",
    phone: raw.phone ?? "",
    industry: company?.industry ?? "",
    website: company?.website ?? "",
    jobsCount: raw._count?.jobs ?? 0,
    drivesCount: company?._count?.drives ?? 0,
    status: RECRUITER_STATUS_TO_VIEW[company?.verifiedStatus] ?? "Pending",
    tier: TIER_TO_VIEW[company?.tier] ?? "Regular",
    packageRange: "",
    eligibilityCriteria: "",
    activeDrives: [],
  };
}

function toPlacementDriveView(raw: DriveRaw): PlacementDrive {
  return {
    id: raw.id,
    companyId: raw.companyId,
    company: raw.company?.name ?? "",
    logo: raw.company?.logoUrl ?? "",
    role: raw.role,
    description: raw.description ?? "",
    requiredSkills: raw.requiredSkills ?? [],
    minCgpa: raw.minCgpa ?? 0,
    backlogsAllowed: raw.backlogsAllowed,
    salary: raw.salary ?? "",
    deadline: raw.deadline ? dateOnly(raw.deadline) : "",
    driveDate: dateOnly(raw.driveDate),
    driveTime: raw.driveTime ?? "",
    venue: raw.venue ?? "",
    rounds: raw.rounds ?? [],
    openings: raw.openings,
    applicantsCount: raw._count?.registrations ?? 0,
    status: DRIVE_STATUS_TO_VIEW[raw.status] ?? "Draft",
    tier: TIER_TO_VIEW[raw.tier] ?? "Regular",
    jobIds: raw.jobIds ?? [],
    jobs: raw.jobs ?? [],
  };
}

function toOfferItem(raw: OfferRaw): OfferItem {
  return {
    id: raw.id,
    studentName: displayName(
      raw.student?.firstName,
      raw.student?.lastName,
      raw.student?.user?.name,
    ),
    avatar: raw.student?.user?.image ?? "",
    rollNo: raw.student?.rollNo ?? "",
    branch: raw.student?.branch ?? "",
    company: raw.company?.name ?? "",
    role: raw.role,
    package: `₹${raw.ctc} LPA`,
    offerDate: dateOnly(raw.offerDate),
    joiningDate: raw.joiningDate ? dateOnly(raw.joiningDate) : "",
    documentStatus: DOCUMENT_STATUS_TO_VIEW[raw.documentStatus] ?? "Pending Verification",
    status: OFFER_STATUS_TO_VIEW[raw.status] ?? "Pending",
    letterUrl: raw.offerLetterUrl ?? "",
  };
}

function toInterviewScheduleItem(raw: InterviewRaw): InterviewScheduleItem {
  const conflict =
    typeof raw.conflictDetails === "string"
      ? raw.conflictDetails
      : raw.conflictDetails != null
        ? JSON.stringify(raw.conflictDetails)
        : undefined;

  return {
    id: raw.id,
    company: raw.job?.company?.name ?? raw.drive?.company?.name ?? "",
    studentName: displayName(
      raw.student?.firstName,
      raw.student?.lastName,
      raw.student?.user?.name,
    ),
    rollNo: raw.student?.rollNo ?? "",
    interviewer: raw.interviewerName ?? raw.recruiter?.user?.name ?? "",
    panel: raw.interviewerPanel ?? "",
    date: dateOnly(raw.scheduledDate),
    startTime: raw.startTime ?? "",
    endTime: raw.endTime ?? "",
    venue: raw.venue || raw.meetingLink || MODE_TO_VENUE[raw.mode] || "",
    round: raw.roundName ?? "",
    status: INTERVIEW_STATUS_TO_VIEW[raw.status] ?? "Scheduled",
    venueRaw: raw.venue ?? "",
    meetingLink: raw.meetingLink ?? "",
    mode: (raw.mode as InterviewScheduleItem["mode"]) ?? "",
    durationMinutes: raw.durationMinutes,
    hasConflict: raw.hasConflict,
    conflictDetails: conflict,
  };
}

// ---------- Endpoints ----------

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<Envelope<DashboardStats>>("/api/admin/dashboard");
  return response.data.data;
}

export async function getAdminApplications(): Promise<ApplicationItem[]> {
  const response = await api.get<Envelope<AdminApplicationRaw[]>>(
    "/api/admin/applications",
  );

  return response.data.data.map(toApplicationItem);
}

export async function getAdminStudents(): Promise<AdminStudent[]> {
  const response = await api.get<Envelope<AdminStudentRaw[]>>(
    "/api/admin/students",
  );

  return response.data.data.map(toAdminStudent);
}

export async function getAdminRecruiters(): Promise<AdminRecruiter[]> {
  const response = await api.get<Envelope<RecruiterRaw[]>>(
    "/api/admin/recruiters",
  );

  return response.data.data.map(toAdminRecruiter);
}

export async function getAdminOffers(): Promise<OfferItem[]> {
  const response = await api.get<Envelope<OfferRaw[]>>("/api/admin/offers");

  return response.data.data.map(toOfferItem);
}

export interface AdminJobOption {
  id: string;
  title: string;
  companyId: string;
  ctc?: string | null;
  minCGPA?: number | null;
  maxBacklogs?: number | null;
  openPositions?: number;
  skills?: { skill?: { name?: string | null } | null }[];
}

export async function getAdminJobs(): Promise<AdminJobOption[]> {
  const response = await api.get<Envelope<AdminJobOption[]>>("/api/admin/jobs");
  return response.data.data;
}

export async function getAdminDrives(): Promise<PlacementDrive[]> {
  const response = await api.get<Envelope<DriveRaw[]>>("/api/admin/drives");

  return response.data.data.map(toPlacementDriveView);
}

export async function createAdminRecruiter(
  payload: CreateRecruiterPayload,
): Promise<AdminRecruiter> {
  const response = await api.post<Envelope<RecruiterRaw>>(
    "/api/admin/recruiters",
    payload,
  );
  return toAdminRecruiter(response.data.data);
}


export async function getCompaniesForDrive(): Promise<CompanyRaw[]> {
  const response = await api.get<Envelope<CompanyRaw[]>>(
    "/api/admin/companies",
  );

  return response.data.data;
}

export async function createPlacementDrive(
  payload: CreatePlacementDrivePayload,
): Promise<PlacementDrive> {
  const response = await api.post<Envelope<DriveRaw>>(
    "/api/admin/drives",
    payload,
  );

  return toPlacementDriveView(response.data.data);
}

export async function updatePlacementDrive(
  id: string,
  payload: UpdatePlacementDrivePayload,
): Promise<PlacementDrive> {
  const response = await api.patch<Envelope<DriveRaw>>(
    `/api/admin/drives/${id}`,
    payload,
  );

  return toPlacementDriveView(response.data.data);
}

export async function deletePlacementDrive(id: string): Promise<void> {
  await api.delete(`/api/admin/drives/${id}`);
}

export async function verifyAdminStudent(
  id: string,
  verified: boolean,
): Promise<void> {
  await api.patch(`/api/admin/students/${id}/verify`, { verified });
}

export async function verifyAdminRecruiter(
  id: string,
  status: "VERIFIED" | "REJECTED",
): Promise<void> {
  await api.patch(`/api/admin/recruiters/${id}/verify`, { status });
}

export interface UpdateInterviewSchedulePayload {
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  meetingLink?: string;
  mode?: "VIRTUAL" | "IN_PERSON" | "HYBRID";
  durationMinutes?: number;
}

export async function getAdminInterviews(): Promise<InterviewScheduleItem[]> {
  const response = await api.get<Envelope<InterviewRaw[]>>(
    "/api/admin/interviews",
  );
  return response.data.data.map(toInterviewScheduleItem);
}

export async function updateInterviewSchedule(
  id: string,
  payload: UpdateInterviewSchedulePayload,
): Promise<void> {
  await api.patch(`/api/admin/interviews/${id}/schedule`, payload);
}

export interface AdminNotificationRaw {
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  actionUrl: string | null;
  actionLabel: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface AdminNotificationsResult {
  notifications: SystemNotification[];
  unreadCount: number;
  total: number;
}

export type BroadcastAudience = "ALL_STUDENTS" | "RECRUITERS";
export type BroadcastPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface BroadcastNotificationPayload {
  title: string;
  message: string;
  audience: BroadcastAudience;
  priority: BroadcastPriority;
}

export interface BroadcastNotificationResult {
  notification: SystemNotification;
  recipients: number;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.floor((Date.now() - then) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(then).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toSystemNotification(raw: AdminNotificationRaw): SystemNotification {
  const type: SystemNotification["type"] =
    raw.priority === "URGENT"
      ? "urgent"
      : raw.type === "CONFLICT"
        ? "warning"
        : raw.type === "OFFER"
          ? "success"
          : "info";

  return {
    id: raw.id,
    type,
    title: raw.title,
    description: raw.message,
    time: relativeTime(raw.createdAt),
    read: raw.isRead,
    actionLabel: raw.actionLabel ?? undefined,
    actionUrl: raw.actionUrl ?? undefined,
  };
}

export async function getAdminNotifications(): Promise<AdminNotificationsResult> {
  const response = await api.get<
    Envelope<{
      notifications: AdminNotificationRaw[];
      unreadCount: number;
      total: number;
    }>
  >("/api/admin/notifications");

  const { notifications, unreadCount, total } = response.data.data;
  return {
    notifications: notifications.map(toSystemNotification),
    unreadCount,
    total,
  };
}

export async function markAdminNotificationRead(
  id: string,
): Promise<SystemNotification> {
  const response = await api.patch<Envelope<AdminNotificationRaw>>(
    `/api/admin/notifications/${id}/read`,
  );
  return toSystemNotification(response.data.data);
}

export async function markAllAdminNotificationsRead(): Promise<void> {
  await api.patch("/api/admin/notifications/read-all");
}

export async function broadcastNotification(
  payload: BroadcastNotificationPayload,
): Promise<BroadcastNotificationResult> {
  const response = await api.post<
    Envelope<{ notification: AdminNotificationRaw; recipients: number }>
  >("/api/admin/notifications/broadcast", payload);

  const { notification, recipients } = response.data.data;
  return { notification: toSystemNotification(notification), recipients };
}

export interface AdminProfileSettings {
  name: string;
  email: string;
  role: string;
  phone: string;
  designation: string;
  department: string;
}

export interface AdminCampusSettings {
  collegeName: string;
  collegeCode: string;
  academicYear: string;
  placementSeason: string;
  activeDepartments: string;
  tpoHead: string;
}

export interface AdminSystemSettings {
  autoEligibilityFilter: boolean;
  strictBacklogRule: boolean;
  aiMatchingThreshold: number;
  conflictAlertSensitivity: "Strict" | "Moderate" | "Lenient";
  emailDigestDaily: boolean;
  scheduleCollisionDetection: boolean;
}

export interface AdminSecuritySettings {
  twoFactorEnabled: boolean;
  activeSessions: number;
}

export interface AdminSettingsData {
  profile: AdminProfileSettings;
  campus: AdminCampusSettings;
  system: AdminSystemSettings;
  security: AdminSecuritySettings;
}

export interface UpdateAdminSettingsPayload {
  profile?: Partial<AdminProfileSettings>;
  campus?: AdminCampusSettings;
  system?: AdminSystemSettings;
}

export async function getAdminSettings(): Promise<AdminSettingsData> {
  const response = await api.get<Envelope<AdminSettingsData>>(
    "/api/admin/settings",
  );
  return response.data.data;
}

export async function updateAdminSettings(
  payload: UpdateAdminSettingsPayload,
): Promise<AdminSettingsData> {
  const response = await api.put<
    Envelope<AdminSettingsData> & { message?: string }
  >("/api/admin/settings", payload);
  return response.data.data;
}

