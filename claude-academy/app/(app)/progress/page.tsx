"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { allLessons, modules, totalLessons, totalMinutes } from "@/lib/curriculum";
import { useMastery, useProgress } from "@/lib/progress";
import { useReview } from "@/lib/review";
import {
  importState,
  recentDays,
  resetEverything,
  useActivity,
  useDownloadBackup,
} from "@/lib/activity";
import { MasteryRing } from "@/components/MasteryRing";
import {
  Activity,
  ArrowRight,
  Download,
  Flame,
  Trash2,
  Upload,
} from "lucide-react";

const accentBar: Record<string, string> = {
  clay: "bg-clay",
  sage: "bg-sage",
  ochre: "bg-ochre",
  slateblue: "bg-slateblue",
};

/** Quiz scores below this are what the "shaky" list is for. */
const SHAKY = 0.7;
const HEATMAP_DAYS = 91; // 13 weeks, one column per week

export default function ProgressPage() {
  const { done, completedCount } = useProgress();
  const { scores, quizzesTaken, avgPct } = useMastery();
  const { stats: review } = useReview();
  const { log, streak, daysStudied, now } = useActivity();
  const download = useDownloadBackup();

  const lessons = allLessons();
  const pct = Math.round((completedCount / totalLessons) * 100);

  const minutesDone = useMemo(
    () => lessons.reduce((m, r) => m + (done[r.lesson.slug] ? r.lesson.minutes : 0), 0),
    [lessons, done],
  );

  const shaky = useMemo(
    () =>
      lessons
        .map((r) => ({ ref: r, score: scores[r.lesson.slug] }))
        .filter((x) => x.score && x.score.correct / x.score.total < SHAKY)
        .sort((a, b) => a.score!.correct / a.score!.total - b.score!.correct / b.score!.total),
    [lessons, scores],
  );

  const next = lessons.find((r) => !done[r.lesson.slug]);
  const days = useMemo(
    () => (now ? recentDays(log, HEATMAP_DAYS, now) : []),
    [log, now],
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
      <div className="mb-2 flex items-center gap-2 text-clay-dark">
        <Activity size={18} />
        <span className="text-sm font-medium uppercase tracking-wider">Your standing</span>
      </div>
      <h1 className="mb-3 font-serif text-4xl font-semibold tracking-tight text-ink">
        Progress
      </h1>
      <p className="mb-8 leading-relaxed text-ink-soft">
        Everything the academy knows about how you are doing — all of it stored in this
        browser and nowhere else. Take a backup if you study on more than one machine.
      </p>

      <div className="mb-8 rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-sm">
        <div className="mb-2 flex items-end justify-between">
          <span className="font-serif text-3xl font-semibold text-ink">
            {completedCount}
            <span className="text-lg text-ink-faint"> / {totalLessons} lessons</span>
          </span>
          <span className="text-sm text-ink-muted">{pct}%</span>
        </div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-cream-300">
          <div
            className="h-full rounded-full bg-clay transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Minutes read" value={minutesDone} sub={`of ${totalMinutes}`} />
          <Stat label="Quizzes taken" value={quizzesTaken} sub={`${avgPct}% average`} />
          <Stat label="Cards due" value={review.due} sub={`${review.retention}% retained`} />
          <Stat label="Days studied" value={daysStudied} sub={streak ? `${streak}-day streak` : "no streak yet"} />
        </div>
      </div>

      {streak > 0 && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-ochre/40 bg-cream-200 px-5 py-4">
          <Flame size={20} className="shrink-0 text-ochre" />
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">{streak} days in a row.</strong> A day counts once
            you finish a lesson, take a quiz, or grade a review card.
          </p>
        </div>
      )}

      <h2 className="mb-3 font-serif text-lg font-semibold text-ink">Last 13 weeks</h2>
      <div className="mb-8 overflow-x-auto rounded-2xl border border-cream-300 bg-cream-50 p-5">
        <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: "max-content" }}>
          {days.map((d) => (
            <span
              key={d.key}
              title={`${d.key} — ${d.count} ${d.count === 1 ? "action" : "actions"}`}
              className={`h-3 w-3 rounded-[3px] ${heatTone(d.count)}`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
          <span>Quieter</span>
          {[0, 1, 3, 6, 12].map((n) => (
            <span key={n} className={`h-3 w-3 rounded-[3px] ${heatTone(n)}`} />
          ))}
          <span>Busier</span>
        </div>
      </div>

      <h2 className="mb-3 font-serif text-lg font-semibold text-ink">By module</h2>
      <ul className="mb-8 divide-y divide-cream-300 overflow-hidden rounded-2xl border border-cream-300 bg-cream-50">
        {modules.map((m) => {
          const total = m.lessons.length;
          const doneCount = m.lessons.filter((l) => done[l.slug]).length;
          const modPct = Math.round((doneCount / total) * 100);
          return (
            <li key={m.id} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{m.title}</span>
              <div className="h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-cream-300">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${accentBar[m.accent]}`}
                  style={{ width: `${modPct}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-xs tabular-nums text-ink-muted">
                {doneCount}/{total}
              </span>
            </li>
          );
        })}
      </ul>

      {shaky.length > 0 && (
        <>
          <h2 className="mb-1 font-serif text-lg font-semibold text-ink">Worth another pass</h2>
          <p className="mb-3 text-sm text-ink-muted">
            Lessons where your best quiz score is still under {Math.round(SHAKY * 100)}%.
          </p>
          <ul className="mb-8 divide-y divide-cream-300 overflow-hidden rounded-2xl border border-cream-300 bg-cream-50">
            {shaky.slice(0, 6).map(({ ref, score }) => (
              <li key={ref.lesson.slug}>
                <Link
                  href={`/learn/${ref.lesson.slug}`}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream-100"
                >
                  <MasteryRing correct={score!.correct} total={score!.total} size={30} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink group-hover:text-clay-dark">
                      {ref.lesson.title}
                    </span>
                    <span className="block truncate text-xs text-ink-faint">
                      {ref.module.title}
                    </span>
                  </span>
                  <ArrowRight size={15} className="shrink-0 text-ink-faint" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {next && (
        <Link
          href={`/learn/${next.lesson.slug}`}
          className="group mb-10 flex items-center gap-3 rounded-2xl border border-clay/30 bg-cream-50 px-5 py-4 transition-all hover:border-clay/50 hover:shadow-md"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium uppercase tracking-wider text-clay-dark">
              Up next
            </span>
            <span className="block truncate font-serif text-lg font-semibold text-ink">
              {next.lesson.title}
            </span>
          </span>
          <ArrowRight
            size={18}
            className="shrink-0 text-clay transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}

      <BackupPanel onDownload={download} />
    </div>
  );
}

function BackupPanel({ onDownload }: { onDownload: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; bad?: boolean } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const { applied, error } = importState(await file.text());
    setMessage(
      error
        ? { text: error, bad: true }
        : { text: `Restored ${applied} ${applied === 1 ? "record" : "records"}.` },
    );
  };

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6">
      <h2 className="mb-1 font-serif text-lg font-semibold text-ink">Back up or move</h2>
      <p className="mb-4 text-sm text-ink-muted">
        Progress, quiz scores, and review scheduling live in this browser. Export them to a
        file to carry them to another machine — or to survive clearing your cache.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-cream-50 transition-opacity hover:opacity-90"
        >
          <Download size={15} /> Export
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-cream-300 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream-200"
        >
          <Upload size={15} /> Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => {
            if (!confirming) {
              setConfirming(true);
              return;
            }
            resetEverything();
            setConfirming(false);
            setMessage({ text: "Everything cleared. Fresh start." });
          }}
          onBlur={() => setConfirming(false)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            confirming
              ? "border-slateblue bg-cream-200 text-slateblue"
              : "border-cream-300 text-ink-muted hover:text-slateblue"
          }`}
        >
          <Trash2 size={15} /> {confirming ? "Really erase everything?" : "Reset"}
        </button>
      </div>

      {message && (
        <p className={`mt-4 text-sm ${message.bad ? "text-slateblue" : "text-sage"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

/** Five steps is enough to read at a glance without inventing precision. */
function heatTone(count: number): string {
  if (count === 0) return "bg-cream-300";
  if (count < 3) return "bg-clay/25";
  if (count < 6) return "bg-clay/50";
  if (count < 12) return "bg-clay/75";
  return "bg-clay";
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub: string;
}) {
  return (
    <div>
      <div className="font-serif text-2xl font-semibold tabular-nums text-ink">{value}</div>
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="text-[0.68rem] text-ink-faint">{sub}</div>
    </div>
  );
}
