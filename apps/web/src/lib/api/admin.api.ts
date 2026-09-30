import { api } from "./client";
import type {
  AdminStudent,
  AdminRecruiter,
  ApplicationItem,
  PlacementDrive,
} from "@/components/dashboard/admin/mock-admin-data";

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
  contactPerson: string;
  email: string;
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
  firstName: string | null,
  lastName: string | null,
  fallback: string | null,
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
    readinessBreakdown: {
      technical: readiness,
      projects: readiness,
      certifications: readiness,
      assessments: readiness,
      communication: readiness,
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

export async function getAdminJobs(): Promise<{ id: string; title: string; companyId: string }[]> {
  const response = await api.get<Envelope<{ id: string; title: string; companyId: string }[]>>("/api/admin/jobs");
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

