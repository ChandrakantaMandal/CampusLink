"use client";

import React, { useEffect, useState } from "react";
import RecommendedJobsCard from "@/components/dashboard/student/RecommendedJobsCard";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentJobs } from "@/hooks/use-student";
import { toRecommendedJobs } from "@/lib/dashboard-adapters";
import { Briefcase, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  ctc: string | null;
  company: {
    name: string;
  } | null;
  skills: {
    required: boolean;
    skill: {
      name: string;
    };
  }[];
  hasApplied?: boolean;
};

type MatchResult = {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string;
};

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export default function StudentJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<Record<string, MatchResult>>({});
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchAppliedJobIds(): Promise<Set<string>> {
      try {
        const response = await fetch(`${SERVER_URL}/api/applications/my`, {
          credentials: "include",
        });

        if (!response.ok) {
          return new Set();
        }

        const result = await response.json();
        const applications: { jobId: string }[] = result.data || [];

        return new Set(applications.map((application) => application.jobId));
      } catch {
        return new Set();
      }
    }

    async function fetchJobsAndMatches() {
      try {
        // 1. Get jobs from server
        const [response, appliedIds] = await Promise.all([
          fetch(`${SERVER_URL}/api/jobs`, {
            credentials: "include",
          }),
          fetchAppliedJobIds(),
        ]);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch jobs");
        }

        setAppliedJobIds(appliedIds);

        // Only show first 20 jobs for demo
        const fetchedJobs: Job[] = (result.data || []).slice(0, 20);

        // 2. Show jobs immediately
        setJobs(fetchedJobs);
        setLoading(false);

        // 3. Match jobs in small batches
        const batchSize = 3;

        for (let i = 0; i < fetchedJobs.length; i += batchSize) {
          const batch = fetchedJobs.slice(i, i + batchSize);

          const results = await Promise.all(
            batch.map(async (job) => {
              try {
                const matchResponse = await fetch(
                  `${SERVER_URL}/api/jobs/${job.id}/match`,
                  {
                    method: "POST",
                    credentials: "include",
                  },
                );

                const matchData = await matchResponse.json();

                if (!matchResponse.ok) {
                  console.error(`AI match failed for ${job.title}:`, matchData);

                  return null;
                }

                return {
                  jobId: job.id,
                  result: matchData.data as MatchResult,
                };
              } catch (error) {
                console.error(
                  `AI match request failed for ${job.title}:`,
                  error,
                );

                return null;
              }
            }),
          );

          // 4. Update scores as each batch finishes
          setMatches((previous) => {
            const updated = {
              ...previous,
            };

            for (const entry of results) {
              if (entry) {
                updated[entry.jobId] = entry.result;
              }
            }

            return updated;
          });
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);

        toast.error("Failed to load jobs");

        setLoading(false);
      }
    }

    fetchJobsAndMatches();
  }, []);

  /*
   * Build recommended jobs.
   *
   * Jobs with higher AI match scores
   * appear first.
   *
   * Jobs still being analyzed stay
   * at the bottom.
   */
  const recommendedJobs = [...jobs]
    .map((job) => {
      const match = matches[job.id];

      return {
        id: job.id,
        title: job.title,

        company: job.company?.name || "Unknown Company",

        location: job.location || "Not specified",

        ctc: job.ctc || "Not specified",

        // AI match score
        matchPercentage: match ? Math.round(match.match_score) : null,

        // Required skills
        skills: job.skills
          .filter((item) => item.required)
          .map((item) => item.skill.name),

        eligibility: {
          isEligible: true,
          criteria: "Eligibility will be evaluated by CampusLink AI",
        },

        // AI explanation
        whyMatch:
          match?.explanation ||
          "AI is analyzing your profile against this job.",

        driveDate: "Applications Open",

        // Application status
        hasApplied: appliedJobIds.has(job.id) || (job.hasApplied ?? false),
      };
    })
    .sort((a, b) => {
      // Jobs still being analyzed go to bottom
      if (a.matchPercentage === null) {
        return 1;
      }

      if (b.matchPercentage === null) {
        return -1;
      }

      // Highest match first
      return b.matchPercentage - a.matchPercentage;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Briefcase className="h-5 w-5" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recommended Job Openings
            </h1>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Roles automatically curated for you based on verified skills,
            academic eligibility, and career interests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Jobs refreshed")}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Refresh Jobs
        </button>
      </div>

      {/* Jobs */}
      <div className="min-w-0">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            Loading jobs...
          </div>
        ) : (
          <>
            <RecommendedJobsCard
              jobs={recommendedJobs}
              columns={3}
              onApplyJob={(jobId) => {
                window.location.href = `/student/skills?jobId=${jobId}`;
              }}
            />

            {/* Background AI analysis status */}
            {Object.keys(matches).length < jobs.length && (
              <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                ✨ AI is analyzing job matches in the background...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
