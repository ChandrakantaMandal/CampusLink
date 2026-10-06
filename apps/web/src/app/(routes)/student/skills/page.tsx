"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import SkillGapCard from "@/components/dashboard/student/SkillGapCard";
import {
  AggregateLoading,
  AggregateError,
} from "@/components/dashboard/student/aggregate-feedback";
import { useStudentSkills } from "@/hooks/use-student";
import { toSkillGaps } from "@/lib/dashboard-adapters";
import { toast } from "sonner";

import {
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";

type SkillGapItem = {
  name: string;
  level: "Strong" | "Improve" | "Missing";
  category: string;
};

type SkillGapResult = {
  skill_gap_score: number;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string;
};

type Job = {
  id: string;
  title: string;
};

export default function StudentSkills() {
  const searchParams = useSearchParams();
const jobId = searchParams.get("jobId");
  const [skills, setSkills] = useState<SkillGapItem[]>([]);
  const [jobTitle, setJobTitle] = useState("AI Engineer");
  const [loading, setLoading] = useState(true);

  async function analyzeSkillGap() {
    try {
      setLoading(true);

if (!jobId) {
  setSkills([]);
  setLoading(false);
  return;
}

// Get available jobs
const jobsResponse = await fetch(
        "http://localhost:3000/api/jobs",
        {
          credentials: "include",
        },
      );

      const jobsResult = await jobsResponse.json();

      if (!jobsResponse.ok) {
        throw new Error(
          jobsResult.message || "Failed to fetch jobs",
        );
      }

      const jobs: Job[] = jobsResult.data || [];

      

const selectedJob = jobs.find((job) => job.id === jobId);

if (!selectedJob) {
  throw new Error("Selected job was not found.");
}

setJobTitle(selectedJob.title);
      // Call CampusLink server -> AI service -> Gemini
      const response = await fetch(
        `http://localhost:3000/api/jobs/${selectedJob.id}/skill-gap`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Skill gap analysis failed",
        );
      }

      const data: SkillGapResult = result.data;

      // Convert AI response into existing SkillGapCard format
      const formattedSkills: SkillGapItem[] = [
  ...data.matched_skills.map((skill) => ({
    name: skill,
    level: "Strong" as const,
    category: "Required Skill",
  })),

  ...data.missing_skills.map((skill) => ({
    name: skill,
    level: "Missing" as const,
    category: "Required Skill",
  })),
];

     await new Promise((resolve) => setTimeout(resolve, 5000));

setSkills(formattedSkills);
    } catch (error) {
      console.error("Skill gap analysis failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to analyze skill gap",
      );
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  analyzeSkillGap();
}, [jobId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Layers className="h-5 w-5" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Skill Gap & Competency Analysis
            </h1>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare your profile skills against requirements of
            top campus recruiters and access targeted learning paths.
          </p>
        </div>

        <button
          onClick={analyzeSkillGap}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-purple-500 transition-colors disabled:opacity-60"
        >
          <Sparkles className="h-3.5 w-3.5" />

          {loading ? "Analyzing..." : "Analyze New Skills"}
        </button>
      </div>

      {/* Main Skill Gap Component */}
      <div className="min-w-0">
        {loading ? (
  <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-8 sm:p-10">
    
    {/* Animated glow */}
    <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />

    <div className="relative flex flex-col items-center text-center">
      
      {/* AI Orb */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-purple-400/40 animate-spin [animation-duration:3s]" />
        
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40">
          <Sparkles className="h-7 w-7 text-white animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white">
        CampusLink AI is analyzing
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Comparing your profile with{" "}
        <span className="font-semibold text-indigo-300">
          {jobTitle}
        </span>
      </p>

      {/* Scanning animation */}
      <div className="mt-7 w-full max-w-md">
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-indigo-300">
          🔍 Scanning skills
        </span>

        <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-purple-300">
          🧠 AI comparison
        </span>

        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
          📊 Finding gaps
        </span>
      </div>

      <p className="mt-5 text-[11px] text-slate-500">
        Gemini is preparing your personalized skill roadmap...
      </p>
    </div>
  </div>
  ) : !jobId ? (
  <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 p-10">
    <div className="flex flex-col items-center text-center">

      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <Layers className="h-8 w-8 text-indigo-400" />
      </div>

      <h3 className="text-xl font-bold text-white">
        Select a Job to Analyze
      </h3>

      <p className="mt-2 max-w-lg text-sm text-slate-400">
        Your skill gap will be calculated based on the requirements
        of the job you apply for.
      </p>

      <button
        type="button"
        onClick={() => {
          window.location.href = "/student/jobs";
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition"
      >
        <Sparkles className="h-4 w-4" />
        Browse Recommended Jobs
      </button>

      <p className="mt-4 text-xs text-slate-500">
        Apply to a job first → then view its personalized skill gap.
      </p>

    </div>
  </div>

) : (
          <SkillGapCard
            skills={skills}
            variant="default"
            onPracticeSkill={(skill) =>
              toast.info(
                `Opening practice module for ${skill}`,
              )
            }
          />
        )}
      </div>

      {/* Learning Resources Recommendation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />

          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Curated Practice Modules for Missing Competencies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {skills
    .filter((skill) => skill.level === "Missing")
    .map((skill) => (
      <div
        key={skill.name}
        className="rounded-xl border border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center"
      >
        <div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white">
            {skill.name}
          </p>

          <p className="text-xs text-slate-500 mt-0.5">
            Recommended based on {jobTitle} requirements
          </p>
        </div>

        <button
          onClick={() =>
            toast.success(`Opening ${skill.name} practice module`)
          }
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Start
        </button>
      </div>
    ))}
</div>
      </div>
    </div>
  );
}