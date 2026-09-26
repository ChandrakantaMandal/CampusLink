export interface RecruiterCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  location: string;
  companySize: string;
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
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  graduationYear: number;
  skills: string[];
  matchScore: number;
  readinessScore: number;
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

export const mockRecruiterCompany: RecruiterCompany = {
  id: "comp-01",
  name: "TechCorp Innovations",
  logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80",
  industry: "Enterprise Software & Cloud Platforms",
  website: "https://techcorp-innovations.io",
  description: "TechCorp is a leading enterprise cloud software developer building distributed AI-enabled microservices and scalable SaaS infrastructure for global Fortune 500 enterprises.",
  recruiterName: "Vikram Malhotra",
  recruiterEmail: "vikram.m@techcorp-innovations.io",
  recruiterPhone: "+91 98765 43210",
  location: "Bangalore, India (Hybrid)",
  companySize: "1,500 - 5,000 Employees",
  linkedinUrl: "https://linkedin.com/company/techcorp-innovations",
  verifiedStatus: "Verified Campus Partner",
  benefits: [
    "Competitive Campus Stipend & Joining Bonus",
    "Health Insurance & Wellness Credits (Family Covered)",
    "Relocation Assistance & Flexible Hybrid Work",
    "Annual Learning & Cloud Certification Allowance",
    "Stock Options (ESOPs) for High Performers"
  ],
};

export const mockRecruiterJobs: RecruiterJob[] = [
  {
    id: "job-01",
    title: "Software Development Engineer (SDE-1)",
    jobType: "Full-Time",
    location: "Bangalore / Pune / Hyderabad",
    ctc: "₹14.5 - ₹18.0 LPA",
    openPositions: 8,
    minCGPA: 7.5,
    allowedBranches: ["CSE", "IT", "ECE"],
    maxBacklogs: 0,
    graduationYear: 2026,
    requiredSkills: ["Data Structures & Algorithms", "Python", "Java", "SQL", "System Design Basics"],
    description: "We are seeking high-potential graduate software engineers to build core microservices, high-throughput distributed pipelines, and developer tooling in our Cloud Infrastructure division.",
    applicationDeadline: "2026-10-15",
    status: "Applications Open",
    applicantsCount: 148,
    shortlistedCount: 28,
    interviewCount: 14,
    offersCount: 5,
    rounds: [
      { roundNumber: 1, name: "Online Aptitude & Coding Test", type: "Aptitude Test" },
      { roundNumber: 2, name: "Core Technical & Data Structures", type: "Technical Interview" },
      { roundNumber: 3, name: "System Architecture & Projects", type: "Technical Interview" },
      { roundNumber: 4, name: "Cultural Fit & HR Round", type: "HR Interview" },
    ],
  },
  {
    id: "job-02",
    title: "AI / Data Science Engineer",
    jobType: "Full-Time",
    location: "Bangalore (On-site)",
    ctc: "₹16.0 - ₹20.0 LPA",
    openPositions: 4,
    minCGPA: 8.0,
    allowedBranches: ["CSE", "IT", "Data Science", "AI & ML"],
    maxBacklogs: 0,
    graduationYear: 2026,
    requiredSkills: ["Python", "PyTorch", "NLP", "Machine Learning", "FastAPI", "Vector DBs"],
    description: "Join our Applied AI research team to train fine-tuned generative LLMs, RAG knowledge systems, and real-time inference microservices.",
    applicationDeadline: "2026-10-20",
    status: "Interviewing",
    applicantsCount: 92,
    shortlistedCount: 18,
    interviewCount: 9,
    offersCount: 3,
    rounds: [
      { roundNumber: 1, name: "ML Fundamentals Assessment", type: "Aptitude Test" },
      { roundNumber: 2, name: "Code & Math Technical Round", type: "Technical Interview" },
      { roundNumber: 3, name: "Research Project Evaluation", type: "Technical Interview" },
      { roundNumber: 4, name: "Leadership & HR", type: "HR Interview" },
    ],
  },
  {
    id: "job-03",
    title: "Cloud & DevOps Associate",
    jobType: "Full-Time",
    location: "Hyderabad (Hybrid)",
    ctc: "₹12.0 - ₹14.0 LPA",
    openPositions: 5,
    minCGPA: 7.0,
    allowedBranches: ["CSE", "IT", "ECE", "EEE"],
    maxBacklogs: 1,
    graduationYear: 2026,
    requiredSkills: ["Linux", "Docker", "Kubernetes", "AWS / Azure", "CI/CD Pipelines", "Git"],
    description: "Design resilient Kubernetes architectures, implement automated GitHub Actions deployments, and ensure 99.99% uptime of enterprise production services.",
    applicationDeadline: "2026-10-25",
    status: "Published",
    applicantsCount: 54,
    shortlistedCount: 12,
    interviewCount: 6,
    offersCount: 2,
    rounds: [
      { roundNumber: 1, name: "DevOps & OS Quiz", type: "Aptitude Test" },
      { roundNumber: 2, name: "Hands-on Infra Round", type: "Technical Interview" },
      { roundNumber: 3, name: "HR Interview", type: "HR Interview" },
    ],
  },
  {
    id: "job-04",
    title: "Frontend Engineering Intern (PPO)",
    jobType: "Internship",
    location: "Bangalore",
    ctc: "₹45,000 / month Stipend (PPO: ₹11 LPA)",
    openPositions: 3,
    minCGPA: 7.2,
    allowedBranches: ["CSE", "IT", "ECE"],
    maxBacklogs: 0,
    graduationYear: 2026,
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "REST APIs", "State Management"],
    description: "Craft modern, responsive user experiences, dashboard components, and interactive web tools using Next.js and Tailwind CSS.",
    applicationDeadline: "2026-10-10",
    status: "Applications Open",
    applicantsCount: 36,
    shortlistedCount: 7,
    interviewCount: 2,
    offersCount: 1,
    rounds: [
      { roundNumber: 1, name: "Frontend Machine Coding", type: "Technical Interview" },
      { roundNumber: 2, name: "UI/UX & Code Review", type: "Technical Interview" },
      { roundNumber: 3, name: "HR Fit", type: "HR Interview" },
    ],
  },
  {
    id: "job-05",
    title: "Product Analyst / Associate PM",
    jobType: "Full-Time",
    location: "Bangalore / Remote",
    ctc: "₹11.5 - ₹13.5 LPA",
    openPositions: 2,
    minCGPA: 7.5,
    allowedBranches: ["CSE", "IT", "ECE", "Mechanical", "Civil"],
    maxBacklogs: 0,
    graduationYear: 2026,
    requiredSkills: ["SQL", "Data Analytics", "Product Strategy", "Figma", "Excel", "User Research"],
    description: "Work alongside Engineering and Design leadership to define feature roadmaps, analyze telemetry data, and drive user retention metrics.",
    applicationDeadline: "2026-10-30",
    status: "Draft",
    applicantsCount: 12,
    shortlistedCount: 3,
    interviewCount: 1,
    offersCount: 1,
    rounds: [
      { roundNumber: 1, name: "Product Case Study", type: "Aptitude Test" },
      { roundNumber: 2, name: "Analytics & Product Round", type: "Technical Interview" },
      { roundNumber: 3, name: "Leadership HR", type: "HR Interview" },
    ],
  },
];

export const mockRecruiterCandidates: RecruiterCandidate[] = [
  {
    id: "cand-01",
    name: "Himanshu Rout",
    email: "himanshu.rout@campuslink.edu",
    phone: "+91 94381 29402",
    college: "Institute of Technical Education & Research",
    branch: "CSE",
    cgpa: 8.85,
    backlogs: 0,
    graduationYear: 2026,
    skills: ["Python", "SQL", "Data Structures", "FastAPI", "React", "PostgreSQL"],
    matchScore: 94,
    readinessScore: 89,
    status: "Interview",
    appliedJobId: "job-01",
    appliedJobTitle: "Software Development Engineer (SDE-1)",
    appliedDate: "2026-09-22",
    githubUrl: "https://github.com/HimanshuKumarRout",
    linkedinUrl: "https://linkedin.com/in/himanshu-rout",
    notes: "Top coder in algorithmic challenges. Strong backend architecture knowledge.",
  },
  {
    id: "cand-02",
    name: "Priya Sharma",
    email: "priya.sharma@campuslink.edu",
    phone: "+91 98234 11094",
    college: "Institute of Technical Education & Research",
    branch: "IT",
    cgpa: 8.42,
    backlogs: 0,
    graduationYear: 2026,
    skills: ["Java", "Spring Boot", "React", "Docker", "SQL", "Git"],
    matchScore: 89,
    readinessScore: 84,
    status: "Shortlisted",
    appliedJobId: "job-01",
    appliedJobTitle: "Software Development Engineer (SDE-1)",
    appliedDate: "2026-09-23",
    githubUrl: "https://github.com/priyasharma",
    notes: "Solid Spring Boot foundation, finished 2 production projects.",
  },
  {
    id: "cand-03",
    name: "Arjun Patel",
    email: "arjun.patel@campuslink.edu",
    phone: "+91 97123 45678",
    college: "Institute of Technical Education & Research",
    branch: "CSE",
    cgpa: 8.15,
    backlogs: 0,
    graduationYear: 2026,
    skills: ["Python", "PyTorch", "Machine Learning", "Data Analysis", "SQL"],
    matchScore: 92,
    readinessScore: 86,
    status: "Shortlisted",
    appliedJobId: "job-02",
    appliedJobTitle: "AI / Data Science Engineer",
    appliedDate: "2026-09-24",
    githubUrl: "https://github.com/arjunpatel",
    notes: "Presented research paper in NLP transformers; clean codebase.",
  },
  {
    id: "cand-04",
    name: "Ananya Iyer",
    email: "ananya.iyer@campuslink.edu",
    phone: "+91 99345 67890",
    college: "Institute of Technical Education & Research",
    branch: "ECE",
    cgpa: 7.92,
    backlogs: 0,
    graduationYear: 2026,
    skills: ["Linux", "Docker", "AWS", "Bash", "Python", "Networking"],
    matchScore: 88,
    readinessScore: 81,
    status: "Under Review",
    appliedJobId: "job-03",
    appliedJobTitle: "Cloud & DevOps Associate",
    appliedDate: "2026-09-25",
    notes: "Certified AWS Cloud Practitioner; enthusiastic about Kubernetes.",
  },
  {
    id: "cand-05",
    name: "Rohan Verma",
    email: "rohan.verma@campuslink.edu",
    phone: "+91 98451 23456",
    college: "Institute of Technical Education & Research",
    branch: "CSE",
    cgpa: 7.64,
    backlogs: 0,
    graduationYear: 2026,
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux"],
    matchScore: 91,
    readinessScore: 83,
    status: "Selected",
    appliedJobId: "job-04",
    appliedJobTitle: "Frontend Engineering Intern (PPO)",
    appliedDate: "2026-09-20",
    notes: "Exceptional UI speed and polished CSS interactions.",
  },
  {
    id: "cand-06",
    name: "Sneha Reddy",
    email: "sneha.reddy@campuslink.edu",
    phone: "+91 91234 56780",
    college: "Institute of Technical Education & Research",
    branch: "IT",
    cgpa: 8.78,
    backlogs: 0,
    graduationYear: 2026,
    skills: ["Python", "FastAPI", "MongoDB", "Redis", "Docker", "TypeScript"],
    matchScore: 93,
    readinessScore: 88,
    status: "Offer",
    appliedJobId: "job-01",
    appliedJobTitle: "Software Development Engineer (SDE-1)",
    appliedDate: "2026-09-18",
    notes: "Accepted offer letter on Sep 25. High conversion candidate.",
  },
  {
    id: "cand-07",
    name: "Aditya Nair",
    email: "aditya.nair@campuslink.edu",
    phone: "+91 96543 21098",
    college: "Institute of Technical Education & Research",
    branch: "CSE",
    cgpa: 7.10,
    backlogs: 1,
    graduationYear: 2026,
    skills: ["Python", "HTML/CSS", "Basic SQL"],
    matchScore: 68,
    readinessScore: 64,
    status: "Applied",
    appliedJobId: "job-01",
    appliedJobTitle: "Software Development Engineer (SDE-1)",
    appliedDate: "2026-09-26",
    notes: "Does not satisfy minimum 7.5 CGPA requirement for SDE-1.",
  },
  {
    id: "cand-08",
    name: "Meera Das",
    email: "meera.das@campuslink.edu",
    phone: "+91 95432 10987",
    college: "Institute of Technical Education & Research",
    branch: "CSE",
    cgpa: 8.35,
    backlogs: 0,
    graduationYear: 2026,
    skills: ["Python", "R", "SQL", "Tableau", "Statistics", "Machine Learning"],
    matchScore: 87,
    readinessScore: 82,
    status: "Shortlisted",
    appliedJobId: "job-02",
    appliedJobTitle: "AI / Data Science Engineer",
    appliedDate: "2026-09-24",
    notes: "Strong statistical background and exploratory data analysis skills.",
  },
];

export const mockAIMatches: AIMatchAnalysis[] = [
  {
    candidateId: "cand-01",
    candidateName: "Himanshu Rout",
    candidateBranch: "CSE",
    candidateCGPA: 8.85,
    jobId: "job-01",
    jobTitle: "Software Development Engineer (SDE-1)",
    overallMatchScore: 94,
    matchTier: "Strong Match",
    matchedCriteria: [
      "✓ Python & Data Structures proficiency (Advanced)",
      "✓ Satisfies Academic CGPA cutoff (8.85 >= 7.50)",
      "✓ Zero active backlogs verified by TPO Cell",
      "✓ Full-Stack Microservices Project verified on GitHub",
      "✓ Relational SQL & Database Optimization"
    ],
    missingSkills: ["System Design Basics", "Redis Caching in Production"],
    whyExplanation: "Candidate possesses high algorithmic fluency, meets all academic eligibility thresholds, and demonstrated full-stack engineering competency through 4 verified project repositories.",
    verifiedProjectsCount: 4,
  },
  {
    candidateId: "cand-03",
    candidateName: "Arjun Patel",
    candidateBranch: "CSE",
    candidateCGPA: 8.15,
    jobId: "job-02",
    jobTitle: "AI / Data Science Engineer",
    overallMatchScore: 92,
    matchTier: "Strong Match",
    matchedCriteria: [
      "✓ PyTorch & Transformers model building",
      "✓ Satisfies Academic CGPA cutoff (8.15 >= 8.00)",
      "✓ Python ML Pipeline Development",
      "✓ Research publication in peer-reviewed student symposium"
    ],
    missingSkills: ["Vector Databases (Pinecone/Milvus)", "FastAPI Deployment"],
    whyExplanation: "Exceptional mathematical and deep learning grounding with verified ML model evaluations. Meets strict CGPA threshold with relevant open-source notebooks.",
    verifiedProjectsCount: 3,
  },
  {
    candidateId: "cand-05",
    candidateName: "Rohan Verma",
    candidateBranch: "CSE",
    candidateCGPA: 7.64,
    jobId: "job-04",
    jobTitle: "Frontend Engineering Intern (PPO)",
    overallMatchScore: 91,
    matchTier: "Strong Match",
    matchedCriteria: [
      "✓ React & Next.js production experience",
      "✓ Tailwind CSS & modern responsive layout design",
      "✓ TypeScript type safety & custom hooks",
      "✓ Satisfies Academic CGPA cutoff (7.64 >= 7.20)"
    ],
    missingSkills: ["End-to-End Testing (Playwright/Cypress)"],
    whyExplanation: "Demonstrated exemplary UI craft with multiple deployed client-facing applications and modern design tokens.",
    verifiedProjectsCount: 5,
  },
  {
    candidateId: "cand-02",
    candidateName: "Priya Sharma",
    candidateBranch: "IT",
    candidateCGPA: 8.42,
    jobId: "job-01",
    jobTitle: "Software Development Engineer (SDE-1)",
    overallMatchScore: 89,
    matchTier: "Potential Match",
    matchedCriteria: [
      "✓ Java & Spring Boot microservices",
      "✓ Docker containerization experience",
      "✓ Strong Academic CGPA (8.42)",
      "✓ Clean relational schema design"
    ],
    missingSkills: ["Python Scripting", "Distributed Message Queues (Kafka)"],
    whyExplanation: "High potential enterprise engineer. While primary stack is Java rather than Python, core DSA and OOP fundamentals are outstanding.",
    verifiedProjectsCount: 2,
  },
  {
    candidateId: "cand-04",
    candidateName: "Ananya Iyer",
    candidateBranch: "ECE",
    candidateCGPA: 7.92,
    jobId: "job-03",
    jobTitle: "Cloud & DevOps Associate",
    overallMatchScore: 88,
    matchTier: "Potential Match",
    matchedCriteria: [
      "✓ Linux Shell scripting & admin",
      "✓ Docker container configuration",
      "✓ AWS Cloud Practitioner certified",
      "✓ Eligible ECE branch & zero backlogs"
    ],
    missingSkills: ["Kubernetes Helm Charts", "Terraform Infrastructure-as-Code"],
    whyExplanation: "Solid baseline cloud infrastructure knowledge with recognized industry certification. Rapid learner with strong networking foundations.",
    verifiedProjectsCount: 2,
  },
];

export const mockRecruiterInterviews: RecruiterInterview[] = [
  {
    id: "int-01",
    candidateId: "cand-01",
    candidateName: "Himanshu Rout",
    candidateEmail: "himanshu.rout@campuslink.edu",
    jobId: "job-01",
    jobTitle: "Software Development Engineer (SDE-1)",
    round: "Round 2: Core Technical & DSA",
    date: "Today, Sep 26",
    time: "10:30 AM – 11:30 AM",
    duration: "60 mins",
    mode: "Online Google Meet",
    meetingLink: "https://meet.google.com/xyz-tech-round",
    interviewerPanel: "Vikram Malhotra & Lead Arch",
    status: "Scheduled",
    hasConflict: true,
    conflictDetails: {
      conflictingWith: "Apex Systems Final Round",
      existingSlot: "10:00 AM – 11:00 AM",
      newSlot: "10:30 AM – 11:30 AM",
      message: "Overlap detected with an external on-campus interview slot booked by TPO Cell.",
    },
  },
  {
    id: "int-02",
    candidateId: "cand-02",
    candidateName: "Priya Sharma",
    candidateEmail: "priya.sharma@campuslink.edu",
    jobId: "job-01",
    jobTitle: "Software Development Engineer (SDE-1)",
    round: "Round 2: Core Technical & DSA",
    date: "Today, Sep 26",
    time: "02:00 PM – 03:00 PM",
    duration: "60 mins",
    mode: "Online Google Meet",
    meetingLink: "https://meet.google.com/priya-tech-round",
    interviewerPanel: "Vikram Malhotra",
    status: "Scheduled",
  },
  {
    id: "int-03",
    candidateId: "cand-03",
    candidateName: "Arjun Patel",
    candidateEmail: "arjun.patel@campuslink.edu",
    jobId: "job-02",
    jobTitle: "AI / Data Science Engineer",
    round: "Round 3: ML Research & Project Evaluation",
    date: "Tomorrow, Sep 27",
    time: "11:00 AM – 12:00 PM",
    duration: "60 mins",
    mode: "Online Zoom",
    meetingLink: "https://zoom.us/j/987654321",
    interviewerPanel: "Dr. R. Bannerjee (Principal AI Scientist)",
    status: "Scheduled",
  },
  {
    id: "int-04",
    candidateId: "cand-05",
    candidateName: "Rohan Verma",
    candidateEmail: "rohan.verma@campuslink.edu",
    jobId: "job-04",
    jobTitle: "Frontend Engineering Intern (PPO)",
    round: "Round 2: UI Machine Coding",
    date: "Sep 25",
    time: "03:30 PM – 04:30 PM",
    duration: "60 mins",
    mode: "Online Google Meet",
    interviewerPanel: "Kavita Sen (Staff Frontend Eng)",
    status: "Completed",
  },
];

export const mockRecruiterOffers: RecruiterOffer[] = [
  {
    id: "off-01",
    candidateId: "cand-06",
    candidateName: "Sneha Reddy",
    candidateBranch: "IT",
    jobId: "job-01",
    role: "Software Development Engineer (SDE-1)",
    ctc: "₹16.5 LPA",
    baseSalary: "₹14.0 LPA",
    variableBonus: "₹2.5 LPA Joining Bonus",
    joiningDate: "July 15, 2026",
    offerLetterUrl: "/documents/offers/SDE_Sneha_Reddy.pdf",
    acceptanceStatus: "Accepted",
    documentVerification: "Verified",
    joiningStatus: "Confirmed",
  },
  {
    id: "off-02",
    candidateId: "cand-05",
    candidateName: "Rohan Verma",
    candidateBranch: "CSE",
    jobId: "job-04",
    role: "Frontend Engineering Intern (PPO)",
    ctc: "₹11.0 LPA",
    baseSalary: "₹9.5 LPA",
    variableBonus: "₹1.5 LPA",
    joiningDate: "Jan 10, 2026 (Internship)",
    offerLetterUrl: "/documents/offers/Intern_Rohan_Verma.pdf",
    acceptanceStatus: "Pending Acceptance",
    documentVerification: "Verified",
    joiningStatus: "Awaiting Onboarding",
  },
  {
    id: "off-03",
    candidateId: "cand-09",
    candidateName: "Devansh Kulkarni",
    candidateBranch: "CSE",
    jobId: "job-01",
    role: "Software Development Engineer (SDE-1)",
    ctc: "₹16.5 LPA",
    baseSalary: "₹14.0 LPA",
    variableBonus: "₹2.5 LPA",
    joiningDate: "July 15, 2026",
    offerLetterUrl: "/documents/offers/SDE_Devansh_Kulkarni.pdf",
    acceptanceStatus: "Sent",
    documentVerification: "Pending Review",
    joiningStatus: "Awaiting Onboarding",
  },
  {
    id: "off-04",
    candidateId: "cand-10",
    candidateName: "Tanvi Saxena",
    candidateBranch: "ECE",
    jobId: "job-03",
    role: "Cloud & DevOps Associate",
    ctc: "₹13.5 LPA",
    baseSalary: "₹12.0 LPA",
    variableBonus: "₹1.5 LPA",
    joiningDate: "July 01, 2026",
    offerLetterUrl: "/documents/offers/Cloud_Tanvi_Saxena.pdf",
    acceptanceStatus: "Accepted",
    documentVerification: "Verified",
    joiningStatus: "Confirmed",
  },
];

export const mockRecruiterNotifications: RecruiterNotification[] = [
  {
    id: "notif-01",
    title: "⚠ Interview Conflict Detected",
    message: "Candidate Himanshu Rout has an overlapping slot with Apex Systems at 10:30 AM. Reschedule recommended.",
    time: "15 minutes ago",
    type: "conflict",
    isRead: false,
    actionUrl: "/recruiter/interviews",
  },
  {
    id: "notif-02",
    title: "Candidate Accepted Offer Letter 🎉",
    message: "Sneha Reddy formally accepted the SDE-1 offer of ₹16.5 LPA with verified documents.",
    time: "1 hour ago",
    type: "offer",
    isRead: false,
    actionUrl: "/recruiter/offers",
  },
  {
    id: "notif-03",
    title: "18 New AI Candidate Matches",
    message: "AI Engine analyzed 148 applicants for SDE-1. 28 students classified as Strong Match (90%+).",
    time: "3 hours ago",
    type: "ai_match",
    isRead: false,
    actionUrl: "/recruiter/ai-matching",
  },
  {
    id: "notif-04",
    title: "New Application Received",
    message: "Aditya Nair submitted application for Software Development Engineer (SDE-1).",
    time: "5 hours ago",
    type: "application",
    isRead: true,
    actionUrl: "/recruiter/applications",
  },
  {
    id: "notif-05",
    title: "Application Deadline Approaching",
    message: "Frontend Engineering Intern (PPO) deadline is in 3 days (October 10).",
    time: "Yesterday",
    type: "system",
    isRead: true,
    actionUrl: "/recruiter/jobs",
  },
];
