"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { allLessons } from "./curriculum";
import type { Accent, Flashcard } from "./types";

/**
 * Spaced repetition over every flashcard in the curriculum.
 *
 * The lessons already carry flashcards, but they were only reachable one
 * lesson at a time — which is exactly the wrong shape for retention. This
 * pools them into a single deck and schedules each card with a five-box
 * Leitner ladder: answer correctly and the card moves up a box and comes
 * back later; miss it and it drops to box 0 and comes back today.
 *
 * State lives in localStorage, same as lesson progress — no account, no
 * server, and a learner who clears their browser simply starts over.
 */

const KEY = "ai-engineer-academy-review-v1";
const DAY = 86_400_000;

/** Days until a card in each box comes back. Box 0 is "again this session". */
export const BOX_INTERVALS = [0, 1, 3, 7, 21];
export const MAX_BOX = BOX_INTERVALS.length - 1;

export interface ReviewCard {
  /** Stable across content edits as long as the lesson keeps its card order. */
  id: string;
  card: Flashcard;
  slug: string;
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
  accent: Accent;
}

export interface CardState {
  box: number;
  /** Epoch ms the card next becomes reviewable. */
  due: number;
  seen: number;
  lapses: number;
}

export type Grade = "again" | "good" | "easy";

/** The whole deck, flattened once — the curriculum is static. */
let deckCache: ReviewCard[] | null = null;

export function allReviewCards(): ReviewCard[] {
  if (deckCache) return deckCache;
  const cards: ReviewCard[] = [];
  for (const { lesson, module } of allLessons()) {
    lesson.flashcards.forEach((card, i) => {
      cards.push({
        id: `${lesson.slug}#${i}`,
        card,
        slug: lesson.slug,
        lessonTitle: lesson.title,
        moduleId: module.id,
        moduleTitle: module.title,
        accent: module.accent,
      });
    });
  }
  deckCache = cards;
  return cards;
}

export const totalCards = allReviewCards().length;

function read(): Record<string, CardState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(states: Record<string, CardState>) {
  localStorage.setItem(KEY, JSON.stringify(states));
  window.dispatchEvent(new Event("review-updated"));
}

/** Apply one grade to one card and persist the result. */
export function gradeCard(id: string, grade: Grade) {
  if (typeof window === "undefined") return;
  const states = read();
  const prev = states[id];
  const box = prev?.box ?? 0;

  let next: number;
  if (grade === "again") next = 0;
  else if (grade === "easy") next = Math.min(box + 2, MAX_BOX);
  else next = Math.min(box + 1, MAX_BOX);

  states[id] = {
    box: next,
    due: Date.now() + BOX_INTERVALS[next] * DAY,
    seen: (prev?.seen ?? 0) + 1,
    lapses: (prev?.lapses ?? 0) + (grade === "again" ? 1 : 0),
  };
  write(states);
}

export function resetReview() {
  if (typeof window === "undefined") return;
  write({});
}

/** Forget just the cards belonging to one module. */
export function resetModule(moduleId: string) {
  if (typeof window === "undefined") return;
  const states = read();
  allReviewCards()
    .filter((c) => c.moduleId === moduleId)
    .forEach((c) => delete states[c.id]);
  write(states);
}

export interface ReviewStats {
  fresh: number;
  learning: number;
  mature: number;
  due: number;
  /** 0–100, weighted by how far up the ladder each card has climbed. */
  retention: number;
}

function summarise(states: Record<string, CardState>, cards: ReviewCard[], now: number): ReviewStats {
  let fresh = 0;
  let learning = 0;
  let mature = 0;
  let due = 0;
  let ladder = 0;

  for (const c of cards) {
    const s = states[c.id];
    if (!s) {
      fresh += 1;
      due += 1;
      continue;
    }
    ladder += s.box;
    if (s.box >= 3) mature += 1;
    else learning += 1;
    if (s.due <= now) due += 1;
  }

  return {
    fresh,
    learning,
    mature,
    due,
    retention: cards.length ? Math.round((ladder / (cards.length * MAX_BOX)) * 100) : 0,
  };
}

/** Cards ready to study, hardest-first: lapsed cards, then new, then oldest due. */
function buildQueue(
  states: Record<string, CardState>,
  cards: ReviewCard[],
  now: number,
): ReviewCard[] {
  return cards
    .filter((c) => {
      const s = states[c.id];
      return !s || s.due <= now;
    })
    .sort((a, b) => {
      const sa = states[a.id];
      const sb = states[b.id];
      if (sb?.lapses !== sa?.lapses) return (sb?.lapses ?? 0) - (sa?.lapses ?? 0);
      if (!sa !== !sb) return sa ? 1 : -1; // unseen cards before scheduled ones
      return (sa?.due ?? 0) - (sb?.due ?? 0);
    });
}

export function useReview(moduleId?: string) {
  const [states, setStates] = useState<Record<string, CardState>>({});
  const [now, setNow] = useState(0);

  useEffect(() => {
    const sync = () => {
      setStates(read());
      setNow(Date.now());
    };
    sync();
    window.addEventListener("review-updated", sync);
    return () => window.removeEventListener("review-updated", sync);
  }, []);

  const cards = useMemo(() => {
    const all = allReviewCards();
    return moduleId ? all.filter((c) => c.moduleId === moduleId) : all;
  }, [moduleId]);

  const stats = useMemo(() => summarise(states, cards, now), [states, cards, now]);
  const queue = useMemo(() => buildQueue(states, cards, now), [states, cards, now]);

  /** Epoch ms of the soonest card that is not yet due, if the queue is empty. */
  const nextDue = useMemo(() => {
    if (!now) return null;
    const times = cards
      .map((c) => states[c.id]?.due)
      .filter((d): d is number => typeof d === "number" && d > now);
    return times.length ? Math.min(...times) : null;
  }, [states, cards, now]);

  const grade = useCallback((id: string, g: Grade) => gradeCard(id, g), []);

  return { states, cards, queue, stats, nextDue, grade };
}

/** "in 3 days" / "tomorrow" / "in 4 hours" for the empty-queue message. */
export function describeWhen(at: number, from = Date.now()): string {
  const ms = at - from;
  if (ms <= 0) return "now";
  const hours = Math.round(ms / 3_600_000);
  if (hours < 24) return hours <= 1 ? "in about an hour" : `in ${hours} hours`;
  const days = Math.round(ms / DAY);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}
