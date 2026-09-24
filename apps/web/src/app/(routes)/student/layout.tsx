"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentName = "Student";
  const department = "Computer Science & Engineering";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased selection:bg-blue-500/20 selection:text-blue-500">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          studentName={studentName}
          department={department}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
