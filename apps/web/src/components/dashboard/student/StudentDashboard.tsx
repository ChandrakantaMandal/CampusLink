"use client";

import React, { useEffect, useState } from "react";

import WelcomeBanner from "@/components/dashboard/student/WelcomeBanner";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import SkillGapCard from "@/components/dashboard/student/SkillGapCard";
import { InterviewScheduleCard } from "@/components/dashboard/student/InterviewScheduleCard";
import { OfferTrackingCard } from "@/components/dashboard/student/OfferTrackingCard";
import { UpcomingDrivesCard } from "@/components/dashboard/student/UpcomingDrivesCard";

import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";

import { mockDashboardData } from "@/data/dashboardData";
import type { ReadinessDimension } from "@/data/dashboardData";

import {
  useStudentSkills,
  useStudentOffers,
  useStudentDrives,
  useStudentDashboard,
  useStudentApplications,
  useStudentJobs,
  useStudentProfile,
} from "@/hooks/use-student";
import { toSkillGaps, toOfferDetails, toUpcomingDrives } from "@/lib/dashboard-adapters";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // Student profile and aggregates
  const profileQuery = useStudentProfile();
  const dashboardQuery = useStudentDashboard();
  const applicationsQuery = useStudentApplications();
  const jobsQuery = useStudentJobs();

  // Student skills
  const skills = useStudentSkills();

  const skillGaps = skills.data
    ? toSkillGaps(skills.data)
    : null;

  // Student offers
  const offers = useStudentOffers();
  const offerItems = offers.data
    ? toOfferDetails(offers.data)
    : mockDashboardData.offers;

  // Student drives
  const drivesQuery = useStudentDrives();
  const driveItems = drivesQuery.data
    ? toUpcomingDrives(drivesQuery.data)
    : mockDashboardData.upcomingDrives;

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

  const studentName =
    profileQuery.profile?.user?.name ||
    (profileQuery.profile?.firstName
      ? `${profileQuery.profile.firstName} ${profileQuery.profile.lastName ?? ""}`.trim()
      : "Student");

  // Real live statistics (0 if student has none submitted)
  const activeApplications =
    applicationsQuery.data?.stats.total ??
    dashboardQuery.data?.stats.applications ??
    0;

  const aiJobMatches =
    jobsQuery.data?.jobs.length ??
    0;

  const upcomingDrives =
    drivesQuery.data
      ? drivesQuery.data.registered.length + drivesQuery.data.available.length
      : (dashboardQuery.data?.stats.drivesRegistered ?? 0);

  const dashboardStats = {
    readinessScore,
    readinessLabel,
    activeApplications,
    aiJobMatches,
    upcomingDrives,
  };

  const aiCoachRecommendation = {
    title: "AI Placement Coach Recommendation",
    highlight:
      readinessScore >= 80
        ? "Tier-1 Competitive"
        : readinessScore >= 40
          ? "Placement Track"
          : "Build Profile Foundation",
    message:
      readiness?.explanation ||
      (readinessScore >= 80
        ? "Your profile is competitive for high-paying product company drives. Continue practicing mock interviews."
        : readinessScore >= 40
          ? "Complete mock technical assessments and verify project demos to achieve Tier-1 placement readiness."
          : "Add your technical skills, link live project repositories, and update academics to unlock AI job matching and company eligibility."),
    actionText:
      readinessScore >= 80
        ? "Explore Drives"
        : readinessScore >= 40
          ? "Take Assessment"
          : "Complete Profile",
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
        appliedCount={activeApplications}
        matchesCount={aiJobMatches}
        upcomingDrivesCount={upcomingDrives}
        onExploreDrives={() =>
          router.push("/student/drives")
        }
        onCheckReadiness={() =>
          router.push(readinessScore < 40 ? "/student/profile" : "/student/readiness")
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
            aiRecommendation={aiCoachRecommendation}
            onStartAction={() =>
              router.push(readinessScore < 40 ? "/student/profile" : "/student/readiness")
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

      {/* Upcoming Campus Drives (Full-width Slidebar Track) */}
      <div className="min-w-0">
        <UpcomingDrivesCard
          drives={driveItems}
          layout="slidebar"
          onViewAll={() => router.push("/student/drives")}
        />
      </div>

      {/* Placement Milestones: Offers & Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 min-w-0 flex flex-col">
          <OfferTrackingCard
            offers={offerItems}
            onAccepted={offers.refresh}
          />
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
