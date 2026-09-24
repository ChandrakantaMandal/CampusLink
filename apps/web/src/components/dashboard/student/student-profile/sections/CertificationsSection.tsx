"use client";

import React, { useState } from "react";
import {
  Award,
  Plus,
  ExternalLink,
  Calendar,
  Building2,
  Trash2,
  Edit2,
  X,
  ShieldCheck,
} from "lucide-react";
import type { Certification } from "@/data/studentProfile";

interface CertificationsSectionProps {
  certifications: Certification[];
  onAddCertification: (cert: Omit<Certification, "id">) => void;
  onEditCertification: (id: string, updated: Omit<Certification, "id">) => void;
  onDeleteCertification: (id: string) => void;
}

export default function CertificationsSection({
  certifications,
  onAddCertification,
  onEditCertification,
  onDeleteCertification,
}: CertificationsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    issuingOrg: "",
    issueDate: "",
    credentialId: "",
    certificateUrl: "",
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      issuingOrg: "",
      issueDate: "",
      credentialId: "",
      certificateUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setEditingId(cert.id);
    setFormData({
      name: cert.name,
      issuingOrg: cert.issuingOrg,
      issueDate: cert.issueDate,
      credentialId: cert.credentialId || "",
      certificateUrl: cert.certificateUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.issuingOrg.trim()) return;

    if (editingId) {
      onEditCertification(editingId, formData);
    } else {
      onAddCertification(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div id="certifications-section" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm scroll-mt-24 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold border border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Certifications & Accreditations</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified certificates, industry internships, and learning credentials.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Grid of Certification Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {certifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No certifications added yet. Click &quot;Add Certificate&quot; to showcase your achievements.
          </div>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 hover:bg-white hover:shadow-md transition-all group overflow-hidden dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/60">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <span className="truncate">{cert.issuingOrg}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(cert)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      title="Edit certificate"
                      aria-label="Edit certificate"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCertification(cert.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors dark:hover:bg-rose-950/50 dark:hover:text-rose-400 cursor-pointer"
                      title="Delete certificate"
                      aria-label="Delete certificate"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 pt-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    <span>Issued: {cert.issueDate}</span>
                  </div>

                  {cert.credentialId && (
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      ID: <span className="text-slate-700 dark:text-slate-300 font-medium">{cert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              {cert.certificateUrl && (
                <div className="mt-4 pt-2">
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Certification" : "Add Certification"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cybersecurity Internship"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuingOrg}
                  onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })}
                  placeholder="e.g. CTTC or Infosys Springboard"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="e.g. June 2024"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="e.g. CTTC-CS-2024-892"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Certificate URL / Verification Link
                </label>
                <input
                  type="url"
                  value={formData.certificateUrl}
                  onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                  placeholder="https://verify.example.com/id"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#6366F1] px-5 py-2 text-xs font-semibold text-white hover:bg-[#4F46E5] shadow-xs cursor-pointer"
                >
                  {editingId ? "Save Changes" : "Add Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
