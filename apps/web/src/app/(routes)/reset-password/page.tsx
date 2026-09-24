import { Suspense } from "react";
import ResetPasswordForm from "@/components/reset-password-form";

export const metadata = {
  title: "Reset Password — CAMPUSLINK Placement Intelligence",
  description: "Reset and recover your CAMPUSLINK account password securely.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
