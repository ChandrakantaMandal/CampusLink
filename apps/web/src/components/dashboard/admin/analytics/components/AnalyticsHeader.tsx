"use client";

import React from "react";
import {
  BarChart3,
  GraduationCap,
  IndianRupee,
  FileCheck2,
  Database,
  Download,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import type { AnalyticsTab } from "../types";

interface AnalyticsHeaderProps {
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
  counts: {
    placements: number;
    salaries: number;
    resumes: number;
  };
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  lastRefreshed: Date;
}

export function AnalyticsHeader({
  activeTab,
  onTabChange,
  counts,
  isLoading,
  onRefresh,
  onExport,
  lastRefreshed,
}: AnalyticsHeaderProps) {
  const tabs = [
    {
      id: "placements" as AnalyticsTab,
      label: "College Placements",
      icon: GraduationCap,
      count: counts.placements,
    },
    {
      id: "salaries" as AnalyticsTab,
      label: "Fresher Salaries",
      icon: IndianRupee,
      count: counts.salaries,
    },
    {
      id: "resumes" as AnalyticsTab,
      label: "Resume & Interviews",
      icon: FileCheck2,
      count: counts.resumes,
    },
    {
      id: "explorer" as AnalyticsTab,
      label: "Data Explorer",
      icon: Database,
      count: counts.placements + counts.salaries + counts.resumes,
    },
  ];

  const handleRefresh = async () => {
    try {
      await onRefresh();
      toast.success("Analytics datasets synchronized successfully!");
    } catch {
      toast.error("Failed to synchronize datasets");
    }
  };

  const handleExport = () => {
    onExport();
    toast.success("Dataset CSV downloaded successfully!");
  };

  const totalRecords = counts.placements + counts.salaries + counts.resumes;

  return (
    <div className="space-y-6">
      {/* Header & Controls — Matching standard dashboard view headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Placement Analytics &amp; Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Synthesized intelligence across cohort placement performance, compensation benchmarks, and candidate profile evaluation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs disabled:opacity-50"
            title={`Last refreshed: ${lastRefreshed.toLocaleTimeString()}`}
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`} />
            <span>{isLoading ? "Syncing..." : "Sync Datasets"}</span>
          </button>

          {activeTab !== "explorer" && (
            <button
              type="button"
              onClick={handleExport}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-indigo-600/25 shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Export Dataset CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Filter Bar — Styled matching standard dashboard filter bars */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-2xs">
        <div className="flex overflow-x-auto no-scrollbar items-center gap-1.5 w-full sm:w-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-indigo-700/90 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {tab.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Active Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Active Cohort Data:{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {totalRecords.toLocaleString()}
            </strong>{" "}
            records
          </span>
        </div>
      </div>
    </div>
  );
}
