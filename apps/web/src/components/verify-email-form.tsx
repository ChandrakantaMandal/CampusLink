"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        router.push("/dashboard");
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
    <div className="mx-auto mt-20 w-full max-w-md p-6">
      <h1 className="text-center text-3xl font-bold">Verify your email</h1>

      <p className="mt-3 text-center text-muted-foreground">
        Enter the verification code sent to
      </p>

      <p className="mt-1 text-center font-medium">{email || "your email"}</p>

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
          className="w-full rounded-md border p-3 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Error */}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        {/* Success */}
        {success && (
          <p className="text-center text-sm text-green-600">{success}</p>
        )}

        {/* Verify */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || resending || otp.length !== 6}
          className="w-full rounded-md bg-indigo-600 p-3 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="mt-1 text-sm font-medium text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}
