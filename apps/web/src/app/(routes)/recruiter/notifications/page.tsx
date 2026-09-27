import type { Metadata } from "next";
import RecruiterNotificationsView from "@/components/dashboard/recruiter/views/RecruiterNotificationsView";

export const metadata: Metadata = {
  title: "Notifications — CAMPUSLINK Recruiter Portal",
  description: "Real-time updates on candidate applications, AI matches, and interview conflict alerts.",
};

export default function RecruiterNotificationsPage() {
  return <RecruiterNotificationsView />;
}
