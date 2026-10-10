import type { Metadata } from "next";
import StudentDetailView from "@/components/dashboard/students/StudentDetailView";

export const metadata: Metadata = {
  title: "Candidate Details — CAMPUSLINK Recruiter Portal",
  description:
    "Full candidate record: profile, readiness, skills, education, projects, contact info, links, and resume.",
};

export default function RecruiterCandidateDetailPage() {
  return <StudentDetailView basePath="recruiter" />;
}
