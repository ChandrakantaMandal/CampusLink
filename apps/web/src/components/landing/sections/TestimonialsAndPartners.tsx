"use client";

import { Quote, Star } from "lucide-react";
import { partners, testimonials } from "../common/common";

export default function TestimonialsAndPartners() {
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
