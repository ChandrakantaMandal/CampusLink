"use client";

import React from "react";
import { 
  GraduationCap, 
  TrendingUp, 
  Building2, 
  Users, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Send, 
  ArrowUpRight,
  PieChart,
  Award
} from "lucide-react";
import { mockDashboardData } from "@/data/dashboardData";
import { toast } from "sonner";

export function AdminDashboardView() {
  const { adminOverview } = mockDashboardData;

  const branchStats = [
    { branch: "Computer Science & Engineering (CSE)", rate: 94, placed: "320 / 340", avgCtc: "₹10.5 LPA" },
    { branch: "Information Technology (IT)", rate: 91, placed: "172 / 190", avgCtc: "₹9.8 LPA" },
    { branch: "Electronics & Communication (ECE)", rate: 82, placed: "210 / 256", avgCtc: "₹7.6 LPA" },
    { branch: "Electrical Engineering (EE)", rate: 76, placed: "135 / 178", avgCtc: "₹6.8 LPA" },
    { branch: "Mechanical Engineering (ME)", rate: 68, placed: "140 / 205", avgCtc: "₹6.2 LPA" },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Placement Officer / Admin Console
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Institutional Placement Headquarters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              CAMPUSLINK 2026-2027 Academic Batch Placement Analytics & TPO Controls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success("Drafting Campus Wide Placement Notification")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              Send Student Broadcast
            </button>
            <button
              onClick={() => toast.info("Compiling NAAC & NIRF Placement Compliance Report (PDF)")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Download TPO Report
            </button>
          </div>
        </div>
      </div>

      {/* Admin 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Placement Rate</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {adminOverview.placementPercentage}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            +5.2% vs last batch
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Highest CTC</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {adminOverview.highestPackage}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Google India Off-Campus
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average CTC</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {adminOverview.averagePackage}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Across all branches
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Recruiters</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {adminOverview.activeRecruiters}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
            18 Fortune 500
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Drives Completed</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {adminOverview.totalDrivesCompleted}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5">
            6 in current week
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Batch Registered</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {adminOverview.studentsRegistered}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            99.4% Verified
          </div>
        </div>
      </div>

      {/* Branch-wise breakdown */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Departmental Placement Performance
            </h3>
          </div>
          <span className="text-xs text-slate-500">Live Campus Sync</span>
        </div>

        <div className="space-y-4">
          {branchStats.map((b) => (
            <div key={b.branch} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="font-medium text-xs text-slate-900 dark:text-white">
                  {b.branch}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Placed: <strong className="text-slate-800 dark:text-slate-200">{b.placed}</strong></span>
                  <span>•</span>
                  <span>Avg: <strong className="text-emerald-600 dark:text-emerald-400">{b.avgCtc}</strong></span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 ml-1">{b.rate}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  style={{ width: `${b.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
