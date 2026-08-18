# 🟪 AI Engineer Academy

A complete, visual, self-teaching web course for the **AI Engineer** role — the 2026 GenAI stack, from how a language model actually works to shipping an agent platform that other teams depend on.

Built with Next.js 14, TypeScript, and Tailwind. All content is typed data in `lib/`, so it is reviewable in pull requests like any other code.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 64 routes
```

---

## What's inside

| | |
| --- | --- |
| **14 modules · 55 lessons** | ~10 hours of focused reading |
| **48 custom SVG diagrams** | the decode loop, the RAG pipeline, agent topologies, the KV cache, LoRA, the lethal trifecta, the latency budget |
| **259 flashcards · 166 quiz questions** | per-lesson, with mastery tracking |
| **188-term glossary** | including a **2026 keyword radar** — 72 terms flagged as currently prominent in job descriptions, filterable in one click |
| **57 interview Q&As** | model answers across 13 topics |
| **22 reference architectures** | the GenAI shapes you get asked to draw on a whiteboard |
| **44 rapid drills + 12 judgment rules** | on `/prep`, across five skills |

## The curriculum

| # | Module | Covers |
| --- | --- | --- |
| 1 | **Foundations** | What an AI Engineer is · tokens, prefill/decode, context windows, sampling · the four root causes of hallucination · the model landscape and routing · the four-layer GenAI stack |
| 2 | **Prompt & context engineering** | Prompt anatomy and anti-patterns · **context engineering** as a budget · structured outputs and constrained decoding · reasoning models and test-time compute |
| 3 | **Embeddings & retrieval** | Embeddings and their blind spots · chunking and the ingestion pipeline · HNSW/IVF/PQ and pgvector · hybrid search, RRF, and cross-encoder reranking |
| 4 | **RAG systems** | Grounding and citation verification · contextual retrieval, routing, multi-hop, corrective and agentic RAG · text-to-SQL and GraphRAG · the RAG triad |
| 5 | **Agents & tool use** | Tool calling and the trust boundary · the agent loop and its four exits · memory and state · multi-agent topologies · frameworks: what to adopt, what to own |
| 6 | **MCP & the interop layer** | The Model Context Protocol · building and securing servers · A2A, computer use, and Agent Skills |
| 7 | **Adaptation** | The adaptation ladder · SFT, LoRA, QLoRA · RLHF, DPO, **GRPO and verifiable rewards** · distillation and synthetic data |
| 8 | **Inference & serving** | TTFT/TPOT/throughput · the KV cache, PagedAttention, speculative decoding · quantization · vLLM, SGLang, Ollama, and GPU sizing |
| 9 | **Evaluation** | Eval-driven development · building datasets and error analysis · LLM-as-judge and its six biases · online evaluation and drift |
| 10 | **LLMOps in production** | The AI gateway · caching, routing, and cost engineering · tracing with OpenTelemetry GenAI · the eval-gated release lifecycle |
| 11 | **Safety, security & governance** | Prompt injection and the **lethal trifecta** · the guardrail sandwich · privacy and tenancy · red teaming, EU AI Act, NIST AI RMF, ISO 42001 |
| 12 | **Multimodal & voice** | Vision and document extraction · realtime voice agents and the latency budget · image and video generation |
| 13 | **AI system design** | A six-phase framework · two fully worked designs · the five whiteboard calculations |
| 14 | **The AI Engineer interview** | The job and the loop · coding rounds and take-homes · the **2026 keyword radar** · behavioural questions and the offer |

## Routes

- `/` — home
- `/learn` and `/learn/[slug]` — the curriculum
- `/prep` — rapid drills, keyword decoder, and the judgment cheat-sheet
- `/patterns` — the GenAI architecture catalog
- `/interview` — searchable Q&A bank
- `/glossary` — 188 terms with the 2026 keyword filter
- `⌘K` anywhere — command palette over lessons, terms, and patterns

## Conventions

- **"Jargon, decoded"** callouts translate terminology into plain language inline, so a beginner is never stranded — the shared convention across all seven academies in this repo.
- Every technique states **when not to use it**. That's the level interviewers probe at, and it's the difference between recall and understanding.
- Numbers are worked through out loud — token counts, cost per request, GPU concurrency — because doing that arithmetic live is a routine interview task.

## Adding a module

1. Create `lib/mod-<id>.ts` exporting a `Module`.
2. Import and insert it in `lib/curriculum.ts`.
3. Add a `moduleIcon` entry in `app/page.tsx`.
4. Add any new `DiagramName` values in `lib/types.ts`, plus a component and a `REGISTRY` entry in `components/visuals/Diagram.tsx` (the registry is exhaustive, so TypeScript will tell you if you forget).
5. `npm run build`.

> **Note on `.gitignore`:** the repo-root Python rule `lib/` also matches this app's source `lib/` folder. There is an explicit `!ai-engineer-academy/lib/**` re-include — after committing any `lib/` change, `git ls-files ai-engineer-academy/lib` is worth a glance.

## Related academies

Sibling apps in this repo: **Claude Academy** (the Anthropic API), **Agent Academy** (agentic AI and CrewAI), **Cloud Academy** (AWS & Azure), **DevOps Academy**, **Interview Academy** (AI/ML interviews), and **AWS Academy** (the Cloud Engineer role).

**AI Engineer Academy vs Interview Academy:** Interview Academy prepares you for *ML and data science* interviews — statistics, classic ML, deep learning theory. This one is about *building production systems on top of pretrained models*, and the interview module reflects that different loop.
