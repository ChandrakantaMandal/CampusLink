import type { Metadata } from "next";
import OffersManagementView from "@/components/dashboard/admin/views/OffersManagementView";

export const metadata: Metadata = {
  title: "Placement Offers & Letters — CAMPUSLINK Admin",
  description: "Track accepted offers, verify letters of intent (LOI), and audit package commitments.",
};

export default function AdminOffersPage() {
  return <OffersManagementView />;
}
