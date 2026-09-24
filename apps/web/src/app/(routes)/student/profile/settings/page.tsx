"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useProfile } from "@/components/dashboard/student/student-profile/context/ProfileContext";
import { ProfileSettingsView } from "@/components/dashboard/student/student-profile/views/ProfileSettingsView";

export default function SettingsPage() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      <ProfileSettingsView
        studentName={profile.name || undefined}
        department={profile.department || undefined}
        onNavigateToTab={(tab: string) => {
          if (tab === "settings") return;
          const path =
            tab === "profile" ? "/student/profile" : `/student/profile/${tab}`;
          router.push(path as Route);
        }}
      />
    </div>
  );
}
