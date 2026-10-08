"use client";

import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Loader2,
  UploadCloud,
  Eye,
  RefreshCw,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import type { StudentProfileData } from "@/data/studentProfile";
import { uploadStudentResume } from "@/lib/api/student.api";
import ResumePreviewModal from "./ResumePreviewModal";

const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://127.0.0.1:8000";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ResumeAnalysis {
  skills?: string[];
  projects?: string[];
  education?: string | string[];
  certifications?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

interface ResumeSectionProps {
  profile: StudentProfileData;

  onUploadResume: (fileData: {
    fileName: string;
    fileSize: string;
    uploadDate: string;
    url?: string;
  }) => void;

  onDeleteResume: () => void;
}

/**
 * Rebuild the analysis object from the persisted resume text.
 *
 * The server only stores the flat string produced by buildResumeText, so we
 * reverse that exact format. Anything else (free-form text, partial writes)
 * is rejected so we never render a half-parsed analysis.
 */
function parseResumeText(
  text: string | null | undefined,
): ResumeAnalysis | null {
  if (!text) return null;

  const lines = text.split("\n");

  if (lines[0]?.trim() !== "Resume Analysis") return null;

  const headers = new Set([
    "Skills",
    "Projects",
    "Education",
    "Certifications",
    "Strengths",
    "Weaknesses",
    "Recommendations",
  ]);

  const sections: Record<string, string[]> = {};
  let current: string | null = null;

  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (!line) continue;

    const header = line.replace(/:$/, "");
    if (headers.has(header)) {
      current = header;
      sections[header] = [];
      continue;
    }

    if (current) sections[current].push(line);
  }

  if (!sections.Skills?.length) return null;

  return {
    skills: sections.Skills,
    projects: sections.Projects ?? [],
    education: sections.Education ?? [],
    certifications: sections.Certifications ?? [],
    strengths: sections.Strengths ?? [],
    weaknesses: sections.Weaknesses ?? [],
    recommendations: sections.Recommendations ?? [],
  };
}

export default function ResumeSection({
  profile,
  onUploadResume,
  onDeleteResume,
}: ResumeSectionProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // `undefined` = no local override (fall back to the analysis persisted in
  // profile.resumeText), `null` = explicitly cleared (e.g. a new upload), and
  // an object = the analysis produced by the most recent successful run.
  const [userAnalysis, setUserAnalysis] = useState<
    ResumeAnalysis | null | undefined
  >(undefined);
  const [analysisError, setAnalysisError] = useState("");

  const parsedFromProfile = useMemo(
    () => parseResumeText(profile.resumeText),
    [profile.resumeText],
  );

  const analysis =
    userAnalysis === undefined ? parsedFromProfile : userAnalysis;

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validate the selected resume.
   */
  const validateFile = (file: File): boolean => {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Invalid file type", {
        description: "Please upload your resume as a PDF document.",
      });

      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: "Maximum resume size is 5MB.",
      });

      return false;
    }

    return true;
  };

  /**
   * Convert the AI response into searchable resume text.
   */
  const buildResumeText = (result: ResumeAnalysis): string => {
    const education = Array.isArray(result.education)
      ? result.education
      : result.education
        ? [result.education]
        : [];

    return [
      "Resume Analysis",

      "Skills:",
      ...(Array.isArray(result.skills) ? result.skills : []),

      "Projects:",
      ...(Array.isArray(result.projects) ? result.projects : []),

      "Education:",
      ...education,

      "Certifications:",
      ...(Array.isArray(result.certifications) ? result.certifications : []),

      "Strengths:",
      ...(Array.isArray(result.strengths) ? result.strengths : []),

      "Weaknesses:",
      ...(Array.isArray(result.weaknesses) ? result.weaknesses : []),

      "Recommendations:",
      ...(Array.isArray(result.recommendations) ? result.recommendations : []),
    ]
      .filter(Boolean)
      .join("\n");
  };


  /**
   * Upload resume and then analyze it with the AI service.
   */
  const handleFile = async (file: File) => {
    if (!file || isUploading || isAnalyzing) {
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);

    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setIsUploading(true);
    setAnalysisError("");
    setUserAnalysis(null);

    try {
      /*
       * STEP 1
       * Upload the actual PDF to the backend/storage.
       */
      const url = await uploadStudentResume(file);

      /*
       * Update the parent/profile only after
       * the actual upload succeeds.
       */
      onUploadResume({
        fileName: file.name,
        fileSize: `${sizeInMb} MB`,
        uploadDate: today,
        url,
      });

      toast.success("Resume uploaded successfully");

      /*
       * STEP 2
       * Send the same PDF to the AI service.
       */
      setIsAnalyzing(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${AI_SERVICE_URL}/resume/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = errorText || "Resume analysis failed.";

        try {
          const parsed = JSON.parse(errorText) as { detail?: string };
          if (parsed.detail) message = parsed.detail;
        } catch {
          // Not JSON — fall back to the raw response text.
        }

        throw new Error(message);
      }

      const result: ResumeAnalysis = await response.json();

      /*
       * STEP 3
       * Display the AI analysis.
       */
      setUserAnalysis(result);

      /*
       * STEP 4
       * Convert AI analysis into searchable text.
       */
      const resumeText = buildResumeText(result);

      /*
       * STEP 5
       * Save extracted resume information
       * to the student's profile.
       */
      const saveResponse = await fetch(`${SERVER_URL}/api/students/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
        }),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();

        throw new Error(errorText || "Failed to save resume information.");
      }

      toast.success("Resume analyzed successfully");
    } catch (error) {
      console.error("Resume upload/analysis failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to upload or analyze your resume.";

      setAnalysisError(message);

      toast.error("Resume processing failed", {
        description: message,
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  /**
   * Handle normal file selection.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    /*
     * Reset the input so selecting the same file again
     * triggers onChange.
     */
    e.target.value = "";

    if (file) {
      void handleFile(file);
    }
  };

  /**
   * Handle drag events.
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handle dropped files.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (isUploading || isAnalyzing) {
      return;
    }

    const file = e.dataTransfer.files?.[0];

    if (file) {
      void handleFile(file);
    }
  };

  return (
    <>
      <div
        id="resume-section"
        className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 font-bold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Resume & CV Document
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your most updated resume in PDF format for company
                applications.
              </p>
            </div>
          </div>

          {profile.resume && (
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-400 sm:inline-flex">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active Resume
            </span>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || isAnalyzing}
        />

        {profile.resume ? (
          <>
            {/* Active Resume */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20">
                    <FileText className="h-7 w-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="break-all text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                      {profile.resume.fileName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{profile.resume.fileSize}</span>

                      <span>•</span>

                      <span>Uploaded on {profile.resume.uploadDate}</span>

                      <span>•</span>

                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Verified PDF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  {/* Preview */}
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 sm:text-sm"
                  >
                    <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Preview</span>
                  </button>

                  {/* Replace */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isAnalyzing}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-wait disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 sm:text-sm"
                  >
                    {isUploading || isAnalyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    )}

                    <span>
                      {isUploading
                        ? "Uploading..."
                        : isAnalyzing
                          ? "Analyzing..."
                          : "Replace"}
                    </span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={onDeleteResume}
                    disabled={isUploading || isAnalyzing}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/80 sm:text-sm"
                    title="Delete resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Resume footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>
                  Recruiters download this file during automated shortlisting.
                </span>

                <button
                  type="button"
                  className="cursor-pointer font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  View full screen
                </button>
              </div>
            </div>

            {/* AI Analysis Loading */}
            {isAnalyzing && (
              <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />

                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      AI is analyzing your resume...
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Extracting skills, projects and career insights.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {analysis && !isAnalyzing && (
              <div className="mt-6 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900/60 dark:bg-slate-900">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    AI Resume Analysis
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI-generated insights from your uploaded resume.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Skills */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-emerald-600">
                      Skills
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {analysis.skills?.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-indigo-600">
                      Projects
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.projects?.map((project, index) => (
                        <li key={`${project}-${index}`}>• {project}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-blue-600">
                      Education
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {Array.isArray(analysis.education) ? (
                        analysis.education.map((item, index) => (
                          <li key={`${item}-${index}`}>• {item}</li>
                        ))
                      ) : analysis.education ? (
                        <li>• {analysis.education}</li>
                      ) : null}
                    </ul>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-violet-600">
                      Certifications
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.certifications?.map((item, index) => (
                        <li key={`${item}-${index}`}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-emerald-600">
                      Strengths
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.strengths?.map((item, index) => (
                        <li key={`${item}-${index}`}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-amber-600">
                      Weaknesses
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.weaknesses?.map((item, index) => (
                        <li key={`${item}-${index}`}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <h4 className="mb-2 text-sm font-bold text-violet-600">
                    Recommendations
                  </h4>

                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {analysis.recommendations?.map((item, index) => (
                      <li key={`${item}-${index}`}>→ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Error */}
            {analysisError && !isAnalyzing && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/60 dark:bg-rose-950/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
                      Resume Processing Failed
                    </p>

                    <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                      {analysisError}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty upload zone */
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => {
              if (!isUploading && !isAnalyzing) {
                fileInputRef.current?.click();
              }
            }}
            className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              isUploading || isAnalyzing
                ? "cursor-wait border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30"
                : dragActive
                  ? "cursor-pointer border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/30"
                  : "cursor-pointer border-slate-300 bg-slate-50/40 hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
            }`}
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400">
              {isUploading || isAnalyzing ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <UploadCloud className="h-7 w-7" />
              )}
            </div>

            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isUploading ? (
                "Uploading your resume..."
              ) : isAnalyzing ? (
                "Analyzing your resume..."
              ) : (
                <>
                  Drag &amp; drop your resume here, or{" "}
                  <span className="text-[#6366F1] underline dark:text-indigo-400">
                    browse files
                  </span>
                </>
              )}
            </p>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              PDF format preferred • Maximum file size 5MB
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <ResumePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        profile={profile}
      />
    </>
  );
}
