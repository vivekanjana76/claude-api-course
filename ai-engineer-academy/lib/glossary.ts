import type { GlossaryTerm } from "./types";

// `hot: true` marks a term that is currently prominent in AI Engineer job
// descriptions and interview loops — the glossary page can filter to these
// alone as a "2026 keyword radar".
export const glossary: GlossaryTerm[] = [
  // ── A ──
  { term: "A2A", def: "Agent-to-Agent protocol — a standard for agents to discover each other and delegate tasks with lifecycle and status, typically across organisational boundaries. The horizontal counterpart to MCP's vertical model-to-tools connection.", related: ["MCP", "Agent"], hot: true },
  { term: "Acceptance rate", def: "In speculative decoding, the fraction of draft-model tokens the target model accepts. High on predictable text (code, structured output); low on open-ended generation, where speculation can be slower than plain decoding.", related: ["Speculative decoding"] },
  { term: "Adapter", def: "A small set of trained weights layered on top of a frozen base model — a LoRA adapter is tens of megabytes and can be swapped per request, so one base model serves many tenants or tasks.", related: ["LoRA", "PEFT"] },
  { term: "Agent", def: "A model in a loop with tools, choosing its own next step until it judges the task complete. Distinguished from a workflow, where you wrote the control flow.", related: ["Workflow", "ReAct", "Tool calling"], hot: true },
  { term: "Agent Skills", def: "Folders of instructions, scripts, and resources a model loads only when relevant — progressive disclosure applied to procedural know-how. MCP gives a model capabilities; skills give it know-how.", related: ["Progressive disclosure", "MCP"], hot: true },
  { term: "Agentic RAG", def: "Retrieval exposed as a tool inside an agent loop, so the model decides whether to search, what to search for, and whether to search again — rather than retrieval being a fixed pipeline stage.", related: ["RAG", "Agent"], hot: true },
  { term: "Alignment", def: "Post-training that makes a model's behaviour match human preferences and stated principles — typically SFT followed by preference optimisation (RLHF, DPO, or GRPO).", related: ["RLHF", "DPO", "Constitutional AI"] },
  { term: "ANN", def: "Approximate Nearest Neighbour — similarity search that trades a small amount of recall for orders of magnitude more speed. HNSW and IVF are the common index families.", related: ["HNSW", "recall@k"] },
  { term: "Assertion", def: "A deterministic pass/fail check in an eval suite — parses, matches schema, citations exist, no PII, under budget. Free to run, unambiguous, and the layer most teams skip.", related: ["Eval", "Golden set"] },
  { term: "Attention", def: "The mechanism letting each token gather information from other tokens, deciding what in the context is relevant. Naively quadratic in sequence length, which is why long prompts get slow.", related: ["Transformer", "FlashAttention"] },
  { term: "AWQ", def: "Activation-aware Weight Quantization — a post-training method that protects the small fraction of weights that matter most based on activation magnitudes. Often better quality than GPTQ at 4-bit.", related: ["Quantization", "GPTQ"] },
  { term: "Autoregressive", def: "Generating one token at a time, each conditioned on everything before it. This is why output latency is per-token and why decode can't be parallelised within a sequence.", related: ["Decode", "TPOT"] },

  // ── B ──
  { term: "Backchannel", def: "A brief acknowledgement (\"mm-hm\", \"let me check that\") a voice agent emits while thinking, so silence doesn't read as a dropped call.", related: ["Voice agent", "Barge-in"] },
  { term: "Barge-in", def: "A user interrupting a voice agent mid-response. Supporting it requires always-on audio input, cancellable generation, and cancellable playback — an architecture requirement, not a polish item.", related: ["Voice agent", "Endpointing"] },
  { term: "Batch API", def: "Asynchronous bulk processing offered at roughly half the synchronous price, for work tolerating hours of latency — backfills, eval runs, offline enrichment.", related: ["Throughput"] },
  { term: "BM25", def: "The standard keyword-ranking function, scoring documents by term frequency and rarity. Still beats embeddings outright on exact identifiers, rare terms, and phrases — which is why hybrid search exists.", related: ["Hybrid search", "Sparse retrieval"], hot: true },
  { term: "Bi-encoder", def: "A model that embeds query and document independently, so documents can be indexed in advance. Fast, used for retrieval — as opposed to a cross-encoder, which is slower and more accurate.", related: ["Cross-encoder", "Embedding"] },
  { term: "Blast radius", def: "How much is affected when something goes wrong. The central question in agent and tool design: if the model does the worst thing this context could ask, what breaks?", related: ["Least privilege", "Prompt injection"] },

  // ── C ──
  { term: "C2PA", def: "A content-provenance standard attaching cryptographically signed metadata describing how media was created. Increasingly expected for generated images and required in some jurisdictions.", related: ["Diffusion model", "Deepfake"] },
  { term: "Catastrophic forgetting", def: "Losing general capability — instruction-following, reasoning, other languages — while fine-tuning narrowly. Always evaluate general ability alongside your task metric to detect it.", related: ["Fine-tuning", "SFT"] },
  { term: "Chain of thought (CoT)", def: "Having a model reason step by step before answering. Largely superseded by native reasoning modes in modern models, but still the underlying idea behind test-time compute.", related: ["Test-time compute", "Reasoning model"] },
  { term: "Checkpointing", def: "Persisting agent or run state after each step so a crash, timeout, or rate limit doesn't lose the work — and so a human can inspect a stuck run and resume it.", related: ["Agent", "Resumability"] },
  { term: "Chunk", def: "A retrievable unit of text, produced by splitting a document. Chunking strategy is the highest-leverage and most neglected decision in RAG.", related: ["Chunking", "RAG"] },
  { term: "Chunking", def: "Splitting documents into retrievable units. Structure-aware chunking (on headings, clauses, functions) beats fixed-size splitting; small-to-big retrieval gets the benefits of both.", related: ["Chunk", "Small-to-big retrieval"] },
  { term: "Circuit breaker", def: "Temporarily stopping traffic to a failing dependency instead of timing out every request against it. Standard resilience pattern at the AI gateway.", related: ["AI gateway", "Fallback"] },
  { term: "Compaction", def: "Replacing older conversation turns with a summary to reclaim context space. Lossy and silent — keep hard constraints in a structured scratchpad that is never summarised.", related: ["Context engineering", "Scratchpad"], hot: true },
  { term: "Confused deputy", def: "A privileged component tricked into acting on behalf of an unprivileged caller — the failure mode when an MCP server or agent uses a shared service credential instead of the invoking user's identity.", related: ["MCP", "Least privilege"] },
  { term: "Constitutional AI", def: "Alignment guided by an explicit written set of principles, with a model critiquing and revising its own outputs against them — a way to scale preference data past human throughput.", related: ["RLAIF", "Alignment"] },
  { term: "Constrained decoding", def: "Masking tokens at sampling time so only grammar-valid continuations are possible, guaranteeing that output parses. It guarantees structure, never correctness.", related: ["Structured output", "JSON Schema"], hot: true },
  { term: "Context engineering", def: "Deliberately curating what occupies the context window — retrieval, compaction, memory, tool definitions, and ordering. The 2026 successor to prompt engineering as the headline skill.", related: ["Context window", "Compaction", "Prompt engineering"], hot: true },
  { term: "Context rot", def: "Quality degradation as a context window fills with stale, irrelevant, or superseded material. More context frequently makes output worse, not better.", related: ["Context engineering", "Lost in the middle"] },
  { term: "Context window", def: "The maximum tokens a model can attend to in one call — shared by system prompt, tool definitions, history, retrieved documents, and the generated reply.", related: ["Token", "Context engineering"], hot: true },
  { term: "Contextual retrieval", def: "Prepending a short generated description of where a chunk sits in its document before embedding it, so the vector carries context the chunk text lacks. A one-time ingest cost for a durable recall gain.", related: ["Chunking", "RAG"], hot: true },
  { term: "Continuous batching", def: "Letting requests join and leave the running batch as they complete, rather than waiting for a whole batch to finish. Improves throughput and latency simultaneously; table stakes in modern serving engines.", related: ["vLLM", "Throughput"] },
  { term: "Corrective RAG (CRAG)", def: "Grading retrieved context before generating and branching on the result — generate if relevant, re-retrieve if partial, fall back or decline if irrelevant. Cheap, and it kills the worst RAG failure mode.", related: ["RAG", "Self-RAG"], hot: true },
  { term: "Cosine similarity", def: "Similarity by angle between vectors, ignoring magnitude — the default metric for text embeddings. Scores are not probabilities and do not transfer between models.", related: ["Embedding", "Dot product"] },
  { term: "Cost per successful outcome", def: "Spend divided by requests that actually worked. A cheap call that fails validation and triggers an expensive retry costs more than the expensive call — per-call cost metrics hide this.", related: ["Cost attribution"] },
  { term: "Cross-encoder", def: "A model that reads query and candidate document together and scores relevance directly. Far more accurate than comparing separate embeddings, and affordable because it only runs on a shortlist.", related: ["Reranking", "Bi-encoder"], hot: true },

  // ── D ──
  { term: "Decode", def: "The generation phase: one token at a time, sequentially, bounded by memory bandwidth because weights are re-read per token. Sets TPOT and therefore streaming speed.", related: ["Prefill", "TPOT"] },
  { term: "Deepfake", def: "Synthetic media depicting a real person. Generating identifiable people without consent carries likeness-rights and emerging legal exposure — a hard line in product design.", related: ["C2PA", "Diffusion model"] },
  { term: "Denial of wallet", def: "An attack that inflates your costs rather than taking you offline — inputs engineered to maximise reasoning tokens or trigger unbounded agent loops. Budgets and step limits are the control.", related: ["Guardrail", "Agent"] },
  { term: "Distillation", def: "Training a small student model to reproduce a large teacher's behaviour on your task. Routinely 10–50× cheaper at near-equal quality on the slice you measured.", related: ["Synthetic data", "Fine-tuning"], hot: true },
  { term: "DPO", def: "Direct Preference Optimization — optimising a policy directly on (chosen, rejected) preference pairs, with no reward model and no RL loop. Far more stable than RLHF and roughly SFT cost.", related: ["RLHF", "GRPO", "Preference optimisation"], hot: true },
  { term: "Drift", def: "Gradual change in inputs, index contents, or provider model behaviour that degrades quality with no code change and no failing test. Monitor input, retrieval-score, and output-length distributions.", related: ["Online evaluation"] },

  // ── E ──
  { term: "Egress allow-list", def: "The set of destinations an agent's outbound requests may reach. One of the few controls that genuinely bounds prompt-injection damage.", related: ["Prompt injection", "Lethal trifecta"], hot: true },
  { term: "Embedding", def: "A numeric vector representing text (or an image) so that similar meanings land near each other in high-dimensional space. The basis of semantic search, clustering, and RAG.", related: ["Cosine similarity", "Vector database"] },
  { term: "Endpointing", def: "Detecting that a speaker has finished their turn. The biggest single latency lever in voice agents — too aggressive cuts people off, too conservative feels sluggish.", related: ["Voice agent", "Barge-in"] },
  { term: "Eval / evaluation", def: "Measuring whether a system is good, on a dataset, with a metric and a threshold. Building the eval before tuning the prompt is the strongest seniority signal in AI engineering.", related: ["Golden set", "LLM-as-judge"], hot: true },
  { term: "Eval-driven development", def: "Writing the evaluation before building or tuning the feature, so every change is a measured comparison rather than a hypothesis.", related: ["Eval / evaluation", "Regression suite"], hot: true },
  { term: "ef_search", def: "The HNSW parameter controlling how many candidates a query explores — a query-time recall/latency dial that needs no reindex. Raise for quality, lower under load.", related: ["HNSW", "ANN"] },
  { term: "Exfiltration", def: "Getting private data out to an attacker. In LLM systems it usually happens through an outbound channel the agent legitimately has — an email tool, a webhook, or a rendered markdown image URL.", related: ["Lethal trifecta", "Prompt injection"] },

  // ── F ──
  { term: "Fallback", def: "An alternative model or provider used when the primary fails. Untested fallbacks aren't fallbacks — run them through the eval suite and exercise them deliberately.", related: ["AI gateway", "Circuit breaker"] },
  { term: "Few-shot", def: "Including a handful of input/output examples in the prompt. Two to five well-chosen examples covering the boundaries beat twenty generic ones.", related: ["Zero-shot", "Prompt engineering"] },
  { term: "Fine-tuning", def: "Further training a pretrained model on your examples. Teaches behaviour, format, tone, and narrow-task accuracy — and lets a smaller model match a bigger one. Not a mechanism for teaching facts.", related: ["SFT", "LoRA", "RAG"] },
  { term: "FlashAttention", def: "An IO-aware attention kernel that avoids materialising the full attention matrix, making attention faster and far more memory-efficient with no change to output.", related: ["Attention", "KV cache"] },
  { term: "Foundation model", def: "A large model pretrained on broad data that can be adapted to many downstream tasks by prompting, retrieval, or fine-tuning.", related: ["LLM", "Open-weight"] },
  { term: "FP8", def: "8-bit floating point. Increasingly the production default for both weights and KV cache — roughly half the memory of bf16 with near-lossless quality on supported hardware.", related: ["Quantization", "KV cache"], hot: true },
  { term: "Function calling", def: "See tool calling — the model emitting a structured request for your code to execute a named function with typed arguments.", related: ["Tool calling"] },

  // ── G ──
  { term: "GGUF", def: "The llama.cpp model file format with a family of quantization levels (Q4_K_M and similar). The format behind most local and laptop inference.", related: ["Quantization", "Ollama"] },
  { term: "Golden set", def: "The curated dataset of inputs with known-good outputs or expected properties that you regress against. Versioned in git, sliced, and grown from production failures.", related: ["Eval / evaluation", "Slice"], hot: true },
  { term: "Goodput", def: "Throughput that actually met your latency target. A system with excellent tokens/second and a blown p99 has high throughput and poor goodput.", related: ["Throughput", "TTFT"] },
  { term: "GPTQ", def: "A post-training quantization method that quantizes layer by layer using calibration data to minimise output error. Established and widely supported.", related: ["Quantization", "AWQ"] },
  { term: "GraphRAG", def: "Retrieval by traversing a knowledge graph built from your corpus, often with hierarchical community summaries. Answers global-summary and multi-hop relational questions top-k similarity structurally can't.", related: ["RAG", "Knowledge graph"], hot: true },
  { term: "Grounding", def: "Constraining an answer to supplied sources. Real grounding needs a strict instruction, an explicit insufficient-evidence path, and programmatic citation verification — instructions alone aren't enough.", related: ["RAG", "Groundedness"] },
  { term: "Groundedness", def: "Whether every factual claim in an answer is supported by the retrieved context. One leg of the RAG triad; low groundedness with high context relevance blames generation.", related: ["RAG triad", "Grounding"], hot: true },
  { term: "GQA", def: "Grouped-Query Attention — attention heads share key/value pairs in groups, shrinking the KV cache substantially. The standard compromise in modern models, sitting between MHA and MQA.", related: ["KV cache", "MQA"] },
  { term: "GRPO", def: "Group Relative Policy Optimization — sampling a group of answers and scoring each relative to the group average, removing the need for a value network. Pairs naturally with verifiable rewards; the technique behind modern reasoning models.", related: ["DPO", "Verifiable reward", "RLHF"], hot: true },
  { term: "Guardrail", def: "A programmatic check around a model call, its input, its output, or its tools. Each needs an explicit failure mode: closed, open, redact, human, or fallback.", related: ["Prompt injection", "Validation"], hot: true },

  // ── H ──
  { term: "Hallucination", def: "Fluent, confident output that isn't true. Not one bug but four — knowledge cutoff, plausible-continuation pressure, context dilution, and capability gap — each with a different fix.", related: ["Grounding", "RAG"] },
  { term: "Hedged request", def: "Issuing a duplicate request when the first exceeds a latency threshold and taking whichever returns first. Cuts tail latency at the cost of extra tokens.", related: ["AI gateway", "TTFT"] },
  { term: "HNSW", def: "Hierarchical Navigable Small World — the dominant graph-based ANN index, searched coarse-to-fine through layers. Excellent recall/latency at the cost of memory.", related: ["ANN", "ef_search"] },
  { term: "Human in the loop (HITL)", def: "A required human decision inside a run — approve before acting, review after, escalate on uncertainty, or sample for audit. The cheapest agent safety control is approval on writes.", related: ["Agent", "Guardrail"], hot: true },
  { term: "Hybrid search", def: "Running vector and keyword search together and fusing the results, so their complementary weaknesses cancel. The most reliable single upgrade for a mediocre RAG system.", related: ["BM25", "RRF"], hot: true },
  { term: "HyDE", def: "Hypothetical Document Embeddings — having a model write a hypothetical answer and embedding that instead of the raw query. Helps short questions match long, verbose documents.", related: ["Query rewriting", "Embedding"] },

  // ── I ──
  { term: "Idempotency key", def: "A token making a repeated write safe. Mandatory for agent tools, because models and loops retry — without it, a retry becomes a duplicate charge or message.", related: ["Tool calling", "Agent"] },
  { term: "Indirect prompt injection", def: "Injection arriving through content the model reads — a document, a web page, an email, a tool result — rather than the user's message. The dangerous form, because nobody typed anything malicious.", related: ["Prompt injection", "Lethal trifecta"], hot: true },
  { term: "Inference", def: "Running a trained model to produce output, as opposed to training it. Splits into a parallel, compute-bound prefill phase and a sequential, bandwidth-bound decode phase.", related: ["Prefill", "Decode"] },
  { term: "Ingestion pipeline", def: "The offline path that fills a retrieval index: parse → clean → chunk → enrich → embed → index, with incremental updates keyed on content hash and reconciliation for deletions.", related: ["Chunking", "RAG"] },
  { term: "IVF", def: "Inverted-file index — clusters vectors and searches only the nearest clusters. Lower memory and faster to build than HNSW; recall depends on how many clusters (nprobe) you search.", related: ["ANN", "HNSW"] },

  // ── J ──
  { term: "Jailbreak", def: "Getting a model past its safety training via role-play, hypotheticals, encoding, or multi-turn escalation. A model-behaviour problem, distinct from prompt injection, which is an architecture problem.", related: ["Prompt injection", "Red teaming"] },
  { term: "JSON Schema", def: "The standard vocabulary for describing the shape of JSON, used by every structured-output and tool-calling API. Field descriptions are prompt real estate the model reads.", related: ["Structured output", "Constrained decoding"] },

  // ── K ──
  { term: "Knowledge cutoff", def: "The last date represented in a model's training data. Anything after it is unknown, which is the failure retrieval exists to fix.", related: ["RAG", "Hallucination"] },
  { term: "Knowledge graph", def: "Entities as nodes and relationships as edges, built from a corpus. Enables multi-hop relational queries no single passage states — at the cost of an LLM extraction pass and ongoing maintenance.", related: ["GraphRAG"] },
  { term: "KV cache", def: "Stored key/value vectors for previous tokens so they aren't recomputed each step. Grows per sequence with every token — and usually determines how many concurrent users fit on a GPU.", related: ["PagedAttention", "GQA"], hot: true },

  // ── L ──
  { term: "Late chunking", def: "Embedding chunks with awareness of the full document rather than in isolation, so each vector carries document-level context. Related in spirit to contextual retrieval.", related: ["Contextual retrieval", "Chunking"] },
  { term: "Least privilege", def: "Giving a tool or agent only the access its job requires, scoped to the invoking user. The control that bounds damage when — not if — an injection succeeds.", related: ["Prompt injection", "Confused deputy"], hot: true },
  { term: "Lethal trifecta", def: "Private data access + exposure to untrusted content + an outward communication channel. All three together enable exfiltration; removing any one prevents it.", related: ["Prompt injection", "Exfiltration"], hot: true },
  { term: "LLM", def: "Large Language Model — trained to predict the next token, which generalises to summarising, translating, coding, and reasoning.", related: ["Foundation model", "Token"] },
  { term: "LLM-as-judge", def: "Using a model to score outputs against a rubric. Scales open-ended evaluation, but only produces meaningful numbers once calibrated against human labels.", related: ["Eval / evaluation", "Calibration"], hot: true },
  { term: "LLM gateway", def: "A service centralising routing, caching, retries, fallbacks, quotas, cost attribution, and tracing for all model traffic. Also called an AI gateway or LLM proxy.", related: ["Routing", "Fallback"], hot: true },
  { term: "LLMOps", def: "The operational discipline around LLM systems — prompt versioning, tracing, evaluation in CI, cost control, staged rollout, and incident response.", related: ["Observability", "Release lifecycle"], hot: true },
  { term: "LoRA", def: "Low-Rank Adaptation — training two small matrices per targeted layer instead of the full weight, leaving the base frozen. Trains ~0.5–1% of parameters and produces small, swappable adapters.", related: ["QLoRA", "PEFT", "Adapter"], hot: true },
  { term: "Lost in the middle", def: "The observed drop in retrieval accuracy for facts placed in the centre of a very long context. Put critical material near the beginning or the end.", related: ["Context window", "Context rot"] },

  // ── M ──
  { term: "Matryoshka embeddings", def: "Embeddings trained so a truncated prefix is still a usable vector — letting you trade storage and search cost against quality without re-embedding.", related: ["Embedding", "Dimensionality"] },
  { term: "MCP", def: "Model Context Protocol — an open standard for connecting AI applications to tools and data, turning N×M integrations into N+M. Exposes tools (model-controlled), resources (app-controlled), and prompts (user-controlled).", related: ["A2A", "Tool calling"], hot: true },
  { term: "Memory poisoning", def: "Wrong or adversarially planted content written into an agent's long-term memory that corrupts later behaviour. Memory read back is untrusted input.", related: ["Prompt injection", "Long-term memory"] },
  { term: "MMR", def: "Maximal Marginal Relevance — re-ranking for diversity so you don't return five paraphrases of the same passage and waste the context window.", related: ["Reranking", "RAG"] },
  { term: "MoE", def: "Mixture of Experts — a router activates only a subset of expert sub-networks per token, giving large total capacity at much lower compute per token than a dense model of the same size.", related: ["Foundation model"] },
  { term: "Model card", def: "Documentation of a model's or system's intended use, limitations, data sources, and evaluation results. Increasingly a compliance artefact, not just a courtesy.", related: ["EU AI Act", "Eval / evaluation"] },
  { term: "Model collapse", def: "Progressive degradation of diversity and quality when models are trained on model-generated data across generations. Always anchor training data to real examples.", related: ["Synthetic data", "Distillation"] },
  { term: "MQA", def: "Multi-Query Attention — all attention heads share a single key/value pair, drastically shrinking the KV cache at some quality cost. GQA is the usual middle ground.", related: ["GQA", "KV cache"] },
  { term: "Multi-hop retrieval", def: "Chaining retrievals where each query depends on the previous answer — find the contract, extract the vendor, then look up that vendor's compliance status.", related: ["RAG", "Agentic RAG"] },
  { term: "Multimodal", def: "Handling more than text — images, audio, video. Images are patched into tokens, so resolution is a cost decision.", related: ["VLM", "Token"] },

  // ── N ──
  { term: "nDCG", def: "A ranking-quality metric rewarding correct results placed higher. What reranking improves; distinct from recall@k, which reranking cannot change.", related: ["Reranking", "recall@k"] },
  { term: "NIST AI RMF", def: "A voluntary US AI risk-management framework structured as Govern, Map, Measure, Manage. The common structure for an internal AI risk programme and a defensible security-review answer.", related: ["EU AI Act", "ISO 42001"], hot: true },

  // ── O ──
  { term: "Observability (LLM)", def: "Tracing that records the rendered prompt, retrieved IDs and scores, model and prompt versions, tokens, cost, latency by stage, guardrail verdicts, and outcome. Standard APM can't answer LLM questions.", related: ["OpenTelemetry", "Trace"], hot: true },
  { term: "Ollama", def: "A local inference runtime built on llama.cpp for running open-weight models on laptops and consumer GPUs via GGUF quantization. The default for local development.", related: ["GGUF", "vLLM"] },
  { term: "Online evaluation", def: "Measuring quality on live traffic — sampled judging, regeneration and escalation rates, guardrail metrics — as opposed to offline evaluation on a fixed dataset.", related: ["Eval / evaluation", "Guardrail"] },
  { term: "OpenTelemetry", def: "The open observability standard, with GenAI semantic conventions for model calls so LLM traces live alongside the rest of your telemetry and stay portable across platforms.", related: ["Observability (LLM)", "Trace"], hot: true },
  { term: "Open-weight", def: "A model whose parameters are published for download, so you can run, quantize, and fine-tune it yourself. Not the same as open-source, which would also require training data and code.", related: ["Self-hosting", "Quantization"], hot: true },
  { term: "Overfitting", def: "Fitting training data at the expense of generalisation. In fine-tuning it shows as training loss falling while validation loss rises — often within a single epoch on a small dataset.", related: ["Fine-tuning", "SFT"] },

  // ── P ──
  { term: "PagedAttention", def: "Paged, on-demand KV cache allocation with copy-on-write prefix sharing, introduced by vLLM. Removes fragmentation from pre-allocating maximum-length blocks and became the default serving architecture.", related: ["KV cache", "vLLM"], hot: true },
  { term: "Parallel tool calls", def: "Several independent tool calls requested in one turn and executed concurrently — often the biggest latency win in an agent, and a correctness bug when the calls are actually dependent.", related: ["Tool calling", "Agent"] },
  { term: "PEFT", def: "Parameter-Efficient Fine-Tuning — training a small number of new parameters while the base model stays frozen. LoRA is the dominant method.", related: ["LoRA", "QLoRA"] },
  { term: "pgvector", def: "The Postgres extension for vector similarity search, with HNSW and IVF indexes. The sensible default when you already run Postgres — vectors sit alongside metadata and ACLs with real SQL filtering.", related: ["Vector database", "HNSW"], hot: true },
  { term: "Preference optimisation", def: "Training on comparisons between candidate answers rather than demonstrations, because open-ended quality has no single correct answer to imitate. RLHF, DPO, and GRPO are all forms of it.", related: ["DPO", "RLHF", "GRPO"] },
  { term: "Prefill", def: "The phase that processes the whole input prompt in parallel. Compute-bound, scales with input length, and sets TTFT — which is why prompt caching cuts perceived latency so effectively.", related: ["Decode", "TTFT", "Prompt caching"] },
  { term: "Prefix caching", def: "Reusing the KV cache for a shared prompt prefix across requests, so the system prompt and tool definitions are processed once instead of every call. Requires an exact prefix match.", related: ["Prompt caching", "KV cache"], hot: true },
  { term: "Progressive disclosure", def: "Revealing detail only when it becomes relevant — a one-line description in context, with the full instructions loaded on demand. The mechanism behind Agent Skills.", related: ["Agent Skills", "Context engineering"] },
  { term: "Prompt caching", def: "Provider-side reuse of a processed prompt prefix at a large discount, cutting both input cost and TTFT. The highest-value, lowest-risk optimisation available — and it needs stable-content-first prompt ordering.", related: ["Prefix caching", "Context engineering"], hot: true },
  { term: "Prompt engineering", def: "Writing the instructions, examples, and output contract that steer a model. Still necessary, now one component of context engineering rather than the headline skill.", related: ["Context engineering", "Few-shot"] },
  { term: "Prompt injection", def: "Untrusted text being treated as instructions, because a model can't distinguish instructions from data. Structural rather than a fixable bug — treat it as an authorisation problem, not a filtering one.", related: ["Indirect prompt injection", "Lethal trifecta"], hot: true },
  { term: "Prompt version", def: "The identifier tying an output to the exact prompt template that produced it, recorded in every trace. Without it you can't attribute a regression or roll back with a flag.", related: ["Release lifecycle", "Trace"] },

  // ── Q ──
  { term: "QLoRA", def: "LoRA training over a base model quantized to 4-bit, cutting memory enough to fine-tune large models on a single GPU with minimal quality loss.", related: ["LoRA", "Quantization"], hot: true },
  { term: "Quantization", def: "Representing weights (and sometimes activations or the KV cache) with fewer bits. Cuts memory and speeds bandwidth-bound decode; loss concentrates in the tail — hard reasoning, long context, rare languages.", related: ["AWQ", "GPTQ", "FP8"], hot: true },
  { term: "Query rewriting", def: "Rewriting a follow-up turn into a standalone question using conversation history. Mandatory for multi-turn RAG — \"and for Europe?\" is unsearchable on its own.", related: ["RAG", "HyDE"] },

  // ── R ──
  { term: "RAG", def: "Retrieval-Augmented Generation — fetching relevant material from a source you control and answering from it. Addresses knowledge cutoff, private data, attribution, freshness, and permissions at once.", related: ["Grounding", "Hybrid search"], hot: true },
  { term: "RAG triad", def: "Context relevance, groundedness, and answer relevance — three metrics that isolate whether retrieval or generation broke. One blended quality score can't tell you which.", related: ["Groundedness", "Eval / evaluation"], hot: true },
  { term: "ReAct", def: "The default agent loop pattern: reason, act (call a tool), observe the result, repeat. Interleaves thinking with tool use rather than planning everything up front.", related: ["Agent", "Tool calling"] },
  { term: "Reasoning model", def: "A model trained to generate internal reasoning before answering, with an effort or token budget you set per request. Helps where intermediate steps can be wrong; pure overhead for lookup and extraction.", related: ["Test-time compute", "GRPO"], hot: true },
  { term: "recall@k", def: "The fraction of queries where the needed chunk appears in the top k results. The ceiling on a RAG system — if retrieval never surfaced it, nothing downstream can recover it.", related: ["nDCG", "Reranking"], hot: true },
  { term: "Regression suite", def: "Evals run automatically on every change, grown from production failures so the same bug can never silently return.", related: ["Golden set", "Eval-driven development"] },
  { term: "Reranking", def: "Precision-scoring a retrieved shortlist with a cross-encoder to promote the right passage into the handful you actually send. Usually the single biggest quality jump available to a RAG system.", related: ["Cross-encoder", "recall@k"], hot: true },
  { term: "Reward hacking", def: "A policy optimising the measured proxy rather than the intent — learning that longer, more confident, more agreeable answers score higher with the reward model.", related: ["RLHF", "Sycophancy"] },
  { term: "RLAIF", def: "Reinforcement Learning from AI Feedback — using a model rather than humans to generate preference labels, scaling preference data past human throughput.", related: ["RLHF", "Constitutional AI"] },
  { term: "RLHF", def: "Reinforcement Learning from Human Feedback — collect comparisons, train a reward model, optimise the policy with RL under a KL penalty. Effective, complex, and prone to reward hacking.", related: ["DPO", "Reward hacking"] },
  { term: "Routing", def: "Selecting the model, tier, or retriever per request class — cheap model for the easy majority, escalating on failure signals. The standard way to hold quality while cutting cost.", related: ["LLM gateway", "SLM"], hot: true },
  { term: "RRF", def: "Reciprocal Rank Fusion — combining ranked lists by rank position rather than score, so vector and BM25 results merge without calibration. The default fusion method for hybrid search.", related: ["Hybrid search", "BM25"], hot: true },

  // ── S ──
  { term: "Scratchpad", def: "An agent's structured working notes — goal, hard constraints, discovered facts, completed sub-tasks — re-rendered each step and never summarised away by compaction.", related: ["Agent", "Compaction"] },
  { term: "Self-RAG", def: "A model deciding when to retrieve and critiquing its own output against the retrieved evidence, rather than retrieval being unconditional.", related: ["Corrective RAG (CRAG)", "Agentic RAG"] },
  { term: "Semantic cache", def: "Returning a stored answer when a new query is similar enough to a previous one. A quality decision wearing a cost-saving costume — false hits on questions differing by one qualifier are the risk.", related: ["Prompt caching", "Embedding"], hot: true },
  { term: "Semantic layer", def: "Curated views and metric definitions where business terms are defined once, so a text-to-SQL model composes pre-defined metrics instead of inventing joins.", related: ["Text-to-SQL"] },
  { term: "SFT", def: "Supervised Fine-Tuning — training on input/output pairs demonstrating the behaviour you want. The workhorse of model adaptation, and the stage preference optimisation builds on.", related: ["Fine-tuning", "DPO"] },
  { term: "Slice", def: "A labelled subset of an eval set — request type, language, source, difficulty — reported separately. Averages hide segments that are entirely broken.", related: ["Golden set", "Eval / evaluation"] },
  { term: "SLM", def: "Small Language Model — a compact model (roughly 1–8B parameters) able to run on a single GPU, a laptop, or a phone. Chosen for latency, cost, privacy, or edge deployment.", related: ["Routing", "Distillation"], hot: true },
  { term: "Small-to-big retrieval", def: "Embedding and searching small chunks for precision but returning the larger parent section for context. Fixes most \"right chunk found, answer still incomplete\" complaints.", related: ["Chunking", "RAG"] },
  { term: "Sparse retrieval", def: "Keyword-based retrieval using sparse vectors (BM25 and relatives), as opposed to dense retrieval with embeddings. Strong exactly where embeddings are weak.", related: ["BM25", "Hybrid search"] },
  { term: "Speculative decoding", def: "A small draft model proposes several tokens that the target model verifies in one pass. Mathematically lossless, giving 2–3× faster decode when acceptance rates are high.", related: ["Acceptance rate", "Decode"], hot: true },
  { term: "Structured output", def: "Constraining generation to a schema so results parse every time. Same machinery as tool calling; guarantees structure, never correctness — semantic validation is a separate step.", related: ["Constrained decoding", "JSON Schema"], hot: true },
  { term: "Sycophancy", def: "A model agreeing with the user at the expense of accuracy — an artefact of preference training, since raters reward agreement. Don't lead the witness; ask for evidence before a verdict.", related: ["RLHF", "Reward hacking"] },
  { term: "Synthetic data", def: "Training or evaluation data generated by a model. Useful for cold start, rare cases, augmentation, and privacy — with distribution mismatch, mode collapse, and error amplification as the failure modes.", related: ["Distillation", "Model collapse"] },
  { term: "System prompt", def: "The standing instructions framing a whole conversation. Stable across requests, so it belongs first in the prompt where it can be cached.", related: ["Prompt engineering", "Prompt caching"] },

  // ── T ──
  { term: "Temperature", def: "The sampling parameter that flattens or sharpens the token distribution. 0–0.3 for extraction and code, 0.7–1.0 for open-ended writing — and temperature 0 is not fully deterministic in practice.", related: ["Top-p", "Sampling"] },
  { term: "Test-time compute", def: "Spending extra compute at inference — reasoning tokens — to improve an answer. Turns quality into a per-request dial: valuable on hard multi-step problems, pure waste on lookup and extraction.", related: ["Reasoning model", "GRPO"], hot: true },
  { term: "Text-to-SQL", def: "Generating SQL from a natural-language question. Needs retrieved schema, semantic descriptions, read-only credentials with row-level security, statement validation, and visible SQL.", related: ["Semantic layer", "RAG"], hot: true },
  { term: "Throughput", def: "Total tokens or requests per second across all concurrent users. Traded against per-request latency via batch size; continuous batching improves both.", related: ["Goodput", "Continuous batching"] },
  { term: "Token", def: "The subword unit a model reads and writes — roughly ¾ of an English word. Pricing, context limits, and latency are all measured in tokens.", related: ["Tokenizer", "Context window"] },
  { term: "Tokenizer", def: "The component splitting text into tokens, usually by byte-pair encoding. Model-family specific, so token counts don't transfer between vendors.", related: ["Token"] },
  { term: "Tool calling", def: "The model emitting a structured request for your code to execute a named function with typed arguments. The model never executes anything — every security control lives on your side of that boundary.", related: ["MCP", "Agent"], hot: true },
  { term: "Tool poisoning", def: "Malicious instructions hidden in an MCP tool's description or metadata, which the model reads as trusted context. Defended by reviewing and pinning server versions.", related: ["MCP", "Prompt injection"], hot: true },
  { term: "TPOT", def: "Time Per Output Token (also inter-token latency) — how fast text streams once generation starts. Bounded by memory bandwidth.", related: ["TTFT", "Decode"], hot: true },
  { term: "Trace", def: "The record of one request and each nested operation within it — the rendered prompt, retrieved IDs, tool calls, tokens, cost, latency, verdicts, and outcome. The compliance artefact as well as the debugging tool.", related: ["Observability (LLM)", "OpenTelemetry"] },
  { term: "Trajectory evaluation", def: "Scoring the path an agent took — tool choices, ordering, redundant calls, steps, tokens — rather than only the final answer. Two correct runs can differ 10× in cost and risk.", related: ["Agent", "Eval / evaluation"], hot: true },
  { term: "Transformer", def: "The architecture behind modern language models: stacked blocks of attention plus feed-forward layers operating on token embeddings.", related: ["Attention", "LLM"] },
  { term: "TTFT", def: "Time To First Token — how long before anything appears. Dominated by prefill, and the latency users actually judge.", related: ["TPOT", "Prefill"], hot: true },

  // ── V ──
  { term: "Vector database", def: "A store for embeddings with approximate nearest-neighbour search and metadata filtering. pgvector is the sensible default below roughly 10M vectors if you already run Postgres.", related: ["pgvector", "ANN"] },
  { term: "Verifiable reward", def: "A reward computed by checking correctness automatically — unit tests pass, the answer matches. Removed humans from the RL loop, which is what made large-scale reasoning training practical.", related: ["GRPO", "RLHF"], hot: true },
  { term: "VLM", def: "Vision-Language Model — a model taking images and text together. The basis of OCR-free document extraction and screenshot understanding.", related: ["Multimodal"] },
  { term: "vLLM", def: "The high-throughput open-source serving engine that introduced PagedAttention. The common production default for self-hosted GPU inference, with an OpenAI-compatible API.", related: ["PagedAttention", "Continuous batching"], hot: true },

  // ── W ──
  { term: "Workflow", def: "Code with model calls at fixed points you defined — as opposed to an agent, where the model chooses each next step. Cheaper, predictable, and testable; most problems marketed as agents are workflows.", related: ["Agent"] },

  // ── Z ──
  { term: "Zero-retention", def: "A provider mode where inputs aren't stored after processing. Often available on enterprise tiers and usually must be requested explicitly — a standard security-review question.", related: ["Data residency"] },
  { term: "Zero-shot", def: "Asking a model to perform a task with no examples, relying on instructions alone. Contrast with few-shot.", related: ["Few-shot", "Prompt engineering"] },

  // ── misc / cross-cutting ──
  { term: "Calibration", def: "Measuring how well an LLM judge's verdicts agree with human labels (aim for 80%+ on binary criteria over 100–200 cases). An uncalibrated judge is an unlabelled instrument.", related: ["LLM-as-judge"], hot: true },
  { term: "Canary", def: "Routing a small percentage of traffic to a change first and watching guardrail metrics before rolling out further.", related: ["Release lifecycle", "Kill switch"] },
  { term: "Contamination", def: "Eval examples leaking into few-shot prompts, fine-tuning data, or the retrieval index. Scores become inflated fiction — and because they look good, nobody investigates.", related: ["Golden set", "Eval / evaluation"] },
  { term: "Data residency", def: "A legal requirement that data physically stays within a jurisdiction. One of the three genuine reasons to self-host rather than call a hosted API.", related: ["Zero-retention", "Open-weight"] },
  { term: "Dimensionality", def: "How many numbers per embedding vector. More captures more nuance and costs more to store and search; 768–1536 is the common range.", related: ["Embedding", "Matryoshka embeddings"] },
  { term: "Dot product", def: "A similarity measure combining angle and magnitude. Equivalent to cosine similarity when vectors are normalised, which most embedding models do.", related: ["Cosine similarity"] },
  { term: "EU AI Act", def: "Risk-tiered EU regulation (prohibited / high-risk / limited / minimal). Tier depends on what a system is used for, not how it's built — high-risk carries documentation, human-oversight, accuracy, and logging obligations.", related: ["NIST AI RMF", "ISO 42001"], hot: true },
  { term: "ISO/IEC 42001", def: "A certifiable AI management system standard, increasingly requested in enterprise procurement much as ISO 27001 was before it.", related: ["EU AI Act", "NIST AI RMF"], hot: true },
  { term: "Kill switch", def: "A config flag that disables an AI feature, downgrades to a smaller model, or falls back to a non-AI path with no deploy required. The cheapest incident-response capability you can build.", related: ["Release lifecycle", "Canary"] },
  { term: "Long-term memory", def: "Facts persisted across sessions and retrieved on demand. Needs a deliberate write policy, per-turn retrieval, correction and expiry, user visibility — and it's a privacy and injection surface.", related: ["Memory poisoning", "Scratchpad"], hot: true },
  { term: "Release lifecycle", def: "Treating prompts, model selections, tool schemas, retrieval config, and guardrail policies as versioned deployable artefacts, shipped through eval-gated CI, canary, and progressive rollout.", related: ["Prompt version", "Canary"], hot: true },
  { term: "Red teaming", def: "Adversarially testing your own system — injection, jailbreaks, exfiltration, permission bypass, harmful output, cost attacks. Humans find novel attacks; every finding becomes a permanent CI case.", related: ["Prompt injection", "Jailbreak"], hot: true },
  { term: "Sampling", def: "Choosing the next token from the model's probability distribution, governed by temperature, top-p, and top-k. The reason identical prompts produce varying output.", related: ["Temperature", "Top-p"] },
  { term: "Self-hosting", def: "Running open-weight models on your own GPUs. Wins when sustained utilisation is high, data must not leave your boundary, or you need weight-level control — and you pay per GPU-hour, not per token.", related: ["vLLM", "Open-weight"] },
  { term: "Top-p", def: "Nucleus sampling — restricting choices to the smallest set of tokens whose probabilities sum to p. Tune this or temperature, not both.", related: ["Temperature", "Sampling"] },
  { term: "Validation", def: "Checking model output before using it: schema validation (a type check) plus semantic validation (arithmetic reconciles, IDs exist, ranges plausible). Constrained decoding guarantees only the former.", related: ["Structured output", "Guardrail"] },
];
