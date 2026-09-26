"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Bell,
  Key,
  Lock,
  Smartphone,
  Save,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function RecruiterSettingsView() {
  const [notifPrefs, setNotifPrefs] = useState({
    applications: true,
    interviews: true,
    conflicts: true,
    offers: true,
    digest: false,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Recruiter Preferences Updated", {
      description: "Notification preferences and corporate security settings saved.",
    });
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
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500">Secure recruiter login with authenticator app or SMS OTP.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  toast.info(twoFactorEnabled ? "2FA Disabled" : "2FA Configured and Enabled");
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  twoFactorEnabled
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
                }`}
              >
                {twoFactorEnabled ? "Enabled ✓" : "Enable 2FA"}
              </button>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
