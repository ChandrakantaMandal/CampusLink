"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, LogIn, ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminHeader from "@/components/dashboard/admin/AdminHeader";
import { useAuth } from "@/lib/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isPending } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased selection:bg-indigo-500/20 selection:text-indigo-500">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {isPending ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="text-xs font-semibold text-slate-500">Verifying administrative access...</p>
              </div>
            </div>
          ) : !isAuthenticated ? (
            /* Locked State when accessing directly without logging in */
            <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 sm:p-12 text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 blur-xl animate-pulse" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/40 shadow-2xl shadow-amber-500/15 text-amber-500 dark:text-amber-400">
                  <Lock className="h-11 w-11 animate-pulse" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 px-4 py-1.5 text-xs font-bold mb-4 shadow-xs">
                <ShieldAlert className="h-4 w-4" />
                <span>Administrative Access Locked &bull; TPO Cell</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight max-w-xl">
                Placement Command Center is Locked
              </h1>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                You accessed the CAMPUSLINK Administrative Dashboard without signing in. To manage students, placement drives, recruiter verification, and conflict detection, please <strong className="text-indigo-600 dark:text-indigo-400">log in with your TPO Cell credentials</strong>.
              </p>

              <div className="mt-8 flex items-center justify-center w-full max-w-xs">
                <Link
                  href="/login?role=tpo"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login as TPO Admin</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 max-w-md shadow-xs">
                <p>
                  Quick Demo: Click above and select &ldquo;Fill Form&rdquo; for TPO Cell credentials (<code className="text-indigo-600 dark:text-indigo-400">tpo@campuslink.edu</code>) to test all administrative features.
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
