"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  Layers,
  Briefcase,
  UserCheck,
  Calendar,
  Gift,
  Bell,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useStudentDashboard, useStudentReadiness, useStudentDrives, useStudentSkills, useStudentJobs, useStudentApplications, useStudentInterviews, useStudentOffers, useStudentNotifications } from "@/hooks/use-student";
import { useStudentProfile } from "@/hooks/use-student";
import ProfileFlyout from "./ProfileFlyout";

interface StudentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function getInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.charAt(0).toUpperCase() ?? "";
  const last = lastName?.charAt(0).toUpperCase() ?? "";
  return first + last || "ST";
}

function getDisplayName(firstName: string | null, lastName: string | null): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return "Student Portal";
}

export default function StudentSidebar({
  isOpen = false,
  onClose,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const dashboard = useStudentDashboard();
  const profile = useStudentProfile();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/login?role=student" as Route);
  };

  const stats = dashboard.data?.stats;

  const studentNav = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/student/dashboard",
    },
    {
      id: "readiness",
      label: "Readiness Score",
      icon: TrendingUp,
      badge: stats ? `${stats.readinessScore}%` : null,
      href: "/student/readiness",
    },
    {
      id: "drives",
      label: "Campus Drives",
      icon: Building2,
      badge: stats ? String(stats.drivesRegistered) : null,
      href: "/student/drives",
    },
    {
      id: "skills",
      label: "Skill Gaps",
      icon: Layers,
      badge: "AI",
      href: "/student/skills",
    },
    {
      id: "jobs",
      label: "Recommended Jobs",
      icon: Briefcase,
      badge: stats ? String(stats.applications > 0 ? stats.applications : 0) : null,
      href: "/student/jobs",
    },
    {
      id: "applications",
      label: "Applications",
      icon: UserCheck,
      badge: stats ? String(stats.applications) : null,
      href: "/student/applications",
    },
    {
      id: "schedule",
      label: "Interview Schedule",
      icon: Calendar,
      badge: stats && stats.interviews > 0 ? String(stats.interviews) : null,
      href: "/student/interviews",
    },
    {
      id: "offers",
      label: "Offer Letters",
      icon: Gift,
      badge: stats ? String(stats.offers) : null,
      href: "/student/offers",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: stats && stats.unreadNotifications > 0 ? String(stats.unreadNotifications) : null,
      href: "/student/notifications",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/student/settings",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Student Sidebar Container */}
      <aside
        className={`
            fixed inset-y-0 left-0 z-50
            flex h-screen w-72 shrink-0 flex-col
            border-r border-slate-200 dark:border-slate-800/80
            bg-white dark:bg-[#0B1120] text-slate-800 dark:text-slate-200
            transition-colors duration-200
            lg:static lg:sticky lg:top-0
            lg:z-30 lg:translate-x-0
            ${isOpen ? "translate-x-0" : "max-lg:-translate-x-full"}
            `}
      >
        {/* Brand Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-6">
          <Link
            href="/student/dashboard"
            onClick={() => onClose?.()}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                CAMPUS
                <span className="text-indigo-600 dark:text-indigo-400">
                  LINK
                </span>
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Student Portal
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Student Navigation */}
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4 scrollbar-thin">
          <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            STUDENT MENU
          </div>

          {studentNav.map((item) => {
            const Icon = item.icon;
            const isExactActive = pathname === item.href;
            const isNestedActive = pathname.startsWith(`${item.href}/`);
            const isActive = isExactActive || isNestedActive;

            return (
              <Link
                key={item.id}
                href={item.href as Route}
                onClick={() => onClose?.()}
                className={`
                    group flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
                    }
                    `}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400"
                    }`}
                  />

                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Student Profile & Logout */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
          {/* Profile Card + Flyout */}
          <div
            className="relative mb-3"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <button
              type="button"
              onClick={() => router.push("/student/profile" as Route)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              aria-label="Open student profile"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white">
                  {profile.profile ? getInitials(profile.profile.firstName, profile.profile.lastName) : "ST"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {profile.profile ? getDisplayName(profile.profile.firstName, profile.profile.lastName) : "Student Portal"}
                  </p>

                  <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {profile.profile?.department ?? "CampusLink Student"}
                  </p>
                </div>
              </div>

              <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
            </button>

            <ProfileFlyout
              isOpen={isProfileOpen}
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
              isAuthenticated={true}
            />
          </div>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-100/80 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}