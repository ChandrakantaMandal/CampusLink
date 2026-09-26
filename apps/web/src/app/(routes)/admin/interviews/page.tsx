import type { Metadata } from "next";
import InterviewScheduleView from "@/components/dashboard/admin/views/InterviewScheduleView";

export const metadata: Metadata = {
  title: "Interview Schedule & Conflicts — CAMPUSLINK Admin",
  description: "Placement interview calendars, panel allocations, and collision detection diagnostics.",
};

export default function AdminInterviewsPage() {
  return <InterviewScheduleView />;
}
