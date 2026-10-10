import type { Metadata } from "next";
import RecruiterApplicationsView from "@/components/dashboard/recruiter/views/RecruiterApplicationsView";

export const metadata: Metadata = {
  title: "Applications Pipeline — CAMPUSLINK Recruiter Portal",
  description: "Track candidate applications across screening, technical rounds, and formal offers.",
};

export default function RecruiterApplicationsPage() {
  return <RecruiterApplicationsView />;
}
