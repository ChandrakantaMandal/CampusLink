"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Bell,
  AlertTriangle,
  Gift,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Filter,
  Check,
} from "lucide-react";
import {
  mockRecruiterNotifications,
  type RecruiterNotification,
} from "../mock-recruiter-data";
import { toast } from "sonner";

export default function RecruiterNotificationsView() {
  const [notifications, setNotifications] = useState<RecruiterNotification[]>(mockRecruiterNotifications);
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = notifications.filter((n) => {
    return filterType === "ALL" || n.type === filterType;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const getIcon = (type: RecruiterNotification["type"]) => {
    switch (type) {
      case "conflict":
        return <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />;
      case "offer":
        return <Gift className="h-5 w-5 text-emerald-500" />;
      case "ai_match":
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      case "application":
        return <ClipboardList className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Recruiter Notification Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time campus placement updates, AI match triggers, and schedule conflict alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Check className="h-4 w-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {["ALL", "conflict", "ai_match", "offer", "application"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              filterType === t
                ? "bg-blue-600 text-white shadow-xs hover:bg-blue-500"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            }`}
          >
            {t === "conflict" ? "Conflicts (Alert)" : t.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((notif) => (
          <div
            key={notif.id}
            className={`rounded-2xl border p-4 transition-all ${
              notif.isRead
                ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                : "border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10 shadow-xs"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {notif.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {notif.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.message}
                </p>

                {notif.actionUrl && (
                  <div className="pt-2">
                    <Link
                      href={notif.actionUrl as Route}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Resolve / Review details &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
