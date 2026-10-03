"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Loader from "@/components/loader";

export function AggregateLoading({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
      <Loader />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  );
}

export function AggregateError({
  message = "Failed to load data",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center dark:border-red-900 dark:bg-red-950/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
        <AlertCircle className="h-5 w-5" />
      </div>
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/10 dark:border-red-800 dark:text-red-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      ) : null}
    </div>
  );
}
