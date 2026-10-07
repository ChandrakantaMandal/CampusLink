"use client";

import React, { useRef, useState } from "react";
import {
  FileText,
  UploadCloud,
  Eye,
  RefreshCw,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import type { StudentProfileData } from "@/data/studentProfile";
import ResumePreviewModal from "./ResumePreviewModal";

const AI_SERVICE_URL = "http://127.0.0.1:8000";
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

interface ResumeSectionProps {
  profile: StudentProfileData;
  onUploadResume: (fileData: {
    fileName: string;
    fileSize: string;
    uploadDate: string;
  }) => void;
  onDeleteResume: () => void;
}

export default function ResumeSection({
  profile,
  onUploadResume,
  onDeleteResume,
}: ResumeSectionProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState("");

  const handleFile = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setAnalysisError("Only PDF files are supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAnalysisError("Resume must be smaller than 5MB.");
      return;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);

    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    try {
      setIsAnalyzing(true);
      setAnalysis(null);
      setAnalysisError("");

      /*
       * STEP 1
       * Send PDF to AI service.
       */
      onUploadResume({
  fileName: file.name,
  fileSize: `${sizeInMb} MB`,
  uploadDate: today,
});
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${AI_SERVICE_URL}/resume/analyze`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Resume analysis failed.");
      }

      const result = await response.json();

      /*
       * STEP 2
       * Show AI analysis in UI.
       */
      setAnalysis(result);

      /*
       * STEP 3
       * Convert AI analysis into searchable resume text.
       *
       * This is stored in StudentProfile.resumeText.
       * The readiness service can then use the updated resume.
       */
      const resumeText = [
        "Resume Analysis",

        "Skills:",
        ...(Array.isArray(result.skills)
          ? result.skills
          : []),

        "Projects:",
        ...(Array.isArray(result.projects)
          ? result.projects
          : []),

        "Education:",
        ...(Array.isArray(result.education)
          ? result.education
          : result.education
            ? [result.education]
            : []),

        "Certifications:",
        ...(Array.isArray(result.certifications)
          ? result.certifications
          : []),

        "Strengths:",
        ...(Array.isArray(result.strengths)
          ? result.strengths
          : []),

        "Weaknesses:",
        ...(Array.isArray(result.weaknesses)
          ? result.weaknesses
          : []),

        "Recommendations:",
        ...(Array.isArray(result.recommendations)
          ? result.recommendations
          : []),
      ]
        .filter(Boolean)
        .join("\n");

      /*
       * STEP 4
       * Save parsed resume information to backend.
       */
      const saveResponse = await fetch(
        `${SERVER_URL}/api/students/me`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText,
          }),
        },
      );

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();

        throw new Error(
          errorText || "Failed to save resume information.",
        );
      }

      /*
       * STEP 5
       * Update local profile UI.
       */
      onUploadResume({
        fileName: file.name,
        fileSize: `${sizeInMb} MB`,
        uploadDate: today,
      });
    } catch (error) {
      console.error("Resume upload/analysis failed:", error);

      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Please enter a valid resume or CV.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      e.type === "dragenter" ||
      e.type === "dragover"
    ) {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0]
    ) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div
        id="resume-section"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm scroll-mt-24 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
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
                Upload your most updated resume in PDF format
                for company applications.
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

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {profile.resume ? (
          <>
            {/* Active resume */}
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
                      <span>
                        Uploaded on {profile.resume.uploadDate}
                      </span>
                      <span>•</span>

                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Verified PDF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() =>
                      setIsPreviewOpen(true)
                    }
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 sm:text-sm"
                  >
                    <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 sm:text-sm"
                  >
                    <RefreshCw className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={onDeleteResume}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/80 sm:text-sm"
                    title="Delete resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>
                  Recruiters download this file during automated
                  shortlisting.
                </span>

                <span
                  className="cursor-pointer font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  onClick={() =>
                    setIsPreviewOpen(true)
                  }
                >
                  View full screen
                </span>
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
                      Extracting skills, projects and career
                      insights.
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
                    AI-generated insights from your uploaded
                    resume.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Skills */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-emerald-600">
                      Skills
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {analysis.skills?.map(
                        (skill: string) => (
                          <span
                            key={skill}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-indigo-600">
                      Projects
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.projects?.map(
                        (project: string) => (
                          <li key={project}>
                            • {project}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Education */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-blue-600">
                      Education
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {Array.isArray(analysis.education) ? (
                        analysis.education.map(
                          (item: string) => (
                            <li key={item}>
                              • {item}
                            </li>
                          ),
                        )
                      ) : (
                        <li>
                          • {analysis.education}
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-violet-600">
                      Certifications
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.certifications?.map(
                        (item: string) => (
                          <li key={item}>
                            • {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-emerald-600">
                      Strengths
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.strengths?.map(
                        (item: string) => (
                          <li key={item}>
                            ✓ {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-amber-600">
                      Weaknesses
                    </h4>

                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      {analysis.weaknesses?.map(
                        (item: string) => (
                          <li key={item}>
                            • {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <h4 className="mb-2 text-sm font-bold text-violet-600">
                    Recommendations
                  </h4>

                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {analysis.recommendations?.map(
                      (item: string) => (
                        <li key={item}>
                          → {item}
                        </li>
                      ),
                    )}
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
                      Resume Upload Failed
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
            onClick={() =>
              fileInputRef.current?.click()
            }
            className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              dragActive
                ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/30"
                : "border-slate-300 bg-slate-50/40 hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
            }`}
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400">
              <UploadCloud className="h-7 w-7" />
            </div>

            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Drag &amp; drop your resume here, or{" "}
              <span className="text-[#6366F1] underline dark:text-indigo-400">
                browse files
              </span>
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