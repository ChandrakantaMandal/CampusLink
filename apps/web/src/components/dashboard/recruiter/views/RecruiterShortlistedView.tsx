"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
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
import { mockRecruiterCandidates, type RecruiterCandidate } from "../mock-recruiter-data";
import { toast } from "sonner";

export default function RecruiterShortlistedView() {
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>(
    mockRecruiterCandidates.filter((c) =>
      ["Shortlisted", "Interview", "Selected", "Offer"].includes(c.status)
    )
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.appliedJobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBatchAssessment = () => {
    toast.success("Batch Assessment Links Sent 🚀", {
      description: `Evaluation assessment test links emailed to ${filtered.length} shortlisted candidates.`,
    });
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-teal-600/25 hover:shadow-lg hover:shadow-teal-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            <span>Send Batch Assessment Links</span>
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
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
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
                      {c.status}
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
                    <Link
                      href="/recruiter/interviews"
                      className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Schedule</span>
                      <Calendar className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
