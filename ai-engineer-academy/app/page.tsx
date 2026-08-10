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
  MessageSquareCode,
  Database,
  Layers,
  Bot,
  Plug,
  SlidersHorizontal,
  Gauge,
  ClipboardCheck,
  Workflow,
  ShieldAlert,
  Image as ImageIcon,
  PenTool,
  Briefcase,
  MessagesSquare,
  BookOpen,
  Network,
} from "lucide-react";

const accent: Record<string, { dot: string; ring: string; text: string; chip: string }> = {
  iris: { dot: "bg-iris", ring: "group-hover:border-iris/50", text: "text-iris", chip: "bg-iris-50 text-iris-dark" },
  teal: { dot: "bg-teal", ring: "group-hover:border-teal/50", text: "text-teal-dark", chip: "bg-teal-50 text-teal-dark" },
  amber: { dot: "bg-amber", ring: "group-hover:border-amber/50", text: "text-amber-dark", chip: "bg-amber-50 text-amber-dark" },
  rose: { dot: "bg-rose", ring: "group-hover:border-rose/50", text: "text-rose-dark", chip: "bg-rose-50 text-rose-dark" },
};

const moduleIcon: Record<string, React.ReactNode> = {
  foundations: <Brain size={20} />,
  prompting: <MessageSquareCode size={20} />,
  retrieval: <Database size={20} />,
  rag: <Layers size={20} />,
  agents: <Bot size={20} />,
  mcp: <Plug size={20} />,
  finetuning: <SlidersHorizontal size={20} />,
  inference: <Gauge size={20} />,
  evals: <ClipboardCheck size={20} />,
  production: <Workflow size={20} />,
  safety: <ShieldAlert size={20} />,
  multimodal: <ImageIcon size={20} />,
  systemdesign: <PenTool size={20} />,
  role: <Briefcase size={20} />,
};

export default function Home() {
  const firstLesson = modules[0].lessons[0].slug;
  return (
    <main className="min-h-screen circuit-grid">
      {/* nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-display text-lg font-semibold text-ink tracking-tight">AI Engineer Academy</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/learn" className="hover:text-iris transition-colors">Curriculum</Link>
          <Link href="/prep" className="hover:text-iris transition-colors">Prep</Link>
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
                <Sparkles size={13} /> The 2026 GenAI stack — and the interview that tests it
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-semibold text-ink leading-[1.05] tracking-tight">
                Become an{" "}
                <span className="text-iris">AI</span>
                {" "}
                <span className="text-teal-dark">Engineer</span>.
              </h1>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
                A complete, visual curriculum for the role everyone is hiring for: context
                engineering, embeddings and RAG, agents and tool use, MCP, fine-tuning and
                alignment, inference and serving, evals, LLMOps, guardrails and AI safety —
                plus system-design walkthroughs and the interview questions you&apos;ll
                actually be asked.
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
                  href="/glossary"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 font-medium text-ink-soft hover:border-iris/40 hover:text-iris-dark transition-colors"
                >
                  Browse the 2026 keyword radar
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

      {/* resume */}
      <section className="max-w-6xl mx-auto px-6 pt-10 -mb-6">
        <ContinueLearning />
      </section>

      {/* modules */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink tracking-tight">The curriculum</h2>
            <p className="text-ink-muted mt-1">How the model works, then everything you build around it.</p>
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
                The GenAI Architecture Catalog
              </h2>
              <p className="text-ink-soft mt-2 max-w-2xl leading-relaxed">
                {patterns.length} patterns you&apos;ll be asked to draw on a whiteboard — the RAG
                pipeline, agentic retrieval, the tool-calling loop, a supervisor over
                sub-agents, an LLM gateway with fallbacks, semantic caching, the guardrail
                sandwich and human-in-the-loop review — each with a diagram, when to reach for
                it, and what to watch out for.
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
            Every lesson pairs plain-English explanations with custom diagrams, then helps you
            remember it long enough to use it in an interview and on the job.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Aid icon={<Network size={18} />} title="Custom AI diagrams" text="Bespoke visuals for the decode loop, the RAG pipeline, agent topologies, KV caching, LoRA, the guardrail sandwich, and the inference latency budget." />
            <Aid icon={<Sparkles size={18} />} title="Quizzes & flashcards" text="Check yourself after each lesson, track mastery per module, and flip cards until the vocabulary is automatic." />
            <Aid icon={<MessagesSquare size={18} />} title={`${interviewQA.length} interview Q&As`} text="Model answers to the questions AI Engineer panels actually ask — retrieval, agents, evals, cost, latency, and safety." />
            <Aid icon={<BookOpen size={18} />} title={`${glossary.length}-term glossary`} text="Every acronym in the job description, with the terms trending right now flagged as a 2026 keyword radar." />
          </div>
        </div>
      </section>

      <footer className="border-t border-canvas-300">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-muted">
          <span>AI Engineer Academy — a personal learning companion for the AI Engineer role.</span>
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
  // The canonical shape of a production GenAI request: a user turn enters the
  // orchestrator, which retrieves context and calls tools before the model
  // streams an answer back through the guardrail layer.
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="rounded-3xl border border-canvas-300 bg-canvas-50 p-6 shadow-sm">
        <svg viewBox="0 0 400 360" width="100%">
          <text x="30" y="26" fontFamily="var(--font-display)" fontSize="12" fontWeight="600" fill="#A21CAF">
            one request, end to end
          </text>

          {/* user */}
          <rect x="150" y="38" width="100" height="32" rx="9" fill="#FFFFFF" stroke="#5A6675" strokeWidth="1.4" />
          <text x="200" y="59" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#101720">User turn</text>

          {/* guardrail in */}
          <rect x="120" y="86" width="160" height="28" rx="8" fill="#FDE7EC" stroke="#BE123C" strokeWidth="1.4" />
          <text x="200" y="105" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" fill="#BE123C">input guardrail</text>
          <line x1="200" y1="70" x2="200" y2="84" stroke="#CBD3DB" strokeWidth="1.5" />

          {/* orchestrator */}
          <rect x="110" y="132" width="180" height="46" rx="11" fill="#FBEAFE" stroke="#A21CAF" strokeWidth="2" />
          <text x="200" y="152" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="700" fill="#A21CAF">Orchestrator</text>
          <text x="200" y="168" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fill="#5A6675">context · tools · loop</text>
          <line x1="200" y1="114" x2="200" y2="130" stroke="#CBD3DB" strokeWidth="1.5" />

          {/* retrieval + tools */}
          <rect x="24" y="200" width="150" height="42" rx="10" fill="#E0F5FA" stroke="#0E7490" strokeWidth="1.5" />
          <text x="99" y="219" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11.5" fontWeight="600" fill="#0E7490">Retrieval</text>
          <text x="99" y="234" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="9.5" fill="#5A6675">vectors + rerank</text>

          <rect x="226" y="200" width="150" height="42" rx="10" fill="#FDF3DC" stroke="#A16207" strokeWidth="1.5" />
          <text x="301" y="219" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11.5" fontWeight="600" fill="#A16207">Tools / MCP</text>
          <text x="301" y="234" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="9.5" fill="#5A6675">APIs, code, data</text>

          <line x1="160" y1="178" x2="105" y2="198" stroke="#0E7490" strokeWidth="1.5" className="animate-flow" strokeDasharray="5 5" />
          <line x1="240" y1="178" x2="295" y2="198" stroke="#A16207" strokeWidth="1.5" className="animate-flow" strokeDasharray="5 5" />

          {/* model */}
          <rect x="110" y="262" width="180" height="46" rx="11" fill="#FFFFFF" stroke="#0E7490" strokeWidth="1.8" />
          <text x="200" y="282" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="700" fill="#0E7490">Model</text>
          <text x="200" y="298" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fill="#5A6675">streamed, cached, routed</text>
          <line x1="99" y1="242" x2="180" y2="260" stroke="#CBD3DB" strokeWidth="1.4" />
          <line x1="301" y1="242" x2="220" y2="260" stroke="#CBD3DB" strokeWidth="1.4" />

          {/* trace rail */}
          <line x1="382" y1="90" x2="382" y2="330" stroke="#A21CAF" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.6" />
          <text x="376" y="215" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="9.5" fill="#A21CAF" transform="rotate(-90 376 215)">traced &amp; evaluated</text>

          {/* answer */}
          <rect x="140" y="326" width="120" height="28" rx="8" fill="#FBEAFE" stroke="#A21CAF" strokeWidth="1.4" />
          <text x="200" y="345" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" fill="#A21CAF">grounded answer</text>
          <line x1="200" y1="308" x2="200" y2="324" stroke="#CBD3DB" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-3 rotate-3 rounded-xl bg-canvas-50 border border-canvas-300 px-4 py-2 shadow-md text-xs font-mono text-ink-soft hidden sm:block">
        evals<span className="text-teal-dark">-</span>first
      </div>
    </div>
  );
}
