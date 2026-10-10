import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";

export const metadata = {
  title: "Dashboard | CAMPUSLINK",
  description: "AI-Powered Campus Placement & Career Intelligence Dashboard",
};

export default async function DashboardPage() {
  let session = null;
  try {
    const res = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });
    session = res?.data || res;
  } catch {
    // Fallback gracefully for local development & demonstration
  }

  return <StudentDashboard />;
}
