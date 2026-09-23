"use client";

import React from "react";
import { TrendingUp, FileText, Sparkles, Calendar, ArrowUpRight } from "lucide-react";
import type { StudentStats } from "@/data/dashboardData";

interface KeyStatisticsProps {
  stats: StudentStats;
  onCardClick?: (type: string) => void;
}

export default function KeyStatistics({ stats, onCardClick }: KeyStatisticsProps) {
  const cards = [
    {
      id: "readiness",
      title: "Placement Readiness",
      value: `${stats.readinessScore}%`,
      subtitle: stats.readinessLabel,
      trend: "+4.5% this month",
      trendPositive: true,
      icon: TrendingUp,
      gradient: "from-indigo-500/10 to-indigo-500/5",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/60",
      accentBorder: "border-indigo-200 dark:border-indigo-900/50",
    },
    {
      id: "applications",
      title: "Active Applications",
      value: stats.activeApplications.toString(),
      subtitle: "3 under review • 2 shortlisted",
      trend: "Across 12 tech firms",
      trendPositive: true,
      icon: FileText,
      gradient: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/60",
      accentBorder: "border-blue-200 dark:border-blue-900/50",
    },
    {
      id: "jobs",
      title: "AI Job Matches",
      value: stats.aiJobMatches.toString(),
      subtitle: "5 high compatibility (>85%)",
      trend: "3 eligible today",
      trendPositive: true,
      icon: Sparkles,
      gradient: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/60",
      accentBorder: "border-purple-200 dark:border-purple-900/50",
    },
    {
      id: "drives",
      title: "Upcoming Campus Drives",
      value: stats.upcomingDrives.toString(),
      subtitle: "Next: Google (Oct 5)",
      trend: "1 registration pending",
      trendPositive: false,
      icon: Calendar,
      gradient: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/60",
      accentBorder: "border-amber-200 dark:border-amber-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => onCardClick?.(c.id)}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900 cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg} ${c.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <span>View</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {c.title}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {c.value}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                  {c.subtitle}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className={c.trendPositive ? "font-bold text-emerald-600 dark:text-emerald-400" : "font-semibold text-slate-500 dark:text-slate-400"}>
                {c.trend}
              </span>
              <span className="text-slate-400 dark:text-slate-500">Live</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
