"use client";

import React from "react";
import { OfferTrackingCard } from "@/components/dashboard/student/OfferTrackingCard";
import { mockDashboardData } from "@/data/dashboardData";
import { Gift, Award } from "lucide-react";

export default function StudentOffers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Gift className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Offer Letters & Placement Verification
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official job offers verified by the university placement cell, digital Letters of Intent (LOI), and acceptance status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" />
            1 Offer Extended
          </span>
        </div>
      </div>

      {/* Main Offers Component */}
      <div className="min-w-0">
        <OfferTrackingCard offers={mockDashboardData.offers} />
      </div>
    </div>
  );
}
