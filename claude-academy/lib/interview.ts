import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  {
    topic: "Foundations",
    q: "Is the Claude API stateful or stateless, and what does that imply?",
    a: "Stateless. Claude remembers nothing between calls, so your application must resend the entire conversation history on every request. A chatbot's 'memory' is just your app re-sending the messages array each turn.",
  },
  {
    topic: "Foundations",
    q: "What is a token and why does it matter?",
    a: "A token is a chunk of text (~3–4 characters of English) — the unit models read and bill in. It matters because you pay per input and output token, and the context window (the total budget) is measured in tokens, not characters.",
  },
  {
    topic: "Foundations",
    q: "What's in the context window?",
    a: "Everything in one request shares it: the system prompt, the full conversation history, tool definitions, any documents, AND the space reserved for the reply. A bigger window is a capability, not an instruction to fill it.",
  },
  {
    topic: "Foundations",
    q: "How do you choose between Haiku, Sonnet, Opus, and Fable?",
    a: "Match the tier to the task. Haiku for fast, cheap, high-volume simple tasks (classification, routing); Sonnet as the balanced production workhorse; Opus for hard reasoning and agentic coding; Fable for the most demanding frontier work. Default to a capable model and only downgrade if your evals stay green.",
  },
  {
    topic: "Prompting",
    q: "What separates a good prompt from a bad one?",
    a: "Clarity, specificity, and structure. A good prompt states the task, gives context, sets constraints and edge-case handling, defines the exact output format, and often includes examples. Vague prompts are the #1 cause of bad output.",
  },
  {
    topic: "Prompting",
    q: "When would you use few-shot prompting?",
    a: "When you need to lock in a specific format, style, or classification behavior that instructions alone don't reliably produce. Showing 1–5 example input→output pairs resolves ambiguity far better than describing it.",
  },
  {
    topic: "Prompting",
    q: "Explain prompt caching and its main pitfall.",
    a: "Caching reuses a stable prompt prefix across requests so reads cost ~10% of normal input. The pitfall: it's a strict prefix match — any byte change in the prefix (a timestamp, a reordered JSON key, a swapped tool) invalidates everything after it. Keep stable content first and volatile content last.",
  },
  {
    topic: "Evaluation",
    q: "Why do you need evals, and what are the two grading approaches?",
    a: "Evals replace eyeballing with a tracked score so you can improve with evidence, compare models, and catch regressions. Code-graded evals deterministically check exact matches, valid JSON, or properties; model-graded evals (LLM-as-judge) score open-ended quality against a rubric. Good suites use both.",
  },
  {
    topic: "Tool Use",
    q: "Walk through how tool use works.",
    a: "You send the user message plus tool definitions. Claude returns stop_reason='tool_use' with a tool_use block (name + arguments). Your code executes the real function and returns a tool_result block (matched by tool_use_id). You call the API again and Claude produces the final answer. Claude never runs your code — it only requests calls.",
  },
  {
    topic: "Tool Use",
    q: "How do you guarantee Claude returns valid JSON?",
    a: "Use structured outputs: set output_config.format to a json_schema to constrain the whole response, or set strict:true on a tool to guarantee its arguments match the schema. Don't rely on prompt wording alone — make the format a hard constraint.",
  },
  {
    topic: "Agents",
    q: "What is an agent?",
    a: "Tool use in a loop. The model decides an action, your code executes it, the result goes back, and the model decides the next action — repeating until the goal is met (stop_reason='end_turn'). The loop plus a good tool surface and a clear goal IS the agent; there's no special 'agent mode'.",
  },
  {
    topic: "Agents",
    q: "Agent vs. workflow — when do you build which?",
    a: "A workflow is when your code controls fixed steps (parse → validate → store); an agent is when the model decides the steps. Build an agent only when the task is multi-step and can't be fully scripted, the value justifies the cost, the model is viable at it, and errors are recoverable. Otherwise prefer a single call or a workflow.",
  },
  {
    topic: "Agents",
    q: "What is MCP and why does it matter?",
    a: "The Model Context Protocol is an open standard for connecting AI to tools, data resources, and prompts in a common format. Build a connector once and any MCP-aware client can use it — turning N apps × M integrations into N + M. It's becoming the universal way to give models tool/data access.",
  },
  {
    topic: "Agents",
    q: "What are Managed Agents?",
    a: "An Anthropic-hosted surface that runs the agent loop and a tool-execution container for you. You create a persisted Agent (model, system prompt, tools) once and reference it from Sessions that run each task. Config lives on the Agent, never the session; you get hosted tools, automatic compaction/caching, and an event stream.",
  },
  {
    topic: "RAG",
    q: "What is RAG and what problem does it solve?",
    a: "Retrieval-Augmented Generation retrieves relevant data and injects it into the prompt so the model answers from your facts rather than its training. It solves three gaps: private data the model never saw, events after the training cutoff, and hallucination on unknown topics — all without retraining.",
  },
  {
    topic: "RAG",
    q: "How does semantic retrieval actually work?",
    a: "Via embeddings. An embedding model turns text into a vector capturing its meaning; similar meanings produce nearby vectors. You embed and store document chunks offline, embed the query online, and retrieve the nearest neighbors (cosine similarity). Use the same embedding model for documents and queries.",
  },
  {
    topic: "RAG",
    q: "What makes a RAG answer trustworthy?",
    a: "Grounding instructions: tell Claude to answer only from the retrieved context, to admit when the answer isn't there, and to cite its sources. Pair that with native citations and evaluate retrieval and generation separately so you know which half to fix when answers are wrong.",
  },
  {
    topic: "Advanced",
    q: "How do you control how hard Claude reasons on modern models?",
    a: "Enable adaptive thinking (thinking:{type:'adaptive'}) and set an effort level — low, medium, high, xhigh, or max. Claude then decides how much to reason per request, scaled by effort. This replaced the deprecated fixed 'thinking budget'. Higher effort means more depth, cost, and latency.",
  },
  {
    topic: "Advanced",
    q: "What are server tools?",
    a: "Tools Anthropic hosts and executes — web search, web fetch, and code execution. You just declare them; results return inline with no execution loop on your side. Web search is essentially RAG over the open web; code execution runs Python in a sandbox for analysis and file processing.",
  },
  {
    topic: "Advanced",
    q: "How should your app handle a refusal?",
    a: "A refusal is a normal HTTP 200 response with stop_reason='refusal', not an error. Always branch on stop_reason before reading content (which may be empty), show a graceful fallback message, and don't retry the identical prompt expecting a different result.",
  },
  {
    topic: "Advanced",
    q: "What are the key responsible-use practices when building with Claude?",
    a: "Never put secrets (API keys, passwords) in prompts or memory; validate tool inputs since they're model output; gate irreversible actions behind human approval; be transparent that users are talking to an AI and where its knowledge comes from; and design for refusals as a normal outcome.",
  },
];
