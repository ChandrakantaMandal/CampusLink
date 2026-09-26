"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  UserCheck,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { mockStudents, type AdminStudent } from "../mock-admin-data";
import { toast } from "sonner";

export default function StudentsManagementView() {
  const [students, setStudents] = useState<AdminStudent[]>(mockStudents);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    email: "",
    branch: "CSE",
    cgpa: "8.0",
    phone: "",
    targetRole: "Software Engineer",
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === "All" || s.branch === branchFilter;
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleVerifyStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: true, status: "Eligible" } : s))
    );
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent((prev) => prev ? { ...prev, verified: true, status: "Eligible" } : null);
    }
    toast.success("Student profile verified and approved for campus drives!");
  };

  const handleToggleDisable = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "Needs Attention" ? "Eligible" : "Needs Attention",
            }
          : s
      )
    );
    toast.info("Student account status updated.");
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.rollNo || !newStudent.email) {
      toast.error("Please fill in all mandatory student fields");
      return;
    }

    const created: AdminStudent = {
      id: `stu-${Date.now()}`,
      name: newStudent.name,
      rollNo: newStudent.rollNo,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      email: newStudent.email,
      phone: newStudent.phone || "+91 98765 00000",
      branch: newStudent.branch,
      cgpa: parseFloat(newStudent.cgpa) || 8.0,
      backlogs: 0,
      status: "Eligible",
      readinessScore: 84,
      skills: ["Python", "DSA", "SQL"],
      missingSkills: ["System Design"],
      applicationsCount: 0,
      offersCount: 0,
      verified: true,
      resumeUrl: "#",
      targetRole: newStudent.targetRole,
      readinessBreakdown: {
        technical: 85,
        projects: 80,
        certifications: 82,
        assessments: 84,
        communication: 86,
      },
    };

    setStudents([created, ...students]);
    setIsAddModalOpen(false);
    setNewStudent({
      name: "",
      rollNo: "",
      email: "",
      branch: "CSE",
      cgpa: "8.0",
      phone: "",
      targetRole: "Software Engineer",
    });
    toast.success(`Student ${created.name} added successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Student Placement Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor 1,240 registered candidates, verify eligibility, inspect readiness, and resolve documentation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-indigo-600/25 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Student</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Eligible">Eligible</option>
            <option value="Placed">Placed</option>
            <option value="Needs Attention">Needs Attention</option>
          </select>

          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
            Showing {filteredStudents.length} candidates
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Branch</th>
                <th className="px-4 py-3.5">CGPA</th>
                <th className="px-4 py-3.5">Backlogs</th>
                <th className="px-4 py-3.5">Readiness</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {student.name}
                          </span>
                          {student.verified && (
                            <span title="Verified Profile">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {student.rollNo} &bull; {student.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-700 dark:text-slate-300">
                    {student.branch}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-black text-slate-900 dark:text-white">
                      {student.cgpa}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`font-bold ${
                        student.backlogs === 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {student.backlogs}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${student.readinessScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {student.readinessScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        student.status === "Placed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : student.status === "Eligible"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold px-2.5 py-1 text-[11px] transition-all"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    {!student.verified && (
                      <button
                        type="button"
                        onClick={() => handleVerifyStudent(student.id)}
                        className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 text-[11px] transition-all"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Student Profile Modal / Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedStudent.name}
                  </h3>
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold px-2.5 py-0.5 text-xs">
                    {selectedStudent.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Roll: <strong className="font-mono text-slate-700 dark:text-slate-300">{selectedStudent.rollNo}</strong> &bull; {selectedStudent.email}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                  Target Role: {selectedStudent.targetRole}
                </p>
              </div>
            </div>

            {/* Academic & Readiness Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Branch</span>
                <p className="text-base font-black text-slate-900 dark:text-white">{selectedStudent.branch}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">CGPA</span>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{selectedStudent.cgpa}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Backlogs</span>
                <p className="text-base font-black text-slate-900 dark:text-white">{selectedStudent.backlogs}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Readiness Score</span>
                <p className="text-base font-black text-indigo-600 dark:text-indigo-400">{selectedStudent.readinessScore}%</p>
              </div>
            </div>

            {/* Readiness Breakdown */}
            <div className="space-y-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Readiness Score Diagnostics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Technical</span>
                  <strong className="text-slate-900 dark:text-white">{selectedStudent.readinessBreakdown.technical}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Projects</span>
                  <strong className="text-slate-900 dark:text-white">{selectedStudent.readinessBreakdown.projects}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Certifications</span>
                  <strong className="text-slate-900 dark:text-white">{selectedStudent.readinessBreakdown.certifications}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Assessments</span>
                  <strong className="text-slate-900 dark:text-white">{selectedStudent.readinessBreakdown.assessments}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Communication</span>
                  <strong className="text-slate-900 dark:text-white">{selectedStudent.readinessBreakdown.communication}%</strong>
                </div>
              </div>
            </div>

            {/* Skills & Skill Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Verified Skills
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedStudent.skills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  Skill Gaps for Target Role
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedStudent.missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!selectedStudent.verified ? (
                  <button
                    type="button"
                    onClick={() => handleVerifyStudent(selectedStudent.id)}
                    className="cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs transition-all shadow-xs"
                  >
                    Verify &amp; Approve Profile
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Candidate
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleDisable(selectedStudent.id)}
                  className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  {selectedStudent.status === "Needs Attention" ? "Enable Account" : "Flag / Disable"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold px-4 py-2 text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                Add New Candidate
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Himanshu Rout"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    placeholder="22CSE042"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Branch *
                  </label>
                  <select
                    value={newStudent.branch}
                    onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="student@campuslink.edu"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CGPA *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={newStudent.cgpa}
                    onChange={(e) => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  value={newStudent.targetRole}
                  onChange={(e) => setNewStudent({ ...newStudent, targetRole: e.target.value })}
                  placeholder="Software Development Engineer"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
