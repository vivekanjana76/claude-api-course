import type { Module } from "./types";

export const tools: Module = {
  id: "tools",
  title: "Tools, Memory & Knowledge",
  blurb:
    "The hands and the notebook: function calling, designing tools agents can actually use, short- and long-term memory, retrieval (RAG), and the MCP standard.",
  accent: "amber",
  lessons: [
    {
      slug: "tool-use",
      title: "Tool use & function calling",
      summary:
        "Tools are how an agent acts on the world. You describe a function; the model decides when to call it and with what arguments; your code runs it and returns the result.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Giving the model hands" },
        {
          type: "p",
          text: "A model alone produces only text. **Tool use** (a.k.a. function calling) lets it interact with reality: search the web, query a database, run code, send an email, hit any API. You define the tools; the model chooses *when* to call them and *with what arguments*; your code executes them.",
        },
        { type: "diagram", name: "tool-call", caption: "The round trip: model requests a tool → your code executes it → you return the result → the model continues." },
        { type: "h3", text: "Anatomy of a tool" },
        {
          type: "p",
          text: "A tool is three things: a **name**, a **description**, and an **input schema** (JSON Schema). The description is the most important part — it's how the model decides whether and how to use the tool. Write it like documentation.",
        },
        {
          type: "code",
          lang: "python",
          caption: "A tool definition",
          code: `tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city. Call this whenever the "
                   "user asks about current conditions or temperature.",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name, e.g. Osaka"},
            "unit": {"type": "string", "enum": ["c", "f"], "default": "c"},
        },
        "required": ["city"],
    },
}]`,
        },
        { type: "h3", text: "The exchange, step by step" },
        {
          type: "steps",
          items: [
            { title: "You send", text: "The user message plus the list of available tools." },
            { title: "Model responds", text: "Either a final answer, or a tool-call request (name + arguments) with a stop reason like tool_use." },
            { title: "You execute", text: "Run the real function with those arguments and capture the result." },
            { title: "You return", text: "Send the result back as a tool_result (matched by id); the model continues from there." },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Descriptions are your steering wheel",
          text: "The model selects tools almost entirely from their names and descriptions. Vague descriptions cause missed or wrong calls. Be explicit about what the tool does, when to use it, and what each parameter means.",
        },
        {
          type: "callout",
          kind: "note",
          title: "The model never executes anything",
          text: "It only emits a request to call a tool. Your harness runs the code and returns the output. That boundary is what makes every side effect auditable and gate-able.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Match every call with a result",
          text: "The id on a tool-call must be echoed in its tool_result. If the model makes several calls at once (parallel tool use), return all results together in one message — splitting them quietly degrades the model's behavior.",
        },
      ],
      takeaways: [
        "Tools let the model act on the world; it requests calls, your code executes them and returns results.",
        "A tool = name + description + JSON-Schema input; the description drives when the model uses it.",
        "Flow: send tools → model requests a tool → you run it → you return a tool_result → model continues.",
        "Echo the call id in the result, and return all parallel results in one message.",
      ],
      flashcards: [
        { front: "What are the three parts of a tool definition?", back: "A name, a description, and an input schema (JSON Schema). The description is the key driver of when the model calls it." },
        { front: "Does the model run your tool code?", back: "No — it emits a structured request; your harness executes the function and returns the result as a tool_result." },
        { front: "How are tool calls and results linked?", back: "By an id: the tool_result must echo the id from the model's tool-call. Return all parallel results in a single message." },
      ],
      quiz: [
        {
          q: "The model keeps failing to call your search tool when it should. Best fix?",
          options: [
            "Raise the temperature",
            "Improve the tool's description to state exactly when to use it",
            "Add ten more tools",
            "Lower max_tokens",
          ],
          answer: 1,
          explain: "Tool selection is driven by the name and description — make it explicit about when the tool applies.",
        },
        {
          q: "The model makes three tool calls in one turn. How do you respond?",
          options: [
            "Return one result and ignore the rest",
            "Run all three and return every result together in one message, matched by id",
            "Split the results across three separate messages",
            "Restart the conversation",
          ],
          answer: 1,
          explain: "Execute all parallel calls and return their results together, each echoing its call id.",
        },
      ],
    },

    {
      slug: "designing-tools",
      title: "Designing tools agents can use",
      summary:
        "An agent is only as good as its tools. Shape the tool surface for clarity, safety, and the right granularity — it matters more than prompt wording.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Tool design is agent design" },
        {
          type: "p",
          text: "Give an agent vague or sprawling tools and even a great model flounders. Give it crisp, well-scoped tools and a mediocre prompt still works. The shape of your tool surface determines what the agent can do, how safely, and how well you can supervise it.",
        },
        { type: "diagram", name: "tool-design", caption: "Right-grained, well-described, typed tools — gate-able and auditable — beat one opaque do-everything tool." },
        { type: "h3", text: "Broad vs. dedicated tools" },
        {
          type: "p",
          text: "A broad **bash/exec** tool gives huge reach but hands you an opaque command string — hard to gate, render, or audit. A **dedicated** tool (`send_email`, `refund_order`) gives typed arguments your harness can intercept, confirm, and log. Rule of thumb: start broad to learn what's needed, then promote risky actions to dedicated tools.",
        },
        {
          type: "compare",
          caption: "When to make a dedicated tool",
          columns: ["Reason", "Why"],
          rows: [
            { label: "Security boundary", cells: ["Gate irreversible actions behind confirmation — trivial with typed send_email, impossible with raw bash."] },
            { label: "Rendering", cells: ["Show a tailored UI (a diff, a confirmation modal) for a specific action."] },
            { label: "Auditing", cells: ["Emit structured, action-specific log events."] },
            { label: "Parallel safety", cells: ["Mark read-only tools safe to run concurrently."] },
          ],
        },
        { type: "h3", text: "Principles for good tools" },
        {
          type: "list",
          items: [
            "**Right granularity** — not so fine the agent needs ten calls, not so coarse it's an opaque mega-tool. Match a tool to a meaningful unit of work.",
            "**Self-describing** — names and descriptions that read like docs; describe every parameter and the return shape.",
            "**Forgiving inputs, strict outputs** — accept reasonable variations; return predictable, structured results.",
            "**Helpful errors** — on failure, return a clear message the agent can act on ('city not found; try a country code'), not a raw stack trace.",
            "**Few and distinct** — overlapping tools confuse selection. Prefer a small, orthogonal set.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "An error the agent can recover from",
          code: `def refund_order(order_id: str):
    order = db.get(order_id)
    if not order:
        return {"error": f"No order '{order_id}'. Ask the user to confirm the ID."}
    if order.refunded:
        return {"status": "already_refunded", "amount": order.amount}
    ...`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Tools are a UI — for the model",
          text: "Design them with the same care you'd give a human-facing API: clear names, good docs, sensible defaults, and actionable errors. The 'user' here is the model, and it reads the docs every single call.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Too many tools is a real failure mode",
          text: "Past ~15–20 tools, selection accuracy drops. If you have many, group them, route to a subset per task, or use dynamic tool discovery so the agent only sees what's relevant.",
        },
      ],
      takeaways: [
        "Tool design influences agent quality more than prompt wording; start broad, then promote risky actions to typed dedicated tools.",
        "Dedicated tools enable gating, rendering, auditing, and parallel-safety that opaque bash can't.",
        "Good tools have right granularity, doc-quality descriptions, predictable outputs, and actionable errors.",
        "Keep the tool set small and distinct; too many tools hurts selection accuracy.",
      ],
      flashcards: [
        { front: "Why promote a bash action to a dedicated tool?", back: "Typed arguments let your harness gate, confirm, render, audit, or parallelize the action — impossible with an opaque command string." },
        { front: "What should a tool return on failure?", back: "A clear, actionable error the agent can recover from (e.g. 'order not found; confirm the ID'), not a raw stack trace." },
        { front: "What happens when an agent has too many tools?", back: "Selection accuracy drops (roughly past 15–20). Group them, route to a subset per task, or use dynamic tool discovery." },
      ],
      quiz: [
        {
          q: "You want a human to confirm before any refund. Best design?",
          options: [
            "Give the agent raw bash and hope",
            "A dedicated refund_order tool whose typed call your harness gates with a confirmation step",
            "Lower the temperature",
            "Tell it 'be careful' in the prompt",
          ],
          answer: 1,
          explain: "A typed, dedicated tool gives your harness a hook to require approval before the irreversible action.",
        },
        {
          q: "Which is a sign your tool surface needs rework?",
          options: [
            "Tools return structured outputs",
            "The agent often picks the wrong tool among 30 overlapping ones",
            "Descriptions read like documentation",
            "Errors are actionable",
          ],
          answer: 1,
          explain: "Many overlapping tools wreck selection accuracy — consolidate, route, or discover tools dynamically.",
        },
      ],
    },

    {
      slug: "agent-memory",
      title: "Agent memory",
      summary:
        "Agents are stateless between calls. Memory — short-term context plus long-term stores — is what lets them stay coherent within a task and learn across tasks.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Why memory is a design problem" },
        {
          type: "p",
          text: "Models are **stateless**: each API call starts fresh, remembering nothing. Any 'memory' is something *you* engineer — by deciding what to put back into the context window and what to persist outside it. Memory is the difference between an amnesiac and an assistant that knows you.",
        },
        { type: "diagram", name: "memory-types", caption: "Short-term memory lives in the context window; long-term memory lives in external stores and is retrieved on demand." },
        { type: "h3", text: "Short-term (working) memory" },
        {
          type: "p",
          text: "This is the context window itself: the system prompt, the running conversation, recent tool results — the agent's scratchpad for the current task. It's fast and fully available, but **finite and expensive**. As a long run fills it, you must manage it.",
        },
        {
          type: "list",
          items: [
            "**Truncation** — drop the oldest turns when nearing the limit (simple, lossy).",
            "**Summarization / compaction** — periodically replace old history with a compact summary, keeping the gist.",
            "**Offloading** — write details to a file or store and keep only a pointer in context.",
          ],
        },
        { type: "h3", text: "Long-term memory" },
        {
          type: "p",
          text: "Long-term memory persists *across* runs and sessions, stored outside the model and pulled in when relevant. It's how an agent remembers your preferences next week or recalls what it learned last task.",
        },
        {
          type: "compare",
          caption: "Flavors of long-term memory",
          columns: ["Type", "Holds", "Typically stored as"],
          rows: [
            { label: "Episodic", cells: ["Past events / interactions ('last time we deployed v2')", "Logs, vector store of past sessions"] },
            { label: "Semantic", cells: ["Facts & knowledge ('the user prefers metric units')", "Key-value store, knowledge base, vectors"] },
            { label: "Procedural", cells: ["How to do things — skills, learned routines", "Prompts, saved tool sequences, code"] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Retrieve relevant memories, act, then write new ones",
          code: `mems = memory.search(user_id, query=user_msg, k=5)   # recall
context = system_prompt + format(mems) + user_msg
reply = agent(context)
memory.write(user_id, extract_durable_facts(user_msg, reply))  # remember`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Memory = retrieval + writing policy",
          text: "Two questions define a memory system: what do you save (and when), and what do you retrieve back into context (and how much)? Saving everything is noise; retrieving everything blows the budget. The policy is the product.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Stale and conflicting memories",
          text: "Persistent memory drifts: facts change, and old notes contradict new ones. Timestamp memories, prefer recent on conflict, and periodically prune — or the agent will confidently act on outdated state.",
        },
      ],
      takeaways: [
        "Models are stateless; memory is engineered by what you put in context and what you persist outside it.",
        "Short-term memory is the context window — manage it with truncation, summarization/compaction, or offloading.",
        "Long-term memory persists across runs as episodic (events), semantic (facts), or procedural (skills) stores.",
        "A memory system is really a retrieval policy plus a writing policy; guard against stale, conflicting entries.",
      ],
      flashcards: [
        { front: "Why don't models have memory by default?", back: "They're stateless — each call starts fresh. Memory is engineered by re-inserting context and persisting state in external stores." },
        { front: "What is short-term vs. long-term agent memory?", back: "Short-term = the context window (the current task's scratchpad). Long-term = external stores persisted across runs, retrieved on demand." },
        { front: "Name the three types of long-term memory.", back: "Episodic (past events), semantic (facts/knowledge), and procedural (how-to skills/routines)." },
        { front: "What two policies define a memory system?", back: "A writing policy (what/when to save) and a retrieval policy (what/how much to pull back into context)." },
      ],
      quiz: [
        {
          q: "A long-running agent is about to exceed its context window. Which is NOT a standard fix?",
          options: ["Summarize/compact old history", "Offload details to a store and keep a pointer", "Truncate the oldest turns", "Switch to a stateful model that never forgets"],
          answer: 3,
          explain: "Models are stateless; there's no 'never forgets' mode. You manage the window via summarization, offloading, or truncation.",
        },
        {
          q: "Remembering a user prefers metric units, available next session, is which memory type?",
          options: ["Episodic", "Semantic", "Procedural", "Short-term"],
          answer: 1,
          explain: "A durable fact about the user is semantic long-term memory.",
        },
      ],
    },

    {
      slug: "context-engineering",
      title: "Context engineering & compaction",
      summary:
        "An agent's only working memory is the context window. The hardest part of building reliable agents isn't picking a model — it's deciding, turn after turn, what goes into that window and what gets summarized, offloaded, or dropped.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The context window is the whole game" },
        {
          type: "p",
          text: "A model is stateless: it knows nothing except what's in the context window on this exact call. For an agent that loops — calling tools, reading results, deciding the next step — every turn appends more text: the system prompt, the running history, tool definitions, tool outputs, retrieved documents, and the reasoning so far. **Context engineering** is the discipline of curating that window so the model has exactly what it needs and little else.",
        },
        {
          type: "callout",
          kind: "key",
          title: "Why it's 'the real job'",
          text: "Most agent failures aren't reasoning failures — they're context failures. The model did its best with a window that was missing the key fact, or buried it under thousands of irrelevant tokens. Get the context right and mediocre prompts work; get it wrong and no prompt saves you.",
        },
        { type: "h3", text: "Context rot: more is not better" },
        {
          type: "p",
          text: "It's tempting to stuff everything into the window 'just in case.' But long, cluttered contexts actively hurt. Models attend less reliably to the middle of a long window, stale tool outputs contradict newer ones, and every token costs money and latency. As a run grows, accuracy can *degrade* even though you've given the model more information — a failure mode often called **context rot**.",
        },
        {
          type: "compare",
          caption: "Symptoms of a poorly managed context window",
          columns: ["Symptom", "Underlying cause"],
          rows: [
            { label: "Agent 'forgets' an earlier instruction", cells: ["The key token was pushed out or buried mid-window."] },
            { label: "Repeats a tool call it already made", cells: ["Prior result was truncated or never summarized."] },
            { label: "Costs/latency climb every turn", cells: ["History grows unbounded; nothing is compacted."] },
            { label: "Acts on outdated data", cells: ["Stale tool output still sits in context, conflicting with fresh."] },
          ],
        },
        { type: "h3", text: "Four levers for keeping the window clean" },
        {
          type: "list",
          items: [
            "**Select** — only include what this step needs. Don't paste a 40-tool catalog when 4 are relevant; don't carry a document past the turn that used it.",
            "**Summarize / compact** — replace a long stretch of history with a short, faithful synopsis once it's no longer needed verbatim. This is the core move for long runs.",
            "**Externalize** — write big or durable state out to a file, scratchpad, or store and keep only a pointer in context. Retrieve it again on demand.",
            "**Structure** — give the agent a running 'notes' or 'plan' artifact it updates, so the important state lives in one compact, authoritative place instead of being re-derived from scattered history.",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "Compaction in practice",
          text: "A common pattern: let history grow until it crosses a token threshold, then ask the model (or a cheaper model) to compress everything older than the last few turns into a 'story so far' summary. Replace the old turns with that summary and continue. The agent keeps its thread without dragging the full transcript along.",
        },
        {
          type: "steps",
          items: [
            { title: "Set a budget", text: "Decide how many tokens history may occupy, well below the model's limit, leaving room for tools and the reply." },
            { title: "Watch the gauge", text: "Track token usage each turn; trigger compaction when history crosses the budget." },
            { title: "Compact, don't truncate blindly", text: "Summarize old turns into a synopsis rather than hard-cutting the oldest — truncation silently drops facts you may still need." },
            { title: "Pin the essentials", text: "Keep the system prompt, the current goal, and a compact state/notes artifact unsummarized so they never rot away." },
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Context engineering vs. RAG vs. memory",
          text: "They're complementary. RAG decides what external knowledge to pull in; long-term memory decides what to persist across sessions; context engineering decides what — out of all of that plus the live history — actually occupies the window on this call. You can have great retrieval and still fail if the window is a cluttered mess.",
        },
      ],
      takeaways: [
        "An agent's only working memory is the context window; curating it is the central reliability skill.",
        "Bigger context is not better — 'context rot' degrades reasoning and inflates cost and latency.",
        "Manage the window with four levers: select, summarize/compact, externalize, and structure.",
        "Compaction (summarize old turns past a token budget) is the core technique for long-running agents.",
        "Context engineering complements RAG and long-term memory; it governs what actually occupies the window now.",
      ],
      flashcards: [
        { front: "What is 'context rot'?", back: "The degradation in reasoning, plus rising cost/latency, that comes from letting a context window fill with long, stale, or irrelevant tokens." },
        { front: "Name the four levers of context engineering.", back: "Select (include only what's needed), summarize/compact, externalize to a store/file, and structure state into a compact notes/plan artifact." },
        { front: "What is compaction?", back: "Replacing a long stretch of older history with a short faithful summary once it crosses a token budget, so the agent keeps its thread without the full transcript." },
        { front: "How does context engineering differ from RAG?", back: "RAG decides what external knowledge to fetch; context engineering decides what — of everything, including live history — actually occupies the window on this call." },
      ],
      quiz: [
        {
          q: "An agent's accuracy drops as a long run goes on, even though it has 'seen' more information. Most likely cause?",
          options: [
            "The model is overheating",
            "Context rot — a bloated window buries the relevant tokens",
            "The temperature is too low",
            "It needs a bigger max_tokens",
          ],
          answer: 1,
          explain: "Longer, cluttered contexts make models attend less reliably and let stale tokens conflict with fresh ones — accuracy can fall as the window grows.",
        },
        {
          q: "Which is the most robust way to keep a long-running agent within its context budget?",
          options: [
            "Hard-truncate the oldest turns whenever the window is full",
            "Summarize/compact old history into a synopsis and keep essentials pinned",
            "Switch to a model that 'never forgets'",
            "Lower the temperature each turn",
          ],
          answer: 1,
          explain: "Compaction preserves the thread by summarizing rather than silently dropping facts; pinning the goal/system/notes keeps the essentials safe.",
        },
      ],
    },

    {
      slug: "rag-for-agents",
      title: "Knowledge & retrieval (RAG)",
      summary:
        "Ground agents in your data. Retrieval-augmented generation fetches relevant facts and injects them into context, replacing guesswork with cited, current knowledge.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Don't make the model guess" },
        {
          type: "p",
          text: "A model only knows its training data — frozen, public, and not yours. Ask about your internal docs and it guesses (often plausibly, sometimes wrongly). **Retrieval-Augmented Generation (RAG)** fixes this: fetch relevant chunks from your knowledge base and inject them into the prompt, so the answer is grounded in real, current facts.",
        },
        { type: "diagram", name: "rag-agent", caption: "Retrieve relevant chunks → inject into context → answer from your facts, ideally with citations." },
        { type: "h3", text: "The pipeline" },
        {
          type: "steps",
          items: [
            { title: "Ingest & chunk", text: "Split documents into passages small enough to be precise, large enough to be coherent." },
            { title: "Embed & index", text: "Turn each chunk into an embedding (a vector capturing meaning) and store it in a vector database." },
            { title: "Retrieve", text: "Embed the query, find the nearest chunks by similarity (often re-ranked for precision)." },
            { title: "Augment & generate", text: "Put the retrieved chunks in the prompt and have the model answer from them, citing sources." },
          ],
        },
        {
          type: "p",
          text: "**Embeddings** are the engine: text with similar meaning lands near in vector space, so 'cancel my plan' retrieves a doc titled 'ending your subscription' even with no shared words. Lexical (keyword) search complements this; **hybrid** search combines both.",
        },
        { type: "h3", text: "RAG as a tool for agents" },
        {
          type: "p",
          text: "In an agent, retrieval is usually just a **tool**: a `search_knowledge_base` function the agent calls when it needs facts. This is **agentic RAG** — the agent decides *when* to retrieve, can issue multiple refined queries, and reasons over results, rather than retrieving once blindly up front.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Retrieval exposed as an agent tool",
          code: `def search_kb(query: str, k: int = 5):
    "Search the company knowledge base for relevant passages."
    vec = embed(query)
    hits = vector_db.search(vec, k=k)
    return [{"text": h.text, "source": h.source} for h in hits]
# The agent calls this whenever it needs grounded facts, possibly several times.`,
        },
        {
          type: "callout",
          kind: "key",
          title: "RAG > fine-tuning for knowledge",
          text: "To give a model *facts*, retrieval usually beats fine-tuning: it's cheaper, updates instantly (just change the data), supports citations, and respects access control. Fine-tune to change *behavior/format*, retrieve to supply *knowledge*.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Garbage retrieval, garbage answer",
          text: "RAG quality is capped by retrieval quality. If the right chunk isn't fetched, the model can't use it — and may hallucinate around the gap. Invest in chunking, hybrid search, and re-ranking before blaming the model.",
        },
      ],
      takeaways: [
        "RAG retrieves relevant chunks from your data and injects them into context to ground answers in real facts.",
        "Pipeline: ingest & chunk → embed & index → retrieve (often re-ranked) → augment & generate with citations.",
        "Embeddings place similar meanings near each other, enabling semantic search; hybrid adds keyword matching.",
        "In agents, retrieval is a tool the agent calls on demand (agentic RAG); fetch knowledge with RAG, change behavior with fine-tuning.",
      ],
      flashcards: [
        { front: "What is RAG?", back: "Retrieval-Augmented Generation: fetch relevant chunks from a knowledge base and inject them into the prompt so the model answers from real, current facts." },
        { front: "What are embeddings and why do they matter for RAG?", back: "Vectors that capture meaning so similar texts land near each other, enabling semantic search that matches by meaning, not just keywords." },
        { front: "What is agentic RAG?", back: "Exposing retrieval as a tool the agent calls when it decides it needs facts — issuing multiple refined queries and reasoning over results, instead of one blind upfront retrieval." },
        { front: "RAG vs. fine-tuning — which for knowledge?", back: "RAG: cheaper, instantly updatable, citable, access-controllable. Fine-tune to change behavior/format, retrieve to supply knowledge." },
      ],
      quiz: [
        {
          q: "Your agent gives wrong answers about internal docs it should know. Best first fix?",
          options: [
            "Increase temperature",
            "Add retrieval (RAG) so it answers from the actual documents",
            "Use a smaller model",
            "Remove all tools",
          ],
          answer: 1,
          explain: "Ground the agent in your data via retrieval instead of relying on frozen training knowledge.",
        },
        {
          q: "RAG answer quality is most fundamentally limited by…",
          options: ["The model's size", "Whether retrieval surfaces the right chunks", "The temperature", "The number of tools"],
          answer: 1,
          explain: "If retrieval misses the relevant passage, the model can't use it — retrieval quality caps RAG quality.",
        },
      ],
    },

    {
      slug: "mcp",
      title: "MCP: the Model Context Protocol",
      summary:
        "An open standard for connecting agents to tools and data. Build a connector once and any MCP-aware agent can use it — 'USB-C for AI'.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "A universal port for tools and data" },
        {
          type: "p",
          text: "Every agent that wants GitHub, Slack, a database, or an internal API has historically built that integration from scratch. The **Model Context Protocol (MCP)** standardizes it: a **server** exposes tools, data, and prompts in a common format, and any MCP-aware **client** (Claude apps, IDEs, your agents) can plug in. Build the connector once; reuse everywhere.",
        },
        { type: "diagram", name: "mcp", caption: "MCP standardizes the connection. One server, many clients — N×M integrations collapse to N+M." },
        { type: "h3", text: "What an MCP server exposes" },
        {
          type: "list",
          items: [
            "**Tools** — actions the agent can invoke (create issue, run query, send message).",
            "**Resources** — data the agent can read (files, records, documents).",
            "**Prompts** — reusable prompt templates the server provides.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Why it matters",
          text: "MCP turns N agents × M integrations into N + M. Write a connector for your service once and every MCP-compatible agent can use it. It's rapidly becoming the lingua franca for agent tool/data access — including a growing ecosystem of pre-built servers.",
        },
        { type: "h3", text: "Client and server roles" },
        {
          type: "compare",
          columns: ["Side", "Role"],
          rows: [
            { label: "MCP server", cells: ["Wraps a service (e.g. GitHub) and exposes its tools/resources/prompts over the protocol."] },
            { label: "MCP client", cells: ["Lives in the agent/app; discovers what a server offers and calls it on the model's behalf."] },
            { label: "Transport", cells: ["stdio for local servers; HTTP/SSE for remote ones. Auth is typically OAuth for hosted servers."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Pointing an agent at an MCP server (conceptual)",
          code: `# Declare the server; the client discovers its tools automatically.
mcp_servers = [{"name": "github", "url": "https://example.com/mcp"}]

agent = Agent(
    model="claude-opus-4-8",
    mcp_servers=mcp_servers,   # tools from the server become callable
    instructions="Use the GitHub tools to triage incoming issues.",
)`,
        },
        {
          type: "callout",
          kind: "note",
          title: "MCP vs. your own tools",
          text: "Define tools directly when they're your app's private functions. Reach for MCP when you want reusable, shareable connectors to standard services — and to let many different agents reuse the same integration.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Trust the server you connect",
          text: "An MCP server can expose powerful tools and even malicious instructions. Only connect to servers you trust, scope their permissions, and treat their tool descriptions as untrusted input that could attempt prompt injection.",
        },
      ],
      takeaways: [
        "MCP is an open standard connecting agents to tools, data (resources), and prompts — 'USB-C for AI'.",
        "Build an MCP server once; any MCP-aware client can use it, turning N×M integrations into N+M.",
        "Servers wrap services and expose capabilities; clients in the agent discover and call them over stdio or HTTP.",
        "Use your own tools for private functions, MCP for reusable connectors — and only trust servers you vet.",
      ],
      flashcards: [
        { front: "What is MCP?", back: "The Model Context Protocol — an open standard for connecting agents to external tools, data resources, and prompts in a common format." },
        { front: "What three things can an MCP server expose?", back: "Tools (actions), resources (readable data), and prompts (reusable templates)." },
        { front: "Why is MCP a big deal?", back: "Build a connector once and any MCP-aware client can use it — N+M integrations instead of N×M, with a growing ecosystem of ready-made servers." },
        { front: "What's a key security caution with MCP?", back: "A server can expose powerful tools and untrusted instructions; only connect to trusted servers, scope permissions, and treat tool text as a prompt-injection risk." },
      ],
      quiz: [
        {
          q: "What problem does MCP primarily solve?",
          options: [
            "Making models faster",
            "Standardizing how agents connect to tools/data so integrations are reusable across apps",
            "Reducing token cost",
            "Replacing the system prompt",
          ],
          answer: 1,
          explain: "MCP is a universal connector standard — build once, reuse across many agents/clients.",
        },
        {
          q: "When is MCP a better choice than defining a tool directly?",
          options: [
            "For your app's private one-off function",
            "For a reusable, shareable connector to a standard service used by many agents",
            "Never",
            "Only for math",
          ],
          answer: 1,
          explain: "Direct tools fit private functions; MCP shines for reusable connectors shared across agents and apps.",
        },
      ],
    },
  ],
};
