"use client";

import React from "react";
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
  Clock,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Plus,
  Building,
  Filter,
} from "lucide-react";
import {
  mockRecruiterCompany,
  mockRecruiterJobs,
  mockRecruiterCandidates,
  mockAIMatches,
  mockRecruiterInterviews,
  mockRecruiterOffers,
} from "../mock-recruiter-data";

export default function RecruiterDashboardHomeView() {
  const kpis = [
    {
      label: "Active Jobs",
      value: "5",
      change: "+2 this month",
      subtitle: "Current campus openings",
      icon: Briefcase,
      color: "from-blue-600 to-indigo-600",
      href: "/recruiter/jobs",
    },
    {
      label: "Total Applicants",
      value: "342",
      change: "+48 this week",
      subtitle: "Applications received",
      icon: Users,
      color: "from-purple-600 to-indigo-600",
      href: "/recruiter/applications",
    },
    {
      label: "Shortlisted",
      value: "68",
      change: "20% conversion",
      subtitle: "Screened & approved",
      icon: CheckCircle2,
      color: "from-teal-600 to-emerald-600",
      href: "/recruiter/shortlisted",
    },
    {
      label: "Interviews",
      value: "32",
      change: "1 conflict alert",
      subtitle: "Active interview stages",
      icon: Calendar,
      color: "from-amber-600 to-orange-600",
      href: "/recruiter/interviews",
    },
    {
      label: "Offers Made",
      value: "12",
      change: "4 accepted",
      subtitle: "Formal offer letters",
      icon: Gift,
      color: "from-emerald-600 to-teal-600",
      href: "/recruiter/offers",
    },
    {
      label: "Positions Filled",
      value: "8",
      change: "Target: 15",
      subtitle: "Accepted & confirmed",
      icon: Award,
      color: "from-rose-600 to-pink-600",
      href: "/recruiter/offers",
    },
  ];

  const pipelineStages = [
    { name: "Applicants", count: 342, percentage: 100, color: "bg-blue-600" },
    { name: "Screening", count: 186, percentage: 54, color: "bg-indigo-600" },
    { name: "Shortlisted", count: 68, percentage: 20, color: "bg-purple-600" },
    { name: "Interview", count: 32, percentage: 9.3, color: "bg-amber-500" },
    { name: "Selected", count: 14, percentage: 4.1, color: "bg-teal-500" },
    { name: "Offer", count: 12, percentage: 3.5, color: "bg-emerald-600" },
    { name: "Joined", count: 8, percentage: 2.3, color: "bg-rose-500" },
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
              Good Morning, {mockRecruiterCompany.name} 👋
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
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {kpi.change}
                </span>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
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

      {/* Main Grid: AI Matches & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Candidate Matching Highlights */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Top AI Candidate Matches
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Matched against active job profiles using semantic skills and academic eligibility
                </p>
              </div>
            </div>
            <Link
              href="/recruiter/candidates"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 hover:underline shrink-0"
            >
              Explore All Candidates &rarr;
            </Link>
          </div>

          <div className="space-y-3.5 flex-1">
            {mockAIMatches.slice(0, 3).map((match) => (
              <div
                key={match.candidateId}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-purple-300 dark:hover:border-purple-800/80 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {match.candidateName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {match.candidateBranch} &bull; CGPA: {match.candidateCGPA}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5 truncate">
                      Job: {match.jobTitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                      {match.overallMatchScore}%
                    </span>
                    <span className="rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5">
                      {match.matchTier}
                    </span>
                  </div>
                </div>

                {/* Match Explainability */}
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  <strong className="text-slate-700 dark:text-slate-300">Why:</strong> {match.whyExplanation}
                </p>

                {/* Skills Preview */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {match.matchedCriteria.slice(0, 2).map((crit, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 px-2 py-0.5 rounded-md"
                    >
                      {crit}
                    </span>
                  ))}
                  {match.missingSkills.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 px-2 py-0.5 rounded-md">
                      ⚠ Gap: {match.missingSkills[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/recruiter/candidates"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 hover:underline"
            >
              Analyze All 1,240 Campus Candidates &rarr;
            </Link>
          </div>
        </div>

        {/* Right: Upcoming Interviews & Conflict Alert */}
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
          <div className="mb-3.5 p-3 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold">Interview Conflict Detected: </span>
                <span>Candidate Himanshu Rout has an overlapping slot with Apex Systems at 10:30 AM.</span>
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

          <div className="space-y-3 flex-1">
            {mockRecruiterInterviews.map((interview) => (
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
            ))}
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
            <span>Manage All 5 Jobs</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

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
              {mockRecruiterJobs.map((job) => (
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
      </div>
    </div>
  );
}
