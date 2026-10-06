"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  ExternalLink,
  Code2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { getStudentById, type StudentProfile } from "@/lib/api/student.api";

type BasePath = "admin" | "recruiter";

interface StudentSkillRow {
  id: string;
  level?: string | null;
  years?: number | null;
  skill: { id: string; name: string };
}

interface StudentEducationRow {
  id: string;
  institution: string;
  degree?: string | null;
  branch?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  cgpa?: number | null;
  percentage?: number | null;
  description?: string | null;
}

interface StudentProjectRow {
  id: string;
  title: string;
  description?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  skills: { skill: { id: string; name: string } }[];
}

function normalizeScore(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.round(value <= 1 ? value * 100 : value);
}

function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
        {label}
      </span>
      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium break-words">
        {value}
      </p>
    </div>
  );
}

export default function StudentDetailView({ basePath }: { basePath: BasePath }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const studentId = params.id;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    try {
      const data = await getStudentById(studentId);
      setStudent(data);
      setLoadError(null);
    } catch (err) {
      const status = (err as { status?: number }).status;
      setLoadError(
        status === 404
          ? "Student not found."
          : "Failed to load student details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const backHref =
    basePath === "admin" ? "/admin/students" : "/recruiter/candidates";
  const backLabel =
    basePath === "admin" ? "Back to Students" : "Back to Candidates";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading student details...
        </p>
      </div>
    );
  }

  if (loadError || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
          {loadError ?? "Student not found."}
        </p>
        <button
          onClick={() => router.push(backHref)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </button>
      </div>
    );
  }

  const studentName =
    [student.firstName, student.lastName].filter(Boolean).join(" ") ||
    student.user?.name ||
    "Student";
  const skills = (student.skills as StudentSkillRow[] | undefined) ?? [];
  const education = (student.education as StudentEducationRow[] | undefined) ?? [];
  const projects = (student.projects as StudentProjectRow[] | undefined) ?? [];
  const links = [
    { label: "LinkedIn", href: student.linkedinUrl },
    { label: "GitHub", href: student.githubUrl },
    { label: "Portfolio", href: student.portfolioUrl },
    { label: "LeetCode", href: student.leetcodeUrl },
    { label: "HackerRank", href: student.hackerrankUrl },
    { label: "Website", href: student.otherWebsiteUrl },
  ].filter((link): link is { label: string; href: string } => !!link.href);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1.5">
          <button
            onClick={() => router.push(backHref)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {student.rollNo ? (
              <>
                <span className="font-mono">{student.rollNo}</span> &bull;{" "}
              </>
            ) : null}
            {student.branch ?? "—"} &bull; {student.college ?? "—"}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold border ${
            student.isVerified
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {student.isVerified ? "Verified" : "Unverified"}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 text-center">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            Readiness
          </span>
          <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-1">
            {student.readinessScore == null
              ? "—"
              : `${normalizeScore(student.readinessScore)}%`}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            CGPA
          </span>
          <p className="text-lg font-black text-slate-700 dark:text-slate-200 mt-1">
            {student.cgpa ?? "—"}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Backlogs
          </span>
          <p className="text-lg font-black text-slate-700 dark:text-slate-200 mt-1">
            {student.backlogs}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            Graduation Year
          </span>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {student.graduationYear ?? "—"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
          <Section
            title="About"
            icon={<FileText className="h-3.5 w-3.5 text-slate-500" />}
          >
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {student.bio || "No bio provided."}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="College" value={student.college ?? "—"} />
                <Field label="Degree" value={student.degree ?? "—"} />
                <Field label="Branch" value={student.branch ?? "—"} />
                <Field label="Department" value={student.department ?? "—"} />
                <Field label="Target Role" value={student.targetRole ?? "—"} />
                <Field label="Gender" value={student.gender ?? "—"} />
              </div>
            </div>
          </Section>

          <Section
            title="Skills"
            icon={<Code2 className="h-3.5 w-3.5 text-blue-500" />}
          >
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60 px-2 py-1 text-[11px] font-bold"
                  >
                    {s.skill.name}
                    {(s.level || s.years != null) && (
                      <span className="text-blue-400 dark:text-blue-500 font-medium">
                        &bull;
                        {s.level ? ` ${s.level}` : ""}
                        {s.years != null ? ` • ${s.years}y` : ""}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No skills recorded.</p>
            )}
          </Section>

          <Section
            title="Education"
            icon={<GraduationCap className="h-3.5 w-3.5 text-emerald-500" />}
          >
            {education.length > 0 ? (
              <div className="space-y-3">
                {education.map((ed) => (
                  <div
                    key={ed.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {ed.institution}
                      </p>
                      {ed.cgpa != null && (
                        <span className="shrink-0 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                          CGPA {ed.cgpa}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {ed.degree && (
                        <span>
                          {ed.degree}
                          {ed.branch ? ` — ${ed.branch}` : ""}
                        </span>
                      )}
                      {(ed.startYear || ed.endYear) && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {ed.startYear ?? "?"} – {ed.endYear ?? "?"}
                        </span>
                      )}
                    </div>
                    {ed.percentage != null && ed.cgpa == null && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {ed.percentage}%
                      </p>
                    )}
                    {ed.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 whitespace-pre-wrap">
                        {ed.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No education records.</p>
            )}
          </Section>

          <Section
            title="Projects"
            icon={<Code2 className="h-3.5 w-3.5 text-amber-500" />}
          >
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="GitHub repository"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="Live demo"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {project.description}
                      </p>
                    )}
                    {project.startDate && (
                      <p className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <CalendarDays className="h-3 w-3" />
                        {dateOnly(project.startDate)}
                        {project.endDate ? ` — ${dateOnly(project.endDate)}` : ""}
                      </p>
                    )}
                    {project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map((ps) => (
                          <span
                            key={ps.skill.id}
                            className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                          >
                            {ps.skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No projects recorded.</p>
            )}
          </Section>
        </div>

        <div className="space-y-4">
          <Section
            title="Contact"
            icon={<Phone className="h-3.5 w-3.5 text-teal-500" />}
          >
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  {student.user?.email ?? "Not provided"}
                </span>
              </p>
              <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                {student.phone ?? "Not provided"}
              </p>
              <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                {student.location ?? "Not provided"}
              </p>
            </div>
          </Section>

          <Section
            title="Links"
            icon={
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
            }
          >
            {links.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No links provided.</p>
            )}
          </Section>

          <Section
            title="Resume"
            icon={<FileText className="h-3.5 w-3.5 text-rose-500" />}
          >
            <div className="space-y-3">
              {student.resumeUrl ? (
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 text-xs font-bold transition-colors"
                >
                  View Resume
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <p className="text-xs text-slate-400">No resume on file.</p>
              )}
              {student.resumeText && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Parsed Resume Text
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {student.resumeText}
                  </p>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
