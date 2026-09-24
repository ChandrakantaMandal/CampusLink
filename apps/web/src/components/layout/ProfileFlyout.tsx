"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  User,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  Settings,
} from "lucide-react";

const profileSubPages = [
  { id: "opportunities", label: "Opportunities", href: "/student/profile/opportunities", icon: Briefcase },
  { id: "applications", label: "Applications", href: "/student/profile/applications", icon: FileText },
  { id: "messages", label: "Messages", href: "/student/profile/messages", icon: MessageSquare },
  { id: "notifications", label: "Notifications", href: "/student/profile/notifications", icon: Bell },
  { id: "settings", label: "Settings", href: "/student/profile/settings", icon: Settings },
];

interface ProfileFlyoutProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProfileFlyout({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: ProfileFlyoutProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-full bottom-full z-[100] ml-2 mb-2 w-56 rounded-xl border border-slate-800 bg-[#0F172A] shadow-2xl shadow-black/40 py-2"
    >
      <div className="px-3 pb-2 mb-1 border-b border-slate-800/80">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          My Profile
        </p>
      </div>

      {profileSubPages.map((page) => {
        const Icon = page.icon;
        const isActive = pathname === page.href || pathname.startsWith(`${page.href}/`);

        return (
          <Link
            key={page.id}
            href={page.href as Route}
            className={`
              flex items-center gap-3 px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-150
              ${
                isActive
                  ? "bg-[#6366F1]/15 text-[#818CF8]"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }
            `}
          >
            <Icon
              className={`h-4 w-4 ${
                isActive ? "text-[#818CF8]" : "text-slate-500"
              }`}
            />
            <span>{page.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
