"use client";

import React from "react";
import WelcomeBanner from "@/components/dashboard/student/WelcomeBanner";
import KeyStatistics from "@/components/dashboard/student/KeyStatistics";
import AIReadinessCard from "@/components/dashboard/student/AIReadinessCard";
import SkillGapCard from "@/components/dashboard/student/SkillGapCard";
import RecommendedJobsCard from "@/components/dashboard/student/RecommendedJobsCard";
import { ApplicationsTracker } from "@/components/dashboard/student/ApplicationsTracker";
import { InterviewScheduleCard } from "@/components/dashboard/student/InterviewScheduleCard";
import { OfferTrackingCard } from "@/components/dashboard/student/OfferTrackingCard";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import {
  useStudentDashboard,
  useStudentProfile,
  useStudentReadiness,
  useStudentSkills,
  useStudentJobs,
  useStudentApplications,
  useStudentInterviews,
  useStudentOffers,
  useStudentNotifications,
} from "@/hooks/use-student";
import {
  toStudentStats,
  toWelcomeBannerProps,
  toReadinessCardProps,
  toSkillGaps,
  toRecommendedJobs,
  toApplicationItems,
  toInterviewSlots,
  toOfferDetails,
} from "@/lib/dashboard-adapters";
import { toast } from "sonner";

export default function StudentDashboard() {
  const dashboard = useStudentDashboard();
  const readiness = useStudentReadiness();
  const skills = useStudentSkills();
  const jobs = useStudentJobs();
  const applications = useStudentApplications();
  const interviews = useStudentInterviews();
  const offers = useStudentOffers();

  if (dashboard.loading) {
    return <AggregateLoading label="Loading your placement dashboard..." />;
  }

  if (dashboard.error || !dashboard.data) {
    return (
      <AggregateError
        message={dashboard.error ?? "Failed to load your dashboard"}
        onRetry={dashboard.refresh}
      />
    );
  }

  const bannerProps = toWelcomeBannerProps(dashboard.data);
  const stats = toStudentStats(dashboard.data);
  const readinessCard = readiness.data
    ? toReadinessCardProps(readiness.data)
    : null;
  const skillGaps = skills.data ? toSkillGaps(skills.data) : null;
  const recommendedJobs = jobs.data ? toRecommendedJobs(jobs.data) : null;
  const applicationItems = applications.data
    ? toApplicationItems(applications.data)
    : null;
  const interviewSlots = interviews.data
    ? toInterviewSlots(interviews.data)
    : null;
  const offerDetails = offers.data ? toOfferDetails(offers.data) : null;

  return (
    <>
      {/* Welcome Greeting Banner */}
      <WelcomeBanner
        {...bannerProps}
        onExploreDrives={() => toast.info("Opening campus drives...")}
        onCheckReadiness={() => toast.info("Opening readiness...")}
      />

      {/* 4 Key Statistics Cards */}
      <KeyStatistics stats={stats} />

      {/* Grid Row 1: AI Readiness & Skill Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 min-w-0 flex flex-col">
          {readinessCard ? (
            <AIReadinessCard
              {...readinessCard}
              onStartAction={() =>
                toast.success("Starting System Architecture practice module!")
              }
            />
          ) : readiness.error ? (
            <AggregateError
              message={readiness.error}
              onRetry={readiness.refresh}
            />
          ) : (
            <AggregateLoading />
          )}
        </div>
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
            <AggregateLoading />
          )}
        </div>
      </div>

      {/* Row 2: AI-Recommended Opportunities */}
      <div className="min-w-0">
        {recommendedJobs ? (
          <RecommendedJobsCard jobs={recommendedJobs} columns={3} />
        ) : jobs.error ? (
          <AggregateError message={jobs.error} onRetry={jobs.refresh} />
        ) : (
          <AggregateLoading />
        )}
      </div>

      {/* Row 3: Offer Tracking & Interview Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 min-w-0 flex flex-col">
          {offerDetails ? (
            <OfferTrackingCard offers={offerDetails} onAccepted={offers.refresh} />
          ) : offers.error ? (
            <AggregateError message={offers.error} onRetry={offers.refresh} />
          ) : (
            <AggregateLoading />
          )}
        </div>
        <div className="lg:col-span-6 min-w-0 flex flex-col">
          {interviewSlots ? (
            <InterviewScheduleCard interviews={interviewSlots} />
          ) : interviews.error ? (
            <AggregateError
              message={interviews.error}
              onRetry={interviews.refresh}
            />
          ) : (
            <AggregateLoading />
          )}
        </div>
      </div>

      {/* Row 4: Applications Tracker */}
      <div className="min-w-0">
        {applicationItems ? (
          <ApplicationsTracker applications={applicationItems} />
        ) : applications.error ? (
          <AggregateError
            message={applications.error}
            onRetry={applications.refresh}
          />
        ) : (
          <AggregateLoading />
        )}
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
