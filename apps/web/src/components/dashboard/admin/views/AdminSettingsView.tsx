"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Building,
  User,
  Sliders,
  CheckCircle2,
  Lock,
  Sparkles,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsView() {
  const [activeTab, setActiveTab] = useState<"account" | "campus" | "system" | "security">("account");

  // Settings form states
  const [campusConfig, setCampusConfig] = useState({
    collegeName: "Apex Institute of Technology & Management",
    collegeCode: "AITM-751024",
    academicYear: "2025 - 2026",
    placementSeason: "Season 2026",
    activeDepartments: "CSE, IT, ECE, EEE, Mechanical",
    tpoHead: "Dr. Alok Verma",
  });

  const [aiSettings, setAiSettings] = useState({
    autoEligibilityFilter: true,
    strictBacklogRule: true,
    aiMatchingThreshold: 75,
    conflictAlertSensitivity: "Strict",
    emailDigestDaily: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Institutional settings updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          Campus Placement Control &amp; System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure institutional parameters, evaluation thresholds, corporate MoU guidelines, and access governance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: "account", label: "Admin Profile", icon: User },
          { id: "campus", label: "Campus & TPO Info", icon: Building },
          { id: "system", label: "System & AI Engine", icon: Sliders },
          { id: "security", label: "Security & Access", icon: Shield },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                activeTab === t.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Account */}
      {activeTab === "account" && (
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4 max-w-2xl text-xs">
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Training &amp; Placement Officer Profile
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Officer Name</label>
              <input
                type="text"
                defaultValue="Dr. Alok Verma"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Role</label>
              <input
                type="text"
                defaultValue="Head of Placements (TPO Cell)"
                disabled
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Institutional Email</label>
              <input
                type="email"
                defaultValue="tpo@campuslink.edu"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Phone</label>
              <input
                type="text"
                defaultValue="+91 98765 11223"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 shadow-md shadow-indigo-600/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Changes</span>
          </button>
        </form>
      )}

      {/* Tab 2: Campus */}
      {activeTab === "campus" && (
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4 max-w-2xl text-xs">
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            College &amp; Academic Season Parameters
          </h3>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">College / Institution Name</label>
            <input
              type="text"
              value={campusConfig.collegeName}
              onChange={(e) => setCampusConfig({ ...campusConfig, collegeName: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Academic Year</label>
              <input
                type="text"
                value={campusConfig.academicYear}
                onChange={(e) => setCampusConfig({ ...campusConfig, academicYear: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Placement Season Identifier</label>
              <input
                type="text"
                value={campusConfig.placementSeason}
                onChange={(e) => setCampusConfig({ ...campusConfig, placementSeason: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Active Placement Departments</label>
            <input
              type="text"
              value={campusConfig.activeDepartments}
              onChange={(e) => setCampusConfig({ ...campusConfig, activeDepartments: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 shadow-md shadow-indigo-600/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Campus Configuration</span>
          </button>
        </form>
      )}

      {/* Tab 3: System & AI Settings */}
      {activeTab === "system" && (
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4 max-w-2xl text-xs">
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Automated Rules &amp; AI Engine Configuration
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Deterministic CGPA &amp; Backlog Enforcement</span>
                <span className="text-[11px] text-slate-500">Prevent students from applying if they fall below recruiter minimum requirements</span>
              </div>
              <input
                type="checkbox"
                checked={aiSettings.autoEligibilityFilter}
                onChange={(e) => setAiSettings({ ...aiSettings, autoEligibilityFilter: e.target.checked })}
                className="h-4 w-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Automated Schedule Collision Detection</span>
                <span className="text-[11px] text-slate-500">Alert administrators immediately when overlapping interview rounds are created</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-indigo-600 rounded"
              />
            </label>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">AI Candidate Matching Sensitivity</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">{aiSettings.aiMatchingThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={aiSettings.aiMatchingThreshold}
                onChange={(e) => setAiSettings({ ...aiSettings, aiMatchingThreshold: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Matches above this threshold appear as High Fit in the recruiter roster.</span>
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 shadow-md shadow-indigo-600/20"
          >
            <Save className="h-4 w-4" />
            <span>Apply AI Engine Parameters</span>
          </button>
        </form>
      )}

      {/* Tab 4: Security */}
      {activeTab === "security" && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4 max-w-2xl text-xs">
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Security &amp; Administrative Access Governance
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-500">Require TOTP authenticator code on all administrative logins</span>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200 dark:border-emerald-800">
                Enabled
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Better-Auth Session Encryption</span>
                <span className="text-[11px] text-slate-500">Active session token rotation with secure HTTP-only cookies</span>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200 dark:border-emerald-800">
                Protected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
