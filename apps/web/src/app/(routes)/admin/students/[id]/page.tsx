import type { Metadata } from "next";
import StudentDetailView from "@/components/dashboard/students/StudentDetailView";

export const metadata: Metadata = {
  title: "Student Details — CAMPUSLINK Admin",
  description:
    "Full student record: profile, readiness, skills, education, projects, contact info, links, and resume.",
};

export default function AdminStudentDetailPage() {
  return <StudentDetailView basePath="admin" />;
}
