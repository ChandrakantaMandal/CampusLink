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
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@CampusLink/ui/components/button";
import AuthLayout from "./AuthLayout";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramRole = searchParams.get("role")?.toLowerCase();
  const initialRole: "student" | "recruiter" | "tpo" =
    paramRole === "recruiter" || paramRole === "tpo" || paramRole === "student"
      ? paramRole
      : "student";

  const [role, setRole] = useState<"student" | "recruiter" | "tpo">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    const emailCheck = z
      .string()
      .email("Please enter a valid email address")
      .safeParse(email.trim());
    if (!emailCheck.success) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("hirebridge_role", role);
      }
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3001/student/dashboard",
      });
    } catch (error) {
      console.error("Google Auth error:", error);
      toast.error("Unable to authenticate with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await authClient.signUp.email(
        {
          email: email.trim(),
          password: password,
          name: name.trim(),
        },
        {
          onSuccess: () => {
            if (typeof window !== "undefined") {
              localStorage.setItem("hirebridge_role", role);
              localStorage.setItem(
                "campuslink_user",
                JSON.stringify({
                  name: name.trim(),
                  email: email.trim(),
                  role,
                })
              );
            }
            if (role === "recruiter") {
              toast.success("Recruiter account authorized! Please verify your corporate email.");
            } else if (role === "tpo") {
              toast.success("TPO Cell account authorized! Please verify your institutional email.");
            } else {
              toast.success("Account created successfully! Please verify your email.");
            }
            router.push(`/verify-email?email=${encodeURIComponent(email.trim())}` as never);
          },
          onError: (err) => {
            console.error("Sign up failed:", err);
            toast.error(
              err.error?.message ||
                err.error?.statusText ||
                "Sign up failed. Please try again."
            );
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Network error during sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleQuery = role ? `?role=${role}` : "";

  return (
    <AuthLayout
      mode="signup"
      title="Create Your Account"
      description="Join the verified placement intelligence network"
    >
      {/* Role Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Select Your Role
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "student", label: "Student", icon: GraduationCap, badge: "Applicant" },
            { id: "recruiter", label: "Recruiter", icon: Briefcase, badge: "Corporate" },
            { id: "tpo", label: "TPO Cell", icon: Building2, badge: "University" },
          ].map((item) => {
            const ItemIcon = item.icon;
            const isSelected = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id as "student" | "recruiter" | "tpo")}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer ${
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

      {/* Social Google Sign-Up */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full h-12 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 font-semibold shadow-xs cursor-pointer"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
          {role === "recruiter"
            ? "Sign up as Recruiter with Google"
            : role === "tpo"
            ? "Sign up as TPO Cell with Google"
            : "Sign up with Google"}
        </span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-950">
          Or register with email
        </span>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder={
                role === "recruiter"
                  ? "Sarah Jenkins (Talent Acquisition)"
                  : role === "tpo"
                  ? "Dr. Rajesh Kumar (Placement Head)"
                  : "Alex Rivera"
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 transition-all"
            />
          </div>
          {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {role === "recruiter"
              ? "Corporate Work Email"
              : role === "tpo"
              ? "Institutional Placement Email"
              : "Email Address"}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder={
                role === "recruiter"
                  ? "recruiter@google.com"
                  : role === "tpo"
                  ? "tpo@university.edu"
                  : "student@university.edu"
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 transition-all"
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Password (min 8 chars)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Confirm Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 transition-all"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full h-12 rounded-xl font-bold text-white shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer ${
            role === "recruiter"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-600/25"
              : role === "tpo"
              ? "bg-gradient-to-r from-indigo-700 to-purple-700 shadow-indigo-700/25"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-600/25"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>
                {role === "recruiter"
                  ? "Register Verified Recruiter"
                  : role === "tpo"
                  ? "Register University TPO Cell"
                  : "Create CAMPUSLINK Account"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Switch to Sign In Link */}
      <div className="text-center pt-2">
        <Link
          href={(`/login${roleQuery}` as Route)}
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Already have an account? Sign in &rarr;
        </Link>
      </div>
    </AuthLayout>
  );
}
