"use client";

import React from "react";
import { NotificationsView } from "@/components/dashboard/student/views/NotificationsView";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentNotifications } from "@/hooks/use-student";
import { toDashboardNotifications } from "@/lib/dashboard-adapters";

export default function StudentNotifications() {
  const notifications = useStudentNotifications();

  return (
    <div className="space-y-6">
      {notifications.data ? (
        <NotificationsView
          initialNotifications={toDashboardNotifications(notifications.data)}
          onRefresh={notifications.refresh}
        />
      ) : notifications.error ? (
        <AggregateError
          message={notifications.error}
          onRetry={notifications.refresh}
        />
      ) : (
        <AggregateLoading label="Loading notifications..." />
      )}
    </div>
  );
}
