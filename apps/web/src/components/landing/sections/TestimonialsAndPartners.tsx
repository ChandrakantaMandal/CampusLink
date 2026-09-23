"use client";

import React from "react";
import { Star, Quote, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TestimonialsAndPartners() {
  const partners = [
    "Google",
    "Microsoft",
    "Amazon",
    "Oracle",
    "Cisco",
    "Infosys",
    "TCS",
    "Deloitte",
    "Goldman Sachs",
    "Atlassian",
  ];

  const testimonials = [
    {
      quote:
        "CAMPUSLINK identified that my lack of Docker and Redis was the only gap holding back my resume from Tier-1 shortlists. I focused on those, boosted my readiness score to 96, and cracked an SDE role at Microsoft!",
      name: "Ananya Sharma",
      role: "Software Engineer @ Microsoft",
      sub: "B.Tech CSE Graduate • Batch 2025",
      avatar: "AS",
      verified: "Placed via CAMPUSLINK",
      rating: 5,
    },
    {
      quote:
        "Managing 2,800 engineering students across 65 on-campus drives used to mean endless spreadsheets and manual verification headaches. CAMPUSLINK automated eligibility cutoffs and made our placement season 4x smoother.",
      name: "Dr. Rajesh K.",
      role: "Head of Training & Placement",
      sub: "Premier National Engineering College",
      avatar: "RK",
      verified: "TPO Partner",
      rating: 5,
    },
    {
      quote:
        "Zero unqualified candidates reached our technical interview panel. The deterministic eligibility engine verified CGPA and backlogs beforehand, allowing us to focus only on top-tier engineering talent.",
      name: "Priya Nair",
      role: "Campus Talent Acquisition Lead",
      sub: "Global FinTech Solutions",
      avatar: "PN",
      verified: "Hiring Partner",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Partner Logo Marquee Bar */}
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Trusted by Hiring Partners Across Top Global Tech & Enterprise Firms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2 opacity-80">
            {partners.map((company, i) => (
              <span
                key={i}
                className="text-base sm:text-lg font-black tracking-tight text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, rIdx) => (
                    <Star key={rIdx} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="h-7 w-7 text-indigo-200 dark:text-indigo-900" />

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.role}
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {t.verified}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
