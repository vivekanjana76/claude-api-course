import type { Module } from "./types";

export const observability: Module = {
  id: "observability",
  title: "Observability & SRE",
  blurb: "Operating what you ship: the three pillars of observability, metrics with Prometheus & Grafana, SLIs/SLOs & error budgets, and humane incident response.",
  accent: "amber",
  lessons: [
    {
      slug: "three-pillars-of-observability",
      title: "Monitoring vs observability & the three pillars",
      summary:
        "Metrics, logs, and traces — what each answers, how they differ, and why observability is about asking questions you didn't plan for.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Once code is in production, the loop closes with **observability** — understanding what your system is doing from the outside. It's the 'operate & monitor' stage that feeds problems back to the start of the pipeline." },
        { type: "h2", text: "Monitoring vs observability" },
        { type: "p", text: "**Monitoring** watches for known problems: predefined dashboards and alerts for failures you anticipated ('CPU > 90%'). **Observability** is the broader property of being able to ask *arbitrary* questions about your system's behavior — including ones you didn't think of in advance — from the data it emits. Monitoring tells you *that* something is wrong; observability helps you find out *why*." },
        { type: "callout", kind: "key", text: "Monitoring is for known-unknowns (failures you predicted). Observability is for unknown-unknowns (novel failures in complex, distributed systems). Microservices and Kubernetes make the unknown-unknowns common, which is why observability matters more than ever." },
        { type: "diagram", name: "observability-pillars", caption: "Metrics (what & how much), logs (what happened), traces (where in the request path) — together they explain behavior." },
        { type: "h2", text: "The three pillars" },
        { type: "compare", caption: "Each pillar answers a different question.", columns: ["Pillar", "What it is", "Answers"], rows: [
          { label: "Metrics", cells: ["Numeric time series (aggregated)", "'How many? How fast? How full?' — trends & alerting"] },
          { label: "Logs", cells: ["Timestamped, discrete event records", "'What exactly happened at 14:03?' — detail & debugging"] },
          { label: "Traces", cells: ["A request's path across services", "'Where did the 2s of latency go?' — distributed flow"] },
        ]},
        { type: "list", items: [
          "**Metrics** are cheap, aggregated, and great for dashboards and alerts — but low on detail (you can't see an individual request).",
          "**Logs** are rich and detailed but expensive at scale; use structured (JSON) logs so they're queryable, not just readable.",
          "**Traces** follow one request through many services via a shared trace ID — essential for debugging latency in microservices.",
        ]},
        { type: "callout", kind: "note", text: "**OpenTelemetry (OTel)** is the emerging vendor-neutral standard for generating and shipping all three signals, so you instrument once and send the data to any backend (Prometheus, Grafana, Jaeger, Datadog). Instrument with OTel to avoid lock-in." },
        { type: "callout", kind: "tip", text: "The pillars work together. A metric alert fires ('error rate up'); you pivot to traces to find the slow/failing service; you read that service's logs for the exact error. Design so you can jump between them by shared IDs (trace/request/correlation IDs)." },
      ],
      takeaways: [
        "Monitoring watches for known problems; observability lets you ask arbitrary questions to explain novel behavior — key in distributed systems.",
        "The three pillars: metrics (aggregated numbers), logs (discrete events), traces (a request's path across services).",
        "Metrics are cheap for alerts/dashboards; logs are detailed but costly (use structured JSON); traces reveal cross-service latency.",
        "Instrument with OpenTelemetry to emit all three signals vendor-neutrally, and correlate them via shared IDs.",
      ],
      flashcards: [
        { front: "Monitoring vs observability", back: "Monitoring watches for predefined, known problems (dashboards/alerts). Observability is the ability to ask arbitrary, unplanned questions about system behavior from its telemetry — for the unknown-unknowns." },
        { front: "What are the three pillars of observability?", back: "Metrics (aggregated numeric time series — how many/fast/full), logs (discrete timestamped events — what happened), and traces (a request's path across services — where latency went)." },
        { front: "What is OpenTelemetry?", back: "A vendor-neutral standard for generating and exporting metrics, logs, and traces, so you instrument once and can send the data to any backend — avoiding lock-in." },
      ],
      quiz: [
        { q: "Which pillar best answers 'where did the latency go across my microservices?'", options: ["Metrics", "Logs", "Traces", "Dashboards"], answer: 2, explain: "Distributed traces follow a single request across services via a shared trace ID, revealing where time is spent." },
        { q: "Observability is especially valuable for…", options: ["Known, predicted failures only", "Unknown-unknowns — novel failures you didn't anticipate", "Reducing CPU usage", "Writing code faster"], answer: 1, explain: "Observability lets you investigate unforeseen problems in complex systems, beyond the known issues monitoring is set up for." },
      ],
    },
    {
      slug: "metrics-prometheus-grafana",
      title: "Metrics with Prometheus & Grafana",
      summary:
        "The de-facto metrics stack: how Prometheus scrapes and stores time series, querying with PromQL, dashboards in Grafana, and the RED/USE methods.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**Prometheus** is the de-facto open-source metrics system, especially in the Kubernetes world, usually paired with **Grafana** for dashboards. Understanding its model is the practical core of monitoring." },
        { type: "h2", text: "How Prometheus works" },
        { type: "p", text: "Prometheus is **pull-based**: it periodically **scrapes** HTTP `/metrics` endpoints that your apps and infrastructure expose, and stores the results as **time series** — a metric name plus key/value **labels**, sampled over time. Service discovery (e.g. from Kubernetes) tells it what to scrape." },
        { type: "diagram", name: "prometheus-stack", caption: "Prometheus scrapes targets, stores time series, evaluates alert rules (→ Alertmanager), and feeds Grafana dashboards." },
        { type: "list", items: [
          "**Exporters** expose metrics for things that can't themselves (node_exporter for hosts, database exporters).",
          "**Labels** turn one metric into many dimensions: `http_requests_total{method=\"GET\", status=\"500\"}`.",
          "**Alertmanager** receives fired alerts from Prometheus and handles routing, grouping, silencing, and paging.",
          "**Grafana** queries Prometheus (and other sources) to render dashboards.",
        ]},
        { type: "h2", text: "The four metric types" },
        { type: "compare", caption: "Prometheus metric types.", columns: ["Type", "Meaning", "Example"], rows: [
          { label: "Counter", cells: ["Only goes up (reset on restart)", "total requests, errors"] },
          { label: "Gauge", cells: ["Goes up and down", "memory in use, queue depth"] },
          { label: "Histogram", cells: ["Buckets of observations", "request latency distribution"] },
          { label: "Summary", cells: ["Client-side quantiles", "pre-computed p95 latency"] },
        ]},
        { type: "h2", text: "PromQL" },
        { type: "p", text: "You query with **PromQL**. The most common pattern is `rate()` over a counter to get a per-second rate, then aggregate by labels:" },
        { type: "code", lang: "promql", caption: "Error rate as a percentage, over 5 minutes", code: "sum(rate(http_requests_total{status=~\"5..\"}[5m]))\n  /\nsum(rate(http_requests_total[5m])) * 100" },
        { type: "h2", text: "What to measure: RED & USE" },
        { type: "list", items: [
          "**RED** (for request-driven services): **R**ate (requests/sec), **E**rrors (failed/sec), **D**uration (latency distribution). Start here for every service.",
          "**USE** (for resources): **U**tilization, **S**aturation, **E**rrors — for CPUs, disks, queues.",
        ]},
        { type: "callout", kind: "key", text: "Don't dashboard everything — measure what matters. RED (rate, errors, duration) for your services and USE (utilization, saturation, errors) for your resources cover the vast majority of real incidents with a handful of well-chosen metrics." },
        { type: "callout", kind: "warn", text: "Watch metric cardinality: a label with unbounded values (user ID, request ID) multiplies into millions of time series and can overwhelm Prometheus. Keep labels low-cardinality — put high-cardinality detail in logs/traces, not metric labels." },
      ],
      takeaways: [
        "Prometheus is pull-based: it scrapes /metrics endpoints and stores labeled time series; Grafana visualizes them.",
        "Metric types: counter (up-only), gauge (up/down), histogram (bucketed), summary (client quantiles).",
        "Query with PromQL — commonly rate() over counters, aggregated by labels; Alertmanager handles firing alerts.",
        "Measure RED (rate, errors, duration) for services and USE (utilization, saturation, errors) for resources; avoid high-cardinality labels.",
      ],
      flashcards: [
        { front: "How does Prometheus collect metrics?", back: "It's pull-based: it periodically scrapes HTTP /metrics endpoints exposed by apps/exporters and stores the results as labeled time series. Service discovery tells it what to scrape." },
        { front: "What are the RED and USE methods?", back: "RED (for services): Rate, Errors, Duration. USE (for resources): Utilization, Saturation, Errors. They pick the few metrics that catch most incidents." },
        { front: "Why avoid high-cardinality metric labels?", back: "Labels with unbounded values (user/request IDs) explode into millions of time series and can overwhelm Prometheus. Keep labels low-cardinality; put detail in logs/traces." },
      ],
      quiz: [
        { q: "How does Prometheus get its data?", options: ["Apps push metrics to it", "It scrapes /metrics endpoints (pull-based)", "It reads log files", "From the Kubernetes API only"], answer: 1, explain: "Prometheus is pull-based — it periodically scrapes HTTP metrics endpoints exposed by targets." },
        { q: "For a request-driven web service, the RED method says to measure…", options: ["Reads, Edits, Deletes", "Rate, Errors, Duration", "RAM, EBS, Disk", "Requests, Endpoints, DNS"], answer: 1, explain: "RED = Rate (throughput), Errors (failure rate), Duration (latency) — the core signals for a request-driven service." },
      ],
    },
    {
      slug: "slis-slos-error-budgets",
      title: "SLIs, SLOs & error budgets",
      summary:
        "The SRE framework for reliability as a number: measure an indicator, set a target, and spend the resulting error budget to balance speed against stability.",
      minutes: 9,
      blocks: [
        { type: "p", text: "How reliable *should* a service be? '100%' is the wrong answer — it's impossibly expensive and unnecessary. **Site Reliability Engineering (SRE)** answers with a precise framework: SLIs, SLOs, and error budgets turn reliability into a number you can manage." },
        { type: "h2", text: "The three terms" },
        { type: "list", items: [
          "**SLI (Service Level Indicator)** — a *measured* signal of health, expressed as a ratio of good events to total. E.g. 'proportion of requests served in under 300ms' or 'proportion of requests without a 5xx error.'",
          "**SLO (Service Level Objective)** — a *target* for an SLI over a window. E.g. '99.9% of requests succeed over 30 days.' This is your internal reliability goal.",
          "**SLA (Service Level Agreement)** — a *contract* with customers including consequences (refunds) if an SLO is missed. SLAs are looser than your internal SLOs.",
        ]},
        { type: "callout", kind: "key", text: "The chain: an SLI is what you measure, an SLO is the target you set for it, and an SLA is the contractual promise (with penalties) built on top. Set SLOs stricter than SLAs so you notice trouble before customers are owed refunds." },
        { type: "h2", text: "The error budget" },
        { type: "p", text: "The powerful idea: **error budget = 100% − SLO**. A 99.9% SLO permits 0.1% unreliability — about **43 minutes per 30 days**. That budget is a resource you get to *spend*." },
        { type: "diagram", name: "slo-error-budget", caption: "The gap between 100% and the SLO is the error budget — spend it on releases and risk, refill it with reliability." },
        { type: "compare", caption: "The error budget as a policy that ends the Dev-vs-Ops fight.", columns: ["State", "What it means", "What the team does"], rows: [
          { label: "Budget remaining", cells: ["Reliability is above target", "Ship features, take risks, deploy fast"] },
          { label: "Budget exhausted", cells: ["Too many errors this window", "Freeze features; focus on reliability"] },
        ]},
        { type: "callout", kind: "key", text: "Error budgets align Dev and Ops with data instead of politics. While there's budget, developers ship freely; when it's spent, everyone prioritizes reliability until it recovers. Reliability becomes a shared, measurable decision — not an argument." },
        { type: "callout", kind: "tip", text: "Base SLOs on what users actually experience (latency, success rate at the edge), not internal proxies like CPU. And target the reliability users need — chasing extra nines nobody notices burns effort you could spend on features." },
        { type: "callout", kind: "note", text: "Alert on **burn rate** — how fast you're consuming the error budget — rather than on every blip. A fast burn pages immediately; a slow burn can wait for business hours. This drastically cuts alert noise (next lesson)." },
      ],
      takeaways: [
        "SLI = a measured ratio of good/total events; SLO = the target for it; SLA = the customer contract (with penalties) on top.",
        "Error budget = 100% − SLO — e.g. 99.9% allows ~43 min of unreliability per 30 days, a resource you spend.",
        "With budget remaining, ship fast and take risks; when it's exhausted, freeze features and focus on reliability.",
        "Base SLOs on user-facing experience, don't chase unnecessary nines, and alert on error-budget burn rate.",
      ],
      flashcards: [
        { front: "SLI vs SLO vs SLA", back: "SLI: a measured indicator (ratio of good to total events). SLO: the internal target for that SLI (e.g. 99.9%). SLA: the customer contract with penalties, set looser than the SLO." },
        { front: "What is an error budget?", back: "100% − SLO: the permitted amount of unreliability (a 99.9% SLO ≈ 43 min/30 days). It's a resource the team spends on releases and risk." },
        { front: "How does an error budget resolve the Dev-vs-Ops tension?", back: "While budget remains, developers ship features freely; when it's exhausted, the team freezes features and focuses on reliability. Reliability becomes a shared, data-driven decision." },
      ],
      quiz: [
        { q: "What is the error budget for a 99.9% SLO?", options: ["0% — no errors allowed", "0.1% unreliability (~43 min per 30 days)", "1% unreliability", "It depends on the SLA"], answer: 1, explain: "Error budget = 100% − SLO = 0.1%, which over 30 days is roughly 43 minutes of allowed unreliability." },
        { q: "When the error budget is exhausted, a good policy is to…", options: ["Deploy more features faster", "Freeze features and prioritize reliability work", "Ignore it", "Lower the SLI"], answer: 1, explain: "An exhausted budget signals too much recent unreliability, so the team shifts from features to reliability until it recovers." },
      ],
    },
    {
      slug: "alerting-and-incident-response",
      title: "Alerting, on-call & incident response",
      summary:
        "What makes an alert worth waking someone for, how to run an incident, and the blameless post-mortem culture that turns failures into improvements.",
      minutes: 9,
      blocks: [
        { type: "p", text: "The last mile of operations is responding when things break — and doing it humanely and effectively. Good alerting, a clear incident process, and blameless learning are what keep both systems and on-call engineers healthy." },
        { type: "h2", text: "What makes a good alert" },
        { type: "p", text: "The fastest way to burn out a team is a flood of noisy alerts. Every page should be **actionable, urgent, and real**:" },
        { type: "list", items: [
          "**Symptom-based, user-facing.** Alert on 'error rate breaching the SLO' (a symptom users feel), not 'CPU at 85%' (a cause that may be harmless).",
          "**Actionable.** If there's nothing the recipient can do, it shouldn't page — make it a ticket or a dashboard, not a 3am call.",
          "**Urgent.** Page only for things that need a human *now*; route everything else to non-paging channels.",
          "**Tied to error budget.** Alert on burn rate so the severity matches the actual risk to your SLO.",
        ]},
        { type: "callout", kind: "warn", text: "Alert fatigue is a real outage risk: when most pages are noise, people start ignoring all of them — including the real one. Ruthlessly delete or downgrade alerts that aren't actionable. Fewer, better alerts beat comprehensive noise." },
        { type: "h2", text: "Running an incident" },
        { type: "steps", items: [
          { title: "Detect & declare", text: "An alert (or a human) flags a problem; declare an incident so everyone knows it's being handled." },
          { title: "Assign roles", text: "An Incident Commander coordinates (not necessarily the person fixing it); others communicate and investigate." },
          { title: "Mitigate first", text: "Stop the bleeding before finding root cause — roll back, scale up, or fail over. Recovery beats diagnosis." },
          { title: "Communicate", text: "Keep stakeholders and status pages updated at a steady cadence." },
          { title: "Resolve & follow up", text: "Confirm recovery, then schedule the post-mortem." },
        ]},
        { type: "callout", kind: "key", text: "In an incident, mitigate before you diagnose. Your first job is to restore service for users — roll back the deploy, fail over, add capacity — not to understand the root cause. Fast rollback (from the CI/CD and GitOps modules) is your best mitigation tool." },
        { type: "h2", text: "Blameless post-mortems" },
        { type: "p", text: "After a significant incident, write a **blameless post-mortem**: a factual timeline, the impact, the contributing causes, and concrete action items — focused on *how the system and process let this happen*, never on who to blame." },
        { type: "list", items: [
          "**Blameless** — assume everyone acted reasonably with the information they had; fix systems, not people. This is the Third Way (continual learning) in action.",
          "**Actionable** — every post-mortem produces tracked improvements (better alerts, guardrails, automation).",
          "**Reduce toil** — recurring manual incident work is a signal to automate. SRE caps toil so engineers do engineering.",
        ]},
        { type: "callout", kind: "note", text: "This closes the DevOps loop: observability and incident response feed learnings straight back into planning and code — exactly the fast-feedback and continual-learning ideas from the foundations module. You've now walked the whole pipeline, from commit to production and back." },
      ],
      takeaways: [
        "Good alerts are symptom-based, actionable, urgent, and tied to error-budget burn rate — fight alert fatigue by deleting noise.",
        "Run incidents with clear roles (an Incident Commander), and mitigate (roll back/fail over) before diagnosing root cause.",
        "Write blameless post-mortems that fix systems and process — never assign blame — producing tracked action items.",
        "Reduce toil through automation, and feed incident learnings back into planning — closing the DevOps feedback loop.",
      ],
      flashcards: [
        { front: "What makes a good alert?", back: "It's symptom-based (user-facing, like SLO breach), actionable, genuinely urgent, and tied to error-budget burn rate. Anything non-actionable should be a ticket/dashboard, not a page." },
        { front: "What's the first priority during an incident?", back: "Mitigate before diagnosing — restore service for users (roll back, fail over, scale up) first; find root cause afterward. Fast rollback is the best mitigation tool." },
        { front: "What is a blameless post-mortem?", back: "A factual review after an incident that examines how the system and process allowed the failure — never who to blame — and produces concrete, tracked improvements. It's the Third Way (continual learning) in practice." },
      ],
      quiz: [
        { q: "What should you generally do FIRST during a production incident?", options: ["Write the post-mortem", "Find the root cause", "Mitigate to restore service (e.g. roll back)", "Blame the last committer"], answer: 2, explain: "Restoring service for users comes first; root-cause diagnosis happens after the bleeding is stopped. Fast rollback is a key mitigation." },
        { q: "Why are post-mortems blameless?", options: ["To avoid paperwork", "So people share information freely and the focus stays on fixing systems, not punishing people", "To speed up deploys", "Because incidents don't matter"], answer: 1, explain: "Blameless culture assumes good faith, encourages honest analysis, and drives systemic fixes — the continual-learning Third Way." },
      ],
    },
  ],
};
