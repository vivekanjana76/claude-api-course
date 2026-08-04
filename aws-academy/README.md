# 🟠 AWS Academy

A complete, visual, self-teaching web course for the **AWS Cloud Engineer** role — from first principles to production.

Built with Next.js 14, TypeScript, and Tailwind. Every lesson pairs plain-English explanations with custom SVG diagrams, then reinforces them with flashcards and a quiz that tracks your mastery.

```bash
cd aws-academy
npm install
npm run dev        # http://localhost:3000
```

---

## What's inside

| | |
| --- | --- |
| **13 modules / 51 lessons** | ~8.5 hours of focused reading |
| **43 custom SVG diagrams** | Regions & AZs, VPC anatomy, IAM policy evaluation, KMS envelope encryption, Lambda lifecycle, ECS vs EKS, DR strategies, cost levers, and more |
| **203 flashcards / 151 quiz questions** | Per-module mastery tracking with a progress ring |
| **206-term glossary** | Every service, acronym, and piece of AWS jargon in the course |
| **46 interview Q&As** | Model answers at the depth an interviewer actually expects |
| **18 reference architectures** | The patterns you'll be asked to draw on a whiteboard |
| **43 intuition drills** | Five skills including a *Narrow the failure* troubleshooting round |

---

## The curriculum

| # | Module | Covers |
| --- | --- | --- |
| 01 | **AWS Foundations** | What AWS is, global infrastructure, accounts & Organizations, Console/CLI/SDK/IaC, shared responsibility, pricing, Well-Architected |
| 02 | **Identity & Access Management** | Principals, policy JSON, the evaluation algorithm, STS and workload identity, Identity Center, IAM hygiene |
| 03 | **Compute** | EC2 fundamentals, EBS and instance storage, Spot/Savings Plans/rightsizing, Auto Scaling Groups, ELB family, choosing compute |
| 04 | **Storage** | S3 fundamentals and security, lifecycle/replication/events/hosting, EFS, FSx, AWS Backup, data transfer |
| 05 | **Networking** | VPC anatomy, security groups vs NACLs, endpoints/peering/Transit Gateway/hybrid, Route 53 and CloudFront |
| 06 | **Databases & analytics** | Choosing a database, RDS & Aurora, DynamoDB and single-table design, ElastiCache and the analytics stack |
| 07 | **Serverless & integration** | Lambda's execution model, API Gateway, SQS/SNS/EventBridge, Step Functions |
| 08 | **Containers** | ECR and image practices, ECS & Fargate, EKS with IRSA and Karpenter, choosing an orchestrator |
| 09 | **IaC, CI/CD & automation** | CloudFormation/CDK/Terraform, pipelines and deployment strategies, Systems Manager and secrets |
| 10 | **Observability, ops & cost** | CloudWatch, X-Ray/CloudTrail/Config and incident practice, cost management and FinOps |
| 11 | **Security engineering** | KMS and encryption, GuardDuty/Security Hub/Inspector/Macie, compliance and the security review |
| 12 | **Architecture & migration** | Reference architectures, RTO/RPO and DR strategies, the 7 Rs and landing zones |
| 13 | **The Cloud Engineer role** | The day job, certification roadmap and study plan, interviews and portfolio projects |

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page with the curriculum overview and a *continue where you left off* card |
| `/learn` | The full lesson index with progress and mastery per module |
| `/learn/[slug]` | A lesson — prose, diagrams, code, comparison tables, takeaways, flashcards, quiz |
| `/patterns` | The AWS reference architecture catalog |
| `/interview` | Searchable interview Q&A bank, grouped by topic |
| `/glossary` | Searchable, cross-linked glossary |
| `/prep` | Rapid intuition drills across five judgment skills, plus flashcards for acronyms |

Press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> anywhere for the command palette.

---

## Architecture

```
aws-academy/
  app/
    page.tsx                 # landing page
    (app)/                   # sidebar + command palette layout
      learn/[slug]/page.tsx  # lesson renderer
      glossary/ interview/ patterns/ prep/
  components/
    LessonRenderer.tsx       # renders the typed Block[] content model
    visuals/Diagram.tsx      # all 43 SVG diagrams + the DiagramName registry
    Quiz.tsx Flashcards.tsx MasteryRing.tsx CommandPalette.tsx Sidebar.tsx
  lib/
    types.ts                 # Block, Lesson, Module, DiagramName …
    curriculum.ts            # module registry + lesson navigation helpers
    mod-*.ts                 # the 13 modules of typed lesson content
    glossary.ts interview.ts patterns.ts prep.ts progress.ts
```

**Content is typed data, not MDX.** A lesson is a `Lesson` object whose `blocks` array is a discriminated union — `p`, `h2`, `list`, `callout`, `code`, `diagram`, `compare`, `steps`, `quote` — rendered by `LessonRenderer`. That keeps content reviewable in pull requests and makes it impossible to reference a diagram that doesn't exist: `DiagramName` is a union type and the registry in `Diagram.tsx` must be exhaustive.

### Adding a lesson

1. Add a `Lesson` object to the relevant `lib/mod-*.ts`.
2. If it needs a new diagram, add the name to the `DiagramName` union in `lib/types.ts` and the component plus registry entry in `components/visuals/Diagram.tsx` — TypeScript will tell you if you forget either.
3. Run `npm run build` to verify.

### Conventions

- **"Jargon, decoded" callouts** — every module decodes its jargon inline in a `note` callout, so a reader coming straight from university is never lost. This convention is shared across all six academies in this repo.
- **Honest trade-offs** — lessons name the cost and the downside, not just the happy path. Where AWS's own guidance and common practice differ, the lesson says so.
- **Progress is local** — stored in `localStorage` under `aws-academy-progress-v1` and `aws-academy-mastery-v1`. No accounts, no backend.

---

## Sibling academies

Part of a set of self-teaching apps in this repository: **Claude Academy**, **Agent Academy**, **Cloud Academy** (AWS *and* Azure side by side), **DevOps Academy**, and **Interview Academy**. AWS Academy is the deep, single-cloud one — where Cloud Academy teaches the concepts across two providers, this teaches AWS at the depth the job actually requires.
