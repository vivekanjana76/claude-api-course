import type { Module } from "./types";

export const reasoning: Module = {
  id: "reasoning",
  title: "Reasoning & Planning",
  blurb:
    "How agents think before they act: chain-of-thought, the ReAct loop, plan-and-execute, reflection, and decomposing big goals into tractable steps.",
  accent: "teal",
  lessons: [
    {
      slug: "chain-of-thought",
      title: "Reasoning: chain of thought",
      summary:
        "Letting a model 'think out loud' before answering dramatically improves multi-step reasoning. It's the substrate every agent pattern is built on.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Think before you answer" },
        {
          type: "p",
          text: "Ask a model a hard multi-step question and demand an instant answer, and it often stumbles. Ask it to **reason step by step first**, and accuracy jumps. This is **chain-of-thought (CoT)** prompting: the model generates intermediate reasoning before its final answer, using the generated text as a scratchpad.",
        },
        { type: "diagram", name: "cot", caption: "Reason first on a scratchpad, then answer — depth of thought trades tokens for reliability." },
        {
          type: "p",
          text: "Why does it work? Each token the model writes becomes part of its own input for the next token. Reasoning out loud literally gives the model more computation and a structured path to the answer, instead of forcing a one-shot leap.",
        },
        { type: "h3", text: "Three flavors" },
        {
          type: "list",
          items: [
            "**Zero-shot CoT** — simply add 'think step by step' (or use a thinking-enabled model). Cheapest, surprisingly effective.",
            "**Few-shot CoT** — show 1–3 worked examples that include the reasoning, locking in the style.",
            "**Structured / extended thinking** — modern models expose a dedicated reasoning phase you can dial up or down by 'effort', keeping the scratchpad separate from the answer.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Reasoning is the substrate of agency",
          text: "Every agent pattern — ReAct, planning, reflection — is chain-of-thought applied to actions. Before an agent picks a tool, it reasons about why. Strong reasoning is the foundation everything else stands on.",
        },
        {
          type: "code",
          lang: "python",
          caption: "From answer-first to reason-first",
          code: `# Fragile: forces a one-shot leap
prompt = "A train leaves at 2:15 and arrives at 4:50. How long? Answer only the number."

# Robust: reason, then answer
prompt = (
  "A train leaves at 2:15 and arrives at 4:50. "
  "Think step by step, then give the final answer on the last line as 'Answer: X'."
)`,
        },
        {
          type: "callout",
          kind: "warn",
          title: "Reasoning is not truth",
          text: "A plausible chain of thought can still reach a wrong answer, and stated reasoning doesn't always reflect the model's true computation. Treat CoT as an accuracy booster and a debugging window — not a guarantee of correctness.",
        },
      ],
      takeaways: [
        "Chain-of-thought = generate intermediate reasoning before the final answer; it boosts multi-step accuracy.",
        "It works because generated reasoning tokens feed back as input, giving the model more computation and structure.",
        "Flavors: zero-shot ('think step by step'), few-shot (worked examples), and structured extended thinking with an effort dial.",
        "CoT improves and explains answers but doesn't guarantee correctness — verify high-stakes results.",
      ],
      flashcards: [
        { front: "What is chain-of-thought prompting?", back: "Having the model generate intermediate reasoning steps before its final answer, improving accuracy on multi-step problems." },
        { front: "Why does reasoning out loud help a model?", back: "Each generated token feeds back as input, giving the model more computation and a structured path rather than a one-shot leap." },
        { front: "Is a model's stated chain of thought guaranteed to be correct or faithful?", back: "No — plausible reasoning can still be wrong, and stated steps don't always reflect the true computation. It's a booster, not a guarantee." },
      ],
      quiz: [
        {
          q: "Why does chain-of-thought improve multi-step accuracy?",
          options: [
            "It uses a different model",
            "Generated reasoning tokens become input, giving more computation and structure toward the answer",
            "It disables sampling",
            "It shortens the prompt",
          ],
          answer: 1,
          explain: "The scratchpad text feeds back into the model, letting it build the answer step by step instead of guessing in one shot.",
        },
        {
          q: "What's a correct caveat about chain-of-thought?",
          options: [
            "It guarantees correct answers",
            "A plausible chain can still be wrong and may not reflect true reasoning",
            "It only works on small models",
            "It removes the need for tools",
          ],
          answer: 1,
          explain: "CoT boosts and illuminates reasoning but is not a correctness guarantee — verify when stakes are high.",
        },
      ],
    },

    {
      slug: "react",
      title: "ReAct: reason + act",
      summary:
        "Interleave reasoning with tool calls — Thought, Action, Observation, repeat. ReAct is the canonical pattern that turns a reasoning model into an acting agent.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Thinking and doing, interleaved" },
        {
          type: "p",
          text: "Chain-of-thought reasons but can't touch the world; tool use acts but without deliberation. **ReAct** (Reason + Act) fuses them: the agent alternates between **Thought** (reason about what to do), **Action** (call a tool), and **Observation** (read the result) — looping until it can answer. It's the pattern behind most single-agent systems.",
        },
        { type: "diagram", name: "react-loop", caption: "Thought → Action → Observation, repeated. Reasoning chooses each action; observations ground the next thought." },
        {
          type: "code",
          lang: "text",
          caption: "A ReAct trace for 'Who directed the highest-grossing 2019 film?'",
          code: `Thought: I need the highest-grossing film of 2019.
Action: search("highest grossing film 2019")
Observation: Avengers: Endgame.
Thought: Now I need its director(s).
Action: search("Avengers: Endgame director")
Observation: Anthony and Joe Russo.
Thought: I have the answer.
Answer: The Russo brothers (Anthony and Joe Russo).`,
        },
        { type: "h3", text: "Why interleaving beats doing each alone" },
        {
          type: "list",
          items: [
            "**Reasoning guides action** — the Thought step picks the *right* tool and arguments instead of flailing.",
            "**Observation grounds reasoning** — real results correct the model's assumptions, reducing hallucination.",
            "**It's inspectable** — the Thought/Action/Observation trace is a natural, readable log of *why* the agent did what it did.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "ReAct is the default single-agent pattern",
          text: "When people say 'an agent', they usually mean a ReAct-style loop: reason, call a tool, observe, repeat. Modern tool-calling APIs implement it natively — the model's 'thinking' plus a tool_use block is a Thought+Action; your tool_result is the Observation.",
        },
        { type: "h3", text: "From paper format to native tool calls" },
        {
          type: "p",
          text: "The original ReAct paper had the model emit text like `Action: search[...]` that you parsed. Today you rarely parse strings: you pass real tool definitions and the model returns structured tool calls. Same loop, far more reliable — let the API handle the format and focus on the tools and prompt.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Failure modes to watch",
          text: "ReAct agents can loop on a failing action, ignore observations that contradict their plan, or call tools needlessly. Cap iterations, make tool errors loud and specific, and remind the agent in the system prompt to actually use what it observes.",
        },
      ],
      takeaways: [
        "ReAct interleaves Thought (reason), Action (call a tool), and Observation (read result), looping until done.",
        "Reasoning picks the right action; observations ground the reasoning and curb hallucination.",
        "It's the default single-agent pattern and maps directly onto modern structured tool-calling.",
        "Guard against doom loops and ignored observations with iteration caps and clear, specific tool errors.",
      ],
      flashcards: [
        { front: "What do the three steps of ReAct stand for?", back: "Thought (reason about what to do), Action (call a tool), Observation (read the result) — repeated in a loop." },
        { front: "Why interleave reasoning and acting instead of doing each separately?", back: "Reasoning picks the right action and observations ground the reasoning — reducing flailing and hallucination, with an inspectable trace." },
        { front: "How does ReAct map onto modern tool-calling APIs?", back: "The model's thinking + a tool_use block = Thought + Action; your returned tool_result = the Observation. Same loop, structured instead of parsed text." },
      ],
      quiz: [
        {
          q: "What does ReAct combine?",
          options: [
            "Two models",
            "Reasoning (chain-of-thought) with acting (tool use), interleaved",
            "Retrieval and generation",
            "Training and inference",
          ],
          answer: 1,
          explain: "ReAct = Reason + Act: alternate Thought, Action, and Observation in a loop.",
        },
        {
          q: "In native tool-calling, what plays the role of ReAct's 'Observation'?",
          options: ["The system prompt", "The tool_result you return to the model", "The model's name", "The temperature setting"],
          answer: 1,
          explain: "You execute the requested tool and return its result as a tool_result — that's the Observation the next Thought reasons over.",
        },
      ],
    },

    {
      slug: "planning",
      title: "Planning: plan, then execute",
      summary:
        "For complex goals, separate deciding the plan from carrying it out. Plan-and-execute reduces drift, enables parallelism, and makes long tasks tractable.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Why pure ReAct struggles on long tasks" },
        {
          type: "p",
          text: "A ReAct agent decides one step at a time. On a long, complex task that myopia hurts: it loses the thread, repeats work, or wanders. **Plan-and-execute** fixes this by splitting the job in two — first produce a **plan** (a list of subtasks), then **execute** each, optionally replanning as reality intervenes.",
        },
        { type: "diagram", name: "plan-execute", caption: "A planner decomposes the goal into steps; an executor carries them out, replanning when needed." },
        { type: "h3", text: "The two roles" },
        {
          type: "compare",
          columns: ["Role", "Job"],
          rows: [
            { label: "Planner", cells: ["Reads the goal and produces an explicit, ordered list of subtasks (a plan)."] },
            { label: "Executor", cells: ["Carries out each subtask — often a ReAct loop with tools — and reports results back."] },
            { label: "Replanner", cells: ["After steps complete (or fail), revises the remaining plan based on what was learned."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Plan-and-execute skeleton",
          code: `plan = planner(goal)                 # ["find X", "compute Y", "draft Z"]
results = []
while plan:
    step = plan.pop(0)
    result = executor(step, context=results)   # a mini ReAct loop
    results.append(result)
    plan = replanner(goal, plan, results)       # adapt to new info
answer = synthesize(goal, results)`,
        },
        { type: "h3", text: "What you gain" },
        {
          type: "list",
          items: [
            "**Less drift** — an explicit plan keeps a long task on the rails.",
            "**Parallelism** — independent subtasks can run at once instead of strictly sequentially.",
            "**Cheaper reasoning** — plan once with a strong model, execute steps with a cheaper one.",
            "**Transparency** — the plan is a human-readable artifact you can inspect, edit, or approve.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Decomposition is the superpower",
          text: "Breaking a fuzzy goal into concrete subtasks is often 80% of solving it. A good plan turns 'build me a dashboard' into a checklist the agent can actually march through.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Don't over-plan",
          text: "Rigid upfront plans break when the world surprises the agent. Always allow replanning, and for short tasks skip planning entirely — a plain ReAct loop is simpler and cheaper.",
        },
      ],
      takeaways: [
        "Plan-and-execute separates deciding the plan from carrying it out, helping on long/complex tasks.",
        "Roles: a planner decomposes the goal, an executor runs each subtask, a replanner adapts to new info.",
        "Benefits: less drift, possible parallelism, cheaper execution, and a transparent, editable plan.",
        "Allow replanning so rigid plans don't break — and skip planning for short tasks.",
      ],
      flashcards: [
        { front: "What problem does plan-and-execute solve over pure ReAct?", back: "Step-by-step ReAct is myopic on long tasks (drift, repeated work). Planning first keeps a complex task on the rails." },
        { front: "What are the planner, executor, and replanner roles?", back: "Planner decomposes the goal into subtasks; executor carries each out (often a ReAct loop); replanner revises the remaining plan as new info arrives." },
        { front: "Why is replanning important?", back: "Rigid upfront plans break when reality surprises the agent — replanning lets it adapt instead of marching off a cliff." },
      ],
      quiz: [
        {
          q: "Plan-and-execute primarily helps with…",
          options: [
            "Very short, single-step tasks",
            "Long, complex tasks where step-by-step reasoning drifts",
            "Reducing model size",
            "Avoiding tools entirely",
          ],
          answer: 1,
          explain: "An explicit plan keeps long, multi-step tasks coherent; for short tasks, plain ReAct is simpler.",
        },
        {
          q: "What's a cost optimization plan-and-execute enables?",
          options: [
            "Plan with a strong model, execute steps with a cheaper one",
            "Never call the model",
            "Use only one giant prompt",
            "Disable observations",
          ],
          answer: 0,
          explain: "Reasoning-heavy planning can use a top model while routine execution runs on a cheaper, faster one.",
        },
      ],
    },

    {
      slug: "reflection",
      title: "Reflection & self-critique",
      summary:
        "Let the agent grade and revise its own work. A generate → critique → revise loop catches errors that a single pass misses — at the price of extra tokens.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The agent as its own reviewer" },
        {
          type: "p",
          text: "A first draft is rarely a model's best work. **Reflection** adds a feedback loop where the agent (or a second agent) **critiques** its own output and then **revises** it. Generate → critique → revise, repeated until the critique is satisfied or a limit is reached.",
        },
        { type: "diagram", name: "reflection", caption: "Generate a draft → critique it against criteria → revise. Repeat until good enough." },
        { type: "h3", text: "Why a second look helps" },
        {
          type: "p",
          text: "Generation and evaluation are different cognitive tasks, and models are often better at *spotting* a flaw than avoiding it in one pass. Asking 'what's wrong with this answer?' surfaces issues — missing edge cases, failing tests, unmet requirements — that the generator glossed over.",
        },
        {
          type: "code",
          lang: "python",
          caption: "A reflection loop",
          code: `draft = generate(task)
for _ in range(MAX_REVISIONS):
    critique = reviewer(task, draft)      # "Tests 2 and 5 fail because…"
    if critique.is_satisfied:
        break
    draft = revise(task, draft, critique) # incorporate the feedback
return draft`,
        },
        { type: "h3", text: "Make the critique concrete" },
        {
          type: "list",
          items: [
            "**Give it criteria** — a rubric or checklist beats a vague 'is this good?'.",
            "**Prefer external signals** — run the tests, the linter, the type-checker. Ground truth beats opinion.",
            "**Separate the roles** — a distinct reviewer prompt (or model) critiques harder than 'now check your own work' in the same breath.",
            "**Cap the loop** — reflection has diminishing returns; 1–3 rounds usually captures most of the gain.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Reflection turns one-shot output into a process",
          text: "It's the agentic version of 'measure twice, cut once'. For code, writing, and analysis, a critique-and-revise loop reliably lifts quality — especially when the critique is grounded in real tests or a clear rubric.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Self-grading can be too kind",
          text: "Models often rate their own work generously and can 'fix' things that weren't broken. Anchor critiques to external checks where possible, and don't let reflection loop forever — it burns tokens for shrinking returns.",
        },
      ],
      takeaways: [
        "Reflection is a generate → critique → revise loop where the agent improves its own output.",
        "It works because spotting flaws is often easier than avoiding them in a single pass.",
        "Ground the critique in concrete criteria or external signals (tests, linters), and use a separate reviewer role.",
        "Cap revisions — gains diminish fast, and self-grading can be lenient or fix non-problems.",
      ],
      flashcards: [
        { front: "What is the reflection pattern?", back: "A loop where the agent critiques its own output against criteria and revises it: generate → critique → revise, until satisfied or capped." },
        { front: "Why does self-critique improve results?", back: "Evaluating is a different task from generating, and models often spot flaws they couldn't avoid in one pass." },
        { front: "How do you make reflection reliable?", back: "Use a concrete rubric, ground critiques in external signals (tests/linters), separate the reviewer role, and cap the number of rounds." },
      ],
      quiz: [
        {
          q: "What's the core loop of the reflection pattern?",
          options: ["Retrieve → generate", "Generate → critique → revise", "Plan → execute", "Search → answer"],
          answer: 1,
          explain: "Reflection repeatedly critiques and revises a draft until it meets the criteria.",
        },
        {
          q: "What makes a reflection critique most trustworthy?",
          options: [
            "Asking 'is this good?' with no criteria",
            "Grounding it in external signals like tests, linters, or a clear rubric",
            "Running it 50 times",
            "Using a smaller model",
          ],
          answer: 1,
          explain: "External ground truth beats self-opinion, which tends to be lenient; a rubric makes the critique actionable.",
        },
      ],
    },

    {
      slug: "decomposition-routing",
      title: "Decomposition & routing",
      summary:
        "Two foundational moves: break a big goal into subtasks, and send each input to the right handler. Master these and most 'agentic' systems become simple compositions.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Divide, then direct" },
        {
          type: "p",
          text: "Beneath fancy architectures, two moves do most of the work. **Decomposition** splits a complex goal into smaller subtasks. **Routing** classifies an input and sends it to the handler best suited to it. Combine them and you can build remarkably capable systems without heavyweight autonomy.",
        },
        { type: "h3", text: "Decomposition" },
        {
          type: "p",
          text: "A model handles a focused subtask far better than a sprawling one. Decomposition turns 'analyze this company' into 'summarize financials', 'assess competitors', 'evaluate the team' — each a clean task you can run, possibly in parallel, then synthesize.",
        },
        {
          type: "list",
          items: [
            "**Sequential** — when steps depend on each other (research → outline → draft).",
            "**Parallel** — when subtasks are independent (rate this answer on accuracy, tone, and safety at once), then aggregate.",
            "**Recursive** — a subtask too big itself gets decomposed again.",
          ],
        },
        { type: "h3", text: "Routing" },
        {
          type: "p",
          text: "Routing is a classify-then-dispatch step. A cheap classifier looks at the input and picks a path: refund questions → the refund flow, coding questions → the code agent, simple FAQs → a small fast model. It keeps each handler specialized and lets you match model size to difficulty.",
        },
        {
          type: "code",
          lang: "python",
          caption: "A router that also right-sizes the model",
          code: `category = classify(query)            # cheap, fast model
if category == "billing":
    return billing_agent(query)
elif category == "technical":
    return code_agent(query, model="opus")   # hard → strong model
else:
    return faq_model(query, model="haiku")   # easy → small model`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Specialization beats one do-everything prompt",
          text: "Routing to focused handlers — each with its own tools, instructions, and right-sized model — almost always beats a single mega-prompt trying to handle every case. It's cheaper, more accurate, and easier to evaluate.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "These are the seams of multi-agent systems",
          text: "Decomposition defines the subtasks each agent owns; routing decides which agent gets the work. When we reach orchestration, you'll see multi-agent systems are mostly decomposition + routing with memory.",
        },
      ],
      takeaways: [
        "Decomposition splits a complex goal into focused subtasks (sequential, parallel, or recursive).",
        "Routing classifies an input and dispatches it to the best-suited, right-sized handler.",
        "Specialized handlers beat a single do-everything prompt on cost, accuracy, and evaluability.",
        "These two moves are the seams along which multi-agent systems are later built.",
      ],
      flashcards: [
        { front: "What is decomposition?", back: "Breaking a complex goal into smaller, focused subtasks (sequential, parallel, or recursive) that are easier to solve and synthesize." },
        { front: "What is routing?", back: "Classifying an input and dispatching it to the handler best suited to it — keeping handlers specialized and matching model size to difficulty." },
        { front: "Why route to specialized handlers instead of one big prompt?", back: "Specialized handlers (own tools, instructions, right-sized model) are cheaper, more accurate, and easier to evaluate than a mega-prompt." },
      ],
      quiz: [
        {
          q: "When should subtasks run in parallel rather than sequentially?",
          options: [
            "Always",
            "When they're independent of each other, then you aggregate the results",
            "Only on a single CPU",
            "Never — agents are sequential",
          ],
          answer: 1,
          explain: "Independent subtasks (e.g. scoring an answer on several dimensions) can run concurrently and be combined.",
        },
        {
          q: "A good router lets you…",
          options: [
            "Use the same giant model for everything",
            "Send easy queries to a small model and hard ones to a strong model",
            "Avoid classifying inputs",
            "Skip tools",
          ],
          answer: 1,
          explain: "Routing matches each input to a right-sized, specialized handler — saving cost on easy cases and reserving power for hard ones.",
        },
      ],
    },
  ],
};
