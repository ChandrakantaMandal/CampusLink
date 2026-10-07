"use client";

import React, { useEffect, useState } from "react";

import WelcomeBanner from "@/components/dashboard/student/WelcomeBanner";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import SkillGapCard from "@/components/dashboard/student/SkillGapCard";
import { InterviewScheduleCard } from "@/components/dashboard/student/InterviewScheduleCard";

import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";

import { mockDashboardData } from "@/data/dashboardData";
import type { ReadinessDimension } from "@/data/dashboardData";

import { useStudentSkills } from "@/hooks/use-student";
import { toSkillGaps } from "@/lib/dashboard-adapters";

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

  // Student skills
  const skills = useStudentSkills();

  const skillGaps = skills.data
    ? toSkillGaps(skills.data)
    : null;

  // Readiness
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
    <div className="space-y-6">
      {/* Welcome Banner */}
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

      {/* Key Statistics */}
      <KeyStatistics stats={dashboardStats} />

      {/* Readiness + Skill Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* AI Readiness */}
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

        {/* Skill Gap */}
        <div className="lg:col-span-5 min-w-0 flex flex-col">
          {skillGaps ? (
            <SkillGapCard
              skills={skillGaps}
              variant="compact"
              onPracticeSkill={(skill) =>
                toast.info(
                  `Opening practice module for ${skill}`,
                )
              }
            />
          ) : skills.error ? (
            <AggregateError
              message={skills.error}
              onRetry={skills.refresh}
            />
          ) : (
            <AggregateLoading
              label="Loading your skill gaps..."
            />
          )}
        </div>
      </div>

      {/* Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 min-w-0 flex flex-col">
          {/* Reserved for future dashboard section */}
        </div>

        <div className="lg:col-span-6 min-w-0 flex flex-col">
          <InterviewScheduleCard
            interviews={mockDashboardData.interviews}
          />
        </div>
      </div>
    </div>
  );
}