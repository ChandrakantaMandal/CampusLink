"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Building,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Briefcase,
  Calendar,
  X,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import type { AdminRecruiter } from "../admin.types";
import { getAdminRecruiters, createAdminRecruiter, verifyAdminRecruiter } from "@/lib/api/admin.api";
import { toast } from "sonner";

export default function RecruitersManagementView() {
  const [recruiters, setRecruiters] = useState<AdminRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRecruiter, setSelectedRecruiter] = useState<AdminRecruiter | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [confirmDeactivateId, setConfirmDeactivateId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAdminRecruiters()
      .then((data) => {
        if (!cancelled) setRecruiters(data);
      })
      .catch(() => {
        toast.error("Failed to load recruiters");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [newRecruiter, setNewRecruiter] = useState({
    name: "",
    email: "",
    password: "",
  });

  const filteredRecruiters = recruiters.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      r.industry.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const refreshRecruiters = async () => {
    const data = await getAdminRecruiters();
    setRecruiters(data);
    setSelectedRecruiter((prev) =>
      prev ? (data.find((r) => r.id === prev.id) ?? prev) : null
    );
  };

  const handleApprove = async (id: string) => {
    if (actingId) return;
    setActingId(id);
    setConfirmDeactivateId(null);
    try {
      await verifyAdminRecruiter(id, "VERIFIED");
      await refreshRecruiters();
      toast.success("Recruiter approved for campus drives!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve recruiter",
      );
    } finally {
      setActingId(null);
    }
  };

  const handleDeactivate = async (id: string) => {
    const target = recruiters.find((r) => r.id === id);
    if (!target) return;
    const reactivating = target.status === "Inactive";
    if (!reactivating && confirmDeactivateId !== id) {
      setConfirmDeactivateId(id);
      return;
    }
    if (actingId) return;
    setActingId(id);
    setConfirmDeactivateId(null);
    try {
      await verifyAdminRecruiter(id, reactivating ? "VERIFIED" : "REJECTED");
      await refreshRecruiters();
      toast.info(reactivating ? "Recruiter reactivated." : "Recruiter deactivated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update recruiter",
      );
    } finally {
      setActingId(null);
    }
  };

  const handleCreateRecruiter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecruiter.name || !newRecruiter.email) {
      toast.error("Please fill in company name and recruiter email");
      return;
    }
    if (newRecruiter.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const created = await createAdminRecruiter({
        name: newRecruiter.name,
        email: newRecruiter.email,
        password: newRecruiter.password,
      });

      setRecruiters([created, ...recruiters]);
      setIsAddModalOpen(false);
      toast.success(`${created.name} added to campus recruitment roster!`);

      setNewRecruiter({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error("Failed to create recruiter");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Recruiter &amp; Company Relations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authorize corporate recruiters, verify MoUs, configure hiring tiers, and review campus drive pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-indigo-600/25 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Recruiter</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, recruiter, or industry..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending Approval</option>
            <option value="Partner">Partner</option>
            <option value="Inactive">Inactive</option>
          </select>
          <span className="text-xs text-slate-400 font-semibold">
            {filteredRecruiters.length} Companies
          </span>
        </div>
      </div>

      {/* Recruiter Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Company</th>
                <th className="px-4 py-3.5">Contact Person</th>
                <th className="px-4 py-3.5">Industry</th>
                <th className="px-4 py-3.5">Jobs</th>
                <th className="px-4 py-3.5">Drives</th>
                <th className="px-4 py-3.5">Tier &amp; CTC</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400 font-semibold">
                    Loading recruiters…
                  </td>
                </tr>
              ) : filteredRecruiters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400 font-semibold">
                    No recruiters found.
                  </td>
                </tr>
              ) : null}
              {!loading &&
                filteredRecruiters.map((rec) => (
                <tr
                  key={rec.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white p-1.5 shadow-2xs border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rec.logo} alt={rec.name} className="h-6 w-6 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                          {rec.name}
                        </span>
                        <a
                          href={rec.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>{rec.website.replace("https://", "")}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{rec.contactPerson}</p>
                    <p className="text-[11px] text-slate-400">{rec.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {rec.industry}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                    {rec.jobsCount}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                    {rec.drivesCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {rec.packageRange}
                    </span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                      {rec.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rec.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : rec.status === "Partner"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                          : rec.status === "Pending"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRecruiter(rec)}
                      className="cursor-pointer rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold px-2.5 py-1 text-[11px] transition-all"
                    >
                      Details
                    </button>
                    {rec.status === "Pending" ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(rec.id)}
                        disabled={actingId === rec.id}
                        className="cursor-pointer rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 text-[11px] transition-all disabled:opacity-60 disabled:cursor-wait"
                      >
                        {actingId === rec.id ? "Working…" : "Approve"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeactivate(rec.id)}
                        onBlur={() =>
                          setConfirmDeactivateId((prev) => (prev === rec.id ? null : prev))
                        }
                        disabled={actingId === rec.id}
                        className={`cursor-pointer rounded-lg px-2 py-1 text-[11px] transition-all disabled:opacity-60 disabled:cursor-wait ${
                          confirmDeactivateId === rec.id
                            ? "bg-rose-600 text-white font-bold"
                            : "border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {actingId === rec.id
                          ? "Working…"
                          : confirmDeactivateId === rec.id
                          ? "Confirm?"
                          : rec.status === "Inactive"
                          ? "Activate"
                          : "Deactivate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recruiter Details Drawer/Modal */}
      {selectedRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setSelectedRecruiter(null)}
              className="absolute top-5 right-5 cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white p-2 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedRecruiter.logo} alt={selectedRecruiter.name} className="h-10 w-10 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedRecruiter.name}</h3>
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-0.5">
                    {selectedRecruiter.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedRecruiter.industry}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Recruiter Lead</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRecruiter.contactPerson}</p>
                <p className="text-[11px] text-slate-500">{selectedRecruiter.email}</p>
                <p className="text-[11px] text-slate-500">{selectedRecruiter.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Compensation Band</span>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedRecruiter.packageRange}</p>
                <p className="text-[11px] text-slate-400 mt-1">Status: <strong className="text-slate-700 dark:text-slate-200">{selectedRecruiter.status}</strong></p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Eligibility Criteria Set:</span>
              <p className="text-slate-600 dark:text-slate-400">{selectedRecruiter.eligibilityCriteria}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Placement Drives:</span>
              <div className="space-y-1.5">
                {selectedRecruiter.activeDrives.map((d) => (
                  <div key={d} className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-900 dark:text-indigo-200">{d}</span>
                    <Link
                      href="/admin/drives"
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Drive</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-2">
              <div className="space-x-2">
                {selectedRecruiter.status === "Pending" ? (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedRecruiter.id)}
                    disabled={actingId === selectedRecruiter.id}
                    className="cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs disabled:opacity-60 disabled:cursor-wait"
                  >
                    {actingId === selectedRecruiter.id ? "Working…" : "Approve Recruiter"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDeactivate(selectedRecruiter.id)}
                    onBlur={() =>
                      setConfirmDeactivateId((prev) =>
                        prev === selectedRecruiter.id ? null : prev
                      )
                    }
                    disabled={actingId === selectedRecruiter.id}
                    className={`cursor-pointer rounded-xl font-bold px-4 py-2 text-xs disabled:opacity-60 disabled:cursor-wait ${
                      confirmDeactivateId === selectedRecruiter.id
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {actingId === selectedRecruiter.id
                      ? "Working…"
                      : confirmDeactivateId === selectedRecruiter.id
                      ? "Confirm?"
                      : "Deactivate"}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecruiter(null)}
                className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-200 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Recruiter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                Add Participating Recruiter
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecruiter} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newRecruiter.name}
                  onChange={(e) => setNewRecruiter({ ...newRecruiter, name: e.target.value })}
                  placeholder="e.g. Microsoft India"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recruiter Email *</label>
                <input
                  type="email"
                  required
                  value={newRecruiter.email}
                  onChange={(e) => setNewRecruiter({ ...newRecruiter, email: e.target.value })}
                  placeholder="hiring@company.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newRecruiter.password}
                  onChange={(e) => setNewRecruiter({ ...newRecruiter, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  The recruiter will use this email and password to sign in.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  Save Recruiter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
