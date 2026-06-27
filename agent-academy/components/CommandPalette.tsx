"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { allLessons } from "@/lib/curriculum";
import { glossary } from "@/lib/glossary";
import { patterns } from "@/lib/patterns";
import {
  Search,
  BookOpen,
  GraduationCap,
  Workflow,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";

type Kind = "Lesson" | "Pattern" | "Glossary" | "Page";

interface SearchItem {
  kind: Kind;
  title: string;
  subtitle: string;
  href: string;
  /** Lowercased haystack of everything searchable for this item. */
  haystack: string;
}

const PAGES: { title: string; subtitle: string; href: string }[] = [
  { title: "Curriculum", subtitle: "All modules and lessons", href: "/learn" },
  { title: "Pattern Catalog", subtitle: "Agentic patterns at a glance", href: "/patterns" },
  { title: "Interview Q&A", subtitle: "Practice questions and answers", href: "/interview" },
  { title: "Glossary", subtitle: "Key terms and definitions", href: "/glossary" },
];

/** Built once on the client — the curriculum, patterns, and glossary are static. */
function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const ref of allLessons()) {
    const { lesson, module } = ref;
    items.push({
      kind: "Lesson",
      title: lesson.title,
      subtitle: module.title,
      href: `/learn/${lesson.slug}`,
      haystack: [
        lesson.title,
        lesson.summary,
        module.title,
        lesson.takeaways.join(" "),
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const p of patterns) {
    items.push({
      kind: "Pattern",
      title: p.name,
      subtitle: p.tagline,
      href: "/patterns",
      haystack: `${p.name} ${p.tagline} ${p.when}`.toLowerCase(),
    });
  }

  for (const term of glossary) {
    items.push({
      kind: "Glossary",
      title: term.term,
      subtitle: term.def,
      href: "/glossary",
      haystack: `${term.term} ${term.def}`.toLowerCase(),
    });
  }

  for (const page of PAGES) {
    items.push({
      kind: "Page",
      title: page.title,
      subtitle: page.subtitle,
      href: page.href,
      haystack: `${page.title} ${page.subtitle}`.toLowerCase(),
    });
  }

  return items;
}

/**
 * Lightweight scoring: every whitespace-separated query term must appear in the
 * haystack. Title matches and prefix matches rank higher so the most obvious
 * result lands at the top. Returns null when an item doesn't match at all.
 */
function score(item: SearchItem, terms: string[]): number | null {
  const title = item.title.toLowerCase();
  let total = 0;
  for (const t of terms) {
    if (!item.haystack.includes(t)) return null;
    if (title.startsWith(t)) total += 3;
    else if (title.includes(t)) total += 2;
    else total += 1;
  }
  // Nudge lessons above patterns/terms/pages on otherwise-equal matches.
  if (item.kind === "Lesson") total += 0.5;
  return total;
}

const KIND_ICON: Record<Kind, React.ReactNode> = {
  Lesson: <BookOpen size={16} className="text-iris" />,
  Pattern: <Workflow size={16} className="text-teal" />,
  Glossary: <GraduationCap size={16} className="text-amber" />,
  Page: <ArrowRight size={16} className="text-rose" />,
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      // Empty query: show a few lessons as a starting point.
      return index.filter((i) => i.kind === "Lesson").slice(0, 7);
    }
    return index
      .map((item) => ({ item, s: score(item, terms) }))
      .filter((r): r is { item: SearchItem; s: number } => r.s !== null)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.item);
  }, [query, index]);

  // Global shortcut: Cmd/Ctrl-K toggles, "/" opens when not typing elsewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (
        k === "/" &&
        !open &&
        !/^(input|textarea|select)$/i.test(
          (e.target as HTMLElement)?.tagName ?? "",
        )
      ) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Let any UI element (e.g. the sidebar button) open the palette.
  useEffect(() => {
    function openIt() {
      setOpen(true);
    }
    window.addEventListener("open-command-palette", openIt);
    return () => window.removeEventListener("open-command-palette", openIt);
  }, []);

  // Reset and focus whenever the palette opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keep the active row clamped and scrolled into view.
  useEffect(() => {
    if (active >= results.length) setActive(results.length === 0 ? 0 : results.length - 1);
  }, [results, active]);

  useEffect(() => {
    const node = listRef.current?.children[active] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function go(item: SearchItem) {
    setOpen(false);
    router.push(item.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="absolute inset-0 bg-ink/40 animate-[fade-up_0.15s_ease-out]"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-canvas-50 shadow-2xl ring-1 ring-canvas-300 overflow-hidden animate-[fade-up_0.18s_ease-out]">
        <div className="flex items-center gap-3 px-4 border-b border-canvas-300">
          <Search size={18} className="text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search lessons, patterns, terms…"
            className="flex-1 bg-transparent py-4 text-[0.95rem] text-ink placeholder:text-ink-muted focus:outline-none"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:block text-[0.65rem] font-medium text-ink-muted border border-canvas-300 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <ul ref={listRef} className="max-h-[52vh] overflow-y-auto thin-scroll py-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-ink-muted">
              No matches for “{query}”.
            </li>
          )}
          {results.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={`${item.kind}-${item.href}-${item.title}`}>
                <button
                  type="button"
                  onClick={() => go(item)}
                  onMouseMove={() => setActive(i)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    isActive ? "bg-iris-50" : "hover:bg-canvas-200"
                  }`}
                >
                  <span className="shrink-0">{KIND_ICON[item.kind]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9rem] font-medium text-ink">
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {item.subtitle}
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.62rem] uppercase tracking-wider text-ink-muted">
                    {item.kind}
                  </span>
                  {isActive && (
                    <CornerDownLeft size={14} className="shrink-0 text-iris" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-canvas-300 px-4 py-2 text-[0.68rem] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <kbd className="border border-canvas-300 rounded px-1">↑</kbd>
            <kbd className="border border-canvas-300 rounded px-1">↓</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="border border-canvas-300 rounded px-1">↵</kbd>
            to open
          </span>
        </div>
      </div>
    </div>
  );
}
