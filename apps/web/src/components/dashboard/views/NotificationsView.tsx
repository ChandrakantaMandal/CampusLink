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

interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  category: "Drive" | "Interview" | "Offer" | "AI Coach" | "Notice";
  urgency: "urgent" | "important" | "normal";
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  targetTab?: string;
  actionType?: "hallTicket" | "offerLetter" | "interviewSlot" | "driveBrochure" | "aiModule";
}

interface NotificationsViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export function NotificationsView({ onNavigateToTab }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([
    {
      id: "n-1",
      title: "Google Campus Drive: Technical Assessment Shortlist Released",
      message:
        "Congratulations! You have cleared Round 1 algorithmic screening and are shortlisted for the SDE-1 Technical Round on Oct 12, 2026. Hall ticket is ready for download.",
      category: "Interview",
      urgency: "urgent",
      timestamp: "10 mins ago",
      read: false,
      actionLabel: "Download Hall Ticket",
      targetTab: "schedule",
      actionType: "hallTicket",
    },
    {
      id: "n-2",
      title: "TCS Digital Cadre: Offer Letter (LOI) Verified by University TPO",
      message:
        "The training and placement department has validated your Letter of Intent from TCS Digital at ₹9.2 LPA. Please verify your documentation status.",
      category: "Offer",
      urgency: "urgent",
      timestamp: "2 hours ago",
      read: false,
      actionLabel: "Review Offer Details",
      targetTab: "offers",
      actionType: "offerLetter",
    },
    {
      id: "n-3",
      title: "Microsoft IDC Campus Recruitment Drive Open",
      message:
        "Microsoft India Development Center has initiated campus recruitment registration for 2026 graduates. Cutoff: 7.5 CGPA.",
      category: "Drive",
      urgency: "important",
      timestamp: "5 hours ago",
      read: false,
      actionLabel: "View Drive Details",
      targetTab: "drives",
      actionType: "driveBrochure",
    },
    {
      id: "n-4",
      title: "AI Skill Gap Alert: High Priority Practice Recommendation",
      message:
        "Based on your recent assessment in System Architecture, our AI placement coach recommends completing the Distributed Caching & Redis module before Oct 10.",
      category: "AI Coach",
      urgency: "normal",
      timestamp: "Yesterday, 4:15 PM",
      read: true,
      actionLabel: "Practice Module",
      targetTab: "skills",
      actionType: "aiModule",
    },
    {
      id: "n-5",
      title: "Amazon AWS Solutions Architect: Eligibility Updated",
      message:
        "Amazon Web Services has expanded eligibility to include all CSE, IT, and ECE students with CGPA >= 7.0. Applications close on Oct 10, 2026.",
      category: "Drive",
      urgency: "important",
      timestamp: "2 days ago",
      read: true,
      actionLabel: "Explore Opportunities",
      targetTab: "jobs",
      actionType: "driveBrochure",
    },
    {
      id: "n-6",
      title: "Placement Cell Notice: NIRF & NAAC Documentation Upload",
      message:
        "All final-year students are requested to update their active semester CGPA and upload their latest verified resume copy in the student profile.",
      category: "Notice",
      urgency: "normal",
      timestamp: "3 days ago",
      read: true,
      actionLabel: "Open Student Profile",
      actionType: "driveBrochure",
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

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
