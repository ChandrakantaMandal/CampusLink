  "use client";

  import React, { useState } from "react";
  import { Briefcase, Sparkles, CheckCircle2, ArrowRight, MapPin, DollarSign, Calendar, Info, Loader2 } from "lucide-react";
  import { toast } from "sonner";
  import type { RecommendedJob } from "@/data/dashboardData";
  import { applyToJob } from "@/lib/api/student.api";

  interface RecommendedJobsCardProps {
    jobs: RecommendedJob[];
    onApplyJob?: (jobId: string, matchPercentage: number | null) => void;
    columns?: 1 | 2 | 3;
  }

  export default function RecommendedJobsCard({
    jobs,
    onApplyJob,
    columns = 3,
  }: RecommendedJobsCardProps) {
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [pendingJobs, setPendingJobs] = useState<Record<string, boolean>>({});

  const handleApply = async (job: RecommendedJob) => {
    if (pendingJobs[job.id] || appliedJobs[job.id] || job.hasApplied) return;

    setPendingJobs((prev) => ({
      ...prev,
      [job.id]: true,
    }));

    try {
      await applyToJob({ jobId: job.id });

      setAppliedJobs((prev) => ({
        ...prev,
        [job.id]: true,
      }));

      toast.success(`Application submitted to ${job.company}!`, {
        description: `Applied for ${job.title} (${job.ctc}). Confirmation sent to your student email.`,
      });

      onApplyJob?.(job.id, job.matchPercentage);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      if (message.toLowerCase().includes("already applied")) {
        setAppliedJobs((prev) => ({
          ...prev,
          [job.id]: true,
        }));

        toast.info(
          `You have already applied for ${job.title} at ${job.company}.`,
        );

        onApplyJob?.(job.id, job.matchPercentage);
      } else {
        toast.error("Could not submit application", {
          description: message,
        });
      }
    } finally {
      setPendingJobs((prev) => ({
        ...prev,
        [job.id]: false,
      }));
    }
  };
