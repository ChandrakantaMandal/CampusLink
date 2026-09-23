"use client";

import React from "react";
import {
  X,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
} from "lucide-react";
import type { StudentProfileData } from "@/data/studentProfile";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfileData;
}

export default function ResumePreviewModal({
  isOpen,
  onClose,
  profile,
}: ResumePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 dark:bg-slate-900 dark:border-slate-800">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {profile.resume?.fileName || `${profile.name ? profile.name.replace(/\s+/g, "_") : "Student"}_Resume.pdf`}
              </h3>
              <p className="text-[11px] text-slate-400">
                PDF Document • {profile.resume?.fileSize || "1.2 MB"} • Uploaded{" "}
                {profile.resume?.uploadDate || "Recently"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Downloading resume...")}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Document Viewer Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-8">
          <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 sm:p-12 shadow-lg border border-slate-200 text-slate-800 font-sans space-y-6 min-h-[700px]">
            {/* Resume Header */}
            <div className="border-b-2 border-slate-900 pb-5">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {profile.name}
              </h1>
              <p className="text-sm font-bold text-indigo-700 mt-0.5">
                {profile.department} • {profile.year} • CGPA: {profile.cgpa}/10
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {profile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {profile.location}
                </span>
                {profile.github && (
                  <span className="flex items-center gap-1 text-indigo-600">
                    <Globe className="h-3.5 w-3.5" />
                    {profile.github.replace("https://", "")}
                  </span>
                )}
              </div>
            </div>

            {/* Resume Summary */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Executive Summary
              </h2>
              <p className="text-xs leading-relaxed text-slate-700">
                {profile.bio}
              </p>
            </div>

            {/* Resume Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
                Education
              </h2>
              {profile.education.map((edu) => (
                <div key={edu.id} className="mb-3 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree}</span>
                    <span className="text-slate-500">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 font-medium mt-0.5">
                    <span>{edu.institution}</span>
                    <span className="text-indigo-700 font-bold">CGPA: {edu.cgpa}</span>
                  </div>
                  {edu.description && (
                    <p className="text-[11px] text-slate-600 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Resume Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Technical Expertise
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Certifications */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Certifications & Internships
              </h2>
              {profile.certifications.map((cert) => (
                <div key={cert.id} className="mb-2 text-xs flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900">{cert.name}</span>
                    <span className="text-slate-500"> — {cert.issuingOrg}</span>
                    {cert.credentialId && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        Credential ID: {cert.credentialId}
                      </div>
                    )}
                  </div>
                  <span className="text-slate-500 text-[11px]">{cert.issueDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
