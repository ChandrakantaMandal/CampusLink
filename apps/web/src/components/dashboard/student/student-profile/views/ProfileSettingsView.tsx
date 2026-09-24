"use client";

import React from "react";
import { SettingsView } from "@/components/dashboard/student/views/SettingsView";

interface ProfileSettingsViewProps {
  studentName?: string;
  department?: string;
  onNavigateToTab?: (tab: string) => void;
}

export function ProfileSettingsView({
  studentName = "Himanshu Rout",
  department = "Computer Science & Engineering",
  onNavigateToTab,
}: ProfileSettingsViewProps) {
  return (
    <div className="space-y-6">
      <SettingsView
        studentName={studentName}
        department={department}
        onNavigateToTab={onNavigateToTab}
      />
    </div>
  );
}
