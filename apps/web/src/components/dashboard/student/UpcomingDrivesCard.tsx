"use client";

import React, { useState, useRef } from "react";
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Ticket,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { UpcomingDrive } from "@/data/dashboardData";
import { toast } from "sonner";

interface UpcomingDrivesCardProps {
  drives: UpcomingDrive[];
  layout?: "slidebar" | "grid" | "stack";
  onViewAll?: () => void;
}

export function UpcomingDrivesCard({
  drives: initialDrives,
  layout = "slidebar",
  onViewAll,
}: UpcomingDrivesCardProps) {
  const [drives, setDrives] = useState<UpcomingDrive[]>(initialDrives);
  const [activeSlide, setActiveSlide] = useState(0);
  const [registeredIds, setRegisteredIds] = useState<Record<string, boolean>>({
    "drive-1": true,
  });

  const sliderRef = useRef<HTMLDivElement>(null);

  const getSlideStep = () => {
    if (!sliderRef.current) return 380;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement | null;
    return firstCard ? firstCard.offsetWidth + 16 : 380;
  };

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const step = getSlideStep();
      sliderRef.current.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
      setActiveSlide((prev) =>
        direction === "left" ? Math.max(0, prev - 1) : Math.min(drives.length - 1, prev + 1)
      );
    }
  };

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const step = getSlideStep();
      sliderRef.current.scrollTo({
        left: index * step,
        behavior: "smooth",
      });
      setActiveSlide(index);
    }
  };

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const step = getSlideStep();
      const newActive = Math.round(sliderRef.current.scrollLeft / step);
      if (newActive !== activeSlide && newActive >= 0 && newActive < drives.length) {
        setActiveSlide(newActive);
      }
    }
  };

  const handleRegister = (drive: UpcomingDrive) => {
    setRegisteredIds((prev) => ({ ...prev, [drive.id]: true }));
    toast.success(`Successfully registered for ${drive.company} drive!`, {
      description: `Hall ticket generated for ${drive.role}. Check email for instructions.`,
    });
  };

  const handleHallTicket = (drive: UpcomingDrive) => {
    toast.info(`Generating Hall Ticket for ${drive.company}`, {
      description: `Venue: ${drive.venue} • Reporting: 30 mins prior`,
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-7 shadow-xs flex flex-col justify-between overflow-hidden min-w-0">
      <div className="min-w-0">
        {/* Header with Title and Slide Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                Upcoming Campus Drives
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Scheduled on-campus & virtual placement sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {layout === "slidebar" && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => scrollSlider("left")}
                  disabled={activeSlide === 0}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Previous drive"
                  aria-label="Previous drive"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold px-1.5 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {activeSlide + 1} / {drives.length}
                </span>
                <button
                  type="button"
                  onClick={() => scrollSlider("right")}
                  disabled={activeSlide >= drives.length - 1}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Next drive"
                  aria-label="Next drive"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shrink-0">
              {drives.length} Scheduled
            </span>
          </div>
        </div>

        {/* Card Track / Slide Bar */}
        <div
          ref={sliderRef}
          onScroll={layout === "slidebar" ? handleSliderScroll : undefined}
          className={
            layout === "slidebar"
              ? "flex gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-thin scroll-smooth min-w-0"
              : layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 min-w-0"
                : "space-y-3.5 mt-2 min-w-0"
          }
        >
          {drives.map((drive) => {
            const isRegistered = registeredIds[drive.id] || drive.status === "Registered";

            return (
              <div
                key={drive.id}
                className={`group relative p-4.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-all duration-200 hover:shadow-md overflow-hidden ${layout === "slidebar"
                  ? "min-w-[310px] sm:min-w-[360px] md:min-w-[390px] max-w-[420px] shrink-0 snap-start flex flex-col justify-between"
                  : "min-w-0"
                  }`}
              >
                <div className="flex items-start justify-between gap-2.5 mb-2.5 min-w-0">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-200/50 dark:border-blue-800/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-sm shrink-0">
                      {drive.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                          {drive.company}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 shrink-0">
                          {drive.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                        {drive.role}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isRegistered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" /> Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 whitespace-nowrap">
                        <AlertCircle className="w-3 h-3" /> Registration Open
                      </span>
                    )}
                  </div>
                </div>

                {/* Date/Time and Venue on distinct vertical rows: NEVER overwriting each other */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/60 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{drive.date}</span>
                    <span className="mx-1 text-slate-300 dark:text-slate-600">•</span>
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="whitespace-nowrap">{drive.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0" title={drive.venue}>
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{drive.venue}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 min-w-0">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 min-w-0">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Eligibility:</span>{" "}
                    <span className="break-words">{drive.batchEligibility}</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {isRegistered ? (
                      <button
                        onClick={() => handleHallTicket(drive)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        Hall Ticket
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(drive)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
                      >
                        Register
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide bar dot indicators */}
        {layout === "slidebar" && drives.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {drives.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${activeSlide === idx
                  ? "w-6 h-2 bg-blue-600 dark:bg-blue-400"
                  : "w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center">
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            View all campus recruitment schedules
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
            Institutional recruitment drive schedule synchronized with University TPO
          </span>
        )}
      </div>
    </div>
  );
}
