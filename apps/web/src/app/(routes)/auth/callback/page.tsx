import { Suspense } from "react";
import AuthCallbackHandler from "@/components/auth/AuthCallbackHandler";

export const metadata = {
  title: "Authenticating — CAMPUSLINK Placement Intelligence",
  description: "Completing Google authentication and redirecting to your placement dashboard.",
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-xs font-semibold text-slate-400">Loading session...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
