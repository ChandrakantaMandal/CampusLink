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

interface ResumeSectionProps {
  profile: StudentProfileData;
  onUploadResume: (fileData: { fileName: string; fileSize: string; uploadDate: string }) => void;
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

  const handleFile = (file: File) => {
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    onUploadResume({
      fileName: file.name,
      fileSize: `${sizeInMb} MB`,
      uploadDate: today,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div id="resume-section" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm scroll-mt-24 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resume & CV Document</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your most updated resume in PDF format for company applications.
              </p>
            </div>
          </div>

          {profile.resume && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active Resume
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {profile.resume ? (
          /* Active resume display card */
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 transition-all hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/20">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:base font-bold text-slate-900 dark:text-white break-all">
                    {profile.resume.fileName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{profile.resume.fileSize}</span>
                    <span>•</span>
                    <span>Uploaded on {profile.resume.uploadDate}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified PDF</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-xs transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-xs transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={onDeleteResume}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/80 cursor-pointer"
                  title="Delete resume"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Recruiters download this file during automated shortlisting.</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" onClick={() => setIsPreviewOpen(true)}>
                View full screen
              </span>
            </div>
          </div>
        ) : (
          /* Empty upload zone */
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/30"
                : "border-slate-300 bg-slate-50/40 hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-xs dark:bg-indigo-950/60 dark:text-indigo-400">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Drag &amp; drop your resume here, or{" "}
              <span className="text-[#6366F1] dark:text-indigo-400 underline">browse files</span>
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
