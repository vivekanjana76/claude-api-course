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
    id: "sdk",
    tool: "Anthropic SDK",
    blurb: "The request shapes you write every day — Python, and the parameters that actually move quality and cost.",
    accent: "iris",
    sections: [
      {
        title: "The basic call",
        commands: [
          { cmd: "pip install anthropic", desc: "Install the official Python SDK." },
          { cmd: "client = Anthropic()", desc: "Resolves ANTHROPIC_API_KEY, then ANTHROPIC_AUTH_TOKEN, then an `ant auth login` profile." },
          { cmd: "client.messages.create(model=\"claude-opus-5\", max_tokens=16000, messages=msgs)", desc: "One stateless request; you resend the full history every turn." },
          { cmd: "system=\"You are …\"", desc: "A top-level parameter, not a message with role=system." },
          { cmd: "for b in resp.content: if b.type == \"text\": …", desc: "content is a list of blocks — narrow by type before reading .text." },
          { cmd: "resp.stop_reason", desc: "end_turn | max_tokens | tool_use | pause_turn | refusal — branch on it before trusting the content." },
        ],
      },
      {
        title: "Thinking & effort",
        commands: [
          { cmd: "thinking={\"type\": \"adaptive\"}", desc: "Let the model decide how much to reason. The current form — budget_tokens is gone on the newest models." },
          { cmd: "thinking={\"type\": \"adaptive\", \"display\": \"summarized\"}", desc: "Opt in to a readable summary; the default returns empty thinking text." },
          { cmd: "output_config={\"effort\": \"high\"}", desc: "low | medium | high | xhigh | max — depth and token spend, inside output_config, not top-level." },
          { cmd: "output_config={\"format\": {...}}", desc: "Structured outputs. The old top-level output_format parameter is deprecated." },
          { cmd: "client.messages.parse(...)", desc: "Validate the response against your schema automatically." },
        ],
      },
      {
        title: "Cost & throughput",
        commands: [
          { cmd: "cache_control={\"type\": \"ephemeral\"}", desc: "Auto-cache the last cacheable block. Minimum prefix ~1024 tokens; 4 breakpoints max." },
          { cmd: "{\"type\": \"ephemeral\", \"ttl\": \"1h\"}", desc: "Extend the cache lifetime from the 5-minute default." },
          { cmd: "resp.usage.cache_read_input_tokens", desc: "Your only honest cache-hit signal. Zero across identical prefixes means a silent invalidator." },
          { cmd: "client.messages.batches.create(requests=[...])", desc: "Asynchronous batch at 50% cost — key results by custom_id, they return in any order." },
          { cmd: "client.messages.count_tokens(model=…, messages=…)", desc: "Count tokens with the real tokenizer instead of guessing with tiktoken." },
          { cmd: "with client.messages.stream(...) as s: s.get_final_message()", desc: "Stream for long outputs; large max_tokens without streaming hits HTTP timeouts." },
        ],
      },
    ],
  },
  {
    id: "tools",
    tool: "Tool use & agents",
    blurb: "The loop, the parallel-call rule, and the server-side tools you don't have to run.",
    accent: "teal",
    sections: [
      {
        title: "The loop",
        commands: [
          { cmd: "tools=[{\"name\": …, \"description\": …, \"input_schema\": {…}}]", desc: "A custom tool. The description is prompt text — write it for the model, not for a changelog." },
          { cmd: "while resp.stop_reason == \"tool_use\": …", desc: "The manual agentic loop: execute, append results, call again." },
          { cmd: "{\"type\": \"tool_result\", \"tool_use_id\": id, \"content\": out}", desc: "What you send back, inside a user message." },
          { cmd: "is_error: true", desc: "Return failures as a tool_result with this flag — never silently drop the block." },
          { cmd: "# all tool_results in ONE user message", desc: "Splitting parallel results across messages trains the model to stop calling in parallel." },
          { cmd: "strict=True", desc: "Guarantee inputs validate against your schema. Needs additionalProperties:false and required." },
          { cmd: "client.beta.messages.tool_runner(...)", desc: "SDK helper that drives the loop over @beta_tool functions, with per-turn hooks." },
        ],
      },
      {
        title: "Server-side tools",
        commands: [
          { cmd: "{\"type\": \"web_search_20260209\", \"name\": \"web_search\"}", desc: "Search runs on Anthropic's infrastructure; results arrive in the same response." },
          { cmd: "{\"type\": \"web_fetch_20260209\", \"name\": \"web_fetch\"}", desc: "Fetch a URL already present in the conversation." },
          { cmd: "{\"type\": \"code_execution_20260521\", \"name\": \"code_execution\"}", desc: "Sandboxed code execution; results come back as bash_code_execution_tool_result." },
          { cmd: "allowed_domains / blocked_domains", desc: "Constrain a web tool. Set one list or the other — never both." },
          { cmd: "# server-tool errors return HTTP 200", desc: "They arrive as an error object inside the result block, not as a raised exception." },
        ],
      },
      {
        title: "MCP",
        commands: [
          { cmd: "npx @modelcontextprotocol/inspector <server-cmd>", desc: "Interactive inspector — the fastest way to see what a server really exposes." },
          { cmd: "claude mcp add <name> -- <command>", desc: "Register a stdio server with Claude Code." },
          { cmd: "claude mcp list", desc: "Registered servers and their connection state." },
          { cmd: "mcp_servers=[{\"type\": \"url\", \"url\": …, \"name\": n}]", desc: "The MCP connector — half of the request." },
          { cmd: "tools=[{\"type\": \"mcp_toolset\", \"mcp_server_name\": n}]", desc: "The other half. Sending mcp_servers alone is a validation error." },
        ],
      },
    ],
  },
  {
    id: "retrieval",
    tool: "Embeddings & retrieval",
    blurb: "Turning a corpus into an index, and getting the right passage back out of it.",
    accent: "amber",
    sections: [
      {
        title: "Embedding",
        commands: [
          { cmd: "SentenceTransformer(\"BAAI/bge-base-en-v1.5\").encode(texts)", desc: "A solid open embedding baseline you can run locally." },
          { cmd: "normalize_embeddings=True", desc: "Unit-normalise so cosine similarity reduces to a dot product." },
          { cmd: "voyageai.Client().embed(texts, model=\"voyage-3\")", desc: "Anthropic's recommended embedding partner." },
          { cmd: "# embed queries and documents the same way", desc: "Mismatched preprocessing between index and query time silently wrecks recall." },
        ],
      },
      {
        title: "Vector search",
        commands: [
          { cmd: "CREATE EXTENSION vector;", desc: "pgvector — vector search inside the Postgres you already operate." },
          { cmd: "CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);", desc: "HNSW index; build it after loading, not before." },
          { cmd: "SELECT id FROM docs ORDER BY embedding <=> $1 LIMIT 50;", desc: "<=> is cosine distance; <-> is L2." },
          { cmd: "faiss.IndexFlatIP(dim)", desc: "Exact search — the right default under a few hundred thousand vectors." },
          { cmd: "faiss.IndexHNSWFlat(dim, 32)", desc: "Approximate search when exact gets too slow." },
          { cmd: "chroma / qdrant / weaviate", desc: "Managed stores when you want filtering and persistence without owning the index." },
        ],
      },
      {
        title: "Making retrieval good",
        commands: [
          { cmd: "# retrieve ~50, rerank to 5–10", desc: "Retrieve wide then narrow hard. Fetching only 5 permanently loses the answer ranked 12th." },
          { cmd: "BM25 + vector, fused by RRF", desc: "Hybrid retrieval — the most reliable single quality upgrade in RAG." },
          { cmd: "CrossEncoder(\"BAAI/bge-reranker-base\").predict(pairs)", desc: "A cross-encoder reranker: slow, precise, applied only to the shortlist." },
          { cmd: "recall@k, then MRR / nDCG", desc: "Measure retrieval on its own before blaming the generator." },
          { cmd: "# store doc_id + span with every chunk", desc: "Without provenance you cannot cite, and without citations you cannot be audited." },
        ],
      },
    ],
  },
  {
    id: "evals",
    tool: "Evals & LLMOps",
    blurb: "Turning 'it feels better' into a number, and keeping that number visible in production.",
    accent: "rose",
    sections: [
      {
        title: "Offline evaluation",
        commands: [
          { cmd: "promptfoo eval -c promptfooconfig.yaml", desc: "Run a prompt/model matrix against your test cases." },
          { cmd: "promptfoo view", desc: "Side-by-side diff of outputs across variants." },
          { cmd: "pytest tests/test_prompts.py -k regression", desc: "Evals as ordinary tests, running in the same CI as everything else." },
          { cmd: "# build the set from real failures", desc: "Invented test cases pass. Cases harvested from incidents are the ones that catch regressions." },
          { cmd: "# grade against a rubric, not a vibe", desc: "An LLM judge needs an explicit rubric and a human-labelled calibration set, or it drifts." },
          { cmd: "pass@k / exact match / F1", desc: "Prefer a deterministic metric wherever the task admits one — it costs nothing to run." },
        ],
      },
      {
        title: "Tracing & production",
        commands: [
          { cmd: "langfuse / langsmith / phoenix", desc: "Trace stores — span-level visibility into prompts, tools, latency, and cost." },
          { cmd: "# log prompt version with every trace", desc: "Untagged traces cannot answer 'did the change help', which is the only question that matters." },
          { cmd: "resp.usage.input_tokens / .output_tokens", desc: "Per-request cost accounting; aggregate by route, not by day." },
          { cmd: "p50 / p95 latency, TTFT", desc: "Time-to-first-token is the number users feel on a streaming surface." },
          { cmd: "# canary a prompt change like a deploy", desc: "Ship to a slice, watch the eval and the trace metrics, then roll forward." },
          { cmd: "# guard both directions", desc: "Screen inputs for injection and outputs for leakage; a one-sided guardrail is decoration." },
        ],
      },
    ],
  },
];
