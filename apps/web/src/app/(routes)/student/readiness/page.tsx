"use client";

import React from "react";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import {
  useStudentDashboard,
  useStudentReadiness,
} from "@/hooks/use-student";
import {
  toStudentStats,
  toReadinessCardProps,
} from "@/lib/dashboard-adapters";
import { toast } from "sonner";
import { Sparkles, TrendingUp, CheckCircle2, Target } from "lucide-react";

export default function StudentReadiness() {
  const dashboard = useStudentDashboard();
  const readiness = useStudentReadiness();

  const stats = dashboard.data ? toStudentStats(dashboard.data) : null;
  const readinessCard = readiness.data
    ? toReadinessCardProps(readiness.data)
    : null;

  const handleRecalculate = async () => {
    toast.success("Recalculating AI readiness with latest resume...");
    await readiness.refresh();
    await dashboard.refresh();
  };

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
            onClick={handleRecalculate}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Recalculate Score
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {stats ? (
        <KeyStatistics stats={stats} />
      ) : dashboard.error ? (
        <AggregateError
          message={dashboard.error}
          onRetry={dashboard.refresh}
        />
      ) : (
        <AggregateLoading label="Loading your statistics..." />
      )}

      {/* Main Readiness Component */}
      <div className="min-w-0">
        {readinessCard ? (
          <AIReadinessCard
            score={readinessCard.score}
            label={readinessCard.label}
            dimensions={readinessCard.dimensions}
            aiRecommendation={readinessCard.aiRecommendation}
            onStartAction={() =>
              toast.success("Starting recommended practice module!")
            }
          />
        ) : readiness.error ? (
          <AggregateError message={readiness.error} onRetry={readiness.refresh} />
        ) : (
          <AggregateLoading label="Calculating your readiness score..." />
        )}
      </div>

      {/* Action Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Target className="h-4 w-4" />
            <span>Target Tier-1 Cutoff: 85%</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            You are currently at {readinessCard?.score ?? stats?.readinessScore ?? 0}%. Completing 2 more domain projects will push your score above the 85% threshold.
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
