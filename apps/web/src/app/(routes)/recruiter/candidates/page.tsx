import type { Metadata } from "next";
import RecruiterCandidatesView from "@/components/dashboard/recruiter/views/RecruiterCandidatesView";

export const metadata: Metadata = {
  title: "Candidate Directory — CAMPUSLINK Recruiter Portal",
  description: "Browse, filter, and inspect campus student profiles, CGPA, and readiness scores.",
};

export default function RecruiterCandidatesPage() {
  return <RecruiterCandidatesView />;
}
