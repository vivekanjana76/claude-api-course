"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Lesson reading aids: a slim scroll-progress bar pinned to the top of the
 * content area, and ArrowLeft/ArrowRight navigation between lessons.
 * Key presses are ignored while typing or when a modifier is held.
 */
export function LessonUX({ prev, next }: { prev?: string; next?: string }) {
  const router = useRouter();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      )
        return;
      if (e.key === "ArrowLeft" && prev) router.push(`/learn/${prev}`);
      if (e.key === "ArrowRight" && next) router.push(`/learn/${next}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);

  return (
    <div
      className="fixed top-14 lg:top-0 left-0 lg:left-72 right-0 z-30 h-1 bg-transparent"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-iris to-teal transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
