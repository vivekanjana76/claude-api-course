import type { Module } from "./types";

export const prompting: Module = {
  id: "prompting",
  title: "Prompt Engineering",
  blurb:
    "The craft of writing instructions that get reliable, high-quality output — from basics to real-world production prompts.",
  accent: "sage",
  lessons: [
    {
      slug: "prompting-fundamentals",
      title: "Prompting fundamentals",
      summary:
        "A prompt is a program written in English. Clear, specific, well-structured instructions are the single biggest lever on output quality.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Clarity is the whole game" },
        {
          type: "p",
          text: "Prompt engineering is the practice of writing instructions that reliably produce the output you want. The model is capable; most failures come from **vague, ambiguous, or under-specified prompts**. Treat a prompt like a brief you'd give a smart new colleague who can't ask follow-up questions.",
        },
        {
          type: "p",
          text: "The mantra: **be clear, be specific, give structure.** If a human could misread your instruction, so can Claude.",
        },
        { type: "h3", text: "The building blocks of a strong prompt" },
        {
          type: "list",
          items: [
            "**Task** — say exactly what you want done.",
            "**Context** — give the background and any source material.",
            "**Constraints** — length, tone, what to avoid, edge-case handling.",
            "**Format** — the precise shape of the answer (JSON keys, sections, tags).",
            "**Examples** — show one or two ideal input→output pairs (few-shot).",
          ],
        },
        {
          type: "compare",
          caption: "Vague vs. specific",
          columns: ["Weak prompt", "Strong prompt"],
          rows: [
            { label: "Summarize this.", cells: ["Summarize the email below in 3 bullet points, each under 15 words, focusing on action items. Output only the bullets."] },
            { label: "Is this good?", cells: ["Rate this support reply 1–5 for empathy and 1–5 for accuracy. Return JSON: {empathy, accuracy, reason}."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Tell it what TO do",
          text: "Positive, concrete instructions ('respond in two sentences') beat negative ones ('don't be too long'). Models follow explicit targets far better than vague prohibitions.",
        },
        { type: "h3", text: "Give Claude a role" },
        {
          type: "p",
          text: "Assigning a role — 'You are an experienced epidemiologist' — primes the model toward the right vocabulary, depth, and assumptions. It's one of the cheapest quality boosts available, and it lives in the system prompt.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Iterate like an engineer",
          text: "Write a prompt, test it on real inputs, find where it fails, and refine. Good prompts are developed, not guessed. Later you'll formalize this with evaluations.",
        },
      ],
      takeaways: [
        "Prompting quality is the biggest driver of output quality — most failures are vague prompts.",
        "Strong prompts state task, context, constraints, format, and examples.",
        "Prefer positive, specific instructions over negative prohibitions.",
        "Assigning a role primes the model; iterate against real inputs to improve.",
      ],
      flashcards: [
        { front: "The three-word prompting mantra?", back: "Be clear, be specific, give structure." },
        { front: "Why prefer 'respond in two sentences' over 'don't be wordy'?", back: "Models follow explicit positive targets much better than vague negative prohibitions." },
        { front: "What's a cheap way to raise quality instantly?", back: "Assign a relevant role/persona in the system prompt to prime vocabulary and depth." },
      ],
      quiz: [
        {
          q: "Which prompt will produce more reliable output?",
          options: [
            "'Tell me about this customer.'",
            "'In 3 bullets, list this customer's plan, last issue, and sentiment. Output only the bullets.'",
            "'Be helpful.'",
            "'Don't be vague.'",
          ],
          answer: 1,
          explain: "Specific task + structure + format yields consistent, parseable output.",
        },
      ],
    },

    {
      slug: "prompt-techniques",
      title: "Core techniques: examples, XML, and roles",
      summary:
        "Few-shot examples, XML tags to separate sections, and explicit roles are the workhorse techniques that make prompts robust.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Few-shot: show, don't just tell" },
        {
          type: "p",
          text: "The fastest way to lock in a format or style is to **show examples**. Zero-shot = instruction only. Few-shot = instruction plus 1–5 example input→output pairs. Examples resolve ambiguity that words can't, and they're especially powerful for classification and structured extraction.",
        },
        {
          type: "code",
          lang: "text",
          caption: "Few-shot classification",
          code: `Classify each message as BUG, FEATURE, or QUESTION.

Message: "The app crashes when I upload a PDF."
Label: BUG

Message: "Can you add dark mode?"
Label: FEATURE

Message: "How do I export my data?"
Label: QUESTION

Message: "{{new_message}}"
Label:`,
        },
        { type: "h2", text: "XML tags: give the prompt structure" },
        {
          type: "p",
          text: "Claude is specifically good at reading **XML-style tags**. Wrapping different parts of your prompt — instructions, documents, examples, the user's question — in named tags removes ambiguity about where one thing ends and another begins.",
        },
        {
          type: "code",
          lang: "text",
          caption: "Tags separate source data from the task",
          code: `<document>
{{the contract text}}
</document>

<instructions>
Find the termination clause. Quote it verbatim inside <quote> tags,
then explain it in plain English inside <explanation> tags.
</instructions>`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Tags also make output parseable",
          text: "Ask Claude to put its answer in <answer> tags and you can reliably extract it from the response — a poor-man's structured output that works everywhere.",
        },
        { type: "h2", text: "Roles and prefilling" },
        {
          type: "p",
          text: "Beyond the system-prompt role, you can shape output structure. On older models you could 'prefill' the start of the assistant's reply (e.g. begin with `{` to force JSON). On the newest models prefilling is removed — use **structured outputs** instead (covered in the Tool Use module).",
        },
        {
          type: "compare",
          caption: "Technique cheat sheet",
          columns: ["Technique", "Best for"],
          rows: [
            { label: "Few-shot examples", cells: ["Locking format/style; classification; edge cases."] },
            { label: "XML tags", cells: ["Separating instructions from data; extractable answers."] },
            { label: "Role assignment", cells: ["Setting depth, tone, and domain assumptions."] },
            { label: "Chain of thought", cells: ["Multi-step reasoning (next lesson)."] },
          ],
        },
      ],
      takeaways: [
        "Few-shot examples resolve ambiguity that instructions alone can't — great for classification/extraction.",
        "XML tags structure the prompt and make Claude's answer easy to extract.",
        "Roles set depth and tone; on new models, prefer structured outputs over prefilling.",
        "These techniques stack — combine examples + tags + a role in one prompt.",
      ],
      flashcards: [
        { front: "Zero-shot vs few-shot?", back: "Zero-shot gives only instructions; few-shot adds 1–5 example input→output pairs to lock format/behavior." },
        { front: "Why use XML tags in a Claude prompt?", back: "Claude reads them well; they cleanly separate instructions, data, and examples, and make answers extractable (e.g. <answer> tags)." },
        { front: "Replacement for assistant prefilling on new models?", back: "Structured outputs (output_config.format) — prefilling the assistant turn is removed/errors on the latest models." },
      ],
      quiz: [
        {
          q: "Your classifier sometimes returns lowercase labels and sometimes full sentences. Best fix?",
          options: [
            "Raise temperature",
            "Add 2–3 few-shot examples showing the exact label format",
            "Use a bigger model only",
            "Add 'be consistent' to the prompt",
          ],
          answer: 1,
          explain: "Few-shot examples pin the exact output format far more reliably than abstract instructions.",
        },
        {
          q: "Why wrap source documents in <document> tags?",
          options: [
            "It compresses tokens",
            "It clearly separates data from instructions, reducing confusion",
            "It's required by the API",
            "It enables streaming",
          ],
          answer: 1,
          explain: "Tags delimit data from task, which Claude parses reliably.",
        },
      ],
    },

    {
      slug: "structured-thinking",
      title: "Chain of thought & structured reasoning",
      summary:
        "Letting Claude reason step-by-step before answering dramatically improves accuracy on hard problems. Modern models do this with adaptive thinking.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Reasoning before answering" },
        {
          type: "p",
          text: "For multi-step problems — math, logic, planning, careful analysis — asking for the final answer immediately invites mistakes. **Chain of thought (CoT)** prompting tells the model to work through the problem step by step first. The reasoning acts as a scratchpad that makes the final answer more reliable.",
        },
        {
          type: "code",
          lang: "text",
          caption: "Classic chain-of-thought instruction",
          code: `Think step by step inside <thinking> tags. Consider each constraint,
then give your final answer inside <answer> tags.

Problem: A train leaves at 2pm going 60mph...`,
        },
        { type: "diagram", name: "thinking", caption: "Reasoning first, answer second. The 'thinking' is a scratchpad that improves the final result." },
        { type: "h2", text: "The modern way: adaptive thinking" },
        {
          type: "p",
          text: "Newer Claude models have **built-in thinking**. Instead of prompting 'think step by step,' you enable `thinking: {type: 'adaptive'}` and pick an effort level. Claude then decides how much internal reasoning each request needs, and returns it as separate **thinking blocks** you can show or hide.",
        },
        {
          type: "compare",
          columns: ["Approach", "How"],
          rows: [
            { label: "Prompted CoT", cells: ["Add 'think step by step' / reasoning tags in the prompt. Works on any model."] },
            { label: "Adaptive thinking", cells: ["Set thinking + effort parameters; the model reasons natively and returns thinking blocks."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "More thinking ≠ always better",
          text: "Reasoning costs tokens and latency. Use it where multi-step logic genuinely helps. For simple lookups or classification, it's wasted effort — keep effort low or thinking off.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Separate reasoning from the answer",
          text: "Whether prompted or native, keep the reasoning in its own section/blocks and the deliverable in another. That way your app can extract just the answer while still benefiting from the reasoning.",
        },
      ],
      takeaways: [
        "Chain-of-thought — reasoning step-by-step before answering — boosts accuracy on multi-step problems.",
        "Prompted CoT works on any model; modern models offer native adaptive thinking + effort.",
        "Thinking is returned in separate blocks you can show or hide.",
        "Reasoning costs tokens/latency — reserve it for problems that actually need it.",
      ],
      flashcards: [
        { front: "What is chain-of-thought prompting?", back: "Instructing the model to reason step-by-step before giving the final answer, improving accuracy on complex tasks." },
        { front: "Modern alternative to 'think step by step'?", back: "Enable adaptive thinking and set an effort level; the model reasons natively and returns thinking blocks." },
        { front: "When is thinking wasteful?", back: "On simple tasks (lookups, basic classification) where multi-step reasoning adds cost and latency with no accuracy gain." },
      ],
      quiz: [
        {
          q: "Why does chain-of-thought improve hard-problem accuracy?",
          options: [
            "It uses a bigger model",
            "Working through intermediate steps reduces leap-to-wrong-answer errors",
            "It lowers temperature automatically",
            "It caches the answer",
          ],
          answer: 1,
          explain: "Explicit intermediate reasoning catches mistakes that a direct answer would skip past.",
        },
      ],
    },

    {
      slug: "real-world-prompts",
      title: "Real-world prompts: putting it together",
      summary:
        "Production prompts combine every technique into a maintainable template — like a call summarizer or a support agent — with clear inputs and reliable structured output.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "From snippets to systems" },
        {
          type: "p",
          text: "Real applications don't use one-line prompts. They use **templates**: a stable, well-structured prompt with slots for dynamic data. The craft is assembling role, rules, examples, the input, and the output contract into something you can run thousands of times and trust.",
        },
        { type: "h3", text: "Anatomy of a production prompt" },
        {
          type: "steps",
          items: [
            { title: "Role & goal", text: "Who Claude is and the single job it must do." },
            { title: "Context / source data", text: "The document, transcript, or record — wrapped in tags." },
            { title: "Rules & edge cases", text: "What to do when data is missing, ambiguous, or out of scope." },
            { title: "Output contract", text: "The exact format — usually structured (JSON/sections), with an example." },
          ],
        },
        {
          type: "code",
          lang: "text",
          caption: "A call-summarizer template",
          code: `System: You summarize sales calls for the CRM. Be factual; never invent details.

<transcript>
{{transcript}}
</transcript>

Produce JSON with exactly these keys:
- "summary": 2-3 sentence overview
- "action_items": array of short strings (empty if none)
- "sentiment": one of "positive" | "neutral" | "negative"
- "follow_up_date": ISO date or null

Use null/empty when the transcript doesn't say. Output only JSON.`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Define the failure modes",
          text: "Most production bugs come from unhandled cases: missing fields, off-topic input, or refusals. Spell out 'if you don't know, return null' explicitly — don't leave it to chance.",
        },
        { type: "h3", text: "A support-agent prompt adds guardrails" },
        {
          type: "list",
          items: [
            "**Grounding** — answer only from provided docs; cite or escalate when unsure.",
            "**Boundaries** — never promise refunds, quote prices not in the docs, or give legal advice.",
            "**Persona & tone** — consistent voice that matches the brand.",
            "**Escalation path** — a clear 'hand off to a human' behavior.",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Version your prompts",
          text: "Treat prompts like code: keep them in source control, change one thing at a time, and re-run your evals after each edit. A prompt is a critical, testable artifact.",
        },
      ],
      takeaways: [
        "Production prompts are reusable templates with slots for dynamic data.",
        "Structure them: role/goal, source data (tagged), rules & edge cases, output contract with an example.",
        "Explicitly define failure modes — missing data, off-topic input, unsure answers.",
        "Version prompts like code and re-run evals after every change.",
      ],
      flashcards: [
        { front: "What's a 'prompt template'?", back: "A stable, structured prompt with slots for dynamic data, run repeatedly in production." },
        { front: "Most common source of production prompt bugs?", back: "Unhandled edge cases — missing fields, off-topic input, ambiguity. Spell out fallback behavior explicitly." },
        { front: "How should you treat prompts operationally?", back: "Like code: version-controlled, changed one variable at a time, re-tested with evals after each edit." },
      ],
      quiz: [
        {
          q: "Your summarizer occasionally invents a follow-up date when none was mentioned. Best fix?",
          options: [
            "Lower max_tokens",
            "Add an explicit rule: 'use null when the transcript doesn't state a date'",
            "Switch to streaming",
            "Remove the JSON requirement",
          ],
          answer: 1,
          explain: "Define the missing-data behavior explicitly; hallucinated fields come from unspecified edge cases.",
        },
      ],
    },

    {
      slug: "prompt-caching",
      title: "Prompt caching",
      summary:
        "Reuse a large, stable prompt prefix across requests to cut cost (up to ~90%) and latency. Caching is a prefix match — one byte change invalidates it.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Pay once for repeated context" },
        {
          type: "p",
          text: "Many apps send the same big chunk of context every request: a long system prompt, tool definitions, a reference document, few-shot examples. **Prompt caching** lets Claude store that prefix after the first request and reuse it cheaply on the next ones — cache reads cost about a tenth of normal input tokens.",
        },
        { type: "diagram", name: "caching", caption: "The stable prefix is cached once; later requests reuse it and only pay full price for the new, varying part." },
        {
          type: "callout",
          kind: "key",
          title: "The one invariant",
          text: "Caching is a PREFIX MATCH. Claude reuses the cache only up to the first byte that differs. Any change anywhere in the prefix — a new timestamp, a reordered JSON key, a different tool — invalidates everything after it.",
        },
        { type: "h3", text: "Order things by stability" },
        {
          type: "p",
          text: "Render order is **tools → system → messages**. Put the most stable content first, volatile content last. A breakpoint (`cache_control`) goes at the end of the stable section.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Caching a large system prompt",
          code: `response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": LARGE_REFERENCE_DOC,           # stable across requests
        "cache_control": {"type": "ephemeral"} # mark the cache breakpoint
    }],
    messages=[{"role": "user", "content": user_question}],  # the varying part
)`,
        },
        { type: "h3", text: "Silent cache killers" },
        {
          type: "list",
          items: [
            "**Timestamps / UUIDs** interpolated into the system prompt — change every request.",
            "**Non-deterministic JSON** — serialize tool/schema definitions with sorted keys.",
            "**Per-user data in the prefix** — keeps anything from being shared across users.",
            "**Changing the model or tool set mid-conversation** — invalidates the whole cache.",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Verify it's working",
          text: "Check usage.cache_read_input_tokens in the response. If it stays zero across identical-prefix requests, a silent invalidator is sneaking into your prefix — diff two rendered prompts to find it.",
        },
        {
          type: "compare",
          caption: "Cost intuition (per token, relative to normal input)",
          columns: ["Operation", "Relative cost"],
          rows: [
            { label: "Normal input", cells: ["1×"] },
            { label: "Cache write (first time)", cells: ["~1.25× (5-min TTL)"] },
            { label: "Cache read (reuse)", cells: ["~0.1×"] },
          ],
        },
      ],
      takeaways: [
        "Prompt caching reuses a stable prefix across requests — reads cost ~10% of normal input.",
        "It's a strict prefix match: any byte change in the prefix invalidates everything after it.",
        "Order by stability (tools → system → messages); put a cache breakpoint after the stable part.",
        "Avoid timestamps/UUIDs/unsorted JSON in the prefix; verify via usage.cache_read_input_tokens.",
      ],
      flashcards: [
        { front: "How does prompt caching match?", back: "By exact prefix. Reuse stops at the first differing byte — any earlier change invalidates the rest." },
        { front: "What's the render order for caching?", back: "tools → system → messages. Put stable content first, volatile content last." },
        { front: "How do you confirm a cache hit?", back: "Check usage.cache_read_input_tokens in the response; zero across identical prefixes means a silent invalidator." },
      ],
      quiz: [
        {
          q: "Your cache never hits despite identical context. Most likely cause?",
          options: [
            "The model is too small",
            "A volatile value (timestamp/UUID) is interpolated into the prefix",
            "max_tokens is too low",
            "You're not streaming",
          ],
          answer: 1,
          explain: "A changing byte in the prefix invalidates the cache. Timestamps and UUIDs are the classic culprits.",
        },
        {
          q: "Where should volatile, per-request content go?",
          options: [
            "At the very start of the system prompt",
            "After the cache breakpoint, in the latest messages",
            "In the tool definitions",
            "It can't be sent if you cache",
          ],
          answer: 1,
          explain: "Stable content first (cached), volatile content last so it doesn't break the prefix.",
        },
      ],
    },
  ],
};
