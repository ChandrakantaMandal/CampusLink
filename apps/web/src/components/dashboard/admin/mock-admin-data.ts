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
    projects: number;
    certifications: number;
    assessments: number;
    communication: number;
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

// Initial Mock Data
export const mockStudents: AdminStudent[] = [
  {
    id: "stu-1",
    name: "Himanshu Rout",
    rollNo: "22CSE042",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    email: "himanshu@campuslink.edu",
    phone: "+91 98765 43210",
    branch: "CSE",
    cgpa: 8.6,
    backlogs: 0,
    status: "Eligible",
    readinessScore: 92,
    skills: ["Python", "React", "DSA", "SQL", "Next.js", "TypeScript"],
    missingSkills: ["System Design", "AWS Cloud"],
    applicationsCount: 4,
    offersCount: 1,
    verified: true,
    resumeUrl: "#",
    targetRole: "Software Development Engineer",
    readinessBreakdown: {
      technical: 95,
      projects: 90,
      certifications: 88,
      assessments: 94,
      communication: 91,
    },
  },
  {
    id: "stu-2",
    name: "Riya Sharma",
    rollNo: "22CSE088",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    email: "riya@campuslink.edu",
    phone: "+91 98765 43211",
    branch: "CSE",
    cgpa: 8.9,
    backlogs: 0,
    status: "Placed",
    readinessScore: 89,
    skills: ["Java", "Spring Boot", "SQL", "Microservices", "Docker"],
    missingSkills: ["Kubernetes", "Kafka"],
    applicationsCount: 3,
    offersCount: 2,
    verified: true,
    resumeUrl: "#",
    targetRole: "Backend Developer",
    readinessBreakdown: {
      technical: 92,
      projects: 86,
      certifications: 90,
      assessments: 88,
      communication: 89,
    },
  },
  {
    id: "stu-3",
    name: "Arjun Patel",
    rollNo: "22ECE015",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    email: "arjun@campuslink.edu",
    phone: "+91 98765 43212",
    branch: "ECE",
    cgpa: 7.8,
    backlogs: 0,
    status: "Eligible",
    readinessScore: 87,
    skills: ["Python", "Embedded C", "IoT", "Data Analysis", "MATLAB"],
    missingSkills: ["DSA Advanced", "Web Architecture"],
    applicationsCount: 5,
    offersCount: 0,
    verified: true,
    resumeUrl: "#",
    targetRole: "Systems & Data Analyst",
    readinessBreakdown: {
      technical: 85,
      projects: 88,
      certifications: 82,
      assessments: 80,
      communication: 86,
    },
  },
  {
    id: "stu-4",
    name: "Sneha Reddy",
    rollNo: "22IT033",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    email: "sneha@campuslink.edu",
    phone: "+91 98765 43213",
    branch: "IT",
    cgpa: 8.4,
    backlogs: 0,
    status: "Eligible",
    readinessScore: 85,
    skills: ["React", "JavaScript", "Node.js", "TailwindCSS", "MongoDB"],
    missingSkills: ["TypeScript", "GraphQL"],
    applicationsCount: 4,
    offersCount: 1,
    verified: true,
    resumeUrl: "#",
    targetRole: "Frontend Developer",
    readinessBreakdown: {
      technical: 88,
      projects: 92,
      certifications: 78,
      assessments: 84,
      communication: 83,
    },
  },
  {
    id: "stu-5",
    name: "Karan Verma",
    rollNo: "22CSE104",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    email: "karan@campuslink.edu",
    phone: "+91 98765 43214",
    branch: "CSE",
    cgpa: 9.1,
    backlogs: 0,
    status: "Placed",
    readinessScore: 94,
    skills: ["Go", "Distributed Systems", "C++", "DSA", "PostgreSQL"],
    missingSkills: ["React"],
    applicationsCount: 2,
    offersCount: 1,
    verified: true,
    resumeUrl: "#",
    targetRole: "Backend Engineer",
    readinessBreakdown: {
      technical: 98,
      projects: 94,
      certifications: 92,
      assessments: 96,
      communication: 90,
    },
  },
  {
    id: "stu-6",
    name: "Ananya Mishra",
    rollNo: "22EEE019",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    email: "ananya@campuslink.edu",
    phone: "+91 98765 43215",
    branch: "EEE",
    cgpa: 7.2,
    backlogs: 1,
    status: "Needs Attention",
    readinessScore: 64,
    skills: ["C", "MATLAB", "Basic Python"],
    missingSkills: ["DSA", "OOP Concepts", "SQL", "Git"],
    applicationsCount: 1,
    offersCount: 0,
    verified: false,
    resumeUrl: "#",
    targetRole: "Graduate Trainee Engineer",
    readinessBreakdown: {
      technical: 60,
      projects: 62,
      certifications: 70,
      assessments: 58,
      communication: 71,
    },
  },
];

export const mockRecruiters: AdminRecruiter[] = [
  {
    id: "rec-1",
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    contactPerson: "Sundar Rajan",
    email: "campus-hiring@google.com",
    phone: "+91 80 6721 8000",
    industry: "Internet & Technology",
    website: "https://careers.google.com",
    jobsCount: 3,
    drivesCount: 2,
    status: "Active",
    tier: "Super Dream",
    packageRange: "₹24 - ₹44 LPA",
    eligibilityCriteria: "CGPA ≥ 8.0, 0 Backlogs, CSE/IT/ECE",
    activeDrives: ["Software Developer - L3", "Associate Cloud Consultant"],
  },
  {
    id: "rec-2",
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    contactPerson: "Meenakshi Iyer",
    email: "campus.connect@tcs.com",
    phone: "+91 22 6778 9999",
    industry: "IT Services & Consulting",
    website: "https://tcs.com/careers",
    jobsCount: 5,
    drivesCount: 3,
    status: "Active",
    tier: "Dream",
    packageRange: "₹7.5 - ₹11.5 LPA",
    eligibilityCriteria: "CGPA ≥ 6.5, Max 1 Backlog, All Engineering Branches",
    activeDrives: ["TCS Digital Developer", "TCS Innovator Track"],
  },
  {
    id: "rec-3",
    name: "Infosys",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    contactPerson: "Rajesh Nambiar",
    email: "careers@infosys.com",
    phone: "+91 80 2852 0261",
    industry: "IT Consulting",
    website: "https://infosys.com",
    jobsCount: 4,
    drivesCount: 2,
    status: "Active",
    tier: "Dream",
    packageRange: "₹6.8 - ₹9.5 LPA",
    eligibilityCriteria: "CGPA ≥ 7.0, 0 Active Backlogs, CSE/IT/ECE/EEE",
    activeDrives: ["Specialist Programmer", "Digital Specialist Engineer"],
  },
  {
    id: "rec-4",
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    contactPerson: "Priya Nair",
    email: "university-ops@amazon.in",
    phone: "+91 80 4108 0000",
    industry: "E-Commerce & Cloud",
    website: "https://amazon.jobs",
    jobsCount: 2,
    drivesCount: 1,
    status: "Pending",
    tier: "Super Dream",
    packageRange: "₹28 - ₹42 LPA",
    eligibilityCriteria: "CGPA ≥ 7.5, 0 Backlogs, All Branches",
    activeDrives: ["Software Development Engineer I"],
  },
  {
    id: "rec-5",
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    contactPerson: "Vikram Malhotra",
    email: "university@microsoft.com",
    phone: "+91 40 6695 0000",
    industry: "Cloud & Enterprise Software",
    website: "https://careers.microsoft.com",
    jobsCount: 3,
    drivesCount: 1,
    status: "Partner",
    tier: "Super Dream",
    packageRange: "₹32 - ₹50 LPA",
    eligibilityCriteria: "CGPA ≥ 8.5, 0 Backlogs, CSE/IT",
    activeDrives: ["Software Engineer 1 - Azure Platform"],
  },
];

export const mockPlacementDrives: PlacementDrive[] = [
  {
    id: "drv-1",
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    role: "Software Developer",
    description: "Developing scalable backend microservices and modern web user experiences for global infrastructure.",
    requiredSkills: ["Python", "DSA", "SQL", "React"],
    minCgpa: 7.5,
    backlogsAllowed: 0,
    salary: "₹12 LPA",
    deadline: "2026-09-27",
    driveDate: "2026-09-28",
    driveTime: "10:00 AM",
    venue: "Computer Lab 2 & Virtual Coding Platform",
    rounds: ["Online Assessment", "Technical Interview 1", "Technical Interview 2", "Googliness & Leadership"],
    openings: 8,
    applicantsCount: 142,
    status: "Open",
    tier: "Super Dream",
  },
  {
    id: "drv-2",
    company: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    role: "Digital Developer",
    description: "Cloud-native solutions and enterprise client transformations with modern agile stacks.",
    requiredSkills: ["Java", "Spring Boot", "SQL", "Angular"],
    minCgpa: 7.0,
    backlogsAllowed: 1,
    salary: "₹7.5 LPA",
    deadline: "2026-09-29",
    driveDate: "2026-09-30",
    driveTime: "09:30 AM",
    venue: "Auditorium Hall A",
    rounds: ["National Qualifier Test", "Technical Interview", "Managerial & HR Round"],
    openings: 25,
    applicantsCount: 268,
    status: "Open",
    tier: "Dream",
  },
  {
    id: "drv-3",
    company: "Infosys",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    role: "Specialist Programmer",
    description: "High-impact algorithmic engineering, AI/ML deployment, and high-performance computing.",
    requiredSkills: ["C++", "Python", "Data Structures", "System Architecture"],
    minCgpa: 7.2,
    backlogsAllowed: 0,
    salary: "₹9.5 LPA",
    deadline: "2026-10-04",
    driveDate: "2026-10-06",
    driveTime: "11:00 AM",
    venue: "Placement Cell Block C",
    rounds: ["HackWithInfy Assessment", "Technical Discussion", "HR Interview"],
    openings: 12,
    applicantsCount: 110,
    status: "Open",
    tier: "Dream",
  },
  {
    id: "drv-4",
    company: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    role: "Software Development Engineer",
    description: "Distributed systems for Prime and AWS cloud storage components.",
    requiredSkills: ["Java", "Distributed Systems", "OOP", "AWS"],
    minCgpa: 8.0,
    backlogsAllowed: 0,
    salary: "₹28.5 LPA",
    deadline: "2026-10-12",
    driveDate: "2026-10-15",
    driveTime: "10:00 AM",
    venue: "Main Seminar Hall",
    rounds: ["Online Coding Challenge", "System Design", "Behavioral Interview"],
    openings: 5,
    applicantsCount: 92,
    status: "Draft",
    tier: "Super Dream",
  },
];

export const mockApplications: ApplicationItem[] = [
  {
    id: "app-1",
    studentName: "Himanshu Rout",
    studentRoll: "22CSE042",
    branch: "CSE",
    cgpa: 8.6,
    company: "Google",
    role: "SDE",
    appliedDate: "2026-09-22",
    status: "Interview",
    matchScore: 92,
  },
  {
    id: "app-2",
    studentName: "Riya Sharma",
    studentRoll: "22CSE088",
    branch: "CSE",
    cgpa: 8.9,
    company: "TCS",
    role: "Developer",
    appliedDate: "2026-09-20",
    status: "Selected",
    matchScore: 89,
  },
  {
    id: "app-3",
    studentName: "Arjun Patel",
    studentRoll: "22ECE015",
    branch: "ECE",
    cgpa: 7.8,
    company: "Infosys",
    role: "Analyst",
    appliedDate: "2026-09-21",
    status: "Shortlisted",
    matchScore: 87,
  },
  {
    id: "app-4",
    studentName: "Sneha Reddy",
    studentRoll: "22IT033",
    branch: "IT",
    cgpa: 8.4,
    company: "Amazon",
    role: "Frontend",
    appliedDate: "2026-09-18",
    status: "Shortlisted",
    matchScore: 85,
  },
  {
    id: "app-5",
    studentName: "Karan Verma",
    studentRoll: "22CSE104",
    branch: "CSE",
    cgpa: 9.1,
    company: "Google",
    role: "Backend",
    appliedDate: "2026-09-15",
    status: "Offer",
    matchScore: 95,
  },
  {
    id: "app-6",
    studentName: "Pooja Hegde",
    studentRoll: "22CSE076",
    branch: "CSE",
    cgpa: 8.3,
    company: "TCS",
    role: "Digital",
    appliedDate: "2026-09-19",
    status: "Joined",
    matchScore: 88,
  },
  {
    id: "app-7",
    studentName: "Ananya Mishra",
    studentRoll: "22EEE019",
    branch: "EEE",
    cgpa: 7.2,
    company: "Infosys",
    role: "Analyst",
    appliedDate: "2026-09-23",
    status: "Applied",
    matchScore: 68,
  },
];

export const mockInterviews: InterviewScheduleItem[] = [
  {
    id: "int-1",
    company: "Google",
    studentName: "Himanshu Rout",
    rollNo: "22CSE042",
    interviewer: "Arunav Sen (Senior Staff Engineer)",
    panel: "Panel A - Systems & DSA",
    date: "2026-09-28",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    venue: "Computer Lab 2",
    round: "Technical Interview 1",
    status: "Scheduled",
    hasConflict: true,
    conflictDetails: "Overlaps with TCS Interview scheduled for 10:30 AM – 11:30 AM!",
  },
  {
    id: "int-2",
    company: "TCS",
    studentName: "Himanshu Rout",
    rollNo: "22CSE042",
    interviewer: "Suresh Menon (Technical Architect)",
    panel: "Panel B - Digital Solutions",
    date: "2026-09-28",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    venue: "Auditorium Hall A",
    round: "Technical Interview",
    status: "Scheduled",
    hasConflict: true,
    conflictDetails: "Overlaps with Google Technical Interview scheduled for 10:00 AM – 11:00 AM!",
  },
  {
    id: "int-3",
    company: "TCS",
    studentName: "Riya Sharma",
    rollNo: "22CSE088",
    interviewer: "Geeta Bhatt (HR Lead)",
    panel: "Panel C - HR & Fitment",
    date: "2026-09-30",
    startTime: "09:30 AM",
    endTime: "10:15 AM",
    venue: "Auditorium Hall A",
    round: "HR Interview",
    status: "Scheduled",
  },
  {
    id: "int-4",
    company: "Infosys",
    studentName: "Arjun Patel",
    rollNo: "22ECE015",
    interviewer: "Kavita Rao (Lead Specialist)",
    panel: "Panel D - Core Systems",
    date: "2026-10-06",
    startTime: "11:30 AM",
    endTime: "12:30 PM",
    venue: "Placement Cell Block C",
    round: "Technical Discussion",
    status: "Scheduled",
  },
];

export const mockAIMatches: AIMatchItem[] = [
  {
    id: "ai-1",
    studentName: "Himanshu Rout",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    branch: "CSE",
    cgpa: 8.6,
    company: "Google",
    role: "SDE",
    package: "₹12 LPA",
    matchScore: 92,
    positiveSignals: ["Python", "React", "DSA", "8.6 CGPA", "Solved 350+ LeetCode"],
    missingGaps: ["System Design", "AWS Cloud Basics"],
    status: "Shortlisted",
  },
  {
    id: "ai-2",
    studentName: "Riya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    branch: "CSE",
    cgpa: 8.9,
    company: "TCS",
    role: "Developer",
    package: "₹7.5 LPA",
    matchScore: 89,
    positiveSignals: ["Java", "Spring Boot", "SQL", "8.9 CGPA", "Published Research"],
    missingGaps: ["Docker Production Deployment"],
    status: "Recommended",
  },
  {
    id: "ai-3",
    studentName: "Arjun Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    branch: "ECE",
    cgpa: 7.8,
    company: "Infosys",
    role: "Analyst",
    package: "₹9.5 LPA",
    matchScore: 87,
    positiveSignals: ["Data Analysis", "Python", "Embedded C", "7.8 CGPA"],
    missingGaps: ["Advanced Tree Traversal", "System Scale"],
    status: "Applied",
  },
  {
    id: "ai-4",
    studentName: "Sneha Reddy",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    branch: "IT",
    cgpa: 8.4,
    company: "Amazon",
    role: "Frontend",
    package: "₹8.9 LPA",
    matchScore: 85,
    positiveSignals: ["React", "JavaScript", "UI Architecture", "8.4 CGPA"],
    missingGaps: ["TypeScript Strict Mode", "Webpack Bundling"],
    status: "Recommended",
  },
];

export const mockOffers: OfferItem[] = [
  {
    id: "off-1",
    studentName: "Riya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rollNo: "22CSE088",
    branch: "CSE",
    company: "TCS",
    role: "Developer",
    package: "₹7.5 LPA",
    offerDate: "2026-09-18",
    joiningDate: "2026-07-15",
    documentStatus: "Verified",
    status: "Accepted",
    letterUrl: "#",
  },
  {
    id: "off-2",
    studentName: "Karan Verma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    rollNo: "22CSE104",
    branch: "CSE",
    company: "Google",
    role: "Backend Engineer",
    package: "₹12 LPA",
    offerDate: "2026-09-20",
    joiningDate: "2026-08-01",
    documentStatus: "Verified",
    status: "Accepted",
    letterUrl: "#",
  },
  {
    id: "off-3",
    studentName: "Sneha Reddy",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    rollNo: "22IT033",
    branch: "IT",
    company: "Amazon",
    role: "Frontend Engineer",
    package: "₹8.9 LPA",
    offerDate: "2026-09-22",
    joiningDate: "2026-07-20",
    documentStatus: "Pending Verification",
    status: "Pending",
    letterUrl: "#",
  },
  {
    id: "off-4",
    studentName: "Pooja Hegde",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    rollNo: "22CSE076",
    branch: "CSE",
    company: "Microsoft",
    role: "Support Engineer",
    package: "₹14.2 LPA",
    offerDate: "2026-09-23",
    joiningDate: "2026-08-10",
    documentStatus: "Verified",
    status: "Accepted",
    letterUrl: "#",
  },
];

export const mockNotifications: SystemNotification[] = [
  {
    id: "notif-1",
    type: "urgent",
    title: "⚠ Schedule Conflict Detected!",
    description: "Himanshu Rout is booked for Google Interview (10:00 AM) and TCS Interview (10:30 AM) on Sep 28.",
    time: "10m ago",
    read: false,
    actionLabel: "Resolve Conflict",
    actionUrl: "/admin/interviews",
  },
  {
    id: "notif-2",
    type: "warning",
    title: "3 students have incomplete profiles",
    description: "Missing 12th percentage and updated resumes before Google drive cutoff tonight.",
    time: "45m ago",
    read: false,
    actionLabel: "Review Students",
    actionUrl: "/admin/students",
  },
  {
    id: "notif-3",
    type: "success",
    title: "✓ Google drive successfully scheduled",
    description: "Online assessment configured for 142 eligible students on Computer Lab 2 portal.",
    time: "2h ago",
    read: false,
    actionLabel: "View Drive",
    actionUrl: "/admin/drives",
  },
  {
    id: "notif-4",
    type: "info",
    title: "📄 12 offer documents awaiting verification",
    description: "TCS and Cognizant candidate LOIs submitted by students awaiting placement cell signature check.",
    time: "4h ago",
    read: false,
    actionLabel: "Verify Offers",
    actionUrl: "/admin/offers",
  },
  {
    id: "notif-5",
    type: "info",
    title: "🏢 New recruiter registration",
    description: "Amazon University Hiring cell submitted verification documents for SDE campus drive.",
    time: "1d ago",
    read: true,
    actionLabel: "Review Recruiter",
    actionUrl: "/admin/recruiters",
  },
  {
    id: "notif-6",
    type: "warning",
    title: "🎯 42 students are below readiness threshold",
    description: "Technical assessment scores below 65% for upcoming Day-1 mass hiring drives.",
    time: "2d ago",
    read: true,
    actionLabel: "Check Skill Gaps",
    actionUrl: "/admin/readiness",
  },
];
