import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  // ── Foundations ──
  {
    topic: "Foundations",
    q: "What does an AI Engineer do that an ML Engineer doesn't?",
    a: "An ML Engineer owns models: data pipelines, training runs, evaluation of the model itself, and serving the resulting checkpoint. An AI Engineer treats a pretrained model as a dependency and owns the system around it — prompting and context engineering, retrieval, tool use and agent loops, evaluation of the *product* behaviour, guardrails, latency and cost engineering, and production observability. The overlap is deployment and monitoring; the difference is that an AI Engineer's main lever is the context and the surrounding system, not the weights. In practice the week is roughly 60% ordinary software engineering, 30% evaluation, and 10% prompting and model work.",
  },
  {
    topic: "Foundations",
    q: "Walk me through the order in which you'd try to improve a weak LLM feature.",
    a: "Prompt first: clarify the instruction, add an output contract, add a few well-chosen examples, and split the task if it's doing two things at once. Then retrieval, if the failures are about missing or stale knowledge. Then fine-tuning, if the failures are about consistent format, tone, or a narrow task the model keeps getting subtly wrong even with good context. Pretraining is essentially never the answer for a product team. The ordering is about cost and reversibility — a prompt change ships in minutes and reverts in seconds; a fine-tune is a new artefact to version, evaluate, and redo every time the base model changes. Before any of it, though, I'd want an eval set, because otherwise I can't tell which of those failure classes I actually have.",
  },
  {
    topic: "Foundations",
    q: "Explain prefill and decode, and why the distinction matters.",
    a: "Prefill processes the entire input prompt in parallel and is compute-bound; it determines time to first token. Decode generates output one token at a time, sequentially, and is bound by memory bandwidth because the weights are re-read for every token; it determines time per output token. The distinction matters because the fixes are completely different. If TTFT is bad, you shorten the prompt, cache the stable prefix, or trim retrieved context. If streaming is slow, you use a smaller or quantized model, better batching, or speculative decoding. And since total latency is TTFT plus output tokens times TPOT, output length is usually the biggest single lever — capping max_tokens or asking for bullets instead of prose is often a 3× win for free.",
  },
  {
    topic: "Foundations",
    q: "How would you decide between a frontier model and a small open-weight model?",
    a: "Measure, don't assume. Build an eval set from real traffic, run both, and compare on the slices that matter rather than the average. Then weigh the deltas: frontier models typically win on hard reasoning, long-horizon agent work, and rare edge cases; small open-weight models win on cost per call, tail latency, data residency, and the ability to fine-tune. The usual production answer is both — route the easy majority to the cheap tier and escalate on a confidence signal, a failed validation, or a classifier, which often keeps 90%+ of the quality at a fraction of the cost. I'd only self-host when sustained volume makes GPUs cheaper than per-token pricing, when data can't leave our boundary, or when we need weight-level control.",
  },
  {
    topic: "Foundations",
    q: "Why isn't temperature 0 deterministic?",
    a: "Temperature 0 makes the sampler pick the highest-probability token, but the probabilities themselves can vary slightly between runs. Floating-point operations aren't associative, so batched GPU kernels can produce marginally different results depending on how requests were grouped; mixture-of-experts routing can differ; and load-dependent batching changes the grouping. Once two token probabilities are close, a tiny numerical difference flips the choice and the outputs diverge from there. The practical consequence is that you should never assert on exact output strings in tests — assert on structure, on semantic properties, or on a scored metric over a dataset.",
  },

  // ── Prompting & context ──
  {
    topic: "Prompting",
    q: "What is context engineering, and how is it different from prompt engineering?",
    a: "Prompt engineering is writing the instructions, examples, and output contract. Context engineering is the larger discipline of deciding what occupies the context window at all — which retrieved passages, how much conversation history, which tool definitions, what memory — and in what form and order. It became a named skill once windows got big enough that the constraint stopped being 'can I fit this?' and became 'should I?'. The four operations are select (retrieve just in time), compress (summarise and dedupe), order (stable content first for caching, decisive content last for attention), and evict (drop what's no longer load-bearing). The test I apply in review is: point at any block in the assembled context and ask what breaks if we delete it. If nobody can answer, it goes.",
  },
  {
    topic: "Prompting",
    q: "How do you guarantee an LLM returns parseable JSON?",
    a: "There are four levels of enforcement and you should use the strongest available. Asking nicely fails on edge cases. Putting a literal schema in the prompt and prefilling the reply with an opening brace is better but still not guaranteed. Tool/function calling returns typed arguments and is strong. Constrained decoding — where the sampler masks any token that would violate the grammar — is a structural guarantee. But all it guarantees is that the output *parses*: a grammar can't tell you the invoice total was misread. So you still need semantic validation — cross-field arithmetic, referential checks, plausible ranges — then one repair attempt feeding back the validation error, then a loud failure routed to a human or a fallback. Never a hopeful parse.",
  },
  {
    topic: "Prompting",
    q: "When is a reasoning model worth the cost?",
    a: "When the task has intermediate steps that can be wrong — multi-step maths, planning, constraint satisfaction, debugging, ambiguous requirements. Thinking tokens bill at output rates and generate sequentially, so they hit cost and latency together; a request with 4,000 thinking tokens before a 200-token answer costs roughly twenty times the answer alone. For lookup, extraction, classification, and formatting there are no intermediate steps to get right, so it's pure overhead. I'd treat reasoning effort as a routing decision per request class, evaluate per class rather than on the average — reasoning often lifts only the hardest 10% of the eval set and barely moves the mean — and cap thinking tokens with an alert on p95 latency.",
  },
  {
    topic: "Prompting",
    q: "Your system prompt has grown to 2,000 words of accumulated fixes. What do you do?",
    a: "Rewrite it from scratch and delete every rule that no eval case defends. Accumulated patches conflict with each other and dilute the instructions that matter, and long prompts cost tokens on every single call. The method is: take the eval set, rewrite the prompt to its minimal form, score it, then add back only the rules that measurably fix a failing case. In my experience that usually improves quality and cuts cost simultaneously. I'd also check whether some of those rules are really guardrails wearing a prompt costume — 'never mention pricing' is more reliably enforced by an output check than by an instruction, and stating a prohibition in the prompt actually makes the topic more salient.",
  },

  // ── Retrieval ──
  {
    topic: "Retrieval",
    q: "Why do production systems use hybrid search instead of just embeddings?",
    a: "Because vector and keyword search fail in complementary ways. Embeddings find things that are *about* the same topic — 'how do I stop being billed?' retrieves 'Cancelling your subscription' with no shared words. But they're weak on exactly the queries users actually type in enterprise settings: order numbers, error codes, CVE identifiers, internal project codenames, and anything involving negation or numeric comparison. `INV-90412` and `INV-90413` are nearly identical in embedding space. BM25 handles those natively and cheaply. So you retrieve ~50 from each, fuse with Reciprocal Rank Fusion — which combines by rank position and needs no score calibration — and rerank the shortlist. It's the most reliable single upgrade available to a mediocre RAG system.",
  },
  {
    topic: "Retrieval",
    q: "How would you choose a chunk size?",
    a: "By measuring, not by arguing. I'd build a small retrieval eval set — 50 to 100 real questions labelled with the chunk IDs that should be retrieved — then sweep chunk size and overlap and measure recall@k. That's an afternoon of work and it settles the discussion with a number. As a starting point: 200–400 tokens for self-contained FAQs, 400–800 with 10–15% overlap for technical docs, 500–1,000 on clause boundaries for contracts, and whole functions for code. But the bigger win is usually chunking on the document's own structure — headings, sections, list items — rather than fixed size, and using small-to-big retrieval so you search precise small chunks but return the coherent parent section.",
  },
  {
    topic: "Retrieval",
    q: "What does a reranker do, and why can't it fix bad retrieval?",
    a: "A reranker is typically a cross-encoder: it reads the query and each candidate document *together* and scores relevance directly, which is far more accurate than comparing two independently computed embeddings. It's affordable because it only runs on a shortlist of 25–100 candidates. What it improves is ordering — nDCG and MRR — getting the right passage from position 30 to position 1. What it cannot improve is recall@k: if retrieval never surfaced the correct chunk in the candidate set, no reranker can invent it. That's why recall@k is the ceiling on the whole system, and why the standard shape is retrieve 50, rerank to 5–10, send those.",
  },
  {
    topic: "Retrieval",
    q: "How do you enforce document permissions in a RAG system?",
    a: "The filter goes inside the retrieval query, never after it. If you retrieve globally and then discard results the user can't see, the model has already read those documents and its answer can leak them — and you also end up with far fewer than k results, because a selective filter removes most of what the ANN search returned. So tenant ID and ACL groups are stored on every chunk and pushed into the vector query itself, ideally enforced at the database layer with row-level security so an application bug can't bypass it. And I'd add an automated test to every release asserting that a user in tenant A can never retrieve a chunk from tenant B. Cross-tenant leakage from a missing filter is the number-one enterprise RAG defect.",
  },
  {
    topic: "Retrieval",
    q: "When would you move off pgvector to a dedicated vector database?",
    a: "When I've measured a specific problem, not on principle. pgvector is comfortable into the tens of millions of vectors with HNSW tuning, and keeping vectors in the Postgres you already operate means transactional writes, real SQL filtering, and joins straight to your permissions tables — which makes ACL enforcement correct by construction rather than by discipline. I'd move when corpus scale goes beyond what tuning handles, when p95 retrieval latency at our QPS becomes the bottleneck, or when we need a specific feature the extension doesn't have. Adding a second datastore is a real operational cost, so it should be paid for by a number, not a preference.",
  },

  // ── RAG ──
  {
    topic: "RAG",
    q: "Design a RAG system for internal company documentation.",
    a: "I'd start with requirements: volume, corpus size and churn, whether documents are permissioned, latency target, and what happens when it's wrong. Assuming permissioned docs and an interactive latency target: offline, connectors poll each source, layout-aware parsing preserves structure, chunks follow headings, contextual retrieval prepends a generated one-line situating summary before embedding, and ACLs plus effective dates are copied onto every chunk with a content hash so re-indexing only touches what changed — plus a nightly reconcile to catch deletions. Online: rewrite follow-ups into standalone questions, hybrid retrieval with the ACL filter inside the query, RRF fusion, cross-encoder rerank to about six passages, a relevance floor below which we decline rather than answer, then a grounded generation with mandatory citations that we verify programmatically. Everything traced. And I'd define success first: recall@20 above 0.92, groundedness above 0.95, correct-decline rate above 0.90 on deliberately unanswerable questions, and a zero-tolerance cross-tenant retrieval test gating every release.",
  },
  {
    topic: "RAG",
    q: "How do you evaluate a RAG system?",
    a: "Separately by stage, or you'll tune the component that wasn't broken. Retrieval gets labelled metrics that need no judge: recall@k — which is the ceiling on everything downstream — precision@k, nDCG for ordering, and coverage for multi-part questions. Generation gets the RAG triad: context relevance blames retrieval, groundedness blames generation going beyond its sources, and answer relevance catches a correct answer to the wrong question. The dataset should be real questions with labelled expected chunk IDs, sliced by department, language, and difficulty, with about 15% deliberately unanswerable cases so you can measure whether it declines appropriately. Cheap assertions run in CI on every commit, the full judged suite runs before release, and sampled judging plus regeneration and escalation rates run continuously in production — with every production failure becoming a permanent test case.",
  },
  {
    topic: "RAG",
    q: "When is RAG the wrong architecture?",
    a: "Three cases. First, when the corpus is small and stable enough to fit in context affordably — one manual, one codebase, one report — where retrieval adds a failure mode for nothing. Second, when the question requires the whole corpus at once: 'summarise every risk across all 900 contracts' can't be served by top-k retrieval and needs map-reduce, structured extraction into a database, or GraphRAG-style community summaries. Third, when the question is really about structured data — 'how many enterprise accounts churned last quarter' is a SQL query, and similarity search can't compute an aggregate. A good router sends each of those somewhere different, including to 'no retrieval at all', which covers more real traffic than people expect.",
  },
  {
    topic: "RAG",
    q: "Your RAG assistant confidently answers from irrelevant retrieved passages. How do you fix it?",
    a: "Add a relevance grading step between retrieval and generation, and branch on the result: generate if the context is relevant, rewrite the query and re-retrieve if it's partial, and fall back or decline if it's irrelevant. That's corrective RAG, it costs a small model call, and it converts the worst RAG failure mode into a handled state. Alongside that I'd set a relevance floor on the reranked top score, so below a threshold the system declines with a pointer to the right team rather than answering. And I'd verify citations programmatically — if the model cites a source ID we didn't provide, that's a validation failure, not something to render. Adding more retrieved chunks, which is the instinctive fix, makes this worse.",
  },

  // ── Agents & tools ──
  {
    topic: "Agents",
    q: "What's the difference between an agent and a workflow, and which should you use?",
    a: "In a workflow you wrote the control flow: the model is called at fixed points you defined. In an agent the model decides its own next step until it judges the task done. Workflows are cheaper, predictable, testable, and need no step limit; agents can handle situations you didn't anticipate. The honest observation is that most problems marketed as agents are workflows — if you can draw the steps on a whiteboard and they don't change per request, write the workflow. Reach for an agent when the *sequence itself* depends on what earlier steps discover, like research or investigation, and accept that you're trading predictability for adaptability.",
  },
  {
    topic: "Agents",
    q: "How do you stop an agent from looping forever?",
    a: "Four conditions, and you need all of them rather than whichever you remembered. A hard step limit, typically 10–25 iterations. A cumulative token or cost budget, which is what actually stops a $40 request. A wall-clock timeout, because upstream callers won't wait. And no-progress detection — if the agent issues the same tool call with the same arguments again, it's stuck, so you break out and tell it to try a different approach rather than funding the loop. When any of these trips, the agent must return a *clearly labelled* incomplete result. An agent that hits its step limit and returns its last draft as if it were finished is worse than one that fails loudly, because downstream systems consume it as complete.",
  },
  {
    topic: "Agents",
    q: "How do you design a tool the model will actually use correctly?",
    a: "One clear purpose per tool, rather than a do-everything tool with a mode string. A description written for the model that says what it does, when to use it, and — critically — when *not* to use it, since most wrong-tool selection comes from overlapping descriptions. Constrained parameter types: enums over free strings, with formats and units stated in field descriptions. Compact structured results, because a tool returning 50KB of JSON has just eaten the context window; return a summary plus a reference. Errors returned as tool results the model can act on, not exceptions raised into the loop. And 5–15 tools attached by request class, not 40 on every call — selection accuracy degrades measurably as options multiply.",
  },
  {
    topic: "Agents",
    q: "Where do you put a human in the loop?",
    a: "It depends on reversibility and value. Approve before acting for irreversible or outward-facing actions — payments, emails, deletions, deploys. Review after acting for reversible work where speed matters, like drafts and internal edits. Escalate on uncertainty when confidence is low, validation failed, or the request is out of policy. And sample for audit on high-volume, low-individual-risk work — review 1% and track the error rate. The cheapest high-value version of this is simply splitting tools into read and write and requiring approval only for writes: reads loop freely, writes pause. That single change converts most catastrophic-failure scenarios into merely slow ones.",
  },
  {
    topic: "Agents",
    q: "When does a multi-agent system actually beat one good agent?",
    a: "When you need context isolation, genuine parallelism, or different permissions. Context isolation is the strongest reason: a sub-agent can read 40,000 tokens of search results and return a 300-token summary, keeping the parent's window clean. Parallelism helps when sub-tasks are independent — six vendors researched concurrently. Different permissions is a security argument: the agent browsing untrusted web content should not be the one holding production credentials. What doesn't work is splitting by job title — 'researcher, writer, editor' personas rarely beat a single well-prompted agent, and you pay a real coordination tax: 3–15× the tokens, lossy summarised hand-offs, and compounding error rates, since 90% per agent across four agents is about 66% end to end. Multi-agent also fails badly on shared evolving state, where agents conflict and overwrite each other.",
  },
  {
    topic: "Agents",
    q: "How do you evaluate an agent?",
    a: "On the trajectory, not just the final answer. Two runs can both end correct while differing tenfold in cost, and a run can reach the right answer through a dangerous path. So I'd score: were the right tools called, in a sensible order, without redundant calls, within budget? I'd maintain a task suite per agent with expected outcomes and expected tool sequences, run in CI against sandboxed systems. I'd add safety evals as regression cases — injection payloads embedded in tool results, permission-escalation attempts, prompt-leak probes. And I'd watch cost and step *distributions* rather than averages, because the p95 run is what surprises you at month end. Approval rates by tool are also useful: a tool approved 100% of the time probably doesn't need approval, and one rejected often means the agent is proposing the wrong thing.",
  },

  // ── MCP ──
  {
    topic: "MCP",
    q: "What is MCP and what problem does it solve?",
    a: "The Model Context Protocol is an open standard for connecting AI applications to tools and data. Before it, every AI application wrote its own integration for every system — ten applications and ten systems meant a hundred bespoke connectors. MCP turns that N×M problem into N+M: you build one server per system and every MCP-speaking host can use it. There are three roles — the host holds the model and the permission decisions, a client per server speaks the protocol, and servers expose capabilities. And three primitives with three different controllers: tools, which the *model* decides to call; resources, which the *application* attaches as context; and prompts, which the *user* triggers. Most servers ship only tools, which misses the point of resources.",
  },
  {
    topic: "MCP",
    q: "How would you secure an MCP server?",
    a: "Design the surface around intent rather than tables — `find_overdue_invoices(customer)` rather than `run_sql(query)` — because coarse purposeful tools are easier to authorise and easier for the model to choose correctly. Authenticate the calling user and act with *their* permissions; never accept identity as a tool argument, because anything the model can set it can be persuaded to set differently, and a shared service credential means every user inherits its full access. Then least privilege per tool, rate limits per user and per tool, bounded result sizes enforced server-side, timeouts, idempotency keys on writes because retries are guaranteed, and an audit log of every invocation. And I'd treat installing a third-party MCP server exactly like adding an unaudited dependency — its tool descriptions are text the model reads and acts on, which is the tool-poisoning vector.",
  },
  {
    topic: "MCP",
    q: "What's the risk in connecting several MCP servers to one agent?",
    a: "Composition. Each server can be safe alone and dangerous together — a server that reads private documents plus a server that can send email is a complete exfiltration path, and neither server is individually at fault. That's the lethal trifecta: private data access, exposure to untrusted content, and an outward communication channel. So trust decisions have to be made about the *set* of connected servers, not one at a time. Practically that means separating agents by trust level — the one reading untrusted content holds no credentials and has no egress — plus an egress allow-list and human approval on outward-facing actions.",
  },

  // ── Fine-tuning ──
  {
    topic: "Fine-tuning",
    q: "When should you fine-tune, and when shouldn't you?",
    a: "Fine-tune for behaviour: strict format adherence where prompting gets you to 97% and you need 99.9%, a tone or domain style that would cost 2,000 tokens to describe on every call, a narrow task where the base model keeps making the same subtle mistake, or — the biggest practical reason — cost and latency, since a fine-tuned small model can match a frontier model on your specific task at a fraction of the price. Don't fine-tune to teach facts: knowledge in weights is recalled unreliably, goes stale immediately, can't be cited, and can't respect per-user permissions. That's retrieval's job. And the real signals that you've hit the prompting ceiling are a *scored* plateau on an eval set and 1,000-plus high-quality examples — not that the first prompt didn't work.",
  },
  {
    topic: "Fine-tuning",
    q: "Explain LoRA. Why does almost nobody do full fine-tuning any more?",
    a: "Full fine-tuning needs memory for every weight plus its gradients plus optimiser state — hundreds of gigabytes for a large model. LoRA exploits the observation that the *change* a fine-tune makes to a weight matrix is low rank: instead of learning a full update to a 4096×4096 matrix, you learn matrices of shape 4096×8 and 8×4096 and add their product to the frozen base. That's about 0.4% of the parameters at rank 8, and it gets most of the benefit. QLoRA runs the same thing over a 4-bit quantized base so large models fine-tune on a single GPU. Operationally the adapters are the real win: they're tens of megabytes and swappable, so one base model in GPU memory can serve many adapters selected per request — per tenant, per task.",
  },
  {
    topic: "Fine-tuning",
    q: "What's the difference between RLHF, DPO, and GRPO?",
    a: "All three learn from something other than plain demonstrations. RLHF collects human comparisons, trains a reward model to predict them, then optimises the policy with RL under a KL penalty — effective but complex, with three models in play and a real risk of reward hacking, where the policy learns that longer and more confident answers score better. DPO removes the reward model and the RL loop entirely: because the optimal RLHF policy has a closed-form relationship to the preference data, you can optimise directly on (chosen, rejected) pairs with a simple loss, at roughly SFT cost and far better stability. That's why most teams use it. GRPO samples a *group* of answers per prompt and scores each relative to the group average, removing the value network — and it pairs naturally with verifiable rewards, where correctness is checked automatically. That's what made large-scale reasoning training practical, and it's why maths and code advanced fastest: they have verifiers, and essay quality doesn't.",
  },
  {
    topic: "Fine-tuning",
    q: "How does distillation work in practice?",
    a: "Take real inputs from production traffic, run them through a strong teacher model with your best prompt, filter the outputs hard — verifying what you can verify and dropping anything you wouldn't be happy to serve — then fine-tune a small model, usually with LoRA, to reproduce that behaviour. Evaluate head-to-head against the teacher on held-out real inputs, expecting to match on common cases and lose on the tail, then route: student by default, escalating to the teacher on low confidence or failed validation. A 10–50× cost reduction at near-equal quality on your specific task is a routine result. Two cautions: the distribution of your training inputs matters far more than the volume, and provider terms of service usually prohibit using outputs to train a *competing* general model, so check before spending the compute.",
  },

  // ── Inference ──
  {
    topic: "Inference",
    q: "What limits how many concurrent users a GPU can serve?",
    a: "Usually the KV cache, not the model weights. Weights are a fixed one-time cost loaded into memory; the KV cache is per sequence and grows with every token. The size is roughly 2 × layers × kv_heads × head_dim × bytes per token — around 128KB per token on a typical 8B model, so an 8,000-token context is about a gigabyte per user. On an 80GB GPU with 16GB of weights, that's roughly 55 concurrent sequences. The levers are grouped-query attention to reduce kv_heads, quantizing the KV cache to FP8 to halve the bytes, and simply keeping contexts shorter — which scales linearly. 'How many users fit?' is almost always a KV-cache question.",
  },
  {
    topic: "Inference",
    q: "What is speculative decoding and what's the catch?",
    a: "Decode is memory-bandwidth bound, so verifying several tokens costs barely more than verifying one. Speculative decoding exploits that: a small draft model proposes the next few tokens, the large model verifies them all in a single pass, and accepted tokens are kept. The accept/reject rule guarantees the output distribution matches the target model's exactly, so it's mathematically lossless — a 2–3× decode speedup with identical quality, which is rare. The catch is that the benefit depends entirely on the acceptance rate. Predictable text — code, structured output, summaries that quote the source — accepts well. Open-ended creative generation accepts poorly and can end up slower than plain decoding, plus you're spending memory on the draft model. So measure on your workload before enabling it globally.",
  },
  {
    topic: "Inference",
    q: "How far can you quantize before quality suffers?",
    a: "FP8 or INT8 is usually near-free — half the memory, faster decode, and typically no measurable quality change on your evals. 4-bit is a real trade-off, and the important point is that the loss isn't uniform. Classification and extraction barely notice; multi-step reasoning, long-context recall, code correctness, and rare languages degrade noticeably. Published quantization benchmarks systematically understate this because they average over broad tasks while the damage concentrates in the tail. So evaluate on your own eval set, sliced, especially your hardest slice. And run the comparison teams usually skip: a smaller model at high precision versus a larger model at INT4. They often use similar memory, and the smaller-at-high-precision option frequently wins on quality *and* latency.",
  },
  {
    topic: "Inference",
    q: "When does self-hosting actually beat a hosted API?",
    a: "When one of three things is true: sustained volume makes per-token pricing more expensive than GPUs, data residency forbids the API, or you need weight-level control — fine-tuning, custom decoding, or a guarantee the model won't change under you. The economics are the part people get wrong: you pay per GPU-hour, not per token, so a GPU at 15% average utilisation costs roughly six times more per token than the same GPU at 90%. Break-even has to be computed against realistic utilisation including nights and weekends, not peak. And you're taking on cold starts measured in minutes — which breaks demand-based autoscaling — OOMs when a long-context request lands during a full batch, GPU procurement lead times, and an on-call rotation. I'd keep a hosted fallback regardless.",
  },

  // ── Evaluation ──
  {
    topic: "Evaluation",
    q: "How would you evaluate an LLM feature that has no single correct answer?",
    a: "In four layers. Deterministic assertions first, because they're free and unambiguous — does it parse, match the schema, cite sources that exist, stay under length, contain no PII, decline when it should. Then reference metrics where labels exist, like recall@k against labelled chunks. Then LLM-as-judge for the genuinely open-ended parts, decomposed into independent binary criteria rather than one 1–5 score, with evidence quotes required. Then human review as the ground truth the judge is calibrated against. I'd report by slice rather than average, track cost and latency alongside quality as guardrail metrics, and set explicit pass bars so shipping isn't a debate. Most teams jump straight to judges and skip the free layer that catches a surprising share of real failures.",
  },
  {
    topic: "Evaluation",
    q: "How do you build an eval dataset from nothing?",
    a: "Write 20 cases yourself today from the product spec — imperfect and immediate beats perfect and never, and you'll find real bugs in the first ten. Get a domain expert to add the hard ones by asking specifically what a new hire would get wrong. Ship behind a flag and capture real traffic, then label a stratified sample across request types rather than the most recent hundred. Add every production failure permanently, so the suite compounds. For open-ended tasks I'd label expected *properties* rather than a golden string — must mention the withdrawal period, must cite this document, must not promise a full refund, under 150 words — because properties are checkable and don't break when wording changes. And I'd deliberately include unanswerable and permission-sensitive cases, since declining correctly is a requirement, not a failure.",
  },
  {
    topic: "Evaluation",
    q: "What are the failure modes of LLM-as-judge?",
    a: "Six documented ones. Verbosity bias — longer answers score higher regardless of quality. Position bias — in pairwise comparisons the first or last option is favoured, which you handle by running both orders and discarding pairs where the verdict flips. Self-preference — a judge favours text from its own model family, so never let the same model and prompt both generate and judge, because a model's errors are exactly the ones it doesn't recognise as errors. Confidence and style bias — assertive well-formatted text beats hedged correct text. Leniency drift — direct scores creep upward over time. And sycophancy to the rubric, where the judge agrees with whatever framing you supply. The umbrella fix is calibration: human-label 100–200 outputs with the same rubric, measure agreement, inspect the disagreements — which almost always reveal an ambiguous criterion — and report the agreement number alongside every score.",
  },
  {
    topic: "Evaluation",
    q: "What's the highest-value thing to do when quality is 'bad' but nobody can say how?",
    a: "Error analysis. Collect 50 to 100 real failures — sampled, not cherry-picked — read them, and write a one-line cause for each in your own words without a pre-existing taxonomy. Then cluster the one-liners, count them, and rank by frequency times severity. From 50 failures you typically end up with 5–8 categories, and the biggest one is usually a surprise nobody had mentioned. That gives you a prioritised backlog instead of a vague complaint, and it takes about an hour. Every other action — bigger model, more retrieval, prompt rewrite — is guessing until you know which failure actually dominates.",
  },
  {
    topic: "Evaluation",
    q: "Your offline evals pass but users complain. What's happening?",
    a: "Most likely one of three things. Drift: input distributions change as new users arrive, the index changes as documents are added or go stale, or the provider changed the model underneath you — all of which degrade quality with no code change and no failing test. An unrepresentative eval set: if it's all easy or all invented inputs, it can't discriminate. Or a missing dimension — you're measuring answer quality but users are unhappy about latency, tone, or over-refusal. The response is to monitor leading indicators (retrieval score distribution, decline and regeneration rates, output length, cache hit rate), re-sample the eval set from current traffic, and add whatever the complaints are actually about as a measured slice.",
  },

  // ── Production ──
  {
    topic: "Production",
    q: "Why put a gateway between your application and model providers?",
    a: "Because everything you need at scale belongs in one place rather than reimplemented in every service: provider abstraction so you can swap models with a config change, per-request routing by task and tier, retries and cross-provider fallback with circuit breakers, exact and prefix and semantic caches shared across all callers, per-tenant token quotas enforced before spend happens, and one consistent trace and cost schema. Without it you get three services with three different retry behaviours and nobody with a shared cost view. Most teams should adopt an existing gateway rather than build one — what matters is that something owns those concerns centrally.",
  },
  {
    topic: "Production",
    q: "Your model bill has tripled. Walk me through reducing it.",
    a: "Measure first — cost per request broken down by feature — because teams routinely optimise the endpoint they *think* is expensive. Then in order: cut output tokens, since output costs 3–5× input and dominates latency, so capping max_tokens and asking for bullets is often the biggest free win. Cache the stable prefix, reordering the prompt stable-content-first if needed; that's a large discount with zero quality effect. Cut input tokens — rerank to 5 passages instead of 20, compact history, trim the system prompt, attach tools conditionally — which usually improves quality too. Then route the easy majority to a cheaper tier, having proved per-class quality on the eval set. Then batch anything non-interactive at roughly half price. Self-hosting comes last, because it's the biggest change with the biggest operational cost. Throughout I'd track cost per *successful* outcome, since a cheap call that fails and retries on the expensive model isn't cheap.",
  },
  {
    topic: "Production",
    q: "What should an LLM trace contain?",
    a: "Enough to reproduce the failure. Identity — trace and session ID, tenant, feature. Configuration — model ID, prompt version, temperature, max_tokens, the routing decision and why. Inputs — the *rendered* prompt, not the template, plus retrieved chunk IDs and their scores. Outputs — the response, stop reason, tool calls with arguments and results, citations. Cost and timing — input, cached, output and thinking tokens, cost, TTFT, and latency split by stage. Verdicts — guardrail results, validation outcome, sampled judge scores. And the outcome: success, decline, invalid, error, escalated, regenerated. The single most important field is the rendered prompt; without it, 'we can't reproduce it' is where the investigation dies. If storing full prompts is a privacy problem, store a hash plus component IDs so it can be reconstructed.",
  },
  {
    topic: "Production",
    q: "How do you ship a prompt change safely?",
    a: "Treat it as a deploy, because it is one — with no compiler and no stack trace. Prompts live in git and are referenced by version ID in every trace. The PR carries the eval delta per slice plus cost and latency changes, so reviewers see evidence rather than debating wording. Cheap assertions run in CI on every commit; the full judged suite runs before release against explicit pass bars. Then canary at 1–5% behind a flag, watching guardrail metrics for an hour and then a day, then 25%, then 100%. The previous version stays one flag away so rollback is seconds, not a redeploy. And model versions are pinned explicitly — a floating alias upgrading beneath you means your tuned prompts meet different behaviour at the provider's timing, with no deploy of yours to correlate against.",
  },
  {
    topic: "Production",
    q: "Answer quality dropped overnight and nothing was deployed. What do you check?",
    a: "In order: whether the provider changed the model under us — which is why we pin versions rather than using aliases; the retrieval score distribution, because a broken or partial reindex collapses scores while everything still returns 200 OK; the index age and last successful ingest; the cache hit rate, since a prompt change upstream can invalidate the prefix and change behaviour as well as cost; and any flag or config change, which is a deploy in everything but name. Then I'd roll back the prompt or model flag first and diagnose second — stabilise before investigating. The general lesson is that these failures are silent, so alerting has to cover leading indicators, not just 5xx rates.",
  },

  // ── Safety ──
  {
    topic: "Safety",
    q: "What is prompt injection and why can't you fix it with better instructions?",
    a: "A language model has no reliable way to distinguish instructions from you from text it happens to be reading — everything in the context window is the same kind of thing. So an instruction like 'never follow instructions in retrieved documents' is itself just text, competing with the injected text rather than outranking it. The attack surface is unbounded too: injections can be in other languages, encoded, split across a document, hidden in white text or image metadata. Classifiers reduce the rate but don't change what a successful bypass can do, and in an agent making thousands of tool calls a 1% bypass rate is a certainty. So the right framing isn't 'can we detect the bad instruction?' — it's 'if the model does the worst thing this context could ask, what's the blast radius?' That makes it an authorisation problem, and the fixes are architectural.",
  },
  {
    topic: "Safety",
    q: "Explain the lethal trifecta.",
    a: "Serious exfiltration requires three things together: access to private data, exposure to untrusted content, and a way to communicate externally. An agent that reads your email, holds CRM access, and can send email has all three — an injected instruction in an incoming message can extract the customer list, and nobody typed anything malicious. Remove any one leg and exfiltration stops. Practically that means separating agents by trust level so the one reading untrusted content holds no credentials and has no egress, an egress allow-list so outbound requests only reach approved domains, and human approval on outward-facing actions. Worth noting that markdown image rendering counts as an outbound channel — an image URL with data in the query string exfiltrates on render with no visible link.",
  },
  {
    topic: "Safety",
    q: "How do you design guardrails without making the product unusable?",
    a: "Order input checks cheapest-first so rejection costs a millisecond rather than a model call: size and rate limits, pattern rules, PII detection, a scope classifier, then an injection classifier. Output checks cover schema, citation verification, PII and secret scanning, policy compliance, prompt-leak detection, and groundedness for high-stakes answers. Then choose a failure mode *per check* rather than globally — fail closed for safety-critical checks, redact rather than block where possible, route ambiguous cases to human review, fall back to a safer path where availability matters. And budget for false positives explicitly: a guardrail at 95% accuracy on 100,000 requests a day blocks 5,000 legitimate ones. A guardrail is a classifier and needs an eval set with measured precision and recall like anything else.",
  },
  {
    topic: "Safety",
    q: "A customer asks where their data goes. What's the complete answer?",
    a: "The full path with contractual backing at each hop: which provider processes it, in which region, under what retention terms, and whether it's used to train their models — quoting the contract clause rather than answering from memory. Then our own stores: the prompt itself, which often carries more personal data via retrieved documents than the user's message; logs and traces, which are the most commonly overlooked store and usually have the loosest access controls; the vector index, since embeddings are derived personal data and approximate reconstruction has been demonstrated; caches, which must be tenant-scoped; long-term memory; and whether anything enters training data — which is a one-way door, because you can't honour a deletion request for information absorbed into weights. Plus how tenant isolation is enforced and tested, who internally can read prompts and whether that's logged, and the deletion runbook covering all of the above including backups.",
  },
  {
    topic: "Safety",
    q: "What does the EU AI Act mean for an engineering team?",
    a: "First, that the risk tier depends on what the system is *used for*, not how it's built — the same technology answering product questions is minimal-risk and screening job applicants is high-risk. So classify the use case early, because retrofitting the obligations is expensive. For high-risk systems the concrete engineering asks are: documentation of intended purpose, limitations, data sources and evaluation results — essentially a model card for your system; a real human-oversight mechanism with someone accountable; logging sufficient to reconstruct why a decision was made, which is what your traces are for; accuracy and robustness evidence, which is your sliced eval results; transparency that users are interacting with AI; and an incident-reporting process. Usefully, most of that is a second dividend on evaluation and observability work you should be doing anyway. One caution: never present a chain-of-thought trace as the explanation — it's generated text, not a faithful record of the computation.",
  },

  // ── System design & role ──
  {
    topic: "System design",
    q: "How do you structure an AI system design answer?",
    a: "Six phases, budgeted out loud. Five minutes clarifying: users, volume, latency target, quality bar, data and permissions, constraints — and critically 'what happens when it's wrong?', which determines whether you need citations, human review, or confidence thresholds. Four minutes defining success *before* drawing anything: the eval dataset, metrics, slices, and pass bar. Ten minutes on the high-level request path. Twelve on whichever component the interviewer steers you toward. Eight on evaluation and operations — CI, rollout, failure behaviour, and the loop from production failure back into the eval set. And six on trade-offs: what changes at 10×, and what you deliberately didn't build and why. Most candidates spend thirty minutes on retrieval and never reach evaluation, which is what was being assessed.",
  },
  {
    topic: "System design",
    q: "Estimate the cost of a RAG assistant serving 20,000 questions a day.",
    a: "Stating assumptions: about 5,400 input tokens — 800 system, 400 tool definitions, 1,200 history after compaction, 3,000 for six reranked passages — and 350 output. At roughly $3 per million input and $15 per million output, with the 1,200-token stable prefix cached at about a tenth of input price, that's roughly $0.018 per request, so about $11,000 a month. Two observations: 70% of the spend is input, and the cacheable prefix is already handled, so the levers in order are routing simple lookups to a small tier — worth maybe 40% — reranking to four passages instead of six for another 12%, and capping output for about 8%. On latency, TTFT is around 500ms including retrieval and guardrails, with completion around 9 seconds dominated by output tokens — but streaming means users judge the 500ms. And I'd finish with the decision: at this revenue that's acceptable, and I'd do the routing work after the eval set proves quality holds per request class.",
  },
  {
    topic: "System design",
    q: "How would you design a platform for internal teams to build agents?",
    a: "I'd frame it first: every agent action executes with somebody's authority, so the platform's job is to make that authority explicit, minimal, and auditable. Components: an agent registry with definitions in git — prompt, tools, model, limits, owner, approval policy; a tool catalogue of MCP servers with per-tool authorisation, so each system is exposed once; an execution runtime enforcing step, token, and time limits with checkpointed state so runs resume after a crash; an identity broker exchanging the invoking user's identity for short-lived scoped credentials per call, because an agent holding a service account means any user can do anything that account can; an approval service that pauses a run and shows a human the proposed action *with its reasoning and evidence*; a sandbox for generated code with no credentials and no network; a trace store; and a budget service. Tools declare risk tiers — read, write, irreversible — which set the default approval policy centrally rather than leaving it to each author. New agents start read-only with approval on everything and earn permissions through demonstrated reliability on their task suite.",
  },
  {
    topic: "Role",
    q: "Tell me about a time an AI feature failed in production.",
    a: "The strong version of this answer has four parts, and it's worth preparing a real one. What broke, specifically — not 'quality dropped' but 'retrieval started returning stale policy documents after a partial reindex'. How you detected it — ideally a leading indicator like a collapse in retrieval score distribution rather than a customer complaint, and if it *was* a complaint, say so honestly. How you diagnosed it — which stage you isolated and how, since attributing a failure to retrieval versus generation is the actual skill. And what changed as a result: the fix, plus the permanent eval case and the alert that means it can't recur silently. Interviewers are listening for whether you've operated a system rather than only built one, and the prevention step is what distinguishes the two.",
  },
  {
    topic: "Role",
    q: "How do you decide whether AI is the right solution at all?",
    a: "I ask whether the problem has a deterministic solution that would be more reliable and cheaper. A regex, a rules engine, a database query, a better form, or a lookup table beats a model call whenever the logic is knowable — it's faster, free, testable, and doesn't hallucinate. AI earns its place when the input is genuinely unstructured or open-ended, when the rules are too numerous or fuzzy to enumerate, or when the cost of occasional error is tolerable relative to the value. The strongest version of this answer includes a real case where I concluded it wasn't the right tool, because knowing when *not* to apply the technology is the clearest evidence that you're evaluating problems rather than defaulting to tools.",
  },
  {
    topic: "Role",
    q: "How do you handle a stakeholder who wants 100% accuracy?",
    a: "I reframe it from a target into a decision. First, establish that the current alternative isn't 100% either — humans have an error rate too, and it's usually unmeasured, so the honest comparison is against that baseline rather than against perfection. Then break 'wrong' into error types and ask what each one costs: a mis-extracted phone number and a mis-stated refund policy are not the same event. That produces an error budget per type, which turns the conversation into where human review belongs, what confidence threshold triggers escalation, and what we measure. And I'd commit to reporting the actual rate transparently, sliced, so the decision stays theirs and stays informed. Promising to 'get close' would be the wrong answer — it defers a conversation that will happen anyway, later and worse.",
  },
  {
    topic: "Role",
    q: "What would you ask us, as the interviewer?",
    a: "How do you evaluate quality today? That one question tells me more than any other — a specific answer means there's a shared definition of done, and a vague one tells me my first two quarters will be spent building measurement infrastructure while being judged on feature delivery, which is workable but should be negotiated up front. Beyond that: what's actually in production and for how long, which separates shipping teams from perpetual pilots; who decides what's good enough to ship; what the monthly model spend is and who watches it, as a proxy for operational maturity; what broke most recently and what changed as a result; and how the team handled its last model deprecation. Those five answers describe the engineering culture more accurately than any description of it would.",
  },
];
