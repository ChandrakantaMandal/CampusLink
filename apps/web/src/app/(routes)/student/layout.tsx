"use client";

import React, { useState } from "react";

import { authClient } from "@/lib/auth-client";
import StudentHeader from "../../../components/dashboard/student/StudentHeader";
import StudentSidebar from "../../../components/dashboard/student/StudentSidebar";
import FloatingChatWidget from "@/components/ai/FloatingChatWidget";
import UnauthorizedPage from "@/components/common-pages/unauthorized";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

          <p className="text-xs font-semibold text-slate-500">
            Verifying student session...
          </p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "STUDENT") {
    return <UnauthorizedPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased selection:bg-blue-500/20 selection:text-blue-500">
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {children}
        </main>
      </div>

      <FloatingChatWidget role="student" />
    </div>
  );
}
