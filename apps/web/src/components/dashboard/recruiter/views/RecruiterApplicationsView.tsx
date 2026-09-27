"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";
import {
  mockRecruiterCandidates,
  type RecruiterCandidate,
  mockRecruiterJobs,
} from "../mock-recruiter-data";
import { toast } from "sonner";

const STAGES = [
  { id: "Applied", name: "Applied", color: "border-slate-400 text-slate-700" },
  { id: "Under Review", name: "Under Review", color: "border-blue-400 text-blue-700" },
  { id: "Shortlisted", name: "Shortlisted", color: "border-purple-400 text-purple-700" },
  { id: "Interview", name: "Interview", color: "border-amber-400 text-amber-700" },
  { id: "Selected", name: "Selected", color: "border-teal-400 text-teal-700" },
  { id: "Offer", name: "Offer", color: "border-emerald-400 text-emerald-700" },
] as const;

export default function RecruiterApplicationsView() {
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>(mockRecruiterCandidates);
  const [selectedJob, setSelectedJob] = useState<string>("ALL");
  const [selectedCandidate, setSelectedCandidate] = useState<RecruiterCandidate | null>(null);
  const [recruiterNotes, setRecruiterNotes] = useState("");

  const filteredCandidates = candidates.filter((c) => {
    return selectedJob === "ALL" || c.appliedJobId === selectedJob;
  });

  const handleMoveStage = (candId: string, newStage: RecruiterCandidate["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, status: newStage } : c))
    );
    if (selectedCandidate && selectedCandidate.id === candId) {
      setSelectedCandidate({ ...selectedCandidate, status: newStage });
    }
    toast.success("Application Pipeline Advanced", {
      description: `Candidate transitioned to "${newStage}" stage.`,
    });
  };

  const handleSaveNotes = () => {
    if (selectedCandidate) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === selectedCandidate.id ? { ...c, notes: recruiterNotes } : c))
      );
      setSelectedCandidate({ ...selectedCandidate, notes: recruiterNotes });
      toast.success("Recruiter Notes Saved");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Applications Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track applicants from screening to interview evaluation and formal offer extension.
          </p>
        </div>

        {/* Job Selector Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400">Filter Job:</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white shadow-xs"
          >
            <option value="ALL">All Active Openings (342 Applicants)</option>
            {mockRecruiterJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((stage) => {
          const stageCandidates = filteredCandidates.filter((c) => c.status === stage.id);

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3 min-h-[500px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {stage.name}
                </span>
                <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {stageCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setRecruiterNotes(cand.notes || "");
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {cand.name}
                      </p>
                      <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 shrink-0">
                        {cand.matchScore}%
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 truncate">
                      {cand.branch} &bull; CGPA: {cand.cgpa}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                      <span className="text-blue-600 dark:text-blue-400 font-medium truncate">
                        {cand.appliedJobTitle.split(" ")[0]}...
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    </div>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Application Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {selectedCandidate.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Applied for {selectedCandidate.appliedJobTitle} on {selectedCandidate.appliedDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Academic</span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedCandidate.cgpa} CGPA ({selectedCandidate.branch})
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-center">
                <span className="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-bold">AI Match</span>
                <p className="text-sm font-black text-purple-600 dark:text-purple-400">
                  {selectedCandidate.matchScore}%
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-center">
                <span className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold">Current Stage</span>
                <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {selectedCandidate.status}
                </p>
              </div>
            </div>

            {/* Transition Stage Buttons */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                Change Pipeline Status:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleMoveStage(selectedCandidate.id, s.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      selectedCandidate.status === s.id
                        ? "bg-blue-600 text-white shadow-xs hover:bg-blue-500"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiter Evaluation Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Internal Recruiter Notes
              </label>
              <textarea
                rows={3}
                placeholder="Add screening comments, interview feedback, or coding test remarks..."
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
