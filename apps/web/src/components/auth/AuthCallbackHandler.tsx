"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import type { Route } from "next";

type Role = "STUDENT" | "RECRUITER" | "ADMIN";

const DASHBOARD_ROUTES: Record<Role, Route> = {
  STUDENT: "/student/dashboard",
  RECRUITER: "/recruiter/dashboard",
  ADMIN: "/admin/dashboard",
};

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function processAuth() {
      try {
        const errorParam = searchParams.get("error");
        if (errorParam) {
          throw new Error(
            errorParam === "access_denied"
              ? "Google authentication was cancelled."
              : `Authentication failed: ${errorParam}`,
          );
        }

        // Retry polling session up to 5 times (cookies may take a moment to propagate)
        let session = null;
        for (let attempt = 0; attempt < 6; attempt++) {
          if (isCancelled) return;
          try {
            const res = await authClient.getSession();
            if (res?.data?.user) {
              session = res.data;
              break;
            }
          } catch (e) {
            console.warn("Session check retry attempt", attempt, e);
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (!session?.user) {
          throw new Error("Unable to establish your session. Please try signing in again.");
        }

        if (isCancelled) return;

        setStatus("success");
        toast.success("Successfully authenticated with Google!");

        const userRole = (session.user as { role?: string })?.role?.toUpperCase() as
          | Role
          | undefined;
        const queryRole = searchParams.get("role")?.toUpperCase() as Role | undefined;

        const effectiveRole: Role =
          userRole && DASHBOARD_ROUTES[userRole]
            ? userRole
            : queryRole && DASHBOARD_ROUTES[queryRole]
              ? queryRole
              : "STUDENT";

        const destination: Route =
          DASHBOARD_ROUTES[effectiveRole] ?? ("/student/dashboard" as Route);

        setTimeout(() => {
          if (!isCancelled) {
            router.replace(destination);
            router.refresh();
          }
        }, 400);
      } catch (err: unknown) {
        if (isCancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during Google sign in.";
        console.error("Auth callback error:", err);
        setStatus("error");
        setErrorMessage(message);
        toast.error(message);
      }
    }

    processAuth();

    return () => {
      isCancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          {status === "loading" && (
            <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          )}
          {status === "error" && (
            <AlertCircle className="h-10 w-10 text-rose-400" />
          )}
        </div>
      </div>

      <div className="max-w-md space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {status === "loading" && "Authenticating with Google..."}
          {status === "success" && "Signed In Successfully!"}
          {status === "error" && "Authentication Failed"}
        </h2>

        <p className="text-sm text-slate-400">
          {status === "loading" &&
            "Please wait while we verify your Google credentials and prepare your placement workspace."}
          {status === "success" &&
            "Redirecting you to your placement dashboard..."}
          {status === "error" &&
            (errorMessage || "Something went wrong while completing Google sign-in.")}
        </p>

        {status === "error" && (
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
