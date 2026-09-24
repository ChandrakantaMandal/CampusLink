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
  Award,
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

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Decorative top gradient banner */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-purple-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 pt-10 sm:pt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar and basic info */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Avatar container */}
            <div className="relative group self-start sm:self-auto">
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white text-3xl font-black shadow-xl ring-4 ring-white dark:ring-slate-900">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Upload avatar trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-md border border-slate-200 transition-transform hover:scale-110 hover:bg-slate-50 hover:text-indigo-600 focus:outline-hidden dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-indigo-400 cursor-pointer"
                title="Change profile picture"
                aria-label="Upload profile avatar"
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

            {/* Name, department, academic year */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {profile.name || "Student Name"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Verified Student
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                  <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  {profile.department || "Department Not Specified"}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <GraduationCap className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  {profile.year || "Year Not Set"}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  {profile.location || "Location Not Set"}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons on the right */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Visibility Toggle Button */}
            <button
              type="button"
              onClick={onToggleVisibility}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs border cursor-pointer ${
                profile.isPublic
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-950/80"
                  : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
              }`}
              title="Toggle recruiter visibility"
            >
              {profile.isPublic ? (
                <>
                  <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Public to Recruiters</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span>Private Profile</span>
                </>
              )}
            </button>

            {/* Edit Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleEdit}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer ${
                isEditing
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  : "bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-indigo-600/30"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? "Done Editing" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-200/60 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Academic CGPA
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{profile.cgpa ? profile.cgpa : "--"}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/ 10.0</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-200/60 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Skills Endorsed
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{profile.skills.length}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">skills listed</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-200/60 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Certifications
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{profile.certifications.length}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">verified</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-200/60 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Resume Status
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-sm font-bold ${profile.resume ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {profile.resume ? "PDF Attached" : "Not Uploaded"}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {profile.resume ? profile.resume.fileSize : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
