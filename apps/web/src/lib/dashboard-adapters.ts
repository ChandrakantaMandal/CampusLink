import type {
  ApplicationItem,
  ApplicationStatus,
  InterviewSlot,
  OfferDetails,
  ReadinessDimension,
  RecommendedJob,
  SkillGapItem,
  StudentStats,
  UpcomingDrive,
} from "@/data/dashboardData";
import type {
  ApplicationData,
  DashboardApplicationItem,
  DashboardStats,
  StudentDashboardData,
  StudentDrivesData,
  StudentInterviewData,
  StudentInterviewsData,
  StudentJobsData,
  StudentReadinessData,
  StudentSkillsData,
  StudentApplicationsData,
  StudentOffersData,
  StudentNotificationsData,
  OfferData,
  UserNotificationData,
} from "@/lib/api/student.api";

// ---------- shared view type (imported by NotificationsView) ----------

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  category: "Drive" | "Interview" | "Offer" | "AI Coach" | "Notice";
  urgency: "urgent" | "important" | "normal";
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  targetTab?: string;
  actionType?: "hallTicket" | "offerLetter" | "interviewSlot" | "driveBrochure" | "aiModule";
}

// ---------- helpers ----------

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(iso);
}

function humanize(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function readinessStatus(score: number): ReadinessDimension["status"] {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  return "Needs Attention";
}

// ---------- dashboard ----------

export function toStudentStats(data: StudentDashboardData): StudentStats {
  const stats: DashboardStats = data.stats;
  return {
    readinessScore: stats.readinessScore,
    readinessLabel: stats.readinessLabel ?? "Not Rated",
    activeApplications: stats.applications,
    // No backend source for AI job matches on the dashboard aggregate.
    aiJobMatches: 0,
    upcomingDrives: stats.drivesRegistered,
  };
}

export interface WelcomeBannerProps {
  studentName: string;
  readinessScore: number;
  appliedCount: number;
  matchesCount: number;
  upcomingDrivesCount: number;
}

export function toWelcomeBannerProps(data: StudentDashboardData): WelcomeBannerProps {
  return {
    studentName: data.student.firstName?.trim()
      ? `${data.student.firstName} ${data.student.lastName ?? ""}`.trim()
      : "Student",
    readinessScore: data.stats.readinessScore,
    appliedCount: data.stats.applications,
    matchesCount: 0,
    upcomingDrivesCount: data.stats.drivesRegistered,
  };
}

export function toDashboardApplicationItems(
  applications: DashboardApplicationItem[],
): ApplicationItem[] {
  return applications.map((application) => ({
    id: application.id,
    company: application.job.company.name,
    role: application.job.title,
    appliedDate: formatDate(application.appliedAt),
    status: toApplicationStatus(application.status),
    ctc: application.job.ctc ?? "Not disclosed",
  }));
}

// ---------- readiness ----------

export interface ReadinessCardProps {
  score: number;
  label: string;
  dimensions: ReadinessDimension[];
  aiRecommendation: {
    title: string;
    highlight: string;
    message: string;
    actionText: string;
  };
}

export function toReadinessCardProps(data: StudentReadinessData): ReadinessCardProps {
  const latest = data.latest;
  const scoreFields: Array<{ category: string; score: number | null }> = [
    { category: "Academic Profile", score: latest?.academicScore ?? null },
    { category: "Technical Skills", score: latest?.technicalScore ?? null },
    { category: "Projects & Experience", score: latest?.projectScore ?? null },
    { category: "Resume Quality", score: latest?.resumeScore ?? null },
    { category: "Assessments", score: latest?.assessmentScore ?? null },
    { category: "Communication", score: latest?.communicationScore ?? null },
  ];

  const dimensions: ReadinessDimension[] = scoreFields.map(({ category, score }) => {
    const value = score ?? 0;
    return {
      category,
      score: Math.round(value),
      fullScore: 100,
      status: readinessStatus(value),
    };
  });

  const label = data.label ?? "Not Rated";
  return {
    score: data.score,
    label,
    dimensions,
    aiRecommendation: {
      title: "AI Placement Coach Recommendation",
      highlight: `Readiness: ${data.score}% · ${label}`,
      message:
        latest?.explanation ??
        "Complete a readiness recalculation to receive a personalized improvement plan from the AI placement coach.",
      actionText: "Recalculate Score",
    },
  };
}

// ---------- skills ----------

export function toSkillGaps(data: StudentSkillsData): SkillGapItem[] {
  return data.skills.map(({ skill, level }) => ({
    name: skill.name,
    level:
      level === "EXPERT" || level === "ADVANCED"
        ? "Strong"
        : level === "INTERMEDIATE"
          ? "Improve"
          : "Improve",
    category: humanize(skill.type),
  }));
}

// ---------- jobs ----------

function buildEligibilityCriteria(job: StudentJobsData["jobs"][number]): string {
  const parts: string[] = [];
  if (job.minCGPA != null) parts.push(`CGPA >= ${job.minCGPA}`);
  if (job.maxBacklogs != null) parts.push(`Backlogs <= ${job.maxBacklogs}`);
  if (job.allowedBranches.length > 0) parts.push(job.allowedBranches.join(", "));
  if (job.graduationYear != null) parts.push(`Batch of ${job.graduationYear}`);
  return parts.length > 0 ? parts.join(" · ") : "Open to all eligible students";
}

export function toRecommendedJobs(data: StudentJobsData): RecommendedJob[] {
  return data.jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company.name,
    location: job.location ?? "Not specified",
    ctc: job.ctc ?? "Not disclosed",
    matchPercentage: job.eligible ? 80 : 60,
    skills: job.skills.map((entry) => entry.skill.name),
    eligibility: {
      isEligible: job.eligible,
      criteria: buildEligibilityCriteria(job),
    },
    whyMatch: job.eligible
      ? `Your profile meets the eligibility criteria for ${job.title} at ${job.company.name}.`
      : `You currently do not meet all eligibility criteria for ${job.title} at ${job.company.name}.`,
    driveDate: job.applicationDeadline ? formatDate(job.applicationDeadline) : "Open",
    hasApplied: job.hasApplied,
  }));
}

// ---------- drives ----------

function toDriveType(type: string): UpcomingDrive["type"] {
  if (type === "VIRTUAL") return "Virtual";
  if (type === "HYBRID") return "Hybrid";
  return "In-Person";
}

function toDriveBatchEligibility(drive: {
  batchEligibility: string | null;
  minCgpa: number | null;
  allowedBranches: string[];
}): string {
  if (drive.batchEligibility) return drive.batchEligibility;
  const parts: string[] = [];
  if (drive.allowedBranches.length > 0) parts.push(drive.allowedBranches.join(", "));
  if (drive.minCgpa != null) parts.push(`CGPA >= ${drive.minCgpa}`);
  return parts.length > 0 ? parts.join(" · ") : "All branches";
}

export function toUpcomingDrives(data: StudentDrivesData): UpcomingDrive[] {
  const registered: UpcomingDrive[] = data.registered.map((registration) => ({
    id: registration.drive.id,
    company: registration.drive.company.name,
    role: registration.drive.role,
    date: formatDate(registration.drive.driveDate),
    time: registration.drive.driveTime ?? "TBD",
    venue: registration.drive.venue ?? "TBD",
    type: toDriveType(registration.drive.type),
    status: registration.status === "SHORTLISTED" ? "Shortlisted" : "Registered",
    batchEligibility: toDriveBatchEligibility(registration.drive),
  }));

  const available: UpcomingDrive[] = data.available.map((drive) => ({
    id: drive.id,
    company: drive.company.name,
    role: drive.role,
    date: formatDate(drive.driveDate),
    time: drive.driveTime ?? "TBD",
    venue: drive.venue ?? "TBD",
    type: toDriveType(drive.type),
    status: "Open",
    batchEligibility: toDriveBatchEligibility(drive),
  }));

  return [...registered, ...available];
}

// ---------- applications ----------

export function toApplicationStatus(status: string): ApplicationStatus {
  switch (status) {
    case "APPLIED":
      return "Applied";
    case "SHORTLISTED":
      return "Shortlisted";
    case "INTERVIEW":
      return "Interview";
    case "SELECTED":
      return "Selected";
    case "OFFER_EXTENDED":
    case "ACCEPTED":
      return "Offer Received";
    case "UNDER_REVIEW":
    case "ASSESSMENT":
      return "Under Review";
    case "REJECTED":
    case "WITHDRAWN":
      return "Rejected";
    default:
      return "Applied";
  }
}

export function nextStepForStatus(status: ApplicationStatus): string | undefined {
  switch (status) {
    case "Applied":
      return "Awaiting recruiter review";
    case "Under Review":
      return "Awaiting shortlist decision";
    case "Shortlisted":
      return "Assessment or interview invite expected";
    case "Interview":
      return "Prepare for interview round";
    case "Selected":
      return "Offer letter forthcoming";
    case "Offer Received":
      return "Review and respond to offer";
    case "Rejected":
      return undefined;
    case "Joined":
      return undefined;
    default:
      return undefined;
  }
}

export function toApplicationItems(data: StudentApplicationsData): ApplicationItem[] {
  return data.applications.map((application: ApplicationData) => {
    const status = toApplicationStatus(application.status);
    const nextStep = nextStepForStatus(status);
    return {
      id: application.id,
      company: application.job.company.name,
      role: application.job.title,
      appliedDate: formatDate(application.appliedAt),
      status,
      ctc: application.job.ctc ?? "Not disclosed",
      ...(nextStep ? { nextStep } : {}),
    };
  });
}

// ---------- interviews ----------

function toInterviewType(mode: string): InterviewSlot["type"] {
  if (mode === "VIRTUAL") return "Virtual";
  if (mode === "HYBRID") return "Lab 4";
  return "Campus Auditorium";
}

function toConflictNotes(interview: StudentInterviewData): string | undefined {
  if (!interview.hasConflict) return undefined;
  const details = interview.conflictDetails;
  if (typeof details === "string" && details.trim().length > 0) return details;
  if (details && typeof details === "object" && "message" in details) {
    const message = (details as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0) return message;
  }
  return "Scheduling conflict detected with another interview or drive.";
}

function toInterviewSlot(interview: StudentInterviewData): InterviewSlot {
  const conflictNotes = toConflictNotes(interview);
  return {
    id: interview.id,
    company:
      interview.job?.company.name ?? interview.drive?.company.name ?? "Campus Drive",
    role: interview.job?.title ?? interview.drive?.title ?? "Interview",
    date: formatDate(interview.scheduledDate),
    time: interview.startTime ?? "TBD",
    venue: interview.venue ?? interview.meetingLink ?? "TBD",
    meetingLink: interview.meetingLink,
    type: toInterviewType(interview.mode),
    interviewRound:
      interview.roundNumber > 1
        ? `Round ${interview.roundNumber} · ${interview.roundName}`
        : interview.roundName,
    interviewerName: interview.interviewerName ?? "To be announced",
    hasConflict: interview.hasConflict,
    ...(conflictNotes ? { conflictNotes } : {}),
  };
}

export function toInterviewSlots(data: StudentInterviewsData): InterviewSlot[] {
  return data.upcoming.map(toInterviewSlot);
}

// ---------- offers ----------

function toOfferStatus(status: string): OfferDetails["status"] {
  if (status === "ACCEPTED") return "Accepted";
  if (status === "DECLINED" || status === "WITHDRAWN") return "Under Review";
  return "Offer Received";
}

export function toOfferDetails(data: StudentOffersData): OfferDetails[] {
  return data.offers.map((offer: OfferData) => ({
    id: offer.id,
    company: offer.company.name,
    role: offer.role,
    ctc: offer.ctc,
    offerDate: formatDate(offer.offerDate),
    status: toOfferStatus(offer.status),
    documentsVerified: offer.documentsVerified,
    joiningDate: offer.joiningDate ? formatDate(offer.joiningDate) : "To be confirmed",
    letterUrl: offer.offerLetterUrl ?? "#",
  }));
}

// ---------- notifications ----------

function toNotificationCategory(type: string): DashboardNotification["category"] {
  switch (type) {
    case "DRIVE":
      return "Drive";
    case "INTERVIEW":
      return "Interview";
    case "OFFER":
      return "Offer";
    case "AI_MATCH":
      return "AI Coach";
    default:
      return "Notice";
  }
}

function toNotificationUrgency(priority: string): DashboardNotification["urgency"] {
  if (priority === "URGENT") return "urgent";
  if (priority === "HIGH") return "important";
  return "normal";
}

function toTargetTab(type: string): string | undefined {
  switch (type) {
    case "DRIVE":
      return "drives";
    case "INTERVIEW":
      return "schedule";
    case "OFFER":
      return "offers";
    case "AI_MATCH":
      return "skills";
    case "APPLICATION":
      return "applications";
    default:
      return undefined;
  }
}

export function toDashboardNotifications(
  data: StudentNotificationsData,
): DashboardNotification[] {
  return data.notifications.map((notification: UserNotificationData) => {
    const targetTab = toTargetTab(notification.type);
    const actionLabel = notification.actionLabel ?? undefined;
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      category: toNotificationCategory(notification.type),
      urgency: toNotificationUrgency(notification.priority),
      timestamp: formatRelativeTime(notification.createdAt),
      read: notification.isRead,
      ...(actionLabel ? { actionLabel } : {}),
      ...(targetTab ? { targetTab } : {}),
    };
  });
}
