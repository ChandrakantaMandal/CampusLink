"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles,
  UserCheck,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Layers,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  createEmptyStudentProfile,
  sampleDemoProfile,
  calculateProfileCompletion,
} from "@/data/studentProfile";
import type {
  StudentProfileData,
  Education,
  Certification,
} from "@/data/studentProfile";
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
} from "@/lib/profileStorage";

import Sidebar from "@/components/student-profile/layout/Sidebar";
import TopHeader from "@/components/student-profile/layout/TopHeader";
import ProfileHeader from "@/components/student-profile/sections/ProfileHeader";
import QuickSectionJumper from "@/components/student-profile/sections/QuickSectionJumper";
import ProfileCompletion from "@/components/student-profile/sections/ProfileCompletion";
import ProfileInsights from "@/components/student-profile/sections/ProfileInsights";
import PersonalInformation from "@/components/student-profile/sections/PersonalInformation";
import SkillsSection from "@/components/student-profile/sections/SkillsSection";
import EducationSection from "@/components/student-profile/sections/EducationSection";
import CertificationsSection from "@/components/student-profile/sections/CertificationsSection";
import ResumeSection from "@/components/student-profile/sections/ResumeSection";
import PortfolioLinks from "@/components/student-profile/sections/PortfolioLinks";
import SaveButton from "@/components/student-profile/sections/SaveButton";
import { Button } from "@HireBridge/ui/components/button";
import { OpportunitiesView } from "@/components/student-profile/views/OpportunitiesView";
import { ApplicationsView } from "@/components/student-profile/views/ApplicationsView";
import { MessagesView } from "@/components/student-profile/views/MessagesView";
import { NotificationsView } from "@/components/student-profile/views/NotificationsView";
import { ProfileSettingsView } from "@/components/student-profile/views/ProfileSettingsView";

export default function StudentProfilePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userKey = session?.user?.id || (session?.user?.email ? encodeURIComponent(session.user.email) : "guest");

  const [profile, setProfile] = useState<StudentProfileData>(() => {
    return createEmptyStudentProfile();
  });
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeNav, setActiveNav] = useState<string>("profile");

  // Sync activeNav with URL search params if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab) {
        setActiveNav(tab);
      }
    }
  }, []);

  const handleSelectNav = (navId: string) => {
    setActiveNav(navId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (navId === "profile") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", navId);
      }
      window.history.pushState({}, "", url.toString());
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load profile specific to the current authenticated student or guest
  useEffect(() => {
    if (isSessionPending) return;

    if (session?.user?.id || session?.user?.email) {
      const stored = getStoredProfile(userKey);
      if (stored) {
        setProfile(stored);
        setSavedSnapshot(JSON.stringify(stored));
      } else {
        // New student account: pre-populate from their auth profile
        const newStudentProfile = createEmptyStudentProfile(
          session.user.name || "",
          session.user.email || "",
          session.user.image || ""
        );
        setProfile(newStudentProfile);
        setSavedSnapshot(JSON.stringify(newStudentProfile));
        saveStoredProfile(newStudentProfile, userKey);
      }
    } else {
      // Guest: ALWAYS default to a clean blank profile
      clearStoredProfile("guest");
      const blank = createEmptyStudentProfile();
      setProfile(blank);
      setSavedSnapshot(JSON.stringify(blank));
    }
    setIsLoaded(true);
  }, [userKey, session, isSessionPending]);

  const hasChanges = isLoaded && JSON.stringify(profile) !== savedSnapshot;

  // Form field change handler
  const handleFieldChange = (field: keyof StudentProfileData, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-level error on edit
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Avatar update
  const handleUpdateAvatar = (url: string) => {
    handleFieldChange("avatarUrl", url);
    toast.success("Profile photo updated!");
  };

  // Visibility toggle
  const handleToggleVisibility = () => {
    if (!session?.user) {
      toast.error("Sign in required", {
        description: "Please sign in or create an account to publish your profile to campus recruiters.",
      });
      return;
    }
    const nextStatus = !profile.isPublic;
    handleFieldChange("isPublic", nextStatus);
    if (nextStatus) {
      toast.success("Profile is now visible to visiting campus recruiters.");
    } else {
      toast.info("Profile set to private. Recruiters cannot discover you.");
    }
  };

  // Skills handlers
  const handleAddSkill = (newSkill: string): boolean => {
    const trimmed = newSkill.trim();
    if (!trimmed) return false;

    const exists = profile.skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return false;

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    toast.success(`Added "${trimmed}" to skills`);
    return true;
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
    toast.info(`Removed "${skillToRemove}" from skills`);
  };

  // Education handlers
  const handleAddEducation = (eduData: Omit<Education, "id">) => {
    const newEdu: Education = {
      ...eduData,
      id: `edu-${Date.now()}`,
    };
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
    toast.success("Education record added!");
  };

  const handleEditEducation = (id: string, updated: Omit<Education, "id">) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...updated, id } : item
      ),
    }));
    toast.success("Education record updated!");
  };

  const handleDeleteEducation = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
    toast.info("Education record removed.");
  };

  // Certification handlers
  const handleAddCertification = (certData: Omit<Certification, "id">) => {
    const newCert: Certification = {
      ...certData,
      id: `cert-${Date.now()}`,
    };
    setProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
    toast.success("Certification added!");
  };

  const handleEditCertification = (id: string, updated: Omit<Certification, "id">) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === id ? { ...updated, id } : item
      ),
    }));
    toast.success("Certification updated!");
  };

  const handleDeleteCertification = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
    toast.info("Certification removed.");
  };

  // Resume handlers
  const handleUploadResume = (fileData: {
    fileName: string;
    fileSize: string;
    uploadDate: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      resume: fileData,
    }));
    toast.success(`Resume "${fileData.fileName}" attached successfully!`);
  };

  const handleDeleteResume = () => {
    setProfile((prev) => ({
      ...prev,
      resume: null,
    }));
    toast.info("Resume detached from profile.");
  };

  // Reset to empty profile
  const handleStartBlank = () => {
    const blank = createEmptyStudentProfile(
      session?.user?.name || "",
      session?.user?.email || "",
      session?.user?.image || ""
    );
    setProfile(blank);
    setErrors({});
    toast.success("Loaded blank student profile. Ready for your details!");
  };

  // Load sample demo template
  const handleLoadSample = () => {
    setProfile({
      ...sampleDemoProfile,
      // Retain student's own name and email if logged in
      name: session?.user?.name || sampleDemoProfile.name,
      email: session?.user?.email || sampleDemoProfile.email,
    });
    setErrors({});
    toast.info("Loaded sample placement profile template!");
  };

  // Validation according to Section 9
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.name || profile.name.trim().length < 2) {
      newErrors.name = "Full name is required (minimum 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (profile.phone && profile.phone.trim().length > 0 && profile.phone.trim().length < 7) {
      newErrors.phone = "Please enter a valid phone number with country code.";
    }

    if (profile.cgpa) {
      const cgpaNum = parseFloat(profile.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        newErrors.cgpa = "CGPA must be a valid number between 0 and 10.";
      }
    }

    if (profile.bio && profile.bio.length > 300) {
      newErrors.bio = "Bio cannot exceed 300 characters.";
    }

    const urlFields: Array<keyof StudentProfileData> = [
      "github",
      "linkedin",
      "portfolio",
      "leetcode",
      "hackerrank",
      "otherWebsite",
    ];

    urlFields.forEach((key) => {
      const val = profile[key] as string;
      if (val && val.trim()) {
        try {
          new URL(val.startsWith("http") ? val : `https://${val}`);
        } catch {
          newErrors[key] = "Please enter a valid URL (e.g. https://...)";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes handler (persists per student account)
  const handleSave = () => {
    if (!session?.user) {
      toast.error("Sign in required to save changes", {
        description: "Guests cannot save profile changes. Please sign in or create an account to persist your profile.",
      });
      router.push("/login");
      return;
    }

    if (!validateForm()) {
      toast.error("Please resolve validation errors before saving.", {
        description: "Check the highlighted fields marked in red.",
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      saveStoredProfile(profile, userKey);
      setSavedSnapshot(JSON.stringify(profile));
      setIsSaving(false);
      setIsEditing(false);

      const completion = calculateProfileCompletion(profile);
      toast.success("Profile saved to your student account!", {
        description: `Profile is currently ${completion.percentage}% complete.`,
      });
    }, 400);
  };

  // Reset changes
  const handleReset = () => {
    if (savedSnapshot) {
      setProfile(JSON.parse(savedSnapshot));
    }
    setErrors({});
    toast.info("Reverted unsaved changes.");
  };

  const completion = calculateProfileCompletion(profile);

  return (
    <div className="student-profile-workspace min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
      {/* Dark Navy Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        studentName={profile.name || (session?.user?.name ?? "Student")}
        studentRole={profile.department ? `${profile.year || "Student"} • ${profile.department}` : "Student Profile"}
      />

      {/* Main Content Area - Offset for fixed sidebar on desktop */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-72 bg-slate-50 dark:bg-slate-950 min-h-screen">
        {/* Top Header */}
        <TopHeader
          onToggleSidebar={() => setIsSidebarOpen(true)}
          studentName={profile.name || (session?.user?.name ?? "Student")}
          department={profile.department || "Campus Student"}
          isPublic={profile.isPublic}
        />

        {/* Page Content */}
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 max-w-7xl w-full mx-auto space-y-8 bg-slate-50 dark:bg-slate-950">
          {activeNav === "opportunities" && (
            <OpportunitiesView
              studentCgpa={profile.cgpa}
              department={profile.department}
            />
          )}

          {activeNav === "applications" && (
            <ApplicationsView />
          )}

          {activeNav === "messages" && (
            <MessagesView />
          )}

          {activeNav === "notifications" && (
            <NotificationsView />
          )}

          {activeNav === "settings" && (
            <ProfileSettingsView
              studentName={profile.name || (session?.user?.name ?? "Himanshu Rout")}
              department={profile.department || "Computer Science & Engineering"}
              onNavigateToTab={handleSelectNav}
            />
          )}

          {activeNav === "profile" && (
            <>
              {/* Top User Account Status & Action Bar */}
              <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-sm">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {session?.user ? `Student: ${session.user.name}` : "Guest Student Workspace"}
                      </span>
                      {session?.user ? (
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Account Synced
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/60 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Local Preview Mode
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {session?.user
                        ? `Linked to ${session.user.email}. All edits are saved to your student profile.`
                        : "Preview mode only. You must sign in or create an account to save changes to your student profile and apply to drives."}
                    </p>
                  </div>
                </div>

                {/* Quick Profile Actions */}
                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={handleStartBlank}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-200 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Start Blank Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-100 hover:text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/80 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Load Sample Template</span>
                  </button>
                  {!session?.user && (
                    <Link href="/login">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        <span>Sign In to Save</span>
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* New Profile Quick-Start Checklist (Shown when profile is incomplete) */}
              {completion.percentage < 80 && (
                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-slate-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
                        {completion.percentage}%
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Profile Setup Checklist
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Complete your profile to unlock verified placement drives and accurate readiness scores.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                      {completion.completedCount} of {completion.totalCount} sections filled
                    </div>
                  </div>

                  {/* Checklist Suggestions */}
                  {completion.missingSuggestions.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                      {completion.missingSuggestions.slice(0, 3).map((tip, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl bg-white/80 dark:bg-slate-800/80 p-2.5 text-xs text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
                        >
                          <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                          <span className="truncate">{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5.1 Profile Header Card (Full Width) */}
              <ProfileHeader
                profile={profile}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
                onToggleVisibility={handleToggleVisibility}
                onUpdateAvatar={handleUpdateAvatar}
              />

              {/* Quick Section Jumper (Top Section Navigation Bar) */}
              <QuickSectionJumper profile={profile} />

              {/* Row 1: Profile Completion & Placement Readiness beside Personal Information */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column (col-span-4): Profile Completion & Placement Readiness */}
                <div className="lg:col-span-4 xl:col-span-4 space-y-6">
                  <ProfileCompletion profile={profile} />
                  <ProfileInsights profile={profile} />
                </div>

                {/* Right Column (col-span-8): Personal Information */}
                <div className="lg:col-span-8 xl:col-span-8 space-y-6">
                  <PersonalInformation
                    profile={profile}
                    onChange={handleFieldChange}
                    errors={errors}
                  />
                </div>
              </div>

              {/* 5.4 Skills & Technical Expertise Section (Full Width) */}
              <SkillsSection
                skills={profile.skills}
                onAddSkill={handleAddSkill}
                onRemoveSkill={handleRemoveSkill}
              />

              {/* 5.5 Education Section (Full Width) */}
              <EducationSection
                educationList={profile.education}
                onAddEducation={handleAddEducation}
                onEditEducation={handleEditEducation}
                onDeleteEducation={handleDeleteEducation}
              />

              {/* 5.6 Certifications Section (Full Width) */}
              <CertificationsSection
                certifications={profile.certifications}
                onAddCertification={handleAddCertification}
                onEditCertification={handleEditCertification}
                onDeleteCertification={handleDeleteCertification}
              />

              {/* 5.7 Resume & CV Document Section (Full Width) */}
              <ResumeSection
                profile={profile}
                onUploadResume={handleUploadResume}
                onDeleteResume={handleDeleteResume}
              />

              {/* 5.8 Portfolio & Coding Profiles Section (Full Width) */}
              <PortfolioLinks
                profile={profile}
                onChange={handleFieldChange}
                errors={errors}
              />

              {/* Sticky Save Changes Action Bar */}
              <SaveButton
                onSave={handleSave}
                onReset={handleReset}
                hasChanges={hasChanges}
                isSaving={isSaving}
                isAuthenticated={Boolean(session?.user)}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
