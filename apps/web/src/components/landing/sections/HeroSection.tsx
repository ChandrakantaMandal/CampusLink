"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Building,
  GraduationCap,
  Briefcase,
  Star,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@HireBridge/ui/components/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-14 md:pb-28">
      {/* Dynamic Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-pink-500/10 blur-3xl dark:from-indigo-600/20 dark:via-purple-600/15 dark:to-cyan-600/10" />
        <div className="absolute top-1/3 -left-48 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute bottom-10 -right-48 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-600/10" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & CTAs */}
          <div className="space-y-8 text-center lg:col-span-7 lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur-md shadow-xs transition-transform hover:scale-105 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Next-Gen Campus Placement Intelligence</span>
              <span className="hidden sm:inline-block text-indigo-400 dark:text-indigo-600">•</span>
              <span className="hidden sm:inline-block text-indigo-600 font-medium dark:text-indigo-300">
                Powered by Deterministic AI
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:leading-[1.12] dark:text-white">
              Bridge The Gap Between{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
                Campus Ambition
              </span>{" "}
              & Elite Careers.
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg md:text-xl lg:mx-0 dark:text-slate-300 leading-relaxed">
              The all-in-one placement management ecosystem connecting students, universities, and premier recruiters. Real-time readiness scoring, zero-hallucination eligibility checking, and automated campus hiring drives.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/profile" className="w-full sm:w-auto">
                <Button className="h-13 w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-8 text-base font-bold text-white shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 hover:shadow-indigo-600/40">
                  <span className="flex items-center gap-2">
                    Launch Student Profile
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
              <a href="#readiness" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-13 w-full sm:w-auto rounded-xl border-slate-300 bg-white/80 px-7 text-base font-semibold text-slate-700 backdrop-blur-md hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                    Calculate Readiness Score
                  </span>
                </Button>
              </a>
            </div>

            {/* Key Trust Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  98.4%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Placement Rate
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  500+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Hiring Partners
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  50,000+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Active Students
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  4.2x
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Faster Shortlisting
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AI Placement Scorecard Card Preview */}
          <div className="relative lg:col-span-5">
            {/* Ambient Backlight */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl dark:opacity-30"></div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
              {/* Header inside Mockup */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30">
                    HR
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Himanshu Rout
                      </h2>
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      B.Tech Computer Science • Final Year
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Eligible for 18 Drives
                </span>
              </div>

              {/* Placement Readiness Composite Gauge */}
              <div className="my-5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-white shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                      CAMPUSLINK Readiness Index
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">94</span>
                      <span className="text-xs font-semibold text-indigo-300">/ 100 • Tier-1 Ready</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-400/50 bg-indigo-500/20 text-xs font-bold text-indigo-200">
                    Top 5%
                  </div>
                </div>

                {/* Micro Progress Bars */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Academics (CGPA 8.8)</span>
                    <span className="font-semibold text-indigo-200">95%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: "95%" }} />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                    <span>Technical & Coding Assessments</span>
                    <span className="font-semibold text-indigo-200">92%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>

              {/* Real-time Match & Skill Gap Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Target Role: Full-Stack Engineer
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">96% Skill Fit</span>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> TypeScript
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Next.js
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> PostgreSQL
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Prisma
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800">
                    <Sparkles className="h-3 w-3" /> Docker (In Progress)
                  </span>
                </div>

                {/* Matched Live Drive Pill */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold text-xs">
                        GO
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Software Engineer 2026 Drive
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Package: 18 - 24 LPA • Closes in 2 days
                        </div>
                      </div>
                    </div>
                    <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs">
                      Matched
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtle Footer inside Card */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>Deterministic Zero-Bias Match</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">Verified by Better-Auth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
