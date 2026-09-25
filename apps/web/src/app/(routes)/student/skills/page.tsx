"use client";

import React from "react";
import SkillGapCard from "@/components/dashboard/student/SkillGapCard";
import { mockDashboardData } from "@/data/dashboardData";
import { toast } from "sonner";
import { Layers, Sparkles, BookOpen, ExternalLink } from "lucide-react";

export default function StudentSkills() {
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
            Compare your profile skills against requirements of top campus recruiters and access targeted learning paths.
          </p>
        </div>

        <button
          onClick={() => toast.info("Syncing latest assessment results...")}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/20 hover:bg-purple-500 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Analyze New Skills
        </button>
      </div>

      {/* Main Skill Gap Component */}
      <div className="min-w-0">
        <SkillGapCard
          skills={mockDashboardData.skillGaps}
          variant="default"
          onPracticeSkill={(skill) =>
            toast.info(`Opening practice module for ${skill}`)
          }
        />
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
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">System Design: Caching with Redis</p>
              <p className="text-xs text-slate-500 mt-0.5">2.5 hours • High priority for Product Companies</p>
            </div>
            <button
              onClick={() => toast.success("Enrolled in System Design module")}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Start
            </button>
          </div>

          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">Docker Containerization Essentials</p>
              <p className="text-xs text-slate-500 mt-0.5">1.5 hours • Recommended for DevOps & Cloud roles</p>
            </div>
            <button
              onClick={() => toast.success("Enrolled in Docker module")}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
