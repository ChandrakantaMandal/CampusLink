"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  Video,
  X,
  Plus,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import type {
  RecruiterCandidate,
  RecruiterInterview,
  RecruiterJob,
} from "../mock-recruiter-data";
import {
  createMyInterview,
  getMyInterviews,
  getMyJobs,
  getShortlistedCandidates,
  VIEW_TO_INTERVIEW_MODE,
  type CreateRecruiterInterviewInput,
} from "@/lib/api/recruiter.api";
import { toast } from "sonner";

export default function RecruiterInterviewsView() {
  const [interviews, setInterviews] = useState<RecruiterInterview[]>([]);
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Interview Form
  const [newInterview, setNewInterview] = useState({
    candidateId: "",
    jobId: "",
    round: "Round 2: Core Technical & DSA",
    date: "2026-09-28",
    time: "03:00 PM – 04:00 PM",
    duration: "60 mins",
    mode: "Online Google Meet" as const,
    meetingLink: "https://meet.google.com/new-interview-room",
    interviewerPanel: "Vikram Malhotra & Tech Lead",
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyInterviews(), getShortlistedCandidates(), getMyJobs()])
      .then(([interviewRows, candidateRows, jobRows]) => {
        if (cancelled) return;
        setInterviews(interviewRows);
        setCandidates(candidateRows);
        setJobs(jobRows);
        setNewInterview((prev) => ({
          ...prev,
          candidateId: candidateRows[0]?.id ?? "",
          jobId: jobRows[0]?.id ?? "",
        }));
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load interviews");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterview.candidateId || !newInterview.jobId) {
      toast.error("Select a candidate and target role first");
      return;
    }

    const [slotStart = "", slotEnd = ""] = newInterview.time.split("–");
    const payload: CreateRecruiterInterviewInput = {
      studentId: newInterview.candidateId,
      jobId: newInterview.jobId,
      roundName: newInterview.round,
      roundNumber: Number(newInterview.round.match(/round\s*(\d+)/i)?.[1] ?? 1),
      scheduledDate: new Date(newInterview.date).toISOString(),
      startTime: slotStart.trim(),
      endTime: slotEnd.trim(),
      durationMinutes: Number.parseInt(newInterview.duration, 10) || 60,
      mode: VIEW_TO_INTERVIEW_MODE[newInterview.mode],
      meetingLink: newInterview.meetingLink || undefined,
      interviewerPanel: newInterview.interviewerPanel
        .split(/[&,]/)
        .map((part) => part.trim())
        .filter(Boolean),
    };

    setIsScheduling(true);
    try {
      const created = await createMyInterview(payload);
      setInterviews((prev) => [created, ...prev]);
      setIsModalOpen(false);
      toast.success("Interview Successfully Scheduled", {
        description: `Evaluation invite dispatched to ${created.candidateName}.`,
      });
    } catch {
      toast.error("Failed to schedule interview");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleAutoResolveConflict = (interviewId: string) => {
    setInterviews((prev) =>
      prev.map((item) =>
        item.id === interviewId
          ? {
              ...item,
              time: "03:30 PM – 04:30 PM",
              hasConflict: false,
              conflictDetails: undefined,
            }
          : item
      )
    );
    toast.success("Interview Schedule Conflict Resolved", {
      description: "Slot automatically updated to 03:30 PM (next non-overlapping campus slot).",
    });
  };

  const conflict = interviews.find((i) => i.hasConflict);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Calendar className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            Interview Management & Scheduling
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conduct multi-round technical & HR evaluations with automated campus conflict detection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-600/25 hover:shadow-lg hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Conflict Detection Banner (Section 13 of docx) */}
      {conflict && (
        <div className="rounded-2xl border-2 border-amber-400/80 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/40 p-5 text-amber-950 dark:text-amber-100 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 shadow-md animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-wide text-amber-900 dark:text-amber-200">
                    ⚠ Active Interview Conflict Detected
                  </h3>
                  <span className="rounded-full bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 animate-pulse">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed max-w-2xl">
                  <strong>Candidate: {conflict.candidateName}</strong> has an overlapping interview slot:
                  <br />
                  <span className="font-semibold text-slate-900 dark:text-white">Existing Slot:</span>{" "}
                  {conflict.conflictDetails
                    ? `${conflict.conflictDetails.conflictingWith} (${conflict.conflictDetails.existingSlot})`
                    : "Another booked campus interview slot"}
                  <br />
                  <span className="font-semibold text-slate-900 dark:text-white">Your Scheduled Slot:</span>{" "}
                  {conflict.date} &bull; {conflict.time} ({conflict.round})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAutoResolveConflict(conflict.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-bold shadow-md hover:shadow-amber-500/30 transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reschedule to 03:30 PM</span>
            </button>
          </div>
        </div>
      )}

      {/* Interviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading interviews...
          </div>
        ) : interviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            No interviews scheduled yet.
          </div>
        ) : (
        interviews.map((int) => (
          <div
            key={int.id}
            className={`rounded-2xl border p-5 shadow-xs transition-all ${
              int.hasConflict
                ? "border-amber-400 dark:border-amber-600/80 bg-amber-50/40 dark:bg-amber-950/20"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-blue-400"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {int.candidateName}
                  </h3>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    &bull; {int.round}
                  </span>
                  {int.hasConflict && (
                    <span className="rounded-full bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 animate-pulse">
                      Slot Conflict!
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Role: <strong className="text-slate-700 dark:text-slate-300">{int.jobTitle}</strong> &bull; Panel: {int.interviewerPanel}
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  int.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                }`}
              >
                {int.status}
              </span>
            </div>

            {/* Time, Venue & Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  {int.date} &bull; {int.time} ({int.duration})
                </span>

                <span className="flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-blue-500" />
                  {int.mode}
                </span>
              </div>

              {int.meetingLink && (
                <a
                  href={int.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Join Meeting Room</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )))}
      </div>

      {/* Schedule Interview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Schedule Evaluation Interview
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Candidate</label>
                <select
                  value={newInterview.candidateId}
                  onChange={(e) => setNewInterview({ ...newInterview, candidateId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                >
                  {candidates.length === 0 && (
                    <option value="" disabled>
                      No shortlisted candidates
                    </option>
                  )}
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.branch} - {c.cgpa} CGPA)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Role</label>
                <select
                  value={newInterview.jobId}
                  onChange={(e) => setNewInterview({ ...newInterview, jobId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                >
                  {jobs.length === 0 && (
                    <option value="" disabled>
                      No active jobs
                    </option>
                  )}
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Slot</label>
                  <input
                    type="text"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Interviewer Panel</label>
                <input
                  type="text"
                  value={newInterview.interviewerPanel}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewerPanel: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isScheduling ||
                    !newInterview.candidateId ||
                    !newInterview.jobId
                  }
                  className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isScheduling ? "Scheduling..." : "Confirm Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
