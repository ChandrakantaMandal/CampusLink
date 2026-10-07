"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  createEmptyStudentProfile,
  calculateProfileCompletion,
} from "@/data/studentProfile";
import type { StudentProfileData } from "@/data/studentProfile";
import {
  getMyStudentProfile,
  updateMyStudentProfile,
} from "@/lib/api/student.api";
import type { StudentProfile } from "@/lib/api/student.api";
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
} from "@/lib/profileStorage";

interface ProfileState {
  profile: StudentProfileData;
  savedSnapshot: string;
  isLoaded: boolean;
  isEditing: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfileData>>;
  setSavedSnapshot: (v: string) => void;
  setIsLoaded: (v: boolean) => void;
  setIsEditing: (v: boolean) => void;
  setIsSaving: (v: boolean) => void;
  setErrors: (v: Record<string, string>) => void;
  handleFieldChange: (field: keyof StudentProfileData, value: any) => void;
  handleReset: () => void;
}

export interface ProfileValue {
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

const useProfileStore = create<ProfileState>()((set) => ({
  profile: createEmptyStudentProfile(),
  savedSnapshot: "",
  isLoaded: false,
  isEditing: false,
  isSaving: false,
  errors: {},
  setProfile: (value) =>
    set((s) => ({
      profile:
        typeof value === "function" ? value(s.profile) : value,
    })),
  setSavedSnapshot: (v) => set({ savedSnapshot: v }),
  setIsLoaded: (v) => set({ isLoaded: v }),
  setIsEditing: (v) => set({ isEditing: v }),
  setIsSaving: (v) => set({ isSaving: v }),
  setErrors: (v) => set({ errors: v }),
  handleFieldChange: (field, value) =>
    set((s) => {
      const profile = { ...s.profile, [field]: value };
      if (!s.errors[field]) return { profile };
      const errors = { ...s.errors };
      delete errors[field];
      return { profile, errors };
    }),
  handleReset: () =>
    set((s) => ({
      profile: s.savedSnapshot
        ? (JSON.parse(s.savedSnapshot) as StudentProfileData)
        : s.profile,
      errors: {},
    })),
}));

const FIELD_ERROR_MAP: Record<string, string> = {
  firstName: "name",
  lastName: "name",
  githubUrl: "github",
  linkedinUrl: "linkedin",
  portfolioUrl: "portfolio",
  leetcodeUrl: "leetcode",
  hackerrankUrl: "hackerrank",
  otherWebsiteUrl: "otherWebsite",
};

function mergeApiIntoLocal(
  api: StudentProfile,
  local: StudentProfileData,
): StudentProfileData {
  const name = [api.firstName, api.lastName].filter(Boolean).join(" ");

  return {
    ...local,
    name: name || local.name,
    phone: api.phone ?? local.phone,
    department: api.department ?? local.department,
    cgpa: api.cgpa != null ? String(api.cgpa) : local.cgpa,
    location: api.location ?? local.location,
    bio: api.bio ?? local.bio,
    isPublic: api.isPublic ?? local.isPublic,
    github: api.githubUrl ?? local.github,
    linkedin: api.linkedinUrl ?? local.linkedin,
    portfolio: api.portfolioUrl ?? local.portfolio,
    leetcode: api.leetcodeUrl ?? local.leetcode,
    hackerrank: api.hackerrankUrl ?? local.hackerrank,
    otherWebsite: api.otherWebsiteUrl ?? local.otherWebsite,
    avatarUrl: api.user?.image || local.avatarUrl,
    resume: api.resumeUrl
      ? local.resume?.url === api.resumeUrl
        ? local.resume
        : {
            fileName: decodeURIComponent(
              api.resumeUrl.split("?")[0].split("/").pop() || "resume.pdf",
            ),
            fileSize: "PDF",
            uploadDate: new Date(api.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            url: api.resumeUrl,
          }
      : local.resume,
  };
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  return trimmed && !/^https?:\/\//i.test(trimmed)
    ? `https://${trimmed}`
    : trimmed;
}

export function useProfile(): ProfileValue {
  const profile = useProfileStore((s) => s.profile);
  const savedSnapshot = useProfileStore((s) => s.savedSnapshot);
  const isLoaded = useProfileStore((s) => s.isLoaded);
  const isEditing = useProfileStore((s) => s.isEditing);
  const isSaving = useProfileStore((s) => s.isSaving);
  const errors = useProfileStore((s) => s.errors);
  const setProfile = useProfileStore((s) => s.setProfile);
  const setSavedSnapshot = useProfileStore((s) => s.setSavedSnapshot);
  const setIsEditing = useProfileStore((s) => s.setIsEditing);
  const setIsSaving = useProfileStore((s) => s.setIsSaving);
  const setErrors = useProfileStore((s) => s.setErrors);
  const handleFieldChange = useProfileStore((s) => s.handleFieldChange);
  const handleReset = useProfileStore((s) => s.handleReset);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userKey =
    session?.user?.id ||
    (session?.user?.email ? encodeURIComponent(session.user.email) : "guest");

  const activeNav = (() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 2) return "profile";
    return segments[segments.length - 1];
  })();

  const hasChanges = isLoaded && JSON.stringify(profile) !== savedSnapshot;

  const handleSave = useCallback(async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setIsSaving(true);
    setErrors({});
    try {
      const parts = profile.name.trim().split(/\s+/).filter(Boolean);
      const firstName = parts[0] ?? "";
      const lastName = parts.slice(1).join(" ");

      await updateMyStudentProfile({
        firstName,
        lastName,
        phone: profile.phone.trim(),
        department: profile.department.trim(),
        cgpa: profile.cgpa.trim() ? Number(profile.cgpa) : null,
        location: profile.location.trim(),
        bio: profile.bio.trim(),
        isPublic: profile.isPublic,
        githubUrl: normalizeUrl(profile.github),
        linkedinUrl: normalizeUrl(profile.linkedin),
        portfolioUrl: normalizeUrl(profile.portfolio),
        leetcodeUrl: normalizeUrl(profile.leetcode),
        hackerrankUrl: normalizeUrl(profile.hackerrank),
        otherWebsiteUrl: normalizeUrl(profile.otherWebsite),
      });

      saveStoredProfile(profile, userKey);
      setSavedSnapshot(JSON.stringify(profile));
      setIsEditing(false);
      toast.success("Profile saved");
    } catch (e) {
      const err = e as Error & { fieldErrors?: Record<string, string[]> };
      if (err.fieldErrors) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          const key = FIELD_ERROR_MAP[field] ?? field;
          if (messages?.length && !mapped[key]) {
            mapped[key] = messages[0];
          }
        }
        if (Object.keys(mapped).length > 0) setErrors(mapped);
      }
      toast.error(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }, [session, profile, userKey, router, setIsSaving, setErrors, setSavedSnapshot, setIsEditing]);

  const completion = calculateProfileCompletion(profile);

  return {
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
  };
}

export function ProfileSync({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userKey =
    session?.user?.id ||
    (session?.user?.email ? encodeURIComponent(session.user.email) : "guest");
  const hydratedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (isSessionPending) return;
    if (hydratedKeyRef.current === userKey) return;
    hydratedKeyRef.current = userKey;

    let cancelled = false;
    let hydrated = false;
    const { setProfile, setSavedSnapshot, setIsLoaded } =
      useProfileStore.getState();

    if (session?.user?.id || session?.user?.email) {
      const stored = getStoredProfile(userKey);
      const local =
        stored ??
        createEmptyStudentProfile(
          session.user.name || "",
          session.user.email || "",
          session.user.image || "",
        );

      // Show the local snapshot immediately while the API fetch runs.
      setProfile(local);
      setSavedSnapshot(JSON.stringify(local));
      if (!stored) saveStoredProfile(local, userKey);

      getMyStudentProfile()
        .then((api) => {
          if (cancelled) return;
          const merged: StudentProfileData = {
            ...mergeApiIntoLocal(api, local),
            email: session.user.email || local.email,
            avatarUrl:
              api.user?.image || session.user.image || local.avatarUrl,
          };
          hydrated = true;
          setProfile(merged);
          setSavedSnapshot(JSON.stringify(merged));
          saveStoredProfile(merged, userKey);
        })
        .catch(() => {
          // API unavailable or profile missing remotely — keep the local snapshot.
          hydrated = true;
        });
    } else {
      clearStoredProfile("guest");
      const blank = createEmptyStudentProfile();
      setProfile(blank);
      setSavedSnapshot(JSON.stringify(blank));
    }

    setIsLoaded(true);

    return () => {
      cancelled = true;
      // If hydration never completed (session identity changed mid-fetch),
      // clear the guard so the next run re-fetches instead of bailing out.
      if (!hydrated) hydratedKeyRef.current = null;
    };
  }, [userKey, session, isSessionPending]);

  return <>{children}</>;
}
