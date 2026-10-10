"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Search,
  Plus,
  MapPin,
  Calendar,
  X,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { type PlacementDrive } from "../admin.types";
import {
  getAdminDrives,
  getCompaniesForDrive,
  getAdminJobs,
  createPlacementDrive,
  updatePlacementDrive,
  deletePlacementDrive,
  VIEW_TO_DRIVE_STATUS,
  type CompanyRaw,
  type AdminJobOption,
  type CreatePlacementDrivePayload,
} from "@/lib/api/admin.api";
import { toast } from "sonner";

interface DriveFormState {
  companyId: string;
  jobIds: string[];
  driveDate: string;
  driveTime: string;
  venue: string;
  rounds: string;
}

const emptyForm = (): DriveFormState => ({
  companyId: "",
  jobIds: [],
  driveDate: "",
  driveTime: "",
  venue: "",
  rounds: "",
});

export default function PlacementDrivesView() {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<CompanyRaw[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [allJobs, setAllJobs] = useState<AdminJobOption[]>([]);
  const [form, setForm] = useState<DriveFormState>(emptyForm);

  useEffect(() => {
    let cancelled = false;
    getAdminDrives()
      .then((data) => {
        if (!cancelled) setDrives(data);
      })
      .catch(() => toast.error("Failed to load placement drives"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ensureOptions = () => {
    if (companies.length === 0) {
      getCompaniesForDrive()
        .then(setCompanies)
        .catch(() => toast.error("Failed to load companies"));
    }
    if (allJobs.length === 0) {
      getAdminJobs()
        .then(setAllJobs)
        .catch(() => toast.error("Failed to load jobs"));
    }
  };

  const openCreateModal = () => {
    setEditingDrive(null);
    setForm(emptyForm());
    setConfirmDeleteId(null);
    setIsFormModalOpen(true);
    ensureOptions();
  };

  const openEditModal = (drive: PlacementDrive) => {
    setEditingDrive(drive);
    setForm({
      companyId: drive.companyId,
      jobIds: drive.jobs?.map((j) => j.id) ?? [],
      driveDate: drive.driveDate,
      driveTime: drive.driveTime,
      venue: drive.venue,
      rounds: drive.rounds.join(", "),
    });
    setIsFormModalOpen(true);
    ensureOptions();
  };

  const openDetails = (drive: PlacementDrive) => {
    setSelectedDrive(drive);
    setConfirmDeleteId(null);
    ensureOptions();
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingDrive(null);
    setConfirmDeleteId(null);
  };

  const companyJobs = allJobs.filter((j) => j.companyId === form.companyId);

  const filteredDrives = drives.filter((d) => {
    const term = search.toLowerCase();
    const matchesSearch =
      d.company.toLowerCase().includes(term) ||
      d.role.toLowerCase().includes(term) ||
      d.requiredSkills.some((s) => s.toLowerCase().includes(term)) ||
      (d.jobs ?? []).some((j) => j.title.toLowerCase().includes(term));
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleJob = (jobId: string) => {
    setForm((f) => ({
      ...f,
      jobIds: f.jobIds.includes(jobId)
        ? f.jobIds.filter((id) => id !== jobId)
        : [...f.jobIds, jobId],
    }));
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: PlacementDrive["status"],
  ) => {
    try {
      await updatePlacementDrive(id, {
        status: VIEW_TO_DRIVE_STATUS[newStatus],
      });
      setDrives((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
      );
      if (selectedDrive?.id === id) {
        setSelectedDrive((prev) =>
          prev ? { ...prev, status: newStatus } : prev,
        );
      }
      toast.success(`Drive status changed to ${newStatus}`);
    } catch {
      toast.error("Failed to update drive status");
    }
  };

  const handleDeleteDrive = async (drive: PlacementDrive) => {
    if (deletingId) return;
    if (confirmDeleteId !== drive.id) {
      setConfirmDeleteId(drive.id);
      return;
    }
    setConfirmDeleteId(null);
    setDeletingId(drive.id);
    try {
      await deletePlacementDrive(drive.id);
      const fresh = await getAdminDrives();
      setDrives(fresh);
      if (selectedDrive?.id === drive.id) setSelectedDrive(null);
      if (editingDrive?.id === drive.id) {
        setIsFormModalOpen(false);
        setEditingDrive(null);
      }
      toast.success("Placement drive deleted");
    } catch {
      toast.error("Failed to delete placement drive");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveDrive = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.companyId) {
      toast.error("Please select a company");
      return;
    }
    const validJobIds = form.jobIds.filter((id) =>
      allJobs.some((j) => j.id === id && j.companyId === form.companyId),
    );
    if (validJobIds.length === 0) {
      toast.error("Select at least one job for the drive");
      return;
    }
    if (!form.driveDate) {
      toast.error("Please choose a drive date");
      return;
    }
    if (!form.driveTime.trim()) {
      toast.error("Please enter a drive time");
      return;
    }
    if (!form.venue.trim()) {
      toast.error("Please enter a venue");
      return;
    }
    const rounds = form.rounds
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    if (rounds.length === 0) {
      toast.error("Enter at least one interview round");
      return;
    }

    const selected = allJobs.filter((j) => validJobIds.includes(j.id));
    const ctcs = selected.map((j) => j.ctc).filter((c): c is string => !!c);
    const cgpas = selected
      .map((j) => j.minCGPA)
      .filter((c): c is number => c != null);
    const skillNames = Array.from(
      new Set(
        selected.flatMap((j) =>
          (j.skills ?? [])
            .map((s) => s?.skill?.name)
            .filter((n): n is string => !!n),
        ),
      ),
    );
    const openings = selected.reduce(
      (sum, j) => sum + (j.openPositions || 1),
      0,
    );
    const backlogsAllowed = selected.reduce(
      (max, j) => Math.max(max, j.maxBacklogs ?? 0),
      0,
    );
    const title = selected.length === 1 ? selected[0].title : "Multiple Roles";
    const companyTier = companies.find((c) => c.id === form.companyId)?.tier;

    const payload: CreatePlacementDrivePayload = {
      companyId: form.companyId,
      jobIds: validJobIds,
      title,
      role: title,
      ...(companyTier ? { tier: companyTier } : {}),
      ...(editingDrive ? {} : { status: "OPEN" }),
      ...(ctcs.length > 0 ? { salary: ctcs[0] } : {}),
      ...(cgpas.length > 0 ? { minCgpa: Math.min(...cgpas) } : {}),
      backlogsAllowed,
      requiredSkills: skillNames,
      openings: openings || 1,
      driveDate: form.driveDate,
      driveTime: form.driveTime.trim(),
      venue: form.venue.trim(),
      rounds,
    };

    setSaving(true);
    try {
      if (editingDrive) {
        await updatePlacementDrive(editingDrive.id, payload);
        toast.success("Placement drive updated");
      } else {
        await createPlacementDrive(payload);
        const companyName =
          companies.find((c) => c.id === form.companyId)?.name ?? "company";
        toast.success(`Placement drive for ${companyName} created`);
      }
      const fresh = await getAdminDrives();
      setDrives(fresh);
      setIsFormModalOpen(false);
      setEditingDrive(null);
      if (selectedDrive) {
        setSelectedDrive(
          fresh.find((d) => d.id === selectedDrive.id) ?? null,
        );
      }
    } catch {
      toast.error(
        editingDrive
          ? "Failed to update placement drive"
          : "Failed to create placement drive",
      );
    } finally {
      setSaving(false);
    }
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
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-indigo-600/25 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Drive</span>
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
            placeholder="Search drives by company, role, job, or required skill..."
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
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
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
        {loading ? (
          <div className="col-span-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-10 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
            Loading placement drives…
          </div>
        ) : filteredDrives.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-10 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
            No placement drives found.
          </div>
        ) : null}
        {!loading && filteredDrives.map((drive) => (
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
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{drive.salary || "—"}</p>
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
                  Minimum CGPA ≥ <strong className="text-indigo-600 dark:text-indigo-400">{drive.minCgpa || "—"}</strong> &bull; Backlogs Allowed: <strong className="text-slate-900 dark:text-white">{drive.backlogsAllowed}</strong>
                </p>
              </div>

              {/* Jobs in this Drive */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Jobs in this Drive:</span>
                <div className="flex flex-wrap gap-1.5">
                  {drive.jobs && drive.jobs.length > 0 ? (
                    drive.jobs.map((j) => (
                      <span
                        key={j.id}
                        className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {j.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{drive.role}</span>
                  )}
                </div>
              </div>

              {/* Required Skills Badges */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Required Tech Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {drive.requiredSkills.length > 0 ? (
                    drive.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="rounded-lg bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">No skills listed</span>
                  )}
                </div>
              </div>

              {/* Schedule and Venue */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span>{drive.driveDate}{drive.driveTime ? ` at ${drive.driveTime}` : ""}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{drive.venue || "TBA"}</span>
                </div>
              </div>
            </div>

            {/* Actions & Status Dropdown */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <select
                value={drive.status}
                onChange={(e) =>
                  handleUpdateStatus(
                    drive.id,
                    e.target.value as PlacementDrive["status"],
                  )
                }
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="Draft">Draft</option>
                <option value="Open">Open</option>
                <option value="Applications Closed">Applications Closed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(drive)}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 text-xs transition-all"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => openDetails(drive)}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1.5 text-xs transition-all"
                >
                  <span>Full Details</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  disabled={deletingId === drive.id}
                  onClick={() => handleDeleteDrive(drive)}
                  onBlur={() =>
                    setConfirmDeleteId((c) => (c === drive.id ? null : c))
                  }
                  className={`cursor-pointer inline-flex items-center gap-1 rounded-xl font-bold px-3 py-1.5 text-xs transition-all disabled:opacity-60 ${
                    confirmDeleteId === drive.id
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400"
                  }`}
                >
                  <Trash2 className="h-3 w-3" />
                  <span>
                    {deletingId === drive.id
                      ? "Deleting..."
                      : confirmDeleteId === drive.id
                        ? "Confirm?"
                        : "Delete"}
                  </span>
                </button>
              </div>
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
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedDrive.role} &bull; {selectedDrive.salary || "Salary not listed"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {selectedDrive.description || "No description provided."}
            </p>

            {/* Drive Overview */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Drive Date &amp; Time</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedDrive.driveDate}{selectedDrive.driveTime ? ` at ${selectedDrive.driveTime}` : ""}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Venue</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5">{selectedDrive.venue || "TBA"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Openings</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5">{selectedDrive.openings} Seats</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Applicants</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5">{selectedDrive.applicantsCount} Applied</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Min CGPA</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5">{selectedDrive.minCgpa || "—"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Backlogs Allowed</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5">{selectedDrive.backlogsAllowed}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Salary / CTC</span>
                <p className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedDrive.salary || "—"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tier / Status</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5">{selectedDrive.tier} &bull; {selectedDrive.status}</p>
              </div>
            </div>

            {/* Jobs in this Drive (enriched) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Jobs in this Drive:</span>
              <div className="space-y-1.5">
                {selectedDrive.jobs && selectedDrive.jobs.length > 0 ? (
                  selectedDrive.jobs.map((j) => {
                    const job = allJobs.find((oj) => oj.id === j.id);
                    const meta = [
                      job?.ctc,
                      job?.minCGPA != null ? `CGPA ≥ ${job.minCGPA}` : null,
                      job?.maxBacklogs != null ? `Backlogs ≤ ${job.maxBacklogs}` : null,
                      job?.openPositions ? `${job.openPositions} seats` : null,
                    ]
                      .filter(Boolean)
                      .join(" • ");
                    return (
                      <div
                        key={j.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                      >
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{j.title}</p>
                        {meta && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{meta}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-500">No jobs assigned</span>
                )}
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Required Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDrive.requiredSkills.length > 0 ? (
                  selectedDrive.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300"
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No skills listed</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Recruitment Rounds:</span>
              <div className="space-y-1.5">
                {selectedDrive.rounds.length > 0 ? (
                  selectedDrive.rounds.map((round, idx) => (
                    <div key={round} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 text-xs">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{round}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No rounds configured</span>
                )}
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
              <button
                type="button"
                disabled={deletingId === selectedDrive.id}
                onClick={() => handleDeleteDrive(selectedDrive)}
                onBlur={() =>
                  setConfirmDeleteId((c) =>
                    c === selectedDrive.id ? null : c,
                  )
                }
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-bold text-xs transition-all disabled:opacity-60 ${
                  confirmDeleteId === selectedDrive.id
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
                    : "bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400"
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deletingId === selectedDrive.id
                  ? "Deleting..."
                  : confirmDeleteId === selectedDrive.id
                    ? "Confirm?"
                    : "Delete Drive"}
              </button>
              <button
                type="button"
                onClick={() => openEditModal(selectedDrive)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 font-bold text-white text-xs shadow-md shadow-indigo-600/20"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Drive Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                {editingDrive ? "Edit Placement Drive" : "Schedule New Campus Placement Drive"}
              </h3>
              <button
                type="button"
                onClick={closeFormModal}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDrive} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company *</label>
                <select
                  value={form.companyId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      companyId: e.target.value,
                      jobIds: [],
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="">Select a company…</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jobs * ({form.jobIds.length} selected)
                </label>
                {!form.companyId ? (
                  <p className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-3 text-center text-slate-500 dark:text-slate-400">
                    Select a company first
                  </p>
                ) : companyJobs.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-3 text-center text-slate-500 dark:text-slate-400">
                    No jobs found for this company
                  </p>
                ) : (
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 space-y-1">
                    {companyJobs.map((job) => (
                      <label
                        key={job.id}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.jobIds.includes(job.id)}
                          onChange={() => toggleJob(job.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-indigo-600 cursor-pointer shrink-0"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex-1">
                          {job.title}
                        </span>
                        {job.ctc && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            {job.ctc}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drive Date *</label>
                  <input
                    type="date"
                    value={form.driveDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, driveDate: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drive Time *</label>
                  <input
                    type="text"
                    value={form.driveTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, driveTime: e.target.value }))
                    }
                    placeholder="10:00 AM"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Venue *</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, venue: e.target.value }))
                  }
                  placeholder="Main Computer Center"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Interview Rounds (comma separated) *</label>
                <input
                  type="text"
                  value={form.rounds}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rounds: e.target.value }))
                  }
                  placeholder="Online Assessment, Technical Round 1, HR Interview"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving…"
                    : editingDrive
                    ? "Save Changes"
                    : "Publish Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
