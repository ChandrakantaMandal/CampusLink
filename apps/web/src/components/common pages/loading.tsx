import React from "react";
import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50/80 p-4 text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950/80 dark:text-slate-100">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/10" />

      {/* Center Branded Loader Card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Brand Emblem with Concentric Spinners */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer pulsed glow */}
          <div className="absolute inset-0 animate-ping rounded-3xl bg-indigo-500/20 duration-1000" />
          
          {/* Outer spinning ring */}
          <div className="absolute inset-0 animate-spin rounded-3xl border-2 border-dashed border-indigo-400/40 [animation-duration:6s] dark:border-indigo-400/30" />
          
          {/* Middle counter-spinning ring */}
          <div className="absolute inset-2 animate-spin rounded-2xl border-2 border-t-indigo-600 border-r-transparent border-b-purple-500 border-l-transparent [animation-direction:reverse] [animation-duration:2.5s]" />

          {/* Central Logo Box */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
            <GraduationCap className="h-7 w-7 animate-bounce [animation-duration:2s]" />
          </div>
        </div>

        {/* Brand Name & Loading Indicator */}
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              CAMPUSLINK
            </span>
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
          </div>

          <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Loading Workspace
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Synchronizing placement opportunities & session credentials...
          </p>
        </div>

        {/* Progress Bar Indicator */}
        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
          <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
        </div>
      </div>
    </div>
  );
}
