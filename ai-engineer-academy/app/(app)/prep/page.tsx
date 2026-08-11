"use client";

import { useMemo, useState } from "react";
import { RichText } from "@/components/RichText";
import { Flashcards } from "@/components/Flashcards";
import {
  drills,
  skills,
  heuristics,
  type Drill,
  type DrillSkill,
} from "@/lib/prep";
import {
  Zap,
  Target,
  Check,
  X,
  RotateCcw,
  Flame,
  Trophy,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

type TabId = "drill" | "decoder" | "heuristics";

const accentText: Record<string, string> = {
  iris: "text-iris",
  teal: "text-teal-dark",
  amber: "text-amber-dark",
  rose: "text-rose-dark",
};
const accentChip: Record<string, string> = {
  iris: "bg-iris-50 text-iris-dark border-iris/30",
  teal: "bg-teal-50 text-teal-dark border-teal/30",
  amber: "bg-amber-50 text-amber-dark border-amber/30",
  rose: "bg-rose-50 text-rose-dark border-rose/30",
};

const skillAccent = (id: DrillSkill) =>
  skills.find((s) => s.id === id)?.accent ?? "iris";
const skillLabel = (id: DrillSkill) =>
  skills.find((s) => s.id === id)?.label ?? id;

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "drill", label: "Rapid drill", icon: <Zap size={15} /> },
  { id: "decoder", label: "Keyword decoder", icon: <Lightbulb size={15} /> },
  { id: "heuristics", label: "Cheat-sheet", icon: <Target size={15} /> },
];

export default function PrepPage() {
  const [tab, setTab] = useState<TabId>("drill");

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-iris-dark mb-2">
        <Zap size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">
          Intuition prep
        </span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink mb-3 tracking-tight">
        Sharpen your AI instincts
      </h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        Interviews and real design reviews don&apos;t test whether you can
        recite definitions — they test the judgment calls. Drill the five that
        come up most: <em>which technique fixes this?</em>, <em>which pipeline
        stage is broken?</em>,{" "}
        <em>how would you evaluate it?</em>, <em>where does the guardrail
        go?</em>, and <em>what does that keyword actually mean?</em>
      </p>

      {/* tabs */}
      <div className="sticky top-0 lg:top-0 z-10 -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 bg-canvas-50/85 backdrop-blur-sm border-b border-canvas-300 mb-8">
        <div className="flex gap-1.5 overflow-x-auto thin-scroll">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3.5 py-1.5 border whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "bg-iris text-canvas-50 border-iris"
                  : "bg-white/40 text-ink-soft border-canvas-300 hover:border-iris/40"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-up">
        {tab === "drill" && <DrillRunner />}
        {tab === "decoder" && <Decoder />}
        {tab === "heuristics" && <HeuristicsSection />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rapid drill                                                         */
/* ------------------------------------------------------------------ */

function DrillRunner() {
  const [filter, setFilter] = useState<DrillSkill | "all">("all");
  const pool = useMemo<Drill[]>(
    () => (filter === "all" ? drills : drills.filter((d) => d.skill === filter)),
    [filter],
  );

  const [order, setOrder] = useState<number[]>(() => shuffle(pool.length));
  const [pos, setPos] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [seen, setSeen] = useState(0);

  const restart = (nextFilter: DrillSkill | "all") => {
    const nextPool = nextFilter === "all" ? drills : drills.filter((d) => d.skill === nextFilter);
    setFilter(nextFilter);
    setOrder(shuffle(nextPool.length));
    setPos(0);
    setPick(null);
    setScore(0);
    setStreak(0);
    setBest(0);
    setSeen(0);
  };

  const current = pool[order[pos] ?? 0];
  const locked = pick !== null;
  const finished = seen > 0 && pos >= pool.length;

  const choose = (oi: number) => {
    if (locked) return;
    setPick(oi);
    setSeen((s) => s + 1);
    if (oi === current.answer) {
      setScore((s) => s + 1);
      setStreak((st) => {
        const ns = st + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setPick(null);
    setPos((p) => p + 1);
  };

  return (
    <div>
      {/* filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip active={filter === "all"} onClick={() => restart("all")}>
          All skills
        </FilterChip>
        {skills.map((s) => (
          <FilterChip
            key={s.id}
            active={filter === s.id}
            accent={s.accent}
            onClick={() => restart(s.id)}
          >
            {s.label}
          </FilterChip>
        ))}
      </div>

      {/* scoreboard */}
      <div className="flex items-center gap-3 mb-6 text-sm">
        <Stat icon={<Trophy size={14} />} label="Score" value={`${score}/${seen}`} />
        <Stat
          icon={<Flame size={14} className={streak > 0 ? "text-amber-dark" : ""} />}
          label="Streak"
          value={String(streak)}
        />
        <Stat icon={<Zap size={14} />} label="Best" value={String(best)} />
        <div className="ml-auto text-xs text-ink-faint">
          {finished ? pool.length : Math.min(pos + 1, pool.length)} / {pool.length}
        </div>
      </div>

      {finished ? (
        <FinishCard score={score} total={pool.length} best={best} onRestart={() => restart(filter)} />
      ) : (
        <div>
          <div className="mb-3">
            <span
              className={`inline-block text-[0.7rem] font-semibold uppercase tracking-wider rounded-full border px-2.5 py-0.5 ${accentChip[skillAccent(current.skill)]}`}
            >
              {skillLabel(current.skill)}
            </span>
          </div>
          <p className="font-display text-xl text-ink leading-snug mb-5">
            {current.prompt}
          </p>

          <div className="space-y-2.5">
            {current.options.map((opt, oi) => {
              const isAnswer = oi === current.answer;
              const isPick = oi === pick;
              let cls =
                "border-canvas-300 bg-canvas-50 hover:border-iris/40 hover:bg-iris-50/50";
              if (locked) {
                if (isAnswer) cls = "border-teal/60 bg-teal/10 text-ink";
                else if (isPick) cls = "border-rose/50 bg-rose-50 text-ink";
                else cls = "border-canvas-300 bg-canvas-50/40 opacity-60";
              }
              return (
                <button
                  key={oi}
                  onClick={() => choose(oi)}
                  disabled={locked}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-[0.95rem] transition-colors flex items-center justify-between gap-3 ${cls} ${
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
            <div
              className={`mt-4 rounded-xl border px-4 py-3.5 text-[0.92rem] leading-relaxed ${
                pick === current.answer
                  ? "border-teal/30 bg-teal-50 text-ink-soft"
                  : "border-canvas-300 bg-canvas-100 text-ink-soft"
              }`}
            >
              <span className="font-semibold text-ink">
                {pick === current.answer ? "Nailed it. " : "Not quite. "}
              </span>
              <RichText text={current.explain} />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 text-sm font-medium text-iris-dark hover:text-iris"
                >
                  {pos + 1 >= pool.length ? "See results" : "Next"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FinishCard({
  score,
  total,
  best,
  onRestart,
}: {
  score: number;
  total: number;
  best: number;
  onRestart: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const verdict =
    pct >= 90
      ? "Sharp instincts — you'd hold your own in a design review."
      : pct >= 70
        ? "Solid. Revisit the ones you missed and the cheat-sheet."
        : "Good practice run. The explanations are where the learning is — go again.";
  return (
    <div className="rounded-2xl border border-iris/30 bg-iris-50 px-6 py-8 text-center">
      <Trophy size={28} className="mx-auto text-iris mb-3" />
      <p className="font-display text-3xl text-ink mb-1">
        {score} / {total}
      </p>
      <p className="text-sm text-ink-muted mb-1">
        {pct}% · longest streak {best}
      </p>
      <p className="text-ink-soft leading-relaxed max-w-sm mx-auto mb-6">{verdict}</p>
      <button
        onClick={onRestart}
        className="inline-flex items-center gap-1.5 rounded-full bg-iris text-canvas-50 px-5 py-2 text-sm font-medium hover:bg-iris-dark transition-colors"
      >
        <RotateCcw size={15} /> Drill again
      </button>
    </div>
  );
}

function FilterChip({
  active,
  accent = "iris",
  onClick,
  children,
}: {
  active: boolean;
  accent?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[0.8rem] rounded-full px-3 py-1 border transition-colors ${
        active
          ? accentChip[accent] + " font-medium"
          : "border-canvas-300 bg-white/40 text-ink-muted hover:border-iris/40"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-canvas-300 bg-canvas-50 px-2.5 py-1.5">
      <span className="text-ink-muted">{icon}</span>
      <span className="text-ink-faint text-xs">{label}</span>
      <span className="font-display text-ink font-semibold tabular-nums">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buzzword decoder                                                    */
/* ------------------------------------------------------------------ */

function Decoder() {
  // Turn the acronym drills into flashcards: prompt front, plain answer back.
  const cards = useMemo(
    () =>
      drills
        .filter((d) => d.skill === "jargon")
        .map((d) => ({
          front: d.prompt,
          back: d.options[d.answer] + " — " + d.explain,
        })),
    [],
  );
  return (
    <div>
      <p className="text-ink-soft leading-relaxed mb-6">
        AI engineering runs on jargon, and it turns over fast. Flip each card
        to translate the terms you&apos;ll meet in job posts, design reviews,
        and model release notes into the plain idea underneath.
      </p>
      <Flashcards cards={cards} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cheat-sheet                                                         */
/* ------------------------------------------------------------------ */

function HeuristicsSection() {
  return (
    <div>
      <p className="text-ink-soft leading-relaxed mb-6">
        The rules that quietly decide most AI system-design questions. The
        drills are just these, dressed up as scenarios.
      </p>
      <div className="space-y-3">
        {heuristics.map((h, i) => (
          <div
            key={i}
            className="rounded-xl border border-canvas-300 bg-canvas-50 px-5 py-4"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-iris-50 text-iris-dark font-display text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-ink mb-1 leading-snug">{h.rule}</p>
                <p className="text-[0.92rem] text-ink-muted leading-relaxed">
                  {h.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function shuffle(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
