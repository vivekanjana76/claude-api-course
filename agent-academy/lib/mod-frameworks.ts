import type { Module } from "./types";

export const frameworks: Module = {
  id: "frameworks",
  title: "The Framework Landscape",
  blurb:
    "Beyond CrewAI: LangGraph's stateful graphs, AutoGen's conversational agents, the OpenAI Agents SDK, and how to choose — or whether to use one at all.",
  accent: "teal",
  lessons: [
    {
      slug: "langgraph",
      title: "LangGraph: graphs & state",
      summary:
        "LangGraph models an agent system as a graph of nodes and edges over a shared state. It trades some simplicity for precise control, cycles, and durable execution.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Agents as state machines" },
        {
          type: "p",
          text: "**LangGraph** (from the LangChain team) models an agentic system as a **graph**: **nodes** are steps (call a model, run a tool, an agent), **edges** define what runs next, and everything operates over a shared **state** object. It's lower-level than CrewAI — more wiring, but far more control over flow, especially loops and conditional branching.",
        },
        { type: "diagram", name: "langgraph-graph", caption: "Nodes transform shared state; edges (some conditional) route execution — cycles allowed." },
        { type: "h3", text: "The core concepts" },
        {
          type: "list",
          items: [
            "**State** — a typed object (often a TypedDict) passed through the graph; nodes read and update it. Reducers control how updates merge.",
            "**Nodes** — Python functions that take the state and return an update. A node can call a model, a tool, or a whole subgraph.",
            "**Edges** — connections between nodes. **Conditional edges** route based on the state, enabling branching and loops.",
            "**Compile & run** — you build the graph, compile it, then invoke it with an initial state; execution follows the edges.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A graph with a tool-calling loop",
          code: `from langgraph.graph import StateGraph, END

g = StateGraph(State)
g.add_node("agent", call_model)
g.add_node("tools", run_tools)
g.set_entry_point("agent")

def route(state):                       # conditional edge
    return "tools" if state["tool_calls"] else END

g.add_conditional_edges("agent", route)
g.add_edge("tools", "agent")            # loop back — the agent loop!
app = g.compile()
result = app.invoke({"messages": [user_msg]})`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Cycles make it an agent framework",
          text: "Unlike a plain DAG pipeline, LangGraph allows cycles — a node routing back to an earlier one. That loop *is* the agent loop, and explicit conditional edges let you control exactly when it continues, branches, or stops.",
        },
        { type: "h3", text: "Why teams pick it" },
        {
          type: "list",
          items: [
            "**Control & transparency** — the flow is an explicit graph you can see, test, and reason about node by node.",
            "**Durable execution & checkpointing** — state can be persisted, so runs survive restarts and support time-travel debugging.",
            "**Human-in-the-loop** — built-in interrupts let you pause for approval and resume.",
            "**Any topology** — single agent, supervisor, or network — all expressible as graphs.",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "Lower-level by design",
          text: "LangGraph gives you primitives, not opinions. That means more boilerplate than CrewAI but precise control — favored for complex, stateful, production agents where you need to own the flow.",
        },
      ],
      takeaways: [
        "LangGraph models agent systems as a graph: nodes (steps) and edges (routing) over a shared, typed state.",
        "Conditional edges enable branching and cycles — and a cycle back to the agent node is the agent loop.",
        "Strengths: explicit control/transparency, durable execution & checkpointing, human-in-the-loop interrupts, any topology.",
        "It's lower-level than CrewAI — more boilerplate, more control — suited to complex stateful production agents.",
      ],
      flashcards: [
        { front: "How does LangGraph model an agent system?", back: "As a graph of nodes (steps) and edges (routing) operating over a shared, typed state object; conditional edges allow branching and cycles." },
        { front: "What makes LangGraph an agent framework rather than a DAG pipeline?", back: "It allows cycles — a node can route back to an earlier one, and that loop is the agent loop, controlled by conditional edges." },
        { front: "Name two production features LangGraph emphasizes.", back: "Durable execution/checkpointing (resume after restart, time-travel debugging) and built-in human-in-the-loop interrupts (any two of: control/transparency, durability, HITL, any topology)." },
      ],
      quiz: [
        {
          q: "In LangGraph, what enables branching and loops?",
          options: ["The model size", "Conditional edges that route based on the shared state", "The temperature", "A vector store"],
          answer: 1,
          explain: "Conditional edges inspect the state and decide the next node — enabling branches and cycles (the agent loop).",
        },
        {
          q: "Compared to CrewAI, LangGraph is generally…",
          options: [
            "Higher-level with less control",
            "Lower-level: more boilerplate but more precise control over flow and state",
            "Only for single agents",
            "Unable to loop",
          ],
          answer: 1,
          explain: "LangGraph offers fine-grained, explicit control (graphs, state, cycles) at the cost of more wiring.",
        },
      ],
    },

    {
      slug: "autogen",
      title: "AutoGen: conversational agents",
      summary:
        "Microsoft's AutoGen frames multi-agent work as a conversation between agents. Agents message each other to solve a task, with humans able to join the chat.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Agents that talk it out" },
        {
          type: "p",
          text: "**AutoGen** (Microsoft Research) centers on **conversation**: agents collaborate by exchanging messages, like colleagues in a group chat working toward a goal. You define agents, drop them into a conversation, and they message back and forth until the task is done.",
        },
        { type: "diagram", name: "autogen-chat", caption: "AutoGen agents collaborate by messaging each other (and optionally a human) in a managed conversation." },
        { type: "h3", text: "Key pieces" },
        {
          type: "list",
          items: [
            "**ConversableAgent** — the base agent that can send and receive messages and call tools.",
            "**AssistantAgent** — an LLM-backed agent that solves tasks and writes/uses code.",
            "**UserProxyAgent** — represents the human (or auto-executes code/tools on their behalf), enabling human-in-the-loop.",
            "**GroupChat + manager** — coordinates several agents, choosing who speaks next.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A two-agent conversation (conceptual)",
          code: `assistant = AssistantAgent("assistant", llm_config=cfg)
user = UserProxyAgent(
    "user",
    human_input_mode="NEVER",      # or "ALWAYS" to keep a human in the loop
    code_execution_config={"work_dir": "out"},
)
user.initiate_chat(assistant, message="Plot and save the GDP of 3 countries.")
# They converse: assistant writes code, user_proxy runs it, results feed back.`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Conversation as the coordination mechanism",
          text: "Where LangGraph wires a graph and CrewAI assigns tasks, AutoGen's organizing idea is dialogue. It's strong for code-writing/execution loops and for keeping a human naturally in the conversation. Its newer versions (AG2 / AutoGen 0.4+) add an event-driven, async core.",
        },
        {
          type: "callout",
          kind: "note",
          title: "Flexible, sometimes chatty",
          text: "Free-form agent conversation is powerful but can ramble or loop. Use clear termination conditions, a capable group-chat manager, and roles tight enough that the dialogue converges.",
        },
      ],
      takeaways: [
        "AutoGen frames multi-agent collaboration as a conversation — agents message each other to solve a task.",
        "Core agents: ConversableAgent, AssistantAgent (LLM/code), UserProxyAgent (human/executor), plus GroupChat + manager.",
        "It excels at code-writing/execution loops and natural human-in-the-loop participation.",
        "Free-form dialogue can ramble — use termination conditions, a strong manager, and tight roles.",
      ],
      flashcards: [
        { front: "What is AutoGen's central organizing concept?", back: "Conversation — agents collaborate by exchanging messages (like a group chat) until the task is complete." },
        { front: "What is a UserProxyAgent in AutoGen?", back: "An agent representing the human — it can request human input and/or auto-execute code and tools on the user's behalf, enabling human-in-the-loop." },
        { front: "What coordinates multiple AutoGen agents?", back: "A GroupChat with a manager that decides which agent speaks next." },
      ],
      quiz: [
        {
          q: "How do AutoGen agents primarily coordinate?",
          options: ["A shared graph state", "Exchanging messages in a conversation", "A vector database", "Fixed code pipelines only"],
          answer: 1,
          explain: "AutoGen's organizing idea is dialogue — agents message each other (and optionally a human) to solve the task.",
        },
        {
          q: "Which AutoGen agent enables human-in-the-loop and code execution?",
          options: ["AssistantAgent", "UserProxyAgent", "GroupChat", "StateGraph"],
          answer: 1,
          explain: "The UserProxyAgent represents the human and can request input or execute code/tools on their behalf.",
        },
      ],
    },

    {
      slug: "openai-agents-sdk",
      title: "OpenAI Agents SDK & Swarm",
      summary:
        "A deliberately minimal framework built on two primitives — agents and handoffs — plus guardrails and tracing. Light, ergonomic, and provider-flexible.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Minimalism as a feature" },
        {
          type: "p",
          text: "OpenAI's **Agents SDK** (the production successor to the experimental **Swarm**) bets on simplicity. Rather than many abstractions, it offers a tiny set: **agents**, **handoffs**, **guardrails**, **sessions**, and **tracing**. The philosophy: enough to be useful, little enough to learn in an afternoon.",
        },
        { type: "diagram", name: "handoff", caption: "The Agents SDK's core move: an agent hands off control to a more specialized agent." },
        { type: "h3", text: "The primitives" },
        {
          type: "compare",
          columns: ["Primitive", "What it does"],
          rows: [
            { label: "Agent", cells: ["An LLM with instructions, tools, and an optional output type."] },
            { label: "Handoff", cells: ["A tool that transfers control to another agent (routing/delegation)."] },
            { label: "Guardrails", cells: ["Validations that run on inputs/outputs in parallel, halting on violation."] },
            { label: "Sessions", cells: ["Automatic conversation history across runs."] },
            { label: "Tracing", cells: ["Built-in visualization of the agent run for debugging and eval."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Agents and handoffs",
          code: `from agents import Agent, Runner

billing = Agent(name="Billing", instructions="Handle billing issues.")
tech = Agent(name="Tech", instructions="Handle technical issues.")
triage = Agent(
    name="Triage",
    instructions="Route the user to the right specialist.",
    handoffs=[billing, tech],          # handoffs are first-class
)
result = Runner.run_sync(triage, "My card was charged twice.")`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Two ideas go a long way",
          text: "Agents + handoffs cover a surprising range: routing, delegation, and specialist teams all fall out of those two primitives. Guardrails and tracing add the production essentials without ceremony.",
        },
        {
          type: "callout",
          kind: "note",
          title: "Provider-flexible, lightweight",
          text: "Despite the name, the Agents SDK works with many model providers (anything with a Chat Completions-style API), not only OpenAI. It's a good fit when you want ergonomics and minimal lock-in over heavyweight features.",
        },
      ],
      takeaways: [
        "The OpenAI Agents SDK (successor to Swarm) is deliberately minimal: agents, handoffs, guardrails, sessions, tracing.",
        "Agents + handoffs alone cover routing, delegation, and specialist teams.",
        "Guardrails validate inputs/outputs (halting on violation) and built-in tracing aids debugging/eval.",
        "It's lightweight and provider-flexible — good when you value ergonomics and low lock-in.",
      ],
      flashcards: [
        { front: "What two primitives are at the heart of the OpenAI Agents SDK?", back: "Agents (an LLM with instructions/tools) and handoffs (a tool that transfers control to another agent)." },
        { front: "What are guardrails in the Agents SDK?", back: "Validations that run on agent inputs/outputs (in parallel) and halt execution when a check is violated." },
        { front: "Is the OpenAI Agents SDK limited to OpenAI models?", back: "No — it's provider-flexible, working with many models that expose a Chat Completions-style API." },
      ],
      quiz: [
        {
          q: "The OpenAI Agents SDK's design philosophy is best described as…",
          options: [
            "Maximal abstraction",
            "Minimalism — a few primitives (agents, handoffs, guardrails, tracing)",
            "Graph-based state machines",
            "Conversation-only",
          ],
          answer: 1,
          explain: "It intentionally keeps a tiny primitive set so it's quick to learn and unopinionated.",
        },
        {
          q: "Routing a user to a specialist in the Agents SDK uses…",
          options: ["A new model", "A handoff", "A vector database", "A reducer"],
          answer: 1,
          explain: "Handoffs transfer control to a more specialized agent — the SDK's core routing/delegation mechanism.",
        },
      ],
    },

    {
      slug: "choosing-a-framework",
      title: "Choosing a framework",
      summary:
        "CrewAI, LangGraph, AutoGen, Agents SDK, or none? Match the framework to your need for control, your topology, and your tolerance for abstraction.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "There's no single best — only best-for" },
        {
          type: "p",
          text: "Every framework wraps the same fundamentals (a model in a loop with tools); they differ in *abstraction level* and *organizing metaphor*. Choose by how much control you need and how your problem is naturally shaped.",
        },
        { type: "diagram", name: "framework-stack", caption: "From high-level/opinionated to low-level/controllable — pick the rung that matches your need for control." },
        { type: "h3", text: "A quick map" },
        {
          type: "compare",
          caption: "Framework cheat-sheet",
          columns: ["Framework", "Metaphor", "Sweet spot"],
          rows: [
            { label: "CrewAI", cells: ["Role-playing team", "Fast to build, intuitive role-based crews"] },
            { label: "LangGraph", cells: ["Stateful graph", "Maximum control, complex stateful production agents"] },
            { label: "AutoGen", cells: ["Conversation", "Code-exec loops, research, human-in-the-loop dialogue"] },
            { label: "Agents SDK", cells: ["Agents + handoffs", "Lightweight, ergonomic, low lock-in"] },
            { label: "No framework", cells: ["Your own loop", "Full control, minimal deps, learning the fundamentals"] },
          ],
        },
        { type: "h3", text: "Questions to decide" },
        {
          type: "list",
          items: [
            "**How much control do you need?** Fine-grained flow/state → LangGraph or roll your own. Quick assembly → CrewAI or Agents SDK.",
            "**What's the natural shape?** A team of roles → CrewAI. A conversation → AutoGen. A graph/state machine → LangGraph. Routing to specialists → Agents SDK.",
            "**Production needs?** Durable state, checkpointing, HITL interrupts → LangGraph. Built-in tracing → Agents SDK.",
            "**Team familiarity & ecosystem?** Lean toward what your team can debug at 2am.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Don't start with a framework — start with the task",
          text: "Frameworks add abstraction (and hidden prompts) you may not need. Prototype the task with direct model calls first; you'll understand the loop, then adopt the framework that removes *your* boilerplate — not the one with the best landing page.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Abstraction can obscure",
          text: "Heavy frameworks hide what's actually sent to the model, making debugging and cost control harder. Whatever you choose, keep the ability to inspect the real prompts, tool calls, and tokens.",
        },
      ],
      takeaways: [
        "All frameworks wrap the same fundamentals; they differ in abstraction level and organizing metaphor.",
        "Rough map: CrewAI (role teams), LangGraph (stateful graphs/control), AutoGen (conversation), Agents SDK (agents+handoffs), or none.",
        "Choose by control needed, the problem's natural shape, production features, and team familiarity.",
        "Prototype with direct calls first; pick the framework that removes your boilerplate and never lose visibility into real prompts/tokens.",
      ],
      flashcards: [
        { front: "Match metaphor to framework: role team, stateful graph, conversation, agents+handoffs.", back: "Role team → CrewAI; stateful graph → LangGraph; conversation → AutoGen; agents+handoffs → OpenAI Agents SDK." },
        { front: "What should you do before choosing a framework?", back: "Prototype the task with direct model calls to learn the loop, then adopt the framework that removes your specific boilerplate." },
        { front: "Which framework is favored for fine-grained control, durable state, and HITL interrupts?", back: "LangGraph — explicit graphs/state, checkpointing, and built-in human-in-the-loop interrupts." },
      ],
      quiz: [
        {
          q: "Your problem is naturally a team of specialized roles and you want to build fast. Best fit?",
          options: ["LangGraph", "CrewAI", "Raw sockets", "A spreadsheet"],
          answer: 1,
          explain: "CrewAI's role-playing-team metaphor makes role-based crews quick and intuitive to assemble.",
        },
        {
          q: "What's a key risk of heavy agent frameworks?",
          options: [
            "They can't use tools",
            "They hide the real prompts/tokens, making debugging and cost control harder",
            "They only run on GPUs",
            "They forbid handoffs",
          ],
          answer: 1,
          explain: "Abstraction can obscure what's actually sent to the model — keep visibility into prompts, tool calls, and tokens.",
        },
      ],
    },
  ],
};
