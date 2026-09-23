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
  Bell
} from "lucide-react";
import type { InterviewSlot } from "@/data/dashboardData";
import { toast } from "sonner";

interface InterviewScheduleCardProps {
  interviews: InterviewSlot[];
}

export function InterviewScheduleCard({ interviews }: InterviewScheduleCardProps) {
  const handleJoin = (slot: InterviewSlot) => {
    toast.success(`Opening meeting room for ${slot.company}`, {
      description: `Joining as candidate. Passcode copied to clipboard.`,
    });
  };

  const handleReminder = (slot: InterviewSlot) => {
    toast.info(`Reminder set for ${slot.company} interview`, {
      description: `Notification scheduled for 15 minutes before ${slot.time}`,
    });
  };

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

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>0 Conflicts</span>
          </div>
        </div>

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

                <button
                  onClick={() => handleJoin(slot)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
                >
                  {slot.type === "Virtual" ? "Join Meeting" : "Directions"}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sync with your calendar:{" "}
          <button
            onClick={() => toast.success("Google Calendar & Outlook sync activated!")}
            className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            Connect Calendar
          </button>
        </p>
      </div>
    </div>
  );
}
