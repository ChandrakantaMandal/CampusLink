import type { Metadata } from "next";
import PlacementDrivesView from "@/components/dashboard/admin/views/PlacementDrivesView";

export const metadata: Metadata = {
  title: "Placement Drives — CAMPUSLINK Admin",
  description: "Schedule and manage on-campus recruitment drives, evaluation rounds, venues, and applicant criteria.",
};

export default function AdminDrivesPage() {
  return <PlacementDrivesView />;
}
