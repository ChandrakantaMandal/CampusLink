"use client";

import React from "react";
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

export default function StudentDashboard() {
  const studentName = "Student";
  const department = "Computer Science & Engineering";

  return (
    <>
      {/* Welcome Greeting Banner */}
      <WelcomeBanner
        studentName={studentName}
        readinessScore={mockDashboardData.stats.readinessScore}
        appliedCount={mockDashboardData.stats.activeApplications}
        matchesCount={mockDashboardData.stats.aiJobMatches}
        upcomingDrivesCount={mockDashboardData.stats.upcomingDrives}
        onExploreDrives={() => toast.info("Opening campus drives...")}
        onCheckReadiness={() => toast.info("Opening readiness...")}
      />

      {/* 4 Key Statistics Cards */}
      <KeyStatistics stats={mockDashboardData.stats} />

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

      {/* Row 2: AI-Recommended Opportunities */}
      <div className="min-w-0">
        <RecommendedJobsCard jobs={mockDashboardData.recommendedJobs} columns={3} />
      </div>

      {/* Row 3: Offer Tracking & Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 min-w-0 flex flex-col">
          <OfferTrackingCard offers={mockDashboardData.offers} />
        </div>
        <div className="lg:col-span-6 min-w-0 flex flex-col">
          <InterviewScheduleCard interviews={mockDashboardData.interviews} />
        </div>
      </div>

      {/* Row 4: Applications Tracker */}
      <div className="min-w-0">
        <ApplicationsTracker applications={mockDashboardData.applications} />
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
        <p>
          CAMPUSLINK AI Placement Intelligence Platform &bull; All data securely synchronized with University TPO.
        </p>
      </footer>
    </>
  );
}

export { StudentDashboard as StudentDashboardView };
