"use client";

import Link from "next/link";
import { allLessons, totalLessons } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { ArrowRight, PlayCircle, Trophy } from "lucide-react";

/**
 * Resume card: shows the first incomplete lesson once the learner has
 * completed at least one. Renders nothing for brand-new visitors so the
 * hero's "Start learning" CTA stays the single entry point.
 */
export function ContinueLearning() {
  const { done, completedCount } = useProgress();
  if (completedCount === 0) return null;

  const next = allLessons().find((r) => !done[r.lesson.slug]);
  const pct = Math.round((completedCount / totalLessons) * 100);

  if (!next) {
    return (
      <div className="animate-fade-up rounded-2xl border border-teal/40 bg-teal-50 px-6 py-5 flex items-center gap-4">
        <span className="h-11 w-11 rounded-xl bg-teal text-canvas-50 flex items-center justify-center shrink-0">
          <Trophy size={20} />
        </span>
        <div>
          <div className="font-display text-lg font-semibold text-ink">
            All {totalLessons} lessons complete — nicely done.
          </div>
          <p className="text-sm text-ink-muted">
            Keep it fresh with the{" "}
            <Link href="/patterns" className="text-iris-dark hover:text-iris font-medium">
              pattern catalog
            </Link>{" "}
            and the{" "}
            <Link href="/interview" className="text-iris-dark hover:text-iris font-medium">
              interview Q&amp;As
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/learn/${next.lesson.slug}`}
      className="group animate-fade-up flex items-center gap-4 rounded-2xl border border-iris/30 bg-canvas-50/60 px-6 py-5 transition-all hover:border-iris/50 hover:shadow-md"
    >
      <span className="h-11 w-11 rounded-xl bg-iris text-canvas-50 flex items-center justify-center shrink-0">
        <PlayCircle size={20} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-iris-dark font-medium uppercase tracking-wider mb-0.5">
          Continue where you left off · {pct}% complete
        </div>
        <div className="font-display text-lg font-semibold text-ink truncate group-hover:text-iris-dark transition-colors">
          {next.lesson.title}
        </div>
        <div className="mt-2 h-1 rounded-full bg-canvas-300 overflow-hidden max-w-xs">
          <div
            className="h-full bg-iris rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ArrowRight
        size={20}
        className="text-iris shrink-0 group-hover:translate-x-1 transition-transform"
      />
    </Link>
  );
}
