"use client";

import React from "react";
import { InterviewScheduleCard } from "@/components/dashboard/student/InterviewScheduleCard";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentInterviews } from "@/hooks/use-student";
import { toInterviewSlots } from "@/lib/dashboard-adapters";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

export default function StudentInterviews() {
  const interviews = useStudentInterviews();

  const upcomingItems = interviews.data
    ? toInterviewSlots({ upcoming: interviews.data.upcoming, past: [] })
    : null;
  const pastItems = interviews.data
    ? toInterviewSlots({ upcoming: interviews.data.past, past: [] })
    : null;

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
            Confirmed interview slots, virtual meeting rooms, and automated
            schedule conflict detection.
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
        {upcomingItems ? (
          <div className="space-y-6">
            {upcomingItems.length > 0 ? (
              <InterviewScheduleCard interviews={upcomingItems} />
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  No upcoming interviews
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  New recruiter interview invitations will appear here.
                </p>
              </section>
            )}
            {pastItems && pastItems.length > 0 && (
              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Past interviews
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Your previous interview rounds.
                  </p>
                </div>
                {pastItems.map((interview) => (
                  <article
                    key={interview.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {interview.company} · {interview.role}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {interview.interviewRound}
                        </p>
                      </div>
                      <p className="text-sm font-medium tabular-nums text-slate-600 dark:text-slate-300">
                        {interview.date} · {interview.time}
                      </p>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </div>
        ) : interviews.error ? (
          <AggregateError
            message={interviews.error}
            onRetry={interviews.refresh}
          />
        ) : (
          <AggregateLoading label="Loading your interview schedule..." />
        )}
      </div>
    </div>
  );
}
