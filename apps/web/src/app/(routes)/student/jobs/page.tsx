"use client";

import React from "react";
import RecommendedJobsCard from "@/components/dashboard/student/RecommendedJobsCard";
import { mockDashboardData } from "@/data/dashboardData";
import { Briefcase, Sparkles, Filter } from "lucide-react";
import { toast } from "sonner";

export default function StudentJobs() {
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
            Roles automatically curated for you based on verified skills, academic eligibility, and career interests.
          </p>
        </div>

        <button
          onClick={() => toast.success("Refreshed AI job matches")}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Refresh Recommendations
        </button>
      </div>

      {/* Main Jobs Component */}
      <div className="min-w-0">
        <RecommendedJobsCard jobs={mockDashboardData.recommendedJobs} columns={3} />
      </div>
    </div>
  );
}
