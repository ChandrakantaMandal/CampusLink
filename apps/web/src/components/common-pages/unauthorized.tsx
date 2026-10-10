"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Home,
  LogIn,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Info,
} from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 text-slate-900 selection:bg-amber-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      {/* Background ambient security lighting */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl dark:bg-amber-500/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rose-500/15 blur-3xl dark:bg-rose-500/10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Security Shield Icon with Glowing Radar Rings */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 animate-pulse rounded-full bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-purple-500/25 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-300/80 bg-white shadow-2xl shadow-amber-500/20 dark:border-amber-500/40 dark:bg-slate-900">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Lock className="h-8 w-8 animate-pulse" />
              <ShieldAlert className="absolute -top-1 -right-1 h-5 w-5 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-800 shadow-sm backdrop-blur-md dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Security Clearance Required • 401 Unauthorized</span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
          Access Restricted
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
          You do not have the required permissions or an active session to
          access this CampusLink workspace. Please verify your credentials or
          sign in with an authorized institutional account.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/35 active:scale-[0.98] sm:w-auto"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to CampusLink</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            onClick={() => router.back()}
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] sm:w-auto dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Institutional Role Portals */}
        <div className="mt-12 w-full pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Switch to your designated role login:
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/login?role=student"
              className="group flex flex-col items-start rounded-xl border border-slate-200/70 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <h3 className="mt-2.5 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                Student Sign In
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Access drives, assessments & track interview status.
              </p>
            </Link>

            <Link
              href="/login?role=recruiter"
              className="group flex flex-col items-start rounded-xl border border-slate-200/70 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md transition-all hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-purple-500/40 dark:hover:bg-purple-950/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-950/60 dark:text-purple-400">
                <Briefcase className="h-4 w-4" />
              </div>
              <h3 className="mt-2.5 text-sm font-bold text-slate-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                Recruiter Sign In
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Manage hiring campaigns & candidate shortlists.
              </p>
            </Link>

            <Link
              href="/login?role=tpo"
              className="group flex flex-col items-start rounded-xl border border-slate-200/70 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md transition-all hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-amber-500/40 dark:hover:bg-amber-950/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white dark:bg-amber-950/60 dark:text-amber-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="mt-2.5 text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                TPO Admin Sign In
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Institutional placement cell governance & controls.
              </p>
            </Link>
          </div>
        </div>

        {/* Security Policy Notice Box */}
        <div className="mt-8 flex w-full items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-left text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="leading-relaxed">
            <strong>Security Notice:</strong> CampusLink implements role-based
            access control to protect student placement records and company
            confidentiality. If you believe this is an error, please reach out
            to your institutional administrator.
          </p>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Back to CampusLink Public Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
