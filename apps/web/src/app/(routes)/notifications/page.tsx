import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import Dashboard from "../dashboard/dashboard";

export const metadata = {
  title: "Notifications | CAMPUSLINK",
  description: "Official campus placement announcements, interview slots, and offer notifications",
};

export default async function NotificationsPage() {
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

  return <Dashboard session={session} initialTab="notifications" />;
}
