"use client";

import React from "react";
import { Check, Save, RotateCcw, Loader2, LogIn, Lock } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  onReset: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  isAuthenticated?: boolean;
}

export default function SaveButton({
  onSave,
  onReset,
  hasChanges,
  isSaving,
  isAuthenticated = false,
}: SaveButtonProps) {
  return (
    <div className="sticky bottom-6 z-30 mt-8 flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 p-4 shadow-xl backdrop-blur-md transition-all gap-3 sm:gap-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full transition-colors ${
            !isAuthenticated
              ? "bg-amber-500 animate-pulse"
              : hasChanges
              ? "bg-amber-500 animate-pulse"
              : "bg-emerald-500"
          }`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
            {!isAuthenticated
              ? (hasChanges ? "Unsaved changes (Sign in required to save)" : "Guest Preview Mode • Sign in to save profile")
              : (hasChanges ? "Unsaved changes on your profile" : "All profile changes saved")}
          </span>
          {!isAuthenticated && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/60 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              <Lock className="h-3 w-3" />
              Sign-In Required
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {hasChanges && (
          <button
            type="button"
            onClick={onReset}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>Discard</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-2 rounded-lg px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md active:scale-98 transition-all disabled:opacity-60 cursor-pointer ${
            !isAuthenticated
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25"
              : "bg-[#6366F1] shadow-indigo-500/20 hover:bg-[#4F46E5]"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : !isAuthenticated ? (
            <>
              <LogIn className="h-4 w-4" />
              <span>Sign In to Save</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
