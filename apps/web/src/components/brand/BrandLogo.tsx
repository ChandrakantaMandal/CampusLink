"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  subtitle?: string;
  priority?: boolean;
}

export default function BrandLogo({
  className = "",
  size = 42,
  showText = false,
  subtitle,
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo-light.png"
          alt="CampusLink"
          width={size}
          height={Math.round((size * 415) / 525)}
          className="dark:hidden object-contain"
          priority={priority}
        />
        <Image
          src="/brand/logo-dark.png"
          alt="CampusLink"
          width={size}
          height={Math.round((size * 415) / 525)}
          className="hidden dark:block object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]"
          priority={priority}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            CAMPUS<span className="text-indigo-600 dark:text-indigo-400">LINK</span>
          </span>
          {subtitle && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
