import { api } from "./client";

export interface StudentProfileUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string | null;
  rollNo: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  college: string | null;
  degree: string | null;
  branch: string | null;
  department: string | null;
  graduationYear: number | null;
  cgpa: number | null;
  backlogs: number;
  bio: string | null;
  location: string | null;
  targetRole: string | null;
  isPublic: boolean;
  isVerified: boolean;
  readinessScore: number | null;
  readinessLabel: string | null;
  resumeUrl: string | null;
  resumeText: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  leetcodeUrl: string | null;
  hackerrankUrl: string | null;
  otherWebsiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user?: StudentProfileUser;

  [key: string]: unknown;
}

export interface UpdateStudentPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  college?: string;
  degree?: string;
  branch?: string;
  department?: string;
  graduationYear?: number;
  cgpa?: number | null;
  bio?: string;
  location?: string;
  isPublic?: boolean;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  leetcodeUrl?: string;
  hackerrankUrl?: string;
  otherWebsiteUrl?: string;
  resumeText?: string | null;
  resumeUrl?: string | null;
}

interface StudentProfileResponse {
  success: boolean;
  data: StudentProfile;
  message?: string;
}

export async function getMyStudentProfile(): Promise<StudentProfile> {
  const response = await api.get<StudentProfileResponse>("/api/students/me");

  return response.data.data;
}

export async function updateMyStudentProfile(
  data: UpdateStudentPayload,
): Promise<StudentProfile> {
  const response = await api.patch<StudentProfileResponse>(
    "/api/students/me",
    data,
  );

  return response.data.data;
}

export interface StudentEducation {
  id: string;
  institution: string;
  degree: string | null;
  branch: string | null;
  startYear: number | null;
  endYear: number | null;
  cgpa: number | null;
  percentage: number | null;
}

interface EducationResponse<T> { success: boolean; data: T }

export async function getMyEducationRecords(): Promise<StudentEducation[]> {
  const response = await api.get<EducationResponse<StudentEducation[]>>("/api/education/my");
  return response.data.data;
}

export async function saveEducationRecord(data: Omit<StudentEducation, "id">, id?: string): Promise<StudentEducation> {
  const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null && value !== ""));
  const response = id
    ? await api.patch<EducationResponse<StudentEducation>>(`/api/education/${id}`, payload)
    : await api.post<EducationResponse<StudentEducation>>("/api/education", payload);
  return response.data.data;
}

export interface StudentProjectRecord {
  id: string;
  title: string;
  description: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  startDate: string | null;
  endDate?: string | null;
  skills: Array<{ skill: { id: string; name: string } }>;
}

export async function getMyProjectRecords(): Promise<StudentProjectRecord[]> {
  const response = await api.get<EducationResponse<StudentProjectRecord[]>>("/api/projects/my");
  return response.data.data;
}

export async function saveProjectRecord(
  data: { title: string; description: string; githubUrl: string; liveUrl: string },
  id?: string,
): Promise<StudentProjectRecord> {
  const response = id
    ? await api.patch<EducationResponse<StudentProjectRecord>>(`/api/projects/${id}`, data)
    : await api.post<EducationResponse<StudentProjectRecord>>("/api/projects", data);
  return response.data.data;
}

export async function deleteProjectRecord(id: string): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}

interface UploadFileResponse {
  success: boolean;
  message?: string;
  data: Record<string, string>;
}

export async function uploadStudentPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<UploadFileResponse>(
    "/api/students/me/photo",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data.image;
}

export async function uploadStudentResume(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<UploadFileResponse>(
    "/api/students/me/resume",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data.resumeUrl;
}

export async function getStudentById(id: string): Promise<StudentProfile> {
  const response = await api.get<StudentProfileResponse>(`/api/students/${id}`);

  return response.data.data;
}

// ---------- Aggregate endpoints (student dashboard) ----------

interface AggregateResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function getAggregate<T>(path: string): Promise<T> {
  const response = await api.get<AggregateResponse<T>>(
    `/api/students${path}`,
  );

  return response.data.data;
}

export interface CompanyTiny {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface CompanyCompact extends CompanyTiny {
  tier: string;
}

// ----- dashboard -----

export interface DashboardStudentInfo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  college: string | null;
  branch: string | null;
  graduationYear: number | null;
  cgpa: number | null;
  resumeUrl: string | null;
  image: string | null;
}

export interface DashboardStats {
  applications: number;
  interviews: number;
  offers: number;
  drivesRegistered: number;
  unreadNotifications: number;
  readinessScore: number;
  readinessLabel: string | null;
}

export interface DashboardApplicationItem {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    location: string | null;
    ctc: string | null;
    company: CompanyTiny;
  };
}

export interface StudentInterviewData {
  id: string;
  studentId: string;
  jobId: string | null;
  driveId: string | null;
  applicationId: string | null;
  roundName: string;
  roundNumber: number;
  scheduledDate: string;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number | null;
  mode: string;
  venue: string | null;
  meetingLink: string | null;
  interviewerName: string | null;
  interviewerEmail: string | null;
  interviewerPanel: string | null;
  status: string;
  feedback: string | null;
  rating: number | null;
  hasConflict: boolean;
  conflictDetails: unknown;
  job: { id: string; title: string; company: CompanyTiny } | null;
  drive: { id: string; title: string; company: CompanyTiny } | null;
}

export interface UserNotificationData {
  id: string;
  userId: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  actionUrl: string | null;
  actionLabel: string | null;
  isRead: boolean;
  readAt: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDashboardData {
  student: DashboardStudentInfo;
  stats: DashboardStats;
  recentApplications: DashboardApplicationItem[];
  upcomingInterviews: StudentInterviewData[];
  recentNotifications: UserNotificationData[];
}

// ----- readiness -----

export interface ReadinessResultData {
  id: string;
  studentId: string;
  overallScore: number;
  academicScore: number | null;
  technicalScore: number | null;
  projectScore: number | null;
  resumeScore: number | null;
  assessmentScore: number | null;
  communicationScore: number | null;
  breakdown: unknown;
  weights: unknown;
  explanation: string | null;
  createdAt: string;
}

export interface RecentAssessmentData {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  feedback: string | null;
  answers: unknown;
  takenAt: string;
  assessment: { id: string; title: string; type: string };
}

export interface StudentReadinessData {
  score: number;
  label: string | null;
  breakdown: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  };
  weights: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  };
  explanation: string;
  latest: ReadinessResultData | null;
  history: ReadinessResultData[];
  recentAssessments: RecentAssessmentData[];
}

// ----- drives -----

export interface PlacementDriveData {
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
  createdAt: string;
  updatedAt: string;
  company: CompanyCompact;
}

export interface DriveRegistrationData {
  id: string;
  driveId: string;
  studentId: string;
  status: string;
  registeredAt: string;
  updatedAt: string;
  eligible: boolean;
  drive: PlacementDriveData;
}

export interface AvailableDriveData extends PlacementDriveData {
  isRegistered: boolean;
  eligible: boolean;
}

export interface StudentDrivesData {
  registered: DriveRegistrationData[];
  available: AvailableDriveData[];
}

// ----- skills -----

export interface SkillData {
  id: string;
  name: string;
  normalized: string;
  type: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSkillData {
  id: string;
  studentId: string;
  skillId: string;
  level: string;
  years: number | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  skill: SkillData;
}

export interface StudentSkillsData {
  skills: StudentSkillData[];
  count: number;
}

// ----- jobs -----

export interface JobSkillData {
  id: string;
  jobId: string;
  skillId: string;
  skill: { id: string; name: string; type: string };
}

export interface JobData {
  id: string;
  companyId: string;
  recruiterId: string | null;
  driveId: string | null;
  title: string;
  description: string;
  location: string | null;
  employmentType: string | null;
  workMode: string | null;
  ctc: string | null;
  openPositions: number;
  minCGPA: number | null;
  maxBacklogs: number | null;
  requiredDegree: string | null;
  requiredBranch: string | null;
  allowedBranches: string[];
  graduationYear: number | null;
  minExperience: number | null;
  maxExperience: number | null;
  applicationDeadline: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: CompanyCompact;
  skills: JobSkillData[];
}

export interface RecommendedJobData extends JobData {
  hasApplied: boolean;
  applicationStatus: string | null;
  eligible: boolean;
}

export interface StudentJobsData {
  jobs: RecommendedJobData[];
}

// ----- applications -----

export interface MatchResultData {
  eligible: boolean;
  matchScore: number;
  skillMatchScore: number;
  projectScore: number;
  experienceScore: number;
  assessmentScore: number;
  matchedSkills: unknown;
  missingSkills: unknown;
  positiveSignals: unknown;
  gaps: unknown;
  explanation: string | null;
}

export interface ApplicationData {
  id: string;
  studentId: string;
  userId: string;
  jobId: string;
  status: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  notes: string | null;
  appliedAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    ctc: string | null;
    location: string | null;
    company: CompanyCompact;
  };
  matchResult: MatchResultData | null;
}

export interface StudentApplicationsData {
  applications: ApplicationData[];
  stats: {
    total: number;
    byStatus: Record<string, number>;
  };
}

// ----- interviews -----

export interface StudentInterviewsData {
  upcoming: StudentInterviewData[];
  past: StudentInterviewData[];
}

// ----- offers -----

export interface OfferData {
  id: string;
  studentId: string;
  companyId: string;
  jobId: string | null;
  applicationId: string | null;
  role: string;
  ctc: string;
  baseSalary: number | null;
  variableBonus: number | null;
  currency: string;
  offerDate: string;
  responseDeadline: string | null;
  joiningDate: string | null;
  offerLetterUrl: string | null;
  status: string;
  documentStatus: string;
  documentsVerified: boolean;
  joiningStatus: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  company: CompanyCompact;
  job: { id: string; title: string } | null;
}

export interface StudentOffersData {
  offers: OfferData[];
  stats: {
    total: number;
    accepted: number;
    pending: number;
  };
}

// ----- notifications -----

export interface StudentNotificationsData {
  notifications: UserNotificationData[];
  unreadCount: number;
  total: number;
}

export async function getMyDashboard(): Promise<StudentDashboardData> {
  return getAggregate<StudentDashboardData>("/me/dashboard");
}

export async function getMyReadiness(): Promise<StudentReadinessData> {
  return getAggregate<StudentReadinessData>("/me/readiness");
}

export async function getMyDrives(): Promise<StudentDrivesData> {
  return getAggregate<StudentDrivesData>("/me/drives");
}

function isEligibleForJob(profile: StudentProfile, job: JobData): boolean {
  if (
    job.minCGPA !== null &&
    profile.cgpa !== null &&
    profile.cgpa < job.minCGPA
  ) {
    return false;
  }

  if (job.maxBacklogs !== null && profile.backlogs > job.maxBacklogs) {
    return false;
  }

  const allowedBranches =
    job.allowedBranches.length > 0
      ? job.allowedBranches
      : job.requiredBranch
        ? [job.requiredBranch]
        : [];

  if (allowedBranches.length > 0) {
    const studentBranch = (
      profile.branch ??
      profile.department ??
      ""
    ).toLowerCase();

    if (studentBranch) {
      const matches = allowedBranches.some(
        (branch) => branch.toLowerCase() === studentBranch,
      );

      if (!matches) {
        return false;
      }
    }
  }

  return true;
}

export async function getMySkills(): Promise<StudentSkillsData> {
  const response = await api.get<AggregateResponse<StudentSkillData[]>>(
    "/api/skills/student/me",
  );

  const skills = response.data.data;

  return { skills, count: skills.length };
}

export async function addMySkill(skillName: string): Promise<StudentSkillData> {
  const response = await api.post<AggregateResponse<StudentSkillData>>(
    "/api/skills/student/me",
    { skillName },
  );

  return response.data.data;
}

export async function removeMySkill(skillId: string): Promise<void> {
  await api.delete(`/api/skills/student/me/${skillId}`);
}

export async function getMyJobs(): Promise<StudentJobsData> {
  const [jobsResponse, applicationsResponse, profile] = await Promise.all([
    api.get<AggregateResponse<JobData[]>>("/api/jobs"),
    api.get<AggregateResponse<ApplicationData[]>>("/api/applications/my"),
    getMyStudentProfile(),
  ]);

  const jobs = jobsResponse.data.data;
  const applications = applicationsResponse.data.data;

  const applicationStatusByJob = new Map<string, string>();

  for (const application of applications) {
    if (!applicationStatusByJob.has(application.jobId)) {
      applicationStatusByJob.set(application.jobId, application.status);
    }
  }

  const openJobs = jobs
    .filter(
      (job) =>
        job.status === "APPLICATIONS_OPEN" || job.status === "PUBLISHED",
    )
    .slice(0, 50);

  return {
    jobs: openJobs.map((job) => {
      const applicationStatus = applicationStatusByJob.get(job.id) ?? null;

      return {
        ...job,
        hasApplied: applicationStatus !== null,
        applicationStatus,
        eligible: isEligibleForJob(profile, job),
      };
    }),
  };
}

export async function getMyApplications(): Promise<StudentApplicationsData> {
  const response = await api.get<AggregateResponse<ApplicationData[]>>(
    "/api/applications/my",
  );

  const all = response.data.data;

  const byStatus: Record<string, number> = {};

  for (const application of all) {
    byStatus[application.status] = (byStatus[application.status] ?? 0) + 1;
  }

  return {
    applications: all.slice(0, 50),
    stats: { total: all.length, byStatus },
  };
}

export interface ApplyToJobPayload {
  jobId: string;
  coverLetter?: string;
  resumeId?: string;
}

export async function applyToJob(
  payload: ApplyToJobPayload,
): Promise<ApplicationData> {
  const response = await api.post<AggregateResponse<ApplicationData>>(
    "/api/applications",
    payload,
  );
  return response.data.data;
}

export async function getMyInterviews(): Promise<StudentInterviewsData> {
  return getAggregate<StudentInterviewsData>("/me/interviews");
}

export async function getMyOffers(): Promise<StudentOffersData> {
  return getAggregate<StudentOffersData>("/me/offers");
}

export async function acceptMyOffer(id: string): Promise<OfferData> {
  const response = await api.patch<AggregateResponse<OfferData>>(
    `/api/students/me/offers/${id}/accept`,
  );
  return response.data.data;
}

export async function registerForDrive(
  driveId: string,
): Promise<DriveRegistrationData> {
  const response = await api.post<AggregateResponse<DriveRegistrationData>>(
    `/api/students/me/drives/${driveId}/register`,
  );
  return response.data.data;
}

export async function getMyNotifications(): Promise<StudentNotificationsData> {
  return getAggregate<StudentNotificationsData>("/me/notifications");
}

export async function markMyNotificationRead(
  id: string,
): Promise<UserNotificationData> {
  const response = await api.patch<AggregateResponse<UserNotificationData>>(
    `/api/students/me/notifications/${id}/read`,
  );
  return response.data.data;
}

export async function markMyNotificationsReadAll(): Promise<void> {
  await api.patch("/api/students/me/notifications/read-all");
}
