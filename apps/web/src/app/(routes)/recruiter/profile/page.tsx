import type { Metadata } from "next";
import RecruiterCompanyProfileView from "@/components/dashboard/recruiter/views/RecruiterCompanyProfileView";

export const metadata: Metadata = {
  title: "Company Profile — CAMPUSLINK Recruiter Portal",
  description: "Manage official company information, recruiter contacts, and campus verification badges.",
};

export default function RecruiterProfilePage() {
  return <RecruiterCompanyProfileView />;
}