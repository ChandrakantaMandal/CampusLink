"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@HireBridge/ui/components/button";

export default function ReadinessCalculator() {
  const [cgpa, setCgpa] = useState<number>(8.4);
  const [techLevel, setTechLevel] = useState<number>(2); // 0: Beginner, 1: Intermediate, 2: Advanced, 3: Expert
  const [projectsCount, setProjectsCount] = useState<number>(3);
  const [resumeType, setResumeType] = useState<number>(2); // 0: Basic, 1: Standard, 2: ATS Optimized
  const [assessmentScore, setAssessmentScore] = useState<number>(80);

  // Academic Score (20% weight, max 20 pts from CGPA 10)
  const academicScore = Math.min(20, Math.round((cgpa / 10) * 20));

  // Technical Score (30% weight)
  // Beginner: 12, Intermediate: 20, Advanced: 26, Expert: 30
  const techScores = [12, 20, 26, 30];
  const technicalScore = techScores[techLevel];

  // Project Score (20% weight)
  // 0: 4 pts, 1: 10 pts, 2: 15 pts, 3: 18 pts, 4+: 20 pts
  const projectScores = [4, 10, 15, 18, 20];
  const projectScore = projectScores[Math.min(4, projectsCount)];

  // Resume Score (10% weight)
  // Basic: 4 pts, Standard: 7 pts, ATS Optimized: 10 pts
  const resumeScores = [4, 7, 10];
  const resumeScore = resumeScores[resumeType];

  // Assessment Score (20% weight)
  const assessScore = Math.round((assessmentScore / 100) * 20);

  // Total readiness score out of 100
  const totalScore = Math.min(
    100,
    academicScore + technicalScore + projectScore + resumeScore + assessScore
  );

  const getTierInfo = (score: number) => {
    if (score >= 85) {
      return {
        badge: "Tier-1 Product & FinTech Ready",
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/10 border-emerald-500/30",
        companies: "Google, Microsoft, Amazon, Atlassian, Goldman Sachs",
        recommendation:
          "Outstanding profile! You easily pass 98% of campus eligibility cutoffs. Focus on system design and mock behavioral interviews.",
      };
    } else if (score >= 70) {
      return {
        badge: "High-Growth Tech & Tier-2 Ready",
        color: "text-indigo-600 dark:text-indigo-400",
        bgColor: "bg-indigo-500/10 border-indigo-500/30",
        companies: "Flipkart, Cisco, Oracle, Infosys SP, Cognizant Pro",
        recommendation:
          "Strong foundation! Complete 1 more full-stack deployment with Docker or cloud hosting to cross the Tier-1 85+ threshold.",
      };
    } else {
      return {
        badge: "Core Enterprise & Mass Ready",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/30",
        companies: "TCS, Wipro, Accenture, Capgemini, Tech Mahindra",
        recommendation:
          "Eligible for mass & service drives. Take targeted technical skill assessments and verify your projects to boost readiness.",
      };
    }
  };

  const tier = getTierInfo(totalScore);

  return (
    <section id="readiness" className="py-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            <span>Deterministic Scoring Algorithm</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Interactive Placement Readiness Calculator
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            See how CAMPUSLINK evaluates candidates using deterministic multi-factor weighting: Academics (20%), Technical Skills (30%), Projects (20%), Resume (10%), and Assessments (20%).
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="mt-12 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left Controls (7 cols) */}
            <div className="space-y-6 lg:col-span-7">
              {/* Slider 1: CGPA */}
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Academics / CGPA (20% Weight)
                  </label>
                  <span className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
                    {cgpa.toFixed(1)} / 10.0 ({academicScore} pts)
                  </span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.1"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>5.0 (Pass)</span>
                  <span>7.5 (Standard Cutoff)</span>
                  <span>10.0 (Distinction)</span>
                </div>
              </div>

              {/* Slider 2: Technical Skills */}
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Technical Stack Depth (30% Weight)
                  </label>
                  <span className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
                    {["Foundations", "Intermediate", "Advanced Full-Stack", "Expert Architecture"][techLevel]} ({technicalScore} pts)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
                  {[
                    { label: "Beginner", val: 0 },
                    { label: "Intermediate", val: 1 },
                    { label: "Advanced", val: 2 },
                    { label: "Expert", val: 3 },
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      type="button"
                      onClick={() => setTechLevel(lvl.val)}
                      className={`rounded-xl py-2 text-xs font-bold transition-all ${
                        techLevel === lvl.val
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 3: Projects Count */}
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Verified Projects with Live Demos (20% Weight)
                  </label>
                  <span className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
                    {projectsCount} {projectsCount === 1 ? "Project" : "Projects"} ({projectScore} pts)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={projectsCount}
                  onChange={(e) => setProjectsCount(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0 Projects</span>
                  <span>2 Deployed Projects</span>
                  <span>4+ Production Apps</span>
                </div>
              </div>

              {/* Two Column Row: Resume & Practice Assessment */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Resume Status */}
                <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Resume Quality (10%)
                    </label>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {resumeScore} pts
                    </span>
                  </div>
                  <select
                    value={resumeType}
                    onChange={(e) => setResumeType(parseInt(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value={0}>Basic Text Resume (4 pts)</option>
                    <option value={1}>Standard Formatted Resume (7 pts)</option>
                    <option value={2}>CAMPUSLINK ATS-Optimized (10 pts)</option>
                  </select>
                </div>

                {/* Assessments Practice */}
                <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Mock Tests (20%)
                    </label>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {assessScore} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={assessmentScore}
                    onChange={(e) => setAssessmentScore(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{assessmentScore}% Average Test Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Gauge & Output Panel (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
                {/* Back glow */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />

                <div className="space-y-6">
                  {/* Gauge Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Computed Readiness Score
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${tier.bgColor} ${tier.color}`}>
                      <Sparkles className="h-3 w-3" />
                      {totalScore >= 85 ? "Top 5%" : totalScore >= 70 ? "Top 20%" : "Average"}
                    </span>
                  </div>

                  {/* Big Number Score */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black text-white">{totalScore}</span>
                    <span className="text-xl font-bold text-indigo-300">/ 100</span>
                  </div>

                  {/* Tier Pill */}
                  <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-sm">
                    <div className="text-xs text-indigo-200 font-medium">Placement Tier Rating:</div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      {tier.badge}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      AI Placement Insights
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {tier.recommendation}
                    </p>
                  </div>

                  {/* Typical Recruiter Fit */}
                  <div className="space-y-1.5 pt-2 border-t border-indigo-900/60 text-xs">
                    <span className="text-slate-400 font-medium">Sample Matching Companies:</span>
                    <div className="font-semibold text-indigo-200">{tier.companies}</div>
                  </div>

                  {/* Direct Profile CTA */}
                  <div className="pt-2">
                    <Link href="/profile" className="block w-full">
                      <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/30 hover:scale-105">
                        <span>Save & Track in Profile</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
