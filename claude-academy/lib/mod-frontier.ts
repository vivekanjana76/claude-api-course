import type { Module } from "./types";

export const frontier: Module = {
  id: "frontier",
  title: "Frontier AI, Decoded",
  blurb:
    "The vocabulary moving faster than the docs: reasoning models and test-time compute, small models on-device, agentic RAG and deep research — plus an honest decoder for the rest of the buzzwords.",
  accent: "sage",
  lessons: [
    {
      slug: "reasoning-and-test-time-compute",
      title: "Reasoning models & test-time compute",
      summary:
        "'Thinking longer' became the industry's new scaling axis. Learn what a reasoning model actually is, what test-time compute means, and when paying for thinking is worth it.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The third scaling axis" },
        {
          type: "p",
          text: "For a decade, better AI meant **bigger pretraining**: more data, more parameters, more GPUs. Then post-training (RLHF and friends) became a second axis: same weights, better behavior. The current wave added a third: **test-time compute** — spending more computation *at inference time*, on your request, to get a better answer. That's the whole trick behind every 'reasoning model' headline.",
        },
        {
          type: "compare",
          caption: "The three axes of model improvement",
          columns: ["Axis", "When it's spent", "What it buys"],
          rows: [
            { label: "Pretraining scale", cells: ["Once, before release", "Raw knowledge and capability ceiling."] },
            { label: "Post-training (RL, RLHF)", cells: ["Once, before release", "Instruction following, taste, tool use, reasoning habits."] },
            { label: "Test-time compute", cells: ["Per request, at inference", "Better answers to hard problems — paid for in latency and tokens, per call."] },
          ],
        },
        {
          type: "callout",
          kind: "note",
          title: "Jargon, decoded",
          text: "**Pretraining** = the massive first training phase where a model learns language from enormous amounts of text. **Parameters / weights** = the billions of numbers a model learns during training. **GPU** = the specialized chip that does the heavy parallel math. **Post-training** = extra tuning after pretraining to improve behavior. **RLHF** = Reinforcement Learning from Human Feedback — teaching a model what answers humans prefer. **Inference** = running the finished model to answer your request. **Test-time compute** = spending more computation at inference to get a better answer.",
        },
        { type: "h3", text: "What a reasoning model is" },
        {
          type: "p",
          text: "A **reasoning model** is trained — usually with reinforcement learning on problems with checkable answers (math, code, logic) — to produce a long internal chain of thought before its final answer. Instead of you begging for 'think step by step' in the prompt, the thinking behavior is baked into the weights. OpenAI's o-series, DeepSeek-R1, and Claude's extended/adaptive thinking are all this pattern.",
        },
        {
          type: "callout",
          kind: "key",
          title: "You already have the dial",
          text: "On Claude, test-time compute is not a separate product — it's the **effort** setting and adaptive thinking you met in Module 6. Low effort ≈ fast, cheap, little thinking. High effort ≈ the model deliberates at length. 'Reasoning model' is a training story; 'effort' is the knob you actually turn.",
        },
        { type: "h3", text: "Ways to spend test-time compute" },
        {
          type: "list",
          items: [
            "**Think longer (serial)** — one long chain of thought before answering. What thinking blocks / effort control.",
            "**Sample many, pick the best (parallel)** — generate N candidate answers, select by majority vote or a verifier/judge model. Best-of-N is the simplest quality upgrade you can build yourself.",
            "**Search** — explore multiple reasoning branches and backtrack (tree search over thoughts). Mostly a research/benchmark technique, but it's what 'inference-time search' headlines mean.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "Best-of-N: test-time compute you can implement today",
          code: `# Generate 5 candidates in parallel, then have a judge pick.
candidates = [
    client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": problem}],
    ).content[0].text
    for _ in range(5)
]

judge = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=256,
    messages=[{
        "role": "user",
        "content": f"Problem: {problem}\\n\\nCandidate answers:\\n"
        + "\\n---\\n".join(candidates)
        + "\\n\\nReply with the number of the best answer and one sentence why.",
    }],
)`,
        },
        { type: "h3", text: "When is thinking worth paying for?" },
        {
          type: "compare",
          caption: "Route by task type, verify with evals",
          columns: ["Task", "Test-time compute?"],
          rows: [
            { label: "Math, hard debugging, planning, multi-constraint problems", cells: ["Yes — reasoning gains are largest exactly here."] },
            { label: "Extraction, classification, formatting, casual chat", cells: ["No — you pay latency and tokens for the same answer."] },
            { label: "Agent steps", cells: ["Mixed — think hard at planning/decision steps, low effort for routine tool calls."] },
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Thinking is not a correctness guarantee",
          text: "A model can reason at length and still be wrong — confidently, with a beautiful chain of thought. Test-time compute shifts the quality distribution; it doesn't replace evals, grounding, or verification. And beware: on easy tasks, forced long thinking can *hurt* by talking the model out of a right first instinct.",
        },
      ],
      takeaways: [
        "Test-time compute = spending more inference-time computation per request; it's the third scaling axis after pretraining and post-training.",
        "Reasoning models are trained (usually with RL on verifiable problems) to think before answering — on Claude you control this with effort/adaptive thinking.",
        "Serial thinking, parallel best-of-N sampling, and search are the three ways to spend it; best-of-N you can build yourself.",
        "Route by task: reasoning pays on math/code/planning, wastes money on extraction and chat — measure with evals.",
      ],
      flashcards: [
        { front: "What is test-time compute?", back: "Spending extra computation at inference time (longer thinking, multiple samples, search) to improve answer quality — paid per request in latency and tokens." },
        { front: "What makes a model a 'reasoning model'?", back: "It's trained — typically with RL on verifiable problems like math and code — to produce a long chain of thought before answering, instead of needing prompt tricks." },
        { front: "What is best-of-N sampling?", back: "Generate N candidate answers in parallel and pick the best via majority vote or a judge model — the simplest DIY form of test-time compute." },
      ],
      quiz: [
        {
          q: "Your extraction pipeline pulls invoice fields into JSON. Should you switch it to high-effort thinking?",
          options: [
            "Yes — more thinking always improves accuracy",
            "No — extraction barely benefits; you'd pay latency and tokens for the same output",
            "Yes, but only with best-of-N on top",
            "Only if the invoices are in multiple languages",
          ],
          answer: 1,
          explain: "Test-time compute pays on hard reasoning tasks (math, debugging, planning). Routine extraction gains almost nothing — run the eval and keep effort low.",
        },
        {
          q: "What distinguishes a reasoning model from a base model prompted with 'think step by step'?",
          options: [
            "Reasoning models have bigger context windows",
            "The thinking behavior is trained into the weights via RL on verifiable problems, not requested per-prompt",
            "Reasoning models cannot use tools",
            "Nothing — they are the same thing",
          ],
          answer: 1,
          explain: "Chain-of-thought prompting asks for reasoning; a reasoning model was trained (typically with RL on checkable answers) to deliberate by default, with quality that prompting alone doesn't reach.",
        },
      ],
    },
    {
      slug: "small-models-on-device",
      title: "Small language models & on-device AI",
      summary:
        "The other direction of progress: models small enough to run on a laptop, a phone, or a single GPU — and why 'small' became a strategy, not a compromise.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Small got good" },
        {
          type: "p",
          text: "While frontier models grew, a quieter trend ran the other way: **small language models (SLMs)** — roughly, models under ~15B parameters — got dramatically better. Today's best small models beat the frontier models of two years ago. Three forces drove it: **distillation** (big models generate training data for small ones), better data curation, and **quantization** (4-bit weights that keep most of the quality).",
        },
        {
          type: "compare",
          caption: "Two directions of progress",
          columns: ["Direction", "Optimizes for", "Examples"],
          rows: [
            { label: "Frontier models", cells: ["Maximum capability", "Claude Opus, GPT-5-class models, Gemini Ultra-class models."] },
            { label: "Small language models", cells: ["Capability per dollar/watt/millisecond", "Llama & Qwen small variants, Phi, Gemma, Mistral small models."] },
          ],
        },
        { type: "h3", text: "On-device AI" },
        {
          type: "p",
          text: "**On-device AI** (or edge AI) runs the model on the user's hardware — phone, laptop, car, factory sensor — instead of a cloud API. Modern phones and laptops ship **NPUs** (neural processing units) built for exactly this. Apple, Google, and Microsoft all now ship OS-level small models that apps can call locally.",
        },
        {
          type: "list",
          items: [
            "**Privacy** — data never leaves the device; entire categories of compliance problems disappear.",
            "**Latency** — no network round-trip; tokens start instantly. Critical for keyboards, voice, and real-time UX.",
            "**Offline & cost** — works on a plane; inference is free at the margin once the device exists.",
            "**The catch** — a 3B on-device model is far below frontier quality. The winning pattern is **hybrid**: local model for fast/private/simple, cloud frontier model for hard requests.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "The router pattern ties it together",
          text: "Production systems increasingly run a **model cascade**: try the small cheap model first, detect low confidence or task difficulty, escalate to the frontier model. Same idea at every scale — on-device → cloud, SLM → frontier, low effort → high effort. Your evals decide the routing threshold.",
        },
        { type: "h3", text: "When small beats big" },
        {
          type: "steps",
          items: [
            { title: "The task is narrow and high-volume", text: "Classification, routing, extraction, summarization at millions of calls — capability ceiling doesn't matter, unit economics do." },
            { title: "Your evals say it passes", text: "Run the same eval suite against the small model. If it passes, the extra capability you're paying for is waste." },
            { title: "Distill when it almost passes", text: "Use a frontier model to generate thousands of gold examples, fine-tune the small model on them (LoRA), re-run evals. This is the standard cost-crushing move from Module 7." },
          ],
        },
        {
          type: "callout",
          kind: "story",
          title: "Why NVIDIA researchers argued 'SLMs are the future of agents'",
          text: "A widely-cited 2025 NVIDIA paper argued most agent steps are repetitive, narrow subtasks — parse this, format that, call this tool — that a specialized small model handles as well as a frontier one at a fraction of the cost. The frontier model earns its keep on the hard planning steps. Whether or not you buy the whole thesis, the cost math for high-volume agent steps is real.",
        },
      ],
      takeaways: [
        "SLMs (~<15B params) got good via distillation, data curation, and quantization — today's small models beat yesterday's frontier.",
        "On-device AI buys privacy, instant latency, offline operation, and zero marginal cost — at a real quality ceiling.",
        "The dominant production pattern is hybrid/cascade: small model first, escalate to frontier on difficulty — thresholds set by evals.",
        "Small wins on narrow high-volume tasks; distillation (frontier generates training data for the small model) closes the gap.",
      ],
      flashcards: [
        { front: "What is a small language model (SLM)?", back: "Roughly a sub-15B-parameter model optimized for capability per dollar/watt/millisecond rather than maximum capability — often distilled from larger models." },
        { front: "What are the main benefits of on-device AI?", back: "Privacy (data never leaves the device), instant latency, offline operation, and zero marginal inference cost — traded against a lower quality ceiling." },
        { front: "What is a model cascade/router?", back: "Try a small cheap model first and escalate to a frontier model on low confidence or hard tasks — with evals deciding the routing threshold." },
      ],
      quiz: [
        {
          q: "A ticket-routing classifier runs 2M times/day on a frontier model and passes evals easily. What's the standard optimization?",
          options: [
            "Raise the effort setting for better accuracy",
            "Move to an SLM (possibly distilled from the frontier model) and confirm it still passes evals",
            "Add best-of-N sampling",
            "Nothing — frontier models are always the safe choice",
          ],
          answer: 1,
          explain: "Narrow, high-volume, eval-passing tasks are exactly where small models win. Distill if quality drops slightly; the eval suite is the referee.",
        },
        {
          q: "Which is NOT a typical reason to run AI on-device?",
          options: [
            "Data privacy requirements",
            "Sub-100ms first-token latency",
            "Needing maximum reasoning capability",
            "Offline operation",
          ],
          answer: 2,
          explain: "On-device models are small by necessity — maximum capability is the one thing they can't offer. That's what the hybrid escalation path to a cloud frontier model is for.",
        },
      ],
    },
    {
      slug: "agentic-rag-deep-research",
      title: "Agentic RAG & deep research",
      summary:
        "Classic RAG retrieves once and hopes. Agentic RAG puts the model in charge of deciding what to search, judging what came back, and searching again — the pattern behind every 'deep research' product.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The ceiling of one-shot RAG" },
        {
          type: "p",
          text: "The Module 5 pipeline — embed query, retrieve top-k, stuff context, answer — is **one-shot**: retrieval happens once, before the model sees anything, driven by the user's raw phrasing. It fails predictably on questions that need **multiple hops** ('compare our 2024 and 2025 refund policies'), **vague queries** that embed poorly, or questions where the first retrieval comes back empty or off-target and nothing gets a second chance.",
        },
        { type: "h3", text: "Agentic RAG: retrieval as a tool" },
        {
          type: "p",
          text: "**Agentic RAG** flips control: search becomes a *tool* the model calls in a loop. The model reads the question, decides what to search for (often rewriting the query), inspects the results, and decides whether to answer, refine the search, or search for something else entirely. You already know the machinery — it's the agentic loop from Module 4 pointed at retrieval.",
        },
        {
          type: "steps",
          items: [
            { title: "Decompose", text: "The model breaks 'compare X and Y' into separate retrievable questions." },
            { title: "Search & judge", text: "It calls the search tool, reads the chunks, and judges: does this actually answer the sub-question?" },
            { title: "Iterate", text: "Bad results → rewrite the query, try a different filter, or search the web instead of the KB." },
            { title: "Synthesize", text: "Once each sub-question is grounded, compose the answer with citations." },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "One-shot when you can, agentic when you must",
          text: "Agentic RAG costs 3–10× the tokens and multiples of the latency of one-shot RAG. Most FAQ-style queries don't need it. The production pattern: answer simple queries one-shot, and route multi-hop/failed-retrieval cases into the loop. Your retrieval evals (Module 5) tell you where the one-shot ceiling actually is.",
        },
        { type: "h3", text: "Deep research: agentic RAG, maximized" },
        {
          type: "p",
          text: "**Deep research** products (Claude's research mode and its equivalents elsewhere) are the same loop scaled up: given an open-ended question, the agent plans a research strategy, runs dozens or hundreds of searches — web and internal — reads sources, tracks contradictions, and emerges minutes later with a long cited report. The buzzword is new; the architecture is search-tool-in-a-loop plus patience.",
        },
        {
          type: "compare",
          caption: "Three retrieval architectures",
          columns: ["Architecture", "Control flow", "Best for"],
          rows: [
            { label: "Classic RAG", cells: ["Your code retrieves once, then generates", "FAQ-style questions over a known corpus; latency-sensitive chat."] },
            { label: "Agentic RAG", cells: ["Model calls search tools in a loop", "Multi-hop questions, messy corpora, queries needing reformulation."] },
            { label: "Deep research", cells: ["Long-horizon agent with many searches + synthesis", "Open-ended questions worth minutes of latency and a real token budget."] },
          ],
        },
        { type: "h3", text: "GraphRAG, briefly" },
        {
          type: "p",
          text: "**GraphRAG** pre-processes the corpus with an LLM to extract entities and relationships into a knowledge graph, then retrieves through graph structure instead of (or alongside) vector similarity. It shines on 'how is A connected to B' and whole-corpus summary questions where chunk similarity fails — at the cost of an expensive indexing step and a pipeline that's harder to keep fresh. Reach for it when relationship queries dominate; skip it for ordinary document Q&A.",
        },
        {
          type: "callout",
          kind: "warn",
          title: "Evaluate the loop, not just the answer",
          text: "Agentic RAG adds failure modes one-shot RAG doesn't have: infinite search loops, burning the budget re-searching the same thing, or confidently answering after retrieval failed. Cap iterations, log every search call, and eval both end answers and retrieval behavior (did it search when it should have?).",
        },
      ],
      takeaways: [
        "Classic RAG retrieves once with the user's phrasing; it fails on multi-hop, vague, or first-try-missed queries.",
        "Agentic RAG makes search a tool in the agentic loop: the model decomposes, searches, judges results, and re-searches.",
        "Deep research = the same loop with a big search budget and long-horizon synthesis into cited reports.",
        "GraphRAG retrieves through an LLM-built knowledge graph — for relationship-heavy questions, not ordinary Q&A.",
        "Route simple queries one-shot and escalate hard ones; cap iterations and eval retrieval behavior, not just answers.",
      ],
      flashcards: [
        { front: "Agentic RAG vs classic RAG in one line?", back: "Classic RAG: your code retrieves once before generation. Agentic RAG: the model calls search as a tool in a loop — deciding what to search, judging results, iterating." },
        { front: "What is 'deep research'?", back: "A long-horizon agentic-RAG pattern: plan a strategy, run many searches, read and reconcile sources, and synthesize a long cited report — minutes of latency by design." },
        { front: "When does GraphRAG beat vector RAG?", back: "When questions are about relationships and connections across the corpus ('how is A linked to B?') where chunk-similarity retrieval fails; it costs an expensive LLM indexing step." },
      ],
      quiz: [
        {
          q: "'Compare the termination clauses in our 2024 and 2026 vendor contracts.' One-shot RAG keeps failing. Why?",
          options: [
            "The embedding model is too small",
            "It's a multi-hop question — one retrieval with the raw query can't gather both clauses and align them",
            "The context window is too short",
            "Temperature is set too high",
          ],
          answer: 1,
          explain: "Multi-hop comparisons need decomposition: retrieve the 2024 clause, retrieve the 2026 clause, then compare. That's agentic RAG's core case.",
        },
        {
          q: "What's the right guard against an agentic-RAG agent that keeps searching without answering?",
          options: [
            "Remove the search tool after the first call",
            "Cap search iterations and instruct it to answer with what it has (admitting gaps) at the cap",
            "Increase max_tokens",
            "Switch to GraphRAG",
          ],
          answer: 1,
          explain: "Iteration caps plus 'answer with admitted gaps' is the standard guard — the same bounded-loop discipline as any agent, applied to retrieval.",
        },
      ],
    },
    {
      slug: "buzzword-decoder",
      title: "The buzzword decoder",
      summary:
        "Vibe coding, world models, synthetic data, AI slop, AGI — a rapid-fire, honest tour of the terms filling your feed, plus a durable method for decoding the next one.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "A method before the list" },
        {
          type: "p",
          text: "Buzzwords churn; a decoding method doesn't. When a new term lands, ask three questions: **(1) What's the mechanism?** — if no one can explain it in terms of training, inference, or systems around models, it's marketing. **(2) Who benefits from you believing it?** — vendors coin terms to reposition products. **(3) Is there an eval?** — real capabilities come with measurable benchmarks; vibes come with demos.",
        },
        { type: "h3", text: "The decoder" },
        {
          type: "compare",
          caption: "What it means vs what the hype says",
          columns: ["Buzzword", "What it actually is", "Honest status"],
          rows: [
            { label: "Vibe coding", cells: ["Prompting a coding agent and accepting output without reading the code — judging by whether it runs", "Great for prototypes and throwaways; negligent for production. The professional version is spec-driven development (Module 7)."] },
            { label: "World model", cells: ["A model that learns to predict how an environment evolves — physics, space, cause and effect — rather than just next tokens", "Real research direction (video-generation models, robotics); years from your product stack."] },
            { label: "Synthetic data", cells: ["Training data generated by models instead of collected from humans — the engine behind distillation", "Genuinely load-bearing in modern training; 'model collapse' risk is managed with filtering and mixing, not a doom loop."] },
            { label: "AI slop", cells: ["Low-quality mass-produced AI content flooding feeds, search, and package registries", "Real and worsening; the defense is provenance, curation, and ranking — an ecosystem problem, not a model setting."] },
            { label: "Frontier model", cells: ["A model at the current capability ceiling (Claude Opus-class and peers)", "Useful shorthand; also marketing — check benchmarks that match your task, not the label."] },
            { label: "AGI / superintelligence", cells: ["AI matching (AGI) or exceeding (ASI) humans across most cognitive work", "No agreed definition or test; treat timelines as opinion. Irrelevant to what you ship this quarter."] },
            { label: "Sovereign AI", cells: ["Nations building domestic AI infrastructure — compute, models, data — for strategic independence", "Real policy trend that shapes procurement (data residency, national clouds); not an engineering technique."] },
            { label: "Omni / natively multimodal", cells: ["One model trained end-to-end on text, image, and audio together, in and out — vs a text model with bolted-on encoders", "Real architecture shift; for you it means one API call for mixed media and true speech-to-speech latency."] },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "'Agentic' deserves its own decoder",
          text: "The most abused adjective of the era: everything from a cron job with an API call to a genuine autonomous loop now ships as 'agentic'. The test from Module 4 still works — does the *model* decide the next step based on observed results? If your code controls the steps, it's a workflow (which is often the better choice — just not the buzzword).",
        },
        { type: "h3", text: "Terms you already own" },
        {
          type: "p",
          text: "Half the buzzword feed is things this course already taught under their real names: **context engineering** is Module 5's context management plus Module 2's prompting discipline. **Inference-time scaling** is the previous lesson. **Compound AI systems** means 'more than one model call with logic around them' — Modules 4–6. When you know the mechanism, the rebrand is transparent.",
        },
        {
          type: "callout",
          kind: "key",
          title: "The half-life test",
          text: "Skills tied to mechanisms (retrieval, evals, tool loops, token economics) survive every hype cycle, because each new buzzword is recombination of those parts. Skills tied to brand names of the week don't. Invest accordingly.",
        },
        {
          type: "callout",
          kind: "story",
          title: "How this plays in interviews",
          text: "Interviewers increasingly probe buzzword literacy precisely because it separates practitioners from headline-readers. 'What's agentic RAG?' has a mechanism answer (search-as-a-tool in a loop). Candidates who answer with mechanisms — and honestly flag what's hype — signal they can evaluate the *next* wave too.",
        },
      ],
      takeaways: [
        "Decode any buzzword with three questions: what's the mechanism, who benefits from the term, is there an eval?",
        "Vibe coding = unreviewed agent code — fine for prototypes, negligent for production; spec-driven development is the professional counterpart.",
        "Synthetic data, omni-multimodality, and AI slop are real; AGI timelines and 'agentic' labels deserve skepticism by default.",
        "Most new terms are rebrands of mechanisms you already know — retrieval, loops, evals, token economics survive every cycle.",
      ],
      flashcards: [
        { front: "What is vibe coding?", back: "Prompting a coding agent and accepting the output without reading the code, judging only by whether it runs. Fine for prototypes; for production, use spec-driven development with real review." },
        { front: "What is synthetic data?", back: "Training data generated by models rather than collected from humans — the engine behind distillation and much of modern post-training, managed with filtering to avoid quality collapse." },
        { front: "What three questions decode any AI buzzword?", back: "(1) What's the mechanism? (2) Who benefits from you believing the term? (3) Is there an eval/benchmark, or just demos?" },
      ],
      quiz: [
        {
          q: "A vendor pitches an 'agentic AI platform'. Which single question best cuts through the label?",
          options: [
            "How many parameters is the model?",
            "Does the model decide next steps from observed results, or does your code control the sequence?",
            "Is it built on a frontier model?",
            "Does it support streaming?",
          ],
          answer: 1,
          explain: "That's the agent-vs-workflow test. If the code controls the steps it's a workflow — possibly a great one, but the 'agentic' label is doing marketing work.",
        },
        {
          q: "Your team vibe-coded a demo that won the hackathon. What's the right path to production?",
          options: [
            "Ship it — it runs and the demo proved it",
            "Rewrite by hand from scratch; agent code is unusable",
            "Treat it as a prototype: write the spec, regenerate/refactor with review, add tests and evals",
            "Just add error handling on top",
          ],
          answer: 2,
          explain: "Vibe coding's output is a validated idea, not a production artifact. The professional move is spec-driven: precise behavior spec, reviewed implementation, tests as the safety net.",
        },
      ],
    },
  ],
};
