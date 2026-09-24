"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/verify-email") ||
    pathname?.startsWith("/reset-password")
  ) {
    return null;
  }

  const links = [
    { to: "/" as Route, label: "Home" },
    { to: "/profile" as Route, label: "Student Profile" },
    { to: "/dashboard" as Route, label: "Dashboard" },
    { to: "/ai" as Route, label: "AI Chat" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
