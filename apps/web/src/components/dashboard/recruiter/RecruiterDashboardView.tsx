"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  Briefcase, 
  Calendar, 
  Award, 
  Search, 
  CheckCircle2, 
  Filter, 
  PlusCircle, 
  TrendingUp,
  FileSpreadsheet,
  ArrowUpRight
} from "lucide-react";
import { mockDashboardData } from "@/data/dashboardData";
import { toast } from "sonner";

export function RecruiterDashboardView() {
  const { recruiterOverview } = mockDashboardData;
  const [jobSearch, setJobSearch] = useState("");

  const mockPostings = [
    {
      id: "rec-job-1",
      title: "Full-Stack Software Engineer (Fresher 2027)",
      ctc: "₹9.5 - ₹12.0 LPA",
      applicants: 184,
      shortlisted: 32,
      interviews: 8,
      status: "Active Drive",
      deadline: "Oct 15, 2026",
    },
    {
      id: "rec-job-2",
      title: "Data Analyst & Business Intelligence",
      ctc: "₹7.5 - ₹9.0 LPA",
      applicants: 98,
      shortlisted: 18,
      interviews: 6,
      status: "Shortlisting",
      deadline: "Oct 20, 2026",
    },
    {
      id: "rec-job-3",
      title: "DevOps & Cloud Associate",
      ctc: "₹8.0 - ₹10.5 LPA",
      applicants: 60,
      shortlisted: 6,
      interviews: 4,
      status: "Draft",
      deadline: "Nov 02, 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner for Recruiter */}
      <div className="p-6 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2">
              <Building2 className="w-3.5 h-3.5" /> Recruiter Campus Portal
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, Talent Partner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              CAMPUSLINK AI-Assisted Candidate Discovery & Campus Drive Management
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success("Opening New Job Opening Modal")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Post Campus Drive
            </button>
            <button
              onClick={() => toast.info("Exporting shortlisted candidate resumes (ZIP)")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Recruiter Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Openings</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {recruiterOverview.activeJobs}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
            3 Campus Drives
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Eligible Pool</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {recruiterOverview.eligibleCandidates}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            CGPA ≥ 7.5 satisfied
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Shortlisted</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {recruiterOverview.shortlistedCandidates}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            AI match score &gt; 85%
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interviews</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {recruiterOverview.interviewsScheduled}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
            0 Conflicts
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Offers Issued</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {recruiterOverview.offersExtended}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            100% Verified
          </div>
        </div>
      </div>

      {/* Recruiter Job Listings Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Active Campus Job Drives
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Automated AI Candidate Ranking Active
          </span>
        </div>

        <div className="space-y-3">
          {mockPostings.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {job.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Package: <strong className="text-slate-700 dark:text-slate-200">{job.ctc}</strong></span>
                  <span>•</span>
                  <span>Drive Deadline: {job.deadline}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {job.applicants}
                  </div>
                  <div className="text-[11px] text-slate-400">Applied</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {job.shortlisted}
                  </div>
                  <div className="text-[11px] text-slate-400">Shortlisted</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                    {job.interviews}
                  </div>
                  <div className="text-[11px] text-slate-400">Interviewing</div>
                </div>

                <button
                  onClick={() =>
                    toast.info(`Reviewing candidates for ${job.title}`, {
                      description: `${job.applicants} total applicants | ${job.shortlisted} AI top matches`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Manage
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
