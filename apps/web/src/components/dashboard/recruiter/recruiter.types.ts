export interface RecruiterCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  location: string;
  companySize?: string;
  linkedinUrl: string;
  verifiedStatus: "Verified Campus Partner" | "Pending Verification";
  benefits: string[];
}

export interface RecruiterJob {
  id: string;
  title: string;
  jobType: "Full-Time" | "Internship" | "PPO";
  location: string;
  ctc: string;
  openPositions: number;
  minCGPA: number;
  allowedBranches: string[];
  maxBacklogs: number;
  graduationYear: number;
  requiredSkills: string[];
  description: string;
  applicationDeadline: string;
  status: "Draft" | "Published" | "Applications Open" | "Applications Closed" | "Interviewing" | "Completed";
  applicantsCount: number;
  shortlistedCount: number;
  interviewCount: number;
  offersCount: number;
  rounds: {
    roundNumber: number;
    name: string;
    type: "Aptitude Test" | "Technical Interview" | "HR Interview" | "Final Selection";
  }[];
}

export interface RecruiterCandidate {
  id: string;
  studentId?: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  phone: string;
  college: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  graduationYear: number;
  skills: string[];
  matchScore: number;
  matchScoreAvailable?: boolean;
  matchScoreSource?: "AI";
  readinessScore: number;
  readinessAvailable?: boolean;
  matchAnalysis?: {
    skillMatchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    positiveSignals: string[];
    gaps: string[];
    explanation?: string;
  } | null;
  status: "Applied" | "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Offer" | "Rejected";
  appliedJobId: string;
  appliedJobTitle: string;
  appliedDate: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface AIMatchAnalysis {
  candidateId: string;
  candidateName: string;
  candidateBranch: string;
  candidateCGPA: number;
  jobId: string;
  jobTitle: string;
  overallMatchScore: number;
  matchTier: "Strong Match" | "Potential Match" | "Low Match";
  matchedCriteria: string[];
  missingSkills: string[];
  whyExplanation: string;
  verifiedProjectsCount: number;
}

export interface RecruiterInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  round: string;
  date: string;
  time: string;
  duration: string;
  mode: "Online Google Meet" | "Online Zoom" | "In-Person Campus Lab";
  meetingLink?: string;
  venue?: string;
  interviewerPanel: string;
  status: "Scheduled" | "Completed" | "Rescheduled" | "Cancelled";
  hasConflict?: boolean;
  conflictDetails?: {
    conflictingWith: string;
    existingSlot: string;
    newSlot: string;
    message: string;
  };
}

export interface RecruiterOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateBranch: string;
  jobId: string;
  role: string;
  ctc: string;
  baseSalary: string;
  variableBonus: string;
  joiningDate: string;
  offerLetterUrl: string;
  acceptanceStatus: "Draft" | "Sent" | "Pending Acceptance" | "Accepted" | "Declined" | "Withdrawn";
  documentVerification: "Verified" | "Pending Review" | "Action Required";
  joiningStatus: "Confirmed" | "Awaiting Onboarding" | "Joined" | "Declined";
}

export interface RecruiterNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "application" | "ai_match" | "interview" | "conflict" | "offer" | "system";
  isRead: boolean;
  actionUrl?: string;
}
