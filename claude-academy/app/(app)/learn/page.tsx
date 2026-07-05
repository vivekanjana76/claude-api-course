"use client";

import Link from "next/link";
import { modules } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { ContinueLearning } from "@/components/ContinueLearning";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";

const accentText: Record<string, string> = {
  clay: "text-clay-dark",
  sage: "text-sage",
  ochre: "text-ochre",
  slateblue: "text-slateblue",
};
const accentBar: Record<string, string> = {
  clay: "bg-clay",
  sage: "bg-sage",
  ochre: "bg-ochre",
  slateblue: "bg-slateblue",
};

export default function CurriculumPage() {
  const { done } = useProgress();

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <p className="text-clay-dark font-medium text-sm uppercase tracking-wider mb-2">
        The full path
      </p>
      <h1 className="font-serif text-4xl font-semibold text-ink mb-3">Curriculum</h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        Work through it in order for a complete mental model, or jump to whatever you need.
        Each lesson ends with takeaways, flashcards, and a short quiz.
      </p>

      <div className="mb-10">
        <ContinueLearning />
      </div>

      <div className="space-y-10">
        {modules.map((m, mi) => {
          const doneInModule = m.lessons.filter((l) => done[l.slug]).length;
          const modulePct = Math.round((doneInModule / m.lessons.length) * 100);
          return (
            <section key={m.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`h-7 w-1 rounded-full ${accentBar[m.accent]}`} />
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-2xl font-semibold text-ink">
                    <span className={accentText[m.accent]}>{mi + 1}.</span> {m.title}
                  </h2>
                  <p className="text-sm text-ink-muted">{m.blurb}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-ink-muted">
                    {doneInModule}/{m.lessons.length} done
                  </span>
                  <div className="h-1 w-20 rounded-full bg-cream-300 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${accentBar[m.accent]}`}
                      style={{ width: `${modulePct}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 pl-4">
                {m.lessons.map((l, li) => {
                  const isDone = done[l.slug];
                  return (
                    <Link
                      key={l.slug}
                      href={`/learn/${l.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-cream-300 bg-white/40 px-4 py-3 hover:border-clay/40 hover:bg-clay-50/40 transition-colors"
                    >
                      <span className="w-6 shrink-0 flex items-center">
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-sage" />
                        ) : (
                          <span className="font-serif text-ink-faint text-sm">
                            {mi + 1}.{li + 1}
                          </span>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-ink group-hover:text-clay-dark transition-colors">
                          {l.title}
                        </div>
                        <p className="text-sm text-ink-muted line-clamp-1">{l.summary}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-ink-faint shrink-0">
                        <Clock size={12} /> {l.minutes}m
                      </span>
                      <ArrowRight size={16} className="text-cream-300 group-hover:text-clay transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
