import type { Module } from "./types";

export const llms: Module = {
  id: "llms",
  title: "LLMs & Generative AI",
  blurb:
    "Increasingly the whole interview for GenAI roles. How large language models are trained and aligned, how to steer them with prompting, how to ground them with retrieval, and how to build reliable agentic systems — plus how to evaluate any of it.",
  accent: "amber",
  lessons: [
    {
      slug: "how-llms-are-trained",
      title: "How LLMs are trained: pretraining → SFT → RLHF",
      summary:
        "The three-stage recipe that turns raw internet text into a helpful assistant — and the vocabulary (base model, instruct model, alignment) interviewers expect.",
      minutes: 11,
      blocks: [
        { type: "p", text: "A modern **large language model** isn't trained in one shot — it's built in stages, each doing a distinct job. Understanding the pipeline explains why LLMs behave the way they do and frames every downstream technique." },
        { type: "diagram", name: "llm-lifecycle", caption: "Raw text → a base model that knows language → an instruct model that follows tasks → an aligned model that's helpful and safe." },
        { type: "h2", text: "Stage 1 — Pretraining" },
        { type: "p", text: "The model is trained on a vast corpus (much of the internet, books, code) with a single self-supervised objective: **predict the next token**. To predict the next word well across billions of examples, it must absorb grammar, facts, reasoning patterns, and world knowledge. The result is a **base (foundation) model** — enormously knowledgeable but not yet good at *following instructions*; it just continues text. This stage costs the vast majority of the compute." },
        { type: "h2", text: "Stage 2 — Supervised fine-tuning (SFT)" },
        { type: "p", text: "The base model is fine-tuned on curated **(instruction, ideal response)** pairs written by humans. This teaches the format of being a helpful assistant — answering questions, following directions, using a helpful tone. The output is an **instruct model**. Far less data and compute than pretraining, but it shapes behavior dramatically." },
        { type: "h2", text: "Stage 3 — RLHF (alignment)" },
        { type: "p", text: "**Reinforcement Learning from Human Feedback** aligns the model with human preferences on qualities that are hard to specify by example — helpfulness, honesty, harmlessness. The recipe:" },
        { type: "steps", items: [
          { title: "Collect preferences", text: "Humans rank multiple model responses to the same prompt from best to worst." },
          { title: "Train a reward model", text: "A model learns to predict which responses humans prefer — turning fuzzy preference into a score." },
          { title: "Optimize the LLM", text: "Reinforcement learning (PPO) tunes the LLM to produce responses the reward model scores highly, without drifting too far from the SFT model." },
        ]},
        { type: "callout", kind: "key", text: "Why RLHF matters: pretraining gives knowledge, SFT gives instruction-following, but RLHF is what makes a model feel helpful, safe, and aligned — optimizing for qualities you can't easily write down as labeled examples. A newer, simpler alternative is DPO (Direct Preference Optimization), which skips the separate reward model and RL loop." },
        { type: "h2", text: "Where fine-tuning fits (and doesn't)" },
        { type: "p", text: "Full fine-tuning of a huge model is expensive, so **parameter-efficient fine-tuning (PEFT)** — especially **LoRA** — trains a small number of added weights while freezing the base, cutting cost and memory dramatically. But note: most application builders **don't fine-tune at all** — they steer a pretrained model with prompting and retrieval (the next lessons), which is cheaper and more flexible." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Base / foundation model** = the pretrained next-token predictor before instruction-tuning. **Instruct model** = one fine-tuned to follow instructions. **Alignment** = making a model helpful, honest, and harmless. **Reward model** = a model that scores responses by predicted human preference. **PPO/DPO** = algorithms for optimizing against preferences. **LoRA/PEFT** = cheap fine-tuning that trains small added weights." },
      ],
      takeaways: [
        "LLMs are built in stages: pretraining (next-token on massive text → knowledge), SFT (instruction demos → follows tasks), RLHF (human preferences → aligned/helpful).",
        "Pretraining produces a base model that continues text but doesn't follow instructions; SFT and RLHF shape it into an assistant.",
        "RLHF trains a reward model from human rankings, then optimizes the LLM against it (PPO); DPO is a simpler alternative.",
        "LoRA/PEFT make fine-tuning cheap, but most builders steer models with prompting/RAG rather than fine-tuning at all.",
      ],
      flashcards: [
        { front: "Name the three LLM training stages and their jobs", back: "Pretraining (next-token prediction → language + knowledge, a base model), SFT (instruction→response demos → follows tasks, an instruct model), RLHF (human preferences → helpful/safe, an aligned model)." },
        { front: "What does RLHF add that SFT can't?", back: "Alignment to preferences that are hard to demonstrate by example (helpfulness, honesty, harmlessness), by training a reward model from human rankings and optimizing the LLM against it." },
        { front: "What is LoRA?", back: "Low-Rank Adaptation — a parameter-efficient fine-tuning method that trains small added matrices while freezing the base model, making fine-tuning far cheaper in compute and memory." },
      ],
      quiz: [
        { q: "The pretraining objective of an LLM is to…", options: ["Rank human preferences", "Predict the next token", "Cluster documents", "Classify sentiment"], answer: 1, explain: "Self-supervised next-token prediction on massive text is what instills language and world knowledge in the base model." },
        { q: "RLHF's reward model is trained to…", options: ["Generate text", "Predict which responses humans prefer", "Tokenize input", "Compress the model"], answer: 1, explain: "Human rankings train a reward model that scores responses; the LLM is then optimized to score well." },
        { q: "A base (foundation) model before SFT primarily…", options: ["Follows instructions well", "Continues/completes text but isn't instruction-tuned", "Refuses all prompts", "Only does classification"], answer: 1, explain: "Pretraining yields a knowledgeable text-continuer; instruction-following comes from SFT and RLHF." },
      ],
    },
    {
      slug: "prompting-and-decoding",
      title: "Prompting & controlling generation",
      summary:
        "The cheapest, most-used way to get more from an LLM — zero/few-shot, chain-of-thought — plus the decoding knobs (temperature, top-p) that shape its output.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Since you usually can't retrain the model, **prompt engineering** — crafting the input — is the primary lever most practitioners use. It's cheap, immediate, and often enough. Interviewers want to see you know the standard techniques and when each helps." },
        { type: "h2", text: "The prompting ladder" },
        { type: "list", items: [
          "**Zero-shot** — just ask, with clear instructions and any needed context/format. Often surprisingly strong.",
          "**Few-shot** — include a handful of input→output examples in the prompt. The model infers the pattern (called **in-context learning**) — powerful for enforcing a format or a niche task without training.",
          "**Chain-of-thought (CoT)** — ask the model to 'think step by step' before answering. By generating intermediate reasoning it does markedly better on math, logic, and multi-step problems.",
          "**Role / system prompts** — set persona, constraints, and rules ('You are a careful medical assistant. Only use the provided context.').",
        ]},
        { type: "callout", kind: "key", text: "Why chain-of-thought works: an LLM does a fixed amount of computation per token, so forcing it to 'show its work' gives it more tokens — more compute — to reason through before committing to an answer. It can't do complex multi-step reasoning in a single forward pass any better than you can multiply large numbers in your head." },
        { type: "h2", text: "Decoding parameters" },
        { type: "p", text: "At each step the model outputs a probability distribution over the next token; **decoding** chooses from it. The knobs you'll be asked about:" },
        { type: "compare", caption: "The generation controls worth knowing.", columns: ["Parameter", "Effect", "Use when"], rows: [
          { label: "Temperature", cells: ["Scales randomness: low = focused/deterministic, high = creative/varied", "Low for facts/code, high for brainstorming"] },
          { label: "Top-p (nucleus)", cells: ["Sample only from the smallest set of tokens covering probability p", "Limit the long tail while allowing variety"] },
          { label: "Max tokens", cells: ["Caps output length", "Control cost and latency"] },
          { label: "Stop sequences", cells: ["Halt generation at a marker", "Structured or delimited output"] },
        ]},
        { type: "callout", kind: "tip", text: "Common practical answer: 'For a factual or code task I'd use temperature near 0 for consistency; for creative writing I'd raise it. If outputs must be reproducible for evaluation, I fix temperature at 0 (greedy) and a random seed where available.'" },
        { type: "callout", kind: "warn", text: "Prompting can't add knowledge the model doesn't have or reliably eliminate hallucination — for current, private, or verifiable facts you need retrieval (RAG) or tools, covered next. Prompting shapes *behavior*; RAG supplies *knowledge*." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Zero/few-shot** = prompting with no / a few examples. **In-context learning** = the model adapting from examples in the prompt without weight updates. **Chain-of-thought** = eliciting step-by-step reasoning. **Temperature** = randomness of sampling. **Top-p / nucleus sampling** = sampling from the top probability mass. **Greedy decoding** = always taking the highest-probability token." },
      ],
      takeaways: [
        "Prompt engineering is the cheapest, most-used lever: zero-shot, few-shot (in-context learning), chain-of-thought, and role/system prompts.",
        "Chain-of-thought helps multi-step problems by giving the model more tokens — more compute — to reason before answering.",
        "Decoding knobs shape output: temperature (randomness), top-p (nucleus sampling), max tokens, stop sequences.",
        "Prompting shapes behavior but doesn't add knowledge or remove hallucination — that's what RAG and tools are for.",
      ],
      flashcards: [
        { front: "What is in-context learning?", back: "An LLM adapting to a task purely from examples placed in the prompt (few-shot), with no weight updates — it infers the pattern at inference time." },
        { front: "Why does chain-of-thought prompting improve reasoning?", back: "The model uses fixed compute per token; generating intermediate reasoning steps gives it more tokens/compute to work through multi-step problems before answering." },
        { front: "What does temperature control?", back: "The randomness of token sampling: low (near 0) is focused and near-deterministic (good for facts/code); high is more creative and varied (good for brainstorming)." },
      ],
      quiz: [
        { q: "Few-shot prompting works via…", options: ["Fine-tuning the weights", "In-context learning from examples in the prompt", "Retraining from scratch", "Changing the tokenizer"], answer: 1, explain: "The model infers the task pattern from examples in the prompt at inference time — no weight updates." },
        { q: "To make an LLM's factual answers more consistent/reproducible, you'd…", options: ["Raise temperature", "Lower temperature toward 0", "Increase max tokens", "Add more few-shot randomness"], answer: 1, explain: "Low temperature (or greedy decoding) reduces randomness, giving focused, reproducible outputs." },
        { q: "Chain-of-thought prompting most helps with…", options: ["Reducing token cost", "Multi-step reasoning problems", "Tokenization", "Embedding similarity"], answer: 1, explain: "Asking the model to reason step by step gives it more compute to handle multi-step math and logic." },
      ],
    },
    {
      slug: "rag-grounding-llms",
      title: "RAG: grounding LLMs in real data",
      summary:
        "The dominant pattern for making LLMs accurate, current, and citable — retrieve relevant context and put it in the prompt. How it works and why teams reach for it over fine-tuning.",
      minutes: 10,
      blocks: [
        { type: "p", text: "LLMs have two big limitations: their knowledge is frozen at training time, and they **hallucinate** — produce fluent but false statements. **Retrieval-Augmented Generation (RAG)** addresses both by fetching relevant information and inserting it into the prompt, so the model answers from provided facts rather than memory. It's the most common architecture in production LLM apps." },
        { type: "h2", text: "How RAG works" },
        { type: "diagram", name: "rag-pipeline", caption: "Embed the query, retrieve similar chunks from a vector store, stuff them into the prompt, and let the LLM answer from them." },
        { type: "steps", items: [
          { title: "Index (offline)", text: "Split your documents into chunks, embed each into a vector, and store them in a vector database." },
          { title: "Retrieve", text: "Embed the user's query and find the most similar chunks by nearest-neighbor search." },
          { title: "Augment", text: "Insert the retrieved chunks into the prompt as context, with instructions to answer from them and cite sources." },
          { title: "Generate", text: "The LLM produces a grounded answer based on the supplied context." },
        ]},
        { type: "callout", kind: "key", text: "Why RAG beats fine-tuning for knowledge: it uses live, updatable data (change the documents, not the model), it can cite sources for trust and verification, it keeps private data out of training, and it's far cheaper. Fine-tuning teaches style, format, and behavior; RAG supplies knowledge. They solve different problems." },
        { type: "h2", text: "Where RAG goes wrong" },
        { type: "p", text: "RAG quality is capped by **retrieval** quality — a favorite follow-up. If the right chunk isn't retrieved, the model can't use it, and it may hallucinate anyway. Common failure points and fixes:" },
        { type: "list", items: [
          "**Poor chunking** — too big dilutes relevance, too small loses context. Tune chunk size and overlap.",
          "**Weak retrieval** — pure vector search misses exact keywords; **hybrid search** (vector + keyword) and a **reranker** improve which chunks surface.",
          "**Context overflow / 'lost in the middle'** — too many chunks bury the useful one; retrieve fewer, better chunks and order them well.",
          "**No grounding guardrail** — instruct the model to say 'I don't know' when the context doesn't contain the answer, and to cite which chunk it used.",
        ]},
        { type: "callout", kind: "tip", text: "Strong framing for 'RAG vs fine-tuning?': 'Use RAG when the need is knowledge — current, private, or citable facts. Use fine-tuning when the need is behavior — a consistent style, format, or a specialized task. They're complementary, and many systems do both.'" },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**RAG** = retrieval-augmented generation. **Chunk** = a piece of a document that gets embedded and retrieved. **Vector database** = a store for fast nearest-neighbor search over embeddings. **Reranker** = a model that reorders retrieved chunks by true relevance. **Hybrid search** = combining semantic (vector) and keyword search. **Grounding** = tying answers to provided evidence." },
      ],
      takeaways: [
        "RAG retrieves relevant chunks and puts them in the prompt, so the LLM answers from provided facts — fighting hallucination and stale knowledge.",
        "Pipeline: index documents as embeddings → retrieve by similarity to the query → augment the prompt → generate a grounded answer.",
        "RAG supplies knowledge (live, citable, private, cheap); fine-tuning supplies behavior (style/format). They're complementary.",
        "RAG quality is capped by retrieval quality; improve chunking, use hybrid search + rerankers, and add a 'say I don't know' guardrail.",
      ],
      flashcards: [
        { front: "What problem does RAG solve?", back: "LLMs have frozen, incomplete knowledge and hallucinate. RAG retrieves relevant documents into the prompt so the model answers from real, current, citable data instead of memory." },
        { front: "RAG vs fine-tuning — when each?", back: "RAG for knowledge (current/private/citable facts, cheap and updatable). Fine-tuning for behavior (consistent style, format, specialized task). Often used together." },
        { front: "Why might a RAG system still hallucinate?", back: "Its answers are capped by retrieval quality — if the right chunk isn't retrieved (bad chunking or weak search), the model lacks the fact and may fabricate. Fixes: better chunking, hybrid search, rerankers, and a grounding guardrail." },
      ],
      quiz: [
        { q: "In RAG, documents are retrieved by…", options: ["Random sampling", "Similarity search over embeddings", "Fine-tuning", "Keyword-only exact match always"], answer: 1, explain: "Chunks are embedded and stored; the query is embedded and matched by nearest-neighbor (often hybrid) search." },
        { q: "You need answers grounded in a company's frequently-updated internal docs. Best approach?", options: ["Fine-tune the base model weekly", "RAG over the documents", "Raise the temperature", "Use a bigger vocabulary"], answer: 1, explain: "RAG uses live, updatable data and can cite sources — ideal for current, private knowledge without retraining." },
        { q: "The quality ceiling of a RAG system is set mainly by…", options: ["The temperature", "Retrieval quality", "The tokenizer", "The number of GPUs"], answer: 1, explain: "If retrieval doesn't surface the right context, the LLM can't use it — retrieval quality caps the whole system." },
      ],
    },
    {
      slug: "agents-tools-evaluation",
      title: "Agents, tools & evaluating LLMs",
      summary:
        "Giving LLMs the ability to act — tool use and agent loops — and the hardest production problem: how you actually measure whether a generative system is any good.",
      minutes: 10,
      blocks: [
        { type: "p", text: "The frontier of GenAI applications is **agents** — LLMs that don't just answer but *act*: calling tools, running multi-step plans, and reacting to results. And underlying every serious LLM product is a hard question interviewers love: **how do you evaluate it?**" },
        { type: "h2", text: "Tool use and agents" },
        { type: "p", text: "An LLM alone is a text predictor — it can't look up today's price, run code, or query a database. **Tool use (function calling)** fixes that: you describe available tools, and the model outputs a structured call ('search(query)', 'get_weather(city)'); your system runs it and feeds the result back. An **agent** wraps this in a loop — the model reasons, picks an action, observes the result, and repeats until the task is done." },
        { type: "diagram", name: "agent-loop", caption: "The agent loop: the LLM reasons, calls a tool, observes the result, and iterates — with memory for context." },
        { type: "list", items: [
          "**ReAct** — the common pattern of interleaving Reasoning and Acting: think, act, observe, repeat.",
          "**Memory** — short-term (the conversation/context window) and long-term (a vector store of past interactions) let agents maintain state.",
          "**Risks** — agents can loop, take wrong actions, or run up cost; they need guardrails, step limits, and human approval for consequential actions.",
        ]},
        { type: "callout", kind: "key", text: "The mental model: a plain LLM is a brain in a jar; tools are its hands and senses; the agent loop is what lets it take an action, see what happened, and adjust. This is how you go from 'answer a question' to 'accomplish a task.'" },
        { type: "h2", text: "Evaluating generative systems" },
        { type: "p", text: "Unlike a classifier with a clean accuracy number, generative output is open-ended — there's rarely one right answer. Evaluation is the hardest part of shipping LLMs, and a mature answer combines several methods:" },
        { type: "compare", caption: "The LLM evaluation toolkit.", columns: ["Method", "What it is", "Watch out for"], rows: [
          { label: "Task metrics", cells: ["Exact match, F1, or pass@k for code — where a ground truth exists", "Only works for closed-ended tasks"] },
          { label: "Human evaluation", cells: ["People rate quality/preference — the gold standard", "Slow, costly, needs clear rubrics"] },
          { label: "LLM-as-judge", cells: ["A strong LLM scores outputs against a rubric", "Biases (position, verbosity); validate against humans"] },
          { label: "Golden eval set", cells: ["A fixed suite of prompts + expected behavior, run every change", "Must evolve as failure modes appear"] },
        ]},
        { type: "callout", kind: "tip", text: "Strong closing point: 'I'd build an offline eval set of representative and adversarial prompts to catch regressions on every change, use LLM-as-judge for scale (validated against human ratings), and pair it with online metrics — user thumbs, task success, escalation rate — plus guardrails for safety. Evaluation is a system, not a single number.'" },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Tool / function calling** = the model emitting a structured request your code executes. **Agent** = an LLM in a reason→act→observe loop. **ReAct** = interleaving reasoning and acting. **LLM-as-judge** = using an LLM to grade outputs. **Golden / eval set** = a curated test suite of prompts. **Guardrails** = safety checks constraining inputs/outputs/actions." },
      ],
      takeaways: [
        "Tool/function calling lets an LLM act — emit a structured call your system runs and feeds back; agents wrap this in a reason→act→observe loop.",
        "The ReAct pattern plus memory turns a text predictor into something that accomplishes multi-step tasks — with guardrails against loops and bad actions.",
        "Generative output is open-ended, so evaluation is the hardest part: combine task metrics, human eval, LLM-as-judge, and a golden eval set.",
        "Evaluation is a system: offline regression suite + validated LLM-judge at scale + online metrics + safety guardrails.",
      ],
      flashcards: [
        { front: "What is an LLM agent?", back: "An LLM placed in a loop where it reasons about a goal, calls tools (function calling) to act, observes the results, and repeats until the task is done — with memory and guardrails." },
        { front: "Why is evaluating LLMs hard, and how do you do it?", back: "Output is open-ended with no single right answer. Combine task metrics (where truth exists), human evaluation (gold standard), LLM-as-judge (scalable, validate against humans), and a golden eval set run on every change, plus online metrics." },
        { front: "What are the risks of agents and how do you mitigate them?", back: "They can loop, take wrong or costly actions. Mitigate with step limits, guardrails, tool permissioning, and human approval for consequential actions." },
      ],
      quiz: [
        { q: "Function calling lets an LLM…", options: ["Retrain itself", "Emit a structured request your system executes and returns", "Skip tokenization", "Increase its context window"], answer: 1, explain: "The model outputs a structured tool call; your code runs it and feeds the result back — giving the LLM 'hands'." },
        { q: "The 'gold standard' but slow way to evaluate generative quality is…", options: ["Accuracy", "Human evaluation", "Temperature tuning", "Token counting"], answer: 1, explain: "Human ratings are the most trustworthy but costly and slow; LLM-as-judge scales it, validated against humans." },
        { q: "A key caution with LLM-as-judge evaluation is…", options: ["It's always perfectly objective", "It can have biases (e.g. position, verbosity) and should be validated against humans", "It requires no prompts", "It only works for code"], answer: 1, explain: "LLM judges have known biases; validate their scores against human judgments before trusting them at scale." },
      ],
    },
  ],
};
