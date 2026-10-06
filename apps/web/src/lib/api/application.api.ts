import { api } from "./client";

interface Envelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type ApplicationStatusValue =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "ASSESSMENT"
  | "INTERVIEW"
  | "SELECTED"
  | "OFFER_EXTENDED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface ApplicationDetailRaw {
  id: string;
  status: ApplicationStatusValue;
  coverLetter: string | null;
  resumeUrl: string | null;
  notes: string | null;
  appliedAt: string;
  updatedAt: string;

  job: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    employmentType: string | null;
    workMode: string | null;
    ctc: string | null;
    minCGPA: number | null;
    maxBacklogs: number | null;
    requiredDegree: string | null;
    requiredBranch: string | null;
    allowedBranches: string[];
    status: string;
    company: {
      id: string;
      name: string;
      description: string | null;
      website: string | null;
      logoUrl: string | null;
      industry: string | null;
      location: string | null;
      tier: string;
    };
  };

  matchResult: {
    eligible: boolean;
    matchScore: number;
    skillMatchScore: number | null;
    projectScore: number | null;
    experienceScore: number | null;
    assessmentScore: number | null;
    matchedSkills: unknown;
    missingSkills: unknown;
    positiveSignals: unknown;
    gaps: unknown;
    explanation: string | null;
  } | null;

  student: {
    id: string;
    rollNo: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
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
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
    skills: {
      id: string;
      level: string;
      years: number | null;
      skill: {
        id: string;
        name: string;
        type: string;
      };
    }[];
    education: {
      id: string;
      institution: string;
      degree: string | null;
      branch: string | null;
      startYear: number | null;
      endYear: number | null;
      cgpa: number | null;
      percentage: number | null;
      description: string | null;
    }[];
    projects: {
      id: string;
      title: string;
      description: string | null;
      githubUrl: string | null;
      liveUrl: string | null;
      startDate: string | null;
      endDate: string | null;
      skills: {
        skill: {
          id: string;
          name: string;
        };
      }[];
    }[];
  } | null;
}

export async function getApplicationById(
  id: string,
): Promise<ApplicationDetailRaw> {
  const response = await api.get<Envelope<ApplicationDetailRaw>>(
    `/api/applications/${id}`,
  );

  return response.data.data;
}

export async function patchApplicationStatus(
  id: string,
  status: ApplicationStatusValue,
): Promise<void> {
  await api.patch(`/api/applications/${id}/status`, { status });
}
