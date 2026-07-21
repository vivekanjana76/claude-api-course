import type { Module } from "./types";

export const systemdesign: Module = {
  id: "systemdesign",
  title: "ML System Design",
  blurb:
    "The open-ended 'design an ML system for X' round that senior and ML-engineer interviews hinge on. A repeatable framework, the feature and data thinking underneath, and worked designs for recommendations and search.",
  accent: "iris",
  lessons: [
    {
      slug: "system-design-framework",
      title: "A framework for ML design questions",
      summary:
        "'Design a system to recommend videos' is a test of structured thinking, not trivia. A step-by-step framework so you never freeze and always cover what interviewers score.",
      minutes: 11,
      blocks: [
        { type: "p", text: "The ML **system design** round is deliberately open-ended: 'design a spam filter,' 'design a feed ranker.' Interviewers aren't looking for one right answer — they're scoring whether you can structure ambiguity, make and justify tradeoffs, and think end-to-end. A framework keeps you from freezing and ensures you hit every dimension they grade." },
        { type: "diagram", name: "system-design-framework", caption: "A repeatable path: clarify → metrics → data → features → model → serve/scale → monitor." },
        { type: "h2", text: "The steps" },
        { type: "steps", items: [
          { title: "1 · Clarify & scope", text: "Never start designing immediately. Ask about the goal, users, scale (QPS, data volume), latency budget, and constraints. Reframe the vague ask into a concrete ML problem. This is the most-failed and most-rewarded step." },
          { title: "2 · Define success metrics", text: "Both offline (AUC, precision@k) and — crucially — online business metrics (engagement, revenue, retention). State how you'd A/B test. Tie the model to business value." },
          { title: "3 · Data", text: "What data exists? How do you get labels (explicit, implicit feedback, or none — needing a cold-start plan)? Consider volume, freshness, and bias." },
          { title: "4 · Features", text: "What signals predict the target? User, item, context, and interaction features. Flag leakage and how features are served without training/serving skew." },
          { title: "5 · Model", text: "Start with a simple baseline (heuristic or logistic regression), then justify added complexity. Discuss the loss and why the model suits the data." },
          { title: "6 · Serve & scale", text: "Online vs batch, latency, the two-stage retrieval→ranking pattern for large candidate sets, caching, and cost." },
          { title: "7 · Monitor & iterate", text: "Drift, feedback loops, retraining, and guardrails. Close the loop." },
        ]},
        { type: "callout", kind: "key", text: "Two habits that separate strong candidates: (1) always clarify before designing — a minute of questions prevents solving the wrong problem; (2) always start with a simple baseline and earn complexity. Jumping straight to 'a deep neural network' without a baseline is a red flag." },
        { type: "callout", kind: "tip", text: "Think out loud and manage the whiteboard like a conversation. State assumptions explicitly ('I'll assume 10M users and a 100ms budget'), name tradeoffs as you make them, and check in ('does that scope sound right?'). The process is what's being graded, not a memorized architecture." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**QPS** = queries per second (a scale measure). **Offline vs online metrics** = model-quality proxies vs live business impact. **Implicit feedback** = signals like clicks/watch-time used as labels. **Cold start** = having no data on a new user/item. **Two-stage (retrieval→ranking)** = cheaply narrow candidates, then rank precisely. **Latency budget** = the time you're allowed per request." },
      ],
      takeaways: [
        "ML design questions test structured thinking and tradeoffs, not a memorized answer — a framework keeps you complete and calm.",
        "The path: clarify & scope → metrics (offline + online) → data & labels → features → model (baseline first) → serve/scale → monitor.",
        "Always clarify before designing, and always start with a simple baseline before adding complexity.",
        "Think out loud, state assumptions, and name tradeoffs — the process is what's graded.",
      ],
      flashcards: [
        { front: "What's the first thing to do in an ML system design question?", back: "Clarify and scope — ask about the goal, users, scale, latency budget, and constraints, and reframe the vague ask into a concrete ML problem. Don't start designing immediately." },
        { front: "Name the ML system design framework steps", back: "Clarify & scope → define metrics (offline + online) → data & labels → features → model (baseline first) → serve & scale → monitor & iterate." },
        { front: "Why start with a simple baseline in a design answer?", back: "It sets a bar to beat, is fast to ship, and often does surprisingly well. Jumping straight to a complex deep model without a baseline signals poor judgment." },
      ],
      quiz: [
        { q: "The most commonly under-done (and most rewarded) step is…", options: ["Choosing a deep model", "Clarifying requirements and scope first", "Writing code", "Picking a GPU"], answer: 1, explain: "Clarifying the goal, scale, and constraints prevents solving the wrong problem — interviewers reward it heavily." },
        { q: "For a large candidate set (e.g. millions of items), the standard serving pattern is…", options: ["Score every item with the heavy model", "Two-stage retrieval then ranking", "Random selection", "Batch only"], answer: 1, explain: "Cheaply retrieve a few hundred candidates, then apply a precise ranking model — the two-stage pattern." },
        { q: "Success metrics in a design answer should include…", options: ["Only offline AUC", "Both offline metrics and online business metrics", "Only model size", "Only latency"], answer: 1, explain: "Offline metrics prove predictive quality; online business metrics (via A/B test) prove real value." },
      ],
    },
    {
      slug: "features-and-data",
      title: "Feature engineering & data thinking",
      summary:
        "Models are only as good as their features and labels. The engineering that often matters more than model choice — and the data traps interviewers probe.",
      minutes: 9,
      blocks: [
        { type: "p", text: "On most real problems — especially tabular ones — **feature engineering** and data quality move the needle more than swapping models. Interviewers dig here because it separates people who've shipped from people who've only run notebooks." },
        { type: "h2", text: "Where features come from" },
        { type: "list", items: [
          "**User features** — demographics, history, aggregates (e.g. average past rating).",
          "**Item features** — attributes, popularity, age.",
          "**Context features** — time of day, device, location.",
          "**Interaction features** — combinations and cross-features that capture 'this user × this item' affinity.",
        ]},
        { type: "p", text: "Common transformations: **scaling/normalization** for distance- and gradient-based models, **encoding** categoricals (one-hot for low cardinality, embeddings or target encoding for high), **binning**, and handling **missing values** thoughtfully (imputation vs a 'missing' indicator, since missingness itself can be signal)." },
        { type: "h2", text: "The data traps interviewers probe" },
        { type: "compare", caption: "Data problems that sink real ML systems.", columns: ["Trap", "What it is", "Fix"], rows: [
          { label: "Data leakage", cells: ["A feature reveals the label or uses future info", "Only use data available at prediction time; split before transforming"] },
          { label: "Imbalanced classes", cells: ["The positive class is rare (fraud)", "Right metrics (PR-AUC), resampling, class weights"] },
          { label: "Cold start", cells: ["No history for a new user/item", "Content features, popularity fallback, onboarding signals"] },
          { label: "Feedback loops", cells: ["The model shapes the data it later trains on", "Log un-shown items, add exploration, monitor"] },
          { label: "Selection bias", cells: ["Training data isn't representative", "Understand collection; reweight or fix sampling"] },
        ]},
        { type: "callout", kind: "warn", text: "Leakage is the number-one silent killer and the most probed data trap. The test for any feature: 'Would this value actually be available, as-is, at the moment of prediction?' A feature computed using information from after the event — or a target-derived aggregate leaking across the split — gives amazing offline scores that vanish in production." },
        { type: "callout", kind: "key", text: "Feedback loops are the subtle one that impresses interviewers. A recommender only logs clicks on items it *showed*, so it trains on its own past choices and can get stuck in a bubble. Mitigations — logging unshown candidates, adding exploration, and monitoring diversity — show you think about systems, not just models." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Feature engineering** = crafting input signals from raw data. **One-hot / target encoding** = ways to turn categories into numbers. **Cross-feature** = a combination capturing interaction between two features. **Imputation** = filling missing values. **Feedback loop** = the model influencing its own future training data. **Selection bias** = training data not representing the real population." },
      ],
      takeaways: [
        "Feature engineering and data quality often matter more than model choice, especially on tabular problems.",
        "Features come from user, item, context, and interaction signals; transform via scaling, encoding, binning, and missing-value handling.",
        "The big data traps: leakage (test each feature for prediction-time availability), imbalance, cold start, feedback loops, and selection bias.",
        "Feedback loops — a model training on data it shaped — are the subtle, systems-level trap worth raising unprompted.",
      ],
      flashcards: [
        { front: "The one-question test for data leakage", back: "'Would this feature's value actually be available, as-is, at the moment of prediction?' If it uses future information or is derived from the label across the split, it leaks." },
        { front: "What is the cold-start problem and how do you handle it?", back: "No historical data for a new user or item. Fall back to content/attribute features, popularity baselines, and onboarding signals until interaction data accumulates." },
        { front: "What is a feedback loop in an ML system?", back: "The model influences the data it later trains on — e.g. a recommender only sees clicks on items it chose to show, reinforcing its own biases. Mitigate with exploration, logging unshown items, and diversity monitoring." },
      ],
      quiz: [
        { q: "The most common silent cause of great offline but poor production performance is…", options: ["Too few GPUs", "Data leakage", "Low temperature", "Small vocabulary"], answer: 1, explain: "Leakage lets future/label information into training, inflating offline scores that collapse when the feature isn't really available at prediction time." },
        { q: "A brand-new user with no history is an example of…", options: ["Concept drift", "The cold-start problem", "Overfitting", "Data leakage"], answer: 1, explain: "No interaction data exists yet, so you fall back to content features, popularity, or onboarding signals." },
        { q: "A recommender training only on clicks of items it showed can suffer from…", options: ["A feedback loop", "Vanishing gradients", "Quantization", "Positional encoding issues"], answer: 0, explain: "It trains on data shaped by its own past choices — a feedback loop — mitigated with exploration and logging unshown items." },
      ],
    },
    {
      slug: "recommendation-and-ranking",
      title: "Designing recommenders & ranking",
      summary:
        "The most common system-design prompt, worked end-to-end — collaborative vs content-based filtering, the two-stage retrieval→ranking architecture, and how to handle scale and cold start.",
      minutes: 10,
      blocks: [
        { type: "p", text: "'Design a recommendation system' (feed, videos, products) is the most frequent ML design prompt. It exercises the whole framework, so a solid mental template pays off." },
        { type: "h2", text: "Two classic approaches" },
        { type: "compare", caption: "The foundational recommender strategies.", columns: ["Approach", "Idea", "Strength / weakness"], rows: [
          { label: "Content-based", cells: ["Recommend items similar to what a user liked, using item features", "Handles new items; but narrow, no serendipity"] },
          { label: "Collaborative filtering", cells: ["'Users like you liked…' from the user-item interaction matrix", "Finds surprising picks; but cold-start on new users/items"] },
          { label: "Hybrid", cells: ["Combine both (most real systems)", "Balances their weaknesses — the practical default"] },
        ]},
        { type: "p", text: "Classic collaborative filtering uses **matrix factorization** — decompose the sparse user-item matrix into user and item **embeddings** whose dot product predicts affinity. Modern systems learn these embeddings with neural networks and add rich features." },
        { type: "h2", text: "The two-stage architecture" },
        { type: "p", text: "You can't score millions of items with a heavy model per request, so production recommenders split the job — the single most important design point to state:" },
        { type: "diagram", name: "system-design-framework", caption: "Apply the framework; the serving step for recommenders is the two-stage retrieval → ranking pattern." },
        { type: "steps", items: [
          { title: "Candidate generation (retrieval)", text: "Cheaply narrow millions of items to a few hundred plausible ones — e.g. approximate nearest-neighbor search over embeddings. Optimizes recall and speed." },
          { title: "Ranking", text: "Apply a richer model (often gradient-boosted trees or a neural net) with many features to precisely order those few hundred. Optimizes precision at the top." },
          { title: "Re-ranking / business logic", text: "Apply diversity, freshness, and rules (don't repeat, respect policy) before showing the final list." },
        ]},
        { type: "callout", kind: "key", text: "State the two-stage pattern explicitly: retrieval trades precision for speed to shrink the candidate set; ranking spends compute where it matters on a small set. It's the answer to 'how does this scale to millions of items with a tight latency budget?'" },
        { type: "h2", text: "Rounding it out" },
        { type: "list", items: [
          "**Cold start** — new users get popularity-based or onboarding-driven recs; new items get content-based exposure until they gather interactions.",
          "**Metrics** — offline: precision@k, recall@k, NDCG (rank-aware). Online: click-through rate, watch-time/engagement, retention — validated by A/B test.",
          "**Feedback loops & diversity** — add exploration so the system doesn't collapse into a narrow bubble.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Collaborative filtering** = recommending from user-item interaction patterns. **Content-based** = recommending by item features. **Matrix factorization** = learning user/item embeddings whose dot product predicts affinity. **Candidate generation** = cheap retrieval of a shortlist. **NDCG** = a rank-aware ranking metric. **ANN search** = approximate nearest-neighbor retrieval over embeddings." },
      ],
      takeaways: [
        "Recommenders combine content-based (item features, handles new items) and collaborative filtering (interaction patterns, finds surprises) — hybrids are the practical default.",
        "Collaborative filtering often uses matrix factorization: user/item embeddings whose dot product predicts affinity.",
        "Production recommenders are two-stage: cheap candidate generation (retrieval) then a rich ranking model — the key to scaling to millions of items.",
        "Handle cold start (popularity/content fallbacks), use rank-aware metrics (NDCG) validated by A/B tests, and add exploration for diversity.",
      ],
      flashcards: [
        { front: "Content-based vs collaborative filtering", back: "Content-based recommends items similar to ones a user liked (uses item features, handles new items but is narrow). Collaborative filtering uses 'users like you' interaction patterns (finds serendipitous picks but suffers cold start). Hybrids combine them." },
        { front: "Why are production recommenders two-stage?", back: "You can't run a heavy model over millions of items per request. Candidate generation cheaply retrieves a few hundred (recall/speed), then a rich ranking model precisely orders them (precision) — scaling within a latency budget." },
        { front: "What does matrix factorization learn?", back: "User and item embedding vectors whose dot product approximates the affinity in the sparse user-item interaction matrix — the classic collaborative-filtering method." },
      ],
      quiz: [
        { q: "The two-stage recommender architecture is…", options: ["Train then test", "Candidate generation (retrieval) then ranking", "Encoder then decoder", "Batch then streaming"], answer: 1, explain: "Cheap retrieval narrows millions of items to a shortlist; a richer ranking model then orders that shortlist precisely." },
        { q: "Collaborative filtering struggles most with…", options: ["Popular items", "Cold start (new users/items with no interactions)", "Large embeddings", "Ranking metrics"], answer: 1, explain: "With no interaction history, collaborative filtering has nothing to go on — hence content-based/popularity fallbacks." },
        { q: "A rank-aware offline metric for recommenders is…", options: ["Accuracy", "NDCG", "MSE", "Latency"], answer: 1, explain: "NDCG rewards placing relevant items higher in the ranked list, unlike order-agnostic metrics." },
      ],
    },
  ],
};
