import type { Module } from "./types";

export const prompting: Module = {
  id: "prompting",
  title: "Prompt & context engineering",
  blurb:
    "Writing instructions a model reliably follows, treating the context window as a budget, forcing output into a schema you can parse, and knowing when to let a model think.",
  accent: "teal",
  lessons: [
    {
      slug: "prompt-engineering-core",
      title: "Prompt engineering that survives production",
      summary:
        "The anatomy of a prompt, the handful of techniques that actually move quality, and the anti-patterns that quietly waste tokens.",
      minutes: 12,
      blocks: [
        { type: "p", text: "Prompt engineering got a reputation as folklore — magic words, pleading, threatening the model with fictional consequences. The reality is duller and more useful: **a good prompt is a specification.** It says what the task is, what the inputs mean, what the output must look like, and what to do at the edges. Most \"prompt engineering\" failures are specification failures." },
        { type: "diagram", name: "prompt-anatomy", caption: "The stable parts of a prompt go first — that ordering is also what makes prompt caching work." },
        { type: "h2", text: "The anatomy" },
        { type: "compare", caption: "Six components, in the order they should appear.", columns: ["Component", "Job", "Notes"], rows: [
          { label: "Role / system prompt", cells: ["Who the model is, and its standing rules", "Stable across requests — put it first so it can be cached"] },
          { label: "Task instruction", cells: ["Precisely what to do with this input", "One task per prompt; split compound tasks"] },
          { label: "Context / documents", cells: ["The material to work from", "Delimit clearly; say what to do if it's insufficient"] },
          { label: "Examples (few-shot)", cells: ["Demonstrate format and edge-case handling", "2–5 well-chosen beats 20 mediocre"] },
          { label: "Output contract", cells: ["Exact shape of the answer", "A schema or template, not a description of one"] },
          { label: "The input itself", cells: ["The actual user turn or record", "Last, so it's adjacent to generation"] },
        ]},
        { type: "code", lang: "python", caption: "A production-shaped prompt — note the delimiters, the contract, and the explicit escape hatch", code: `SYSTEM = """You are a claims analyst for a health insurer.
You only use information present in <documents>. You never infer coverage
that is not written down. If the documents do not answer the question, you
say so explicitly rather than guessing."""

USER = """<documents>
{documents}
</documents>

<question>
{question}
</question>

Answer using only the documents above.

Output format — return exactly this JSON and nothing else:
{{
  "answer": "<two sentences maximum>",
  "citations": ["<document id>", ...],
  "sufficient_evidence": true | false
}}

If sufficient_evidence is false, set answer to a one-sentence statement of
what is missing."""`},
        { type: "callout", kind: "key", text: "The three highest-leverage sentences in almost any prompt: **what the task is, what the output must look like, and what to do when the input doesn't support an answer.** Most production failures come from omitting the third." },
        { type: "h2", text: "Techniques that earn their tokens" },
        { type: "list", items: [
          "**Be specific about the output, not the effort.** \"Return 3 bullets, each under 15 words\" beats \"be concise\" every time. Constraints the model can check itself are constraints it follows.",
          "**Few-shot examples for format and edge cases.** Examples teach shape far more reliably than description. Choose them to cover the boundaries — the ambiguous case, the empty case, the multi-answer case.",
          "**Decompose compound tasks.** \"Classify, then extract, then summarise\" in one prompt produces three mediocre results. Three calls (or one call with explicit numbered steps) produce three good ones.",
          "**Give the model an out.** An explicit `\"insufficient_evidence\": true` path converts a hallucination into a handled state your code can route on.",
          "**Prefill the response** where the API supports it — starting the assistant turn with `{` makes JSON output dramatically more reliable.",
          "**Put the long document before the question.** With a long context, instructions placed after the material are followed more reliably — and it keeps the cacheable prefix intact.",
          "**Use delimiters** (`<documents>`, `###`) so the model can tell your instructions from user-supplied text. This is also your first, weakest line of defence against prompt injection.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Zero-shot** = asking with no examples. **Few-shot** = including a handful of input/output examples. **System prompt** = the standing instructions that frame the whole conversation. **Chain of thought (CoT)** = having the model reason step by step before answering. **Self-consistency** = sampling several answers and taking the majority. **Prefill** = starting the model's reply for it so it must continue in your format. **Prompt template** = a parameterised prompt with slots, versioned like code. **Delimiter** = a marker separating instructions from data." },
        { type: "h2", text: "Anti-patterns" },
        { type: "compare", caption: "Common habits, and what to do instead.", columns: ["Anti-pattern", "Why it fails", "Instead"], rows: [
          { label: "Politeness and pleading (\"please, this is very important\")", cells: ["Adds tokens, moves nothing measurable", "Spend those tokens on an example"] },
          { label: "\"Do not hallucinate\"", cells: ["The model has no internal truth signal to consult", "Supply sources and require citations"] },
          { label: "A 2,000-word system prompt of accumulated patches", cells: ["Instructions conflict; later ones dilute earlier ones", "Rewrite periodically; delete rules your evals don't defend"] },
          { label: "Describing the JSON in prose", cells: ["Ambiguous, and it drifts", "Give a literal schema, or use structured-output mode"] },
          { label: "One prompt doing four jobs", cells: ["Quality degrades on all four", "Split into steps or calls"] },
          { label: "Tuning by vibes in a playground", cells: ["You trade one failure mode for another and can't tell", "Score every change against a golden set"] },
        ]},
        { type: "callout", kind: "warn", text: "The negative-instruction trap: \"never mention pricing\" puts pricing in the context and makes it more salient, not less. Prefer positive framing — state what the model *should* do — and enforce prohibitions with an output guardrail rather than hoping the instruction holds." },
        { type: "h2", text: "Prompts are code" },
        { type: "steps", items: [
          { title: "Store them in the repo", text: "Template files or typed constants, code-reviewed like anything else. Never a hand-edited database row." },
          { title: "Version them explicitly", text: "Every trace records which prompt version produced it, or you can't attribute a regression." },
          { title: "Test them against a golden set", text: "A prompt change that isn't scored isn't an improvement — it's a hypothesis." },
          { title: "Roll them out like a deploy", text: "Canary a percentage of traffic, compare scores and cost, keep the previous version one flag away." },
          { title: "Re-run them on every model change", text: "Prompts are tuned to a model's quirks. A model upgrade invalidates that tuning." },
        ]},
        { type: "quote", text: "If you can't tell whether your new prompt is better, you don't have a prompt problem — you have an evaluation problem.", cite: "The rule that ends most prompt debates" },
      ],
      takeaways: [
        "A prompt is a specification: task, input meaning, output contract, and edge-case behaviour.",
        "Order matters — stable role and instructions first (also cacheable), the input last.",
        "The techniques that pay: specific output constraints, well-chosen few-shot examples, task decomposition, an explicit 'insufficient evidence' path, prefill, and delimiters.",
        "Pleading, 'don't hallucinate', prose schemas, and accumulated patch-prompts are wasted tokens.",
        "Prompts are code: versioned, reviewed, scored against a golden set, canaried, and re-tested on every model change.",
      ],
      flashcards: [
        { front: "Why give the model an explicit 'insufficient evidence' output?", back: "It converts a silent hallucination into a structured state your application can detect and route — to a fallback, a human, or a clarifying question." },
        { front: "Why does 'do not hallucinate' not work?", back: "The model has no internal truth signal to check against; it can't distinguish a fact it knows from a plausible continuation. Grounding in retrieved sources plus citation validation is the actual mechanism." },
        { front: "Where should few-shot examples come from?", back: "Real traffic, chosen to cover boundaries — ambiguous inputs, empty inputs, multi-answer cases. Two to five sharp examples beat twenty generic ones." },
        { front: "Why put the long document before the question?", back: "Instructions placed after long material are followed more reliably, and it keeps the stable prefix intact so prompt caching can hit." },
      ],
      quiz: [
        { q: "Your extraction prompt returns JSON with occasional prose wrapped around it. Best fix?", options: ["Add 'ONLY JSON' in capitals", "Use structured-output/tool mode, or prefill the reply with '{'", "Raise the temperature", "Add more examples of prose to avoid"], answer: 1, explain: "Constrained decoding or a prefilled opening brace makes the malformed output mechanically difficult, instead of relying on instruction-following. Shouting is not a constraint." },
        { q: "A system prompt has grown to 2,000 words of patches added after each bug. What should you do?", options: ["Keep appending — more rules means more control", "Rewrite it from scratch and delete rules no eval case defends", "Move it into the user message", "Split it across two model calls"], answer: 1, explain: "Accumulated patches conflict and dilute each other. A rewrite scored against the golden set usually improves quality and cuts cost at the same time." },
        { q: "Which change most reliably improves output format adherence?", options: ["Saying 'be consistent'", "Providing 2–5 examples of the exact desired output", "Increasing max_tokens", "Adding 'you are an expert' to the system prompt"], answer: 1, explain: "Examples demonstrate the shape directly. Persona statements and effort adjectives are largely decorative for format compliance." },
      ],
    },
    {
      slug: "context-engineering",
      title: "Context engineering: the window is a budget",
      summary:
        "The discipline that replaced prompt engineering as the headline skill — deciding what occupies the context window, in what form, and when to throw it away.",
      minutes: 12,
      blocks: [
        { type: "p", text: "**Context engineering** is the practice of deliberately curating everything the model sees on each call: system prompt, tool definitions, conversation history, retrieved documents, prior tool results, and memory. It became a named discipline once context windows got big enough that the constraint stopped being *can I fit this?* and became **should I?**" },
        { type: "callout", kind: "key", text: "The core insight: **context is a limited, degrading resource, not a free container.** Every token you add costs money, adds prefill latency, and competes for the model's attention with the tokens that actually matter. More context frequently makes output *worse*." },
        { type: "diagram", name: "context-budget", caption: "One call's window, allocated deliberately. Every block is a decision somebody should be able to justify." },
        { type: "h2", text: "Where the window actually goes" },
        { type: "compare", caption: "A realistic allocation for a production assistant.", columns: ["Block", "Typical share", "How to shrink it"], rows: [
          { label: "System prompt & policies", cells: ["500–2,000 tokens", "Rewrite periodically; cache the prefix"] },
          { label: "Tool definitions", cells: ["100–400 tokens per tool", "Expose only the tools this request could need"] },
          { label: "Conversation history", cells: ["Grows unboundedly", "Summarise older turns; keep recent turns verbatim"] },
          { label: "Retrieved documents", cells: ["Usually the largest block", "Rerank hard and keep the top 3–10, not the top 50"] },
          { label: "Prior tool results", cells: ["Explodes in agent loops", "Store to a file/DB and pass a reference, not the payload"] },
          { label: "Response headroom", cells: ["Whatever's left", "Reserve it explicitly — don't discover it by truncation"] },
        ]},
        { type: "h2", text: "The four operations" },
        { type: "list", ordered: true, items: [
          "**Select** — retrieve only what this request needs, just in time, rather than pre-loading everything that might be relevant.",
          "**Compress** — summarise, deduplicate, and strip boilerplate. A 40-page PDF's relevant content is often 300 tokens.",
          "**Order** — put stable, cacheable material first and the decisive material near the end, where attention is strongest.",
          "**Evict** — drop what's no longer load-bearing. Old tool outputs, superseded drafts, and resolved sub-tasks are dead weight.",
        ]},
        { type: "h2", text: "Managing a long conversation" },
        { type: "p", text: "History is the block that grows without anybody deciding to grow it. Four strategies, in increasing sophistication:" },
        { type: "compare", caption: "Pick by how much the early conversation matters.", columns: ["Strategy", "How it works", "Best for"], rows: [
          { label: "Sliding window", cells: ["Keep the last N turns, drop the rest", "Short, self-contained sessions"] },
          { label: "Summarise-and-compact", cells: ["Replace older turns with a running summary when a threshold is hit", "Long assistant chats — the standard answer"] },
          { label: "Structured state", cells: ["Extract decisions/entities/constraints into a compact object carried forward", "Agents and workflows where facts must not be lost"] },
          { label: "Retrieved history", cells: ["Embed past turns and retrieve only the relevant ones", "Very long-lived relationships, cross-session memory"] },
        ]},
        { type: "code", lang: "python", caption: "Compaction with a reserved answer budget", code: `MAX_CONTEXT   = 200_000
RESERVE_REPLY = 8_000          # never let the answer get truncated
COMPACT_AT    = 0.7            # compact before you're forced to

def assemble(system, tools, history, retrieved, question, count):
    budget = MAX_CONTEXT - RESERVE_REPLY - count(system) - count(tools)

    if count(history) > budget * COMPACT_AT:
        recent = history[-6:]                     # keep the live thread verbatim
        history = [summarise(history[:-6])] + recent

    # spend what's left on retrieval, best-first, and stop at the line
    kept, used = [], count(history) + count(question)
    for chunk in retrieved:                        # already reranked
        if used + count(chunk) > budget:
            break
        kept.append(chunk)
        used += count(chunk)

    return build(system, tools, history, kept, question)`},
        { type: "callout", kind: "warn", text: "Compaction is lossy, and the loss is silent. A summary that drops a constraint the user stated 40 turns ago produces an answer that's confidently wrong with no visible cause. Keep hard constraints — IDs, dates, explicit user rules — in a structured state object that is never summarised." },
        { type: "h2", text: "Tool definitions are context too" },
        { type: "p", text: "Every tool schema you attach is tokens on every call, and each one is another option the model must weigh. Twenty tools is a measurable accuracy problem: selection errors climb and the window shrinks before you've retrieved anything." },
        { type: "list", items: [
          "**Attach tools conditionally** by request class rather than exposing the whole catalogue every time.",
          "**Write descriptions for the model, not for docs** — one clear sentence on when to use it, and critically, when *not* to.",
          "**Return small results.** A tool that returns 50KB of JSON has just eaten your context. Return the summary plus a reference.",
          "**Consolidate near-duplicates.** Three tools that all search slightly differently will be confused; one tool with a mode parameter will not.",
        ]},
        { type: "h2", text: "Prompt caching: the cheapest optimisation available" },
        { type: "p", text: "Providers can cache the processed form of a stable prompt prefix, so repeated calls skip re-processing it — typically a large cut in input cost and a substantial drop in TTFT. It works on an **exact prefix match**, which dictates your layout." },
        { type: "steps", items: [
          { title: "Order by stability", text: "System prompt → tool definitions → long static documents → conversation history → the new user turn. Most stable first, always." },
          { title: "Never put a timestamp or request ID at the top", text: "One varying token at the front invalidates the entire cached prefix. This is the classic own goal." },
          { title: "Mark the cache breakpoint after the stable block", text: "Where the API exposes an explicit breakpoint, place it at the end of the material that repeats across requests." },
          { title: "Measure the hit rate", text: "Log cached vs uncached input tokens per call. A cache hit rate you never look at is a cache hit rate that silently drops to zero." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Context engineering** = curating what occupies the context window. **Compaction** = replacing older conversation with a summary to reclaim space. **Just-in-time retrieval** = fetching context at the moment it's needed rather than pre-loading. **Prompt caching** = provider-side reuse of a processed prompt prefix, billed at a large discount. **Context rot** = quality degradation as a window fills with stale or irrelevant material. **Working memory** = the structured state an agent carries between steps." },
        { type: "callout", kind: "tip", text: "A useful test in review: point at any block in the assembled context and ask **\"what would break if we deleted this?\"** If nobody can answer, delete it. Applied honestly, this routinely halves prompt size with no quality loss — and makes everything faster and cheaper." },
      ],
      takeaways: [
        "Context is a limited, degrading resource — more of it often lowers quality as well as raising cost and latency.",
        "The four operations are select, compress, order, and evict.",
        "History grows silently; compact it with a summary while keeping hard constraints in a structured state object that is never summarised.",
        "Tool definitions consume context and add selection errors — attach them conditionally and keep results small.",
        "Prompt caching needs a stable prefix: order by stability, never lead with a timestamp, and monitor the hit rate.",
      ],
      flashcards: [
        { front: "What is context engineering?", back: "Deliberately deciding what occupies the context window — system prompt, tools, history, retrieval, memory — and in what form and order. The successor discipline to prompt engineering." },
        { front: "Name the four context operations", back: "Select (retrieve just in time), compress (summarise/dedupe), order (stable first, decisive last), evict (drop what's no longer load-bearing)." },
        { front: "Why does a timestamp at the top of a prompt cost money?", back: "Prompt caching matches on an exact prefix. One varying token at the front invalidates the whole cached prefix, so every call pays full input price and full prefill latency." },
        { front: "What's the danger of conversation compaction?", back: "It's lossy and silent — a summary can drop a constraint stated long ago, producing confidently wrong answers with no visible cause. Keep hard constraints in structured state." },
        { front: "Why is exposing 20 tools on every call a problem?", back: "Each schema costs tokens on every request, and tool-selection accuracy degrades as options multiply. Attach tools conditionally by request class." },
      ],
      quiz: [
        { q: "Your agent's cost per session triples after step 10. Most likely cause?", options: ["The model got slower", "Accumulated tool results and history in every subsequent call", "Temperature drift", "The vector store is misconfigured"], answer: 1, explain: "Agent context grows monotonically — each step re-sends all prior results. Store large payloads externally and pass references, and compact aggressively between steps." },
        { q: "Which prompt layout maximises cache hits?", options: ["Request ID → system prompt → docs → question", "System prompt → tools → static docs → history → question", "Question first, then everything else", "Randomised to avoid staleness"], answer: 1, explain: "Caching matches an exact prefix, so order strictly from most stable to least. Anything varying — IDs, timestamps — must come after the cacheable block." },
        { q: "Retrieval returns 50 relevant-looking chunks and quality drops. Best response?", options: ["Send all 50 — recall matters most", "Rerank and keep the top 3–10", "Increase the context window", "Lower the temperature"], answer: 1, explain: "Irrelevant passages act as distractors and dilute attention. Precision in the window beats recall in the index — rerank hard and keep few." },
      ],
    },
    {
      slug: "structured-outputs",
      title: "Structured outputs you can actually parse",
      summary:
        "JSON Schema, tool-call mode, constrained decoding, and the validate-and-repair loop that turns a text generator into a dependable API.",
      minutes: 10,
      blocks: [
        { type: "p", text: "The moment an LLM feeds another system rather than a human, free text becomes a liability. You need output that parses **every time** — and that is an engineering problem with a well-understood solution, not a prompting art." },
        { type: "diagram", name: "structured-output-loop", caption: "Constrain first, validate always, repair once, then fail loudly — never parse hopefully." },
        { type: "h2", text: "Four levels of enforcement" },
        { type: "compare", caption: "Use the strongest one your provider supports.", columns: ["Level", "Mechanism", "Reliability"], rows: [
          { label: "1. Ask nicely", cells: ["\"Respond in JSON\"", "Fails on edge cases; will emit prose or fences"] },
          { label: "2. Show the schema + prefill", cells: ["Literal schema in the prompt, reply prefilled with `{`", "Good; still not guaranteed"] },
          { label: "3. Tool / function calling", cells: ["Declare a tool whose parameters are your schema", "Strong — the API returns typed arguments"] },
          { label: "4. Constrained decoding", cells: ["Sampler masks tokens that would break the grammar", "Structurally guaranteed to parse"] },
        ]},
        { type: "callout", kind: "key", text: "**Structured output mode and tool calling are the same machinery.** Declaring a schema for the answer and declaring a tool the model must call are two interfaces to constrained decoding. Reach for them before you write a single regex over model output." },
        { type: "code", lang: "python", caption: "Schema-first extraction with validation and a single repair attempt", code: `from pydantic import BaseModel, Field, ValidationError
from typing import Literal

class Invoice(BaseModel):
    vendor: str
    invoice_number: str
    total_cents: int = Field(ge=0)
    currency: Literal["USD", "EUR", "GBP"]
    confidence: float = Field(ge=0, le=1)

TOOL = {
    "name": "record_invoice",
    "description": "Record the fields extracted from one invoice.",
    "input_schema": Invoice.model_json_schema(),
}

def extract(doc: str, attempt: int = 0) -> Invoice:
    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        tools=[TOOL],
        tool_choice={"type": "tool", "name": "record_invoice"},  # force it
        messages=[{"role": "user", "content": doc}],
    )
    block = next(b for b in resp.content if b.type == "tool_use")
    try:
        return Invoice(**block.input)
    except ValidationError as e:
        if attempt >= 1:
            raise                      # fail loudly; do not guess
        return extract(f"{doc}\\n\\nPrevious attempt failed: {e}", attempt + 1)`},
        { type: "h2", text: "Designing schemas a model can hit" },
        { type: "list", items: [
          "**Flat beats nested.** Deeply nested objects invite structural mistakes; flatten where you reasonably can.",
          "**Enums over free strings.** `\"status\": \"approved\" | \"rejected\" | \"needs_review\"` is checkable; a free-text status is not.",
          "**Descriptions are prompt real estate.** The `description` on each field is read by the model — use it to disambiguate, e.g. *\"total in cents, integer, no currency symbol\"*.",
          "**Include an escape hatch field.** `\"extraction_failed\": bool` or `\"needs_review\": bool` beats forcing a confident answer out of a blurry scan.",
          "**Be wary of self-reported confidence.** Models are poorly calibrated. It's a weak triage signal, not a probability — validate it against outcomes before you trust a threshold.",
          "**Ask for evidence, not just values.** A `source_span` or quoted snippet per field makes verification mechanical and catches invention immediately.",
        ]},
        { type: "callout", kind: "warn", text: "Constrained decoding guarantees the output *parses*, not that it's *correct*. A grammar cannot tell you the invoice total was misread. Schema validation is a type check; you still need semantic validation — totals that reconcile, IDs that exist, dates within range." },
        { type: "h2", text: "The repair loop, done properly" },
        { type: "steps", items: [
          { title: "Validate against the schema", text: "Parse into a typed model. Never hand raw text downstream." },
          { title: "Validate semantically", text: "Cross-field arithmetic, referential checks against your database, plausible ranges." },
          { title: "Repair once, with the error text", text: "Feed the validation error back and retry. A single repair fixes the large majority of failures; a loop of repairs burns money on a request that isn't going to work." },
          { title: "Fail loudly and route", text: "On second failure, raise — to a human queue, a fallback model, or a null result. Silent partial parsing is how bad data enters your warehouse." },
          { title: "Log every failure with its input", text: "Repair-rate by document type is one of the most actionable quality metrics you can have." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**JSON Schema** = a standard vocabulary for describing the shape of JSON, used by every structured-output API. **Constrained decoding** (a.k.a. guided/structured generation) = masking tokens at sampling time so only grammar-valid continuations are possible. **Tool calling / function calling** = the model emitting a structured request to invoke a named function with typed arguments. **`tool_choice`** = the parameter forcing the model to call a specific tool. **Pydantic** = the Python library most teams use to define and validate these schemas." },
        { type: "h2", text: "When structure hurts" },
        { type: "p", text: "Forcing rigid structure too early can suppress quality on genuinely hard tasks — the model spends its capacity satisfying the grammar rather than thinking. If a task needs reasoning, let it reason in prose first and structure the result second: either a `reasoning` field before the answer fields (order matters — the model writes them in sequence), or a second cheap call that converts the prose into the schema." },
      ],
      takeaways: [
        "Four levels of enforcement — ask, schema+prefill, tool calling, constrained decoding — use the strongest available.",
        "Structured output and tool calling are the same mechanism; both beat parsing free text.",
        "Design schemas the model can hit: flat, enums, meaningful field descriptions, an escape hatch, and evidence fields.",
        "Constrained decoding guarantees parsing, not correctness — semantic validation is a separate, necessary step.",
        "Repair once with the error message, then fail loudly and route; log repair rates as a quality metric.",
      ],
      flashcards: [
        { front: "What does constrained decoding actually do?", back: "At sampling time it masks any token that would make the output violate the target grammar, so the result is structurally guaranteed to parse. It says nothing about semantic correctness." },
        { front: "How many times should you retry a schema-validation failure?", back: "Once, feeding back the validation error. Beyond that you're paying repeatedly for a request that won't succeed — fail loudly and route to a human, a fallback, or a null result." },
        { front: "Why put a `reasoning` field before the answer fields?", back: "The model generates fields in order, so a reasoning field earlier lets it think before committing to values. Reversing the order gives you post-hoc rationalisation of an already-chosen answer." },
        { front: "Why ask for a source span alongside each extracted value?", back: "It makes verification mechanical — you can check the quoted text actually appears in the source — and it exposes invented values immediately." },
      ],
      quiz: [
        { q: "You need a guarantee that output parses as JSON. What do you use?", options: ["A very firm system prompt", "Constrained decoding or forced tool calling", "A regex over the response", "Temperature 0"], answer: 1, explain: "Only grammar-level constraint is a guarantee. Prompting, regex salvage, and low temperature all reduce failures without eliminating them." },
        { q: "Extraction returns a valid schema but the total is wrong on scanned invoices. What's missing?", options: ["A stricter JSON schema", "Semantic validation — reconcile line items against the total", "A higher temperature", "More few-shot examples of JSON"], answer: 1, explain: "The schema is a type check. Cross-field arithmetic, referential checks, and range checks are what catch a correctly-shaped wrong answer." },
        { q: "A hard reasoning task produces worse answers after you enforce a strict schema. Best fix?", options: ["Remove all structure", "Let it reason in a text field first, then structure the result", "Increase max_tokens only", "Switch to a smaller model"], answer: 1, explain: "Rigid structure imposed too early competes with reasoning. Reason first, structure second — either as an earlier field or a cheap follow-up conversion call." },
      ],
    },
    {
      slug: "reasoning-and-test-time-compute",
      title: "Reasoning models & test-time compute",
      summary:
        "When letting a model think longer actually helps, how the effort dial changes your cost model, and how prompting differs for reasoning models.",
      minutes: 10,
      blocks: [
        { type: "p", text: "For most of the LLM era, better answers came from bigger models trained longer. **Test-time compute** added a second lever: let the model generate reasoning before answering, and quality on hard problems climbs with the number of thinking tokens. That turns \"how good should this answer be?\" into a per-request parameter." },
        { type: "diagram", name: "reasoning-dial", caption: "Thinking tokens buy accuracy on hard tasks and nothing on easy ones — the curve is the whole design decision." },
        { type: "h2", text: "Two ways to get reasoning" },
        { type: "compare", caption: "Prompted vs native.", columns: ["Approach", "What it is", "Trade-off"], rows: [
          { label: "Prompted chain of thought", cells: ["\"Think step by step\" / a `reasoning` field before the answer", "Works on any model; you pay for and see every reasoning token"] },
          { label: "Native reasoning / extended thinking", cells: ["Model-side reasoning enabled by an API parameter, often with a token or effort budget", "Trained for it, much stronger; thinking tokens are billed and add latency"] },
        ]},
        { type: "callout", kind: "key", text: "The rule: **reasoning helps when there are intermediate steps that can be wrong.** Multi-step maths, planning, debugging, constraint satisfaction, ambiguous requirements. It does nothing for lookup, extraction, classification, or formatting — there, it is pure cost and latency." },
        { type: "h2", text: "The cost model changes shape" },
        { type: "p", text: "Thinking tokens are output tokens: billed at output rates and generated sequentially, so they hit both cost *and* latency. A request with 4,000 thinking tokens before a 200-token answer costs roughly twenty times the answer alone and takes correspondingly longer." },
        { type: "list", items: [
          "**Budget the thinking, per request class.** Low effort for routine work, high effort for the genuinely hard minority.",
          "**Reasoning breaks streaming UX.** The user watches nothing happen for several seconds. Show an explicit \"thinking\" state, or route latency-sensitive paths away from it.",
          "**Don't pay twice.** If a cheap model plus retrieval already answers correctly, reasoning adds cost and no accuracy.",
          "**Measure per-slice.** Reasoning often lifts the hardest 10% of your eval set and moves the mean barely at all — which is exactly the case where the average metric misleads you.",
        ]},
        { type: "h2", text: "Prompting reasoning models differently" },
        { type: "compare", caption: "Habits from standard models that backfire.", columns: ["With a standard model", "With a reasoning model"], rows: [
          { label: "\"Think step by step\"", cells: ["Redundant — it already does, and the instruction can interfere"] },
          { label: "Many few-shot examples", cells: ["Often unnecessary; a clear task statement usually works better"] },
          { label: "Decompose the task for it", cells: ["Give it the whole problem and the constraints — decomposition is what it's for"] },
          { label: "Prescribe the method", cells: ["State the goal and the success criteria; over-prescribing narrows its search"] },
          { label: "Tight output format from the start", cells: ["Let it reason, then constrain the final answer block"] },
        ]},
        { type: "callout", kind: "warn", text: "**Reasoning traces are not faithful explanations.** The visible chain is generated text, not a log of the computation that produced the answer — a model can reason toward one conclusion and state another. Never treat a reasoning trace as an audit trail or a compliance artefact." },
        { type: "h2", text: "Cheaper alternatives worth trying first" },
        { type: "list", items: [
          "**Self-consistency** — sample the same prompt 3–5 times at moderate temperature and take the majority answer. Costs N× but parallelises, so latency stays flat.",
          "**Decomposition into separate calls** — often beats one heroic reasoning call, and each step is independently testable and debuggable.",
          "**Give it a tool** — a calculator, a SQL query, or a code interpreter beats reasoning about arithmetic every time. Offload, don't think harder.",
          "**Better retrieval** — a surprising share of \"hard reasoning\" failures are really missing-context failures wearing a disguise.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Test-time compute** = extra compute spent at inference to improve an answer. **Extended thinking / reasoning tokens** = model-generated reasoning before the visible answer, billed as output. **Effort or budget parameter** = the API dial controlling how much thinking is allowed. **Self-consistency** = sampling multiple answers and taking the majority. **Faithfulness** = whether a stated rationale reflects the actual computation — for LLM reasoning traces, often not." },
        { type: "steps", items: [
          { title: "Split traffic by difficulty", text: "Classify requests — a cheap classifier or a rule on request type is enough to start." },
          { title: "Set an effort level per class", text: "Off for extraction and lookup, low for routine drafting, high for planning and multi-step analysis." },
          { title: "Evaluate per class, not overall", text: "Prove that the class you spend on actually gains, and the class you don't spend on doesn't lose." },
          { title: "Cap and monitor", text: "Set a hard thinking-token ceiling, alert on p95 latency, and track cost-per-request by class." },
        ]},
      ],
      takeaways: [
        "Test-time compute converts answer quality into a per-request dial you set deliberately.",
        "Reasoning helps where intermediate steps can be wrong; it's pure overhead for lookup, extraction, and classification.",
        "Thinking tokens bill at output rates and generate sequentially — they hit cost and latency together.",
        "Reasoning models want the whole problem and clear success criteria, not step-by-step hand-holding or heavy few-shot.",
        "Reasoning traces are generated text, not faithful explanations — never use them as an audit trail.",
      ],
      flashcards: [
        { front: "When does extended thinking pay for itself?", back: "When the task has intermediate steps that can be wrong — multi-step maths, planning, debugging, constraint satisfaction. Never for lookup, extraction, classification, or formatting." },
        { front: "Why does reasoning hurt latency more than input length does?", back: "Thinking tokens are output tokens: generated sequentially, one at a time. Thousands of them add seconds before the user sees any answer at all." },
        { front: "What is self-consistency?", back: "Sampling the same prompt several times at moderate temperature and taking the majority answer. Costs N× but the calls parallelise, so wall-clock latency stays roughly flat." },
        { front: "Can you show a reasoning trace to an auditor as an explanation?", back: "No. The trace is generated text, not a log of the computation — it can diverge from the actual basis of the answer. It's a debugging aid, not an audit artefact." },
      ],
      quiz: [
        { q: "Which task is the worst use of a high thinking budget?", options: ["Planning a multi-service migration", "Extracting 12 fields from a purchase order", "Debugging a failing distributed test", "Solving a scheduling constraint problem"], answer: 1, explain: "Field extraction has no intermediate reasoning steps to get wrong. Thinking tokens there are pure cost and latency with no accuracy gain." },
        { q: "A model reliably makes arithmetic errors in financial summaries. Best fix?", options: ["Enable maximum thinking budget", "Give it a calculator or code-execution tool", "Add 'be careful with maths' to the prompt", "Sample 10 times and average"], answer: 1, explain: "Offload deterministic computation to a deterministic tool. Reasoning about arithmetic is strictly worse than executing it." },
        { q: "You enable reasoning globally and mean eval score barely moves, but cost triples. What likely happened?", options: ["Reasoning doesn't work", "It lifted only the hardest slice, which is a small share of the set", "The eval set is broken", "Temperature was too low"], answer: 1, explain: "Reasoning concentrates its gains on hard cases. The right move is per-slice evaluation and routing effort only to the class that benefits." },
      ],
    },
  ],
};
