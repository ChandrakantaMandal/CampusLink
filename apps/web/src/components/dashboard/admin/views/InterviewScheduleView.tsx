"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
  Loader2,
} from "lucide-react";
import type { InterviewScheduleItem } from "../admin.types";
import {
  getAdminInterviews,
  updateInterviewSchedule,
} from "@/lib/api/admin.api";
import { toast } from "sonner";

const POLL_MS = 30_000;

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MODE_OPTIONS = ["VIRTUAL", "IN_PERSON", "HYBRID"] as const;

const inputClassName =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60";

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

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

interface CalendarCell {
  key: string;
  date: string;
  dayLabel: number;
  inMonth: boolean;
  count: number;
  hasConflict: boolean;
}

function buildMonthGrid(
  monthCursor: Date,
  interviews: InterviewScheduleItem[],
): CalendarCell[] {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const stats = new Map<string, { count: number; hasConflict: boolean }>();
  for (const item of interviews) {
    const entry = stats.get(item.date);
    stats.set(item.date, {
      count: (entry?.count ?? 0) + 1,
      hasConflict: Boolean(entry?.hasConflict) || Boolean(item.hasConflict),
    });
  }

  const cells: CalendarCell[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({
      key: `pad-${i}`,
      date: "",
      dayLabel: 0,
      inMonth: false,
      count: 0,
      hasConflict: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = toDateKey(new Date(year, month, day));
    const meta = stats.get(date);
    cells.push({
      key: date,
      date,
      dayLabel: day,
      inMonth: true,
      count: meta?.count ?? 0,
      hasConflict: Boolean(meta?.hasConflict),
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({
      key: `tail-${cells.length}`,
      date: "",
      dayLabel: 0,
      inMonth: false,
      count: 0,
      hasConflict: false,
    });
  }
  return cells;
}

export default function InterviewScheduleView() {
  const [interviews, setInterviews] = useState<InterviewScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTargetId, setModalTargetId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [newMeetingLink, setNewMeetingLink] = useState("");
  const [newMode, setNewMode] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [saving, setSaving] = useState(false);

  const loadInterviews = useCallback(
    async (options?: { silent?: boolean; pickDefaultDate?: boolean }) => {
      const silent = options?.silent ?? false;
      if (!silent) setRefreshing(true);
      try {
        const data = await getAdminInterviews();
        setInterviews(data);
        setLastUpdated(new Date());
        if (options?.pickDefaultDate) {
          setSelectedDate((prev) => {
            if (prev && data.some((item) => item.date === prev)) return prev;
            return data[0]?.date ?? "";
          });
        } else {
          setSelectedDate((prev) => (prev ? prev : (data[0]?.date ?? "")));
        }
        return data;
      } catch (error) {
        if (!silent) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load interviews",
          );
        }
        return null;
      } finally {
        if (!silent) setRefreshing(false);
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadInterviews({ pickDefaultDate: true });

    const intervalId = setInterval(() => {
      void loadInterviews({ silent: true });
    }, POLL_MS);

    const handleWake = () => {
      if (document.visibilityState === "visible") {
        void loadInterviews({ silent: true });
      }
    };

    window.addEventListener("focus", handleWake);
    document.addEventListener("visibilitychange", handleWake);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleWake);
      document.removeEventListener("visibilitychange", handleWake);
    };
  }, [loadInterviews]);

  const conflictingInterviews = useMemo(
    () => interviews.filter((item) => item.hasConflict),
    [interviews],
  );

  const calendarCells = useMemo(
    () => buildMonthGrid(monthCursor, interviews),
    [monthCursor, interviews],
  );

  const monthLabel = useMemo(
    () =>
      monthCursor.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [monthCursor],
  );

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
    setNewDate(target.date);
    setNewStartTime(toTimeInput(target.startTime));
    setNewEndTime(toTimeInput(target.endTime));
    setNewVenue(target.venueRaw ?? "");
    setNewMeetingLink(target.meetingLink ?? "");
    setNewMode(target.mode ?? "");
    setNewDuration(
      target.durationMinutes != null ? String(target.durationMinutes) : "",
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setModalTargetId(null);
  };

  const handleReschedule = async () => {
    if (!modalTarget) return;
    const durationMinutes = newDuration ? Number(newDuration) : undefined;
    const hasChange =
      Boolean(newDate) ||
      Boolean(newStartTime) ||
      Boolean(newEndTime) ||
      Boolean(newVenue) ||
      Boolean(newMeetingLink) ||
      Boolean(newMode) ||
      Boolean(newDuration);
    if (!hasChange) return;

    setSaving(true);
    try {
      await updateInterviewSchedule(modalTarget.id, {
        ...(newDate ? { scheduledDate: newDate } : {}),
        ...(newStartTime ? { startTime: newStartTime } : {}),
        ...(newEndTime ? { endTime: newEndTime } : {}),
        ...(newVenue ? { venue: newVenue } : {}),
        ...(newMeetingLink ? { meetingLink: newMeetingLink } : {}),
        ...(newMode
          ? { mode: newMode as "VIRTUAL" | "IN_PERSON" | "HYBRID" }
          : {}),
        ...(durationMinutes !== undefined && Number.isFinite(durationMinutes)
          ? { durationMinutes }
          : {}),
      });
      const data = await loadInterviews({ silent: true });
      if (data) {
        setSelectedDate((prev) => {
          if (!prev) return data[0]?.date ?? "";
          return data.some((item) => item.date === prev)
            ? prev
            : (data[0]?.date ?? "");
        });
      }
      setModalOpen(false);
      setModalTargetId(null);
      toast.success(
        `Interview updated for ${newDate || modalTarget.date}${
          newStartTime ? ` ${newStartTime}` : ""
        }${newEndTime ? ` – ${newEndTime}` : ""}.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reschedule interview",
      );
    } finally {
      setSaving(false);
    }
  };

  const hasAnyChange =
    Boolean(newDate) ||
    Boolean(newStartTime) ||
    Boolean(newEndTime) ||
    Boolean(newVenue) ||
    Boolean(newMeetingLink) ||
    Boolean(newMode) ||
    Boolean(newDuration);

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
            All scheduled interviews with automatic schedule conflict collision
            detection. Auto-refreshes every 30s.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {lastUpdated && (
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Updated{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
          <button
            type="button"
            onClick={() => void loadInterviews({})}
            disabled={refreshing}
            data-testid="interviews-refresh"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300 font-bold px-4 py-2.5 text-xs transition-all disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          {conflictingInterviews.length > 0 && (
            <button
              type="button"
              onClick={() => openModal(conflictingInterviews[0]?.id)}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 text-xs transition-all shadow-md shadow-amber-500/25"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>⚠ Resolve Conflict ({conflictingInterviews.length})</span>
            </button>
          )}
        </div>
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
                  ⚠ Schedule Conflict Detected: {conflictingInterviews.length}{" "}
                  overlapping interview
                  {conflictingInterviews.length === 1 ? "" : "s"}
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Reschedule one of the overlapping interviews to clear the
                  collision.
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
                  {item.studentName} ({item.rollNo}) &bull; {item.startTime} –{" "}
                  {item.endTime}
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

      {/* Full Month Calendar */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setMonthCursor(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
              aria-label="Previous month"
              className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 text-slate-600 dark:text-slate-300 p-2 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 min-w-[9rem] text-center">
              {monthLabel}
            </h2>
            <button
              type="button"
              onClick={() =>
                setMonthCursor(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
              aria-label="Next month"
              className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 text-slate-600 dark:text-slate-300 p-2 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setMonthCursor(
                  new Date(now.getFullYear(), now.getMonth(), 1),
                );
                setSelectedDate(toDateKey(now));
              }}
              className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300 font-bold px-3 py-2 text-xs transition-all"
            >
              Today
            </button>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Selected: {selectedDate || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-[10px] font-bold uppercase text-slate-400 pb-1"
            >
              {label.slice(0, 1)}
            </div>
          ))}
          {calendarCells.map((cell) => {
            if (!cell.inMonth) {
              return (
                <div
                  key={cell.key}
                  className="min-h-[3.25rem] rounded-xl bg-slate-50/50 dark:bg-slate-900/40"
                />
              );
            }
            const isSelected = cell.date === selectedDate;
            const isToday = cell.date === toDateKey(new Date());
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedDate(cell.date)}
                data-testid="calendar-day"
                data-date={cell.date}
                className={`cursor-pointer relative min-h-[3.25rem] rounded-xl border p-1.5 text-left transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/25"
                    : cell.count > 0
                      ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 text-slate-800 dark:text-slate-200 hover:border-indigo-400"
                      : "bg-slate-50/80 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-800"
                } ${isToday && !isSelected ? "ring-2 ring-indigo-400/60" : ""}`}
              >
                <span className="text-sm font-black block">{cell.dayLabel}</span>
                {cell.count > 0 && (
                  <span
                    className={`absolute bottom-1.5 right-1.5 inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                      isSelected ? "bg-white/20 text-white" : "bg-indigo-600 text-white"
                    }`}
                    data-testid="calendar-count"
                  >
                    {cell.count}
                  </span>
                )}
                {cell.hasConflict && (
                  <span
                    className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ${
                      isSelected ? "bg-amber-300" : "bg-amber-400"
                    }`}
                    title="Conflict"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scheduled Interviews List for Date */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            Interviews Roster for {selectedDate || "—"}
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            {dayInterviews.length} Interview{dayInterviews.length === 1 ? "" : "s"}{" "}
            Scheduled
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
                data-testid="roster-row"
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
                    {item.mode && (
                      <span className="text-[11px] font-bold text-indigo-500">
                        {item.mode}
                      </span>
                    )}
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
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-300 dark:border-amber-500/50 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
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
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-bold">Venue / Mode:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {modalTarget.venue || "—"}
                  {modalTarget.mode ? ` (${modalTarget.mode})` : ""}
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
                  New date
                </span>
                <input
                  type="date"
                  value={newDate}
                  onChange={(event) => setNewDate(event.target.value)}
                  disabled={saving}
                  className={inputClassName}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New start time
                </span>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(event) => setNewStartTime(event.target.value)}
                  disabled={saving}
                  className={inputClassName}
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
                  className={inputClassName}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Duration (minutes)
                </span>
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={newDuration}
                  onChange={(event) => setNewDuration(event.target.value)}
                  disabled={saving}
                  placeholder="e.g. 45"
                  className={inputClassName}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Venue
                </span>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(event) => setNewVenue(event.target.value)}
                  disabled={saving}
                  placeholder="e.g. Hall 3"
                  className={inputClassName}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Meeting link
                </span>
                <input
                  type="url"
                  value={newMeetingLink}
                  onChange={(event) => setNewMeetingLink(event.target.value)}
                  disabled={saving}
                  placeholder="https://…"
                  className={inputClassName}
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mode
                </span>
                <select
                  value={newMode}
                  onChange={(event) => setNewMode(event.target.value)}
                  disabled={saving}
                  className={inputClassName}
                >
                  <option value="">Select mode</option>
                  {MODE_OPTIONS.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="text-[11px] text-slate-400">
              Only the fields you change will be updated.
            </p>

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
                disabled={saving || !hasAnyChange}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Saving…" : "Confirm Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
