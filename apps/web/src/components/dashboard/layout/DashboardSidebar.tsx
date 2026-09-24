"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  UserCheck,
  TrendingUp,
  Briefcase,
  Calendar,
  Gift,
  Bell,
  Settings,
  X,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Layers,
  Building2,
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  studentName?: string;
  department?: string;
}

export default function DashboardSidebar({
  isOpen = false,
  onClose,
  activeTab,
  onSelectTab,
  studentName = "Himanshu Rout",
  department = "Computer Science",
}: DashboardSidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "readiness", label: "Readiness Score", icon: TrendingUp, badge: "78%" },
    { id: "drives", label: "Campus Drives", icon: Building2, badge: "3" },
    { id: "skills", label: "Skill Gaps", icon: Layers, badge: "AI" },
    { id: "jobs", label: "Recommended Jobs", icon: Briefcase, badge: "8" },
    { id: "applications", label: "Applications", icon: UserCheck, badge: "12" },
    { id: "schedule", label: "Interview Schedule", icon: Calendar, badge: "New" },
    { id: "offers", label: "Offer Letters", icon: Gift, badge: "1" },
    { id: "notifications", label: "Notifications", icon: Bell, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
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

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col justify-between bg-[#0F172A] text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 border-r border-slate-800/80 overflow-y-auto ${isOpen ? "translate-x-0" : "max-lg:-translate-x-full"
          }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white">
                    CAMPUS<span className="text-[#6366F1]">LINK</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400">
                  Placement Platform
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                        }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive
                        ? "bg-white/20 text-white"
                        : item.badge === "New"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Direct Link to My Profile */}
            <div className="pt-3">
              <Link
                href="/student/profile"
                className="group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4 text-slate-400 group-hover:text-indigo-400" />
                  <span>My Profile</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Placement Status Card */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Season 2026
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Drives
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              University placement cell is actively accepting applications for Tier-1 drives.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400 font-medium">Verified Student</span>
              <span className="text-indigo-400 font-bold">8.6 CGPA</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
