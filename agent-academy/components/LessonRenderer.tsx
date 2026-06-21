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
    bg: "bg-iris-50",
    border: "border-iris/40",
    icon: <Key size={17} />,
    label: "Key idea",
    iconColor: "text-iris-dark",
  },
  note: {
    bg: "bg-canvas-100",
    border: "border-canvas-300",
    icon: <Info size={17} />,
    label: "Note",
    iconColor: "text-teal-dark",
  },
  tip: {
    bg: "bg-teal/10",
    border: "border-teal/40",
    icon: <Lightbulb size={17} />,
    label: "Tip",
    iconColor: "text-teal-dark",
  },
  warn: {
    bg: "bg-amber/10",
    border: "border-amber/40",
    icon: <AlertTriangle size={17} />,
    label: "Watch out",
    iconColor: "text-amber-dark",
  },
  story: {
    bg: "bg-rose/10",
    border: "border-rose/30",
    icon: <Sparkles size={17} />,
    label: "In practice",
    iconColor: "text-rose-dark",
  },
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="font-display text-[1.6rem] sm:text-[1.85rem] font-semibold text-ink mt-12 mb-4 scroll-mt-24 tracking-tight">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-display text-lg sm:text-xl font-semibold text-ink-soft mt-9 mb-3">
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
        <ol className="list-decimal pl-6 space-y-2.5 mb-6 marker:text-iris marker:font-semibold">
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
              <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-iris shrink-0" />
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
          <div className="overflow-x-auto rounded-xl border border-canvas-300 thin-scroll">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-canvas-200">
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
                  <tr key={ri} className={ri % 2 ? "bg-canvas-50" : "bg-canvas-50/40"}>
                    <td className="px-4 py-3 font-semibold text-ink-soft align-top border-t border-canvas-300">
                      <RichText text={row.label} />
                    </td>
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-4 py-3 text-ink-soft align-top border-t border-canvas-300 leading-relaxed"
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
              <span className="shrink-0 h-8 w-8 rounded-full bg-iris text-canvas-50 font-display font-semibold flex items-center justify-center text-sm">
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
        <blockquote className="my-7 border-l-4 border-iris pl-5 italic text-ink-soft text-lg font-display">
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
