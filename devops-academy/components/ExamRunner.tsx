"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  clock,
  PASS_MARK,
  SECONDS_PER_QUESTION,
  type Attempt,
  type ExamQuestion,
} from "@/lib/exam";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Timer,
  X,
} from "lucide-react";

interface Props {
  questions: ExamQuestion[];
  timed: boolean;
  onFinish: (attempt: Attempt) => void;
  onExit: () => void;
  moduleId?: string;
}

export function ExamRunner({ questions, timed, onFinish, onExit, moduleId }: Props) {
  const [picks, setPicks] = useState<(number | null)[]>(questions.map(() => null));
  const [flagged, setFlagged] = useState<boolean[]>(questions.map(() => false));
  const [i, setI] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [left, setLeft] = useState(questions.length * SECONDS_PER_QUESTION);

  const startedAt = useRef(Date.now());
  // Held in a ref so the ticking timer can submit without being rebuilt.
  const submitRef = useRef<() => void>(() => {});

  const answeredCount = picks.filter((p) => p !== null).length;
  const correctCount = picks.filter((p, n) => p === questions[n].answer).length;

  const submit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    const weak = questions
      .filter((q, n) => picks[n] !== q.answer)
      .map((q) => q.moduleId)
      .filter((id, n, all) => all.indexOf(id) === n);
    onFinish({
      at: Date.now(),
      count: questions.length,
      correct: picks.filter((p, n) => p === questions[n].answer).length,
      seconds,
      moduleId,
      weak,
    });
  }, [submitted, questions, picks, onFinish, moduleId]);
  submitRef.current = submit;

  // One interval for the whole exam; it submits the paper when time runs out.
  useEffect(() => {
    if (!timed || submitted) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          submitRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timed, submitted]);

  const choose = (oi: number) =>
    setPicks((prev) => {
      const next = [...prev];
      next[i] = oi;
      return next;
    });

  const go = (d: number) =>
    setI((n) => Math.min(questions.length - 1, Math.max(0, n + d)));

  if (submitted) {
    return (
      <ExamResults
        questions={questions}
        picks={picks}
        correct={correctCount}
        seconds={Math.round((Date.now() - startedAt.current) / 1000)}
        onExit={onExit}
      />
    );
  }

  const q = questions[i];
  const lowTime = timed && left <= 60;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-ink-muted">
          Question {i + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-3">
          {timed && (
            <span
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium tabular-nums ${
                lowTime ? "bg-rose-50 text-rose-dark" : "text-ink-muted"
              }`}
            >
              <Timer size={14} /> {clock(left)}
            </span>
          )}
          <button
            onClick={onExit}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-ink-muted transition-colors hover:bg-canvas-200 hover:text-ink"
          >
            <X size={14} /> Abandon
          </button>
        </div>
      </div>

      {/* Question palette — answered, flagged, and where you are */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {questions.map((_, n) => {
          const state = flagged[n]
            ? "border-amber bg-amber-50 text-amber-dark"
            : picks[n] !== null
              ? "border-iris/50 bg-iris-50 text-iris-dark"
              : "border-canvas-300 bg-canvas-50 text-ink-faint";
          return (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Go to question ${n + 1}`}
              aria-current={n === i}
              className={`h-7 w-7 rounded-md border text-[0.7rem] font-medium tabular-nums transition-colors ${state} ${
                n === i ? "ring-2 ring-ink ring-offset-1 ring-offset-canvas" : ""
              }`}
            >
              {n + 1}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-canvas-300 bg-canvas-50 p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <p className="font-display text-lg leading-snug text-ink">{q.q}</p>
          <button
            onClick={() =>
              setFlagged((f) => {
                const next = [...f];
                next[i] = !next[i];
                return next;
              })
            }
            aria-pressed={flagged[i]}
            aria-label={flagged[i] ? "Unflag this question" : "Flag for review"}
            className={`shrink-0 rounded-lg p-2 transition-colors ${
              flagged[i]
                ? "bg-amber-50 text-amber-dark"
                : "text-ink-faint hover:bg-canvas-200 hover:text-ink"
            }`}
          >
            <Flag size={15} />
          </button>
        </div>

        <div className="space-y-2">
          {q.options.map((opt, oi) => (
            <button
              key={oi}
              onClick={() => choose(oi)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[0.94rem] transition-colors ${
                picks[i] === oi
                  ? "border-iris/60 bg-iris-50 text-ink"
                  : "border-canvas-300 bg-canvas-50 text-ink-soft hover:border-iris/40 hover:bg-iris-50/40"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-medium ${
                  picks[i] === oi
                    ? "border-iris bg-iris text-canvas-50"
                    : "border-canvas-300 text-ink-faint"
                }`}
              >
                {String.fromCharCode(65 + oi)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-canvas-200 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {i === questions.length - 1 ? (
          <button
            onClick={() => (confirmSubmit || answeredCount === questions.length ? submit() : setConfirmSubmit(true))}
            className="rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-canvas-50 transition-opacity hover:opacity-90"
          >
            {confirmSubmit
              ? `Submit with ${questions.length - answeredCount} unanswered`
              : "Submit exam"}
          </button>
        ) : (
          <button
            onClick={() => go(1)}
            className="flex items-center gap-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-canvas-50 transition-opacity hover:opacity-90"
          >
            Next <ChevronRight size={16} />
          </button>
        )}

        <span className="w-20 text-right text-xs text-ink-faint">
          {answeredCount}/{questions.length} answered
        </span>
      </div>
    </div>
  );
}

function ExamResults({
  questions,
  picks,
  correct,
  seconds,
  onExit,
}: {
  questions: ExamQuestion[];
  picks: (number | null)[];
  correct: number;
  seconds: number;
  onExit: () => void;
}) {
  const pct = Math.round((correct / questions.length) * 100);
  const passed = correct / questions.length >= PASS_MARK;

  /** Score per module, so the advice points somewhere specific. */
  const byModule = useMemo(() => {
    const rows: { id: string; title: string; right: number; total: number }[] = [];
    questions.forEach((q, n) => {
      let row = rows.find((r) => r.id === q.moduleId);
      if (!row) {
        row = { id: q.moduleId, title: q.moduleTitle, right: 0, total: 0 };
        rows.push(row);
      }
      row.total += 1;
      if (picks[n] === q.answer) row.right += 1;
    });
    return rows.sort((a, b) => a.right / a.total - b.right / b.total);
  }, [questions, picks]);

  const missed = questions
    .map((q, n) => ({ q, pick: picks[n], n }))
    .filter((x) => x.pick !== x.q.answer);

  return (
    <div>
      <div
        className={`mb-6 rounded-2xl border p-7 text-center shadow-sm ${
          passed ? "border-teal/40 bg-teal-50" : "border-rose/40 bg-rose-50"
        }`}
      >
        <div className="mb-1 font-display text-5xl font-semibold text-ink">{pct}%</div>
        <p className="mb-1 text-ink-soft">
          {correct} of {questions.length} correct in {clock(seconds)}
        </p>
        <p className="text-sm text-ink-muted">
          {passed
            ? `Above the ${Math.round(PASS_MARK * 100)}% mark. Take another with a different draw to confirm it holds.`
            : `Below the ${Math.round(PASS_MARK * 100)}% mark. The weakest module below is where the marks are.`}
        </p>
      </div>

      <h2 className="mb-3 font-display text-lg font-semibold text-ink">
        Where the marks went
      </h2>
      <ul className="mb-8 divide-y divide-canvas-300 overflow-hidden rounded-2xl border border-canvas-300 bg-canvas-50">
        {byModule.map((m) => {
          const mp = Math.round((m.right / m.total) * 100);
          return (
            <li key={m.id} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{m.title}</span>
              <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-canvas-300">
                <div
                  className={`h-full rounded-full ${mp >= PASS_MARK * 100 ? "bg-teal" : "bg-rose"}`}
                  style={{ width: `${mp}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-ink-muted">
                {m.right}/{m.total}
              </span>
            </li>
          );
        })}
      </ul>

      {missed.length > 0 && (
        <>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <AlertTriangle size={17} className="text-rose-dark" />
            {missed.length} to go back over
          </h2>
          <div className="mb-8 space-y-4">
            {missed.map(({ q, pick, n }) => (
              <div
                key={n}
                className="rounded-2xl border border-canvas-300 bg-canvas-50 p-5"
              >
                <p className="mb-3 font-medium leading-snug text-ink">{q.q}</p>
                {pick !== null && (
                  <p className="mb-1.5 flex items-start gap-2 text-sm text-rose-dark">
                    <X size={15} className="mt-0.5 shrink-0" />
                    {q.options[pick]}
                  </p>
                )}
                <p className="mb-3 flex items-start gap-2 text-sm text-teal-dark">
                  <Check size={15} className="mt-0.5 shrink-0" />
                  {q.options[q.answer]}
                </p>
                <p className="mb-3 text-sm leading-relaxed text-ink-soft">{q.explain}</p>
                <Link
                  href={`/learn/${q.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-iris-dark"
                >
                  <BookOpen size={14} /> {q.lessonTitle}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={onExit}
        className="rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-canvas-50 transition-opacity hover:opacity-90"
      >
        Back to exam setup
      </button>
    </div>
  );
}
