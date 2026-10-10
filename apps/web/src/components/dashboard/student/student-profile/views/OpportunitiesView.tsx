"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  AggregateError,
  AggregateLoading,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentJobs } from "@/hooks/use-student";
import { formatDate } from "@/lib/dashboard-adapters";

interface OpportunitiesViewProps {
  studentCgpa?: string;
  department?: string;
}

interface Opportunity {
  id: string;
  company: string;
  role: string;
  ctc: string;
  type: string;
  category: "Super Dream" | "Dream" | "Standard";
  location: string;
  deadline: string;
  minCgpa: number | null;
  eligibleBranches: string[];
  skills: string[];
  description: string;
  isEligible: boolean;
  hasApplied: boolean;
}

function ctcLpa(ctc: string | null): number | null {
  if (!ctc) return null;
  const m = ctc.replace(/,/g, "").match(/\d+(\.\d+)?/);
  if (!m) return null;
  let n = parseFloat(m[0]);
  if (n > 1000) n = n / 100000;
  return n;
}

function ctcCategory(ctc: string | null): Opportunity["category"] {
  const n = ctcLpa(ctc);
  if (n == null) return "Standard";
  if (n >= 25) return "Super Dream";
  if (n >= 15) return "Dream";
  return "Standard";
}

function employmentTypeLabel(value: string | null): string {
  if (!value) return "Full-Time";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function OpportunitiesView({
  studentCgpa = "8.85",
  department = "Computer Science & Engineering",
}: OpportunitiesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [minCtcFilter, setMinCtcFilter] = useState<number>(0);
  const [appliedDrives, setAppliedDrives] = useState<Record<string, boolean>>(
    {},
  );

  const jobs = useStudentJobs();

  if (jobs.loading) {
    return <AggregateLoading label="Loading opportunities..." />;
  }

  if (jobs.error) {
    return <AggregateError message={jobs.error} onRetry={jobs.refresh} />;
  }

  const opportunities: Opportunity[] = (jobs.data?.jobs ?? []).map((job) => ({
    id: job.id,
    company: job.company.name,
    role: job.title,
    ctc: job.ctc ?? "—",
    type: employmentTypeLabel(job.employmentType),
    category: ctcCategory(job.ctc),
    location: job.location ?? "—",
    deadline: job.applicationDeadline
      ? formatDate(job.applicationDeadline)
      : "—",
    minCgpa: job.minCGPA,
    eligibleBranches:
      job.allowedBranches.length > 0
        ? job.allowedBranches
        : job.requiredBranch
          ? [job.requiredBranch]
          : [],
    skills: job.skills.map((entry) => entry.skill.name),
    description: job.description,
    isEligible: job.eligible,
    hasApplied: job.hasApplied,
  }));

  const handleApply = (id: string, company: string, role: string) => {
    const alreadyApplied =
      appliedDrives[id] ??
      opportunities.find((opp) => opp.id === id)?.hasApplied ??
      false;
    if (alreadyApplied) {
      toast.info(`Already registered for ${company} (${role})`);
      return;
    }
    setAppliedDrives((prev) => ({ ...prev, [id]: true }));
    toast.success(`Application submitted to ${company}!`, {
      description: `Your verified profile and resume have been forwarded to the campus recruitment team for ${role}.`,
    });
  };

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesSearch =
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "super-dream" && item.category === "Super Dream") ||
      (typeFilter === "dream" && item.category === "Dream") ||
      (typeFilter === "standard" && item.category === "Standard");

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 2026 Placement Cycle
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Campus Recruitment Opportunities
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Official institutional recruitment drives, internships, and dream
              job offers vetted by TPO Cell.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-medium">
                Eligibility Status
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" /> CGPA {studentCgpa}{" "}
                (Eligible)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role or skill..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Drives" },
            { id: "super-dream", label: "Super Dream (₹25L+)" },
            { id: "dream", label: "Dream (₹15L–24L)" },
            { id: "standard", label: "Standard (<₹15L)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setTypeFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                typeFilter === cat.id
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOpportunities.map((item) => {
          const isApplied = appliedDrives[item.id] ?? item.hasApplied;
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                {/* Header: Company & Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                      {item.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.role}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {item.company}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${
                      item.category === "Super Dream"
                        ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                        : item.category === "Dream"
                          ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Package & Key Details */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Compensation
                    </span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
                      {item.ctc}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Application Deadline
                    </span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                      {item.deadline}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Employment Type
                    </span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs mt-0.5 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      {item.type}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Location
                    </span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {item.location}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Skill Badges */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                {item.isEligible ? (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Eligible
                    {item.minCgpa != null ? ` (Min: ${item.minCgpa} CGPA)` : ""}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Not Eligible
                    {item.minCgpa != null ? ` (Min: ${item.minCgpa} CGPA)` : ""}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        `Downloading official recruitment brochure & syllabus for ${item.company}`,
                      )
                    }
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Download JD & Syllabus"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleApply(item.id, item.company, item.role)
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isApplied
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-[#6366F1] hover:bg-indigo-600 text-white shadow-xs"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Registered
                      </>
                    ) : (
                      <>
                        Apply with Profile
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
