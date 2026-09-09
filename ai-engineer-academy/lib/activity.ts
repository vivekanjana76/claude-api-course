"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * A day log of study activity, plus backup and restore for everything the
 * academy keeps locally.
 *
 * Lesson progress, quiz mastery, and review scheduling all live in this
 * browser's localStorage. That keeps the app account-free, but it also
 * means a new laptop, a cleared cache, or a different browser starts the
 * learner from zero with no way out. `exportState` / `importState` give
 * them a file they own.
 *
 * The log itself is deliberately thin: a count of study actions per day,
 * keyed `YYYY-MM-DD` in the learner's own timezone. Enough for a streak
 * and a heatmap, not enough to reconstruct a session.
 */

const KEY = "ai-engineer-academy-activity-v1";

/** Every key this academy owns — the unit of export, import, and reset. */
export const STORAGE_KEYS = [
  "ai-engineer-academy-progress-v1",
  "ai-engineer-academy-mastery-v1",
  "ai-engineer-academy-review-v1",
  KEY,
] as const;

const DAY = 86_400_000;

export type DayLog = Record<string, number>;

/** Local calendar day, not UTC — a 9pm session should not count as tomorrow. */
export function dayKey(d: Date | number = Date.now()): string {
  const date = typeof d === "number" ? new Date(d) : d;
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${day}`;
}

function read(): DayLog {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

/** Count one study action against today. Safe to call from anywhere. */
export function recordActivity(n = 1) {
  if (typeof window === "undefined") return;
  const log = read();
  const k = dayKey();
  log[k] = (log[k] ?? 0) + n;
  localStorage.setItem(KEY, JSON.stringify(log));
  window.dispatchEvent(new Event("activity-updated"));
}

/**
 * Consecutive days ending today or yesterday. Yesterday still counts so a
 * streak is not lost before the learner has had a chance to study today.
 */
export function streakOf(log: DayLog, now = Date.now()): number {
  let start = now;
  if (!log[dayKey(now)]) {
    if (!log[dayKey(now - DAY)]) return 0;
    start = now - DAY;
  }
  let streak = 0;
  for (let t = start; log[dayKey(t)]; t -= DAY) streak += 1;
  return streak;
}

/** Newest-last list of the past `days` days, for the heatmap. */
export function recentDays(log: DayLog, days: number, now = Date.now()) {
  const out: { key: string; count: number; date: Date }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * DAY);
    const key = dayKey(date);
    out.push({ key, count: log[key] ?? 0, date });
  }
  return out;
}

export function useActivity() {
  const [log, setLog] = useState<DayLog>({});
  const [now, setNow] = useState(0);

  useEffect(() => {
    const sync = () => {
      setLog(read());
      setNow(Date.now());
    };
    sync();
    window.addEventListener("activity-updated", sync);
    window.addEventListener("progress-updated", sync);
    window.addEventListener("review-updated", sync);
    return () => {
      window.removeEventListener("activity-updated", sync);
      window.removeEventListener("progress-updated", sync);
      window.removeEventListener("review-updated", sync);
    };
  }, []);

  const streak = useMemo(() => (now ? streakOf(log, now) : 0), [log, now]);
  const daysStudied = useMemo(() => Object.keys(log).length, [log]);
  const actionsToday = now ? log[dayKey(now)] ?? 0 : 0;

  return { log, streak, daysStudied, actionsToday, now };
}

/* ------------------------------------------------------------------ */
/* Backup and restore                                                  */
/* ------------------------------------------------------------------ */

export interface Backup {
  app: string;
  version: 1;
  savedAt: string;
  data: Record<string, unknown>;
}

export function exportState(): Backup {
  const data: Record<string, unknown> = {};
  for (const key of STORAGE_KEYS) {
    const raw = typeof window === "undefined" ? null : localStorage.getItem(key);
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        /* a corrupt key is simply left out of the backup */
      }
    }
  }
  return {
    app: "ai-engineer-academy",
    version: 1,
    savedAt: new Date().toISOString(),
    data,
  };
}

/**
 * Restore a backup. Returns how many keys were applied so the caller can
 * tell the learner something true, and rejects a file from another academy
 * rather than silently writing nothing.
 */
export function importState(raw: string): { applied: number; error?: string } {
  let parsed: Backup;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { applied: 0, error: "That file is not valid JSON." };
  }
  if (parsed?.version !== 1 || typeof parsed.data !== "object" || !parsed.data) {
    return { applied: 0, error: "That file is not an academy backup." };
  }
  if (parsed.app !== "ai-engineer-academy") {
    return {
      applied: 0,
      error: `That backup is from ${parsed.app ?? "another academy"}.`,
    };
  }

  let applied = 0;
  for (const key of STORAGE_KEYS) {
    const value = parsed.data[key];
    if (value === undefined) continue;
    localStorage.setItem(key, JSON.stringify(value));
    applied += 1;
  }
  for (const evt of ["progress-updated", "mastery-updated", "review-updated", "activity-updated"]) {
    window.dispatchEvent(new Event(evt));
  }
  return { applied };
}

/** Wipe every local trace of this academy. */
export function resetEverything() {
  if (typeof window === "undefined") return;
  for (const key of STORAGE_KEYS) localStorage.removeItem(key);
  for (const evt of ["progress-updated", "mastery-updated", "review-updated", "activity-updated"]) {
    window.dispatchEvent(new Event(evt));
  }
}

/** Trigger a download of the current backup. */
export function useDownloadBackup() {
  return useCallback(() => {
    const blob = new Blob([JSON.stringify(exportState(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-engineer-academy-progress-${dayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);
}
