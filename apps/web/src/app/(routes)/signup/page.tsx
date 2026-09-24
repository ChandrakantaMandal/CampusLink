import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";

export const metadata = {
  title: "Create Account — CAMPUSLINK Placement Intelligence",
  description: "Create your free CAMPUSLINK account to build your placement profile, calculate readiness, and apply for campus drives.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <AuthCard initialMode="signup" />
    </Suspense>
  );
}
