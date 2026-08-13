import type { Module } from "./types";

export const production: Module = {
  id: "production",
  title: "LLMOps in production",
  blurb:
    "The architecture around the model: a gateway with routing and fallbacks, caching that actually pays, tracing you can debug an incident with, and shipping prompt changes safely.",
  accent: "teal",
  lessons: [
    {
      slug: "production-architecture",
      title: "The production reference architecture",
      summary:
        "The gateway, routing, fallbacks, rate limits and streaming that sit between your application and any model provider.",
      minutes: 11,
      blocks: [
        { type: "p", text: "A demo calls the provider SDK directly from application code. A production system puts a layer in between — an **AI gateway** — because everything you need at scale (routing, fallbacks, caching, rate limiting, cost attribution, audit) belongs in one place rather than scattered across every service that calls a model." },
        { type: "diagram", name: "production-architecture", caption: "One choke point where policy, cost, and reliability are enforced." },
        { type: "h2", text: "What the gateway does" },
        { type: "compare", caption: "Six jobs, one layer.", columns: ["Concern", "Why it belongs at the gateway"], rows: [
          { label: "Provider abstraction", cells: ["Swap models or vendors with a config change, not a deploy across ten services"] },
          { label: "Routing", cells: ["Per-request model selection by task, tier, tenant, or cost policy"] },
          { label: "Fallbacks & retries", cells: ["Provider outages and rate limits handled once, consistently, with backoff"] },
          { label: "Caching", cells: ["Exact and semantic caches shared across all callers"] },
          { label: "Quotas & rate limits", cells: ["Per-tenant and per-user budgets enforced before spend happens"] },
          { label: "Observability & audit", cells: ["Every call traced with tokens, cost, latency, and outcome in one schema"] },
        ]},
        { type: "callout", kind: "tip", text: "You don't have to build one. Managed and open-source AI gateways exist and most teams should adopt rather than write. What matters is that **something owns these concerns centrally** — the failure mode is three services each with their own retry logic and no shared cost view." },
        { type: "h2", text: "Routing" },
        { type: "code", lang: "python", caption: "A routing policy you can actually reason about", code: `ROUTES = {
    # request class          model tier      thinking   max_tokens
    "classify":             ("small",        "off",     64),
    "extract":              ("small",        "off",     1024),
    "faq":                  ("mid",          "off",     512),
    "support_chat":         ("mid",          "off",     800),
    "code_review":          ("frontier",     "low",     4096),
    "incident_analysis":    ("frontier",     "high",    8192),
}

def route(request) -> Plan:
    tier, thinking, cap = ROUTES[classify_request(request)]

    # escalate: cheap tier already failed validation on this request
    if request.attempt > 0:
        tier = escalate(tier)

    # degrade: tenant is over budget for the period
    if over_budget(request.tenant):
        tier, thinking = downgrade(tier), "off"

    return Plan(model=MODELS[tier], thinking=thinking, max_tokens=cap)

# Log the routing decision on every request. A silent misroute is
# indistinguishable from a quality regression and will waste days.`},
        { type: "h2", text: "Failure handling" },
        { type: "p", text: "Model providers have outages, rate limits, and occasional slow tails. Your system's reliability is a design decision, not the provider's SLA." },
        { type: "list", items: [
          "**Retry with exponential backoff and jitter** on 429 and 5xx — and only on those. Retrying a 400 just burns money.",
          "**Cross-provider fallback** for genuine outages. This requires prompts that aren't over-fitted to one vendor's quirks, and evals proving the fallback is acceptable.",
          "**Degrade, don't fail.** Cheaper model → cached answer → non-AI path → honest error message, in that order.",
          "**Circuit breakers.** When a provider is failing, stop sending traffic for a period instead of timing out every request.",
          "**Hedged requests, carefully.** Firing a second request when the first exceeds p95 cuts tail latency and costs extra tokens — use it on latency-critical paths only.",
          "**Idempotency keys** on anything with a side effect, because retries are guaranteed.",
        ]},
        { type: "callout", kind: "warn", text: "**A fallback you've never tested is not a fallback.** Run the alternative provider through your eval suite, and exercise the path deliberately — a scheduled game day or a percentage of traffic. Teams discover their untested fallback produces malformed output during the outage it was supposed to cover." },
        { type: "h2", text: "Rate limits and quotas" },
        { type: "compare", caption: "Two directions, both required.", columns: ["Direction", "Concern"], rows: [
          { label: "Inbound (your users)", cells: ["Per-tenant and per-user request and token quotas, so one customer can't consume the budget"] },
          { label: "Outbound (to providers)", cells: ["Staying under provider TPM/RPM limits — queue and shape traffic rather than getting 429s"] },
        ]},
        { type: "p", text: "Rate-limit in **tokens**, not just requests. One request with a 100K-token context costs as much as two hundred short ones, and a request-count limit doesn't notice." },
        { type: "h2", text: "Streaming in practice" },
        { type: "list", items: [
          "**Server-Sent Events (SSE)** is the standard transport; WebSockets only when you need genuinely bidirectional traffic like realtime voice.",
          "**Buffer for guardrails.** If you must scan output for policy violations, stream in small chunks with a short delay rather than streaming raw tokens straight through.",
          "**Handle mid-stream failures.** A provider error after 200 tokens needs a defined behaviour — retry from scratch, or keep the partial and mark it.",
          "**Propagate cancellation.** When a user navigates away, cancel the upstream request; otherwise you pay for tokens nobody will read.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**AI gateway / LLM proxy** = a service centralising routing, caching, limits, and observability for model calls. **Fallback** = an alternative model or provider used when the primary fails. **Circuit breaker** = temporarily stopping traffic to a failing dependency. **Hedged request** = a duplicate request issued to cut tail latency. **TPM / RPM** = tokens and requests per minute limits. **SSE** = Server-Sent Events, the usual streaming transport. **Graceful degradation** = reducing capability instead of failing outright." },
      ],
      takeaways: [
        "An AI gateway centralises provider abstraction, routing, fallbacks, caching, quotas, and observability.",
        "Route per request class by tier, thinking budget, and token cap — and log every routing decision.",
        "Handle failure by retrying only 429/5xx, degrading through cheaper→cached→non-AI paths, and using circuit breakers.",
        "Test fallbacks against your eval suite and exercise them deliberately, or they won't work when needed.",
        "Rate-limit in tokens as well as requests, in both directions, and handle streaming cancellation and mid-stream failure.",
      ],
      flashcards: [
        { front: "Why put a gateway between your app and model providers?", back: "It centralises routing, fallbacks, retries, caching, quotas, cost attribution, and tracing. Without it, each service reimplements them inconsistently and nobody has a shared cost view." },
        { front: "What's the correct degradation order when a model call fails?", back: "Cheaper model → cached answer → non-AI path → honest error. Degrade capability rather than returning nothing." },
        { front: "Why rate-limit in tokens rather than requests?", back: "A single 100K-token request costs as much as hundreds of short ones. A request-count limit lets one heavy caller consume the budget invisibly." },
        { front: "Why is an untested fallback not a fallback?", back: "Prompts tuned to one provider often produce malformed output on another. Run the fallback through your eval suite and exercise it deliberately before you need it." },
        { front: "What is a hedged request?", back: "Issuing a duplicate request when the first exceeds a latency threshold, taking whichever returns first. It cuts tail latency at the cost of extra tokens — for latency-critical paths only." },
      ],
      quiz: [
        { q: "Your provider has a 20-minute outage and every feature goes down. What was missing?", options: ["A bigger context window", "Cross-provider fallback and graceful degradation", "More retries", "A faster model"], answer: 1, explain: "Retries don't help when the provider is down. You need a tested alternative provider, a cached-answer path, and a defined degraded experience." },
        { q: "One customer's bulk job consumes your monthly model budget in a day. What was missing?", options: ["Request-count rate limits", "Per-tenant token quotas enforced at the gateway", "A bigger model", "Semantic caching"], answer: 1, explain: "Token-based per-tenant quotas are the control. Request counts don't capture that one long-context call can cost as much as hundreds of short ones." },
        { q: "Where should retry, routing, and cost attribution live?", options: ["In each calling service", "In a gateway layer all model traffic passes through", "In the provider SDK", "In the frontend"], answer: 1, explain: "Centralising them gives consistent behaviour, one place to change policy, and a single cost and audit view across every caller." },
      ],
    },
    {
      slug: "latency-and-cost-engineering",
      title: "Latency & cost engineering",
      summary:
        "Caching that actually pays, batching, the routing arithmetic, and the order to apply optimisations so you don't trade quality for a rounding error.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Model spend is unusual: it scales with usage rather than infrastructure, so a successful product's bill grows exactly as fast as its adoption. The good news is that most systems have 60–80% of waste available to reclaim, in a fairly predictable order." },
        { type: "diagram", name: "caching-layers", caption: "Four caches, four hit conditions, four very different economics." },
        { type: "h2", text: "The caching layers" },
        { type: "compare", caption: "From cheapest to most nuanced.", columns: ["Cache", "Hits when", "Saves", "Watch for"], rows: [
          { label: "Exact response cache", cells: ["Identical prompt seen before", "Everything — no model call at all", "Personalised or time-sensitive answers going stale"] },
          { label: "Prompt / prefix cache", cells: ["The stable prefix matches", "Most of the input cost and much of TTFT", "Any varying token before the prefix kills it"] },
          { label: "Semantic cache", cells: ["A previous question was similar enough", "The whole call, on near-duplicates", "False hits — the threshold is a quality decision"] },
          { label: "Retrieval cache", cells: ["The same query embeddings/results", "Embedding calls and vector search", "Staleness after reindexing"] },
        ]},
        { type: "callout", kind: "key", text: "**Prompt caching is the highest-value, lowest-risk optimisation available.** It changes nothing about output quality, typically cuts input cost substantially on repeated prefixes, and improves TTFT at the same time. If your system prompt and tool definitions repeat across calls and you're not caching them, that's the first thing to fix." },
        { type: "callout", kind: "warn", text: "**Semantic caching is the risky one.** \"How do I cancel?\" and \"How do I cancel *without a fee*?\" are close in embedding space and have different answers. If you use it: set the threshold conservatively, never cache personalised or permission-scoped answers, scope the cache by tenant, and measure false-hit rate as a quality metric — not just hit rate as a cost metric." },
        { type: "h2", text: "The optimisation order" },
        { type: "steps", items: [
          { title: "Measure first — cost per request, by feature", text: "Attribution before optimisation. Teams routinely optimise the endpoint they think is expensive rather than the one that is." },
          { title: "Cut output tokens", text: "Cap max_tokens, ask for bullets not prose, remove padding phrases. Output costs 3–5× input and dominates latency." },
          { title: "Cache the prefix", text: "Reorder the prompt stable-first if needed. Free quality-wise, immediate effect." },
          { title: "Cut input tokens", text: "Rerank to 5 passages instead of 20, compact history, trim the system prompt, attach tools conditionally. Often improves quality too." },
          { title: "Route to cheaper models", text: "Prove per-class quality on your eval set, then send the easy majority to the cheap tier with escalation on failure." },
          { title: "Batch what isn't interactive", text: "Provider batch APIs typically cost around half of synchronous for work tolerating hours of latency — backfills, evals, enrichment." },
          { title: "Only then consider self-hosting", text: "It's the largest change with the largest operational cost, and it only pays at sustained high utilisation." },
        ]},
        { type: "code", lang: "python", caption: "Cost attribution — the report that starts every optimisation", code: `# Every model call writes one row. Without this, optimisation is guesswork.
@dataclass
class CallRecord:
    trace_id: str
    feature: str            # "support_chat" | "doc_extract" | "eval_judge"
    tenant: str
    model: str
    prompt_version: str
    input_tokens: int
    cached_input_tokens: int    # the number that proves caching works
    output_tokens: int
    thinking_tokens: int
    latency_ms: int
    ttft_ms: int
    outcome: str            # "ok" | "declined" | "invalid" | "error"
    cost_usd: float

# Weekly: cost by feature, cost per SUCCESSFUL outcome, cache hit rate,
# and p95 latency. Cost per success is the number that matters — a cheap
# call that fails and gets retried twice is not cheap.`},
        { type: "h2", text: "Latency, in the order that works" },
        { type: "list", ordered: true, items: [
          "**Stream.** Perceived latency is what users judge, and streaming is usually a one-line change.",
          "**Shorten the output.** The largest real reduction available, and it often improves the answer too.",
          "**Cache the prefix.** Directly cuts TTFT, which is what users feel first.",
          "**Parallelise independent work.** Retrieval, guardrail checks, and independent tool calls should not be sequential.",
          "**Trim retrieved context.** Less prefill, and usually better answers.",
          "**Use a smaller model for latency-critical paths.** Prove it on your evals per class.",
          "**Prefetch or precompute** predictable work — embed the query while the user is still typing, warm the cache for known peaks.",
        ]},
        { type: "callout", kind: "tip", text: "Track **cost per successful outcome**, not cost per call. A cheap model that fails validation a third of the time and triggers a retry on the expensive model costs more than routing to the expensive model directly — and a per-call metric shows the opposite." },
        { type: "h2", text: "Budgets and controls" },
        { type: "list", items: [
          "**Per-tenant and per-feature budgets** with alerts at 50/80/100% of forecast.",
          "**Hard caps with graceful degradation** — over budget should downgrade the tier, not return 500s.",
          "**Anomaly alerts** on cost per request, not just total spend; a 10× jump on one endpoint is a bug, and total spend hides it.",
          "**Cost in code review.** \"What does this cost per request at expected volume?\" belongs in the PR template for any change touching a model call.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Prompt / prefix caching** = provider-side reuse of a processed prompt prefix at a large discount. **Semantic cache** = returning a stored answer when a new query is similar enough. **False hit** = a semantic cache returning an answer to a subtly different question. **Batch API** = asynchronous bulk processing at reduced cost. **Cost per successful outcome** = spend divided by requests that actually worked. **Cost attribution** = tagging spend by feature, tenant, and model." },
      ],
      takeaways: [
        "Four caches — exact, prefix, semantic, retrieval — with prompt caching as the highest-value, lowest-risk one.",
        "Semantic caching risks false hits; set thresholds conservatively, scope by tenant, never cache personalised answers, and measure false-hit rate.",
        "Optimise in order: measure → cut output → cache prefix → cut input → route → batch → (maybe) self-host.",
        "For latency: stream, shorten output, cache prefix, parallelise, trim context, use smaller models, prefetch.",
        "Track cost per successful outcome, set per-tenant budgets that degrade rather than fail, and alert on per-request anomalies.",
      ],
      flashcards: [
        { front: "Why is prompt caching the first optimisation to reach for?", back: "It cuts input cost and TTFT substantially with zero effect on output quality. If your system prompt and tool definitions repeat, you're paying for them on every call unnecessarily." },
        { front: "What's the danger of semantic caching?", back: "False hits — 'how do I cancel?' and 'how do I cancel without a fee?' are close in embedding space with different answers. Conservative thresholds, tenant scoping, and a measured false-hit rate are mandatory." },
        { front: "Why track cost per successful outcome?", back: "A cheap call that fails validation and triggers an expensive retry costs more than the expensive call alone — but per-call cost metrics show it as cheaper." },
        { front: "When does a batch API make sense?", back: "For work that tolerates hours of latency — backfills, eval runs, bulk enrichment, offline classification. Typically around half the synchronous price." },
        { front: "What's the biggest single latency lever?", back: "Output length. Total latency is dominated by output tokens × time-per-token, so capping max_tokens and asking for bullets often beats any infrastructure change." },
      ],
      quiz: [
        { q: "Your RAG endpoint spends 70% of tokens on input. First move?", options: ["Switch to a smaller model", "Prompt-cache the stable prefix and rerank to fewer passages", "Reduce max_tokens", "Enable semantic caching"], answer: 1, explain: "Caching the repeated prefix is free quality-wise, and sending 5 well-reranked passages instead of 20 mediocre ones cuts input tokens while usually improving answers." },
        { q: "After enabling semantic caching, users report answers that don't match their question. What went wrong?", options: ["The cache is too small", "False hits — the similarity threshold is too loose", "TTL too short", "The embedding model is wrong"], answer: 1, explain: "Semantically near queries can have materially different answers. Tighten the threshold, scope by tenant, exclude personalised content, and monitor false-hit rate as a quality metric." },
        { q: "Which optimisation should come last?", options: ["Prompt caching", "Cutting output tokens", "Self-hosting open-weight models", "Model routing"], answer: 2, explain: "Self-hosting is the largest change with the biggest operational burden and only pays at sustained high utilisation. Exhaust the cheap, reversible optimisations first." },
      ],
    },
    {
      slug: "observability-and-tracing",
      title: "Observability & tracing",
      summary:
        "What to log so you can debug an incident at 3 a.m., how LLM tracing differs from ordinary APM, and the dashboards that actually get looked at.",
      minutes: 10,
      blocks: [
        { type: "p", text: "When an LLM feature misbehaves, the question is never \"which line threw?\" It's **\"what exactly did the model see, and what did it do with it?\"** Ordinary application monitoring can't answer that, which is why LLM observability is its own discipline." },
        { type: "diagram", name: "llm-observability", caption: "One trace, every stage, with the inputs and outputs that let you reconstruct the decision." },
        { type: "h2", text: "What a trace must contain" },
        { type: "compare", caption: "The fields you'll wish you had.", columns: ["Category", "Fields"], rows: [
          { label: "Identity", cells: ["trace ID, session ID, tenant, user (pseudonymous), feature"] },
          { label: "Configuration", cells: ["model ID, prompt version, temperature, max_tokens, routing decision, flag state"] },
          { label: "Inputs", cells: ["the actual assembled prompt (or a hash + the components), retrieved chunk IDs and scores"] },
          { label: "Outputs", cells: ["the response, stop reason, tool calls with arguments and results, citations"] },
          { label: "Cost & timing", cells: ["input/cached/output/thinking tokens, cost, latency split by stage, TTFT"] },
          { label: "Verdicts", cells: ["guardrail results, validation outcome, judge scores if sampled"] },
          { label: "Outcome", cells: ["success, decline, invalid, error, escalated, regenerated"] },
        ]},
        { type: "callout", kind: "key", text: "**Log the actual prompt that was sent.** Not the template — the rendered text, with the retrieved context in it. Without it you cannot reproduce a failure, and \"we can't reproduce it\" is where most LLM incident investigations die. If storing full prompts is a privacy problem, store a hash plus the component IDs so it can be reconstructed." },
        { type: "h2", text: "How LLM tracing differs from APM" },
        { type: "list", items: [
          "**Spans are nested and semantic** — an agent run contains model calls, tool calls, retrievals, and sub-agents. You need the tree, not a flat list of HTTP calls.",
          "**Inputs and outputs are the payload**, not metadata. A trace without the text is nearly useless.",
          "**Failures are silent.** A confidently wrong answer returns 200 OK. Your error rate can be zero while the feature is broken.",
          "**Quality is a metric.** Sampled judge scores belong on the same dashboard as latency and error rate.",
          "**Cost is per request and highly variable.** Unlike CPU-seconds, one request can cost a thousand times another.",
        ]},
        { type: "h2", text: "Standards and tooling" },
        { type: "p", text: "**OpenTelemetry** has GenAI semantic conventions for model calls — attributes for model, tokens, and operation — so LLM traces live alongside the rest of your telemetry rather than in a silo. Dedicated LLM observability platforms (LangSmith, Langfuse, Phoenix and others) add prompt versioning, dataset management, and judge runs on top." },
        { type: "callout", kind: "tip", text: "**Adopt a tracing tool early, and export in an open format.** Retrofitting observability after an incident is painful, and vendor-locked traces are a migration you'll resent. Emitting OpenTelemetry spans keeps the option open regardless of which platform you use for the LLM-specific views." },
        { type: "code", lang: "python", caption: "A span that makes an incident debuggable", code: `with tracer.start_as_current_span("llm.generate") as span:
    span.set_attributes({
        "gen_ai.system": "anthropic",
        "gen_ai.request.model": plan.model,
        "gen_ai.request.max_tokens": plan.max_tokens,
        "app.prompt_version": PROMPT_VERSION,        # attribute regressions
        "app.feature": "support_chat",
        "app.tenant": tenant_id,
        "app.route_reason": plan.reason,             # why THIS model
        "app.retrieved_ids": ",".join(c.id for c in chunks),
        "app.retrieved_top_score": chunks[0].score if chunks else 0.0,
    })
    resp = call_model(plan, prompt)
    span.set_attributes({
        "gen_ai.usage.input_tokens": resp.usage.input,
        "gen_ai.usage.cached_input_tokens": resp.usage.cached,
        "gen_ai.usage.output_tokens": resp.usage.output,
        "gen_ai.response.finish_reason": resp.stop_reason,
        "app.cost_usd": resp.cost,
        "app.outcome": outcome,          # ok | declined | invalid | error
    })
    span.add_event("prompt", {"body": prompt})       # or a hash, if sensitive`},
        { type: "h2", text: "Dashboards worth having" },
        { type: "compare", caption: "Four views that answer real questions.", columns: ["Dashboard", "Answers"], rows: [
          { label: "Health", cells: ["Error rate, p50/p95 latency and TTFT, throughput, guardrail block rate"] },
          { label: "Cost", cells: ["Spend by feature/tenant/model, cost per successful outcome, cache hit rate, trend vs budget"] },
          { label: "Quality", cells: ["Sampled judge scores by slice, regeneration and escalation rates, decline rate, thumbs-down"] },
          { label: "Retrieval", cells: ["Score distributions, zero-result rate, top-score-below-floor rate, index freshness"] },
        ]},
        { type: "callout", kind: "warn", text: "**Alert on the leading indicators, not just errors.** A collapse in retrieval score distribution, a spike in decline rate, a jump in output length, or a sudden change in cache hit rate all precede user complaints. Alerting only on 5xx means the first person to notice quality has broken is a customer." },
        { type: "h2", text: "Privacy in traces" },
        { type: "list", items: [
          "**Redact PII before storage**, or store prompts encrypted with tight access control and short retention.",
          "**Separate retention** — keep metrics for a year, full prompts for days or weeks.",
          "**Access control the trace UI.** Prompt bodies contain user data; treat the tracing tool as a system of record with real permissions.",
          "**Honour deletion requests** — traces are personal data, and a deletion request covers them too.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Trace / span** = the record of one request and each nested operation within it. **OpenTelemetry GenAI conventions** = standard attribute names for model calls. **Prompt version** = the identifier tying an output to the exact prompt that produced it. **Leading indicator** = a metric that moves before user-visible failure. **Sampling** = tracing or judging a fraction of traffic to control cost. **Cardinality** = the number of distinct values a label can take, which drives observability cost." },
      ],
      takeaways: [
        "A useful trace records identity, configuration, the actual rendered prompt, retrieved IDs and scores, outputs, cost, timing, verdicts, and outcome.",
        "LLM tracing differs from APM: nested semantic spans, text as the payload, silent failures that return 200, and quality as a first-class metric.",
        "Use OpenTelemetry GenAI conventions so traces stay portable, with an LLM platform layered on for prompt versioning and judging.",
        "Keep four dashboards — health, cost, quality, retrieval — and alert on leading indicators, not only errors.",
        "Traces contain personal data: redact, restrict, shorten retention, and honour deletion.",
      ],
      flashcards: [
        { front: "What single field makes LLM incidents debuggable?", back: "The actual rendered prompt that was sent, including retrieved context. Without it you cannot reproduce the failure, and the investigation stalls there." },
        { front: "Why can't standard APM cover LLM features?", back: "Failures are silent — a confidently wrong answer returns 200 OK — and the payload (prompt and response text) is the thing you need, not the metadata. Error rate can be zero while the feature is broken." },
        { front: "Name three leading indicators of LLM quality degradation", back: "A drop in retrieval score distribution, a spike in decline or regeneration rate, and a sudden change in output length or cache hit rate. All move before complaints arrive." },
        { front: "Why emit OpenTelemetry GenAI spans?", back: "LLM traces sit alongside the rest of your telemetry and stay portable, so you can change LLM observability platforms without re-instrumenting." },
        { front: "What's the privacy problem with LLM traces?", back: "Prompt bodies contain user data. They need redaction or encryption, access control on the trace UI, shorter retention than metrics, and inclusion in deletion requests." },
      ],
      quiz: [
        { q: "A user reports a wrong answer from yesterday and you can't reproduce it. What was missing from the trace?", options: ["Latency data", "The rendered prompt with retrieved context, and the prompt version", "Token counts", "The user's IP"], answer: 1, explain: "Reproduction requires knowing exactly what the model saw — the assembled prompt, the retrieved chunks, and which prompt version was live. Everything else is secondary." },
        { q: "Your error rate is 0% but complaints are rising. What does that tell you?", options: ["The monitoring is broken", "Failures are semantic — wrong answers return 200 OK", "Latency is too high", "The cache is stale"], answer: 1, explain: "LLM failures are usually silent. You need quality signals — sampled judging, regeneration and escalation rates, decline rate — alongside conventional error monitoring." },
        { q: "Which alert would catch a broken reindex before users complain?", options: ["5xx error rate", "A drop in retrieval top-score distribution", "CPU utilisation", "Request count"], answer: 1, explain: "If the index is empty or mis-embedded, similarity scores collapse while everything still returns 200. Score distribution is a leading indicator; errors are a lagging one." },
      ],
    },
    {
      slug: "the-release-lifecycle",
      title: "Shipping changes safely",
      summary:
        "Prompts and models are deployable artefacts — versioning, staged rollout, rollback, and handling the model upgrade that changes behaviour under you.",
      minutes: 10,
      blocks: [
        { type: "p", text: "A prompt edit is a production change with no compiler, no type check, and no stack trace when it goes wrong. Treating prompts and model selections as **versioned, tested, staged deployable artefacts** is what makes an AI product maintainable past its first quarter." },
        { type: "diagram", name: "deploy-lifecycle", caption: "Every change to a prompt, a model, or retrieval config goes through the same gates." },
        { type: "h2", text: "What counts as a deployable artefact" },
        { type: "list", items: [
          "**The prompt template** — versioned in git, reviewed in PRs, referenced by ID in every trace.",
          "**The model selection and parameters** — pinned model IDs, temperature, max_tokens, thinking budget, per request class.",
          "**The tool definitions** — schemas and descriptions are part of the behavioural contract.",
          "**The retrieval configuration** — chunking, k, reranking, thresholds, and the index version itself.",
          "**The guardrail policies** — what's blocked and what's allowed.",
        ]},
        { type: "callout", kind: "key", text: "**Pin explicit model versions in production, never a floating alias.** An alias silently upgrading beneath you means your carefully-tuned prompts meet a model with different behaviour, at a time of the provider's choosing, with no deploy of yours to correlate against. Pin, then upgrade deliberately." },
        { type: "h2", text: "The pipeline" },
        { type: "steps", items: [
          { title: "PR with the change and its eval delta", text: "The diff shows the prompt change; CI attaches the score change per slice, plus cost and latency. Reviewers see the evidence, not just the wording." },
          { title: "Assertion and metric evals in CI", text: "Cheap, deterministic, on every commit. A failed assertion blocks the merge." },
          { title: "Full eval suite before release", text: "Judged metrics across all slices, with explicit pass bars." },
          { title: "Canary 1–5% behind a flag", text: "Watch guardrail metrics for an hour, then a day. Most bad changes surface fast." },
          { title: "Progressive rollout", text: "5% → 25% → 100%, holding at each step long enough for the outcome metric to move." },
          { title: "Keep the previous version one flag away", text: "Rollback should be a config change taking seconds, not a redeploy taking twenty minutes." },
        ]},
        { type: "code", lang: "yaml", caption: "Runtime configuration that makes rollback a flag flip", code: `support_chat:
  prompt_version: "v7"              # git-tracked template id
  previous_version: "v6"            # one flag away, always
  rollout:
    v7: 25                          # percent of traffic
    v6: 75
  model:
    primary: "claude-sonnet-4-5"    # pinned, never an alias
    fallback: "gpt-4.1"             # eval'd, and exercised weekly
  params: { max_tokens: 800, temperature: 0.2 }
  retrieval: { k: 20, rerank_to: 6, min_score: 0.35, index: "kb-2026-08-09" }
  guardrails: { input: ["pii", "injection"], output: ["pii", "policy"] }
  budget: { max_cost_per_request_usd: 0.05 }`},
        { type: "h2", text: "The model upgrade problem" },
        { type: "p", text: "Providers deprecate models on their schedule, not yours, and new versions change behaviour in ways benchmarks don't capture — different verbosity, different refusal boundaries, different formatting habits. A model upgrade is a **behavioural migration**, not a version bump." },
        { type: "steps", items: [
          { title: "Run the full eval suite on the new model", text: "Per slice. Expect some slices to improve and others to regress; the average will mislead you." },
          { title: "Diff the outputs, not just the scores", text: "Sample 50 responses side by side. Formatting and tone changes that don't move metrics still break downstream parsers and user expectations." },
          { title: "Re-tune the prompt for the new model", text: "Prompts are fitted to a model's quirks. Budget time for this; it is not optional." },
          { title: "Canary and compare guardrail metrics", text: "Cost and latency often change materially in both directions." },
          { title: "Keep the old model available until the deprecation date", text: "Then remove it deliberately, with the eval evidence recorded in the PR." },
        ]},
        { type: "callout", kind: "warn", text: "**Deprecation notices are your calendar, not a suggestion.** Providers retire models with months of notice, and teams that discover this at the deadline ship an untested upgrade under time pressure. Track deprecation dates as project milestones, and run the migration evals early." },
        { type: "h2", text: "Incident response for AI features" },
        { type: "compare", caption: "The runbook.", columns: ["Symptom", "First actions"], rows: [
          { label: "Quality collapse", cells: ["Roll back the prompt/model flag; check index freshness and retrieval scores; check for a provider model change"] },
          { label: "Cost spike", cells: ["Check cache hit rate, output length distribution, and routing decisions; look for a retry storm"] },
          { label: "Latency spike", cells: ["Check provider status, queue depth, context length distribution, and cache hit rate"] },
          { label: "Safety incident", cells: ["Kill switch the feature, preserve traces, then investigate — capability restored only after the fix is evaluated"] },
        ]},
        { type: "callout", kind: "tip", text: "**Build the kill switch on day one.** A config flag that disables the feature, downgrades to a smaller model, or falls back to a non-AI path — no deploy required. It is the cheapest incident-response capability you can have, and the one teams most regret not having." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Prompt version** = an identifier for a specific prompt template, recorded in every trace. **Pinned model** = an explicit immutable model ID rather than a floating alias. **Canary** = a small share of traffic receiving a change first. **Progressive rollout** = increasing that share in stages. **Kill switch** = a config flag disabling or degrading a feature without a deploy. **Behavioural migration** = a model upgrade that changes outputs even when scores hold. **Deprecation window** = the period before a provider retires a model." },
      ],
      takeaways: [
        "Prompts, model selections, tool schemas, retrieval config, and guardrail policies are all versioned deployable artefacts.",
        "Pin explicit model versions; floating aliases upgrade beneath you at the provider's convenience.",
        "Ship through PR-with-eval-delta → CI assertions → full suite → canary → progressive rollout, with rollback one flag away.",
        "Treat a model upgrade as a behavioural migration: per-slice evals, side-by-side output diffs, prompt re-tuning, and canary.",
        "Have a kill switch from day one and a runbook mapping symptoms to first actions.",
      ],
      flashcards: [
        { front: "Why pin model versions instead of using an alias?", back: "An alias upgrades silently at the provider's timing, so behaviour changes without any deploy of yours to correlate against — the hardest kind of regression to diagnose." },
        { front: "What should a prompt-change PR include?", back: "The diff plus the eval delta per slice, and cost and latency changes. Reviewers should be looking at evidence, not debating wording." },
        { front: "Why is a model upgrade a behavioural migration?", back: "New versions change verbosity, refusal boundaries, and formatting habits in ways aggregate scores miss — breaking downstream parsers and prompts tuned to the old model." },
        { front: "What's the cheapest incident-response capability for an AI feature?", back: "A kill switch: a config flag that disables the feature, downgrades the model, or falls back to a non-AI path with no deploy required." },
        { front: "A quality collapse alert fires. What are the first three checks?", back: "Roll back the prompt/model flag, check index freshness and retrieval score distribution, and check whether the provider changed the model under you." },
      ],
      quiz: [
        { q: "Answer quality drops overnight with no deploy. Most likely cause?", options: ["A memory leak", "A provider model change behind a floating alias, or a broken reindex", "Increased traffic", "Temperature drift"], answer: 1, explain: "The two classic no-deploy regressions are an alias silently upgrading and an index rebuild going wrong. Pin models and monitor retrieval score distribution to catch both." },
        { q: "How should rollback of a bad prompt work?", options: ["Revert the commit and redeploy", "Flip a config flag to the previous prompt version", "Restart the service", "Clear the cache"], answer: 1, explain: "Prompt versions selected at runtime make rollback a seconds-long config change. A redeploy is minutes you don't have during a quality incident." },
        { q: "Your provider announces deprecation of your production model in 90 days. When do you start?", options: ["At day 85", "Now — run migration evals and re-tune prompts early", "When it stops working", "Only if evals fail"], answer: 1, explain: "A model upgrade needs per-slice evals, output diffing, prompt re-tuning, and a canary. Starting late guarantees shipping an untested behavioural change under deadline pressure." },
      ],
    },
  ],
};
