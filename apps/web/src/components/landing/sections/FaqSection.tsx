"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is deterministic placement intelligence and why does it matter?",
      answer:
        "Generic LLMs can hallucinate qualifications or make biased decisions. CAMPUSLINK separates deterministic rules (strict CGPA cutoffs, degree branches, active backlog limits, graduation year) from generative AI. LLMs are applied strictly where they excel: deep semantic resume parsing, keyword normalization, and tailored study recommendations, while eligibility remains 100% auditable and reliable.",
    },
    {
      question: "How is the CAMPUSLINK Readiness Index calculated?",
      answer:
        "The readiness score is a multi-dimensional composite metric formulated around real-world recruiter preferences: Academics / CGPA (20%), Technical Proficiencies (30%), Verified Projects with Live Demos (20%), ATS Resume Quality (10%), and Mock Assessment Performance (20%). It provides students with a transparent benchmark against Tier-1 and high-growth hiring bars.",
    },
    {
      question: "Is CAMPUSLINK free for college students?",
      answer:
        "Yes! Students can build their complete digital placement portfolio, upload and preview resumes, track profile completion percentages, discover skill gaps, and apply for approved campus drives at zero cost.",
    },
    {
      question: "How does CAMPUSLINK assist University Placement Cells (TPOs)?",
      answer:
        "TPO teams replace endless disconnected spreadsheets with an automated command center. They can approve company registration drives, publish customized eligibility criteria, monitor student applications in real time, coordinate interview rounds, and export compliance-ready placement statistics for NIRF, NBA, and NAAC audits in one click.",
    },
    {
      question: "How does the Skill Gap Analyzer work?",
      answer:
        "When an eligible company posts a job opening (e.g. Full-Stack Engineer requiring TypeScript, React, Docker, AWS), CAMPUSLINK parses the job requirements and contrasts them against your profile. It highlights matched competencies and identifies unfulfilled requirements with tailored roadmaps to master them before tests begin.",
    },
    {
      question: "Is my student data secure and private?",
      answer:
        "CAMPUSLINK utilizes Better-Auth with encrypted session cookies, role-based access control, and PostgreSQL with Prisma ORM. Only verified campus recruiters and your designated university placement officers have access to your verified academic records.",
    },
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Everything You Need to Know About CAMPUSLINK
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Got questions? We have clear answers on our AI placement platform, eligibility checks, and student workflows.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
