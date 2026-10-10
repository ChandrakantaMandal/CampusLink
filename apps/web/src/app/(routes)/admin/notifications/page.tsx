import type { Metadata } from "next";
import AdminNotificationsView from "@/components/dashboard/admin/views/AdminNotificationsView";

export const metadata: Metadata = {
  title: "Placement Alerts & Broadcasts — CAMPUSLINK Admin",
  description: "Administrative alerts, interview collision warnings, document audits, and institutional announcements.",
};

export default function AdminNotificationsPage() {
  return <AdminNotificationsView />;
}
