"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Papa from "papaparse";
import type {
  PlacementRecord,
  SalaryRecord,
  ResumeRecord,
  PlacementMetrics,
  SalaryMetrics,
  ResumeMetrics,
} from "./types";

export function useAnalyticsData() {
  const [placementsData, setPlacementsData] = useState<PlacementRecord[]>([]);
  const [salariesData, setSalariesData] = useState<SalaryRecord[]>([]);
  const [resumesData, setResumesData] = useState<ResumeRecord[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Function to fetch and parse all 3 CSV files directly
  const loadDatasetsFromCSV = useCallback(async () => {
    setIsLoading(true);
    try {
      const [placRes, salRes, resRes] = await Promise.all([
        fetch("/data/analytics/college_placements.csv"),
        fetch("/data/analytics/engineering_fresher_salaries.csv"),
        fetch("/data/analytics/resume_interview.csv"),
      ]);

      if (placRes.ok) {
        const text = await placRes.text();
        const parsed = Papa.parse<PlacementRecord>(text, {
          header: true,
          skipEmptyLines: true,
        }).data;
        if (parsed.length) setPlacementsData(parsed);
      }

      if (salRes.ok) {
        const text = await salRes.text();
        const parsed = Papa.parse<SalaryRecord>(text, {
          header: true,
          skipEmptyLines: true,
        }).data;
        if (parsed.length) setSalariesData(parsed);
      }

      if (resRes.ok) {
        const text = await resRes.text();
        const parsed = Papa.parse<ResumeRecord>(text, {
          header: true,
          skipEmptyLines: true,
        }).data;
        if (parsed.length) setResumesData(parsed);
      }

      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to load CSV datasets:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load from CSV on mount
  useEffect(() => {
    loadDatasetsFromCSV();
  }, [loadDatasetsFromCSV]);

  // --- 1. PLACEMENT METRICS COMPUTATION ---
  const placementMetrics: PlacementMetrics | null = useMemo(() => {
    if (!placementsData.length) return null;
    const total = placementsData.length;
    const placedCount = placementsData.filter(
      (r) => String(r.Placement_Status).trim().toLowerCase() === "placed"
    ).length;
    const unplacedCount = total - placedCount;
    const placementRate = ((placedCount / total) * 100).toFixed(1);

    const validCgpaList = placementsData
      .map((r) => Number(r.CGPA))
      .filter((n) => !isNaN(n) && n > 0);
    const avgCGPA = validCgpaList.length
      ? (validCgpaList.reduce((acc, n) => acc + n, 0) / validCgpaList.length).toFixed(2)
      : "0.00";

    const validAptitudeList = placementsData
      .map((r) => Number(r.Aptitude_Score))
      .filter((n) => !isNaN(n) && n > 0);
    const avgAptitude = validAptitudeList.length
      ? (validAptitudeList.reduce((acc, n) => acc + n, 0) / validAptitudeList.length).toFixed(1)
      : "0.0";

    // Branch breakdown
    const branchMap: Record<
      string,
      { branch: string; Placed: number; Unplaced: number; total: number; rate: number }
    > = {};
    const skillMap: Record<string, number> = {};
    const commMap: Record<string, { comm: string; Placed: number; Total: number; rate: number }> = {};
    const genderMap: Record<string, { gender: string; Placed: number; Total: number }> = {};

    placementsData.forEach((r) => {
      const b = (r.Branch || "Other").trim().toUpperCase();
      const isPlaced = String(r.Placement_Status).trim().toLowerCase() === "placed";

      if (!branchMap[b]) {
        branchMap[b] = { branch: b, Placed: 0, Unplaced: 0, total: 0, rate: 0 };
      }
      branchMap[b].total++;
      if (isPlaced) branchMap[b].Placed++;
      else branchMap[b].Unplaced++;

      // Skills
      const skill = (r.Programming_Skills || "Unspecified").trim();
      skillMap[skill] = (skillMap[skill] || 0) + 1;

      // Communication
      const comm = (r.Communication_Skills || "Average").trim();
      if (!commMap[comm]) commMap[comm] = { comm, Placed: 0, Total: 0, rate: 0 };
      commMap[comm].Total++;
      if (isPlaced) commMap[comm].Placed++;

      // Gender
      const gender = (r.Gender || "Other").trim();
      if (!genderMap[gender]) genderMap[gender] = { gender, Placed: 0, Total: 0 };
      genderMap[gender].Total++;
      if (isPlaced) genderMap[gender].Placed++;
    });

    Object.values(branchMap).forEach((item) => {
      item.rate = item.total > 0 ? Math.round((item.Placed / item.total) * 100) : 0;
    });

    Object.values(commMap).forEach((item) => {
      item.rate = item.Total > 0 ? Math.round((item.Placed / item.Total) * 100) : 0;
    });

    const scatterSample = placementsData.slice(0, 120).map((r) => ({
      cgpa: Number(r.CGPA) || 0,
      aptitude: Number(r.Aptitude_Score) || 0,
      status: String(r.Placement_Status).trim().toLowerCase() === "placed" ? "Placed" : "Unplaced",
    }));

    return {
      total,
      placedCount,
      unplacedCount,
      placementRate,
      avgCGPA,
      avgAptitude,
      branchData: Object.values(branchMap).sort((a, b) => b.total - a.total),
      skillData: Object.entries(skillMap).map(([name, value]) => ({ name, value })),
      commData: Object.values(commMap),
      scatterSample,
      genderData: Object.values(genderMap),
    };
  }, [placementsData]);

  // --- 2. SALARY METRICS COMPUTATION ---
  const salaryMetrics: SalaryMetrics | null = useMemo(() => {
    if (!salariesData.length) return null;
    const total = salariesData.length;
    const validSalaries = salariesData
      .map((r) => Number(r.CTC_LPA))
      .filter((n) => !isNaN(n) && n > 0)
      .sort((a, b) => a - b);

    if (!validSalaries.length) return null;

    const highest = Math.max(...validSalaries).toFixed(1);
    const median = validSalaries[Math.floor(validSalaries.length / 2)]?.toFixed(1) || "0.0";
    const average = (
      validSalaries.reduce((acc, s) => acc + s, 0) / validSalaries.length
    ).toFixed(1);

    const locMap: Record<string, number> = {};
    salariesData.forEach((r) => {
      const rawLoc = r.Location && String(r.Location).trim() !== "" ? String(r.Location).trim() : "Other / Remote";
      const mainLoc = rawLoc.split(/[/,]/)[0]?.trim() || "Other";
      locMap[mainLoc] = (locMap[mainLoc] || 0) + 1;
    });

    const topCompanies = salariesData
      .filter((r) => r.Company && Number(r.CTC_LPA) > 0)
      .map((r) => ({ company: r.Company.trim(), ctc: Number(r.CTC_LPA) || 0 }))
      .sort((a, b) => b.ctc - a.ctc)
      .reduce<{ company: string; ctc: number }[]>((acc, cur) => {
        if (!acc.some((x) => x.company.toLowerCase() === cur.company.toLowerCase())) {
          acc.push(cur);
        }
        return acc;
      }, [])
      .slice(0, 10);

    const ctcRanges = [
      {
        range: "< 5 LPA",
        count: validSalaries.filter((s) => s < 5).length,
        percentage: Math.round((validSalaries.filter((s) => s < 5).length / validSalaries.length) * 100),
      },
      {
        range: "5 - 10 LPA",
        count: validSalaries.filter((s) => s >= 5 && s < 10).length,
        percentage: Math.round((validSalaries.filter((s) => s >= 5 && s < 10).length / validSalaries.length) * 100),
      },
      {
        range: "10 - 20 LPA",
        count: validSalaries.filter((s) => s >= 10 && s < 20).length,
        percentage: Math.round((validSalaries.filter((s) => s >= 10 && s < 20).length / validSalaries.length) * 100),
      },
      {
        range: "20 - 35 LPA",
        count: validSalaries.filter((s) => s >= 20 && s < 35).length,
        percentage: Math.round((validSalaries.filter((s) => s >= 20 && s < 35).length / validSalaries.length) * 100),
      },
      {
        range: "35+ LPA",
        count: validSalaries.filter((s) => s >= 35).length,
        percentage: Math.round((validSalaries.filter((s) => s >= 35).length / validSalaries.length) * 100),
      },
    ];

    const topLocations = Object.entries(locMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return {
      total,
      highest,
      median,
      average,
      totalLocations: Object.keys(locMap).length,
      topCompanies,
      ctcRanges,
      topLocations,
    };
  }, [salariesData]);

  // --- 3. RESUME METRICS COMPUTATION ---
  const resumeMetrics: ResumeMetrics | null = useMemo(() => {
    if (!resumesData.length) return null;
    const total = resumesData.length;

    const validScores = resumesData
      .map((r) => Number(r.resume_score))
      .filter((n) => !isNaN(n));
    const avgScore = validScores.length
      ? (validScores.reduce((acc, s) => acc + s, 0) / validScores.length).toFixed(1)
      : "0.0";

    const validCalls = resumesData
      .map((r) => Number(r.interview_calls))
      .filter((n) => !isNaN(n));
    const avgCalls = validCalls.length
      ? (validCalls.reduce((acc, s) => acc + s, 0) / validCalls.length).toFixed(1)
      : "0.0";

    const githubCount = resumesData.filter(
      (r) => String(r.github_portfolio).trim().toLowerCase() === "yes"
    ).length;
    const githubPct = ((githubCount / total) * 100).toFixed(0);

    const degreeMap: Record<string, number> = {};
    const projCalls: Record<string, { proj: string; calls: number; count: number }> = {};
    const scoreBins: Record<
      string,
      { range: string; minScore: number; totalCalls: number; count: number }
    > = {};

    resumesData.forEach((r) => {
      const d = (r.degree || "Other").trim();
      degreeMap[d] = (degreeMap[d] || 0) + 1;

      const pCount = Number(r.projects_count) || 0;
      const projLabel = pCount >= 10 ? "10+ Projs" : `${pCount} Projs`;
      if (!projCalls[projLabel]) {
        projCalls[projLabel] = { proj: projLabel, calls: 0, count: 0 };
      }
      projCalls[projLabel].calls += Number(r.interview_calls) || 0;
      projCalls[projLabel].count++;

      const scoreNum = Number(r.resume_score) || 0;
      const scoreTier = Math.floor(scoreNum / 10) * 10;
      const rangeLabel = `${scoreTier}-${scoreTier + 9}`;
      if (!scoreBins[rangeLabel]) {
        scoreBins[rangeLabel] = {
          range: rangeLabel,
          minScore: scoreTier,
          totalCalls: 0,
          count: 0,
        };
      }
      scoreBins[rangeLabel].totalCalls += Number(r.interview_calls) || 0;
      scoreBins[rangeLabel].count++;
    });

    const scoreVsCalls = Object.values(scoreBins)
      .map((b) => ({
        range: b.range,
        avgCalls: Number((b.totalCalls / b.count).toFixed(1)),
        count: b.count,
        minScore: b.minScore,
      }))
      .sort((a, b) => a.minScore - b.minScore)
      .map(({ range, avgCalls, count }) => ({ range, avgCalls, count }));

    const projData = Object.values(projCalls)
      .map((p) => ({
        proj: p.proj,
        avgCalls: Number((p.calls / p.count).toFixed(1)),
        count: p.count,
      }))
      .sort((a, b) => parseInt(a.proj) - parseInt(b.proj));

    const degreeData = Object.entries(degreeMap).map(([name, value]) => ({ name, value }));

    return {
      total,
      avgScore,
      avgCalls,
      githubPct,
      degreeData,
      scoreVsCalls,
      projData,
    };
  }, [resumesData]);

  // Export CSV helper
  const exportCurrentDataset = (tab: "placements" | "salaries" | "resumes") => {
    let content = "";
    let filename = "";

    if (tab === "placements") {
      filename = "campuslink_college_placements.csv";
      const headers = Object.keys(placementsData[0] || {}).join(",");
      const rows = placementsData.map((r) => Object.values(r).join(",")).join("\n");
      content = `${headers}\n${rows}`;
    } else if (tab === "salaries") {
      filename = "campuslink_fresher_salaries.csv";
      const headers = Object.keys(salariesData[0] || {}).join(",");
      const rows = salariesData.map((r) => Object.values(r).join(",")).join("\n");
      content = `${headers}\n${rows}`;
    } else {
      filename = "campuslink_resume_interview.csv";
      const headers = Object.keys(resumesData[0] || {}).join(",");
      const rows = resumesData.map((r) => Object.values(r).join(",")).join("\n");
      content = `${headers}\n${rows}`;
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    placementsData,
    salariesData,
    resumesData,
    placementMetrics,
    salaryMetrics,
    resumeMetrics,
    isLoading,
    lastRefreshed,
    refreshFromSource: loadDatasetsFromCSV,
    exportCurrentDataset,
  };
}
