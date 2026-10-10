"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  LoaderCircle,
} from "lucide-react";
import { cn } from "@CampusLink/ui/lib/utils";
import { api } from "@/lib/api/client";

type Question = { prompt: string; options: string[] };
type Review = {
  prompt: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
};
type Invite = {
  jobTitle: string;
  companyName: string;
  submitted: boolean;
  questions?: Question[];
  result?: {
    score: number;
    total: number;
    percentage: number;
    review: Review[];
  };
};

export default function AssessmentInvite({ token }: { token: string }) {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const answeredCount = answers.filter((answer) => answer >= 0).length;

  useEffect(() => {
    api
      .get(`/api/assessments/invite/${encodeURIComponent(token)}`)
      .then(({ data }) => setInvite(data.data as Invite))
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function submit() {
    if (answeredCount !== 10) {
      setError(
        `Answer all 10 questions before submitting. You have answered ${answeredCount}.`,
      );
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(
        `/api/assessments/invite/${encodeURIComponent(token)}/submit`,
        { answers },
      );
      setInvite((current) =>
        current ? { ...current, submitted: true, result: data.data } : current,
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not submit your assessment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-dvh bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div
          className="mx-auto max-w-3xl space-y-5"
          aria-label="Loading assessment"
        >
          <div className="h-36 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      </main>
    );
  }

  if (!invite) {
    return (
      <main className="min-h-dvh bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CircleAlert
            className="mx-auto size-12 text-amber-600"
            aria-hidden="true"
          />
          <h1 className="mt-4 text-balance text-2xl font-bold text-slate-950 dark:text-white">
            Assessment link unavailable
          </h1>
          <p className="mt-3 text-pretty leading-6 text-slate-600 dark:text-slate-300">
            {error ||
              "This assessment link is invalid or has expired. Contact your recruiter for help."}
          </p>
        </section>
      </main>
    );
  }

  const result = invite.result;
  const passed = (result?.score ?? 0) >= 6;

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
        <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-7">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
              <ClipboardCheck className="size-5" aria-hidden="true" />
              <span>Assessment</span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              {invite.companyName}
            </p>
            <h1 className="mt-1 text-balance text-2xl font-bold leading-tight text-slate-950 dark:text-white sm:text-3xl">
              {invite.jobTitle}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-sm text-slate-700 dark:text-slate-300 sm:px-7">
            <span>10 questions</span>
            <span>One answer per question</span>
            {!invite.submitted && (
              <span className="font-semibold tabular-nums text-indigo-700 dark:text-indigo-300">
                {answeredCount} of 10 answered
              </span>
            )}
          </div>
        </header>

        {invite.submitted && result ? (
          <>
            <section
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7"
              aria-live="polite"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div
                  className={cn(
                    "flex size-20 shrink-0 flex-col items-center justify-center rounded-2xl border",
                    passed
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
                  )}
                >
                  {passed ? (
                    <CircleCheck className="size-7" aria-hidden="true" />
                  ) : (
                    <CircleX className="size-7" aria-hidden="true" />
                  )}
                  <span className="mt-1 text-xs font-bold">
                    {passed ? "Passed" : "Not passed"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Assessment submitted
                  </p>
                  <h2 className="mt-1 text-balance text-2xl font-bold text-slate-950 dark:text-white">
                    You scored{" "}
                    <span className="tabular-nums">
                      {result.score}/{result.total}
                    </span>
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {passed
                      ? "You passed. Your recruiter can now schedule an interview."
                      : "You did not meet the passing score for this assessment."}
                  </p>
                </div>
                <p className="text-3xl font-bold tabular-nums text-slate-950 dark:text-white">
                  {result.percentage}%
                </p>
              </div>
            </section>

            <section aria-labelledby="review-heading" className="space-y-4">
              <div>
                <h2
                  id="review-heading"
                  className="text-balance text-xl font-bold text-slate-950 dark:text-white"
                >
                  Answer review
                </h2>
                <p className="mt-1 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Review each answer and read the explanation.
                </p>
              </div>
              {result.review.map((item, index) => (
                <article
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    {item.isCorrect ? (
                      <Check
                        className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-400"
                        aria-label="Correct"
                      />
                    ) : (
                      <CircleX
                        className="mt-0.5 size-5 shrink-0 text-rose-700 dark:text-rose-400"
                        aria-label="Incorrect"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                        Question {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-pretty text-base font-semibold leading-6 text-slate-950 dark:text-white">
                        {item.prompt}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 rounded-lg border px-3 py-2.5 text-sm leading-6",
                          item.isCorrect
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                            : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
                        )}
                      >
                        Your answer: {item.options[item.selectedIndex]}
                      </p>
                      {!item.isCorrect && (
                        <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                          Correct answer: {item.options[item.correctIndex]}
                        </p>
                      )}
                      <p className="mt-3 text-pretty text-sm leading-6 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">Explanation:</span>{" "}
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        ) : (
          <>
            <section className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-4 dark:border-indigo-900 dark:bg-indigo-950/40">
              <h2 className="text-base font-bold text-indigo-950 dark:text-indigo-100">
                Before you begin
              </h2>
              <p className="mt-1 text-pretty text-sm leading-6 text-indigo-900 dark:text-indigo-200">
                Choose one answer for each question. You can change your answers
                before submitting. A passing score is 6 out of 10.
              </p>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-900"
                role="progressbar"
                aria-label="Assessment completion"
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={answeredCount}
              >
                <div
                  className="h-full rounded-full bg-indigo-700 dark:bg-indigo-300"
                  style={{ width: `${answeredCount * 10}%` }}
                />
              </div>
            </section>

            <section aria-label="Assessment questions" className="space-y-4">
              {invite.questions?.map((question, index) => (
                <fieldset
                  key={index}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
                >
                  <legend className="sr-only">
                    Question {index + 1}: {question.prompt}
                  </legend>
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold tabular-nums text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="pt-1 text-pretty text-base font-semibold leading-6 text-slate-950 dark:text-white">
                      {question.prompt}
                    </h2>
                  </div>
                  <div className="mt-4 grid gap-2.5 sm:ml-11">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[index] === optionIndex;
                      return (
                        <label
                          key={optionIndex}
                          className={cn(
                            "flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900",
                            selected
                              ? "border-indigo-600 bg-indigo-50 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-100"
                              : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500",
                          )}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={optionIndex}
                            checked={selected}
                            onChange={() => {
                              setAnswers((current) =>
                                current.map((value, i) =>
                                  i === index ? optionIndex : value,
                                ),
                              );
                              setError("");
                            }}
                            className="mt-1 size-4 shrink-0 accent-indigo-700"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
                >
                  {error}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {answeredCount === 10
                    ? "All questions answered. You’re ready to submit."
                    : `Answer ${10 - answeredCount} more ${10 - answeredCount === 1 ? "question" : "questions"} to submit.`}
                </p>
                <button
                  type="button"
                  disabled={submitting || answeredCount !== 10}
                  onClick={submit}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                >
                  {submitting && (
                    <LoaderCircle className="size-4" aria-hidden="true" />
                  )}
                  {submitting ? "Submitting assessment…" : "Submit assessment"}
                </button>
              </div>
            </section>
          </>
        )}
        <footer className="pb-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Your assessment is linked to this job application.
        </footer>
      </div>
    </main>
  );
}
