import type { Module } from "./types";

export const foundations: Module = {
  id: "foundations",
  title: "Foundations",
  blurb:
    "What Claude is, how you talk to it, and the core mechanics every other topic builds on.",
  accent: "clay",
  lessons: [
    {
      slug: "what-is-claude",
      title: "What is Claude & the Anthropic API",
      summary:
        "Claude is a family of large language models from Anthropic. You use it by sending text (and images) to a single HTTP endpoint and reading back a generated reply.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "A model you call, not a product you log into" },
        {
          type: "p",
          text: "Claude is a family of large language models (LLMs) built by Anthropic. An LLM is a system trained on enormous amounts of text to predict and generate language. When you 'build with Claude,' you are not using a chat website — you are sending requests to an API (Application Programming Interface) and getting back generated text that your own app can use however it likes.",
        },
        {
          type: "p",
          text: "Almost everything goes through one endpoint: **POST /v1/messages**. You send a list of messages; Claude returns a reply. Tools, images, structured outputs, and thinking are all features layered on top of that single endpoint — not separate APIs.",
        },
        { type: "diagram", name: "request-response", caption: "The shape of every interaction: your app sends a request, Claude returns a structured response." },
        { type: "h3", text: "Three ways to reach Claude" },
        {
          type: "list",
          items: [
            "**Official SDKs** — libraries for Python, TypeScript/JavaScript, Java, Go, Ruby, C#, and PHP that wrap the HTTP calls. This is the default for real projects.",
            "**Raw HTTP** — plain `curl`/`fetch` requests. Useful for quick tests or languages without an SDK.",
            "**Cloud providers** — Claude is also served on Amazon Bedrock, Google Vertex AI, and Microsoft Foundry for teams already on those platforms.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The mental model",
          text: "Claude is stateless. It does not remember previous calls. Every request you send must contain the entire conversation so far. 'Memory' in a chatbot is just your app re-sending the history each turn.",
        },
        { type: "h3", text: "An API key authenticates you" },
        {
          type: "p",
          text: "You authenticate with an API key — a secret string tied to your organization and billing. The golden rule: **never hard-code it**. Read it from an environment variable (`ANTHROPIC_API_KEY`) so it never ends up in your source code or git history.",
        },
        {
          type: "code",
          lang: "python",
          caption: "The smallest possible Claude program (Python SDK)",
          code: `import anthropic

# Reads ANTHROPIC_API_KEY from the environment automatically
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain what an API is in one sentence."}
    ],
)

print(response.content[0].text)`,
        },
        {
          type: "callout",
          kind: "note",
          title: "Why a 'family' of models?",
          text: "Different jobs need different trade-offs of intelligence, speed, and cost. Anthropic ships several models (Opus, Sonnet, Haiku, and the most capable Fable) so you can pick the right one per task. You'll learn to choose in the Models lesson.",
        },
      ],
      takeaways: [
        "Claude is a family of LLMs you access through the Anthropic API, mainly the POST /v1/messages endpoint.",
        "The API is stateless — you resend the full conversation every turn.",
        "Authenticate with an API key stored in an environment variable, never in code.",
        "Tools, vision, and structured output are features of the Messages endpoint, not separate APIs.",
      ],
      flashcards: [
        { front: "Is the Claude API stateful or stateless?", back: "Stateless. Claude remembers nothing between calls — your app must resend the full conversation history each request." },
        { front: "What single endpoint does almost everything?", back: "POST /v1/messages — the Messages API. Tools, images, and structured outputs are features of it." },
        { front: "Where should your API key live?", back: "In an environment variable (e.g. ANTHROPIC_API_KEY), never hard-coded in source." },
      ],
      quiz: [
        {
          q: "How does Claude 'remember' an earlier message in a conversation?",
          options: [
            "It stores conversations on Anthropic's servers by session ID",
            "Your application resends the entire conversation history with each request",
            "It uses cookies in the browser",
            "It cannot reference earlier messages at all",
          ],
          answer: 1,
          explain: "The API is stateless. Continuity is created by your app re-sending the full message history every turn.",
        },
        {
          q: "Which endpoint underpins tool use, vision, and structured outputs?",
          options: ["/v1/tools", "/v1/vision", "/v1/messages", "a different endpoint for each"],
          answer: 2,
          explain: "They are all features layered on the single Messages endpoint, /v1/messages.",
        },
      ],
    },

    {
      slug: "the-messages-api",
      title: "The Messages format & roles",
      summary:
        "Conversations are a list of messages, each with a role (user, assistant, or system) and content. Understanding this structure is the key to everything.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "A conversation is a list of turns" },
        {
          type: "p",
          text: "The `messages` array is the heart of the API. Each entry has a **role** and **content**. Roles tell Claude who is 'speaking':",
        },
        { type: "diagram", name: "message-roles", caption: "Roles structure the dialogue. The system prompt sets the rules; user and assistant turns alternate." },
        {
          type: "list",
          items: [
            "**user** — input from the human (or your app acting on their behalf).",
            "**assistant** — Claude's replies. When you continue a conversation, you include Claude's previous answers here.",
            "**system** — separate top-level instructions that set Claude's role, tone, and rules. It isn't a message in the array on most models; it's its own `system` field.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A multi-turn conversation",
          code: `response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="You are a concise travel assistant.",
    messages=[
        {"role": "user", "content": "I'm going to Tokyo."},
        {"role": "assistant", "content": "Great choice! How many days?"},
        {"role": "user", "content": "Five days."},
    ],
)`,
        },
        {
          type: "callout",
          kind: "key",
          title: "The two hard rules",
          text: "1) The first message must have role 'user'. 2) On a fresh request the conversation should make sense as alternating turns. The API will combine consecutive same-role messages, but starting with 'assistant' is an error.",
        },
        { type: "h3", text: "Content can be more than text" },
        {
          type: "p",
          text: "A message's `content` can be a simple string, or a list of **content blocks** for richer input — text blocks, image blocks, document blocks, and tool results. This is how multimodal prompts and tool use are expressed.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Content as a list of blocks (text + image)",
          code: `messages=[
    {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "url", "url": "https://.../chart.png"}},
            {"type": "text", "text": "What trend does this chart show?"},
        ],
    }
]`,
        },
        { type: "h3", text: "What comes back" },
        {
          type: "p",
          text: "The response also has a `content` array of blocks (usually a `text` block, sometimes `thinking` or `tool_use` blocks), plus a `stop_reason` telling you why Claude stopped, and `usage` reporting how many tokens were consumed.",
        },
        {
          type: "compare",
          caption: "Common stop_reason values",
          columns: ["stop_reason", "Meaning"],
          rows: [
            { label: "end_turn", cells: ["Claude finished its reply naturally."] },
            { label: "max_tokens", cells: ["Hit your output limit — the reply was cut off."] },
            { label: "tool_use", cells: ["Claude wants to call a tool; you run it and continue."] },
            { label: "refusal", cells: ["Claude declined for safety reasons."] },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Always check before you read",
          text: "Read response.stop_reason before grabbing response.content[0].text. If stop_reason is 'refusal' the content may be empty, and blindly indexing it will crash your app.",
        },
      ],
      takeaways: [
        "A conversation is a list of messages, each with a role (user/assistant) and content.",
        "The system prompt is a separate top-level field that sets Claude's persona and rules.",
        "The first message must be 'user'; content can be a string or a list of blocks (text, image, etc.).",
        "Responses include content blocks, a stop_reason, and token usage — always check stop_reason first.",
      ],
      flashcards: [
        { front: "What three roles structure a conversation?", back: "user (human input), assistant (Claude's replies), and system (top-level instructions / persona)." },
        { front: "What must the first message's role be?", back: "user. Starting with an assistant message is an error." },
        { front: "What does stop_reason='tool_use' mean?", back: "Claude wants to call a tool. You execute it, return the result, and call the API again to continue." },
      ],
      quiz: [
        {
          q: "Where do you put 'You are a helpful legal assistant'?",
          options: ["In a user message", "In the system field/prompt", "In an assistant message", "In the model name"],
          answer: 1,
          explain: "Persona and global rules belong in the system prompt — a separate top-level field, not a turn in the messages array.",
        },
        {
          q: "Why check stop_reason before reading content?",
          options: [
            "It's required by the SDK",
            "A refusal or other non-text stop can leave content empty, crashing naive code",
            "It changes the model used",
            "It's only needed for streaming",
          ],
          answer: 1,
          explain: "On a refusal, content can be empty. Guard with stop_reason so indexing content[0] doesn't throw.",
        },
      ],
    },

    {
      slug: "tokens-and-context",
      title: "Tokens & the context window",
      summary:
        "Models don't read characters — they read tokens. The context window is the total tokens a model can consider at once. Both drive cost and capability.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Tokens: the unit of everything" },
        {
          type: "p",
          text: "Before Claude processes your text, it is split into **tokens** — chunks roughly the size of a short word or word-piece. A token is about 3–4 characters of English on average. 'unbelievable' might be 3 tokens; common words are 1. Code and non-English text tokenize differently.",
        },
        { type: "diagram", name: "tokens", caption: "Text is broken into tokens. Pricing, limits, and speed are all measured in tokens — not characters or words." },
        {
          type: "p",
          text: "Tokens matter because **you pay per token** (input and output, at different rates), and because every model has a maximum number it can handle. Counting characters with another tool (like a generic tokenizer) gives wrong numbers — use Claude's own `count_tokens` endpoint when precision matters.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Don't use tiktoken for Claude",
          text: "tiktoken is OpenAI's tokenizer and undercounts Claude tokens by ~15–20% (more for code). For accurate counts, use the Claude count_tokens endpoint with the same model you'll call.",
        },
        { type: "h2", text: "The context window" },
        {
          type: "p",
          text: "The **context window** is the maximum number of tokens a model can consider in a single request — your system prompt, the entire conversation history, tool definitions, documents, AND the space reserved for the answer all share it. Today's Claude models offer very large windows (up to 1 million tokens on the top models).",
        },
        { type: "diagram", name: "context-window", caption: "Everything competes for one budget: instructions, history, retrieved documents, and the room left for the reply." },
        {
          type: "list",
          items: [
            "**Input tokens** — everything you send (system + messages + tools + documents).",
            "**Output tokens** — what Claude generates, capped by your `max_tokens` setting.",
            "**Together** they must fit inside the context window.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Big window ≠ dump everything",
          text: "A million-token window doesn't mean you should fill it. More tokens cost more, run slower, and can dilute the model's focus. Send what's relevant — this is exactly why techniques like RAG and prompt caching exist.",
        },
        { type: "h3", text: "max_tokens is a ceiling, not a target" },
        {
          type: "p",
          text: "`max_tokens` caps the *output*. Set it too low and Claude's answer gets truncated (stop_reason becomes `max_tokens`). Set a comfortable value — around 16,000 for normal requests, higher (up to 64K–128K) when you stream long outputs.",
        },
      ],
      takeaways: [
        "Models process tokens (~3–4 chars each), not characters. You pay per input and output token.",
        "The context window is the total token budget shared by your prompt, history, documents, and the reply.",
        "A large window is a capability, not an instruction to fill it — relevance beats volume.",
        "Use Claude's count_tokens endpoint for accurate counts; don't use tiktoken.",
      ],
      flashcards: [
        { front: "What is a token, roughly?", back: "A chunk of text ~3–4 characters of English. Models read and bill in tokens, not characters or words." },
        { front: "What is the context window?", back: "The max tokens a model can consider at once — system prompt, history, tools, documents, and the reply all share that budget." },
        { front: "What does max_tokens control?", back: "The maximum number of OUTPUT tokens. Too low truncates the reply (stop_reason='max_tokens')." },
      ],
      quiz: [
        {
          q: "Which of these counts against the context window?",
          options: [
            "Only the user's latest message",
            "Only Claude's reply",
            "System prompt + full history + tools + documents + the reply",
            "Nothing — the window only limits the reply",
          ],
          answer: 2,
          explain: "Everything shares the window: all input plus the reserved space for output.",
        },
        {
          q: "You set max_tokens=200 and the answer is cut off mid-sentence. What happened?",
          options: [
            "The model is broken",
            "You hit the output cap; stop_reason is 'max_tokens' — raise it",
            "The context window is full",
            "The API key expired",
          ],
          answer: 1,
          explain: "max_tokens caps output. A cut-off answer with stop_reason='max_tokens' means raise the limit.",
        },
      ],
    },

    {
      slug: "models-and-pricing",
      title: "Choosing a model",
      summary:
        "Anthropic offers a tiered family — Haiku, Sonnet, Opus, and the most capable Fable. You trade intelligence, speed, and cost against the task.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "One family, several tiers" },
        {
          type: "p",
          text: "There isn't one 'Claude.' There's a lineup, refreshed over time, where each tier targets a different balance of capability, latency, and price. Picking well is one of the highest-leverage decisions you make.",
        },
        { type: "diagram", name: "model-tiers", caption: "The classic trade-off triangle: more intelligence usually means more cost and latency." },
        {
          type: "compare",
          caption: "The tiers (current generation, illustrative)",
          columns: ["Tier", "Best for", "Trade-off"],
          rows: [
            { label: "Haiku", cells: ["High-volume, simple, latency-critical tasks (classification, routing, quick extraction).", "Fastest & cheapest; least capable on hard reasoning."] },
            { label: "Sonnet", cells: ["The balanced workhorse for most production apps.", "Strong intelligence at moderate cost & speed."] },
            { label: "Opus", cells: ["Hard reasoning, agentic coding, deep analysis.", "Most capable Opus-tier; higher cost & latency."] },
            { label: "Fable", cells: ["The most demanding, long-horizon, frontier work.", "Top capability; premium price — choose deliberately."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Default to capable, downgrade with evidence",
          text: "Start on a strong model so you're measuring the idea, not the model's limits. Once it works, try a cheaper tier and keep it only if your evaluations stay green. Never silently downgrade for cost without checking quality.",
        },
        { type: "h3", text: "Use exact model IDs" },
        {
          type: "p",
          text: "You select a model by its **ID string** (e.g. `claude-opus-4-8`, `claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-fable-5`). Use the exact published ID — a typo or invented date-suffix returns a 404. Aliases like `claude-opus-4-8` point at the latest snapshot.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Picking a model per task",
          code: `# Cheap & fast for a simple classification
label = client.messages.create(
    model="claude-haiku-4-5", max_tokens=10,
    messages=[{"role": "user", "content": f"Sentiment (one word): {review}"}],
)

# Strong model for complex reasoning
plan = client.messages.create(
    model="claude-opus-4-8", max_tokens=16000,
    messages=[{"role": "user", "content": "Design a migration plan for ..."}],
)`,
        },
        { type: "h3", text: "Pricing in one breath" },
        {
          type: "p",
          text: "Pricing is **per million tokens**, with **output costing more than input** (output is roughly 5× input on most tiers). Cheaper tiers cost less per token AND tend to need fewer output tokens for simple jobs — the savings compound. Two big levers reduce cost without changing the model: **prompt caching** (reuse repeated context) and the **Batch API** (50% off for non-urgent bulk work).",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Discover capabilities at runtime",
          text: "The Models API (list / retrieve) returns each model's context window, max output, and capabilities (vision, thinking, effort). Query it instead of hard-coding assumptions that drift over time.",
        },
      ],
      takeaways: [
        "Claude is a tiered family: Haiku (fast/cheap), Sonnet (balanced), Opus (powerful), Fable (frontier).",
        "Match the tier to the task; default to a capable model and downgrade only if evals stay green.",
        "Select models by exact ID string — invented IDs 404.",
        "Pricing is per million tokens with output ~5× input; caching and the Batch API cut cost without changing models.",
      ],
      flashcards: [
        { front: "Which tier for high-volume, latency-critical classification?", back: "Haiku — fastest and cheapest, ideal when the task is simple." },
        { front: "Which tier is the balanced production workhorse?", back: "Sonnet — strong intelligence at moderate cost and speed." },
        { front: "Input vs output token cost?", back: "Output is more expensive than input — roughly 5× on most tiers." },
      ],
      quiz: [
        {
          q: "You're routing 100k support tickets/day into 5 categories. Best default tier?",
          options: ["Fable", "Opus", "Haiku", "Whatever is newest"],
          answer: 2,
          explain: "Simple, high-volume, latency-sensitive classification is the canonical Haiku use case.",
        },
        {
          q: "Best practice when moving to a cheaper model to save money?",
          options: [
            "Just switch — cheaper is always fine",
            "Switch only if your evaluations show quality holds",
            "Never change models",
            "Double max_tokens to compensate",
          ],
          answer: 1,
          explain: "Downgrade with evidence: keep the cheaper tier only if your evals stay green.",
        },
      ],
    },

    {
      slug: "parameters",
      title: "Parameters that shape the output",
      summary:
        "max_tokens, temperature, stop sequences, and modern controls like thinking and effort let you tune Claude's behavior without touching the prompt.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Knobs you turn per request" },
        {
          type: "p",
          text: "Beyond the prompt itself, a handful of parameters change how Claude responds. The most important is `max_tokens` (covered already). The rest let you trade determinism, creativity, length, and reasoning depth.",
        },
        { type: "h3", text: "temperature — randomness vs. focus" },
        {
          type: "p",
          text: "`temperature` (0 to 1) controls how 'adventurous' token selection is. Low temperature → focused, repeatable, good for extraction and classification. High temperature → varied, creative, good for brainstorming and writing.",
        },
        { type: "diagram", name: "temperature", caption: "Low temperature concentrates probability on the likeliest next tokens; high temperature spreads it out." },
        {
          type: "callout",
          kind: "warn",
          title: "Newer models prefer prompting over sampling knobs",
          text: "On the latest Claude models (Opus 4.7/4.8 and Fable 5), temperature, top_p, and top_k are removed and will error. Steer behavior with the prompt and the effort parameter instead. On slightly older models you may set temperature OR top_p, but not both.",
        },
        { type: "h3", text: "stop sequences — end on a marker" },
        {
          type: "p",
          text: "You can pass `stop_sequences`: strings that, when generated, make Claude stop immediately. Useful for cutting output at a delimiter you control.",
        },
        { type: "h3", text: "Thinking & effort — how hard to reason" },
        {
          type: "p",
          text: "Modern Claude can **think** before answering. Rather than a fixed token budget, you enable **adaptive thinking** and set an **effort** level (low / medium / high / xhigh / max). Higher effort = deeper reasoning and more tool use, at more cost and latency. This pair largely replaces the old manual 'thinking budget.'",
        },
        {
          type: "code",
          lang: "python",
          caption: "Adaptive thinking + effort on a modern model",
          code: `response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},          # let Claude decide how much to think
    output_config={"effort": "high"},        # low | medium | high | xhigh | max
    messages=[{"role": "user", "content": "Prove that sqrt(2) is irrational."}],
)`,
        },
        {
          type: "compare",
          caption: "When to raise or lower effort",
          columns: ["Setting", "Use it for"],
          rows: [
            { label: "low", cells: ["Simple, latency-sensitive tasks; sub-agents."] },
            { label: "medium", cells: ["A cost-sensitive balance."] },
            { label: "high", cells: ["Most intelligence-sensitive work (a strong default)."] },
            { label: "xhigh / max", cells: ["Hard coding & agentic tasks; correctness over cost."] },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Determinism isn't guaranteed",
          text: "Even at temperature 0 (on models that support it), outputs can vary slightly. For reliable structure, use structured outputs or tools — not just a low temperature.",
        },
      ],
      takeaways: [
        "max_tokens caps output; temperature trades focus (low) for creativity (high).",
        "On the newest models, temperature/top_p/top_k are removed — steer with the prompt and effort instead.",
        "Adaptive thinking + an effort level (low→max) controls how deeply Claude reasons.",
        "Stop sequences end generation at a marker you define; temperature 0 is not perfectly deterministic.",
      ],
      flashcards: [
        { front: "What does low temperature give you?", back: "Focused, repeatable output — good for extraction, classification, and factual tasks." },
        { front: "What replaced the fixed 'thinking budget' on modern models?", back: "Adaptive thinking plus the effort parameter (low / medium / high / xhigh / max)." },
        { front: "What happens if you send temperature on Opus 4.8 / Fable 5?", back: "It errors (400). Those models removed sampling parameters; steer with the prompt and effort." },
      ],
      quiz: [
        {
          q: "You want consistent, structured data extraction. Best lever?",
          options: ["High temperature", "Low temperature and/or structured outputs", "Max effort always", "More stop sequences"],
          answer: 1,
          explain: "Low temperature (where supported) plus structured outputs gives reliable, repeatable structure.",
        },
        {
          q: "On a modern model, how do you make Claude reason harder on a tough problem?",
          options: [
            "Raise temperature",
            "Enable adaptive thinking and raise the effort level",
            "Lower max_tokens",
            "Add more stop sequences",
          ],
          answer: 1,
          explain: "Adaptive thinking + higher effort is the modern way to deepen reasoning.",
        },
      ],
    },

    {
      slug: "streaming",
      title: "Streaming responses",
      summary:
        "Instead of waiting for the whole reply, stream tokens as they're generated — better UX and protection against timeouts on long outputs.",
      minutes: 5,
      blocks: [
        { type: "h2", text: "Why stream" },
        {
          type: "p",
          text: "By default a request blocks until the entire reply is ready. For long answers that feels slow, and very large outputs can even hit network timeouts. **Streaming** sends the response in small pieces (Server-Sent Events) as Claude generates them, so text appears word-by-word — like the typing effect in a chat UI.",
        },
        { type: "diagram", name: "streaming", caption: "Without streaming you wait for the full reply; with streaming, tokens arrive incrementally." },
        {
          type: "list",
          items: [
            "**Better UX** — users see progress immediately instead of a spinner.",
            "**Timeout safety** — required in practice for large max_tokens (long outputs).",
            "**Early cancellation** — you can stop generation once you have enough.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Streaming with the SDK helper",
          code: `with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=4000,
    messages=[{"role": "user", "content": "Write a short story about the sea."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

    final = stream.get_final_message()  # full message when you need usage, etc.`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Stream long outputs",
          text: "For large max_tokens (roughly above 16K), the SDKs expect you to stream — non-streaming requests can exceed the HTTP timeout. Use the stream helper and call get_final_message() to assemble the result.",
        },
        { type: "h3", text: "Event types you'll see" },
        {
          type: "p",
          text: "A stream is a sequence of events: `message_start`, then `content_block_start` / `content_block_delta` (the incremental pieces) / `content_block_stop`, then `message_delta` (carrying the final stop_reason and usage), and `message_stop`. The SDK helpers hide most of this, but knowing the shape helps when debugging.",
        },
      ],
      takeaways: [
        "Streaming delivers the reply in incremental events instead of one blocking response.",
        "It improves perceived speed and is effectively required for very long outputs (timeout safety).",
        "The SDK exposes a text_stream for tokens and get_final_message() to assemble the whole reply.",
        "Under the hood it's Server-Sent Events: message_start → content_block_delta… → message_stop.",
      ],
      flashcards: [
        { front: "Why is streaming effectively required for long outputs?", back: "Non-streaming requests with large max_tokens can exceed the HTTP timeout; streaming avoids that and shows progress." },
        { front: "How do you get the complete message when streaming?", back: "Call the stream helper's get_final_message() / finalMessage() after consuming the deltas." },
      ],
      quiz: [
        {
          q: "Main user-facing benefit of streaming?",
          options: ["Cheaper tokens", "Text appears incrementally instead of after a long wait", "Higher accuracy", "Smaller context window"],
          answer: 1,
          explain: "Streaming improves perceived latency by showing output as it's generated.",
        },
      ],
    },

    {
      slug: "vision-multimodal",
      title: "Vision & multimodal prompts",
      summary:
        "Claude can see. Send images alongside text — as base64 data or URLs — to describe, analyze, transcribe, and reason over visual content.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Text plus pixels" },
        {
          type: "p",
          text: "Claude is **multimodal**: a single message can mix text and images. You add an `image` content block (and PDFs via a `document` block) to the user message. Claude can then describe scenes, read charts, transcribe handwriting, extract data from screenshots, and answer questions grounded in the picture.",
        },
        { type: "diagram", name: "multimodal", caption: "Images and text become content blocks in one user message; Claude reasons over both together." },
        { type: "h3", text: "Two ways to supply an image" },
        {
          type: "compare",
          columns: ["Method", "How", "When"],
          rows: [
            { label: "Base64", cells: ["Encode the image bytes and inline them in the block.", "Local files; images not on a public URL."] },
            { label: "URL", cells: ["Pass a public https URL Claude can fetch.", "Images already hosted online."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Sending a local image as base64",
          code: `import base64

with open("receipt.png", "rb") as f:
    data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-opus-4-8", max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {"type": "image",
             "source": {"type": "base64", "media_type": "image/png", "data": data}},
            {"type": "text", "text": "Extract the total and the date as JSON."},
        ],
    }],
)`,
        },
        { type: "h3", text: "Practical tips" },
        {
          type: "list",
          items: [
            "**Put the image before the text** that refers to it for best results.",
            "**Images cost tokens** too — larger/higher-resolution images use more. Downscale if you don't need fine detail.",
            "**Be specific** about what to extract: 'list every line item with price' beats 'describe this.'",
            "**PDFs** go in a `document` block (base64 or via the Files API) and can include citations.",
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Multimodal unlocks real workflows",
          text: "Receipt/invoice extraction, chart understanding, UI screenshot debugging, document Q&A, and accessibility descriptions are all 'just' a vision prompt — no special pipeline required.",
        },
      ],
      takeaways: [
        "Claude is multimodal: mix text and image (and PDF) content blocks in one user message.",
        "Supply images as inline base64 or as a public URL.",
        "Place the image before the text that references it; images consume tokens by size/resolution.",
        "Common uses: data extraction from receipts/charts, screenshot debugging, document Q&A.",
      ],
      flashcards: [
        { front: "Two ways to give Claude an image?", back: "Inline base64-encoded bytes, or a public https URL it can fetch." },
        { front: "Best ordering for image + question?", back: "Put the image block first, then the text that refers to it." },
      ],
      quiz: [
        {
          q: "How do you reliably extract structured data from a receipt photo?",
          options: [
            "Use a special OCR endpoint",
            "Send the image plus a specific text instruction (e.g. 'return total and date as JSON')",
            "It's impossible without fine-tuning",
            "Only URLs work, not local files",
          ],
          answer: 1,
          explain: "A vision prompt with a precise extraction instruction handles this directly — no separate OCR pipeline needed.",
        },
      ],
    },

    {
      slug: "system-prompts",
      title: "System prompts: setting the rules",
      summary:
        "The system prompt is where you define who Claude is, what it must and must not do, and the format of its answers. It steers every turn that follows.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The director's note" },
        {
          type: "p",
          text: "If user messages are the dialogue, the **system prompt** is the director's note that shapes the whole performance. It's a separate top-level field where you set persona, domain, constraints, tone, and output format. It applies to the entire conversation, not just one turn.",
        },
        { type: "diagram", name: "prompt-anatomy", caption: "A well-built system prompt has clear sections: role, context, rules, format, and examples." },
        { type: "h3", text: "What to put in it" },
        {
          type: "list",
          items: [
            "**Role & expertise** — 'You are a senior tax advisor for US small businesses.'",
            "**Rules & boundaries** — what to do, what to refuse, what to never assume.",
            "**Output format** — JSON shape, length limits, structure ('answer in <answer> tags').",
            "**Tone** — formal, friendly, terse.",
            "**Reference material** — stable context the model should always have (a policy, a schema).",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "A structured system prompt",
          code: `system = """You are a support assistant for Acme Cloud.

Rules:
- Only answer using the documentation provided. If unsure, say so and offer to escalate.
- Never invent pricing or make promises about refunds.

Format:
- Be concise (under 120 words).
- End with one suggested next step."""

response = client.messages.create(
    model="claude-sonnet-4-6", max_tokens=1024,
    system=system,
    messages=[{"role": "user", "content": "How do I reset my API key?"}],
)`,
        },
        {
          type: "callout",
          kind: "warn",
          title: "Modern models are very literal — don't over-shout",
          text: "Older models needed 'CRITICAL: YOU MUST…' to comply. Newer Claude follows instructions closely, so aggressive language causes over-triggering. Prefer calm, specific phrasing: 'Use the search tool when the answer depends on current information.'",
        },
        { type: "h3", text: "Keep it stable for caching" },
        {
          type: "p",
          text: "Because the system prompt sits at the front of every request, keeping it **byte-stable** lets prompt caching reuse it cheaply. Don't interpolate volatile things (timestamps, request IDs, the user's name) into it — inject those later in the conversation instead. You'll see why in the caching lesson.",
        },
        {
          type: "callout",
          kind: "key",
          title: "Specificity beats length",
          text: "A precise 5-line system prompt usually outperforms a vague 50-line one. State the role, the hard rules, and the exact output format — then stop.",
        },
      ],
      takeaways: [
        "The system prompt sets persona, rules, output format, and tone for the whole conversation.",
        "Structure it: role, context, rules, format, examples.",
        "Modern Claude is literal — use calm, specific instructions, not 'CRITICAL: YOU MUST'.",
        "Keep it byte-stable (no timestamps/IDs) so prompt caching can reuse it.",
      ],
      flashcards: [
        { front: "What belongs in a system prompt?", back: "Role/expertise, hard rules and boundaries, output format, tone, and stable reference material." },
        { front: "Why avoid timestamps in the system prompt?", back: "They change every request, breaking prompt caching of the stable prefix." },
        { front: "Why not write 'CRITICAL: YOU MUST' to modern Claude?", back: "It follows instructions literally now, so aggressive language causes over-triggering. Use calm, specific phrasing." },
      ],
      quiz: [
        {
          q: "Best place to specify 'always answer as JSON with keys name and total'?",
          options: ["Every user message", "The system prompt's format section", "The model ID", "A stop sequence"],
          answer: 1,
          explain: "Global output format rules belong in the system prompt so they apply to every turn.",
        },
        {
          q: "Why keep the system prompt free of the current timestamp?",
          options: [
            "It's against the rules",
            "It changes each request and breaks prompt caching of the prefix",
            "Timestamps confuse the tokenizer",
            "It makes the prompt too long",
          ],
          answer: 1,
          explain: "A stable, byte-identical prefix is what lets caching reuse the system prompt cheaply.",
        },
      ],
    },
  ],
};
