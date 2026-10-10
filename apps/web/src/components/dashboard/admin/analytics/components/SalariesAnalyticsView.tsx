"use client";

import React from "react";
import {
  Building2,
  TrendingUp,
  IndianRupee,
  MapPin,
  Briefcase,
  Award,
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
} from "recharts";
import { AnalyticsStatCard } from "./AnalyticsStatCard";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { AnalyticsChartTooltip } from "./AnalyticsChartTooltip";
import type { SalaryMetrics } from "../types";

interface SalariesAnalyticsViewProps {
  metrics: SalaryMetrics | null;
}

const HUB_COLORS = [
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#3b82f6",
];

export function SalariesAnalyticsView({ metrics }: SalariesAnalyticsViewProps) {
  if (!metrics) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        Loading compensation analytics...
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
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnalyticsStatCard
          title="Company Profiles"
          value={metrics.total.toLocaleString("en-IN")}
          note="Verified compensation records"
          icon={Building2}
          tone="purple"
          badge="Verified"
        />
        <AnalyticsStatCard
          title="Highest Package"
          value={`₹${metrics.highest} LPA`}
          note="Top recorded CTC in dataset"
          icon={TrendingUp}
          tone="mint"
          badge="Peak Offer"
        />
        <AnalyticsStatCard
          title="Median CTC"
          value={`₹${metrics.median} LPA`}
          note={`Average cohort CTC: ₹${metrics.average} LPA`}
          icon={IndianRupee}
          tone="orange"
          badge="Benchmark"
        />
        <AnalyticsStatCard
          title="Hiring Hubs"
          value={metrics.totalLocations}
          note="Distinct metropolitan locations"
          icon={MapPin}
          tone="blue"
          badge="Pan-India"
        />
      </div>

      {/* Row 1 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies by Package (Horizontal BarChart) */}
        <AnalyticsPanel
          title="Top 10 Companies by Package (CTC)"
          subtitle="Highest recorded compensation packages for engineering freshers"
          badge="Top Offers"
        >
          <div className="h-[340px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.topCompanies}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 24, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={axisTickStyle}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
                  tickLine={false}
                  unit=" LPA"
                />
                <YAxis
                  dataKey="company"
                  type="category"
                  width={110}
                  tick={axisTickStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                  content={
                    <AnalyticsChartTooltip valuePrefix="₹" valueSuffix=" LPA" />
                  }
                />
                <Bar
                  dataKey="ctc"
                  name="CTC"
                  fill="#4f46e5"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsPanel>

        {/* Salary Bracket Distribution */}
        <AnalyticsPanel
          title="Salary CTC Bracket Distribution"
          subtitle="Proportion of offers distributed across compensation bands"
          badge="Tier Breakdown"
        >
          <div className="h-[340px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.ctcRanges}
                margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
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
                <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(20, 184, 166, 0.05)" }}
                  content={<AnalyticsChartTooltip valueSuffix=" Offers" />}
                />
                <Bar
                  dataKey="count"
                  name="Offers Count"
                  fill="#14b8a6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsPanel>
      </div>

      {/* Row 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Opportunities by Hub (2 cols) */}
        <AnalyticsPanel
          title="Hiring Opportunities by Tech Hub"
          subtitle="Geographic concentration of recruiting companies & office locations"
          badge="Geographic Distribution"
          className="lg:col-span-2"
        >
          <div className="h-[300px] w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-1/2 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.topLocations}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {metrics.topLocations.map((_, i) => (
                      <Cell
                        key={`loc-cell-${i}`}
                        fill={HUB_COLORS[i % HUB_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<AnalyticsChartTooltip valueSuffix=" Companies" />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Location Legend cards */}
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
              {metrics.topLocations.map((loc, idx) => (
                <div
                  key={loc.name}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: HUB_COLORS[idx % HUB_COLORS.length],
                      }}
                    />
                    <span className="truncate font-medium">{loc.name}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {loc.value}{" "}
                    <span className="text-[11px] font-normal text-slate-500">
                      records
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsPanel>

        {/* Salary Market Summary Snapshot (1 col) */}
        <AnalyticsPanel
          title="Compensation Snapshot"
          subtitle="Key takeaways from current hiring season"
          badge="Summary"
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Premium Tier (&gt; 20 LPA)
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {metrics.ctcRanges
                  .filter(
                    (r) => r.range === "20 - 35 LPA" || r.range === "35+ LPA",
                  )
                  .reduce((acc, r) => acc + r.count, 0)}{" "}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  offers
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Tier-1 MNCs, Fintech & DeepTech roles
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Core Volume Band (5 - 20 LPA)
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {metrics.ctcRanges
                  .filter(
                    (r) =>
                      r.range === "5 - 10 LPA" || r.range === "10 - 20 LPA",
                  )
                  .reduce((acc, r) => acc + r.count, 0)}{" "}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  offers
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Standard product & consulting hiring bands
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Median Growth Index
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                ₹{metrics.median} LPA
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Consistent 50th percentile fresher benchmark
              </p>
            </div>
          </div>
        </AnalyticsPanel>
      </div>
    </div>
  );
}
