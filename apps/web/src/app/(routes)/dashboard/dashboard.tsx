"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  LayoutDashboard,
  TrendingUp,
  Layers,
  Briefcase,
  UserCheck,
  Calendar,
  Award,
  Sparkles,
  Building2,
  Settings,
  Bell,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import { SettingsView } from "@/components/dashboard/views/SettingsView";
import { NotificationsView } from "@/components/dashboard/views/NotificationsView";
import WelcomeBanner from "@/components/dashboard/student/WelcomeBanner";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import SkillGapCard from "@/components/dashboard/student/SkillGapCard";
import RecommendedJobsCard from "@/components/dashboard/student/RecommendedJobsCard";
import { UpcomingDrivesCard } from "@/components/dashboard/student/UpcomingDrivesCard";
import { ApplicationsTracker } from "@/components/dashboard/student/ApplicationsTracker";
import { InterviewScheduleCard } from "@/components/dashboard/student/InterviewScheduleCard";
import { OfferTrackingCard } from "@/components/dashboard/student/OfferTrackingCard";
import { mockDashboardData } from "@/data/dashboardData";
import { toast } from "sonner";

interface DashboardProps {
  session?: any;
  initialTab?: string;
}

export default function Dashboard({ session, initialTab = "dashboard" }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const studentName = session?.user?.name || "Himanshu Rout";
  const department = "Computer Science & Engineering";

  const topTabs = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "readiness", label: "AI Readiness", icon: TrendingUp },
    { id: "drives", label: "Campus Drives", icon: Building2 },
    { id: "skills", label: "Skill Gaps", icon: Layers },
    { id: "jobs", label: "Recommended Jobs", icon: Briefcase },
    { id: "applications", label: "Applications", icon: UserCheck },
    { id: "schedule", label: "Interviews", icon: Calendar },
    { id: "offers", label: "Offers", icon: Award },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 antialiased selection:bg-blue-500/20 selection:text-blue-500">
      {/* Sidebar: Sticky on desktop (>=1024px), sliding drawer on mobile */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab: string) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        studentName={studentName}
        department={department}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          studentName={studentName}
          department={department}
        />

        {/* Main Student Portal View */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Quick Tab Switcher Ribbon */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {topTabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive
                      ? "bg-[#6366F1] text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Back to Overview button when on a sub-tab */}
            {activeTab !== "dashboard" && (
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Overview
              </button>
            )}
          </div>

          {/* Sub-tab Navigation Banner for Mobile */}
          {activeTab !== "dashboard" && (
            <div className="sm:hidden flex items-center justify-between pb-1">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Overview
              </button>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                {activeTab}
              </span>
            </div>
          )}

          {/* Full Dashboard Overview Tab */}
          {activeTab === "dashboard" && (
            <>
              {/* Welcome Greeting Banner */}
              <WelcomeBanner
                studentName={studentName}
                readinessScore={mockDashboardData.stats.readinessScore}
                appliedCount={mockDashboardData.stats.activeApplications}
                matchesCount={mockDashboardData.stats.aiJobMatches}
                upcomingDrivesCount={mockDashboardData.stats.upcomingDrives}
                onExploreDrives={() => setActiveTab("jobs")}
                onCheckReadiness={() => setActiveTab("readiness")}
              />

              {/* 4 Key Statistics Cards */}
              <KeyStatistics
                stats={mockDashboardData.stats}
                onCardClick={(type) => {
                  if (type === "readiness") setActiveTab("readiness");
                  if (type === "applications") setActiveTab("applications");
                  if (type === "jobs") setActiveTab("jobs");
                }}
              />

              {/* Grid Row 1: AI Readiness & Skill Gap */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-7 min-w-0 flex flex-col">
                  <AIReadinessCard
                    score={mockDashboardData.stats.readinessScore}
                    label={mockDashboardData.stats.readinessLabel}
                    dimensions={mockDashboardData.readinessDimensions}
                    aiRecommendation={mockDashboardData.aiCoachRecommendation}
                    onStartAction={() =>
                      toast.success("Starting System Architecture practice module!")
                    }
                  />
                </div>
                <div className="lg:col-span-5 min-w-0 flex flex-col">
                  <SkillGapCard
                    skills={mockDashboardData.skillGaps}
                    variant="compact"
                    onPracticeSkill={(skill) =>
                      toast.info(`Opening practice module for ${skill}`)
                    }
                  />
                </div>
              </div>

              {/* Row 2: AI-Recommended Opportunities (Comfortable Spread) */}
              <div className="min-w-0">
                <RecommendedJobsCard jobs={mockDashboardData.recommendedJobs} columns={3} />
              </div>

              {/* Row 3: Offer Tracking & Interview Schedule (Balanced 6-6 X-Axis Layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6 min-w-0 flex flex-col">
                  <OfferTrackingCard offers={mockDashboardData.offers} />
                </div>
                <div className="lg:col-span-6 min-w-0 flex flex-col">
                  <InterviewScheduleCard interviews={mockDashboardData.interviews} />
                </div>
              </div>

              {/* Row 4: 8-Stage Applications Tracker */}
              <div className="min-w-0">
                <ApplicationsTracker
                  applications={mockDashboardData.applications}
                />
              </div>
            </>
          )}

          {/* Campus Drives Tab - Dedicated View Separated from All */}
          {activeTab === "drives" && (
            <div className="space-y-6 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Campus Recruitment Drives 2026
                  </h2>
                  <p className="text-xs text-slate-500">
                    Official institutional placement schedules, eligibility criteria, and hall tickets
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    TPO Synchronized
                  </span>
                </div>
              </div>

              {/* Quick Summary Cards along X-axis */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-500">Active Drives</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{mockDashboardData.upcomingDrives.length}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">All eligible</p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-500">Registered</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1</p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">Google SDE</p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-500">Next Assessment</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">Sep 28</p>
                  <p className="text-[11px] text-slate-500 mt-1">10:00 AM IST</p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                  <p className="text-xs font-medium text-slate-500">Hall Tickets</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">1 Ready</p>
                  <p className="text-[11px] text-slate-500 mt-1">Downloadable</p>
                </div>
              </div>

              {/* The Dedicated Slide Bar */}
              <div className="min-w-0">
                <UpcomingDrivesCard
                  drives={mockDashboardData.upcomingDrives}
                  layout="slidebar"
                />
              </div>

              {/* Placement Guidelines & Details */}
              <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Placement Cell Guidelines & Important Instructions
                </h3>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Formal college dress code and physical student ID card are strictly mandatory for all in-person on-campus drives.</li>
                  <li>Students must report to the respective venue at least 30 minutes prior to the scheduled slot with their downloaded Hall Ticket.</li>
                  <li>Virtual drives will be conducted via proctored assessment links delivered to your registered college email.</li>
                  <li>Attendance in pre-placement talks (PPT) is mandatory to remain eligible for subsequent evaluation rounds.</li>
                </ul>
              </div>
            </div>
          )}

          {/* AI Placement Readiness Tab */}
          {activeTab === "readiness" && (
            <div className="space-y-6 min-w-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  AI Placement Readiness & Benchmark
                </h2>
                <p className="text-xs text-slate-500">
                  Multi-dimensional placement readiness evaluation powered by CAMPUSLINK AI
                </p>
              </div>
              <div className="space-y-6 min-w-0">
                <AIReadinessCard
                  score={mockDashboardData.stats.readinessScore}
                  label={mockDashboardData.stats.readinessLabel}
                  dimensions={mockDashboardData.readinessDimensions}
                  aiRecommendation={mockDashboardData.aiCoachRecommendation}
                  onStartAction={() =>
                    toast.success("Starting System Architecture practice module!")
                  }
                />
              </div>
            </div>
          )}

          {/* Skill Gaps Tab */}
          {activeTab === "skills" && (
            <div className="space-y-6 min-w-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Skill Gap Matrix & Curated Practice
                </h2>
                <p className="text-xs text-slate-500">
                  Identified strengths, improvements, and missing requirements for your dream jobs
                </p>
              </div>
              <SkillGapCard
                skills={mockDashboardData.skillGaps}
                variant="default"
                onPracticeSkill={(skill) =>
                  toast.info(`Opening practice module for ${skill}`)
                }
              />
            </div>
          )}

          {/* Recommended Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-6 min-w-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recommended Opportunities & Roles
                </h2>
                <p className="text-xs text-slate-500">
                  Tailored opportunities matching your CGPA, tech stack, and profile readiness
                </p>
              </div>
              <div className="space-y-6 min-w-0">
                <RecommendedJobsCard jobs={mockDashboardData.recommendedJobs} columns={3} />
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-6 min-w-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Application Tracking Pipeline
                </h2>
                <p className="text-xs text-slate-500">
                  Full 8-stage lifecycle tracker synchronized with College Placement Cell
                </p>
              </div>
              <ApplicationsTracker applications={mockDashboardData.applications} />
              {mockDashboardData.offers.length > 0 && (
                <OfferTrackingCard offers={mockDashboardData.offers} />
              )}
            </div>
          )}

          {/* Interviews Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="space-y-6 min-w-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Interview Schedule & Conflict Detector
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time timetable check preventing overlapping campus interview slots
                </p>
              </div>
              <div className="space-y-6 min-w-0">
                <InterviewScheduleCard interviews={mockDashboardData.interviews} />
              </div>
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Campus Offers & Placement Letters
                </h2>
                <p className="text-xs text-slate-500">
                  Verified institutional placement packages and documentation status
                </p>
              </div>
              <OfferTrackingCard offers={mockDashboardData.offers} />
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <NotificationsView
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <SettingsView
              studentName={studentName}
              department={department}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

          {/* Clean Dashboard Footer */}
          <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
            <p>
              CAMPUSLINK AI Placement Intelligence Platform &bull; All data securely synchronized with University TPO.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
