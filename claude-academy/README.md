# Claude Academy

A beautiful, visual learning app that teaches you how to build with the Anthropic Claude API — and goes well beyond the original courses into agents, RAG, MCP, evaluations, and advanced reasoning.

Built to *understand concepts* (no setup, no running code) and to *prepare you to answer any question* about Claude, agents, and RAG.

## What's inside

- **8 modules · 42 lessons** — Foundations → Prompt Engineering → Evaluation → Tool Use & Agents → Retrieval (RAG) → Advanced Capabilities (incl. prompt-injection security & reducing hallucinations) → The AI Engineer's Stack (the role, the modern LLM app stack, prompting vs RAG vs fine-tuning, open-weight & local models, AI-first engineering with coding agents) → Frontier AI, Decoded (reasoning models & test-time compute, small language models & on-device AI, agentic RAG & deep research, and a buzzword decoder for vibe coding, world models, synthetic data, AGI and friends).
- **Custom diagrams** for every concept (the agent loop, RAG pipeline, prompt caching, embeddings, context windows, MCP, managed agents, the LLM app stack, and more).
- **Annotated code snippets** (Python/TS) to read — illustrating each idea.
- **Flashcards & quizzes** on every lesson to make it stick.
- **Pattern Catalog** (`/patterns`) — 14 recurring shapes of Claude applications (the request/response contract, model tiering, prompt caching, the tool-use loop, workflow-vs-agent, RAG, MCP, the eval loop, context-as-a-budget), each with a diagram, when to reach for it, and the mistake it invites.
- **Cheatsheets** (`/cheatsheets`) — 59 searchable, click-to-copy entries across the Messages API, prompting moves, tool use, and cost control.
- **Command palette search** — press <kbd>⌘K</kbd> / <kbd>Ctrl-K</kbd> (or `/`) anywhere to jump to any lesson, pattern, glossary term, or page by keyword.
- **Interview Q&A bank** — 31 likely questions with model answers, searchable by topic.
- **Glossary** — 70 cross-linked definitions with live search, an A–Z letter rail, and "See also" links that jump to (and highlight) the related term.
- **Progress tracking** saved in your browser (localStorage) — surfaced in the sidebar, on the curriculum page (per-module bars, per-lesson checks), and via a "Continue where you left off" card on the home and curriculum pages.
- **Reading UX** — a scroll progress bar on every lesson and ←/→ keyboard navigation between lessons.

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
