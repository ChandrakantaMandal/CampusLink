"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Building2,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  Trash2,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "Drive" | "Interview" | "Offer" | "Announcement";
  timestamp: string;
  read: boolean;
  linkText?: string;
  actionUrl?: string;
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Google Campus Drive Shortlist Released",
      message: "Congratulations! You have been shortlisted for Round 2 Technical Assessment scheduled on Oct 12, 2026. Hall ticket is ready.",
      category: "Interview",
      timestamp: "15 minutes ago",
      read: false,
      linkText: "Download Hall Ticket",
    },
    {
      id: "notif-2",
      title: "TCS Digital Offer Letter (LOI) Verified",
      message: "The university placement cell has verified and endorsed your Letter of Intent (LOI) from TCS Digital cadre at ₹9.2 LPA.",
      category: "Offer",
      timestamp: "2 hours ago",
      read: false,
      linkText: "View Offer Details",
    },
    {
      id: "notif-3",
      title: "Microsoft IDC Registration Open",
      message: "Microsoft India Development Center has opened registrations for SDE roles. Registration closes on Oct 08, 2026.",
      category: "Drive",
      timestamp: "Yesterday, 3:30 PM",
      read: true,
      linkText: "View Drive Brochure",
    },
    {
      id: "notif-4",
      title: "AI Skill Gap Recommendation",
      message: "Based on recent mock evaluations, our AI Placement Coach recommends completing the System Design & Caching practice module.",
      category: "Announcement",
      timestamp: "2 days ago",
      read: true,
      linkText: "Start Practice Module",
    },
    {
      id: "notif-5",
      title: "Amazon AWS Cloud Drive Eligibility Notice",
      message: "Amazon AWS Cloud Solutions Architect drive has updated eligible cutoff to 7.0 CGPA. All CSE/IT students are eligible.",
      category: "Drive",
      timestamp: "3 days ago",
      read: true,
      linkText: "Apply Now",
    },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifications.filter((item) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "unread") return !item.read;
    return item.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Offer":
        return "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Interview":
        return "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800";
      case "Drive":
        return "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Bell className="w-3.5 h-3.5" /> Placement Updates
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Notifications & University Alerts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Official announcements, drive shortlists, assessment slot confirmations, and offer alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark all as read ({unreadCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Updates" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "drive", label: "Campus Drives" },
            { id: "interview", label: "Interviews" },
            { id: "offer", label: "Offers" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${filterCategory === cat.id
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
            <Bell className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No notifications in this filter
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
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.read ? "bg-slate-300 dark:bg-slate-700" : "bg-[#6366F1]"
                    }`}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.message}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 sm:self-center">
                {item.linkText && (
                  <button
                    type="button"
                    onClick={() => toast.info(`Action triggered: ${item.linkText}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleToggleRead(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
