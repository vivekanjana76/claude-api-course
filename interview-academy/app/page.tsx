import Link from "next/link";
import { modules, totalLessons, totalMinutes } from "@/lib/curriculum";
import { interviewQA } from "@/lib/interview";
import { glossary } from "@/lib/glossary";
import { patterns } from "@/lib/patterns";
import { Logo } from "@/components/Logo";
import { ContinueLearning } from "@/components/ContinueLearning";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Trees,
  Network,
  Languages,
  Bot,
  Rocket,
  LayoutGrid,
  MessagesSquare,
  Layers,
  Workflow,
  BookOpen,
  Target,
} from "lucide-react";

const accent: Record<string, { dot: string; ring: string; text: string; chip: string }> = {
  iris: { dot: "bg-iris", ring: "group-hover:border-iris/50", text: "text-iris", chip: "bg-iris-50 text-iris-dark" },
  teal: { dot: "bg-teal", ring: "group-hover:border-teal/50", text: "text-teal-dark", chip: "bg-teal-50 text-teal-dark" },
  amber: { dot: "bg-amber", ring: "group-hover:border-amber/50", text: "text-amber-dark", chip: "bg-amber-50 text-amber-dark" },
  rose: { dot: "bg-rose", ring: "group-hover:border-rose/50", text: "text-rose-dark", chip: "bg-rose-50 text-rose-dark" },
};

const moduleIcon: Record<string, React.ReactNode> = {
  foundations: <Brain size={20} />,
  classic: <Trees size={20} />,
  deeplearning: <Network size={20} />,
  nlp: <Languages size={20} />,
  llms: <Bot size={20} />,
  mlops: <Rocket size={20} />,
  systemdesign: <LayoutGrid size={20} />,
  behavioral: <MessagesSquare size={20} />,
};

export default function Home() {
  const firstLesson = modules[0].lessons[0].slug;
  return (
    <main className="min-h-screen circuit-grid">
      {/* nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-display text-lg font-semibold text-ink tracking-tight">Interview Academy</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/learn" className="hover:text-iris transition-colors">Curriculum</Link>
          <Link href="/patterns" className="hover:text-iris transition-colors">Patterns</Link>
          <Link href="/cheatsheets" className="hover:text-iris transition-colors">Cheatsheets</Link>
          <Link href="/prep" className="hover:text-iris transition-colors">Prep</Link>
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
                <Sparkles size={13} /> Everything you need to walk into an AI/ML interview prepared
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-semibold text-ink leading-[1.05] tracking-tight">
                Ace your{" "}
                <span className="text-iris">AI</span>
                {" "}&amp;{" "}
                <span className="text-teal-dark">machine-learning</span>
                {" "}interviews.
              </h1>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
                A beautiful, visual crash course covering the whole map: ML foundations, classic
                algorithms, deep learning, transformers &amp; LLMs, MLOps, and system design — plus
                model answers, worked examples, and behavioral strategy. Everything one person should
                know to interview for an AI role, explained from first principles.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/learn/${firstLesson}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-iris text-canvas-50 px-6 py-3 font-medium hover:bg-iris-dark transition-all active:scale-[0.98] shadow-sm"
                >
                  Start preparing
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/interview"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 font-medium text-ink-soft hover:border-iris/40 hover:text-iris-dark transition-colors"
                >
                  Jump to Interview Q&amp;A
                </Link>
              </div>
              <div className="mt-9 flex gap-8 text-sm">
                <Stat value={`${totalLessons}`} label="lessons" />
                <Stat value={`${interviewQA.length}+`} label="model answers" />
                <Stat value={`~${Math.max(1, Math.round(totalMinutes / 60))}h`} label="of focused reading" />
              </div>
            </div>

            <HeroArt />
          </div>
        </div>
      </section>

      {/* resume */}
      <section className="max-w-6xl mx-auto px-6 pt-10 -mb-6">
        <ContinueLearning />
      </section>

      {/* modules */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink tracking-tight">The curriculum</h2>
            <p className="text-ink-muted mt-1">Fundamentals first, then the algorithms, modern AI, and the judgment that gets offers — growing every week.</p>
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
                    {moduleIcon[m.id] ?? <Layers size={20} />}
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

      {/* prep spotlight */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Link
          href="/prep"
          className="group block rounded-3xl border border-iris/30 bg-iris-50/60 p-8 sm:p-10 transition-all hover:border-iris/50 hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <span className="h-14 w-14 rounded-2xl bg-iris text-canvas-50 flex items-center justify-center shrink-0">
              <Target size={26} />
            </span>
            <div className="flex-1">
              <div className="text-iris-dark font-medium text-xs uppercase tracking-wider mb-1">
                Your game plan
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                The AI Interview Prep Roadmap
              </h2>
              <p className="text-ink-soft mt-2 max-w-2xl leading-relaxed">
                A phase-by-phase plan — fundamentals, algorithms, deep learning, transformers &amp;
                LLMs, MLOps &amp; system design, and behavioral — each with the must-know questions,
                one-line memory hooks, and the single idea to walk away with. Plus rapid-fire drills
                to test yourself the night before.
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
            you remember it — and rehearse it out loud.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Aid icon={<Network size={18} />} title="Custom diagrams" text="Bespoke visuals for the ideas that trip people up — bias–variance, gradient descent, attention, RAG, and the ML lifecycle." />
            <Aid icon={<Sparkles size={18} />} title="Quizzes & flashcards" text="Check yourself after each lesson and flip cards to lock the concepts into memory before the interview." />
            <Aid icon={<MessagesSquare size={18} />} title={`${interviewQA.length}+ model answers`} text="Full worked answers to the questions you'll actually be asked — the way you'd want to say them out loud." />
            <Aid icon={<BookOpen size={18} />} title={`${glossary.length}-term glossary`} text="Searchable, cross-linked definitions for every acronym and technique, from AUC to RLHF." />
          </div>
        </div>
      </section>

      <footer className="border-t border-canvas-300">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-muted">
          <span>Interview Academy — a personal companion for AI &amp; machine-learning job interviews.</span>
          <Link href={`/learn/${firstLesson}`} className="text-iris-dark hover:text-iris font-medium flex items-center gap-1">
            Begin with ML Foundations <ArrowRight size={14} />
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
  // A small neural network firing — the shape of the thing you're learning to explain.
  const layers = [
    { x: 70, ys: [70, 140, 210] },
    { x: 190, ys: [50, 120, 190, 260] },
    { x: 310, ys: [90, 160, 230] },
  ];
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="rounded-3xl border border-canvas-300 bg-canvas-50 p-6 shadow-sm">
        <svg viewBox="0 0 400 320" width="100%">
          {/* connections */}
          {layers.slice(0, -1).map((L, li) =>
            L.ys.map((y1, i) =>
              layers[li + 1].ys.map((y2, j) => (
                <line
                  key={`${li}-${i}-${j}`}
                  x1={L.x}
                  y1={y1}
                  x2={layers[li + 1].x}
                  y2={y2}
                  stroke="#C4D5E8"
                  strokeWidth="0.9"
                  opacity="0.7"
                />
              ))
            )
          )}
          {/* output edges */}
          {layers[2].ys.map((y, i) => (
            <line key={i} x1="310" y1={y} x2="360" y2="160" stroke="#C43E86" strokeWidth="1.1" opacity="0.8" />
          ))}
          {/* nodes */}
          {layers.map((L, li) =>
            L.ys.map((y, i) => (
              <circle
                key={`${li}-${i}`}
                cx={L.x}
                cy={y}
                r="12"
                fill="#FFFFFF"
                stroke={li === 0 ? "#2563EB" : li === 1 ? "#0E9BB5" : "#C43E86"}
                strokeWidth="2"
              />
            ))
          )}
          <circle cx="360" cy="160" r="14" fill="#E7EFFD" stroke="#2563EB" strokeWidth="2" />
          {/* labels */}
          <text x="70" y="255" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" fill="#2563EB">input</text>
          <text x="190" y="292" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" fill="#0A7387">hidden</text>
          <text x="310" y="270" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" fill="#9C2C68">hidden</text>
          <text x="360" y="192" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" fill="#2563EB">ŷ</text>
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-3 rotate-3 rounded-xl bg-canvas-50 border border-canvas-300 px-4 py-2 shadow-md text-xs font-mono text-ink-soft hidden sm:block">
        explain it <span className="text-teal-dark">out loud</span>
      </div>
    </div>
  );
}
