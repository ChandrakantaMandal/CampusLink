import type { Metadata } from "next";
import RecruiterSettingsView from "@/components/dashboard/recruiter/views/RecruiterSettingsView";

export const metadata: Metadata = {
  title: "Recruiter Settings — CAMPUSLINK Recruiter Portal",
  description: "Configure recruiter profile, security credentials, 2FA, and notification channels.",
};

export default function RecruiterSettingsPage() {
  return <RecruiterSettingsView />;
}
