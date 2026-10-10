"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyStudentProfile,
  updateMyStudentProfile,
  getMyDashboard,
  getMyReadiness,
  getMyDrives,
  getMySkills,
  getMyJobs,
  getMyApplications,
  getMyInterviews,
  getMyOffers,
  getMyNotifications,
  type StudentProfile,
  type UpdateStudentPayload,
  type StudentDashboardData,
  type StudentReadinessData,
  type StudentDrivesData,
  type StudentSkillsData,
  type StudentJobsData,
  type StudentApplicationsData,
  type StudentInterviewsData,
  type StudentOffersData,
  type StudentNotificationsData,
} from "@/lib/api/student.api";

export interface AggregateResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function useAggregate<T>(fetcher: () => Promise<T>): AggregateResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetcher();

      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refresh: load,
  };
}

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyStudentProfile();

      setProfile(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateStudentPayload) => {
    try {
      setUpdating(true);
      setError(null);

      const updated = await updateMyStudentProfile(data);

      setProfile(updated);

      return updated;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update profile",
      );

      throw error;
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    updating,
    error,
    refresh: loadProfile,
    updateProfile,
  };
}

export function useStudentDashboard(): AggregateResult<StudentDashboardData> {
  const fetcher = useCallback(() => getMyDashboard(), []);
  return useAggregate(fetcher);
}

export function useStudentReadiness(): AggregateResult<StudentReadinessData> {
  const fetcher = useCallback(() => getMyReadiness(), []);
  return useAggregate(fetcher);
}

export function useStudentDrives(): AggregateResult<StudentDrivesData> {
  const fetcher = useCallback(() => getMyDrives(), []);
  return useAggregate(fetcher);
}

export function useStudentSkills(): AggregateResult<StudentSkillsData> {
  const fetcher = useCallback(() => getMySkills(), []);
  return useAggregate(fetcher);
}

export function useStudentJobs(): AggregateResult<StudentJobsData> {
  const fetcher = useCallback(() => getMyJobs(), []);
  return useAggregate(fetcher);
}

export function useStudentApplications(): AggregateResult<StudentApplicationsData> {
  const fetcher = useCallback(() => getMyApplications(), []);
  return useAggregate(fetcher);
}

export function useStudentInterviews(): AggregateResult<StudentInterviewsData> {
  const fetcher = useCallback(() => getMyInterviews(), []);
  return useAggregate(fetcher);
}

export function useStudentOffers(): AggregateResult<StudentOffersData> {
  const fetcher = useCallback(() => getMyOffers(), []);
  return useAggregate(fetcher);
}

export function useStudentNotifications(): AggregateResult<StudentNotificationsData> {
  const fetcher = useCallback(() => getMyNotifications(), []);
  return useAggregate(fetcher);
}
