"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import type { ApplicationItem, ApplicationStatus } from "@/data/dashboardData";
import { toast } from "sonner";

interface ApplicationsTrackerProps {
  applications: ApplicationItem[];
}

const statusStyles: Record<
  ApplicationStatus,
  { bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  Applied: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
    icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
  },
  "Under Review": {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/60",
    icon: <Clock className="w-3.5 h-3.5 text-blue-500 animate-spin" />,
  },
  Shortlisted: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800/60",
    icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />,
  },
  Interview: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800/60",
    icon: <Calendar className="w-3.5 h-3.5 text-purple-500" />,
  },
  Selected: {
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800/60",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />,
  },
  "Offer Received": {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/60",
    icon: <Award className="w-3.5 h-3.5 text-emerald-500" />,
  },
  Joined: {
    bg: "bg-emerald-100/70 dark:bg-emerald-900/50",
    text: "text-emerald-800 dark:text-emerald-200",
    border: "border-emerald-300 dark:border-emerald-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
  },
  Rejected: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800/60",
    icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
  },
};

export function ApplicationsTracker({ applications }: ApplicationsTrackerProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === "active")
      return ["Applied", "Under Review", "Shortlisted", "Interview"].includes(app.status);
    if (filter === "offers")
      return ["Selected", "Offer Received", "Joined"].includes(app.status);
    if (filter === "rejected") return app.status === "Rejected";
    return true;
  });

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Application Lifecycle Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time synchronization across all 8 placement stages
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "active"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            In-Progress
          </button>
          <button
            onClick={() => setFilter("offers")}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filter === "offers"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Offers & Selected
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by company, role, or stage..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Applications Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <th className="pb-3 font-semibold">Company & Role</th>
              <th className="pb-3 font-semibold">Package (CTC)</th>
              <th className="pb-3 font-semibold">Stage & Status</th>
              <th className="pb-3 font-semibold">Next Milestone</th>
              <th className="pb-3 font-semibold text-right">Applied Date</th>
              <th className="pb-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredApps.map((app) => {
              const style = statusStyles[app.status];

              return (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 pr-3">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {app.company}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-medium">
                      {app.role}
                    </div>
                  </td>

                  <td className="py-3.5 pr-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {app.ctc}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {style.icon}
                      {app.status}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3 max-w-[220px]">
                    <span className="text-slate-600 dark:text-slate-300 line-clamp-1">
                      {app.nextStep}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3 text-right text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {app.appliedDate}
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={() =>
                        toast.info(`${app.company} — ${app.role}`, {
                          description: `Status: ${app.status} | Next: ${app.nextStep}`,
                        })
                      }
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-xs">
          No applications match your selected filter criteria.
        </div>
      )}

      {/* 8-Stage Pipeline Legend */}
      <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
          CAMPUSLINK Verified Pipeline Stages:
        </p>
        <div className="flex flex-wrap gap-2 text-[10px]">
          {(
            [
              "Applied",
              "Under Review",
              "Shortlisted",
              "Interview",
              "Selected",
              "Offer Received",
              "Joined",
              "Rejected",
            ] as ApplicationStatus[]
          ).map((st) => (
            <span
              key={st}
              className={`px-2 py-0.5 rounded-md border ${statusStyles[st].bg} ${statusStyles[st].text} ${statusStyles[st].border}`}
            >
              {st}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
