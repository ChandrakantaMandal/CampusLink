"use client";

import React, { useMemo } from "react";
import { Sparkles, TrendingUp, Briefcase, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

interface WelcomeBannerProps {
  studentName?: string;
  readinessScore?: number;
  appliedCount?: number;
  matchesCount?: number;
  upcomingDrivesCount?: number;
  onExploreDrives?: () => void;
  onCheckReadiness?: () => void;
}

export default function WelcomeBanner({
  studentName = "Himanshu",
  readinessScore = 78,
  appliedCount = 12,
  matchesCount = 8,
  upcomingDrivesCount = 3,
  onExploreDrives,
  onCheckReadiness,
}: WelcomeBannerProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl dark:border-indigo-900/50">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side text */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/25 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Placement Management System</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {greeting}, {studentName}!
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
            Welcome to your personalized CAMPUSLINK dashboard. Track your placement readiness, inspect AI skill gap reports, and apply to upcoming on-campus drives.
          </p>

          {/* Quick Metrics Ticker */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
              <span>Readiness:</span>
              <span className="font-black text-indigo-300">{readinessScore}%</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Applied:</span>
              <span className="font-black text-emerald-300">{appliedCount}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Briefcase className="h-3.5 w-3.5 text-purple-400" />
              <span>AI Matches:</span>
              <span className="font-black text-purple-300">{matchesCount}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Upcoming Drives:</span>
              <span className="font-black text-amber-300">{upcomingDrivesCount}</span>
            </div>
          </div>
        </div>

        {/* Right side CTA actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onCheckReadiness}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
          >
            <span>Check AI Readiness</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onExploreDrives}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
          >
            <span>Explore Campus Drives</span>
          </button>
        </div>
      </div>
    </div>
  );
}
