"use client";

import React from "react";
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MapPin,
  DollarSign,
  Calendar,
  Info,
} from "lucide-react";
import type { RecommendedJob } from "@/data/dashboardData";

interface RecommendedJobsCardProps {
  jobs: RecommendedJob[];
  onApplyJob?: (jobId: string, matchPercentage: number | null) => void;
  columns?: 1 | 2 | 3;
}

export default function RecommendedJobsCard({
  jobs,
  onApplyJob,
  columns = 3,
}: RecommendedJobsCardProps) {
  const handleApply = (job: RecommendedJob) => {
    if (job.hasApplied) return;

    onApplyJob?.(job.id, job.matchPercentage);
  };

  const gridClass =
    columns === 1
      ? "grid grid-cols-1 gap-5 min-w-0"
      : columns === 2
        ? "grid grid-cols-1 xl:grid-cols-2 gap-5 min-w-0"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-w-0";

  return (
    <div
      id="recommended-jobs-section"
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6 overflow-hidden min-w-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Briefcase className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              AI-Recommended Opportunities
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Matched against your verified coursework, project stack, and
              placement criteria
            </p>
          </div>
        </div>

        <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold px-3 py-1">
          {jobs.length} Matches Found
        </span>
      </div>

      {/* Empty State */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-12 text-center">
          <Briefcase className="h-10 w-10 text-slate-400" />

          <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
            No recommended jobs found
          </h3>

          <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
            We&apos;ll show personalized opportunities here when suitable jobs
            are available.
          </p>
        </div>
      ) : (
        /* Jobs Grid */
        <div className={gridClass}>
          {jobs.map((job) => {
            const isApplied = job.hasApplied ?? false;

            return (
              <div
                key={job.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-xs overflow-hidden min-w-0"
              >
                <div className="space-y-3.5 min-w-0">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-2.5 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight break-words">
                        {job.title}
                      </h3>

                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                        {job.company}
                      </div>
                    </div>

                    {/* AI Match Badge */}
                    {job.matchPercentage !== null && (
                      <div className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-2.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0 whitespace-nowrap">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />

                        <span>{job.matchPercentage}% Match</span>
                      </div>
                    )}
                  </div>

                  {/* Compensation & Location */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 min-w-0">
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 shrink-0">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600 shrink-0" />

                      <span>{job.ctc}</span>
                    </div>

                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />

                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-white dark:bg-slate-700/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 truncate max-w-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Eligibility */}
                  <div
                    className={`flex items-start gap-1.5 text-xs p-2.5 rounded-xl border min-w-0 overflow-hidden ${
                      job.eligibility?.isEligible
                        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/60"
                        : "text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/60"
                    }`}
                  >
                    {job.eligibility?.isEligible ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    ) : (
                      <span className="mt-0.5 h-4 w-4 shrink-0 text-center font-bold">
                        !
                      </span>
                    )}

                    <span className="text-[11px] font-semibold leading-snug break-words">
                      {job.eligibility?.criteria}
                    </span>
                  </div>

                  {/* Why Match */}
                  {job.whyMatch && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 leading-relaxed min-w-0 overflow-hidden break-words">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                        Why this match:
                      </span>

                      <p className="break-words">{job.whyMatch}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 min-w-0">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />

                    <span>Drive: {job.driveDate}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleApply(job)}
                    disabled={isApplied}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                      isApplied
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-md shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />

                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Now</span>

                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
