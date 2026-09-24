"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Download,
  Building2,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { mockDashboardData } from "@/data/dashboardData";

export function ApplicationsView() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const applications = [
    {
      id: "app-1",
      company: "Google India",
      role: "Software Development Engineer (SDE-1)",
      ctc: "₹32.5 LPA",
      appliedDate: "Sep 18, 2026",
      status: "Shortlisted",
      stage: "Round 2: Technical & Data Structures",
      dateScheduled: "Oct 12, 2026 (10:00 AM IST)",
      venue: "Google Meet (Link will activate 15 mins prior)",
      hallTicketReady: true,
      hasConflict: false,
    },
    {
      id: "app-2",
      company: "TCS Digital",
      role: "Systems Engineer (Digital)",
      ctc: "₹9.2 LPA",
      appliedDate: "Sep 10, 2026",
      status: "Offer Received",
      stage: "Offer Letter Released (LOI Verified)",
      dateScheduled: "Offer Accepted",
      venue: "TCS iON Portal",
      hallTicketReady: false,
      hasConflict: false,
    },
    {
      id: "app-3",
      company: "Microsoft IDC",
      role: "Software Engineer",
      ctc: "₹28.0 LPA",
      appliedDate: "Sep 20, 2026",
      status: "Under Review",
      stage: "Resume Screening by University TPO & Microsoft HR",
      dateScheduled: "Shortlist on Sep 29, 2026",
      venue: "Microsoft Teams",
      hallTicketReady: false,
      hasConflict: false,
    },
    {
      id: "app-4",
      company: "Amazon AWS",
      role: "Cloud Solutions Architect - Associate",
      ctc: "₹24.0 LPA",
      appliedDate: "Sep 15, 2026",
      status: "Interview",
      stage: "Technical Round 1 (System Design & Networking)",
      dateScheduled: "Oct 18, 2026 (02:30 PM IST)",
      venue: "Amazon Chime Online",
      hallTicketReady: true,
      hasConflict: false,
    },
    {
      id: "app-5",
      company: "Oracle India",
      role: "Member of Technical Staff",
      ctc: "₹21.5 LPA",
      appliedDate: "Sep 12, 2026",
      status: "Applied",
      stage: "Online Proctored Coding Test Pending",
      dateScheduled: "Oct 04, 2026 (04:00 PM IST)",
      venue: "HackerRank Proctored",
      hallTicketReady: true,
      hasConflict: false,
    },
  ];

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "shortlisted" && app.status === "Shortlisted") ||
      (filterStatus === "interview" && app.status === "Interview") ||
      (filterStatus === "offers" && app.status === "Offer Received") ||
      (filterStatus === "applied" && (app.status === "Applied" || app.status === "Under Review"));

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Offer Received":
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Shortlisted":
        return "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800";
      case "Interview":
        return "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "Under Review":
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <FileCheck2 className="w-3.5 h-3.5" /> Application Tracker
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Campus Placement Applications
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time progress, round shortlists, online assessment links, and verified institutional offers.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Applied</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">5</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
              <span className="text-[10px] text-indigo-400 uppercase font-semibold block">Shortlisted</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">2</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-[10px] text-emerald-500 uppercase font-semibold block">Offers</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or position..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All (5)" },
            { id: "shortlisted", label: "Shortlisted (1)" },
            { id: "interview", label: "Interviews (1)" },
            { id: "offers", label: "Offers (1)" },
            { id: "applied", label: "In Review (2)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterStatus(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${filterStatus === cat.id
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards */}
      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all shadow-2xs"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Column: Company & Role Details */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/20 shrink-0">
                  {app.company.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {app.company}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {app.ctc}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {app.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Applied on {app.appliedDate}
                  </p>
                </div>
              </div>

              {/* Middle Column: Current Stage & Schedule */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs min-w-[280px]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Current Milestone</div>
                <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                  {app.stage}
                </div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" />
                  {app.dateScheduled}
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {app.status === "Offer Received" && (
                  <button
                    type="button"
                    onClick={() => toast.success("Downloading Verified Letter of Intent (LOI) PDF")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Offer Letter
                  </button>
                )}

                {app.hallTicketReady && app.status !== "Offer Received" && (
                  <button
                    type="button"
                    onClick={() => toast.success(`Downloading Hall Ticket for ${app.company} assessment`)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Hall Ticket
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toast.info(`Viewing application history and audit log for ${app.company}`)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
