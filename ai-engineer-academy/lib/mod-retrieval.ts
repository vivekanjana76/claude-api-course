import type { Module } from "./types";

export const retrieval: Module = {
  id: "retrieval",
  title: "Embeddings & retrieval",
  blurb:
    "Turning meaning into vectors, cutting documents into chunks worth retrieving, choosing an index that scales, and combining keyword search with semantic search so both weaknesses cancel.",
  accent: "teal",
  lessons: [
    {
      slug: "embeddings",
      title: "Embeddings: meaning as coordinates",
      summary:
        "What an embedding actually is, how similarity is measured, how to choose an embedding model, and the failure modes that quietly wreck retrieval.",
      minutes: 11,
      blocks: [
        { type: "p", text: "An **embedding** is a list of numbers — typically 256 to 3,072 of them — that represents a piece of text as a point in high-dimensional space, positioned so that **texts with similar meaning land near each other**. That single property is what makes semantic search, clustering, deduplication, and RAG possible." },
        { type: "diagram", name: "embedding-space", caption: "Meaning becomes geometry: nearby points mean similar things, and direction can carry relationships." },
        { type: "callout", kind: "key", text: "Keyword search matches **strings**. Embedding search matches **meaning**. \"How do I cancel my plan?\" retrieves a document titled *Terminating your subscription* with no shared words — and that is the entire reason retrieval systems moved to vectors." },
        { type: "h2", text: "Measuring similarity" },
        { type: "compare", caption: "Three metrics; in practice you'll use the first.", columns: ["Metric", "What it measures", "Notes"], rows: [
          { label: "Cosine similarity", cells: ["Angle between vectors, ignoring magnitude", "The default for text; range −1 to 1, in practice ~0 to 1"] },
          { label: "Dot product", cells: ["Angle and magnitude together", "Equivalent to cosine when vectors are normalised — most models normalise"] },
          { label: "Euclidean (L2)", cells: ["Straight-line distance", "Common in image work; for text, cosine is the convention"] },
        ]},
        { type: "callout", kind: "warn", text: "**Cosine scores are not probabilities and are not comparable across models.** 0.82 might be an excellent match with one model and mediocre with another. Never hard-code a similarity threshold you haven't calibrated against labelled data from your own corpus — this is one of the most common bugs in production RAG." },
        { type: "code", lang: "python", caption: "Embedding, normalising, and searching — the whole idea in twenty lines", code: `import numpy as np

def embed(texts: list[str]) -> np.ndarray:
    """Any provider's embedding endpoint. Batch aggressively — it's much
    cheaper and faster than one call per document."""
    vectors = np.array(embedding_client.create(input=texts).vectors)
    # normalise so dot product == cosine similarity
    return vectors / np.linalg.norm(vectors, axis=1, keepdims=True)

docs = ["Cancelling your subscription", "Upgrading your plan", "Server regions"]
D = embed(docs)

q = embed(["how do I stop being billed?"])[0]
scores = D @ q                      # cosine, because everything is normalised
order  = np.argsort(-scores)

for i in order:
    print(f"{scores[i]:.3f}  {docs[i]}")
# 0.71  Cancelling your subscription     <- no shared keywords at all
# 0.38  Upgrading your plan
# 0.09  Server regions`},
        { type: "h2", text: "Choosing an embedding model" },
        { type: "list", items: [
          "**Domain fit beats leaderboard rank.** A general model can be poor on legal citations, medical coding, or your internal product names. Test on *your* corpus with real queries.",
          "**Dimensions trade quality for cost.** More dimensions capture more nuance and cost more to store and search. 768–1536 is the common sweet spot; **Matryoshka** embeddings let you truncate a single vector to a smaller size and keep most of the quality.",
          "**Check the max input length.** Many embedding models cap around 512 tokens — feeding a 2,000-token chunk silently truncates it, and you index the first paragraph while believing you indexed the page.",
          "**Multilingual matters if your users do.** A model strong in English can collapse distinctions in other languages, making everything look similar.",
          "**Asymmetric models want asymmetric input.** Many models expect a prefix such as `query:` and `passage:` — omitting it measurably degrades results. Read the model card.",
          "**Migration is a full reindex.** Vectors from different models are meaningless to compare, so switching model means re-embedding the whole corpus. Budget for it.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Embedding / vector** = a numeric representation of meaning. **Dimensionality** = how many numbers per vector. **Cosine similarity** = closeness by angle. **Normalisation** = scaling a vector to length 1 so dot product equals cosine. **Bi-encoder** = encodes query and document separately, so documents can be indexed in advance (fast). **Cross-encoder** = encodes query and document together for a much better score, but can't be pre-indexed (slow). **Matryoshka embeddings** = vectors trained so a truncated prefix is still a usable embedding. **Semantic search** = retrieval by meaning rather than exact terms." },
        { type: "h2", text: "What embeddings are bad at" },
        { type: "compare", caption: "The failures that surprise teams.", columns: ["Weakness", "Example", "Mitigation"], rows: [
          { label: "Exact identifiers", cells: ["Order `INV-90412`, error `E4032`, a SKU", "Hybrid search — keyword handles these natively"] },
          { label: "Negation", cells: ["\"contracts without a renewal clause\" ≈ \"contracts with a renewal clause\"", "Metadata filters and structured queries, not similarity"] },
          { label: "Numeric & date comparison", cells: ["\"invoices over $10,000 last quarter\"", "Filter in SQL/metadata; retrieval can't do arithmetic"] },
          { label: "Rare jargon and acronyms", cells: ["Internal project codenames", "Fine-tuned embeddings, or a glossary expansion step"] },
          { label: "Very long text", cells: ["A whole contract in one vector", "Chunking — one vector cannot represent 40 pages"] },
        ]},
        { type: "callout", kind: "key", text: "The takeaway that drives the next three lessons: **embeddings are excellent at \"about the same thing\" and poor at \"exactly this thing\".** Production retrieval therefore combines vector search with keyword search and metadata filters, then reranks." },
        { type: "h2", text: "Beyond search" },
        { type: "list", items: [
          "**Deduplication** — near-identical documents cluster tightly; a similarity threshold catches copies keyword matching misses.",
          "**Clustering & topic discovery** — group support tickets to find what people actually complain about.",
          "**Classification features** — embed once, train a small logistic regression; often beats prompting a model per item and costs a fraction.",
          "**Anomaly detection** — flag inputs far from anything in your corpus, a useful signal for out-of-scope questions.",
          "**Semantic caching** — if a new query is close enough to a previous one, serve the cached answer.",
        ]},
      ],
      takeaways: [
        "An embedding places text in high-dimensional space so similar meanings are near each other; cosine similarity is the standard metric for text.",
        "Similarity scores are not probabilities and don't transfer across models — calibrate thresholds on your own labelled data.",
        "Choose the embedding model on domain fit, dimensions, max input length, language coverage, and required query/passage prefixes.",
        "Embeddings are weak on exact IDs, negation, and numeric comparison — which is why hybrid search and metadata filters exist.",
        "Changing embedding model means re-embedding the entire corpus.",
      ],
      flashcards: [
        { front: "Why is cosine similarity the default for text embeddings?", back: "It compares direction while ignoring magnitude, so document length doesn't dominate the score. With normalised vectors, dot product gives the same result more cheaply." },
        { front: "Is a cosine score of 0.85 a good match?", back: "Unanswerable without context. Scores aren't probabilities and don't transfer between models — calibrate a threshold against labelled examples from your own corpus." },
        { front: "Bi-encoder vs cross-encoder", back: "A bi-encoder embeds query and document independently, so documents can be indexed ahead of time — fast, used for retrieval. A cross-encoder processes the pair together for a far better relevance score — slow, used for reranking a shortlist." },
        { front: "What happens if a chunk exceeds the embedding model's input limit?", back: "It's silently truncated. You index only the beginning while believing you indexed the whole chunk — a classic invisible retrieval bug." },
        { front: "What are Matryoshka embeddings?", back: "Embeddings trained so that truncating the vector to fewer dimensions still yields a usable embedding — letting you trade storage and search cost against quality without re-embedding." },
      ],
      quiz: [
        { q: "Users search by order number and get irrelevant results. Best fix?", options: ["A better embedding model", "Hybrid search with keyword matching, or a metadata filter on order ID", "More chunk overlap", "Higher temperature"], answer: 1, explain: "Exact identifiers are precisely where embeddings are weakest — `INV-90412` and `INV-90413` are near-identical in vector space. Lexical search or an exact metadata filter handles them properly." },
        { q: "You switch to a newer embedding model. What must happen?", options: ["Nothing, vectors are compatible", "Re-embed and reindex the entire corpus", "Only re-embed new documents", "Increase the similarity threshold"], answer: 1, explain: "Different models produce incomparable vector spaces. Mixing them silently destroys retrieval quality, so a model change is always a full reindex." },
        { q: "\"Show contracts without an auto-renewal clause\" returns contracts *with* one. Why?", options: ["The index is corrupt", "Embeddings represent topic, not negation", "The chunks are too small", "Cosine is the wrong metric"], answer: 1, explain: "Both phrasings are about auto-renewal clauses, so they sit close together. Negation needs structured filtering or an LLM verification step over retrieved candidates — similarity can't express it." },
      ],
    },
    {
      slug: "chunking-and-indexing",
      title: "Chunking & the ingestion pipeline",
      summary:
        "The unglamorous stage where most RAG quality is won or lost — parsing documents, cutting them sensibly, attaching metadata, and keeping the index fresh.",
      minutes: 12,
      blocks: [
        { type: "p", text: "Retrieval can only return what you indexed, in the shape you indexed it. **Chunking is the highest-leverage and most neglected decision in RAG** — teams spend weeks tuning prompts to compensate for chunks that were split mid-sentence in week one." },
        { type: "h2", text: "Why chunk at all" },
        { type: "list", items: [
          "**Embedding limits** — most models cap input length, so a whole document doesn't fit in one vector.",
          "**Precision** — one vector for 40 pages is a blurry average of everything; a vector per section is specific.",
          "**Context budget** — you want to insert the paragraph that answers the question, not the manual containing it.",
          "**Attribution** — smaller units give citations that point somewhere a human can actually check.",
        ]},
        { type: "diagram", name: "chunking-strategies", caption: "Four strategies on the same document. Structure-aware chunking is almost always the right default." },
        { type: "h2", text: "Strategies, from worst to best" },
        { type: "compare", caption: "What each does to retrieval quality.", columns: ["Strategy", "How it splits", "Verdict"], rows: [
          { label: "Fixed characters", cells: ["Every N characters", "Cuts mid-sentence and mid-table; the baseline everyone starts with and should leave"] },
          { label: "Fixed tokens + overlap", cells: ["N tokens with 10–20% overlap", "Acceptable default when documents have no structure"] },
          { label: "Recursive / separator-aware", cells: ["Split on paragraphs, then sentences, then words as needed", "Good general-purpose choice"] },
          { label: "Structure-aware", cells: ["Follow headings, sections, list items, table boundaries", "Best for docs, wikis, and manuals — respects the author's own units of meaning"] },
          { label: "Semantic", cells: ["Split where embedding similarity between adjacent sentences drops", "Sometimes better, always slower and harder to debug"] },
          { label: "Late chunking / contextual", cells: ["Embed with full-document context, or prepend a generated summary of where the chunk sits", "State of the art for quality; costs an extra pass at ingest"] },
        ]},
        { type: "callout", kind: "key", text: "**Chunk on the document's own structure whenever it has one.** A heading, a section, a table, a list item, a function definition — these are units the author already decided were coherent. Fixed-size splitting throws that information away for nothing." },
        { type: "h2", text: "Size and overlap" },
        { type: "compare", caption: "Rules of thumb worth starting from, then measuring.", columns: ["Content", "Chunk size", "Overlap"], rows: [
          { label: "FAQs, support articles", cells: ["200–400 tokens", "Little or none — entries are self-contained"] },
          { label: "Technical documentation", cells: ["400–800 tokens", "10–15%"] },
          { label: "Contracts, policy, legal", cells: ["500–1,000 tokens, on clause boundaries", "15–20% — cross-references matter"] },
          { label: "Source code", cells: ["Whole function or class", "None — use structural boundaries"] },
          { label: "Chat transcripts", cells: ["A turn window, or a topic segment", "1–2 turns"] },
        ]},
        { type: "callout", kind: "tip", text: "The **small-to-big** pattern is the best of both: embed and search over *small* chunks for precision, but return the *parent* section to the model for context. You get accurate retrieval and a coherent passage — and it fixes most \"the right chunk was found but the answer was still incomplete\" complaints." },
        { type: "h2", text: "Metadata is half the system" },
        { type: "p", text: "Every chunk should carry the structured fields you'll want to filter and cite on. Metadata filtering usually improves retrieval quality more than any embedding-model upgrade, because it removes whole categories of wrong answers before similarity is even considered." },
        { type: "code", lang: "python", caption: "A chunk record worth storing", code: `chunk = {
    "id": "policy-2026-h1#sec-4.2#0",
    "text": "...",                       # what gets embedded
    "embedding": [...],

    # --- filtering: cuts the candidate set before similarity ---
    "tenant_id": "acme",                 # NEVER omit in multi-tenant systems
    "source_type": "policy",
    "effective_from": "2026-01-01",
    "effective_to": None,
    "acl_groups": ["finance", "legal"],  # enforce at query time, not after
    "language": "en",

    # --- provenance: what you cite and how you refresh ---
    "doc_id": "policy-2026-h1",
    "doc_title": "Expense Policy 2026 H1",
    "section_path": ["Travel", "Air travel", "Booking class"],
    "url": "https://intranet/policies/2026-h1#4.2",
    "page": 12,
    "content_hash": "sha256:9f2b...",    # skip re-embedding unchanged chunks
    "indexed_at": "2026-08-11T09:14:00Z",
}`},
        { type: "callout", kind: "warn", text: "**Permissions must be enforced in the query, not after retrieval.** Filtering results post-hoc means the model already saw documents the user isn't allowed to see, and a summary can leak them. Push `tenant_id` and ACL groups into the vector search filter itself — this is the single most common security defect in enterprise RAG." },
        { type: "h2", text: "The ingestion pipeline" },
        { type: "steps", items: [
          { title: "Parse", text: "PDFs, HTML, Office docs, and scans into clean text with structure preserved. Layout-aware parsing (or a vision model on hard pages) beats naive text extraction dramatically — a mangled table poisons every chunk derived from it." },
          { title: "Clean", text: "Strip navigation, headers/footers, cookie banners, and boilerplate. Junk text dilutes the embedding of everything around it." },
          { title: "Chunk", text: "Structure-aware, with size and overlap chosen per source type — not one global setting for the whole corpus." },
          { title: "Enrich", text: "Attach metadata; optionally prepend a one-line \"this section is from X, about Y\" context header; optionally generate hypothetical questions the chunk answers." },
          { title: "Embed & index", text: "Batch the calls, store the content hash, and write vectors plus metadata transactionally so the index never half-updates." },
          { title: "Keep fresh", text: "Incremental updates keyed on content hash; deletes must actually delete. A stale index is worse than no index because it's confidently wrong." },
          { title: "Evaluate", text: "A retrieval eval set — query, expected chunk IDs — run in CI. Re-run it on every chunking change; that's the only way you'll know a 'small tweak' halved recall." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Chunk** = a retrievable unit of text. **Overlap** = tokens shared between adjacent chunks so a sentence spanning a boundary isn't lost. **Recursive splitting** = trying progressively finer separators until chunks fit. **Small-to-big / parent-document retrieval** = search small chunks, return their larger parent. **Contextual retrieval** = prepending generated context to each chunk before embedding, which materially raises recall. **Ingestion pipeline** = parse → clean → chunk → enrich → embed → index. **Content hash** = a fingerprint used to skip re-embedding unchanged content." },
        { type: "h2", text: "How to actually pick your settings" },
        { type: "p", text: "Don't argue about chunk size in a meeting. Build a small retrieval eval set — 50–100 real questions with the chunk IDs that should be retrieved — then sweep the settings and measure **recall@k**. An afternoon of this beats a quarter of prompt tuning, and it produces a number you can defend." },
      ],
      takeaways: [
        "Chunking is where most RAG quality is won or lost — prompt tuning cannot fix badly cut chunks.",
        "Chunk on the document's own structure when it has one; fixed-size splitting is a fallback, not a default.",
        "Small-to-big retrieval gives precise search with coherent context returned to the model.",
        "Metadata (tenant, ACLs, dates, source, section path) drives filtering, citation, and freshness — and ACLs must be enforced inside the query.",
        "Pick chunk size and overlap by sweeping recall@k on a real retrieval eval set, not by argument.",
      ],
      flashcards: [
        { front: "What is small-to-big (parent-document) retrieval?", back: "Embed and search small chunks for precision, but return the larger parent section to the model so the answer has coherent context." },
        { front: "Why must ACL filtering happen inside the vector query?", back: "Filtering after retrieval means the model already saw restricted documents, and its answer can leak them. The filter has to cut the candidate set before similarity ranking." },
        { front: "What is contextual retrieval?", back: "Prepending a short generated description of where a chunk sits in its document before embedding it, so the vector carries context the chunk text alone lacks. It measurably raises recall for a one-time ingest cost." },
        { front: "How do you choose chunk size?", back: "Build a retrieval eval set of real questions with expected chunk IDs, sweep sizes and overlaps, and measure recall@k. It's an afternoon of work and it settles the argument with data." },
        { front: "Why store a content hash per chunk?", back: "So incremental re-indexing can skip unchanged content — you only re-embed what actually changed, which makes frequent refreshes affordable." },
      ],
      quiz: [
        { q: "Retrieval returns the right document but answers miss details from the following paragraph. Best fix?", options: ["Smaller chunks", "Small-to-big retrieval, or more overlap", "A different embedding model", "Lower the similarity threshold"], answer: 1, explain: "The retrieval unit was correct but the returned context was too narrow. Return the parent section, or add overlap so boundary-spanning content survives." },
        { q: "Which metadata field is non-negotiable in a multi-tenant RAG system?", options: ["indexed_at", "tenant_id, enforced as a query filter", "page number", "language"], answer: 1, explain: "Without tenant isolation inside the query itself, one customer's documents can be retrieved and summarised for another. It's the defining security requirement of enterprise RAG." },
        { q: "Your PDF pipeline produces chunks with scrambled table rows. What should you change?", options: ["Increase chunk overlap", "Use layout-aware parsing (or a vision model) at the parse stage", "Lower chunk size", "Switch vector databases"], answer: 1, explain: "Garbage in, garbage indexed. Chunking parameters can't repair a bad parse — fix extraction before anything downstream." },
      ],
    },
    {
      slug: "vector-databases",
      title: "Vector databases & ANN indexes",
      summary:
        "How approximate nearest-neighbour search actually works, the parameters that trade recall against speed, and how to choose between pgvector and a dedicated store.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Comparing a query vector against every stored vector — an **exact** or brute-force search — is perfectly fine up to a few hundred thousand chunks. Beyond that you need an **ANN (approximate nearest neighbour)** index, which trades a small amount of recall for orders of magnitude more speed." },
        { type: "diagram", name: "ann-index", caption: "HNSW: a navigable small-world graph searched coarse-to-fine, from sparse upper layers down to the dense base." },
        { type: "h2", text: "The index families" },
        { type: "compare", caption: "What you'll meet in practice.", columns: ["Index", "Idea", "Strengths", "Costs"], rows: [
          { label: "Flat / brute force", cells: ["Compare against everything", "Perfect recall, trivially correct, instant updates", "Linear in corpus size"] },
          { label: "HNSW", cells: ["Multi-layer proximity graph, navigated greedily", "Excellent recall/latency; the default almost everywhere", "High memory; build time grows with data"] },
          { label: "IVF (inverted file)", cells: ["Cluster vectors, search only the nearest clusters", "Lower memory, fast build", "Needs training; recall depends on how many clusters you probe"] },
          { label: "PQ / quantized", cells: ["Compress vectors into codes", "Huge memory savings at large scale", "Lossy — recall drops, usually paired with a rescoring pass"] },
          { label: "DiskANN / disk-based", cells: ["Graph index that lives on SSD", "Billions of vectors without billions in RAM", "Higher latency than in-memory"] },
        ]},
        { type: "h2", text: "The parameters that actually matter" },
        { type: "list", items: [
          "**HNSW `m`** — edges per node. Higher means better recall and more memory. 16 is a common default; 32–48 for high-recall needs.",
          "**HNSW `ef_construction`** — search effort while building. Higher builds slower but produces a better graph. 100–200 is typical.",
          "**HNSW `ef_search`** — candidates explored per query, tunable **at query time**. This is your live recall/latency dial: raise it when quality matters, lower it under load.",
          "**IVF `nlist` / `nprobe`** — how many clusters exist, and how many you search. `nprobe` is IVF's equivalent live dial.",
          "**Rescoring** — with quantized indexes, retrieve a wider candidate set with compressed vectors, then rescore the top few hundred with full-precision vectors. Recovers most of the lost recall cheaply.",
        ]},
        { type: "callout", kind: "key", text: "Almost every ANN failure story is the same story: **nobody measured recall against exact search.** Take 200 real queries, compute exact top-10 with brute force, and check what fraction your index returns. If it's 0.85, you are silently losing 15% of correct answers — and no amount of prompt engineering will get them back." },
        { type: "h2", text: "Filtering is the hard part" },
        { type: "p", text: "Real queries are rarely \"find similar text\" — they're \"find similar text **that this user may see, from this tenant, still in effect**\". How a store combines filtering with ANN determines whether that's fast and correct." },
        { type: "compare", caption: "Three approaches, very different behaviour.", columns: ["Approach", "How it works", "Problem"], rows: [
          { label: "Post-filter", cells: ["ANN first, discard non-matching results", "Highly selective filters return almost nothing — you asked for 10 and got 1"] },
          { label: "Pre-filter", cells: ["Restrict the candidate set, then search", "Can degenerate to a scan if the subset is large"] },
          { label: "Filtered ANN", cells: ["Filter evaluated during graph traversal", "The right answer; support and quality vary by engine — test it"] },
        ]},
        { type: "callout", kind: "warn", text: "Test filtered search at *your* selectivity. A store that's brilliant on unfiltered benchmarks can return badly incomplete results when a filter matches 0.1% of the corpus — which is exactly what a per-tenant filter does in a large multi-tenant index." },
        { type: "h2", text: "pgvector or a dedicated vector database?" },
        { type: "compare", caption: "The decision most teams face on day one.", columns: ["Factor", "pgvector (Postgres)", "Dedicated vector DB"], rows: [
          { label: "Operational cost", cells: ["A database you already run, back up, and monitor", "Another system, another on-call surface"] },
          { label: "Joins & transactions", cells: ["Native — vectors alongside your relational data and ACLs", "Usually needs a second lookup and its own consistency story"] },
          { label: "Filtering", cells: ["Full SQL WHERE, mature planner", "Varies widely by engine; often a subset"] },
          { label: "Scale ceiling", cells: ["Comfortable into the tens of millions of vectors with tuning", "Purpose-built for hundreds of millions and beyond"] },
          { label: "Built-in extras", cells: ["You assemble hybrid search yourself (though Postgres has full-text built in)", "Hybrid search, reranking, and sharding often included"] },
        ]},
        { type: "callout", kind: "tip", text: "**Default to pgvector if you already run Postgres.** One system, real transactions, real joins to your permissions tables, and full SQL filtering. Move to a dedicated store when you have measured a specific problem — scale, latency at high QPS, or a needed feature — not because a vector database feels more appropriate." },
        { type: "code", lang: "sql", caption: "pgvector: HNSW index, ACL filter, and a query-time recall dial", code: `CREATE TABLE chunks (
  id          bigserial PRIMARY KEY,
  doc_id      text NOT NULL,
  tenant_id   text NOT NULL,
  acl_groups  text[] NOT NULL,
  effective   daterange NOT NULL,
  content     text NOT NULL,
  embedding   vector(1536) NOT NULL
);

-- cosine distance; keep m/ef_construction with the index, ef_search per query
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

-- filters that must cut the candidate set, not the result set
CREATE INDEX ON chunks (tenant_id);
CREATE INDEX ON chunks USING gin (acl_groups);

SET hnsw.ef_search = 100;   -- raise for recall, lower for latency

SELECT id, doc_id, content, 1 - (embedding <=> $1) AS similarity
FROM   chunks
WHERE  tenant_id = $2
  AND  acl_groups && $3::text[]
  AND  effective @> CURRENT_DATE
ORDER  BY embedding <=> $1      -- <=> is cosine distance
LIMIT  20;`},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**ANN** (Approximate Nearest Neighbour) = fast similarity search that trades a little recall for a lot of speed. **HNSW** (Hierarchical Navigable Small World) = the dominant graph-based ANN index. **IVF** = inverted-file index using clustering. **PQ** (Product Quantization) = compressing vectors into short codes to save memory. **recall@k** = the fraction of true top-k results your index actually returns. **QPS** = queries per second. **Pre-filter / post-filter** = applying metadata filters before or after the ANN search." },
        { type: "h2", text: "Operational realities" },
        { type: "list", items: [
          "**Memory is the constraint.** Roughly: vectors alone are dimensions × 4 bytes each; 10M × 1536 dims ≈ 61 GB before the graph overhead HNSW adds on top.",
          "**Deletes are often tombstones.** Graph indexes don't reclaim space immediately; plan periodic rebuilds or compaction.",
          "**Index builds are expensive.** Building HNSW over tens of millions of vectors takes hours — plan reindexes (including embedding-model migrations) as maintenance events with a dual-write or shadow-index strategy.",
          "**Back up the source, not just the index.** You can always rebuild vectors from documents; you cannot rebuild documents from vectors.",
        ]},
      ],
      takeaways: [
        "Brute force is fine to a few hundred thousand vectors; beyond that ANN indexes trade a little recall for large speed gains.",
        "HNSW is the default; ef_search (or IVF's nprobe) is a live recall/latency dial you can tune per query.",
        "Always measure recall against exact search on real queries — silent recall loss is the most common ANN failure.",
        "Filtered search behaviour at your selectivity matters more than headline benchmarks, especially for per-tenant filters.",
        "Default to pgvector when you already run Postgres; move to a dedicated store when a measured problem demands it.",
      ],
      flashcards: [
        { front: "What does HNSW's ef_search control?", back: "How many candidates the graph traversal explores per query — the query-time recall/latency dial. Raise it for quality, lower it under load; it needs no reindex." },
        { front: "Why is post-filtering dangerous?", back: "The ANN search runs first and the filter discards results afterwards, so a selective filter can leave you with far fewer than k results — you ask for 10 and get 1. Filtering must cut the candidate set." },
        { front: "How do you know your ANN index is losing results?", back: "Compute exact top-k with brute force on ~200 real queries and compare against your index's results. That ratio is recall@k; anything below ~0.95 is quietly costing you answers." },
        { front: "When should you leave pgvector for a dedicated vector database?", back: "When you've measured a specific problem — corpus scale beyond comfortable tuning, latency at high QPS, or a required feature — not on general principle." },
        { front: "Roughly how much RAM do 10M 1536-dim float32 vectors need?", back: "About 61 GB for the raw vectors (10M × 1536 × 4 bytes), plus graph overhead for HNSW on top. Quantization is how you make that affordable." },
      ],
      quiz: [
        { q: "Adding a tenant filter makes your vector search return only 2 results instead of 20. Most likely cause?", options: ["The embedding model changed", "Post-filtering after ANN retrieval", "ef_search is too high", "Too many dimensions"], answer: 1, explain: "The ANN search returned 20 globally, then the filter removed 18 belonging to other tenants. You need pre-filtering or filtered ANN so the search happens within the permitted set." },
        { q: "Search is fast but users report missing obvious documents. What do you check first?", options: ["Prompt wording", "Recall@k against exact brute-force search", "Model temperature", "The chunk overlap"], answer: 1, explain: "Fast plus incomplete is the signature of an under-tuned ANN index. Measure recall against exact search before touching anything downstream." },
        { q: "You already run Postgres and have 2M chunks with per-user ACLs. Best default?", options: ["A dedicated vector DB for performance", "pgvector with HNSW and SQL filters", "In-memory FAISS in the app process", "A graph database"], answer: 1, explain: "2M vectors is comfortable for pgvector, and keeping vectors next to your ACL tables gives correct, transactional filtering with no extra system to operate." },
      ],
    },
    {
      slug: "hybrid-search-and-reranking",
      title: "Hybrid search & reranking",
      summary:
        "Combining keyword and vector search so their weaknesses cancel, fusing the results, then reranking with a cross-encoder — the biggest quality win available for the least effort.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Vector search finds things that are *about* the same topic. Keyword search finds things that contain *exactly this string*. Each fails where the other succeeds, which is why serious retrieval systems run both and fuse the results — then rerank the shortlist with a model that can afford to be slow because it only sees 50 candidates." },
        { type: "diagram", name: "hybrid-rerank", caption: "Retrieve wide from two systems, fuse, rerank precisely, and send only a handful of passages to the model." },
        { type: "h2", text: "Why hybrid wins" },
        { type: "compare", caption: "Complementary failure modes.", columns: ["Query", "Vector search", "Keyword (BM25)"], rows: [
          { label: "\"how do I stop being billed?\"", cells: ["Finds \"Cancelling your subscription\" ✓", "Misses — no shared terms ✗"] },
          { label: "\"error E4032\"", cells: ["Returns vaguely similar error docs ✗", "Exact hit ✓"] },
          { label: "\"CVE-2026-1337\"", cells: ["Near-identical to every other CVE ✗", "Exact hit ✓"] },
          { label: "\"our refund window for EU customers\"", cells: ["Finds the policy section ✓", "Depends heavily on wording ~"] },
          { label: "internal codename \"Project Falcon\"", cells: ["Weak — rare token, poor representation ✗", "Exact hit ✓"] },
        ]},
        { type: "callout", kind: "key", text: "**BM25 is not legacy technology.** It is a strong, cheap, interpretable baseline that beats embeddings outright on identifiers, rare terms, and exact phrases. Hybrid retrieval is close to free quality — the most reliable single upgrade for a mediocre RAG system." },
        { type: "h2", text: "Fusing two ranked lists" },
        { type: "p", text: "Vector scores and BM25 scores live on incompatible scales, so you can't simply add them. Two standard approaches:" },
        { type: "list", items: [
          "**Reciprocal Rank Fusion (RRF)** — combine by *rank*, not score: each document scores `Σ 1/(k + rank)` across the lists, with k ≈ 60. No calibration, no tuning, works immediately. This is the default.",
          "**Weighted score fusion** — normalise each score set (min-max or z-score) and blend, e.g. `0.7 × vector + 0.3 × bm25`. Slightly better when tuned on your data; needs re-tuning whenever either system changes.",
        ]},
        { type: "code", lang: "python", caption: "Reciprocal Rank Fusion — the whole algorithm", code: `def rrf(rankings: list[list[str]], k: int = 60, top_n: int = 50) -> list[str]:
    """rankings: several ranked lists of doc IDs (vector, bm25, ...)."""
    scores: dict[str, float] = {}
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)[:top_n]

candidates = rrf([
    vector_search(query, limit=50),
    bm25_search(query,   limit=50),
])
# now rerank these 50 — precision work on a small set`},
        { type: "h2", text: "Reranking: precision on a shortlist" },
        { type: "p", text: "Retrieval optimises **recall** — get the right passage into the candidate set somewhere. Reranking optimises **precision** — get it to position 1. A **cross-encoder** reranker reads the query and each candidate *together*, which is far more accurate than comparing two independently computed vectors, and affordable precisely because it only runs on 25–100 candidates." },
        { type: "compare", caption: "Two stages, two jobs.", columns: ["Stage", "Model", "Sees", "Cost"], rows: [
          { label: "Retrieval", cells: ["Bi-encoder + BM25", "Query and documents separately, documents pre-indexed", "Milliseconds over millions"] },
          { label: "Reranking", cells: ["Cross-encoder (or an LLM)", "Query and candidate together", "Tens of ms over ~50 candidates"] },
        ]},
        { type: "callout", kind: "tip", text: "The standard shape: **retrieve 50, rerank to 5–10, send those to the model.** Retrieving 5 directly is worse *and* cheaper only in the trivial sense — you save nothing meaningful and you lose the answers ranked 6–50. Retrieve wide, then narrow hard." },
        { type: "h2", text: "Query-side techniques" },
        { type: "compare", caption: "Improve the query before you touch the index.", columns: ["Technique", "What it does", "When it pays"], rows: [
          { label: "Query rewriting", cells: ["Rewrite a follow-up into a standalone question using conversation history", "Any multi-turn chat — \"what about for Europe?\" is unsearchable alone"] },
          { label: "Query expansion", cells: ["Add synonyms, expand acronyms, include domain glossary terms", "Jargon-heavy corpora"] },
          { label: "Multi-query", cells: ["Generate 3–5 phrasings, retrieve for each, fuse with RRF", "Ambiguous or broad questions"] },
          { label: "HyDE", cells: ["Have the model write a hypothetical answer and embed *that*", "Short queries against long, verbose documents"] },
          { label: "Decomposition", cells: ["Split a compound question into sub-questions, retrieve per part", "\"Compare X and Y\" — one retrieval can't serve both"] },
        ]},
        { type: "callout", kind: "warn", text: "Every query-side technique adds a model call before retrieval — latency and cost, on the critical path, before the user sees anything. Apply them selectively (only on follow-ups, only when the first retrieval scores poorly), not on every request by default." },
        { type: "h2", text: "Measuring retrieval on its own" },
        { type: "p", text: "Evaluate retrieval **separately from generation**. If you only measure final answer quality, you can't tell whether a bad answer came from missing context or bad reasoning — and you'll tune the wrong component for weeks." },
        { type: "list", items: [
          "**recall@k** — is the correct chunk anywhere in the top k? The metric that decides whether the answer is even *possible*.",
          "**MRR / nDCG** — how highly the correct chunk ranks. This is what reranking improves.",
          "**Precision@k** — how much of what you sent was actually relevant. Low precision wastes context and dilutes attention.",
          "**Coverage** — for multi-part questions, did you retrieve material for *every* part?",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**BM25** = the standard keyword-ranking function, scoring by term frequency and rarity. **Sparse vs dense retrieval** = keyword (sparse vectors) vs embedding (dense vectors). **Hybrid search** = running both and fusing. **RRF** (Reciprocal Rank Fusion) = combining ranked lists by rank position. **Cross-encoder** = a model scoring query and document jointly for reranking. **HyDE** (Hypothetical Document Embeddings) = embedding a generated hypothetical answer instead of the raw query. **MMR** (Maximal Marginal Relevance) = re-ranking for diversity so you don't return five copies of the same passage. **nDCG** = a ranking-quality metric that rewards putting the right result higher." },
        { type: "h2", text: "A retrieval stack worth copying" },
        { type: "steps", items: [
          { title: "Rewrite the query if the turn is a follow-up", text: "Standalone, self-contained, with pronouns resolved." },
          { title: "Retrieve 50 by vector and 50 by BM25, filtered by tenant and ACL", text: "Filters inside the query, always." },
          { title: "Fuse with RRF", text: "No calibration needed, and robust to either system having an off day." },
          { title: "Rerank with a cross-encoder to the top 5–10", text: "The largest single quality jump most RAG systems can make." },
          { title: "Apply MMR if the results are redundant", text: "Five paraphrases of the same paragraph waste the context window." },
          { title: "Assemble with citations and a relevance floor", text: "If the best reranked score is below threshold, say you don't know rather than answering from weak evidence." },
        ]},
      ],
      takeaways: [
        "Vector and keyword search fail in complementary ways — hybrid retrieval is the cheapest large quality win in RAG.",
        "Fuse ranked lists with RRF by default; weighted score fusion needs calibration and re-tuning.",
        "Retrieve wide (≈50) then rerank with a cross-encoder to 5–10: recall first, precision second.",
        "Query rewriting, expansion, multi-query, HyDE, and decomposition help — but they add latency, so apply them selectively.",
        "Measure retrieval independently with recall@k, nDCG/MRR, precision@k, and coverage, or you'll tune the wrong component.",
      ],
      flashcards: [
        { front: "Why not just add BM25 and cosine scores together?", back: "They're on incompatible scales with different distributions. Use Reciprocal Rank Fusion, which combines by rank position and needs no calibration." },
        { front: "What is a cross-encoder reranker?", back: "A model that reads the query and a candidate document together and scores their relevance directly. Much more accurate than comparing separate embeddings, and affordable because it only runs on a shortlist." },
        { front: "What does HyDE do?", back: "Has the model write a hypothetical answer to the query, then embeds that instead of the query — helpful when short questions must match long, verbose documents." },
        { front: "recall@k vs nDCG — which does reranking improve?", back: "Reranking improves nDCG/MRR (ordering within the candidate set). It cannot improve recall@k — if retrieval never surfaced the right chunk, reranking can't invent it." },
        { front: "Why measure retrieval separately from answer quality?", back: "Otherwise you can't tell whether a bad answer came from missing context or bad generation — and you'll spend weeks tuning the component that wasn't broken." },
      ],
      quiz: [
        { q: "A user searches for error code 'E4032' and gets unrelated troubleshooting pages. Fix?", options: ["Better chunking", "Add BM25 keyword search and fuse with RRF", "Increase k", "Use a bigger embedding model"], answer: 1, explain: "Rare exact tokens are where embeddings are weakest and BM25 is strongest. Hybrid retrieval fixes this class of query outright." },
        { q: "In a chat, a user asks 'what about for enterprise customers?'. What must happen before retrieval?", options: ["Increase temperature", "Rewrite the query into a standalone question using the conversation", "Retrieve more chunks", "Skip retrieval"], answer: 1, explain: "The follow-up is meaningless without context — embedding it retrieves noise. Query rewriting into a self-contained question is mandatory for multi-turn RAG." },
        { q: "Retrieval recall@50 is 0.94 but answers are still weak, and the right chunk is usually ranked ~30th. What's missing?", options: ["A larger context window", "A cross-encoder reranker", "More aggressive chunking", "A different vector database"], answer: 1, explain: "Recall is fine — ordering is the problem. Reranking a 50-candidate shortlist promotes the right passage into the handful you actually send to the model." },
      ],
    },
  ],
};
