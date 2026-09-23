"use client";

import React, { useState } from "react";
import { Code, Plus, X, Sparkles, AlertCircle } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  onAddSkill: (skill: string) => boolean;
  onRemoveSkill: (skill: string) => void;
}

export default function SkillsSection({
  skills,
  onAddSkill,
  onRemoveSkill,
}: SkillsSectionProps) {
  const [newSkillInput, setNewSkillInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const suggestedSkills = [
    "TypeScript",
    "Docker",
    "Node.js",
    "Next.js",
    "Tailwind CSS",
    "C++",
    "AWS",
    "Machine Learning",
    "PostgreSQL",
    "Linux",
  ];

  const handleAdd = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) {
      setErrorMessage("Skill name cannot be empty.");
      return;
    }

    const success = onAddSkill(trimmed);
    if (success) {
      setNewSkillInput("");
      setErrorMessage("");
    } else {
      setErrorMessage(`"${trimmed}" is already added to your skills.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleQuickAdd = (skill: string) => {
    const success = onAddSkill(skill);
    if (!success) {
      setErrorMessage(`"${skill}" is already added.`);
    } else {
      setErrorMessage("");
    }
  };

  return (
    <div id="skills-section" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm scroll-mt-24 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold border border-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900/50">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skills & Technical Expertise</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showcase technical languages, frameworks, and tools relevant to recruitment drives.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80">
          {skills.length} skills listed
        </span>
      </div>

      {/* Input area */}
      <div className="mt-6 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => {
                setNewSkillInput(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill and press Enter (e.g. Docker, TypeScript)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#6366F1] focus:outline-hidden focus:ring-3 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-xl bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4F46E5] transition-colors focus:outline-hidden cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
        </div>

        {errorMessage && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium animate-in fade-in duration-150">
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMessage}
          </p>
        )}
      </div>

      {/* Active Skills Pills */}
      <div className="mt-5">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">Active Skills:</div>
        {skills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400 dark:text-slate-500">
            No skills added yet. Add your core competencies above to attract matching recruiters.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-900 border border-indigo-200/70 shadow-xs hover:border-indigo-400 transition-all dark:from-indigo-950/60 dark:to-purple-950/60 dark:text-indigo-200 dark:border-indigo-800/80"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="rounded-full p-0.5 text-indigo-400 hover:bg-rose-100 hover:text-rose-600 transition-colors focus:outline-hidden dark:hover:bg-rose-950/50 dark:hover:text-rose-400 cursor-pointer"
                  title={`Remove ${skill}`}
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Quick Add Popular Skills:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedSkills
            .filter((s) => !skills.includes(s))
            .slice(0, 7)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleQuickAdd(s)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent transition-all dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 dark:hover:border-indigo-800 cursor-pointer"
              >
                + {s}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
