"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Button } from "@HireBridge/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@HireBridge/ui/components/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 rounded-xl border-slate-200 bg-white/80 text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
            aria-label="Toggle theme: Light, Dark, System"
          />
        }
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 z-50"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Light</span>
          </span>
          {mounted && theme === "light" && (
            <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            <span>Dark</span>
          </span>
          {mounted && theme === "dark" && (
            <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>System</span>
          </span>
          {mounted && theme === "system" && (
            <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
