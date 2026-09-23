"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  FileCheck2,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeNav?: string;
  onSelectNav?: (navId: string) => void;
  studentName?: string;
  studentRole?: string;
}

export default function Sidebar({
  isOpen = false,
  onClose,
  activeNav = "profile",
  onSelectNav,
  studentName = "Student",
  studentRole = "Student Profile",
}: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", badge: null },
    { id: "profile", label: "Student Profile", icon: UserCheck, href: "/profile", badge: "Active" },
    { id: "opportunities", label: "Opportunities", icon: Briefcase, href: "/profile?tab=opportunities", badge: "6" },
    { id: "applications", label: "Applications", icon: FileCheck2, href: "/profile?tab=applications", badge: "5" },
    { id: "messages", label: "Messages", icon: MessageSquare, href: "/profile?tab=messages", badge: "3" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/profile?tab=notifications", badge: "2" },
    { id: "settings", label: "Settings", icon: Settings, href: "/profile?tab=settings", badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container - Fixed on Desktop and Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col justify-between bg-[#0F172A] text-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-2xl border-r border-slate-800/80 overflow-y-auto`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/60">
            <Link href="/profile" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-white">
                    CAMPUS<span className="text-[#6366F1]">LINK</span>
                  </span>
                </div>
                <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
                  Campus Placement
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Placement Cycle Status Card */}
          <div className="mx-4 my-4 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/20 p-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                2024–2028 Batch
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                Placement Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Campus placement drives actively scanning completed profiles.
            </p>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-2">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.id === activeNav;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href as any}
                    onClick={(e) => {
                      if (item.id !== "dashboard" && onSelectNav) {
                        e.preventDefault();
                        onSelectNav(item.id);
                      }
                      if (onClose) onClose();
                    }}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${isActive
                        ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-600/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 transition-colors ${isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-indigo-400"
                          }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${isActive
                            ? "bg-white/20 text-white"
                            : item.badge === "Active"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "bg-slate-800 text-slate-300"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-800/60 p-3 hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md">
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
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">
                  {studentName}
                </div>
                <div className="truncate text-xs text-slate-400">
                  {studentRole}
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition-colors"
              title="Return to Dashboard"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
