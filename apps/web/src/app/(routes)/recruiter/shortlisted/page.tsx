import type { Metadata } from "next";
import RecruiterShortlistedView from "@/components/dashboard/recruiter/views/RecruiterShortlistedView";

export const metadata: Metadata = {
  title: "Shortlisted Candidates — CAMPUSLINK Recruiter Portal",
  description: "View and manage candidates who cleared academic eligibility and AI screening.",
};

export default function RecruiterShortlistedPage() {
  return <RecruiterShortlistedView />;
}
