import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import Dashboard from "./dashboard";

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

  return <Dashboard session={session} />;
}
