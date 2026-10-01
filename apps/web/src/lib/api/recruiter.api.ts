import { api } from "./client";
import type { RecruiterCandidate } from "@/components/dashboard/recruiter/mock-recruiter-data";

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
