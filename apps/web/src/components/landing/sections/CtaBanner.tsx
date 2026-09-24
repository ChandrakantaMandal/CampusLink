"use client";

import React from "react";
import { Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Placement Season 2026 Ready</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl leading-tight">
              Ready to Supercharge Your Campus Placement Journey?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Whether you are preparing for your dream engineering job, shortlisting talent for your tech company, or streamlining college drives, CAMPUSLINK delivers the intelligence you need.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Free for all college students
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Better-Auth encrypted sessions
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                PWA installable on mobile & desktop
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
