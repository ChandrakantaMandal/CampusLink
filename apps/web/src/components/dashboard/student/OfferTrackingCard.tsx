"use client";

import React, { useState } from "react";
import {
  Award,
  FileCheck2,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  DollarSign,
  ArrowRight
} from "lucide-react";
import type { OfferDetails } from "@/data/dashboardData";
import { toast } from "sonner";

interface OfferTrackingCardProps {
  offers: OfferDetails[];
}

export function OfferTrackingCard({ offers }: OfferTrackingCardProps) {
  const [acceptedOfferId, setAcceptedOfferId] = useState<string | null>(null);

  const handleAccept = (offer: OfferDetails) => {
    setAcceptedOfferId(offer.id);
    toast.success(`Offer formally accepted! Congratulations! 🎉`, {
      description: `CAMPUSLINK has notified ${offer.company} Placement Officer. Next step: Pre-onboarding portal.`,
    });
  };

  const handleDownload = (offer: OfferDetails) => {
    toast.info(`Downloading Letter of Intent for ${offer.company}`, {
      description: `Official campus offer document with digital seal.`,
    });
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-emerald-300/80 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/80 via-white/80 to-teal-50/80 dark:from-emerald-950/30 dark:via-slate-900/60 dark:to-teal-950/20 backdrop-blur-md p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Campus Offer Tracking
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                Active Offer
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified campus placement contract & acceptance portal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/60">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Documents Verified</span>
        </div>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => {
          const isAccepted = acceptedOfferId === offer.id;

          return (
            <div
              key={offer.id}
              className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white/90 dark:bg-slate-800/60 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                    {offer.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {offer.company}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {offer.role}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>Offered on {offer.offerDate}</span>
                      <span>•</span>
                      <span>Expected Joining: {offer.joiningDate}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Total Compensation (CTC)
                  </div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {offer.ctc}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                    Fixed Component + Variable Incentive
                  </div>
                </div>
              </div>

              {/* Status and Action Row */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Offer Letter Issued
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />
                    KYC & Degree Validated
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(offer)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download LOI
                  </button>

                  {isAccepted ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Offer Accepted
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAccept(offer)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                    >
                      Accept Offer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
