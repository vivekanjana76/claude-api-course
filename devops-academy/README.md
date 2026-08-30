# 🟢 DevOps Academy

A complete, visual, self-teaching web course for **DevOps** — from what the discipline is actually for, through containers and Kubernetes, to delivering software continuously and knowing when it breaks.

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
| **8 modules · 32 lessons** | the delivery lifecycle end to end |
| **26 custom SVG diagrams** | image layers, the pod lifecycle, the pipeline, the Terraform state loop, the GitOps reconciliation loop, the four golden signals |
| **96 flashcards · 65 quiz questions** | per-lesson, with mastery tracking |
| **109-term glossary** | the vocabulary a DevOps interview assumes you already have |
| **30 interview Q&As** | model answers across the toolchain |
| **10 delivery patterns** | on `/patterns`, each with a diagram, when to use it, and what to watch |
| **76 commands** | on `/cheatsheets` — Git, Docker, kubectl, Terraform, and PromQL, click to copy |

## The curriculum

| # | Module | Covers |
| --- | --- | --- |
| 1 | **DevOps Foundations** | What DevOps is for · the delivery lifecycle · culture, feedback loops, and the metrics that matter |
| 2 | **Containers & Docker** | Images, layers, and the build cache · Dockerfiles worth shipping · volumes, networks, and Compose · registries |
| 3 | **Kubernetes** | Pods, deployments, and services · configuration and secrets · scheduling, probes, and resource limits · ingress and scaling |
| 4 | **CI/CD & GitHub Actions** | Pipelines as code · workflows, jobs, and matrices · artifacts, caching, and secrets · deployment strategies |
| 5 | **Infrastructure as Code** | Declarative infrastructure · Terraform's plan/apply loop · state, modules, and remote backends · drift |
| 6 | **GitOps & Argo CD** | Git as the source of truth · pull vs push delivery · reconciliation and self-healing · progressive delivery |
| 7 | **Observability & SRE** | Metrics, logs, and traces · the four golden signals · SLIs, SLOs, and error budgets · alerting that respects people |
| 8 | **DevSecOps & Security** | Shifting security left · scanning images and dependencies · secrets management · supply-chain integrity |

## Routes

- `/` — home
- `/learn` and `/learn/[slug]` — the curriculum
- `/prep` — the staged interview roadmap
- `/patterns` — the delivery pattern catalog
- `/cheatsheets` — Git, Docker, kubectl, Terraform, PromQL
- `/interview` — searchable Q&A bank
- `/glossary` — 109 terms
- `⌘K` anywhere — command palette over lessons, patterns, and terms

## Conventions

- **"Jargon, decoded"** callouts translate terminology into plain language inline, so a beginner is never stranded — the shared convention across all seven academies in this repo.
- Every practice states **when not to use it**. Kubernetes is not the answer to every deployment, and saying so is what separates recall from judgment.
- Commands are copyable, not screenshots. The cheatsheets exist because the exam is the terminal.

## Adding a module

1. Create `lib/mod-<id>.ts` exporting a `Module`.
2. Import and insert it in `lib/curriculum.ts`.
3. Add a `moduleIcon` entry in `app/page.tsx`.
4. Add any new `DiagramName` values in `lib/types.ts`, plus a component and a `REGISTRY` entry in `components/visuals/Diagram.tsx` (the registry is exhaustive, so TypeScript will tell you if you forget).
5. `npm run build`.

> **Note on `.gitignore`:** the repo-root Python rule `lib/` also matches this app's source `lib/` folder. There is an explicit re-include for it — after committing any `lib/` change, `git ls-files devops-academy/lib` is worth a glance.

## Related academies

Sibling apps in this repo: **Claude Academy** (the Anthropic API), **Agent Academy** (agentic AI and CrewAI), **Cloud Academy** (AWS & Azure), **AWS Academy** (the Cloud Engineer role), **Interview Academy** (AI/ML interviews), and **AI Engineer Academy** (the AI Engineer role).

**DevOps Academy vs Cloud Academy:** this one is about the *practice* of delivering and operating software — pipelines, containers, IaC, observability — and stays cloud-agnostic. Cloud Academy is about the *platforms* those practices run on.
