"use client";

import { useMemo, useState } from "react";
import { cheatsheets } from "@/lib/cheatsheets";
import { Terminal, Search, X, Check, Copy } from "lucide-react";

const accentText: Record<string, string> = {
  iris: "text-iris-dark",
  teal: "text-teal-dark",
  amber: "text-amber-dark",
  rose: "text-rose-dark",
};
const accentChip: Record<string, string> = {
  iris: "bg-iris-50 text-iris-dark",
  teal: "bg-teal-50 text-teal-dark",
  amber: "bg-amber-50 text-amber-dark",
  rose: "bg-rose-50 text-rose-dark",
};
const accentDot: Record<string, string> = {
  iris: "bg-iris",
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
      aria-label={copied ? "Copied" : "Copy command"}
      className="shrink-0 rounded-md p-1.5 text-ink-faint opacity-0 transition-all hover:bg-canvas-200 hover:text-ink group-hover:opacity-100"
    >
      {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
    </button>
  );
}

export default function CheatsheetsPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const sheets = useMemo(() => {
    if (!q) return cheatsheets;
    return cheatsheets
      .map((sheet) => ({
        ...sheet,
        sections: sheet.sections
          .map((sec) => ({
            ...sec,
            commands: sec.commands.filter(
              (c) =>
                c.cmd.toLowerCase().includes(q) ||
                c.desc.toLowerCase().includes(q),
            ),
          }))
          .filter((sec) => sec.commands.length > 0),
      }))
      .filter((sheet) => sheet.sections.length > 0);
  }, [q]);

  const totalCommands = cheatsheets.reduce(
    (n, s) => n + s.sections.reduce((m, sec) => m + sec.commands.length, 0),
    0,
  );

  const jumpTo = (id: string) => {
    document
      .getElementById(`sheet-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-iris-dark mb-2">
        <Terminal size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">Reference</span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink mb-3 tracking-tight">
        Cheatsheets
      </h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        The calls and commands you reach for daily — {totalCommands} across CrewAI, LangGraph,
        the raw Anthropic tool loop, and MCP. Hover one to copy it.
      </p>

      <div className="sticky top-4 z-10 mb-4">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands…"
            className="w-full rounded-xl border border-canvas-300 bg-canvas-50 pl-10 pr-10 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none focus:border-iris/50 shadow-sm"
          />
          {q && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-faint hover:text-ink hover:bg-canvas-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {!q && (
        <nav aria-label="Jump to tool" className="flex flex-wrap gap-2 mb-8">
          {cheatsheets.map((s) => (
            <button
              key={s.id}
              onClick={() => jumpTo(s.id)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-opacity hover:opacity-80 ${accentChip[s.accent]}`}
            >
              {s.tool}
            </button>
          ))}
        </nav>
      )}

      <div className="space-y-10">
        {sheets.map((sheet) => (
          <section key={sheet.id} id={`sheet-${sheet.id}`} className="scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${accentDot[sheet.accent]}`} />
              <h2 className={`font-display text-2xl font-semibold ${accentText[sheet.accent]}`}>
                {sheet.tool}
              </h2>
            </div>
            <p className="text-ink-muted text-sm mb-4">{sheet.blurb}</p>

            <div className="space-y-5">
              {sheet.sections.map((sec) => (
                <div key={sec.title}>
                  <h3 className="text-[0.72rem] font-bold uppercase tracking-wider text-ink-muted mb-2">
                    {sec.title}
                  </h3>
                  <div className="rounded-xl border border-canvas-300 bg-canvas-50/50 divide-y divide-canvas-300 overflow-hidden">
                    {sec.commands.map((c) => (
                      <div
                        key={c.cmd}
                        className="group flex items-start gap-3 px-4 py-3 hover:bg-canvas-100/60 transition-colors"
                      >
                        <code className="font-mono text-[0.82rem] text-ink bg-canvas-200/70 rounded px-1.5 py-0.5 whitespace-pre-wrap break-words min-w-0 sm:basis-1/2 sm:shrink-0">
                          {c.cmd}
                        </code>
                        <span className="flex-1 text-sm text-ink-soft leading-snug pt-0.5">
                          {c.desc}
                        </span>
                        <CopyButton text={c.cmd} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {sheets.length === 0 && (
          <div className="text-center py-10">
            <p className="text-ink-muted mb-2">No commands match “{query}”.</p>
            <button onClick={() => setQuery("")} className="text-sm text-iris-dark hover:underline">
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
