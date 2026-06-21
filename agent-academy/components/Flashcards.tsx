"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return null;
  const card = cards[i];

  const go = (d: number) => {
    setFlipped(false);
    setI((prev) => (prev + d + cards.length) % cards.length);
  };

  return (
    <div>
      <button
        type="button"
        className="block w-full cursor-pointer select-none text-left"
        style={{ perspective: "1400px" }}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? "Show question" : "Reveal answer"}
      >
        {/* grid stacks both faces in one cell so the card grows to the taller side */}
        <div
          className="grid transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* front */}
          <div
            className="[grid-area:1/1] min-h-[200px] rounded-2xl border border-canvas-300 bg-canvas-50 p-7 flex flex-col items-center justify-center text-center shadow-sm"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-[0.7rem] uppercase tracking-widest text-iris font-semibold mb-3">
              Question
            </span>
            <p className="font-display text-xl text-ink leading-snug">{card.front}</p>
            <span className="mt-5 text-xs text-ink-faint flex items-center gap-1">
              <RotateCcw size={12} /> tap to reveal
            </span>
          </div>
          {/* back */}
          <div
            className="[grid-area:1/1] min-h-[200px] rounded-2xl border border-iris/40 bg-iris-50 p-7 flex flex-col items-center justify-center text-center shadow-sm"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-[0.7rem] uppercase tracking-widest text-iris-dark font-semibold mb-3">
              Answer
            </span>
            <p className="text-[0.98rem] text-ink-soft leading-relaxed">{card.back}</p>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => go(-1)}
          className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <div className="flex gap-1.5">
          {cards.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-5 bg-iris" : "w-1.5 bg-canvas-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
