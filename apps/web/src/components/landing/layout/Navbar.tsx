"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  GraduationCap,
  Building2,
  Users,
  Compass,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";
import { Button } from "@CampusLink/ui/components/button";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Readiness Index", href: "#readiness" },
    { label: "For Campuses", href: "#roles" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-950/90 ${
        isScrolled ? "shadow-md shadow-slate-900/5 dark:shadow-black/20" : ""
      }`}
    >
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              CAMPUSLINK
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Placement Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login?role=recruiter"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 border border-slate-200/80 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs hover:shadow-xs transition-all"
          >
            <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
            <span>Recruiter / TPO</span>
          </Link>
          <ModeToggle />
          <UserMenu />
          <Link href="/student/profile">
            <Button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/35">
              <span>Student Profile</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 px-4 pt-2 pb-6 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <Link
                href="/login?role=recruiter"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 py-2.5 text-center text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-1.5"
              >
                <Briefcase className="h-4 w-4" />
                <span>Recruiter / TPO Portal Login 🔐</span>
              </Link>
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-slate-500">Account</span>
                <UserMenu />
              </div>
              <Link
                href="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
                  <span>Open Student Profile</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
