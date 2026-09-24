"use client";

import React from "react";
import {
  Bookmark,
  User,
  Code2,
  GraduationCap,
  Award,
  FileText,
  Globe,
  ArrowDownRight,
} from "lucide-react";
import type { StudentProfileData } from "@/data/studentProfile";

interface QuickSectionJumperProps {
  profile: StudentProfileData;
}

export default function QuickSectionJumper({ profile }: QuickSectionJumperProps) {
  const isPersonalComplete = Boolean(
    profile.name && profile.name.trim() &&
    profile.email && profile.email.trim() &&
    profile.department && profile.department.trim() &&
    profile.year && profile.year.trim()
  );
  const hasSomePersonalInfo = Boolean(
    (profile.name && profile.name.trim()) ||
    (profile.email && profile.email.trim()) ||
    (profile.phone && profile.phone.trim()) ||
    (profile.department && profile.department.trim()) ||
    (profile.year && profile.year.trim()) ||
    (profile.cgpa && profile.cgpa.trim()) ||
    (profile.bio && profile.bio.trim())
  );

  const linksCount = [
    profile.github,
    profile.linkedin,
    profile.portfolio,
    profile.leetcode,
    profile.hackerrank,
    profile.otherWebsite,
  ].filter((link) => typeof link === "string" && link.trim().length > 0).length;

  const sections = [
    {
      id: "personal-info-section",
      label: "Personal Details",
      icon: User,
      badge: isPersonalComplete ? "Complete" : hasSomePersonalInfo ? "In Progress" : "Incomplete",
      badgeColor: isPersonalComplete
        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
        : hasSomePersonalInfo
        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80"
        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      accentColor: "group-hover:border-indigo-300 group-hover:bg-indigo-50/40 dark:group-hover:border-indigo-700/60 dark:group-hover:bg-indigo-950/30",
    },
    {
      id: "skills-section",
      label: "Skills & Technical",
      icon: Code2,
      badge: profile.skills.length > 0 ? `${profile.skills.length} skills` : "0 skills",
      badgeColor: profile.skills.length > 0
        ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80"
        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      accentColor: "group-hover:border-purple-300 group-hover:bg-purple-50/40 dark:group-hover:border-purple-700/60 dark:group-hover:bg-purple-950/30",
    },
    {
      id: "education-section",
      label: "Education",
      icon: GraduationCap,
      badge: profile.education.length > 0 ? `${profile.education.length} records` : "0 records",
      badgeColor: profile.education.length > 0
        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80"
        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      accentColor: "group-hover:border-blue-300 group-hover:bg-blue-50/40 dark:group-hover:border-blue-700/60 dark:group-hover:bg-blue-950/30",
    },
    {
      id: "certifications-section",
      label: "Certifications",
      icon: Award,
      badge: profile.certifications.length > 0 ? `${profile.certifications.length} verified` : "0 verified",
      badgeColor: profile.certifications.length > 0
        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80"
        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      accentColor: "group-hover:border-amber-300 group-hover:bg-amber-50/40 dark:group-hover:border-amber-700/60 dark:group-hover:bg-amber-950/30",
    },
    {
      id: "resume-section",
      label: "Resume & CV",
      icon: FileText,
      badge: profile.resume ? "Attached" : "Missing",
      badgeColor: profile.resume
        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80",
      accentColor: "group-hover:border-emerald-300 group-hover:bg-emerald-50/40 dark:group-hover:border-emerald-700/60 dark:group-hover:bg-emerald-950/30",
    },
    {
      id: "portfolio-links-section",
      label: "Portfolio Links",
      icon: Globe,
      badge: linksCount > 0 ? `${linksCount} connected` : "0 connected",
      badgeColor: linksCount > 0
        ? "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80"
        : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      accentColor: "group-hover:border-cyan-300 group-hover:bg-cyan-50/40 dark:group-hover:border-cyan-700/60 dark:group-hover:bg-cyan-950/30",
    },
  ];

  const completedSectionsCount = [
    isPersonalComplete,
    profile.skills.length > 0,
    profile.education.length > 0,
    profile.certifications.length > 0,
    Boolean(profile.resume),
    linksCount > 0,
  ].filter(Boolean).length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Top Title & Indicator */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-xs shadow-indigo-500/20">
            <Bookmark className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Quick Section Jumper
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Jump directly to any profile section with one click
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 px-2.5 py-1 rounded-lg border border-slate-200/60">
          <span className={`h-2 w-2 rounded-full ${completedSectionsCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
          <span>{completedSectionsCount} of 6 Completed</span>
        </div>
      </div>

      {/* Responsive Grid of All 6 Sections (Always 100% visible on screen) */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className={`group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 p-3 text-left transition-all hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 focus:outline-hidden cursor-pointer ${sec.accentColor}`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shadow-2xs">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <ArrowDownRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 transition-colors" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {sec.label}
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${sec.badgeColor}`}
                  >
                    {sec.badge}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
