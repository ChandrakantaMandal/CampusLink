"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Gift,
  Mail,
  FileCheck,
} from "lucide-react";
import type { RecruiterCandidate } from "../recruiter.types";
import { getShortlistedCandidates, sendBatchAssessmentLinks } from "@/lib/api/recruiter.api";
import { toast } from "sonner";

export default function RecruiterShortlistedView() {
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendingCandidateId, setSendingCandidateId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getShortlistedCandidates()
      .then((data) => {
        if (!cancelled) setCandidates(data);
      })
      .catch((error: Error) => {
        if (!cancelled)
          toast.error("Failed to load shortlisted candidates", {
            description: error.message,
          });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.appliedJobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const awaitingAssessment = filtered.filter((candidate) => candidate.status === "Shortlisted");

  const handleBatchAssessment = async () => {
    if (isSending || awaitingAssessment.length === 0) return;
    setIsSending(true);
    try {
      const result = await sendBatchAssessmentLinks(awaitingAssessment.map((candidate) => candidate.applicationId!).filter(Boolean));
      const sentIds = new Set(awaitingAssessment.map((candidate) => candidate.applicationId));
      setCandidates((current) => current.map((candidate) => sentIds.has(candidate.applicationId) ? { ...candidate, status: "Assessment" } : candidate));
      toast.success("Assessment links sent", {
        description: `Sent to ${result.sent} of ${result.total} shortlisted candidates.`,
      });
    } catch (error) {
      toast.error("Failed to send assessment links", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendCandidateAssessment = async (candidate: RecruiterCandidate) => {
    if (isSending || sendingCandidateId || candidate.status !== "Shortlisted" || !candidate.applicationId) return;
    setSendingCandidateId(candidate.applicationId);
    try {
      await sendBatchAssessmentLinks([candidate.applicationId]);
      setCandidates((current) => current.map((item) => item.applicationId === candidate.applicationId ? { ...item, status: "Assessment" } : item));
      toast.success("Assessment link sent", { description: `Sent to ${candidate.email}.` });
    } catch (error) {
      toast.error("Failed to send assessment link", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSendingCandidateId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            Shortlisted Talent Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Candidates who cleared initial academic filtering and AI semantic screening.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBatchAssessment}
            disabled={isSending || sendingCandidateId !== null || awaitingAssessment.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-teal-600/25 hover:shadow-lg hover:shadow-teal-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            <span>{isSending ? "Sending assessment links…" : "Send Batch Assessment Links"}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search shortlisted candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 py-2 text-xs sm:text-sm"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} candidates
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4 font-bold">Candidate</th>
                <th className="p-4 font-bold">Target Role</th>
                <th className="p-4 font-bold">Match Score</th>
                <th className="p-4 font-bold">Current Evaluation Stage</th>
                <th className="p-4 font-bold">Next Action</th>
                <th className="p-4 font-bold">Recruiter Notes</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs font-semibold text-slate-400">
                    Loading shortlisted candidates...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs font-semibold text-slate-400">
                    No shortlisted candidates found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                <tr key={`${c.id}-${c.appliedJobId}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.branch} &bull; CGPA: {c.cgpa}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    {c.appliedJobTitle}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                      <Sparkles className="h-3 w-3" />
                      {c.matchScore}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5">
                      {c.status === "Assessment"
                        ? c.assessmentPassed === true
                          ? `Assessment passed${c.assessmentPercentage != null ? ` · ${c.assessmentPercentage}%` : ""}`
                          : c.assessmentPassed === false ? "Assessment not passed" : "Assessment pending"
                        : c.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-400 text-xs">
                    {c.status === "Shortlisted"
                      ? "Conduct Round 2 Technical"
                      : c.status === "Interview"
                      ? "Panel Evaluation Feedback"
                      : "Prepare Formal Offer"}
                  </td>
                  <td className="p-4 text-slate-500 max-w-xs truncate text-[11px]">
                    {c.notes || "High priority candidate for engineering team."}
                  </td>
                  <td className="p-4 text-right">
                    {c.status === "Shortlisted" ? (
                      <button type="button" onClick={() => void handleSendCandidateAssessment(c)} disabled={isSending || sendingCandidateId !== null} className="inline-flex items-center gap-1 font-bold text-teal-700 dark:text-teal-400 hover:underline disabled:cursor-not-allowed disabled:opacity-50">
                        <Mail className="h-3 w-3" />
                        <span>{sendingCandidateId === c.applicationId ? "Sending…" : "Send Assessment"}</span>
                      </button>
                    ) : c.assessmentPassed === true ? (
                      <Link href="/recruiter/interviews" className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        <span>Schedule</span><Calendar className="h-3 w-3" />
                      </Link>
                    ) : <span className="text-[10px] font-semibold text-slate-400">{c.assessmentPassed === false ? "Not eligible" : "Assessment required"}</span>}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
