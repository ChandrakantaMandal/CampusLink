"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Database,
  GraduationCap,
  IndianRupee,
  FileCheck2,
} from "lucide-react";
import { AnalyticsPanel } from "./AnalyticsPanel";
import type { PlacementRecord, SalaryRecord, ResumeRecord } from "../types";

interface DataExplorerViewProps {
  placementsData: PlacementRecord[];
  salariesData: SalaryRecord[];
  resumesData: ResumeRecord[];
  onExport: (type: "placements" | "salaries" | "resumes") => void;
}

export function DataExplorerView({
  placementsData,
  salariesData,
  resumesData,
  onExport,
}: DataExplorerViewProps) {
  const [activeDataset, setActiveDataset] = useState<"placements" | "salaries" | "resumes">("placements");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // Reset page when switching dataset or searching
  const handleDatasetSwitch = (ds: "placements" | "salaries" | "resumes") => {
    setActiveDataset(ds);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filtered rows
  const filteredData = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    if (activeDataset === "placements") {
      return placementsData.filter((r) => {
        if (!q) return true;
        return (
          r.Student_ID?.toLowerCase().includes(q) ||
          r.Branch?.toLowerCase().includes(q) ||
          r.Placement_Status?.toLowerCase().includes(q) ||
          r.Programming_Skills?.toLowerCase().includes(q) ||
          r.Gender?.toLowerCase().includes(q)
        );
      });
    } else if (activeDataset === "salaries") {
      return salariesData.filter((r) => {
        if (!q) return true;
        return (
          r.Company?.toLowerCase().includes(q) ||
          r.Location?.toLowerCase().includes(q) ||
          String(r.CTC_LPA).includes(q)
        );
      });
    } else {
      return resumesData.filter((r) => {
        if (!q) return true;
        return (
          r.candidate_id?.toLowerCase().includes(q) ||
          r.degree?.toLowerCase().includes(q) ||
          String(r.resume_score).includes(q) ||
          r.github_portfolio?.toLowerCase().includes(q)
        );
      });
    }
  }, [activeDataset, searchTerm, placementsData, salariesData, resumesData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  return (
    <div className="space-y-6">
      <AnalyticsPanel
        title="Dataset Explorer & Record Inspector"
        subtitle="Search, filter, and inspect raw records from all integrated benchmark datasets"
        badge="Live Table"
        action={
          <button
            onClick={() => onExport(activeDataset)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-3 py-2 text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        }
      >
        <div className="space-y-4">
          {/* Dataset Switcher & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 max-w-fit">
              <button
                onClick={() => handleDatasetSwitch("placements")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDataset === "placements"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Placements ({placementsData.length})</span>
              </button>

              <button
                onClick={() => handleDatasetSwitch("salaries")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDataset === "salaries"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Salaries ({salariesData.length})</span>
              </button>

              <button
                onClick={() => handleDatasetSwitch("resumes")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDataset === "resumes"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Resumes ({resumesData.length})</span>
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            {activeDataset === "placements" && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3.5">Student ID</th>
                    <th className="py-3 px-3.5">Branch</th>
                    <th className="py-3 px-3.5">CGPA</th>
                    <th className="py-3 px-3.5">Aptitude</th>
                    <th className="py-3 px-3.5">Programming</th>
                    <th className="py-3 px-3.5">Communication</th>
                    <th className="py-3 px-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {(paginatedRows as PlacementRecord[]).map((r, i) => (
                    <tr
                      key={r.Student_ID || i}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">
                        {r.Student_ID}
                      </td>
                      <td className="py-2.5 px-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {r.Branch}
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900 dark:text-white tabular-nums">
                        {r.CGPA}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300 tabular-nums">
                        {r.Aptitude_Score}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                        {r.Programming_Skills}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400">
                        {r.Communication_Skills}
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            String(r.Placement_Status).toLowerCase() === "placed"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40"
                              : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300/40"
                          }`}
                        >
                          {r.Placement_Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeDataset === "salaries" && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3.5">Company Name</th>
                    <th className="py-3 px-3.5">Hiring Location</th>
                    <th className="py-3 px-3.5">Offered CTC</th>
                    <th className="py-3 px-3.5">Tier Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {(paginatedRows as SalaryRecord[]).map((r, i) => {
                    const ctcNum = Number(r.CTC_LPA) || 0;
                    return (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">
                          {r.Company}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300">
                          {r.Location || "Pan-India / Remote"}
                        </td>
                        <td className="py-2.5 px-3.5 font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                          ₹{r.CTC_LPA} LPA
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ctcNum >= 20
                                ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400"
                                : ctcNum >= 10
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                                : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                            }`}
                          >
                            {ctcNum >= 20 ? "Dream / Super" : ctcNum >= 10 ? "Product" : "Standard"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {activeDataset === "resumes" && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3.5">Candidate ID</th>
                    <th className="py-3 px-3.5">Degree</th>
                    <th className="py-3 px-3.5">Resume Score</th>
                    <th className="py-3 px-3.5">Projects Count</th>
                    <th className="py-3 px-3.5">GitHub Portfolio</th>
                    <th className="py-3 px-3.5">Interview Calls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {(paginatedRows as ResumeRecord[]).map((r, i) => (
                    <tr
                      key={r.candidate_id || i}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">
                        {r.candidate_id}
                      </td>
                      <td className="py-2.5 px-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {r.degree}
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900 dark:text-white tabular-nums">
                        {r.resume_score} / 100
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300 tabular-nums">
                        {r.projects_count}
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            String(r.github_portfolio).toLowerCase() === "yes"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {String(r.github_portfolio).toLowerCase() === "yes" ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {r.interview_calls} Calls
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filteredData.length === 0 && (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                No matching records found for &quot;{searchTerm}&quot;
              </div>
            )}
          </div>

          {/* Pagination bar */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {paginatedRows.length} of {filteredData.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </AnalyticsPanel>
    </div>
  );
}
