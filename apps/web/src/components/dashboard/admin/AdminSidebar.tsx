"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  LayoutDashboard,
  GraduationCap,
  Building,
  Briefcase,
  ClipboardList,
  Calendar,
  Layers,
  Sparkles,
  Gift,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  X,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/use-auth";

interface AdminSidebarProps {
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

const adminNavSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        id: "students",
        label: "Students",
        icon: GraduationCap,
        href: "/admin/students",
        badge: "1,240",
      },
      {
        id: "recruiters",
        label: "Recruiters",
        icon: Building,
        href: "/admin/recruiters",
        badge: "42",
      },
      {
        id: "drives",
        label: "Placement Drives",
        icon: Briefcase,
        href: "/admin/drives",
        badge: "12",
      },
      {
        id: "applications",
        label: "Applications",
        icon: ClipboardList,
        href: "/admin/applications",
        badge: "612",
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        id: "interviews",
        label: "Interview Schedule",
        icon: Calendar,
        href: "/admin/interviews",
        badge: "Conflict!",
        badgeColor: "bg-amber-500 text-white animate-pulse",
        hasAlert: true,
      },
      {
        id: "offers",
        label: "Offers",
        icon: Gift,
        href: "/admin/offers",
        badge: "112",
      },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        href: "/admin/analytics",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        href: "/admin/notifications",
        badge: "6",
        badgeColor: "bg-rose-500 text-white",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
      },
    ],
  },
];

export default function AdminSidebar({
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login?role=tpo" as Route);
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

      {/* Admin Sidebar Container */}
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
            href="/admin/dashboard"
            onClick={() => onClose?.()}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                CAMPUS<span className="text-indigo-600 dark:text-indigo-400">LINK</span>
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Admin Control Center
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
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin">
          {adminNavSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isExactActive = pathname === item.href;
                const isNestedActive =
                  item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`);
                const isActive = isExactActive || isNestedActive;

                return (
                  <Link
                    key={item.id}
                    href={item.href as Route}
                    onClick={() => onClose?.()}
                    className={`
                      group flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm
                      ${isActive
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400"
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

        {/* Footer Admin Badge & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                AP
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Admin Panel
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  TPO Command Center
                </p>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Online" />
          </div>

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
