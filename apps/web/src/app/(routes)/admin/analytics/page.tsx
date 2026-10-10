import type { Metadata } from "next";
import AdminAnalyticsView from "@/components/dashboard/admin/views/AdminAnalyticsView";

export const metadata: Metadata = {
  title: "Placement Analysis & Insights — CAMPUSLINK Admin",
  description: "Cohort placement intelligence, branch absorption, engineering fresher compensation benchmarks, and resume screening conversion rates.",
};

export default function AdminAnalysisPage() {
  return <AdminAnalyticsView />;
}
