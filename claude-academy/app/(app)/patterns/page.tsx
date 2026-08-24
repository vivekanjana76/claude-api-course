import { patterns } from "@/lib/patterns";
import { Diagram } from "@/components/visuals/Diagram";
import { Workflow, CheckCircle2, AlertTriangle } from "lucide-react";

const accentBar: Record<string, string> = {
  clay: "bg-clay",
  sage: "bg-sage",
  ochre: "bg-ochre",
  slateblue: "bg-slateblue",
};
const accentText: Record<string, string> = {
  clay: "text-clay-dark",
  sage: "text-sage",
  ochre: "text-ochre",
  slateblue: "text-slateblue",
};

export const metadata = {
  title: "Pattern Catalog — Claude Academy",
};

export default function PatternsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-center gap-2 text-clay-dark mb-2">
        <Workflow size={18} />
        <span className="font-medium text-sm uppercase tracking-wider">Quick reference</span>
      </div>
      <h1 className="font-serif text-4xl font-semibold text-ink mb-3">
        Pattern Catalog
      </h1>
      <p className="text-ink-soft leading-relaxed mb-10">
        The recurring shapes of applications built on Claude — the ones worth recognising
        before you start designing. For each: a diagram, when to reach for it, and the
        mistake it most often invites.
      </p>

      <div className="space-y-8">
        {patterns.map((p) => (
          <section
            key={p.name}
            className="rounded-2xl border border-cream-300 bg-cream-50/50 overflow-hidden"
          >
            <div className="flex items-start gap-3 px-6 pt-6">
              <span className={`mt-1 h-7 w-1 rounded-full ${accentBar[p.accent]}`} />
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink">{p.name}</h2>
                <p className={`text-sm font-medium ${accentText[p.accent]}`}>{p.tagline}</p>
              </div>
            </div>

            <div className="px-3 sm:px-6">
              <Diagram name={p.diagram} />
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-cream-300 border-t border-cream-300">
              <div className="bg-cream-50 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 size={15} className="text-sage" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    When to use
                  </span>
                </div>
                <p className="text-[0.95rem] text-ink-soft leading-relaxed">{p.when}</p>
              </div>
              <div className="bg-cream-50 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle size={15} className="text-ochre" />
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
