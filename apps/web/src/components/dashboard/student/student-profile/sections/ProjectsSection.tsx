"use client";

import React, { useState } from "react";
import { Code2, Plus, Trash2 } from "lucide-react";
import type { StudentProject } from "@/data/studentProfile";

export default function ProjectsSection({
  projects,
  onChange,
}: {
  projects: StudentProject[];
  onChange: (projects: StudentProject[]) => void;
}) {
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
  });

  const addProject = () => {
    if (draft.title.trim().length < 2) return;
    onChange([
      ...projects,
      { ...draft, title: draft.title.trim(), id: `project-${Date.now()}` },
    ]);
    setDraft({ title: "", description: "", githubUrl: "", liveUrl: "" });
  };

  return (
    <section
      id="projects-section"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
          <Code2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Projects
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add projects for recruiters to review.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>
              )}
              <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400">
                {[project.githubUrl, project.liveUrl]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Remove ${project.title}`}
              onClick={() =>
                onChange(projects.filter((item) => item.id !== project.id))
              }
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Project name"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <input
          value={draft.githubUrl}
          onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
          placeholder="GitHub URL (optional)"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <input
          value={draft.liveUrl}
          onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })}
          placeholder="Live demo URL (optional)"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <input
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="What did you build?"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <button
        type="button"
        onClick={addProject}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        Add project
      </button>
    </section>
  );
}
