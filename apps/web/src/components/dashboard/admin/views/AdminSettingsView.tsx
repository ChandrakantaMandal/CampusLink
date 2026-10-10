"use client";

import React, { useEffect, useState } from "react";
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
import {
  getAdminSettings,
  updateAdminSettings,
  type AdminProfileSettings,
  type AdminCampusSettings,
  type AdminSystemSettings,
  type AdminSecuritySettings,
} from "@/lib/api/admin.api";

export default function AdminSettingsView() {
  const [activeTab, setActiveTab] = useState<
    "account" | "campus" | "system" | "security"
  >("account");
  const [saving, setSaving] = useState(false);

  // Settings form states (seed defaults; replaced by server data on load)
  const [profile, setProfile] = useState<AdminProfileSettings>({
    name: "",
    email: "",
    role: "",
    phone: "",
    designation: "",
    department: "",
  });

  const [campusConfig, setCampusConfig] = useState<AdminCampusSettings>({
    collegeName: "Apex Institute of Technology & Management",
    collegeCode: "AITM-751024",
    academicYear: "2025 - 2026",
    placementSeason: "Season 2026",
    activeDepartments: "CSE, IT, ECE, EEE, Mechanical",
    tpoHead: "Dr. Alok Verma",
  });

  const [aiSettings, setAiSettings] = useState<AdminSystemSettings>({
    autoEligibilityFilter: true,
    strictBacklogRule: true,
    aiMatchingThreshold: 75,
    conflictAlertSensitivity: "Strict",
    emailDigestDaily: true,
    scheduleCollisionDetection: true,
  });

  const [security, setSecurity] = useState<AdminSecuritySettings>({
    twoFactorEnabled: false,
    activeSessions: 0,
  });

  useEffect(() => {
    getAdminSettings()
      .then((settings) => {
        setProfile(settings.profile);
        setCampusConfig(settings.campus);
        setAiSettings(settings.system);
        setSecurity(settings.security);
      })
      .catch(() => {
        toast.error("Could not load settings. Please refresh.");
      });
  }, []);

  const handleSave = async (
    section: "profile" | "campus" | "system",
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload =
        section === "profile"
          ? {
              profile: {
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
              },
            }
          : section === "campus"
            ? { campus: campusConfig }
            : { system: aiSettings };
      const fresh = await updateAdminSettings(payload);
      setProfile(fresh.profile);
      setCampusConfig(fresh.campus);
      setAiSettings(fresh.system);
      setSecurity(fresh.security);
      toast.success(
        section === "profile"
          ? "Profile settings updated successfully!"
          : section === "campus"
            ? "Campus configuration updated successfully!"
            : "AI engine parameters applied successfully!",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings.",
      );
    } finally {
      setSaving(false);
    }
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
          Configure institutional parameters, evaluation thresholds, corporate
          MoU guidelines, and access governance.
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
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
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
        <form
          onSubmit={(e) => handleSave("profile", e)}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4 max-w-2xl text-xs"
        >
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Training &amp; Placement Officer Profile
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Admin Officer Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Role
              </label>
              <input
                type="text"
                value={profile.designation}
                disabled
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Direct Phone
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save Profile Changes"}</span>
          </button>
        </form>
      )}

      {/* Tab 2: Campus */}
      {activeTab === "campus" && (
        <form
          onSubmit={(e) => handleSave("campus", e)}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4 max-w-2xl text-xs"
        >
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            College &amp; Academic Season Parameters
          </h3>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              College / Institution Name
            </label>
            <input
              type="text"
              value={campusConfig.collegeName}
              onChange={(e) =>
                setCampusConfig({
                  ...campusConfig,
                  collegeName: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Academic Year
              </label>
              <input
                type="text"
                value={campusConfig.academicYear}
                onChange={(e) =>
                  setCampusConfig({
                    ...campusConfig,
                    academicYear: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Placement Season Identifier
              </label>
              <input
                type="text"
                value={campusConfig.placementSeason}
                onChange={(e) =>
                  setCampusConfig({
                    ...campusConfig,
                    placementSeason: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Active Placement Departments
            </label>
            <input
              type="text"
              value={campusConfig.activeDepartments}
              onChange={(e) =>
                setCampusConfig({
                  ...campusConfig,
                  activeDepartments: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save Campus Configuration"}</span>
          </button>
        </form>
      )}

      {/* Tab 3: System & AI Settings */}
      {activeTab === "system" && (
        <form
          onSubmit={(e) => handleSave("system", e)}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4 max-w-2xl text-xs"
        >
          <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Automated Rules &amp; AI Engine Configuration
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Deterministic CGPA &amp; Backlog Enforcement
                </span>
                <span className="text-[11px] text-slate-500">
                  Prevent students from applying if they fall below recruiter
                  minimum requirements
                </span>
              </div>
              <input
                type="checkbox"
                checked={aiSettings.autoEligibilityFilter}
                onChange={(e) =>
                  setAiSettings({
                    ...aiSettings,
                    autoEligibilityFilter: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Automated Schedule Collision Detection
                </span>
                <span className="text-[11px] text-slate-500">
                  Alert administrators immediately when overlapping interview
                  rounds are created
                </span>
              </div>
              <input
                type="checkbox"
                checked={aiSettings.scheduleCollisionDetection}
                onChange={(e) =>
                  setAiSettings({
                    ...aiSettings,
                    scheduleCollisionDetection: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 rounded"
              />
            </label>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  AI Candidate Matching Sensitivity
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">
                  {aiSettings.aiMatchingThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={aiSettings.aiMatchingThreshold}
                onChange={(e) =>
                  setAiSettings({
                    ...aiSettings,
                    aiMatchingThreshold: parseInt(e.target.value),
                  })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                Matches above this threshold appear as High Fit in the recruiter
                roster.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Apply AI Engine Parameters"}</span>
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
                <span className="font-bold text-slate-900 dark:text-white block">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-[11px] text-slate-500">
                  Require TOTP authenticator code on all administrative logins
                </span>
              </div>
              <span
                className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 border ${
                  security.twoFactorEnabled
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                }`}
              >
                {security.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Active Administrative Sessions
                </span>
                <span className="text-[11px] text-slate-500">
                  Authenticated admin sessions currently open
                </span>
              </div>
              <span className="rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 border border-indigo-200 dark:border-indigo-800">
                {security.activeSessions}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Better-Auth Session Encryption
                </span>
                <span className="text-[11px] text-slate-500">
                  Active session token rotation with secure HTTP-only cookies
                </span>
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
