"use client";

import { useMemo, useRef, useState } from "react";
import { glossary } from "@/lib/glossary";
import { Search, GraduationCap, X } from "lucide-react";

const letterOf = (term: string) => {
  const c = term[0].toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
};

const idOf = (term: string) =>
  "term-" + term.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const sorted = useMemo(
    () => [...glossary].sort((a, b) => a.term.localeCompare(b.term)),
    [],
  );

  const q = query.trim().toLowerCase();
  const filtered = q
    ? sorted.filter(
        (t) =>
          t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q),
      )
    : sorted;

  const letters = useMemo(
    () => new Set(sorted.map((t) => letterOf(t.term))),
    [sorted],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof sorted>();
    for (const t of filtered) {
      const l = letterOf(t.term);
      if (!map.has(l)) map.set(l, []);
      map.get(l)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const jumpTo = (term: string) => {
    setQuery("");
    setTimeout(() => {
      const el = document.getElementById(idOf(term));
      if (!el) {
        setQuery(term);
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setFlash(term);
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(null), 1600);
    }, 60);
  };

  const jumpToLetter = (l: string) => {
    setQuery("");
    setTimeout(() => {
      document
        .getElementById(`letter-${l}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-clay-dark mb-2">
        <GraduationCap size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">Reference</span>
      </div>
      <h1 className="font-serif text-4xl font-semibold text-ink mb-3">Glossary</h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        Every term that matters, in one place. {glossary.length} definitions, cross-linked.
      </p>

      <div className="sticky top-4 z-10 mb-3">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded-xl border border-cream-300 bg-cream-50 pl-10 pr-24 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none focus:border-clay/50 shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {q && (
              <span className="text-xs text-ink-faint tabular-nums">
                {filtered.length} of {glossary.length}
              </span>
            )}
            {q && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="rounded-full p-1 text-ink-faint hover:text-ink hover:bg-cream-200 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <nav aria-label="Jump to letter" className="flex flex-wrap gap-1 mb-8">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) =>
          letters.has(l) ? (
            <button
              key={l}
              onClick={() => jumpToLetter(l)}
              className="w-7 h-7 rounded-lg text-xs font-medium text-ink-soft hover:bg-clay-50 hover:text-clay-dark transition-colors"
            >
              {l}
            </button>
          ) : (
            <span
              key={l}
              className="w-7 h-7 rounded-lg text-xs font-medium text-ink-faint/40 flex items-center justify-center select-none"
            >
              {l}
            </span>
          ),
        )}
      </nav>

      <dl className="space-y-4">
        {groups.map(([letter, terms]) => (
          <section key={letter} id={q ? undefined : `letter-${letter}`} className="scroll-mt-24">
            {!q && (
              <div className="flex items-center gap-3 pt-4 pb-1">
                <span className="font-serif text-xl font-semibold text-clay-dark">{letter}</span>
                <span className="flex-1 border-t border-cream-300" />
              </div>
            )}
            <div className="space-y-4">
              {terms.map((t) => (
                <div
                  key={t.term}
                  id={idOf(t.term)}
                  className={`rounded-xl border p-5 scroll-mt-24 transition-colors duration-500 ${
                    flash === t.term
                      ? "border-clay bg-clay-50/60"
                      : "border-cream-300 bg-white/40"
                  }`}
                >
                  <dt className="font-serif text-lg font-semibold text-ink mb-1">{t.term}</dt>
                  <dd className="text-ink-soft leading-relaxed text-[0.97rem]">{t.def}</dd>
                  {t.related && t.related.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-ink-faint">See also:</span>
                      {t.related.map((r) => (
                        <button
                          key={r}
                          onClick={() => jumpTo(r)}
                          className="text-xs rounded-full bg-cream-200 hover:bg-clay-50 text-ink-soft px-2 py-0.5 transition-colors"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-ink-muted mb-2">No terms match “{query}”.</p>
            <button
              onClick={() => setQuery("")}
              className="text-sm text-clay-dark hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </dl>
    </div>
  );
}
