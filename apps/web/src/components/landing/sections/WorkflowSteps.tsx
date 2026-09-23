"use client";

import React from "react";
import Link from "next/link";
import {
  UserCheck,
  Cpu,
  Target,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@HireBridge/ui/components/button";

export default function WorkflowSteps() {
  const steps = [
    {
      step: "01",
      title: "Build Verified Profile",
      icon: UserCheck,
      description:
        "Input academic history, verified CGPA, portfolio & GitHub links, certifications, and upload your resume. Verified by your university placement cell.",
      badge: "Step 1 • Profile Onboarding",
    },
    {
      step: "02",
      title: "AI Analysis & Readiness Index",
      icon: Cpu,
      description:
        "CAMPUSLINK computes your multi-factor placement readiness score, parses resume keywords, and outlines exact skill gaps to bridge before interview day.",
      badge: "Step 2 • Intelligence Scoring",
    },
    {
      step: "03",
      title: "Deterministic Drive Matching",
      icon: Target,
      description:
        "When top companies post campus drives, our zero-hallucination engine matches eligible students. Apply with a single click without repetitive forms.",
      badge: "Step 3 • Precision Matching",
    },
    {
      step: "04",
      title: "Ace Interviews & Track Offers",
      icon: Trophy,
      description:
        "Take online coding assessments, receive scheduled interview slots, monitor multi-round status in real time, and accept verified offer letters.",
      badge: "Step 4 • Career Launch",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span>Seamless 4-Stage Process</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            How CAMPUSLINK Drives Campus Success
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            From first semester onboarding to the final handshake with top tech recruiters.
          </p>
        </div>

        {/* Steps Grid with connecting lines */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-indigo-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
              >
                {/* Step Number Top Watermark */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-indigo-600/30 dark:text-indigo-400/20">
                    {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {item.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Fully Automated</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-14 text-center">
          <Link href="/profile">
            <Button className="h-13 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-base font-bold text-white shadow-xl shadow-indigo-600/25 hover:scale-105">
              <span>Start Stage 1 — Create Your Profile</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
