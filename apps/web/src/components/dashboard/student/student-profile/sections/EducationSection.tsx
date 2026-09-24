"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Plus,
  Calendar,
  Building,
  Award,
  Trash2,
  Edit2,
  X,
  BookOpen,
} from "lucide-react";
import type { Education } from "@/data/studentProfile";

interface EducationSectionProps {
  educationList: Education[];
  onAddEducation: (edu: Omit<Education, "id">) => void;
  onEditEducation: (id: string, updated: Omit<Education, "id">) => void;
  onDeleteEducation: (id: string) => void;
}

export default function EducationSection({
  educationList,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
}: EducationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    degree: "",
    branch: "",
    institution: "",
    startYear: "",
    endYear: "",
    cgpa: "",
    description: "",
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      degree: "",
      branch: "",
      institution: "",
      startYear: "",
      endYear: "",
      cgpa: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      degree: edu.degree,
      branch: edu.branch,
      institution: edu.institution,
      startYear: edu.startYear,
      endYear: edu.endYear,
      cgpa: edu.cgpa,
      description: edu.description,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim()) return;

    if (editingId) {
      onEditEducation(editingId, formData);
    } else {
      onAddEducation(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div id="education-section" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm scroll-mt-24 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold border border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Education Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Academic credentials, colleges attended, and current degree progress.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Timeline or Card list */}
      <div className="mt-6 space-y-4">
        {educationList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No education records added yet. Click &quot;Add Education&quot; to include your college/degree.
          </div>
        ) : (
          <div className="relative border-l-2 border-indigo-100 dark:border-indigo-950 pl-4 sm:pl-6 space-y-6 ml-2 sm:ml-3">
            {educationList.map((edu) => (
              <div key={edu.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[25px] sm:-left-[33px] top-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md ring-4 ring-white dark:ring-slate-900">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 hover:bg-white hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Building className="h-3.5 w-3.5 text-indigo-500" />
                          {edu.institution}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                          {edu.startYear} – {edu.endYear}
                        </span>
                        <span>•</span>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60">
                          CGPA: {edu.cgpa}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => openEditModal(edu)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer"
                        title="Edit education"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEducation(edu.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors dark:hover:bg-rose-950/50 dark:hover:text-rose-400 cursor-pointer"
                        title="Delete education"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {edu.description && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800 pt-2.5">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Education Record" : "Add Education Record"}
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
                  Degree / Program Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.Tech in Computer Science Engineering"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Branch / Specialization
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    placeholder="2024"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Year</label>
                  <input
                    type="text"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    placeholder="2028"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">CGPA / %</label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    placeholder="8.6/10"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Relevant Coursework
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="List relevant subjects, academic projects, or honors..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                  {editingId ? "Save Changes" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
