"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Home,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  LifeBuoy,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      {/* Background ambient decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl dark:bg-purple-500/10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-500/5" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Top CampusLink pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-md dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Compass className="h-3.5 w-3.5 animate-spin [animation-duration:8s]" />
          <span>Error 404 • Page Not Found</span>
          <span className="h-1 w-1 rounded-full bg-indigo-400" />
          <span className="flex items-center gap-1 font-mono text-[11px] opacity-75">
            <Sparkles className="h-3 w-3" /> CampusLink Navigator
          </span>
        </div>

        {/* 404 Visual Showcase */}
        <div className="relative my-6 select-none sm:my-8">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
          <div className="relative flex items-center justify-center">
            <h1 className="bg-gradient-to-b from-indigo-600 via-indigo-500 to-purple-700 bg-clip-text font-mono text-8xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-9xl">
              404
            </h1>
          </div>
        </div>

        {/* Headline & Description */}
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
          Off-Campus Coordinates
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
          The page or placement resource you are attempting to reach has either
          graduated, moved to a new route, or never existed in the CampusLink directory.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/35 active:scale-[0.98] sm:w-auto"
          >
            <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Return to Home</span>
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

        {/* Directory Quick Navigation */}
        <div className="mt-12 w-full pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Or jump directly to a verified portal:
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/student/dashboard"
              className="group flex flex-col items-start rounded-xl border border-slate-200/70 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                Student Workspace
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Job applications, drives, readiness score & AI resume review.
              </p>
            </Link>

            <Link
              href="/recruiter/dashboard"
              className="group flex flex-col items-start rounded-xl border border-slate-200/70 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md transition-all hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-purple-500/40 dark:hover:bg-purple-950/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-950/60 dark:text-purple-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                Recruiter Portal
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Post job listings, manage talent pipelines & schedule interviews.
              </p>
            </Link>

            <Link
              href="/admin/dashboard"
              className="group flex flex-col items-start rounded-xl border border-slate-200/70 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md transition-all hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-amber-500/40 dark:hover:bg-amber-950/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white dark:bg-amber-950/60 dark:text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                TPO Placement Cell
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Drive calendar, eligibility policy & batch placement statistics.
              </p>
            </Link>
          </div>
        </div>

        {/* Footer Support Tagline */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <LifeBuoy className="h-3.5 w-3.5 text-slate-400" />
          <span>Need help finding something? Contact your Campus TPO Office.</span>
        </div>
      </div>
    </div>
  );
}
