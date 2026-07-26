import type { Module } from "./types";

export const serverless: Module = {
  id: "serverless",
  title: "Serverless",
  blurb:
    "Functions as a Service, event-driven architecture, and the honest trade-offs — when running no servers is a win, and when it isn't.",
  accent: "iris",
  lessons: [
    {
      slug: "faas-serverless-model",
      title: "Functions as a Service",
      summary:
        "The serverless mental model: upload a function, let the cloud run it on demand, and pay only for what executes.",
      minutes: 9,
      blocks: [
        { type: "p", text: "**Serverless** doesn't mean there are no servers — it means *you* never see or manage them. You hand the cloud a **function**, and it provisions capacity, runs your code when triggered, scales it, and bills you only for the milliseconds it actually runs. The flagship services are **AWS Lambda** and **Azure Functions**." },
        { type: "diagram", name: "serverless-event", caption: "An event triggers your function; it runs, does its work, and stops — you pay only for that execution." },
        { type: "h2", text: "The execution model" },
        { type: "list", items: [
          "**Event-triggered** — a function runs in response to an event: an HTTP request, a file landing in object storage, a message on a queue, a schedule. No event, no run, no cost.",
          "**Ephemeral & stateless** — each invocation is short-lived and keeps nothing between runs. Any state lives elsewhere (a database, cache, or object store).",
          "**Auto-scaling to zero** — with no traffic it scales to zero and costs nothing; under load the platform runs many copies in parallel automatically.",
          "**Pay-per-use** — you're billed per invocation and per GB-second of compute, not for idle servers.",
        ]},
        { type: "callout", kind: "key", text: "The serverless promise: no capacity planning, no patching, no idle cost, and scaling handled for you. You focus purely on the function's logic — the operational surface almost disappears." },
        { type: "h2", text: "Cold starts" },
        { type: "p", text: "When a function hasn't run recently, the platform must spin up a fresh environment for it — a **cold start** — adding latency (tens to hundreds of milliseconds, sometimes more) to that first request. Subsequent calls reuse the warm environment and are fast. Cold starts are the classic serverless gotcha for latency-sensitive, user-facing paths." },
        { type: "callout", kind: "warn", text: "Keep functions small, single-purpose, and quick to start. Heavy dependencies and large runtimes worsen cold starts; long-running or CPU-marathon jobs fit containers or VMs better than a function with an execution time limit." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Serverless** = you run code without provisioning or managing servers; the cloud does it. **FaaS** (Functions as a Service) = the serverless model where the unit you deploy is a single function (Lambda, Azure Functions). **Invocation** = one run of a function. **Trigger / event source** = whatever causes a function to run (HTTP call, file upload, queue message, timer). **Cold start** = the extra latency when a function starts from scratch after being idle. **Stateless** = keeps nothing between runs — state lives elsewhere. **GB-second** = the billing unit: memory allocated × time it ran." },
      ],
      takeaways: [
        "Serverless/FaaS (Lambda, Azure Functions): you deploy a function; the cloud runs, scales, and bills it per execution.",
        "Functions are event-triggered, ephemeral, stateless, scale to zero, and cost nothing when idle.",
        "Cold starts add latency to the first call after idleness — the classic gotcha for user-facing paths.",
        "Keep functions small and fast-starting; long or CPU-heavy jobs belong on containers or VMs.",
      ],
      flashcards: [
        { front: "What does 'serverless' actually mean?", back: "There are still servers, but you never provision or manage them — you deploy a function and the cloud runs it on demand, scaling and billing per execution." },
        { front: "What is a cold start?", back: "The extra latency when the platform spins up a fresh environment for a function that hasn't run recently; warm invocations that reuse the environment are fast." },
        { front: "How are serverless functions billed?", back: "Per invocation and per GB-second (memory × runtime) — you pay nothing when idle because they scale to zero." },
      ],
      quiz: [
        { q: "When does a serverless function cost you money?", options: ["Continuously, like a VM", "Only while it's actually executing in response to events", "Only at the end of the month", "Never — it's free"], answer: 1, explain: "Serverless bills per invocation and GB-second; with no events it scales to zero and costs nothing." },
        { q: "What is a cold start?", options: ["A function that crashed", "The added latency when a function starts fresh after being idle", "A billing error", "A security feature"], answer: 1, explain: "A cold start is the initialization latency incurred when the platform must create a new environment for an idle function." },
      ],
    },
    {
      slug: "event-driven-architecture",
      title: "Event-driven architecture",
      summary:
        "How queues and pub/sub let serverless components react to events, decouple, and fan out — the natural architecture for FaaS.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Functions shine when they're wired together by **events** rather than direct calls. **Event-driven architecture** has components emit events and other components react, so producers and consumers never call each other directly — they're **decoupled** through a messaging layer." },
        { type: "h2", text: "Queues" },
        { type: "p", text: "A **message queue** (**AWS SQS**, **Azure Queue Storage**) holds work until a consumer is ready. A producer drops a message and moves on; a function (or fleet of them) pulls messages and processes them at its own pace. Queues **absorb spikes** (a traffic burst fills the queue instead of overwhelming the backend) and add resilience (if a consumer fails, the message stays for a retry)." },
        { type: "h2", text: "Pub/sub" },
        { type: "p", text: "**Publish/subscribe** (**AWS SNS**, **Azure Event Grid**) broadcasts an event to *many* subscribers at once. One 'order placed' event can simultaneously trigger a receipt email, an inventory update, and an analytics record — this is **fan-out**. Each subscriber is independent, so you add new reactions without touching the producer." },
        { type: "compare", caption: "Queue vs pub/sub.", columns: ["", "Queue (SQS)", "Pub/Sub (SNS / Event Grid)"], rows: [
          { label: "Delivery", cells: ["One consumer processes each message", "Every subscriber gets the event"] },
          { label: "Pattern", cells: ["Work distribution / buffering", "Fan-out / broadcast"] },
          { label: "Good for", cells: ["Smoothing load, background jobs", "Notifying many systems of one event"] },
        ]},
        { type: "callout", kind: "key", text: "Decoupling is the point. Producers and consumers scale, fail, and deploy independently because they only share a message contract, not a direct call. This is what makes event-driven serverless systems resilient and easy to extend." },
        { type: "callout", kind: "warn", text: "Design for **at-least-once delivery**: most queues/buses can deliver a message more than once, so make your handlers **idempotent** — processing the same event twice must not double-charge a card or send two emails." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Event-driven** = components react to events instead of calling each other directly. **Message queue** = a buffer that holds work until a consumer picks it up (SQS, Azure Queue). **Producer / consumer** = the sender / receiver of messages. **Pub/sub** = broadcasting an event to many subscribers (SNS, Event Grid). **Fan-out** = one event triggering many independent reactions. **Decoupling** = removing direct dependencies so parts change independently. **Idempotent** = safe to run more than once with the same result. **At-least-once delivery** = a message may arrive more than once, so handlers must tolerate duplicates." },
      ],
      takeaways: [
        "Event-driven architecture wires functions via events, decoupling producers from consumers through a messaging layer.",
        "Queues (SQS, Azure Queue) buffer work — one consumer per message — smoothing spikes and adding retry resilience.",
        "Pub/sub (SNS, Event Grid) broadcasts one event to many subscribers — fan-out — so you extend without touching the producer.",
        "Assume at-least-once delivery and make handlers idempotent so duplicate events don't cause double effects.",
      ],
      flashcards: [
        { front: "Queue vs pub/sub", back: "A queue delivers each message to one consumer (work distribution, buffering); pub/sub broadcasts each event to every subscriber (fan-out). SQS vs SNS/Event Grid." },
        { front: "Why make event handlers idempotent?", back: "Because most queues/buses guarantee at-least-once delivery — the same event can arrive twice, and processing it twice must not double-charge or double-send." },
        { front: "What does decoupling buy you?", back: "Producers and consumers scale, fail, and deploy independently since they share only a message contract — resilient, easily extended systems." },
      ],
      quiz: [
        { q: "One 'order placed' event must trigger an email, an inventory update, and analytics. Which fits best?", options: ["A single queue with one consumer", "Pub/sub fan-out to multiple subscribers", "A direct function call chain", "A database trigger only"], answer: 1, explain: "Pub/sub (SNS / Event Grid) broadcasts the event to many independent subscribers — the fan-out pattern." },
        { q: "Why should event handlers be idempotent?", options: ["To run faster", "Because at-least-once delivery means an event may arrive more than once", "To reduce storage cost", "It's required for encryption"], answer: 1, explain: "Queues and buses typically guarantee at-least-once delivery, so a handler must tolerate processing the same event twice." },
      ],
    },
    {
      slug: "serverless-tradeoffs",
      title: "When serverless wins — and when it doesn't",
      summary:
        "The limits, cost crossover, and lock-in of serverless, and a clear rule for choosing it over containers or VMs.",
      minutes: 8,
      blocks: [
        { type: "p", text: "Serverless is powerful but not universal. Knowing exactly where it shines and where it hurts is what separates a good architecture decision from a trendy one." },
        { type: "h2", text: "Where serverless wins" },
        { type: "list", items: [
          "**Spiky or unpredictable traffic** — scaling to zero and back means you pay nothing at idle and absorb bursts automatically.",
          "**Event glue** — reacting to uploads, queue messages, webhooks, and schedules with small functions.",
          "**Fast-moving teams** — no servers to patch or capacity to plan means shipping features, not managing fleets.",
          "**Low-to-moderate steady volume** — where per-request billing stays cheaper than a running server.",
        ]},
        { type: "h2", text: "Where it hurts" },
        { type: "list", items: [
          "**Steady high throughput** — past a crossover point, always-on containers/VMs are cheaper than paying per invocation.",
          "**Long-running or CPU-heavy jobs** — functions have execution-time and resource limits; big batch or streaming work fits containers.",
          "**Latency-critical paths** — cold starts can violate tight tail-latency budgets.",
          "**Portability** — deep use of one cloud's triggers and services increases **vendor lock-in**.",
        ]},
        { type: "diagram", name: "compute-spectrum", caption: "Serverless sits at the low-ops end of the compute spectrum — least control, fastest to ship." },
        { type: "callout", kind: "key", text: "Rule of thumb: reach for serverless first for event-driven, spiky, or glue workloads and anything you want to ship without running servers. Move to containers when traffic is steady and high, jobs run long, or you need portability and fine control." },
        { type: "callout", kind: "tip", text: "It's not all-or-nothing. Real systems mix them: serverless for event handling and bursty endpoints, containers for the steady core services and long jobs. Choose per workload, not per company." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Cost crossover** = the traffic level above which an always-on server is cheaper than per-request serverless billing. **Execution time limit** = the maximum a single function invocation may run before the platform stops it. **Vendor lock-in** = becoming so tied to one provider's specifics that switching is expensive. **Tail latency** = the slow end of your response-time distribution (p95/p99), where cold starts show up. **Steady-state traffic** = consistent, predictable load (the opposite of spiky)." },
      ],
      takeaways: [
        "Serverless wins for spiky/unpredictable traffic, event glue, fast-moving teams, and low-to-moderate steady volume.",
        "It hurts for steady high throughput (cost crossover), long/CPU-heavy jobs (time limits), latency-critical paths (cold starts), and portability (lock-in).",
        "Default to serverless for event-driven and bursty work; move to containers for steady, high, long, or portable workloads.",
        "Mix both — choose per workload, not per company.",
      ],
      flashcards: [
        { front: "Two workloads where serverless is the wrong choice", back: "Steady high-throughput services (past the cost crossover an always-on server is cheaper) and long-running/CPU-heavy jobs (functions have execution-time limits)." },
        { front: "When does serverless clearly win?", back: "Spiky/unpredictable traffic, event-glue work, and teams that want to ship without managing servers — it scales to zero and costs nothing at idle." },
        { front: "What is cost crossover?", back: "The traffic level above which a continuously running container/VM becomes cheaper than paying per invocation for serverless." },
      ],
      quiz: [
        { q: "Which workload is the poorest fit for serverless?", options: ["A webhook handler with bursty traffic", "A steady, high-throughput core API running 24/7", "Resizing images on upload", "A nightly scheduled cleanup job"], answer: 1, explain: "A steady high-throughput service usually crosses the cost point where always-on containers/VMs are cheaper and avoid cold starts." },
        { q: "What's a sensible default heuristic?", options: ["Always use serverless for everything", "Never use serverless", "Serverless for event-driven/spiky/glue work; containers for steady, high, long, or portable workloads", "Choose based on the newest service"], answer: 2, explain: "Match the tool to the workload — serverless for event-driven and bursty work, containers for steady/high/long/portable needs; real systems mix both." },
      ],
    },
  ],
};
