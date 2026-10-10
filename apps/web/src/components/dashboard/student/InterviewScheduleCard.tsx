"use client";

import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  ExternalLink,
  Bell,
} from "lucide-react";
import type { InterviewSlot } from "@/data/dashboardData";
import { toast } from "sonner";

interface InterviewScheduleCardProps {
  interviews: InterviewSlot[];
}

export function InterviewScheduleCard({
  interviews,
}: InterviewScheduleCardProps) {
  const handleReminder = (slot: InterviewSlot) => {
    toast.info(`Reminder set for ${slot.company} interview`, {
      description: `Notification scheduled for 15 minutes before ${slot.time}`,
    });
  };

  const conflictCount = interviews.filter((slot) => slot.hasConflict).length;

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Interview Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upcoming rounds with conflict check
              </p>
            </div>
          </div>

          {conflictCount > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                {conflictCount} Conflict{conflictCount > 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>0 Conflicts</span>
            </div>
          )}
        </div>

        {interviews.length === 0 ? (
          <div className="py-10 px-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 my-2 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No upcoming interviews scheduled
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              When recruiters shortlist your applications and schedule interview
              rounds, confirmed slots, venue details, and meeting links will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 mt-2">
            {interviews.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-400/60 dark:hover:border-purple-500/40 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {slot.company}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                        {slot.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {slot.interviewRound}
                    </p>
                  </div>

                  <button
                    onClick={() => handleReminder(slot)}
                    className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    title="Set Reminder"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 my-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {slot.date} • {slot.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {slot.type === "Virtual" ? (
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span>{slot.venue}</span>
                  </div>
                  {slot.interviewerName && (
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Panel: {slot.interviewerName}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>No schedule overlap</span>
                  </div>

                  {slot.type === "Virtual" && slot.meetingLink ? (
                    <a
                      href={slot.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                    >
                      Join Meeting
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  ) : slot.type === "Virtual" ? (
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      Meeting link unavailable
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Check venue
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sync with your calendar:{" "}
          <button
            onClick={() =>
              toast.success("Google Calendar & Outlook sync activated!")
            }
            className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            Connect Calendar
          </button>
        </p>
      </div>
    </div>
  );
}
