import { Suspense } from "react";

import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return (
    <div className="mx-auto mt-20 w-full max-w-md p-6">
      <div className="text-center">Loading password reset...</div>
    </div>
  );
}
