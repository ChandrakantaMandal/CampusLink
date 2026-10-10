export interface AdminStudent {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
  email: string;
  phone: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  status: "Eligible" | "Placed" | "In Review" | "Needs Attention";
  readinessScore: number;
  skills: string[];
  missingSkills: string[];
  applicationsCount: number;
  offersCount: number;
  verified: boolean;
  resumeUrl: string;
  targetRole: string;
  readinessBreakdown: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  };
}

export interface AdminRecruiter {
  id: string;
  name: string;
  logo: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  website: string;
  jobsCount: number;
  drivesCount: number;
  status: "Active" | "Pending" | "Partner" | "Inactive";
  tier: "Super Dream" | "Dream" | "Regular";
  packageRange: string;
  eligibilityCriteria: string;
  activeDrives: string[];
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  company: string;
  logo: string;
  role: string;
  description: string;
  requiredSkills: string[];
  minCgpa: number;
  backlogsAllowed: number;
  salary: string;
  deadline: string;
  driveDate: string;
  driveTime: string;
  venue: string;
  rounds: string[];
  openings: number;
  applicantsCount: number;
  status: "Open" | "Ongoing" | "Draft" | "Applications Closed" | "Completed" | "Cancelled";
  tier: "Super Dream" | "Dream" | "Regular";
  jobIds?: string[];
  jobs?: { id: string; title: string }[];
}

export interface ApplicationItem {
  id: string;
  studentName: string;
  studentRoll: string;
  branch: string;
  cgpa: number;
  company: string;
  role: string;
  appliedDate: string;
  status: "Applied" | "Shortlisted" | "Interview" | "Selected" | "Offer" | "Joined" | "Rejected";
  matchScore: number;
}

export interface InterviewScheduleItem {
  id: string;
  company: string;
  studentName: string;
  rollNo: string;
  interviewer: string;
  panel: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  venueRaw?: string;
  meetingLink?: string;
  mode?: "VIRTUAL" | "IN_PERSON" | "HYBRID" | "";
  durationMinutes?: number | null;
  round: string;
  status: "Scheduled" | "Completed" | "Rescheduled" | "Cancelled";
  hasConflict?: boolean;
  conflictDetails?: string;
}

export interface AIMatchItem {
  id: string;
  studentName: string;
  avatar: string;
  branch: string;
  cgpa: number;
  company: string;
  role: string;
  package: string;
  matchScore: number;
  positiveSignals: string[];
  missingGaps: string[];
  status: "Recommended" | "Applied" | "Shortlisted";
}

export interface OfferItem {
  id: string;
  studentName: string;
  avatar: string;
  rollNo: string;
  branch: string;
  company: string;
  role: string;
  package: string;
  offerDate: string;
  joiningDate: string;
  documentStatus: "Verified" | "Pending Verification" | "Action Required";
  status: "Accepted" | "Pending" | "Declined";
  letterUrl: string;
}

export interface SystemNotification {
  id: string;
  type: "warning" | "success" | "info" | "urgent";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}
