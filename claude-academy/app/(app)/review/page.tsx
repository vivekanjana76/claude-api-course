"use client";

import { useMemo, useState } from "react";
import { modules } from "@/lib/curriculum";
import {
  allReviewCards,
  describeWhen,
  resetReview,
  totalCards,
  useReview,
} from "@/lib/review";
import { ReviewDeck } from "@/components/ReviewDeck";
import { Layers, Play, RotateCcw, Sparkles } from "lucide-react";

const accentDot: Record<string, string> = {
  clay: "bg-clay",
  sage: "bg-sage",
  ochre: "bg-ochre",
  slateblue: "bg-slateblue",
};

/** How many cards each module contributes — static, so compute it once. */
const perModule = modules.map((m) => ({
  id: m.id,
  title: m.title,
  accent: m.accent,
  count: allReviewCards().filter((c) => c.moduleId === m.id).length,
}));

export default function ReviewPage() {
  const [scope, setScope] = useState<string | undefined>(undefined);
  const [sessionQueue, setSessionQueue] = useState<ReturnType<typeof useReview>["queue"] | null>(
    null,
  );
  const { queue, stats, nextDue, grade } = useReview(scope);

  const scopeLabel = useMemo(
    () => (scope ? modules.find((m) => m.id === scope)?.title ?? "All modules" : "All modules"),
    [scope],
  );

  if (sessionQueue) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-10">
        <ReviewDeck
          queue={sessionQueue}
          onGrade={grade}
          onExit={() => setSessionQueue(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
      <div className="mb-2 flex items-center gap-2 text-clay-dark">
        <Layers size={18} />
        <span className="text-sm font-medium uppercase tracking-wider">Recall</span>
      </div>
      <h1 className="mb-3 font-serif text-4xl font-semibold tracking-tight text-ink">
        Review
      </h1>
      <p className="mb-8 leading-relaxed text-ink-soft">
        Every flashcard in the curriculum — {totalCards} of them — pooled into one deck and
        scheduled for you. Cards you recall move further out; cards you miss come back
        today. Ten minutes here beats re-reading a lesson you already understood.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Due now" value={stats.due} tone="text-clay-dark" />
        <Stat label="Unseen" value={stats.fresh} tone="text-ink" />
        <Stat label="Learning" value={stats.learning} tone="text-ochre" />
        <Stat label="Retained" value={`${stats.retention}%`} tone="text-sage" />
      </div>

      <div className="mb-8 rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-muted">Study:</span>
          <ScopeChip active={!scope} onClick={() => setScope(undefined)} label="All modules" />
          {perModule.map((m) => (
            <ScopeChip
              key={m.id}
              active={scope === m.id}
              onClick={() => setScope(m.id)}
              label={m.title}
              dot={accentDot[m.accent]}
            />
          ))}
        </div>

        {queue.length > 0 ? (
          <button
            onClick={() => setSessionQueue(queue)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-medium text-cream-50 transition-opacity hover:opacity-90"
          >
            <Play size={15} />
            Review {queue.length} {queue.length === 1 ? "card" : "cards"} from{" "}
            {scopeLabel.toLowerCase()}
          </button>
        ) : (
          <div className="rounded-xl bg-cream-200 px-4 py-5 text-center">
            <Sparkles size={18} className="mx-auto mb-2 text-sage" />
            <p className="text-sm text-ink-soft">
              Nothing due in {scopeLabel.toLowerCase()}.
              {nextDue
                ? ` The next card comes back ${describeWhen(nextDue)}.`
                : " Pick another module to keep going."}
            </p>
          </div>
        )}
      </div>

      <h2 className="mb-3 font-serif text-lg font-semibold text-ink">Deck by module</h2>
      <ul className="mb-8 divide-y divide-cream-300 overflow-hidden rounded-2xl border border-cream-300 bg-cream-50">
        {perModule.map((m) => (
          <ModuleRow key={m.id} id={m.id} title={m.title} accent={m.accent} count={m.count} />
        ))}
      </ul>

      <button
        onClick={() => {
          resetReview();
          setScope(undefined);
        }}
        className="flex items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-slateblue"
      >
        <RotateCcw size={14} /> Forget all scheduling and start the deck over
      </button>
    </div>
  );
}

function ModuleRow({
  id,
  title,
  accent,
  count,
}: {
  id: string;
  title: string;
  accent: string;
  count: number;
}) {
  const { stats } = useReview(id);
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${accentDot[accent]}`} />
      <span className="min-w-0 flex-1 truncate text-sm text-ink">{title}</span>
      <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-cream-300">
        <div
          className="h-full rounded-full bg-sage transition-all duration-500"
          style={{ width: `${stats.retention}%` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right text-xs text-ink-muted">
        {stats.due > 0 ? `${stats.due} due` : `${count} cards`}
      </span>
    </li>
  );
}

function ScopeChip({
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
        active
          ? "bg-ink text-cream-50"
          : "bg-cream-200 text-ink-soft hover:bg-cream-300"
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-cream-50" : dot}`} />}
      {label}
    </button>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50 px-4 py-3">
      <div className={`font-serif text-2xl font-semibold ${tone}`}>{value}</div>
      <div className="text-xs text-ink-muted">{label}</div>
    </div>
  );
}
