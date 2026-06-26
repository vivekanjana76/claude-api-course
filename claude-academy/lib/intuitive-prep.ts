// Interview prep tailored to the Intuitive.ai "Claude Enterprise Engineer" role.
// Company facts are sourced from public web research (Nov 2025 rebrand from
// Intuitive.Cloud to Intuitive.ai). Treat them as talking points, and verify
// anything you plan to state as fact during the interview.

export interface PrepQA {
  q: string;
  a: string;
  topic: string;
}

export interface LessonLink {
  title: string;
  slug: string;
}

export interface StudyArea {
  jd: string; // the JD responsibility / skill, paraphrased
  why: string; // why it matters / what they're testing
  lessons: LessonLink[]; // lessons in this course that cover it
}

/* ------------------------------------------------------------------ */
/* Company profile                                                     */
/* ------------------------------------------------------------------ */

export const company = {
  name: "Intuitive.ai",
  formerName: "Intuitive.Cloud (rebranded Nov 3, 2025)",
  tagline: "Build Secure, AI-Ready Enterprises",
  positioning:
    "An AI-first engineering, automation and innovation company that helps global enterprises turn AI ambition into production-grade, governed, outcome-driven systems — not just prototypes.",
  founded: "2012 (as Intuitive, an Iselin, NJ cloud-engineering firm)",
  hq: "Iselin, New Jersey, USA (delivery centers include Ahmedabad & Pune, India)",
  size: "~201–500 employees",
  leadership: [
    { name: "Jay Modh", role: "Founder & CEO" },
    { name: "Mir Ali", role: "CTO" },
    { name: "Indraneel Shah", role: "Co-founder & COO" },
  ],
  framework: {
    name: "aiE™",
    desc: "Intuitive's AI-first framework that unites Innovation, Automation and Engineering excellence — built to move enterprises from fragile prototypes to secure, scalable, measurable, governed AI in production.",
  },
  products: [
    {
      name: "NeuroQuery",
      desc: "Generative-AI engine for visuals, synthetic data and real-time insight — a secure, scalable layer for enterprise GenAI.",
    },
    {
      name: "NeuroStack",
      desc: "An agentic layer: a secure network of agents that plan, reason and execute autonomously — turning automation into intelligent action.",
    },
    {
      name: "Hybrid AI",
      desc: "Merges deep learning with symbolic reasoning for explainable, adaptive, auditable intelligence.",
    },
  ],
  partners: ["Anthropic", "AWS", "Microsoft Azure", "Google Cloud", "Databricks"],
  industries: [
    "Healthcare & Life Sciences (HIPAA, GxP, 21 CFR Part 11)",
    "Banking, Financial Services & Insurance (credit, fraud, AML, trading)",
    "Heavy Industries",
    "Independent Software Vendors (ISVs)",
  ],
  credentials: [
    "AWS Data & Analytics Competency",
    "CRN Fast Growth (top-10, 2022)",
    "Inc. 5000 fastest-growing private companies (2022)",
  ],
  // Short, sharp facts to drop naturally into the conversation.
  facts: [
    "They rebranded from **Intuitive.Cloud** to **Intuitive.ai** in November 2025 — the whole company is repositioning from cloud engineering to AI-first enterprise transformation. Your role is part of that bet.",
    "Their pitch is **outcomes over prototypes**: governed, secure, production AI. Frame every answer around reliability, safety and measurable business value — not demos.",
    "**Anthropic is a named partner.** This is a Claude-specialist role, so depth on the Anthropic API (tool use, long context, structured outputs, caching, safety) is your edge.",
    "They serve **regulated industries** (healthcare, BFSI). Data governance, auditability, PII handling and compliance are first-class concerns, not afterthoughts.",
    "Their products **NeuroStack** (agents) and **NeuroQuery** (GenAI/RAG) map almost 1:1 to the JD — agentic workflows and RAG over enterprise knowledge.",
  ],
};

/* ------------------------------------------------------------------ */
/* JD → curriculum map (your study plan)                              */
/* ------------------------------------------------------------------ */

export const studyMap: StudyArea[] = [
  {
    jd: "Build AI apps on Claude: long-context reasoning, document analysis, conversational workflows",
    why: "The core of the role. They want someone fluent in the Anthropic API mental model — stateless requests, the messages format, the context window as a shared budget.",
    lessons: [
      { title: "What is Claude & the Anthropic API", slug: "what-is-claude" },
      { title: "The Messages format & roles", slug: "the-messages-api" },
      { title: "Tokens & the context window", slug: "tokens-and-context" },
      { title: "Choosing a model", slug: "models-and-pricing" },
    ],
  },
  {
    jd: "Design & implement RAG over enterprise knowledge bases",
    why: "Their NeuroQuery product and most enterprise use cases are RAG. Expect deep questions on chunking, embeddings, retrieval quality and grounding.",
    lessons: [
      { title: "What is RAG and why it exists", slug: "rag-fundamentals" },
      { title: "Embeddings & semantic search", slug: "embeddings-and-search" },
      { title: "Building a RAG pipeline", slug: "rag-pipeline" },
    ],
  },
  {
    jd: "Agentic workflows: tool use, structured outputs, function calling",
    why: "NeuroStack is an agent platform. They'll want the agent-loop mental model and the discipline to know when NOT to build an agent.",
    lessons: [
      { title: "Tool use: giving Claude hands", slug: "tool-use-basics" },
      { title: "Controlling tool choice", slug: "tool-choice" },
      { title: "Structured outputs", slug: "structured-outputs" },
      { title: "The agentic loop", slug: "the-agentic-loop" },
      { title: "Designing good agents", slug: "agent-design" },
    ],
  },
  {
    jd: "Leverage the large context window for document-heavy work (contracts, reports, codebases)",
    why: "A differentiator of Claude. Show you know that a big window is a capability, not an instruction to dump everything — and how to manage long runs.",
    lessons: [
      { title: "Tokens & the context window", slug: "tokens-and-context" },
      { title: "Prompt caching", slug: "prompt-caching" },
      { title: "Context management for long runs", slug: "context-management" },
    ],
  },
  {
    jd: "Integrate Claude into enterprise systems (CRM, ERP, data platforms) via APIs",
    why: "Tool use + MCP are how Claude touches enterprise systems. MCP is the standard story Anthropic-aligned shops love to hear.",
    lessons: [
      { title: "Tool use: giving Claude hands", slug: "tool-use-basics" },
      { title: "MCP: the Model Context Protocol", slug: "mcp" },
      { title: "Managed Agents", slug: "managed-agents" },
      { title: "Server tools: web search & code execution", slug: "server-tools" },
    ],
  },
  {
    jd: "Prompt engineering aligned with Constitutional AI for safe outputs",
    why: "This is Anthropic-specific framing. Connect prompt design to safety, refusals and responsible use — exactly the language they used.",
    lessons: [
      { title: "System prompts: setting the rules", slug: "system-prompts" },
      { title: "Prompting fundamentals", slug: "prompting-fundamentals" },
      { title: "Core techniques: examples, XML, roles", slug: "prompt-techniques" },
      { title: "Safety, refusals & responsible use", slug: "safety-and-refusals" },
    ],
  },
  {
    jd: "Build evaluation pipelines: accuracy, hallucination reduction, safety compliance",
    why: "Evals are how you prove 'production-grade'. They want someone who replaces vibes with tracked scores and catches regressions.",
    lessons: [
      { title: "Why evaluations matter", slug: "why-evals" },
      { title: "Grading: code vs. model-graded", slug: "building-evals" },
    ],
  },
  {
    jd: "Secure handling of enterprise data & governance adherence",
    why: "Regulated industries. Talk PII, secrets, least privilege, human-in-the-loop for irreversible actions, and refusals as a normal outcome.",
    lessons: [
      { title: "Safety, refusals & responsible use", slug: "safety-and-refusals" },
      { title: "Managed Agents", slug: "managed-agents" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Technical Q&A — mapped to the JD themes                            */
/* ------------------------------------------------------------------ */

export const technicalQA: PrepQA[] = [
  // --- Claude / API fundamentals ---
  {
    topic: "Claude Core",
    q: "Why Claude for an enterprise document-intelligence product specifically?",
    a: "Three reasons that match enterprise needs: (1) a very large context window that handles whole contracts/reports/codebases in one shot; (2) strong instruction-following and structured/tool outputs for reliable integration; and (3) Anthropic's safety posture (Constitutional AI, predictable refusals, responsible-use guidance) which matters in regulated industries. I'd still validate the fit with evals rather than assume it.",
  },
  {
    topic: "Claude Core",
    q: "The API is stateless — what does that mean for an enterprise chatbot?",
    a: "Claude remembers nothing between calls, so the application owns memory: you resend the relevant conversation history (plus system prompt, tools, retrieved docs) on every request. At enterprise scale that means you actively manage what goes in the window — prune or summarize old turns, cache the stable prefix — instead of letting history grow unbounded and blow up cost and latency.",
  },
  {
    topic: "Claude Core",
    q: "How do you choose between Haiku, Sonnet, and Opus in production?",
    a: "Match the tier to the task and let evals decide. Haiku for high-volume, latency-sensitive, simpler steps (classification, routing, extraction); Sonnet as the balanced production workhorse; Opus for hard multi-step reasoning and agentic work. A common enterprise pattern is a router: cheap model for easy queries, escalate to a stronger one for complex ones. Default to a capable model, then downgrade only if evals stay green.",
  },
  {
    topic: "Claude Core",
    q: "What lives in the context window, and why is 'just use the big window' a trap?",
    a: "Everything in one request shares it: system prompt, full history, tool definitions, retrieved documents, and the space reserved for the reply. A bigger window is a capability, not an instruction to fill it — stuffing it raises cost and latency and can bury the relevant facts ('lost in the middle'). For document-heavy work I still retrieve or structure inputs and put the most important material where the model attends best.",
  },

  // --- Long context & documents ---
  {
    topic: "Long Context",
    q: "A user uploads a 300-page contract and asks questions. Long context or RAG?",
    a: "It depends on the access pattern. For deep reasoning over one document in a single session (summarize, find conflicting clauses, cross-reference), long context wins — paste it in and let Claude reason over the whole thing, with prompt caching so repeated questions reuse the cached document at ~10% cost. For a library of thousands of contracts where each question touches a few, RAG wins on cost and latency. Many real systems do both: RAG to find the right documents, long context to reason within them.",
  },
  {
    topic: "Long Context",
    q: "How does prompt caching change the economics of document-heavy use cases?",
    a: "Caching reuses a stable prompt prefix across requests so cached reads cost a fraction of normal input. If a 200-page report sits at the front of the prompt and a user asks ten follow-ups, you pay full price once and ~10% for each follow-up. The one invariant: it's a strict prefix match — any byte change before the cache point (a timestamp, reordered tools, a swapped system line) invalidates everything after. So I keep stable content (docs, system prompt, tool defs) first and volatile content (the user's latest turn) last.",
  },
  {
    topic: "Long Context",
    q: "How do you keep a long-running agent from overflowing the window?",
    a: "Context management: prune low-value turns, summarize/compact older history into a running summary, and keep only what the next step needs. Anthropic's Managed Agents do automatic compaction for you. The gotcha with compaction is that summarizing can drop a detail the agent later needs — so keep critical facts (IDs, decisions, constraints) in a structured, durable place rather than trusting them to survive summarization.",
  },

  // --- RAG ---
  {
    topic: "RAG",
    q: "Walk me through a production RAG pipeline end to end.",
    a: "Offline (indexing): load documents, chunk them sensibly, embed each chunk with an embedding model, and store vectors + metadata in a vector DB. Online (query): embed the user's question, retrieve the nearest chunks (often hybrid: vector + keyword), optionally re-rank, then inject the top chunks into the prompt inside clear tags. Generation: instruct Claude to answer only from that context, to say when the answer isn't present, and to cite sources. Then evaluate retrieval and generation separately so you know which half to fix.",
  },
  {
    topic: "RAG",
    q: "Retrieval returns the wrong chunks. How do you debug it?",
    a: "Isolate the stage. First evaluate retrieval alone: for a set of questions with known answers, is the right chunk in the top-k? If not, the problem is upstream — chunking (too big/small, split mid-thought), the embedding model, or missing hybrid/keyword search for exact terms like IDs and product codes. Fixes: better chunk boundaries, add metadata filtering, hybrid search, a re-ranker, or raise k. Only once retrieval is solid do I tune the generation prompt. Evaluating the two separately is the whole point.",
  },
  {
    topic: "RAG",
    q: "How do you choose chunk size and strategy?",
    a: "Chunk on meaning, not arbitrary character counts: respect structure (headings, sections, clauses, code functions) so a chunk is a self-contained idea. Too large and retrieval gets noisy and you waste context; too small and you lose the surrounding meaning. Add modest overlap so ideas spanning a boundary aren't cut. Keep metadata (source, section, date, access tags) on each chunk for filtering and citations. Then let an eval set tell you what size actually retrieves best for your corpus.",
  },
  {
    topic: "RAG",
    q: "What makes a RAG answer trustworthy enough for an enterprise?",
    a: "Grounding plus citations plus evaluation. Instruct Claude to answer only from retrieved context, to explicitly say when the answer isn't there (no guessing), and to cite which chunk each claim came from — Claude supports native citations. Then measure faithfulness (does the answer follow from the context, no hallucinations), answer relevance, and context relevance. In regulated settings, citations are also the audit trail.",
  },
  {
    topic: "RAG",
    q: "How do embeddings actually enable semantic search?",
    a: "An embedding model maps text to a vector that captures meaning, so texts with similar meaning land near each other in vector space. You embed and store document chunks offline; at query time you embed the question and retrieve nearest neighbors by cosine similarity. The non-negotiable rule: use the same embedding model for documents and queries, or the vectors aren't comparable. Pure semantic search can miss exact tokens (codes, names), which is why hybrid (semantic + keyword) is often best.",
  },
  {
    topic: "RAG",
    q: "How do you stop one tenant from retrieving another tenant's data in a shared index?",
    a: "Treat access control as a retrieval-time filter, not a prompt instruction. Tag every chunk with tenant/permission metadata at indexing time and apply metadata filtering inside the vector query so the candidate set only ever contains documents the caller is allowed to see — ideally enforced server-side, not in post-processing the model could be tricked into ignoring. For strict isolation, use per-tenant namespaces/indexes. Never rely on 'please only use tenant X's docs' in the prompt.",
  },

  // --- Tool use, structured outputs, agents ---
  {
    topic: "Tool Use",
    q: "Explain the tool-use loop. Does Claude run my code?",
    a: "No — Claude only requests calls. You send the user message plus tool definitions. Claude returns stop_reason='tool_use' with a tool_use block (name + arguments). Your code executes the real function and returns a tool_result block matched by tool_use_id. You call the API again with that result and Claude produces the final answer (stop_reason='end_turn'). The execution, auth, and validation all live in your code — which is exactly where enterprise security controls belong.",
  },
  {
    topic: "Tool Use",
    q: "How do you guarantee Claude returns data your system can parse?",
    a: "Make the format a hard constraint, not a polite request. Use structured outputs — a JSON schema on the response, or strict:true on a tool so its arguments are guaranteed to match the schema. That's how you safely feed Claude's output into a CRM/ERP API. The tool description is your steering wheel: clear names and descriptions drive correct tool selection far more than prompt nagging.",
  },
  {
    topic: "Agents",
    q: "What is an agent, and when should you NOT build one?",
    a: "An agent is tool use in a loop: the model picks an action, your code runs it, the result goes back, and it repeats until the goal is met. Don't build one when the steps are fixed — that's a workflow, and deterministic code is cheaper, faster, and more reliable. Build an agent only when the task is genuinely multi-step and can't be fully scripted, the value justifies the cost, the model is viable at it, and errors are recoverable. In an enterprise that 'don't over-engineer' judgment is a selling point.",
  },
  {
    topic: "Agents",
    q: "How do you make an agentic workflow safe and reliable in production?",
    a: "Constrain and observe it. Give a tight, well-described tool surface (least privilege — only the tools the task needs); validate every tool input because it's model-generated; gate irreversible or high-impact actions (payments, deletes, sending email) behind human approval; cap the loop with iteration/cost limits; and trace every step so you can debug a 15-step run. Pair that with evals on the whole workflow, not just the model. Reliability and guardrails are the enterprise differentiator.",
  },
  {
    topic: "Agents",
    q: "What is MCP and why would Intuitive care about it?",
    a: "The Model Context Protocol is an open standard for connecting models to tools, data resources, and prompts in a common format. Build a connector once and any MCP-aware client can use it — turning N apps × M integrations into N + M. For a company integrating Claude into many enterprise systems (CRM, ERP, data platforms), MCP means reusable, standardized connectors instead of bespoke glue per client — faster delivery and less maintenance.",
  },
  {
    topic: "Agents",
    q: "Managed Agents vs. building the loop yourself — how do you decide?",
    a: "Managed Agents are an Anthropic-hosted surface that runs the agent loop and a tool-execution container, with automatic compaction, caching, and an event stream; you define an Agent once (model, system prompt, tools) and run Sessions against it. Use it to ship fast and offload undifferentiated plumbing. Build the loop yourself when you need full control over execution environment, custom orchestration, on-prem/VPC data boundaries, or tight governance — which regulated enterprise clients often require.",
  },

  // --- Prompting & safety ---
  {
    topic: "Prompting & Safety",
    q: "What does 'prompt engineering aligned with Constitutional AI' mean to you?",
    a: "Constitutional AI is Anthropic's training approach: the model is aligned to a set of principles (a 'constitution') so it's helpful, honest, and harmless. In prompting, aligning to it means I don't try to jailbreak or override those values — I work with them: clear system prompts that set role and boundaries, explicit instructions to refuse unsafe requests gracefully, transparency that the user is talking to an AI and where its knowledge comes from, and designing for refusals as a normal, expected outcome rather than fighting them.",
  },
  {
    topic: "Prompting & Safety",
    q: "How should the application handle a refusal?",
    a: "A refusal is a normal HTTP 200 response with stop_reason='refusal' — not an error. Always branch on stop_reason before reading content (which may be empty), show the user a graceful fallback, log it, and don't blindly retry the same prompt expecting a different answer. In an enterprise app, refusals on out-of-policy requests are a feature: they're the guardrail working.",
  },
  {
    topic: "Prompting & Safety",
    q: "What separates a production prompt from a quick demo prompt?",
    a: "Production prompts are specific, structured, and versioned. They state the task, give context, set constraints and edge-case behavior, define the exact output format (often with examples), and explicitly define failure modes ('if the data isn't present, say so'). They're tested against an eval set and version-controlled so you can detect regressions when you change them or the model. Modern Claude models are literal — clear instructions beat shouting and beat fiddling with sampling knobs.",
  },

  // --- Evaluation ---
  {
    topic: "Evaluation",
    q: "How would you build an eval pipeline for hallucination and accuracy?",
    a: "Start from real tasks: assemble a representative dataset of inputs with known-good outputs or rubrics. Use code-graded checks where answers are deterministic (exact match, valid JSON/schema, contains the cited fact) and model-graded (LLM-as-judge) against a concrete rubric for open-ended quality and faithfulness. For RAG specifically, score faithfulness, answer relevance, and context relevance separately. Track the score over time in CI so every prompt or model change is measured, and regressions block release.",
  },
  {
    topic: "Evaluation",
    q: "Why eval the feature and not just the model?",
    a: "Benchmarks tell you a model is generally capable; they don't tell you whether YOUR contract-analysis feature with YOUR prompt, retrieval, and tools is correct. The thing that ships is the whole pipeline, so that's what you measure — on your data, with your rubric. It's also how you safely choose a cheaper/faster model: swap it, re-run the feature evals, and keep it only if the score holds.",
  },

  // --- Enterprise / governance ---
  {
    topic: "Enterprise & Governance",
    q: "What's your approach to secure handling of enterprise data with Claude?",
    a: "Defense in depth. Never put secrets (keys, passwords) in prompts, memory, or logs. Minimize and redact PII before it reaches the model where possible, and respect data residency (VPC/on-prem, Bedrock/Vertex if the client requires it). Enforce access control at retrieval time with metadata/tenant filters, not in the prompt. Validate all tool inputs since they're model output, apply least privilege to tools, and gate irreversible actions behind human approval. Log and trace for auditability. Understand the provider's data-retention/training terms for enterprise use.",
  },
  {
    topic: "Enterprise & Governance",
    q: "A healthcare client needs HIPAA compliance. What changes in your design?",
    a: "I treat PHI as the controlling constraint end to end: a deployment with a BAA and data residency the client accepts (e.g., Claude via AWS Bedrock in their VPC); minimize/de-identify PHI before sending it to the model; strict access control and audit logging on every retrieval and tool call; human review on anything clinical or irreversible; and citations so outputs are traceable. This is exactly Intuitive's aiE positioning — governed, compliant, production AI rather than an ungoverned prototype.",
  },
  {
    topic: "Enterprise & Governance",
    q: "How do you reduce hallucination in a customer-facing enterprise assistant?",
    a: "Layer the defenses: ground answers in retrieved context and instruct the model to answer only from it and to admit uncertainty; use citations so claims are checkable; constrain outputs with schemas where structure matters; keep a human in the loop for high-stakes responses; and measure faithfulness with evals so you catch drift. No single trick eliminates hallucination — it's grounding + instruction + citation + evaluation together, and being honest with the business about residual risk.",
  },
];

/* ------------------------------------------------------------------ */
/* Behavioral & company-fit Q&A                                       */
/* ------------------------------------------------------------------ */

export const behavioralQA: PrepQA[] = [
  {
    topic: "Motivation",
    q: "Why Intuitive.ai?",
    a: "They just bet the company on AI — rebranding from Intuitive.Cloud to Intuitive.ai to go from cloud engineering to AI-first enterprise transformation. That's exactly the work I want: not chatbots-as-demos but governed, production AI that moves a business metric, in regulated industries where reliability and safety actually matter. With Anthropic as a named partner and products like NeuroStack and NeuroQuery, this is a place to go deep on Claude for real enterprise problems.",
  },
  {
    topic: "Motivation",
    q: "Tell me about yourself / why this role.",
    a: "(Tailor to your story.) Frame: who you are + hands-on LLM/Claude experience in production + a concrete shipped result (a RAG assistant, an agentic workflow, an eval pipeline) + why enterprise Claude work is where you want to grow. Keep it to ~60–90 seconds and land on 'and that's why this Claude Enterprise Engineer role fits.'",
  },
  {
    topic: "Fit",
    q: "How do you balance shipping fast with safety and governance?",
    a: "I ship the smallest reliable thing and let evidence drive scope. Start with the simplest architecture that could work (single call or workflow before agent), put guardrails on from day one because they're cheap early and expensive to retrofit — input validation, least-privilege tools, human approval on irreversible actions — and gate releases on an eval suite. Governance isn't the thing that slows you down; missing it is, when a regulated client audit forces a rebuild.",
  },
  {
    topic: "Fit",
    q: "Describe a time an AI system failed in production. What did you do?",
    a: "(Use a real STAR story.) Structure: Situation (what broke — bad retrieval, a hallucinated answer, a runaway agent), Task (your responsibility), Action (how you isolated it — separated retrieval vs. generation, added an eval that reproduced it, added a guardrail), Result (measurable fix + what you put in place so it can't regress). The point they're testing: do you debug systematically and prevent recurrence with evals?",
  },
  {
    topic: "Fit",
    q: "How do you keep up with a field moving this fast?",
    a: "I follow Anthropic's docs, model and API changelogs, and engineering posts directly, and I learn by building small evals against new features rather than trusting hype. I keep a mental model of the primitives (context, tools, retrieval, evals) so new features slot into a framework instead of being noise. Concretely — I built a structured course for myself on exactly this stack to make sure I could explain it, not just use it.",
  },
];

/* ------------------------------------------------------------------ */
/* Your 60-second pitch + per-JD talking points                       */
/* ------------------------------------------------------------------ */

export const talkTrack = {
  pitch:
    "I build production AI on Claude — RAG over enterprise knowledge, agentic workflows with tool use and structured outputs, and the eval pipelines that prove they're reliable. I think in primitives: the context window as a shared budget, tool use as a loop, retrieval evaluated separately from generation, and safety/governance designed in rather than bolted on. That's the same outcomes-over-prototypes posture Intuitive.ai just rebranded around, which is why this role fits.",
  points: [
    "**Long context + caching** → handle whole contracts/reports in one shot, cheaply, without dumping everything in blindly.",
    "**RAG done right** → meaning-based chunking, hybrid retrieval, grounding + citations, retrieval and generation evaluated separately.",
    "**Agents with judgment** → tool use in a loop, but only when a workflow won't do; least-privilege tools, human-in-the-loop, capped loops.",
    "**Structured outputs + MCP** → reliable integration into CRM/ERP/data platforms; reusable connectors instead of bespoke glue.",
    "**Evals + safety** → tracked scores for accuracy and faithfulness; Constitutional-AI-aligned prompting; refusals handled as a normal outcome.",
    "**Governance** → PII/secrets discipline, access control at retrieval time, auditability — built for regulated industries.",
  ],
};

/* ------------------------------------------------------------------ */
/* Interview process & questions to ask                               */
/* ------------------------------------------------------------------ */

export const interviewStages = [
  {
    stage: "Recruiter / screen",
    what: "Background, years of hands-on Claude/LLM-in-production experience, role expectations, location (Ahmedabad/Pune) and availability.",
    prep: "Have your 60-second pitch and a one-line summary of each shipped LLM project ready. Be clear on your real production experience vs. side projects.",
  },
  {
    stage: "Technical screen",
    what: "Core LLM/Claude concepts, RAG, embeddings/vector DBs, prompting, structured outputs — likely conversational plus some coding (Python).",
    prep: "Be able to whiteboard a RAG pipeline and the tool-use loop from memory. Sharpen Python: API calls, chunking/embedding, basic retrieval.",
  },
  {
    stage: "System design",
    what: "Design an enterprise Claude system end to end: an enterprise copilot / document-intelligence / agentic workflow over their data.",
    prep: "Practice out loud: requirements → retrieval vs. long context → model choice → tools/integration → evals → safety/governance → cost/latency.",
  },
  {
    stage: "Behavioral / culture",
    what: "Ownership, collaboration, how you handle ambiguity and failures, and why Intuitive.ai.",
    prep: "Prepare 3–4 STAR stories (a shipped win, a production failure you fixed, a disagreement, a fast-learning moment). Memorize the 'Why Intuitive' answer.",
  },
];

export const questionsToAsk = [
  "How is the aiE™ framework applied day to day — what does 'production-grade, governed AI' look like in a real client delivery?",
  "Where are NeuroStack and NeuroQuery in their lifecycle, and would this role build on them or with clients directly?",
  "How does the Anthropic partnership show up in engineering — Claude via the API directly, via Bedrock/Vertex, or both, depending on the client?",
  "What does the eval and quality bar look like before something ships to a regulated client?",
  "For healthcare/BFSI clients, how do you handle data residency and PII — VPC deployments, on-prem, de-identification?",
  "What does success in this role look like in the first 6 months?",
  "How is the team structured — do engineers own a use case end to end, or split across retrieval/agents/eval?",
];

/* ------------------------------------------------------------------ */
/* Last-mile checklist                                                 */
/* ------------------------------------------------------------------ */

export const checklist = [
  "Explain the Anthropic API mental model: stateless requests, messages/roles, the context window as a shared budget.",
  "Whiteboard a full RAG pipeline and debug bad retrieval by isolating retrieval vs. generation.",
  "Explain the tool-use loop precisely (stop_reason flow) and that Claude never runs your code.",
  "State when to use an agent vs. a workflow vs. a single call — and argue for the simpler option.",
  "Describe long-context + prompt-caching economics and the strict-prefix cache invariant.",
  "Define structured outputs (json_schema / strict tools) and why prompt wording alone isn't enough.",
  "Tie prompting to Constitutional AI, refusals (stop_reason='refusal'), and responsible use.",
  "Describe an eval pipeline: code-graded vs. model-graded, RAG faithfulness/relevance, tracked in CI.",
  "Talk enterprise data governance: PII, secrets, retrieval-time access control, human-in-the-loop, auditability.",
  "Have crisp company facts: rebrand to Intuitive.ai, aiE™, NeuroStack/NeuroQuery, Anthropic partner, regulated industries.",
  "Prepare 3–4 STAR stories and 3 questions to ask them.",
  "Refresh Python: API calls, chunking, embeddings, a minimal retrieval loop.",
];
