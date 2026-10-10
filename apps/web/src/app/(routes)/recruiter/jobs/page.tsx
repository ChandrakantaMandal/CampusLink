import type { Metadata } from "next";
import RecruiterJobsView from "@/components/dashboard/recruiter/views/RecruiterJobsView";

export const metadata: Metadata = {
  title: "Jobs & Openings — CAMPUSLINK Recruiter Portal",
  description: "Publish and manage campus job postings, recruitment rounds, and academic criteria.",
};

export default function RecruiterJobsPage() {
  return <RecruiterJobsView />;
}
