"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Building2,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
  Filter,
  CheckCheck,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  FileText,
  Video
} from "lucide-react";
import { toast } from "sonner";
import type { DashboardNotification } from "@/lib/dashboard-adapters";
import {
  markMyNotificationRead,
  markMyNotificationsReadAll,
} from "@/lib/api/student.api";

interface NotificationsViewProps {
  onNavigateToTab?: (tab: string) => void;
  initialNotifications?: DashboardNotification[];
  onRefresh?: () => void;
}

export function NotificationsView({
  onNavigateToTab,
  initialNotifications = [],
  onRefresh,
}: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<DashboardNotification[]>(
    initialNotifications
  );

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [mutating, setMutating] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    if (mutating) return;
    setMutating(true);
    try {
      await markMyNotificationsReadAll();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
      onRefresh?.();
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
      await markMyNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: !current.read } : n))
      );
      onRefresh?.();
    } catch {
      toast.error("Failed to update notification");
    } finally {
      setMutating(false);
    }
  };

  const handleAction = (item: DashboardNotification) => {
    if (item.actionType === "hallTicket") {
      toast.success("Downloading Official Assessment Hall Ticket PDF");
    } else if (item.actionType === "offerLetter") {
      toast.success("Downloading Verified Offer Letter (LOI)");
    } else if (item.targetTab && onNavigateToTab) {
      onNavigateToTab(item.targetTab);
    } else {
      toast.info(`Triggered: ${item.actionLabel}`);
    }
  };

  const filtered = notifications.filter((item) => {
    if (showUnreadOnly && item.read) return false;
    if (activeCategory === "all") return true;
    if (activeCategory === "drives") return item.category === "Drive";
    if (activeCategory === "interviews") return item.category === "Interview";
    if (activeCategory === "offers") return item.category === "Offer";
    if (activeCategory === "ai") return item.category === "AI Coach";
    return true;
  });

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "Offer":
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Interview":
        return "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800";
      case "Drive":
        return "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      case "AI Coach":
        return "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Bell className="w-3.5 h-3.5" /> University Placement Alerts
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Placement Notifications
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Official institutional recruitment notices, interview call letters, test links, and offer announcements.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read ({unreadCount})
              </button>
            )}
            {onNavigateToTab ? (
              <button
                type="button"
                onClick={() => onNavigateToTab("settings")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Alert Settings
              </button>
            ) : (
              <Link
                href={"/settings" as any}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Alert Settings
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Alerts" },
            { id: "drives", label: "Campus Drives" },
            { id: "interviews", label: "Interviews & Tests" },
            { id: "offers", label: "Offers" },
            { id: "ai", label: "AI Recommendations" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat.id
                ? "bg-[#6366F1] text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 cursor-pointer rounded"
            />
            <span>Unread only ({unreadCount})</span>
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
            <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No notifications found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up on this notification filter.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${item.read
                ? "border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40"
                : "border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20"
                }`}
            >
              {/* Left Column */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.read ? "bg-slate-300 dark:bg-slate-700" : "bg-[#6366F1]"
                    }`}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getBadgeStyle(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>

                    {item.urgency === "urgent" && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Urgent
                      </span>
                    )}

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {item.message}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 shrink-0 sm:self-center">
                {item.actionLabel && (
                  <button
                    type="button"
                    onClick={() => handleAction(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleRead(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={item.read ? "Mark as unread" : "Mark as read"}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
