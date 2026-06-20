"use client";

import { useProgress } from "@/lib/progress";
import { CheckCircle2, Circle } from "lucide-react";

export function CompleteButton({ slug }: { slug: string }) {
  const { done, toggle } = useProgress();
  const isDone = !!done[slug];
  return (
    <button
      onClick={() => toggle(slug)}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
        isDone
          ? "bg-sage/15 text-sage border border-sage/40 hover:bg-sage/20"
          : "bg-ink text-cream-50 hover:bg-clay-dark shadow-sm"
      }`}
    >
      {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      {isDone ? "Completed" : "Mark complete"}
    </button>
  );
}
