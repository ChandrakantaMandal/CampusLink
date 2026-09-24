"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@CampusLink/ui/components/button";

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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/student/profile" className="w-full sm:w-auto">
                <Button className="h-13 w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 text-base font-bold text-white shadow-xl shadow-indigo-500/30 hover:scale-105">
                  <span>Open Student Profile</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login?role=recruiter" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-13 w-full sm:w-auto rounded-xl border-slate-700 bg-slate-800/80 px-7 text-base font-semibold text-white backdrop-blur-md hover:bg-slate-700"
                >
                  <span>Recruiter / TPO Sign In 🔐</span>
                </Button>
              </Link>
            </div>

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
