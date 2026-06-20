import Link from "next/link";
import { modules, totalLessons, totalMinutes } from "@/lib/curriculum";
import { interviewQA } from "@/lib/interview";
import { glossary } from "@/lib/glossary";
import {
  ArrowRight,
  Sparkles,
  Layers,
  MessagesSquare,
  BookOpen,
  Wrench,
  Database,
  FlaskConical,
  Cpu,
} from "lucide-react";

const accent: Record<string, { dot: string; ring: string; text: string }> = {
  clay: { dot: "bg-clay", ring: "group-hover:border-clay/50", text: "text-clay-dark" },
  sage: { dot: "bg-sage", ring: "group-hover:border-sage/50", text: "text-sage" },
  ochre: { dot: "bg-ochre", ring: "group-hover:border-ochre/50", text: "text-ochre" },
  slateblue: { dot: "bg-slateblue", ring: "group-hover:border-slateblue/50", text: "text-slateblue" },
};

const moduleIcon: Record<string, React.ReactNode> = {
  foundations: <Layers size={20} />,
  prompting: <BookOpen size={20} />,
  evals: <FlaskConical size={20} />,
  agents: <Wrench size={20} />,
  rag: <Database size={20} />,
  advanced: <Cpu size={20} />,
};

export default function Home() {
  const firstLesson = modules[0].lessons[0].slug;
  return (
    <main className="min-h-screen paper-grain">
      {/* nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-clay flex items-center justify-center text-cream-50 font-serif font-bold">
            C
          </span>
          <span className="font-serif text-lg font-semibold text-ink">Claude Academy</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/learn" className="hover:text-clay transition-colors">Curriculum</Link>
          <Link href="/interview" className="hover:text-clay transition-colors">Interview Q&amp;A</Link>
          <Link href="/glossary" className="hover:text-clay transition-colors">Glossary</Link>
          <Link
            href={`/learn/${firstLesson}`}
            className="rounded-full bg-ink text-cream-50 px-4 py-1.5 hover:bg-clay-dark transition-colors"
          >
            Start
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-clay/30 bg-clay-50 px-3 py-1 text-xs text-clay-dark font-medium mb-6">
              <Sparkles size={13} /> Learn to build with the Anthropic API — and go further
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-ink leading-[1.05] tracking-tight">
              Understand{" "}
              <span className="text-clay">Claude, agents &amp; RAG</span>{" "}
              from the ground up.
            </h1>
            <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
              A beautiful, visual course built on Anthropic&apos;s &ldquo;Build with Claude&rdquo;
              curriculum — then taken much further: prompting, tool use, agents, MCP,
              retrieval, evaluations and the mental models behind them. No setup. Just
              concepts, diagrams, and the confidence to answer any question.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/learn/${firstLesson}`}
                className="group inline-flex items-center gap-2 rounded-full bg-clay text-cream-50 px-6 py-3 font-medium hover:bg-clay-dark transition-all active:scale-[0.98] shadow-sm"
              >
                Start learning
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 font-medium text-ink-soft hover:border-clay/40 hover:text-clay-dark transition-colors"
              >
                Browse the curriculum
              </Link>
            </div>
            <div className="mt-9 flex gap-8 text-sm">
              <Stat value={`${totalLessons}`} label="lessons" />
              <Stat value={`${modules.length}`} label="modules" />
              <Stat value={`~${Math.round(totalMinutes / 60)}h`} label="of focused reading" />
            </div>
          </div>

          <HeroArt />
        </div>
      </section>

      {/* modules */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">The curriculum</h2>
            <p className="text-ink-muted mt-1">Six modules, beginner to frontier.</p>
          </div>
          <Link href="/learn" className="text-clay-dark hover:text-clay text-sm font-medium hidden sm:flex items-center gap-1">
            See all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => {
            const a = accent[m.accent];
            return (
              <Link
                key={m.id}
                href={`/learn/${m.lessons[0].slug}`}
                className={`group rounded-2xl border border-cream-300 bg-white/50 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${a.ring}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`h-11 w-11 rounded-xl bg-cream-100 flex items-center justify-center ${a.text}`}>
                    {moduleIcon[m.id]}
                  </span>
                  <span className="text-xs text-ink-faint font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-ink mb-1.5">{m.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-4">{m.blurb}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.lessons.slice(0, 3).map((l) => (
                    <span key={l.slug} className="text-[0.7rem] rounded-full bg-cream-200 text-ink-soft px-2 py-0.5">
                      {l.title.length > 22 ? l.title.slice(0, 22) + "…" : l.title}
                    </span>
                  ))}
                  {m.lessons.length > 3 && (
                    <span className="text-[0.7rem] rounded-full bg-cream-200 text-ink-muted px-2 py-0.5">
                      +{m.lessons.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* learning aids */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-ink text-cream-100 p-10 sm:p-12">
          <h2 className="font-serif text-3xl font-semibold text-cream-50 mb-2">
            Built to make it stick
          </h2>
          <p className="text-cream-100/70 max-w-2xl mb-10">
            Every lesson pairs plain-English explanations with custom diagrams, then helps
            you remember it.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Aid icon={<Layers size={18} />} title="Hand-drawn diagrams" text="Bespoke visuals for every concept — the agent loop, RAG pipeline, caching, embeddings, and more." />
            <Aid icon={<Sparkles size={18} />} title="Quizzes & flashcards" text="Check yourself after each lesson and flip cards to lock the ideas into memory." />
            <Aid icon={<MessagesSquare size={18} />} title={`${interviewQA.length} interview Q&As`} text="Model answers to the questions you'll actually be asked about Claude, agents, and RAG." />
            <Aid icon={<BookOpen size={18} />} title={`${glossary.length}-term glossary`} text="Searchable definitions for every piece of jargon, cross-linked to related terms." />
          </div>
        </div>
      </section>

      <footer className="border-t border-cream-300">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-muted">
          <span>Claude Academy — a personal learning companion.</span>
          <Link href={`/learn/${firstLesson}`} className="text-clay-dark hover:text-clay font-medium flex items-center gap-1">
            Begin with Foundations <ArrowRight size={14} />
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-2xl font-semibold text-ink">{value}</div>
      <div className="text-ink-muted text-xs uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Aid({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div>
      <div className="h-10 w-10 rounded-xl bg-clay/20 text-clay-light flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-cream-50 mb-1.5">{title}</h3>
      <p className="text-sm text-cream-100/65 leading-relaxed">{text}</p>
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="rounded-3xl border border-cream-300 bg-cream-50 p-6 shadow-sm">
        <svg viewBox="0 0 400 360" width="100%">
          {/* central node */}
          <circle cx="200" cy="180" r="46" fill="#F7EBE5" stroke="#CC785C" strokeWidth="2" />
          <text x="200" y="178" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="22" fontWeight="600" fill="#1A1915">Claude</text>
          <text x="200" y="198" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fill="#6B665B">reasoning engine</text>

          {[
            { x: 70, y: 70, t: "Prompts", c: "#6A7C5C", bg: "#EAEEE4" },
            { x: 330, y: 70, t: "Tools", c: "#C99A3A", bg: "#F6EFDC" },
            { x: 60, y: 290, t: "RAG", c: "#5B6B82", bg: "#E6EAF0" },
            { x: 340, y: 290, t: "Agents", c: "#CC785C", bg: "#F7EBE5" },
          ].map((n, i) => (
            <g key={i}>
              <line x1="200" y1="180" x2={n.x} y2={n.y} stroke="#C9C3B2" strokeWidth="1.5" strokeDasharray="5 5" className="animate-flow" />
              <circle cx={n.x} cy={n.y} r="34" fill={n.bg} stroke={n.c} strokeWidth="1.5" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" fill="#1A1915">{n.t}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-3 rotate-3 rounded-xl bg-white border border-cream-300 px-4 py-2 shadow-md text-xs font-mono text-ink-soft hidden sm:block">
        stop_reason: <span className="text-sage">&quot;end_turn&quot;</span>
      </div>
    </div>
  );
}
