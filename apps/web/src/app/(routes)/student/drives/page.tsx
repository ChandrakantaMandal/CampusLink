"use client";

import React from "react";
import { UpcomingDrivesCard } from "@/components/dashboard/student/UpcomingDrivesCard";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentDrives } from "@/hooks/use-student";
import { toUpcomingDrives } from "@/lib/dashboard-adapters";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

export default function StudentDrives() {
  const drives = useStudentDrives();

  const items = drives.data ? toUpcomingDrives(drives.data) : null;
  const activeCount = drives.data
    ? drives.data.registered.length + drives.data.available.length
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Building2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Campus Placement Drives
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official on-campus and virtual hiring drives organized by the
            Training & Placement Cell.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            {activeCount !== null
              ? `${activeCount} Active Drive${activeCount === 1 ? "" : "s"}`
              : "—"}
          </span>
        </div>
      </div>

      {/* Main Drives Component */}
      <div className="min-w-0">
        {items ? (
          <UpcomingDrivesCard
            drives={items}
            layout="grid"
            onViewAll={() => toast.info("Showing all drives")}
            onRegistered={drives.refresh}
          />
        ) : drives.error ? (
          <AggregateError message={drives.error} onRetry={drives.refresh} />
        ) : (
          <AggregateLoading label="Loading placement drives..." />
        )}
      </div>
    </div>
  );
}
