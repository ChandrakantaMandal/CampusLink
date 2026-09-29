"use client";

import React from "react";
import { ApplicationsTracker } from "@/components/dashboard/student/ApplicationsTracker";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentApplications } from "@/hooks/use-student-aggregates";
import { toApplicationItems } from "@/lib/dashboard-adapters";
import { UserCheck } from "lucide-react";

export default function StudentApplications() {
  const applications = useStudentApplications();

  const items = applications.data ? toApplicationItems(applications.data) : null;
  const total = applications.data?.stats.total ?? items?.length ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Application Tracker
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time status updates across all stages of your campus recruitment applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {total !== null ? `${total} Total Submission${total === 1 ? "" : "s"}` : "—"}
          </span>
        </div>
      </div>

      {/* Main Applications Tracker Component */}
      <div className="min-w-0">
        {items ? (
          <ApplicationsTracker applications={items} />
        ) : applications.error ? (
          <AggregateError
            message={applications.error}
            onRetry={applications.refresh}
          />
        ) : (
          <AggregateLoading label="Loading your applications..." />
        )}
      </div>
    </div>
  );
}
