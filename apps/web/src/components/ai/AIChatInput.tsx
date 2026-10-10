"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@CampusLink/ui/components/input-group";
import { ArrowUpIcon, Loader2, Sparkles } from "lucide-react";
import React, { type KeyboardEvent } from "react";

import { FOLLOW_UP_SUGGESTIONS } from "./ai-constants";

interface AIChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isSending: boolean;
  messagesCount: number;
  isFullWidth: boolean;
  onSelectPrompt: (prompt: string) => void;
}

export function AIChatInput({
  input,
  setInput,
  onSubmit,
  isSending,
  messagesCount,
  isFullWidth,
  onSelectPrompt,
}: AIChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <footer className="relative z-20 shrink-0 border-t border-border/60 bg-background/85 px-4 pt-2.5 pb-4 backdrop-blur-lg">
      <div
        className={`mx-auto flex w-full flex-col gap-2 transition-all duration-200 ${
          isFullWidth ? "max-w-6xl xl:max-w-7xl 2xl:max-w-[94%]" : "max-w-4xl"
        }`}
      >
        {/* Follow-up suggestions when chat has started */}
        {messagesCount > 0 && !isSending && (
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mr-1">
              Suggestions:
            </span>
            {FOLLOW_UP_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSelectPrompt(suggestion)}
                className="rounded-full border border-border/80 bg-card/80 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-2xs cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Chat Form */}
        <form onSubmit={onSubmit} className="w-full">
          <InputGroup className="relative rounded-2xl border border-border/80 bg-card shadow-sm transition-all focus-within:border-indigo-500/60 focus-within:ring-3 focus-within:ring-indigo-500/15">
            <InputGroupTextarea
              name="prompt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any question across coding, science, mathematics, resume review, or interviews..."
              className="max-h-36 min-h-14 resize-none border-0 bg-transparent px-4 py-3 text-sm focus-visible:ring-0 leading-relaxed"
              rows={1}
              autoComplete="off"
              autoFocus
              disabled={isSending}
            />

            <InputGroupAddon align="block-end" className="p-2">
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                disabled={isSending || !input.trim()}
                className="ml-auto rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs transition hover:brightness-110 active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                {isSending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowUpIcon className="size-4" />
                )}
                <span className="sr-only">Send Message</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>

        {/* Footer Helper Note */}
        <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground/80">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-indigo-500" />
            Full-screen interactive chat workspace.
          </span>
          <span className="hidden sm:inline">
            <kbd className="rounded border border-border/80 bg-muted/60 px-1 py-0.5 text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to send •{" "}
            <kbd className="rounded border border-border/80 bg-muted/60 px-1 py-0.5 text-[10px] font-mono">
              Shift+Enter
            </kbd>{" "}
            for new line
          </span>
        </div>
      </div>
    </footer>
  );
}
