import { BarChart3, Briefcase, Building2, Cpu, GraduationCap, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";

export const faqs = [
  {
    question:
      "What is deterministic placement intelligence and why does it matter?",
    answer:
      "Generic LLMs can hallucinate qualifications or make biased decisions. CAMPUSLINK separates deterministic rules (strict CGPA cutoffs, degree branches, active backlog limits, graduation year) from generative AI. LLMs are applied strictly where they excel: deep semantic resume parsing, keyword normalization, and tailored study recommendations, while eligibility remains 100% auditable and reliable.",
  },
  {
    question: "How is the CAMPUSLINK Readiness Index calculated?",
    answer:
      "The readiness score is a multi-dimensional composite metric formulated around real-world recruiter preferences: Academics / CGPA (20%), Technical Proficiencies (30%), Verified Projects with Live Demos (20%), ATS Resume Quality (10%), and Mock Assessment Performance (20%). It provides students with a transparent benchmark against Tier-1 and high-growth hiring bars.",
  },
  {
    question: "Is CAMPUSLINK free for college students?",
    answer:
      "Yes! Students can build their complete digital placement portfolio, upload and preview resumes, track profile completion percentages, discover skill gaps, and apply for approved campus drives at zero cost.",
  },
  {
    question: "How does CAMPUSLINK assist University Placement Cells (TPOs)?",
    answer:
      "TPO teams replace endless disconnected spreadsheets with an automated command center. They can approve company registration drives, publish customized eligibility criteria, monitor student applications in real time, coordinate interview rounds, and export compliance-ready placement statistics for NIRF, NBA, and NAAC audits in one click.",
  },
  {
    question: "How does the Skill Gap Analyzer work?",
    answer:
      "When an eligible company posts a job opening (e.g. Full-Stack Engineer requiring TypeScript, React, Docker, AWS), CAMPUSLINK parses the job requirements and contrasts them against your profile. It highlights matched competencies and identifies unfulfilled requirements with tailored roadmaps to master them before tests begin.",
  },
  {
    question: "Is my student data secure and private?",
    answer:
      "CAMPUSLINK utilizes Better-Auth with encrypted session cookies, role-based access control, and PostgreSQL with Prisma ORM. Only verified campus recruiters and your designated university placement officers have access to your verified academic records.",
  },
];

export const features = [
  {
    icon: ShieldCheck,
    badge: "Zero-Hallucination",
    title: "Deterministic Eligibility Engine",
    description:
      "Unlike generic LLMs that hallucinate, CAMPUSLINK evaluates placement eligibility with strict deterministic rules for CGPA cutoffs, branch, graduation year, and active backlogs.",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    iconColor: "text-blue-600 dark:text-blue-400",
    stats: "100% Rule Compliance",
    highlights: [
      "Hard cutoff enforcement",
      "Branch & Degree mapping",
      "Backlog verification",
    ],
  },
  {
    icon: Cpu,
    badge: "AI-Powered",
    title: "Semantic Resume & Skill Gap Analysis",
    description:
      "Deeply parses resumes to identify core proficiencies and calculates the exact missing gap: Required Skills − Candidate Skills = Skill Gap with actionable study paths.",
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    iconColor: "text-purple-600 dark:text-purple-400",
    stats: "Instant ATS Evaluation",
    highlights: [
      "Skill normalization",
      "Tailored learning roadmaps",
      "ATS keyword scoring",
    ],
  },
  {
    icon: TrendingUp,
    badge: "Multi-Factor",
    title: "Comprehensive Readiness Index",
    description:
      "Synthesizes 5 key dimensions: Academics (20%), Technical Skills (30%), Projects (20%), Resume (10%), and Assessments (20%) to predict recruiter match rates accurately.",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    stats: "5-Factor Weighted Score",
    highlights: [
      "Real-time progress bars",
      "Tier prediction",
      "Peer benchmark comparison",
    ],
  },
  {
    icon: Briefcase,
    badge: "Automation",
    title: "End-to-End Campus Drive Manager",
    description:
      "Orchestrates company onboarding, student registrations, eligibility shortlists, online technical assessments, and multi-round interview slots seamlessly.",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    stats: "Zero Spreadsheet Chaos",
    highlights: [
      "Automated interview slots",
      "Batch offer rollouts",
      "1-click student applications",
    ],
  },
  {
    icon: BarChart3,
    badge: "Executive",
    title: "TPO Command Center & NIRF Auditing",
    description:
      "Provides college authorities and Placement Officers with live placement statistics, average CTC tracking, branch-wise placements, and instant NAAC/NIRF audit exports.",
    gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    stats: "1-Click Audit Reports",
    highlights: [
      "Branch-wise CTC metrics",
      "Department placement ratios",
      "Accreditation data export",
    ],
  },
  {
    icon: Smartphone,
    badge: "Architecture",
    title: "Modern Security & PWA Support",
    description:
      "Powered by Better-Auth with secure session cookies, PostgreSQL with Prisma ORM, Redis caching for instant OTPs, and complete Progressive Web App installation.",
    gradient: "from-indigo-500/10 via-violet-500/5 to-transparent",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    stats: "Offline & Mobile First",
    highlights: [
      "Better-Auth sessions",
      "Redis rate limiting",
      "Installable PWA app",
    ],
  },
];

export const personas = {
    students: {
      label: "For Students",
      icon: GraduationCap,
      tagline: "Your AI-Powered Career Co-Pilot",
      headline: "Know Your Placement Readiness Before Day One of Campus Drives",
      description:
        "Never wonder whether you qualify or what you need to improve. CAMPUSLINK continuously analyzes your profile, scores your resume against actual recruiter standards, and highlights exact skill gaps to bridge.",
      benefits: [
        "Instant Deterministic Eligibility: Pre-check your qualification for all company drives.",
        "Real-Time Readiness Score: Combines academics, projects, certifications, and technical tests.",
        "Targeted Skill-Gap Roadmaps: Know exactly what frameworks and concepts you need next.",
        "1-Click Verified Applications: Apply instantly with verified student credentials.",
      ],
      stats: [
        { label: "Profile Match Accuracy", value: "99.2%" },
        { label: "Average Salary Boost", value: "+38%" },
        { label: "Time Saved Applying", value: "12 hrs/wk" },
      ],
      ctaText: "Launch Student Profile",
      ctaLink: "/student/profile",
      previewBadge: "Student Dashboard Preview",
      mockItems: [
        { title: "Resume ATS Score", value: "96 / 100", highlight: true },
        { title: "Active Drive Invitations", value: "8 Companies", highlight: false },
        { title: "Placement Cell Verification", value: "Verified ✅", highlight: false },
      ],
    },
    recruiters: {
      label: "For Recruiters & Companies",
      icon: Briefcase,
      tagline: "Zero-Noise Campus Hiring",
      headline: "Source Pre-Vetted, 100% Eligible Campus Talent at 4x Speed",
      description:
        "Eliminate resume spam and unqualified applications. Set strict deterministic parameters for CGPA, branches, graduation year, and backlog limits, then let our matching engine surface genuine top performers.",
      benefits: [
        "Deterministic Criteria Filters: Zero hallucinations on CGPA, degree, and backlogs.",
        "AI Semantic Skill Verification: Compare candidate project repositories & verified skills.",
        "End-to-End Drive Scheduling: Coordinate test rounds, technical interviews, and rolling offers.",
        "One-Click Shortlisting & Export: Seamless integration with enterprise HRMS & ATS.",
      ],
      stats: [
        { label: "Candidate Screening Speed", value: "4.2x Faster" },
        { label: "Offer Acceptance Rate", value: "91%" },
        { label: "Unqualified Applications", value: "0%" },
      ],
      ctaText: "Recruiter Access Portal",
      ctaLink: "/login?role=recruiter",
      previewBadge: "Recruiter Dashboard Preview",
      mockItems: [
        { title: "Matched Candidates", value: "142 Shortlisted", highlight: true },
        { title: "Eligibility Pass Rate", value: "100% Verified", highlight: false },
        { title: "Assessment Slotting", value: "Automated", highlight: false },
      ],
    },
    tpo: {
      label: "For Placement Cells & Universities",
      icon: Building2,
      tagline: "The Ultimate TPO Command Center",
      headline: "Orchestrate Entire Campus Placement Seasons With Complete Control",
      description:
        "Replace chaotic spreadsheets and scattered WhatsApp messages. Centralize company registrations, student eligibility approvals, job slot schedules, and NIRF/NAAC compliant placement reporting in one real-time portal.",
      benefits: [
        "Live College-Wide Dashboard: Real-time visibility into branch-wise offers and CTCs.",
        "Automated Eligibility Enforcement: Ensure university policies and company rules are respected.",
        "Instant Drive Broadcasts: One-click circulars with automated email and OTP verification.",
        "Regulatory & Audit Compliance: Generate complete NIRF, NBA, and NAAC placement reports.",
      ],
      stats: [
        { label: "Placement Management Hours", value: "-75%" },
        { label: "Offer Tracking Accuracy", value: "100%" },
        { label: "Campus Drive Capacity", value: "+50 Drives" },
      ],
      ctaText: "Explore TPO Command Center",
      ctaLink: "/login?role=tpo",
      previewBadge: "Placement Officer Command Center",
      mockItems: [
        { title: "Total Placed Batch Rate", value: "94.6%", highlight: true },
        { title: "Active On-Campus Drives", value: "24 Companies", highlight: false },
        { title: "Highest Package Offered", value: "48.5 LPA", highlight: false },
      ],
    },
  }as const;

 export   const partners = [
    "Google",
    "Microsoft",
    "Amazon",
    "Oracle",
    "Cisco",
    "Infosys",
    "TCS",
    "Deloitte",
    "Goldman Sachs",
    "Atlassian",
  ];

 export  const testimonials = [
      {
        quote:
          "CAMPUSLINK identified that my lack of Docker and Redis was the only gap holding back my resume from Tier-1 shortlists. I focused on those, boosted my readiness score to 96, and cracked an SDE role at Microsoft!",
        name: "Ananya Sharma",
        role: "Software Engineer @ Microsoft",
        sub: "B.Tech CSE Graduate • Batch 2025",
        avatar: "AS",
        verified: "Placed via CAMPUSLINK",
        rating: 5,
      },
      {
        quote:
          "Managing 2,800 engineering students across 65 on-campus drives used to mean endless spreadsheets and manual verification headaches. CAMPUSLINK automated eligibility cutoffs and made our placement season 4x smoother.",
        name: "Dr. Rajesh K.",
        role: "Head of Training & Placement",
        sub: "Premier National Engineering College",
        avatar: "RK",
        verified: "TPO Partner",
        rating: 5,
      },
      {
        quote:
          "Zero unqualified candidates reached our technical interview panel. The deterministic eligibility engine verified CGPA and backlogs beforehand, allowing us to focus only on top-tier engineering talent.",
        name: "Priya Nair",
        role: "Campus Talent Acquisition Lead",
        sub: "Global FinTech Solutions",
        avatar: "PN",
        verified: "Hiring Partner",
        rating: 5,
      },
    ];