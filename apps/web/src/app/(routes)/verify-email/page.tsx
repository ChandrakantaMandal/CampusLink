import { Suspense } from "react";

import VerifyEmailForm from "@/components/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailLoading() {
  return (
    <div className="mx-auto mt-20 w-full max-w-md p-6">
      <div className="text-center">
        Loading verification...
      </div>
    </div>
  );
}