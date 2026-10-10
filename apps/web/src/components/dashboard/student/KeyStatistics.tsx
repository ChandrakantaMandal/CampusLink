"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  TrendingUp,
  FileText,
  Sparkles,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import type { StudentStats } from "@/data/dashboardData";

interface KeyStatisticsProps {
  stats: StudentStats;
  onCardClick?: (type: string) => void;
}

interface StatCardItem {
  id: string;
  title: string;
  href: Route;
  value: string;
  subtitle: string;
  trend: string;
  trendPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconColor: string;
  iconBg: string;
  accentBorder: string;
}

export default function KeyStatistics({
  stats,
  onCardClick,
}: KeyStatisticsProps) {
  const cards: StatCardItem[] = [
    {
      id: "readiness",
      title: "Placement Readiness",
      href: "/student/readiness",
      value: `${stats.readinessScore}%`,
      subtitle: stats.readinessLabel,
      trend:
        stats.readinessScore >= 75
          ? "Tier-1 Competitive"
          : stats.readinessScore >= 40
            ? "Placement Track"
            : "Needs Improvement",
      trendPositive: stats.readinessScore >= 60,
      icon: TrendingUp,
      gradient: "from-indigo-500/10 to-indigo-500/5",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/60",
      accentBorder: "border-indigo-200 dark:border-indigo-900/50",
    },
    {
      id: "applications",
      title: "Active Applications",
      href: "/student/applications",
      value: stats.activeApplications.toString(),
      subtitle:
        stats.activeApplications === 0
          ? "0 in pipeline"
          : stats.activeApplications === 1
            ? "1 in review pipeline"
            : `${stats.activeApplications} in review pipeline`,
      trend:
        stats.activeApplications === 0
          ? "No active applications"
          : "In recruiter pipeline",
      trendPositive: stats.activeApplications > 0,
      icon: FileText,
      gradient: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/60",
      accentBorder: "border-blue-200 dark:border-blue-900/50",
    },
    {
      id: "jobs",
      title: "AI Job Matches",
      href: "/student/jobs",
      value: stats.aiJobMatches.toString(),
      subtitle:
        stats.aiJobMatches === 0
          ? "0 matching roles"
          : stats.aiJobMatches === 1
            ? "1 role matched"
            : `${stats.aiJobMatches} roles matched`,
      trend:
        stats.aiJobMatches === 0
          ? "Add skills to discover jobs"
          : "Eligible based on profile",
      trendPositive: stats.aiJobMatches > 0,
      icon: Sparkles,
      gradient: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/60",
      accentBorder: "border-purple-200 dark:border-purple-900/50",
    },
    {
      id: "drives",
      title: "Upcoming Campus Drives",
      href: "/student/drives",
      value: stats.upcomingDrives.toString(),
      subtitle:
        stats.upcomingDrives === 0
          ? "0 scheduled drives"
          : stats.upcomingDrives === 1
            ? "1 drive scheduled"
            : `${stats.upcomingDrives} drives scheduled`,
      trend:
        stats.upcomingDrives === 0
          ? "Awaiting TPO announcements"
          : "Registration open",
      trendPositive: stats.upcomingDrives > 0,
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
          <Link
            key={c.id}
            href={c.href}
            onClick={() => onCardClick?.(c.id)}
            className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-800 dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg} ${c.iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <span>View</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
              <span
                className={
                  c.trendPositive
                    ? "font-bold text-emerald-600 dark:text-emerald-400"
                    : "font-semibold text-slate-500 dark:text-slate-400"
                }
              >
                {c.trend}
              </span>
              <span className="text-slate-400 dark:text-slate-500">Live</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
