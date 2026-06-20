import type { Block, CalloutKind } from "@/lib/types";
import { RichText } from "./RichText";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./visuals/Diagram";
import { Key, Info, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";

const calloutStyle: Record<
  CalloutKind,
  { bg: string; border: string; icon: React.ReactNode; label: string; iconColor: string }
> = {
  key: {
    bg: "bg-clay-50",
    border: "border-clay/40",
    icon: <Key size={17} />,
    label: "Key idea",
    iconColor: "text-clay-dark",
  },
  note: {
    bg: "bg-cream-100",
    border: "border-cream-300",
    icon: <Info size={17} />,
    label: "Note",
    iconColor: "text-slateblue",
  },
  tip: {
    bg: "bg-sage/10",
    border: "border-sage/40",
    icon: <Lightbulb size={17} />,
    label: "Tip",
    iconColor: "text-sage",
  },
  warn: {
    bg: "bg-ochre/10",
    border: "border-ochre/40",
    icon: <AlertTriangle size={17} />,
    label: "Watch out",
    iconColor: "text-ochre",
  },
  story: {
    bg: "bg-cream-100",
    border: "border-cream-300",
    icon: <Sparkles size={17} />,
    label: "In practice",
    iconColor: "text-clay",
  },
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="font-serif text-[1.7rem] sm:text-3xl font-semibold text-ink mt-12 mb-4 scroll-mt-24">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink-soft mt-9 mb-3">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-[1.02rem] leading-[1.78] text-ink-soft mb-5">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return block.ordered ? (
        <ol className="list-decimal pl-6 space-y-2.5 mb-6 marker:text-clay marker:font-semibold">
          {block.items.map((it, i) => (
            <li key={i} className="text-[1.01rem] leading-[1.7] text-ink-soft pl-1">
              <RichText text={it} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2.5 mb-6">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[1.01rem] leading-[1.7] text-ink-soft">
              <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-clay shrink-0" />
              <span>
                <RichText text={it} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "callout": {
      const s = calloutStyle[block.kind];
      return (
        <div className={`my-7 rounded-xl border ${s.border} ${s.bg} p-5`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={s.iconColor}>{s.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              {block.title || s.label}
            </span>
          </div>
          <p className="text-[0.98rem] leading-[1.7] text-ink-soft">
            <RichText text={block.text} />
          </p>
        </div>
      );
    }
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} caption={block.caption} />;
    case "diagram":
      return <Diagram name={block.name} caption={block.caption} />;
    case "compare":
      return (
        <figure className="my-7">
          <div className="overflow-x-auto rounded-xl border border-cream-300 thin-scroll">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-cream-200">
                  {block.columns.map((c, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 font-semibold text-ink text-[0.82rem] uppercase tracking-wide"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 ? "bg-cream-50" : "bg-white/40"}>
                    <td className="px-4 py-3 font-semibold text-ink-soft align-top border-t border-cream-300">
                      <RichText text={row.label} />
                    </td>
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-4 py-3 text-ink-soft align-top border-t border-cream-300 leading-relaxed"
                      >
                        <RichText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-ink-muted italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "steps":
      return (
        <ol className="my-7 space-y-4">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 h-8 w-8 rounded-full bg-clay text-cream-50 font-serif font-semibold flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <div className="font-semibold text-ink">{it.title}</div>
                <p className="text-ink-soft leading-relaxed text-[0.98rem]">
                  <RichText text={it.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="my-7 border-l-4 border-clay pl-5 italic text-ink-soft text-lg font-serif">
          “{block.text}”
          {block.cite && (
            <cite className="block mt-2 not-italic text-sm text-ink-muted font-sans">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      );
  }
}

export function LessonRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-lesson">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}
