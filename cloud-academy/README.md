# Cloud Academy

A beautiful, visual, self-contained course on **cloud computing across AWS and Azure** —
built as a sibling to `claude-academy` and `agent-academy`. It teaches the cloud from
first principles (what the cloud is, service models, regions & AZs) up through real
architecture (compute, storage, networking, and well-architected design), covering both
**AWS and Azure side by side** because the concepts are identical and only the names differ.

No runnable infrastructure — it's a learning site: concepts, custom SVG diagrams,
quizzes, flashcards, a glossary, interview Q&A, an architecture pattern catalog, and
cheatsheets — 73 click-to-copy commands across the AWS CLI, the Azure CLI, and a
service-by-service AWS ↔ Azure mapping.

## Run it

```bash
cd cloud-academy
npm install
npm run dev
```

Then open http://localhost:3000 (the port auto-bumps if 3000 is taken).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react.

## Structure

All content is **typed data**, rendered by a small set of components:

- `lib/mod-*.ts` — course modules, each an array of lessons (`Foundations`, `Compute`,
  `Storage`, `Networking`, with more on the way). Aggregated by `lib/curriculum.ts`.
- `lib/glossary.ts` — searchable term definitions, cross-linked and mapped AWS ↔ Azure.
- `lib/interview.ts` — interview questions with model answers, by topic.
- `lib/patterns.ts` — the Cloud Architecture Pattern Catalog.
- `lib/cheatsheets.ts` — the AWS CLI / Azure CLI / cross-cloud mapping reference.
- `lib/types.ts` — the `Lesson`/`Block`/`Module`/`DiagramName` types.
- `components/LessonRenderer.tsx` — renders a lesson's blocks (prose, callouts, code,
  diagrams, compare tables, steps).
- `components/visuals/Diagram.tsx` — hand-built SVG diagrams keyed by `DiagramName`.
- `components/{Flashcards,Quiz,CodeBlock,RichText,Sidebar,CommandPalette,CompleteButton,Logo}.tsx`.

Progress is tracked per-lesson in `localStorage` via `lib/progress.ts`.

## Design

A distinct **cloud** identity: cool sky-tinted canvas, **azure-blue** primary with an
**AWS-orange** accent, Space Grotesk display font. Kept visually separate from its sibling apps on purpose.

## Adding content

- **A lesson:** append a `Lesson` object to the relevant `lib/mod-*.ts`.
- **A module:** create `lib/mod-<name>.ts` exporting a `Module`, then add it to
  `modules` in `lib/curriculum.ts` and an icon in `app/page.tsx`.
- **A diagram:** add a component to `REGISTRY` in `components/visuals/Diagram.tsx`
  and its name to the `DiagramName` union in `lib/types.ts`.
