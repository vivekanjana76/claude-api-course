"use client";

import { useState } from "react";
import { modules } from "@/lib/curriculum";
import {
  bankSize,
  buildExam,
  clearAttempts,
  clock,
  EXAM_LENGTHS,
  PASS_MARK,
  SECONDS_PER_QUESTION,
  totalQuestions,
  useAttempts,
  type ExamQuestion,
} from "@/lib/exam";
import { ExamRunner } from "@/components/ExamRunner";
import { ClipboardCheck, Play, Timer, Trash2 } from "lucide-react";

const accentDot: Record<string, string> = {
  iris: "bg-iris",
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
};

export default function ExamPage() {
  const [count, setCount] = useState<number>(25);
  const [scope, setScope] = useState<string | undefined>(undefined);
  const [timed, setTimed] = useState(true);
  const [paper, setPaper] = useState<ExamQuestion[] | null>(null);
  const { attempts, best, record } = useAttempts();

  const available = bankSize(scope);
  const drawn = Math.min(count, available);

  if (paper) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-10">
        <ExamRunner
          questions={paper}
          timed={timed}
          moduleId={scope}
          onFinish={record}
          onExit={() => setPaper(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
      <div className="mb-2 flex items-center gap-2 text-iris-dark">
        <ClipboardCheck size={18} />
        <span className="text-sm font-medium uppercase tracking-wider">Under exam conditions</span>
      </div>
      <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight text-ink">
        Mock exam
      </h1>
      <p className="mb-8 leading-relaxed text-ink-soft">
        A paper drawn at random from all {totalQuestions} quiz questions in the curriculum,
        with the options shuffled and no feedback until you submit. The per-lesson quizzes
        check you read the lesson; this checks you can still answer weeks later, against a
        clock, with nothing on the page to remind you.
      </p>

      <div className="mb-8 rounded-2xl border border-canvas-300 bg-canvas-50 p-6 shadow-sm">
        <Field label="Length">
          {EXAM_LENGTHS.map((n) => (
            <Chip key={n} active={count === n} onClick={() => setCount(n)} label={`${n} questions`} />
          ))}
        </Field>

        <Field label="Scope">
          <Chip active={!scope} onClick={() => setScope(undefined)} label="Whole curriculum" />
          {modules.map((m) => (
            <Chip
              key={m.id}
              active={scope === m.id}
              onClick={() => setScope(m.id)}
              label={m.title}
              dot={accentDot[m.accent]}
            />
          ))}
        </Field>

        <Field label="Clock">
          <Chip
            active={timed}
            onClick={() => setTimed(true)}
            label={`Timed · ${clock(drawn * SECONDS_PER_QUESTION)}`}
          />
          <Chip active={!timed} onClick={() => setTimed(false)} label="Untimed" />
        </Field>

        <button
          onClick={() => setPaper(buildExam(count, scope))}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-medium text-canvas-50 transition-opacity hover:opacity-90"
        >
          <Play size={15} /> Start a {drawn}-question paper
        </button>

        {drawn < count && (
          <p className="mt-3 text-center text-xs text-ink-faint">
            That scope only holds {available} questions, so the paper is {drawn} long.
          </p>
        )}
      </div>

      {attempts.length > 0 && (
        <>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Past attempts</h2>
            {best && (
              <span className="text-sm text-ink-muted">
                Best {Math.round((best.correct / best.count) * 100)}%
              </span>
            )}
          </div>
          <ul className="mb-4 divide-y divide-canvas-300 overflow-hidden rounded-2xl border border-canvas-300 bg-canvas-50">
            {attempts.map((a) => {
              const pct = Math.round((a.correct / a.count) * 100);
              const passed = a.correct / a.count >= PASS_MARK;
              return (
                <li key={a.at} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`w-12 shrink-0 font-display text-lg font-semibold tabular-nums ${
                      passed ? "text-teal-dark" : "text-rose-dark"
                    }`}
                  >
                    {pct}%
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">
                    {a.correct}/{a.count} ·{" "}
                    {a.moduleId
                      ? modules.find((m) => m.id === a.moduleId)?.title ?? "one module"
                      : "whole curriculum"}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-ink-faint">
                    <Timer size={12} /> {clock(a.seconds)}
                  </span>
                  <span className="w-20 shrink-0 text-right text-xs text-ink-faint">
                    {new Date(a.at).toLocaleDateString()}
                  </span>
                </li>
              );
            })}
          </ul>
          <button
            onClick={clearAttempts}
            className="flex items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-rose-dark"
          >
            <Trash2 size={14} /> Clear attempt history
          </button>
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-sm text-ink-muted">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
  dot,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors ${
        active ? "bg-ink text-canvas-50" : "bg-canvas-200 text-ink-soft hover:bg-canvas-300"
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-canvas-50" : dot}`} />}
      {label}
    </button>
  );
}
