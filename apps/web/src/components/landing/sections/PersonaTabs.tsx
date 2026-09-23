"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Users,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { Button } from "@HireBridge/ui/components/button";

export default function PersonaTabs() {
  const [activeTab, setActiveTab] = useState<"students" | "recruiters" | "tpo">("students");

  const personas = {
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
      ctaLink: "/profile",
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
  } as const;

  const current = personas[activeTab];
  const IconComponent = current.icon;

  return (
    <section id="roles" className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Multi-Sided Placement Ecosystem</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Built for Every Stakeholder in Campus Hiring
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Whether you are a student striving for your dream offer, a recruiter seeking top talent, or a university placement cell managing hundreds of companies.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-2xl border border-slate-200 bg-white/80 p-1.5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
            {(["students", "recruiters", "tpo"] as const).map((tab) => {
              const ItemIcon = personas[tab].icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  <ItemIcon className="h-4 w-4" />
                  <span>{personas[tab].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Card */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 transition-all">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Description Column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{current.tagline}</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 sm:text-3xl dark:text-white leading-tight">
                {current.headline}
              </h3>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {current.description}
              </p>

              {/* Benefits Checklist */}
              <div className="space-y-3 pt-2">
                {current.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Persona CTA */}
              <div className="pt-4">
                <Link href={current.ctaLink}>
                  <Button className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 font-bold text-white shadow-lg shadow-indigo-600/25 hover:scale-105">
                    <span>{current.ctaText}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-lg dark:border-slate-800 dark:from-slate-800/60 dark:to-slate-900">
                {/* Header with pill */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {current.previewBadge}
                    </span>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Live Stream
                  </span>
                </div>

                {/* Mock Card Items */}
                <div className="mt-6 space-y-3">
                  {current.mockItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-xl p-3.5 text-sm font-semibold transition-transform hover:scale-[1.01] ${
                        item.highlight
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "bg-white text-slate-800 border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <span>{item.title}</span>
                      <span className={item.highlight ? "text-indigo-100 font-extrabold" : "text-indigo-600 dark:text-indigo-400"}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Persona Key Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                  {current.stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {stat.value}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
