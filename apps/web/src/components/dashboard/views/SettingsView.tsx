"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  User,
  Bell,
  Shield,
  Briefcase,
  Palette,
  Save,
  RotateCcw,
  CheckCircle2,
  Mail,
  Smartphone,
  ExternalLink,
  Laptop,
  Lock,
  Eye,
  KeyRound,
  Building,
  GraduationCap,
  MapPin,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface SettingsViewProps {
  studentName?: string;
  department?: string;
  onNavigateToTab?: (tab: string) => void;
}

export function SettingsView({
  studentName = "Himanshu Rout",
  department = "Computer Science & Engineering",
  onNavigateToTab,
}: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "account" | "placement" | "notifications" | "security" | "appearance"
  >("account");

  // State management with localStorage persistence
  const [settings, setSettings] = useState({
    // Account details
    fullName: studentName,
    rollNumber: "220101124",
    email: "himanshu.rout@university.edu.in",
    phone: "+91 98765 43210",
    college: "Institute of Technical Education & Research",
    department: department,
    graduationYear: "2026",
    cgpa: "8.85",

    // Placement preferences
    targetRoles: ["Software Engineer", "Full Stack Developer", "AI / ML Engineer"],
    minCtc: 8,
    workMode: "Hybrid",
    relocate: true,
    preferredCities: ["Bangalore", "Hyderabad", "Pune"],

    // Notifications
    emailDrives: true,
    emailShortlists: true,
    smsInterviews: true,
    whatsappAlerts: true,
    aiReadinessTips: true,
    weeklyDigest: false,

    // Security & Privacy
    recruiterVisibility: true,
    showCgpaPublicly: true,
    twoFactorAuth: false,
    sessionAlerts: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("hirebridge_student_settings");
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // fallback to initial
    }
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem("hirebridge_student_settings", JSON.stringify(settings));
      setHasChanges(false);
      toast.success("Settings saved successfully!", {
        description: "Your preferences and account settings have been updated.",
      });
    } catch (e) {
      toast.error("Failed to save settings. Please try again.");
    }
  };

  const handleReset = () => {
    localStorage.removeItem("hirebridge_student_settings");
    setSettings({
      fullName: studentName,
      rollNumber: "220101124",
      email: "himanshu.rout@university.edu.in",
      phone: "+91 98765 43210",
      college: "Institute of Technical Education & Research",
      department: department,
      graduationYear: "2026",
      cgpa: "8.85",
      targetRoles: ["Software Engineer", "Full Stack Developer", "AI / ML Engineer"],
      minCtc: 8,
      workMode: "Hybrid",
      relocate: true,
      preferredCities: ["Bangalore", "Hyderabad", "Pune"],
      emailDrives: true,
      emailShortlists: true,
      smsInterviews: true,
      whatsappAlerts: true,
      aiReadinessTips: true,
      weeklyDigest: false,
      recruiterVisibility: true,
      showCgpaPublicly: true,
      twoFactorAuth: false,
      sessionAlerts: true,
    });
    setHasChanges(false);
    toast.info("Settings reset to defaults.");
  };

  const sections = [
    { id: "account", label: "Account & Profile", icon: User },
    { id: "placement", label: "Placement Preferences", icon: Briefcase },
    { id: "notifications", label: "Notifications & Alerts", icon: Bell },
    { id: "security", label: "Security & Privacy", icon: Shield },
    { id: "appearance", label: "Appearance & Theme", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Platform Preferences
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure your personal placement preferences, drive alert notifications, and security options.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${hasChanges
                  ? "bg-[#6366F1] hover:bg-indigo-600 text-white shadow-indigo-500/25"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
            >
              <Save className="w-3.5 h-3.5" />
              {hasChanges ? "Save Changes" : "Saved"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Layout: Sub-navigation Tabs + Active Tab Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1.5">
          <div className="p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${isActive
                      ? "bg-[#6366F1] text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick link to detailed Student Profile */}
          <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/60 dark:bg-indigo-950/30 text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Complete Resume Profile
            </div>
            <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1">
              Want to update your projects, skills, and certifications for recruiters?
            </p>
            <Link
              href="/profile"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open Student Profile Page
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Settings Content Panel */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. Account & Profile Section */}
          {activeSection === "account" && (
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Academic & Account Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your university verification data used for campus drive eligibility criteria.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    University Roll / Registration No.
                  </label>
                  <input
                    type="text"
                    value={settings.rollNumber}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Verified by University ERP</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Institutional Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={settings.email}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-500 cursor-not-allowed pr-20"
                    />
                    <span className="absolute right-2.5 top-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Number (For Interview Alerts)
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Department / Branch
                  </label>
                  <input
                    type="text"
                    value={settings.department}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Graduation Batch
                  </label>
                  <select
                    value={settings.graduationYear}
                    onChange={(e) => handleChange("graduationYear", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="2025">Class of 2025</option>
                    <option value="2026">Class of 2026</option>
                    <option value="2027">Class of 2027</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Placement Preferences Section */}
          {activeSection === "placement" && (
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Placement & Career Match Preferences
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Helps our AI algorithm rank and match relevant job drives on your overview dashboard.
                </p>
              </div>

              {/* Minimum Expected CTC */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Minimum Target Package (CTC)
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{settings.minCtc} LPA & above
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="1"
                  value={settings.minCtc}
                  onChange={(e) => handleChange("minCtc", Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹4 LPA (Entry)</span>
                  <span>₹15 LPA (Dream)</span>
                  <span>₹35+ LPA (Super Dream)</span>
                </div>
              </div>

              {/* Preferred Work Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Work Arrangement
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Onsite", "Hybrid", "Remote"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleChange("workMode", mode)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${settings.workMode === mode
                          ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Relocation Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Willing to Relocate
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Open to opportunities in cities other than campus location
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.relocate}
                  onChange={(e) => handleChange("relocate", e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 3. Notifications & Alerts Section */}
          {activeSection === "notifications" && (
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Notifications & Urgency Channels
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Never miss an application deadline, shortlist release, or interview slot.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "emailDrives",
                    title: "Campus Drive Registration Alerts",
                    desc: "Instant email when a company opens applications matching your department.",
                  },
                  {
                    key: "emailShortlists",
                    title: "Shortlist & Test Hall Tickets",
                    desc: "Receive test links and hall ticket downloads directly in your inbox.",
                  },
                  {
                    key: "smsInterviews",
                    title: "SMS Reminders for Scheduled Interviews",
                    desc: "Urgent SMS alert 1 hour prior to your technical or HR interview slot.",
                  },
                  {
                    key: "whatsappAlerts",
                    title: "WhatsApp Placement Cell Broadcasts",
                    desc: "Urgent campus notifications sent straight to your registered WhatsApp number.",
                  },
                  {
                    key: "aiReadinessTips",
                    title: "AI Skill Gap & Prep Recommendations",
                    desc: "Personalized system design and DSA practice modules based on test performance.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={(settings as any)[item.key]}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Security & Privacy Section */}
          {activeSection === "security" && (
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Security & Profile Privacy
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage recruiter profile visibility and password protection.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      Corporate Recruiter Resume Visibility
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Allow verified visiting companies to discover and invite your profile directly.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.recruiterVisibility}
                      onChange={(e) => handleChange("recruiterVisibility", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      Two-Factor Authentication (2FA)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Require OTP code via email/SMS when signing in on a new device.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Password reset trigger */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        Account Password
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Last changed 3 months ago
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/reset-password"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 5. Appearance & Theme Section */}
          {activeSection === "appearance" && (
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Appearance & Interface Theme
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Customize the look and feel of your HireBridge dashboard interface.
                </p>
              </div>

              {mounted && (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light Mode", icon: Palette },
                    { id: "dark", label: "Dark Mode", icon: Shield },
                    { id: "system", label: "System Default", icon: Laptop },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${theme === item.id
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
