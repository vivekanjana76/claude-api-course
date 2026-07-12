"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "agent-academy-progress-v1";

function read(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function useProgress() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDone(read());
    const onStorage = () => setDone(read());
    window.addEventListener("progress-updated", onStorage);
    return () => window.removeEventListener("progress-updated", onStorage);
  }, []);

  const toggle = useCallback((slug: string, value?: boolean) => {
    const cur = read();
    const next = { ...cur, [slug]: value ?? !cur[slug] };
    if (!next[slug]) delete next[slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    setDone(next);
    window.dispatchEvent(new Event("progress-updated"));
  }, []);

  return { done, toggle, completedCount: Object.keys(done).length };
}
