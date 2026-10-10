import type { Metadata } from "next";
import AdminSettingsView from "@/components/dashboard/admin/views/AdminSettingsView";

export const metadata: Metadata = {
  title: "Admin Profile & Settings — CAMPUSLINK Admin",
  description: "Manage administrative profile, campus configurations, and governance settings.",
};

export default function AdminProfilePage() {
  return <AdminSettingsView />;
}
