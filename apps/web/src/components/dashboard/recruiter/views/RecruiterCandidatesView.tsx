"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
  ExternalLink,
  ChevronRight,
  X,
  Phone,
  Mail,
  AlertTriangle,
  Code2,
  Globe,
} from "lucide-react";
import { mockRecruiterCandidates, type RecruiterCandidate } from "../mock-recruiter-data";
import { toast } from "sonner";

export default function RecruiterCandidatesView() {
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>(mockRecruiterCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCandidate, setSelectedCandidate] = useState<RecruiterCandidate | null>(null);

  const filteredCandidates = candidates.filter((cand) => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.appliedJobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBranch = branchFilter === "ALL" || cand.branch === branchFilter;
    const matchesStatus = statusFilter === "ALL" || cand.status === statusFilter;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleStatusChange = (candId: string, newStatus: RecruiterCandidate["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, status: newStatus } : c))
    );
    if (selectedCandidate && selectedCandidate.id === candId) {
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }
    toast.success("Candidate Status Updated", {
      description: `Candidate marked as ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Candidate Talent Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and inspect campus candidates across all active job streams.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2">
          Total Candidates: <strong className="text-blue-600 dark:text-blue-400">{candidates.length}</strong>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, skills, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Under Review">Under Review</option>
            <option value="Applied">Applied</option>
            <option value="Selected">Selected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4 font-bold">Candidate</th>
                <th className="p-4 font-bold">Branch & CGPA</th>
                <th className="p-4 font-bold">Skills</th>
                <th className="p-4 font-bold">Applied Job</th>
                <th className="p-4 font-bold">AI Match</th>
                <th className="p-4 font-bold">Readiness</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredCandidates.map((cand) => (
                <tr
                  key={cand.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Candidate Name & Avatar */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shrink-0">
                        {cand.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {cand.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{cand.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Branch & CGPA */}
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {cand.branch} &bull; {cand.cgpa} CGPA
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {cand.backlogs === 0 ? "0 Backlogs ✓" : `${cand.backlogs} Backlog`}
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cand.skills.slice(0, 3).map((sk, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                      {cand.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold self-center">
                          +{cand.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Applied Job */}
                  <td className="p-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate max-w-xs">
                      {cand.appliedJobTitle}
                    </p>
                    <p className="text-[10px] text-slate-400">{cand.appliedDate}</p>
                  </td>

                  {/* Match Score */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-xs ${
                        cand.matchScore >= 90
                          ? "text-purple-600 dark:text-purple-400"
                          : cand.matchScore >= 80
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      {cand.matchScore}%
                    </span>
                  </td>

                  {/* Readiness Score */}
                  <td className="p-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {cand.readinessScore}%
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cand.status === "Shortlisted"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                          : cand.status === "Interview"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : cand.status === "Offer"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : cand.status === "Selected"
                          ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {cand.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCandidate(cand)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 hover:text-blue-700 dark:hover:bg-slate-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Profile Drawer / Modal (Section 10 of docx) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg">
                  {selectedCandidate.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedCandidate.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedCandidate.branch} &bull; {selectedCandidate.college} &bull; Batch {selectedCandidate.graduationYear}
                  </p>
                </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CGPA</span>
                <p className="text-lg font-black text-slate-900 dark:text-white">{selectedCandidate.cgpa}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Active Backlogs</span>
                <p className="text-lg font-black text-slate-900 dark:text-white">{selectedCandidate.backlogs}</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">AI Match</span>
                <p className="text-lg font-black text-purple-600 dark:text-purple-400">{selectedCandidate.matchScore}%</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">Readiness</span>
                <p className="text-lg font-black text-blue-600 dark:text-blue-400">{selectedCandidate.readinessScore}%</p>
              </div>
            </div>

            {/* Skills & Verified Stack */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((sk, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Recruiter Evaluation Notes */}
            {selectedCandidate.notes && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                <strong className="font-bold">Recruiter Notes: </strong>
                <span>{selectedCandidate.notes}</span>
              </div>
            )}

            {/* Links & Contact */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {selectedCandidate.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {selectedCandidate.phone}
              </span>
              {selectedCandidate.githubUrl && (
                <a
                  href={selectedCandidate.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  GitHub Profile
                </a>
              )}
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedCandidate.id, "Shortlisted")}
                  className="rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white hover:shadow-md hover:shadow-purple-500/30 transition-all cursor-pointer"
                >
                  Shortlist Candidate
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedCandidate.id, "Interview")}
                  className="rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:shadow-md hover:shadow-amber-500/30 transition-all cursor-pointer"
                >
                  Schedule Interview
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedCandidate.id, "Rejected")}
                  className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-400 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
