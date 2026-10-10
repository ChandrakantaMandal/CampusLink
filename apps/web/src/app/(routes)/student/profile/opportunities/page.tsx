"use client";

import React from "react";
import { useProfile } from "@/stores/profileStore";
import { OpportunitiesView } from "@/components/dashboard/student/student-profile/views/OpportunitiesView";

export default function OpportunitiesPage() {
  const { profile } = useProfile();

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      <OpportunitiesView
        studentCgpa={profile.cgpa || undefined}
        department={profile.department || undefined}
      />
    </div>
  );
}
