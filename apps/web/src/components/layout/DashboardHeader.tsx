"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Bell,
  Menu,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
  studentName?: string;
  department?: string;
}

export default function DashboardHeader({
  onToggleSidebar,
  studentName = "Himanshu Rout",
  department = "Computer Science",
}: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "Google Campus Drive Registration Confirmed",
      time: "15m ago",
      tag: "Drive",
      read: false,
    },
    {
      id: 2,
      title: "TCS Digital Technical Interview Scheduled for Oct 8",
      time: "2h ago",
      tag: "Interview",
      read: false,
    },
    {
      id: 3,
      title: "AI Skill Gap Report: Recommended System Design practice",
      time: "1d ago",
      tag: "AI Coach",
      read: true,
    },
    {
      id: 4,
      title: "TCS Digital Offer Letter (LOI) Verified by Placement Cell",
      time: "2d ago",
      tag: "Offer",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 lg:px-8 backdrop-blur-md shadow-xs dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      {/* Left Section: Mobile Menu Button & Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand indicator visible on mobile when sidebar is hidden */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
            CAMPUS<span className="text-[#6366F1]">LINK</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drives, skills, companies, mock tests..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-12 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-[#6366F1] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
          />
          <kbd className="pointer-events-none absolute inset-y-0 right-0 my-auto mr-3 flex h-5 items-center justify-center rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-semibold text-slate-400 shadow-2xs dark:border-slate-700 dark:bg-slate-900">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section: Student Portal Badge, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Student Portal Badge (Only student view) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Student Portal</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                    {unreadCount} new
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg px-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                        {n.title}
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 text-[10px] font-medium">
                        {n.tag}
                      </span>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Mode Toggle */}
        <ModeToggle />

        {/* User Profile Avatar Pill */}
        <Link
          href="/student/profile"
          className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            {studentName
              ? studentName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
              : "ST"}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
              {studentName}
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            </span>
            <span
              className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]"
              title={department}
            >
              {department}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
