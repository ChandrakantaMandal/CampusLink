"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@CampusLink/ui/components/button";
import { Input } from "@CampusLink/ui/components/input";
import { Label } from "@CampusLink/ui/components/label";

import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authClient.resetPassword(
        {
          newPassword: password,
          token,
        },
        {
          onSuccess: () => {
            setSuccess(true);

            toast.success("Password reset successfully.");
          },

          onError: (error) => {
            console.error("RESET PASSWORD ERROR:", error);

            toast.error(
              error.error.message ||
                error.error.statusText ||
                "Failed to reset password.",
            );
          },
        },
      );
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Invalid / missing token
  if (!token) {
    return (
      <div className="mx-auto mt-20 w-full max-w-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid Reset Link</h1>

          <p className="mt-2 text-muted-foreground">
            This password reset link is invalid or missing a token.
          </p>
        </div>
      </div>
    );
  }

  // Password successfully reset
  if (success) {
    return (
      <div className="mx-auto mt-20 w-full max-w-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Password Reset Successful</h1>

          <p className="mt-2 text-muted-foreground">
            Your password has been updated successfully.
          </p>

          <Button
            type="button"
            className="mt-6"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 w-full max-w-md p-6">
      <h1 className="mb-2 text-center text-3xl font-bold">Reset Password</h1>

      <p className="mb-6 text-center text-muted-foreground">
        Enter your new password below.
      </p>

      <form onSubmit={handleResetPassword} className="space-y-5">
        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>

          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter new password"
            minLength={8}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            minLength={8}
            required
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
