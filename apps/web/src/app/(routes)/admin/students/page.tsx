import type { Metadata } from "next";
import StudentsManagementView from "@/components/dashboard/admin/views/StudentsManagementView";

export const metadata: Metadata = {
  title: "Student Management — CAMPUSLINK Admin",
  description: "Manage registered student profiles, verify documents, inspect CGPA eligibility, and track placement readiness.",
};

export default function AdminStudentsPage() {
  return <StudentsManagementView />;
}
