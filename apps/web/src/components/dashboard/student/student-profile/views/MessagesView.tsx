"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Bell,
  CheckCircle2,
  ArrowRight,
  Clock,
  Send,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export function MessagesView() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = () => {
    setIsSubscribed(true);
    toast.success("Notification preference saved! 🎉", {
      description:
        "We'll notify you as soon as direct recruiter & TPO messaging goes live on CAMPUSLINK.",
    });
  };

  const upcomingFeatures = [
    {
      icon: GraduationCap,
      title: "University TPO Direct Desk",
      description:
        "Communicate directly with university placement cell officers for eligibility questions, drive registrations, and official circulars.",
      color: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Building2,
      title: "Verified Recruiter Inquiries",
      description:
        "Connect with corporate talent acquisition teams once your profile is shortlisted for interviews or technical rounds.",
      color: "from-purple-500 to-indigo-600",
      accentBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      icon: Send,
      title: "Real-Time Drive & Slot Updates",
      description:
        "Receive instant meeting links, venue hall ticket confirmations, and round status changes straight to your inbox.",
      color: "from-amber-500 to-rose-600",
      accentBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      icon: ShieldCheck,
      title: "End-to-End Institutional Security",
      description:
        "Strictly encrypted, official campus placement communication channels protecting student data and recruiter confidentiality.",
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> Direct Communications
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Placement Inbox & Recruiter Messages
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Communicate directly with the University TPO Cell and verified
              corporate recruiters.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-xs self-start sm:self-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Hero Coming Soon Showcase Card */}
      <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 sm:p-12 shadow-sm overflow-hidden text-center">
        {/* Ambient background glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Floating Icon with Gradient Backdrop */}
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25 ring-8 ring-indigo-500/10 dark:ring-indigo-500/20">
            <MessageSquare className="w-8 h-8" />
          </div>

          {/* Heading and Subtext */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>In Active Development</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Direct Student-Recruiter &amp; TPO Messaging
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              We&apos;re building a dedicated, real-time communications hub
              inside CAMPUSLINK. Soon you&apos;ll be able to receive one-on-one
              interview feedback, direct messages from university TPO
              coordinators, and scheduling updates directly in your workspace.
            </p>
          </div>

          {/* Action Button: Notify Me */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleNotifyMe}
              disabled={isSubscribed}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer ${
                isSubscribed
                  ? "bg-emerald-600 text-white shadow-emerald-600/20 cursor-default"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:scale-[1.02]"
              }`}
            >
              {isSubscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You&apos;ll be notified when live!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Notify Me When Live</span>
                </>
              )}
            </button>

            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
          {upcomingFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${feature.accentBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Targeted rollout for upcoming campus placement season</span>
        </div>
      </div>
    </div>
  );
}
