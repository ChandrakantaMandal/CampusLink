"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  note?: string;
  icon: LucideIcon;
  tone?: "purple" | "mint" | "orange" | "blue" | "indigo" | "rose";
  trend?: string;
  badge?: string;
}

const toneStyles = {
  purple: {
    bg: "from-purple-500/10 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/40",
    iconBg: "bg-purple-600 text-white shadow-purple-500/20",
    border: "border-purple-200/60 dark:border-purple-900/30",
    accent: "text-purple-600 dark:text-purple-400",
  },
  mint: {
    bg: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/40",
    iconBg: "bg-emerald-600 text-white shadow-emerald-500/20",
    border: "border-emerald-200/60 dark:border-emerald-900/30",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    bg: "from-amber-500/10 to-orange-500/10 dark:from-amber-950/40 dark:to-orange-950/40",
    iconBg: "bg-amber-600 text-white shadow-amber-500/20",
    border: "border-amber-200/60 dark:border-amber-900/30",
    accent: "text-amber-600 dark:text-amber-400",
  },
  blue: {
    bg: "from-blue-500/10 to-cyan-500/10 dark:from-blue-950/40 dark:to-cyan-950/40",
    iconBg: "bg-blue-600 text-white shadow-blue-500/20",
    border: "border-blue-200/60 dark:border-blue-900/30",
    accent: "text-blue-600 dark:text-blue-400",
  },
  indigo: {
    bg: "from-indigo-500/10 to-violet-500/10 dark:from-indigo-950/40 dark:to-violet-950/40",
    iconBg: "bg-indigo-600 text-white shadow-indigo-500/20",
    border: "border-indigo-200/60 dark:border-indigo-900/30",
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  rose: {
    bg: "from-rose-500/10 to-pink-500/10 dark:from-rose-950/40 dark:to-pink-950/40",
    iconBg: "bg-rose-600 text-white shadow-rose-500/20",
    border: "border-rose-200/60 dark:border-rose-900/30",
    accent: "text-rose-600 dark:text-rose-400",
  },
};

export function AnalyticsStatCard({
  title,
  value,
  note,
  icon: Icon,
  tone = "indigo",
  trend,
  badge,
}: AnalyticsStatCardProps) {
  const currentTone = toneStyles[tone] || toneStyles.indigo;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${currentTone.border} bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group`}
    >
      {/* Background soft glow gradient */}
      <div
        className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${currentTone.bg} blur-2xl pointer-events-none opacity-80`}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
              {value}
            </h3>
            {trend && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {trend}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl shadow-md ${currentTone.iconBg} transition-transform group-hover:scale-105 duration-200 flex-shrink-0`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(note || badge) && (
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{note}</span>
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 ${currentTone.accent}`}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
