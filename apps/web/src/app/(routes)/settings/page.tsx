import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";

export const metadata = {
  title: "Settings | CAMPUSLINK",
  description: "Account, placement preferences, and security settings",
};

export default async function SettingsPage() {
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

  return <StudentDashboard session={session} initialTab="settings" />;
}
