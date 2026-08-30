# 🔴 Interview Academy

A complete, visual, self-teaching web course for **AI/ML job interviews** — the statistics, classic ML, deep learning, NLP, MLOps, and system design that a machine learning loop actually asks about, plus the coding and behavioural rounds around them.

Built with Next.js 14, TypeScript, and Tailwind. All content is typed data in `lib/`, so it is reviewable in pull requests like any other code.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

---

## What's inside

| | |
| --- | --- |
| **11 modules · 40 lessons** | the full ML interview surface |
| **25 custom SVG diagrams** | the bias–variance tradeoff, backpropagation, attention, the training loop, the serving stack |
| **121 flashcards · 122 quiz questions** | per-lesson, with mastery tracking |
| **96-term glossary** | the vocabulary an interviewer assumes without saying so |
| **48 interview Q&As** | model answers across every module |
| **7 pattern write-ups** | on `/patterns`, each with a diagram, when to use it, and what to watch |
| **32 entries** | on `/cheatsheets` — the formulas, metrics, and snippets worth having cold |

## The curriculum

| # | Module | Covers |
| --- | --- | --- |
| 1 | **ML Foundations** | Supervised vs unsupervised · the bias–variance tradeoff · train/validation/test discipline · the metrics and when each one lies |
| 2 | **Statistics & Probability** | Distributions and expectation · hypothesis testing and p-values · confidence intervals · Bayes, and the questions built on it |
| 3 | **Classic ML Algorithms** | Linear and logistic regression · trees, random forests, and gradient boosting · SVMs and kNN · clustering and dimensionality reduction |
| 4 | **Deep Learning** | Neural networks and backpropagation · activations, initialisation, and normalisation · optimisers and schedules · regularisation · CNNs and RNNs |
| 5 | **NLP & Transformers** | Tokenisation and embeddings · attention and the transformer block · pretraining objectives · fine-tuning for downstream tasks |
| 6 | **LLMs & Generative AI** | How generation works · prompting, RAG, and tool use · adaptation and alignment · evaluating a generative system |
| 7 | **MLOps & Production** | Feature stores and pipelines · training/serving skew · deployment, monitoring, and drift · retraining loops |
| 8 | **ML System Design** | The framing sequence · requirements, data, model, serving · the calculations you do out loud on a whiteboard |
| 9 | **ML Coding & Python** | NumPy and pandas fluency · implementing algorithms from scratch · the take-home and how it's graded |
| 10 | **Responsible AI** | Fairness and its incompatible definitions · interpretability · privacy · governance and the questions that follow |
| 11 | **Behavioral & Strategy** | STAR answers that land · project deep-dives · negotiating, and reading the loop you're in |

## Routes

- `/` — home
- `/learn` and `/learn/[slug]` — the curriculum
- `/prep` — the staged interview roadmap
- `/patterns` — the pattern catalog
- `/cheatsheets` — formulas, metrics, and snippets
- `/interview` — searchable Q&A bank
- `/glossary` — 96 terms
- `⌘K` anywhere — command palette over lessons, patterns, and terms

## Conventions

- **"Jargon, decoded"** callouts translate terminology into plain language inline, so a beginner is never stranded — the shared convention across all seven academies in this repo.
- Every technique states **when not to use it**. That's the level interviewers probe at, and it's the difference between recall and understanding.
- Derivations are worked through rather than asserted, because "walk me through why" is the follow-up to almost every correct answer.

## Adding a module

1. Create `lib/mod-<id>.ts` exporting a `Module`.
2. Import and insert it in `lib/curriculum.ts`.
3. Add a `moduleIcon` entry in `app/page.tsx`.
4. Add any new `DiagramName` values in `lib/types.ts`, plus a component and a `REGISTRY` entry in `components/visuals/Diagram.tsx` (the registry is exhaustive, so TypeScript will tell you if you forget).
5. `npm run build`.

> **Note on `.gitignore`:** the repo-root Python rule `lib/` also matches this app's source `lib/` folder. There is an explicit re-include for it — after committing any `lib/` change, `git ls-files interview-academy/lib` is worth a glance.

## Related academies

Sibling apps in this repo: **Claude Academy** (the Anthropic API), **Agent Academy** (agentic AI and CrewAI), **Cloud Academy** (AWS & Azure), **DevOps Academy**, **AWS Academy** (the Cloud Engineer role), and **AI Engineer Academy** (the AI Engineer role).

**Interview Academy vs AI Engineer Academy:** this one prepares you for *ML and data science* interviews — statistics, classic ML, deep learning theory. AI Engineer Academy is about *building production systems on top of pretrained models*, and its interview module reflects that different loop.
