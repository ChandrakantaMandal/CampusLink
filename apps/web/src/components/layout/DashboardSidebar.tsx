"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { X, GraduationCap, ChevronRight, User, Lock, LogIn } from "lucide-react";
import ProfileFlyout from "./ProfileFlyout";
import { sidebarConfig, type UserRole, type SidebarItem } from "./sidebar-config";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

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
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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

  const handleNavClick = (e: React.MouseEvent, item: SidebarItem) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("Access Locked — Login to Access", {
        description: `Please log in to your student account to access ${item.label}.`,
      });
      router.push(`/login?role=${role}` as Route);
      return;
    }
    onClose?.();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("Access Locked — Login to Access", {
        description: "Please log in to access your student profile and applications.",
      });
      router.push(`/login?role=${role}` as Route);
      return;
    }
    onClose?.();
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

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-72 shrink-0 flex-col
          border-r border-slate-200 dark:border-slate-800/80
          bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-200
          transition-colors duration-200
          lg:static lg:sticky lg:top-0
          lg:z-30 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "max-lg:-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-6">
          <Link
            href="/"
            onClick={() => onClose?.()}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                CAMPUS<span className="text-[#6366F1]">LINK</span>
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Placement Platform
              </span>
            </div>
          </Link>

          {/* Mobile close */}
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

        <div className="flex-1 overflow-y-auto p-4">
          {/* Prominent Lock Banner when user is not logged in */}
          {!isAuthenticated && (
            <div className="mx-1 mb-4 rounded-2xl border border-amber-300/80 bg-gradient-to-b from-amber-50 to-amber-100/60 p-4 text-xs text-amber-900 shadow-xs dark:border-amber-500/30 dark:bg-gradient-to-b dark:from-amber-500/15 dark:to-amber-500/5 dark:text-amber-200 dark:shadow-xl dark:shadow-black/20">
              <div className="flex items-center gap-2.5 font-bold text-amber-800 dark:text-amber-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 shadow-xs">
                  <Lock className="h-4 w-4" />
                </div>
                <span className="text-sm font-black">Sidebar Locked</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                You are not logged in. <strong className="text-amber-800 dark:text-amber-300 font-bold">Login to access</strong> all dashboard pages, campus drives, and readiness tests.
              </p>
              <Link
                href={`/login?role=${role}` as Route}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login to Access</span>
              </Link>
            </div>
          )}

          <div className="space-y-1">
            <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Navigation</span>
              {!isAuthenticated && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 lowercase tracking-normal">
                  <Lock className="h-3 w-3" /> locked
                </span>
              )}
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
                  onClick={(e) => handleNavClick(e, item)}
                  title={!isAuthenticated ? "Login to access this page" : item.label}
                  className={`
                    group flex w-full items-center
                    justify-between rounded-xl
                    px-3.5 py-2.5
                    text-xs font-semibold
                    transition-all sm:text-sm
                    ${isActive && isAuthenticated
                      ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-600/25 font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                    }
                    ${!isAuthenticated ? "opacity-75 hover:opacity-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/50" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`
                        h-4 w-4
                        ${isActive && isAuthenticated
                          ? "text-white"
                          : "text-slate-400 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400"
                        }
                      `}
                    />
                    <span>{item.label}</span>
                  </div>

                  {!isAuthenticated ? (
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                      <Lock className="h-3 w-3" />
                      <span>Lock</span>
                    </span>
                  ) : item.badge ? (
                    <span
                      className={`
                        rounded-full px-2 py-0.5
                        text-[10px] font-bold
                        ${isActive
                          ? "bg-white/20 text-white"
                          : item.badge === "New"
                            ? "border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            : "border border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Profile Footer / Login to Access */}
        <div
          className="relative shrink-0 p-4 pt-0"
          onMouseEnter={showProfileFlyout}
          onMouseLeave={hideProfileFlyout}
        >
          {isAuthenticated ? (
            <Link
              href={profileHref as Route}
              onClick={handleProfileClick}
              className={`
                group flex w-full items-center
                justify-between rounded-xl
                px-3.5 py-2.5
                text-xs font-semibold
                transition-all sm:text-sm
                ${pathname === profileHref ||
                  pathname.startsWith(`${profileHref}/`)
                  ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-600/25 font-bold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <User
                  className={`
                    h-4 w-4
                    ${pathname === profileHref ||
                      pathname.startsWith(`${profileHref}/`)
                      ? "text-white"
                      : "text-slate-400 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400"
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
                  ${pathname === profileHref ||
                    pathname.startsWith(`${profileHref}/`)
                    ? "text-white"
                    : "text-slate-400 dark:text-slate-500"
                  }
                `}
              />
            </Link>
          ) : (
            <Link
              href={`/login?role=${role}` as Route}
              onClick={() => onClose?.()}
              className="group flex w-full items-center justify-between rounded-xl border border-amber-300 bg-amber-50/90 text-amber-800 hover:bg-amber-100 hover:border-amber-400 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 dark:hover:border-amber-500/50 px-3.5 py-2.5 text-xs font-bold transition-all sm:text-sm shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Login to Access</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-amber-600/70 dark:text-amber-400/70 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          <ProfileFlyout
            isOpen={flyoutOpen}
            onMouseEnter={showProfileFlyout}
            onMouseLeave={hideProfileFlyout}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </aside>
    </>
  );
}
