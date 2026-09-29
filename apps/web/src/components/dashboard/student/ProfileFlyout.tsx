"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

const profileSubPages = [
  { id: "opportunities", label: "Opportunities", href: "/student/profile/opportunities", icon: Briefcase },
  { id: "applications", label: "Applications", href: "/student/profile/applications", icon: FileText },
  { id: "messages", label: "Messages", href: "/student/profile/messages", icon: MessageSquare },
];

export interface ProfileFlyoutProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isAuthenticated?: boolean;
}

export default function ProfileFlyout({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  isAuthenticated = true,
}: ProfileFlyoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isOpen) return null;

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("Sign in required", {
        description: "Please sign in to access your student profile and applications.",
      });
      router.push("/login?role=student" as Route);
    }
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-full bottom-0 z-[100] ml-2 w-56 rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-[#0F172A] dark:shadow-black/40 py-2"
    >
      <div className="px-3 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          My Profile
        </p>
        {!isAuthenticated && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <Lock className="h-3 w-3" /> Locked
          </span>
        )}
      </div>

      {profileSubPages.map((page) => {
        const Icon = page.icon;
        const isActive = pathname === page.href || pathname.startsWith(`${page.href}/`);

        return (
          <Link
            key={page.id}
            href={page.href as Route}
            onClick={(e) => handleClick(e, page.href)}
            className={`
              flex items-center justify-between px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold dark:bg-[#6366F1]/15 dark:text-[#818CF8]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
              }
            `}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? "text-indigo-600 dark:text-[#818CF8]" : "text-slate-400 dark:text-slate-500"
                  }`}
              />
              <span className="truncate">{page.label}</span>
            </div>

            {!isAuthenticated && (
              <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
