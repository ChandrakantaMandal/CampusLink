import type { Metadata } from "next";
import DashboardHomeView from "@/components/dashboard/admin/views/DashboardHomeView";

export const metadata: Metadata = {
  title: "Admin Dashboard — CAMPUSLINK Placement Intelligence",
  description: "Executive control center for campus placements, drives, candidate readiness, and company recruiters.",
};

export default function AdminDashboardPage() {
  return <DashboardHomeView />;
}