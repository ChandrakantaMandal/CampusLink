"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Plus,
  Clock,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  X,
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { mockPlacementDrives, type PlacementDrive } from "../mock-admin-data";
import { toast } from "sonner";

export default function PlacementDrivesView() {
  const [drives, setDrives] = useState<PlacementDrive[]>(mockPlacementDrives);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Drive Form State
  const [newDrive, setNewDrive] = useState({
    company: "",
    role: "",
    salary: "₹10 LPA",
    description: "",
    minCgpa: "7.0",
    backlogsAllowed: "0",
    driveDate: "2026-10-10",
    driveTime: "10:00 AM",
    venue: "Main Computer Center",
    openings: "10",
    skills: "Python, DSA, React, SQL",
    rounds: "Online Test, Technical Round, HR Round",
    tier: "Dream" as const,
  });

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.role.toLowerCase().includes(search.toLowerCase()) ||
      d.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: PlacementDrive["status"]) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    if (selectedDrive?.id === id) {
      setSelectedDrive((prev) => prev ? { ...prev, status: newStatus } : null);
    }
    toast.success(`Drive status changed to ${newStatus}`);
  };

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrive.company || !newDrive.role) {
      toast.error("Please provide company name and job role");
      return;
    }

    const created: PlacementDrive = {
      id: `drv-${Date.now()}`,
      company: newDrive.company,
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.svg",
      role: newDrive.role,
      description: newDrive.description || "Exciting campus hiring drive for engineering graduates.",
      requiredSkills: newDrive.skills.split(",").map((s) => s.trim()).filter(Boolean),
      minCgpa: parseFloat(newDrive.minCgpa) || 7.0,
      backlogsAllowed: parseInt(newDrive.backlogsAllowed) || 0,
      salary: newDrive.salary,
      deadline: "2026-10-08",
      driveDate: newDrive.driveDate,
      driveTime: newDrive.driveTime,
      venue: newDrive.venue,
      rounds: newDrive.rounds.split(",").map((r) => r.trim()).filter(Boolean),
      openings: parseInt(newDrive.openings) || 10,
      applicantsCount: 0,
      status: "Open",
      tier: newDrive.tier,
    };

    setDrives([created, ...drives]);
    setIsCreateModalOpen(false);
    toast.success(`Placement Drive for ${created.company} created successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Placement Drives Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Author and publish hiring events, enforce eligibility criteria, configure evaluation rounds, and track applicant rosters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-indigo-600/25 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create New Drive</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drives by company, role, or required skill..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["All", "Open", "Ongoing", "Draft", "Applications Closed", "Completed"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Top Row: Company, Tier, Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white p-2 shadow-2xs border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={drive.logo} alt={drive.company} className="h-8 w-8 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{drive.company}</h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{drive.role}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      drive.status === "Open"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : drive.status === "Ongoing"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : drive.status === "Draft"
                        ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}
                  >
                    {drive.status}
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    {drive.tier} Tier
                  </span>
                </div>
              </div>

              {/* Package & Openings */}
              <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Salary / CTC</span>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{drive.salary}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Openings / Roster</span>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    {drive.openings} Seats &bull; <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold">{drive.applicantsCount} Applied</span>
                  </p>
                </div>
              </div>

              {/* Eligibility Criteria Block */}
              <div className="mt-3 text-xs space-y-1">
                <span className="text-slate-400 text-[11px] font-bold uppercase">Eligibility Requirement:</span>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  Minimum CGPA ≥ <strong className="text-indigo-600 dark:text-indigo-400">{drive.minCgpa}</strong> &bull; Backlogs Allowed: <strong className="text-slate-900 dark:text-white">{drive.backlogsAllowed}</strong>
                </p>
              </div>

              {/* Required Skills Badges */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Required Tech Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {drive.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule and Venue */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span>{drive.driveDate} at {drive.driveTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{drive.venue}</span>
                </div>
              </div>
            </div>

            {/* Actions & Status Dropdown */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <select
                value={drive.status}
                onChange={(e) => handleUpdateStatus(drive.id, e.target.value as any)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="Draft">Draft</option>
                <option value="Open">Open</option>
                <option value="Applications Closed">Applications Closed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                type="button"
                onClick={() => setSelectedDrive(drive)}
                className="cursor-pointer inline-flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1.5 text-xs transition-all"
              >
                <span>Full Details</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Drive Detail Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setSelectedDrive(null)}
              className="absolute top-5 right-5 cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-white p-2 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedDrive.logo} alt={selectedDrive.company} className="h-9 w-9 object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedDrive.company}</h3>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{selectedDrive.role} &bull; {selectedDrive.salary}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {selectedDrive.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Recruitment Rounds:</span>
              <div className="space-y-1.5">
                {selectedDrive.rounds.map((round, idx) => (
                  <div key={round} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 text-xs">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{round}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDrive(null)}
                className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-200 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                Schedule New Campus Placement Drive
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newDrive.company}
                    onChange={(e) => setNewDrive({ ...newDrive, company: e.target.value })}
                    placeholder="e.g. Google India"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Role *</label>
                  <input
                    type="text"
                    required
                    value={newDrive.role}
                    onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                    placeholder="Software Developer"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Salary / CTC</label>
                  <input
                    type="text"
                    value={newDrive.salary}
                    onChange={(e) => setNewDrive({ ...newDrive, salary: e.target.value })}
                    placeholder="₹12 LPA"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDrive.minCgpa}
                    onChange={(e) => setNewDrive({ ...newDrive, minCgpa: e.target.value })}
                    placeholder="7.5"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Backlogs Allowed</label>
                  <input
                    type="number"
                    value={newDrive.backlogsAllowed}
                    onChange={(e) => setNewDrive({ ...newDrive, backlogsAllowed: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={newDrive.skills}
                  onChange={(e) => setNewDrive({ ...newDrive, skills: e.target.value })}
                  placeholder="Python, DSA, SQL, React"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drive Date &amp; Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newDrive.driveDate}
                      onChange={(e) => setNewDrive({ ...newDrive, driveDate: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={newDrive.driveTime}
                      onChange={(e) => setNewDrive({ ...newDrive, driveTime: e.target.value })}
                      placeholder="10:00 AM"
                      className="w-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Venue</label>
                  <input
                    type="text"
                    value={newDrive.venue}
                    onChange={(e) => setNewDrive({ ...newDrive, venue: e.target.value })}
                    placeholder="Computer Lab 2"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Interview Rounds (comma separated)</label>
                <input
                  type="text"
                  value={newDrive.rounds}
                  onChange={(e) => setNewDrive({ ...newDrive, rounds: e.target.value })}
                  placeholder="Online Assessment, Technical Round 1, HR Interview"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
