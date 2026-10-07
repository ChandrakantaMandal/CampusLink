import type { Metadata } from "next";
import ApplicationDetailView from "@/components/dashboard/applications/ApplicationDetailView";

export const metadata: Metadata = {
  title: "Application Details — CAMPUSLINK Admin",
  description: "Full application record: student profile, resume, skills, education, projects, AI match result, and job details.",
};

export default function AdminApplicationDetailPage() {
  return <ApplicationDetailView basePath="admin" />;
}
