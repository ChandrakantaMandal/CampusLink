"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { X, GraduationCap, ChevronRight, User } from "lucide-react";
import ProfileFlyout from "./ProfileFlyout";

import { sidebarConfig, type UserRole } from "./sidebar-config";

interface DashboardSidebarProps {
  role?: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

const profileRoutes: Record<UserRole, string> = {
  student: "/student/profile",
  recruiter: "/recruiter/profile",
  admin: "/admin/profile",
};

export default function DashboardSidebar({
  role = "student",
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const navItems = sidebarConfig[role] ?? [];
  const profileHref = profileRoutes[role];

  const showProfileFlyout = useCallback(() => {
    clearTimeout(hideTimer.current);
    setFlyoutOpen(true);
  }, []);

  const hideProfileFlyout = useCallback(() => {
    hideTimer.current = setTimeout(() => setFlyoutOpen(false), 120);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-72 shrink-0 flex-col
          border-r border-slate-800/80
          bg-[#0F172A] text-slate-200
          transition-transform duration-300
          lg:static lg:sticky lg:top-0
          lg:z-30 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "max-lg:-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800/80 px-6">
          <Link
            href="/"
            onClick={() => onClose?.()}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white">
                CAMPUS<span className="text-[#6366F1]">LINK</span>
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Placement Platform
              </span>
            </div>
          </Link>

          {/* Mobile close */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isExactActive = pathname === item.href;
              const isNestedActive =
                item.href !== "/" && pathname.startsWith(`${item.href}/`);
              const isActive = isExactActive || isNestedActive;

              return (
                <Link
                  key={item.id}
                  href={item.href as Route}
                  onClick={() => onClose?.()}
                  className={`
                    group flex w-full items-center
                    justify-between rounded-xl
                    px-3.5 py-2.5
                    text-xs font-semibold
                    transition-all sm:text-sm
                    ${
                      isActive
                        ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-600/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`
                        h-4 w-4
                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-indigo-400"
                        }
                      `}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`
                        rounded-full px-2 py-0.5
                        text-[10px] font-bold
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badge === "New"
                              ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                              : "border border-indigo-500/30 bg-indigo-500/20 text-indigo-300"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className="relative shrink-0 p-4 pt-0"
          onMouseEnter={showProfileFlyout}
          onMouseLeave={hideProfileFlyout}
        >
          <Link
            href={profileHref as Route}
            onClick={() => onClose?.()}
            className={`
              group flex w-full items-center
              justify-between rounded-xl
              px-3.5 py-2.5
              text-xs font-semibold
              transition-all sm:text-sm
              ${
                pathname === profileHref ||
                pathname.startsWith(`${profileHref}/`)
                  ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <User
                className={`
                  h-4 w-4
                  ${
                    pathname === profileHref ||
                    pathname.startsWith(`${profileHref}/`)
                      ? "text-white"
                      : "text-slate-400 group-hover:text-indigo-400"
                  }
                `}
              />
              <span>My Profile</span>
            </div>

            <ChevronRight
              className={`
                h-3.5 w-3.5
                transition-transform
                group-hover:translate-x-0.5
                ${
                  pathname === profileHref ||
                  pathname.startsWith(`${profileHref}/`)
                    ? "text-white"
                    : "text-slate-500"
                }
              `}
            />
          </Link>


          <ProfileFlyout
            isOpen={flyoutOpen}
            onMouseEnter={showProfileFlyout}
            onMouseLeave={hideProfileFlyout}
          />
        </div>
      </aside>
    </>
  );
}
