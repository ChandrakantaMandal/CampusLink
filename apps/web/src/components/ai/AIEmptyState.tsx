"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import React from "react";

import { FILTER_TABS, PROMPT_CARDS } from "./ai-constants";

interface AIEmptyStateProps {
  isFullWidth: boolean;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onSelectPrompt: (prompt: string) => void;
}

export function AIEmptyState({
  isFullWidth,
  selectedFilter,
  onSelectFilter,
  onSelectPrompt,
}: AIEmptyStateProps) {
  const filteredCards =
    selectedFilter === "all"
      ? PROMPT_CARDS
      : PROMPT_CARDS.filter((c) => c.category === selectedFilter);

  return (
    <div className="size-full overflow-y-auto">
      <div
        className={`mx-auto flex min-h-full flex-col items-center justify-center px-4 py-8 sm:py-12 transition-all duration-200 ${
          isFullWidth ? "max-w-6xl xl:max-w-7xl 2xl:max-w-[94%]" : "max-w-4xl"
        }`}
      >
        {/* Hero Greeting */}
        <div className="mb-6 text-center max-w-3xl">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-xs backdrop-blur-xs">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>Universal Intelligence & Placement Copilot</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ask Anything.{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
              Full-Screen Answers.
            </span>
          </h1>

          <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
            Ask about Python, React, algorithms, quantum physics, math, or dive
            deep into resume ATS reviews and campus placement interviews.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mb-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-1.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectFilter(tab.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                  : "border border-border/80 bg-card/60 text-muted-foreground hover:border-indigo-500/40 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Prompt Cards Grid */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectPrompt(card.prompt)}
                className={`group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/70 p-4 text-left backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] cursor-pointer ${card.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-muted/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:scale-105 transition-all">
                      <Icon className="size-4.5" />
                    </div>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] font-medium text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  <span>Try this prompt</span>
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
