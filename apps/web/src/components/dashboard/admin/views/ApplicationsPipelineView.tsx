"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Users,
  ChevronDown,
} from "lucide-react";
import { mockApplications, type ApplicationItem } from "../mock-admin-data";
import { toast } from "sonner";

export default function ApplicationsPipelineView() {
  const [applications, setApplications] = useState<ApplicationItem[]>(mockApplications);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  const funnelStages = [
    { stage: "Applied", count: 612, color: "bg-indigo-500" },
    { stage: "Shortlisted", count: 342, color: "bg-blue-500" },
    { stage: "Interview", count: 218, color: "bg-purple-500" },
    { stage: "Selected", count: 112, color: "bg-amber-500" },
    { stage: "Offer", count: 96, color: "bg-emerald-500" },
    { stage: "Joined", count: 84, color: "bg-teal-500" },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.studentRoll.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    const matchesCompany = companyFilter === "All" || app.company === companyFilter;
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesBranch = branchFilter === "All" || app.branch === branchFilter;
    return matchesSearch && matchesCompany && matchesStatus && matchesBranch;
  });

  const handleUpdateStatus = (id: string, newStatus: ApplicationItem["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    toast.success(`Application updated to stage: ${newStatus}`);
  };

  const handleExportCSV = () => {
    const headers = "Student Name,Roll No,Branch,CGPA,Company,Role,Applied Date,Status,AI Match\n";
    const rows = filteredApplications
      .map(
        (a) =>
          `"${a.studentName}","${a.studentRoll}","${a.branch}",${a.cgpa},"${a.company}","${a.role}","${a.appliedDate}","${a.status}",${a.matchScore}%`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CampusLink_Applications_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Applications exported to CSV successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ClipboardList className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            Recruitment Applications Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor all 612 student applications through shortlisting, online assessments, interviews, and offer rollouts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export Pipeline CSV</span>
        </button>
      </div>

      {/* Visual Funnel Bar */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Current Application Pipeline Breakdown
          </h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
            Total 612 Applications
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {funnelStages.map((st, i) => (
            <div
              key={st.stage}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-center relative"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Stage {i + 1}
              </span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {st.count}
              </p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                {st.stage}
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${st.color}`}
                  style={{ width: `${(st.count / 612) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, roll number, or role..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Companies</option>
            <option value="Google">Google</option>
            <option value="TCS">TCS</option>
            <option value="Infosys">Infosys</option>
            <option value="Amazon">Amazon</option>
          </select>

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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Offer">Offer</option>
            <option value="Joined">Joined</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Company</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">CGPA</th>
                <th className="px-4 py-3.5">AI Match</th>
                <th className="px-4 py-3.5">Applied Date</th>
                <th className="px-4 py-3.5">Stage</th>
                <th className="px-5 py-3.5 text-right">Move Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {app.studentName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {app.studentRoll} &bull; {app.branch}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                    {app.company}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                    {app.role}
                  </td>
                  <td className="px-4 py-3.5 font-black text-slate-900 dark:text-white">
                    {app.cgpa}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {app.matchScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    {app.appliedDate}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        app.status === "Joined"
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-200 dark:border-teal-800"
                          : app.status === "Offer"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : app.status === "Selected"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                          : app.status === "Interview"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                          : app.status === "Shortlisted"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Offer">Offer</option>
                      <option value="Joined">Joined</option>
                      <option value="Rejected">Rejected</option>
                    </select>
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
