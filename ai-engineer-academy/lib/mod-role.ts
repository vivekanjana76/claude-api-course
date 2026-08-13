import type { Module } from "./types";

export const role: Module = {
  id: "role",
  title: "The AI Engineer interview",
  blurb:
    "What the job is day to day, how the loop is structured stage by stage, how to prepare the coding round and take-home, the keywords 2026 job descriptions are built from, and how to handle the behavioural round and the offer.",
  accent: "rose",
  lessons: [
    {
      slug: "the-job-and-the-loop",
      title: "The job, and the interview loop",
      summary:
        "What an AI Engineer actually does in a week, how companies structure the hiring loop, and what each stage is really assessing.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Before optimising for the interview, it's worth knowing what you're interviewing for — partly because it makes your answers concrete, and partly because \"AI Engineer\" covers three fairly different jobs depending on the company." },
        { type: "diagram", name: "skill-map", caption: "The same title, three centres of gravity. Read the job description for which one you're applying to." },
        { type: "compare", caption: "Three flavours of the role.", columns: ["Flavour", "Day to day", "Interview emphasis"], rows: [
          { label: "Product AI Engineer", cells: ["Ships user-facing AI features: prompts, RAG, agents, evals, iteration with product", "System design, evaluation, product judgment"] },
          { label: "Platform / Infra AI Engineer", cells: ["Builds the gateway, serving, tooling, and evaluation infrastructure other teams use", "Distributed systems, serving internals, cost and reliability"] },
          { label: "Applied / Research-adjacent", cells: ["Fine-tuning, distillation, custom evals, model adaptation", "ML fundamentals, training pipelines, experimental rigour"] },
        ]},
        { type: "h2", text: "A realistic week" },
        { type: "list", items: [
          "**Reading traces.** A meaningful share of the job is opening failures and working out which stage broke. This is the actual work, not a distraction from it.",
          "**Adjusting context assembly.** Retrieval tuning, prompt edits, chunking changes — measured, not vibed.",
          "**Extending the eval set.** Turning this week's failures into permanent test cases.",
          "**Cost and latency work.** Someone always wants it cheaper or faster, and there's usually 30% available.",
          "**Talking to the people who use it.** Domain experts tell you what \"wrong\" means in their world; nothing substitutes for that.",
          "**Occasionally, something new** — a new model, a new capability, a rewrite of a component that has stopped paying its way.",
        ]},
        { type: "callout", kind: "key", text: "The realistic split: roughly **60% ordinary software engineering** (APIs, data pipelines, deployment, debugging), **30% evaluation and measurement**, and **10% prompting and model work**. Candidates who expect the inverse are consistently surprised — and interviewers know it, which is why the loop looks the way it does." },
        { type: "diagram", name: "interview-loop", caption: "Five stages, each assessing something different. Prepare for them separately." },
        { type: "h2", text: "The stages" },
        { type: "compare", caption: "What each stage is actually testing.", columns: ["Stage", "Format", "Really assessing"], rows: [
          { label: "Recruiter screen", cells: ["20–30 min", "Whether your experience matches the flavour of the role, and your motivation"] },
          { label: "Technical screen", cells: ["45–60 min, coding or discussion", "Whether you've built something real, and can talk about it precisely"] },
          { label: "Take-home or live build", cells: ["2–4 hours, sometimes a live pairing session", "Engineering judgment, evaluation instinct, and whether you scope sensibly"] },
          { label: "AI system design", cells: ["45–60 min", "Architecture, evaluation, cost, failure handling, trade-offs"] },
          { label: "Behavioural / hiring manager", cells: ["45 min", "Ownership, collaboration, how you handle ambiguity and failure"] },
        ]},
        { type: "h2", text: "What gets people rejected" },
        { type: "compare", caption: "The recurring rejection reasons, from feedback.", columns: ["Reason", "The fix"], rows: [
          { label: "No answer to \"how would you know it's good?\"", cells: ["Have a dataset, metric, threshold, and failure mode for every project you describe"] },
          { label: "Framework knowledge without mechanism", cells: ["Be able to write the agent loop and describe the RAG path without naming a library"] },
          { label: "No cost or latency awareness", cells: ["Know your numbers: tokens, cost per request, p95 latency"] },
          { label: "Over-engineering in design", cells: ["Start simple; add complexity only with a named failure it fixes"] },
          { label: "Can't describe a failure", cells: ["Prepare two real ones with what you measured and what you changed"] },
          { label: "Vague project ownership", cells: ["Be precise about what *you* built versus what the team built"] },
        ]},
        { type: "callout", kind: "tip", text: "**The single highest-leverage preparation is one real project you can discuss in depth for twenty minutes** — what it does, why each decision was made, what broke, how you measured it, what it cost, and what you'd do differently. That one artefact answers most questions in most stages, and it's far more persuasive than breadth." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Loop** = the full set of interview stages. **Technical screen** = the first substantive technical conversation. **Take-home** = an offline exercise. **Levelling** = deciding which seniority band an offer sits in. **Hiring manager round** = usually behavioural plus team fit. **Bar raiser / cross-functional interviewer** = someone outside the team checking consistency of standards." },
      ],
      takeaways: [
        "'AI Engineer' covers product, platform, and applied flavours — read the JD to know which loop you're preparing for.",
        "The real split is ~60% software engineering, ~30% evaluation, ~10% prompting and model work.",
        "Five stages assess different things: motivation, real experience, engineering judgment, design, and collaboration.",
        "Rejections cluster around missing evaluation answers, framework-deep/mechanism-shallow knowledge, no cost awareness, and over-engineering.",
        "One project you can discuss in depth for twenty minutes is the highest-leverage preparation available.",
      ],
      flashcards: [
        { front: "What's the realistic time split in an AI Engineer's week?", back: "Roughly 60% ordinary software engineering, 30% evaluation and measurement, 10% prompting and model work. Candidates expecting the inverse are consistently surprised." },
        { front: "What's the most common rejection reason?", back: "No credible answer to 'how would you know if this is good?' — no dataset, metric, threshold, or named failure mode for the projects being described." },
        { front: "What are the three flavours of the AI Engineer role?", back: "Product (user-facing features, evals, product judgment), platform/infra (gateway, serving, tooling), and applied/research-adjacent (fine-tuning, distillation, model adaptation)." },
        { front: "What's the highest-leverage interview preparation?", back: "One real project you can discuss in depth for twenty minutes — decisions, failures, measurements, costs, and what you'd change. It answers most questions in most stages." },
      ],
      quiz: [
        { q: "Which best describes the AI Engineer day-to-day?", options: ["Mostly prompt writing", "Mostly software engineering, with substantial evaluation work", "Mostly training models", "Mostly research papers"], answer: 1, explain: "The model is rented; the job is the system around it — pipelines, APIs, deployment, debugging — plus the measurement discipline that makes it improve." },
        { q: "You describe a RAG project. What will the interviewer almost certainly ask?", options: ["Which vector database", "How you evaluated it and what failed", "Which cloud provider", "How many lines of code"], answer: 1, explain: "Evaluation and failure analysis are the strongest seniority signals. Tool choices are trivia; measurement is the discipline." },
        { q: "You know LangChain well but can't describe the agent loop without it. What's the risk?", options: ["None — frameworks are standard", "It reads as framework familiarity without understanding the mechanism", "You'll be asked to use a different framework", "Nothing, if the project shipped"], answer: 1, explain: "Interviewers probe underneath the abstraction precisely to distinguish the two. Being able to write the loop from memory is what demonstrates the understanding." },
      ],
    },
    {
      slug: "coding-and-takehome",
      title: "The coding round & the take-home",
      summary:
        "What AI Engineer coding interviews actually contain, how to approach a take-home so it stands out, and the details that separate accepted submissions.",
      minutes: 11,
      blocks: [
        { type: "p", text: "AI Engineer coding rounds are not usually competitive-programming exercises. They test whether you can build a small, correct, well-structured system that calls a model — and whether you think about the things that break in production." },
        { type: "h2", text: "What the live round looks like" },
        { type: "compare", caption: "Four common formats.", columns: ["Format", "Task", "What they watch for"], rows: [
          { label: "Build a small RAG", cells: ["Chunk, embed, retrieve, answer over a supplied corpus", "Chunking choices, whether you evaluate anything, error handling"] },
          { label: "Implement a tool loop", cells: ["Wire two tools and let a model use them", "Validation, termination, and how you handle a tool error"] },
          { label: "Structured extraction", cells: ["Pull typed fields from messy documents", "Schema design, validation, and the retry/repair path"] },
          { label: "Debug a broken pipeline", cells: ["Given code that returns poor answers, diagnose it", "Whether you isolate stages instead of guessing"] },
        ]},
        { type: "callout", kind: "key", text: "**Narrate your assumptions and trade-offs as you type.** In a 45-minute build, the code will be incomplete; the reasoning is what's being assessed. \"I'm chunking on paragraphs because the docs are structured — with more time I'd sweep chunk size against recall@k\" earns more than silently producing tidier code." },
        { type: "h2", text: "The details that get noticed" },
        { type: "list", items: [
          "**Handle the API failing.** A try/except with a retry and a timeout takes thirty seconds to write and is noticed every time.",
          "**Validate model output.** Parse into a typed model rather than trusting the string. This is the single clearest production signal in a coding round.",
          "**Say something about evaluation** even if you don't have time to build it: \"here's the eval I'd write, here are five cases I'd start with.\"",
          "**Don't hardcode secrets**, and don't paste an API key into the shared editor.",
          "**Keep the model call in one function.** Testable, mockable, swappable — and it shows you've done this before.",
          "**Mention cost once.** \"This sends the full document each time; I'd cache the prefix\" is a one-line remark that lands.",
        ]},
        { type: "code", lang: "python", caption: "The shape of a good 45-minute answer", code: `@dataclass
class Answer:
    text: str
    citations: list[str]
    cost_usd: float

def answer(question: str, k: int = 5) -> Answer:
    """One place the model is called — testable, mockable, swappable."""
    chunks = retrieve(question, k=k)          # hybrid if there's time
    if not chunks or chunks[0].score < 0.3:
        return Answer("I don't have that in the documents.", [], 0.0)

    resp = with_retry(lambda: client.messages.create(
        model=MODEL, max_tokens=512, system=SYSTEM,
        messages=[{"role": "user", "content": render(question, chunks)}],
    ), attempts=3, backoff=1.5)

    parsed = parse_and_validate(resp)          # never trust the string
    if not parsed.citations <= {c.id for c in chunks}:
        raise CitationError("cited a source that wasn't provided")
    return Answer(parsed.text, list(parsed.citations), cost_of(resp))

# Said out loud: "With more time: an eval set of ~20 questions with expected
# chunk ids, a reranker, and prompt caching on the system block."`},
        { type: "h2", text: "The take-home" },
        { type: "p", text: "Take-homes are where candidates most often lose on presentation rather than capability. The submissions that stand out are rarely the most feature-complete — they're the ones that show judgment." },
        { type: "steps", items: [
          { title: "Read the brief for the real question", text: "\"Build a document Q&A system\" is asking about retrieval quality and evaluation. Ship those well rather than adding a chat UI." },
          { title: "Scope ruthlessly and say so", text: "Do the core exceptionally, list what you skipped and why. Half-finished breadth reads worse than deliberate depth." },
          { title: "Include an eval, however small", text: "20 questions with expected sources and a script that scores them. This is the most reliable differentiator in take-home review." },
          { title: "Write a README that leads with decisions", text: "What you built, the three decisions you made and why, what you'd do with another week, and known limitations. Reviewers read this first." },
          { title: "Make it run in one command", text: "A reviewer who can't run it in five minutes reviews the README only." },
          { title: "Respect the time box", text: "Spending fifteen hours on a four-hour brief signals poor judgment, not enthusiasm. Note what you'd add rather than adding it." },
        ]},
        { type: "callout", kind: "tip", text: "**A `LIMITATIONS.md` (or a limitations section) is disproportionately effective.** \"Chunking is fixed-size, which splits tables — structure-aware chunking is the first thing I'd fix, and here's the eval case that demonstrates it\" tells a reviewer you know what good looks like, which is exactly what they're trying to determine." },
        { type: "h2", text: "Questions asked about your submission" },
        { type: "list", items: [
          "\"Why that chunk size?\" — have a reason, ideally a measured one.",
          "\"How would you know if retrieval was the problem?\" — recall@k against labelled chunks.",
          "\"What breaks at 1,000× the documents?\" — index type, ANN, filtering, reindex strategy.",
          "\"What does this cost per query?\" — do the arithmetic.",
          "\"How would you handle permissions?\" — filter inside the query.",
          "\"What would you do differently?\" — never \"nothing\". Have two answers ready.",
        ]},
        { type: "callout", kind: "warn", text: "Don't submit generated code you can't explain line by line. Using a model to write it is expected and fine; not being able to justify a decision in it is fatal, and the follow-up conversation is designed to find exactly that." },
      ],
      takeaways: [
        "Coding rounds are small production-shaped builds: RAG, tool loops, extraction, or debugging — not algorithm puzzles.",
        "Narrate assumptions and trade-offs; incomplete code with clear reasoning beats silent tidy code.",
        "The noticed details: retries and timeouts, output validation, one model-call function, a word on evaluation and cost.",
        "In take-homes, scope ruthlessly, include a small eval, lead the README with decisions, and make it run in one command.",
        "Expect follow-up questions on chunk size, retrieval diagnosis, scale, cost, permissions, and what you'd change.",
      ],
      flashcards: [
        { front: "What's the clearest production signal in a coding round?", back: "Validating model output into a typed model instead of trusting the string — plus a retry with timeout on the API call. Both take seconds and are noticed every time." },
        { front: "What differentiates a take-home submission most reliably?", back: "Including a small eval — around 20 questions with expected sources and a script that scores them. Very few candidates do it, and it's what reviewers are looking for." },
        { front: "How should a take-home README open?", back: "With decisions: what you built, the three key choices and why, what you'd do with another week, and known limitations. Reviewers read it before the code." },
        { front: "Is spending 15 hours on a 4-hour take-home a good idea?", back: "No — it signals poor scoping judgment, not enthusiasm. Do the core exceptionally well and list what you deliberately left out." },
        { front: "What's the right answer to 'what would you do differently?'", back: "Never 'nothing'. Have two specific, measured answers ready — it's a question about self-assessment, not about the project." },
      ],
      quiz: [
        { q: "In a 45-minute build you won't finish. What matters most?", options: ["Writing the most code", "Narrating assumptions and trade-offs while building the core correctly", "Perfect formatting", "Using a framework"], answer: 1, explain: "The round assesses reasoning under time pressure. Interviewers explicitly expect incompleteness; they're listening to why you chose what you chose." },
        { q: "A take-home says 'build a document Q&A system'. What should you prioritise?", options: ["A polished chat UI", "Retrieval quality and a small eval that measures it", "Supporting ten file formats", "A deployment pipeline"], answer: 1, explain: "The brief is a proxy for retrieval and evaluation judgment. UI polish and format breadth don't answer the question being asked." },
        { q: "You used a model to help write your take-home. What's the risk?", options: ["It's disqualifying", "None — provided you can explain and justify every decision in it", "You must disclose every prompt", "Reviewers can always tell"], answer: 1, explain: "Using AI tools is expected. The follow-up conversation is designed to find code you can't justify, so understand every line you submit." },
      ],
    },
    {
      slug: "keyword-radar-2026",
      title: "The 2026 keyword radar",
      summary:
        "What job descriptions and interviewers are actually asking for right now — the terms that matter, the ones that faded, and what each really means.",
      minutes: 12,
      blocks: [
        { type: "p", text: "Job descriptions are written in a dialect that changes every few months. This is what the vocabulary means in 2026, what's rising, what's stable, and what has quietly disappeared — so you can read a JD accurately and use the terms without sounding like you're reciting them." },
        { type: "callout", kind: "key", text: "**Knowing a keyword means being able to say what problem it solves and when *not* to use it.** Interviewers probe exactly one level below the buzzword — \"you mentioned agentic RAG; when would you not use it?\" — and that's where recitation and understanding separate." },
        { type: "h2", text: "Rising fastest" },
        { type: "compare", caption: "The terms appearing in job descriptions that weren't there eighteen months ago.", columns: ["Term", "What it means", "The follow-up question"], rows: [
          { label: "Context engineering", cells: ["Deliberately curating what occupies the context window", "\"What would you remove from a bloated context, and how would you decide?\""] },
          { label: "MCP", cells: ["The Model Context Protocol for exposing tools and data to any model", "\"How do you secure an MCP server?\""] },
          { label: "Agentic RAG", cells: ["Retrieval as a tool inside an agent loop rather than a fixed stage", "\"What limits does it need, and when is pipeline RAG better?\""] },
          { label: "Evals / eval-driven development", cells: ["Building the measurement before the feature", "\"Walk me through your golden set and your judge calibration.\""] },
          { label: "Test-time compute", cells: ["Spending inference tokens on reasoning to improve answers", "\"When is it wasted?\""] },
          { label: "GRPO / verifiable rewards", cells: ["Group-relative RL with automatic correctness checking", "\"Why did this work for maths and code first?\""] },
          { label: "LLM gateway / AI gateway", cells: ["A central layer for routing, caching, limits, and observability", "\"What belongs in it and what doesn't?\""] },
          { label: "Guardrails", cells: ["Programmatic checks around model calls and tools", "\"What's your false-positive budget?\""] },
          { label: "Prompt caching", cells: ["Reusing a processed prompt prefix at a large discount", "\"Why does prompt ordering matter?\""] },
          { label: "Small language models / SLMs", cells: ["Compact models for latency, cost, privacy, and edge", "\"How would you decide the routing threshold?\""] },
        ]},
        { type: "h2", text: "Stable and expected" },
        { type: "list", items: [
          "**RAG** — assumed knowledge now, not a differentiator. The differentiator is *advanced* RAG and RAG evaluation.",
          "**Embeddings, vector databases, hybrid search, reranking** — you should be able to explain each and when it fails.",
          "**Function/tool calling** — including validation and authorisation, not just the API shape.",
          "**Fine-tuning, LoRA/QLoRA** — plus knowing when *not* to fine-tune, which is the more common right answer.",
          "**Structured outputs / JSON mode** — with constrained decoding and repair loops.",
          "**Streaming, token costs, latency budgets** — basic production literacy.",
          "**Prompt injection** — increasingly asked in every loop, not only security roles.",
          "**LangChain / LangGraph / vLLM / Ollama** — recognised names; be able to say what each is for and what you'd own yourself.",
        ]},
        { type: "h2", text: "Fading or reframed" },
        { type: "compare", caption: "Terms that have shifted meaning or importance.", columns: ["Term", "Status"], rows: [
          { label: "\"Prompt engineer\" as a job title", cells: ["Largely absorbed into AI Engineer; prompting is a skill, not a role"] },
          { label: "Naive/basic RAG", cells: ["Table stakes — describing it as an achievement now reads as junior"] },
          { label: "Chain-of-thought prompting", cells: ["Mostly superseded by native reasoning modes; still worth knowing why"] },
          { label: "\"AI whisperer\" style framing", cells: ["Gone; the field standardised on engineering vocabulary"] },
          { label: "Token-window size as a headline", cells: ["Long context is common; the interesting question is what you *put* in it"] },
        ]},
        { type: "h2", text: "How to use them credibly" },
        { type: "steps", items: [
          { title: "Name the problem before the term", text: "\"Our agent's context was ballooning with tool results — that's the context engineering problem\" beats leading with the label." },
          { title: "Attach a number", text: "\"Prompt caching cut input cost about 40% because our system block was 1,200 tokens\" is what experience sounds like." },
          { title: "Say when you wouldn't", text: "Every technique has a wrong context. Naming it is the strongest possible signal of first-hand use." },
          { title: "Admit the edges", text: "\"We tried semantic caching and pulled it — false hits on questions that differed by one qualifier\" is more credible than a clean success story." },
        ]},
        { type: "callout", kind: "warn", text: "The keyword trap: listing a term you can't go one level below on. If your CV says GRPO, expect \"how does it differ from PPO?\". If it says MCP, expect \"what's a rug pull?\". **Cut anything from your CV you can't defend for two minutes** — a shorter honest list interviews far better than a long fragile one." },
        { type: "callout", kind: "tip", text: "Read the JD's *ordering*. The first three bullets are what the team actually needs; the last five are aspirational. If \"evaluation frameworks\" is bullet two, that's the round you prepare hardest for — and the topic you should raise yourself if they don't." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Table stakes** = assumed baseline knowledge, not a differentiator. **One level below** = the follow-up question that distinguishes recall from understanding. **JD** = job description. **Aspirational bullet** = a requirement the team would like but will hire without. **Signal** = evidence an interviewer weighs when deciding." },
      ],
      takeaways: [
        "Rising: context engineering, MCP, agentic RAG, evals, test-time compute, GRPO/verifiable rewards, AI gateways, guardrails, prompt caching, SLMs.",
        "Stable and expected: RAG, embeddings and hybrid search, tool calling, LoRA, structured outputs, streaming and cost literacy, prompt injection.",
        "Fading: 'prompt engineer' as a title, naive RAG as an achievement, CoT prompting as a headline, context-window size as a boast.",
        "Use terms credibly by naming the problem first, attaching a number, and saying when you wouldn't use the technique.",
        "Cut anything from your CV you can't defend one level below the buzzword.",
      ],
      flashcards: [
        { front: "What does 'knowing' a keyword mean in an interview?", back: "Being able to say what problem it solves *and* when not to use it. Interviewers probe exactly one level below the term, which is where recitation and understanding diverge." },
        { front: "Which term replaced 'prompt engineering' as the headline skill?", back: "Context engineering — deliberately curating everything in the context window: retrieval, compaction, memory, tool definitions, and ordering." },
        { front: "Why is 'we built a RAG system' no longer impressive?", back: "Naive RAG is table stakes. The differentiators are advanced retrieval (hybrid, reranking, contextual), permissions, and RAG evaluation." },
        { front: "How do you read a job description's priorities?", back: "By ordering — the first three bullets are what the team actually needs, the last five are aspirational. Prepare hardest for the top of the list." },
        { front: "What's the keyword trap?", back: "Listing a term you can't go one level below on. Cut anything from your CV you can't defend for two minutes; a short honest list interviews far better." },
      ],
      quiz: [
        { q: "Your CV says 'agentic RAG'. What's the likely follow-up?", options: ["Which library?", "When would you use pipeline RAG instead, and what limits does the agent need?", "How many documents?", "Which cloud?"], answer: 1, explain: "Interviewers probe one level below the term. Knowing the failure modes and the bounded alternative is what separates use from recitation." },
        { q: "Which term is now table stakes rather than a differentiator?", options: ["Context engineering", "Basic RAG", "GRPO", "MCP security"], answer: 1, explain: "Everyone has built a naive RAG pipeline. Advanced retrieval, permissions, and evaluation are where the differentiation now sits." },
        { q: "How should you introduce a technique in an interview?", options: ["Lead with the term", "Name the problem, then the term, then a number and when you wouldn't use it", "List all techniques you know", "Only mention what's in the JD"], answer: 1, explain: "Problem-first framing with a measured outcome and an honest boundary is what first-hand experience sounds like; label-first framing sounds like a glossary." },
      ],
    },
    {
      slug: "behavioural-and-offer",
      title: "The behavioural round & the offer",
      summary:
        "The stories to prepare, how AI-specific behavioural questions differ, questions worth asking them, and how levelling and offers work.",
      minutes: 10,
      blocks: [
        { type: "p", text: "The behavioural round is not a formality, and in AI teams it has its own flavour: because the technology changes constantly and the failure modes are unfamiliar, interviewers are testing how you handle **ambiguity, disagreement, and being wrong** more than how you handle process." },
        { type: "h2", text: "The stories worth preparing" },
        { type: "compare", caption: "Six stories cover almost every question. Prepare them once, properly.", columns: ["Story", "What it demonstrates"], rows: [
          { label: "A project you shipped end to end", cells: ["Ownership, scope, and outcome — your primary artefact"] },
          { label: "Something that failed", cells: ["Honest self-assessment; what you measured and changed"] },
          { label: "A disagreement you handled", cells: ["Whether you argue with evidence or volume"] },
          { label: "A decision under ambiguity", cells: ["How you proceed without complete information"] },
          { label: "Something you learned fast", cells: ["Adaptability, which matters unusually much in this field"] },
          { label: "Something you said no to", cells: ["Judgment and scoping, the most under-told story"] },
        ]},
        { type: "callout", kind: "key", text: "Use **STAR** (situation, task, action, result) but weight it correctly: about 20% situation, 60% *your* action, 20% result **with a number**. Most candidates invert it, spending three minutes on context and thirty seconds on what they personally did." },
        { type: "h2", text: "AI-specific behavioural questions" },
        { type: "compare", caption: "These are increasingly standard, and rarely prepared for.", columns: ["Question", "What they're listening for"], rows: [
          { label: "\"Tell me about a time an AI feature failed in production.\"", cells: ["That you've operated one; how you detected, diagnosed, and prevented recurrence"] },
          { label: "\"How do you decide whether AI is the right solution?\"", cells: ["That you'll say no sometimes — deterministic code is often the better answer"] },
          { label: "\"How do you explain a probabilistic system to a non-technical stakeholder?\"", cells: ["Communication, and whether you set expectations honestly up front"] },
          { label: "\"How do you handle a stakeholder who wants 100% accuracy?\"", cells: ["Reframing to error budgets, human review, and cost of errors"] },
          { label: "\"What would you do if the model provider deprecated your model tomorrow?\"", cells: ["Migration thinking, evals, abstraction, and whether you've planned for it"] },
          { label: "\"Tell me about an ethical concern you raised.\"", cells: ["That you notice and escalate, not that you have a rehearsed position"] },
        ]},
        { type: "callout", kind: "tip", text: "The strongest answer to \"how do you decide if AI is the right solution?\" includes a real example where you **decided it wasn't** — a regex, a rules engine, a database query, or a better form. Nothing establishes judgment faster than having argued against the technology you're being hired to use." },
        { type: "h2", text: "Questions worth asking them" },
        { type: "list", items: [
          "**\"How do you evaluate quality today?\"** — the single most revealing question you can ask. A vague answer tells you what your first six months look like.",
          "**\"What's in production, and how long has it been there?\"** — distinguishes shipping teams from perpetual-pilot teams.",
          "**\"Who decides what's good enough to ship?\"** — reveals whether quality decisions have an owner.",
          "**\"What's your monthly model spend, and who watches it?\"** — a proxy for operational maturity.",
          "**\"What broke most recently, and what changed as a result?\"** — the answer tells you about the engineering culture.",
          "**\"How do you handle a model deprecation?\"** — tells you whether they've been through one.",
        ]},
        { type: "h2", text: "Levelling and offers" },
        { type: "list", items: [
          "**Level is set by scope, not years.** Owning a component, owning a system, or setting direction across teams — map your experience to that vocabulary explicitly.",
          "**AI Engineer bands usually mirror the software engineering ladder** at the same company, sometimes with a premium in competitive markets. Ask which ladder the role sits on; it affects everything afterwards.",
          "**Negotiate the level before the number.** Level determines the band, and the band determines the range you're negotiating inside.",
          "**Ask what a strong first year looks like** at your level — a specific answer means the expectations are real and shared; a vague one is a risk.",
          "**Weigh the team's maturity heavily.** A team with evals, traces, and something in production will teach you more in a year than a better-paid role that hasn't shipped.",
        ]},
        { type: "callout", kind: "warn", text: "A genuine red flag worth naming: **a team that can't describe how they measure quality.** It means you'll spend your first two quarters building measurement infrastructure while being evaluated on feature delivery — a difficult position, and a common one. Ask the question early enough that the answer can change your decision." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**STAR** = situation, task, action, result. **Levelling** = mapping a candidate to a seniority band. **Scope** = the breadth of what you own — component, system, or cross-team direction. **Band** = the compensation range for a level. **Error budget** = the accepted rate of failure, used to reframe demands for perfection. **Pilot purgatory** = an organisation with many prototypes and nothing in production." },
      ],
      takeaways: [
        "Six prepared stories cover most behavioural questions; weight STAR toward your actions and end with a number.",
        "AI-specific behavioural questions probe production failure, when not to use AI, stakeholder communication, and deprecation planning.",
        "The strongest judgment signal is an example where you decided AI wasn't the right solution.",
        "Ask how they evaluate quality, what's in production, who owns 'good enough', and what broke recently.",
        "Negotiate level before number, and weigh team maturity — evals, traces, shipped systems — heavily in the decision.",
      ],
      flashcards: [
        { front: "How should STAR be weighted?", back: "Roughly 20% situation, 60% your specific actions, 20% result with a number. Most candidates invert it and spend the time on context instead of contribution." },
        { front: "What's the strongest answer to 'how do you decide if AI is the right solution?'", back: "One that includes a real case where you decided it wasn't — a rules engine, a query, or a better form. Arguing against the technology establishes judgment fastest." },
        { front: "What's the most revealing question to ask an interviewer?", back: "'How do you evaluate quality today?' A vague answer tells you your first six months will be spent building measurement while being judged on features." },
        { front: "Why negotiate level before compensation?", back: "Level determines the band, and the band determines the range you're negotiating inside. Agreeing a number first anchors you inside whatever band they've assumed." },
        { front: "What should you weigh most when comparing AI offers?", back: "Team maturity — do they have evals, traces, and something actually in production? A shipping team teaches more in a year than a better-paid team stuck in pilots." },
      ],
      quiz: [
        { q: "A stakeholder demands 100% accuracy from an AI feature. Best response?", options: ["Promise to get close", "Reframe around error budgets, the cost of each error type, and human review where it matters", "Explain that AI is probabilistic and leave it", "Recommend not building it"], answer: 1, explain: "The productive move is converting an impossible target into a decision about which errors matter and what review they warrant — that's the conversation the stakeholder actually needs." },
        { q: "You ask how a team evaluates quality and get a vague answer. What does that tell you?", options: ["They're being secretive", "You'll likely spend your first months building measurement while being judged on delivery", "They don't use AI", "They're very senior"], answer: 1, explain: "No shared measurement means no shared definition of done. It's workable, but you should go in knowing it and negotiate expectations accordingly." },
        { q: "What best demonstrates judgment in a behavioural round?", options: ["Listing technologies you've used", "A case where you argued against using AI and were right", "Describing a large project", "Naming papers you've read"], answer: 1, explain: "Knowing when *not* to apply the technology you're being hired for is the clearest possible signal that you evaluate problems rather than defaulting to tools." },
      ],
    },
  ],
};
