import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";

export const metadata = {
  title: "Sign In — CAMPUSLINK Placement Intelligence",
  description: "Sign in to your CAMPUSLINK account to access your placement dashboard, eligibility checks, and campus drives.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <AuthCard initialMode="signin" />
    </Suspense>
  );
}
