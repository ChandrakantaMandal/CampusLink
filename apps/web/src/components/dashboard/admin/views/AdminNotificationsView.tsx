"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building,
  Layers,
  Send,
  Check,
  ExternalLink,
  X,
  Filter,
} from "lucide-react";
import { mockNotifications, type SystemNotification } from "../mock-admin-data";
import { toast } from "sonner";

export default function AdminNotificationsView() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(mockNotifications);
  const [filter, setFilter] = useState("all");
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState({
    title: "",
    audience: "All Students",
    priority: "High",
    body: "",
  });

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "urgent") return n.type === "urgent" || n.type === "warning";
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All placement notifications marked as read!");
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.title || !broadcastMessage.body) {
      toast.error("Please enter notification title and message body");
      return;
    }

    const created: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: "info",
      title: `📢 ${broadcastMessage.title}`,
      description: broadcastMessage.body,
      time: "Just now",
      read: false,
    };

    setNotifications([created, ...notifications]);
    setIsBroadcastModalOpen(false);
    setBroadcastMessage({ title: "", audience: "All Students", priority: "High", body: "" });
    toast.success(`Announcement broadcasted to ${broadcastMessage.audience}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Bell className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Placement Alerts &amp; Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time corporate recruiter alerts, schedule conflict collision warnings, and campus-wide broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs"
          >
            Mark All Read
          </button>
          <button
            type="button"
            onClick={() => setIsBroadcastModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-xs transition-all shadow-md shadow-indigo-600/25"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {(["all", "unread", "urgent"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
              filter === tab
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {tab} Alerts
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              !item.read
                ? item.type === "urgent"
                  ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/30"
                  : "border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                  item.type === "urgent"
                    ? "bg-amber-500 text-slate-950"
                    : item.type === "warning"
                    ? "bg-rose-500 text-white"
                    : item.type === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {item.type === "urgent" || item.type === "warning" ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : item.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Bell className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[11px] text-slate-400 block mt-1.5">{item.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              {item.actionLabel && (
                <Link
                  href={(item.actionUrl || "/admin/dashboard") as Route}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shadow-2xs"
                >
                  <span>{item.actionLabel}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
              {!item.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(item.id)}
                  className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Announcement Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-600" />
                Broadcast Urgent Campus Alert
              </h3>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alert Title *
                </label>
                <input
                  type="text"
                  required
                  value={broadcastMessage.title}
                  onChange={(e) => setBroadcastMessage({ ...broadcastMessage, title: e.target.value })}
                  placeholder="e.g. Google Drive OA Link Released"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={broadcastMessage.audience}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, audience: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="All Students">All Registered Students (1,240)</option>
                    <option value="Eligible Cohort">Eligible Candidates Only (980)</option>
                    <option value="Recruiters">Corporate Recruiters (42)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={broadcastMessage.priority}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, priority: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="High">High (Push + In-app)</option>
                    <option value="Urgent">Urgent Banner</option>
                    <option value="Normal">Normal Notification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Body *
                </label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMessage.body}
                  onChange={(e) => setBroadcastMessage({ ...broadcastMessage, body: e.target.value })}
                  placeholder="Detail instructions for students regarding venue, timing, or document requirements..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  Send Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
