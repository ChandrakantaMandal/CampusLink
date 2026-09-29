"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyStudentProfile,
  updateMyStudentProfile,
  type StudentProfile,
  type UpdateStudentPayload,
} from "@/lib/api/student.api";

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
