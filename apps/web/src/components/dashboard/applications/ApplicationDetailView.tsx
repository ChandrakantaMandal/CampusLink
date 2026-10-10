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
  Building2,
  FileText,
  ExternalLink,
  Code2,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import {
  getApplicationById,
  patchApplicationStatus,
  type ApplicationDetailRaw,
  type ApplicationStatusValue,
} from "@/lib/api/application.api";

type BasePath = "admin" | "recruiter";

const STATUS_LABEL: Record<ApplicationStatusValue, string> = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  ASSESSMENT: "Assessment",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  SELECTED: "Selected",
  OFFER_EXTENDED: "Offer",
  ACCEPTED: "Joined",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

function statusBadgeClass(label: string): string {
  if (label === "Joined")
    return "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-200 dark:border-teal-800";
  if (label === "Offer")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
  if (label === "Selected")
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
  if (label === "Interview")
    return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
  if (label === "Shortlisted")
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
  if (label === "Rejected" || label === "Withdrawn")
    return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

const RECRUITER_STAGES: { id: ApplicationStatusValue; name: string }[] = [
  { id: "APPLIED", name: "Applied" },
  { id: "UNDER_REVIEW", name: "Under Review" },
  { id: "SHORTLISTED", name: "Shortlisted" },
  { id: "INTERVIEW", name: "Interview" },
  { id: "SELECTED", name: "Selected" },
  { id: "OFFER_EXTENDED", name: "Offer" },
];

function canonicalStage(
  status: ApplicationStatusValue,
): ApplicationStatusValue | null {
  switch (status) {
    case "APPLIED":
      return "APPLIED";
    case "UNDER_REVIEW":
    case "ASSESSMENT":
      return "UNDER_REVIEW";
    case "SHORTLISTED":
      return "SHORTLISTED";
    case "INTERVIEW":
      return "INTERVIEW";
    case "SELECTED":
      return "SELECTED";
    case "OFFER_EXTENDED":
    case "ACCEPTED":
      return "OFFER_EXTENDED";
    default:
      return null;
  }
}

function normalizeScore(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.round(value <= 1 ? value * 100 : value);
}

function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function JsonList({ value }: { value: unknown }) {
  if (value == null) {
    return <span className="text-xs text-slate-400">None recorded</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-xs text-slate-400">None recorded</span>;
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((item, index) => (
          <span
            key={index}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300"
          >
            {typeof item === "object" ? JSON.stringify(item) : String(item)}
          </span>
        ))}
      </div>
    );
  }
  return (
    <span className="text-xs text-slate-600 dark:text-slate-400">
      {String(value)}
    </span>
  );
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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] font-bold text-slate-400 uppercase">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ApplicationDetailView({
  basePath,
}: {
  basePath: BasePath;
}) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const applicationId = params.id;

  const [application, setApplication] = useState<ApplicationDetailRaw | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchApplication = useCallback(async () => {
    try {
      const data = await getApplicationById(applicationId);
      setApplication(data);
      setLoadError(null);
    } catch (err) {
      const status = (err as { status?: number }).status;
      setLoadError(
        status === 404
          ? "Application not found."
          : "Failed to load application details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleMoveStage = async (next: ApplicationStatusValue) => {
    if (!application) return;
    setUpdating(true);
    try {
      await patchApplicationStatus(application.id, next);
      await fetchApplication();
      toast.success("Application Pipeline Advanced", {
        description: `Candidate transitioned to "${STATUS_LABEL[next]}" stage.`,
      });
    } catch {
      toast.error("Failed to update stage", {
        description: "The application status could not be changed.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const backHref =
    basePath === "admin" ? "/admin/applications" : "/recruiter/applications";

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm font-medium text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        Loading application details...
      </div>
    );
  }

  if (loadError || !application) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
          {loadError ?? "Application not found."}
        </p>
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </button>
      </div>
    );
  }

  const student = application.student;
  const job = application.job;
  const company = job.company;
  const match = application.matchResult;
  const statusLabel = STATUS_LABEL[application.status] ?? application.status;
  const stage = canonicalStage(application.status);
  const studentName =
    [student?.firstName, student?.lastName].filter(Boolean).join(" ") ||
    student?.user.name ||
    "Student";
  const resumeHref = application.resumeUrl ?? student?.resumeUrl ?? null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Applications
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {student?.rollNo ? (
              <span className="font-mono">{student.rollNo} &bull; </span>
            ) : null}
            {student?.branch ?? "—"} &bull; Applied on{" "}
            {dateOnly(application.appliedAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center self-start rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(statusLabel)}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-center">
          <span className="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-bold flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Match
          </span>
          <p className="text-lg font-black text-purple-600 dark:text-purple-400">
            {normalizeScore(match?.matchScore)}%
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">
            CGPA
          </span>
          <p className="text-lg font-black text-slate-900 dark:text-white">
            {student?.cgpa ?? "—"}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-center">
          <span className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold">
            Current Stage
          </span>
          <p className="text-lg font-black text-blue-600 dark:text-blue-400">
            {statusLabel}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">
            Backlogs
          </span>
          <p className="text-lg font-black text-slate-900 dark:text-white">
            {student?.backlogs ?? "—"}
          </p>
        </div>
      </div>

      {basePath === "recruiter" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <span className="text-xs font-black text-slate-700 dark:text-slate-300 block">
            Change Pipeline Status:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {RECRUITER_STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={updating || stage === s.id}
                onClick={() => handleMoveStage(s.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer disabled:cursor-default ${
                  stage === s.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
          <Section
            title="AI Match Analysis"
            icon={<Sparkles className="h-3.5 w-3.5 text-purple-500" />}
          >
            {match ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      label: "Overall",
                      value: normalizeScore(match.matchScore),
                    },
                    {
                      label: "Skills",
                      value: normalizeScore(match.skillMatchScore),
                    },
                    {
                      label: "Projects",
                      value: normalizeScore(match.projectScore),
                    },
                    {
                      label: "Experience",
                      value: normalizeScore(match.experienceScore),
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 text-center"
                    >
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">
                        {m.label}
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {m.value}%
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Matched Skills
                  </span>
                  <JsonList value={match.matchedSkills} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Missing Skills
                  </span>
                  <JsonList value={match.missingSkills} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Positive Signals
                  </span>
                  <JsonList value={match.positiveSignals} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Gaps
                  </span>
                  <JsonList value={match.gaps} />
                </div>
                {match.explanation && (
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Explanation
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {match.explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No match result computed for this application.
              </p>
            )}
          </Section>

          <Section
            title="Skills"
            icon={<Code2 className="h-3.5 w-3.5 text-blue-500" />}
          >
            {student && student.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                  >
                    {s.skill.name}
                    <span className="text-slate-400 font-medium">
                      {" "}
                      &bull; {s.level}
                      {s.years != null ? ` • ${s.years}y` : ""}
                    </span>
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
            {student && student.education.length > 0 ? (
              <div className="space-y-3">
                {student.education.map((ed) => (
                  <div
                    key={ed.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {ed.institution}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {[ed.degree, ed.branch].filter(Boolean).join(" — ")}
                      {ed.startYear || ed.endYear
                        ? ` • ${ed.startYear ?? "?"}–${ed.endYear ?? "Present"}`
                        : ""}
                    </p>
                    {(ed.cgpa != null || ed.percentage != null) && (
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {ed.cgpa != null ? `CGPA: ${ed.cgpa}` : null}
                        {ed.cgpa != null && ed.percentage != null
                          ? " • "
                          : null}
                        {ed.percentage != null ? `${ed.percentage}%` : null}
                      </p>
                    )}
                    {ed.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
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
            {student && student.projects.length > 0 ? (
              <div className="space-y-3">
                {student.projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            GitHub <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                          >
                            Live <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    {project.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    {(project.startDate || project.endDate) && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {project.startDate
                          ? dateOnly(project.startDate)
                          : "?"}{" "}
                        —{" "}
                        {project.endDate
                          ? dateOnly(project.endDate)
                          : "Present"}
                      </p>
                    )}
                    {project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.skills.map((ps, index) => (
                          <span
                            key={index}
                            className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300"
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

          <Section
            title="Cover Letter"
            icon={<FileText className="h-3.5 w-3.5 text-slate-500" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {application.coverLetter || "No cover letter provided."}
            </p>
          </Section>
        </div>

        <div className="space-y-4">
          <Section
            title="Job Details"
            icon={<Building2 className="h-3.5 w-3.5 text-indigo-500" />}
          >
            <div className="space-y-3">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {job.title}
                </p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {company.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Location" value={job.location ?? "—"} />
                <Field label="CTC" value={job.ctc ?? "—"} />
                <Field label="Type" value={job.employmentType ?? "—"} />
                <Field label="Work Mode" value={job.workMode ?? "—"} />
                <Field label="Min CGPA" value={job.minCGPA ?? "—"} />
                <Field label="Max Backlogs" value={job.maxBacklogs ?? "—"} />
                <Field label="Degree" value={job.requiredDegree ?? "—"} />
                <Field label="Branch" value={job.requiredBranch ?? "—"} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Description
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>
          </Section>

          <Section
            title="Student Profile"
            icon={<GraduationCap className="h-3.5 w-3.5 text-blue-500" />}
          >
            {student ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {student.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={student.user.image}
                      alt={studentName}
                      className="h-11 w-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {studentName}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 shrink-0" />
                      {student.user.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" value={student.phone ?? "—"} />
                  <Field label="College" value={student.college ?? "—"} />
                  <Field label="Degree" value={student.degree ?? "—"} />
                  <Field label="Branch" value={student.branch ?? "—"} />
                  <Field
                    label="Graduation Year"
                    value={student.graduationYear ?? "—"}
                  />
                  <Field label="Department" value={student.department ?? "—"} />
                  <Field label="Location" value={student.location ?? "—"} />
                  <Field
                    label="Target Role"
                    value={student.targetRole ?? "—"}
                  />
                </div>
                {student.bio && (
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Bio
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {student.bio}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: "LinkedIn", href: student.linkedinUrl },
                    { label: "GitHub", href: student.githubUrl },
                    { label: "Portfolio", href: student.portfolioUrl },
                    { label: "LeetCode", href: student.leetcodeUrl },
                    { label: "HackerRank", href: student.hackerrankUrl },
                  ]
                    .filter((link) => link.href)
                    .map((link) => (
                      <a
                        key={link.label}
                        href={link.href as string}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {link.label} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Student profile unavailable.
              </p>
            )}
          </Section>

          <Section
            title="Resume"
            icon={<FileText className="h-3.5 w-3.5 text-rose-500" />}
          >
            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-3 py-2 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/70 transition-colors"
              >
                View Resume <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p className="text-xs text-slate-400">No resume on file.</p>
            )}
            {student?.resumeText && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Parsed Resume Text
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {student.resumeText}
                </p>
              </div>
            )}
          </Section>

          <Section
            title="Contact"
            icon={<Phone className="h-3.5 w-3.5 text-teal-500" />}
          >
            <div className="space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {student?.user.email}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {student?.phone ?? "Not provided"}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {student?.location ?? "Not provided"}
              </p>
            </div>
          </Section>

          <Section
            title="Recruiter Notes"
            icon={<FileText className="h-3.5 w-3.5 text-slate-500" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {application.notes || "No internal notes yet."}
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
