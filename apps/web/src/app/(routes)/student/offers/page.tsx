"use client";

import React from "react";
import { OfferTrackingCard } from "@/components/dashboard/student/OfferTrackingCard";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentOffers } from "@/hooks/use-student";
import { toOfferDetails } from "@/lib/dashboard-adapters";
import { Gift, Award } from "lucide-react";

export default function StudentOffers() {
  const offers = useStudentOffers();

  const items = offers.data ? toOfferDetails(offers.data) : null;
  const total = offers.data?.stats.total ?? items?.length ?? null;

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
            {total !== null ? `${total} Offer${total === 1 ? "" : "s"} Extended` : "—"}
          </span>
        </div>
      </div>

      {/* Main Offers Component */}
      <div className="min-w-0">
        {items ? (
          <OfferTrackingCard offers={items} onAccepted={offers.refresh} />
        ) : offers.error ? (
          <AggregateError message={offers.error} onRetry={offers.refresh} />
        ) : (
          <AggregateLoading label="Loading your offers..." />
        )}
      </div>
    </div>
  );
}
