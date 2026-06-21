"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RichText } from "@/components/RichText";
import {
  company,
  studyMap,
  technicalQA,
  behavioralQA,
  talkTrack,
  interviewStages,
  questionsToAsk,
  checklist,
  type PrepQA,
} from "@/lib/intuitive-prep";
import {
  Target,
  Building2,
  Map as MapIcon,
  Code2,
  Users,
  Megaphone,
  ListChecks,
  ChevronDown,
  ChevronRight,
  Search,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

type TabId =
  | "overview"
  | "company"
  | "studymap"
  | "technical"
  | "behavioral"
  | "pitch"
  | "checklist";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Target size={15} /> },
  { id: "company", label: "Company", icon: <Building2 size={15} /> },
  { id: "studymap", label: "JD → Study map", icon: <MapIcon size={15} /> },
  { id: "technical", label: "Technical Q&A", icon: <Code2 size={15} /> },
  { id: "behavioral", label: "Behavioral", icon: <Users size={15} /> },
  { id: "pitch", label: "Pitch & process", icon: <Megaphone size={15} /> },
  { id: "checklist", label: "Checklist", icon: <ListChecks size={15} /> },
];

export default function PrepPage() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      {/* header */}
      <div className="flex items-center gap-2 text-clay-dark mb-2">
        <Target size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">
          Interview Prep
        </span>
      </div>
      <h1 className="font-serif text-4xl font-semibold text-ink mb-3">
        Intuitive.ai — Claude Enterprise Engineer
      </h1>
      <p className="text-ink-soft leading-relaxed mb-6">
        A focused dossier for your interview: who they are, every line of the JD
        mapped to a lesson, the technical and behavioral questions you&apos;ll
        face with model answers, your pitch, and a last-mile checklist.
      </p>

      {/* tabs */}
      <div className="sticky top-0 lg:top-0 z-10 -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 bg-cream-50/85 backdrop-blur-sm border-b border-cream-300 mb-8">
        <div className="flex gap-1.5 overflow-x-auto thin-scroll">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3.5 py-1.5 border whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "bg-clay text-cream-50 border-clay"
                  : "bg-white/40 text-ink-soft border-cream-300 hover:border-clay/40"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-up">
        {tab === "overview" && <Overview onJump={setTab} />}
        {tab === "company" && <CompanySection />}
        {tab === "studymap" && <StudyMapSection />}
        {tab === "technical" && <QASection items={technicalQA} searchable />}
        {tab === "behavioral" && <BehavioralSection />}
        {tab === "pitch" && <PitchSection />}
        {tab === "checklist" && <ChecklistSection />}
      </div>
    </div>
  );
}

/* ---------------- Overview ---------------- */

function Overview({ onJump }: { onJump: (t: TabId) => void }) {
  const cards: { id: TabId; title: string; desc: string; icon: React.ReactNode }[] =
    [
      {
        id: "company",
        title: "Know the company",
        desc: `${company.name} — ${company.tagline}. Rebranded from Intuitive.Cloud in Nov 2025, going AI-first.`,
        icon: <Building2 size={18} />,
      },
      {
        id: "studymap",
        title: "Every JD line → a lesson",
        desc: `${studyMap.length} JD areas mapped to exactly what to study in this course.`,
        icon: <MapIcon size={18} />,
      },
      {
        id: "technical",
        title: "Technical Q&A",
        desc: `${technicalQA.length} likely questions with model answers — Claude, RAG, agents, evals, governance.`,
        icon: <Code2 size={18} />,
      },
      {
        id: "behavioral",
        title: "Behavioral & fit",
        desc: `${behavioralQA.length} answers including a strong "Why Intuitive.ai".`,
        icon: <Users size={18} />,
      },
      {
        id: "pitch",
        title: "Pitch & process",
        desc: "Your 60-second pitch, JD talking points, the likely interview stages, and questions to ask.",
        icon: <Megaphone size={18} />,
      },
      {
        id: "checklist",
        title: "Last-mile checklist",
        desc: `${checklist.length} things to be able to do cold before you walk in.`,
        icon: <ListChecks size={18} />,
      },
    ];

  return (
    <div>
      <div className="rounded-2xl border border-clay/30 bg-clay-50/60 p-6 mb-8">
        <h2 className="font-serif text-xl font-semibold text-ink mb-2">
          The one-line read on this role
        </h2>
        <p className="text-ink-soft leading-relaxed">
          They want a Claude specialist who can ship{" "}
          <strong>governed, production-grade</strong> AI for{" "}
          <strong>regulated enterprises</strong> — RAG over their knowledge,
          agentic workflows, long-context document work, all proven with{" "}
          <strong>evals</strong> and wrapped in <strong>safety & governance</strong>.
          Frame every answer around reliability and business outcomes, not demos.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => onJump(c.id)}
            className="group text-left rounded-xl border border-cream-300 bg-white/40 p-5 hover:border-clay/40 hover:bg-clay-50/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="h-9 w-9 rounded-lg bg-cream-100 text-clay-dark flex items-center justify-center">
                {c.icon}
              </span>
              <ArrowRight
                size={16}
                className="text-cream-300 group-hover:text-clay transition-colors"
              />
            </div>
            <h3 className="font-medium text-ink mb-1 group-hover:text-clay-dark transition-colors">
              {c.title}
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">{c.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Company ---------------- */

function CompanySection() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-cream-300 bg-white/40 p-6">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          {company.name}
        </h2>
        <p className="text-clay-dark text-sm font-medium mb-3">
          {company.tagline}
        </p>
        <p className="text-ink-soft leading-relaxed">{company.positioning}</p>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-5 text-sm">
          <Fact label="Formerly" value={company.formerName} />
          <Fact label="Founded" value={company.founded} />
          <Fact label="HQ" value={company.hq} />
          <Fact label="Size" value={company.size} />
        </dl>
      </div>

      <div>
        <SectionLabel>Leadership</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {company.leadership.map((p) => (
            <span
              key={p.name}
              className="text-sm rounded-full bg-cream-200 px-3 py-1.5 text-ink-soft"
            >
              <strong className="text-ink">{p.name}</strong> · {p.role}
            </span>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>The aiE™ framework</SectionLabel>
        <div className="rounded-xl border border-sage/40 bg-sage/5 p-5">
          <span className="font-serif text-lg font-semibold text-sage">
            {company.framework.name}
          </span>
          <p className="text-ink-soft leading-relaxed mt-1">
            {company.framework.desc}
          </p>
        </div>
      </div>

      <div>
        <SectionLabel>Products that map to your role</SectionLabel>
        <div className="space-y-2">
          {company.products.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-cream-300 bg-white/40 p-4"
            >
              <div className="font-medium text-ink mb-0.5">{p.name}</div>
              <p className="text-sm text-ink-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <SectionLabel>Partners</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {company.partners.map((p) => (
              <span
                key={p}
                className={`text-xs rounded-full px-2.5 py-1 ${
                  p === "Anthropic"
                    ? "bg-clay text-cream-50 font-medium"
                    : "bg-cream-200 text-ink-soft"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel>Credentials</SectionLabel>
          <ul className="space-y-1">
            {company.credentials.map((c) => (
              <li key={c} className="text-sm text-ink-soft flex gap-2">
                <span className="text-ochre">◆</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <SectionLabel>Industries (think regulated)</SectionLabel>
        <ul className="space-y-1">
          {company.industries.map((i) => (
            <li key={i} className="text-sm text-ink-soft flex gap-2">
              <ChevronRight size={15} className="text-clay shrink-0 mt-0.5" />
              {i}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SectionLabel>Talking points to drop naturally</SectionLabel>
        <div className="space-y-2">
          {company.facts.map((f, i) => (
            <div
              key={i}
              className="rounded-lg border-l-2 border-clay/40 bg-clay-50/30 px-4 py-3 text-sm text-ink-soft leading-relaxed"
            >
              <RichText text={f} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Study map ---------------- */

function StudyMapSection() {
  return (
    <div className="space-y-4">
      <p className="text-ink-muted text-sm mb-2">
        Each JD responsibility, what they&apos;re really testing, and the exact
        lessons that cover it.
      </p>
      {studyMap.map((area, i) => (
        <div
          key={i}
          className="rounded-xl border border-cream-300 bg-white/40 p-5"
        >
          <div className="flex gap-3">
            <span className="font-serif text-clay-dark text-sm shrink-0 mt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-ink leading-snug">{area.jd}</h3>
              <p className="text-sm text-ink-muted leading-relaxed mt-1">
                {area.why}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {area.lessons.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/learn/${l.slug}`}
                    className="group inline-flex items-center gap-1 text-xs rounded-full border border-cream-300 bg-cream-100 px-2.5 py-1 text-ink-soft hover:border-clay/40 hover:text-clay-dark transition-colors"
                  >
                    {l.title}
                    <ArrowRight
                      size={11}
                      className="text-cream-300 group-hover:text-clay transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Q&A (technical) ---------------- */

function QASection({
  items,
  searchable,
}: {
  items: PrepQA[];
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [open, setOpen] = useState<string | null>(items[0]?.q ?? null);

  const topics = useMemo(
    () => ["All", ...Array.from(new Set(items.map((q) => q.topic)))],
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((item) => {
      const matchTopic = topic === "All" || item.topic === topic;
      const matchQuery =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q);
      return matchTopic && matchQuery;
    });
  }, [items, query, topic]);

  return (
    <div>
      {searchable && (
        <>
          <div className="relative mb-4">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              className="w-full rounded-xl border border-cream-300 bg-white/60 pl-10 pr-4 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none focus:border-clay/50"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
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
        </>
      )}

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
                  className={`text-ink-muted shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 animate-accordion">
                  <p className="text-ink-soft leading-relaxed border-l-2 border-clay/40 pl-4">
                    <RichText text={item.a} />
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-ink-muted py-10">
            No questions match your search.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Behavioral ---------------- */

function BehavioralSection() {
  return (
    <div>
      <div className="rounded-xl border border-sage/40 bg-sage/5 p-4 mb-6 text-sm text-ink-soft leading-relaxed">
        Answer behavioral questions with <strong>STAR</strong> (Situation, Task,
        Action, Result) and land every fit answer on{" "}
        <strong>reliability, governance, and business outcomes</strong> — that&apos;s
        Intuitive&apos;s whole positioning.
      </div>
      <QASection items={behavioralQA} />
    </div>
  );
}

/* ---------------- Pitch & process ---------------- */

function PitchSection() {
  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Your 60-second pitch</SectionLabel>
        <div className="rounded-2xl border border-clay/30 bg-clay-50/60 p-6">
          <p className="text-ink-soft leading-relaxed italic">
            &ldquo;{talkTrack.pitch}&rdquo;
          </p>
        </div>
      </div>

      <div>
        <SectionLabel>JD talking points (one line each)</SectionLabel>
        <div className="space-y-2">
          {talkTrack.points.map((p, i) => (
            <div
              key={i}
              className="flex gap-2.5 rounded-lg border border-cream-300 bg-white/40 px-4 py-3 text-sm text-ink-soft leading-relaxed"
            >
              <span className="text-clay shrink-0">▹</span>
              <span>
                <RichText text={p} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Likely interview stages</SectionLabel>
        <div className="space-y-3">
          {interviewStages.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-cream-300 bg-white/40 p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="h-6 w-6 rounded-full bg-ink text-cream-50 text-xs flex items-center justify-center font-medium shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-medium text-ink">{s.stage}</h3>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed mb-2">
                <span className="text-ink-muted">What it covers — </span>
                {s.what}
              </p>
              <p className="text-sm text-ink-soft leading-relaxed border-l-2 border-sage/50 pl-3">
                <span className="font-medium text-sage">Prep — </span>
                {s.prep}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Smart questions to ask them</SectionLabel>
        <ul className="space-y-2">
          {questionsToAsk.map((q, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm text-ink-soft leading-relaxed"
            >
              <HelpCircle size={16} className="text-clay shrink-0 mt-0.5" />
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Checklist ---------------- */

function ChecklistSection() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / checklist.length) * 100);

  return (
    <div>
      <div className="flex justify-between text-sm text-ink-muted mb-1.5">
        <span>Walk-in readiness</span>
        <span>
          {done}/{checklist.length}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-cream-300 overflow-hidden mb-6">
        <div
          className="h-full bg-sage rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2">
        {checklist.map((item, i) => {
          const isChecked = !!checked[i];
          return (
            <button
              key={i}
              onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
              className={`w-full flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${
                isChecked
                  ? "border-sage/40 bg-sage/5"
                  : "border-cream-300 bg-white/40 hover:border-clay/30"
              }`}
            >
              <span
                className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? "bg-sage border-sage text-cream-50"
                    : "border-cream-300 bg-white"
                }`}
              >
                {isChecked && "✓"}
              </span>
              <span
                className={`text-sm leading-relaxed ${
                  isChecked ? "text-ink-muted line-through" : "text-ink-soft"
                }`}
              >
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- shared bits ---------------- */

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-faint text-xs uppercase tracking-wide">{label}</dt>
      <dd className="text-ink-soft">{value}</dd>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[0.72rem] font-bold uppercase tracking-wider text-ink-muted mb-3">
      {children}
    </h3>
  );
}
