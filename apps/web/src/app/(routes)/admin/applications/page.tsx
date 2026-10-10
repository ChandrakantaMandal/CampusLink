import type { Metadata } from "next";
import ApplicationsPipelineView from "@/components/dashboard/admin/views/ApplicationsPipelineView";

export const metadata: Metadata = {
  title: "Application Pipeline — CAMPUSLINK Admin",
  description: "Monitor candidate progress from initial application through shortlisting, interviews, and final offers.",
};

export default function AdminApplicationsPage() {
  return <ApplicationsPipelineView />;
}
