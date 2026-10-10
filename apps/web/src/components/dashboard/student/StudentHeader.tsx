"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Bell, Menu, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";
import {
  useStudentNotifications,
  useStudentReadiness,
} from "@/hooks/use-student";
import { useStudentProfile } from "@/hooks/use-student";

interface StudentHeaderProps {
  onToggleSidebar?: () => void;
}

function getDisplayName(
  firstName: string | null,
  lastName: string | null,
): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return "Student Portal";
}

export default function StudentHeader({ onToggleSidebar }: StudentHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();
  const readiness = useStudentReadiness();
  const notifications = useStudentNotifications();
  const profile = useStudentProfile();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login?role=student" as Route);
  };

  const unreadCount = notifications.data?.unreadCount ?? 0;
  const readinessScore = readiness.data?.score ?? 0;
  const studentName = profile.profile
    ? getDisplayName(profile.profile.firstName, profile.profile.lastName)
    : "Student Portal";
  const studentDept = profile.profile?.department ?? "CampusLink Student";

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-2xs backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-[#0B1120]/95 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-4">
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
      </div>

      {/* Right Controls */}
      <div className="ml-3 flex shrink-0 items-center gap-2.5 sm:gap-4">
        {/* Readiness Score */}
        <Link
          href={"/student/readiness" as Route}
          className="hidden items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-2xs transition-all hover:scale-105 active:scale-95 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300 md:inline-flex"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Readiness {readinessScore}%</span>
        </Link>

        {/* Placement Season */}
        <div className="hidden items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300 xl:inline-flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span>Placement Season 2026</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((previous) => !previous)}
            className="relative cursor-pointer rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Student Notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="h-4 w-4" />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 z-50 mt-3 w-80 animate-in rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl duration-100 fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900 sm:w-96">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Student Notifications
                  </h3>

                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {unreadCount} Unread
                  </span>
                </div>

                <Link
                  href={"/student/notifications" as Route}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  View All
                </Link>
              </div>

              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                {notifications.data?.notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    You&apos;re all caught up!
                  </p>
                ) : (
                  notifications.data?.notifications.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-2.5 text-xs transition-colors ${
                        item.priority === "urgent"
                          ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20"
                          : "border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>

                        <span className="shrink-0 text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {item.message}
                      </p>

                      {item.actionLabel && (
                        <Link
                          href={
                            (item.actionUrl ||
                              "/student/notifications") as Route
                          }
                          onClick={() => setShowNotifications(false)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          <span>{item.actionLabel}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* Student Profile */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/20">
            {profile.profile
              ? getDisplayName(
                  profile.profile.firstName,
                  profile.profile.lastName,
                )
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "ST"}
          </div>

          <div className="hidden flex-col text-left lg:flex">
            <span className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
              {studentName}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {studentDept}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
