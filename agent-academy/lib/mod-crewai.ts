import type { Module } from "./types";

export const crewai: Module = {
  id: "crewai",
  title: "CrewAI Deep Dive",
  blurb:
    "A role-based multi-agent framework. Model your problem as a crew of agents working through tasks — sequential or hierarchical — then graduate to event-driven Flows.",
  accent: "iris",
  lessons: [
    {
      slug: "crewai-intro",
      title: "CrewAI: agents, tasks & crews",
      summary:
        "CrewAI models a team of role-playing agents collaborating on tasks. Three primitives — Agent, Task, Crew — cover most of what you'll build.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Think in teams" },
        {
          type: "p",
          text: "**CrewAI** is a popular open-source Python framework for multi-agent systems. Its mental model is a *company*: you assemble a **crew** of **agents**, each with a role, and give them **tasks** to complete. It's lightweight, standalone (not built on LangChain), and tuned for intuitive role-based collaboration.",
        },
        { type: "diagram", name: "crewai-crew", caption: "A Crew binds role-playing Agents to Tasks and runs them under a Process." },
        { type: "h3", text: "The three core primitives" },
        {
          type: "compare",
          columns: ["Primitive", "What it is"],
          rows: [
            { label: "Agent", cells: ["An autonomous role-player defined by a role, goal, and backstory, with its own LLM and tools."] },
            { label: "Task", cells: ["A unit of work: a description and an expected_output, assigned to an agent."] },
            { label: "Crew", cells: ["The team — a set of agents and tasks run under a chosen process (sequential or hierarchical)."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A minimal crew",
          code: `from crewai import Agent, Task, Crew, Process

researcher = Agent(
    role="Senior Research Analyst",
    goal="Find the latest, credible facts on {topic}",
    backstory="You are meticulous and cite sources.",
    tools=[search_tool],
)
writer = Agent(
    role="Tech Writer",
    goal="Turn research into a clear brief",
    backstory="You write tight, jargon-free prose.",
)

research = Task(
    description="Research {topic} and list key findings.",
    expected_output="5 bullet points with sources.",
    agent=researcher,
)
write = Task(
    description="Write a 200-word brief from the findings.",
    expected_output="A polished 200-word brief.",
    agent=writer,
    context=[research],          # receives the research task's output
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research, write],
    process=Process.sequential,
)
result = crew.kickoff(inputs={"topic": "agentic AI"})`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Role + goal + backstory is the prompt",
          text: "CrewAI compiles an agent's role, goal, and backstory into its system prompt. These aren't flavor text — concrete, specific roles measurably improve behavior. 'Senior Research Analyst who cites sources' beats 'helpful assistant'.",
        },
        {
          type: "callout",
          kind: "note",
          title: "Tasks pass context explicitly",
          text: "A task's context=[...] field wires the outputs of earlier tasks into a later one. That's how the writer 'sees' the researcher's findings — the dependency is declared, not implicit.",
        },
        {
          type: "p",
          text: "Call `crew.kickoff()` and CrewAI runs the tasks under the chosen process, passing context along, and returns the final result. From here, the depth is in how you design agents, tasks, processes, tools, and memory.",
        },
      ],
      takeaways: [
        "CrewAI models multi-agent work as a crew of role-playing agents completing tasks — a 'company' metaphor.",
        "Three primitives: Agent (role/goal/backstory + LLM + tools), Task (description + expected_output + agent), Crew (the team + process).",
        "An agent's role, goal, and backstory compile into its system prompt; be specific.",
        "Tasks wire dependencies explicitly via context=[...]; kickoff() runs the crew and returns the result.",
      ],
      flashcards: [
        { front: "What are CrewAI's three core primitives?", back: "Agent (a role-player with role/goal/backstory, LLM, tools), Task (description + expected_output, assigned to an agent), and Crew (agents + tasks run under a process)." },
        { front: "What defines a CrewAI Agent's behavior most?", back: "Its role, goal, and backstory — these compile into the system prompt, so specific, concrete roles improve performance." },
        { front: "How does one CrewAI task receive another task's output?", back: "Via the context=[...] field, which explicitly wires earlier tasks' outputs into a later task." },
      ],
      quiz: [
        {
          q: "In CrewAI, what is a Task?",
          options: [
            "The LLM provider",
            "A unit of work with a description and expected_output, assigned to an agent",
            "A vector database",
            "The system prompt",
          ],
          answer: 1,
          explain: "A Task describes work to do and the expected output, and is assigned to an agent (optionally wired to other tasks via context).",
        },
        {
          q: "Why does CrewAI emphasize role, goal, and backstory?",
          options: [
            "They're decorative only",
            "They compile into the agent's system prompt, and specific roles improve behavior",
            "They set the temperature",
            "They choose the database",
          ],
          answer: 1,
          explain: "These fields become the agent's system prompt; concrete roles measurably steer the agent better than generic ones.",
        },
      ],
    },

    {
      slug: "crewai-agents-tasks",
      title: "Designing agents & tasks",
      summary:
        "Good crews come from sharp agent roles and well-scoped tasks. Learn the design moves that make CrewAI agents reliable rather than rambling.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Specific beats generic" },
        {
          type: "p",
          text: "The most common CrewAI mistake is vague agents and tasks. 'Researcher: research things' produces mush. Sharp, narrow definitions — a clear role, a single goal, an explicit expected output — produce reliable work. Design agents like you'd write a job description and tasks like you'd write a ticket.",
        },
        { type: "h3", text: "Designing an agent" },
        {
          type: "list",
          items: [
            "**Role** — a specific job title, not 'assistant'. 'Financial Analyst specializing in SaaS metrics.'",
            "**Goal** — one clear objective the agent optimizes for.",
            "**Backstory** — context and personality that shape tone and standards ('you double-check every number').",
            "**Tools** — only the tools this role needs; extra tools dilute selection.",
            "**llm** — right-size the model to the role's difficulty; reasoning-heavy roles get a stronger model.",
          ],
        },
        { type: "h3", text: "Designing a task" },
        {
          type: "list",
          items: [
            "**description** — precise instructions for *this* unit of work, including any input placeholders like {topic}.",
            "**expected_output** — describe the exact shape and quality of a good result. This is your most powerful lever.",
            "**agent** — who owns it (or let a hierarchical manager assign).",
            "**context** — the earlier tasks whose outputs this one needs.",
            "**structured output** — use output_json or output_pydantic to get typed, validated results instead of prose.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A task with structured output",
          code: `from pydantic import BaseModel

class Finding(BaseModel):
    claim: str
    source: str

class Report(BaseModel):
    findings: list[Finding]

research = Task(
    description="Research {topic}; capture each claim with its source.",
    expected_output="A Report object with 5 findings, each citing a source.",
    agent=researcher,
    output_pydantic=Report,        # validated, typed result
)`,
        },
        {
          type: "callout",
          kind: "key",
          title: "expected_output is the contract",
          text: "Agents drift without a target. A concrete expected_output — format, length, must-include fields — anchors the agent and makes results checkable. Treat it as the acceptance criteria for the task.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Let agents delegate (carefully)",
          text: "Setting allow_delegation=True lets an agent ask teammates for help via a built-in delegation tool. Powerful for collaboration, but it adds chatter and cost — enable it where collaboration genuinely helps, not by default.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "One task, one job",
          text: "Cramming multiple objectives into a single task ('research, then write, then format') invites the agent to do all of them poorly. Split into focused tasks wired by context — each agent does one thing well.",
        },
      ],
      takeaways: [
        "Define agents like a job description: specific role, single goal, shaping backstory, only-needed tools, right-sized LLM.",
        "Define tasks like a ticket: precise description, a concrete expected_output, owner, and context dependencies.",
        "expected_output is the contract that anchors the agent and makes results checkable; use output_pydantic/json for typed results.",
        "Keep one job per task and enable allow_delegation only where collaboration clearly pays for its overhead.",
      ],
      flashcards: [
        { front: "What is the single most powerful lever on a CrewAI task's quality?", back: "A concrete expected_output — the format, length, and required fields of a good result. It acts as the task's acceptance criteria." },
        { front: "How do you get typed, validated output from a CrewAI task?", back: "Set output_pydantic (a Pydantic model) or output_json on the task, so the result is structured rather than free prose." },
        { front: "What does allow_delegation=True do, and what's the trade-off?", back: "It lets an agent ask teammates for help via a delegation tool — enabling collaboration at the cost of extra chatter and tokens." },
      ],
      quiz: [
        {
          q: "An agent keeps producing off-target results. Which fix helps most?",
          options: [
            "Remove its role",
            "Write a concrete expected_output describing the exact desired result",
            "Add ten more tools",
            "Raise the temperature",
          ],
          answer: 1,
          explain: "expected_output is the contract that anchors the agent; vague targets cause drift.",
        },
        {
          q: "Best practice for a task that says 'research, write, and format a report'?",
          options: [
            "Keep it as one big task",
            "Split it into focused tasks (research → write → format) wired via context",
            "Delete the expected_output",
            "Use a smaller model",
          ],
          answer: 1,
          explain: "One job per task; chain focused tasks with context so each agent does one thing well.",
        },
      ],
    },

    {
      slug: "crewai-processes",
      title: "Processes: sequential & hierarchical",
      summary:
        "A crew's process decides how tasks get executed. Sequential runs them in order; hierarchical adds a manager agent that plans and delegates.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "How the crew actually runs" },
        {
          type: "p",
          text: "The **process** is CrewAI's execution strategy. The two built-in options map directly onto orchestration topologies you already know: **sequential** is a pipeline, and **hierarchical** is the supervisor pattern with an automatic manager.",
        },
        { type: "diagram", name: "crewai-process", caption: "Sequential: tasks run in order. Hierarchical: a manager agent plans, delegates, and validates." },
        { type: "h3", text: "Sequential" },
        {
          type: "p",
          text: "Tasks execute in the order listed, each receiving the previous outputs as context. Predictable, transparent, and the right default for a known pipeline (research → write → edit).",
        },
        { type: "h3", text: "Hierarchical" },
        {
          type: "p",
          text: "You supply a **manager** (via `manager_llm` or a custom `manager_agent`). CrewAI auto-creates a manager that breaks the goal into work, **delegates** tasks to the best-suited agents, reviews their output, and decides what's next. Tasks don't need to be pre-assigned — the manager assigns them. This is the supervisor topology, batteries included.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Switching processes",
          code: `# Pipeline: tasks in order
crew = Crew(agents=[...], tasks=[...], process=Process.sequential)

# Supervisor: a manager plans and delegates
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[...],
    process=Process.hierarchical,
    manager_llm="gpt-4o",        # the manager that delegates & reviews
)`,
        },
        {
          type: "compare",
          caption: "Choosing a process",
          columns: ["Process", "Maps to", "Use when"],
          rows: [
            { label: "Sequential", cells: ["Pipeline", "The steps are known and ordered"] },
            { label: "Hierarchical", cells: ["Supervisor", "Work needs dynamic planning/delegation across agents"] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Start sequential, escalate to hierarchical",
          text: "Sequential is cheaper and easier to debug — use it whenever the order is known. Switch to hierarchical when a manager genuinely needs to decide *which* agent does *what* at runtime. The manager adds an extra LLM in the loop, so it costs more.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "The manager needs a capable model",
          text: "In hierarchical mode the manager does the planning and delegation — give manager_llm a strong model. A weak manager mis-delegates and the whole crew underperforms.",
        },
      ],
      takeaways: [
        "A crew's process is its execution strategy: sequential (pipeline) or hierarchical (supervisor with a manager).",
        "Sequential runs tasks in listed order, each receiving prior outputs — predictable and the default.",
        "Hierarchical adds a manager (manager_llm/manager_agent) that plans, delegates, and reviews; tasks needn't be pre-assigned.",
        "Start sequential; escalate to hierarchical only for dynamic delegation, and give the manager a strong model.",
      ],
      flashcards: [
        { front: "What are CrewAI's two built-in processes and their analogues?", back: "Sequential (a pipeline — tasks in order) and hierarchical (the supervisor pattern — a manager agent plans and delegates)." },
        { front: "In hierarchical mode, how are tasks assigned?", back: "A manager agent (manager_llm or manager_agent) breaks down the goal and delegates tasks to the best-suited agents, then reviews their output." },
        { front: "Why give the manager a strong model in hierarchical mode?", back: "The manager does the planning and delegation; a weak manager mis-delegates and degrades the whole crew." },
      ],
      quiz: [
        {
          q: "Which CrewAI process corresponds to the supervisor topology?",
          options: ["Sequential", "Hierarchical", "Parallel", "Network"],
          answer: 1,
          explain: "Hierarchical adds a manager agent that delegates and reviews — exactly the supervisor pattern.",
        },
        {
          q: "When is sequential the better choice?",
          options: [
            "When the steps are known and ordered",
            "When you need runtime delegation decisions",
            "Always avoid it",
            "Only with one agent",
          ],
          answer: 0,
          explain: "A known, ordered pipeline runs cheaply and transparently as sequential; hierarchical is for dynamic delegation.",
        },
      ],
    },

    {
      slug: "crewai-tools-memory",
      title: "Tools, memory & collaboration",
      summary:
        "Equip a crew: give agents tools, turn on memory so they learn within and across runs, and let them delegate to each other.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Making a crew capable" },
        {
          type: "p",
          text: "Roles and tasks define *what* a crew does; tools, memory, and collaboration define *how well*. CrewAI gives each a clean on-ramp.",
        },
        { type: "h3", text: "Tools" },
        {
          type: "p",
          text: "Agents get tools via the `tools=[...]` list. Use the `crewai-tools` library for ready-made ones (web search, file read, scraping, RAG), or write your own by subclassing `BaseTool` (or decorating a function). Tools can be attached at the agent level or per task.",
        },
        {
          type: "code",
          lang: "python",
          caption: "A custom tool",
          code: `from crewai.tools import BaseTool

class WeatherTool(BaseTool):
    name: str = "get_weather"
    description: str = "Get current weather for a city."
    def _run(self, city: str) -> str:
        return weather_api(city)

researcher = Agent(role="Analyst", goal="...", tools=[WeatherTool()])`,
        },
        { type: "h3", text: "Memory" },
        {
          type: "p",
          text: "Set `memory=True` on a crew to enable CrewAI's memory system, which combines several layers so agents stay coherent and improve over time.",
        },
        {
          type: "compare",
          caption: "CrewAI memory layers",
          columns: ["Layer", "Holds"],
          rows: [
            { label: "Short-term", cells: ["Context for the current run — recent steps and results."] },
            { label: "Long-term", cells: ["Insights persisted across runs, so the crew learns from past executions."] },
            { label: "Entity", cells: ["Facts about specific people, places, and things encountered."] },
            { label: "Contextual", cells: ["A blend that assembles the relevant memory for each step."] },
          ],
        },
        { type: "h3", text: "Collaboration" },
        {
          type: "p",
          text: "With `allow_delegation=True`, agents can hand subquestions to teammates and ask each other questions through built-in delegation tools. In hierarchical crews the manager orchestrates this automatically. Collaboration is what turns a list of agents into an actual team.",
        },
        {
          type: "callout",
          kind: "key",
          title: "Memory makes a crew improve over time",
          text: "Short-term memory keeps one run coherent; long-term memory lets the crew carry lessons between runs (e.g. remembering a data source worked well). Enable it when continuity matters — it adds storage and retrieval overhead.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Capability isn't free",
          text: "Each tool the agent can pick, each memory lookup, and each delegation adds tokens and latency. Give agents only the tools they need, enable memory where it pays, and reserve delegation for genuine collaboration.",
        },
      ],
      takeaways: [
        "Agents get tools via tools=[...] — use crewai-tools or subclass BaseTool for custom ones.",
        "memory=True enables layered memory: short-term (this run), long-term (across runs), entity, and contextual.",
        "allow_delegation=True lets agents ask teammates for help; hierarchical crews orchestrate this via the manager.",
        "Every tool, memory lookup, and delegation costs tokens/latency — add capability deliberately.",
      ],
      flashcards: [
        { front: "How do you add a custom tool in CrewAI?", back: "Subclass BaseTool (set name, description, implement _run) or decorate a function, then pass it in an agent's or task's tools=[...] list." },
        { front: "What memory layers does CrewAI provide?", back: "Short-term (current run), long-term (across runs), entity (facts about specific things), and contextual (assembles relevant memory per step) — enabled via memory=True." },
        { front: "What is the benefit of long-term memory in a crew?", back: "The crew carries lessons between runs (e.g. which sources worked), so it improves over time rather than starting fresh each execution." },
      ],
      quiz: [
        {
          q: "How do you enable CrewAI's memory system?",
          options: ["Install a database manually", "Set memory=True on the Crew", "Set temperature=0", "Add more agents"],
          answer: 1,
          explain: "memory=True turns on the layered memory (short-term, long-term, entity, contextual).",
        },
        {
          q: "Which memory layer lets a crew learn from previous executions?",
          options: ["Short-term", "Long-term", "Entity", "None"],
          answer: 1,
          explain: "Long-term memory persists insights across runs so the crew improves over time.",
        },
      ],
    },

    {
      slug: "crewai-flows",
      title: "CrewAI Flows",
      summary:
        "Crews are autonomous teams; Flows are event-driven orchestration with explicit control and state. Combine them: deterministic Flows that invoke autonomous Crews.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "When autonomy needs structure" },
        {
          type: "p",
          text: "A Crew is great when you want agents to collaborate autonomously. But production pipelines often need *precise control* — run this, branch on that, retry here, keep this state. **Flows** are CrewAI's answer: lightweight, event-driven orchestration that you control in code, and that can launch Crews as steps.",
        },
        { type: "diagram", name: "crewai-flow", caption: "Flows wire steps with @start/@listen/@router and carry state; a step can kick off a whole Crew." },
        { type: "h3", text: "The building blocks" },
        {
          type: "list",
          items: [
            "**@start()** — marks the entry point(s) of the flow.",
            "**@listen(step)** — runs when the named step emits its result, receiving that output.",
            "**@router(step)** — branches: returns a label that decides which listener fires next.",
            "**State** — a shared object (a dict, or a typed Pydantic model for *structured* state) that persists across steps.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A simple flow with branching and state",
          code: `from crewai.flow.flow import Flow, start, listen, router

class ReviewFlow(Flow):
    @start()
    def draft(self):
        self.state["draft"] = writing_crew.kickoff(self.state)  # a Crew as a step
        return self.state["draft"]

    @router(draft)
    def check(self, draft):
        return "revise" if needs_work(draft) else "publish"

    @listen("revise")
    def revise(self):
        ...   # loop back or refine

    @listen("publish")
    def publish(self):
        ...   # ship it`,
        },
        { type: "h3", text: "Crews vs. Flows" },
        {
          type: "compare",
          columns: ["", "Crew", "Flow"],
          rows: [
            { label: "Control", cells: ["Autonomous — agents decide", "Explicit — you wire the steps"] },
            { label: "Best for", cells: ["Open-ended collaboration", "Deterministic pipelines, branching, retries"] },
            { label: "State", cells: ["Via memory/context", "First-class, persisted across steps"] },
            { label: "Analogy", cells: ["A self-organizing team", "An event-driven workflow engine"] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Use both: Flows orchestrate Crews",
          text: "The recommended production pattern is a Flow for the deterministic backbone — control flow, branching, state, error handling — with autonomous Crews invoked at the steps that need open-ended reasoning. Structure on the outside, autonomy on the inside.",
        },
        {
          type: "callout",
          kind: "note",
          title: "This is the workflow/agent spectrum again",
          text: "Flows are CrewAI's 'workflow' end (you control the path); Crews are the 'agent' end (the model controls it). Combining them is just the lesson from Foundations: add only as much autonomy as each step needs.",
        },
      ],
      takeaways: [
        "Flows are CrewAI's event-driven, code-controlled orchestration; Crews are autonomous agent teams.",
        "Flow building blocks: @start (entry), @listen (react to a step's output), @router (branch), and persistent state.",
        "Use structured (Pydantic) state for type-safe data carried across steps.",
        "Best practice: a deterministic Flow as the backbone that invokes autonomous Crews where open-ended reasoning is needed.",
      ],
      flashcards: [
        { front: "Crew vs. Flow in CrewAI?", back: "A Crew is an autonomous team of collaborating agents; a Flow is event-driven, code-controlled orchestration with explicit steps and persistent state." },
        { front: "What do @start, @listen, and @router do in a Flow?", back: "@start marks the entry point; @listen(step) runs when that step emits output; @router(step) branches by returning a label that picks the next listener." },
        { front: "What's the recommended way to combine Crews and Flows?", back: "Use a deterministic Flow as the backbone (control flow, branching, state, error handling) that invokes autonomous Crews at steps needing open-ended reasoning." },
      ],
      quiz: [
        {
          q: "What is a CrewAI Flow best suited for?",
          options: [
            "Fully autonomous, open-ended collaboration",
            "Deterministic, event-driven orchestration with branching and persistent state",
            "Storing embeddings",
            "Replacing the LLM",
          ],
          answer: 1,
          explain: "Flows give explicit, code-controlled orchestration — branching, retries, and first-class state.",
        },
        {
          q: "The recommended production pattern combines them how?",
          options: [
            "Only ever use Crews",
            "A Flow as the controlled backbone that invokes autonomous Crews where needed",
            "Only ever use Flows",
            "Never mix them",
          ],
          answer: 1,
          explain: "Structure on the outside (Flow), autonomy on the inside (Crews) — as much autonomy as each step needs.",
        },
      ],
    },
  ],
};
