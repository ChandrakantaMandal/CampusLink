"use client";

import React from "react";

interface AnalyticsPanelProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsPanel({
  title,
  subtitle,
  badge,
  action,
  children,
  className = "",
}: AnalyticsPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700/80 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-2 flex-shrink-0">{action}</div>
        )}
      </div>

      <div className="flex-1 w-full min-h-0">{children}</div>
    </div>
  );
}
