import type { Module } from "./types";

export const orchestration: Module = {
  id: "orchestration",
  title: "Multi-Agent Orchestration",
  blurb:
    "When one agent isn't enough: why and when to use several, the core topologies (supervisor, network, hierarchical), handoffs, shared state, and the pitfalls.",
  accent: "rose",
  lessons: [
    {
      slug: "why-multi-agent",
      title: "Why multi-agent systems",
      summary:
        "Splitting work across specialized agents can beat one do-everything agent — but only when the task truly justifies the coordination overhead.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "When one agent hits its limits" },
        {
          type: "p",
          text: "A single agent juggling research, coding, reviewing, and reporting carries a bloated system prompt, a confusing pile of tools, and a context window stuffed with unrelated history. **Multi-agent systems** split that load: several focused agents, each with its own role, tools, and context, coordinated toward a shared goal.",
        },
        { type: "h3", text: "What you gain" },
        {
          type: "list",
          items: [
            "**Specialization** — each agent has a tight prompt and only the tools it needs, so it performs its narrow job better.",
            "**Separate context windows** — a researcher's clutter doesn't pollute the writer's context; more effective total working memory.",
            "**Parallelism** — independent subtasks run concurrently, cutting wall-clock time.",
            "**Modularity** — swap, test, or upgrade one agent without rewriting the whole system.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "It's about context, not headcount",
          text: "The deepest reason multi-agent helps is context isolation: each subagent explores with its own clean window and returns only a distilled result. That's why a research task that overflows one agent's context can succeed when split across several.",
        },
        { type: "h3", text: "What it costs" },
        {
          type: "p",
          text: "Coordination isn't free. Multi-agent systems use far more tokens (agents talk to each other), add latency from round-trips, and introduce new failure modes: miscommunication, duplicated work, and lost context at the seams. Anthropic's multi-agent research system reportedly used ~15× the tokens of a single chat.",
        },
        {
          type: "compare",
          caption: "Single-agent vs. multi-agent",
          columns: ["Dimension", "Single agent", "Multi-agent"],
          rows: [
            { label: "Best for", cells: ["Focused tasks, shared context", "Separable subtasks, parallelism, breadth"] },
            { label: "Token cost", cells: ["Lower", "Much higher (inter-agent talk)"] },
            { label: "Complexity", cells: ["Lower", "Higher — coordination & failure modes"] },
            { label: "Context", cells: ["One window (can overflow)", "Many isolated windows"] },
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Don't reach for it first",
          text: "Multi-agent is the top of the autonomy ladder. Exhaust a better single-agent prompt, more tools, and decomposition-within-one-agent before splitting into many. Add agents only when isolation or parallelism clearly pays for the overhead.",
        },
      ],
      takeaways: [
        "Multi-agent systems split work across focused agents with their own roles, tools, and context.",
        "Benefits: specialization, isolated context windows, parallelism, and modular upgrade/testing.",
        "The deepest win is context isolation — subagents explore separately and return distilled results.",
        "Costs are real: many more tokens, added latency, and coordination failure modes — use only when justified.",
      ],
      flashcards: [
        { front: "What is the deepest reason multi-agent systems help?", back: "Context isolation: each subagent works in its own clean window and returns a distilled result, so tasks that overflow one context can succeed split across several." },
        { front: "Name two benefits and two costs of multi-agent systems.", back: "Benefits: specialization, isolated context, parallelism, modularity. Costs: much higher token use, added latency, and coordination/failure complexity." },
        { front: "Where does multi-agent sit on the autonomy ladder?", back: "At the top — try a better single agent, more tools, and in-agent decomposition first; split into many agents only when isolation/parallelism clearly pays off." },
      ],
      quiz: [
        {
          q: "What's the primary reason to split a task across multiple agents?",
          options: [
            "It always costs fewer tokens",
            "Context isolation and specialization — each agent works focused in its own window",
            "Models can't use tools otherwise",
            "It removes the need for a loop",
          ],
          answer: 1,
          explain: "Separate, focused contexts (and parallelism) are the main payoff; tokens actually go up, not down.",
        },
        {
          q: "A reported downside of Anthropic's multi-agent research system was…",
          options: ["It used far more tokens (~15× a single chat)", "It couldn't use tools", "It had no memory", "It was deterministic"],
          answer: 0,
          explain: "Inter-agent communication is token-hungry; multi-agent buys capability at a steep token cost.",
        },
      ],
    },

    {
      slug: "orchestration-patterns",
      title: "Orchestration topologies",
      summary:
        "How agents are wired together shapes everything. Learn the core patterns — supervisor, network, hierarchical, and sequential — and when each fits.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The shape of the team" },
        {
          type: "p",
          text: "Once you have several agents, you must decide how they're connected and who decides what. A handful of **topologies** cover most real systems. Picking the right one is the central design choice in multi-agent work.",
        },
        { type: "h3", text: "Supervisor (orchestrator-workers)" },
        {
          type: "p",
          text: "One **supervisor** (a.k.a. orchestrator or lead) receives the goal, breaks it into subtasks, and delegates each to a **worker** agent, then synthesizes their results. Workers don't talk to each other — they report up. This is the most common and most controllable pattern.",
        },
        { type: "diagram", name: "supervisor", caption: "A supervisor decomposes the goal, delegates to specialized workers, and synthesizes their results." },
        { type: "h3", text: "Network (peer-to-peer)" },
        {
          type: "p",
          text: "Agents communicate **many-to-many**, each able to hand off to any other. Flexible and good for open-ended collaboration, but harder to control and reason about — conversations can sprawl. Use when the interaction genuinely can't be hierarchically structured.",
        },
        { type: "diagram", name: "network", caption: "In a network, any agent can pass work to any other — flexible but harder to bound." },
        { type: "h3", text: "Hierarchical (supervisors of supervisors)" },
        {
          type: "p",
          text: "Scale the supervisor pattern by nesting it: a top supervisor manages mid-level supervisors, each managing their own workers. This 'org chart' tames very large systems by keeping each manager's span of control small.",
        },
        { type: "diagram", name: "hierarchical", caption: "Nested supervisors form an org chart, keeping each level's coordination manageable." },
        { type: "h3", text: "Sequential (pipeline)" },
        {
          type: "p",
          text: "Agents are arranged in a fixed line — output of one feeds the next (researcher → writer → editor). Simple and predictable; really a workflow with agentic stages. Great when the stages are known and ordered.",
        },
        {
          type: "compare",
          caption: "Choosing a topology",
          columns: ["Pattern", "Control", "Best for"],
          rows: [
            { label: "Sequential", cells: ["Highest", "Known, ordered stages (pipelines)"] },
            { label: "Supervisor", cells: ["High", "A goal that decomposes into delegable subtasks"] },
            { label: "Hierarchical", cells: ["Medium", "Large systems needing nested coordination"] },
            { label: "Network", cells: ["Lowest", "Open-ended peer collaboration"] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Default to supervisor",
          text: "For most multi-agent tasks, the supervisor pattern is the right starting point: controllable, easy to reason about, naturally parallel across workers, and a clean place to put guardrails and synthesis. Escalate to hierarchical only when one supervisor is overloaded; reach for network only when you truly need peer freedom.",
        },
      ],
      takeaways: [
        "Topology — how agents are wired and who decides — is the central multi-agent design choice.",
        "Supervisor: a lead delegates to workers and synthesizes; the controllable default.",
        "Network: many-to-many peer handoffs — flexible but hard to bound. Hierarchical: nested supervisors for scale.",
        "Sequential: a fixed pipeline of agentic stages — simplest and most predictable.",
      ],
      flashcards: [
        { front: "Describe the supervisor (orchestrator-workers) pattern.", back: "One supervisor decomposes the goal, delegates subtasks to worker agents (who report up, not to each other), and synthesizes the results." },
        { front: "When would you choose a network topology?", back: "For open-ended peer collaboration where any agent may hand off to any other and the interaction can't be neatly hierarchical — at the cost of control." },
        { front: "What is a hierarchical multi-agent system?", back: "Nested supervisors (supervisors of supervisors), forming an org chart that keeps each manager's span of control small for large systems." },
        { front: "Which topology should you usually start with, and why?", back: "Supervisor — controllable, easy to reason about, naturally parallel, and a clean place for guardrails and synthesis." },
      ],
      quiz: [
        {
          q: "In the supervisor pattern, how do worker agents communicate?",
          options: [
            "Directly with each other peer-to-peer",
            "They report results up to the supervisor, which coordinates and synthesizes",
            "They don't communicate at all",
            "Only through a database",
          ],
          answer: 1,
          explain: "Workers report up to the supervisor; they don't coordinate directly — that's what keeps it controllable.",
        },
        {
          q: "You have a fixed, ordered set of stages: research → write → edit. Best topology?",
          options: ["Network", "Sequential pipeline", "Hierarchical", "Random"],
          answer: 1,
          explain: "Known, ordered stages map cleanly onto a sequential pipeline — predictable and simple.",
        },
      ],
    },

    {
      slug: "handoffs",
      title: "Handoffs & delegation",
      summary:
        "A handoff transfers control (and context) from one agent to another. Done well it routes work to the right specialist; done poorly it loses information at the seam.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Passing the baton" },
        {
          type: "p",
          text: "A **handoff** is when one agent transfers the task to another better suited to it — a triage agent handing a billing question to the billing agent. Popularized by OpenAI's Swarm/Agents SDK, a handoff is elegantly implemented as *a tool the agent can call* whose effect is 'now you're agent B'.",
        },
        { type: "diagram", name: "handoff", caption: "A handoff is a tool call that transfers control — and the relevant context — to another agent." },
        { type: "h3", text: "Handoff vs. delegation" },
        {
          type: "compare",
          columns: ["Mechanism", "Control flow", "Analogy"],
          rows: [
            { label: "Handoff", cells: ["Transfers control fully to agent B; A steps out", "Transferring a phone call"] },
            { label: "Delegation (subagent)", cells: ["A calls B as a sub-task, gets a result, keeps control", "A manager assigning a task and awaiting the report"] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Handoff modeled as a tool (Agents-SDK style)",
          code: `triage = Agent(
    name="Triage",
    instructions="Route the user to the right specialist.",
    handoffs=[billing_agent, tech_agent],   # each becomes a callable handoff
)
# When triage 'calls' billing_agent, control transfers there with the history.`,
        },
        { type: "h3", text: "What must travel with the baton" },
        {
          type: "list",
          items: [
            "**The goal / task** — what the receiving agent is now responsible for.",
            "**Relevant context** — the facts gathered so far, not the entire raw transcript (curate it).",
            "**Constraints & state** — user identity, permissions, what's already been done.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The seam is where context dies",
          text: "Most handoff failures are lost-in-translation: agent B doesn't get what A learned, so it re-asks the user or redoes work. Pass a deliberate, summarized briefing — treat the handoff payload as a first-class design artifact.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Beware handoff ping-pong",
          text: "Agents can bounce a task back and forth ('not my department') indefinitely. Give clear ownership rules, allow a fallback/human escalation, and cap total handoffs.",
        },
      ],
      takeaways: [
        "A handoff transfers control to a better-suited agent, neatly implemented as a tool call.",
        "Handoff = full transfer (A steps out); delegation = A calls B as a subtask and keeps control.",
        "Pass a curated briefing — goal, relevant facts, constraints/state — not the whole raw transcript.",
        "Guard against lost context at the seam and against endless handoff ping-pong (caps + escalation).",
      ],
      flashcards: [
        { front: "How is a handoff typically implemented?", back: "As a tool the agent can call, whose effect is to transfer control (and context) to another agent." },
        { front: "Handoff vs. delegation?", back: "Handoff transfers control fully (A steps out); delegation has A call B as a subtask, get a result, and keep control." },
        { front: "What's the most common handoff failure and the fix?", back: "Lost context at the seam — agent B doesn't get what A learned. Fix: pass a deliberate, curated briefing (goal + relevant facts + state)." },
      ],
      quiz: [
        {
          q: "In the Agents-SDK style, a handoff is essentially…",
          options: ["A new model", "A tool call that transfers control to another agent", "A database write", "A system prompt change only"],
          answer: 1,
          explain: "Handoffs are modeled as callable tools; invoking one passes control to the target agent.",
        },
        {
          q: "What should travel with a handoff?",
          options: [
            "Nothing — start fresh",
            "A curated briefing: the goal, relevant facts, and constraints/state",
            "Only the raw full transcript, always",
            "Just the user's name",
          ],
          answer: 1,
          explain: "Curated context prevents the receiving agent from re-asking or redoing work; dumping the raw transcript is noisy.",
        },
      ],
    },

    {
      slug: "shared-state",
      title: "Communication & shared state",
      summary:
        "Agents coordinate either by messaging each other or by reading and writing a shared store. The choice shapes scalability, debuggability, and how context flows.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Two ways agents coordinate" },
        {
          type: "p",
          text: "For agents to work together they must share information. Two models dominate: **message passing** (agents send each other messages, like a conversation) and **shared state / blackboard** (agents read and write a common store). Most frameworks use one, the other, or a blend.",
        },
        { type: "diagram", name: "blackboard", caption: "Blackboard model: agents read from and write to shared state instead of messaging each peer directly." },
        { type: "h3", text: "Message passing" },
        {
          type: "p",
          text: "Agents communicate via explicit messages — the supervisor messages a worker, a worker replies. Natural and inspectable (it reads like a chat log), but the relevant context must be packed into each message, and many-to-many messaging scales poorly.",
        },
        { type: "h3", text: "Shared state (blackboard)" },
        {
          type: "p",
          text: "Agents coordinate through a common data structure — a 'blackboard' or shared scratchpad. One agent writes findings; others read them when relevant. This decouples agents (they needn't know about each other), scales better, and gives you one place to inspect the whole system's state.",
        },
        {
          type: "compare",
          caption: "Message passing vs. shared state",
          columns: ["Aspect", "Message passing", "Shared state"],
          rows: [
            { label: "Coupling", cells: ["Agents address each other directly", "Agents are decoupled via the store"] },
            { label: "Scalability", cells: ["Drops with many peers", "Scales — add agents that read/write"] },
            { label: "Inspectability", cells: ["A readable conversation log", "One central state to examine"] },
            { label: "Risk", cells: ["Context lost between messages", "Stale/conflicting writes, contention"] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A shared-state object passed through the system (LangGraph-style)",
          code: `class State(TypedDict):
    task: str
    research: list[str]      # researcher appends here
    draft: str               # writer reads research, writes draft
    review: str              # reviewer reads draft, writes notes
# Each agent is a node that reads the fields it needs and writes its output.`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Shared state scales; messaging stays readable",
          text: "For larger or parallel systems, a shared state object (the LangGraph approach) usually beats ad-hoc messaging: agents stay decoupled and you get one canonical place to observe and debug. For small, conversational teams, message passing is simpler and more transparent.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Shared state needs discipline",
          text: "When several agents write the same store, you get the classic concurrency headaches: stale reads, conflicting writes, and races. Define who owns which fields, prefer append-only logs, and version or timestamp updates.",
        },
      ],
      takeaways: [
        "Agents coordinate via message passing (talk to each other) or shared state/blackboard (read & write a common store).",
        "Message passing is readable but scales poorly and risks context loss between messages.",
        "Shared state decouples agents, scales better, and centralizes inspection — at the cost of concurrency discipline.",
        "Prefer shared state for larger/parallel systems; messaging for small conversational teams.",
      ],
      flashcards: [
        { front: "What are the two main ways multi-agent systems coordinate?", back: "Message passing (agents send each other messages) and shared state / blackboard (agents read and write a common store)." },
        { front: "Why does shared state scale better than message passing?", back: "Agents are decoupled — they read/write the store rather than addressing every peer — and there's one canonical place to inspect state." },
        { front: "What's the main risk of shared state, and how do you manage it?", back: "Concurrency issues (stale reads, conflicting writes). Manage with clear field ownership, append-only logs, and versioned/timestamped updates." },
      ],
      quiz: [
        {
          q: "What's a key advantage of a shared-state (blackboard) approach?",
          options: [
            "Agents must all know about each other",
            "Agents are decoupled and you get one central place to inspect/debug state",
            "It uses no memory",
            "It removes the need for any agent",
          ],
          answer: 1,
          explain: "Shared state decouples agents and centralizes the system's state for scaling and observability.",
        },
        {
          q: "A risk specific to shared state among many agents is…",
          options: ["It can't be logged", "Stale reads and conflicting concurrent writes", "Agents can't use tools", "It only works with one agent"],
          answer: 1,
          explain: "Concurrent writers create races and conflicts — manage with ownership rules and append-only/versioned updates.",
        },
      ],
    },

    {
      slug: "multi-agent-pitfalls",
      title: "Multi-agent pitfalls",
      summary:
        "Multi-agent systems fail in characteristic ways: lost context, runaway cost, duplicated work, and error cascades. Knowing the failure modes is how you avoid them.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The coordination tax comes due" },
        {
          type: "p",
          text: "Multi-agent systems are powerful but fragile. The same coordination that gives them reach also creates failure modes a single agent never has. Here are the big ones — and how to defuse each.",
        },
        { type: "h3", text: "The usual suspects" },
        {
          type: "list",
          items: [
            "**Context loss at seams** — information vanishes between handoffs/messages, causing re-asks and redone work. *Fix:* curate explicit briefings; use shared state for canonical facts.",
            "**Runaway cost & latency** — inter-agent chatter multiplies tokens and round-trips. *Fix:* fewer agents, tighter prompts, parallelize, cap depth, right-size models per role.",
            "**Duplicated or conflicting work** — two agents solve the same subtask, or contradict each other. *Fix:* clear ownership, a supervisor that dedupes, a single source of truth.",
            "**Error cascades** — one agent's mistake becomes another's trusted input, compounding. *Fix:* validation between stages, reflection/critique, and confidence signaling.",
            "**Coordination deadlock / ping-pong** — agents wait on each other or bounce work endlessly. *Fix:* ownership rules, handoff caps, timeouts, human/fallback escalation.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Most failures are context-engineering failures",
          text: "Across these pitfalls, the root cause is usually the wrong information in the wrong context at the wrong time. Designing what each agent knows, receives, and passes on is the real work of multi-agent engineering.",
        },
        { type: "h3", text: "Practices that keep systems healthy" },
        {
          type: "steps",
          items: [
            { title: "Start single", text: "Prove the task with one agent first; split only where isolation or parallelism clearly pays." },
            { title: "Give every agent an owner & exit", text: "Clear responsibility, and a defined way to escalate or finish — no orphaned tasks." },
            { title: "Make it observable", text: "Trace every agent, message, and tool call. You cannot debug what you can't see." },
            { title: "Bound everything", text: "Cap iterations, depth, handoffs, tokens, and time at the system level, not just per agent." },
            { title: "Validate at the seams", text: "Check outputs between stages so errors don't cascade downstream." },
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Complexity compounds",
          text: "Each added agent multiplies the interactions to reason about. If a simpler design (better single agent, a workflow) achieves the goal, it will almost always be more reliable and cheaper. Add agents reluctantly.",
        },
      ],
      takeaways: [
        "Characteristic failures: context loss at seams, runaway cost/latency, duplicated/conflicting work, error cascades, deadlock/ping-pong.",
        "Most root causes are context-engineering problems — the wrong info in the wrong context at the wrong time.",
        "Keep systems healthy: start single, give each agent an owner and exit, make it observable, bound everything, validate at seams.",
        "Complexity compounds with every agent — prefer the simplest design that meets the goal.",
      ],
      flashcards: [
        { front: "Name four common multi-agent failure modes.", back: "Context loss at seams, runaway cost/latency, duplicated/conflicting work, error cascades, and coordination deadlock/ping-pong (any four)." },
        { front: "What's the common root cause across multi-agent pitfalls?", back: "Context-engineering failures — the wrong information in the wrong context at the wrong time." },
        { front: "List practices that keep multi-agent systems healthy.", back: "Start single, give each agent an owner and exit, make it observable (trace everything), bound iterations/depth/tokens, and validate outputs at the seams." },
      ],
      quiz: [
        {
          q: "Two agents independently solve the same subtask and disagree. This is an example of…",
          options: ["Context isolation working", "Duplicated/conflicting work — needs clear ownership and a single source of truth", "Good parallelism", "A tool error"],
          answer: 1,
          explain: "Without clear ownership and a canonical source of truth, agents duplicate and contradict each other.",
        },
        {
          q: "Which practice most directly prevents error cascades?",
          options: [
            "Adding more agents",
            "Validating outputs between stages so a mistake isn't trusted downstream",
            "Removing all limits",
            "Using a bigger context window",
          ],
          answer: 1,
          explain: "Validation/critique at the seams stops one agent's error from becoming another's trusted input.",
        },
      ],
    },
  ],
};
