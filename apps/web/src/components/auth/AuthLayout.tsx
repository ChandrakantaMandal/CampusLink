"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "signin" | "signup";
  title?: string;
  description?: string;
}

export default function AuthLayout({
  children,
  mode,
  title,
  description,
}: AuthLayoutProps) {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-white dark:bg-slate-950 transition-colors">
      {/* LEFT SHOWCASE PANEL (5 cols on lg) */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-12 text-white">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white">
                CAMPUS<span className="text-[#6366F1]">LINK</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                Placement Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Feature Highlights - Distinct for Sign In vs Sign Up */}
        {mode === "signin" ? (
          <div className="relative z-10 space-y-6 my-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Welcome Back • Season 2026</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
              Resume Your Placement Journey Where You Left Off.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Sign in to review live recruitment drives, monitor your shortlists in real time, and practice with AI mock assessments tailored to your target companies.
            </p>

            {/* Live Campus Pulse Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Live Campus Pulse</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Today</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-2xl font-black text-white">12+</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Active Hiring Drives</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-2xl font-black text-emerald-400">98.4%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Match Accuracy</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 pt-1 border-t border-white/10">
                <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Keep your profile updated to stay eligible for Day-1 dream companies.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-6 my-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3.5 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
              <Award className="h-3.5 w-3.5 text-violet-400" />
              <span>New Candidate Registration</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
              Launch Your Tech Career With Verified Placements.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Create your profile to join 50,000+ candidates who use deterministic eligibility scoring and automated gap diagnostics to land top offers.
            </p>

            {/* Signup Value Highlights */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Deterministic Drive Eligibility</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Transparent CGPA, backlogs &amp; skill-criteria matching with zero guesswork.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Skill-Gap Diagnostics</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Get personalized roadmap suggestions to qualify for Tier-1 engineering roles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">1-Click Fast Track Applications</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Apply instantly to verified on-campus and pooled drives without repetitive forms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Better-Auth Encrypted Sessions</span>
          </div>
          <span>&copy; {new Date().getFullYear()} CAMPUSLINK</span>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION PANEL (7 cols on lg) */}
      <div className="flex lg:col-span-7 flex-col justify-between p-6 sm:p-10 lg:p-16">
        {/* Top Bar inside panel */}
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Switch theme</span>
            <ModeToggle />
          </div>
        </div>

        {/* Main Auth Container */}
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header Title & Tab Switcher */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {title || (mode === "signin" ? "Welcome Back to CAMPUSLINK" : "Create Your Account")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {description ||
                (mode === "signin"
                  ? "Enter your credentials to access your placement dashboard"
                  : "Join the verified placement intelligence network")}
            </p>

            {/* Pill Toggle for Sign In vs Sign Up */}
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <Link
                href={(`/login${roleQuery}` as Route)}
                className={`flex-1 rounded-lg py-2 text-center text-xs sm:text-sm font-bold transition-all ${
                  mode === "signin"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                href={(`/signup${roleQuery}` as Route)}
                className={`flex-1 rounded-lg py-2 text-center text-xs sm:text-sm font-bold transition-all ${
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Bottom micro-footer */}
        <div className="text-center pt-8 text-[11px] text-slate-400">
          By continuing, you agree to CAMPUSLINK&apos;s Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
