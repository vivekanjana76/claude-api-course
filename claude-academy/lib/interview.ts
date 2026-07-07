import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  {
    topic: "Foundations",
    q: "Is the Claude API stateful or stateless, and what does that imply?",
    a: "Stateless. Claude remembers nothing between calls, so your application must resend the entire conversation history on every request. A chatbot's 'memory' is just your app re-sending the messages array each turn.",
  },
  {
    topic: "Foundations",
    q: "What is a token and why does it matter?",
    a: "A token is a chunk of text (~3–4 characters of English) — the unit models read and bill in. It matters because you pay per input and output token, and the context window (the total budget) is measured in tokens, not characters.",
  },
  {
    topic: "Foundations",
    q: "What's in the context window?",
    a: "Everything in one request shares it: the system prompt, the full conversation history, tool definitions, any documents, AND the space reserved for the reply. A bigger window is a capability, not an instruction to fill it.",
  },
  {
    topic: "Foundations",
    q: "How do you choose between Haiku, Sonnet, Opus, and Fable?",
    a: "Match the tier to the task. Haiku for fast, cheap, high-volume simple tasks (classification, routing); Sonnet as the balanced production workhorse; Opus for hard reasoning and agentic coding; Fable for the most demanding frontier work. Default to a capable model and only downgrade if your evals stay green.",
  },
  {
    topic: "Prompting",
    q: "What separates a good prompt from a bad one?",
    a: "Clarity, specificity, and structure. A good prompt states the task, gives context, sets constraints and edge-case handling, defines the exact output format, and often includes examples. Vague prompts are the #1 cause of bad output.",
  },
  {
    topic: "Prompting",
    q: "When would you use few-shot prompting?",
    a: "When you need to lock in a specific format, style, or classification behavior that instructions alone don't reliably produce. Showing 1–5 example input→output pairs resolves ambiguity far better than describing it.",
  },
  {
    topic: "Prompting",
    q: "Explain prompt caching and its main pitfall.",
    a: "Caching reuses a stable prompt prefix across requests so reads cost ~10% of normal input. The pitfall: it's a strict prefix match — any byte change in the prefix (a timestamp, a reordered JSON key, a swapped tool) invalidates everything after it. Keep stable content first and volatile content last.",
  },
  {
    topic: "Evaluation",
    q: "Why do you need evals, and what are the two grading approaches?",
    a: "Evals replace eyeballing with a tracked score so you can improve with evidence, compare models, and catch regressions. Code-graded evals deterministically check exact matches, valid JSON, or properties; model-graded evals (LLM-as-judge) score open-ended quality against a rubric. Good suites use both.",
  },
  {
    topic: "Tool Use",
    q: "Walk through how tool use works.",
    a: "You send the user message plus tool definitions. Claude returns stop_reason='tool_use' with a tool_use block (name + arguments). Your code executes the real function and returns a tool_result block (matched by tool_use_id). You call the API again and Claude produces the final answer. Claude never runs your code — it only requests calls.",
  },
  {
    topic: "Tool Use",
    q: "How do you guarantee Claude returns valid JSON?",
    a: "Use structured outputs: set output_config.format to a json_schema to constrain the whole response, or set strict:true on a tool to guarantee its arguments match the schema. Don't rely on prompt wording alone — make the format a hard constraint.",
  },
  {
    topic: "Agents",
    q: "What is an agent?",
    a: "Tool use in a loop. The model decides an action, your code executes it, the result goes back, and the model decides the next action — repeating until the goal is met (stop_reason='end_turn'). The loop plus a good tool surface and a clear goal IS the agent; there's no special 'agent mode'.",
  },
  {
    topic: "Agents",
    q: "Agent vs. workflow — when do you build which?",
    a: "A workflow is when your code controls fixed steps (parse → validate → store); an agent is when the model decides the steps. Build an agent only when the task is multi-step and can't be fully scripted, the value justifies the cost, the model is viable at it, and errors are recoverable. Otherwise prefer a single call or a workflow.",
  },
  {
    topic: "Agents",
    q: "What is MCP and why does it matter?",
    a: "The Model Context Protocol is an open standard for connecting AI to tools, data resources, and prompts in a common format. Build a connector once and any MCP-aware client can use it — turning N apps × M integrations into N + M. It's becoming the universal way to give models tool/data access.",
  },
  {
    topic: "Agents",
    q: "What are Managed Agents?",
    a: "An Anthropic-hosted surface that runs the agent loop and a tool-execution container for you. You create a persisted Agent (model, system prompt, tools) once and reference it from Sessions that run each task. Config lives on the Agent, never the session; you get hosted tools, automatic compaction/caching, and an event stream.",
  },
  {
    topic: "RAG",
    q: "What is RAG and what problem does it solve?",
    a: "Retrieval-Augmented Generation retrieves relevant data and injects it into the prompt so the model answers from your facts rather than its training. It solves three gaps: private data the model never saw, events after the training cutoff, and hallucination on unknown topics — all without retraining.",
  },
  {
    topic: "RAG",
    q: "How does semantic retrieval actually work?",
    a: "Via embeddings. An embedding model turns text into a vector capturing its meaning; similar meanings produce nearby vectors. You embed and store document chunks offline, embed the query online, and retrieve the nearest neighbors (cosine similarity). Use the same embedding model for documents and queries.",
  },
  {
    topic: "RAG",
    q: "What makes a RAG answer trustworthy?",
    a: "Grounding instructions: tell Claude to answer only from the retrieved context, to admit when the answer isn't there, and to cite its sources. Pair that with native citations and evaluate retrieval and generation separately so you know which half to fix when answers are wrong.",
  },
  {
    topic: "Advanced",
    q: "How do you control how hard Claude reasons on modern models?",
    a: "Enable adaptive thinking (thinking:{type:'adaptive'}) and set an effort level — low, medium, high, xhigh, or max. Claude then decides how much to reason per request, scaled by effort. This replaced the deprecated fixed 'thinking budget'. Higher effort means more depth, cost, and latency.",
  },
  {
    topic: "Advanced",
    q: "What are server tools?",
    a: "Tools Anthropic hosts and executes — web search, web fetch, and code execution. You just declare them; results return inline with no execution loop on your side. Web search is essentially RAG over the open web; code execution runs Python in a sandbox for analysis and file processing.",
  },
  {
    topic: "Advanced",
    q: "How should your app handle a refusal?",
    a: "A refusal is a normal HTTP 200 response with stop_reason='refusal', not an error. Always branch on stop_reason before reading content (which may be empty), show a graceful fallback message, and don't retry the identical prompt expecting a different result.",
  },
  {
    topic: "Advanced",
    q: "What are the key responsible-use practices when building with Claude?",
    a: "Never put secrets (API keys, passwords) in prompts or memory; validate tool inputs since they're model output; gate irreversible actions behind human approval; be transparent that users are talking to an AI and where its knowledge comes from; and design for refusals as a normal outcome.",
  },
  {
    topic: "The AI Engineer's Stack",
    q: "How is an AI engineer different from an ML engineer?",
    a: "ML engineers train and serve models: data pipelines, training runs, model serving. AI engineers build products on foundation models they don't train: prompting, RAG, tool use/agents, and evals. The AI engineer's unit of progress is the eval suite around the system, not the model itself.",
  },
  {
    topic: "The AI Engineer's Stack",
    q: "Walk me through the modern LLM app stack.",
    a: "Bottom-up: models & inference (Claude API, or open weights on vLLM), an optional gateway/router for multi-provider fallbacks and budgets (LiteLLM), orchestration (plain SDK code or an agent framework), data & retrieval (embeddings + a vector store like pgvector), observability & evals (Langfuse, Braintrust), and guardrails. Every layer is optional except the model — add each when its specific pain appears; observability usually earns its place first.",
  },
  {
    topic: "The AI Engineer's Stack",
    q: "When would you choose prompting vs RAG vs fine-tuning?",
    a: "Route on behavior vs knowledge. Wrong behavior (format, tone, style) → prompt harder first; fine-tune only when thousands of examples exist and prompting can't hold the behavior, or prompt length costs too much at volume. Missing knowledge (your docs, fresh or per-customer data) → RAG, because knowledge changes and needs citations. Never fine-tune to teach facts — the model will hallucinate fluently in your domain. In production the levers stack: a fine-tuned small model for a high-volume step, RAG for knowledge, prompting everywhere.",
  },
  {
    topic: "The AI Engineer's Stack",
    q: "When do open-weight models beat a frontier API?",
    a: "Three cases: data control (the model must run in your VPC or air-gapped), customization (you need LoRA-level control over behavior), and narrow-task economics (a small or distilled open model passes your evals on one high-volume task and undercuts API pricing even after honest GPU and ops accounting). Frontier APIs win on raw capability and zero ops burden. The dominant pattern is hybrid: frontier for hard low-volume work, a small open model behind a gateway for proven high-volume tasks.",
  },
  {
    topic: "The AI Engineer's Stack",
    q: "How do you keep quality high when coding agents write much of the code?",
    a: "Treat the agent like a tireless junior with superhuman breadth: give it written project context (a CLAUDE.md-style brief), fast trustworthy tests as its feedback loop, and small scoped tasks. Work spec-first — precise inputs/outputs/edge-cases/non-goals — and review every diff against the spec with normal PR rigor, extra for security-sensitive code. You own what you ship regardless of who typed it.",
  },
  {
    topic: "Frontier AI",
    q: "What is test-time compute, and when would you pay for it?",
    a: "Extra computation spent at inference time to get a better answer: longer chain-of-thought (Claude's effort/adaptive thinking), best-of-N parallel sampling with a judge, or search over reasoning branches. It's the third scaling axis after pretraining and post-training. Pay for it on hard reasoning — math, debugging, planning, multi-constraint problems — and skip it on extraction, classification, and chat, where it burns latency and tokens for the same answer. Evals tell you which bucket a task is in.",
  },
  {
    topic: "Frontier AI",
    q: "What is a reasoning model?",
    a: "A model trained — typically with reinforcement learning on problems with verifiable answers like math and code — to produce a long internal chain of thought before answering. The thinking behavior lives in the weights, not the prompt, and reaches quality that 'think step by step' prompting alone doesn't. On Claude this surfaces as extended/adaptive thinking controlled by the effort setting.",
  },
  {
    topic: "Frontier AI",
    q: "How does agentic RAG differ from classic RAG, and what new failure modes does it add?",
    a: "Classic RAG retrieves once with the user's raw phrasing, then generates. Agentic RAG makes search a tool inside the agentic loop: the model decomposes the question, writes its own queries, judges the returned chunks, and re-searches until grounded — which fixes multi-hop and vague-query failures at 3–10× the cost. New failure modes: endless search loops, budget burn on repeated queries, and answering confidently after retrieval failed. Guard with iteration caps, per-search logging, and evals on retrieval behavior, not just final answers.",
  },
  {
    topic: "Frontier AI",
    q: "When does a small language model beat a frontier model?",
    a: "On narrow, high-volume tasks — classification, routing, extraction, summarization — where your eval suite says the small model passes. Then the frontier model's extra capability is pure waste at that call site. If the SLM almost passes, distill: have the frontier model generate gold examples, LoRA-tune the small model, re-run evals. Production systems typically cascade — small model first, escalate to frontier on low confidence — and on-device SLMs add privacy, instant latency, and offline operation.",
  },
  {
    topic: "Frontier AI",
    q: "How do you evaluate whether a new AI buzzword matters for your team?",
    a: "Three questions. What's the mechanism — can it be explained in terms of training, inference, or systems around models? If not, it's marketing. Who benefits from me believing the term — vendors coin words to reposition products. Is there an eval — real capabilities ship with measurable benchmarks; hype ships with demos. Most buzzwords decode to recombinations of mechanisms you already run: retrieval, tool loops, evals, token economics.",
  },
];
