import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create Account — CAMPUSLINK Placement Intelligence",
  description: "Create your free CAMPUSLINK account to build your placement profile, calculate readiness, and apply for campus drives.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <SignupForm />
    </Suspense>
  );
}
