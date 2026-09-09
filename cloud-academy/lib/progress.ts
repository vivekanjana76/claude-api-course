"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "cloud-academy-progress-v1";

/**
 * These three academies shipped writing lesson progress into
 * `agent-academy-progress-v1`, a key they had inherited by copy-paste and
 * then shared — completing a lesson in one marked a same-slugged lesson
 * complete in the others. Each now owns its key, and adopts whatever was
 * in the shared store the first time it runs so nobody's existing ticks
 * disappear in the move.
 */
const LEGACY_SHARED_KEY = "agent-academy-progress-v1";

function migrate() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEY) !== null) return;
  const shared = localStorage.getItem(LEGACY_SHARED_KEY);
  if (shared) localStorage.setItem(KEY, shared);
}

function read(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  migrate();
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function useProgress() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDone(read());
    const onStorage = () => setDone(read());
    window.addEventListener("progress-updated", onStorage);
    return () => window.removeEventListener("progress-updated", onStorage);
  }, []);

  const toggle = useCallback((slug: string, value?: boolean) => {
    const cur = read();
    const next = { ...cur, [slug]: value ?? !cur[slug] };
    if (!next[slug]) delete next[slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    setDone(next);
    window.dispatchEvent(new Event("progress-updated"));
  }, []);

  return { done, toggle, completedCount: Object.keys(done).length };
}

/* ------------------------------------------------------------------ */
/* Quiz mastery — per-lesson best quiz score                          */
/* ------------------------------------------------------------------ */

const MASTERY_KEY = "cloud-academy-mastery-v1";

export interface QuizScore {
  correct: number;
  total: number;
}

function readMastery(): Record<string, QuizScore> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(MASTERY_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Record a quiz result, keeping only the learner's best attempt per lesson. */
export function recordQuizScore(slug: string, correct: number, total: number) {
  if (typeof window === "undefined" || total === 0) return;
  const cur = readMastery();
  const prev = cur[slug];
  if (!prev || correct / total > prev.correct / prev.total) {
    cur[slug] = { correct, total };
    localStorage.setItem(MASTERY_KEY, JSON.stringify(cur));
    window.dispatchEvent(new Event("mastery-updated"));
  }
}

export function useMastery() {
  const [scores, setScores] = useState<Record<string, QuizScore>>({});

  useEffect(() => {
    setScores(readMastery());
    const onUpdate = () => setScores(readMastery());
    window.addEventListener("mastery-updated", onUpdate);
    return () => window.removeEventListener("mastery-updated", onUpdate);
  }, []);

  const slugs = Object.keys(scores);
  const totalCorrect = slugs.reduce((s, k) => s + scores[k].correct, 0);
  const totalQuestions = slugs.reduce((s, k) => s + scores[k].total, 0);
  const avgPct =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return { scores, quizzesTaken: slugs.length, avgPct };
}
