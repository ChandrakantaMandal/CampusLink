"use client";

import React from "react";
import { UpcomingDrivesCard } from "@/components/dashboard/student/UpcomingDrivesCard";
import { mockDashboardData } from "@/data/dashboardData";
import { Building2, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export default function StudentDrives() {
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
            Official on-campus and virtual hiring drives organized by the Training & Placement Cell.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            3 Active Drives
          </span>
        </div>
      </div>

      {/* Main Drives Component */}
      <div className="min-w-0">
        <UpcomingDrivesCard
          drives={mockDashboardData.upcomingDrives}
          layout="grid"
          onViewAll={() => toast.info("Showing all drives")}
        />
      </div>
    </div>
  );
}