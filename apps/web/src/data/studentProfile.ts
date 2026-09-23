export interface Education {
  id: string;
  degree: string;
  branch: string;
  institution: string;
  startYear: string;
  endYear: string;
  cgpa: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  credentialId?: string;
  certificateUrl?: string;
}

export interface StudentProfileData {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  cgpa: string;
  location: string;
  bio: string;
  isPublic: boolean;
  avatarUrl?: string;
  skills: string[];
  education: Education[];
  certifications: Certification[];
  resume: {
    fileName: string;
    fileSize: string;
    uploadDate: string;
    url?: string;
  } | null;
  github: string;
  linkedin: string;
  portfolio: string;
  leetcode: string;
  hackerrank: string;
  otherWebsite: string;
}

export function createEmptyStudentProfile(
  name = "",
  email = "",
  avatarUrl = ""
): StudentProfileData {
  return {
    name,
    email,
    phone: "",
    department: "",
    year: "",
    cgpa: "",
    location: "",
    bio: "",
    isPublic: true,
    avatarUrl,
    skills: [],
    education: [],
    certifications: [],
    resume: null,
    github: "",
    linkedin: "",
    portfolio: "",
    leetcode: "",
    hackerrank: "",
    otherWebsite: "",
  };
}

export const sampleDemoProfile: StudentProfileData = {
  name: "Himanshu Rout",
  email: "himanshu.rout@example.com",
  phone: "+91 98765 43210",
  department: "Computer Science Engineering",
  year: "2nd Year",
  cgpa: "8.6",
  location: "Bhubaneswar, India",
  bio: "Passionate Computer Science Engineering student specializing in full-stack web applications, cybersecurity fundamentals, and algorithms. Aspiring software engineer eager to tackle challenging real-world problems.",
  isPublic: true,
  avatarUrl: "",
  skills: [
    "Cybersecurity",
    "Python",
    "React",
    "Networking",
    "SQL",
    "Git & GitHub",
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science Engineering",
      branch: "Computer Science & Engineering",
      institution: "National Institute of Technology",
      startYear: "2024",
      endYear: "2028",
      cgpa: "8.6/10",
      description:
        "Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, and Operating Systems.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Cybersecurity Internship",
      issuingOrg: "CTTC",
      issueDate: "June 2024",
      credentialId: "CTTC-CS-2024-892",
      certificateUrl: "https://cttc.gov.in/verify/CTTC-CS-2024-892",
    },
    {
      id: "cert-2",
      name: "Python Foundation",
      issuingOrg: "Infosys Springboard",
      issueDate: "March 2024",
      credentialId: "INF-SB-PY-4401",
      certificateUrl: "https://springboard.infosys.com/verify/INF-SB-PY-4401",
    },
  ],
  resume: {
    fileName: "Resume.pdf",
    fileSize: "1.2 MB",
    uploadDate: "Sep 15, 2024",
  },
  github: "https://github.com/HimanshuKumarRout",
  linkedin: "https://linkedin.com/in/himanshu-rout",
  portfolio: "https://himanshurout.dev",
  leetcode: "https://leetcode.com/himanshu_rout",
  hackerrank: "https://hackerrank.com/himanshu_rout",
  otherWebsite: "",
};

export const initialStudentProfile: StudentProfileData = createEmptyStudentProfile();

export interface CompletionItem {
  id: string;
  label: string;
  completed: boolean;
  fieldKey: string;
  weight: number;
}

export function calculateProfileCompletion(profile: StudentProfileData): {
  percentage: number;
  completedCount: number;
  totalCount: number;
  items: CompletionItem[];
  missingSuggestions: string[];
} {
  const items: CompletionItem[] = [
    { id: "name", label: "Full Name", completed: Boolean(profile.name?.trim()), fieldKey: "personal", weight: 1 },
    { id: "email", label: "Email Address", completed: Boolean(profile.email?.trim()), fieldKey: "personal", weight: 1 },
    { id: "phone", label: "Phone Number", completed: Boolean(profile.phone?.trim()), fieldKey: "personal", weight: 1 },
    { id: "department", label: "Department", completed: Boolean(profile.department?.trim()), fieldKey: "personal", weight: 1 },
    { id: "year", label: "Academic Year", completed: Boolean(profile.year?.trim()), fieldKey: "personal", weight: 1 },
    { id: "cgpa", label: "Academic CGPA", completed: Boolean(profile.cgpa?.trim()), fieldKey: "personal", weight: 1 },
    { id: "bio", label: "Short Bio", completed: Boolean(profile.bio?.trim()), fieldKey: "personal", weight: 1 },
    { id: "skills", label: "Technical Skills", completed: profile.skills.length > 0, fieldKey: "skills", weight: 1 },
    { id: "education", label: "Education Details", completed: profile.education.length > 0, fieldKey: "education", weight: 1 },
    { id: "certifications", label: "Certifications", completed: profile.certifications.length > 0, fieldKey: "certifications", weight: 1 },
    { id: "resume", label: "Resume Upload", completed: Boolean(profile.resume), fieldKey: "resume", weight: 1 },
    { id: "github", label: "GitHub Profile", completed: Boolean(profile.github?.trim()), fieldKey: "links", weight: 1 },
    { id: "linkedin", label: "LinkedIn Profile", completed: Boolean(profile.linkedin?.trim()), fieldKey: "links", weight: 1 },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const missingSuggestions = items
    .filter((i) => !i.completed)
    .map((i) => {
      switch (i.id) {
        case "resume":
          return "Upload your PDF resume to increase recruiter views.";
        case "github":
          return "Add your GitHub profile to showcase code repositories.";
        case "linkedin":
          return "Connect your LinkedIn profile for recruiter networking.";
        case "bio":
          return "Write a short bio to introduce your strengths and interests.";
        case "skills":
          return "Add at least 3 technical skills to match job opportunities.";
        case "education":
          return "Add your current college or degree information.";
        case "certifications":
          return "Add verified certificates or course accomplishments.";
        default:
          return `Complete your ${i.label.toLowerCase()} details.`;
      }
    });

  return {
    percentage,
    completedCount,
    totalCount,
    items,
    missingSuggestions,
  };
}
