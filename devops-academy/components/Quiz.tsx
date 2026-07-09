"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Check, X, RotateCcw } from "lucide-react";

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [picks, setPicks] = useState<(number | null)[]>(
    questions.map(() => null),
  );

  const choose = (qi: number, oi: number) => {
    setPicks((prev) => {
      if (prev[qi] !== null) return prev; // lock after answering
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const answered = picks.filter((p) => p !== null).length;
  const correct = picks.filter((p, i) => p === questions[i].answer).length;
  const allDone = answered === questions.length;

  const reset = () => setPicks(questions.map(() => null));

  return (
    <div className="space-y-7">
      {questions.map((q, qi) => {
        const pick = picks[qi];
        const locked = pick !== null;
        return (
          <div key={qi}>
            <p className="font-medium text-ink mb-3 leading-snug">
              <span className="text-iris font-display mr-2">{qi + 1}.</span>
              {q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isAnswer = oi === q.answer;
                const isPick = oi === pick;
                let cls =
                  "border-canvas-300 bg-canvas-50 hover:border-iris/40 hover:bg-iris-50/50";
                if (locked) {
                  if (isAnswer) cls = "border-teal/60 bg-teal/10 text-ink";
                  else if (isPick) cls = "border-iris/50 bg-iris-50 text-ink";
                  else cls = "border-canvas-300 bg-canvas-50/40 opacity-60";
                }
                return (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    disabled={locked}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-[0.95rem] transition-colors flex items-center justify-between gap-3 ${cls} ${
                      locked ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <span>{opt}</span>
                    {locked && isAnswer && (
                      <Check size={16} className="text-teal shrink-0" />
                    )}
                    {locked && isPick && !isAnswer && (
                      <X size={16} className="text-rose shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            {locked && (
              <p
                className={`mt-2.5 text-sm leading-relaxed ${
                  pick === q.answer ? "text-teal-dark" : "text-ink-muted"
                }`}
              >
                {pick === q.answer ? "Correct. " : "Not quite. "}
                {q.explain}
              </p>
            )}
          </div>
        );
      })}

      {allDone && (
        <div className="flex items-center justify-between rounded-xl border border-iris/30 bg-iris-50 px-5 py-4">
          <span className="font-display text-lg text-ink">
            You scored {correct} / {questions.length}
          </span>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-sm text-iris-dark hover:text-iris font-medium"
          >
            <RotateCcw size={14} /> Try again
          </button>
        </div>
      )}
    </div>
  );
}
