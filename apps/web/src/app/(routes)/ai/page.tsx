"use client";

import { useChat } from "@ai-sdk/react";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@CampusLink/ui/components/message-scroller";
import { DefaultChatTransport } from "ai";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { AIChatInput } from "@/components/ai/AIChatInput";
import { AIEmptyState } from "@/components/ai/AIEmptyState";
import { AIHeader } from "@/components/ai/AIHeader";
import {
  AIMessageItem,
  AISubmittedLoader,
} from "@/components/ai/AIMessageItem";
import { AISidebar } from "@/components/ai/AISidebar";
import type { ChatHistoryItem } from "@/components/ai/ai-constants";
import { ENV } from "../../../env";

const STORAGE_KEY = "campuslink_ai_chat_history";
const SIDEBAR_STORAGE_KEY = "campuslink_ai_sidebar_open";
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  ENV.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:3000";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() =>
    Date.now().toString(),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      console.error("[CampusLink AI Chat] Error:", err);
    },
  });

  const isSending = status === "submitted" || status === "streaming";

  // Auto-scroll down to the end as the answer streams or finishes
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: status === "streaming" ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [messages, status]);

  // Load chat history and sidebar state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setChatHistory(JSON.parse(stored));
      }

      const storedSidebar = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (storedSidebar !== null) {
        setIsSidebarOpen(storedSidebar === "true");
      } else {
        setIsSidebarOpen(window.innerWidth >= 1024);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save current conversation to history (only when not actively streaming)
  useEffect(() => {
    if (messages.length === 0 || isSending) return;

    setChatHistory((prev) => {
      const firstUserMsg = messages.find((m) => m.role === "user");
      let title = "Chat Session";
      if (firstUserMsg?.parts) {
        const textPart = firstUserMsg.parts.find((p) => p.type === "text");
        if (textPart && "text" in textPart && textPart.text) {
          title =
            textPart.text.slice(0, 45).trim() +
            (textPart.text.length > 45 ? "..." : "");
        }
      }

      const existingIndex = prev.findIndex(
        (item) => item.id === currentSessionId,
      );
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        if (
          existing &&
          existing.title === title &&
          existing.messages?.length === messages.length &&
          existing.messages?.[existing.messages.length - 1] ===
            messages[messages.length - 1]
        ) {
          return prev;
        }
      }

      const updatedItem: ChatHistoryItem = {
        id: currentSessionId,
        title,
        timestamp: Date.now(),
        messages,
      };

      const next =
        existingIndex >= 0
          ? prev.map((item, idx) =>
              idx === existingIndex ? updatedItem : item,
            )
          : [updatedItem, ...prev.slice(0, 29)];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}

      return next;
    });
  }, [messages, currentSessionId, isSending]);

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;
    sendMessage({ text });
    setInput("");
  };

  const handleSelectPrompt = (prompt: string) => {
    if (isSending) return;
    sendMessage({ text: prompt });
    setInput("");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetConversation = () => {
    setInput("");
    setMessages([]);
    setCurrentSessionId(Date.now().toString());
  };

  const handleLoadHistory = (item: ChatHistoryItem) => {
    if (item.messages && item.messages.length > 0) {
      setMessages(item.messages);
      setCurrentSessionId(item.id);
    }
  };

  const handleToggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
    } catch {}
  };

  const handleClearHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    // If deleting the currently active chat, clear the main screen view
    if (id === currentSessionId) {
      setMessages([]);
      setInput("");
      setCurrentSessionId(Date.now().toString());
    }

    setChatHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Collapsible Left Sidebar for History & Quick Prompts */}
      <AISidebar
        isOpen={isSidebarOpen}
        onClose={() => handleToggleSidebar(false)}
        onNewChat={handleResetConversation}
        isSending={isSending}
        chatHistory={chatHistory}
        currentSessionId={currentSessionId}
        onSelectPrompt={handleSelectPrompt}
        onLoadHistory={handleLoadHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Main Chat Workspace */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header with full-width toggle and reset */}
        <AIHeader
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => handleToggleSidebar(true)}
          isFullWidth={isFullWidth}
          onToggleFullWidth={() => setIsFullWidth((prev) => !prev)}
          onResetConversation={handleResetConversation}
          canReset={messages.length > 0 && !isSending}
        />

        {/* Messages / Empty State */}
        <main className="relative min-h-0 flex-1 overflow-hidden">
          {messages.length === 0 && !isSending ? (
            <AIEmptyState
              isFullWidth={isFullWidth}
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
              onSelectPrompt={handleSelectPrompt}
            />
          ) : (
            <MessageScrollerProvider>
              <MessageScroller className="size-full">
                <MessageScrollerViewport className="size-full">
                  <MessageScrollerContent
                    aria-busy={isSending}
                    className={`mx-auto flex flex-col gap-5 px-4 py-6 transition-all duration-200 ${
                      isFullWidth
                        ? "max-w-6xl xl:max-w-7xl 2xl:max-w-[94%]"
                        : "max-w-4xl"
                    }`}
                  >
                    {messages.map((message, index) => (
                      <AIMessageItem
                        key={message.id || index}
                        message={message}
                        status={status}
                        copiedId={copiedId}
                        onCopy={handleCopy}
                        isLast={index === messages.length - 1}
                      />
                    ))}

                    {status === "submitted" && <AISubmittedLoader />}

                    <MessageScrollerItem scrollAnchor />
                    <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          )}
        </main>

        {/* Input Bar with quick follow-ups */}
        <AIChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isSending={isSending}
          messagesCount={messages.length}
          isFullWidth={isFullWidth}
          onSelectPrompt={handleSelectPrompt}
        />
      </div>
    </div>
  );
}
