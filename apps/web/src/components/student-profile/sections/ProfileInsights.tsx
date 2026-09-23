"use client";

import React from "react";
import { Eye, Briefcase, ShieldCheck, Sparkles } from "lucide-react";
import type { StudentProfileData } from "@/data/studentProfile";

import { calculateProfileCompletion } from "@/data/studentProfile";

interface ProfileInsightsProps {
  profile: StudentProfileData;
}

export default function ProfileInsights({ profile }: ProfileInsightsProps) {
  const { percentage } = calculateProfileCompletion(profile);

  const readinessGrade =
    percentage >= 85
      ? "Grade A+"
      : percentage >= 60
      ? "Grade B+"
      : percentage >= 30
      ? "Grade C"
      : "Pending Setup";

  const gradeColor =
    percentage >= 85
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60"
      : percentage >= 60
      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60"
      : percentage >= 30
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60"
      : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";

  const profileViews = profile.isPublic ? (percentage > 70 ? 38 : percentage > 30 ? 12 : 2) : 0;
  const jobMatches = percentage > 60 ? 14 : percentage > 20 ? 6 : 0;

  const interestedCompanies = [
    { name: "Google", role: "Software Engineer", driveDate: "Oct 5" },
    { name: "Infosys", role: "Specialist Programmer", driveDate: "Oct 12" },
    { name: "Microsoft", role: "SWE Intern 2025", driveDate: "Nov 1" },
  ];

  return (
    <div className="space-y-6">
      {/* Recruiter Readiness & Activity Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Placement Readiness</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Recruiter search optimization</p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${gradeColor}`}>
            {readinessGrade}
          </span>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Eye className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Profile Views</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{profileViews}</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {profile.isPublic ? "+24% this wk" : "private"}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Briefcase className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              <span>Job Matches</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{jobMatches}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">drives live</span>
            </div>
          </div>
        </div>

        {/* Companies scouting profile */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Actively Scouting {profile.department ? `${profile.department} Batch` : "Campus Batch"}:
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="space-y-2">
            {interestedCompanies.map((co) => (
              <div
                key={co.name}
                className="flex items-center justify-between rounded-xl bg-slate-50/70 dark:bg-slate-800/40 px-3 py-2 border border-slate-200/50 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-[10px] text-slate-800 dark:text-slate-100">
                    {co.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{co.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{co.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                    {co.driveDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
