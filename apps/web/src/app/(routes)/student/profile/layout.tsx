"use client";

import React from "react";
import { ProfileSync } from "@/stores/profileStore";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileSync>{children}</ProfileSync>;
}
