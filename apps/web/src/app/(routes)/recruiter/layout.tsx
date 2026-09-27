"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, LogIn, ArrowRight, Building2, Briefcase } from "lucide-react";
import RecruiterSidebar from "@/components/dashboard/recruiter/RecruiterSidebar";
import RecruiterHeader from "@/components/dashboard/recruiter/RecruiterHeader";
import { useAuth } from "@/lib/use-auth";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isPending } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased selection:bg-blue-500/20 selection:text-blue-500">
      <RecruiterSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <RecruiterHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {isPending ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="text-xs font-semibold text-slate-500">Verifying corporate recruiter access...</p>
              </div>
            </div>
          ) : !isAuthenticated ? (
            /* Locked State when accessing directly without logging in */
            <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 sm:p-12 text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 blur-xl animate-pulse" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-500/40 shadow-2xl shadow-blue-500/15 text-blue-600 dark:text-blue-400">
                  <Building2 className="h-11 w-11 animate-pulse" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-300/80 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 px-4 py-1.5 text-xs font-bold mb-4 shadow-xs">
                <Briefcase className="h-4 w-4" />
                <span>Corporate Recruiter Workspace &bull; Partner Portal</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight max-w-xl">
                Recruiter Portal Access
              </h1>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                You accessed the CAMPUSLINK Recruiter Dashboard. To create campus jobs, review student applications, schedule interviews, and evaluate AI candidate matches, please sign in with your company recruiter credentials.
              </p>

              <div className="mt-8 flex items-center justify-center w-full max-w-xs">
                <Link
                  href="/login?role=recruiter"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login as Recruiter</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 max-w-md shadow-xs">
                <p>
                  Quick Demo: Click above and select &ldquo;Fill Form&rdquo; for Recruiter credentials (<code className="text-blue-600 dark:text-blue-400">recruiter@campuslink.edu</code>) to test all corporate hiring tools.
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
