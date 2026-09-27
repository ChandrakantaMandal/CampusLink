"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  LayoutDashboard,
  Building,
  Briefcase,
  Users,
  ClipboardList,
  Sparkles,
  CheckCircle2,
  Calendar,
  Gift,
  Bell,
  Settings,
  LogOut,
  X,
  AlertTriangle,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";

interface RecruiterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
    badge?: string;
    badgeColor?: string;
    hasAlert?: boolean;
  }[];
}

const recruiterNavSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/recruiter/dashboard",
      },
    ],
  },
  {
    title: "RECRUITMENT",
    items: [
      {
        id: "profile",
        label: "Company Profile",
        icon: Building,
        href: "/recruiter/profile",
      },
      {
        id: "jobs",
        label: "Jobs / Postings",
        icon: Briefcase,
        href: "/recruiter/jobs",
        badge: "5",
      },
      {
        id: "candidates",
        label: "Candidates",
        icon: Users,
        href: "/recruiter/candidates",
        badge: "342",
      },
      {
        id: "applications",
        label: "Applications",
        icon: ClipboardList,
        href: "/recruiter/applications",
        badge: "68",
      },
    ],
  },
  {
    title: "AI & SCREENING",
    items: [
      {
        id: "shortlisted",
        label: "Shortlisted",
        icon: CheckCircle2,
        href: "/recruiter/shortlisted",
        badge: "68",
      },
    ],
  },
  {
    title: "INTERVIEWS",
    items: [
      {
        id: "interviews",
        label: "Interviews",
        icon: Calendar,
        href: "/recruiter/interviews",
        badge: "Conflict!",
        badgeColor: "bg-amber-500 text-white animate-pulse",
        hasAlert: true,
      },
    ],
  },
  {
    title: "OFFERS",
    items: [
      {
        id: "offers",
        label: "Offers",
        icon: Gift,
        href: "/recruiter/offers",
        badge: "12",
        badgeColor: "bg-emerald-600 text-white",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        href: "/recruiter/notifications",
        badge: "5",
        badgeColor: "bg-rose-500 text-white",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: "/recruiter/settings",
      },
    ],
  },
];

export default function RecruiterSidebar({
  isOpen = false,
  onClose,
}: RecruiterSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login?role=recruiter" as Route);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Recruiter Sidebar Container */}
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
            href="/recruiter/dashboard"
            onClick={() => onClose?.()}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105">
              <Building2 className="h-6 w-6" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                CAMPUS<span className="text-blue-600 dark:text-blue-400">LINK</span>
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Recruiter Portal
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

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
          {recruiterNavSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isExactActive = pathname === item.href;
                const isNestedActive =
                  item.href !== "/recruiter/dashboard" && pathname.startsWith(`${item.href}/`);
                const isActive = isExactActive || isNestedActive;

                return (
                  <Link
                    key={item.id}
                    href={item.href as Route}
                    onClick={() => onClose?.()}
                    className={`
                      group flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.badgeColor ||
                            (isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300")
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Company Profile & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <Link
            href="/recruiter/profile"
            className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-3 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                TC
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  TechCorp Innovations
                </p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                  Verified Partner ✓
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold py-2 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
