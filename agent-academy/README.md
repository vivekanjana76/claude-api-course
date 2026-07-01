# Agent Academy

A beautiful, visual, self-contained course on **Agentic AI** — built as a sibling to
`claude-academy`. It teaches how to build AI agents from first principles up to
production multi-agent systems.

## What's inside

Seven modules (38 lessons), each lesson with custom SVG diagrams, key takeaways,
flashcards, and a quiz:

1. **Agent Foundations** — what an agent is, the agent loop, agents vs. workflows, when to build one
2. **Reasoning & Planning** — chain-of-thought, ReAct, plan-and-execute, reflection, decomposition & routing
3. **Tools, Memory & Knowledge** — function calling, tool design, agent memory, context engineering & compaction, RAG, MCP, computer use & browser agents
4. **Multi-Agent Orchestration** — why multi-agent, topologies, handoffs, shared state, pitfalls
5. **CrewAI Deep Dive** — agents/tasks/crews, processes, tools & memory, Flows
6. **The Framework Landscape** — LangGraph, AutoGen, OpenAI Agents SDK, choosing a framework
7. **Agents in Production** — evaluation, observability, guardrails & HITL, prompt-injection security, cost & latency, streaming & responsive UX, deploying & serving agents

Plus a searchable **Glossary**, an **Interview Q&A** bank, an **Agentic Pattern Catalog**, and a **Cmd/Ctrl-K command palette** that searches lessons, patterns, terms, and pages.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · lucide-react.
All content lives in `lib/` as typed data; the UI is fully static (no backend, no API keys).
Progress is tracked in `localStorage`.

## Design

Distinct identity from claude-academy: a porcelain canvas with an electric **iris**
primary and teal / amber / rose accents, Space Grotesk display type, and bespoke
schematic diagrams for every agentic concept.
