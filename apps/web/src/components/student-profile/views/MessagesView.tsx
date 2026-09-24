"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  Video,
  ExternalLink,
  Building2,
  GraduationCap,
  Sparkles,
  MoreVertical,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
}

interface Thread {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarBg: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  isOnline: boolean;
  meetingLink?: string;
  messages: Message[];
}

export function MessagesView() {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "thread-1",
      name: "Prof. Rajesh Mohapatra",
      role: "Head of Training & Placement (TPO)",
      company: "University Placement Cell",
      avatarBg: "from-blue-600 to-indigo-600",
      unread: 1,
      lastMessage: "Hall ticket uploaded for Google drive on Oct 12. Please verify your slot.",
      lastTime: "10:30 AM",
      isOnline: true,
      messages: [
        {
          id: "m1",
          sender: "them",
          text: "Dear Himanshu, Google campus recruiting team has approved the shortlist for the second technical round.",
          timestamp: "Yesterday, 4:15 PM",
        },
        {
          id: "m2",
          sender: "me",
          text: "Thank you, Sir! Has the test syllabus or system design criteria been published yet?",
          timestamp: "Yesterday, 4:22 PM",
        },
        {
          id: "m3",
          sender: "them",
          text: "Hall ticket uploaded for Google drive on Oct 12. Please verify your slot.",
          timestamp: "Today, 10:30 AM",
        },
      ],
    },
    {
      id: "thread-2",
      name: "Sneha Kapoor",
      role: "University Talent Acquisition Lead",
      company: "Google India",
      avatarBg: "from-rose-500 to-amber-500",
      unread: 2,
      lastMessage: "Looking forward to your Technical Assessment round on Monday.",
      lastTime: "Yesterday",
      isOnline: false,
      meetingLink: "https://meet.google.com/hrc-camp-2026",
      messages: [
        {
          id: "m4",
          sender: "them",
          text: "Hello Himanshu, congratulations on qualifying the online algorithmic screening!",
          timestamp: "Sep 22, 11:00 AM",
        },
        {
          id: "m5",
          sender: "them",
          text: "Looking forward to your Technical Assessment round on Monday.",
          timestamp: "Sep 22, 11:02 AM",
        },
      ],
    },
    {
      id: "thread-3",
      name: "Vikram Sen",
      role: "Early Careers Recruiting Partner",
      company: "Microsoft IDC",
      avatarBg: "from-emerald-500 to-teal-600",
      unread: 0,
      lastMessage: "Your profile has been shared with the Cloud Infrastructure hiring managers.",
      lastTime: "Sep 21",
      isOnline: false,
      messages: [
        {
          id: "m6",
          sender: "them",
          text: "Hi Himanshu, thank you for submitting your student resume profile for the 2026 cohort.",
          timestamp: "Sep 21, 09:15 AM",
        },
        {
          id: "m7",
          sender: "them",
          text: "Your profile has been shared with the Cloud Infrastructure hiring managers.",
          timestamp: "Sep 21, 09:16 AM",
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("thread-1");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: inputText.trim(),
      timestamp: "Just now",
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: newMessage.text,
            lastTime: "Just now",
            messages: [...t.messages, newMessage],
          };
        }
        return t;
      })
    );

    setInputText("");
    toast.success("Message sent");
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    // Mark as read
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t))
    );
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> Direct Communications
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Placement Inbox & Recruiter Messages
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Communicate directly with the University TPO Cell and verified corporate recruiters.
            </p>
          </div>
        </div>
      </div>

      {/* Main Messaging Layout: Split 2-pane view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px] items-stretch">
        {/* Left Pane: Conversations List (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recruiters or TPO..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredThreads.map((t) => {
              const isActive = t.id === activeThreadId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectThread(t.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer ${isActive
                      ? "bg-indigo-50/70 dark:bg-indigo-950/40"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                    >
                      {t.name.charAt(0)}
                    </div>
                    {t.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                    )}
                  </div>

                  {/* Thread snippet */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {t.lastTime}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      {t.company}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                      {t.lastMessage}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {t.unread > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6366F1] text-white shrink-0 mt-1">
                      {t.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Chat Window (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeThread.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
              >
                {activeThread.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {activeThread.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>{activeThread.role}</span> &bull;{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {activeThread.company}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeThread.meetingLink && (
                <a
                  href={activeThread.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join Interview Room
                </a>
              )}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                Placement Cell Verified Channel &bull; End-to-End Encrypted
              </span>
            </div>

            {activeThread.messages.map((m) => {
              const isMe = m.sender === "me";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${isMe
                        ? "bg-[#6366F1] text-white rounded-br-xs shadow-md shadow-indigo-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80"
                      }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chat Composer */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info("Attaching student resume document (PDF)...")}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder="Type your message to recruiter..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                className="p-2.5 rounded-xl bg-[#6366F1] hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
