"use client";

import React, { useState } from "react";
import {
  Gift,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  AlertCircle,
  X,
  Building,
} from "lucide-react";
import {
  mockRecruiterOffers,
  type RecruiterOffer,
  mockRecruiterCandidates,
  mockRecruiterJobs,
} from "../mock-recruiter-data";
import { toast } from "sonner";

export default function RecruiterOffersView() {
  const [offers, setOffers] = useState<RecruiterOffer[]>(mockRecruiterOffers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Offer Form
  const [newOffer, setNewOffer] = useState({
    candidateId: mockRecruiterCandidates[0].id,
    jobId: mockRecruiterJobs[0].id,
    role: "Software Development Engineer (SDE-1)",
    ctc: "₹16.0 LPA",
    baseSalary: "₹13.5 LPA",
    variableBonus: "₹2.5 LPA Joining Bonus",
    joiningDate: "July 15, 2026",
  });

  const handleIssueOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = mockRecruiterCandidates.find((c) => c.id === newOffer.candidateId);

    const created: RecruiterOffer = {
      id: `off-0${offers.length + 1}`,
      candidateId: newOffer.candidateId,
      candidateName: candidate ? candidate.name : "Candidate",
      candidateBranch: candidate ? candidate.branch : "CSE",
      jobId: newOffer.jobId,
      role: newOffer.role,
      ctc: newOffer.ctc,
      baseSalary: newOffer.baseSalary,
      variableBonus: newOffer.variableBonus,
      joiningDate: newOffer.joiningDate,
      offerLetterUrl: "/documents/offers/Generated_Offer.pdf",
      acceptanceStatus: "Sent",
      documentVerification: "Pending Review",
      joiningStatus: "Awaiting Onboarding",
    };

    setOffers([created, ...offers]);
    setIsModalOpen(false);
    toast.success("Offer Letter Issued 🎉", {
      description: `Formal offer extended to ${created.candidateName} for ${created.ctc}.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Gift className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            Offers & Campus Commitments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dispatch official appointment letters, track candidate acceptance, and verify joining onboarding.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Generate & Issue Offer</span>
        </button>
      </div>

      {/* Offers Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4 font-bold">Candidate</th>
                <th className="p-4 font-bold">Role & CTC</th>
                <th className="p-4 font-bold">Compensation Split</th>
                <th className="p-4 font-bold">Joining Date</th>
                <th className="p-4 font-bold">Acceptance Status</th>
                <th className="p-4 font-bold">Doc Verification</th>
                <th className="p-4 font-bold">Joining Status</th>
                <th className="p-4 font-bold text-right">Offer Letter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {offers.map((off) => (
                <tr key={off.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{off.candidateName}</p>
                    <p className="text-[11px] text-slate-400">{off.candidateBranch}</p>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{off.role}</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{off.ctc}</p>
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    <p>Base: {off.baseSalary}</p>
                    <p className="text-[11px] text-slate-400">{off.variableBonus}</p>
                  </td>

                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                    {off.joiningDate}
                  </td>

                  {/* Acceptance Status */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        off.acceptanceStatus === "Accepted"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : off.acceptanceStatus === "Pending Acceptance"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {off.acceptanceStatus === "Accepted" && <CheckCircle2 className="h-3 w-3" />}
                      {off.acceptanceStatus}
                    </span>
                  </td>

                  {/* Verification */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        off.documentVerification === "Verified"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {off.documentVerification}
                    </span>
                  </td>

                  {/* Joining Status */}
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                    {off.joiningStatus}
                  </td>

                  {/* Download Offer */}
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => toast.info("Downloading offer letter document...")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate Offer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Generate Formal Campus Offer
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleIssueOffer} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Selected Candidate</label>
                <select
                  value={newOffer.candidateId}
                  onChange={(e) => setNewOffer({ ...newOffer, candidateId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                >
                  {mockRecruiterCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.branch} - {c.cgpa} CGPA)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Designation / Role</label>
                <input
                  type="text"
                  value={newOffer.role}
                  onChange={(e) => setNewOffer({ ...newOffer, role: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total CTC</label>
                  <input
                    type="text"
                    value={newOffer.ctc}
                    onChange={(e) => setNewOffer({ ...newOffer, ctc: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Salary</label>
                  <input
                    type="text"
                    value={newOffer.baseSalary}
                    onChange={(e) => setNewOffer({ ...newOffer, baseSalary: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expected Joining Date</label>
                <input
                  type="text"
                  value={newOffer.joiningDate}
                  onChange={(e) => setNewOffer({ ...newOffer, joiningDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-emerald-500/30 transition-all cursor-pointer"
                >
                  Issue Offer Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
