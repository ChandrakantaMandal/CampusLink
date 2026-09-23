"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Heart, ExternalLink, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  CAMPUSLINK
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Placement Platform
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering students, universities, and recruiters with deterministic placement intelligence, automated eligibility checks, and real-time career readiness analytics.
            </p>

            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://github.com/HimanshuKumarRout/HireBridge"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#readiness" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Readiness Index
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Eligibility Engine
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  AI Skill Gap Analyzer
                </a>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Student Profile Dashboard
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  AI Placement Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Stakeholders
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#roles" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  For University Students
                </a>
              </li>
              <li>
                <Link href="/login?role=recruiter" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  For Hiring Recruiters (Portal)
                </Link>
              </li>
              <li>
                <Link href="/login?role=tpo" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  For Training &amp; Placement Cells
                </Link>
              </li>
              <li>
                <Link href="/login?role=tpo" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  TPO Command Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Sign In / Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Technology Stack
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>Next.js &amp; React 19</li>
              <li>TypeScript Monorepo</li>
              <li>Express.js &amp; Node.js</li>
              <li>PostgreSQL &amp; Prisma ORM</li>
              <li>Better-Auth &amp; Redis</li>
              <li>PWA Offline Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 sm:flex-row dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} CAMPUSLINK. Built with ❤️ for next-generation campus placement intelligence.
          </p>
          {/*<div className="flex items-center gap-6">
            <Link href="/" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/" className="hover:underline">
              Security Compliance
            </Link>
          </div>*/}
        </div>
      </div>
    </footer>
  );
}
