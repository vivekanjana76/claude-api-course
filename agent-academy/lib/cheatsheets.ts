import type { Accent } from "./types";

export interface CheatCommand {
  cmd: string;
  desc: string;
}

export interface CheatSection {
  title: string;
  commands: CheatCommand[];
}

export interface CheatSheet {
  id: string;
  tool: string;
  blurb: string;
  accent: Accent;
  sections: CheatSection[];
}

export const cheatsheets: CheatSheet[] = [
  {
    id: "crewai",
    tool: "CrewAI",
    blurb: "Agents, tasks, and crews — role-played specialists handing work down a defined pipeline.",
    accent: "iris",
    sections: [
      {
        title: "Setup",
        commands: [
          { cmd: "pip install crewai crewai-tools", desc: "The framework plus its bundled tool library." },
          { cmd: "crewai create crew my_crew", desc: "Scaffold a project with agents.yaml and tasks.yaml." },
          { cmd: "crewai run", desc: "Run the crew defined in the current project." },
          { cmd: "crewai install", desc: "Install the project's dependencies into its virtualenv." },
        ],
      },
      {
        title: "Agents",
        commands: [
          { cmd: "Agent(role=…, goal=…, backstory=…)", desc: "The three fields are the prompt. Vague roles produce vague work." },
          { cmd: "llm=LLM(model=\"claude-opus-5\")", desc: "Pin the model per agent — researchers and writers rarely need the same tier." },
          { cmd: "tools=[SerperDevTool(), FileReadTool()]", desc: "Attach tools to the agent that needs them, not to every agent." },
          { cmd: "allow_delegation=False", desc: "Off by default is the safer default; delegation multiplies calls fast." },
          { cmd: "max_iter=15", desc: "Cap the agent's internal loop before it caps your budget." },
          { cmd: "verbose=True", desc: "Print the reasoning and tool calls — the only practical way to debug a crew." },
        ],
      },
      {
        title: "Tasks & crews",
        commands: [
          { cmd: "Task(description=…, expected_output=…, agent=a)", desc: "expected_output is the contract; without it the handoff is a guess." },
          { cmd: "context=[task1, task2]", desc: "Pass upstream results explicitly. Implicit context is where crews quietly break." },
          { cmd: "output_pydantic=MyModel", desc: "Force a structured result instead of prose the next task has to parse." },
          { cmd: "Crew(agents=[…], tasks=[…], process=Process.sequential)", desc: "Sequential runs tasks in order — start here." },
          { cmd: "process=Process.hierarchical, manager_llm=…", desc: "A manager agent plans and delegates; more capable, far less predictable." },
          { cmd: "crew.kickoff(inputs={\"topic\": …})", desc: "Run it; inputs interpolate into the {placeholders} in your descriptions." },
          { cmd: "crew.kickoff_for_each(inputs=[…])", desc: "Fan the same crew over a list of inputs." },
          { cmd: "memory=True", desc: "Share short- and long-term memory across the crew's agents." },
        ],
      },
    ],
  },
  {
    id: "langgraph",
    tool: "LangGraph",
    blurb: "State, nodes, and edges — an agent expressed as a graph you can inspect and resume.",
    accent: "teal",
    sections: [
      {
        title: "Building the graph",
        commands: [
          { cmd: "pip install langgraph langchain-anthropic", desc: "The graph runtime plus the Anthropic chat model." },
          { cmd: "class State(TypedDict): messages: Annotated[list, add_messages]", desc: "The state schema. The reducer decides how updates merge." },
          { cmd: "g = StateGraph(State)", desc: "Every graph starts from its state type." },
          { cmd: "g.add_node(\"agent\", call_model)", desc: "A node is a function from state to a state update." },
          { cmd: "g.add_edge(START, \"agent\")", desc: "A fixed transition." },
          { cmd: "g.add_conditional_edges(\"agent\", should_continue)", desc: "The branch that makes it an agent rather than a pipeline." },
          { cmd: "graph = g.compile()", desc: "Compile before running; this is where structural errors surface." },
        ],
      },
      {
        title: "Running & persisting",
        commands: [
          { cmd: "graph.invoke({\"messages\": [...]})", desc: "Run to completion." },
          { cmd: "for ev in graph.stream(state, stream_mode=\"updates\"): …", desc: "Stream per-node updates — how you build a live trace view." },
          { cmd: "graph.compile(checkpointer=MemorySaver())", desc: "Persist state per thread so a run can be resumed." },
          { cmd: "config={\"configurable\": {\"thread_id\": \"abc\"}}", desc: "The conversation key. Same thread, same history." },
          { cmd: "graph.compile(interrupt_before=[\"tools\"])", desc: "Human-in-the-loop: pause before a consequential node." },
          { cmd: "graph.get_state(config)", desc: "Inspect where a paused run stopped and what it holds." },
          { cmd: "graph.update_state(config, {...})", desc: "Edit state, then resume — the approval-and-correction workflow." },
          { cmd: "{\"recursion_limit\": 25}", desc: "Hard stop on cycles. Without it, a loop bug becomes an invoice." },
        ],
      },
      {
        title: "Prebuilt & tools",
        commands: [
          { cmd: "create_react_agent(model, tools)", desc: "A working tool-calling agent in one line — the right starting point." },
          { cmd: "ToolNode(tools)", desc: "Executes whatever tool calls the last message asked for." },
          { cmd: "tools_condition", desc: "The stock router: to tools if a tool was called, otherwise END." },
          { cmd: "@tool def search(q: str) -> str:", desc: "The docstring becomes the tool description the model reads." },
          { cmd: "langgraph dev", desc: "Local server plus Studio — step through a graph visually." },
        ],
      },
    ],
  },
  {
    id: "anthropic",
    tool: "Anthropic tool loop",
    blurb: "What every framework is doing underneath — worth being able to write from memory.",
    accent: "amber",
    sections: [
      {
        title: "The loop",
        commands: [
          { cmd: "client.messages.create(model=\"claude-opus-5\", max_tokens=16000, tools=tools, messages=msgs)", desc: "One turn of the loop." },
          { cmd: "while resp.stop_reason == \"tool_use\": …", desc: "Execute the calls, append the results, call again until end_turn." },
          { cmd: "{\"type\": \"tool_result\", \"tool_use_id\": id, \"content\": out}", desc: "The result block you send back inside a user message." },
          { cmd: "# every tool_result in ONE user message", desc: "Splitting parallel results teaches the model to stop calling in parallel." },
          { cmd: "is_error: true", desc: "Report a failed tool as an error result — never drop the block." },
          { cmd: "thinking={\"type\": \"adaptive\"}", desc: "Let the model reason between tool calls; the current form on modern models." },
          { cmd: "client.beta.messages.tool_runner(...)", desc: "The SDK's own loop, with per-turn hooks for approval and logging." },
        ],
      },
      {
        title: "Keeping it bounded",
        commands: [
          { cmd: "max_steps = 20", desc: "A step ceiling you enforce yourself. Every production loop needs one." },
          { cmd: "output_config={\"task_budget\": {\"type\": \"tokens\", \"total\": 64000}}", desc: "Tell the model its budget so it paces itself instead of being cut off." },
          { cmd: "context_management={\"edits\": [{\"type\": \"clear_tool_uses_20250919\"}]}", desc: "Clear stale tool results before they crowd out the signal." },
          { cmd: "cache_control={\"type\": \"ephemeral\"}", desc: "Cache the stable prefix — a long tool list resent every turn is pure waste." },
          { cmd: "resp.usage.input_tokens / .output_tokens", desc: "Accumulate per iteration; agent cost is a sum, not a single call." },
        ],
      },
    ],
  },
  {
    id: "mcp",
    tool: "MCP",
    blurb: "Writing the integration once as a server, so every client that speaks the protocol can use it.",
    accent: "rose",
    sections: [
      {
        title: "Building a server",
        commands: [
          { cmd: "pip install \"mcp[cli]\"", desc: "The Python SDK with its command-line helpers." },
          { cmd: "mcp = FastMCP(\"my-server\")", desc: "The quickest path to a working server." },
          { cmd: "@mcp.tool() def search(q: str) -> str:", desc: "Expose a callable. The signature and docstring become the schema." },
          { cmd: "@mcp.resource(\"docs://{id}\")", desc: "Expose readable content rather than an action." },
          { cmd: "@mcp.prompt()", desc: "Expose a reusable prompt template the client can offer its user." },
          { cmd: "mcp.run(transport=\"stdio\")", desc: "stdio for local servers; HTTP/SSE when it has to be remote." },
        ],
      },
      {
        title: "Connecting & debugging",
        commands: [
          { cmd: "npx @modelcontextprotocol/inspector <cmd>", desc: "Interactive inspector — see the real tool list before wiring a client." },
          { cmd: "claude mcp add <name> -- <command>", desc: "Register a stdio server with Claude Code." },
          { cmd: "claude mcp list", desc: "Registered servers and their connection state." },
          { cmd: "mcp_servers=[{\"type\": \"url\", \"url\": …, \"name\": n}]", desc: "The API connector — only half of the request." },
          { cmd: "tools=[{\"type\": \"mcp_toolset\", \"mcp_server_name\": n}]", desc: "The other half; sending mcp_servers alone is a validation error." },
          { cmd: "# scope tools narrowly", desc: "A server is a security boundary. Broad tools plus untrusted input is the whole problem." },
        ],
      },
    ],
  },
];
