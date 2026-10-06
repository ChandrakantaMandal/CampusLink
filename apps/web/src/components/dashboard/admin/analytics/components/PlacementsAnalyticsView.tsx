"use client";

import React from "react";
import {
  Users,
  Award,
  BookOpen,
  Target,
  GraduationCap,
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
  ScatterChart,
  Scatter,
} from "recharts";
import { AnalyticsStatCard } from "./AnalyticsStatCard";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { AnalyticsChartTooltip } from "./AnalyticsChartTooltip";
import type { PlacementMetrics } from "../types";

interface PlacementsAnalyticsViewProps {
  metrics: PlacementMetrics | null;
}

const PIE_COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"];

export function PlacementsAnalyticsView({ metrics }: PlacementsAnalyticsViewProps) {
  if (!metrics) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        Loading placement analytics...
      </div>
    );
  }

  const axisTickStyle = {
    fill: "currentColor",
    fontSize: 11,
    opacity: 0.7,
  };

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnalyticsStatCard
          title="Total Students"
          value={metrics.total.toLocaleString("en-IN")}
          note="Records in placement dataset"
          icon={Users}
          tone="purple"
          badge="Cohort"
        />
        <AnalyticsStatCard
          title="Placement Rate"
          value={`${metrics.placementRate}%`}
          note={`${metrics.placedCount.toLocaleString("en-IN")} students placed`}
          icon={Award}
          tone="mint"
          badge="High Signal"
        />
        <AnalyticsStatCard
          title="Average CGPA"
          value={metrics.avgCGPA}
          note="Scale of 10.0 across all branches"
          icon={BookOpen}
          tone="orange"
          badge="Academic"
        />
        <AnalyticsStatCard
          title="Avg Aptitude Score"
          value={metrics.avgAptitude}
          note="Standardized assessment baseline"
          icon={Target}
          tone="blue"
          badge="Assessment"
        />
      </div>

      {/* Row 1 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Placement Chart (2 cols) */}
        <AnalyticsPanel
          title="Placement Absorption by Engineering Branch"
          subtitle="Placed versus unplaced student counts by academic department"
          badge="Branch Comparison"
          className="lg:col-span-2"
        >
          <div className="h-[320px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.branchData}
                margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  vertical={false}
                />
                <XAxis
                  dataKey="branch"
                  tick={axisTickStyle}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                  content={<AnalyticsChartTooltip />}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    paddingTop: 10,
                  }}
                />
                <Bar
                  dataKey="Placed"
                  name="Placed"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={38}
                />
                <Bar
                  dataKey="Unplaced"
                  name="Unplaced"
                  fill="#f43f5e"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsPanel>

        {/* Programming Skills PieChart (1 col) */}
        <AnalyticsPanel
          title="Programming Skills Distribution"
          subtitle="Categorized proficiency reported by candidates"
          badge="Skills Breakdown"
        >
          <div className="h-[320px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={metrics.skillData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="none"
                >
                  {metrics.skillData.map((_, i) => (
                    <Cell
                      key={`skill-cell-${i}`}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<AnalyticsChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mt-2">
              {metrics.skillData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span>{item.name}:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsPanel>
      </div>

      {/* Row 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CGPA vs Aptitude Score Scatter */}
        <AnalyticsPanel
          title="CGPA vs Aptitude Score Correlation"
          subtitle="Sample correlation between student academic CGPA and assessment scores"
          badge="Correlation Plot"
        >
          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="cgpa"
                  name="CGPA"
                  type="number"
                  domain={[5, 10]}
                  tick={axisTickStyle}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
                  tickLine={false}
                  unit=" CGPA"
                />
                <YAxis
                  dataKey="aptitude"
                  name="Aptitude"
                  type="number"
                  domain={[40, 100]}
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                  unit=" pts"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={<AnalyticsChartTooltip />}
                />
                <Scatter
                  name="Students"
                  data={metrics.scatterSample}
                  fill="#6366f1"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsPanel>

        {/* Placements by Communication Skill */}
        <AnalyticsPanel
          title="Placement Absorption by Communication Skill"
          subtitle="Success rate based on candidate interpersonal & communication rating"
          badge="Soft Skills Impact"
        >
          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.commData}
                margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  vertical={false}
                />
                <XAxis
                  dataKey="comm"
                  tick={axisTickStyle}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                  content={<AnalyticsChartTooltip />}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar
                  dataKey="Placed"
                  name="Placed Students"
                  fill="#4f46e5"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="Total"
                  name="Total Candidates"
                  fill="#94a3b8"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsPanel>
      </div>

      {/* Row 3: Branch Performance Summary Table */}
      <AnalyticsPanel
        title="Departmental Placement Performance Table"
        subtitle="Complete breakdown of registered students, offers secured, and conversion percentages"
        badge="Full Breakdown"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Engineering Branch</th>
                <th className="py-3 px-4">Cohort Size</th>
                <th className="py-3 px-4">Placed</th>
                <th className="py-3 px-4">Unplaced</th>
                <th className="py-3 px-4">Placement Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {metrics.branchData.map((row) => (
                <tr
                  key={row.branch}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>{row.branch}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {row.total}
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.Placed}
                  </td>
                  <td className="py-3 px-4 text-rose-500 font-medium">
                    {row.Unplaced}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.rate >= 75
                              ? "bg-emerald-500"
                              : row.rate >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${row.rate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {row.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnalyticsPanel>
    </div>
  );
}
