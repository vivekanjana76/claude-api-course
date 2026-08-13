import type { Module } from "./types";

export const systemdesign: Module = {
  id: "systemdesign",
  title: "AI system design",
  blurb:
    "The round that decides most senior AI Engineer offers: a repeatable framework, two fully worked designs, and the capacity and cost arithmetic interviewers expect on the whiteboard.",
  accent: "iris",
  lessons: [
    {
      slug: "the-design-framework",
      title: "A framework for AI system design rounds",
      summary:
        "How to structure 45 minutes so you cover requirements, architecture, evaluation and operations — and never run out of time before the interesting part.",
      minutes: 11,
      blocks: [
        { type: "p", text: "AI system design rounds fail for a predictable reason: candidates dive into the architecture, spend thirty minutes on retrieval, and never mention evaluation, cost, or failure handling — which is what the interviewer was actually assessing. A structure prevents that." },
        { type: "diagram", name: "design-framework", caption: "Six phases in forty-five minutes. The last two are where senior candidates separate themselves." },
        { type: "compare", caption: "Budget your time explicitly, out loud.", columns: ["Phase", "Minutes", "What you produce"], rows: [
          { label: "1. Clarify", cells: ["5", "Users, scale, latency and cost targets, quality bar, constraints"] },
          { label: "2. Define success", cells: ["4", "What 'good' means and how it will be measured — before any boxes"] },
          { label: "3. High-level design", cells: ["10", "The end-to-end request path, drawn"] },
          { label: "4. Deep dive", cells: ["12", "The one or two components the interviewer steers you to"] },
          { label: "5. Evaluation & operations", cells: ["8", "Eval suite, monitoring, rollout, failure handling"] },
          { label: "6. Trade-offs & scale", cells: ["6", "What you'd change at 10×, what you consciously didn't build"] },
        ]},
        { type: "h2", text: "Phase 1 — clarify" },
        { type: "p", text: "Never start drawing before you know these. Ask them as a list; it takes ninety seconds and reframes the whole conversation." },
        { type: "list", items: [
          "**Who uses it, and for what decision?** Internal support agents and public customers imply completely different risk tolerances.",
          "**Volume** — requests per day, peak concurrency, and growth expectation.",
          "**Latency target** — interactive (sub-2s), near-real-time, or batch. This one constraint eliminates half the design space.",
          "**Quality bar and the cost of being wrong** — is a wrong answer an annoyance, a refund, or a regulatory event?",
          "**Data** — what corpus, how large, how often it changes, and who is allowed to see what.",
          "**Constraints** — data residency, on-prem requirements, existing stack, budget, team size.",
        ]},
        { type: "callout", kind: "key", text: "**Ask \"what happens when it's wrong?\" in the first five minutes.** It's the question that determines whether you need citations, human review, confidence thresholds, or none of them — and asking it early signals production experience more than any architecture detail." },
        { type: "h2", text: "Phase 2 — define success before you design" },
        { type: "p", text: "Say explicitly: *\"Before I draw anything, here's how I'd know this works.\"* Name the eval dataset, the metrics, the slices, and the pass bar. Interviewers consistently rate this as the strongest senior signal, and almost nobody does it unprompted." },
        { type: "h2", text: "Phase 3 — the high-level path" },
        { type: "p", text: "Draw the request path left to right and narrate it. Keep it to seven or eight boxes; you can always expand." },
        { type: "code", lang: "text", caption: "The skeleton that fits almost any AI system design prompt", code: `request
  → auth, rate limit, trace id
  → input guardrail            (cheap checks first)
  → router                     (which model / retriever / no retrieval)
  → context assembly           (retrieve · rerank · history · tools)
  → model call                 (pinned version, prompt cached, streamed)
  → tool loop                  (validated, authorised, step-limited)   [if agentic]
  → output validation          (schema · citations · policy)
  → response + trace           (tokens, cost, latency, verdicts)

offline: ingest → chunk → embed → index      |   evals in CI + sampled online`},
        { type: "h2", text: "Phase 4 — the deep dive" },
        { type: "p", text: "The interviewer will pick a component. Have depth ready on the four that come up most: **retrieval quality** (hybrid, reranking, chunking, recall@k), **the agent loop** (termination, tool design, authorisation), **evaluation** (dataset, judges, calibration), and **cost/latency** (caching, routing, the arithmetic)." },
        { type: "h2", text: "Phase 5 — evaluation and operations" },
        { type: "steps", items: [
          { title: "Offline evals", text: "Golden set, sliced; assertions in CI; judged metrics before release; explicit pass bars." },
          { title: "Online measurement", text: "Sampled judging, regeneration and escalation rates, guardrail metrics, cost per successful outcome." },
          { title: "Rollout", text: "Feature-flagged prompt and model versions, canary, progressive rollout, one-flag rollback." },
          { title: "Failure handling", text: "Provider outage, retrieval returning nothing, validation failure, cost spike — name a behaviour for each." },
          { title: "The feedback loop", text: "Production failures become permanent eval cases. Say this out loud; it's the difference between a system and a demo." },
        ]},
        { type: "h2", text: "Phase 6 — trade-offs" },
        { type: "callout", kind: "tip", text: "End by naming what you **deliberately did not build**, and why. \"I'd skip the knowledge graph — vector plus metadata filters covers the question types we listed, and the graph costs an LLM pass over the corpus plus ongoing maintenance.\" Stating a conscious omission with a reason is a stronger signal than adding another box." },
        { type: "h2", text: "What separates the levels" },
        { type: "compare", caption: "The same prompt, three different answers.", columns: ["Level", "Characteristic answer"], rows: [
          { label: "Junior", cells: ["Names components correctly: vector DB, embeddings, an LLM"] },
          { label: "Mid", cells: ["Correct end-to-end design with sensible technology choices and a working request path"] },
          { label: "Senior", cells: ["Leads with evaluation, quantifies cost and latency, names failure modes and their handling, and justifies what was left out"] },
          { label: "Staff+", cells: ["Questions the premise, proposes a cheaper approach that meets the actual requirement, and reasons about team and operational cost"] },
        ]},
        { type: "callout", kind: "warn", text: "The most common self-inflicted wound: **over-engineering**. A candidate proposes agents, a knowledge graph, fine-tuning, and a multi-agent supervisor for a problem that a well-built RAG pipeline solves. Interviewers read that as poor judgment, not ambition. Start simple, and add complexity only when you can name the failure it fixes." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Functional vs non-functional requirements** = what it does vs how fast, cheap, available, and secure it must be. **SLO** = the reliability or latency target you commit to. **Blast radius** = how much breaks when one component fails. **Back-of-envelope** = order-of-magnitude arithmetic done live. **Happy path** = the flow when nothing goes wrong — the smaller half of any real design." },
      ],
      takeaways: [
        "Budget the 45 minutes across clarify, define success, high-level design, deep dive, evaluation/operations, and trade-offs.",
        "Ask 'what happens when it's wrong?' in the first five minutes — it determines the whole risk architecture.",
        "State how you'd measure success before drawing any boxes; almost nobody does, and interviewers rate it highly.",
        "Have depth ready on retrieval quality, the agent loop, evaluation, and cost/latency arithmetic.",
        "Close by naming what you deliberately didn't build and why — conscious omission beats another box.",
      ],
      flashcards: [
        { front: "What should you say before drawing any architecture?", back: "How you'd know it works: the eval dataset, the metrics, the slices, and the pass bar. It's the strongest senior signal and almost nobody offers it unprompted." },
        { front: "Which clarifying question matters most?", back: "'What happens when it's wrong?' It decides whether you need citations, human review, confidence thresholds, or none — and it reframes the entire design." },
        { front: "What's the most common way candidates lose an AI design round?", back: "Over-engineering — agents, graphs, and fine-tuning for a problem a solid RAG pipeline solves. Interviewers read it as poor judgment rather than ambition." },
        { front: "What distinguishes a senior answer from a mid-level one?", back: "Leading with evaluation, quantifying cost and latency, naming failure modes with their handling, and justifying deliberate omissions — not more components." },
      ],
      quiz: [
        { q: "You have 45 minutes for an AI design round. What should the first 10 cover?", options: ["The retrieval architecture", "Clarifying requirements, then how success will be measured", "Model selection", "The vector database choice"], answer: 1, explain: "Requirements determine the design space and the success definition determines what 'done' means. Diving into components first is how candidates run out of time before evaluation and operations." },
        { q: "The interviewer asks you to design a support assistant. You propose RAG plus a knowledge graph plus fine-tuning. What's the risk?", options: ["Not ambitious enough", "Over-engineering — read as poor judgment", "Too slow to explain", "Not enough components"], answer: 1, explain: "Every added component needs a named failure it fixes. Unjustified complexity signals that you can't distinguish what matters from what's fashionable." },
        { q: "How should you end a design round?", options: ["Add one more component", "Name trade-offs, what changes at 10×, and what you deliberately left out", "Summarise the components", "Ask about the team"], answer: 1, explain: "Trade-offs and conscious omissions demonstrate judgment. A component list demonstrates recall, which they already have from the rest of the answer." },
      ],
    },
    {
      slug: "design-a-rag-assistant",
      title: "Worked design: an enterprise knowledge assistant",
      summary:
        "The most common prompt in the industry, answered end to end — requirements, architecture, permissions, evaluation, cost, and the trade-offs.",
      minutes: 13,
      blocks: [
        { type: "p", text: "**\"Design an AI assistant that answers employee questions from our internal documentation.\"** This is the single most common AI system design prompt. Here is a full answer, in the order you'd actually give it." },
        { type: "diagram", name: "assistant-reference", caption: "The reference design, with the permission boundary drawn where it belongs." },
        { type: "h2", text: "1. Clarify (what you'd ask)" },
        { type: "compare", caption: "The answers this walkthrough assumes.", columns: ["Question", "Assumed answer"], rows: [
          { label: "Users and volume", cells: ["8,000 employees, ~20,000 questions/day, peak 60 concurrent"] },
          { label: "Corpus", cells: ["~400,000 documents across a wiki, an HR system, and a policy store; ~2,000 change weekly"] },
          { label: "Permissions", cells: ["Documents are ACL'd by department and seniority — this is a hard requirement"] },
          { label: "Latency", cells: ["First token under 2 seconds; streamed"] },
          { label: "Cost of being wrong", cells: ["High for policy and HR answers — citations are mandatory, and it must decline rather than guess"] },
          { label: "Constraints", cells: ["EU data residency; the company already runs Postgres"] },
        ]},
        { type: "h2", text: "2. How I'd know it works" },
        { type: "list", items: [
          "**Golden set** of 300 real employee questions with expected source documents, sliced by department, language, and question type, including **~15% unanswerable** and ~10% permission-sensitive cases.",
          "**Retrieval:** recall@20 ≥ 0.92, and nDCG@5 tracked as the reranking signal.",
          "**Generation:** groundedness ≥ 0.95, correct-decline rate ≥ 0.90 on unanswerable cases.",
          "**Security:** a zero-tolerance automated test that no user retrieves a chunk they lack permission for. This gates every release.",
          "**Operations:** p95 TTFT ≤ 2s, cost per answer ≤ $0.02, escalation-to-human rate as the north-star quality proxy.",
        ]},
        { type: "h2", text: "3. Architecture" },
        { type: "steps", items: [
          { title: "Ingestion (offline, incremental)", text: "Connectors poll each source; layout-aware parsing; structure-aware chunking on headings (400–800 tokens); contextual retrieval prepends a generated one-line situating summary before embedding; **ACLs and effective dates copied onto every chunk**; content-hash dedup so only changed documents are re-embedded. Nightly full reconcile catches deletions." },
          { title: "Storage", text: "pgvector in the existing Postgres — 400k docs at ~4 chunks each is ~1.6M vectors, comfortably within range, and it keeps chunks, metadata, and ACLs in one transactional system with real SQL filtering." },
          { title: "Query path", text: "Rewrite follow-ups into standalone questions → hybrid retrieval (vector + BM25, top 50 each) **with the ACL filter inside the SQL query** → RRF fusion → cross-encoder rerank to 6 → relevance floor check." },
          { title: "Generation", text: "Mid-tier model, pinned version, EU region; system prompt and tool definitions cached as a stable prefix; strict grounding instruction with an explicit decline path; citations required; streamed." },
          { title: "Validation", text: "Cited IDs verified against what was supplied; PII scan; if the top reranked score is below the floor, decline with a suggestion to contact the owning team rather than answering." },
          { title: "Observability", text: "One trace per request: rendered prompt, retrieved chunk IDs and scores, prompt version, model, tokens, cost, latency by stage, guardrail verdicts, outcome. Sampled judging on 2% of traffic." },
        ]},
        { type: "callout", kind: "key", text: "**Say the permissions sentence out loud**: *\"The ACL filter goes inside the retrieval query, not after it — otherwise the model has already seen documents the user can't access, and its summary can leak them.\"* This one sentence is what interviewers listen for in an enterprise RAG design, and most candidates miss it." },
        { type: "h2", text: "4. The numbers" },
        { type: "code", lang: "python", caption: "Back-of-envelope, said out loud", code: `# --- retrieval sizing ---
docs, chunks_per_doc = 400_000, 4
vectors = 1_600_000
storage = vectors * 1024 * 4 / 1e9          # ≈ 6.6 GB of vectors — trivial for pgvector

# --- per answer ---
system_and_tools   = 1_200      # cached after the first call
reranked_context   = 6 * 500    # 6 passages ≈ 3,000 tokens
history            =   800
output             =   300
# cost at mid-tier pricing, with the stable prefix cached
cost = (1_200*0.3 + 3_800*3.0 + 300*15.0) / 1e6   # ≈ $0.017 per answer ✓

# --- daily ---
20_000 * 0.017                                    # ≈ $340/day ≈ $10k/month
# 60 concurrent at ~4s each is ~15 rps — well inside a single provider account,
# but request a quota increase before launch rather than during it.

# --- the levers if that's too high ---
#  route simple lookups to the small tier   → ~40% saving
#  rerank to 4 passages instead of 6         → ~15% saving
#  semantic cache on the top 200 FAQs        → ~10% saving, tenant-scoped`},
        { type: "h2", text: "5. Failure handling" },
        { type: "compare", caption: "Name a behaviour for each.", columns: ["Failure", "Behaviour"], rows: [
          { label: "Retrieval returns nothing above the floor", cells: ["Decline, and offer the owning team's contact — never answer from parametric memory"] },
          { label: "Provider outage", cells: ["Fail over to a second provider that has passed the eval suite; degrade to search-results-only if both are down"] },
          { label: "Index rebuild breaks", cells: ["Alert on retrieval score distribution collapse; serve the previous index version"] },
          { label: "Citation verification fails", cells: ["Regenerate once, then decline — never render an unverified citation"] },
          { label: "Cost spike", cells: ["Per-tenant budget alert; automatic downgrade to the small tier before hard limits"] },
        ]},
        { type: "h2", text: "6. Trade-offs, and what I didn't build" },
        { type: "list", items: [
          "**No agent loop.** Questions here are single-hop lookups; an agent adds latency, cost, and unpredictability for no measured gain. I'd revisit if the eval set showed multi-hop questions failing.",
          "**No knowledge graph.** Vector plus metadata filters covers the question types listed; a graph costs an LLM pass over 400k documents plus ongoing maintenance.",
          "**No fine-tuning.** The failures are knowledge and retrieval failures, not behaviour failures.",
          "**pgvector, not a dedicated vector DB.** 1.6M vectors is comfortable, and co-locating with the ACL tables makes permission filtering correct by construction. I'd move if we hit ~50M vectors or p95 retrieval latency became the bottleneck.",
          "**At 10×**: read replicas for retrieval, a dedicated vector store if latency demands it, semantic caching on the FAQ head, and a small fine-tuned model for the highest-volume question class.",
        ]},
        { type: "callout", kind: "warn", text: "Two details that separate people who have shipped this from people who have read about it: **freshness** (a stale index is confidently wrong, so incremental ingestion with a nightly reconcile and a monitored index-age metric is part of the design) and **deletions** (a document removed from the wiki must disappear from the index, or you'll answer from a policy that no longer exists)." },
      ],
      takeaways: [
        "Open with assumed requirements and the success definition, including permission-sensitive and unanswerable eval cases.",
        "Ingest incrementally with contextual retrieval, ACLs on every chunk, and content-hash dedup; reconcile nightly for deletions.",
        "Enforce ACLs inside the retrieval query — say this explicitly; it's the detail interviewers listen for.",
        "Do the arithmetic out loud: ~1.6M vectors, ~$0.017 per answer, ~$10k/month, with named levers to reduce it.",
        "Close with deliberate omissions — no agent, no graph, no fine-tuning, pgvector over a dedicated store — each with a reason and a revisit trigger.",
      ],
      flashcards: [
        { front: "Where does the ACL filter go in enterprise RAG, and why?", back: "Inside the retrieval query. Filtering after retrieval means the model already saw documents the user can't access, and its summary can leak them." },
        { front: "What eval cases prove an enterprise assistant is safe?", back: "Permission-sensitive cases asserting a user never retrieves a chunk they lack rights to (zero tolerance, gating every release), plus ~15% unanswerable cases proving it declines." },
        { front: "Why pgvector for 1.6M vectors?", back: "It's comfortably within range, and co-locating vectors with the ACL tables makes permission filtering transactional and correct by construction — one system to operate instead of two." },
        { front: "Why does a stale index matter more than a slow one?", back: "A stale index produces confidently wrong answers from superseded policies. Incremental ingestion, nightly reconciliation for deletions, and a monitored index-age metric are part of the design." },
        { front: "What should you do when retrieval scores fall below the relevance floor?", back: "Decline and point to the owning team. Answering from parametric memory when retrieval failed is the exact behaviour the whole architecture exists to prevent." },
      ],
      quiz: [
        { q: "Employees in Finance can see documents HR employees cannot. Where is that enforced?", options: ["In the system prompt", "As a filter inside the retrieval SQL query", "By post-filtering the answer", "In the frontend"], answer: 1, explain: "Only a query-level filter prevents the model from ever seeing restricted content. Prompt instructions and post-filtering both leave the data in the context window." },
        { q: "A policy document is deleted from the wiki. What must happen?", options: ["Nothing — it'll expire", "It's removed from the index, verified by a reconciliation job", "It's marked low priority", "The cache is cleared"], answer: 1, explain: "An orphaned chunk means confidently citing a policy that no longer exists. Incremental ingestion plus a nightly reconcile catches deletions that event streams miss." },
        { q: "The assistant is asked something the documentation doesn't cover. Correct behaviour?", options: ["Answer from general knowledge", "Decline and point to the owning team", "Return the closest document", "Ask a clarifying question forever"], answer: 1, explain: "Declining is the designed behaviour and is measured explicitly — the relevance floor exists so an ungrounded answer never reaches an employee as if it were policy." },
      ],
    },
    {
      slug: "design-an-agent-platform",
      title: "Worked design: an agent platform",
      summary:
        "The harder prompt — a system where agents take actions on real systems, with the isolation, approval, and cost controls that requires.",
      minutes: 12,
      blocks: [
        { type: "p", text: "**\"Design a platform where internal teams can build agents that take actions in our systems.\"** This prompt tests whether you understand that agents are a *permissions and reliability* problem before they're a modelling problem." },
        { type: "h2", text: "1. Clarify" },
        { type: "list", items: [
          "**Who builds agents, and who runs them?** A platform for engineers is different from one for business users.",
          "**What actions?** Read-only research is a different system from one that issues refunds.",
          "**Whose permissions apply** — the invoking user's, or a service account's? (The correct answer is almost always the user's.)",
          "**Interactive or long-running?** Minutes of tool use changes the whole state and resumption story.",
          "**Blast radius tolerance** — what is the worst single action an agent could take, and is that acceptable?",
        ]},
        { type: "callout", kind: "key", text: "**Lead with this:** *\"Before architecture — the central design constraint is that an agent's actions execute with somebody's authority. So the platform's job is to make that authority explicit, minimal, and auditable.\"* That framing is the answer to the question they're really asking." },
        { type: "h2", text: "2. Architecture" },
        { type: "compare", caption: "The components, and why each exists.", columns: ["Component", "Responsibility"], rows: [
          { label: "Agent registry", cells: ["Definitions in git: prompt, tools, model, limits, owner, approval policy"] },
          { label: "Tool catalogue (MCP servers)", cells: ["Capabilities exposed once per system, with per-tool authorisation and audit"] },
          { label: "Execution runtime", cells: ["The loop with step, token, and time limits; checkpointed state for resumability"] },
          { label: "Identity broker", cells: ["Exchanges the invoking user's identity for scoped, short-lived credentials per tool call"] },
          { label: "Approval service", cells: ["Pauses a run, routes to a human, resumes on decision — with the full context shown"] },
          { label: "Sandbox", cells: ["Isolated compute for generated code: no credentials, no network except an allow-list"] },
          { label: "Trace store", cells: ["Every step, tool call, argument, result, and approval — the audit record"] },
          { label: "Budget service", cells: ["Per-agent, per-team, per-run token and cost caps, enforced before spend"] },
        ]},
        { type: "h2", text: "3. The controls that make it safe" },
        { type: "steps", items: [
          { title: "Tools declare risk tiers", text: "read / write / irreversible. The tier determines the default approval policy, so safety isn't left to each agent author's judgment." },
          { title: "Identity flows through every call", text: "Short-lived credentials scoped to the invoking user, issued per call. No agent holds a standing service credential." },
          { title: "Approval is a first-class state", text: "The run pauses, the human sees the proposed action *and the reasoning and evidence*, and approves or rejects. Approvals are recorded with who and when." },
          { title: "Trust boundaries are enforced by separation", text: "Agents that read untrusted external content run with no credentials and no egress, returning typed summaries to a privileged agent — the lethal-trifecta split from Module 11." },
          { title: "Every run is bounded", text: "Steps, tokens, wall-clock, and a per-run cost cap. Exceeding any of them terminates with a labelled partial result." },
          { title: "Everything is idempotent", text: "Write tools take idempotency keys, because retries are guaranteed in a loop." },
        ]},
        { type: "callout", kind: "warn", text: "**The failure that ends projects: an agent with a service account.** It works beautifully in the pilot, and then someone discovers that any user can ask it to do anything the service account can do. Retrofitting per-user identity into a platform that assumed a shared credential is close to a rewrite — decide it on day one." },
        { type: "h2", text: "4. Reliability" },
        { type: "compare", caption: "What goes wrong, and what the platform does.", columns: ["Failure", "Platform behaviour"], rows: [
          { label: "Agent loops without progress", cells: ["Duplicate-call detection breaks out; the run ends with a labelled partial result"] },
          { label: "A tool times out", cells: ["Return an actionable error to the model; retry once; then fail the step, not the process"] },
          { label: "The run crashes mid-way", cells: ["Resume from the last checkpoint — long runs must survive a deploy"] },
          { label: "An approval is never answered", cells: ["Timeout with a defined default (reject), and notify the requester"] },
          { label: "Cost cap hit", cells: ["Terminate, report spend, and surface it to the agent's owner"] },
          { label: "A bad agent is deployed", cells: ["Kill switch per agent; canary new versions on a traffic percentage"] },
        ]},
        { type: "h2", text: "5. Evaluating agents" },
        { type: "list", items: [
          "**Trajectory evaluation** — not just the final answer: were the right tools called, in a sensible order, without redundancy, within budget?",
          "**A task suite per agent** with expected outcomes and expected tool sequences, run in CI against sandboxed systems.",
          "**Safety evals** — injection attempts embedded in tool results, permission-escalation attempts, and prompt-leak probes, all as regression cases.",
          "**Cost and step distributions**, not averages — the p95 run is what will surprise you at month end.",
          "**Approval rates by tool** — a tool approved 100% of the time probably doesn't need approval; one rejected often has a design problem.",
        ]},
        { type: "callout", kind: "tip", text: "That last point is genuinely useful in production and it's a great thing to say in an interview: **approval data is design feedback.** Consistently-approved actions can be automated with monitoring; consistently-rejected ones mean the agent is proposing the wrong thing and the prompt or tool needs fixing." },
        { type: "h2", text: "6. Trade-offs" },
        { type: "list", items: [
          "**Start with workflows, offer agents.** Most internal use cases have known steps; the platform should make the deterministic path easy so agents are used where they're actually needed.",
          "**Constrain by default.** New agents start read-only with approval on everything; permissions are earned by demonstrated reliability on the task suite.",
          "**Centralised tools, decentralised agents.** One team owns each MCP server and its authorisation; product teams compose agents from the catalogue.",
          "**At 10×**: per-team quotas, a tool-usage marketplace with owner review, and automated policy checks on agent definitions in CI.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Identity broker / token exchange** = a service issuing short-lived scoped credentials for the invoking user. **Risk tier** = a tool's classification as read, write, or irreversible. **Checkpointing** = persisting run state so it can resume. **Idempotency key** = a token making a repeated write safe. **Trajectory eval** = scoring the path an agent took, not just the outcome. **Kill switch** = a per-agent disable flag requiring no deploy. **Blast radius** = the worst outcome a single agent action allows." },
      ],
      takeaways: [
        "Frame an agent platform as a permissions and reliability problem: actions execute with someone's authority, so make it explicit, minimal, and auditable.",
        "Core components: agent registry, MCP tool catalogue, bounded runtime, identity broker, approval service, sandbox, trace store, budget service.",
        "Tools declare risk tiers that set default approval policy; identity flows per call; agents never hold standing service credentials.",
        "Separate trust boundaries so the agent reading untrusted content holds no credentials and has no egress.",
        "Evaluate trajectories and safety, watch p95 cost and step distributions, and treat approval data as design feedback.",
      ],
      flashcards: [
        { front: "What's the central design constraint of an agent platform?", back: "Every action executes with somebody's authority. The platform's job is to make that authority explicit, minimal, and auditable — everything else follows from it." },
        { front: "Why must agents not hold service accounts?", back: "Any user could then do anything the service account can. Use an identity broker issuing short-lived credentials scoped to the invoking user, per call — and decide this on day one, because retrofitting it is a rewrite." },
        { front: "What are tool risk tiers for?", back: "Classifying tools as read / write / irreversible so the platform sets a default approval policy centrally, rather than relying on each agent author's judgment." },
        { front: "What does trajectory evaluation measure?", back: "The path: which tools were called, in what order, with what redundancy, within what budget — not just whether the final answer was right." },
        { front: "Why is approval data design feedback?", back: "A tool approved every time probably doesn't need approval; a tool rejected often means the agent proposes the wrong action, and the prompt or tool design needs fixing." },
      ],
      quiz: [
        { q: "An agent uses a service account with broad access. What's the core problem?", options: ["Cost", "Any user can effectively do anything that account can — authority isn't scoped to the requester", "Latency", "Rate limits"], answer: 1, explain: "Authorisation must reflect the invoking user, issued per call as short-lived scoped credentials. Retrofitting this into a platform built on a shared credential is close to a rewrite." },
        { q: "Which agent should hold your CRM credentials?", options: ["The one browsing untrusted web pages", "A separate privileged agent receiving typed summaries from the browsing agent", "Both, for convenience", "Neither — use a service account"], answer: 1, explain: "Splitting trust boundaries breaks the lethal trifecta: the agent exposed to untrusted content holds nothing worth stealing and cannot send data out." },
        { q: "A long agent run crashes 12 minutes in. What should the platform do?", options: ["Restart from the beginning", "Resume from the last checkpoint", "Return an error", "Retry the whole task with a bigger model"], answer: 1, explain: "Checkpointed state after each step makes runs survive crashes, deploys, and rate limits — and lets a human inspect and resume a stuck run." },
      ],
    },
    {
      slug: "capacity-and-cost-math",
      title: "The arithmetic you'll be asked to do live",
      summary:
        "Token counting, cost per request, GPU capacity, throughput and concurrency — the five calculations that come up on the whiteboard.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Interviewers ask for numbers to see whether you've operated a system or only designed one. None of it is hard arithmetic — the skill is knowing which quantities matter, stating your assumptions, and working in orders of magnitude without pretending to precision you don't have." },
        { type: "diagram", name: "cost-model", caption: "Five calculations. Memorise the shapes, not the prices." },
        { type: "h2", text: "1. Tokens per request" },
        { type: "code", lang: "python", caption: "Count everything that occupies the window", code: `system_prompt        =   800
tool_definitions     =   400      # 4 tools x ~100
conversation_history = 1_200      # after compaction
retrieved_context    = 3_000      # 6 passages x ~500
user_question        =    50
input_total          = 5_450

output               =   350
thinking             =     0      # non-zero changes everything — it bills as output`},
        { type: "h2", text: "2. Cost per request, and per month" },
        { type: "p", text: "State prices as assumptions — they change, and interviewers care that you know the *structure*: output typically costs 3–5× input, and cached input is heavily discounted." },
        { type: "code", lang: "python", caption: "The calculation, with the cache split made explicit", code: `PRICE_IN, PRICE_OUT, PRICE_CACHED = 3.0/1e6, 15.0/1e6, 0.3/1e6

cached_in = 1_200            # system + tools — identical every call
fresh_in  = 5_450 - 1_200

cost = cached_in*PRICE_CACHED + fresh_in*PRICE_IN + 350*PRICE_OUT
#    = 0.00036 + 0.01275 + 0.00525  ≈  $0.0184 per request

monthly = cost * 20_000 * 30        # ≈ $11,000/month at 20k requests/day

# Say the levers out loud, ranked:
#   route 60% of traffic to the small tier   → ~35-45% saving
#   rerank to 4 passages instead of 6         → ~12% saving
#   cap output at 250 tokens                  → ~8% saving`},
        { type: "h2", text: "3. Latency" },
        { type: "code", lang: "python", caption: "Where the seconds go", code: `retrieval_ms  =  80          # hybrid + rerank, warm
guardrail_ms  =  30
ttft_ms       = 400          # prefill on ~5.5k tokens, prefix cached
tpot_ms       =  25

time_to_first_token = 80 + 30 + 400          # 510 ms — what users judge
total               = 510 + 350 * 25         # ≈ 9.3 s to completion

# The lever ranking, again out loud:
#   fewer output tokens        → linear on the dominant term
#   cache the prefix           → cuts TTFT directly
#   parallelise retrieval+guardrails → saves ~30 ms, mention it and move on`},
        { type: "h2", text: "4. Retrieval sizing" },
        { type: "code", lang: "python", caption: "Vectors, storage, and whether you need a dedicated store", code: `docs, chunks_per_doc = 400_000, 4
vectors  = 1_600_000
dims     = 1024
storage  = vectors * dims * 4 / 1e9          # ≈ 6.6 GB — trivial

# The judgement, not the number:
#   < ~10M vectors      → pgvector is comfortable
#   10M - 100M          → tune hard, or move to a dedicated store
#   > 100M              → dedicated store, sharded, quantized`},
        { type: "h2", text: "5. GPU capacity, if self-hosting" },
        { type: "code", lang: "python", caption: "The concurrency question is a KV-cache question", code: `# weights
params_b, bytes_per_param = 8, 2             # 8B model at bf16
weights_gb = 8 * 2                           # 16 GB

# KV cache per sequence  (2 x layers x kv_heads x head_dim x bytes)
per_token_kb = 2 * 32 * 8 * 128 * 2 / 1024   # = 128 KB/token
per_seq_gb   = per_token_kb * 8_000 / 1e6    # ≈ 1.05 GB at 8k context

gpu_gb  = 80
usable  = (gpu_gb - weights_gb) * 0.9        # headroom for activations
concurrent = int(usable / per_seq_gb)        # ≈ 54 sequences

# throughput sanity check
# 54 concurrent x ~40 tok/s each ≈ 2,160 tok/s
# at 350 output tokens per answer → ~6 answers/second → ~530k answers/day`},
        { type: "callout", kind: "key", text: "**Always end a calculation with a judgement.** Not \"that's $11,000 a month\" but \"**$11,000 a month, which is fine at this revenue; the biggest lever is routing the 60% of simple lookups to the small tier, worth roughly 40%, and I'd do that after the eval set proves quality holds per class.**\" The number is the setup; the decision is the answer." },
        { type: "callout", kind: "warn", text: "Don't fake precision. Say \"call it three dollars per million input tokens — the ratio that matters is output costing three to five times input.\" Confidently quoting an exact price that's six months stale reads worse than an honest order-of-magnitude estimate with stated assumptions." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Back-of-envelope** = order-of-magnitude arithmetic done live with stated assumptions. **Cost per successful outcome** = spend divided by requests that actually worked. **Concurrency** = simultaneous in-flight requests. **Throughput** = tokens or requests per second in aggregate. **Headroom** = spare capacity reserved for spikes and overhead. **Order of magnitude** = the right power of ten, which is what these estimates are for." },
      ],
      takeaways: [
        "Count every context component — system, tools, history, retrieval, question — not just the user's message.",
        "Cost structure: output is 3–5× input and cached input is heavily discounted; state prices as assumptions.",
        "Latency = TTFT (retrieval + guardrails + prefill) + output tokens × TPOT, with output length dominating.",
        "Retrieval sizing is a judgement: pgvector below ~10M vectors, dedicated stores above.",
        "GPU concurrency is a KV-cache calculation; always finish with a decision, not just a number.",
      ],
      flashcards: [
        { front: "What's the typical cost ratio between output and input tokens?", back: "Output costs roughly 3–5× input, and cached input is discounted heavily. That structure matters more than any specific price, which will be stale by the time you quote it." },
        { front: "How do you compute total latency?", back: "TTFT (retrieval + guardrails + prefill) plus output tokens × time-per-output-token. The second term almost always dominates." },
        { front: "How many vectors before leaving pgvector?", back: "Roughly 10M is comfortable; 10–100M needs hard tuning or a dedicated store; beyond 100M means a sharded, quantized dedicated store." },
        { front: "How do you estimate concurrent users on a GPU?", back: "(GPU memory − weights) × 0.9 ÷ KV cache per sequence, where KV per token is 2 × layers × kv_heads × head_dim × bytes." },
        { front: "How should you finish a back-of-envelope calculation?", back: "With a judgement — what the number means, which lever you'd pull, how much it's worth, and what evidence you'd want before pulling it." },
      ],
      quiz: [
        { q: "Input 5,000 tokens, output 400, at $3/M in and $15/M out. Cost per request?", options: ["~$0.005", "~$0.021", "~$0.15", "~$0.002"], answer: 1, explain: "5,000 × $3/M = $0.015, plus 400 × $15/M = $0.006, giving about $0.021. Note that output is 8% of the tokens and 29% of the cost." },
        { q: "A model needs 16GB of weights on an 80GB GPU, with ~1GB of KV cache per 8k-token sequence. Roughly how many concurrent users?", options: ["~10", "~55", "~200", "~500"], answer: 1, explain: "(80 − 16) × 0.9 ≈ 58GB usable, divided by ~1GB per sequence gives roughly 55 concurrent sequences. Concurrency is a KV-cache question." },
        { q: "You compute $11k/month and the interviewer says nothing. What should you add?", options: ["Recompute more precisely", "The judgement: is it acceptable, what's the biggest lever, what's it worth, and what evidence you'd need", "Move to the next component", "Suggest self-hosting"], answer: 1, explain: "The number is the setup. Interviewers are assessing whether you can turn arithmetic into a prioritised decision with a stated confidence." },
      ],
    },
  ],
};
