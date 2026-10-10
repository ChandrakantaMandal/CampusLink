"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@CampusLink/ui/components/button";
import AuthLayout from "./AuthLayout";

type LoginRole = "STUDENT" | "RECRUITER" | "ADMIN";

const dashboardRoutes: Record<LoginRole, Route> = {
  STUDENT: "/student/dashboard",
  RECRUITER: "/recruiter/dashboard",
  ADMIN: "/admin/dashboard",
};

function getDashboardFromBackendRole(
  backendRole: string | undefined,
): Route | null {
  if (
    backendRole === "STUDENT" ||
    backendRole === "RECRUITER" ||
    backendRole === "ADMIN"
  ) {
    return dashboardRoutes[backendRole];
  }

  return null;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramRole = searchParams.get("role")?.toUpperCase();

  const initialRole: LoginRole =
    paramRole === "RECRUITER" ||
    paramRole === "ADMIN" ||
    paramRole === "STUDENT"
      ? paramRole
      : "STUDENT";

  const [role, setRole] = useState<LoginRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  
const handleGoogleAuth = async () => {
  try {
    setIsLoading(true);

    const callbackURL = new URL(
      "/auth/callback",
      window.location.origin,
    );

    callbackURL.searchParams.set("role", role);

    await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackURL.toString(),
      errorCallbackURL: "/login?error=google_auth",
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    toast.error("Unable to authenticate with Google. Please try again.");
    setIsLoading(false);
  }
};

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      setIsForgotPasswordLoading(true);

      await authClient.requestPasswordReset(
        {
          email: normalizedEmail,
          redirectTo: new URL(
            "/reset-password",
            window.location.origin,
          ).toString(),
        },
        {
          onSuccess: () => {
            toast.success(
              "If an account exists, a password reset link has been sent to your email.",
            );
          },
          onError: (error) => {
            console.error("Password reset error:", error);
            toast.error(
              error.error?.message || "Unable to send password reset link",
            );
          },
        },
      );
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast.error("Failed to request password reset");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      await authClient.signIn.email(
        {
          email: email.trim().toLowerCase(),
          password,
        },
        {
          onSuccess: async () => {
            try {
              const sessionResult = await authClient.getSession();

              const backendRole = (
                sessionResult.data?.user as { role?: string } | undefined
              )?.role;

              const actualDashboard = getDashboardFromBackendRole(backendRole);

              if (!actualDashboard) {
                toast.error(
                  "Your account role could not be verified. Please contact support.",
                );
                await authClient.signOut();
                return;
              }

              if (backendRole !== role) {
                toast.error(
                  "Your account does not match the selected login role.",
                );
                router.replace(actualDashboard);
                router.refresh();
                return;
              }

              toast.success("Signed in successfully. Redirecting...");
              router.replace(actualDashboard);
              router.refresh();
            } catch (error) {
              console.error("Unable to verify user role:", error);
              toast.error(
                "Unable to verify your account role. Please try again.",
              );
            }
          },
          onError: (error) => {
            console.error("Email sign-in error:", error);
            toast.error(
              error.error?.message ||
                "Invalid email or password. Please try again.",
            );
          },
        },
      );
    } catch (error) {
      console.error("Sign-in request failed:", error);
      toast.error(
        "Unable to connect. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const roleQuery = `?role=${role}`;

  return (
    <AuthLayout
      mode="signin"
      title="Welcome Back to CAMPUSLINK"
      description="Enter your credentials to access your placement dashboard"
    >
      {/* Role Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Sign In As
        </label>

        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: "STUDENT",
              label: "Student",
              icon: GraduationCap,
              badge: "Applicant",
            },
            {
              id: "RECRUITER",
              label: "Recruiter",
              icon: Briefcase,
              badge: "Corporate",
            },
            {
              id: "ADMIN",
              label: "Admin",
              icon: Building2,
              badge: "Administration",
            },
          ].map((item) => {
            const ItemIcon = item.icon;
            const isSelected = role === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id as LoginRole)}
                aria-pressed={isSelected}
                className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-600 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <ItemIcon className="h-4 w-4" />
                <span>{item.label}</span>
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="h-12 w-full cursor-pointer rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
          />
          <path
            fill="#34A853"
            d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
          />
          <path
            fill="#FBBC05"
            d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.08.31-1.59V7.88H3.3A9.5 9.5 0 0 0 2.5 12c0 1.53.37 2.98 1.03 4.12l3.01-2.53Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.42 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.01 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
          />
        </svg>

        <span>
          {role === "RECRUITER"
            ? "Continue as Recruiter with Google"
            : role === "ADMIN"
              ? "Continue as Admin with Google"
              : "Continue with Google"}
        </span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>

        <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-950">
          Or with email & credentials
        </span>
      </div>

      {/* Email and Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {role === "RECRUITER"
              ? "Corporate Work Email"
              : role === "ADMIN"
                ? "Administrator Email"
                : "Email Address"}
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Mail className="h-4 w-4" />
            </div>

            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={
                role === "RECRUITER"
                  ? "recruiter@company.com"
                  : role === "ADMIN"
                    ? "admin@university.edu"
                    : "student@university.edu"
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isForgotPasswordLoading}
              className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-60 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {isForgotPasswordLoading ? "Sending link..." : "Forgot password?"}
            </button>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Lock className="h-4 w-4" />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className={`h-12 w-full cursor-pointer rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
            role === "RECRUITER"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-600/25"
              : role === "ADMIN"
                ? "bg-gradient-to-r from-indigo-700 to-purple-700 shadow-indigo-700/25"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-600/25"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>
                {role === "RECRUITER"
                  ? "Sign In as Recruiter"
                  : role === "ADMIN"
                    ? "Sign In as Admin"
                    : "Sign In to Dashboard"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Signup Link */}
      <div className="pt-2 text-center">
        <Link
          href={`/signup${roleQuery}` as Route}
          className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 sm:text-sm"
        >
          Don&apos;t have an account? Sign up for free &rarr;
        </Link>
      </div>
    </AuthLayout>
  );
}
