import type { Module } from "./types";

export const frontier: Module = {
  id: "frontier",
  title: "Frontier Agents",
  blurb:
    "Where agents are heading next: voice and real-time interaction, ambient agents that act on triggers instead of chat — and an honest decoder for the agentic buzzword wave.",
  accent: "teal",
  lessons: [
    {
      slug: "voice-realtime-agents",
      title: "Voice & real-time agents",
      summary:
        "The agent loop you know, under a brutal new constraint: the user is listening, and 800 milliseconds of silence feels broken. How voice agents are built and what changes.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Same loop, new physics" },
        {
          type: "p",
          text: "A voice agent is still perceive → reason → act. What changes is the **latency budget**: in human conversation, a reply that takes longer than about a second feels wrong, and beyond two seconds callers assume the line is dead. Every design decision in voice flows from that constraint.",
        },
        {
          type: "callout",
          kind: "note",
          title: "Jargon, decoded",
          text: "**Latency** = the delay before a response arrives; in voice, more than ~1 second feels broken. **Latency budget** = the total delay you're allowed, divided across each step. **TTS / STT** = Text-to-Speech (turn the model's text into spoken audio) and Speech-to-Text (turn the caller's speech into text). **Streaming** = sending the answer word-by-word as it's generated instead of waiting for the whole thing. **Async** = kicking off a slow task and continuing other work instead of freezing until it finishes. **HITL** = Human-in-the-Loop, a person approving risky actions.",
        },
        { type: "h3", text: "Two architectures" },
        {
          type: "compare",
          caption: "Cascaded pipeline vs speech-to-speech",
          columns: ["Architecture", "How it works", "Trade-off"],
          rows: [
            { label: "Cascaded (STT → LLM → TTS)", cells: ["Speech-to-text transcribes, a text LLM reasons (your normal agent, tools and all), text-to-speech speaks", "Full control, any model, easy logging — but three hops of latency and lost vocal nuance (tone, hesitation)."] },
            { label: "Speech-to-speech (realtime)", cells: ["One natively-audio model listens and speaks directly over a streaming connection (e.g. WebRTC)", "Human-level latency and prosody — but younger tooling, harder to audit, and reasoning quality can trail text models."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Hide the slow parts behind speech",
          text: "Tool calls don't get faster because the interface is voice. The trick is conversational masking: the agent says 'let me pull up that order…' *while* the lookup runs, streams its answer as tokens arrive, and front-loads short sentences. Latency you can't remove, you narrate.",
        },
        { type: "h3", text: "What's genuinely new to engineer" },
        {
          type: "list",
          items: [
            "**Turn detection** — knowing when the user finished speaking. Too eager and you interrupt; too patient and you add dead air. Semantic end-of-turn detection (did that *sound* finished?) beats fixed silence timers.",
            "**Barge-in** — users interrupt mid-sentence. The agent must stop talking instantly, discard its queued speech, and treat the interruption as the new input.",
            "**No visual fallback** — you can't show a table or a form. Long answers must become dialogue: summarize, then offer detail.",
            "**Transcription errors** — names, order numbers, and addresses arrive mangled. Confirm anything consequential back to the user before acting on it.",
          ],
        },
        {
          type: "steps",
          items: [
            { title: "Budget the turn", text: "Roughly: turn detection ~200ms, model first-token ~300ms, TTS start ~150ms. Everything else — tools, retrieval — must overlap with speech or be masked." },
            { title: "Keep tools async", text: "Fire tool calls immediately, keep talking, weave results in when they land. A silent agent 'thinking' is a failed call." },
            { title: "Gate the irreversible", text: "Voice + transcription errors + no confirmation UI = read back payments, cancellations, and bookings explicitly before executing. HITL still applies when the human is on the phone." },
          ],
        },
        {
          type: "callout",
          kind: "story",
          title: "Why call centers went first",
          text: "Customer support over the phone is the perfect storm of agent economics: enormous volume, well-scoped tasks (order status, bookings, resets), existing tools to call, and a clear escalation path — transfer to a human. That's why 'voice AI' startups overwhelmingly sell into support and scheduling rather than open-ended assistants.",
        },
      ],
      takeaways: [
        "Voice agents are the same agent loop under a ~1-second conversational latency budget.",
        "Cascaded STT→LLM→TTS gives control and tool depth; speech-to-speech models give latency and prosody — many products mix both.",
        "The new engineering surface: turn detection, barge-in handling, conversational masking of tool latency, and confirming transcribed details.",
        "Irreversible actions still need explicit confirmation — read it back before executing.",
      ],
      flashcards: [
        { front: "Cascaded vs speech-to-speech voice agents?", back: "Cascaded: STT → text LLM (your normal agent) → TTS — controllable but three hops of latency. Speech-to-speech: one audio-native model over a streaming connection — fast and natural, harder to audit." },
        { front: "What is barge-in?", back: "The user interrupting the agent mid-speech. The agent must stop instantly, discard queued audio, and treat the interruption as new input." },
        { front: "How do voice agents handle slow tool calls?", back: "Conversational masking: acknowledge verbally ('let me check that…') while the tool runs, stream the answer, and overlap work with speech instead of going silent." },
      ],
      quiz: [
        {
          q: "A voice support agent goes silent for 3 seconds during an order lookup. What's the standard fix?",
          options: [
            "Use a bigger model so lookups are faster",
            "Mask it: say 'let me pull that up…' while the tool call runs and stream the reply",
            "Disable tools in voice mode",
            "Increase the silence timeout",
          ],
          answer: 1,
          explain: "The lookup takes what it takes — the fix is overlapping speech with work. Silence reads as a dropped call; narration reads as a person checking.",
        },
        {
          q: "Why do consequential voice actions (payments, cancellations) need read-back confirmation?",
          options: [
            "Regulations require it in all countries",
            "TTS voices aren't trustworthy",
            "Transcription can mangle names and numbers, and voice offers no visual form to verify — confirm before acting",
            "It makes the conversation longer, which improves CSAT",
          ],
          answer: 2,
          explain: "STT errors on entities are routine, and there's no screen to double-check. Explicit read-back is voice's version of the human-in-the-loop gate.",
        },
      ],
    },
    {
      slug: "ambient-proactive-agents",
      title: "Ambient & proactive agents",
      summary:
        "The next interface shift: agents that don't wait to be asked. Trigger-driven background agents, the etiquette of interruption, and why trust — not capability — is the bottleneck.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "From chat to triggers" },
        {
          type: "p",
          text: "Everything so far assumed a human opens a chat and asks. **Ambient agents** invert that: they run in the background, subscribed to event streams — incoming email, calendar changes, failing CI, a price drop, a cron schedule — and decide *whether* something is worth doing or surfacing. The human stops being the trigger and becomes the recipient.",
        },
        {
          type: "compare",
          caption: "Chat agents vs ambient agents",
          columns: ["Dimension", "Chat agent", "Ambient agent"],
          rows: [
            { label: "Trigger", cells: ["Human message", "Events, schedules, state changes."] },
            { label: "Concurrency", cells: ["One conversation at a time", "Many watchers running in parallel."] },
            { label: "Latency pressure", cells: ["Seconds — someone is waiting", "Minutes are fine — nobody is watching."] },
            { label: "Hard problem", cells: ["Answer quality", "Judgment: what deserves action or attention at all."] },
            { label: "Failure mode", cells: ["Wrong answer", "Wrong *initiative* — acting when it shouldn't, or spamming."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The scarce resource is attention, not tokens",
          text: "A chat agent that's wrong wastes a reply. An ambient agent that pings too often trains the user to ignore it — and one that acts wrongly on their behalf destroys trust permanently. Proactive systems are graded on precision: every notification is a withdrawal from a small trust budget.",
        },
        { type: "h3", text: "The interaction ladder" },
        {
          type: "steps",
          items: [
            { title: "Notify", text: "'Three customer emails look urgent.' Cheap to be wrong — worst case, a dismissed notification. Start here." },
            { title: "Draft", text: "'Here's a proposed reply — send?' The agent does the work, the human keeps the send button. The sweet spot for most workflows." },
            { title: "Act & report", text: "'I rescheduled your 3pm; here's why.' Only for reversible actions with high historical acceptance." },
            { title: "Act silently", text: "Reserved for the truly mechanical (archiving spam, retrying a flaky job). Anything a user might *want* to know about should at least leave a log entry." },
          ],
        },
        {
          type: "p",
          text: "Promotion up the ladder should be earned per task type, from observed acceptance: when the human has approved 95% of a given draft type for a month, that task is a candidate for act-and-report. Demotion is instant: one bad autonomous action drops the task back to drafting.",
        },
        { type: "h3", text: "The agentic web" },
        {
          type: "p",
          text: "As ambient agents multiply, more web traffic is agents acting for humans — reading pages, filling forms, comparing prices, completing purchases. The **agentic web** is the infrastructure wave responding to that: sites exposing MCP endpoints instead of relying on screen-scraping, agent-to-agent delegation via A2A, and **agentic commerce** protocols that let an agent pay with scoped, verifiable mandates instead of a stored credit card. The common thread: moving agents from *pretending to be users* (fragile, and blocked by bot detection) to *first-class, authenticated clients with delegated authority*.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Delegated authority is the new attack surface",
          text: "An agent with your inbox, calendar, and payment mandate is the lethal trifecta running unattended, at scale, on untrusted input (every email is attacker-controlled content). Everything from the security lessons applies double: least-privilege scopes, spending caps, allowlisted counterparties, and human gates on anything irreversible.",
        },
      ],
      takeaways: [
        "Ambient agents are trigger-driven and concurrent; their hard problem is judgment about what deserves action, not answer quality.",
        "Grade proactive systems on precision — every notification spends a small trust budget.",
        "Climb the autonomy ladder (notify → draft → act-and-report → act silently) per task, promoted by observed acceptance and demoted instantly on failure.",
        "The agentic web replaces agents-pretending-to-be-users with authenticated agents holding scoped, delegated authority (MCP, A2A, agentic commerce).",
        "Unattended agents on untrusted input are the lethal trifecta at scale — least privilege and human gates are non-negotiable.",
      ],
      flashcards: [
        { front: "What makes an agent 'ambient'?", back: "It's triggered by events, schedules, and state changes instead of chat messages — running in the background and deciding what deserves action or the user's attention." },
        { front: "What is the autonomy ladder for proactive agents?", back: "Notify → draft-for-approval → act-and-report → act silently. Promotion is earned per task type from observed acceptance rates; one bad autonomous action demotes instantly." },
        { front: "What is the agentic web?", back: "Infrastructure for agents as first-class web clients: MCP endpoints instead of scraping, A2A for agent↔agent delegation, and agentic-commerce protocols for scoped, verifiable payment authority." },
      ],
      quiz: [
        {
          q: "Your inbox agent drafts replies with a 96% approval rate over six weeks. What's the sound next step?",
          options: [
            "Grant it full send authority across the whole inbox",
            "Promote that specific task to act-and-report for low-stakes threads, keeping drafts for the rest",
            "Keep it drafting forever — autonomy is never worth it",
            "Remove the human from the loop to save time",
          ],
          answer: 1,
          explain: "Autonomy is promoted per task type and earned from acceptance data — and scoped to the reversible cases first. Blanket send authority skips the ladder.",
        },
        {
          q: "Why is an ambient email agent a bigger injection risk than a chat assistant?",
          options: [
            "Email is longer than chat messages",
            "It runs unattended on a stream of attacker-controlled content while holding real permissions — the lethal trifecta without a human watching each step",
            "Ambient agents use weaker models",
            "It isn't — the risks are identical",
          ],
          answer: 1,
          explain: "Every inbound email is untrusted input processed autonomously by something with data access and action authority. No human glances at each step, so structural guardrails have to do all the work.",
        },
      ],
    },
    {
      slug: "agent-buzzword-decoder",
      title: "The agentic buzzword decoder",
      summary:
        "Agent washing, swarms, vertical agents, digital workers, service-as-software — a fast, honest tour of the agent hype cycle, and the questions that cut through it.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Peak of the hype cycle" },
        {
          type: "p",
          text: "'Agentic' became the most valuable adjective in enterprise software, which guarantees it gets stapled to everything. Analysts coined **agent washing** for the result: chatbots, RPA scripts, and cron jobs rebranded as agents. Gartner's much-quoted prediction that over 40% of agentic-AI projects will be cancelled by 2027 is really a prediction about *mislabeled* projects meeting reality. Your defense is the test you learned in Module 1 — and it hasn't changed.",
        },
        {
          type: "callout",
          kind: "key",
          title: "The one-question test",
          text: "Does the model observe results and decide the next step, or does code control the sequence? If the steps are fixed, it's a workflow — often the *right* choice, just not an agent. Ask vendors: 'show me a trace where the system chose between meaningfully different actions at runtime.'",
        },
        { type: "h3", text: "The decoder" },
        {
          type: "compare",
          caption: "What the term means vs what to check",
          columns: ["Buzzword", "What it actually means", "Honest status"],
          rows: [
            { label: "Agent washing", cells: ["Rebranding chatbots, RPA, and scripted automations as 'agents'", "Rampant. Apply the one-question test; ask for runtime traces."] },
            { label: "Agent swarm", cells: ["Many agents working one goal in parallel — dynamic spawning, shared artifacts", "Real for parallelizable work (research, codebases); for most tasks it multiplies cost and error compounding (Module 4's pitfalls)."] },
            { label: "Vertical agent", cells: ["An agent built for one domain — legal review, medical scribing, recruiting — with domain tools, data, and evals baked in", "The commercially winning shape: scoped tasks, measurable outcomes, defensible data. 'General assistant for everything' remains the hard version."] },
            { label: "Digital worker / AI employee", cells: ["An agent framed as headcount: a name, a role, an inbox", "Framing, not architecture. Useful for adoption; dangerous when it implies human-level judgment. Under the hood it's tools + loop + guardrails."] },
            { label: "Service-as-software", cells: ["Selling completed outcomes (a resolved ticket, a booked meeting) instead of software seats — priced per result", "A real business-model shift enabled by agents; engineering-wise it's an SLA on agent reliability, which makes evals existential."] },
            { label: "SLM-powered agents", cells: ["Using small language models for routine agent steps, frontier models for planning", "Real cost engineering: most agent steps are narrow and repetitive; route them to small models and let evals set the threshold."] },
            { label: "Multi-agent everything", cells: ["Reflexively splitting any task across a crew of agents", "Module 4's lesson stands: multi-agent is for genuine parallelism or specialization. A single agent with good tools beats a committee more often than the demos suggest."] },
          ],
        },
        { type: "h3", text: "Questions that survive the next wave" },
        {
          type: "list",
          items: [
            "**Where's the trace?** Real agents produce observable trajectories. No trace, no agent.",
            "**What's the eval?** Outcome-level success rate on a real task distribution — not a demo reel.",
            "**What happens when it fails?** Escalation paths, rollback, blast radius. Vendors selling autonomy without failure stories haven't shipped.",
            "**What does a step cost?** Token economics decide viability at volume — swarms and deep loops multiply it.",
            "**Who holds the permissions?** Least privilege, scoped credentials, human gates on the irreversible.",
          ],
        },
        {
          type: "callout",
          kind: "story",
          title: "The pattern behind every cycle",
          text: "The mechanisms in this course — the loop, tools, memory, orchestration, evals, guardrails — predate the buzzwords and will outlive them. Every term in the table above decodes into some arrangement of those parts. Learn the parts and no rebrand will ever be confusing again; chase the labels and you'll re-learn the field every eighteen months.",
        },
      ],
      takeaways: [
        "Agent washing is rampant — apply the one-question test: does the model choose next steps at runtime, or does code?",
        "Vertical agents (scoped domain + tools + evals) are the commercially winning shape; 'AI employees' are framing, not architecture.",
        "Service-as-software sells outcomes instead of seats — which turns eval scores and reliability into the business model itself.",
        "Swarms and multi-agent setups pay off only for genuine parallelism or specialization; SLM routing is the real cost story.",
        "Durable diligence questions: show the trace, show the eval, show the failure path, show the unit cost, show the permission model.",
      ],
      flashcards: [
        { front: "What is agent washing?", back: "Rebranding chatbots, RPA scripts, and fixed automations as 'agents'. Test: does the model observe results and choose next steps at runtime, or does code control the sequence?" },
        { front: "What is service-as-software?", back: "Selling completed outcomes (resolved tickets, booked meetings) priced per result instead of software seats — an agent-enabled business model that makes reliability evals existential." },
        { front: "What is a vertical agent?", back: "An agent purpose-built for one domain with its tools, data, and evals baked in — scoped, measurable, and currently the commercially successful shape of agent products." },
      ],
      quiz: [
        {
          q: "A vendor demos an 'AI agent' that always runs: fetch ticket → classify → template reply → send. What is it?",
          options: [
            "A true agent — it uses an LLM",
            "A workflow with LLM steps — possibly great, but the sequence is code-controlled, so the 'agent' label is washing",
            "An agent swarm",
            "A vertical agent",
          ],
          answer: 1,
          explain: "Fixed sequence, no runtime choice between actions → workflow. That may be exactly the right design — the point is decoding the label, not dismissing the product.",
        },
        {
          q: "Why does service-as-software make evals 'existential' rather than nice-to-have?",
          options: [
            "Regulators require eval reports for outcome pricing",
            "Revenue is per successful outcome, so the agent's measured success rate on real tasks IS the unit economics",
            "Evals replace the need for guardrails",
            "It doesn't — evals matter equally everywhere",
          ],
          answer: 1,
          explain: "When you charge per resolved ticket, your margin is a direct function of autonomous success rate. The eval suite stops being quality assurance and becomes the P&L model.",
        },
      ],
    },
  ],
};
