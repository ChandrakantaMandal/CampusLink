"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Download,
  Clock,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { mockDashboardData } from "@/data/dashboardData";

interface OpportunitiesViewProps {
  studentCgpa?: string;
  department?: string;
}

export function OpportunitiesView({
  studentCgpa = "8.85",
  department = "Computer Science & Engineering",
}: OpportunitiesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [minCtcFilter, setMinCtcFilter] = useState<number>(0);
  const [appliedDrives, setAppliedDrives] = useState<Record<string, boolean>>({
    "drive-1": true, // Google registered by default
  });

  const opportunities = [
    {
      id: "opp-1",
      company: "Google India",
      role: "Software Development Engineer (SDE-1)",
      ctc: "₹32.5 LPA",
      stipend: "₹1,25,000 / mo",
      type: "Full-Time + Internship",
      category: "Super Dream",
      location: "Bangalore / Hyderabad",
      deadline: "Oct 05, 2026",
      driveDate: "Oct 12, 2026",
      minCgpa: 8.0,
      eligibleBranches: ["CSE", "IT", "ECE"],
      skills: ["Data Structures", "Algorithms", "C++ / Java", "System Design"],
      description: "Core engineering role across Google Cloud and Search platforms. High problem-solving and algorithmic rigor expected.",
      isEligible: true,
      registeredCount: 142,
    },
    {
      id: "opp-2",
      company: "Microsoft IDC",
      role: "Software Engineer",
      ctc: "₹28.0 LPA",
      stipend: "₹1,00,000 / mo",
      type: "Full-Time",
      category: "Super Dream",
      location: "Hyderabad / Noida",
      deadline: "Oct 08, 2026",
      driveDate: "Oct 15, 2026",
      minCgpa: 7.5,
      eligibleBranches: ["CSE", "IT", "ECE", "EE"],
      skills: ["Azure", "C# / Java", "Distributed Systems", "SQL"],
      description: "Build hyper-scale enterprise infrastructure and AI copilots for global Fortune 500 customers.",
      isEligible: true,
      registeredCount: 210,
    },
    {
      id: "opp-3",
      company: "Amazon AWS",
      role: "Cloud Solutions Architect - Associate",
      ctc: "₹24.0 LPA",
      stipend: "₹80,000 / mo",
      type: "Full-Time",
      category: "Dream",
      location: "Bangalore",
      deadline: "Oct 10, 2026",
      driveDate: "Oct 18, 2026",
      minCgpa: 7.0,
      eligibleBranches: ["All Engineering Branches"],
      skills: ["AWS", "Networking", "Linux", "Python", "Kubernetes"],
      description: "Partner with enterprise tech leaders to architect resilient, cloud-native deployments.",
      isEligible: true,
      registeredCount: 185,
    },
    {
      id: "opp-4",
      company: "TCS Digital",
      role: "Systems Engineer (Digital Cadre)",
      ctc: "₹9.2 LPA",
      stipend: "₹35,000 / mo",
      type: "Full-Time",
      category: "Standard",
      location: "Pan-India",
      deadline: "Sep 30, 2026",
      driveDate: "Oct 08, 2026",
      minCgpa: 7.0,
      eligibleBranches: ["All Engineering Branches"],
      skills: ["Full Stack", "Java", "Python", "Cloud Fundamentals"],
      description: "Digital transformation engineering for international banking and healthcare giants.",
      isEligible: true,
      registeredCount: 420,
    },
    {
      id: "opp-5",
      company: "Oracle India",
      role: "Member of Technical Staff (MTS)",
      ctc: "₹21.5 LPA",
      stipend: "₹75,000 / mo",
      type: "Full-Time",
      category: "Dream",
      location: "Bangalore / Pune",
      deadline: "Oct 14, 2026",
      driveDate: "Oct 22, 2026",
      minCgpa: 7.5,
      eligibleBranches: ["CSE", "IT"],
      skills: ["Autonomous DB", "Java Core", "Microservices", "REST APIs"],
      description: "Develop cutting-edge cloud database engine modules and high-availability storage subsystems.",
      isEligible: true,
      registeredCount: 165,
    },
    {
      id: "opp-6",
      company: "Deloitte USI",
      role: "Analyst - Cyber Security & Cloud",
      ctc: "₹8.8 LPA",
      stipend: "₹30,000 / mo",
      type: "Full-Time",
      category: "Standard",
      location: "Hyderabad / Gurgaon",
      deadline: "Oct 18, 2026",
      driveDate: "Oct 26, 2026",
      minCgpa: 6.5,
      eligibleBranches: ["CSE", "IT", "ECE"],
      skills: ["Network Security", "Risk Assessment", "SIEM", "Python"],
      description: "Security operations center (SOC) analytics and cloud vulnerability management.",
      isEligible: true,
      registeredCount: 310,
    },
  ];

  const handleApply = (id: string, company: string, role: string) => {
    if (appliedDrives[id]) {
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
      item.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

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
              Official institutional recruitment drives, internships, and dream job offers vetted by TPO Cell.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-medium">Eligibility Status</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" /> CGPA {studentCgpa} (Eligible)
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${typeFilter === cat.id
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
          const isApplied = appliedDrives[item.id];
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
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${item.category === "Super Dream"
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
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Compensation</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
                      {item.ctc}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Stipend (Intern)</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                      {item.stipend}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Drive Date</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.driveDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Location</span>
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
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Eligible (Min: {item.minCgpa} CGPA)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(`Downloading official recruitment brochure & syllabus for ${item.company}`)
                    }
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Download JD & Syllabus"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(item.id, item.company, item.role)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isApplied
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
