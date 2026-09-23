"use client";

import React from "react";
import {
  Globe,
  Code2,
  Terminal,
  ExternalLink,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import type { StudentProfileData } from "@/data/studentProfile";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface PortfolioLinksProps {
  profile: StudentProfileData;
  onChange: (field: keyof StudentProfileData, value: string) => void;
  errors?: Record<string, string>;
}

export default function PortfolioLinks({
  profile,
  onChange,
  errors = {},
}: PortfolioLinksProps) {
  const linkFields: Array<{
    key: keyof StudentProfileData;
    label: string;
    icon: React.ElementType;
    placeholder: string;
    helper: string;
  }> = [
    {
      key: "github",
      label: "GitHub Profile",
      icon: GithubIcon,
      placeholder: "https://github.com/username",
      helper: "Showcases your public repositories and open-source contributions.",
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      icon: LinkedinIcon,
      placeholder: "https://linkedin.com/in/username",
      helper: "Used for professional networking and recruiter background checks.",
    },
    {
      key: "portfolio",
      label: "Personal Portfolio Website",
      icon: Globe,
      placeholder: "https://yourportfolio.dev",
      helper: "Link to your personal website showcasing featured engineering projects.",
    },
    {
      key: "leetcode",
      label: "LeetCode Profile",
      icon: Code2,
      placeholder: "https://leetcode.com/username",
      helper: "Demonstrates data structures, algorithmic problem solving & contest rating.",
    },
    {
      key: "hackerrank",
      label: "HackerRank Profile",
      icon: Terminal,
      placeholder: "https://hackerrank.com/username",
      helper: "Skill certifications and domain badges for coding assessments.",
    },
    {
      key: "otherWebsite",
      label: "Other Professional Link / Blog",
      icon: LinkIcon,
      placeholder: "https://medium.com/@username or Dev.to",
      helper: "Technical blogs, research papers, or personal design showcases.",
    },
  ];

  return (
    <div id="portfolio-links-section" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm scroll-mt-24 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 font-bold border border-cyan-100 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-900/50">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio & Coding Profiles</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Connect your developer handles to automatically showcase proof of work to employers.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {linkFields.map((field) => {
          const Icon = field.icon;
          const value = (profile[field.key] as string) || "";
          const error = errors[field.key];
          const isValidUrl =
            value && (value.startsWith("http://") || value.startsWith("https://"));

          return (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`link-${field.key}`}
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {field.label}
                </label>
                {isValidUrl && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="Test open link in new tab"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>
                <input
                  id={`link-${field.key}`}
                  type="url"
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm text-slate-900 transition-colors focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                    error
                      ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10"
                      : "border-slate-200 bg-white focus:border-[#6366F1] focus:ring-3 focus:ring-indigo-500/15"
                  }`}
                />
              </div>

              {error ? (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{field.helper}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
