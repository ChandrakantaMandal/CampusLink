"use client";

import { Button } from "@CampusLink/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@CampusLink/ui/components/tooltip";
import {
  Bot,
  GraduationCap,
  Maximize2,
  Minimize2,
  PanelLeftOpen,
  RotateCwIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface AIHeaderProps {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  isFullWidth: boolean;
  onToggleFullWidth: () => void;
  onResetConversation: () => void;
  canReset: boolean;
}

export function AIHeader({
  isSidebarOpen,
  onOpenSidebar,
  isFullWidth,
  onToggleFullWidth,
  onResetConversation,
  canReset,
}: AIHeaderProps) {
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSidebar}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Open sidebar"
          >
            <PanelLeftOpen className="size-4.5" />
          </Button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xs">
            <Bot className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
                CampusLink Universal AI
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI Assistant Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Full Width Toggle */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onToggleFullWidth}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {isFullWidth ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isFullWidth ? "Standard View" : "Full Screen"}
                </span>
              </Button>
            }
          />
          <TooltipContent>
            {isFullWidth
              ? "Switch to standard centered width"
              : "Expand answer to full chat screen width"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onResetConversation}
                disabled={!canReset}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCwIcon className="size-3.5" />
                <span className="hidden md:inline">Reset</span>
              </Button>
            }
          />
          <TooltipContent>Reset current conversation</TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border/60" />

        <Link
          href="/student/dashboard"
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border/80 px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-indigo-500/30 hover:bg-muted hover:text-foreground"
        >
          <GraduationCap className="size-3.5 text-indigo-500" />
          <span>Student Hub</span>
        </Link>
      </div>
    </header>
  );
}
