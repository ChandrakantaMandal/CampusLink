"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Maximize2,
  RotateCcw,
  Loader2,
  ChevronDown,
  User,
  Briefcase,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { ENV } from "@/env";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  ENV.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:3000";

export type ChatRole = "student" | "recruiter" | "admin";

interface FloatingChatWidgetProps {
  role?: ChatRole;
}

const ROLE_CONFIG: Record<
  ChatRole,
  {
    title: string;
    subtitle: string;
    badge: string;
    greeting: string;
    description: string;
    tooltipText: string;
    avatarGradient: string;
    prompts: string[];
    contextPrompt: string;
  }
> = {
  student: {
    title: "CampusLink AI",
    subtitle: "Career & Placement Assistant",
    badge: "Student Copilot",
    greeting: "How can I help your career today?",
    description:
      "Ask me about drive eligibility, interview questions, resume review, or how to boost your readiness score.",
    tooltipText: "Chat with AI Career Copilot",
    avatarGradient: "from-indigo-600 via-indigo-500 to-purple-600",
    prompts: [
      "🎯 How can I improve my placement readiness score?",
      "💼 Top technical interview questions for software roles",
      "📄 How should I format my resume for campus drives?",
      "🚀 Which in-demand skills should I learn for 2026 placements?",
    ],
    contextPrompt:
      "You are CampusLink AI, an expert placement and career copilot for university students.",
  },
  recruiter: {
    title: "CampusLink AI",
    subtitle: "Talent Acquisition & Hiring Copilot",
    badge: "Recruiter Copilot",
    greeting: "How can I accelerate your hiring today?",
    description:
      "Ask me to draft job descriptions, suggest candidate screening criteria, or prepare structured technical interview questions.",
    tooltipText: "Chat with AI Hiring Copilot",
    avatarGradient: "from-blue-600 via-indigo-600 to-violet-600",
    prompts: [
      "📝 Draft a compelling Job Description for a SWE Intern",
      "👥 What criteria should I use to shortlist top campus candidates?",
      "💼 Suggest 5 behavioral & technical questions for final rounds",
      "📊 How can we improve our candidate offer-acceptance rate?",
    ],
    contextPrompt:
      "You are CampusLink AI, an expert talent acquisition and campus recruiting copilot for corporate recruiters.",
  },
  admin: {
    title: "CampusLink AI",
    subtitle: "TPO & Campus Placement Copilot",
    badge: "TPO Cell",
    greeting: "How can I assist placement cell operations?",
    description:
      "Ask me about coordinating campus drives, managing recruiter relationships, and student readiness metrics.",
    tooltipText: "Chat with AI Placement Copilot",
    avatarGradient: "from-purple-600 via-indigo-600 to-emerald-600",
    prompts: [
      "📊 How to organize an efficient multi-company placement drive week",
      "🏢 Best practices for maintaining corporate recruiter partnerships",
      "📈 Strategies to increase overall batch placement percentage",
      "📋 Template for student placement eligibility guidelines",
    ],
    contextPrompt:
      "You are CampusLink AI, an expert placement coordinator and TPO copilot.",
  },
};

export default function FloatingChatWidget({
  role = "student",
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAutoScrollEnabledRef = useRef(true);

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${SERVER_URL}/api/ai/chat`,
      }),
    [],
  );

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
    onError: (err) => {
      console.error("FloatingChatWidget error:", err);
    },
  });

  const isSending = status === "submitted" || status === "streaming";

  // Stable auto-scroll: direct scrollTop manipulation avoids CSS smooth-scroll jitter
  useEffect(() => {
    if (!isOpen || !chatContainerRef.current) return;
    if (isAutoScrollEnabledRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleContainerScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    // Pause auto-scroll if user scrolled up to read history
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAutoScrollEnabledRef.current = distanceToBottom < 60;
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isSending) return;

    setInput("");
    try {
      await sendMessage({ text });
    } catch (err) {
      console.error("FloatingChatWidget send error:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <>
      {/* Floating Chat Widget Popup Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`${config.title} ${config.badge}`}
          className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[560px] max-h-[82vh] w-[94vw] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200 transition-all"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-indigo-950/40 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr ${config.avatarGradient} text-white shadow-md shadow-indigo-500/25`}
              >
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {config.title}
                  </h3>
                  <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {config.badge}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {config.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Clear conversation"
                  className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                  aria-label="Reset chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}

              <Link
                href={"/ai" as Route}
                title="Expand to Full Chat Studio"
                className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                aria-label="Open full chat"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                aria-label="Close chat"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            onScroll={handleContainerScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3.5"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-5 px-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-inner mb-3.5">
                  <Sparkles className="h-7 w-7 animate-pulse" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {config.greeting}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed">
                  {config.description}
                </p>

                {/* Quick Prompts */}
                <div className="mt-5 w-full space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left px-1">
                    Quick Suggestions:
                  </p>
                  {config.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-2.5 text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "user";

                const extractedParts: string[] = [];
                if (Array.isArray(message.parts)) {
                  for (const p of message.parts) {
                    if (typeof p === "string") {
                      extractedParts.push(p);
                    } else if (p && typeof p === "object") {
                      if ("text" in p && typeof (p as any).text === "string" && (p as any).text) {
                        extractedParts.push((p as any).text);
                      } else if ("content" in p && typeof (p as any).content === "string" && (p as any).content) {
                        extractedParts.push((p as any).content);
                      } else if ("textDelta" in p && typeof (p as any).textDelta === "string" && (p as any).textDelta) {
                        extractedParts.push((p as any).textDelta);
                      } else if ("delta" in p && typeof (p as any).delta === "string" && (p as any).delta) {
                        extractedParts.push((p as any).delta);
                      }
                    }
                  }
                }

                const rawContent =
                  typeof (message as any).content === "string"
                    ? ((message as any).content as string)
                    : "";

                const fullText =
                  extractedParts.length > 0 ? extractedParts.join("\n") : rawContent || "";

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-white shadow-2xs text-[10px] ${isUser
                        ? "bg-slate-700 dark:bg-slate-600"
                        : `bg-gradient-to-tr ${config.avatarGradient}`
                        }`}
                    >
                      {isUser ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${isUser
                        ? "rounded-tr-xs bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                        : "rounded-tl-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-2xs"
                        }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{fullText}</p>
                      ) : !fullText.trim() ? (
                        error ? (
                          <div className="text-rose-500 text-xs py-1">
                            Failed to generate response. Please try again.
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400 py-1">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                            <span className="text-[11px] font-medium">
                              Analyzing query...
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="ai-markdown-prose max-w-none break-words text-xs">
                          <Streamdown>{fullText}</Streamdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isSending && status === "submitted" && (
              <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                <span className="text-[11px]">AI is generating answer...</span>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-3">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${config.title}...`}
                disabled={isSending}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2.5 pl-4 pr-11 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden transition-all"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isSending}
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer shadow-xs"
                aria-label="Send message"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI Online
              </span>
              <Link
                href={"/ai" as Route}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Full Studio Mode →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (The Chatbot Chat Symbol) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Hint Tooltip (only when closed) */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-900/60 bg-white/95 dark:bg-slate-900/95 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-indigo-400 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span>{config.tooltipText}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close AI Chatbot" : "Open AI Chatbot"}
          className={`relative group flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr ${config.avatarGradient} text-white shadow-xl shadow-indigo-600/35 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white/20 dark:border-white/10 ${isOpen ? "rotate-90 shadow-purple-600/40" : ""
            }`}
        >
          {/* Subtle Outer Glow Wave */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-md group-hover:opacity-60 transition-opacity animate-pulse pointer-events-none" />

          {/* Active Status Indicator */}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            </span>
          )}

          {isOpen ? (
            <X className="relative h-6 w-6 transition-transform duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="h-7 w-7 transition-transform group-hover:scale-110" />
            </div>
          )}
        </button>
      </div>
    </>
  );
}
