import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  {
    topic: "Foundations",
    q: "What is an AI agent?",
    a: "An LLM that uses tools in a loop to accomplish a goal. The defining feature is that the model — not your code — decides the control flow at runtime: which tool to call, with what arguments, and when to stop. Everything else (planning, memory, multi-agent systems) is an elaboration of that.",
  },
  {
    topic: "Foundations",
    q: "What's the difference between an agent and a workflow?",
    a: "A workflow orchestrates LLMs and tools through predefined code paths — you control the steps. An agent lets the model direct its own process and tool use dynamically. If you can draw the flowchart up front, build a workflow; reserve agents for open-ended tasks whose path is discovered at runtime. In practice it's a spectrum, and good systems mix both.",
  },
  {
    topic: "Foundations",
    q: "When should you NOT build an agent?",
    a: "When the task follows a fixed, scriptable path, when per-call value is tiny and volume is huge (agents are expensive), when the model isn't actually good at the task, or when errors are irreversible and unguarded. Climb the autonomy ladder — single prompt → workflow → agent → multi-agent — only as far as the task demands.",
  },
  {
    topic: "Foundations",
    q: "Walk me through the agent loop.",
    a: "Perceive the current state → reason about what to do → act by calling a tool → observe the result, which becomes the new state — then repeat. The feedback (observe) step is what lets agents self-correct. It ends when the model returns a final answer with no tool call, backed by external stop conditions (max iterations, budget caps) so a confused agent can't loop forever.",
  },
  {
    topic: "Foundations",
    q: "What is 'context engineering' and why does it matter?",
    a: "It's the practice of curating what goes into the context window each turn: the right instructions, tools, and facts in, and stale data out. Because an agent's behavior is dominated by what's in its context on each turn, context engineering matters more than clever prompt phrasing — and most agent and multi-agent failures trace back to it.",
  },
  {
    topic: "Reasoning",
    q: "What is ReAct and why interleave reasoning with acting?",
    a: "ReAct = Reason + Act: the agent alternates Thought (reason), Action (call a tool), and Observation (read the result) in a loop. Interleaving means reasoning picks the right action and real observations ground the reasoning, reducing hallucination — and the trace is naturally inspectable. It maps directly onto modern tool-calling: the model's thinking + tool_use is Thought+Action; your tool_result is the Observation.",
  },
  {
    topic: "Reasoning",
    q: "When would you use plan-and-execute over plain ReAct?",
    a: "For long, complex tasks where step-by-step ReAct drifts, repeats work, or loses the thread. Plan-and-execute separates producing a plan (decompose the goal) from executing it, with replanning as reality intervenes. It reduces drift, enables parallelism, lets you plan with a strong model and execute with a cheaper one, and gives a transparent, editable plan. For short tasks, plain ReAct is simpler.",
  },
  {
    topic: "Reasoning",
    q: "What is the reflection pattern and when does it help?",
    a: "A generate → critique → revise loop where the agent (or a second agent) grades its own output and improves it. It works because evaluating is a different task from generating — models often spot flaws they couldn't avoid in one pass. Ground the critique in a rubric or external signals (tests, linters), use a separate reviewer role, and cap rounds since returns diminish and self-grading can be lenient.",
  },
  {
    topic: "Tools",
    q: "What makes a good tool for an agent?",
    a: "Right granularity (a meaningful unit of work, not too fine or too coarse), doc-quality names and descriptions (the model selects tools from these), predictable structured outputs, and actionable errors the agent can recover from. Keep the set small and distinct — past ~15–20 overlapping tools, selection accuracy drops. Promote risky actions to dedicated typed tools so the harness can gate and audit them.",
  },
  {
    topic: "Tools",
    q: "How do you give an agent memory if models are stateless?",
    a: "You engineer it. Short-term memory is the context window (managed via truncation, summarization/compaction, or offloading to a store). Long-term memory lives in external stores — episodic (events), semantic (facts), procedural (skills) — retrieved on demand. A memory system is really two policies: what you write (and when) and what you retrieve back into context (and how much).",
  },
  {
    topic: "Tools",
    q: "What is RAG and how does it work in an agent?",
    a: "Retrieval-Augmented Generation grounds the model in your data: ingest & chunk documents, embed & index them in a vector store, retrieve the nearest chunks to a query (often re-ranked), and inject them into the prompt to answer from real facts with citations. In an agent, retrieval is usually a tool the agent calls when it needs facts (agentic RAG), letting it issue multiple refined queries instead of one blind upfront fetch.",
  },
  {
    topic: "Tools",
    q: "RAG vs. fine-tuning — when do you use each?",
    a: "Use RAG to give a model knowledge/facts: it's cheaper, updates instantly when the data changes, supports citations, and respects access control. Use fine-tuning to change behavior, format, or style. Knowledge → retrieve; behavior → fine-tune. Most 'the model doesn't know our docs' problems are retrieval problems, not training problems.",
  },
  {
    topic: "Tools",
    q: "What is MCP and why does it matter?",
    a: "The Model Context Protocol is an open standard for connecting agents to tools, data resources, and prompts. A server wraps a service and exposes its capabilities; any MCP-aware client can use it. It turns N agents × M integrations into N+M — build a connector once, reuse it everywhere — and there's a growing ecosystem of ready-made servers. Connect only to servers you trust, since they can expose powerful tools and untrusted instructions.",
  },
  {
    topic: "Orchestration",
    q: "Why use multiple agents instead of one?",
    a: "For specialization (each agent has a tight prompt and only its tools), context isolation (a researcher's clutter doesn't pollute the writer's window — the deepest reason it helps), parallelism, and modularity. But it costs far more tokens (agents talk to each other — Anthropic's research system used ~15× a single chat), adds latency, and introduces coordination failure modes. Use it only when isolation or parallelism clearly pays for the overhead.",
  },
  {
    topic: "Orchestration",
    q: "Compare the main multi-agent topologies.",
    a: "Sequential (a pipeline of stages — most predictable), supervisor/orchestrator-workers (a lead decomposes and delegates to workers who report up — the controllable default), hierarchical (nested supervisors for scale), and network (peer-to-peer handoffs — most flexible, least controllable). Default to supervisor; escalate to hierarchical when one supervisor is overloaded; use network only when peer freedom is genuinely needed.",
  },
  {
    topic: "Orchestration",
    q: "What is a handoff, and what's the most common failure?",
    a: "A handoff transfers control (and context) from one agent to another better suited to the task, often implemented as a callable tool. The most common failure is lost context at the seam — the receiving agent doesn't get what the first one learned, so it re-asks the user or redoes work. The fix is to pass a deliberate, curated briefing (goal, relevant facts, state), not the raw transcript — and to cap handoffs to avoid ping-pong.",
  },
  {
    topic: "Orchestration",
    q: "Message passing vs. shared state for agent coordination?",
    a: "Message passing has agents send each other messages — readable like a chat log, but it scales poorly with many peers and risks context loss between messages. Shared state (a blackboard) has agents read/write a common store — decoupled, scalable, and centrally inspectable, at the cost of concurrency discipline (field ownership, append-only logs, versioning). Prefer shared state for larger/parallel systems (the LangGraph approach); messaging for small conversational teams.",
  },
  {
    topic: "CrewAI",
    q: "Explain CrewAI's core primitives.",
    a: "Agent (a role-player defined by role, goal, and backstory, with its own LLM and tools), Task (a unit of work with a description and expected_output, assigned to an agent and wired to others via context), and Crew (the team of agents and tasks run under a Process). The role/goal/backstory compile into the agent's system prompt, so specific roles matter, and expected_output is the contract that anchors each task.",
  },
  {
    topic: "CrewAI",
    q: "Sequential vs. hierarchical process in CrewAI?",
    a: "Sequential runs tasks in listed order, each receiving prior outputs — predictable, cheap, the default for known pipelines. Hierarchical adds a manager (manager_llm or manager_agent) that breaks down the goal, delegates tasks to the best-suited agents, and reviews their output — that's the supervisor pattern, batteries included. Start sequential; go hierarchical for dynamic delegation, and give the manager a strong model.",
  },
  {
    topic: "CrewAI",
    q: "What are CrewAI Flows and when do you use them over Crews?",
    a: "Crews are autonomous agent teams; Flows are event-driven, code-controlled orchestration (@start/@listen/@router plus persistent state). Use Flows when you need deterministic control — branching, retries, explicit state — and Crews where you want open-ended collaboration. The recommended production pattern is a Flow as the backbone that invokes autonomous Crews at the steps needing reasoning: structure outside, autonomy inside.",
  },
  {
    topic: "Frameworks",
    q: "When would you choose LangGraph?",
    a: "When you need fine-grained control over flow and state: it models the system as a graph of nodes and edges over a shared state, with conditional edges enabling branches and cycles (the agent loop). It adds durable execution/checkpointing, time-travel debugging, and built-in human-in-the-loop interrupts. It's lower-level than CrewAI — more boilerplate, more control — suited to complex, stateful production agents.",
  },
  {
    topic: "Frameworks",
    q: "How do you choose an agent framework?",
    a: "Match it to the control you need and the problem's natural shape: CrewAI for role-based teams built fast, LangGraph for stateful graphs and maximum control, AutoGen for conversation/code-exec and HITL dialogue, the OpenAI Agents SDK for lightweight agents+handoffs with low lock-in — or no framework for full control. Prototype the task with direct calls first to learn the loop, then adopt the framework that removes your boilerplate, and never lose visibility into real prompts and tokens.",
  },
  {
    topic: "Production",
    q: "How do you evaluate a non-deterministic, multi-step agent?",
    a: "Build a dataset, a runner, and graders, and evaluate at three levels: outcome (right final answer), trajectory (sensible path — right tools, no wasted steps), and component (each piece working in isolation). Grade with code-based checks (cheap, reliable), LLM-as-judge (flexible, rubric-driven, validated against humans), and human review for hard cases. Build the eval set from real production failures into a regression suite.",
  },
  {
    topic: "Production",
    q: "What is prompt injection and how do you defend against it?",
    a: "Malicious text posing as instructions — most dangerously hidden in content the agent reads (indirect injection) — that makes the agent misuse its tools or leak data. Risk spikes with the 'lethal trifecta': private-data access + untrusted content + external action. It's unsolved at the prompt layer, so defend architecturally: least privilege, trust boundaries (treat fetched content as untrusted data), sandboxing, output allowlists, and human approval on irreversible actions.",
  },
  {
    topic: "Production",
    q: "How do you keep agent cost and latency under control?",
    a: "Right-size and route models (small/fast for easy steps, frontier for hard reasoning), prune and compact context, use prompt caching for stable prefixes (~90% input savings), cap iterations and budgets, and use fewer agents/tools. For latency, parallelize independent calls and stream output. For reliability, add retries with backoff, fallbacks, timeouts, and checkpoints. Use your traces to find the actual hot spots before optimizing.",
  },
  {
    topic: "Production",
    q: "Why is observability especially important for agents, and what do you log?",
    a: "Because the model drives the control flow, a failed run is a mystery unless you recorded it. Capture the full rendered prompt (not the template — frameworks inject hidden text), every tool call with arguments/results/duration, each decision/branch, and per-step tokens/latency/cost. Model it as a trace of nested spans (OpenTelemetry-style). Traces double as the raw material for evals — and contain user data, so redact PII and secure the store.",
  },
  {
    topic: "Production",
    q: "When should a human be in the loop?",
    a: "For irreversible or high-stakes actions (sending money, deleting data, emailing customers), low-confidence decisions, and ambiguous requests — let reversible, low-stakes actions run autonomously. This 'graduated autonomy' gives most of the speed of agents while a human owns the consequences that matter. Implement it as an approval gate in the harness around the risky tool, and layer it with other guardrails for defense in depth.",
  },
];
