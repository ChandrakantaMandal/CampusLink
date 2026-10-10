"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  ShieldCheck,
  Bell,
  Key,
  Lock,
  Save,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  getMyNotificationPrefs,
  updateRecruiterProfile,
} from "@/lib/api/recruiter.api";

export default function RecruiterSettingsView() {
  const [notifPrefs, setNotifPrefs] = useState({
    applications: true,
    interviews: true,
    conflicts: true,
    offers: true,
    digest: false,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyNotificationPrefs()
      .then((prefs) => {
        if (!cancelled) setNotifPrefs(prefs);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load notification preferences");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateRecruiterProfile({ notificationPrefs: notifPrefs });
      toast.success("Recruiter Preferences Updated", {
        description: "Notification preferences saved.",
      });
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Enter both current and new password");
      return;
    }
    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
    });
    if (error) {
      toast.error(error.message || "Failed to change password");
      return;
    }
    toast.success("Password Changed", {
      description: "Your account password has been updated.",
    });
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          Recruiter & Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your recruiter credentials, security safeguards, and campus event notifications.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Notification Preferences */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Recruitment Alert Preferences
          </h2>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">New Application Alerts</p>
                <p className="text-[11px] text-slate-500">Get notified when students apply to your open roles.</p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.applications}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, applications: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Interview Schedule Alerts</p>
                <p className="text-[11px] text-slate-500">Get notified when interview rounds are scheduled or rescheduled.</p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.interviews}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, interviews: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Interview Conflict Alerts (High Priority)</p>
                <p className="text-[11px] text-slate-500">Instant notification when a candidate has overlapping rounds.</p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.conflicts}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, conflicts: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Offer Acceptance Updates</p>
                <p className="text-[11px] text-slate-500">Receive alert when candidates accept or sign offer letters.</p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.offers}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, offers: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Weekly Digest Email</p>
                <p className="text-[11px] text-slate-500">Receive a weekly summary of drives, applications, and offers.</p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.digest}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, digest: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Security & Corporate Access
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleChangePassword}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
