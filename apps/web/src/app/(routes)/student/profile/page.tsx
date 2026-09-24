"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Sparkles,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { useProfile } from "@/components/dashboard/student/student-profile/context/ProfileContext";
import type { Education, Certification } from "@/data/studentProfile";
import { sampleDemoProfile } from "@/data/studentProfile";

import ProfileHeader from "@/components/dashboard/student/student-profile/sections/ProfileHeader";
import QuickSectionJumper from "@/components/dashboard/student/student-profile/sections/QuickSectionJumper";
import ProfileCompletion from "@/components/dashboard/student/student-profile/sections/ProfileCompletion";
import ProfileInsights from "@/components/dashboard/student/student-profile/sections/ProfileInsights";
import PersonalInformation from "@/components/dashboard/student/student-profile/sections/PersonalInformation";
import SkillsSection from "@/components/dashboard/student/student-profile/sections/SkillsSection";
import EducationSection from "@/components/dashboard/student/student-profile/sections/EducationSection";
import CertificationsSection from "@/components/dashboard/student/student-profile/sections/CertificationsSection";
import ResumeSection from "@/components/dashboard/student/student-profile/sections/ResumeSection";
import PortfolioLinks from "@/components/dashboard/student/student-profile/sections/PortfolioLinks";
import SaveButton from "@/components/dashboard/student/student-profile/sections/SaveButton";

export default function ProfilePage() {
  const {
    profile,
    setProfile,
    session,
    isEditing,
    setIsEditing,
    isSaving,
    errors,
    setErrors,
    hasChanges,
    completion,
    handleFieldChange,
    handleSave,
    handleReset,
  } = useProfile();

  const handleUpdateAvatar = (url: string) => {
    handleFieldChange("avatarUrl", url);
    toast.success("Profile photo updated!");
  };

  const handleToggleVisibility = () => {
    if (!session?.user) {
      toast.error("Sign in required", {
        description:
          "Please sign in to publish your profile to campus recruiters.",
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

  const handleAddSkill = (newSkill: string): boolean => {
    const trimmed = newSkill.trim();
    if (!trimmed) return false;
    if (profile.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase()))
      return false;
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
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

  const handleAddEducation = (eduData: Omit<Education, "id">) => {
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, { ...eduData, id: `edu-${Date.now()}` }],
    }));
    toast.success("Education record added!");
  };

  const handleEditEducation = (id: string, updated: Omit<Education, "id">) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...updated, id } : item,
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

  const handleAddCertification = (certData: Omit<Certification, "id">) => {
    setProfile((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { ...certData, id: `cert-${Date.now()}` },
      ],
    }));
    toast.success("Certification added!");
  };

  const handleEditCertification = (
    id: string,
    updated: Omit<Certification, "id">,
  ) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === id ? { ...updated, id } : item,
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

  const handleUploadResume = (fileData: {
    fileName: string;
    fileSize: string;
    uploadDate: string;
  }) => {
    setProfile((prev) => ({ ...prev, resume: fileData }));
    toast.success(`Resume "${fileData.fileName}" attached successfully!`);
  };

  const handleDeleteResume = () => {
    setProfile((prev) => ({ ...prev, resume: null }));
    toast.info("Resume detached from profile.");
  };

  const handleStartBlank = () => {
    setProfile({
      ...profile,
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    });
    setErrors({});
    toast.success("Loaded blank student profile.");
  };

  const handleLoadSample = () => {
    setProfile({
      ...sampleDemoProfile,
      name: session?.user?.name || sampleDemoProfile.name,
      email: session?.user?.email || sampleDemoProfile.email,
    });
    setErrors({});
    toast.info("Loaded sample placement profile template!");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!profile.name || profile.name.trim().length < 2) {
      newErrors.name = "Full name is required (minimum 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (
      profile.phone &&
      profile.phone.trim().length > 0 &&
      profile.phone.trim().length < 7
    ) {
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
    const urlFields: Array<keyof typeof profile> = [
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

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      {/* Top User Account Status & Action Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-sm">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {session?.user
                  ? `Student: ${session.user.name}`
                  : "Guest Student Workspace"}
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
                : "Preview mode only. Sign in to save changes."}
            </p>
          </div>
        </div>
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

      {/* Profile Setup Checklist */}
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
                  Complete your profile to unlock verified placement drives and
                  accurate readiness scores.
                </p>
              </div>
            </div>
            <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              {completion.completedCount} of {completion.totalCount} sections
              filled
            </div>
          </div>
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

      {/* Profile Header Card */}
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onToggleVisibility={handleToggleVisibility}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <QuickSectionJumper profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          <ProfileCompletion profile={profile} />
          <ProfileInsights profile={profile} />
        </div>
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          <PersonalInformation
            profile={profile}
            onChange={handleFieldChange}
            errors={errors}
          />
        </div>
      </div>

      <SkillsSection
        skills={profile.skills}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
      />

      <EducationSection
        educationList={profile.education}
        onAddEducation={handleAddEducation}
        onEditEducation={handleEditEducation}
        onDeleteEducation={handleDeleteEducation}
      />

      <CertificationsSection
        certifications={profile.certifications}
        onAddCertification={handleAddCertification}
        onEditCertification={handleEditCertification}
        onDeleteCertification={handleDeleteCertification}
      />

      <ResumeSection
        profile={profile}
        onUploadResume={handleUploadResume}
        onDeleteResume={handleDeleteResume}
      />

      <PortfolioLinks
        profile={profile}
        onChange={handleFieldChange}
        errors={errors}
      />

      <SaveButton
        onSave={handleSave}
        onReset={handleReset}
        hasChanges={hasChanges}
        isSaving={isSaving}
        isAuthenticated={Boolean(session?.user)}
      />
    </div>
  );
}
