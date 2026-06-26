import type { Module } from "./types";

export const agents: Module = {
  id: "agents",
  title: "Tool Use & Agents",
  blurb:
    "Give Claude the ability to act — call your functions, return structured data, and run autonomous loops. This is how agents are built.",
  accent: "clay",
  lessons: [
    {
      slug: "tool-use-basics",
      title: "Tool use: giving Claude hands",
      summary:
        "Tools let Claude call functions you define. You describe the tool; Claude decides when to use it and with what arguments; your code runs it and returns the result.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "From talking to doing" },
        {
          type: "p",
          text: "On its own, Claude can only produce text. **Tool use** (also called function calling) lets it interact with the outside world: look up live data, query a database, do precise math, send an email, hit any API. You define the tools; Claude chooses when to call them.",
        },
        {
          type: "p",
          text: "Crucially, **Claude never runs your code.** It only emits a structured request — 'call get_weather with {city: \"Paris\"}'. Your application runs the function and feeds the result back. This keeps you in control of every side effect.",
        },
        { type: "diagram", name: "tool-loop", caption: "The round trip: Claude requests a tool → your code executes it → you return the result → Claude continues." },
        { type: "h3", text: "Defining a tool" },
        {
          type: "p",
          text: "A tool is a name, a description, and a JSON-Schema for its inputs. The **description is critical** — it's how Claude decides whether and how to use the tool. Be specific about when to call it.",
        },
        {
          type: "code",
          lang: "python",
          caption: "A tool definition",
          code: `tools = [{
    "name": "get_weather",
    "description": "Get the current weather for a city. Call this whenever "
                   "the user asks about current conditions or temperature.",
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name, e.g. Paris"}
        },
        "required": ["city"],
    },
}]`,
        },
        { type: "h3", text: "The four-step exchange" },
        {
          type: "steps",
          items: [
            { title: "You send", text: "The user message plus the list of tools." },
            { title: "Claude responds", text: "With stop_reason='tool_use' and a tool_use block containing the name and arguments." },
            { title: "You execute", text: "Run the real function with those arguments and capture the result." },
            { title: "You return", text: "Send the result back as a tool_result block; Claude uses it to write the final answer." },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Handling a tool call",
          code: `resp = client.messages.create(model="claude-opus-4-8", max_tokens=1024,
                              tools=tools, messages=messages)

if resp.stop_reason == "tool_use":
    block = next(b for b in resp.content if b.type == "tool_use")
    result = get_weather(**block.input)          # your real function

    messages.append({"role": "assistant", "content": resp.content})
    messages.append({"role": "user", "content": [{
        "type": "tool_result",
        "tool_use_id": block.id,
        "content": result,
    }]})
    resp = client.messages.create(model="claude-opus-4-8", max_tokens=1024,
                                  tools=tools, messages=messages)  # continue`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Descriptions are your steering wheel",
          text: "Claude picks tools almost entirely from their names and descriptions. Write them like documentation: what the tool does, when to use it, what each parameter means. Vague descriptions cause missed or wrong calls.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Match every tool_use with a tool_result",
          text: "The id on the tool_use block must be echoed in the tool_result. If Claude makes several tool calls at once, return all results together in one user message.",
        },
      ],
      takeaways: [
        "Tools let Claude call functions you define to act on the world; Claude never executes your code.",
        "A tool = name + description + JSON-Schema inputs; the description drives when Claude uses it.",
        "Flow: send tools → Claude returns tool_use → you run it → you return tool_result → Claude continues.",
        "Echo the tool_use id in the tool_result; return all parallel results in one message.",
      ],
      flashcards: [
        { front: "Does Claude execute your tool code?", back: "No. It only emits a structured tool_use request with arguments. Your app runs the function and returns the result." },
        { front: "What does Claude use to decide which tool to call?", back: "The tool's name and description (and input schema). Write them like clear documentation." },
        { front: "What links a tool_result back to a request?", back: "The tool_use_id — it must match the id from Claude's tool_use block." },
      ],
      quiz: [
        {
          q: "Claude responds with stop_reason='tool_use'. What do you do?",
          options: [
            "Show the user an error",
            "Run the requested function and send its output back as a tool_result, then call the API again",
            "Increase max_tokens",
            "Switch models",
          ],
          answer: 1,
          explain: "You execute the tool yourself and return a tool_result so Claude can finish the answer.",
        },
        {
          q: "Claude keeps failing to call your search tool when it should. Most likely fix?",
          options: [
            "Raise temperature",
            "Improve the tool's description to specify exactly when to use it",
            "Add more tools",
            "Lower max_tokens",
          ],
          answer: 1,
          explain: "Tool selection is driven by the description. Make it explicit about when to call the tool.",
        },
      ],
    },

    {
      slug: "structured-outputs",
      title: "Structured outputs",
      summary:
        "When you need machine-readable JSON, don't hope the model formats it right — constrain it. Structured outputs and strict tools guarantee a valid schema.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Stop parsing prose" },
        {
          type: "p",
          text: "A huge fraction of real applications need Claude's answer as **JSON your code can consume** — extract these fields, classify into these labels, fill this form. Asking nicely in the prompt mostly works, but 'mostly' breaks production. **Structured outputs** make the format a guarantee.",
        },
        { type: "h3", text: "Two mechanisms" },
        {
          type: "compare",
          columns: ["Mechanism", "What it does"],
          rows: [
            { label: "Output format (json_schema)", cells: ["Constrains the whole response to match a JSON Schema you provide."] },
            { label: "Strict tool use", cells: ["Guarantees a tool's arguments exactly match its input schema (set strict: true on the tool)."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Constraining the response to a schema",
          code: `response = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    messages=[{"role": "user",
               "content": "Extract: Jane Doe, jane@co.com, Enterprise plan."}],
    output_config={"format": {
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "name":  {"type": "string"},
                "email": {"type": "string"},
                "plan":  {"type": "string"},
            },
            "required": ["name", "email", "plan"],
            "additionalProperties": False,
        },
    }},
)
# The first text block is guaranteed to be valid JSON matching the schema.`,
        },
        {
          type: "callout",
          kind: "key",
          title: "The SDK can parse for you",
          text: "Helpers like messages.parse() (with a Pydantic/Zod model) validate the response against your schema and hand back a typed object — no manual json.loads, no try/except on malformed output.",
        },
        { type: "h3", text: "When to use which" },
        {
          type: "list",
          items: [
            "**Just need clean JSON back?** Use output format with a json_schema.",
            "**Calling a tool and want bulletproof arguments?** Add strict: true to the tool.",
            "**Classifying into fixed labels?** Use an enum in the schema so only valid labels are possible.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Know the limits",
          text: "Structured outputs support most JSON Schema, but not everything (no recursive schemas, no min/max numeric constraints). Keep schemas flat and explicit. Structured outputs also can't be combined with citations.",
        },
      ],
      takeaways: [
        "Structured outputs turn 'usually valid JSON' into a guarantee — essential for production.",
        "Use output_config.format with a json_schema to constrain the whole response.",
        "Use strict: true on a tool to guarantee its arguments match the schema.",
        "SDK parse helpers validate and return typed objects; use enums to lock classification labels.",
      ],
      flashcards: [
        { front: "How do you guarantee Claude returns valid JSON?", back: "Set output_config.format to a json_schema; the response is constrained to match it." },
        { front: "How do you guarantee a tool's arguments are schema-valid?", back: "Set strict: true on the tool definition (with additionalProperties:false and required fields)." },
        { front: "How to restrict a classification to fixed labels?", back: "Use an enum in the JSON schema so only those values are possible." },
      ],
      quiz: [
        {
          q: "Your extraction prompt returns valid JSON 95% of the time, but the 5% crashes downstream. Best fix?",
          options: [
            "Add 'please return valid JSON' more forcefully",
            "Use structured outputs (json_schema) to make the format a guarantee",
            "Retry on failure forever",
            "Lower the temperature only",
          ],
          answer: 1,
          explain: "Structured outputs make the schema a hard constraint instead of a hope.",
        },
      ],
    },

    {
      slug: "tool-choice",
      title: "Controlling tool choice",
      summary:
        "By default Claude decides whether to use a tool. You can force it to use any tool, a specific tool, or none — and control parallel calls.",
      minutes: 5,
      blocks: [
        { type: "h2", text: "Who decides — Claude or you?" },
        {
          type: "p",
          text: "The `tool_choice` parameter controls Claude's freedom to call tools. Most of the time `auto` is right, but forcing a choice is powerful for structured pipelines.",
        },
        {
          type: "compare",
          caption: "tool_choice options",
          columns: ["Value", "Behavior"],
          rows: [
            { label: "auto (default)", cells: ["Claude decides whether to use a tool or just answer."] },
            { label: "any", cells: ["Claude must use one of the available tools (no plain text answer)."] },
            { label: "tool (named)", cells: ["Claude must use the specific tool you name — great for forcing structure."] },
            { label: "none", cells: ["Claude cannot use tools this turn."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Forcing a specific tool",
          code: `response = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    tools=[extract_contact_tool],
    tool_choice={"type": "tool", "name": "extract_contact"},  # must use this tool
    messages=[{"role": "user", "content": raw_text}],
)`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Forcing a tool = structured extraction",
          text: "Defining a single tool and forcing it with tool_choice is a classic pattern for guaranteed structured output: Claude must fill in the tool's typed arguments.",
        },
        { type: "h3", text: "Parallel tool use" },
        {
          type: "p",
          text: "By default Claude can request **several tools at once** in one response (e.g. look up two cities' weather simultaneously). Execute them all, then return **every** `tool_result` together in a single user message. To force one-at-a-time, set `disable_parallel_tool_use: true`.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Don't split parallel results",
          text: "If Claude makes 3 parallel calls, return all 3 results in ONE user message. Splitting them across messages quietly trains Claude to stop calling tools in parallel.",
        },
      ],
      takeaways: [
        "tool_choice controls tool freedom: auto (default), any, a named tool, or none.",
        "Forcing a named tool is a reliable structured-extraction pattern.",
        "Claude can call multiple tools in parallel; run them all and return every result in one message.",
        "Set disable_parallel_tool_use to force sequential calls.",
      ],
      flashcards: [
        { front: "What does tool_choice='any' do?", back: "Forces Claude to use one of the available tools instead of answering with plain text." },
        { front: "How do you force structured extraction with a tool?", back: "Define the tool and set tool_choice to that specific tool name so Claude must fill its typed arguments." },
        { front: "How do you return results from parallel tool calls?", back: "Put all tool_result blocks in a single user message — never split them across messages." },
      ],
      quiz: [
        {
          q: "You want Claude to ALWAYS extract data via your extract tool, never chat. Set:",
          options: [
            "tool_choice = none",
            "tool_choice = {type:'tool', name:'extract'}",
            "temperature = 0",
            "max_tokens = 1",
          ],
          answer: 1,
          explain: "Naming the tool in tool_choice forces Claude to call exactly that tool.",
        },
      ],
    },

    {
      slug: "the-agentic-loop",
      title: "The agentic loop",
      summary:
        "An agent is tool use in a loop: Claude acts, sees results, decides the next step, and repeats until the goal is done. This is the heart of 'agents'.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "From single tool calls to autonomy" },
        {
          type: "p",
          text: "A single tool call answers a single question. An **agent** chains many of them toward a goal it wasn't given step-by-step. The pattern is a loop: Claude decides an action, you execute it, the result goes back, and Claude decides the next action — until it's finished.",
        },
        { type: "diagram", name: "agentic-loop", caption: "The agent loop: observe → think → act → observe… until the task is complete (stop_reason='end_turn')." },
        {
          type: "code",
          lang: "python",
          caption: "The core agent loop",
          code: `messages = [{"role": "user", "content": goal}]

while True:
    resp = client.messages.create(
        model="claude-opus-4-8", max_tokens=4000,
        tools=tools, messages=messages,
    )
    messages.append({"role": "assistant", "content": resp.content})

    if resp.stop_reason == "end_turn":
        break                                  # Claude is done

    # Run every requested tool and collect results
    results = []
    for block in resp.content:
        if block.type == "tool_use":
            output = run_tool(block.name, block.input)
            results.append({"type": "tool_result",
                            "tool_use_id": block.id, "content": output})
    messages.append({"role": "user", "content": results})`,
        },
        {
          type: "callout",
          kind: "key",
          title: "The loop IS the agent",
          text: "There's no magic 'agent mode.' An agent is this loop plus a good set of tools and a clear goal. SDK 'tool runners' automate the loop for you, but the mechanism is exactly this.",
        },
        { type: "h3", text: "Workflow vs. agent" },
        {
          type: "p",
          text: "Not everything needs an agent. A **workflow** is when *you* control the steps in code (call A, then B, then C). An **agent** is when *the model* decides the steps. Agents shine when the path can't be fully scripted in advance.",
        },
        { type: "diagram", name: "agent-vs-workflow", caption: "Workflow: your code orchestrates fixed steps. Agent: the model chooses its own trajectory." },
        { type: "h3", text: "Should you even build an agent?" },
        {
          type: "list",
          items: [
            "**Complexity** — is the task multi-step and hard to fully specify up front? (Agent.) Or a single clear transformation? (Workflow or one call.)",
            "**Value** — does the outcome justify higher cost and latency?",
            "**Viability** — is the model actually good at this kind of task?",
            "**Cost of error** — can mistakes be caught and recovered (tests, review, rollback)?",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Start simple",
          text: "Reach for the simplest thing that works: one call, then a workflow, and only an agent when the task genuinely needs open-ended, model-driven exploration. Agents cost more and are harder to control — earn them.",
        },
        { type: "h3", text: "Guardrails for safe loops" },
        {
          type: "list",
          items: [
            "**Max iterations** — cap the loop so it can't run forever.",
            "**Approval gates** — require human confirmation before irreversible actions (sending email, deleting data).",
            "**Logging** — record every tool call so you can debug and audit.",
            "**Error handling** — return tool errors with is_error so Claude can recover instead of crashing.",
          ],
        },
      ],
      takeaways: [
        "An agent is tool use in a loop: Claude acts, observes results, and decides the next step until done.",
        "The loop ends when stop_reason='end_turn'; SDK tool runners automate this exact loop.",
        "Workflow = you control the steps; agent = the model controls them. Prefer the simplest that works.",
        "Decide to build an agent by weighing complexity, value, viability, and cost of error; add guardrails (max iterations, approval gates, logging).",
      ],
      flashcards: [
        { front: "Define an agent in terms of tool use.", back: "Tool use in a loop — Claude acts, sees the result, decides the next action, and repeats until the goal is met (end_turn)." },
        { front: "Workflow vs. agent?", back: "Workflow: your code decides the fixed steps. Agent: the model decides the steps/trajectory. Use agents only when the path can't be scripted." },
        { front: "Four questions before building an agent?", back: "Complexity, value, viability, and cost of error — if any answer is 'no', use a simpler tier (single call or workflow)." },
      ],
      quiz: [
        {
          q: "When does the agent loop terminate?",
          options: [
            "After exactly one tool call",
            "When stop_reason becomes 'end_turn' (Claude has no more tool calls)",
            "When max_tokens is hit",
            "Never — it runs forever",
          ],
          answer: 1,
          explain: "The loop continues while Claude requests tools and ends when it returns end_turn.",
        },
        {
          q: "A task is a fixed pipeline: parse → validate → store. Agent or workflow?",
          options: ["Agent — always use agents", "Workflow — you can script the fixed steps", "Neither is possible", "Depends on the model"],
          answer: 1,
          explain: "Fully specifiable steps are a workflow. Reserve agents for tasks whose path can't be scripted.",
        },
      ],
    },

    {
      slug: "agent-design",
      title: "Designing good agents",
      summary:
        "Great agents come from a well-chosen tool surface, smart context management, and the right model controls — not from a clever prompt alone.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Design the tools, not just the prompt" },
        {
          type: "p",
          text: "An agent is only as good as the tools you give it. The shape of your tool surface determines what the agent can do safely and how well your harness can supervise it.",
        },
        { type: "h3", text: "Bash vs. dedicated tools" },
        {
          type: "p",
          text: "A broad **bash/exec tool** gives the agent huge reach but hands your code an opaque command string — hard to gate or audit. A **dedicated tool** (`send_email`, `delete_record`) gives typed arguments your harness can intercept, confirm, render, or log. Rule of thumb: start with breadth, then promote risky actions to dedicated tools.",
        },
        {
          type: "compare",
          caption: "When to make a dedicated tool",
          columns: ["Reason", "Why"],
          rows: [
            { label: "Security boundary", cells: ["Gate irreversible actions behind confirmation (easy with a typed send_email, impossible with raw bash)."] },
            { label: "Rendering", cells: ["Show a nice UI (a confirmation modal, a diff) for specific actions."] },
            { label: "Auditing", cells: ["Log structured, action-specific events."] },
            { label: "Parallel safety", cells: ["Mark read-only tools safe to run concurrently."] },
          ],
        },
        { type: "h3", text: "Anthropic-provided tools" },
        {
          type: "p",
          text: "You don't build everything. Claude ships with well-defined tools: **bash** and **text editor** (you execute), **code execution** and **web search/fetch** (Anthropic runs them server-side), **computer use** (GUI control), and **memory** (a files directory the agent reads/writes across sessions).",
        },
        { type: "h3", text: "Managing context over long runs" },
        {
          type: "p",
          text: "Long agent runs fill the context window with stale tool results. Three tools keep it lean:",
        },
        {
          type: "list",
          items: [
            "**Prompt caching** — reuse the stable prefix cheaply (you learned this).",
            "**Context editing** — automatically clear old tool results / thinking from the transcript.",
            "**Compaction** — summarize earlier history when nearing the limit.",
            "**Memory** — persist important state to files that survive across sessions.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Caching survival rules for agents",
          text: "Don't edit the system prompt, swap tools, or change models mid-run — each invalidates the cache. Need a mode change? Append a system-role message instead of editing the prefix. Need dynamic tools? Use tool search, which appends rather than swaps.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Effort is a real lever",
          text: "Run sub-agents and routine steps at low effort; reserve high/xhigh for the hard reasoning. Combined with adaptive thinking, this controls both quality and cost across a long run.",
        },
      ],
      takeaways: [
        "Tool design matters as much as prompts: start with broad tools, promote risky actions to typed dedicated tools you can gate and audit.",
        "Use Anthropic's built-in tools (bash, editor, code execution, web search, computer use, memory) instead of rebuilding them.",
        "Keep long runs lean with prompt caching, context editing, compaction, and memory.",
        "Protect the cache: don't edit the system prompt, swap tools, or change models mid-run.",
      ],
      flashcards: [
        { front: "Why promote a bash action to a dedicated tool?", back: "Typed arguments let your harness gate, confirm, render, audit, or parallelize the action — impossible with an opaque command string." },
        { front: "Name two built-in Anthropic tools and who runs them.", back: "Bash/text-editor (you execute client-side); code execution & web search (Anthropic runs server-side)." },
        { front: "How do you keep a long agent run within the context window?", back: "Prompt caching, context editing (clear stale results), compaction (summarize history), and memory files for persistent state." },
      ],
      quiz: [
        {
          q: "You want a human to confirm before the agent sends any email. Best design?",
          options: [
            "Give it a raw bash tool and hope",
            "A dedicated send_email tool whose typed call your harness gates with a confirmation step",
            "Lower the temperature",
            "Tell it 'be careful' in the prompt",
          ],
          answer: 1,
          explain: "A typed, dedicated tool gives your harness a hook to require approval before the irreversible action.",
        },
        {
          q: "Mid-run you change the system prompt to switch modes. What breaks?",
          options: ["Nothing", "The prompt cache invalidates, raising cost/latency", "The model changes", "Tools stop working"],
          answer: 1,
          explain: "Editing the cached prefix invalidates the cache. Append a system-role message instead of editing it.",
        },
      ],
    },

    {
      slug: "mcp",
      title: "MCP: the Model Context Protocol",
      summary:
        "MCP is a universal standard for connecting AI to tools and data sources. Build a connector once; any MCP-aware app can use it.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "A USB-C port for AI" },
        {
          type: "p",
          text: "Every app that wants Claude to use GitHub, Slack, a database, or an internal API has historically built that integration from scratch. The **Model Context Protocol (MCP)** is an open standard that fixes this: a server exposes tools, data (resources), and prompts in a common format, and any MCP-aware client (Claude apps, agents, IDEs) can plug in.",
        },
        { type: "diagram", name: "mcp", caption: "MCP standardizes the connection. Build a server once; many AI clients can use it without custom glue." },
        { type: "h3", text: "What an MCP server exposes" },
        {
          type: "list",
          items: [
            "**Tools** — actions the model can call (create issue, run query).",
            "**Resources** — data the model can read (files, records, docs).",
            "**Prompts** — reusable prompt templates the server offers.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Why it matters",
          text: "MCP turns N apps × M integrations into N + M. Write a connector for your service once, and every MCP-compatible AI can use it. It's becoming the lingua franca for tool/data access.",
        },
        { type: "h3", text: "Using MCP with the API" },
        {
          type: "p",
          text: "The Claude API can connect directly to a remote MCP server: you declare the server (its URL and name) plus an `mcp_toolset` referencing it, and Claude can call that server's tools server-side. Authentication for hosted MCP servers is typically OAuth, handled via secure credential storage rather than pasted into the prompt.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Connecting to a remote MCP server",
          code: `client.beta.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    betas=["mcp-client-2025-11-20"],
    mcp_servers=[{"type": "url", "name": "github",
                  "url": "https://example.com/mcp"}],
    tools=[{"type": "mcp_toolset", "mcp_server_name": "github"}],
    messages=[{"role": "user", "content": "Open an issue titled 'Bug in login'."}],
)`,
        },
        {
          type: "callout",
          kind: "note",
          title: "MCP vs. your own tools",
          text: "Defining tools directly in the API is perfect for your app's private functions. MCP shines for reusable, shareable connectors to standard services — and for letting many different AI clients reuse the same integration.",
        },
      ],
      takeaways: [
        "MCP is an open standard for connecting AI to tools, data (resources), and prompts — 'USB-C for AI'.",
        "Build an MCP server once; any MCP-aware client can use it, turning N×M integrations into N+M.",
        "The Claude API can call a remote MCP server's tools via mcp_servers + an mcp_toolset.",
        "Use your own API tools for private functions; use MCP for reusable, shareable connectors.",
      ],
      flashcards: [
        { front: "What is MCP?", back: "The Model Context Protocol — an open standard for connecting AI to external tools, data resources, and prompts in a common format." },
        { front: "What three things can an MCP server expose?", back: "Tools (actions), resources (readable data), and prompts (reusable templates)." },
        { front: "Why is MCP a big deal?", back: "It standardizes integrations: build a connector once and any MCP-aware AI client can use it (N+M instead of N×M)." },
      ],
      quiz: [
        {
          q: "What problem does MCP primarily solve?",
          options: [
            "Making models faster",
            "Standardizing how AI connects to tools/data so integrations are reusable across apps",
            "Reducing token cost",
            "Replacing the system prompt",
          ],
          answer: 1,
          explain: "MCP is a universal connector standard — build once, reuse across many AI clients.",
        },
      ],
    },

    {
      slug: "managed-agents",
      title: "Managed Agents",
      summary:
        "Instead of running the agent loop and tool sandbox yourself, let Anthropic host both. You define a persisted agent; sessions run it in a server-managed container.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Let Anthropic run the loop" },
        {
          type: "p",
          text: "Building an agent yourself means running the loop, hosting a sandbox for tools, and managing state. **Managed Agents** is a higher-level surface where Anthropic does all that: you create a persisted **Agent** config, then start **Sessions** that execute in a server-provisioned container.",
        },
        { type: "diagram", name: "managed-agents", caption: "Agent (config, created once) → Session (each run) executes in an Anthropic-hosted container with built-in tools." },
        { type: "h3", text: "The core objects" },
        {
          type: "compare",
          columns: ["Object", "What it is"],
          rows: [
            { label: "Agent", cells: ["A persisted, versioned config: model, system prompt, tools, MCP servers, skills. Created once."] },
            { label: "Session", cells: ["A single stateful run referencing an agent. Streams events; you send messages/tool results in."] },
            { label: "Environment", cells: ["A reusable template for the container the agent's tools run in."] },
            { label: "Container", cells: ["The isolated sandbox where bash, file ops, and code execute."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The mandatory flow: Agent once → Session every run",
          text: "Model, system prompt, and tools live on the AGENT, never the session. Create the agent once, store its ID, and reference it from every session. Calling agents.create() on each run is the classic anti-pattern.",
        },
        { type: "h3", text: "What you get for free" },
        {
          type: "list",
          items: [
            "**Hosted tool execution** — bash, file ops, and code run in the managed container; no sandbox to operate.",
            "**Built-in context compaction & caching** — long sessions stay within the window automatically.",
            "**An event stream** — watch the agent think, call tools, and produce output in real time.",
            "**Resources** — mount files and GitHub repos; attach MCP servers and skills.",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "Managed vs. DIY",
          text: "Use Managed Agents when you want Anthropic to run the loop and host the tool sandbox (e.g. a coding agent with a workspace). Use the API + tool-use loop when you need to host the compute or run a fully custom runtime yourself.",
        },
      ],
      takeaways: [
        "Managed Agents lets Anthropic run the agent loop and host the tool-execution container.",
        "Create a persisted Agent (model/system/tools) once; start Sessions that reference it for each run.",
        "Model, system prompt, and tools live on the Agent — never on the session.",
        "You get hosted tool execution, automatic compaction/caching, an event stream, and mountable resources.",
      ],
      flashcards: [
        { front: "What does Managed Agents host that DIY agents don't?", back: "The agent loop AND a server-provisioned container where tools (bash, file ops, code) execute." },
        { front: "The mandatory Managed Agents flow?", back: "Create the Agent (model/system/tools) once and store its ID; reference it from a new Session on every run." },
        { front: "Where do model, system prompt, and tools live in Managed Agents?", back: "On the Agent object, not the Session. The session only points to the agent by ID." },
      ],
      quiz: [
        {
          q: "In Managed Agents, where does the model/system/tools configuration live?",
          options: ["On each session", "On the persisted Agent object", "In the environment", "In the container"],
          answer: 1,
          explain: "Config lives on the Agent; sessions just reference it by ID. Creating an agent per run is the anti-pattern.",
        },
        {
          q: "When is Managed Agents the right choice over the raw API + tool loop?",
          options: [
            "Always",
            "When you want Anthropic to run the loop and host the tool sandbox",
            "Only for classification",
            "When you need a smaller model",
          ],
          answer: 1,
          explain: "Managed Agents fits when you want hosted loop + container; DIY fits when you must host compute yourself.",
        },
      ],
    },
  ],
};
