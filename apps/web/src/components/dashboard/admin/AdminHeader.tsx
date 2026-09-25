"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Search,
  Bell,
  Menu,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Calendar,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/use-auth";
import { mockNotifications } from "./mock-admin-data";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login?role=tpo" as Route);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/students?q=${encodeURIComponent(searchQuery)}` as Route);
  };

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md transition-colors shadow-2xs">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="cursor-pointer rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Global Admin Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, recruiters, drives, rolls..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden transition-all"
          />
        </form>
      </div>

      {/* Right Controls: Conflict Pill, Live Season, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 ml-3">
        {/* Urgent Conflict Warning Pill */}
        <Link
          href={("/admin/interviews" as Route)}
          className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 shadow-2xs hover:scale-105 active:scale-95 transition-all"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span>1 Schedule Conflict!</span>
        </Link>

        {/* Season Tag */}
        <div className="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/30 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Season 2026 • Live</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Admin Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Placement Notifications
                  </h3>
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {mockNotifications.length} New
                  </span>
                </div>
                <Link
                  href={("/admin/notifications" as Route)}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                {mockNotifications.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl text-xs border transition-colors ${item.type === "urgent"
                        ? "border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20"
                        : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {item.description}
                    </p>
                    {item.actionLabel && (
                      <Link
                        href={(item.actionUrl || "/admin/dashboard") as Route}
                        onClick={() => setShowNotifications(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-2"
                      >
                        <span>{item.actionLabel}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Mode Toggle */}
        <ModeToggle />

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20">
            AP
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Admin Control
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Apex Institute TPO
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
