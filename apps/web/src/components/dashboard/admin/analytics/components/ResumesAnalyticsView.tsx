"use client";

import React from "react";
import {
  Users,
  FileCheck2,
  Target,
  CheckCircle2,
  Code2,
  FolderGit2,
  Award,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { AnalyticsStatCard } from "./AnalyticsStatCard";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { AnalyticsChartTooltip } from "./AnalyticsChartTooltip";
import type { ResumeMetrics } from "../types";

interface ResumesAnalyticsViewProps {
  metrics: ResumeMetrics | null;
}

const DEGREE_COLORS = [
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#3b82f6",
];

export function ResumesAnalyticsView({ metrics }: ResumesAnalyticsViewProps) {
  if (!metrics) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        Loading resume analytics...
      </div>
    );
  }

  const axisTickStyle = {
    fill: "currentColor",
    fontSize: 11,
    opacity: 0.7,
  };

  const githubData = [
    { name: "With GitHub Portfolio", value: Number(metrics.githubPct) },
    { name: "Without GitHub", value: 100 - Number(metrics.githubPct) },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnalyticsStatCard
          title="Total Candidates"
          value={metrics.total.toLocaleString("en-IN")}
          note="Candidate profiles screened"
          icon={Users}
          tone="purple"
          badge="Candidate Pool"
        />
        <AnalyticsStatCard
          title="Avg Resume Score"
          value={`${metrics.avgScore} / 100`}
          note="ATS and technical keyword rating"
          icon={FileCheck2}
          tone="mint"
          badge="Quality Benchmark"
        />
        <AnalyticsStatCard
          title="Avg Interview Calls"
          value={metrics.avgCalls}
          note="Interviews secured per candidate"
          icon={Target}
          tone="orange"
          badge="Conversion"
        />
        <AnalyticsStatCard
          title="GitHub Portfolio Rate"
          value={`${metrics.githubPct}%`}
          note="Candidates linking live projects"
          icon={CheckCircle2}
          tone="blue"
          badge="Portfolio Signal"
        />
      </div>

      {/* Row 1 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Score vs Interview Calls (LineChart) */}
        <AnalyticsPanel
          title="Resume Score vs Interview Calls"
          subtitle="Impact of resume quality score on average interview shortlists received"
          badge="Conversion Curve"
        >
          <div className="h-[320px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metrics.scoreVsCalls}
                margin={{ top: 12, right: 20, left: -10, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  tick={axisTickStyle}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                  unit=" calls"
                />
                <Tooltip
                  cursor={{ stroke: "rgba(99, 102, 241, 0.4)", strokeWidth: 1 }}
                  content={<AnalyticsChartTooltip valueSuffix=" Calls" />}
                />
                <Line
                  type="monotone"
                  dataKey="avgCalls"
                  name="Avg Calls"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#6366f1",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, fill: "#4f46e5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsPanel>

        {/* Average Interview Calls by Projects Count */}
        <AnalyticsPanel
          title="Average Interview Shortlists by Completed Projects"
          subtitle="Direct relationship between practical projects and recruiter interview interest"
          badge="Projects Impact"
        >
          <div className="h-[320px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.projData}
                margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  vertical={false}
                />
                <XAxis
                  dataKey="proj"
                  tick={axisTickStyle}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                  unit=" calls"
                />
                <Tooltip
                  cursor={{ fill: "rgba(245, 158, 11, 0.05)" }}
                  content={<AnalyticsChartTooltip valueSuffix=" Avg Calls" />}
                />
                <Bar
                  dataKey="avgCalls"
                  name="Average Calls"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsPanel>
      </div>

      {/* Row 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Distribution by Degree (2 cols) */}
        <AnalyticsPanel
          title="Candidate Cohort Distribution by Degree Program"
          subtitle="Academic degree distribution across all screened student resumes"
          badge="Degree Breakdown"
          className="lg:col-span-2"
        >
          <div className="h-[300px] w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-full sm:w-1/2 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.degreeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {metrics.degreeData.map((_, i) => (
                      <Cell
                        key={`deg-cell-${i}`}
                        fill={DEGREE_COLORS[i % DEGREE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <AnalyticsChartTooltip valueSuffix=" Candidates" />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Degree Legend list */}
            <div className="w-full sm:w-1/2 space-y-2.5">
              {metrics.degreeData.map((item, idx) => {
                const pct = Math.round((item.value / metrics.total) * 100);
                return (
                  <div
                    key={item.name}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            DEGREE_COLORS[idx % DEGREE_COLORS.length],
                        }}
                      />
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.value}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnalyticsPanel>

        {/* GitHub & Profile Signals (1 col) */}
        <AnalyticsPanel
          title="Portfolio Signals Impact"
          subtitle="Influence of GitHub repository on hiring"
          badge="Key Signals"
        >
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-center h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={githubData}
                    dataKey="value"
                    innerRadius={46}
                    outerRadius={62}
                    stroke="none"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {metrics.githubPct}%
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  With GitHub
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <FolderGit2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  GitHub Linked Candidates
                </span>
                <span className="font-bold">2.4x Calls</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-800 dark:text-indigo-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Optimal Project Count
                </span>
                <span className="font-bold">4 - 8 Projects</span>
              </div>
            </div>
          </div>
        </AnalyticsPanel>
      </div>
    </div>
  );
}
