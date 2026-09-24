"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Award,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import type { StudentProfileData } from "@/data/studentProfile";

interface PersonalInformationProps {
  profile: StudentProfileData;
  onChange: (field: keyof StudentProfileData, value: any) => void;
  errors?: Record<string, string>;
}

export default function PersonalInformation({
  profile,
  onChange,
  errors = {},
}: PersonalInformationProps) {
  const departments = [
    "Computer Science Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Data Science & AI",
  ];

  const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"];

  const bioLength = profile.bio?.length || 0;
  const maxBioLength = 300;

  return (
    <div id="personal-info-section" className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 sm:p-8 shadow-sm scroll-mt-24">
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900/50">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep your contact, academic background, and student bio updated for recruiters.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="full-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              id="full-name"
              type="text"
              value={profile.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. Alex Rivera"
              className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm transition-all focus:outline-hidden ${
                errors.name
                  ? "border-rose-400 bg-rose-50/30 text-rose-900 placeholder:text-rose-300 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-100 dark:placeholder:text-rose-400/50 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-indigo-500/15 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              }`}
            />
          </div>
          {errors.name ? (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3 w-3" />
              {errors.name}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Official student name for placement verification.</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="email-address" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email-address"
              type="email"
              value={profile.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="e.g. student@university.edu"
              className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm transition-all focus:outline-hidden ${
                errors.email
                  ? "border-rose-400 bg-rose-50/30 text-rose-900 placeholder:text-rose-300 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-100 dark:placeholder:text-rose-400/50 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-indigo-500/15 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              }`}
            />
          </div>
          {errors.email ? (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Used for interview invites and offer letter deliveries.</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label htmlFor="phone-number" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Phone className="h-4 w-4" />
            </div>
            <input
              id="phone-number"
              type="tel"
              value={profile.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm transition-all focus:outline-hidden ${
                errors.phone
                  ? "border-rose-400 bg-rose-50/30 text-rose-900 placeholder:text-rose-300 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-100 dark:placeholder:text-rose-400/50 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-indigo-500/15 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              }`}
            />
          </div>
          {errors.phone ? (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3 w-3" />
              {errors.phone}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Include country code for recruiter phone calls.</p>
          )}
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label htmlFor="department-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Department <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Building className="h-4 w-4" />
            </div>
            <select
              id="department-select"
              value={profile.department}
              onChange={(e) => onChange("department", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                  {dept}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Selected engineering / discipline branch.</p>
        </div>

        {/* Academic Year */}
        <div className="space-y-1.5">
          <label htmlFor="academic-year" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Academic Year
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Calendar className="h-4 w-4" />
            </div>
            <select
              id="academic-year"
              value={profile.year}
              onChange={(e) => onChange("year", e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 transition-all hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Select academic year</option>
              {academicYears.map((yr) => (
                <option key={yr} value={yr} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                  {yr}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Current ongoing study year.</p>
        </div>

        {/* CGPA */}
        <div className="space-y-1.5">
          <label htmlFor="cgpa-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Cumulative GPA (CGPA) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <Award className="h-4 w-4" />
            </div>
            <input
              id="cgpa-input"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={profile.cgpa}
              onChange={(e) => onChange("cgpa", e.target.value)}
              placeholder="e.g. 8.6"
              className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm transition-all focus:outline-hidden ${
                errors.cgpa
                  ? "border-rose-400 bg-rose-50/30 text-rose-900 placeholder:text-rose-300 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-100 dark:placeholder:text-rose-400/50 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-indigo-500/15 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              }`}
            />
          </div>
          {errors.cgpa ? (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3 w-3" />
              {errors.cgpa}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Must be between 0.0 and 10.0 scale.</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="location-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Location
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
              <MapPin className="h-4 w-4" />
            </div>
            <input
              id="location-input"
              type="text"
              value={profile.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="e.g. Bhubaneswar, India"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
            />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Your current city / location preference for job postings.</p>
        </div>

        {/* Short Bio */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label htmlFor="bio-textarea" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Short Bio <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[11px] font-semibold ${
                bioLength > maxBioLength ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {bioLength} / {maxBioLength} characters
            </span>
          </div>
          <div className="relative">
            <textarea
              id="bio-textarea"
              rows={3}
              value={profile.bio}
              onChange={(e) => onChange("bio", e.target.value)}
              placeholder="Summarize your engineering interests, primary tech stacks, and career aspirations..."
              className={`w-full rounded-xl border p-3.5 text-sm transition-all focus:outline-hidden ${
                errors.bio
                  ? "border-rose-400 bg-rose-50/30 text-rose-900 placeholder:text-rose-300 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-100 dark:placeholder:text-rose-400/50 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10"
                  : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-indigo-500/15 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              }`}
            />
          </div>
          {errors.bio ? (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3 w-3" />
              {errors.bio}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Brief professional summary displayed at the top of candidate evaluation lists.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
