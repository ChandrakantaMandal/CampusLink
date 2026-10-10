"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  X,
  ChevronRight,
  Layers,
  Trash2,
} from "lucide-react";
import type { RecruiterJob } from "../recruiter.types";
import {
  getMyJobs,
  createMyJob,
  deleteMyJob,
  type CreateRecruiterJobInput,
} from "@/lib/api/recruiter.api";
import { toast } from "sonner";

export default function RecruiterJobsView() {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // New Job Form State
  type NewJobForm = {
    title: string;
    jobType: string;
    location: string;
    ctc: string;
    openPositions: string;
    minCGPA: string;
    allowedBranches: string[];
    maxBacklogs: string;
    graduationYear: number;
    requiredSkills: string;
    description: string;
    applicationDeadline: string;
  };
  const [newJob, setNewJob] = useState<NewJobForm>({
    title: "",
    jobType: "Full-Time",
    location: "Bangalore (Hybrid)",
    ctc: "₹12.0 - ₹15.0 LPA",
    openPositions: "5",
    minCGPA: "7.5",
    allowedBranches: ["CSE", "IT", "ECE"],
    maxBacklogs: "0",
    graduationYear: 2026,
    requiredSkills: "Python, SQL, DSA, System Design",
    description: "",
    applicationDeadline: "2026-10-31",
  });

  const updateField = <K extends keyof NewJobForm>(
    key: K,
    value: NewJobForm[K],
  ) => {
    setNewJob((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => (key in prev ? { ...prev, [key]: "" } : prev));
  };

  const handleDeleteJob = async (job: RecruiterJob) => {
    const confirmed = window.confirm(
      `Delete "${job.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      await deleteMyJob(job.id);
      setJobs((prev) => prev.filter((item) => item.id !== job.id));
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job",
      );
    }
  };

  const fieldError = (key: string) =>
    fieldErrors[key] ? (
      <p className="mt-1 text-[11px] font-semibold text-red-500">
        {fieldErrors[key]}
      </p>
    ) : null;

  useEffect(() => {
    let cancelled = false;
    getMyJobs()
      .then((data) => {
        if (!cancelled) setJobs(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load job openings");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesStatus && matchesSearch;
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const payload: CreateRecruiterJobInput = {
      title: newJob.title,
      description: newJob.description,
      location: newJob.location,
      employmentType: newJob.jobType,
      ctc: newJob.ctc,
      openPositions:
        newJob.openPositions === "" ? undefined : Number(newJob.openPositions),
      minCGPA: newJob.minCGPA === "" ? undefined : Number(newJob.minCGPA),
      maxBacklogs:
        newJob.maxBacklogs === "" ? undefined : Number(newJob.maxBacklogs),
      allowedBranches: newJob.allowedBranches,
      requiredSkills: newJob.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      graduationYear: Number(newJob.graduationYear),
      applicationDeadline: newJob.applicationDeadline,
    };

    setIsCreating(true);
    try {
      const created = await createMyJob(payload);
      setJobs((prev) => [created, ...prev]);
      setIsModalOpen(false);
      toast.success("Job Opening Published 🎉", {
        description: `"${newJob.title}" is now open for campus applications.`,
      });
    } catch (err) {
      const error = err as Error & { fieldErrors?: Record<string, string[]> };
      const entries = Object.entries(error.fieldErrors ?? {}).filter(
        ([, messages]) => messages && messages.length > 0,
      );
      if (entries.length > 0) {
        setFieldErrors(
          Object.fromEntries(
            entries.map(([field, messages]) => [field, messages[0]]),
          ),
        );
      }
      toast.error("Failed to create job opening", {
        description:
          entries.length > 0
            ? entries
                .map(([field, messages]) => `${field}: ${messages[0]}`)
                .join("  •  ")
            : error.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Jobs & Placement Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish campus requirements, configure interview rounds, and monitor
            applicant pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFieldErrors({});
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Job Opening</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, skills, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            "ALL",
            "Applications Open",
            "Interviewing",
            "Published",
            "Draft",
          ].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading job openings...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {jobs.length === 0
              ? "No job openings found."
              : "No jobs match your filters."}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-all space-y-4"
            >
              {/* Top Bar: Title, CTC, Status */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      {job.title}
                    </h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        job.status === "Applications Open"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : job.status === "Interviewing"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span>&bull;</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Type: {job.jobType}
                    </span>
                    <span>&bull;</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      CTC: {job.ctc}
                    </span>
                    <span>&bull;</span>
                    <span>Positions: {job.openPositions}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/recruiter/candidates?jobId=${job.id}` as Route}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white transition-all cursor-pointer"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Candidates ({job.applicantsCount})</span>
                  </Link>

                  <Link
                    href={`/recruiter/candidates?jobId=${job.id}` as Route}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-2 text-xs font-bold text-white hover:shadow-md hover:shadow-purple-500/30 transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>AI Match</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job)}
                    title="Delete job"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-400 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              {/* Required Skills & Academic Eligibility */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Required Skills:
                  </span>
                  {job.requiredSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/40 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span>
                    Min CGPA:{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {job.minCGPA}
                    </strong>
                  </span>
                  <span>
                    Max Backlogs:{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {job.maxBacklogs}
                    </strong>
                  </span>
                  <span>
                    Deadline:{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {job.applicationDeadline}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Configured Recruitment Rounds */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  <Layers className="h-3 w-3" />
                  <span>Recruitment Process ({job.rounds.length} Rounds):</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {job.rounds.map((r) => (
                    <span
                      key={r.roundNumber}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg"
                    >
                      <span className="h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                        {r.roundNumber}
                      </span>
                      <span>{r.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Job Opening */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Create New Campus Placement Opening
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Graduate Software Engineer"
                    value={newJob.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                    required
                  />
                  {fieldError("title")}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Job Type
                  </label>
                  <select
                    value={newJob.jobType}
                    onChange={(e) => updateField("jobType", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="PPO">Pre-Placement Offer (PPO)</option>
                  </select>
                  {fieldError("employmentType")}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    CTC Package
                  </label>
                  <input
                    type="text"
                    value={newJob.ctc}
                    onChange={(e) => updateField("ctc", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                    required
                  />
                  {fieldError("ctc")}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newJob.minCGPA}
                    onChange={(e) => updateField("minCGPA", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                    required
                  />
                  {fieldError("minCGPA")}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Open Positions
                  </label>
                  <input
                    type="number"
                    value={newJob.openPositions}
                    onChange={(e) =>
                      updateField("openPositions", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                    required
                  />
                  {fieldError("openPositions")}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Required Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Python, SQL, DSA, System Design"
                    value={newJob.requiredSkills}
                    onChange={(e) =>
                      updateField("requiredSkills", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                  {fieldError("requiredSkills")}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Job Description & Responsibilities
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe role expectations, deliverables, and team context..."
                    value={newJob.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                    required
                  />
                  {fieldError("description")}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={newJob.applicationDeadline}
                    onChange={(e) =>
                      updateField("applicationDeadline", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                    required
                  />
                  {fieldError("applicationDeadline")}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Max Allowed Backlogs
                  </label>
                  <input
                    type="number"
                    value={newJob.maxBacklogs}
                    onChange={(e) => updateField("maxBacklogs", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                  {fieldError("maxBacklogs")}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Publishing..." : "Publish Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
