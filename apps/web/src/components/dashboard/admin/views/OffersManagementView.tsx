"use client";

import React, { useState } from "react";
import {
  Gift,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  Check,
  Building,
  UserCheck,
} from "lucide-react";
import { mockOffers, type OfferItem } from "../mock-admin-data";
import { toast } from "sonner";

export default function OffersManagementView() {
  const [offers, setOffers] = useState<OfferItem[]>(mockOffers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const totalOffers = 112;
  const acceptedOffers = 96;
  const pendingOffers = 8;
  const declinedOffers = 8;

  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      o.studentName.toLowerCase().includes(search.toLowerCase()) ||
      o.company.toLowerCase().includes(search.toLowerCase()) ||
      o.role.toLowerCase().includes(search.toLowerCase()) ||
      o.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyDocument = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, documentStatus: "Verified" } : o))
    );
    toast.success("Offer Letter & Letter of Intent (LOI) verified!");
  };

  const handleExportOffers = () => {
    toast.success("Full Campus Placement Offer Rollout report downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Gift className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Offers &amp; Joining Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track official campus offers, verify candidate employment agreements, and audit company package confirmations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportOffers}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Offers Ledger</span>
        </button>
      </div>

      {/* Offer Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Offers</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalOffers}</p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">Season 2026</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accepted</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{acceptedOffers}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">85.7% Acceptance</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Decision</span>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingOffers}</p>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Awaiting Student</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Declined</span>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{declinedOffers}</p>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Opted Higher / Core</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate, company, package, or roll number..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
        >
          <option value="All">All Offer Statuses</option>
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {/* Offers Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Company</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Package</th>
                <th className="px-4 py-3.5">Offer Date</th>
                <th className="px-4 py-3.5">Joining Date</th>
                <th className="px-4 py-3.5">Document Audit</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {filteredOffers.map((offer) => (
                <tr
                  key={offer.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={offer.avatar}
                        alt={offer.studentName}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {offer.studentName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {offer.rollNo} &bull; {offer.branch}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                    {offer.company}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {offer.role}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {offer.package}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    {offer.offerDate}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    {offer.joiningDate}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        offer.documentStatus === "Verified"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {offer.documentStatus === "Verified" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {offer.documentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        offer.status === "Accepted"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : offer.status === "Pending"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    {offer.documentStatus !== "Verified" ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyDocument(offer.id)}
                        className="cursor-pointer rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 text-[11px] transition-all"
                      >
                        Verify LOI
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Audited
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
