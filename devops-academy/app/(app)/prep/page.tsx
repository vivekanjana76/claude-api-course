"use client";

import { useState } from "react";
import Link from "next/link";
import { stages, bigPicture, rapidFire, type PrepConcept } from "@/lib/prep";
import { modules } from "@/lib/curriculum";
import { Target, ChevronRight, Lightbulb, Compass, Zap } from "lucide-react";

const accentText: Record<string, string> = {
  iris: "text-iris-dark",
  teal: "text-teal-dark",
  amber: "text-amber-dark",
  rose: "text-rose-dark",
};
const accentBorder: Record<string, string> = {
  iris: "border-iris/40",
  teal: "border-teal/40",
  amber: "border-amber/40",
  rose: "border-rose/40",
};
const accentChip: Record<string, string> = {
  iris: "bg-iris-50 text-iris-dark",
  teal: "bg-teal-50 text-teal-dark",
  amber: "bg-amber-50 text-amber-dark",
  rose: "bg-rose-50 text-rose-dark",
};
const accentBg: Record<string, string> = {
  iris: "bg-iris",
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
};

function moduleLink(id: string) {
  const m = modules.find((mm) => mm.id === id);
  if (!m) return null;
  return { title: m.title, href: `/learn/${m.lessons[0].slug}` };
}

function Concept({ concept, accent }: { concept: PrepConcept; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left rounded-xl border border-canvas-300 bg-canvas-50/50 px-4 py-3 transition-colors hover:bg-canvas-100/60"
    >
      <div className="flex items-start gap-2">
        <ChevronRight
          size={16}
          className={`mt-0.5 shrink-0 text-ink-faint transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span className="font-medium text-ink text-[0.95rem] leading-snug">{concept.q}</span>
      </div>
      {open && (
        <div className="mt-2 ml-6 flex items-start gap-2 text-sm text-ink-soft leading-relaxed">
          <Lightbulb size={15} className={`mt-0.5 shrink-0 ${accentText[accent]}`} />
          <span>{concept.hint}</span>
        </div>
      )}
    </button>
  );
}

export default function PrepPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-iris-dark mb-2">
        <Target size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">Interview Prep</span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink mb-3 tracking-tight">
        The prep roadmap
      </h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        A staged path through everything the course covers — the questions you must be able to
        answer, in the order that builds understanding. Tap any question to reveal the memory hook.
      </p>

      {/* big picture */}
      <div className="rounded-2xl border border-iris/30 bg-iris-50/40 p-5 sm:p-6 mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Compass size={17} className="text-iris-dark" />
          <h2 className="font-display text-lg font-semibold text-iris-dark">The big picture</h2>
        </div>
        <p className="text-ink-soft leading-relaxed text-[0.97rem]">{bigPicture}</p>
      </div>

      {/* stages */}
      <div className="space-y-8">
        {stages.map((stage) => (
          <section
            key={stage.id}
            className={`rounded-2xl border ${accentBorder[stage.accent]} bg-canvas-50/40 p-5 sm:p-6`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[0.72rem] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${accentChip[stage.accent]}`}>
                {stage.phase}
              </span>
              <h2 className={`font-display text-xl font-semibold ${accentText[stage.accent]}`}>
                {stage.title}
              </h2>
            </div>
            <p className="text-ink-soft leading-relaxed text-[0.95rem] mb-4">{stage.summary}</p>

            {/* module review links */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-ink-faint self-center">Review:</span>
              {stage.modules.map((id) => {
                const link = moduleLink(id);
                return link ? (
                  <Link
                    key={id}
                    href={link.href}
                    className="text-xs rounded-full bg-canvas-200 hover:bg-canvas-100 text-ink-soft px-2.5 py-1 transition-colors"
                  >
                    {link.title}
                  </Link>
                ) : null;
              })}
            </div>

            {/* must-know concepts */}
            <div className="space-y-2 mb-4">
              {stage.mustKnow.map((c) => (
                <Concept key={c.q} concept={c} accent={stage.accent} />
              ))}
            </div>

            {/* one thing */}
            <div className="flex items-start gap-2.5 rounded-xl bg-canvas-100/70 px-4 py-3">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${accentBg[stage.accent]}`} />
              <p className="text-sm text-ink leading-relaxed">
                <span className="font-semibold">If you remember one thing: </span>
                {stage.oneThing}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* rapid fire */}
      <section className="mt-10 rounded-2xl border border-canvas-300 bg-canvas-50/40 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={17} className="text-amber-dark" />
          <h2 className="font-display text-lg font-semibold text-ink">Rapid fire</h2>
        </div>
        <p className="text-ink-muted text-sm mb-4">
          Can you explain each of these to a peer in 30 seconds? If you hesitate, that&apos;s your
          next thing to review.
        </p>
        <ol className="space-y-2">
          {rapidFire.map((q, i) => (
            <li key={q} className="flex items-start gap-3 text-[0.95rem] text-ink-soft leading-snug">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-ink-faint tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* next step */}
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          href="/interview"
          className="flex-1 rounded-xl border border-canvas-300 bg-canvas-50 px-5 py-4 hover:border-iris/50 transition-colors"
        >
          <span className="block font-medium text-ink mb-0.5">Practice full answers →</span>
          <span className="block text-sm text-ink-muted">Model answers to the Interview Q&amp;A.</span>
        </Link>
        <Link
          href="/glossary"
          className="flex-1 rounded-xl border border-canvas-300 bg-canvas-50 px-5 py-4 hover:border-iris/50 transition-colors"
        >
          <span className="block font-medium text-ink mb-0.5">Drill the vocabulary →</span>
          <span className="block text-sm text-ink-muted">Every term, cross-linked, in the Glossary.</span>
        </Link>
      </div>
    </div>
  );
}
