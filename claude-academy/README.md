# Claude Academy

A beautiful, visual learning app that teaches you how to build with the Anthropic Claude API — and goes well beyond the original courses into agents, RAG, MCP, evaluations, and advanced reasoning.

Built to *understand concepts* (no setup, no running code) and to *prepare you to answer any question* about Claude, agents, and RAG.

## What's inside

- **6 modules · 29 lessons** — Foundations → Prompt Engineering → Evaluation → Tool Use & Agents → Retrieval (RAG) → Advanced Capabilities.
- **Custom diagrams** for every concept (the agent loop, RAG pipeline, prompt caching, embeddings, context windows, MCP, managed agents, and more).
- **Annotated code snippets** (Python/TS) to read — illustrating each idea.
- **Flashcards & quizzes** on every lesson to make it stick.
- **Interview Q&A bank** — 21 likely questions with model answers, searchable by topic.
- **Glossary** — 42 cross-linked definitions.
- **Progress tracking** saved in your browser (localStorage).

## Run it

```bash
cd claude-academy
npm install      # already done if node_modules exists
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## Design

Anthropic-inspired warm aesthetic: cream paper background, clay/terracotta accent, Fraunces serif headings (falls back to Georgia offline), editorial layout.

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react. All content lives as typed data in `lib/mod-*.ts`, rendered by a block renderer in `components/`. Diagrams are hand-built SVG in `components/visuals/Diagram.tsx`. Fully static — every page prerenders.

## Where to extend

Add a lesson by editing the relevant `lib/mod-*.ts` file (append a `Lesson` to a module's `lessons`). Add a diagram by adding a function to the `REGISTRY` in `Diagram.tsx` and a name to `DiagramName` in `lib/types.ts`. Add glossary/interview entries in `lib/glossary.ts` / `lib/interview.ts`.
