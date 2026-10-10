"use client";

import { MessageScrollerItem } from "@CampusLink/ui/components/message-scroller";
import {
  Bot,
  Check,
  Copy,
  Loader2,
  User,
} from "lucide-react";
import React from "react";
import { Streamdown } from "streamdown";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  parts?: Array<
    | { type: "text"; text: string }
    | { type: string;[key: string]: any }
  >;
}

interface AIMessageItemProps {
  message: ChatMessage;
  status: string;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  isLast?: boolean;
}

export function AIMessageItem({
  message,
  status,
  copiedId,
  onCopy,
  isLast,
}: AIMessageItemProps) {
  const isUser = message.role === "user";

  // Robustly extract text from all possible message structures (parts, text, delta, content)
  const extractedParts: string[] = [];
  if (Array.isArray(message.parts)) {
    for (const p of message.parts) {
      if (typeof p === "string") {
        extractedParts.push(p);
      } else if (p && typeof p === "object") {
        if ("text" in p && typeof p.text === "string" && p.text) {
          extractedParts.push(p.text);
        } else if ("content" in p && typeof p.content === "string" && p.content) {
          extractedParts.push(p.content);
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
    extractedParts.length > 0
      ? extractedParts.join("\n")
      : rawContent || "";

  return (
    <MessageScrollerItem key={message.id} scrollAnchor={isLast}>
      <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
        {isUser ? (
          /* User Message Pill (Aligned Right) */
          <div className="flex max-w-[85%] sm:max-w-[75%] flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-muted-foreground">
              <span>You</span>
              <div className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xs">
                <User className="size-3" />
              </div>
            </div>
            <div className="rounded-2xl rounded-tr-xs bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm text-white shadow-md shadow-indigo-600/15 leading-relaxed whitespace-pre-wrap">
              <Streamdown>{fullText}</Streamdown>
            </div>
          </div>
        ) : (
          /* Assistant Message Box (FULL CHAT SCREEN WIDTH) */
          <div className="w-full flex flex-col items-start gap-1.5">
            <div className="flex items-center gap-2 px-1 text-xs font-semibold text-foreground">
              <div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xs">
                <Bot className="size-4" />
              </div>
              <span>CampusLink AI</span>
              <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Full-Screen Mode
              </span>
            </div>

            <div className="w-full rounded-2xl rounded-tl-xs border border-border/80 bg-card/90 p-5 sm:p-7 shadow-sm backdrop-blur-xs">
              {!fullText.trim() ? (
                status === "streaming" || status === "submitted" ? (
                  <div className="flex items-center gap-3 py-1 text-sm text-muted-foreground">
                    <Loader2 className="size-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium animate-pulse">
                      Analyzing query...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-1 text-sm text-rose-500">
                    <span>Unable to generate response. Please check your connection and try again.</span>
                  </div>
                )
              ) : (
                <div className="w-full ai-markdown-prose max-w-none break-words leading-relaxed overflow-x-auto">
                  <Streamdown
                    animated={false}
                    isAnimating={
                      status === "streaming" &&
                      message.role === "assistant" &&
                      Boolean(isLast)
                    }
                  >
                    {fullText}
                  </Streamdown>
                </div>
              )}

              {/* Action Footer for Bot Messages */}
              {fullText.trim() && (
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy(message.id, fullText)}
                      className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="size-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Copied to clipboard
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>

                  <span className="text-[10px] text-muted-foreground/70">
                    CampusLink AI Universal Model
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MessageScrollerItem>
  );
}

export function AISubmittedLoader() {
  return (
    <MessageScrollerItem>
      <div className="w-full flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2 px-1 text-xs font-semibold text-foreground">
          <div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xs">
            <Bot className="size-4" />
          </div>
          <span>CampusLink AI</span>
          <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Full-Screen Mode
          </span>
        </div>

        <div className="w-full rounded-2xl rounded-tl-xs border border-border/70 bg-card/90 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-muted-foreground animate-pulse">
              Analyzing query...
            </span>
          </div>
        </div>
      </div>
    </MessageScrollerItem>
  );
}
