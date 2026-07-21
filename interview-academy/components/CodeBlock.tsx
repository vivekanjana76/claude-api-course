"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Lightweight token highlighter — keyword/string/comment/number coloring.
function highlight(code: string, lang: string): React.ReactNode[] {
  const lines = code.split("\n");
  const kw =
    /\b(import|from|def|return|if|else|elif|for|while|in|with|as|class|try|except|raise|yield|True|False|None|async|await|const|let|var|function|new|null|true|false|break|continue|self|lambda)\b/g;
  return lines.map((line, i) => {
    // comments
    const commentIdx =
      lang === "python"
        ? line.indexOf("#")
        : Math.max(line.indexOf("//"), line.indexOf("# "));
    let codePart = line;
    let comment = "";
    if (commentIdx >= 0 && !line.slice(0, commentIdx).includes('"')) {
      codePart = line.slice(0, commentIdx);
      comment = line.slice(commentIdx);
    }
    // strings
    const segs: React.ReactNode[] = [];
    const strRegex = /("[^"]*"|'[^']*')/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let k = 0;
    while ((m = strRegex.exec(codePart)) !== null) {
      const before = codePart.slice(last, m.index);
      segs.push(<span key={k++}>{kwSplit(before, kw)}</span>);
      segs.push(
        <span key={k++} className="text-teal-light">
          {m[0]}
        </span>,
      );
      last = m.index + m[0].length;
    }
    segs.push(<span key={k++}>{kwSplit(codePart.slice(last), kw)}</span>);
    return (
      <div key={i} className="table-row">
        <span className="table-cell pr-4 select-none text-right text-canvas/30 text-xs w-8">
          {i + 1}
        </span>
        <span className="table-cell whitespace-pre-wrap">
          {segs}
          {comment && <span className="text-ink-faint italic">{comment}</span>}
        </span>
      </div>
    );
  });
}

function kwSplit(text: string, kw: RegExp): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  const re = new RegExp(kw.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span key={k++} className="text-iris-light font-medium">
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function CodeBlock({
  code,
  lang,
  caption,
}: {
  code: string;
  lang: string;
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <figure className="my-7">
      <div className="rounded-xl overflow-hidden border border-ink/10 bg-[#17151F] shadow-md">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-iris/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal/70" />
            <span className="ml-2 text-xs text-canvas/50 font-mono uppercase tracking-wide">
              {lang}
            </span>
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-canvas/60 hover:text-canvas transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-canvas-100 font-mono thin-scroll">
          <code className="table w-full">{highlight(code, lang)}</code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-ink-muted italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
