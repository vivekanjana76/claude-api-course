import Link from "next/link";
import { modules, totalLessons, totalMinutes } from "@/lib/curriculum";
import { interviewQA } from "@/lib/interview";
import { glossary } from "@/lib/glossary";
import { patterns } from "@/lib/patterns";
import { Logo } from "@/components/Logo";
import {
  ArrowRight,
  Sparkles,
  Boxes,
  Brain,
  Wrench,
  Network,
  Users,
  Library,
  ShieldCheck,
  Workflow,
  MessagesSquare,
  BookOpen,
} from "lucide-react";

const accent: Record<string, { dot: string; ring: string; text: string; chip: string }> = {
  iris: { dot: "bg-iris", ring: "group-hover:border-iris/50", text: "text-iris", chip: "bg-iris-50 text-iris-dark" },
  teal: { dot: "bg-teal", ring: "group-hover:border-teal/50", text: "text-teal-dark", chip: "bg-teal-50 text-teal-dark" },
  amber: { dot: "bg-amber", ring: "group-hover:border-amber/50", text: "text-amber-dark", chip: "bg-amber-50 text-amber-dark" },
  rose: { dot: "bg-rose", ring: "group-hover:border-rose/50", text: "text-rose-dark", chip: "bg-rose-50 text-rose-dark" },
};

const moduleIcon: Record<string, React.ReactNode> = {
  foundations: <Boxes size={20} />,
  reasoning: <Brain size={20} />,
  tools: <Wrench size={20} />,
  orchestration: <Network size={20} />,
  crewai: <Users size={20} />,
  frameworks: <Library size={20} />,
  production: <ShieldCheck size={20} />,
};

export default function Home() {
  const firstLesson = modules[0].lessons[0].slug;
  return (
    <main className="min-h-screen circuit-grid">
      {/* nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-display text-lg font-semibold text-ink tracking-tight">Agent Academy</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/learn" className="hover:text-iris transition-colors">Curriculum</Link>
          <Link href="/patterns" className="hover:text-iris transition-colors">Patterns</Link>
          <Link href="/interview" className="hover:text-iris transition-colors">Interview Q&amp;A</Link>
          <Link href="/glossary" className="hover:text-iris transition-colors">Glossary</Link>
          <Link
            href={`/learn/${firstLesson}`}
            className="rounded-full bg-ink text-canvas-50 px-4 py-1.5 hover:bg-iris-dark transition-colors"
          >
            Start
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section className="aurora">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-iris/30 bg-iris-50 px-3 py-1 text-xs text-iris-dark font-medium mb-6">
                <Sparkles size={13} /> From first principles to production multi-agent systems
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-semibold text-ink leading-[1.05] tracking-tight">
                Master{" "}
                <span className="text-iris">Agentic AI</span>
                {" "}— agents, orchestration &amp; CrewAI.
              </h1>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
                A beautiful, visual course on building AI agents: the agent loop, reasoning
                &amp; planning, tools and memory, multi-agent orchestration, CrewAI,
                LangGraph, and shipping agents to production. No setup — just concepts,
                custom diagrams, and the confidence to design real systems.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/learn/${firstLesson}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-iris text-canvas-50 px-6 py-3 font-medium hover:bg-iris-dark transition-all active:scale-[0.98] shadow-sm"
                >
                  Start learning
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/patterns"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 font-medium text-ink-soft hover:border-iris/40 hover:text-iris-dark transition-colors"
                >
                  Browse pattern catalog
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
        </div>
      </section>

      {/* modules */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink tracking-tight">The curriculum</h2>
            <p className="text-ink-muted mt-1">Seven modules, fundamentals to frontier.</p>
          </div>
          <Link href="/learn" className="text-iris-dark hover:text-iris text-sm font-medium hidden sm:flex items-center gap-1">
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
                className={`group rounded-2xl border border-canvas-300 bg-canvas-50/60 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${a.ring}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`h-11 w-11 rounded-xl bg-canvas-100 flex items-center justify-center ${a.text}`}>
                    {moduleIcon[m.id]}
                  </span>
                  <span className="text-xs text-ink-faint font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-1.5">{m.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-4">{m.blurb}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.lessons.slice(0, 3).map((l) => (
                    <span key={l.slug} className={`text-[0.7rem] rounded-full px-2 py-0.5 ${a.chip}`}>
                      {l.title.length > 22 ? l.title.slice(0, 22) + "…" : l.title}
                    </span>
                  ))}
                  {m.lessons.length > 3 && (
                    <span className="text-[0.7rem] rounded-full bg-canvas-200 text-ink-muted px-2 py-0.5">
                      +{m.lessons.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* pattern catalog spotlight */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Link
          href="/patterns"
          className="group block rounded-3xl border border-iris/30 bg-iris-50/60 p-8 sm:p-10 transition-all hover:border-iris/50 hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <span className="h-14 w-14 rounded-2xl bg-iris text-canvas-50 flex items-center justify-center shrink-0">
              <Workflow size={26} />
            </span>
            <div className="flex-1">
              <div className="text-iris-dark font-medium text-xs uppercase tracking-wider mb-1">
                Quick reference
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                The Agentic Pattern Catalog
              </h2>
              <p className="text-ink-soft mt-2 max-w-2xl leading-relaxed">
                {patterns.length} battle-tested design patterns — ReAct, plan-and-execute,
                reflection, supervisor, handoff, agentic RAG and more — each with a diagram,
                when to reach for it, and what to watch out for.
              </p>
            </div>
            <ArrowRight
              size={22}
              className="text-iris shrink-0 group-hover:translate-x-1 transition-transform hidden sm:block"
            />
          </div>
        </Link>
      </section>

      {/* learning aids */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-ink text-canvas-100 p-10 sm:p-12">
          <h2 className="font-display text-3xl font-semibold text-canvas-50 mb-2 tracking-tight">
            Built to make it stick
          </h2>
          <p className="text-canvas-100/70 max-w-2xl mb-10">
            Every lesson pairs plain-English explanations with custom diagrams, then helps
            you remember it.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Aid icon={<Network size={18} />} title="Custom diagrams" text="Bespoke visuals for every concept — the agent loop, ReAct, orchestration topologies, CrewAI, LangGraph, and more." />
            <Aid icon={<Sparkles size={18} />} title="Quizzes & flashcards" text="Check yourself after each lesson and flip cards to lock the ideas into memory." />
            <Aid icon={<MessagesSquare size={18} />} title={`${interviewQA.length} interview Q&As`} text="Model answers to the questions you'll actually be asked about agents, orchestration, and frameworks." />
            <Aid icon={<BookOpen size={18} />} title={`${glossary.length}-term glossary`} text="Searchable definitions for every piece of jargon, cross-linked to related terms." />
          </div>
        </div>
      </section>

      <footer className="border-t border-canvas-300">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-muted">
          <span>Agent Academy — a personal learning companion for agentic AI.</span>
          <Link href={`/learn/${firstLesson}`} className="text-iris-dark hover:text-iris font-medium flex items-center gap-1">
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
      <div className="font-display text-2xl font-semibold text-ink">{value}</div>
      <div className="text-ink-muted text-xs uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Aid({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div>
      <div className="h-10 w-10 rounded-xl bg-iris/20 text-iris-light flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-canvas-50 mb-1.5">{title}</h3>
      <p className="text-sm text-canvas-100/65 leading-relaxed">{text}</p>
    </div>
  );
}

function HeroArt() {
  // An orchestration graph: a supervisor hub coordinating specialist agents.
  const sats = [
    { x: 90, y: 70, t: "Planner", c: "#0FA39A", bg: "#E3F5F3" },
    { x: 320, y: 50, t: "Researcher", c: "#D9892A", bg: "#F8EEDB" },
    { x: 70, y: 280, t: "Coder", c: "#D6537F", bg: "#FBE9F0" },
    { x: 330, y: 290, t: "Reviewer", c: "#6C4FE0", bg: "#EFEBFD" },
  ];
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="rounded-3xl border border-canvas-300 bg-canvas-50 p-6 shadow-sm">
        <svg viewBox="0 0 400 360" width="100%">
          {sats.map((n, i) => (
            <line
              key={`l-${i}`}
              x1="200"
              y1="180"
              x2={n.x + 36}
              y2={n.y + 18}
              stroke="#C9C4DA"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              className="animate-flow"
            />
          ))}
          {/* supervisor hub */}
          <circle cx="200" cy="180" r="50" fill="#EFEBFD" stroke="#6C4FE0" strokeWidth="2" />
          <text x="200" y="176" textAnchor="middle" fontFamily="var(--font-display)" fontSize="17" fontWeight="600" fill="#15131F">
            Supervisor
          </text>
          <text x="200" y="196" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10.5" fill="#6A6580">
            delegates &amp; synthesizes
          </text>
          {sats.map((n, i) => (
            <g key={`n-${i}`}>
              <rect x={n.x} y={n.y} width="80" height="38" rx="9" fill={n.bg} stroke={n.c} strokeWidth="1.5" />
              <text x={n.x + 40} y={n.y + 23} textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#15131F">
                {n.t}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-3 rotate-3 rounded-xl bg-canvas-50 border border-canvas-300 px-4 py-2 shadow-md text-xs font-mono text-ink-soft hidden sm:block">
        while not done: <span className="text-teal-dark">act()</span>
      </div>
    </div>
  );
}
