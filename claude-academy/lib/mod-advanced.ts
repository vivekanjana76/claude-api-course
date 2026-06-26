import type { Module } from "./types";

export const advanced: Module = {
  id: "advanced",
  title: "Advanced Capabilities",
  blurb:
    "Deeper reasoning, Anthropic-hosted server tools, and how Claude handles safety — the frontier of building with Claude.",
  accent: "sage",
  lessons: [
    {
      slug: "thinking-and-effort",
      title: "Extended thinking & effort",
      summary:
        "Modern Claude reasons internally before answering. Adaptive thinking plus an effort dial controls reasoning depth — replacing the old fixed token budget.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Reasoning as a first-class feature" },
        {
          type: "p",
          text: "Earlier you learned chain-of-thought as a prompting trick. Modern Claude models build it in: they can produce **thinking blocks** — internal reasoning — before the final answer, and the API gives you controls for how much.",
        },
        { type: "diagram", name: "thinking", caption: "Native thinking: Claude reasons in dedicated blocks first, then answers. You control depth with effort." },
        { type: "h3", text: "Adaptive thinking + effort" },
        {
          type: "p",
          text: "Rather than a manual 'spend N tokens thinking' budget (now deprecated on recent models), you set `thinking: {type: 'adaptive'}` and an **effort** level. Claude decides per request how much to reason, scaled by your effort setting.",
        },
        {
          type: "compare",
          caption: "Effort levels",
          columns: ["Level", "Use for"],
          rows: [
            { label: "low", cells: ["Simple/latency-sensitive tasks; sub-agents in a larger system."] },
            { label: "medium", cells: ["A cost-conscious balance for routine work."] },
            { label: "high", cells: ["Strong default for most intelligence-sensitive work."] },
            { label: "xhigh", cells: ["Hard coding and long agentic tasks — the sweet spot there."] },
            { label: "max", cells: ["When correctness matters more than cost; toughest problems."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Showing reasoning vs. hiding it",
          code: `resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},  # show a readable summary
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "Diagnose this failing test..."}],
)
for block in resp.content:
    if block.type == "thinking":
        print("REASONING:", block.thinking)
    elif block.type == "text":
        print("ANSWER:", block.text)`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Thinking is billed and takes time",
          text: "More reasoning = more tokens and latency. Raise effort for hard problems; keep it low for simple ones. On the newest models, manual thinking budgets and sampling params (temperature/top_p) are removed — effort is the lever.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Show or hide the reasoning",
          text: "display:'summarized' returns a readable summary of the reasoning for your UI; the default 'omitted' hides it (the answer still benefits). Stream it if you want users to see progress instead of a long pause.",
        },
      ],
      takeaways: [
        "Modern Claude reasons in native thinking blocks before answering.",
        "Use adaptive thinking + an effort level (low→max) instead of a fixed token budget.",
        "Higher effort = deeper reasoning, more tool use, more cost/latency; match it to task difficulty.",
        "display:'summarized' surfaces the reasoning for your UI; the default hides it.",
      ],
      flashcards: [
        { front: "How do you control reasoning depth on modern Claude?", back: "Enable adaptive thinking and set an effort level (low / medium / high / xhigh / max)." },
        { front: "What replaced the manual 'thinking budget'?", back: "Adaptive thinking + the effort parameter; fixed budget_tokens is deprecated/removed on recent models." },
        { front: "How do you show reasoning in a UI?", back: "Set thinking display to 'summarized' to get a readable reasoning summary (default is 'omitted')." },
      ],
      quiz: [
        {
          q: "A hard, multi-step coding task needs the best reasoning. Recommended setting?",
          options: ["effort low", "effort high or xhigh with adaptive thinking", "temperature 1.0", "disable thinking"],
          answer: 1,
          explain: "high/xhigh effort with adaptive thinking is the sweet spot for hard coding/agentic work.",
        },
      ],
    },

    {
      slug: "server-tools",
      title: "Server tools: web search & code execution",
      summary:
        "Some tools run on Anthropic's infrastructure — no execution loop for you. Web search, web fetch, and code execution extend Claude with one declaration.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Tools that run themselves" },
        {
          type: "p",
          text: "With your own tools, you run the function and return the result. **Server tools** flip that: Anthropic hosts and executes them. You just declare the tool, and the result comes back in the same response — no client-side loop to write.",
        },
        { type: "diagram", name: "server-tools", caption: "Server tools execute on Anthropic's side; results return inline. Client tools run in your code." },
        { type: "h3", text: "The headline server tools" },
        {
          type: "compare",
          columns: ["Tool", "What it does"],
          rows: [
            { label: "Web search", cells: ["Claude searches the live web and answers with up-to-date info and citations — beating the training cutoff."] },
            { label: "Web fetch", cells: ["Retrieves the content of a specific URL already in the conversation."] },
            { label: "Code execution", cells: ["Runs Python in a sandboxed container (data analysis, charts, file processing) with no setup from you."] },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Adding web search is one line",
          code: `resp = client.messages.create(
    model="claude-opus-4-8", max_tokens=2048,
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
    messages=[{"role": "user",
               "content": "What did Anthropic announce this week?"}],
)
# Claude searches, reads results, and answers with citations — automatically.`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Why this matters for RAG & agents",
          text: "Web search is RAG over the open web without you building a pipeline. Code execution lets an agent compute, plot, and process files in a real sandbox. Both are huge capability jumps for a single declaration.",
        },
        { type: "h3", text: "Code execution unlocks data work" },
        {
          type: "p",
          text: "The code-execution sandbox ships with data-science and document libraries (pandas, matplotlib, openpyxl, python-docx, pypdf…). Upload a CSV and ask for analysis and a chart; Claude writes and runs the code and returns the results and generated files.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Server-tool errors don't raise",
          text: "A web search/fetch failure comes back as a result block with an error code (HTTP 200, not an exception). Check the result's shape — a success content is a list, an error is an object — before using it.",
        },
      ],
      takeaways: [
        "Server tools run on Anthropic's infrastructure — declare them and results return inline, no execution loop.",
        "Web search gives live, cited answers past the training cutoff; web fetch retrieves a specific URL.",
        "Code execution runs Python in a sandbox with data/document libraries — great for analysis and reports.",
        "Server-tool failures return error result blocks (HTTP 200), not exceptions — check the result shape.",
      ],
      flashcards: [
        { front: "Server tool vs. your own tool?", back: "Server tools execute on Anthropic's infrastructure and return results inline; your own tools you execute and return yourself." },
        { front: "What does the web search tool give you?", back: "Live, cited answers from the open web — essentially RAG over the internet with no pipeline to build." },
        { front: "What can code execution do?", back: "Run Python in a sandbox (pandas, matplotlib, doc libraries) for analysis, charts, and file processing, returning results and files." },
      ],
      quiz: [
        {
          q: "A user asks about events after the model's training cutoff. Best built-in tool?",
          options: ["Code execution", "Web search (live, cited results)", "Memory", "A bigger model"],
          answer: 1,
          explain: "Web search retrieves current information and cites it — exactly the recency gap.",
        },
        {
          q: "What's true about a failed web search?",
          options: [
            "It raises an exception you must catch",
            "It returns an error result block with HTTP 200 — check the result shape",
            "It retries forever",
            "It switches models",
          ],
          answer: 1,
          explain: "Server-tool errors come back as result blocks, not exceptions; inspect the result before using it.",
        },
      ],
    },

    {
      slug: "safety-and-refusals",
      title: "Safety, refusals & responsible use",
      summary:
        "Claude is built to be helpful, honest, and harmless. Understanding refusals and the safety surface helps you build robust, trustworthy apps.",
      minutes: 5,
      blocks: [
        { type: "h2", text: "Helpful, honest, harmless" },
        {
          type: "p",
          text: "Anthropic builds Claude around safety. In practice that means Claude will sometimes **refuse** a request it judges harmful, and your application should handle that gracefully rather than crash or loop.",
        },
        { type: "h3", text: "How a refusal shows up" },
        {
          type: "p",
          text: "A refusal isn't an HTTP error — it's a normal **200 response** with `stop_reason: \"refusal\"`. The content may be empty or a short explanation. This is exactly why you check `stop_reason` before reading `content` (you saw this in the Messages lesson).",
        },
        {
          type: "code",
          lang: "python",
          caption: "Handling a refusal cleanly",
          code: `resp = client.messages.create(model="claude-opus-4-8", max_tokens=1024,
                              messages=messages)

if resp.stop_reason == "refusal":
    show_user("I can't help with that request.")
else:
    show_user(resp.content[0].text)`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Design for refusals",
          text: "Always branch on stop_reason. Treat 'refusal' as a normal outcome with a friendly fallback message — don't index content[0] blindly, and don't retry the same prompt expecting a different result.",
        },
        { type: "h3", text: "Building responsibly" },
        {
          type: "list",
          items: [
            "**Don't store secrets in prompts or memory** — API keys, passwords, and tokens shouldn't live in conversation history.",
            "**Validate tool inputs** — Claude's tool arguments are model output; sanitize before running anything with side effects.",
            "**Gate irreversible actions** — require human approval before destructive operations.",
            "**Be transparent** — tell users they're talking to an AI and where its knowledge comes from.",
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "Authorized, defensive, and educational use",
          text: "Claude assists with security testing, defensive work, and learning when there's clear authorization. It declines requests aimed at real-world harm. Building with that grain — not against it — makes your app both safer and more reliable.",
        },
      ],
      takeaways: [
        "Claude is built to be helpful, honest, and harmless and will sometimes refuse harmful requests.",
        "A refusal is a 200 response with stop_reason='refusal' — handle it as a normal branch, not an error.",
        "Never put secrets in prompts/memory; validate tool inputs; gate irreversible actions behind approval.",
        "Be transparent with users about AI use and knowledge sources.",
      ],
      flashcards: [
        { front: "How does a refusal appear in the API?", back: "As a normal HTTP 200 response with stop_reason='refusal', not an error — content may be empty." },
        { front: "Why validate tool arguments before executing?", back: "They're model output; treat them as untrusted input and sanitize before any action with side effects." },
        { front: "What should never go in prompts or memory?", back: "Secrets — API keys, passwords, tokens — since they persist in conversation/memory history." },
      ],
      quiz: [
        {
          q: "Claude returns stop_reason='refusal'. Best handling?",
          options: [
            "Crash with an error",
            "Show a friendly fallback message; don't blindly read content[0] or retry identically",
            "Retry the same prompt 10 times",
            "Switch to a bigger model and resend",
          ],
          answer: 1,
          explain: "A refusal is a normal outcome — branch on stop_reason and respond gracefully.",
        },
      ],
    },
  ],
};
