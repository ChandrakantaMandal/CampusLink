import type { Metadata } from "next";
import RecruiterDashboardHomeView from "@/components/dashboard/recruiter/views/RecruiterDashboardHomeView";

export const metadata: Metadata = {
  title: "Recruiter Dashboard — CAMPUSLINK Placement Portal",
  description: "Company recruitment control center for managing jobs, applicants, AI candidate matching, and campus interviews.",
};

export default function RecruiterDashboardPage() {
  return <RecruiterDashboardHomeView />;
}