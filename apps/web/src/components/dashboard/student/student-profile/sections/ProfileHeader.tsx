"use client";

import React, { useRef } from "react";
import {
  Camera,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  GraduationCap,
  MapPin,
  Sparkles,
  BookOpen,
} from "lucide-react";
import type { StudentProfileData } from "@/data/studentProfile";

interface ProfileHeaderProps {
  profile: StudentProfileData;
  isEditing: boolean;
  onToggleEdit: () => void;
  onToggleVisibility: () => void;
  onUpdateAvatar?: (url: string) => void;
}

export default function ProfileHeader({
  profile,
  isEditing,
  onToggleEdit,
  onToggleVisibility,
  onUpdateAvatar,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateAvatar) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onUpdateAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName = profile.name?.trim() || "Student Name";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SN";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      {/* 1. Cover Photo Banner */}
      <div className="relative h-36 sm:h-48 w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
        {/* Decorative Grid Pattern and Glows */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

        {/* Top-Right Tag on Banner */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1 text-xs font-semibold text-white/95 backdrop-blur-md border border-white/15">
          <GraduationCap className="h-3.5 w-3.5 text-indigo-300" />
          <span>Placement Season 2026-2027</span>
        </div>
      </div>

      {/* 2. Profile Details Area (Safely below the cover banner) */}
      <div className="px-6 pb-6 sm:px-8 sm:pb-8">
        {/* Top Row: Avatar overlapping cover on left, action buttons on right */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Avatar Container: ONLY the avatar moves up with negative margin */}
          <div className="relative -mt-14 sm:-mt-20 shrink-0 self-start sm:self-auto">
            <div className="flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white text-3xl sm:text-4xl font-black shadow-2xl ring-4 ring-white dark:ring-slate-900">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={displayName}
                  className="h-full w-full rounded-3xl object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Camera Upload Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-lg border border-slate-200 transition-all hover:scale-110 hover:bg-slate-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-indigo-400 cursor-pointer"
              title="Upload Profile Photo"
              aria-label="Upload profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileChange}
            />
          </div>

          {/* Action Buttons: Positioned comfortably inside the card area */}
          <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0">
            {/* Recruiter Visibility Toggle */}
            <button
              type="button"
              onClick={onToggleVisibility}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border shadow-xs cursor-pointer ${
                profile.isPublic
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700"
                  : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
              title="Toggle recruiter visibility"
            >
              {profile.isPublic ? (
                <>
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <span>Public to Recruiters</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 text-slate-400" />
                  <span>Private Profile</span>
                </>
              )}
            </button>

            {/* Edit Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleEdit}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
                isEditing
                  ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-slate-900/20"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? "Done Editing" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Identity & Metadata Details: Fully visible below the avatar */}
        <div className="mt-4 space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {displayName}
            </h1>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Student</span>
            </span>
          </div>

          {/* Clean Pill Badges for Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 font-medium border border-slate-200/80 dark:border-slate-700/80">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <span>{profile.department || "Department Not Specified"}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 font-medium border border-slate-200/80 dark:border-slate-700/80">
              <GraduationCap className="h-4 w-4 text-slate-400" />
              <span>{profile.year || "Year Not Set"}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 font-medium border border-slate-200/80 dark:border-slate-700/80">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{profile.location || "Location Not Set"}</span>
            </div>
          </div>
        </div>

        {/* 3. Highlight Stats Grid */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200/70 dark:bg-slate-800/40 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Academic CGPA
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {profile.cgpa || "--"}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                / 10.0
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200/70 dark:bg-slate-800/40 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Skills Endorsed
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {profile.skills?.length || 0}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                skills
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200/70 dark:bg-slate-800/40 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Certifications
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                {profile.certifications?.length || 0}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                verified
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200/70 dark:bg-slate-800/40 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Resume Status
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-sm font-bold ${
                  profile.resume
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {profile.resume ? "PDF Attached" : "Not Uploaded"}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {profile.resume?.fileSize || ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
