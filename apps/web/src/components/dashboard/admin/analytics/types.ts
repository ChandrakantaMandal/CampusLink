export interface PlacementRecord {
  Student_ID: string;
  Gender?: string;
  Branch: string;
  CGPA: string | number;
  Internships?: string | number;
  Backlogs?: string | number;
  Programming_Skills?: string;
  Aptitude_Score?: string | number;
  Communication_Skills?: string;
  Extra_Certifications?: string | number;
  Placement_Status: string;
}

export interface SalaryRecord {
  Company: string;
  Location: string;
  CTC_LPA: string | number;
}

export interface ResumeRecord {
  candidate_id: string;
  degree: string;
  years_experience?: string | number;
  projects_count?: string | number;
  certifications?: string | number;
  skills_count?: string | number;
  internship?: string;
  github_portfolio?: string;
  resume_score: string | number;
  interview_calls: string | number;
}

export interface PlacementMetrics {
  total: number;
  placedCount: number;
  unplacedCount: number;
  placementRate: string;
  avgCGPA: string;
  avgAptitude: string;
  branchData: {
    branch: string;
    Placed: number;
    Unplaced: number;
    total: number;
    rate: number;
  }[];
  skillData: {
    name: string;
    value: number;
  }[];
  commData: {
    comm: string;
    Placed: number;
    Total: number;
    rate: number;
  }[];
  scatterSample: {
    cgpa: number;
    aptitude: number;
    status: string;
  }[];
  genderData: {
    gender: string;
    Placed: number;
    Total: number;
  }[];
}

export interface SalaryMetrics {
  total: number;
  highest: string;
  median: string;
  average: string;
  totalLocations: number;
  topCompanies: {
    company: string;
    ctc: number;
  }[];
  ctcRanges: {
    range: string;
    count: number;
    percentage: number;
  }[];
  topLocations: {
    name: string;
    value: number;
  }[];
}

export interface ResumeMetrics {
  total: number;
  avgScore: string;
  avgCalls: string;
  githubPct: string;
  degreeData: {
    name: string;
    value: number;
  }[];
  scoreVsCalls: {
    range: string;
    avgCalls: number;
    count: number;
  }[];
  projData: {
    proj: string;
    avgCalls: number;
    count: number;
  }[];
}

export type AnalyticsTab = "placements" | "salaries" | "resumes" | "explorer";
