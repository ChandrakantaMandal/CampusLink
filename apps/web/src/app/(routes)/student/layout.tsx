"use client";

import {
  ArrowRight,
  Lock,
  LogIn,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";


import { authClient } from "@/lib/auth-client";
import StudentHeader from "../../../components/dashboard/student/StudentHeader";
import StudentSidebar from "../../../components/dashboard/student/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

   const { data: session, isPending } = authClient.useSession();

  const studentName =  "Student";
  const department = "Computer Science & Engineering";



  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

          <p className="text-xs font-semibold text-slate-500">
            Verifying student session...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 text-center bg-slate-50 dark:bg-slate-950">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 blur-xl animate-pulse" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/40 shadow-2xl shadow-amber-500/15 text-amber-500 dark:text-amber-400">
            <Lock className="h-11 w-11 animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 px-4 py-1.5 text-xs font-bold mb-4">
          <ShieldAlert className="h-4 w-4" />
          <span>Authentication Required • Portal Locked</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight max-w-xl">
          Student Portal is Locked
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
          You accessed the student portal directly from the landing page without
          signing in. To view your placement readiness scores, live campus
          drives, application tracker, and profile, please{" "}
          <strong className="text-indigo-600 dark:text-indigo-400">
            log in to your account
          </strong>
          .
        </p>

        <div className="mt-8 flex items-center justify-center w-full max-w-xs">
          <Link
            href="/login?role=student"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <LogIn className="h-4 w-4" />
            <span>Login to Access</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 max-w-md">
          <p>
            Sidebar navigation is locked in guest mode. Once you log in, all 8
            dashboard modules and profile tools will automatically unlock.
          </p>
        </div>
      </div>
    );
  }


  if (session.user.role !== "STUDENT") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center max-w-md">
          <ShieldAlert className="mx-auto h-14 w-14 text-red-500" />

          <h1 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
            Access Denied
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Your account does not have permission to access the student portal.
            Please log in with your student credentials.
          </p>

          <Link
            href="/login?role=student"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition"
          >
            <LogIn className="h-4 w-4" />
            Login as Student
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased selection:bg-blue-500/20 selection:text-blue-500">
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
