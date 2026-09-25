"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building,
  Plus,
  ArrowRight,
  X,
  Search,
  Check,
} from "lucide-react";
import { mockInterviews, type InterviewScheduleItem } from "../mock-admin-data";
import { toast } from "sonner";

export default function InterviewScheduleView() {
  const [interviews, setInterviews] = useState<InterviewScheduleItem[]>(mockInterviews);
  const [selectedDate, setSelectedDate] = useState("2026-09-28");
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);

  // Conflicting items
  const conflictingInterviews = interviews.filter((i) => i.hasConflict);

  const handleResolveConflict = (interviewId: string, newTime: string) => {
    setInterviews((prev) =>
      prev.map((i) => {
        if (i.id === interviewId) {
          return {
            ...i,
            startTime: newTime,
            endTime: "03:00 PM",
            hasConflict: false,
            conflictDetails: undefined,
            status: "Rescheduled",
          };
        }
        // Also clear conflict on the companion interview if no overlap remains
        if (i.studentName === "Himanshu Rout" && i.id !== interviewId) {
          return {
            ...i,
            hasConflict: false,
            conflictDetails: undefined,
          };
        }
        return i;
      })
    );
    setConflictModalOpen(false);
    toast.success("Schedule Conflict Resolved! TCS Interview moved to 02:00 PM – 03:00 PM. Notification sent to candidate.");
  };

  const calendarDays = [
    { day: "Mon", date: "21", full: "2026-09-21" },
    { day: "Tue", date: "22", full: "2026-09-22" },
    { day: "Wed", date: "23", full: "2026-09-23" },
    { day: "Thu", date: "24", full: "2026-09-24" },
    { day: "Fri", date: "25", full: "2026-09-25" },
    { day: "Sat", date: "26", full: "2026-09-26" },
    { day: "Sun", date: "27", full: "2026-09-27" },
    { day: "Mon", date: "28", full: "2026-09-28", hasConflict: conflictingInterviews.length > 0 },
    { day: "Tue", date: "29", full: "2026-09-29" },
    { day: "Wed", date: "30", full: "2026-09-30" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Interview Schedule &amp; Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated calendar orchestration with instant schedule conflict collision detection.
          </p>
        </div>

        {conflictingInterviews.length > 0 && (
          <button
            type="button"
            onClick={() => setConflictModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 text-xs transition-all shadow-md shadow-amber-500/25 animate-pulse shrink-0 self-start sm:self-auto"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>⚠ Resolve Conflict (1 Found)</span>
          </button>
        )}
      </div>

      {/* Prominent Conflict Warning Banner (if unresolved) */}
      {conflictingInterviews.length > 0 && (
        <div className="rounded-3xl border-2 border-amber-300 dark:border-amber-500/50 bg-amber-50/80 dark:bg-amber-950/30 p-5 shadow-sm space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-900 dark:text-amber-200">
                  ⚠ Schedule Conflict Detected: Student Slot Collision
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Candidate <strong>Himanshu Rout (22CSE042)</strong> has overlapping interviews scheduled simultaneously on Sep 28.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConflictModalOpen(true)}
              className="cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 text-xs transition-all shadow-xs"
            >
              Resolve Conflict
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-xs">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Google Technical Interview</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">10:00 AM – 11:00 AM &bull; Computer Lab 2</p>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-xs">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">TCS Digital Interview</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">10:30 AM – 11:30 AM &bull; Auditorium Hall A</p>
            </div>
          </div>
        </div>
      )}

      {/* September 2026 Interactive Date Strip */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            September 2026 Placement Schedule
          </h2>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Selected: {selectedDate}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {calendarDays.map((d) => (
            <button
              key={d.full}
              type="button"
              onClick={() => setSelectedDate(d.full)}
              className={`cursor-pointer rounded-2xl p-3 text-center transition-all border ${
                selectedDate === d.full
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/25"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span className="text-[10px] font-bold uppercase block opacity-80">{d.day}</span>
              <span className="text-base font-black block mt-0.5">{d.date}</span>
              {d.hasConflict && (
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-400 animate-ping" title="Conflict" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Interviews List for Date */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            Interviews Roster for {selectedDate}
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            {interviews.filter((i) => i.date === selectedDate).length} Interviews Scheduled
          </span>
        </div>

        <div className="space-y-3">
          {interviews
            .filter((i) => i.date === selectedDate)
            .map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  item.hasConflict
                    ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20"
                    : "border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.company} &bull; {item.round}
                    </span>
                    {item.hasConflict ? (
                      <span className="rounded-full bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase">
                        Collision
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold">
                        {item.status}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Candidate: <strong className="text-slate-900 dark:text-white">{item.studentName}</strong> ({item.rollNo}) &bull; Panel: {item.panel}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      {item.startTime} – {item.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {item.venue}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Interviewer: {item.interviewer}
                    </span>
                  </div>

                  {item.conflictDetails && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-bold pt-1">
                      ⚠ {item.conflictDetails}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {item.hasConflict ? (
                    <button
                      type="button"
                      onClick={() => setConflictModalOpen(true)}
                      className="cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 text-xs transition-all shadow-xs"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      Slot Confirmed
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Interactive Conflict Resolution Modal */}
      {conflictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-300 dark:border-amber-500/50 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setConflictModalOpen(false)}
              className="absolute top-5 right-5 cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Resolve Schedule Collision
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student: Himanshu Rout (22CSE042)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-bold">Google Technical Interview:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">10:00 AM – 11:00 AM</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-bold">TCS Digital Interview:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">10:30 AM – 11:30 AM (Overlap!)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Select Resolution Strategy:
              </span>

              {/* Action Option 1 */}
              <button
                type="button"
                onClick={() => handleResolveConflict("int-2", "02:00 PM")}
                className="cursor-pointer w-full text-left p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200">
                    Reschedule TCS Interview to 02:00 PM – 03:00 PM
                  </span>
                  <span className="rounded-full bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Auditorium Hall A has an open panel slot with Suresh Menon. Automatically notifies Himanshu and the recruiter.
                </p>
              </button>

              {/* Action Option 2 */}
              <button
                type="button"
                onClick={() => handleResolveConflict("int-2", "04:00 PM")}
                className="cursor-pointer w-full text-left p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all space-y-1"
              >
                <span className="font-bold text-slate-900 dark:text-white">
                  Reschedule TCS Interview to 04:00 PM – 05:00 PM
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Evening slot after Google Day-1 rounds conclude.
                </p>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setConflictModalOpen(false)}
                className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
