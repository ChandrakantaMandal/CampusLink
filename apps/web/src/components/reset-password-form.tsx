"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@CampusLink/ui/components/button";
import { Input } from "@CampusLink/ui/components/input";
import { Label } from "@CampusLink/ui/components/label";

import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@HireBridge/ui/components/button";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get("token");
  const [token, setToken] = useState(tokenParam || "");
  const [manualTokenMode, setManualTokenMode] = useState(false);

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-emerald-500",
  ];

  // Request password reset email
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    const emailValidation = z.string().email("Please enter a valid email address").safeParse(normalizedEmail);
    if (!emailValidation.success) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await authClient.requestPasswordReset(
        {
          email: normalizedEmail,
          redirectTo: "http://localhost:3001/reset-password",
        },
        {
          onSuccess: () => {
            setRequestSent(true);
            toast.success("Password reset instructions sent to your email.");
          },
          onError: (err) => {
            console.error("Password reset error:", err);
            toast.error(err.error?.message || "Failed to send reset link. Please check your email.");
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Perform actual password reset using token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!token.trim()) {
      newErrors.token = "Reset token is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await authClient.resetPassword(
        {
          newPassword: password,
          token: token.trim(),
        },
        {
          onSuccess: () => {
            setResetSuccess(true);
            toast.success("Your password has been successfully reset!");
          },
          onError: (err) => {
            console.error("RESET PASSWORD ERROR:", err);
            toast.error(
              err.error?.message || err.error?.statusText || "Failed to reset password. The link or token may have expired."
            );
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Network error while resetting password.");
    } finally {
      setIsLoading(false);
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
                Placement Security
              </span>
            </div>
          </Link>
        </div>

        {/* Middle Copy */}
        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            <KeyRound className="h-3.5 w-3.5" />
            <span>Account Security &amp; Recovery</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
            Safe, Instant &amp; Encrypted Account Access.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            Restore access to your verified student placement profile, company drive invitations, and readiness analytics.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>Better-Auth cryptographic token protection</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>One-time secure expiring links</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>Immediate session revocation on password update</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Pill */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted Token Exchange</span>
          </div>
          <span>&copy; {new Date().getFullYear()} CAMPUSLINK</span>
        </div>
      </div>

      {/* RIGHT INTERACTIVE PANEL (7 cols on lg) */}
      <div className="flex lg:col-span-7 flex-col justify-between p-6 sm:p-10 lg:p-16">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Theme</span>
            <ModeToggle />
          </div>
        </div>

        {/* Main Box */}
        <div className="mx-auto w-full max-w-md space-y-6 my-auto">
          {/* STATE 1: Reset Success State */}
          {resetSuccess ? (
            <div className="text-center space-y-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-8 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Password Reset Complete!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your password has been successfully updated. You can now log into CAMPUSLINK using your new password.
                </p>
              </div>
              <Link href="/login" className="block pt-2">
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/25 hover:scale-[1.01]">
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : token || manualTokenMode ? (
            /* STATE 2: Set New Password Form (Token Present) */
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                  <Lock className="h-3 w-3" />
                  <span>Verified Reset Session</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Set Your New Password
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Please choose a strong, secure password for your CAMPUSLINK account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* Manual Token input if needed */}
                {(!tokenParam || manualTokenMode) && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Reset Token
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste reset token from email"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    {errors.token && <p className="text-xs text-red-500 font-medium">{errors.token}</p>}
                  </div>
                )}

                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
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
                      placeholder="At least 8 characters"
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

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Password strength:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {strengthLabels[passwordStrength]}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 w-full">
                        {[0, 1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-all duration-300 ${
                              passwordStrength > step
                                ? strengthColors[passwordStrength]
                                : "bg-slate-200 dark:bg-slate-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      placeholder="Repeat new password"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Reset */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-600/25 hover:scale-[1.01] transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating Password...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Update Password</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          ) : requestSent ? (
            /* STATE 3: Request Email Sent Confirmation */
            <div className="text-center space-y-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-8 dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <Mail className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Check Your Inbox
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  We have sent a secure password reset link to <strong className="text-indigo-600 dark:text-indigo-400">{email}</strong>.
                </p>
                <p className="text-[11px] text-slate-400">
                  Didn&apos;t receive it? Check your spam folder or wait a minute before requesting again.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setManualTokenMode(true)}
                  className="w-full text-xs font-semibold"
                >
                  <span>Have a reset token? Enter it manually</span>
                </Button>

                <button
                  type="button"
                  onClick={() => setRequestSent(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Try another email address
                </button>
              </div>
            </div>
          ) : (
            /* STATE 4: Request Reset Link Form (Default when no token) */
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                  <KeyRound className="h-3 w-3" />
                  <span>Account Recovery</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Forgot Your Password?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  No worries! Enter the email address associated with your CAMPUSLINK account and we will send you a secure reset link.
                </p>
              </div>

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Account Email Address
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
                      placeholder="student@university.edu"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-600/25 hover:scale-[1.01] transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Instructions...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Send Reset Link</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Manual token option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setManualTokenMode(true)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Already have a reset token from your email? Enter it here →
                </button>
              </div>
            </div>
          )}

          {/* Bottom Back Link */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Bottom micro-footer */}
        <div className="text-center pt-8 text-[11px] text-slate-400">
          Protected by Better-Auth placement encryption standards.
        </div>
      </div>
    </div>
  );
}
