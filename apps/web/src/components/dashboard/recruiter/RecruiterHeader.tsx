"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Menu,
  Bell,
  Plus,
  Building,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";
import type { RecruiterNotification } from "./recruiter.types";
import { getMyNotifications, getRecruiterProfile } from "@/lib/api/recruiter.api";

interface RecruiterHeaderProps {
  onToggleSidebar: () => void;
}

export default function RecruiterHeader({
  onToggleSidebar
}: RecruiterHeaderProps) {
  const router = useRouter();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<RecruiterNotification[]>([]);
  const [companyName, setCompanyName] = useState("TechCorp Innovations");

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyNotifications(), getRecruiterProfile()])
      .then(([feed, profile]) => {
        if (cancelled) return;
        setUnreadCount(feed.unreadCount);
        setRecentNotifications(feed.notifications.slice(0, 4));
        setCompanyName(profile.name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B1120]/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md transition-colors">
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Right: Quick CTA, Alerts, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        

        {/* Company Verified Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-blue-200/80 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/20 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
            {companyName}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
            Verified ✓
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recruitment Alerts</h3>
                  <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {unreadCount} unread
                  </span>
                </div>
                <Link
                  href="/recruiter/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {recentNotifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={(notif.actionUrl as Route) || "/recruiter/notifications"}
                    onClick={() => setShowNotifMenu(false)}
                    className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${notif.isRead ? "bg-slate-300" : notif.type === "conflict" ? "bg-amber-500 animate-pulse" : "bg-blue-500"}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentNotifications.length === 0 && (
                  <p className="py-3 text-center text-xs text-slate-400 dark:text-slate-500">
                    No notifications yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
