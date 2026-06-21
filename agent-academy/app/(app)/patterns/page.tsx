import { patterns } from "@/lib/patterns";
import { Diagram } from "@/components/visuals/Diagram";
import { Workflow, CheckCircle2, AlertTriangle } from "lucide-react";

const accentBar: Record<string, string> = {
  iris: "bg-iris",
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
};
const accentText: Record<string, string> = {
  iris: "text-iris",
  teal: "text-teal-dark",
  amber: "text-amber-dark",
  rose: "text-rose-dark",
};

export const metadata = {
  title: "Agentic Pattern Catalog — Agent Academy",
};

export default function PatternsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-iris-dark mb-2">
        <Workflow size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">Quick reference</span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink mb-3 tracking-tight">
        Agentic Pattern Catalog
      </h1>
      <p className="text-ink-soft leading-relaxed mb-10">
        The recurring shapes of agentic systems. For each: a diagram, when to reach for it,
        and what to watch out for. Use it as a design cheat-sheet.
      </p>

      <div className="space-y-8">
        {patterns.map((p) => (
          <section
            key={p.name}
            className="rounded-2xl border border-canvas-300 bg-canvas-50/50 overflow-hidden"
          >
            <div className="flex items-start gap-3 px-6 pt-6">
              <span className={`mt-1 h-7 w-1 rounded-full ${accentBar[p.accent]}`} />
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">{p.name}</h2>
                <p className={`text-sm font-medium ${accentText[p.accent]}`}>{p.tagline}</p>
              </div>
            </div>

            <div className="px-3 sm:px-6">
              <Diagram name={p.diagram} />
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-canvas-300 border-t border-canvas-300">
              <div className="bg-canvas-50 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 size={15} className="text-teal-dark" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    When to use
                  </span>
                </div>
                <p className="text-[0.95rem] text-ink-soft leading-relaxed">{p.when}</p>
              </div>
              <div className="bg-canvas-50 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle size={15} className="text-amber-dark" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Watch out
                  </span>
                </div>
                <p className="text-[0.95rem] text-ink-soft leading-relaxed">{p.watch}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
