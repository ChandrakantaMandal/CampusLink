"use client";

import React from "react";

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

import type { ReadinessDimension } from "@/data/dashboardData";

import {
  useStudentSkills,
  useStudentOffers,
  useStudentDrives,
  useStudentDashboard,
  useStudentReadiness,
  useStudentApplications,
  useStudentJobs,
  useStudentProfile,
  useStudentInterviews,
} from "@/hooks/use-student";
import {
  toSkillGaps,
  toOfferDetails,
  toUpcomingDrives,
  toInterviewSlots,
} from "@/lib/dashboard-adapters";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

function getStatus(score: number): ReadinessDimension["status"] {
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

  const skillGaps = skills.data ? toSkillGaps(skills.data) : null;

  // Student offers
  const offers = useStudentOffers();
  const offerItems = offers.data ? toOfferDetails(offers.data) : [];

  // Student drives
  const drivesQuery = useStudentDrives();
  const driveItems = drivesQuery.data ? toUpcomingDrives(drivesQuery.data) : [];

  // Student interviews
  const interviewsQuery = useStudentInterviews();
  const interviewItems = interviewsQuery.data
    ? toInterviewSlots(interviewsQuery.data)
    : [];

  // Readiness (same live endpoint as the readiness page / header / sidebar)
  const readinessQuery = useStudentReadiness();
  const readiness = readinessQuery.data;

  const readinessScore =
    readiness?.score ?? dashboardQuery.data?.stats.readinessScore ?? 0;

  // Fallback mirrors the server label tiers (85/70/50) so the label does not
  // flip while the readiness aggregate is still loading.
  const readinessLabel =
    readiness?.label ??
    (readinessScore >= 85
      ? "Tier-1 Ready"
      : readinessScore >= 70
        ? "Placement Ready"
        : readinessScore >= 50
          ? "Almost Ready"
          : "Needs Improvement");

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

  const aiJobMatches = jobsQuery.data?.jobs.length ?? 0;

  const upcomingDrives = drivesQuery.data
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
      readinessScore >= 85
        ? "Tier-1 Competitive"
        : readinessScore >= 70
          ? "Placement Track"
          : readinessScore >= 50
            ? "Almost Ready"
            : "Build Profile Foundation",
    message:
      readiness?.explanation ||
      (readinessScore >= 85
        ? "Your profile is competitive for high-paying product company drives. Continue practicing mock interviews."
        : readinessScore >= 70
          ? "Complete mock technical assessments and verify project demos to achieve Tier-1 placement readiness."
          : "Add your technical skills, link live project repositories, and update academics to unlock AI job matching and company eligibility."),
    actionText:
      readinessScore >= 85
        ? "Explore Drives"
        : readinessScore >= 70
          ? "Take Assessment"
          : "Complete Profile",
  };

  const readinessDimensions: ReadinessDimension[] = readiness
    ? [
        {
          category: "Technical Skills",
          score: readiness.breakdown.technical,
          fullScore: 100,
          status: getStatus(readiness.breakdown.technical),
        },
        {
          category: "Mock Assessments",
          score: readiness.breakdown.assessment,
          fullScore: 100,
          status: getStatus(readiness.breakdown.assessment),
        },
        {
          category: "Verified Projects",
          score: readiness.breakdown.projects,
          fullScore: 100,
          status: getStatus(readiness.breakdown.projects),
        },
        {
          category: "Academics / CGPA",
          score: readiness.breakdown.academics,
          fullScore: 100,
          status: getStatus(readiness.breakdown.academics),
        },
        {
          category: "ATS Resume",
          score: readiness.breakdown.resume,
          fullScore: 100,
          status: getStatus(readiness.breakdown.resume),
        },
      ]
    : [
        {
          category: "Technical Skills",
          score: 0,
          fullScore: 100,
          status: "Needs Attention",
        },
        {
          category: "Mock Assessments",
          score: 0,
          fullScore: 100,
          status: "Needs Attention",
        },
        {
          category: "Verified Projects",
          score: 0,
          fullScore: 100,
          status: "Needs Attention",
        },
        {
          category: "Academics / CGPA",
          score: 0,
          fullScore: 100,
          status: "Needs Attention",
        },
        {
          category: "ATS Resume",
          score: 0,
          fullScore: 100,
          status: "Needs Attention",
        },
      ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner
        studentName={studentName}
        readinessScore={readinessScore}
        appliedCount={activeApplications}
        matchesCount={aiJobMatches}
        upcomingDrivesCount={upcomingDrives}
        onExploreDrives={() => router.push("/student/drives")}
        onCheckReadiness={() =>
          router.push(
            readinessScore < 40 ? "/student/profile" : "/student/readiness",
          )
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
              router.push(
                readinessScore < 40 ? "/student/profile" : "/student/readiness",
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
                toast.info(`Opening practice module for ${skill}`)
              }
            />
          ) : skills.error ? (
            <AggregateError message={skills.error} onRetry={skills.refresh} />
          ) : (
            <AggregateLoading label="Loading your skill gaps..." />
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
          <OfferTrackingCard offers={offerItems} onAccepted={offers.refresh} />
        </div>

        <div className="lg:col-span-6 min-w-0 flex flex-col">
          <InterviewScheduleCard interviews={interviewItems} />
        </div>
      </div>
    </div>
  );
}
