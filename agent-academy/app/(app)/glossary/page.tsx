"use client";

import { useMemo, useState } from "react";
import { glossary } from "@/lib/glossary";
import { Search, GraduationCap } from "lucide-react";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return glossary
      .filter(
        (t) =>
          !q ||
          t.term.toLowerCase().includes(q) ||
          t.def.toLowerCase().includes(q),
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-iris-dark mb-2">
        <GraduationCap size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">Reference</span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink mb-3 tracking-tight">Glossary</h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        Every term that matters, in one place. {glossary.length} definitions, cross-linked.
      </p>

      <div className="relative mb-8 sticky top-4 z-10">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          className="w-full rounded-xl border border-canvas-300 bg-canvas-50 pl-10 pr-4 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none focus:border-iris/50 shadow-sm"
        />
      </div>

      <dl className="space-y-4">
        {filtered.map((t) => (
          <div
            key={t.term}
            className="rounded-xl border border-canvas-300 bg-canvas-50/50 p-5"
          >
            <dt className="font-display text-lg font-semibold text-ink mb-1">{t.term}</dt>
            <dd className="text-ink-soft leading-relaxed text-[0.97rem]">{t.def}</dd>
            {t.related && t.related.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-ink-faint">See also:</span>
                {t.related.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r)}
                    className="text-xs rounded-full bg-canvas-200 hover:bg-iris-50 text-ink-soft px-2 py-0.5 transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-ink-muted py-10">No terms match.</p>
        )}
      </dl>
    </div>
  );
}
