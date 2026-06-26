import type { Module } from "./types";

export const rag: Module = {
  id: "rag",
  title: "Retrieval & Knowledge (RAG)",
  blurb:
    "Ground Claude in your own data — documents, knowledge bases, records — so answers are accurate, current, and citable.",
  accent: "slateblue",
  lessons: [
    {
      slug: "rag-fundamentals",
      title: "What is RAG and why it exists",
      summary:
        "Retrieval-Augmented Generation fetches relevant documents and feeds them into the prompt, so Claude answers from your data instead of guessing from training.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "The knowledge problem" },
        {
          type: "p",
          text: "An LLM only knows what it learned during training. That creates three gaps: it doesn't know your **private data** (internal docs, customer records), it doesn't know **recent events** after its cutoff, and when asked about things it doesn't know, it may **hallucinate** a confident wrong answer.",
        },
        {
          type: "p",
          text: "**Retrieval-Augmented Generation (RAG)** solves this without retraining. The idea: when a question comes in, first **retrieve** the most relevant pieces of your data, then put them in the prompt and ask Claude to answer **using only that context**. The model becomes a reasoning engine over *your* facts.",
        },
        { type: "diagram", name: "rag-pipeline", caption: "RAG at a glance: a question retrieves relevant chunks from your knowledge base, which are injected into the prompt before Claude answers." },
        { type: "h3", text: "Retrieve, then generate" },
        {
          type: "steps",
          items: [
            { title: "Retrieve", text: "Search your knowledge base for chunks relevant to the question." },
            { title: "Augment", text: "Insert those chunks into the prompt as context (in tags)." },
            { title: "Generate", text: "Ask Claude to answer grounded in that context, and to say so when it doesn't know." },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Why RAG beats stuffing everything in",
          text: "You can't fit a 10,000-page knowledge base in every prompt (cost, latency, and the context window). RAG sends only the handful of relevant chunks per question — accurate AND efficient.",
        },
        { type: "h3", text: "RAG vs. fine-tuning vs. long context" },
        {
          type: "compare",
          columns: ["Approach", "Use when"],
          rows: [
            { label: "RAG", cells: ["Knowledge changes often, is large, or must be citable. The default for 'answer from our docs'."] },
            { label: "Long context", cells: ["The relevant data is small enough to just paste in every time."] },
            { label: "Fine-tuning", cells: ["You need to change behavior/style, not inject facts. Rarely the answer for knowledge."] },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "RAG reduces hallucination",
          text: "When you instruct Claude to answer only from the retrieved context and to admit when the answer isn't there, made-up answers drop sharply — because the facts are right in front of it.",
        },
      ],
      takeaways: [
        "RAG retrieves relevant data and injects it into the prompt so Claude answers from your facts, not its training.",
        "It addresses private data, recency, and hallucination without retraining the model.",
        "The pattern is retrieve → augment → generate, instructing Claude to ground its answer in the context.",
        "Prefer RAG when knowledge is large, changing, or must be citable; use long context for small data.",
      ],
      flashcards: [
        { front: "What does RAG stand for and do?", back: "Retrieval-Augmented Generation — it retrieves relevant data and injects it into the prompt so the model answers from your facts." },
        { front: "Three problems RAG solves?", back: "Private data the model never saw, events after the training cutoff, and hallucination on unknown topics." },
        { front: "RAG vs fine-tuning for facts?", back: "Use RAG to inject knowledge (large/changing/citable); fine-tuning changes behavior/style, not facts." },
      ],
      quiz: [
        {
          q: "Your support bot must answer from a constantly-updated 5,000-page knowledge base. Best approach?",
          options: ["Fine-tune the model nightly", "RAG — retrieve relevant chunks per question", "Paste all 5,000 pages each request", "Lower temperature"],
          answer: 1,
          explain: "Large, changing, citable knowledge is the canonical RAG case — retrieve only what's relevant per query.",
        },
        {
          q: "How does RAG reduce hallucination?",
          options: [
            "It uses a bigger model",
            "It puts the real facts in the prompt and instructs Claude to answer only from them",
            "It disables creativity",
            "It caches answers",
          ],
          answer: 1,
          explain: "Grounding the model in retrieved facts, with instructions to admit gaps, sharply cuts fabrication.",
        },
      ],
    },

    {
      slug: "embeddings-and-search",
      title: "Embeddings & semantic search",
      summary:
        "Retrieval works by meaning, not keywords. Embeddings turn text into vectors; similar meanings sit close together, so you can find relevant chunks fast.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "How does retrieval find the 'relevant' chunks?" },
        {
          type: "p",
          text: "Keyword search misses paraphrases — 'how do I cancel?' won't match a doc titled 'Terminating your subscription.' RAG retrieval is usually **semantic**: it matches by *meaning*. The enabling technology is **embeddings**.",
        },
        { type: "h3", text: "Embeddings: meaning as coordinates" },
        {
          type: "p",
          text: "An **embedding model** turns a piece of text into a list of numbers — a **vector** — that captures its meaning. Texts with similar meaning produce vectors that are close together in that high-dimensional space. 'cancel my plan' and 'end my subscription' land near each other; 'reset my password' lands far away.",
        },
        { type: "diagram", name: "embeddings", caption: "Embeddings map text to points in 'meaning space'. Similar meanings cluster; retrieval finds the nearest neighbors to your query." },
        { type: "h3", text: "Vector search" },
        {
          type: "steps",
          items: [
            { title: "Index (offline)", text: "Split your documents into chunks, embed each chunk, and store the vectors in a vector database." },
            { title: "Query (online)", text: "Embed the user's question with the same model." },
            { title: "Find neighbors", text: "Retrieve the chunks whose vectors are closest to the question's vector (cosine similarity)." },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Same model both sides",
          text: "Always embed your documents and your queries with the SAME embedding model. Vectors from different models aren't comparable — distances become meaningless.",
        },
        { type: "h3", text: "Chunking matters" },
        {
          type: "p",
          text: "You retrieve **chunks**, not whole documents. Chunk too big and you waste context and dilute relevance; too small and you lose the surrounding meaning. A few hundred tokens with slight overlap is a common starting point — then tune against an eval.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Hybrid search is often best",
          text: "Combining semantic (embedding) search with keyword search and a re-ranking step usually beats either alone — semantic catches paraphrase, keywords catch exact terms (names, codes, IDs).",
        },
        {
          type: "callout",
          kind: "note",
          title: "Where Anthropic fits",
          text: "Anthropic focuses on the generation side (Claude reasoning over retrieved context). For embeddings you typically use a dedicated embedding provider; Claude then consumes the chunks they help you retrieve.",
        },
      ],
      takeaways: [
        "Retrieval is semantic: it matches by meaning, not keywords, via embeddings.",
        "An embedding turns text into a vector; similar meanings sit close together in vector space.",
        "Index chunks offline, embed the query online, and retrieve nearest neighbors (cosine similarity).",
        "Use the same embedding model for docs and queries; tune chunk size; hybrid search often wins.",
      ],
      flashcards: [
        { front: "What is a text embedding?", back: "A vector (list of numbers) representing a text's meaning, where similar meanings produce nearby vectors." },
        { front: "Why semantic search over keyword search for RAG?", back: "It matches paraphrases by meaning ('cancel plan' ≈ 'end subscription'), which keyword search misses." },
        { front: "Critical rule when embedding docs and queries?", back: "Use the same embedding model for both — vectors from different models aren't comparable." },
      ],
      quiz: [
        {
          q: "Why do 'end my subscription' and 'cancel my plan' get retrieved together?",
          options: [
            "They share keywords",
            "Their embeddings are close in vector space because their meanings are similar",
            "The model memorized them",
            "They have the same length",
          ],
          answer: 1,
          explain: "Embeddings place similar meanings near each other, so semantic search finds them as neighbors.",
        },
        {
          q: "You embed docs with model A and queries with model B. What happens?",
          options: ["It works fine", "Distances become meaningless and retrieval degrades", "It's faster", "It improves recall"],
          answer: 1,
          explain: "Vectors from different models live in different spaces; you must use one model for both sides.",
        },
      ],
    },

    {
      slug: "rag-pipeline",
      title: "Building a RAG pipeline",
      summary:
        "Assemble the pieces into a working system: chunk and index your data, retrieve per query, ground the prompt, and add citations and quality checks.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "End to end" },
        {
          type: "p",
          text: "A production RAG system has an offline indexing path and an online answering path. Here's the whole thing in one view.",
        },
        {
          type: "steps",
          items: [
            { title: "Ingest & chunk", text: "Load documents, split into overlapping chunks, attach metadata (source, title, URL)." },
            { title: "Embed & store", text: "Embed each chunk and store vectors + metadata in a vector database." },
            { title: "Retrieve", text: "On a question, embed it and fetch the top-k nearest chunks (optionally re-rank)." },
            { title: "Augment & generate", text: "Insert chunks into the prompt (in tags) and have Claude answer grounded in them, with citations." },
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "The grounded-answer prompt (the heart of RAG)",
          code: `system = """Answer ONLY using the provided context.
If the answer isn't in the context, say "I don't have that information."
Cite the source id in brackets after each claim, e.g. [doc_3]."""

context = "\\n\\n".join(
    f"<chunk id='{c.id}' source='{c.source}'>{c.text}</chunk>"
    for c in retrieved_chunks
)

resp = client.messages.create(
    model="claude-sonnet-4-6", max_tokens=1024, system=system,
    messages=[{"role": "user",
               "content": f"<context>{context}</context>\\n\\nQuestion: {question}"}],
)`,
        },
        {
          type: "callout",
          kind: "key",
          title: "Grounding instructions do the heavy lifting",
          text: "'Answer only from the context; admit when you don't know; cite sources.' These three rules convert a clever model into a trustworthy, auditable one. Without them, RAG still drifts into guessing.",
        },
        { type: "h3", text: "Citations the built-in way" },
        {
          type: "p",
          text: "For documents, Claude supports native **citations**: enable them on a document block and the response links each claim back to the exact text it came from. That gives users verifiable answers and you a debugging trail.",
        },
        { type: "h3", text: "Where RAG goes wrong (and fixes)" },
        {
          type: "compare",
          columns: ["Failure", "Fix"],
          rows: [
            { label: "Right docs not retrieved", cells: ["Better chunking, hybrid search, re-ranking, more top-k."] },
            { label: "Answer ignores the context", cells: ["Stronger grounding instructions; put context in clear tags."] },
            { label: "Stale answers", cells: ["Re-index on data changes; store and check timestamps."] },
            { label: "No way to trust it", cells: ["Require citations; evaluate retrieval and answers separately."] },
          ],
        },
        {
          type: "callout",
          kind: "tip",
          title: "Evaluate retrieval and generation separately",
          text: "If answers are bad, first ask: did we retrieve the right chunks? A bad answer from good context is a prompt problem; a bad answer from missing context is a retrieval problem. Measure each with its own eval.",
        },
      ],
      takeaways: [
        "RAG = offline (chunk → embed → store) + online (retrieve → augment → generate with citations).",
        "The grounded-answer prompt — answer only from context, admit gaps, cite sources — is what makes RAG trustworthy.",
        "Use Claude's native citations to link claims to source text.",
        "Evaluate retrieval and generation separately to know which half to fix.",
      ],
      flashcards: [
        { front: "Two halves of a RAG system?", back: "Offline indexing (chunk → embed → store) and online answering (retrieve → augment → generate)." },
        { front: "The three grounding rules in the prompt?", back: "Answer only from the provided context, admit when the answer isn't there, and cite the sources." },
        { front: "Answer is wrong — first diagnostic question?", back: "Did retrieval surface the right chunks? Bad answer from good context = prompt issue; from missing context = retrieval issue." },
      ],
      quiz: [
        {
          q: "Your RAG bot confidently answers from outside the provided docs. Best first fix?",
          options: [
            "Use a bigger model",
            "Strengthen grounding: 'answer only from context; say you don't know otherwise'",
            "Increase temperature",
            "Remove the context",
          ],
          answer: 1,
          explain: "Explicit grounding instructions keep the model inside the retrieved context.",
        },
        {
          q: "Answers are wrong because the needed info was never retrieved. That's a problem with:",
          options: ["The generation prompt", "The retrieval step (chunking/search/ranking)", "max_tokens", "Streaming"],
          answer: 1,
          explain: "Missing context is a retrieval failure — fix chunking, search, ranking, or top-k.",
        },
      ],
    },

    {
      slug: "context-management",
      title: "Context management for long runs",
      summary:
        "Caching, compaction, and context editing keep long conversations and agent runs inside the window — cheaply and coherently.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "The context fills up" },
        {
          type: "p",
          text: "Long chatbots and agent runs accumulate history: every turn, every tool result, every retrieved document. Eventually you approach the context window and costs climb. Three complementary techniques manage this — and they pair naturally with RAG and agents.",
        },
        { type: "diagram", name: "context-management", caption: "Three levers: caching reuses the stable prefix, context editing prunes stale blocks, compaction summarizes old history." },
        {
          type: "compare",
          caption: "The three techniques",
          columns: ["Technique", "What it does", "When"],
          rows: [
            { label: "Prompt caching", cells: ["Reuses the stable prefix cheaply (~10% cost on reads).", "Always, when context repeats across requests."] },
            { label: "Context editing", cells: ["Clears stale tool results / thinking blocks from the transcript.", "Long agent runs with many tool calls."] },
            { label: "Compaction", cells: ["Summarizes earlier history into a compact block, server-side.", "Conversations nearing the window limit."] },
          ],
        },
        {
          type: "callout",
          kind: "key",
          title: "Pruning vs. summarizing",
          text: "Context editing PRUNES — it removes stale blocks entirely. Compaction SUMMARIZES — it replaces old history with a shorter summary. They're different tools; many long-running agents use both, plus caching.",
        },
        { type: "h3", text: "Memory for cross-session state" },
        {
          type: "p",
          text: "Caching, editing, and compaction all operate *within* a run. To persist knowledge *across* sessions, use the **memory** tool: Claude reads and writes files in a memory directory that survives restarts. That's how an agent 'remembers' what it learned yesterday.",
        },
        {
          type: "callout",
          kind: "tip",
          title: "Compaction has a gotcha",
          text: "When compaction is on, append the full response content (including the compaction block) back into your messages each turn. Keeping only the text string silently loses the compaction state.",
        },
      ],
      takeaways: [
        "Long runs fill the context window; manage it with caching, context editing, and compaction.",
        "Context editing prunes stale blocks; compaction summarizes old history — different tools, often used together.",
        "Prompt caching always helps when context repeats across requests.",
        "The memory tool persists state across sessions via a files directory that survives restarts.",
      ],
      flashcards: [
        { front: "Context editing vs. compaction?", back: "Editing prunes (removes) stale tool results/thinking; compaction summarizes earlier history into a compact block." },
        { front: "Which technique persists state across sessions?", back: "The memory tool — Claude reads/writes files that survive restarts (not caching/editing/compaction, which are within-run)." },
        { front: "Compaction handling gotcha?", back: "Append the full response content (with the compaction block) back to messages each turn, not just the text — or you lose compaction state." },
      ],
      quiz: [
        {
          q: "An agent run is bloated with hundreds of old tool results. Best lever?",
          options: ["Compaction or context editing to remove/summarize stale blocks", "A bigger max_tokens", "Higher temperature", "Disable tools"],
          answer: 0,
          explain: "Context editing prunes stale tool results; compaction summarizes history — both reclaim window space.",
        },
        {
          q: "You need the agent to remember a fact next week, in a new session. Use:",
          options: ["Prompt caching", "Compaction", "The memory tool (files that persist across sessions)", "A longer system prompt"],
          answer: 2,
          explain: "Only the memory tool persists across sessions; the others operate within a single run.",
        },
      ],
    },
  ],
};
