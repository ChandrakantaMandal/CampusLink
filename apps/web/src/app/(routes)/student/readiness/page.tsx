"use client";

import React, { useEffect, useState, useMemo } from "react";

import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";

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

import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Target,
  LogIn,
} from "lucide-react";

import {
  type ReadinessDimension,
} from "@/data/dashboardData";

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
  const [isGuest, setIsGuest] = useState(false);

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

      if (response.status === 401) {
        setIsGuest(true);
        setReadiness(null);
        return;
      }

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

      setIsGuest(false);
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

  const readinessScore = readiness?.overallScore ?? 0;

  const readinessLabel =
    readiness?.readinessLabel ??
    (readinessScore > 0 ? "Placement Track" : "Profile Unscored");

  const aiCoachRecommendation = {
    title: "AI Placement Coach Recommendation",
    highlight:
      readinessScore >= 80
        ? "Tier-1 Placement Ready"
        : readinessScore >= 40
          ? "Placement Track"
          : "Build Profile Foundation",
    message:
      readiness?.explanation ||
      (readinessScore >= 80
        ? "Your profile is highly competitive across technical, academic, and project dimensions. Continue practicing advanced mock interviews."
        : readinessScore >= 40
          ? "Strengthen practical full-stack projects, take standardized mock assessments, and target high-demand skills to reach Tier-1 readiness."
          : "Add your technical skills, link live project repositories, upload your resume, and complete profile details to unlock AI job matching and company eligibility."),
    actionText:
      readinessScore >= 80
        ? "Explore Drives"
        : readinessScore >= 40
          ? "Take Assessment"
          : "Complete Profile",
  };

  const readinessDimensions: ReadinessDimension[] = [
    {
      category: "Technical Skills",
      score: readiness?.breakdown.technical ?? 0,
      fullScore: 100,
      status: getStatus(readiness?.breakdown.technical ?? 0),
    },
    {
      category: "Mock Assessments",
      score: readiness?.breakdown.assessment ?? 0,
      fullScore: 100,
      status: getStatus(readiness?.breakdown.assessment ?? 0),
    },
    {
      category: "Verified Projects",
      score: readiness?.breakdown.projects ?? 0,
      fullScore: 100,
      status: getStatus(readiness?.breakdown.projects ?? 0),
    },
    {
      category: "Academics / CGPA",
      score: readiness?.breakdown.academics ?? 0,
      fullScore: 100,
      status: getStatus(readiness?.breakdown.academics ?? 0),
    },
    {
      category: "ATS Resume",
      score: readiness?.breakdown.resume ?? 0,
      fullScore: 100,
      status: getStatus(readiness?.breakdown.resume ?? 0),
    },
  ];

  const weakestDimension =
    readinessDimensions.reduce(
      (weakest, current) =>
        current.score < weakest.score
          ? current
          : weakest,
    );

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
            Real-time multi-dimensional scoring calculated
            from your verified coursework, project
            credentials, and mock assessments.
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

      {isGuest && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Guest / Preview Mode Active
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                You are viewing the readiness engine in bypass mode. All dimensions reflect original unconfigured baselines (0%). Sign in with your student account to compute your live 5-factor placement index.
              </p>
            </div>
          </div>
          <Link
            href="/login?role=student"
            className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-auto rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {/* Main Readiness Component */}
      <div className="min-w-0">
        <AIReadinessCard
          score={readinessScore}
          label={readinessLabel}
          dimensions={readinessDimensions}
          aiRecommendation={aiCoachRecommendation}
          onStartAction={() =>
            toast.success(
              "Opening profile action roadmap!",
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

        {/* Strongest Dimension */}
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