"use client";

import React, { useEffect, useState } from "react";
import {
  Gift,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  X,
  Mail,
} from "lucide-react";
import {
  type RecruiterOffer,
  type RecruiterCandidate,
  type RecruiterJob,
} from "../recruiter.types";
import {
  getMyOffers,
  createMyOffer,
  sendMyOffer,
  downloadMyOfferPdf,
  getShortlistedCandidates,
  getMyJobs,
  type CreateRecruiterOfferInput,
} from "@/lib/api/recruiter.api";
import { toast } from "sonner";
import { renderOfferLetterHtml } from "@/lib/offer-letter-template";

export default function RecruiterOffersView() {
  const [offers, setOffers] = useState<RecruiterOffer[]>([]);
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingOfferId, setSendingOfferId] = useState<string | null>(null);
  const [previewOffer, setPreviewOffer] = useState<RecruiterOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Offer Form
  const [newOffer, setNewOffer] = useState({
    candidateId: "",
    applicationId: "",
    jobId: "",
    role: "Software Development Engineer (SDE-1)",
    ctc: "16",
    baseSalary: "13.5",
    variableBonus: "2.5",
    joiningDate: "",
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyOffers(), getShortlistedCandidates(), getMyJobs()])
      .then(([offerList, candidateList, jobList]) => {
        if (cancelled) return;
        setOffers(offerList);
        setCandidates(candidateList);
        setJobs(jobList);
        setNewOffer((prev) => ({
          ...prev,
          candidateId: candidateList[0]?.id ?? "",
          applicationId: candidateList[0]?.applicationId ?? "",
          jobId: candidateList[0]?.appliedJobId || jobList[0]?.id || "",
          role: candidateList[0]?.appliedJobTitle || prev.role,
        }));
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load offers");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleIssueOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const ctcText = newOffer.ctc.trim();
    const ctc = Number(ctcText);
    if (ctcText === "" || !Number.isFinite(ctc) || ctc < 0) {
      toast.error("Enter a valid total CTC");
      return;
    }
    if (!newOffer.candidateId) {
      toast.error("No shortlisted candidate selected");
      return;
    }
    const parseOptional = (value: string): number | undefined => {
      const trimmed = value.trim();
      if (trimmed === "") return undefined;
      const parsed = Number(trimmed);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
    };
    const input: CreateRecruiterOfferInput = {
      studentId: newOffer.candidateId,
      applicationId: newOffer.applicationId || undefined,
      role: newOffer.role,
      ctc,
      baseSalary: parseOptional(newOffer.baseSalary),
      variableBonus: parseOptional(newOffer.variableBonus),
      joiningDate: newOffer.joiningDate || undefined,
      jobId: newOffer.jobId || undefined,
    };
    setIsSubmitting(true);
    try {
      const created = await createMyOffer(input);
      setOffers((prev) => [created, ...prev]);
      setIsModalOpen(false);
      toast.success("Offer letter generated", {
        description: `Draft for ${created.candidateName} is ready. Send it from its row when you are ready.`,
      });
    } catch {
      toast.error("Failed to generate offer letter");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOffer = async (offer: RecruiterOffer) => {
    setSendingOfferId(offer.id);
    try {
      const sent = await sendMyOffer(offer.id);
      setOffers((current) => current.map((item) => item.id === sent.id ? sent : item));
      toast.success("Offer letter emailed", { description: `Sent to ${offer.candidateEmail}.` });
    } catch {
      toast.error("Could not send offer letter", { description: "Check the mail server configuration and try again." });
    } finally {
      setSendingOfferId(null);
    }
  };

  const downloadOfferLetter = async (offer: RecruiterOffer) => {
    try {
      const pdf = await downloadMyOfferPdf(offer.id);
      const url = URL.createObjectURL(pdf);
      const anchor = document.createElement("a");
      anchor.href = url;
      const filePart = (value: string) => value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      anchor.download = `Offer-Letter-${filePart(offer.companyName)}-${filePart(offer.candidateName)}-${filePart(offer.role)}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Could not download the offer PDF");
    }
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
          <span>Generate Offer Letter</span>
        </button>
      </div>

      {/* Offers Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4 font-bold">Company</th>
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
              {isLoading && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    Loading offers...
                  </td>
                </tr>
              )}
              {!isLoading && offers.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No offer letters yet. Generate an offer for a candidate to get started.
                  </td>
                </tr>
              )}
              {offers.map((off) => (
                <tr key={off.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{off.companyName}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{off.candidateName}</p>
                    <p className="text-[11px] text-slate-400">{off.candidateEmail || off.candidateBranch}</p>
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

                  {/* Download and send this candidate's offer */}
                  <td className="p-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewOffer(off)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        disabled={sendingOfferId === off.id || !off.candidateEmail}
                        onClick={() => void handleSendOffer(off)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{sendingOfferId === off.id ? "Sending..." : off.acceptanceStatus === "Draft" ? "Send to student" : "Resend email"}</span>
                      </button>
                    </div>
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
                  value={newOffer.applicationId}
                  onChange={(e) => {
                    const selected = candidates.find((candidate) => candidate.applicationId === e.target.value);
                    setNewOffer({
                      ...newOffer,
                      applicationId: selected?.applicationId ?? "",
                      candidateId: selected?.studentId ?? selected?.id ?? "",
                      jobId: selected?.appliedJobId ?? "",
                      role: selected?.appliedJobTitle || newOffer.role,
                    });
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                  disabled={candidates.length === 0}
                >
                  {candidates.length === 0 && (
                    <option value="">No shortlisted candidates</option>
                  )}
                  {candidates.map((c) => (
                    <option key={c.applicationId ?? c.id} value={c.applicationId ?? ""}>
                      {c.name} — {c.appliedJobTitle || "Shortlisted role"} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Linked Job (optional)</label>
                <select
                  value={newOffer.jobId}
                  onChange={(e) => setNewOffer({ ...newOffer, jobId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                >
                  <option value="">None (general offer)</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total CTC (₹ LPA)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={newOffer.ctc}
                    onChange={(e) => setNewOffer({ ...newOffer, ctc: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Salary (₹ LPA)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={newOffer.baseSalary}
                    onChange={(e) => setNewOffer({ ...newOffer, baseSalary: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Variable Bonus (₹ LPA)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={newOffer.variableBonus}
                    onChange={(e) => setNewOffer({ ...newOffer, variableBonus: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expected Joining Date</label>
                <input
                  type="date"
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
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-emerald-500/30 transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isSubmitting ? "Generating..." : "Generate Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewOffer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-6">
          <section className="flex h-[92vh] w-[96vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Offer letter preview</p>
                <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">{previewOffer.companyName} · {previewOffer.candidateName} · {previewOffer.role}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => void downloadOfferLetter(previewOffer)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500">
                  <Download className="h-4 w-4" /> Download letter
                </button>
                <button type="button" aria-label="Close offer preview" onClick={() => setPreviewOffer(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>
            <iframe
              title={`Offer letter for ${previewOffer.candidateName}`}
              srcDoc={renderOfferLetterHtml({ candidateName: previewOffer.candidateName, companyName: previewOffer.companyName, role: previewOffer.role, ctc: previewOffer.ctc, baseSalary: previewOffer.baseSalary || "Not specified", variableBonus: previewOffer.variableBonus || "Not specified", joiningDate: previewOffer.joiningDate || "To be confirmed" })}
              className="min-h-0 w-full flex-1 bg-slate-100"
            />
          </section>
        </div>
      )}
    </div>
  );
}
