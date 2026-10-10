"use client";

import React, { useEffect, useState } from "react";
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
import type { RecruiterNotification } from "../recruiter.types";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/recruiter.api";
import { toast } from "sonner";

export default function RecruiterNotificationsView() {
  const [notifications, setNotifications] = useState<RecruiterNotification[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyNotifications()
      .then((feed) => {
        if (!cancelled) {
          setNotifications(feed.notifications);
          setUnreadCount(feed.unreadCount ?? 0);
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load notifications");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = notifications.filter((n) => {
    return filterType === "ALL" || n.type === filterType;
  });

  const handleMarkAllRead = async () => {
    if (mutating) return;
    setMutating(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications as read");
    } finally {
      setMutating(false);
    }
  };

  const handleToggleRead = async (id: string) => {
    if (mutating) return;
    const current = notifications.find((n) => n.id === id);
    if (!current) return;
    setMutating(true);
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      if (!current.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      toast.error("Failed to mark notification as read");
    } finally {
      setMutating(false);
    }
  };

  const getIcon = (type: RecruiterNotification["type"]) => {
    switch (type) {
      case "conflict":
        return (
          <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
        );
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
            Real-time campus placement updates, AI match triggers, and schedule
            conflict alerts.
          </p>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 mt-2">
              {unreadCount} unread
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || mutating}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            {t === "conflict"
              ? "Conflicts (Alert)"
              : t.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading && (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">
            Loading notifications...
          </p>
        )}
        {!isLoading && filtered.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">
            No notifications{filterType === "ALL" ? "" : " in this category"}.
          </p>
        )}
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
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {notif.time}
                    </span>
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => handleToggleRead(notif.id)}
                        disabled={mutating}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer disabled:opacity-50"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
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
