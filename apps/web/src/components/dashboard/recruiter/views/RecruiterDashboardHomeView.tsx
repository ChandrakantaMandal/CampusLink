"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Gift,
  Award,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";
import type {
  RecruiterCompany,
  RecruiterInterview,
  RecruiterJob,
  RecruiterOffer,
} from "../mock-recruiter-data";
import {
  getMyInterviews,
  getMyJobs,
  getMyOffers,
  getRecruiterProfile,
  getRecruiterStats,
  type RecruiterStats,
} from "@/lib/api/recruiter.api";
import { toast } from "sonner";

export default function RecruiterDashboardHomeView() {
  const [profile, setProfile] = useState<RecruiterCompany | null>(null);
  const [stats, setStats] = useState<RecruiterStats | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [interviews, setInterviews] = useState<RecruiterInterview[]>([]);
  const [offers, setOffers] = useState<RecruiterOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getRecruiterProfile(),
      getRecruiterStats(),
      getMyJobs(),
      getMyInterviews(),
      getMyOffers(),
    ])
      .then(([profileRow, statsRow, jobRows, interviewRows, offerRows]) => {
        if (cancelled) return;
        setProfile(profileRow);
        setStats(statsRow);
        setJobs(jobRows);
        setInterviews(interviewRows);
        setOffers(offerRows);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load dashboard data");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm font-medium text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        Loading dashboard...
      </div>
    );
  }

  const applicationCount = stats?.applications ?? 0;
  const shortlistedCount = stats?.shortlisted ?? 0;
  const offerCount = stats?.offers ?? offers.length;
  const conflictCount = stats?.interviewConflicts ?? 0;
  const acceptedCount = offers.filter(
    (offer) => offer.acceptanceStatus === "Accepted",
  ).length;
  const joinedCount = offers.filter(
    (offer) => offer.joiningStatus === "Joined",
  ).length;
  const conversionPct =
    applicationCount > 0
      ? Math.round((shortlistedCount / applicationCount) * 100)
      : 0;
  const pct = (count: number) =>
    applicationCount > 0 ? Math.round((count / applicationCount) * 100) : 0;

  const kpis = [
    {
      label: "Active Jobs",
      value: stats?.jobs ?? jobs.length,
      subtitle: "Current campus openings",
      icon: Briefcase,
      color: "from-blue-600 to-indigo-600",
      href: "/recruiter/jobs",
    },
    {
      label: "Total Applicants",
      value: applicationCount,
      subtitle: "Applications received",
      icon: Users,
      color: "from-purple-600 to-indigo-600",
      href: "/recruiter/applications",
    },
    {
      label: "Shortlisted",
      value: shortlistedCount,
      change:
        applicationCount > 0 ? `${conversionPct}% conversion` : undefined,
      subtitle: "Screened & approved",
      icon: CheckCircle2,
      color: "from-teal-600 to-emerald-600",
      href: "/recruiter/shortlisted",
    },
    {
      label: "Interviews",
      value: interviews.length,
      change:
        conflictCount > 0
          ? `${conflictCount} conflict alert${conflictCount === 1 ? "" : "s"}`
          : "No conflicts",
      subtitle: "Scheduled interview rounds",
      icon: Calendar,
      color: "from-amber-600 to-orange-600",
      href: "/recruiter/interviews",
    },
    {
      label: "Offers Made",
      value: offerCount,
      change: `${acceptedCount} accepted`,
      subtitle: "Formal offer letters",
      icon: Gift,
      color: "from-emerald-600 to-teal-600",
      href: "/recruiter/offers",
    },
    {
      label: "Positions Filled",
      value: joinedCount,
      subtitle: "Joined & confirmed",
      icon: Award,
      color: "from-rose-600 to-pink-600",
      href: "/recruiter/offers",
    },
  ];

  const pipelineStages = [
    {
      name: "Applicants",
      count: applicationCount,
      percentage: applicationCount > 0 ? 100 : 0,
      color: "bg-blue-600",
    },
    {
      name: "Shortlisted",
      count: shortlistedCount,
      percentage: pct(shortlistedCount),
      color: "bg-purple-600",
    },
    {
      name: "Interview",
      count: interviews.length,
      percentage: pct(interviews.length),
      color: "bg-amber-500",
    },
    {
      name: "Offer",
      count: offerCount,
      percentage: pct(offerCount),
      color: "bg-emerald-600",
    },
    {
      name: "Joined",
      count: joinedCount,
      percentage: pct(joinedCount),
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Recruitment Drive 2025-2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Good Morning, {profile?.name ?? "Recruiter"} 👋
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl">
              Manage your campus hiring pipeline, review AI-matched candidates, resolve interview schedule overlaps, and dispatch formal offers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/recruiter/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-blue-50 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-700 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Post New Opening</span>
            </Link>
            <Link
              href="/recruiter/candidates"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 dark:bg-white/10 dark:hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Explore Candidates</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.label}
              href={kpi.href as Route}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 transition-all hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${kpi.color} text-white shadow-sm transition-transform group-hover:scale-110`}>
                  <Icon className="h-4 w-4" />
                </div>
                {kpi.change && (
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {kpi.change}
                  </span>
                )}
              </div>

              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {kpi.value}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                {kpi.label}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {kpi.subtitle}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recruitment Pipeline Funnel Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Recruitment Pipeline Funnel
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live funnel velocity from initial application to signed offer acceptance
            </p>
          </div>
          <Link
            href="/recruiter/applications"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All Applications</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Funnel Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.name}
              className="relative p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Step {idx + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {stage.percentage}%
                </span>
              </div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                {stage.count}
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {stage.name}
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${stage.color}`}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Interviews & Conflict Alert */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-orange-600 text-white">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Upcoming Interviews & Conflicts
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scheduled evaluation rounds with automated conflict detection
              </p>
            </div>
          </div>
          <Link
            href="/recruiter/interviews"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            Full Calendar &rarr;
          </Link>
        </div>

        {/* Conflict Alert Banner if any */}
        {conflictCount > 0 && (
          <div className="mb-3.5 p-3 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold">Interview Conflict Detected: </span>
                <span>
                  {conflictCount} overlapping interview slot
                  {conflictCount === 1 ? "" : "s"} in your schedule.
                </span>
                <div className="mt-1">
                  <Link
                    href="/recruiter/interviews"
                    className="font-bold text-amber-700 dark:text-amber-300 underline"
                  >
                    Reschedule slot now &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
          {interviews.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-8 text-center space-y-1">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No interviews scheduled yet.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Schedule an interview from the calendar to see it here.
              </p>
            </div>
          ) : (
            interviews.slice(0, 6).map((interview) => (
              <div
                key={interview.id}
                className={`p-3.5 rounded-xl border transition-all ${interview.hasConflict ? "border-amber-300 dark:border-amber-600/60 bg-amber-50/30 dark:bg-amber-950/10" : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {interview.candidateName}
                      </span>
                      {interview.hasConflict && (
                        <span className="rounded-full bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 animate-pulse">
                          Conflict!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {interview.round} &bull; {interview.jobTitle}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    {interview.time}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="truncate">Panel: {interview.interviewerPanel}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                    {interview.mode}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            href="/recruiter/interviews"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Manage All Scheduled Interviews &rarr;
          </Link>
        </div>
      </div>

      {/* Active Job Openings Table Widget */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Active Job Openings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current campus roles, application cutoffs, and applicant pipeline volume
            </p>
          </div>

          <Link
            href="/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>
              {jobs.length > 0 ? `Manage All ${jobs.length} Jobs` : "Post a Job"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-8 text-center space-y-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No job openings found.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Post a new opening to start building your campus pipeline.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-bold">Job Role</th>
                  <th className="pb-3 font-bold">CTC / Package</th>
                  <th className="pb-3 font-bold">Eligibility (Min CGPA)</th>
                  <th className="pb-3 font-bold">Applicants</th>
                  <th className="pb-3 font-bold">Deadline</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-3">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {job.title}
                      </p>
                      <p className="text-[11px] text-slate-400">{job.jobType} &bull; {job.location}</p>
                    </td>
                    <td className="py-3.5 pr-3 font-semibold text-slate-700 dark:text-slate-300">
                      {job.ctc}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {job.minCGPA} CGPA
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">
                        ({job.allowedBranches.join(", ")})
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 font-bold text-slate-900 dark:text-white">
                      {job.applicantsCount}
                    </td>
                    <td className="py-3.5 pr-3 text-slate-500 dark:text-slate-400">
                      {job.applicationDeadline}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === "Applications Open"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : job.status === "Interviewing"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : job.status === "Published"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/recruiter/candidates?jobId=${job.id}` as Route}
                        className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Review</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
