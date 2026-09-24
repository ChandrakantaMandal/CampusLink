import {
  LayoutDashboard,
  UserCheck,
  TrendingUp,
  Briefcase,
  Calendar,
  Gift,
  Bell,
  Settings,
  Building2,
  Layers,
  Users,
  ClipboardList,
  BarChart3,
  MessageSquare,
  GraduationCap,
  Building,
} from "lucide-react";

export type UserRole = "student" | "admin" | "recruiter";

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | null;
  href: string;
}

export const sidebarConfig: Record<UserRole, SidebarItem[]> = {
  student: [
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
      badge: "78%",
      href: "/student/readiness",
    },
    {
      id: "drives",
      label: "Campus Drives",
      icon: Building2,
      badge: "3",
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
      badge: "8",
      href: "/student/jobs",
    },
    {
      id: "applications",
      label: "Applications",
      icon: UserCheck,
      badge: "12",
      href: "/student/applications",
    },
    {
      id: "schedule",
      label: "Interview Schedule",
      icon: Calendar,
      badge: "New",
      href: "/student/interviews",
    },
    {
      id: "offers",
      label: "Offer Letters",
      icon: Gift,
      badge: "1",
      href: "/student/offers",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/student/notifications",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/student/settings",
    },
  ],

  recruiter: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/recruiter/dashboard",
    },
    {
      id: "jobs",
      label: "Job Postings",
      icon: Briefcase,
      badge: "5",
      href: "/recruiter/jobs",
    },
    {
      id: "applications",
      label: "Applications",
      icon: ClipboardList,
      badge: "24",
      href: "/recruiter/applications",
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: Users,
      badge: "48",
      href: "/recruiter/candidates",
    },
    {
      id: "interviews",
      label: "Interviews",
      icon: Calendar,
      badge: "6",
      href: "/recruiter/interviews",
    },
    {
      id: "offers",
      label: "Offers",
      icon: Gift,
      badge: "3",
      href: "/recruiter/offers",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: "4",
      href: "/recruiter/messages",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/recruiter/notifications",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/recruiter/settings",
    },
  ],

  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "students",
      label: "Students",
      icon: GraduationCap,
      badge: "1.2K",
      href: "/admin/students",
    },
    {
      id: "recruiters",
      label: "Recruiters",
      icon: Building,
      badge: "42",
      href: "/admin/recruiters",
    },
    {
      id: "drives",
      label: "Campus Drives",
      icon: Briefcase,
      badge: "12",
      href: "/admin/drives",
    },
    {
      id: "applications",
      label: "Applications",
      icon: ClipboardList,
      badge: "248",
      href: "/admin/applications",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      href: "/admin/users",
    },
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
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ],
};
