"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { ModeToggle } from "@/components/mode-toggle";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (!email) {
      setError("Email address is missing");
      return;
    }

    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/verify-signup-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            otp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      setSuccess("Email verified successfully!");

      // Give the browser a moment to receive the session cookie
      setTimeout(() => {
        router.push("/dashboard" as Route);
      }, 500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email address is missing");
      return;
    }

    if (cooldown > 0) {
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/resend-signup-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setSuccess("A new OTP has been sent to your email.");

      // 60-second cooldown
      setCooldown(60);

      // Clear old OTP
      setOtp("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-md p-6">
      <div className="flex justify-end mb-4">
        <ModeToggle />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Verify your email</h1>

        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          Enter the verification code sent to
        </p>

        <p className="mt-1 text-center font-medium text-indigo-600 dark:text-indigo-400">{email || "your email"}</p>

        <div className="mt-8 space-y-4">
          {/* OTP Input */}
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && otp.length === 6) {
                handleVerify();
              }
            }}
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          {/* Error */}
          {error && <p className="text-center text-sm text-rose-500">{error}</p>}

          {/* Success */}
          {success && (
            <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
          )}

          {/* Verify */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || resending || otp.length !== 6}
            className="w-full rounded-xl bg-[#6366F1] p-3 text-sm font-semibold text-white transition hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {/* Resend */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {resending
                ? "Sending..."
                : cooldown > 0
                  ? `Resend OTP in ${cooldown}s`
                  : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
