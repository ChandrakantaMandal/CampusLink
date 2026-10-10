"use client";

import { Button } from "@CampusLink/ui/components/button";
import {
  ExternalLink,
  History,
  LayoutDashboard,
  MessageSquare,
  PanelLeftClose,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { ModeToggle } from "@/components/mode-toggle";
import {
  PROMPT_CARDS,
  type ChatHistoryItem,
} from "./ai-constants";

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  isSending: boolean;
  chatHistory: ChatHistoryItem[];
  currentSessionId?: string;
  onSelectPrompt: (prompt: string) => void;
  onLoadHistory: (item: ChatHistoryItem) => void;
  onClearHistory: (e: React.MouseEvent, id: string) => void;
}

export function AISidebar({
  isOpen,
  onClose,
  onNewChat,
  isSending,
  chatHistory,
  currentSessionId,
  onSelectPrompt,
  onLoadHistory,
  onClearHistory,
}: AISidebarProps) {
  return (
    <aside
      className={`relative z-30 flex flex-col border-r border-border/70 bg-card/60 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 ${
        isOpen
          ? "w-72 translate-x-0"
          : "-ml-72 w-72 -translate-x-full md:-ml-72"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition hover:opacity-85"
        >
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="size-4.5" />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-sm tracking-tight text-foreground">
              Campus<span className="text-indigo-600 dark:text-indigo-400">Link</span>
            </span>
            <span className="ml-1.5 rounded-sm bg-indigo-500/10 px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              AI
            </span>
          </div>
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground md:flex"
          onClick={onClose}
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="size-4" />
        </Button>
      </div>

      {/* New Chat Primary CTA */}
      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          disabled={isSending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Quick Universal Copilots & History */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        <div>
          <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Quick Copilots
          </p>
          <div className="space-y-1">
            {PROMPT_CARDS.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPrompt(item.prompt)}
                  className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted/70 hover:text-foreground text-left cursor-pointer"
                >
                  <Icon className="size-3.5 text-indigo-500/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation History */}
        <div>
          <div className="flex items-center justify-between px-2 pb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Recent Topics
            </p>
            {chatHistory.length > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {chatHistory.length}
              </span>
            )}
          </div>

          {chatHistory.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 p-3 text-center text-[11px] text-muted-foreground/80">
              <History className="mx-auto mb-1.5 size-4 opacity-40" />
              Your chat topics will appear here
            </div>
          ) : (
            <div className="space-y-0.5">
              {chatHistory.map((item) => {
                const isActive = item.id === currentSessionId;
                return (
                  <div
                    key={item.id}
                    onClick={() => onLoadHistory(item)}
                    className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/25"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare
                        className={`size-3.5 shrink-0 ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400 opacity-100"
                            : "opacity-60 group-hover:opacity-100 group-hover:text-indigo-500"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => onClearHistory(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-destructive cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border/60 p-3 bg-card/40 space-y-2">
        <Link
          href="/student/dashboard"
          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <LayoutDashboard className="size-3.5 text-indigo-500" />
            <span>Student Hub</span>
          </span>
          <ExternalLink className="size-3 opacity-60" />
        </Link>

        <div className="flex items-center justify-between px-2 pt-1 text-xs">
          <span className="text-[11px] text-muted-foreground">Appearance</span>
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}
