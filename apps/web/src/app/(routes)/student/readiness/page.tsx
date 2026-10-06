"use client";

import React, { useEffect, useState } from "react";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import { mockDashboardData } from "@/data/dashboardData";
import { toast } from "sonner";
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Target,
} from "lucide-react";
import type { ReadinessDimension } from "@/data/dashboardData";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:3000";

type ReadinessResponse = {
  overallScore: number;
  readinessLabel: string;
  breakdown: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  };
  weights: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  };
  explanation: string;
};

function getStatus(
  score: number,
): ReadinessDimension["status"] {
  if (score >= 80) {
    return "Strong";
  }

  if (score >= 60) {
    return "Good";
  }

  return "Needs Attention";
}

export default function StudentReadiness() {
  const [readiness, setReadiness] =
    useState<ReadinessResponse | null>(null);

  const [loading, setLoading] = useState(true);

  async function fetchReadiness() {
    try {
      setLoading(true);

      const response = await fetch(
        `${SERVER_URL}/api/students/readiness`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Readiness API failed: ${response.status}`,
        );
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(
          "Invalid readiness response",
        );
      }

      setReadiness(result.data);
    } catch (error) {
      console.error(
        "Failed to fetch readiness:",
        error,
      );

      toast.error(
        "Unable to load live readiness score.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReadiness();
  }, []);

  const readinessScore =
    readiness?.overallScore ??
    mockDashboardData.stats.readinessScore;

  const readinessLabel =
    readiness?.readinessLabel ??
    mockDashboardData.stats.readinessLabel;

  const dashboardStats = {
    ...mockDashboardData.stats,
    readinessScore,
    readinessLabel,
  };

  const readinessDimensions: ReadinessDimension[] =
    readiness
      ? [
          {
            category: "Technical Skills",
            score: readiness.breakdown.technical,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.technical,
            ),
          },
          {
            category: "Mock Assessments",
            score: readiness.breakdown.assessment,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.assessment,
            ),
          },
          {
            category: "Verified Projects",
            score: readiness.breakdown.projects,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.projects,
            ),
          },
          {
            category: "Academics / CGPA",
            score: readiness.breakdown.academics,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.academics,
            ),
          },
          {
            category: "ATS Resume",
            score: readiness.breakdown.resume,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.resume,
            ),
          },
        ]
      : mockDashboardData.readinessDimensions;

  const weakestDimension = readiness
    ? readinessDimensions.reduce((weakest, current) =>
        current.score < weakest.score
          ? current
          : weakest,
      )
    : null;

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
            onClick={fetchReadiness}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3.5 w-3.5" />

            {loading
              ? "Calculating..."
              : "Recalculate Score"}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <KeyStatistics stats={dashboardStats} />

      {/* Main Readiness Component */}
      <div className="min-w-0">
        <AIReadinessCard
          score={readinessScore}
          label={readinessLabel}
          dimensions={readinessDimensions}
          aiRecommendation={
            mockDashboardData.aiCoachRecommendation
          }
          onStartAction={() =>
            toast.success(
              "Starting System Architecture practice module!",
            )
          }
        />
      </div>

      {/* Dynamic Action Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Target */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Target className="h-4 w-4" />
            <span>
              Target Tier-1 Cutoff: 85%
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            {readinessScore >= 85
              ? "You have crossed the target Tier-1 readiness threshold."
              : `You are currently at ${readinessScore}%. You need ${
                  85 - readinessScore
                } more points to reach the 85% target.`}
          </p>
        </div>

        {/* Strongest / Coding */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              Strongest Dimension
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            {readiness
              ? (() => {
                  const strongest =
                    readinessDimensions.reduce(
                      (best, current) =>
                        current.score > best.score
                          ? current
                          : best,
                    );

                  return `${strongest.category} is currently your strongest area at ${strongest.score}/100.`;
                })()
              : "Loading your strongest readiness dimension..."}
          </p>
        </div>

        {/* Focus Area */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />

            <span>
              Focus Area
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            {weakestDimension
              ? `${weakestDimension.category} is currently your weakest area at ${weakestDimension.score}/100. Improving this dimension can increase your overall readiness.`
              : "Analyzing your readiness dimensions..."}
          </p>
        </div>
      </div>
    </div>
  );
}