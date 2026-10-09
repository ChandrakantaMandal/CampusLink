"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import BrandLogo from "@/components/brand/BrandLogo";
import { Button } from "@CampusLink/ui/components/button";
import { authClient } from "@/lib/auth-client";

export default function LandingNavbar() {
  const { data: session } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const dashboard: { href: "/admin/dashboard" | "/recruiter/dashboard" | "/student/dashboard"; label: string } = userRole === "ADMIN"
    ? { href: "/admin/dashboard", label: "Admin Dashboard" }
    : userRole === "RECRUITER"
      ? { href: "/recruiter/dashboard", label: "Recruiter Dashboard" }
      : { href: "/student/dashboard", label: "Student Dashboard" };
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
      className={`sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-950/90 ${isScrolled ? "shadow-md shadow-slate-900/5 dark:shadow-black/20" : ""
        }`}
    >
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <BrandLogo size={42} showText subtitle="Placement Platform" priority />
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
          <ModeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/signup">
                <Button variant="outline" className="rounded-xl border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:text-indigo-400">
                  Sign Up
                </Button>
              </Link>
              <Link href={dashboard.href}>
                <Button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/35">
                  <span>{dashboard.label}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signup">
                <Button variant="outline" className="rounded-xl border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:text-indigo-400">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/35">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
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
              {isAuthenticated ? (
                <>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl py-2.5 font-semibold">Sign Up</Button>
                  </Link>
                  <Link href={dashboard.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
                      <span>{dashboard.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl py-2.5 font-semibold">Sign Up</Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
