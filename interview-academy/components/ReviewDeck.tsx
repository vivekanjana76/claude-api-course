"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Grade, ReviewCard } from "@/lib/review";
import { RotateCcw, ArrowRight, BookOpen, Check, X } from "lucide-react";

const accentChip: Record<string, string> = {
  iris: "bg-iris-50 text-iris-dark",
  teal: "bg-teal-50 text-teal-dark",
  amber: "bg-amber-50 text-amber-dark",
  rose: "bg-rose-50 text-rose-dark",
};

interface Props {
  /** Snapshot of the due queue, taken when the session starts. */
  queue: ReviewCard[];
  onGrade: (id: string, grade: Grade) => void;
  onExit: () => void;
}

export function ReviewDeck({ queue, onGrade, onExit }: Props) {
  // The session works from its own copy: a card graded "again" is pushed to
  // the back rather than reappearing immediately from the live query.
  const [session, setSession] = useState<ReviewCard[]>(queue);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState({ again: 0, good: 0, easy: 0 });

  const card = session[i];
  const done = i >= session.length;
  const graded = tally.again + tally.good + tally.easy;

  const answer = useCallback(
    (grade: Grade) => {
      if (!card) return;
      onGrade(card.id, grade);
      setTally((t) => ({ ...t, [grade]: t[grade] + 1 }));
      if (grade === "again") setSession((s) => [...s, card]);
      setFlipped(false);
      setI((n) => n + 1);
    },
    [card, onGrade],
  );

  // Space/Enter flips, 1–3 grade. Keeps a long session on the home row.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (!flipped) return;
      if (e.key === "1") answer("again");
      if (e.key === "2") answer("good");
      if (e.key === "3") answer("easy");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, done, answer]);

  const accuracy = useMemo(() => {
    const total = tally.again + tally.good + tally.easy;
    return total ? Math.round(((tally.good + tally.easy) / total) * 100) : 0;
  }, [tally]);

  if (done) {
    return (
      <div className="rounded-2xl border border-canvas-300 bg-canvas-50 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
          <Check size={22} className="text-teal-dark" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">
          Session complete
        </h2>
        <p className="text-ink-soft mb-6">
          {graded} {graded === 1 ? "answer" : "answers"} graded · {accuracy}% recalled
          without a miss.
        </p>
        <div className="mx-auto mb-7 flex max-w-sm justify-between gap-3 text-sm">
          <Tally label="Missed" value={tally.again} tone="text-rose-dark" />
          <Tally label="Good" value={tally.good} tone="text-iris-dark" />
          <Tally label="Easy" value={tally.easy} tone="text-teal-dark" />
        </div>
        <button
          onClick={onExit}
          className="rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-canvas-50 transition-opacity hover:opacity-90"
        >
          Back to the deck
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-ink-muted">
        <span>
          Card {Math.min(i + 1, session.length)} of {session.length}
        </span>
        <button
          onClick={onExit}
          className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-canvas-200 hover:text-ink"
        >
          <X size={14} /> End session
        </button>
      </div>

      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-canvas-300">
        <div
          className="h-full rounded-full bg-iris transition-all duration-300"
          style={{ width: `${(i / session.length) * 100}%` }}
        />
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? "Show question" : "Reveal answer"}
        className="block w-full cursor-pointer select-none text-left"
      >
        <div
          className={`min-h-[240px] rounded-2xl border p-8 shadow-sm transition-colors ${
            flipped
              ? "border-iris/40 bg-iris-50"
              : "border-canvas-300 bg-canvas-50"
          }`}
        >
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium ${accentChip[card.accent]}`}
            >
              {card.moduleTitle}
            </span>
            <span className="truncate text-[0.72rem] text-ink-faint">
              {card.lessonTitle}
            </span>
          </div>

          <p className="font-display text-xl leading-snug text-ink">
            {card.card.front}
          </p>

          {flipped ? (
            <p className="mt-5 border-t border-iris/25 pt-5 text-[0.98rem] leading-relaxed text-ink-soft">
              {card.card.back}
            </p>
          ) : (
            <span className="mt-6 flex items-center gap-1.5 text-xs text-ink-faint">
              <RotateCcw size={12} /> click or press space to reveal
            </span>
          )}
        </div>
      </button>

      {flipped ? (
        <div className="mt-5 grid grid-cols-3 gap-3">
          <GradeButton
            label="Missed it"
            hint="1"
            onClick={() => answer("again")}
            className="border-rose/40 bg-rose-50 text-rose-dark hover:bg-rose-50/70"
          />
          <GradeButton
            label="Good"
            hint="2"
            onClick={() => answer("good")}
            className="border-iris/40 bg-iris-50 text-iris-dark hover:bg-iris-50/70"
          />
          <GradeButton
            label="Easy"
            hint="3"
            onClick={() => answer("easy")}
            className="border-teal/40 bg-teal-50 text-teal-dark hover:bg-teal-50/70"
          />
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-medium text-canvas-50 transition-opacity hover:opacity-90"
        >
          Reveal answer <ArrowRight size={15} />
        </button>
      )}

      <Link
        href={`/learn/${card.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-iris-dark"
      >
        <BookOpen size={14} /> Read the lesson this came from
      </Link>
    </div>
  );
}

function GradeButton({
  label,
  hint,
  onClick,
  className,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border py-3 text-sm font-medium transition-colors ${className}`}
    >
      {label}
      <span className="ml-1.5 text-[0.68rem] opacity-60">{hint}</span>
    </button>
  );
}

function Tally({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex-1">
      <div className={`font-display text-2xl font-semibold ${tone}`}>{value}</div>
      <div className="text-xs text-ink-muted">{label}</div>
    </div>
  );
}
