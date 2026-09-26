import type { Metadata } from "next";
import RecruiterOffersView from "@/components/dashboard/recruiter/views/RecruiterOffersView";

export const metadata: Metadata = {
  title: "Offers & Letters — CAMPUSLINK Recruiter Portal",
  description: "Track formal job offer letters, candidate acceptance rates, and document verification.",
};

export default function RecruiterOffersPage() {
  return <RecruiterOffersView />;
}
