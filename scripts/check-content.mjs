#!/usr/bin/env node
/**
 * Content integrity checks for the seven academy apps.
 *
 * The lesson content is typed data, so TypeScript already guarantees the
 * *shape* of everything in `lib/`. What it cannot check is whether the
 * strings inside that shape refer to things that exist:
 *
 *   - a glossary `related: ["Foo"]` naming a term nobody defines renders a
 *     "See also" button that dead-ends in an empty search
 *   - a `DiagramName` that no lesson references is a diagram no reader
 *     can reach
 *   - two lessons sharing a slug silently collide at /learn/[slug]
 *
 * All three shipped to main at least once, which is why this exists.
 *
 * Usage:
 *   node scripts/check-content.mjs              # every academy
 *   node scripts/check-content.mjs aws-academy  # just one
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ACADEMIES = [
  "claude-academy",
  "agent-academy",
  "devops-academy",
  "interview-academy",
  "cloud-academy",
  "aws-academy",
  "ai-engineer-academy",
];

/** Strip line and block comments so commented-out data never counts as real. */
function decomment(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

function read(path) {
  return existsSync(path) ? decomment(readFileSync(path, "utf8")) : null;
}

/** Every `key: "value"` for the given key. */
function values(src, key) {
  return [...src.matchAll(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g"))].map(
    (m) => m[1].replace(/\\"/g, '"'),
  );
}

function libFiles(app, prefix) {
  const dir = join(app, "lib");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".ts"))
    .map((f) => join(dir, f));
}

function checkAcademy(app) {
  const problems = [];
  const note = (kind, detail) => problems.push({ kind, detail });

  // ---- glossary: related links resolve, terms are unique -------------------
  const glossarySrc = read(join(app, "lib", "glossary.ts"));
  if (glossarySrc) {
    const terms = values(glossarySrc, "term");
    const defined = new Set(terms);

    const seen = new Set();
    for (const t of terms) {
      if (seen.has(t)) note("duplicate glossary term", t);
      seen.add(t);
    }

    // Split into entries so a dangling reference can name its citing term.
    const entries = glossarySrc.split(/\{\s*term:/).slice(1);
    for (const entry of entries) {
      const owner = entry.match(/^\s*"((?:[^"\\]|\\.)*)"/)?.[1];
      const related = entry.match(/related:\s*\[([^\]]*)\]/)?.[1];
      if (!owner || !related) continue;
      for (const [, ref] of related.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
        if (!defined.has(ref)) {
          note("dead “See also” link", `"${ref}" — cited by "${owner}"`);
        }
      }
    }
  }

  // ---- diagrams: declared, implemented, and actually used ------------------
  const typesSrc = read(join(app, "lib", "types.ts"));
  const declared = new Set();
  if (typesSrc) {
    const union = typesSrc.match(/export type DiagramName\s*=([\s\S]*?);/)?.[1] ?? "";
    for (const [, n] of union.matchAll(/"([^"]+)"/g)) declared.add(n);
  }

  const diagramSrc = read(join(app, "components", "visuals", "Diagram.tsx"));
  const registered = new Set();
  if (diagramSrc) {
    const registry = diagramSrc.match(/REGISTRY[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? "";
    for (const [, n] of registry.matchAll(/"([^"]+)":/g)) registered.add(n);
  }

  // Any `name:`/`diagram:` string across the app's content files.
  const used = new Set();
  for (const f of [...libFiles(app, "mod-"), ...libFiles(app, "patterns")]) {
    const src = read(f);
    if (!src) continue;
    for (const v of [...values(src, "name"), ...values(src, "diagram")]) {
      if (declared.has(v)) used.add(v);
    }
  }

  for (const d of declared) {
    if (!registered.has(d) && registered.size) {
      note("diagram declared but not implemented", d);
    } else if (!used.has(d)) {
      note("diagram implemented but never shown to a reader", d);
    }
  }

  // ---- lessons: unique slugs, and every lesson is complete -----------------
  const slugs = new Map();
  for (const f of libFiles(app, "mod-")) {
    const src = read(f);
    if (!src) continue;

    for (const slug of values(src, "slug")) {
      if (slugs.has(slug)) {
        note("duplicate lesson slug", `"${slug}" in ${slugs.get(slug)} and ${f}`);
      }
      slugs.set(slug, f);
    }

    // Lesson bodies, split on the slug that opens each one.
    for (const chunk of src.split(/\n\s*slug:\s*"/).slice(1)) {
      const slug = chunk.match(/^((?:[^"\\]|\\.)*)"/)?.[1] ?? "?";
      for (const field of ["blocks", "takeaways", "flashcards", "quiz"]) {
        if (!new RegExp(`\\b${field}:`).test(chunk)) {
          note(`lesson missing ${field}`, slug);
        }
      }
    }
  }

  return { problems, stats: { lessons: slugs.size, diagrams: declared.size } };
}

const requested = process.argv.slice(2);
const targets = requested.length ? requested : ACADEMIES;

let failed = 0;
for (const app of targets) {
  if (!existsSync(app)) {
    console.error(`  ?  ${app} — no such directory`);
    failed++;
    continue;
  }
  const { problems, stats } = checkAcademy(app);
  const label = app.padEnd(22);
  if (problems.length === 0) {
    console.log(`  ok ${label} ${stats.lessons} lessons, ${stats.diagrams} diagrams`);
    continue;
  }
  failed++;
  console.log(`  FAIL ${label} ${problems.length} problem(s)`);
  for (const p of problems) console.log(`       ${p.kind}: ${p.detail}`);
}

if (failed) {
  console.error(`\n${failed} academy/academies failed content checks.`);
  process.exit(1);
}
console.log(`\nAll ${targets.length} academy/academies passed.`);
