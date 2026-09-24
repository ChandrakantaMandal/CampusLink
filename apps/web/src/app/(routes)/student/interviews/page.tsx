"use client";

import React from "react";
import { InterviewScheduleCard } from "@/components/dashboard/student/InterviewScheduleCard";
import { mockDashboardData } from "@/data/dashboardData";
import { Calendar, Video, Clock } from "lucide-react";
import { toast } from "sonner";

export default function StudentInterviews() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Calendar className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interview Schedule & Rounds
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Confirmed interview slots, virtual meeting rooms, and automated schedule conflict detection.
          </p>
        </div>

        <button
          onClick={() => toast.success("Synced with Google Calendar & Outlook")}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-purple-500 transition-colors"
        >
          <Calendar className="h-3.5 w-3.5" />
          Sync to Calendar
        </button>
      </div>

      {/* Main Interviews Component */}
      <div className="min-w-0">
        <InterviewScheduleCard interviews={mockDashboardData.interviews} />
      </div>
    </div>
  );
}