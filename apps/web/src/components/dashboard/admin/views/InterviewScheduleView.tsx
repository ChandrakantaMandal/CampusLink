"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import type { InterviewScheduleItem } from "../mock-admin-data";
import {
  getAdminInterviews,
  updateInterviewSchedule,
} from "@/lib/api/admin.api";
import { toast } from "sonner";

function toTimeInput(value: string): string {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(value.trim());
  if (!match || match[1] === undefined || match[2] === undefined) {
    return "";
  }
  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = (match[3] ?? "").toUpperCase();
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return "";
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function dateChip(date: string): { day: string; label: string } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match || match[1] === undefined || match[2] === undefined || match[3] === undefined) {
    return { day: date, label: date };
  }
  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(parsed.getTime())) {
    return { day: date, label: date };
  }
  return {
    day: parsed.toLocaleDateString("en-US", { weekday: "short" }),
    label: String(parsed.getDate()),
  };
}

export default function InterviewScheduleView() {
  const [interviews, setInterviews] = useState<InterviewScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTargetId, setModalTargetId] = useState<string | null>(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAdminInterviews()
      .then((data) => {
        if (cancelled) return;
        setInterviews(data);
        setSelectedDate(data[0]?.date ?? "");
      })
      .catch((error) => {
        if (cancelled) return;
        toast.error(
          error instanceof Error ? error.message : "Failed to load interviews",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const conflictingInterviews = useMemo(
    () => interviews.filter((item) => item.hasConflict),
    [interviews],
  );

  const dateStrip = useMemo(() => {
    const seen = new Map<string, { hasConflict: boolean }>();
    for (const item of interviews) {
      const entry = seen.get(item.date);
      seen.set(item.date, {
        hasConflict: Boolean(entry?.hasConflict) || Boolean(item.hasConflict),
      });
    }
    return Array.from(seen.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, meta]) => ({ date, hasConflict: meta.hasConflict }));
  }, [interviews]);

  const modalTarget = useMemo(
    () => interviews.find((item) => item.id === modalTargetId) ?? null,
    [interviews, modalTargetId],
  );

  const dayInterviews = useMemo(
    () => interviews.filter((item) => item.date === selectedDate),
    [interviews, selectedDate],
  );

  const openModal = (interviewId: string | undefined) => {
    const target = interviews.find((item) => item.id === interviewId);
    if (!target) return;
    setModalTargetId(target.id);
    setNewStartTime(toTimeInput(target.startTime));
    setNewEndTime(toTimeInput(target.endTime));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setModalTargetId(null);
  };

  const handleReschedule = async () => {
    if (!modalTarget || !newStartTime) return;

    setSaving(true);
    try {
      await updateInterviewSchedule(modalTarget.id, {
        startTime: newStartTime,
        ...(newEndTime ? { endTime: newEndTime } : {}),
      });
      const data = await getAdminInterviews();
      setInterviews(data);
      if (selectedDate && !data.some((item) => item.date === selectedDate)) {
        setSelectedDate(data[0]?.date ?? "");
      }
      setModalOpen(false);
      setModalTargetId(null);
      toast.success(
        `Interview rescheduled to ${newStartTime}${newEndTime ? ` – ${newEndTime}` : ""}.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reschedule interview",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-10 shadow-sm flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-semibold">Loading interviews…</span>
      </div>
    );
  }

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
            All scheduled interviews with automatic schedule conflict collision detection.
          </p>
        </div>

        {conflictingInterviews.length > 0 && (
          <button
            type="button"
            onClick={() => openModal(conflictingInterviews[0]?.id)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 text-xs transition-all shadow-md shadow-amber-500/25 shrink-0 self-start sm:self-auto"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>⚠ Resolve Conflict ({conflictingInterviews.length} Found)</span>
          </button>
        )}
      </div>

      {/* Conflict Warning Banner */}
      {conflictingInterviews.length > 0 && (
        <div className="rounded-3xl border-2 border-amber-300 dark:border-amber-500/50 bg-amber-50/80 dark:bg-amber-950/30 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-900 dark:text-amber-200">
                  ⚠ Schedule Conflict Detected: {conflictingInterviews.length} overlapping interview
                  {conflictingInterviews.length === 1 ? "" : "s"}
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Reschedule one of the overlapping interviews to clear the collision.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModal(conflictingInterviews[0]?.id)}
              className="cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 text-xs transition-all shadow-xs shrink-0"
            >
              Resolve Conflict
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {conflictingInterviews.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-xs"
              >
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {item.company}
                  {item.round ? ` • ${item.round}` : ""}
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
                  {item.studentName} ({item.rollNo}) &bull; {item.startTime} – {item.endTime}
                </p>
                {item.conflictDetails && (
                  <p className="text-amber-700 dark:text-amber-400 font-bold mt-1">
                    ⚠ {item.conflictDetails}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Strip (derived from actual interviews) */}
      {dateStrip.length > 0 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Placement Schedule
            </h2>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Selected: {selectedDate}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {dateStrip.map((d) => {
              const chip = dateChip(d.date);
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSelectedDate(d.date)}
                  className={`cursor-pointer rounded-2xl p-3 text-center transition-all border ${
                    selectedDate === d.date
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/25"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase block opacity-80">
                    {chip.day}
                  </span>
                  <span className="text-base font-black block mt-0.5">{chip.label}</span>
                  {d.hasConflict && (
                    <span
                      className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-400 animate-ping"
                      title="Conflict"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scheduled Interviews List for Date */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            Interviews Roster for {selectedDate || "—"}
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            {dayInterviews.length} Interview{dayInterviews.length === 1 ? "" : "s"} Scheduled
          </span>
        </div>

        {dayInterviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
            <CalendarIcon className="h-8 w-8" />
            <p className="text-sm font-semibold">
              {interviews.length === 0
                ? "No interviews scheduled yet."
                : "No interviews on this date."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayInterviews.map((item) => (
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
                      {item.company || "Interview"}
                      {item.round ? ` • ${item.round}` : ""}
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
                    Candidate:{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {item.studentName}
                    </strong>{" "}
                    ({item.rollNo}){item.panel ? ` • Panel: ${item.panel}` : ""}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      {item.startTime || "—"}
                      {item.endTime ? ` – ${item.endTime}` : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {item.venue || "—"}
                    </span>
                    {item.interviewer && (
                      <span className="text-[11px] text-slate-400">
                        Interviewer: {item.interviewer}
                      </span>
                    )}
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
                      onClick={() => openModal(item.id)}
                      className="cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 text-xs transition-all shadow-xs"
                    >
                      Resolve
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openModal(item.id)}
                      className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 text-xs transition-all"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reschedule / Resolve Modal */}
      {modalOpen && modalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-300 dark:border-amber-500/50 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="absolute top-5 right-5 cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl font-bold shadow-md ${
                  modalTarget.hasConflict
                    ? "bg-amber-500 text-slate-950 shadow-amber-500/30"
                    : "bg-indigo-600 text-white shadow-indigo-600/30"
                }`}
              >
                {modalTarget.hasConflict ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <Clock className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {modalTarget.hasConflict
                    ? "Resolve Schedule Collision"
                    : "Reschedule Interview"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {modalTarget.studentName} ({modalTarget.rollNo}) •{" "}
                  {modalTarget.company}
                  {modalTarget.round ? ` • ${modalTarget.round}` : ""}
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                modalTarget.hasConflict
                  ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-bold">Current schedule:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {modalTarget.startTime || "—"}
                  {modalTarget.endTime ? ` – ${modalTarget.endTime}` : ""}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-bold">Date:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {modalTarget.date}
                </span>
              </div>
              {modalTarget.conflictDetails && (
                <p className="text-amber-700 dark:text-amber-400 font-bold">
                  ⚠ {modalTarget.conflictDetails}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New start time
                </span>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(event) => setNewStartTime(event.target.value)}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New end time (optional)
                </span>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(event) => setNewEndTime(event.target.value)}
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                />
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReschedule}
                disabled={saving || !newStartTime}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Rescheduling…" : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
