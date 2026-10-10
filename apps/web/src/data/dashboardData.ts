export interface StudentStats {
  readinessScore: number;
  readinessLabel: string;
  activeApplications: number;
  aiJobMatches: number;
  upcomingDrives: number;
}

export interface ReadinessDimension {
  category: string;
  score: number;
  fullScore: number;
  status: "Strong" | "Good" | "Needs Attention";
}

export interface SkillGapItem {
  name: string;
  level: "Strong" | "Improve" | "Missing";
  category: string;
}

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  ctc: string;
  matchPercentage: number | null;
  skills: string[];
  eligibility: {
    isEligible: boolean;
    criteria: string;
  };
  whyMatch: string;
  driveDate: string;
  hasApplied: boolean;
}

export interface UpcomingDrive {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
  venue: string;
  meetingLink?: string | null;
  type: "In-Person" | "Virtual" | "Hybrid";
  status: "Registered" | "Open" | "Shortlisted";
  batchEligibility: string;
}

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview"
  | "Selected"
  | "Offer Received"
  | "Joined"
  | "Rejected";

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: ApplicationStatus;
  ctc: string;
  nextStep?: string;
}

export interface InterviewSlot {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
  venue: string;
  meetingLink?: string | null;
  type: "Virtual" | "Campus Auditorium" | "Lab 4";
  interviewRound: string;
  interviewerName: string;
  hasConflict: boolean;
  conflictNotes?: string;
}

export interface OfferDetails {
  id: string;
  company: string;
  role: string;
  ctc: string;
  offerDate: string;
  status: "Offer Received" | "Accepted" | "Under Review";
  documentsVerified: boolean;
  joiningDate: string;
  letterUrl: string;
}

export const sampleDashboardData = {
  studentStats: {
    readinessScore: 0,
    readinessLabel: "Profile Incomplete",
    activeApplications: 0,
    aiJobMatches: 0,
    upcomingDrives: 0,
  } as StudentStats,

  readinessDimensions: [
    {
      category: "Technical Skills",
      score: 0,
      fullScore: 100,
      status: "Needs Attention",
    },
    {
      category: "Verified Projects",
      score: 0,
      fullScore: 100,
      status: "Needs Attention",
    },
    {
      category: "Certifications",
      score: 0,
      fullScore: 100,
      status: "Needs Attention",
    },
    {
      category: "Assessment Tests",
      score: 0,
      fullScore: 100,
      status: "Needs Attention",
    },
    {
      category: "Communication & Soft Skills",
      score: 0,
      fullScore: 100,
      status: "Needs Attention",
    },
  ] as ReadinessDimension[],

  aiCoachRecommendation: {
    title: "AI Placement Coach Recommendation",
    highlight: "Complete Profile",
    message:
      "Add your technical skills, verified projects, and academic details to generate placement recommendations and readiness insights.",
    actionText: "Complete Profile",
  },

  skills: [] as SkillGapItem[],

  recommendedJobs: [] as RecommendedJob[],

  upcomingDrives: [] as UpcomingDrive[],

  applications: [] as ApplicationItem[],

  interviews: [] as InterviewSlot[],

  offers: [] as OfferDetails[],

  // Recruiter Dashboard Overview
  recruiterOverview: {
    activeJobs: 0,
    eligibleCandidates: 0,
    shortlistedCandidates: 0,
    interviewsScheduled: 0,
    offersExtended: 0,
  },

  // Admin / Placement Officer Overview
  adminOverview: {
    placementPercentage: 0,
    highestPackage: "₹0 LPA",
    averagePackage: "₹0 LPA",
    activeRecruiters: 0,
    totalDrivesCompleted: 0,
    studentsRegistered: 0,
  },
};

export const mockDashboardData = {
  ...sampleDashboardData,
  stats: sampleDashboardData.studentStats,
  skillGaps: sampleDashboardData.skills,
};
