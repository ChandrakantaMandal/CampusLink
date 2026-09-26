"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  Video,
  MapPin,
  Users,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  mockRecruiterInterviews,
  type RecruiterInterview,
  mockRecruiterCandidates,
  mockRecruiterJobs,
} from "../mock-recruiter-data";
import { toast } from "sonner";

export default function RecruiterInterviewsView() {
  const [interviews, setInterviews] = useState<RecruiterInterview[]>(mockRecruiterInterviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvingConflictId, setResolvingConflictId] = useState<string | null>(null);

  // New Interview Form
  const [newInterview, setNewInterview] = useState({
    candidateId: mockRecruiterCandidates[0].id,
    jobId: mockRecruiterJobs[0].id,
    round: "Round 2: Core Technical & DSA",
    date: "2026-09-28",
    time: "03:00 PM – 04:00 PM",
    duration: "60 mins",
    mode: "Online Google Meet" as const,
    meetingLink: "https://meet.google.com/new-interview-room",
    interviewerPanel: "Vikram Malhotra & Tech Lead",
  });

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = mockRecruiterCandidates.find((c) => c.id === newInterview.candidateId);
    const job = mockRecruiterJobs.find((j) => j.id === newInterview.jobId);

    const created: RecruiterInterview = {
      id: `int-0${interviews.length + 1}`,
      candidateId: newInterview.candidateId,
      candidateName: candidate ? candidate.name : "Candidate",
      candidateEmail: candidate ? candidate.email : "candidate@campuslink.edu",
      jobId: newInterview.jobId,
      jobTitle: job ? job.title : "Role",
      round: newInterview.round,
      date: newInterview.date,
      time: newInterview.time,
      duration: newInterview.duration,
      mode: newInterview.mode,
      meetingLink: newInterview.meetingLink,
      interviewerPanel: newInterview.interviewerPanel,
      status: "Scheduled",
    };

    setInterviews([created, ...interviews]);
    setIsModalOpen(false);
    toast.success("Interview Successfully Scheduled", {
      description: `Evaluation invite dispatched to ${created.candidateName}.`,
    });
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
          <span>+ Schedule Interview</span>
        </button>
      </div>

      {/* Conflict Detection Banner (Section 13 of docx) */}
      {interviews.some((i) => i.hasConflict) && (
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
                  <strong>Candidate: Himanshu Rout</strong> has an overlapping interview slot booked by TPO Cell:
                  <br />
                  <span className="font-semibold text-slate-900 dark:text-white">Existing Slot:</span> 10:00 AM – 11:00 AM (Apex Systems Final Round)
                  <br />
                  <span className="font-semibold text-slate-900 dark:text-white">Your Scheduled Slot:</span> 10:30 AM – 11:30 AM (TechCorp Technical Round)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAutoResolveConflict("int-01")}
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
        {interviews.map((int) => (
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
        ))}
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
                  {mockRecruiterCandidates.map((c) => (
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
                  {mockRecruiterJobs.map((j) => (
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
                  className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
