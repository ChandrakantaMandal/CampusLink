import type { Metadata } from "next";
import RecruitersManagementView from "@/components/dashboard/admin/views/RecruitersManagementView";

export const metadata: Metadata = {
  title: "Recruiters & Companies — CAMPUSLINK Admin",
  description: "Corporate recruiter management, MoUs, hiring tiers, and job roles verification.",
};

export default function AdminRecruitersPage() {
  return <RecruitersManagementView />;
}
