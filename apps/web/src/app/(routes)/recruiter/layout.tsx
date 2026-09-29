"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  LogIn,
  ArrowRight,
  Building2,
  Briefcase,
  ShieldAlert,
} from "lucide-react";

import RecruiterSidebar from "@/components/dashboard/recruiter/RecruiterSidebar";
import RecruiterHeader from "@/components/dashboard/recruiter/RecruiterHeader";
import { authClient } from "@/lib/auth-client";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();


  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="text-xs font-semibold text-slate-500">
            Verifying corporate recruiter access...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 text-center bg-slate-50 dark:bg-slate-950">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-violet-500/20 blur-xl animate-pulse" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-500/40 shadow-2xl shadow-blue-500/15 text-blue-600 dark:text-blue-400">
            <Building2 className="h-11 w-11 animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-300/80 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 px-4 py-1.5 text-xs font-bold mb-4">
          <Briefcase className="h-4 w-4" />
          <span>Corporate Recruiter Workspace • Partner Portal</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight max-w-xl">
          Recruiter Portal Access
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
          You accessed the CAMPUSLINK Recruiter Dashboard. To create campus
          jobs, review student applications, schedule interviews, and evaluate
          AI candidate matches, please sign in with your company recruiter
          credentials.
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

        <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 max-w-md">
          <p>
            Quick Demo: Click above and select &ldquo;Fill Form&rdquo; for
            Recruiter credentials (
            <code className="text-blue-600 dark:text-blue-400">
              recruiter@campuslink.edu
            </code>
            ) to test all corporate hiring tools.
          </p>
        </div>
      </div>
    );
  }
  
  if (session.user.role !== "RECRUITER") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center max-w-md">
          <ShieldAlert className="mx-auto h-14 w-14 text-red-500" />

          <h1 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
            Access Denied
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Your account does not have permission to access the recruiter
            portal. Please log in with your recruiter credentials.
          </p>

          <Link
            href="/login?role=recruiter"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
          >
            <LogIn className="h-4 w-4" />
            Login as Recruiter
          </Link>
        </div>
      </div>
    );
  }

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
          {children}
        </main>
      </div>
    </div>
  );
}
