"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  TrendingUp,
  Briefcase,
  BarChart3,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
} from "lucide-react";

export default function FeaturesBento() {
  const features = [
    {
      icon: ShieldCheck,
      badge: "Zero-Hallucination",
      title: "Deterministic Eligibility Engine",
      description:
        "Unlike generic LLMs that hallucinate, CAMPUSLINK evaluates placement eligibility with strict deterministic rules for CGPA cutoffs, branch, graduation year, and active backlogs.",
      gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
      iconColor: "text-blue-600 dark:text-blue-400",
      stats: "100% Rule Compliance",
      highlights: ["Hard cutoff enforcement", "Branch & Degree mapping", "Backlog verification"],
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
      highlights: ["Skill normalization", "Tailored learning roadmaps", "ATS keyword scoring"],
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
      highlights: ["Real-time progress bars", "Tier prediction", "Peer benchmark comparison"],
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
      highlights: ["Automated interview slots", "Batch offer rollouts", "1-click student applications"],
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
      highlights: ["Branch-wise CTC metrics", "Department placement ratios", "Accreditation data export"],
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
      highlights: ["Better-Auth sessions", "Redis rate limiting", "Installable PWA app"],
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Placement Intelligence Architecture</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Everything Required For Flawless Campus Placements
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Engineered with a high-performance TypeScript monorepo, Next.js, Express, PostgreSQL, Prisma, and dedicated AI intelligence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-indigo-800"
              >
                {/* Background Tint */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative space-y-4">
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 shadow-xs">
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-1.5 pt-2">
                    {feature.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Metric */}
                <div className="relative mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>{feature.stats}</span>
                  <span className="text-slate-400 dark:text-slate-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
