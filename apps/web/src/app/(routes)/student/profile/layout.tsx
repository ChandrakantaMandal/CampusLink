"use client";

import React from "react";
import { ProfileProvider } from "@/components/dashboard/student/student-profile/context/ProfileContext";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
