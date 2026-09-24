"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  createEmptyStudentProfile,
  sampleDemoProfile,
  calculateProfileCompletion,
} from "@/data/studentProfile";
import type { StudentProfileData, Education, Certification } from "@/data/studentProfile";
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
} from "@/lib/profileStorage";

interface ProfileContextValue {
  profile: StudentProfileData;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfileData>>;
  session: any;
  isSessionPending: boolean;
  isLoaded: boolean;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
  errors: Record<string, string>;
  setErrors: (v: Record<string, string>) => void;
  hasChanges: boolean;
  completion: ReturnType<typeof calculateProfileCompletion>;
  handleFieldChange: (field: keyof StudentProfileData, value: any) => void;
  handleSave: () => void;
  handleReset: () => void;
  activeNav: string;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userKey = session?.user?.id || (session?.user?.email ? encodeURIComponent(session.user.email) : "guest");

  const [profile, setProfile] = useState<StudentProfileData>(() => createEmptyStudentProfile());
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeNav = (() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 2) return "profile";
    return segments[segments.length - 1];
  })();

  useEffect(() => {
    if (isSessionPending) return;
    if (session?.user?.id || session?.user?.email) {
      const stored = getStoredProfile(userKey);
      if (stored) {
        setProfile(stored);
        setSavedSnapshot(JSON.stringify(stored));
      } else {
        const newProfile = createEmptyStudentProfile(
          session.user.name || "",
          session.user.email || "",
          session.user.image || ""
        );
        setProfile(newProfile);
        setSavedSnapshot(JSON.stringify(newProfile));
        saveStoredProfile(newProfile, userKey);
      }
    } else {
      clearStoredProfile("guest");
      const blank = createEmptyStudentProfile();
      setProfile(blank);
      setSavedSnapshot(JSON.stringify(blank));
    }
    setIsLoaded(true);
  }, [userKey, session, isSessionPending]);

  const hasChanges = isLoaded && JSON.stringify(profile) !== savedSnapshot;

  const handleFieldChange = useCallback((field: keyof StudentProfileData, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      saveStoredProfile(profile, userKey);
      setSavedSnapshot(JSON.stringify(profile));
      setIsSaving(false);
      setIsEditing(false);
    }, 400);
  }, [session, profile, userKey, router]);

  const handleReset = useCallback(() => {
    if (savedSnapshot) {
      setProfile(JSON.parse(savedSnapshot));
    }
    setErrors({});
  }, [savedSnapshot]);

  const completion = calculateProfileCompletion(profile);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        session,
        isSessionPending,
        isLoaded,
        isEditing,
        setIsEditing,
        isSaving,
        setIsSaving,
        errors,
        setErrors,
        hasChanges,
        completion,
        handleFieldChange,
        handleSave,
        handleReset,
        activeNav,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
