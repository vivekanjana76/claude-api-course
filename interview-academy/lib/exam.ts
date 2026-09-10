"use client";

import { useCallback, useEffect, useState } from "react";
import { allLessons } from "./curriculum";
import { recordActivity } from "./activity";
import type { Accent } from "./types";

/**
 * Mock exams drawn from every lesson's quiz bank.
 *
 * The per-lesson quizzes check that you followed the lesson you just read,
 * with the answer sitting a paragraph above. A real exam asks about things
 * you studied weeks apart, in an order that gives nothing away, against a
 * clock. Same questions, different test — so this pools the bank, shuffles
 * the draw and the options, withholds feedback until you submit, and then
 * tells you which modules let you down.
 */

const KEY = "interview-academy-exam-v1";

/** Kept short: an attempt history is for spotting a trend, not an archive. */
const MAX_ATTEMPTS = 20;

/** Roughly the pace of a real certification exam. */
export const SECONDS_PER_QUESTION = 72;

/** The score most certification exams sit near. */
export const PASS_MARK = 0.72;

export const EXAM_LENGTHS = [10, 25, 50] as const;

export interface ExamQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
  slug: string;
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
  accent: Accent;
}

let bankCache: ExamQuestion[] | null = null;

export function questionBank(): ExamQuestion[] {
  if (bankCache) return bankCache;
  const out: ExamQuestion[] = [];
  for (const { lesson, module } of allLessons()) {
    for (const q of lesson.quiz) {
      out.push({
        ...q,
        slug: lesson.slug,
        lessonTitle: lesson.title,
        moduleId: module.id,
        moduleTitle: module.title,
        accent: module.accent,
      });
    }
  }
  bankCache = out;
  return out;
}

export const totalQuestions = questionBank().length;

export function bankSize(moduleId?: string): number {
  return moduleId
    ? questionBank().filter((q) => q.moduleId === moduleId).length
    : totalQuestions;
}

function shuffled<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Reorder the options and move `answer` with them. */
function shuffleOptions(q: ExamQuestion): ExamQuestion {
  const order = shuffled(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    answer: order.indexOf(q.answer),
  };
}

/** Draw a paper. Asking for more than the bank holds simply gives the bank. */
export function buildExam(count: number, moduleId?: string): ExamQuestion[] {
  const pool = moduleId
    ? questionBank().filter((q) => q.moduleId === moduleId)
    : questionBank();
  return shuffled(pool).slice(0, Math.min(count, pool.length)).map(shuffleOptions);
}

/* ------------------------------------------------------------------ */
/* Attempt history                                                     */
/* ------------------------------------------------------------------ */

export interface Attempt {
  at: number;
  count: number;
  correct: number;
  seconds: number;
  moduleId?: string;
  /** Module ids the learner got at least one question wrong in. */
  weak: string[];
}

function read(): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordAttempt(attempt: Attempt) {
  if (typeof window === "undefined") return;
  const next = [attempt, ...read()].slice(0, MAX_ATTEMPTS);
  localStorage.setItem(KEY, JSON.stringify(next));
  recordActivity();
  window.dispatchEvent(new Event("exam-updated"));
}

export function clearAttempts() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("exam-updated"));
}

export function useAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const sync = () => setAttempts(read());
    sync();
    window.addEventListener("exam-updated", sync);
    return () => window.removeEventListener("exam-updated", sync);
  }, []);

  const best = attempts.reduce(
    (b, a) => (b === null || a.correct / a.count > b.correct / b.count ? a : b),
    null as Attempt | null,
  );

  const record = useCallback((a: Attempt) => recordAttempt(a), []);

  return { attempts, best, record };
}

/** mm:ss, for a countdown that has to stay readable at a glance. */
export function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${`${s % 60}`.padStart(2, "0")}`;
}
