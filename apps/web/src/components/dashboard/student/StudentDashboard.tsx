"use client";

import React, { useEffect, useState } from "react";

import WelcomeBanner from "@/components/dashboard/student/WelcomeBanner";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import SkillGapCard from "@/components/dashboard/student/SkillGapCard";
import RecommendedJobsCard from "@/components/dashboard/student/RecommendedJobsCard";
import { ApplicationsTracker } from "@/components/dashboard/student/ApplicationsTracker";
import { InterviewScheduleCard } from "@/components/dashboard/student/InterviewScheduleCard";
import { OfferTrackingCard } from "@/components/dashboard/student/OfferTrackingCard";

import {
  mockDashboardData,
  type ReadinessDimension,
} from "@/data/dashboardData";

import { toast } from "sonner";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:3000";

type ReadinessResponse = {
  overallScore: number;
  readinessLabel: string;

  breakdown: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  };

  weights: {
    technical: number;
    assessment: number;
    projects: number;
    academics: number;
    resume: number;
  };

  explanation: string;
};

function getStatus(
  score: number,
): ReadinessDimension["status"] {
  if (score >= 80) {
    return "Strong";
  }

  if (score >= 60) {
    return "Good";
  }

  return "Needs Attention";
}

export default function StudentDashboard() {
  const studentName = "Student";

  const [readiness, setReadiness] =
    useState<ReadinessResponse | null>(null);

  useEffect(() => {
    async function fetchReadiness() {
      try {
        const response = await fetch(
          `${SERVER_URL}/api/students/readiness`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Readiness API failed: ${response.status}`,
          );
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error(
            "Invalid readiness response",
          );
        }

        setReadiness(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch readiness:",
          error,
        );

        toast.error(
          "Unable to load live readiness score.",
        );
      }
    }

    fetchReadiness();
  }, []);

  const readinessScore =
    readiness?.overallScore ??
    mockDashboardData.stats.readinessScore;

  const readinessLabel =
    readiness?.readinessLabel ??
    mockDashboardData.stats.readinessLabel;

  const dashboardStats = {
    ...mockDashboardData.stats,
    readinessScore,
    readinessLabel,
  };

  const readinessDimensions: ReadinessDimension[] =
    readiness
      ? [
          {
            category: "Technical Skills",
            score: readiness.breakdown.technical,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.technical,
            ),
          },
          {
            category: "Mock Assessments",
            score: readiness.breakdown.assessment,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.assessment,
            ),
          },
          {
            category: "Verified Projects",
            score: readiness.breakdown.projects,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.projects,
            ),
          },
          {
            category: "Academics / CGPA",
            score: readiness.breakdown.academics,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.academics,
            ),
          },
          {
            category: "ATS Resume",
            score: readiness.breakdown.resume,
            fullScore: 100,
            status: getStatus(
              readiness.breakdown.resume,
            ),
          },
        ]
      : mockDashboardData.readinessDimensions;

  return (
    <>
      <WelcomeBanner
        studentName={studentName}
        readinessScore={readinessScore}
        appliedCount={
          mockDashboardData.stats.activeApplications
        }
        matchesCount={
          mockDashboardData.stats.aiJobMatches
        }
        upcomingDrivesCount={
          mockDashboardData.stats.upcomingDrives
        }
        onExploreDrives={() =>
          toast.info("Opening campus drives...")
        }
        onCheckReadiness={() =>
          toast.info("Opening readiness...")
        }
      />

      <KeyStatistics stats={dashboardStats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 min-w-0 flex flex-col">
          <AIReadinessCard
            score={readinessScore}
            label={readinessLabel}
            dimensions={readinessDimensions}
            aiRecommendation={
              mockDashboardData.aiCoachRecommendation
            }
            onStartAction={() =>
              toast.success(
                "Starting System Architecture practice module!",
              )
            }
          />
        </div>

        <div className="lg:col-span-5 min-w-0 flex flex-col">
          <SkillGapCard
            skills={mockDashboardData.skillGaps}
            variant="compact"
            onPracticeSkill={(skill) =>
              toast.info(
                `Opening practice module for ${skill}`,
              )
            }
          />
        </div>
      </div>

      <div className="min-w-0">
        <RecommendedJobsCard
          jobs={mockDashboardData.recommendedJobs}
          columns={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 min-w-0 flex flex-col">
          <OfferTrackingCard
            offers={mockDashboardData.offers}
          />
        </div>

        <div className="lg:col-span-6 min-w-0 flex flex-col">
          <InterviewScheduleCard
            interviews={mockDashboardData.interviews}
          />
        </div>
      </div>

      <div className="min-w-0">
        <ApplicationsTracker
          applications={mockDashboardData.applications}
        />
      </div>

      <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
        <p>
          CAMPUSLINK AI Placement Intelligence
          Platform &bull; All data securely
          synchronized with University TPO.
        </p>
      </footer>
    </>
  );
}

export {
  StudentDashboard as StudentDashboardView,
};