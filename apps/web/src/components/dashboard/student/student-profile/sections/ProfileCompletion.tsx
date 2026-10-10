"use client";

import React from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { calculateProfileCompletion } from "@/data/studentProfile";
import type { StudentProfileData } from "@/data/studentProfile";

interface ProfileCompletionProps {
  profile: StudentProfileData;
  onJumpToSection?: (sectionId: string) => void;
}

export default function ProfileCompletion({
  profile,
}: ProfileCompletionProps) {
  const { percentage, completedCount, totalCount, missingSuggestions } =
    calculateProfileCompletion(profile);

  const isComplete = percentage === 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-36 w-36 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 blur-2xl pointer-events-none opacity-60 dark:from-indigo-950/40 dark:to-purple-950/40" />

      <div className="relative z-10 space-y-4">
        {/* Header with Title and Percentage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-indigo-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Profile Completion
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {completedCount} of {totalCount} sections completed
              </p>
            </div>
          </div>

          {/* Percentage badge */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
              {percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Complete</span>
          </div>
        </div>

        {/* Horizontal Gradient Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 ring-1 ring-slate-200/60 dark:ring-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A855F7] transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${Math.max(5, percentage)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Placement Ready (100%)</span>
          </div>
        </div>

        {/* Suggestions / Status */}
        {isComplete ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold">All Star Profile! </span>
                Your profile is 100% complete and will be featured prominently to visiting placement recruiters.
              </div>
            </div>

            <div className="rounded-xl bg-slate-50/80 dark:bg-slate-800/50 p-3.5 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Placement Verification Status:
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Contact &amp; Personal Info</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Academic CGPA ({profile.cgpa}/10)</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded">Logged</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Technical Skills</span>
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 px-1.5 py-0.5 rounded">{profile.skills.length} Skills</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>PDF Resume Document</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded">Active</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended actions to reach 100%:</span>
            </div>

            <ul className="space-y-2">
              {missingSuggestions.slice(0, 3).map((suggestion, idx) => (
                <li
                  key={idx}
                  className="flex items-start justify-between gap-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 p-2.5 border border-slate-200/60 dark:border-slate-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {suggestion}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
