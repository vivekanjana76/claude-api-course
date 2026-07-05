import type { Module } from "./types";

export const stack: Module = {
  id: "stack",
  title: "The AI Engineer's Stack",
  blurb:
    "Zoom out from one API to the whole discipline: the AI engineer role, the layers of a production LLM stack, adaptation choices, open-weight models, and engineering with AI itself.",
  accent: "ochre",
  lessons: [
    {
      slug: "the-ai-engineer",
      title: "The AI engineer role",
      summary:
        "A new discipline sits between software engineering and ML: shipping products on top of foundation models. Here's what the role actually is — and what 'AI-first engineer' means.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "A role that didn't exist five years ago" },
        {
          type: "p",
          text: "Classic ML engineering meant collecting data, training a model, and serving it. Foundation models flipped that: the model already exists, is better than anything you could train, and is an API call away. The scarce skill became **building reliable products on top of models you don't train** — that's the AI engineer.",
        },
        {
          type: "compare",
          caption: "Three adjacent roles",
          columns: ["Role", "Core question", "Typical work"],
          rows: [
            { label: "ML engineer", cells: ["How do I train & serve a model?", "Data pipelines, training runs, feature stores, model serving."] },
            { label: "AI engineer", cells: ["How do I build products on foundation models?", "Prompting, RAG, tool use, agents, evals, cost/latency engineering."] },
            { label: "AI-first engineer", cells: ["How do I build everything with AI leverage?", "Any software work, but designed around AI tools and agentic workflows."] },
          ],
        },
        { type: "h3", text: "The skills map" },
        {
          type: "list",
          items: [
            "**Model literacy** — what models can/can't do, how tokens, context, and pricing work (Module 1).",
            "**Prompting & context engineering** — getting reliable behavior from an unreliable interface (Module 2).",
            "**Evals** — turning 'it seems better' into a measurable, regression-proof loop (Module 3).",
            "**Tool use & agents** — connecting models to real systems safely (Module 4).",
            "**Retrieval** — grounding models in your data (Module 5).",
            "**Production judgment** — cost, latency, caching, failure modes, security (Module 6 and this one).",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The unit of progress is the eval, not the model",
          text: "ML engineers improve models; AI engineers improve systems around models. When a new model ships, your prompts, retrieval, and evals carry over — and your eval suite tells you in an hour whether to upgrade. Teams without evals re-run vibes.",
        },
        { type: "h3", text: "'AI-first' is a workflow, not a job title" },
        {
          type: "p",
          text: "An AI-first engineer treats AI as the default collaborator: coding agents write the first draft, docs and tests are written so agents can act on them, and repetitive work is delegated by default. The judgment — architecture, review, taste, knowing when the model is wrong — stays human. The last lesson in this module goes deep on this.",
        },
        {
          type: "callout",
          kind: "story",
          title: "Where the jobs actually are",
          text: "Most 'AI engineer' openings are product teams adding AI features — support copilots, document Q&A, workflow automation — not labs training models. The skills in this course map one-to-one to those postings: RAG, agents, evals, and cost control come up in nearly every JD.",
        },
      ],
      takeaways: [
        "AI engineers build products on foundation models they don't train; ML engineers build the models.",
        "The core skill set: model literacy, prompting, evals, tool use/agents, retrieval, and production judgment.",
        "Evals are the discipline's backbone — they make model upgrades and prompt changes measurable.",
        "'AI-first' means designing your own workflow around AI leverage, whatever you're building.",
      ],
      flashcards: [
        { front: "AI engineer vs ML engineer in one line?", back: "ML engineers train and serve models; AI engineers build reliable products on top of foundation models via prompting, RAG, tools, and evals." },
        { front: "Why are evals central to the AI engineer role?", back: "Model behavior is probabilistic and models change; evals turn quality into a number so upgrades and prompt changes are measurable instead of vibes." },
        { front: "What does 'AI-first engineer' mean?", back: "An engineer who defaults to AI leverage in their own workflow — coding agents, delegation of repetitive work — while keeping architecture and review judgment human." },
      ],
      quiz: [
        {
          q: "A team wants a support bot grounded in their help-center docs. Which role's skill set is this?",
          options: [
            "ML engineer — they'll need to train a support model",
            "AI engineer — prompting + RAG + evals on a foundation model",
            "Data engineer — it's mostly a pipeline problem",
            "It requires fine-tuning, so a research scientist",
          ],
          answer: 1,
          explain: "This is the canonical AI-engineering task: no training involved — ground an existing model in company data with RAG, then measure quality with evals.",
        },
        {
          q: "A new frontier model ships. What lets an AI-engineering team decide quickly whether to adopt it?",
          options: [
            "Reading the announcement benchmarks",
            "Asking the team to try it for a week",
            "Running their existing eval suite against it",
            "Waiting for community consensus",
          ],
          answer: 2,
          explain: "An eval suite runs your real tasks against the new model in hours and gives you a comparable score. Benchmarks and vibes don't reflect your workload.",
        },
      ],
    },
    {
      slug: "llm-app-stack",
      title: "The modern LLM app stack",
      summary:
        "Between your product and the model sits a stack of optional layers — gateways, orchestration, retrieval, observability, guardrails. Learn the map, and when each layer earns its place.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The map" },
        {
          type: "p",
          text: "Every production LLM app answers the same questions: how do requests reach a model, where does your data come in, and how do you know it's working? The stack below is the industry's current answer. **None of it is mandatory** — each layer solves a specific pain, and adding it before you feel that pain is how projects drown in plumbing.",
        },
        { type: "diagram", name: "ai-stack", caption: "The layers around the model. Start with product + SDK; add layers when a concrete pain appears." },
        { type: "h3", text: "Layer by layer" },
        {
          type: "compare",
          caption: "What each layer does, and example tools",
          columns: ["Layer", "Solves", "Examples"],
          rows: [
            { label: "Models & inference", cells: ["Raw capability", "Claude API; open-weights served by vLLM/SGLang; Bedrock & Vertex for cloud procurement."] },
            { label: "Gateway / router", cells: ["Many models, one interface: fallbacks, cost caps, key management", "LiteLLM, OpenRouter, cloud gateways."] },
            { label: "Orchestration", cells: ["Multi-step logic: chains, agent loops, retries", "Plain SDK code, Claude Agent SDK, LangGraph, Pydantic AI."] },
            { label: "Data & retrieval", cells: ["Grounding in your data", "pgvector, Qdrant, Pinecone, Elasticsearch hybrid search."] },
            { label: "Observability & evals", cells: ["Knowing what happened & whether it's good", "Langfuse, LangSmith, Braintrust, Arize Phoenix."] },
            { label: "Guardrails", cells: ["Blocking bad inputs/outputs", "Input classifiers, output validation, human-in-the-loop gates."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Start boring",
          text: "The strongest starting stack is embarrassingly small: the Anthropic SDK, pgvector in the Postgres you already run, a JSONL file of eval cases, and logging. Each is upgraded independently the day it hurts — that's the point of layers.",
        },
        { type: "h3", text: "When a layer earns its place" },
        {
          type: "steps",
          items: [
            { title: "Gateway", text: "You're on ≥2 providers, need automatic fallbacks, or must enforce per-team budgets. One model, one provider? The SDK is your gateway." },
            { title: "Orchestration framework", text: "Your hand-rolled loop has grown retries, branching, and state you keep getting wrong. Until then, a while-loop over messages.create() is clearer than any framework." },
            { title: "Dedicated vector DB", text: "pgvector struggles: tens of millions of vectors, heavy metadata filtering, or multi-tenant isolation." },
            { title: "Observability platform", text: "You're debugging multi-step traces in log files, or product wants quality dashboards. This one earns its place early — usually first." },
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Framework lock-in is real; API lock-in mostly isn't",
          text: "Swapping model providers is a config change behind a gateway. Swapping an orchestration framework that owns your prompts, state, and retries is a rewrite. Be liberal with model choices, conservative with framework choices.",
        },
        {
          type: "code",
          lang: "text",
          caption: "A sane default stack for a new product, 2026",
          code: `product code (TypeScript/Python)
  └─ Anthropic SDK            # direct; add LiteLLM only when multi-provider
  └─ Postgres + pgvector      # you already run Postgres
  └─ Langfuse (or similar)    # traces + eval logging from day one
  └─ evals: JSONL + a runner  # graduate to Braintrust/promptfoo when the suite grows
  └─ guardrails: zod/pydantic validation on every model output`,
        },
      ],
      takeaways: [
        "The stack has six layers: inference, gateway, orchestration, data/retrieval, observability/evals, guardrails — all optional except the model.",
        "Add a layer when you feel its specific pain, not because a reference architecture shows it.",
        "Observability usually earns its place first; orchestration frameworks last.",
        "Provider lock-in is shallow (config); framework lock-in is deep (rewrite). Choose accordingly.",
      ],
      flashcards: [
        { front: "What does an LLM gateway/router do?", back: "One interface over many providers: fallbacks, routing, key management, cost caps. Examples: LiteLLM, OpenRouter." },
        { front: "When should you adopt a dedicated vector DB over pgvector?", back: "When pgvector hurts: tens of millions of vectors, heavy metadata filtering, or strict multi-tenant isolation." },
        { front: "Which stack layer should usually be added first, and why?", back: "Observability/eval logging — you can't debug multi-step LLM behavior or measure quality from raw log files." },
      ],
      quiz: [
        {
          q: "A prototype calls Claude directly and works. The team's next proposed step is adopting a gateway, an agent framework, and a managed vector DB. What's the best critique?",
          options: [
            "Good — production apps need the full reference stack",
            "Each layer should wait for the pain it solves; add observability, keep the rest boring",
            "Wrong order — the vector DB must come first",
            "They should fine-tune before adding infrastructure",
          ],
          answer: 1,
          explain: "Layers earn their place through concrete pain (multi-provider needs, unmanageable loops, pgvector limits). Observability is the one early add because you can't improve what you can't see.",
        },
        {
          q: "Why is an orchestration framework a riskier commitment than a model provider?",
          options: [
            "Frameworks cost more per token",
            "Providers change APIs more often",
            "The framework ends up owning prompts, state, and control flow — swapping it is a rewrite, while providers swap behind a gateway",
            "It isn't — both are config changes",
          ],
          answer: 2,
          explain: "Model calls are a narrow interface that gateways abstract; a framework is woven through your codebase.",
        },
      ],
    },
    {
      slug: "prompt-rag-finetune",
      title: "Prompting vs RAG vs fine-tuning",
      summary:
        "Three ways to adapt a model to your problem, usually applied in exactly that order. A decision framework for behavior vs knowledge — plus where LoRA and distillation fit.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The adaptation spectrum" },
        {
          type: "p",
          text: "When the base model isn't good enough at *your* task, you have three levers, in rising order of cost and commitment: **prompting** (change the instructions), **RAG** (change what it knows at request time), and **fine-tuning** (change the weights). The classic mistake is reaching for the expensive lever first.",
        },
        {
          type: "callout",
          kind: "key",
          title: "Behavior vs knowledge",
          text: "One question resolves most cases. Missing KNOWLEDGE (your docs, today's data, a customer's history) → RAG: knowledge is per-request and changes often. Wrong BEHAVIOR (format, tone, domain style) → prompting first; fine-tuning only when examples-in-prompt can't capture it.",
        },
        {
          type: "compare",
          caption: "The three levers",
          columns: ["Lever", "Changes", "Strengths", "Limits"],
          rows: [
            { label: "Prompting", cells: ["Instructions & examples", "Instant, free to iterate, transferable across models", "Long prompts cost tokens; can't add knowledge the model lacks"] },
            { label: "RAG", cells: ["Per-request context", "Fresh & private data, citations, updates without retraining", "Retrieval quality caps answer quality; adds infra"] },
            { label: "Fine-tuning", cells: ["The weights", "Locks in style/format, distills capability into smaller models, shortens prompts", "Costly to redo, data-hungry, frozen knowledge, weakens general ability"] },
          ],
        },
        { type: "h3", text: "What fine-tuning actually is now" },
        {
          type: "p",
          text: "Almost nobody retrains full weights. **LoRA** (low-rank adapters) trains a small add-on — often <1% of parameters — that steers an open-weight model; cheap enough to run on rented GPUs in hours. **Distillation** goes further: use a frontier model to generate thousands of high-quality input→output pairs, then fine-tune a small open model on them — buying frontier-ish quality on one narrow task at a fraction of the serving cost.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Fine-tuning is not for facts",
          text: "Fine-tuning teaches patterns, not reliable recall. Feeding your knowledge base into training data produces a model that hallucinates in your company's tone of voice. Facts belong in retrieval; behavior belongs in weights.",
        },
        { type: "h3", text: "A decision walk" },
        {
          type: "steps",
          items: [
            { title: "Prompt harder first", text: "Clear instructions, few-shot examples, structured output. With evals to verify, this resolves most 'the model can't do X' complaints." },
            { title: "Missing knowledge? Add RAG", text: "If failures trace to information the model couldn't have, no amount of prompting fixes it. Retrieve, ground, cite." },
            { title: "Behavior still wrong at scale? Consider fine-tuning", text: "Thousands of good examples, a stable task, and a motive: consistency a prompt can't hold, or cutting a small model loose from a long prompt." },
            { title: "Chasing cost? Distill", text: "Frontier model as teacher, small open model as student — for the one high-volume task where per-token economics dominate." },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "They stack",
          text: "Production systems combine levers: a fine-tuned small model for the high-volume classification step, RAG for knowledge, and careful prompting everywhere. It's an AND, not an XOR — but adopt in order.",
        },
      ],
      takeaways: [
        "Adapt in order: prompting (instant), RAG (fresh knowledge), fine-tuning (locked-in behavior).",
        "Behavior vs knowledge is the routing question: knowledge → RAG, behavior → prompting, then maybe fine-tuning.",
        "Modern fine-tuning means LoRA adapters and distillation onto small open models, not full retraining.",
        "Never fine-tune to teach facts — it produces confident hallucination; facts live in retrieval.",
      ],
      flashcards: [
        { front: "The one question that routes prompting/RAG/fine-tuning decisions?", back: "Is the model missing KNOWLEDGE (→ RAG) or exhibiting wrong BEHAVIOR (→ prompting, then fine-tuning if examples can't capture it)?" },
        { front: "What is LoRA?", back: "Low-Rank Adaptation — fine-tuning a small adapter (often <1% of parameters) on top of frozen open-model weights; cheap, fast, swappable." },
        { front: "What is distillation in the LLM context?", back: "Using a frontier model to generate training data that fine-tunes a smaller model, transferring narrow-task capability at much lower serving cost." },
      ],
      quiz: [
        {
          q: "A legal-tech team wants answers grounded in their (weekly-updated) contract database. Which lever?",
          options: [
            "Fine-tune on the contracts",
            "RAG over the contract database",
            "A longer system prompt describing the contracts",
            "Distill a contracts model",
          ],
          answer: 1,
          explain: "Fresh, per-customer knowledge is the RAG case. Fine-tuning would freeze last month's contracts into weights and hallucinate the rest.",
        },
        {
          q: "When does fine-tuning beat few-shot prompting for output style?",
          options: [
            "Always — weights beat prompts",
            "When you have thousands of examples, a stable task, and prompting can't hold the behavior consistently (or the prompt's length/cost matters at volume)",
            "Whenever you have any examples available",
            "Never — prompting always suffices",
          ],
          answer: 1,
          explain: "Fine-tuning pays off for stable, high-volume tasks where consistency or per-request token cost justifies the training investment.",
        },
        {
          q: "Why is fine-tuning on your knowledge base an anti-pattern?",
          options: [
            "It's illegal for private data",
            "Training teaches patterns, not reliable recall — the model will fluently hallucinate your domain",
            "It's slower than RAG at inference",
            "It only works on frontier models",
          ],
          answer: 1,
          explain: "Weights store style and skills well but facts poorly. Retrieval gives verifiable, updatable grounding with citations.",
        },
      ],
    },
    {
      slug: "open-weight-models",
      title: "Open-weight & local models",
      summary:
        "Llama, Qwen, Mistral, DeepSeek — models whose weights you can download and run. When they beat a frontier API, when they don't, and the serving stack around them.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The other half of the model world" },
        {
          type: "p",
          text: "Alongside hosted frontier APIs sits a thriving ecosystem of **open-weight models** — Meta's Llama, Alibaba's Qwen, Mistral, DeepSeek and more — whose weights you download and run wherever you like. 'Open-weight' is the precise term: you get the weights, usually under a custom license; training data and code mostly stay closed.",
        },
        { type: "diagram", name: "model-tiers", caption: "The tiers logic applies across ecosystems: frontier hosted models at the top, capable open-weight models covering ever more of the middle." },
        { type: "h3", text: "The runtime stack" },
        {
          type: "compare",
          caption: "Running open weights, from laptop to cluster",
          columns: ["Layer", "Tools", "Notes"],
          rows: [
            { label: "Local / dev", cells: ["Ollama, LM Studio, llama.cpp", "One command on a laptop; great for prototyping and privacy-sensitive experiments."] },
            { label: "Production serving", cells: ["vLLM, SGLang, TGI", "GPU servers with batching, paged attention, OpenAI-compatible endpoints."] },
            { label: "Managed open-weights", cells: ["Together, Fireworks, Groq, Bedrock", "Someone else runs the GPUs; you keep model choice and lower prices."] },
            { label: "Quantization", cells: ["GGUF, 4/8-bit variants", "Shrinks memory so big models fit small hardware, at a small quality cost."] },
          ],
        },
        { type: "h3", text: "Hosted frontier vs open-weight: the real trade-offs" },
        {
          type: "list",
          items: [
            "**Capability**: frontier hosted models still win on hard reasoning, long agentic tasks, and reliability under weird inputs. Open models close the gap on routine tasks first.",
            "**Data control**: open weights run inside your VPC or on-prem — decisive in regulated industries or air-gapped environments.",
            "**Economics**: at very high volume on a narrow task, a small (possibly distilled) open model can undercut API pricing — *if* you count the GPU, ops, and engineering bill honestly.",
            "**Customization**: you can LoRA-tune open weights freely — the lever the previous lesson covered.",
            "**Ops burden**: you now own uptime, scaling, security patches, and model upgrades. That team costs more than most API bills.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The pragmatic pattern is hybrid",
          text: "Frontier API for the hard, low-volume, high-stakes work; a small open model for one or two high-volume narrow tasks (classification, extraction, summarization) once evals prove it's good enough. A gateway makes the routing invisible to product code.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Don't decide on price-per-token alone",
          text: "A cheaper model that's 5% worse on your eval can cost more overall: more retries, more human review, more churn. Total cost of quality — measured on YOUR evals — is the comparison, never the pricing page.",
        },
      ],
      takeaways: [
        "'Open-weight' means downloadable weights (Llama, Qwen, Mistral, DeepSeek) — not open training data or code.",
        "The stack: Ollama/llama.cpp locally; vLLM/SGLang for production; Together/Fireworks/Groq if you want open models without GPUs.",
        "Open weights win on data control, customization, and narrow-task economics; frontier APIs win on capability and zero ops.",
        "Hybrid routing — frontier for hard work, small open model for proven high-volume tasks — is the dominant production pattern.",
      ],
      flashcards: [
        { front: "What does 'open-weight' mean, precisely?", back: "The trained weights are downloadable and runnable anywhere (usually under a custom license); training data and code typically remain closed." },
        { front: "Ollama vs vLLM?", back: "Ollama runs models locally for dev/prototyping in one command; vLLM is a production GPU serving engine with batching and OpenAI-compatible endpoints." },
        { front: "What is quantization?", back: "Compressing model weights to lower precision (e.g., 4-bit) so they fit in less memory and run faster, with a small quality trade-off." },
      ],
      quiz: [
        {
          q: "A hospital needs an LLM that never sends data outside its network. Which approach fits?",
          options: [
            "Any frontier API with a no-training clause",
            "An open-weight model served with vLLM inside their infrastructure",
            "A browser-based model",
            "Fine-tuning a hosted model",
          ],
          answer: 1,
          explain: "Air-gapped/data-residency requirements are the clearest open-weight win: the model runs entirely inside infrastructure they control.",
        },
        {
          q: "A startup processes 50M short classification calls/month on a frontier model and wants to cut costs. Best first move?",
          options: [
            "Negotiate an enterprise discount",
            "Eval a small open (or distilled) model on that one task; route to it via the gateway if it passes",
            "Move everything to open weights immediately",
            "Cache every response",
          ],
          answer: 1,
          explain: "High-volume + narrow task is exactly where small open models shine — but the eval gate comes first, and the frontier model stays for hard work.",
        },
      ],
    },
    {
      slug: "ai-first-engineering",
      title: "AI-assisted & AI-first engineering",
      summary:
        "Coding agents like Claude Code changed how software gets built. How agentic coding works, how to stay in control of it, and what an AI-first engineering workflow looks like.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "From autocomplete to agents" },
        {
          type: "p",
          text: "AI coding help arrived in waves: **autocomplete** (inline suggestions), **chat** (paste code, ask questions), and now **coding agents** — tools like Claude Code that take a task, explore the repo, edit files, run tests, and iterate until done. The third wave is different in kind: you review outcomes and diffs, not keystrokes.",
        },
        { type: "diagram", name: "agentic-loop", caption: "A coding agent is the agentic loop pointed at your repo: explore → edit → run tests → observe → repeat." },
        { type: "h3", text: "What makes agents effective on a codebase" },
        {
          type: "list",
          items: [
            "**Written context** — a project brief (like a CLAUDE.md) with conventions, commands, and gotchas; agents read it every session.",
            "**Fast, trustworthy tests** — the agent's feedback loop. A repo where `npm test` means something lets agents self-correct; a repo without tests makes them confidently wrong.",
            "**Small, reviewable tasks** — 'add rate-limiting to this endpoint' beats 'improve the API'. Scope is the main quality lever you hold.",
            "**Clean tooling** — linters, typecheckers, reproducible builds. Every automated signal you'd give a junior engineer, an agent uses too.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "You own what you ship",
          text: "The agent wrote it; you shipped it. Review AI diffs with the same rigor as human PRs — especially security-sensitive code, dependency changes, and anything touching auth or money. 'The AI did it' is not a post-mortem finding anyone accepts.",
        },
        { type: "h3", text: "Spec-driven development" },
        {
          type: "p",
          text: "As agents got stronger, the leverage moved upstream: the scarce artifact is a **good spec**. Teams increasingly write the intended behavior — inputs, outputs, edge cases, non-goals — and let agents propose the implementation. The spec doubles as review checklist and test source. Vague specs produce plausible-looking wrong code; precise specs produce reviewable code.",
        },
        {
          type: "steps",
          items: [
            { title: "Spec", text: "Write what should exist: behavior, constraints, edge cases, what NOT to touch." },
            { title: "Delegate", text: "Hand the spec to the agent; let it plan, implement, and run the tests." },
            { title: "Review", text: "Read the diff against the spec. Push back in comments — iterating with the agent is cheaper than editing by hand." },
            { title: "Harvest", text: "Fold what you learned into the project brief and tests, so the next run starts smarter." },
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "The failure modes are human",
          text: "Skipped review ('it looked fine'), tasks too large to review meaningfully, and letting the agent guess requirements you never wrote down. Teams that treat agents as unaccountable seniors get burned; teams that treat them as tireless juniors with superhuman breadth do well.",
        },
        {
          type: "callout",
          kind: "story",
          title: "This connects back to the whole course",
          text: "A coding agent is just the Module 4 agentic loop with file and shell tools, steered by Module 2 prompting (the spec), and kept honest by Module 3-style evaluation (tests). If you understood those, you already understand your own tools.",
        },
      ],
      takeaways: [
        "Coding agents run the full agentic loop on your repo — you review diffs and outcomes, not keystrokes.",
        "Agents are as good as their environment: written project context, fast tests, small scoped tasks, strict tooling.",
        "Spec-driven development moves the craft upstream — precise specs in, reviewable diffs out.",
        "Review discipline is non-negotiable: you own what you ship, whoever typed it.",
      ],
      flashcards: [
        { front: "What distinguishes a coding agent from AI autocomplete/chat?", back: "It runs the agentic loop against your repo — exploring, editing files, running tests, iterating — and you review resulting diffs instead of accepting suggestions inline." },
        { front: "Four things that make a repo agent-friendly?", back: "A written project brief (CLAUDE.md-style), fast trustworthy tests, small scoped tasks, and strict automated tooling (linters, typecheckers)." },
        { front: "What is spec-driven development?", back: "Writing precise behavior specs (inputs, outputs, edge cases, non-goals) and delegating implementation to agents; the spec doubles as the review checklist." },
      ],
      quiz: [
        {
          q: "A team's coding agent keeps producing broken changes it claims are done. The likeliest root cause?",
          options: [
            "The model is too small",
            "The repo gives no reliable feedback — weak or slow tests, so the agent can't self-correct",
            "Agents can't handle real repos",
            "The tasks are too small",
          ],
          answer: 1,
          explain: "Tests are the agent's eyes. Without a trustworthy test signal, the loop can't distinguish working from plausible.",
        },
        {
          q: "What's the right review posture for agent-written code touching authentication?",
          options: [
            "Trust it if the tests pass",
            "Same rigor as a human PR, plus extra scrutiny because it's security-sensitive — you own what you ship",
            "Regenerate it twice and diff the versions",
            "Only review the parts the agent flagged",
          ],
          answer: 1,
          explain: "Accountability doesn't transfer to the tool. Security-sensitive diffs get full human review regardless of author.",
        },
      ],
    },
  ],
};
