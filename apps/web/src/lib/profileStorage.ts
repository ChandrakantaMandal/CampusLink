import type { StudentProfileData } from "@/data/studentProfile";

const STORAGE_PREFIX = "hirebridge_student_profile_";

export function getStoredProfile(userKey = "guest"): StudentProfileData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userKey}`);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfileData;
  } catch (err) {
    console.error("Failed to load stored profile:", err);
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfileData, userKey = "guest"): boolean {
  if (typeof window === "undefined") return false;
  // Strictly prevent unauthenticated guests from saving profile changes
  if (!userKey || userKey === "guest") {
    console.warn("Unauthorized: Cannot save profile without signing in.");
    return false;
  }
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userKey}`, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error("Failed to save profile:", err);
    return false;
  }
}

export function clearStoredProfile(userKey = "guest"): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${userKey}`);
    return true;
  } catch (err) {
    console.error("Failed to clear profile:", err);
    return false;
  }
}
