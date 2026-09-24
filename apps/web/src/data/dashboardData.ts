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
  matchPercentage: number;
  skills: string[];
  eligibility: {
    isEligible: boolean;
    criteria: string;
  };
  whyMatch: string;
  driveDate: string;
}

export interface UpcomingDrive {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
  venue: string;
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
    readinessScore: 78,
    readinessLabel: "Tier-1 Ready",
    activeApplications: 12,
    aiJobMatches: 8,
    upcomingDrives: 3,
  } as StudentStats,

  readinessDimensions: [
    { category: "Technical Skills", score: 84, fullScore: 100, status: "Strong" },
    { category: "Verified Projects", score: 76, fullScore: 100, status: "Good" },
    { category: "Certifications", score: 80, fullScore: 100, status: "Strong" },
    { category: "Assessment Tests", score: 72, fullScore: 100, status: "Good" },
    { category: "Communication & Soft Skills", score: 82, fullScore: 100, status: "Strong" },
  ] as ReadinessDimension[],

  aiCoachRecommendation: {
    title: "AI Placement Coach Recommendation",
    highlight: "Boost Match from 87% to 96%",
    message:
      "Strengthen System Design, Distributed Caching, and Redis fundamentals. Completing a 2-hour System Architecture mock will increase your eligibility match rate for Tier-1 Product Companies from 87% to 96%.",
    actionText: "Start System Design Practice",
  },

  skills: [
    { name: "Python", level: "Strong", category: "Programming" },
    { name: "React", level: "Strong", category: "Frontend" },
    { name: "SQL", level: "Improve", category: "Database" },
    { name: "Data Structures", level: "Strong", category: "CS Core" },
    { name: "Docker", level: "Improve", category: "DevOps" },
    { name: "System Design", level: "Missing", category: "Architecture" },
    { name: "Redis", level: "Missing", category: "Caching" },
    { name: "Git & GitHub", level: "Strong", category: "Tools" },
  ] as SkillGapItem[],

  recommendedJobs: [
    {
      id: "job-1",
      title: "Software Developer",
      company: "TCS Digital",
      location: "Bangalore / Hyderabad",
      ctc: "₹7.5 - ₹9.0 LPA",
      matchPercentage: 92,
      skills: ["Python", "React", "SQL"],
      eligibility: {
        isEligible: true,
        criteria: "CGPA ≥ 7.0, 0 Active Backlogs (Satisfied: 8.6 CGPA)",
      },
      whyMatch:
        "Strong Python skills, verified full-stack project experience, and academic criteria fully satisfied.",
      driveDate: "Oct 18, 2026",
    },
    {
      id: "job-2",
      title: "Cybersecurity Analyst",
      company: "Infosys Springboard",
      location: "Bhubaneswar / Pune",
      ctc: "₹6.5 - ₹8.0 LPA",
      matchPercentage: 87,
      skills: ["Networking", "Python", "Linux"],
      eligibility: {
        isEligible: true,
        criteria: "B.Tech CSE/IT, CGPA ≥ 7.5 (Satisfied)",
      },
      whyMatch:
        "Verified cybersecurity fundamentals, Linux coursework, and hands-on networking projects.",
      driveDate: "Oct 25, 2026",
    },
    {
      id: "job-3",
      title: "Cloud Solutions Engineer",
      company: "Microsoft",
      location: "Hyderabad / Noida",
      ctc: "₹14.0 - ₹18.0 LPA",
      matchPercentage: 82,
      skills: ["Cloud Architecture", "Docker", "Go"],
      eligibility: {
        isEligible: true,
        criteria: "CGPA ≥ 8.0, All Branches (Satisfied: 8.6 CGPA)",
      },
      whyMatch:
        "High problem-solving scores and algorithmic agility; adding Docker project will raise match to 94%.",
      driveDate: "Nov 5, 2026",
    },
  ] as RecommendedJob[],

  upcomingDrives: [
    {
      id: "drive-1",
      company: "Google India",
      role: "Software Engineer Intern 2027",
      date: "Oct 5, 2026",
      time: "10:00 AM - 01:00 PM",
      venue: "Placement Auditorium A & Online",
      type: "Hybrid",
      status: "Registered",
      batchEligibility: "CSE, IT, ECE • CGPA ≥ 8.0",
    },
    {
      id: "drive-2",
      company: "Infosys",
      role: "Specialist Programmer",
      date: "Oct 12, 2026",
      time: "02:30 PM - 05:30 PM",
      venue: "Campus Computer Lab 3",
      type: "In-Person",
      status: "Open",
      batchEligibility: "All Engineering Branches • CGPA ≥ 6.5",
    },
    {
      id: "drive-3",
      company: "Microsoft",
      role: "SWE Intern 2026",
      date: "Nov 1, 2026",
      time: "09:00 AM - 12:00 PM",
      venue: "CAMPUSLINK Proctored Portal",
      type: "Virtual",
      status: "Shortlisted",
      batchEligibility: "CSE & IT • CGPA ≥ 7.5",
    },
  ] as UpcomingDrive[],

  applications: [
    {
      id: "app-1",
      company: "Amazon AWS",
      role: "Cloud Support Associate",
      appliedDate: "Sep 15, 2026",
      status: "Under Review",
      ctc: "₹12.0 LPA",
      nextStep: "Technical Resume Screening",
    },
    {
      id: "app-2",
      company: "TCS Digital",
      role: "Software Developer",
      appliedDate: "Sep 10, 2026",
      status: "Interview",
      ctc: "₹7.5 LPA",
      nextStep: "Round 1 Technical Interview (Oct 8)",
    },
    {
      id: "app-3",
      company: "Deloitte",
      role: "Technology Analyst",
      appliedDate: "Sep 08, 2026",
      status: "Shortlisted",
      ctc: "₹8.5 LPA",
      nextStep: "Online Aptitude & Logic Assessment",
    },
    {
      id: "app-4",
      company: "Cisco Systems",
      role: "Network Software Engineer",
      appliedDate: "Sep 01, 2026",
      status: "Applied",
      ctc: "₹15.0 LPA",
      nextStep: "Application Submitted to Recruiter",
    },
    {
      id: "app-5",
      company: "Capgemini",
      role: "Senior Software Analyst",
      appliedDate: "Aug 20, 2026",
      status: "Offer Received",
      ctc: "₹6.8 LPA",
      nextStep: "Letter of Intent (LOI) Received",
    },
    {
      id: "app-6",
      company: "IBM Software Labs",
      role: "Associate Developer",
      appliedDate: "Aug 15, 2026",
      status: "Selected",
      ctc: "₹9.2 LPA",
      nextStep: "Background Verification Pending",
    },
    {
      id: "app-7",
      company: "Cognizant",
      role: "Programmer Analyst",
      appliedDate: "Jul 28, 2026",
      status: "Joined",
      ctc: "₹5.5 LPA",
      nextStep: "Pre-joining Onboarding Complete",
    },
    {
      id: "app-8",
      company: "Wipro Technologies",
      role: "Project Engineer",
      appliedDate: "Jul 20, 2026",
      status: "Rejected",
      ctc: "₹5.0 LPA",
      nextStep: "CGPA cutoff criteria revision",
    },
  ] as ApplicationItem[],

  interviews: [
    {
      id: "int-1",
      company: "TCS Digital",
      role: "Software Developer",
      date: "Oct 8, 2026",
      time: "11:30 AM - 12:30 PM",
      venue: "Microsoft Teams (Virtual)",
      type: "Virtual",
      interviewRound: "Round 1: Technical (Data Structures & Full-Stack)",
      interviewerName: "Dr. Arvind Mehta (Lead Architect, TCS)",
      hasConflict: false,
    },
    {
      id: "int-2",
      company: "Google India",
      role: "SWE Campus Drive",
      date: "Oct 5, 2026",
      time: "10:00 AM - 01:00 PM",
      venue: "Campus Placement Auditorium A",
      type: "Campus Auditorium",
      interviewRound: "Coding Sprint & System Basics",
      interviewerName: "Google University Recruiting Team",
      hasConflict: false,
      conflictNotes: "No overlapping campus assignments detected.",
    },
  ] as InterviewSlot[],

  offers: [
    {
      id: "off-1",
      company: "TCS",
      role: "Software Developer (Digital)",
      ctc: "₹7.5 LPA",
      offerDate: "Sep 20, 2026",
      status: "Offer Received",
      documentsVerified: true,
      joiningDate: "July 2027",
      letterUrl: "#",
    },
  ] as OfferDetails[],

  // Recruiter Dashboard Overview
  recruiterOverview: {
    activeJobs: 4,
    eligibleCandidates: 342,
    shortlistedCandidates: 56,
    interviewsScheduled: 18,
    offersExtended: 12,
  },

  // Admin / Placement Officer Overview
  adminOverview: {
    placementPercentage: 88.4,
    highestPackage: "₹44.0 LPA",
    averagePackage: "₹8.2 LPA",
    activeRecruiters: 58,
    totalDrivesCompleted: 24,
    studentsRegistered: 2840,
  },
};

export const mockDashboardData = {
  ...sampleDashboardData,
  stats: sampleDashboardData.studentStats,
  skillGaps: sampleDashboardData.skills,
};
