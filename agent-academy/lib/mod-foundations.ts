import type { Module } from "./types";

export const foundations: Module = {
  id: "foundations",
  title: "Agent Foundations",
  blurb:
    "What an AI agent actually is, the loop at its core, how it differs from a plain workflow, and when autonomy is worth the cost.",
  accent: "iris",
  lessons: [
    {
      slug: "what-is-an-agent",
      title: "What is an AI agent?",
      summary:
        "An agent is an LLM that uses tools in a loop to pursue a goal — deciding its own next step instead of following a script. That single idea unlocks everything else.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "From a chatbot to an actor" },
        {
          type: "p",
          text: "A language model on its own can only produce text. Ask it for the weather and it will *guess*; ask it to book a flight and it can only describe how. An **agent** closes that gap. It's an LLM placed inside a loop, handed a set of **tools**, and pointed at a **goal** — and it decides, step by step, what to do to reach that goal.",
        },
        {
          type: "p",
          text: "The defining shift is *who chooses the next step*. In ordinary software you write the control flow. In an agent, the **model** chooses the control flow at runtime: which tool to call, with what arguments, when to stop. You provide capabilities and constraints; the model provides the trajectory.",
        },
        { type: "diagram", name: "agent-anatomy", caption: "An agent = a reasoning model + tools + memory, driven by a loop toward a goal." },
        { type: "h3", text: "The four ingredients" },
        {
          type: "list",
          items: [
            "**A model (the brain)** — does the reasoning: interprets the goal, plans, and decides each action.",
            "**Tools (the hands)** — functions the model can call to read or change the world: search, code, APIs, databases.",
            "**Memory (the notebook)** — context carried within a run, plus state that can persist across runs.",
            "**A loop (the heartbeat)** — the harness that runs the model, executes its chosen tool, feeds back the result, and repeats until done.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The one-sentence definition",
          text: "An agent is an LLM that uses tools in a loop to accomplish a goal. Everything else — planning, memory, multi-agent systems, frameworks — is an elaboration of that sentence.",
        },
        { type: "h3", text: "A tiny example" },
        {
          type: "p",
          text: "Suppose the goal is *“What's the average temperature in the three largest cities in Japan this week?”* A non-agent answers from stale training data. An agent reasons: I need the cities → calls a search tool → gets Tokyo, Yokohama, Osaka → calls a weather tool three times → averages the results → answers. Nobody scripted those steps; the model sequenced them.",
        },
        {
          type: "code",
          lang: "python",
          caption: "The smallest possible agent (pseudo-code)",
          code: `goal = "Average temp of Japan's 3 biggest cities this week?"
messages = [{"role": "user", "content": goal}]

while True:
    reply = model(messages, tools=[search, get_weather])
    if reply.is_final:
        print(reply.text); break
    for call in reply.tool_calls:           # the model chose these
        result = run(call.name, call.args)  # your code executes them
        messages.append(tool_result(call.id, result))`,
        },
        {
          type: "callout",
          kind: "note",
          title: "The model never runs your code",
          text: "The model only *emits a request* — 'call get_weather(city=\"Osaka\")'. Your harness runs the function and returns the result. That separation is what keeps you in control of every real-world side effect.",
        },
        {
          type: "p",
          text: "Hold onto this picture. The rest of the course is about making each ingredient better: smarter reasoning, well-designed tools, durable memory, and — when one agent isn't enough — many agents working together.",
        },
      ],
      takeaways: [
        "An agent is an LLM that uses tools in a loop to pursue a goal it wasn't given step-by-step.",
        "The key shift from normal software: the model chooses the control flow at runtime, not you.",
        "Four ingredients: a model (brain), tools (hands), memory (notebook), and a loop (heartbeat).",
        "The model only requests tool calls; your harness executes them and feeds results back.",
      ],
      flashcards: [
        { front: "Define an AI agent in one sentence.", back: "An LLM that uses tools in a loop to accomplish a goal — deciding its own next steps rather than following a fixed script." },
        { front: "What is the fundamental difference between an agent and ordinary software?", back: "In ordinary software you write the control flow; in an agent the model chooses the control flow at runtime." },
        { front: "What are the four ingredients of an agent?", back: "A model (brain), tools (hands), memory (notebook), and a loop (heartbeat) that ties them together." },
        { front: "Does the model execute tools itself?", back: "No. It emits a structured request to call a tool; your harness runs the function and returns the result." },
      ],
      quiz: [
        {
          q: "What most distinguishes an agent from a normal program?",
          options: [
            "It uses a bigger model",
            "The model decides the control flow (which steps to take) at runtime",
            "It never makes mistakes",
            "It runs without any code",
          ],
          answer: 1,
          explain: "Agents hand control of the step sequence to the model; ordinary programs have you script the steps.",
        },
        {
          q: "Which is NOT one of the four core ingredients of an agent?",
          options: ["A reasoning model", "Tools", "A loop", "A graphical user interface"],
          answer: 3,
          explain: "Brain (model), hands (tools), notebook (memory), and heartbeat (loop) are the core. A GUI is optional.",
        },
      ],
    },

    {
      slug: "agent-vs-workflow",
      title: "Agents vs. workflows",
      summary:
        "Both chain LLM calls, but in a workflow your code controls the path and in an agent the model does. Knowing which you're building is the most important early decision.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Two ways to orchestrate LLMs" },
        {
          type: "p",
          text: "The industry blurs 'agent' to mean any LLM app. A sharper distinction (popularized by Anthropic's *Building Effective Agents*) is worth keeping: **workflows** orchestrate models and tools through *predefined code paths*; **agents** let the model *direct its own process* and tool use dynamically.",
        },
        { type: "diagram", name: "agent-vs-workflow", caption: "Workflow: your code fixes the steps. Agent: the model chooses the trajectory at runtime." },
        { type: "h3", text: "Workflows: you hold the map" },
        {
          type: "p",
          text: "A workflow is a fixed graph you author. Common shapes: **prompt chaining** (output of step A feeds step B), **routing** (classify the input, then send it down the matching branch), **parallelization** (fan out subtasks, then aggregate), and **orchestrator-workers** where a lead step splits work but the *structure* is still yours.",
        },
        {
          type: "p",
          text: "Workflows are predictable, cheap to test, and easy to debug because the path is visible in your code. If you can draw the flowchart up front, build a workflow.",
        },
        { type: "h3", text: "Agents: the model holds the map" },
        {
          type: "p",
          text: "An agent receives a goal and decides the steps itself, looping until it judges the task complete. You can't draw the flowchart in advance because it depends on what the model discovers along the way. That flexibility is the whole point — and also the cost: less predictability, more tokens, harder debugging.",
        },
        {
          type: "compare",
          caption: "Workflow vs. agent at a glance",
          columns: ["Dimension", "Workflow", "Agent"],
          rows: [
            { label: "Who chooses steps", cells: ["Your code", "The model"] },
            { label: "Path known up front", cells: ["Yes", "No"] },
            { label: "Predictability", cells: ["High", "Lower"] },
            { label: "Cost & latency", cells: ["Lower", "Higher"] },
            { label: "Best for", cells: ["Well-defined, repeatable tasks", "Open-ended tasks needing flexibility"] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "It's a spectrum, not a binary",
          text: "Real systems mix both: a workflow whose one step is an agent, or an agent that calls a deterministic workflow as a tool. The question is never 'agent or not' but 'how much autonomy does this step actually need?'",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Start at the cheap end",
          text: "Most production value comes from a single well-prompted call or a simple workflow. Reach for a full agent only when a fixed path genuinely can't capture the task.",
        },
      ],
      takeaways: [
        "Workflow = code-controlled, predefined paths. Agent = model-controlled, dynamic paths.",
        "Common workflow shapes: prompt chaining, routing, parallelization, orchestrator-workers.",
        "Workflows win on predictability, cost, and debuggability; agents win on flexibility for open-ended tasks.",
        "Autonomy is a spectrum — combine the two and add only as much autonomy as a task needs.",
      ],
      flashcards: [
        { front: "Workflow vs. agent — the core distinction?", back: "Workflows orchestrate LLMs through predefined code paths (you control the steps); agents let the model direct its own process and tool use dynamically." },
        { front: "Name three common workflow patterns.", back: "Prompt chaining, routing, and parallelization (plus orchestrator-workers)." },
        { front: "When should you prefer a workflow over an agent?", back: "When you can draw the flowchart up front — well-defined, repeatable tasks where predictability and low cost matter." },
      ],
      quiz: [
        {
          q: "You can fully draw the flowchart for a task before running it. What should you build?",
          options: ["An agent, always", "A workflow", "A multi-agent system", "Nothing is possible"],
          answer: 1,
          explain: "A fully specifiable path is a workflow. Reserve agents for tasks whose path can't be scripted in advance.",
        },
        {
          q: "Which is a downside of agents relative to workflows?",
          options: [
            "They can never use tools",
            "Lower predictability and higher cost/latency",
            "They cannot loop",
            "They require no model",
          ],
          answer: 1,
          explain: "Handing control to the model buys flexibility at the price of predictability, cost, and easy debugging.",
        },
      ],
    },

    {
      slug: "anatomy-of-an-agent",
      title: "Anatomy of an agent",
      summary:
        "Open the hood. An agent is a model wrapped by a harness that manages the context window, executes tools, and enforces limits. Understanding the parts demystifies every framework.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "The harness around the model" },
        {
          type: "p",
          text: "Frameworks make agents look magical. They aren't. Every agent is a **model** plus a **harness** — the surrounding code that assembles each request, runs the loop, executes tools, and stops things from going off the rails. Learn the harness once and every library (CrewAI, LangGraph, Agents SDK) becomes a thin convenience layer.",
        },
        { type: "h3", text: "What the harness assembles each turn" },
        {
          type: "list",
          items: [
            "**System prompt** — the agent's role, instructions, constraints, and how to use its tools.",
            "**Tool definitions** — name, description, and input schema for each available tool.",
            "**Conversation / scratchpad** — the running history of thoughts, tool calls, and results.",
            "**Retrieved context & memory** — facts pulled in for this task and state from prior runs.",
            "**The current input** — the goal or the latest observation to act on.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Context engineering is the real job",
          text: "An agent's quality is dominated by what's in its context window on each turn. Getting the right instructions, tools, and facts in — and stale junk out — matters more than any clever prompt phrasing. We'll call this 'context engineering' throughout.",
        },
        { type: "h3", text: "The control loop" },
        {
          type: "steps",
          items: [
            { title: "Assemble", text: "Build the request: system prompt + tools + history + new input." },
            { title: "Decide", text: "Call the model. It returns either a final answer or one or more tool calls." },
            { title: "Act", text: "If tool calls, the harness executes each and captures the results." },
            { title: "Observe", text: "Append the results to the history and loop back to Assemble — until the model is done or a limit is hit." },
          ],
        },
        { type: "h3", text: "The guardrails the harness owns" },
        {
          type: "p",
          text: "Because the model drives, the harness must hold the safety rails: a **max-iterations** cap, a **token/time budget**, **error handling** (return tool failures so the model can recover), **approval gates** before irreversible actions, and **logging** of every step for debugging and audit.",
        },
        {
          type: "code",
          lang: "python",
          caption: "A real-but-minimal harness",
          code: `def run_agent(goal, tools, max_steps=12):
    messages = [system_prompt(), user(goal)]
    for step in range(max_steps):
        reply = model.create(messages, tools=tools)
        messages.append(reply)
        if reply.stop_reason == "end_turn":
            return reply.text                 # done
        results = []
        for call in reply.tool_calls:
            try:
                out = registry[call.name](**call.args)
            except Exception as e:
                out = {"error": str(e)}       # let the model recover
            results.append(tool_result(call.id, out))
        messages.append(user(results))
    raise RuntimeError("hit max_steps without finishing")`,
        },
        {
          type: "callout",
          kind: "warn",
          title: "An agent without limits is a liability",
          text: "Always cap iterations and budget. A buggy tool or a confused model can otherwise loop forever, burning money and, worse, taking real actions repeatedly.",
        },
      ],
      takeaways: [
        "Every agent = a model + a harness; frameworks are convenience layers over that same harness.",
        "Each turn the harness assembles system prompt, tools, history, retrieved context, and the new input.",
        "The loop is Assemble → Decide → Act → Observe, repeating until done or a limit triggers.",
        "The harness owns the guardrails: max iterations, budgets, error handling, approval gates, and logging.",
      ],
      flashcards: [
        { front: "What two things make up every agent?", back: "A model and a harness — the surrounding code that assembles requests, runs the loop, executes tools, and enforces limits." },
        { front: "What is 'context engineering'?", back: "Curating what goes into the context window each turn (right instructions/tools/facts in, stale data out) — the dominant lever on agent quality." },
        { front: "Name three guardrails a harness should own.", back: "Max-iterations cap, token/time budget, error handling, approval gates before irreversible actions, and step logging (any three)." },
      ],
      quiz: [
        {
          q: "What has the biggest impact on an agent's quality, turn to turn?",
          options: [
            "The font of the prompt",
            "What's in the context window (context engineering)",
            "The programming language used",
            "The number of CPUs",
          ],
          answer: 1,
          explain: "Agents live and die by their context — the right instructions, tools, and facts present, and stale data removed.",
        },
        {
          q: "Why must the harness cap iterations and budget?",
          options: [
            "To make the model smarter",
            "To stop a confused model or buggy tool from looping forever and burning cost / taking repeated real actions",
            "It's required by HTTP",
            "To increase token usage",
          ],
          answer: 1,
          explain: "Because the model drives the loop, only the harness can enforce a stop — limits are non-negotiable safety rails.",
        },
      ],
    },

    {
      slug: "the-agent-loop",
      title: "The agent loop",
      summary:
        "Perceive → reason → act → observe, repeating until the goal is met. This loop is the engine of every agent; master its termination and feedback and you understand agents.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The engine that makes it an agent" },
        {
          type: "p",
          text: "Strip an agent to its essence and you find a loop. The model **perceives** the current state, **reasons** about what to do, **acts** by calling a tool, and **observes** the result — which becomes the new state. Then it goes again. This feedback cycle is what separates an agent from a one-shot call.",
        },
        { type: "diagram", name: "agent-loop", caption: "Perceive → reason → act → observe, until the goal is satisfied." },
        { type: "h3", text: "Why the feedback matters" },
        {
          type: "p",
          text: "The loop lets the agent *self-correct*. A search returns nothing? It reformulates the query. Code throws an error? It reads the traceback and patches the bug. Each observation updates the model's understanding, so the agent can adapt to a world it didn't fully know at the start. No feedback, no adaptation — just a guess.",
        },
        { type: "h3", text: "Knowing when to stop" },
        {
          type: "p",
          text: "Termination is the subtle part. An agent stops when it decides the goal is met — typically signalled by the model returning a final message with no further tool calls (e.g. `stop_reason = end_turn`). But you also need *external* stop conditions so a confused agent can't run forever.",
        },
        {
          type: "list",
          items: [
            "**Goal reached** — the model emits a final answer with no tool call (the normal, healthy exit).",
            "**Max iterations** — a hard cap on loop count.",
            "**Budget exhausted** — token, time, or money limit hit.",
            "**Explicit done tool** — the agent must call a `submit()` / `finish()` tool to end, making completion deliberate.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The loop IS the agent",
          text: "There is no separate 'agent mode' in a model. An agent is precisely this loop plus good tools and a clear goal. Frameworks automate the loop, but the mechanism is exactly perceive → reason → act → observe.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Beware the doom loop",
          text: "A common failure is an agent repeating the same failing action. Surface tool errors clearly, vary nothing-changed retries, and cap iterations so a stuck agent fails loudly instead of spinning.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Termination conditions in one place",
          code: `for step in range(MAX_STEPS):           # cap iterations
    if tokens_used > TOKEN_BUDGET:      # budget guard
        return "stopped: over budget"
    reply = model(messages, tools=tools)
    if not reply.tool_calls:            # model judged it done
        return reply.text
    messages += execute(reply.tool_calls)
return "stopped: hit max steps"         # external safety net`,
        },
      ],
      takeaways: [
        "The agent loop is perceive → reason → act → observe, repeating until the goal is met.",
        "Feedback (the 'observe' step) is what lets agents self-correct and adapt mid-task.",
        "Healthy termination = the model returns a final answer with no tool call.",
        "Always add external stop conditions: max iterations, budget caps, or an explicit 'done' tool.",
      ],
      flashcards: [
        { front: "What are the four phases of the agent loop?", back: "Perceive (read state) → reason (decide) → act (call a tool) → observe (read result), then repeat." },
        { front: "Why is the 'observe' step essential?", back: "It feeds results back so the agent can self-correct and adapt — without feedback an agent is just guessing." },
        { front: "What's the normal, healthy way an agent loop ends?", back: "The model returns a final answer with no further tool calls (e.g. stop_reason = end_turn)." },
      ],
      quiz: [
        {
          q: "What capability does the loop's feedback give an agent that a single call lacks?",
          options: ["Lower cost", "Self-correction and adaptation to results", "A bigger context window", "Faster responses"],
          answer: 1,
          explain: "Observing results lets the agent reformulate, retry, and fix errors — adapting to what it learns.",
        },
        {
          q: "Besides the model deciding it's done, what should also be able to stop the loop?",
          options: [
            "Nothing — trust the model",
            "External conditions: max iterations, budget caps, or a required 'done' tool",
            "The user closing the browser",
            "A bigger model",
          ],
          answer: 1,
          explain: "External stop conditions are the safety net against a confused agent looping forever.",
        },
      ],
    },

    {
      slug: "when-to-use-agents",
      title: "When to build an agent",
      summary:
        "Autonomy is powerful and expensive. Use a simple framework — complexity, value, viability, cost of error — to decide whether a task earns an agent at all.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Earn the autonomy" },
        {
          type: "p",
          text: "Agents are exciting, so it's tempting to make everything an agent. Resist. Autonomy adds cost, latency, and unpredictability. The mature instinct is to reach for the *simplest* thing that works and escalate only when the task demands it.",
        },
        { type: "diagram", name: "autonomy-spectrum", caption: "Climb the ladder only as far as the task requires: one call → workflow → agent → multi-agent." },
        { type: "h3", text: "The ladder of autonomy" },
        {
          type: "steps",
          items: [
            { title: "Single prompt", text: "One well-crafted call. Astonishing how often this is enough." },
            { title: "Prompt + tools", text: "One call that can fetch a fact or two via tools." },
            { title: "Workflow", text: "A fixed chain/route you control in code." },
            { title: "Agent", text: "The model drives an open-ended loop." },
            { title: "Multi-agent", text: "Several agents collaborate — only when one truly can't cope." },
          ],
        },
        { type: "h3", text: "Four questions before you build an agent" },
        {
          type: "list",
          items: [
            "**Complexity** — is the task genuinely open-ended and multi-step, impossible to fully script? If you can flowchart it, don't build an agent.",
            "**Value** — does the outcome justify higher cost and latency? Agents are pricey; cheap, high-volume tasks rarely earn them.",
            "**Viability** — is the model actually *good* at this task today? If it fails the task manually, an agent won't save it.",
            "**Cost of error** — can mistakes be caught and recovered? Reversible, low-stakes domains suit autonomy; irreversible high-stakes ones need heavy guardrails or a human.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Agents shine when the path can't be predetermined",
          text: "The sweet spot is a valuable, multi-step task where the right sequence depends on what the model discovers, the model is capable enough, and errors are recoverable. Coding assistants and research tasks are classic fits.",
        },
        {
          type: "compare",
          caption: "Good fit vs. poor fit for an agent",
          columns: ["Signal", "Good fit", "Poor fit"],
          rows: [
            { label: "Path", cells: ["Unpredictable, discovered at runtime", "Fixed and known in advance"] },
            { label: "Stakes", cells: ["Errors recoverable / reviewable", "Irreversible, high-stakes, unguarded"] },
            { label: "Volume & cost", cells: ["High-value, lower volume", "Pennies-per-call, massive volume"] },
            { label: "Model skill", cells: ["Capable at the task", "Struggles even with help"] },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Prototype the manual path first",
          text: "Before automating, do the task yourself with the model in a chat. If you can't get a good result by hand, an agent won't either. If you can, you've just discovered the tools and steps it needs.",
        },
      ],
      takeaways: [
        "Prefer the simplest tier that works; climb the autonomy ladder only as the task demands.",
        "Judge an agent against four questions: complexity, value, viability, and cost of error.",
        "Agents fit open-ended, valuable, recoverable tasks the model is genuinely capable of.",
        "Prototype the task manually first — it reveals viability and the exact tools/steps needed.",
      ],
      flashcards: [
        { front: "What are the four questions before building an agent?", back: "Complexity (is it un-scriptable?), value (does it justify cost?), viability (is the model good at it?), and cost of error (are mistakes recoverable?)." },
        { front: "What's the 'ladder of autonomy'?", back: "Single prompt → prompt + tools → workflow → agent → multi-agent. Climb only as high as the task requires." },
        { front: "What task profile is the sweet spot for an agent?", back: "A valuable, multi-step task whose path is discovered at runtime, that the model is capable of, with recoverable errors." },
      ],
      quiz: [
        {
          q: "A task is high-volume, costs a fraction of a cent per call, and follows a fixed path. Best choice?",
          options: ["A multi-agent system", "A full agent", "A single prompt or simple workflow", "More GPUs"],
          answer: 2,
          explain: "Fixed path + tiny per-call value = the cheap end of the ladder. Agents would add cost and unpredictability for no gain.",
        },
        {
          q: "Which factor most argues AGAINST giving an agent autonomy?",
          options: [
            "The task is multi-step",
            "Errors are irreversible and high-stakes with no guardrails",
            "The model is capable at the task",
            "The outcome is valuable",
          ],
          answer: 1,
          explain: "Irreversible, unguarded, high-stakes actions are dangerous to automate — gate them or keep a human in the loop.",
        },
      ],
    },
  ],
};
