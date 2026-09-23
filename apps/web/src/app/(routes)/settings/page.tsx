import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import Dashboard from "../dashboard/dashboard";

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

  return <Dashboard session={session} initialTab="settings" />;
}
