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
  GitBranch,
  Container,
  Boxes,
  Rocket,
  Layers,
  Network,
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
  foundations: <GitBranch size={20} />,
  docker: <Container size={20} />,
  kubernetes: <Boxes size={20} />,
  cicd: <Rocket size={20} />,
};

export default function Home() {
  const firstLesson = modules[0].lessons[0].slug;
  return (
    <main className="min-h-screen circuit-grid">
      {/* nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-display text-lg font-semibold text-ink tracking-tight">DevOps Academy</span>
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
                <Sparkles size={13} /> Containers, Kubernetes &amp; CI/CD — from first principles to production
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-semibold text-ink leading-[1.05] tracking-tight">
                Master{" "}
                <span className="text-iris">DevOps</span>
                {" "}— from{" "}
                <span className="text-teal-dark">commit</span>
                {" "}to{" "}
                <span className="text-amber-dark">production</span>.
              </h1>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
                A beautiful, visual course on modern DevOps: Docker and containers, Kubernetes,
                CI/CD with GitHub Actions, Terraform, GitOps with Argo CD, and observability —
                taught from first principles with custom diagrams. No setup, just clear
                explanations of how software actually ships.
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
                  Browse DevOps patterns
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
            <p className="text-ink-muted mt-1">Fundamentals first, then the tools that ship production — growing every week.</p>
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
                The DevOps Pattern Catalog
              </h2>
              <p className="text-ink-soft mt-2 max-w-2xl leading-relaxed">
                {patterns.length} battle-tested patterns — immutable artifacts, CI quality gates,
                build-once-promote, self-healing replicas, Service + Ingress edges, autoscaling and
                progressive delivery — each with a diagram, when to reach for it, and what to watch out for.
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
            <Aid icon={<Network size={18} />} title="Custom diagrams" text="Bespoke visuals for every concept — the DevOps loop, image layers, Kubernetes architecture, CI/CD pipelines, and deployment strategies." />
            <Aid icon={<Sparkles size={18} />} title="Quizzes & flashcards" text="Check yourself after each lesson and flip cards to lock the ideas into memory." />
            <Aid icon={<MessagesSquare size={18} />} title={`${interviewQA.length} interview Q&As`} text="Model answers to the DevOps questions you'll actually be asked — foundations, Docker, Kubernetes, and CI/CD." />
            <Aid icon={<BookOpen size={18} />} title={`${glossary.length}-term glossary`} text="Searchable definitions for every tool and acronym, cross-linked across containers, orchestration, and delivery." />
          </div>
        </div>
      </section>

      <footer className="border-t border-canvas-300">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-muted">
          <span>DevOps Academy — a personal learning companion for containers, Kubernetes &amp; CI/CD.</span>
          <Link href={`/learn/${firstLesson}`} className="text-iris-dark hover:text-iris font-medium flex items-center gap-1">
            Begin with DevOps Foundations <ArrowRight size={14} />
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
  // The pipeline: commit → CI (build/test) → registry → Kubernetes cluster.
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="rounded-3xl border border-canvas-300 bg-canvas-50 p-6 shadow-sm">
        <svg viewBox="0 0 400 360" width="100%">
          {/* git commit */}
          <rect x="140" y="16" width="120" height="40" rx="10" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.6" />
          <text x="200" y="41" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="600" fill="#2563EB">git push</text>

          {/* CI */}
          <rect x="120" y="88" width="160" height="52" rx="11" fill="#FAE7F1" stroke="#C43E86" strokeWidth="1.8" />
          <text x="200" y="110" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="600" fill="#C43E86">CI: build · test</text>
          <text x="200" y="127" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10.5" fill="#5C6A80">GitHub Actions</text>
          <line x1="200" y1="56" x2="200" y2="86" stroke="#C4D5E8" strokeWidth="1.6" strokeDasharray="5 5" className="animate-flow" />

          {/* registry */}
          <rect x="130" y="168" width="140" height="46" rx="10" fill="#FBEED6" stroke="#ED8B00" strokeWidth="1.6" />
          <text x="200" y="188" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#ED8B00">Registry</text>
          <text x="200" y="204" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="#5C6A80">api:v1.4.0</text>
          <line x1="200" y1="140" x2="200" y2="166" stroke="#C43E86" strokeWidth="1.6" className="animate-flow" />

          {/* cluster outline */}
          <rect x="34" y="240" width="332" height="104" rx="14" fill="none" stroke="#0E9BB5" strokeWidth="1.6" strokeDasharray="6 6" />
          <text x="50" y="234" fontFamily="var(--font-sans)" fontSize="11.5" fontWeight="700" fill="#0A7387">Kubernetes cluster</text>
          <line x1="200" y1="214" x2="200" y2="246" stroke="#ED8B00" strokeWidth="1.6" className="animate-flow" />

          {/* service */}
          <rect x="150" y="252" width="100" height="34" rx="8" fill="#E7EFFD" stroke="#2563EB" strokeWidth="1.4" />
          <text x="200" y="274" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600" fill="#2563EB">Service</text>

          {/* pods */}
          {[60, 165, 270].map((x, i) => (
            <g key={i}>
              <rect x={x} y="300" width="70" height="32" rx="8" fill="#E1F5F9" stroke="#0E9BB5" strokeWidth="1.3" />
              <text x={x + 35} y="320" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10.5" fill="#0A7387">Pod</text>
              <line x1="200" y1="286" x2={x + 35} y2="299" stroke="#0E9BB5" strokeWidth="1.2" />
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-3 rotate-3 rounded-xl bg-canvas-50 border border-canvas-300 px-4 py-2 shadow-md text-xs font-mono text-ink-soft hidden sm:block">
        ship <span className="text-teal-dark">continuously</span>
      </div>
    </div>
  );
}
