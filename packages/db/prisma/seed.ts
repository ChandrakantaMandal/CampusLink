import "varlock/auto-load";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  CompanyTier,
  VerificationStatus,
  SkillType,
  JobStatus,
} from "./generated/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});
const skills = [
  { name: "Python", normalized: "python", type: SkillType.PROGRAMMING_LANGUAGE },
  { name: "JavaScript", normalized: "javascript", type: SkillType.PROGRAMMING_LANGUAGE },
  { name: "TypeScript", normalized: "typescript", type: SkillType.PROGRAMMING_LANGUAGE },
  { name: "SQL", normalized: "sql", type: SkillType.DATABASE },
  { name: "Machine Learning", normalized: "machine learning", type: SkillType.OTHER },
  { name: "Deep Learning", normalized: "deep learning", type: SkillType.OTHER },
  { name: "Pandas", normalized: "pandas", type: SkillType.TOOL },
  { name: "NumPy", normalized: "numpy", type: SkillType.TOOL },
  { name: "Scikit-learn", normalized: "scikit-learn", type: SkillType.TOOL },
  { name: "TensorFlow", normalized: "tensorflow", type: SkillType.FRAMEWORK },
  { name: "PyTorch", normalized: "pytorch", type: SkillType.FRAMEWORK },
  { name: "OpenCV", normalized: "opencv", type: SkillType.TOOL },
  { name: "FastAPI", normalized: "fastapi", type: SkillType.BACKEND },
  { name: "Flask", normalized: "flask", type: SkillType.BACKEND },
  { name: "React", normalized: "react", type: SkillType.FRONTEND },
  { name: "Node.js", normalized: "node.js", type: SkillType.BACKEND },
  { name: "Docker", normalized: "docker", type: SkillType.DEVOPS },
  { name: "AWS", normalized: "aws", type: SkillType.CLOUD },
  { name: "Git", normalized: "git", type: SkillType.TOOL },
  { name: "GitHub", normalized: "github", type: SkillType.TOOL },
];

const companies = [
  {
    name: "TechNova Solutions",
    slug: "technova-solutions",
    description: "Technology and software engineering company.",
    industry: "Information Technology",
    location: "Bengaluru, India",
    tier: CompanyTier.TIER_1,
    verifiedStatus: VerificationStatus.VERIFIED,
  },
  {
    name: "DataSphere AI",
    slug: "datasphere-ai",
    description: "AI and data analytics company.",
    industry: "Artificial Intelligence",
    location: "Hyderabad, India",
    tier: CompanyTier.TIER_1,
    verifiedStatus: VerificationStatus.VERIFIED,
  },
  {
    name: "CloudBridge Technologies",
    slug: "cloudbridge-technologies",
    description: "Cloud and backend engineering company.",
    industry: "Cloud Computing",
    location: "Pune, India",
    tier: CompanyTier.TIER_2,
    verifiedStatus: VerificationStatus.VERIFIED,
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // -------------------------
  // Skills
  // -------------------------

  const skillMap = new Map<string, string>();

  for (const skill of skills) {
    const created = await prisma.skill.upsert({
      where: {
        name: skill.name,
      },
      update: {
        normalized: skill.normalized,
        type: skill.type,
      },
      create: skill,
    });

    skillMap.set(skill.name, created.id);
  }

  console.log(`✅ ${skillMap.size} skills ready`);

  // -------------------------
  // Companies
  // -------------------------

  const companyMap = new Map<string, string>();

  for (const company of companies) {
    const created = await prisma.company.upsert({
      where: {
        slug: company.slug,
      },
      update: {
        name: company.name,
        description: company.description,
        industry: company.industry,
        location: company.location,
        tier: company.tier,
        verifiedStatus: company.verifiedStatus,
      },
      create: company,
    });

    companyMap.set(company.name, created.id);
  }

  console.log(`✅ ${companyMap.size} companies ready`);

  // -------------------------
  // Jobs
  // -------------------------

    const jobs = [
    {
      company: "TechNova Solutions",
      title: "Machine Learning Engineer",
      description:
        "Build and deploy machine learning models, develop data pipelines and integrate ML models into production applications.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-14 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      requiredBranch: "Computer Science",
      allowedBranches: ["Computer Science", "Information Technology", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Scikit-learn", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: true },
        { name: "Docker", required: false },
        { name: "AWS", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "AI/ML Intern",
      description:
        "Work on machine learning experiments, data preprocessing, model training and evaluation under the AI engineering team.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "25K-40K/month",
      openPositions: 5,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: true },
        { name: "Scikit-learn", required: true },
        { name: "TensorFlow", required: false },
        { name: "SQL", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Backend Developer",
      description:
        "Develop scalable backend APIs and cloud-ready services using modern backend technologies.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "7-12 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "FastAPI", required: true },
        { name: "SQL", required: true },
        { name: "Docker", required: true },
        { name: "AWS", required: false },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "AI Engineer",
      description:
        "Build and deploy AI systems using machine learning, deep learning and cloud technologies.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "10-16 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: [
        "Computer Science",
        "Information Technology",
        "AI & ML",
      ],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "TensorFlow", required: true },
        { name: "AWS", required: true },
        { name: "Docker", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Data Scientist",
      description:
        "Analyze business datasets and build predictive models to support data-driven decision making.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "9-15 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: true },
        { name: "Machine Learning", required: true },
        { name: "SQL", required: true },
        { name: "Scikit-learn", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Data Analyst",
      description:
        "Analyze datasets, create insights and support business decisions using Python and SQL.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "5-9 LPA",
      openPositions: 4,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "SQL", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: false },
        { name: "Git", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Python Developer",
      description:
        "Develop backend applications and automation tools using Python and modern API frameworks.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "ONSITE",
      ctc: "6-10 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Flask", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
        { name: "Docker", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Deep Learning Engineer",
      description:
        "Develop deep learning models for computer vision and intelligent applications.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "10-18 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 1,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Deep Learning", required: true },
        { name: "TensorFlow", required: true },
        { name: "NumPy", required: true },
        { name: "Machine Learning", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Computer Vision Engineer",
      description:
        "Develop computer vision systems for image analysis and intelligent automation.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "9-16 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Deep Learning", required: true },
        { name: "TensorFlow", required: true },
        { name: "OpenCV", required: false },
        { name: "Machine Learning", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "FastAPI Developer",
      description:
        "Build high-performance REST APIs and backend services using FastAPI and Python.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "7-11 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "FastAPI", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
        { name: "Docker", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "React Developer",
      description:
        "Build responsive and interactive web applications using React and modern JavaScript.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "6-11 LPA",
      openPositions: 4,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "JavaScript", required: true },
        { name: "React", required: true },
        { name: "TypeScript", required: false },
        { name: "Git", required: true },
        { name: "GitHub", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Frontend Developer Intern",
      description:
        "Work with the frontend engineering team to build modern user interfaces and reusable components.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "20K-35K/month",
      openPositions: 5,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "JavaScript", required: true },
        { name: "React", required: true },
        { name: "Git", required: true },
        { name: "GitHub", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Node.js Backend Developer",
      description:
        "Develop scalable backend services and REST APIs using Node.js and SQL databases.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "7-12 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "JavaScript", required: true },
        { name: "Node.js", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
        { name: "Docker", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Full Stack Developer",
      description:
        "Build complete web applications across frontend and backend technologies.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-14 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "JavaScript", required: true },
        { name: "React", required: true },
        { name: "Node.js", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Full Stack Developer Intern",
      description:
        "Assist in developing frontend and backend features for web applications.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "25K-40K/month",
      openPositions: 4,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "JavaScript", required: true },
        { name: "React", required: true },
        { name: "Node.js", required: false },
        { name: "Git", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "DevOps Engineer",
      description:
        "Automate application deployment and infrastructure workflows using cloud and container technologies.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-14 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "Git", required: true },
        { name: "GitHub", required: true },
        { name: "Python", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Cloud Engineer",
      description:
        "Design and maintain cloud-based applications and infrastructure on AWS.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-15 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "AWS", required: true },
        { name: "Docker", required: true },
        { name: "Git", required: true },
        { name: "Python", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "MLOps Engineer",
      description:
        "Build reliable machine learning deployment pipelines and production ML infrastructure.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "10-17 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 1,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Cloud DevOps Intern",
      description:
        "Learn cloud deployment, containerization and CI/CD workflows while working with the DevOps team.",
      location: "Pune, India",
      employmentType: "INTERNSHIP",
      workMode: "HYBRID",
      ctc: "20K-35K/month",
      openPositions: 3,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "Git", required: true },
        { name: "GitHub", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "NLP Engineer",
      description:
        "Develop natural language processing systems using machine learning and deep learning techniques.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "9-16 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Deep Learning", required: true },
        { name: "TensorFlow", required: false },
        { name: "PyTorch", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Deep Learning Intern",
      description:
        "Assist with deep learning experiments, model training and evaluation.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "25K-40K/month",
      openPositions: 4,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Deep Learning", required: true },
        { name: "PyTorch", required: true },
        { name: "NumPy", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Software Engineer",
      description:
        "Develop and maintain software applications using modern programming and version control practices.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "ONSITE",
      ctc: "6-10 LPA",
      openPositions: 5,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Git", required: true },
        { name: "GitHub", required: true },
        { name: "SQL", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Python Developer Intern",
      description:
        "Work on Python applications, APIs and automation scripts with the engineering team.",
      location: "Bengaluru, India",
      employmentType: "INTERNSHIP",
      workMode: "HYBRID",
      ctc: "20K-30K/month",
      openPositions: 5,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Git", required: true },
        { name: "GitHub", required: true },
        { name: "Flask", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Machine Learning Intern",
      description:
        "Assist with data preprocessing, feature engineering and machine learning model development.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "25K-40K/month",
      openPositions: 5,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Scikit-learn", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "API Developer",
      description:
        "Design and implement REST APIs for scalable web and mobile applications.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "7-12 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "FastAPI", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Data Science Intern",
      description:
        "Support data analysis, visualization and predictive modeling projects.",
      location: "Bengaluru, India",
      employmentType: "INTERNSHIP",
      workMode: "HYBRID",
      ctc: "22K-35K/month",
      openPositions: 4,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: true },
        { name: "SQL", required: true },
        { name: "Machine Learning", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "AI Research Intern",
      description:
        "Assist researchers with machine learning experiments and model evaluation.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "30K-45K/month",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Deep Learning", required: true },
        { name: "PyTorch", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Backend Engineer Intern",
      description:
        "Develop backend APIs and database integrations under experienced backend engineers.",
      location: "Pune, India",
      employmentType: "INTERNSHIP",
      workMode: "HYBRID",
      ctc: "20K-35K/month",
      openPositions: 4,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "FastAPI", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "React Frontend Engineer",
      description:
        "Create scalable frontend interfaces and reusable React components.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "7-13 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "React", required: true },
        { name: "JavaScript", required: true },
        { name: "TypeScript", required: true },
        { name: "GitHub", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Python Data Engineer",
      description:
        "Build data processing workflows and backend services for analytics systems.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "8-13 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "SQL", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: false },
        { name: "Docker", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "AWS Cloud Intern",
      description:
        "Learn cloud infrastructure, deployment and containerized application workflows on AWS.",
      location: "Pune, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "20K-35K/month",
      openPositions: 4,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "AWS", required: true },
        { name: "Docker", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "ML Platform Engineer",
      description:
        "Build infrastructure and services that support machine learning applications in production.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "10-18 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 1,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "AI Software Engineer",
      description:
        "Develop software products powered by machine learning and deep learning models.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "9-16 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Deep Learning", required: true },
        { name: "PyTorch", required: false },
        { name: "Docker", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Software Developer Intern",
      description:
        "Contribute to software development projects and learn industry engineering practices.",
      location: "Pune, India",
      employmentType: "INTERNSHIP",
      workMode: "ONSITE",
      ctc: "18K-30K/month",
      openPositions: 5,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Git", required: true },
        { name: "GitHub", required: true },
        { name: "SQL", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Data Engineering Intern",
      description:
        "Assist with data processing, SQL queries and Python-based data workflows.",
      location: "Bengaluru, India",
      employmentType: "INTERNSHIP",
      workMode: "HYBRID",
      ctc: "22K-35K/month",
      openPositions: 4,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "SQL", required: true },
        { name: "Pandas", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Computer Vision Intern",
      description:
        "Assist in developing image processing and computer vision models.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "25K-40K/month",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Deep Learning", required: true },
        { name: "TensorFlow", required: true },
        { name: "NumPy", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Cloud Application Developer",
      description:
        "Develop cloud-ready applications and APIs using Python, Docker and AWS.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-14 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "FastAPI", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "TypeScript Developer",
      description:
        "Develop scalable web applications using TypeScript and modern frontend technologies.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "7-12 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "TypeScript", required: true },
        { name: "JavaScript", required: true },
        { name: "React", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "ML Model Developer",
      description:
        "Train, evaluate and improve machine learning models for real-world applications.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "8-14 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Scikit-learn", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Docker Engineer",
      description:
        "Containerize applications and improve deployment workflows using Docker and cloud infrastructure.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "ONSITE",
      ctc: "7-12 LPA",
      openPositions: 2,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "Git", required: true },
        { name: "Python", required: false },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Backend API Intern",
      description:
        "Build and test REST APIs while learning backend development practices.",
      location: "Bengaluru, India",
      employmentType: "INTERNSHIP",
      workMode: "HYBRID",
      ctc: "20K-30K/month",
      openPositions: 5,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Flask", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "AI Product Engineer",
      description:
        "Develop AI-powered product features by integrating machine learning models into applications.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "9-15 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "FastAPI", required: true },
        { name: "Docker", required: false },
        { name: "AWS", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Full Stack Engineer",
      description:
        "Design and implement complete web applications across frontend and backend layers.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-14 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "React", required: true },
        { name: "JavaScript", required: true },
        { name: "Node.js", required: true },
        { name: "SQL", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Machine Learning Research Intern",
      description:
        "Explore machine learning algorithms and evaluate models through research experiments.",
      location: "Bengaluru, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "25K-45K/month",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Scikit-learn", required: true },
        { name: "NumPy", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "PyTorch Engineer",
      description:
        "Develop deep learning models and training pipelines using PyTorch.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "10-18 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 1,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "PyTorch", required: true },
        { name: "Deep Learning", required: true },
        { name: "NumPy", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "AWS Developer",
      description:
        "Develop and deploy applications on AWS using containers and backend APIs.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "8-14 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "AWS", required: true },
        { name: "Docker", required: true },
        { name: "Python", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Frontend Engineer Intern",
      description:
        "Build responsive interfaces and reusable frontend components using React.",
      location: "Bengaluru, India",
      employmentType: "INTERNSHIP",
      workMode: "HYBRID",
      ctc: "20K-35K/month",
      openPositions: 5,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "React", required: true },
        { name: "JavaScript", required: true },
        { name: "GitHub", required: true },
        { name: "TypeScript", required: false },
      ],
    },

    {
      company: "DataSphere AI",
      title: "ML Deployment Engineer",
      description:
        "Deploy machine learning models as scalable production services.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "9-16 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "FastAPI", required: true },
        { name: "Docker", required: true },
        { name: "AWS", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Python Backend Engineer",
      description:
        "Build reliable backend services and REST APIs using Python.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "7-13 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "FastAPI", required: true },
        { name: "SQL", required: true },
        { name: "Docker", required: false },
        { name: "GitHub", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "AI Application Developer",
      description:
        "Develop applications that integrate machine learning models and AI services.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-14 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Flask", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Data Science Associate",
      description:
        "Perform exploratory data analysis and develop predictive analytics solutions.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "7-12 LPA",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Pandas", required: true },
        { name: "NumPy", required: true },
        { name: "Scikit-learn", required: true },
        { name: "SQL", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "DevOps Intern",
      description:
        "Assist with application deployment, Docker containers and cloud infrastructure.",
      location: "Pune, India",
      employmentType: "INTERNSHIP",
      workMode: "ONSITE",
      ctc: "20K-30K/month",
      openPositions: 4,
      minCGPA: 6.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "Machine Learning Software Engineer",
      description:
        "Combine software engineering and machine learning to build production AI systems.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "10-17 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 1,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Scikit-learn", required: true },
        { name: "Docker", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "AI Platform Intern",
      description:
        "Support development of AI services and machine learning infrastructure.",
      location: "Hyderabad, India",
      employmentType: "INTERNSHIP",
      workMode: "REMOTE",
      ctc: "25K-40K/month",
      openPositions: 3,
      minCGPA: 6.5,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Docker", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Backend API Engineer",
      description:
        "Design secure and scalable backend APIs for enterprise applications.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "HYBRID",
      ctc: "8-13 LPA",
      openPositions: 3,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 2,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "FastAPI", required: true },
        { name: "SQL", required: true },
        { name: "Docker", required: true },
        { name: "GitHub", required: true },
      ],
    },

    {
      company: "TechNova Solutions",
      title: "AI/ML Graduate Engineer",
      description:
        "Start a career in AI and machine learning while working on real-world engineering projects.",
      location: "Bengaluru, India",
      employmentType: "FULL_TIME",
      workMode: "ONSITE",
      ctc: "6-10 LPA",
      openPositions: 5,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 1,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Scikit-learn", required: true },
        { name: "Git", required: true },
      ],
    },

    {
      company: "DataSphere AI",
      title: "Applied AI Engineer",
      description:
        "Apply machine learning and deep learning techniques to real-world product problems.",
      location: "Hyderabad, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "10-18 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "AI & ML"],
      graduationYear: 2027,
      minExperience: 1,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "Machine Learning", required: true },
        { name: "Deep Learning", required: true },
        { name: "TensorFlow", required: true },
        { name: "Docker", required: false },
      ],
    },

    {
      company: "CloudBridge Technologies",
      title: "Cloud Backend Engineer",
      description:
        "Develop backend services and deploy them using Docker and AWS cloud infrastructure.",
      location: "Pune, India",
      employmentType: "FULL_TIME",
      workMode: "REMOTE",
      ctc: "8-15 LPA",
      openPositions: 2,
      minCGPA: 7.0,
      requiredDegree: "B.Tech / B.E.",
      allowedBranches: ["Computer Science", "Information Technology"],
      graduationYear: 2027,
      minExperience: 0,
      maxExperience: 3,
      status: JobStatus.APPLICATIONS_OPEN,
      skills: [
        { name: "Python", required: true },
        { name: "FastAPI", required: true },
        { name: "Docker", required: true },
        { name: "AWS", required: true },
        { name: "Git", required: true },
      ],
    },
  ];

  for (const jobData of jobs) {
    const companyId = companyMap.get(jobData.company);

    if (!companyId) {
      throw new Error(`Company not found: ${jobData.company}`);
    }

    const existingJob = await prisma.job.findFirst({
      where: {
        companyId,
        title: jobData.title,
      },
    });

    const job = existingJob
      ? await prisma.job.update({
          where: {
            id: existingJob.id,
          },
          data: {
            description: jobData.description,
            location: jobData.location,
            employmentType: jobData.employmentType,
            workMode: jobData.workMode,
            ctc: jobData.ctc,
            openPositions: jobData.openPositions,
            minCGPA: jobData.minCGPA,
            requiredDegree: jobData.requiredDegree,
            allowedBranches: jobData.allowedBranches,
            graduationYear: jobData.graduationYear,
            minExperience: jobData.minExperience,
            maxExperience: jobData.maxExperience,
            status: jobData.status,
          },
        })
      : await prisma.job.create({
          data: {
            companyId,
            title: jobData.title,
            description: jobData.description,
            location: jobData.location,
            employmentType: jobData.employmentType,
            workMode: jobData.workMode,
            ctc: jobData.ctc,
            openPositions: jobData.openPositions,
            minCGPA: jobData.minCGPA,
            requiredDegree: jobData.requiredDegree,
            allowedBranches: jobData.allowedBranches,
            graduationYear: jobData.graduationYear,
            minExperience: jobData.minExperience,
            maxExperience: jobData.maxExperience,
            status: jobData.status,
          },
        });

    // Remove old skill mappings so re-running the seed stays clean.
    await prisma.jobSkill.deleteMany({
      where: {
        jobId: job.id,
      },
    });

    for (const jobSkill of jobData.skills) {
      const skillId = skillMap.get(jobSkill.name);

      if (!skillId) {
        throw new Error(`Skill not found: ${jobSkill.name}`);
      }

      await prisma.jobSkill.create({
        data: {
          jobId: job.id,
          skillId,
          required: jobSkill.required,
          weight: jobSkill.required ? 1 : 0.5,
        },
      });
    }

    console.log(`✅ Job ready: ${jobData.title}`);
  }

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });