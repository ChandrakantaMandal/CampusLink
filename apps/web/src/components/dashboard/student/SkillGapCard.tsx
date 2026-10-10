"use client";

import React from "react";
import { Layers, CheckCircle2, AlertTriangle, XCircle, ArrowRight, BookOpen } from "lucide-react";
import type { SkillGapItem } from "@/data/dashboardData";

interface SkillGapCardProps {
  skills: SkillGapItem[];
  onPracticeSkill?: (skillName: string) => void;
  variant?: "default" | "compact";
}

export default function SkillGapCard({
  skills,
  onPracticeSkill,
  variant = "default",
}: SkillGapCardProps) {
  const strong = skills.filter((s) => s.level === "Strong");
  const improve = skills.filter((s) => s.level === "Improve");
  const missing = skills.filter((s) => s.level === "Missing");

  return (
    <div
      id="skills-gap-card"
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6 overflow-hidden min-w-0"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              Skill-Gap Analysis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Targeted skill roadmap compared with Tier-1 engineering recruiter expectations
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:block shrink-0">
          8 Evaluated Competencies
        </span>
      </div>

      {/* Categories Layout: Compact (vertical stack) or Default (3 Columns Grid) */}
      <div
        className={
          variant === "compact"
            ? "flex flex-col gap-3.5 min-w-0"
            : "grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 min-w-0"
        }
      >
        {/* Strong Skills */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-3 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 min-w-0">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate">Strong Skills</span>
            </div>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 shrink-0 whitespace-nowrap">
              {strong.length} verified
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
            {strong.map((s) => (
              <span
                key={s.name}
                className="inline-flex max-w-full items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-emerald-900 shadow-2xs dark:bg-slate-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80"
              >
                <span className="truncate">{s.name}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
              </span>
            ))}
          </div>
        </div>

        {/* Skills to Improve */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/60 dark:bg-amber-950/20 space-y-3 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 min-w-0">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="truncate">Skills to Improve</span>
            </div>
            <span className="rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 shrink-0 whitespace-nowrap">
              {improve.length} action items
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
            {improve.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => onPracticeSkill?.(s.name)}
                className="inline-flex max-w-full items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-2xs hover:bg-amber-100 dark:bg-slate-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 transition-colors cursor-pointer"
              >
                <span className="truncate">{s.name}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold shrink-0">⚠</span>
              </button>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-900/60 dark:bg-rose-950/20 space-y-3 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 min-w-0">
              <XCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="truncate">Missing Skills</span>
            </div>
            <span className="rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5 shrink-0 whitespace-nowrap">
              {missing.length} high priority
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
            {missing.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => onPracticeSkill?.(s.name)}
                className="inline-flex max-w-full items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-rose-900 shadow-2xs hover:bg-rose-100 dark:bg-slate-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 transition-colors cursor-pointer"
              >
                <span className="truncate">{s.name}</span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold shrink-0">✕</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Preparation Actions Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800 min-w-0">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 min-w-0">
          <BookOpen className="h-4 w-4 shrink-0 text-indigo-500" />
          <span className="line-clamp-1">Recommended next modules: System Design Fundamentals &amp; SQL Query Optimization</span>
        </div>

        <button
          type="button"
          onClick={() => onPracticeSkill?.("System Design")}
          className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0"
        >
          <span>Open Skill Practice Hub</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
