import type { Module } from "./types";

export const agents: Module = {
  id: "agents",
  title: "Agents & tool use",
  blurb:
    "Giving a model hands: tool calling, the agent loop and how to stop it, memory and state, multi-agent topologies, and choosing a framework without inheriting its problems.",
  accent: "amber",
  lessons: [
    {
      slug: "tool-calling",
      title: "Tool calling: giving a model hands",
      summary:
        "How function calling actually works, how to design tools a model uses correctly, and the validation and error handling that separate a demo from a system.",
      minutes: 12,
      blocks: [
        { type: "p", text: "A language model can only produce text. **Tool calling** (also called function calling) is the convention that turns some of that text into an action: you describe the functions available, the model emits a structured request to call one, *your code* executes it, and you hand the result back for the next turn." },
        { type: "callout", kind: "key", text: "**The model never executes anything.** It emits a request. Your code decides whether to honour it, validates the arguments, applies permissions, runs it, and returns the result. Every security control lives on your side of that boundary — this is the single most important sentence in the module." },
        { type: "diagram", name: "tool-call-loop", caption: "One round trip: the model requests, you validate and execute, the result goes back as context." },
        { type: "h2", text: "The mechanics" },
        { type: "steps", items: [
          { title: "You declare the tools", text: "Name, description, and a JSON Schema for the parameters — the same machinery as structured outputs." },
          { title: "The model responds with a tool_use block", text: "Instead of text, it emits the tool name and arguments, produced by constrained decoding so the arguments match your schema structurally." },
          { title: "You validate and execute", text: "Parse into your typed model, check permissions for *this user*, apply a timeout, and run it." },
          { title: "You return a tool_result", text: "Appended to the conversation, tagged with the call ID, and the model continues with the result in context." },
          { title: "Repeat until it answers", text: "The model may call several tools, in sequence or in parallel, before producing its final text." },
        ]},
        { type: "code", lang: "python", caption: "A tool definition and an execution boundary worth copying", code: `SEARCH_ORDERS = {
    "name": "search_orders",
    "description": (
        "Search the caller's own orders by date range and status. "
        "Use when the user asks about their order history or a specific order. "
        "Do NOT use for refunds or cancellations — those have their own tools."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "status": {"type": "string",
                       "enum": ["pending", "shipped", "delivered", "cancelled"]},
            "since":  {"type": "string", "format": "date",
                       "description": "ISO date, inclusive lower bound"},
            "limit":  {"type": "integer", "minimum": 1, "maximum": 50,
                       "default": 10},
        },
        "required": ["since"],
    },
}

def execute(call, user) -> str:
    handler = REGISTRY.get(call.name)
    if handler is None:
        return "error: unknown tool"                 # never raise into the loop
    try:
        args = handler.schema(**call.input)          # 1. validate shape
    except ValidationError as e:
        return f"error: invalid arguments — {e}"     # the model can retry
    if not authorised(user, handler, args):          # 2. authorise as the USER,
        return "error: not permitted"                #    never as the service
    try:
        return handler.run(args, user, timeout=10)   # 3. bounded execution
    except TimeoutError:
        return "error: timed out, try a narrower range"`},
        { type: "callout", kind: "warn", text: "**Authorise every tool call as the end user, not as the service.** A model that can call `search_orders` with any `user_id` will eventually be talked into calling it with somebody else's. Bind identity outside the model's reach — take it from the session, never from an argument the model can choose." },
        { type: "h2", text: "Designing tools a model uses well" },
        { type: "compare", caption: "The difference between 60% and 95% correct tool selection.", columns: ["Do", "Don't"], rows: [
          { label: "One clear purpose per tool", cells: ["A `do_everything` tool with a `mode` string"] },
          { label: "Say when NOT to use it in the description", cells: ["Describe only the happy path"] },
          { label: "Enums and constrained types for parameters", cells: ["Free-text parameters the model must guess the format of"] },
          { label: "Return compact, structured results", cells: ["Return 50KB of raw JSON that eats the context window"] },
          { label: "Return actionable errors the model can respond to", cells: ["Raise exceptions, or return an opaque stack trace"] },
          { label: "5–15 tools, attached by request class", cells: ["40 tools on every call"] },
        ]},
        { type: "callout", kind: "tip", text: "Write tool descriptions the way you'd brief a competent new colleague who can't ask follow-up questions. One sentence on what it does, one on when to reach for it, one on when *not* to. Vague descriptions are the number-one cause of wrong tool selection — and it's much cheaper to fix a description than to fine-tune." },
        { type: "h2", text: "Errors are messages, not exceptions" },
        { type: "p", text: "When a tool fails, returning a clear error *as the tool result* lets the model recover — narrow the date range, fix the argument, try a different tool. Raising an exception into your loop turns a recoverable situation into a failed request. Distinguish two cases: errors the model can act on (bad arguments, no results, rate-limited) go back as text; errors it cannot (auth misconfiguration, database down) should abort the run and surface to you." },
        { type: "h2", text: "Parallel tool calls" },
        { type: "p", text: "Models can request several independent tools in one turn — three lookups instead of three sequential round trips. Execute them concurrently and return all results together; it's often the single biggest latency win in an agent. But **only for genuinely independent calls**: if the second depends on the first's result, the model must see the first before choosing, and forcing parallelism there produces confident nonsense." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Tool / function calling** = the model emitting a structured request for your code to execute a named function. **`tool_use` / `tool_result`** = the message blocks carrying the request and its result. **Tool schema** = the JSON Schema describing a tool's parameters. **`tool_choice`** = forcing, forbidding, or leaving free the decision to call a tool. **Parallel tool use** = several independent calls requested in one turn. **Tool registry** = your server-side map from tool name to handler. **Least privilege** = giving a tool only the access its job requires." },
        { type: "h2", text: "How tool use fails in production" },
        { type: "compare", caption: "The recurring bugs.", columns: ["Failure", "Cause", "Fix"], rows: [
          { label: "Calls the wrong tool", cells: ["Overlapping or vague descriptions", "Sharpen descriptions; merge near-duplicates"] },
          { label: "Invents parameter values", cells: ["Missing required context, or an under-specified schema", "Enums, formats, descriptions with examples"] },
          { label: "Loops calling the same tool", cells: ["The result doesn't answer the question and nothing detects it", "Deduplicate calls; cap steps; return explicit 'no results'"] },
          { label: "Ignores the tool result", cells: ["Result buried in a huge context, or hard to parse", "Return compact structured results; keep the window tight"] },
          { label: "Doesn't call a tool when it should", cells: ["The description doesn't match how users phrase things", "Add trigger phrasing to the description; consider forcing the call for that request class"] },
        ]},
      ],
      takeaways: [
        "Tool calling is a request-response convention: the model asks, your code validates, authorises, and executes.",
        "Every security control lives on your side — authorise as the end user, never from a model-supplied identifier.",
        "Tool design drives selection accuracy: one purpose per tool, say when not to use it, constrain parameters, return compact results.",
        "Return recoverable errors as tool results so the model can retry; abort only on errors it can't act on.",
        "Parallel tool calls are a big latency win for genuinely independent calls, and a correctness bug for dependent ones.",
      ],
      flashcards: [
        { front: "Does the model execute tools?", back: "No. It emits a structured request. Your code validates arguments, applies the user's permissions, executes with a timeout, and returns the result — all authorisation is on your side of that boundary." },
        { front: "How should a tool report a bad argument?", back: "As a tool_result containing a clear error message, so the model can correct and retry. Raising an exception into the loop turns a recoverable case into a failed request." },
        { front: "Why is 'when NOT to use this tool' in the description?", back: "Wrong-tool selection is usually caused by overlapping descriptions. Negative guidance disambiguates neighbours far more effectively than more detail about the happy path." },
        { front: "When are parallel tool calls wrong?", back: "When one call's arguments depend on another's result. The model must see the first result before it can choose correctly; forcing parallelism produces confident nonsense." },
      ],
      quiz: [
        { q: "Your agent calls `get_user_orders(user_id=...)` and a user asks it to fetch someone else's orders. What prevents this?", options: ["A system prompt rule", "Binding the user identity server-side from the session, outside the model's control", "Lowering temperature", "Removing the tool"], answer: 1, explain: "Any argument the model can set, it can be persuaded to set differently. Identity must come from the authenticated session and never from model output." },
        { q: "The model keeps picking `search_docs` when it should use `query_metrics`. Cheapest fix?", options: ["Fine-tune the model", "Rewrite both tool descriptions, including when not to use each", "Add more tools", "Increase max_tokens"], answer: 1, explain: "Selection errors are usually description problems. Sharpening boundaries — especially explicit negative guidance — is minutes of work versus days of fine-tuning." },
        { q: "A tool returns 60KB of JSON and the agent starts ignoring results. Best fix?", options: ["Increase the context window", "Return a compact summary plus a reference to fetch detail", "Call the tool twice", "Lower the temperature"], answer: 1, explain: "Large payloads crowd out everything else and dilute attention. Return the fields that matter plus an ID or path the model can use to request more if needed." },
      ],
    },
    {
      slug: "the-agent-loop",
      title: "The agent loop — and how to stop it",
      summary:
        "What separates an agent from a workflow, the loop patterns worth knowing, and the termination conditions that keep it from becoming an incident.",
      minutes: 12,
      blocks: [
        { type: "p", text: "An **agent** is a model in a loop with tools, deciding its own next step until it judges the task done. A **workflow** is code that calls a model at fixed points you defined. The distinction matters because it determines who controls the sequence — and therefore what can go wrong." },
        { type: "compare", caption: "The choice you should make deliberately.", columns: ["", "Workflow", "Agent"], rows: [
          { label: "Control flow", cells: ["You wrote it", "The model decides"] },
          { label: "Predictability", cells: ["High — same path every time", "Low — different path per request"] },
          { label: "Cost & latency", cells: ["Bounded and knowable", "Variable; needs hard caps"] },
          { label: "Debugging", cells: ["Ordinary code debugging", "Trace reading and replay"] },
          { label: "Handles novelty", cells: ["Only what you anticipated", "Can adapt to unforeseen situations"] },
          { label: "Use when", cells: ["The steps are known", "The steps depend on what's discovered"] },
        ]},
        { type: "callout", kind: "key", text: "**Most problems marketed as agents are workflows.** If you can draw the steps on a whiteboard and they don't change per request, write the workflow: it's cheaper, faster, testable, and it doesn't need a step limit. Reach for an agent when the *sequence itself* depends on what earlier steps discover." },
        { type: "diagram", name: "agent-loop", caption: "The loop, with the four exits that keep it finite. Every one of them is required." },
        { type: "h2", text: "The loop patterns" },
        { type: "compare", caption: "Four shapes you'll meet.", columns: ["Pattern", "How it works", "Good for"], rows: [
          { label: "ReAct (reason + act)", cells: ["Think → call a tool → observe → repeat", "General-purpose; the default"] },
          { label: "Plan-and-execute", cells: ["Produce a plan up front, then execute steps, replanning on failure", "Long tasks where a wrong early step is expensive"] },
          { label: "Reflection", cells: ["Generate, critique the output, revise", "Writing, code, anything with quality criteria"] },
          { label: "Tree / search", cells: ["Explore several branches and pick the best", "Rare in products — expensive, mostly for research"] },
        ]},
        { type: "h2", text: "Termination: the part demos skip" },
        { type: "p", text: "An agent that can't stop is not an agent, it's an outage. Every production loop needs **all four** of these, not whichever one you remembered." },
        { type: "list", ordered: true, items: [
          "**Step limit** — a hard maximum number of iterations (10–25 is typical). On hit: stop and return what you have, clearly labelled as incomplete.",
          "**Token / cost budget** — track cumulative tokens per run and abort past the ceiling. This is what stops a $40 request.",
          "**Wall-clock timeout** — users and upstream callers won't wait forever, and neither should your infrastructure.",
          "**Progress detection** — if the last three steps repeat the same tool call with the same arguments, the agent is stuck. Break out; retrying identically won't help.",
        ]},
        { type: "code", lang: "python", caption: "A loop with all four exits and a trace", code: `def run_agent(task, tools, *, max_steps=20, max_tokens=120_000, deadline_s=90):
    messages = [{"role": "user", "content": task}]
    used_tokens, started, seen = 0, time.monotonic(), set()

    for step in range(max_steps):
        if used_tokens > max_tokens:
            return Result.incomplete("token budget exceeded", messages)
        if time.monotonic() - started > deadline_s:
            return Result.incomplete("timed out", messages)

        resp = model(messages, tools=tools)
        used_tokens += resp.usage.total
        trace.log(step=step, stop=resp.stop_reason, tokens=resp.usage.total)

        if resp.stop_reason != "tool_use":
            return Result.done(resp.text, messages)          # normal exit

        results = []
        for call in resp.tool_calls:
            key = (call.name, canonical(call.input))
            if key in seen:                                   # no progress
                results.append(tool_result(call, "error: identical call already "
                                                 "made; try a different approach"))
                continue
            seen.add(key)
            results.append(tool_result(call, execute(call)))

        messages += [resp.as_message(), {"role": "user", "content": results}]

    return Result.incomplete("step limit reached", messages)`},
        { type: "callout", kind: "warn", text: "**Partial results must be labelled.** An agent that hits its step limit and returns its last draft as if it were finished is worse than one that fails loudly — downstream systems and users treat it as complete. Return a status field, and make the UI show it." },
        { type: "h2", text: "Context growth is the hidden cost" },
        { type: "p", text: "Every step re-sends the entire conversation, so an agent's cost grows roughly **quadratically** with steps: step 15 pays for everything that happened in steps 1–14. This is why agent runs get surprisingly expensive and why compaction is not optional." },
        { type: "list", items: [
          "**Store large tool results externally** and pass an ID or path. \"Wrote 4,200 rows to `/tmp/run-7/orders.csv`\" costs 12 tokens; the rows cost thousands.",
          "**Compact between phases** — summarise completed sub-tasks into a few lines of conclusions and drop the intermediate chatter.",
          "**Keep a structured scratchpad** of decisions and open questions, so compaction never loses a hard constraint.",
          "**Prune failed branches** — a tool call that errored and was retried successfully doesn't need to stay in context.",
        ]},
        { type: "h2", text: "Human in the loop" },
        { type: "p", text: "Some actions should never happen on a model's judgment alone. Design the pause deliberately rather than bolting on a confirmation dialog later." },
        { type: "compare", caption: "Where to put the human.", columns: ["Pattern", "When"], rows: [
          { label: "Approve before acting", cells: ["Irreversible or outward-facing actions — payments, emails, deletions, deploys"] },
          { label: "Review after acting", cells: ["Reversible actions where speed matters — drafts, tickets, internal edits"] },
          { label: "Escalate on uncertainty", cells: ["Low confidence, failed validation, or an out-of-policy request"] },
          { label: "Sample for audit", cells: ["High volume, low individual risk — review 1% and track the error rate"] },
        ]},
        { type: "callout", kind: "tip", text: "The cheapest safety control in agent design: **split tools into read and write, and require approval only for writes.** Reads can loop freely; writes pause. This alone converts most catastrophic-failure scenarios into merely slow ones." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Agent** = a model looping with tools, choosing its own next step. **Workflow** = code with model calls at fixed points. **ReAct** = interleaving reasoning and acting. **Step / turn limit** = the maximum iterations before forced termination. **Scratchpad** = the agent's working notes carried between steps. **Human in the loop (HITL)** = a required human decision inside the run. **Trajectory** = the full sequence of steps an agent took, which is what you evaluate and debug." },
        { type: "h2", text: "Evaluating an agent" },
        { type: "p", text: "Final-answer accuracy is not enough — two runs can both end correct with wildly different cost, and a run can reach the right answer through a dangerous path. Evaluate the **trajectory**: did it use the right tools, in a sensible order, without redundant calls, within budget? Log every run's step count, tool sequence, token spend, and outcome, then look at the distribution rather than the average." },
      ],
      takeaways: [
        "An agent decides its own control flow; a workflow doesn't — and most problems marketed as agents are workflows.",
        "ReAct is the default loop; plan-and-execute and reflection suit long tasks and quality-critical output.",
        "Every production loop needs all four exits: step limit, token budget, wall-clock timeout, and no-progress detection.",
        "Context grows quadratically with steps — externalise large results, compact between phases, keep a structured scratchpad.",
        "Split tools into read and write, gate writes behind approval, and evaluate the whole trajectory, not just the final answer.",
      ],
      flashcards: [
        { front: "Agent vs workflow", back: "In a workflow you wrote the control flow; in an agent the model chooses each next step. Workflows are cheaper, predictable, and testable — use an agent only when the sequence depends on what's discovered." },
        { front: "Name the four termination conditions an agent loop needs", back: "Step limit, cumulative token/cost budget, wall-clock timeout, and no-progress detection (repeated identical tool calls). All four, not whichever you remembered." },
        { front: "Why does agent cost grow quadratically with steps?", back: "Each step re-sends the whole accumulated conversation, so step N pays for steps 1..N-1 again. Externalising tool results and compacting between phases is the fix." },
        { front: "What's the cheapest high-value agent safety control?", back: "Separate read tools from write tools and require human approval only for writes. Reads loop freely; irreversible actions pause." },
        { front: "What does it mean to evaluate an agent's trajectory?", back: "Scoring the path — tool choices, ordering, redundant calls, steps, tokens, cost — not just whether the final answer was right. Two correct runs can differ 10× in cost and risk." },
      ],
      quiz: [
        { q: "An agent hits its step limit mid-task. What should it return?", options: ["Its last draft, presented as the final answer", "A clearly-labelled incomplete result with what it accomplished", "An empty response", "Silently retry from the start"], answer: 1, explain: "Unlabelled partial results get consumed as complete by users and downstream systems. Return an explicit status so the caller can decide what to do." },
        { q: "Your invoice-processing pipeline has fixed steps: extract, validate, post to ERP, notify. Agent or workflow?", options: ["Agent — it's multi-step", "Workflow — the steps are known in advance", "Multi-agent system", "Agent with a large step limit"], answer: 1, explain: "Known steps mean you should write them. A workflow is cheaper, faster, deterministic, and testable — and needs no step limit or trajectory evaluation." },
        { q: "An agent calls the same search with the same arguments five times. What's missing?", options: ["A bigger model", "No-progress detection", "More tools", "A higher token budget"], answer: 1, explain: "Repeating an identical call means the loop isn't advancing. Detect duplicate calls and return a message telling the model to try a different approach — a larger budget just funds the loop." },
      ],
    },
    {
      slug: "agent-memory-and-state",
      title: "Memory & state",
      summary:
        "What an agent should remember within a run, across runs, and forever — and why 'memory' is four different systems wearing one name.",
      minutes: 10,
      blocks: [
        { type: "p", text: "\"Give the agent memory\" is one requirement in a product spec and four distinct systems in an implementation. Conflating them is why memory features are so often unreliable." },
        { type: "diagram", name: "agent-memory", caption: "Four memory systems, four lifetimes, four storage decisions." },
        { type: "compare", caption: "Separate them before you build them.", columns: ["Type", "Lifetime", "Where it lives", "Example"], rows: [
          { label: "Working memory", cells: ["One run", "The context window itself", "Current sub-goal, last tool result"] },
          { label: "Session memory", cells: ["One conversation", "Message history plus a summary", "What the user asked ten turns ago"] },
          { label: "Long-term memory", cells: ["Across sessions, indefinitely", "A database, retrieved as needed", "\"Prefers metric units\", \"works at Acme\""] },
          { label: "External state", cells: ["Owned by the system, not the agent", "Files, a database, a task tracker", "The draft document, the open ticket"] },
        ]},
        { type: "callout", kind: "key", text: "**The most under-used agent memory is the file system.** An agent writing intermediate work to files and reading it back later gets unlimited, inspectable, resumable memory that costs a handful of tokens per reference. Not everything an agent knows has to sit in the context window." },
        { type: "h2", text: "Working memory: the scratchpad" },
        { type: "p", text: "Within a run, keep an explicit structured scratchpad rather than relying on the conversation transcript. Because it survives compaction, it's where hard constraints belong." },
        { type: "code", lang: "python", caption: "A scratchpad that survives compaction", code: `class Scratchpad(BaseModel):
    goal: str
    constraints: list[str] = []      # never summarised away — hard requirements
    facts: dict[str, str] = {}       # ids, dates, amounts discovered so far
    done: list[str] = []             # completed sub-tasks, one line each
    open_questions: list[str] = []
    artifacts: dict[str, str] = {}   # name -> path, NOT the content

# Re-rendered into every step in ~200 tokens, while the raw transcript
# behind it gets compacted freely.`},
        { type: "h2", text: "Long-term memory: harder than it looks" },
        { type: "p", text: "Persistent memory across sessions is the feature users ask for and the one that most often misbehaves. Three questions decide whether yours works:" },
        { type: "steps", items: [
          { title: "What gets written?", text: "Not everything. Extract durable facts — stable preferences, roles, recurring context — and explicitly not transient details. Writing every turn produces a memory store full of noise that poisons retrieval." },
          { title: "When is it retrieved?", text: "Retrieve relevant memories per turn, like RAG. Injecting the whole memory store into every prompt is expensive and floods the window." },
          { title: "How is it corrected?", text: "Facts change and models mis-extract. Memories need updates, contradiction handling, expiry, and a user-visible way to view and delete them." },
        ]},
        { type: "callout", kind: "warn", text: "Memory is a **privacy surface and a compliance obligation**. Anything remembered is personal data: it needs consent, retention limits, per-user isolation, deletion on request, and exclusion of sensitive categories. A memory store is also an injection target — text a model wrote into memory is untrusted input the next time it's read back." },
        { type: "h2", text: "State machines for reliability" },
        { type: "p", text: "For multi-step processes with real-world side effects, an explicit state machine beats free-form looping. Each state defines its allowed tools and valid transitions, so the agent can't skip verification or double-charge a card." },
        { type: "compare", caption: "Constrain the agent where correctness matters.", columns: ["Approach", "Model decides", "You guarantee"], rows: [
          { label: "Free-form loop", cells: ["Everything", "Nothing but the limits"] },
          { label: "State machine with per-state tools", cells: ["What to do within a state", "Order, prerequisites, and that no state is skipped"] },
          { label: "Workflow with model steps", cells: ["Only the content of each step", "The entire sequence"] },
        ]},
        { type: "callout", kind: "tip", text: "Design for **resumability**. Persist state after every step so a crash, a timeout, or a rate limit doesn't lose twenty minutes of work — and so a human can inspect a stuck run and restart it from the last good step. Long-running agents without checkpoints are an operational trap." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Working memory** = what's in the context window right now. **Session memory** = one conversation's history plus its summary. **Long-term memory** = facts persisted across sessions and retrieved on demand. **External state** = artefacts the system owns (files, records) rather than the agent. **Scratchpad** = structured working notes re-rendered each step. **Checkpointing** = persisting state so a run can resume. **Memory poisoning** = wrong or adversarial content written into memory that corrupts later behaviour." },
      ],
      takeaways: [
        "'Memory' is four systems: working, session, long-term, and external state — with different lifetimes and stores.",
        "A structured scratchpad carries hard constraints safely through compaction; the raw transcript can be summarised freely.",
        "The file system is underused agent memory: unlimited, inspectable, resumable, and cheap to reference.",
        "Long-term memory needs deliberate write policy, per-turn retrieval, correction/expiry, and user-visible control — plus privacy and injection handling.",
        "State machines constrain agents where correctness matters; checkpoint after every step so runs are resumable.",
      ],
      flashcards: [
        { front: "Name the four kinds of agent memory", back: "Working (in-context, one run), session (one conversation), long-term (across sessions, retrieved), and external state (files/records the system owns)." },
        { front: "Why keep a structured scratchpad separate from the transcript?", back: "Because compaction summarises the transcript and can silently drop a hard constraint. The scratchpad is small, re-rendered each step, and never summarised away." },
        { front: "What's memory poisoning?", back: "Wrong or adversarially-planted content written into long-term memory that corrupts later behaviour. Memory read back is untrusted input and must be treated as such." },
        { front: "Why checkpoint agent state after every step?", back: "So a crash, timeout, or rate limit doesn't lose the whole run, and so a human can inspect a stuck run and resume it from the last good step." },
      ],
      quiz: [
        { q: "Your agent forgets a constraint the user gave 30 turns ago. Best fix?", options: ["A bigger context window", "Store hard constraints in a structured scratchpad that survives compaction", "Increase temperature", "Retrieve more documents"], answer: 1, explain: "Compaction dropped it. A small structured object re-rendered every step keeps constraints alive regardless of how the transcript is summarised." },
        { q: "What should NOT go into long-term memory?", options: ["Stable user preferences", "Transient details of one task", "The user's role", "Recurring project context"], answer: 1, explain: "Writing everything fills the store with noise that degrades retrieval and expands the privacy surface. Extract durable facts only." },
        { q: "An agent must charge a card only after verifying stock and address. Best design?", options: ["A strong system prompt", "A state machine where the payment tool exists only in the verified state", "More reasoning tokens", "A larger step limit"], answer: 1, explain: "Prompts are guidance; state machines are guarantees. If the tool isn't available in earlier states, the sequence cannot be skipped." },
      ],
    },
    {
      slug: "multi-agent-systems",
      title: "Multi-agent systems",
      summary:
        "Supervisor and swarm topologies, when splitting into agents genuinely helps, and the coordination costs that make most multi-agent designs worse than one good agent.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Once one agent works, the obvious next idea is several: a researcher, a writer, a critic. Sometimes that's right. Often it multiplies cost, latency, and failure modes while the single-agent version was one better prompt away from working." },
        { type: "diagram", name: "multi-agent-topologies", caption: "Four topologies. Supervisor is the one that works reliably in production." },
        { type: "compare", caption: "The topologies and how they behave.", columns: ["Topology", "Shape", "Reality"], rows: [
          { label: "Single agent", cells: ["One loop, many tools", "The right answer far more often than people expect"] },
          { label: "Supervisor / orchestrator", cells: ["A coordinator delegating to specialised sub-agents", "The workhorse — clear control, clear ownership"] },
          { label: "Sequential pipeline", cells: ["Agent A's output feeds agent B", "Really a workflow; write it as one"] },
          { label: "Swarm / peer-to-peer", cells: ["Agents message each other freely", "Rarely converges, very hard to debug — avoid in production"] },
        ]},
        { type: "callout", kind: "key", text: "**Sub-agents are for context isolation, not for job titles.** The real reason to split is that a sub-task needs its own large context — searching 50 documents, reading a long codebase — and you don't want that flooding the main agent's window. \"Researcher / writer / editor\" personas alone rarely improve anything a single well-prompted agent couldn't do." },
        { type: "h2", text: "When splitting genuinely helps" },
        { type: "list", items: [
          "**Context isolation** — a sub-agent explores widely and returns a 300-token summary instead of 40,000 tokens of intermediate reading.",
          "**Genuine parallelism** — four independent research threads run concurrently, cutting wall-clock time roughly fourfold.",
          "**Different tool sets or permissions** — the agent that can write to production should not be the same one browsing untrusted web pages. This is a security boundary, and a good one.",
          "**Different models per role** — a cheap model for bulk extraction, a strong one for synthesis, chosen per sub-task.",
          "**Independent evaluation** — smaller scoped agents are much easier to test than one giant one.",
        ]},
        { type: "h2", text: "What it costs" },
        { type: "compare", caption: "The coordination tax nobody budgets for.", columns: ["Cost", "Detail"], rows: [
          { label: "Token multiplication", cells: ["Each sub-agent re-establishes its own context; 3–15× a single agent's spend is normal"] },
          { label: "Information loss", cells: ["Everything passing between agents goes through a summary, and summaries drop details"] },
          { label: "Error compounding", cells: ["90% per agent across four agents is 66% end to end"] },
          { label: "Latency", cells: ["Sequential hand-offs add up; only genuine parallelism recovers it"] },
          { label: "Debuggability", cells: ["A failure could be in any agent or any hand-off — tracing is mandatory, not optional"] },
        ]},
        { type: "callout", kind: "warn", text: "**Multi-agent systems are a poor fit for tasks needing shared, evolving state** — several agents editing one document or one plan will conflict, duplicate, and overwrite. They work well when sub-tasks are genuinely independent and results merge cleanly, and badly otherwise." },
        { type: "h2", text: "Designing a supervisor properly" },
        { type: "steps", items: [
          { title: "Give each sub-agent one crisp, verifiable job", text: "\"Find every mention of indemnity clauses and return quotes with document IDs\" — not \"be the legal expert\"." },
          { title: "Define the contract between them", text: "A typed structure in, a typed structure out. Free-text hand-offs are where multi-agent systems rot." },
          { title: "Pass down only what's needed", text: "The sub-agent gets the task, not the supervisor's full history — that's the entire point of the split." },
          { title: "Require citations across the boundary", text: "Otherwise the supervisor cannot distinguish a well-supported claim from a confident one." },
          { title: "Budget each sub-agent separately", text: "Own step limit, own token cap, own timeout — plus a global cap for the whole run." },
          { title: "Handle sub-agent failure explicitly", text: "Retry once, then continue with partial results clearly marked, or abort. Never let a silent failure become a confident final answer." },
        ]},
        { type: "callout", kind: "tip", text: "Before building a multi-agent system, spend a day trying to make one agent work: sharper tool descriptions, better context assembly, a state machine for ordering. Teams that skip this step frequently ship a five-agent system that is slower, pricier, and less accurate than the single agent they never finished tuning." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Supervisor / orchestrator** = the agent that decomposes work and delegates to sub-agents. **Sub-agent** = a scoped agent with its own context, tools, and budget. **Hand-off** = passing control and information between agents. **Swarm** = peer-to-peer agents communicating without a coordinator. **Context isolation** = keeping a sub-task's large context out of the parent's window. **Fan-out / fan-in** = dispatching parallel sub-tasks and merging their results." },
      ],
      takeaways: [
        "Supervisor-with-sub-agents is the topology that works; swarms rarely converge and are painful to debug.",
        "Split for context isolation, parallelism, differing permissions, or per-role models — not for job-title personas.",
        "The coordination tax is real: 3–15× tokens, lossy hand-offs, compounding error rates, and much harder debugging.",
        "Multi-agent designs suit independent sub-tasks with clean merges, and fail on shared evolving state.",
        "Typed contracts, scoped context, citations across boundaries, per-agent budgets, and explicit failure handling make supervisors work.",
      ],
      flashcards: [
        { front: "What's the strongest reason to use sub-agents?", back: "Context isolation — a sub-agent can read 40,000 tokens and return a 300-token answer, keeping the parent's window clean. Personas alone aren't a reason." },
        { front: "Why do multi-agent systems fail on shared state?", back: "Several agents editing one document or plan conflict, duplicate, and overwrite each other. They work when sub-tasks are independent and results merge cleanly." },
        { front: "What does 90% per-agent reliability give you across four agents?", back: "About 66% end to end. Error rates compound, which is why each hand-off needs typed contracts and explicit failure handling." },
        { front: "Why is a differing tool set a good reason to split agents?", back: "It's a security boundary: the agent browsing untrusted web content shouldn't be the one holding production write access. Separation limits what a compromised context can reach." },
      ],
      quiz: [
        { q: "Your supervisor system costs 8× a single agent and is slightly less accurate. Most likely cause?", options: ["The model is too small", "Sub-agents that don't isolate context or run in parallel — you're paying the coordination tax with no benefit", "Not enough sub-agents", "Temperature too low"], answer: 1, explain: "Splitting only pays when it isolates large contexts, parallelises genuinely independent work, or separates permissions. Role-playing personas add cost and lossy hand-offs for nothing." },
        { q: "Which task best suits a supervisor with parallel sub-agents?", options: ["Drafting one document collaboratively", "Researching 6 independent vendors and producing a comparison", "A fixed 4-step invoice pipeline", "Answering an FAQ"], answer: 1, explain: "Six independent research threads parallelise cleanly and merge into a comparison — the ideal fan-out/fan-in shape. Shared drafting conflicts; fixed pipelines are workflows." },
        { q: "What form should hand-offs between agents take?", options: ["Free-text summaries", "Typed structures with citations", "The full conversation history", "Shared mutable global state"], answer: 1, explain: "Typed contracts make hand-offs testable and failures visible; citations let the supervisor judge support. Free text is where multi-agent systems rot." },
      ],
    },
    {
      slug: "agent-frameworks",
      title: "Frameworks: what to adopt, what to own",
      summary:
        "LangGraph, the Claude Agent SDK, CrewAI, AutoGen and friends — what they genuinely solve, what they hide from you, and where to draw the line.",
      minutes: 10,
      blocks: [
        { type: "p", text: "The agent framework landscape turns over roughly every six months. Rather than memorising APIs that will change, learn what a framework actually provides — then decide, per capability, whether you want it." },
        { type: "h2", text: "What frameworks genuinely solve" },
        { type: "compare", caption: "Worth taking vs worth owning.", columns: ["Capability", "Take from a framework?"], rows: [
          { label: "Streaming, retries, provider differences", cells: ["Yes — tedious, well-understood, no differentiation"] },
          { label: "State persistence & resumability", cells: ["Yes — checkpointing is real engineering you shouldn't redo"] },
          { label: "Tracing & observability", cells: ["Yes — instrumenting from scratch is a project of its own"] },
          { label: "Graph/state-machine control flow", cells: ["Often — a good graph abstraction pays for itself on complex flows"] },
          { label: "Your prompts", cells: ["No — the prompt is your product; never let it be hidden in a template"] },
          { label: "Your tools and their authorisation", cells: ["No — this is your security boundary"] },
          { label: "Your evaluation", cells: ["No — domain-specific quality is yours to define"] },
        ]},
        { type: "callout", kind: "key", text: "The line worth drawing: **take the plumbing, own the semantics.** Streaming, retries, checkpoints, and traces are plumbing. What the model is told, which tools exist, who may call them, and what \"good\" means are your product — keep them legible in your own code." },
        { type: "h2", text: "The landscape, by shape" },
        { type: "compare", caption: "Categories rather than a leaderboard, because the leaderboard changes.", columns: ["Shape", "Examples", "Best for"], rows: [
          { label: "Graph / state machine", cells: ["LangGraph", "Complex flows with branching, cycles, and checkpointed resumability"] },
          { label: "Provider agent SDK", cells: ["Claude Agent SDK, provider-native agent APIs", "Getting a solid loop, tool handling, and context management without assembling it"] },
          { label: "Role-based crews", cells: ["CrewAI", "Fast prototyping of multi-agent role structures"] },
          { label: "Conversational multi-agent", cells: ["AutoGen", "Research and experimentation with agent-to-agent protocols"] },
          { label: "Thin / no framework", cells: ["Your own loop, ~200 lines", "Well-scoped production agents where you want full control"] },
        ]},
        { type: "callout", kind: "warn", text: "The recurring failure: a team prototypes in a high-abstraction framework, hits a production issue — a hidden retry storm, unexplained token growth, an unsupported streaming case — and discovers the layer they need to change is the one the framework owns. Abstractions that hide the prompt and the loop are the expensive ones." },
        { type: "h2", text: "Choosing" },
        { type: "steps", items: [
          { title: "Write the loop yourself once", text: "Two hundred lines. You'll then understand exactly what any framework is doing for you, and you'll evaluate them on merit rather than marketing." },
          { title: "Adopt for a named problem", text: "\"We need checkpointed resumable runs\" or \"we need parallel sub-agents with tracing\" — not \"we should use a framework\"." },
          { title: "Check the escape hatches", text: "Can you see and override the exact prompt? Intercept every model call? Swap providers? Export traces to your own stack? If not, that's the bill you'll pay later." },
          { title: "Keep prompts and tools outside it", text: "Your prompt templates and tool handlers should be plain code the framework calls, not framework-managed artefacts." },
          { title: "Own your evals regardless", text: "Framework-agnostic eval harnesses mean you can migrate — and you eventually will." },
        ]},
        { type: "code", lang: "python", caption: "The agent loop, unadorned — write this once and frameworks stop being mysterious", code: `def agent(task: str, tools: list[Tool], *, max_steps: int = 20) -> str:
    messages = [{"role": "user", "content": task}]
    for _ in range(max_steps):
        resp = client.messages.create(
            model=MODEL, max_tokens=4096, system=SYSTEM,
            tools=[t.schema for t in tools], messages=messages,
        )
        if resp.stop_reason != "tool_use":
            return resp.content[0].text
        results = [
            {"type": "tool_result", "tool_use_id": b.id, "content": execute(b)}
            for b in resp.content if b.type == "tool_use"
        ]
        messages += [{"role": "assistant", "content": resp.content},
                     {"role": "user", "content": results}]
    return "step limit reached"

# Everything a framework adds — persistence, tracing, graphs, parallel
# sub-agents, retries, human-in-the-loop pauses — wraps this shape.`},
        { type: "callout", kind: "tip", text: "In an interview, being able to write this loop from memory and then explain what you'd add for production — limits, tracing, checkpointing, authorisation, compaction — is worth far more than naming five frameworks. It demonstrates you understand the mechanism, not just the ecosystem." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Orchestration framework** = a library managing the agent loop, state, and tool wiring. **Graph-based agent** = control flow modelled as nodes and edges with explicit state. **Checkpointing** = persisting state so a run can pause and resume. **Escape hatch** = the ability to inspect or override what an abstraction does. **Vendor lock-in** = coupling so tight that migration means a rewrite." },
      ],
      takeaways: [
        "Take plumbing from frameworks — streaming, retries, checkpoints, tracing; own the prompts, tools, authorisation, and evals.",
        "Frameworks fall into shapes: graph/state machine, provider SDK, role-based crews, conversational multi-agent, and none-at-all.",
        "Write the ~200-line loop yourself once so you can judge what any framework actually adds.",
        "Adopt for a named problem and check the escape hatches: prompt visibility, call interception, provider swap, trace export.",
        "Keep evals framework-agnostic so migration stays possible — you will migrate eventually.",
      ],
      flashcards: [
        { front: "What should you never delegate to an agent framework?", back: "Your prompts, your tool definitions and their authorisation, and your evaluation. Those are the product and the security boundary; the framework should supply plumbing." },
        { front: "What escape hatches should you check before adopting a framework?", back: "Can you see and override the exact prompt sent, intercept every model call, swap providers, and export traces to your own observability stack?" },
        { front: "Why write the bare agent loop yourself once?", back: "It's about 200 lines, and afterwards every framework's value proposition becomes concrete — you evaluate on what it actually adds rather than on its marketing." },
        { front: "Which framework shape suits complex branching flows with resumability?", back: "Graph/state-machine frameworks (e.g. LangGraph), where control flow is nodes and edges over explicit checkpointed state." },
      ],
      quiz: [
        { q: "A framework makes it hard to see the exact prompt being sent. Why does that matter?", options: ["It doesn't — the output is what counts", "The prompt is your product surface; you can't debug, version, or evaluate what you can't see", "It only matters for fine-tuning", "It affects streaming only"], answer: 1, explain: "Prompt visibility is required for debugging regressions, versioning changes, and running evals. An abstraction hiding it will cost you exactly when things go wrong." },
        { q: "You need runs that survive a crash and resume mid-task. What are you shopping for?", options: ["A role-based crew framework", "A graph framework with checkpointed state persistence", "A bigger context window", "A faster model"], answer: 1, explain: "Resumability comes from persisting state at each node, which is exactly what graph/state-machine frameworks provide — and it's real engineering not worth rebuilding." },
        { q: "Best first step before choosing an agent framework?", options: ["Compare GitHub stars", "Write the plain loop yourself once", "Pick whatever the model provider recommends", "Adopt the one with the most integrations"], answer: 1, explain: "Understanding the mechanism turns framework selection into an engineering decision about specific capabilities rather than a popularity contest." },
      ],
    },
  ],
};
