import type { Metadata } from "next";
import AdminAnalyticsView from "@/components/dashboard/admin/views/AdminAnalyticsView";

export const metadata: Metadata = {
  title: "Placement Analytics & Insights — CAMPUSLINK Admin",
  description: "Comprehensive multi-year placement performance, salary trends, branch absorption rates, and tier metrics.",
};

export default function AdminAnalyticsPage() {
  return <AdminAnalyticsView />;
}
