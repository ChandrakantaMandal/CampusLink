import type { Metadata } from "next";
import AdminSettingsView from "@/components/dashboard/admin/views/AdminSettingsView";

export const metadata: Metadata = {
  title: "Admin Settings & Governance — CAMPUSLINK Admin",
  description: "Configure campus information, evaluation thresholds, AI matching parameters, and security policies.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsView />;
}
