"use client";

import React from "react";
import { Sparkles, TrendingUp, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import type { ReadinessDimension } from "@/data/dashboardData";

interface AIReadinessCardProps {
  score: number;
  label: string;
  dimensions: ReadinessDimension[];
  aiRecommendation: {
    title: string;
    highlight: string;
    message: string;
    actionText: string;
  };
  onStartAction?: () => void;
}

export default function AIReadinessCard({
  score = 78,
  label = "Tier-1 Ready",
  dimensions,
  aiRecommendation,
  onStartAction,
}: AIReadinessCardProps) {
  // SVG Progress Ring calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      id="readiness-card"
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6 overflow-hidden min-w-0"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              AI Placement Readiness Card
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Deterministic evaluation across 5 hiring dimensions
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 shrink-0">
          Level: {label}
        </span>
      </div>

      {/* Main Row: Progress Ring & Dimensions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Circular SVG Progress Ring */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
          <div className="relative flex items-center justify-center">
            <svg className="h-36 w-36 -rotate-90 transform">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-[#6366F1] transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {score}%
              </span>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Overall Index
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Above Batch Average (64%)</span>
            </div>
          </div>
        </div>

        {/* Right: Dimension Bars Breakdown */}
        <div className="md:col-span-8 space-y-3.5">
          {dimensions.map((dim) => (
            <div key={dim.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {dim.category}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${dim.status === "Strong"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      }`}
                  >
                    {dim.status}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {dim.score}/100
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Placement Coach Recommendation Card */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-indigo-50/70 p-4 sm:p-5 dark:border-indigo-900/60 dark:bg-gradient-to-r dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-indigo-950/40 overflow-hidden min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-xs shrink-0">
                AI
              </div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                {aiRecommendation.title}
              </span>
              <span className="rounded-full bg-indigo-200/80 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 shrink-0">
                {aiRecommendation.highlight}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl break-words">
              {aiRecommendation.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onStartAction}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>{aiRecommendation.actionText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
