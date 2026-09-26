import type { Metadata } from "next";
import RecruiterInterviewsView from "@/components/dashboard/recruiter/views/RecruiterInterviewsView";

export const metadata: Metadata = {
  title: "Interview Schedule & Conflicts — CAMPUSLINK Recruiter Portal",
  description: "Schedule campus interviews, configure panel evaluation rounds, and detect schedule overlaps.",
};

export default function RecruiterInterviewsPage() {
  return <RecruiterInterviewsView />;
}
