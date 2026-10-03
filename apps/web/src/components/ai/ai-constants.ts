import {
  Atom,
  Briefcase,
  Code2,
  Compass,
  FileCode,
  FileText,
  Globe,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export interface PromptCard {
  id: string;
  category: "all" | "coding" | "science" | "general" | "resume" | "interview" | "roadmap";
  title: string;
  desc: string;
  prompt: string;
  icon: LucideIcon;
  badge: string;
  badgeColor: string;
  borderHover: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: number;
  messages?: any[];
}

export const FILTER_TABS = [
  { id: "all", label: "All Topics" },
  { id: "coding", label: "Coding & Dev" },
  { id: "science", label: "Science & AI" },
  { id: "resume", label: "Resume & ATS" },
  { id: "interview", label: "Mock Interviews" },
  { id: "roadmap", label: "Career Roadmaps" },
] as const;

export const FOLLOW_UP_SUGGESTIONS = [
  "Give me code examples",
  "Explain in simpler terms",
  "Show step-by-step math",
  "How to phrase this on resume?",
  "Give me 2 practice questions",
];

export const PROMPT_CARDS: PromptCard[] = [
  // Coding & Technology
  {
    id: "python-scraping",
    category: "coding",
    title: "Python Web Scraping & APIs",
    desc: "Build a production-grade scraping script with BeautifulSoup and error handling.",
    prompt:
      "Write a complete Python script to scrape a website using BeautifulSoup, including custom headers, error handling, and rate limiting.",
    icon: Terminal,
    badge: "Python Code",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/5",
  },
  {
    id: "react-architecture",
    category: "coding",
    title: "React Server vs Client Components",
    desc: "Detailed architectural breakdown of React 19 / Next.js Server Components.",
    prompt:
      "Explain React Server Components (RSC) vs Client Components with practical examples, data fetching patterns, and common mistakes to avoid.",
    icon: Code2,
    badge: "React & Next.js",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    borderHover: "hover:border-cyan-500/50 hover:shadow-cyan-500/5",
  },
  // Science & General Knowledge
  {
    id: "llm-transformers",
    category: "science",
    title: "How Transformers & LLMs Work",
    desc: "Understand self-attention, tokenization, embeddings, and next-token prediction.",
    prompt:
      "Explain how Large Language Models (LLMs) and the Transformer self-attention mechanism work under the hood in intuitive, step-by-step detail.",
    icon: Atom,
    badge: "AI & Science",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/5",
  },
  {
    id: "quantum-physics",
    category: "science",
    title: "Quantum Computing Principles",
    desc: "Superposition, quantum entanglement, qubits, and real-world quantum algorithms.",
    prompt:
      "Explain the fundamental principles of quantum computing (superposition, entanglement) and how qubits differ from classical bits.",
    icon: Globe,
    badge: "Physics & Tech",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    borderHover: "hover:border-teal-500/50 hover:shadow-teal-500/5",
  },
  // Placement & Career Preparation
  {
    id: "resume-ats",
    category: "resume",
    title: "ATS Resume Bullet Optimizer",
    desc: "Transform your raw project notes into high-impact Google XYZ formula bullets.",
    prompt:
      "Rewrite my full-stack web project bullet points using Google's XYZ formula ('Accomplished X, as measured by Y, by doing Z') to maximize my ATS score.",
    icon: FileText,
    badge: "ATS Resume",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    borderHover: "hover:border-indigo-500/50 hover:shadow-indigo-500/5",
  },
  {
    id: "dsa-patterns",
    category: "interview",
    title: "High-Frequency DSA Patterns",
    desc: "Two Pointers, Sliding Window, Monotonic Stack & Dynamic Programming.",
    prompt:
      "Give me a high-frequency Two Pointers DSA question frequently asked in Tier-1 campus placement drives, with code and step-by-step logic.",
    icon: FileCode,
    badge: "DSA Coding",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    borderHover: "hover:border-violet-500/50 hover:shadow-violet-500/5",
  },
  {
    id: "hr-star",
    category: "interview",
    title: "STAR Behavioral Interview Prep",
    desc: "Formulate crisp Situation-Task-Action-Result responses for critical HR rounds.",
    prompt:
      "How should I answer 'Tell me about a time you resolved a difficult team conflict or project bug' using the STAR method?",
    icon: Briefcase,
    badge: "HR & STAR",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/5",
  },
  {
    id: "placement-roadmap",
    category: "roadmap",
    title: "6-Month Placement Roadmap",
    desc: "Month-by-month blueprint covering DSA, core CS, projects & campus drives.",
    prompt:
      "Create a structured 6-month placement preparation roadmap for cracking product company campus placement drives.",
    icon: Compass,
    badge: "Strategy Plan",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/5",
  },
];
