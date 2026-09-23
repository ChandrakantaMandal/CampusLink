"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface TopHeaderProps {
  onToggleSidebar?: () => void;
  studentName?: string;
  department?: string;
  isPublic?: boolean;
}

export default function TopHeader({
  onToggleSidebar,
  studentName = "Student",
  department = "Computer Science",
  isPublic = true,
}: TopHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "Google Software Engineer drive open",
      time: "20m ago",
      read: false,
      tag: "Drive",
    },
    {
      id: 2,
      title: "Profile verified by Placement Cell",
      time: "2h ago",
      read: false,
      tag: "Verification",
    },
    {
      id: 3,
      title: "Infosys updated interview eligibility criteria",
      time: "1d ago",
      read: true,
      tag: "Update",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 lg:px-8 backdrop-blur-md shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left side: Hamburger button + Search */}
      <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search input with modern styling */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities, skills, recruiters, interview prep..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-12 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#6366F1] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden sm:flex items-center pr-3">
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-xs dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Campus Badges, Notifications, Theme Toggle, Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Recruiter Visibility Quick Badge */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {isPublic ? "Visible to Recruiters" : "Private Profile"}
        </div>

        {/* Theme Mode Toggle */}
        <ModeToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</span>
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 px-2 py-0.5 text-xs font-bold text-indigo-700">
                    2 new
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg px-2 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">{n.title}</div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                        {n.tag}
                      </span>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill */}
        <div className="flex items-center gap-3 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            {studentName && studentName.trim()
              ? studentName
                  .trim()
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "ST"}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
              {studentName}
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {department}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
