"use client";

import { useMemo, useState } from "react";
import { interviewQA } from "@/lib/interview";
import { ChevronDown, Search, MessagesSquare } from "lucide-react";

export default function InterviewPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("All");
  const [open, setOpen] = useState<string | null>(interviewQA[0]?.q ?? null);

  const topics = useMemo(
    () => ["All", ...Array.from(new Set(interviewQA.map((q) => q.topic)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return interviewQA.filter((item) => {
      const matchTopic = topic === "All" || item.topic === topic;
      const matchQuery =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q);
      return matchTopic && matchQuery;
    });
  }, [query, topic]);

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-clay-dark mb-2">
        <MessagesSquare size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">Prep</span>
      </div>
      <h1 className="font-serif text-4xl font-semibold text-ink mb-3">Interview Q&amp;A</h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        The questions you&apos;ll actually be asked about Claude, agents, and RAG — with
        crisp model answers. Read them, then try answering in your own words.
      </p>

      {/* search */}
      <div className="relative mb-4">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="w-full rounded-xl border border-cream-300 bg-white/60 pl-10 pr-4 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none focus:border-clay/50"
        />
      </div>

      {/* topic filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`text-sm rounded-full px-3.5 py-1.5 border transition-colors ${
              topic === t
                ? "bg-clay text-cream-50 border-clay"
                : "bg-white/40 text-ink-soft border-cream-300 hover:border-clay/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = open === item.q;
          return (
            <div
              key={item.q}
              className={`rounded-xl border bg-white/40 overflow-hidden transition-colors ${
                isOpen ? "border-clay/40" : "border-cream-300 hover:border-clay/30"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : item.q)}
                aria-expanded={isOpen}
                className="w-full flex items-start gap-3 text-left px-5 py-4"
              >
                <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-clay-dark bg-clay-50 rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                  {item.topic}
                </span>
                <span className="flex-1 font-medium text-ink">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-ink-muted shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 animate-accordion">
                  <p className="text-ink-soft leading-relaxed border-l-2 border-clay/40 pl-4">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-ink-muted py-10">No questions match your search.</p>
        )}
      </div>
    </div>
  );
}
