"use client";

import React from "react";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import { mockDashboardData } from "@/data/dashboardData";
import { toast } from "sonner";
import { Sparkles, TrendingUp, CheckCircle2, Target, ArrowRight } from "lucide-react";

export default function StudentReadiness() {
  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Placement Readiness Score
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-dimensional scoring calculated from your verified coursework, project credentials, and mock assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success("Recalculating AI readiness with latest resume...")}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Recalculate Score
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <KeyStatistics stats={mockDashboardData.stats} />

      {/* Main Readiness Component */}
      <div className="min-w-0">
        <AIReadinessCard
          score={mockDashboardData.stats.readinessScore}
          label={mockDashboardData.stats.readinessLabel}
          dimensions={mockDashboardData.readinessDimensions}
          aiRecommendation={mockDashboardData.aiCoachRecommendation}
          onStartAction={() =>
            toast.success("Starting System Architecture practice module!")
          }
        />
      </div>

      {/* Action Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Target className="h-4 w-4" />
            <span>Target Tier-1 Cutoff: 85%</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            You are currently at 78%. Completing 2 more domain projects will push your score above the 85% threshold.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Coding Proficiency: Strong</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Data structures and algorithmic problem solving are in the top 15% percentile of your batch.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>System Design: Focus Area</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Review distributed caching, database indexing, and microservice communication to maximize interview performance.
          </p>
        </div>
      </div>
    </div>
  );
}
