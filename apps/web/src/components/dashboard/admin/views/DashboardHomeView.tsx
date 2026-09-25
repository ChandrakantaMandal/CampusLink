"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Users,
  GraduationCap,
  Building,
  TrendingUp,
  Briefcase,
  ClipboardList,
  Calendar,
  Gift,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Award,
} from "lucide-react";
import {
  mockStudents,
  mockRecruiters,
  mockPlacementDrives,
  mockApplications,
  mockOffers,
} from "../mock-admin-data";

export default function DashboardHomeView() {
  const primaryKpis = [
    {
      label: "Total Students",
      value: "1,240",
      change: "+12%",
      subtitle: "Eligible cohort 2026",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      href: "/admin/students",
    },
    {
      label: "Placed Students",
      value: "184",
      change: "+24%",
      subtitle: "Offers accepted so far",
      icon: GraduationCap,
      color: "from-emerald-600 to-teal-600",
      href: "/admin/offers",
    },
    {
      label: "Active Recruiters",
      value: "42",
      change: "+8",
      subtitle: "Participating companies",
      icon: Building,
      color: "from-purple-600 to-indigo-600",
      href: "/admin/recruiters",
    },
    {
      label: "Placement Rate",
      value: "76%",
      change: "+14%",
      subtitle: "Target: 85% by Dec",
      icon: TrendingUp,
      color: "from-amber-600 to-orange-600",
      href: "/admin/analytics",
    },
  ];

  const secondaryStats = [
    { label: "Registered Students", value: "1,180" },
    { label: "Eligible Students", value: "980" },
    { label: "Active Placement Drives", value: "12" },
    { label: "Applications", value: "612" },
    { label: "Interviews Conducted", value: "218" },
    { label: "Offers Extended", value: "112" },
    { label: "Average Package", value: "₹8.4 LPA" },
    { label: "Highest Package", value: "₹44.0 LPA" },
  ];

  const branchPlacement = [
    { branch: "Computer Science (CSE)", rate: 82, count: "98/120" },
    { branch: "Information Technology (IT)", rate: 78, count: "52/67" },
    { branch: "Electronics & Comm (ECE)", rate: 71, count: "48/68" },
    { branch: "Electrical Engg (EEE)", rate: 68, count: "34/50" },
    { branch: "Mechanical Engg (MECH)", rate: 62, count: "28/45" },
  ];

  const skillDemand = [
    { skill: "Python", demand: 92, count: "18 Drives" },
    { skill: "Data Structures & Algo (DSA)", demand: 88, count: "24 Drives" },
    { skill: "Java / Spring Boot", demand: 78, count: "14 Drives" },
    { skill: "React / Modern Frontend", demand: 68, count: "12 Drives" },
    { skill: "SQL & Relational DBs", demand: 62, count: "15 Drives" },
    { skill: "Communication & Leadership", demand: 76, count: "All Drives" },
  ];

  const pipelineStages = [
    { stage: "Applied", count: 612, pct: "100%", color: "bg-indigo-500" },
    { stage: "Shortlisted", count: 342, pct: "55.8%", color: "bg-blue-500" },
    { stage: "Interview", count: 218, pct: "35.6%", color: "bg-purple-500" },
    { stage: "Selected", count: 112, pct: "18.3%", color: "bg-amber-500" },
    { stage: "Offer", count: 96, pct: "15.6%", color: "bg-emerald-500" },
    { stage: "Joined", count: 84, pct: "13.7%", color: "bg-teal-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Campus Placement Season 2026 • Live Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Good Morning, Admin 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Here&apos;s your comprehensive campus placement control center. 12 active drives are in progress, with 1 schedule conflict requiring immediate resolution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={("/admin/interviews" as Route)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Resolve Conflict</span>
            </Link>
            <Link
              href={("/admin/drives" as Route)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 text-xs transition-all shadow-md shadow-indigo-600/25"
            >
              <Briefcase className="h-4 w-4" />
              <span>+ Create Drive</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {primaryKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.label}
              href={kpi.href as Route}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {kpi.label}
                  </p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">
                    {kpi.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${kpi.color} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                  {kpi.change}
                </span>
                <span className="text-slate-400 text-[11px] truncate">{kpi.subtitle}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Secondary Statistics Grid */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Placement Vital Statistics
          </h2>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            Real-time Aggregates
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {secondaryStats.map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <p className="text-lg font-black text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Placement Pipeline + Branch Placement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Placement Pipeline Funnel (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                Placement Pipeline Conversion
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Total 612 student applications moving across 6 recruitment gates
              </p>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Funnel Visual Bars */}
          <div className="my-6 space-y-3.5">
            {pipelineStages.map((st) => (
              <div key={st.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{st.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white">{st.count} students</span>
                    <span className="text-[11px] text-slate-400">({st.pct})</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${st.color} transition-all duration-500`}
                    style={{ width: st.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Offer Acceptance Rate is currently <strong>85.7%</strong> (Industry Benchmark: 78%)</span>
            </div>
          </div>
        </div>

        {/* Branch Placement Distribution (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                Branch-Wise Placement
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current placement percentage per department
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Analytics
            </Link>
          </div>

          <div className="my-4 space-y-4">
            {branchPlacement.map((item) => (
              <div key={item.branch} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.branch}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{item.rate}%</span>
                    <span className="text-[10px] text-slate-400">({item.count})</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            Average Campus Package: <strong className="text-slate-900 dark:text-white">₹8.4 LPA</strong> across all engineering streams
          </div>
        </div>
      </div>

      {/* Row: Upcoming Placement Drives & Skill Conversion Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Placement Drives (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-600" />
                Active & Upcoming Drives
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Next scheduled recruitment rounds
              </p>
            </div>
            <Link
              href="/admin/drives"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Drives</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {mockPlacementDrives.slice(0, 3).map((drive) => (
              <div
                key={drive.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-300 dark:hover:border-indigo-800/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-white p-1.5 shadow-2xs border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={drive.logo} alt={drive.company} className="h-6 w-6 object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{drive.company}</h4>
                      <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5">
                        {drive.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{drive.role} &bull; <strong className="text-slate-800 dark:text-slate-200">{drive.salary}</strong></p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {drive.driveDate} at {drive.driveTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {drive.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {drive.applicantsCount} Applied
                  </span>
                  <Link
                    href={`/admin/drives?driveId=${drive.id}` as Route}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all"
                  >
                    View Roster
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Conversion & Demand (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Industry Skill Demand
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top required skills demanded by recruiters
              </p>
            </div>
            <Link
              href={("/admin/readiness" as Route)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Skill Gaps
            </Link>
          </div>

          <div className="my-4 space-y-3.5">
            {skillDemand.map((item) => (
              <div key={item.skill} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{item.demand}%</span>
                    <span className="text-[10px] text-slate-400">({item.count})</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    style={{ width: `${item.demand}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-300">
            💡 <strong>Python &amp; DSA</strong> remain the highest prerequisite threshold across Tier-1 recruiters.
          </div>
        </div>
      </div>

      {/* Recent Placement Offers Feed */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              Recent Placed Candidates
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified campus offers signed and logged this season
            </p>
          </div>
          <Link
            href={("/admin/offers" as Route)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Offers</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockOffers.map((offer) => (
            <div
              key={offer.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-emerald-300 dark:hover:border-emerald-800/60 transition-all space-y-3"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={offer.avatar} alt={offer.studentName} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{offer.studentName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{offer.rollNo} &bull; {offer.branch}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{offer.company}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{offer.role}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{offer.package}</span>
                  <span className="block text-[10px] text-slate-400">Accepted</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
