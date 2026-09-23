"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Quote,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@HireBridge/ui/components/button";

interface AuthCardProps {
  initialMode?: "signin" | "signup";
}

export default function AuthCard({ initialMode = "signin" }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : initialMode
  );

  // Role initialization from URL query or default
  const paramRole = searchParams.get("role")?.toLowerCase();
  const initialRole: "student" | "recruiter" | "tpo" =
    paramRole === "recruiter" || paramRole === "tpo" || paramRole === "student"
      ? paramRole
      : "student";

  // Form states
  const [role, setRole] = useState<"student" | "recruiter" | "tpo">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const emailCheck = z.string().email("Please enter a valid email address").safeParse(email.trim());
    if (!emailCheck.success) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (mode === "signup") {
      if (!name.trim()) {
        newErrors.name = "Full name is required";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
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
        callbackURL: "http://localhost:3001/dashboard",
      });
    } catch (error) {
      console.error("Google Auth error:", error);
      toast.error("Unable to authenticate with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      toast.error("Please enter your email address first");
      return;
    }

    const emailValidation = z.string().email().safeParse(normalizedEmail);
    if (!emailValidation.success) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsForgotPasswordLoading(true);
      await authClient.requestPasswordReset(
        {
          email: normalizedEmail,
          redirectTo: "http://localhost:3001/reset-password",
        },
        {
          onSuccess: () => {
            toast.success("If an account exists, a password reset link has been sent to your email.");
          },
          onError: (err) => {
            console.error(err);
            toast.error(err.error.message || "Unable to send password reset link");
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to request password reset");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    if (mode === "signin") {
      try {
        await authClient.signIn.email(
          {
            email: email.trim(),
            password: password,
          },
          {
            onSuccess: () => {
              if (typeof window !== "undefined") {
                localStorage.setItem("hirebridge_role", role);
              }
              if (role === "recruiter") {
                toast.success("Recruiter access authorized! Redirecting to Recruiter Portal...");
              } else if (role === "tpo") {
                toast.success("TPO Cell verified! Redirecting to Placement Command Center...");
              } else {
                toast.success("Welcome back! Redirecting to your dashboard...");
              }
              router.push("/dashboard");
            },
            onError: (err) => {
              console.error("Sign in failed:", err);
              toast.error(err.error?.message || err.error?.statusText || "Invalid credentials. Please try again.");
            },
          }
        );
      } catch (err) {
        console.error(err);
        toast.error("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign Up
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
              toast.error(err.error?.message || err.error?.statusText || "Sign up failed. Please try again.");
            },
          }
        );
      } catch (err) {
        console.error(err);
        toast.error("Network error during sign up. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-white dark:bg-slate-950">
      {/* LEFT SHOWCASE PANEL (5 cols on lg) */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-12 text-white">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white">
                CAMPUSLINK
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                Placement Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Placement Season 2026</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Connect Campus Ambition With Premier Tech Careers.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            Join over 50,000 students and 500+ global tech recruiters using deterministic eligibility scoring, real-time readiness benchmarks, and 1-click campus drives.
          </p>

          {/* Testimonial Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-300">
              <Quote className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Placed Student Success</span>
            </div>
            <p className="text-xs italic text-slate-200 leading-relaxed">
              &ldquo;CAMPUSLINK spotted my exact skill gaps in Docker &amp; CI/CD, boosted my readiness score from 74 to 94, and I secured my SDE offer in the very first drive!&rdquo;
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="font-bold text-white">Himanshu Rout</span>
              <span className="text-emerald-400 font-semibold">Tier-1 Placed ✅</span>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Better-Auth Encrypted Sessions</span>
          </div>
          <span>&copy; {new Date().getFullYear()} CAMPUSLINK</span>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION PANEL (7 cols on lg) */}
      <div className="flex lg:col-span-7 flex-col justify-between p-6 sm:p-10 lg:p-16">
        {/* Top Bar inside panel */}
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Switch theme</span>
            <ModeToggle />
          </div>
        </div>

        {/* Main Auth Card Container */}
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header Title & Switch */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {mode === "signin" ? "Welcome Back to CAMPUSLINK" : "Create Your Account"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {mode === "signin"
                ? "Enter your credentials to access your placement dashboard"
                : "Join the verified placement intelligence network"}
            </p>

            {/* Pill Toggle for Sign In vs Sign Up */}
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrors({});
                }}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
                  mode === "signin"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrors({});
                }}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Persona / Role Selector (Visible for both Sign In and Sign Up) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {mode === "signin" ? "Sign In As" : "Select Your Role"}
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
                    onClick={() => {
                      setRole(item.id as "student" | "recruiter" | "tpo");
                    }}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-xs font-bold transition-all relative ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-600 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
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

          {/* Social Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-12 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 font-semibold shadow-xs"
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
                ? "Continue as Recruiter with Google"
                : role === "tpo"
                ? "Continue as TPO Cell with Google"
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

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input (Sign Up only) */}
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>
            )}

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
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isForgotPasswordLoading}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {isForgotPasswordLoading ? "Sending link..." : "Forgot password?"}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 rounded-xl font-bold text-white shadow-lg hover:scale-[1.01] transition-all ${
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
                  <span>Verifying Credentials...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>
                    {mode === "signin"
                      ? role === "recruiter"
                        ? "Sign In as Recruiter"
                        : role === "tpo"
                        ? "Sign In as TPO Cell"
                        : "Sign In to Dashboard"
                      : role === "recruiter"
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

          {/* Bottom Switch Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setErrors({});
              }}
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up for free →"
                : "Already have an account? Sign in →"}
            </button>
          </div>
        </div>

        {/* Bottom micro-footer */}
        <div className="text-center pt-8 text-[11px] text-slate-400">
          By continuing, you agree to CAMPUSLINK&apos;s Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
