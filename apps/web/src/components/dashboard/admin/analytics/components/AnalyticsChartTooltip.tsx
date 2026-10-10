"use client";

import React from "react";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    fill?: string;
    stroke?: string;
    dataKey?: string;
  }>;
  label?: string | number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function AnalyticsChartTooltip({
  active,
  payload,
  label,
  valuePrefix = "",
  valueSuffix = "",
}: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl text-xs space-y-1.5 min-w-[130px] z-50">
      {label !== undefined && label !== null && (
        <div className="font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800/80 pb-1 text-[11px] uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="space-y-1 pt-0.5">
        {payload.map((item, idx) => {
          const color = item.color || item.fill || item.stroke || "#6366f1";
          const formattedVal =
            typeof item.value === "number"
              ? Number.isInteger(item.value)
                ? item.value.toLocaleString("en-IN")
                : item.value.toFixed(1)
              : item.value;

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate max-w-[140px] text-slate-700 dark:text-slate-300">
                  {item.name || item.dataKey || "Value"}
                </span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {valuePrefix}
                {formattedVal}
                {valueSuffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
