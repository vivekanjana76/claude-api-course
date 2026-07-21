import type { Accent } from "./types";

export interface PrepConcept {
  /** A prompt phrased as "can you explain / compare …" */
  q: string;
  /** A one-line memory hook for the answer. */
  hint: string;
}

export interface PrepStage {
  id: string;
  phase: string;
  title: string;
  accent: Accent;
  /** Module ids to review for this stage. */
  modules: string[];
  summary: string;
  mustKnow: PrepConcept[];
  /** The single most important idea to walk away with. */
  oneThing: string;
}

/** The connective narrative — the story an interviewer wants to hear you tell. */
export const bigPicture =
  "An AI interview is really four conversations layered on top of each other. First, the fundamentals: can you reason about learning, generalization, and evaluation? Second, the algorithms — classic ML and deep learning — do you know how the models actually work and when to reach for each? Third, modern AI: transformers, LLMs, and how to build reliable systems around them (prompting, RAG, agents). Fourth, engineering and judgment: can you take a model to production, design a system end-to-end, and tell the story of your past work? Prepare across all four and you can adapt to a research-leaning, applied-ML, ML-engineering, or GenAI role — they're the same core, weighted differently.";

export const stages: PrepStage[] = [
  {
    id: "foundations",
    phase: "Phase 1",
    title: "Fundamentals & evaluation",
    accent: "iris",
    modules: ["foundations"],
    summary:
      "Almost every interview screens these first. If you can reason cleanly about learning types, the bias–variance tradeoff, training, and — above all — evaluation, you frame everything after it well.",
    mustKnow: [
      { q: "Contrast supervised, unsupervised, and reinforcement learning.", hint: "Labels→supervised (class vs number); structure→unsupervised; reward→RL. Place the problem first." },
      { q: "Explain the bias–variance tradeoff and how you'd diagnose each.", hint: "Bias=underfit (bad on train+test); variance=overfit (gap). Compare train vs validation error." },
      { q: "Why is accuracy misleading, and what would you use instead?", hint: "Imbalance trap; use precision/recall/F1, AUC/PR-AUC, tied to the cost of each error." },
      { q: "Walk through gradient descent and the role of the learning rate.", hint: "θ:=θ−η∇J; too small stalls, too large diverges; mini-batch + Adam in practice." },
      { q: "What is data leakage and how do you avoid it?", hint: "Test/future info in training; split first, fit transforms on train folds only." },
    ],
    oneThing: "Generalization to unseen data is the whole game — and the metric you judge by, measured honestly, is what proves it.",
  },
  {
    id: "classic",
    phase: "Phase 2",
    title: "Classic ML algorithms",
    accent: "teal",
    modules: ["classic"],
    summary:
      "Tabular problems and 'explain algorithm X' questions dominate applied-ML screens. Know the intuition, assumptions, and tradeoffs of the staples — not just how to call them.",
    mustKnow: [
      { q: "How does logistic regression work, and why the sigmoid?", hint: "Linear score → sigmoid → probability; trained with cross-entropy; interpretable coefficients." },
      { q: "Random forest vs gradient boosting — when each?", hint: "Bagging (parallel, variance↓) vs boosting (sequential, bias↓); boosting usually wins but needs tuning." },
      { q: "How does k-means work and how do you pick k?", hint: "Assign→update centroids; elbow/silhouette; sensitive to scale and init (k-means++)." },
      { q: "What does PCA do and when is it useful?", hint: "Project onto max-variance directions; denoise, visualize, speed up — loses interpretability." },
      { q: "Explain the bias of kNN vs a linear model.", hint: "kNN = low bias/high variance, non-parametric; linear = higher bias, extrapolates, cheap inference." },
    ],
    oneThing: "Pick the simplest model that fits the data's structure; ensembles of trees are the reliable default for tabular data.",
  },
  {
    id: "deeplearning",
    phase: "Phase 3",
    title: "Deep learning",
    accent: "rose",
    modules: ["deeplearning"],
    summary:
      "Expect neural-network internals and training-stability questions. Backprop, activations, optimizers, and regularization are the recurring themes.",
    mustKnow: [
      { q: "Explain backpropagation in plain terms.", hint: "Forward pass computes loss; chain rule propagates gradients backward to every weight." },
      { q: "Why ReLU over sigmoid/tanh in deep nets?", hint: "Avoids vanishing gradients, cheap, sparse activations — the default hidden activation." },
      { q: "What do batch norm and dropout each do?", hint: "BN stabilizes/normalizes activations; dropout regularizes by randomly zeroing neurons." },
      { q: "Vanishing/exploding gradients — cause and fixes.", hint: "Deep chains multiply small/large terms; fix with ReLU, residuals, normalization, clipping." },
      { q: "Why Adam over plain SGD, and the tradeoff?", hint: "Adaptive per-param steps + momentum → fast, robust; SGD+momentum can generalize slightly better." },
    ],
    oneThing: "Deep learning is gradient descent through composed layers — most 'it won't train' problems are gradient-flow or learning-rate issues.",
  },
  {
    id: "nlp",
    phase: "Phase 4",
    title: "NLP & Transformers",
    accent: "iris",
    modules: ["nlp"],
    summary:
      "The architecture behind modern AI. Be able to explain attention and the Transformer from first principles — this is the most-asked topic in 2020s AI interviews.",
    mustKnow: [
      { q: "Explain self-attention with Q, K, V.", hint: "softmax(QKᵀ/√d)·V; each token mixes others weighted by relevance; captures long-range context." },
      { q: "Why did Transformers replace RNNs?", hint: "Parallel over the sequence (no recurrence), better long-range deps, scales to huge data." },
      { q: "What are embeddings and why do they matter?", hint: "Dense vectors where meaning = geometry; enable similarity, transfer, and retrieval." },
      { q: "BERT vs GPT — encoder vs decoder.", hint: "BERT bidirectional (understanding); GPT causal decoder (generation, next-token)." },
      { q: "What is positional encoding for?", hint: "Attention is order-agnostic; positions are injected so the model knows token order." },
    ],
    oneThing: "Self-attention lets every token look at every other in parallel — that single idea unlocked large-scale pretraining.",
  },
  {
    id: "llms",
    phase: "Phase 5",
    title: "LLMs & Generative AI",
    accent: "amber",
    modules: ["llms"],
    summary:
      "Increasingly the whole interview for GenAI roles. Know the training lifecycle and how to build reliable systems around a model you don't control.",
    mustKnow: [
      { q: "Walk through pretraining → SFT → RLHF.", hint: "Predict-next-token → instruction demos → align to human preferences (reward model + PPO/DPO)." },
      { q: "What is RAG and what problem does it solve?", hint: "Retrieve context into the prompt to ground answers — fights hallucination without retraining." },
      { q: "Prompt vs fine-tune vs RAG — how do you choose?", hint: "Prompt for behavior, RAG for knowledge/freshness, fine-tune for style/format at scale." },
      { q: "Why do LLMs hallucinate and how do you reduce it?", hint: "They predict plausible tokens, not truth; ground with retrieval/tools, constrain, and evaluate." },
      { q: "How would you evaluate an LLM feature?", hint: "Task-specific evals, LLM-as-judge with care, human review, guardrails, and offline+online metrics." },
    ],
    oneThing: "You rarely train the LLM — you engineer the system around it: context, retrieval, tools, and evaluation are where quality is won.",
  },
  {
    id: "engineering",
    phase: "Phase 6",
    title: "MLOps & system design",
    accent: "teal",
    modules: ["mlops", "systemdesign"],
    summary:
      "For ML-engineer and senior roles, deploying and designing beats deriving math. Expect an open-ended 'design an ML system for X' and production-reliability questions.",
    mustKnow: [
      { q: "What's your framework for an ML system design question?", hint: "Clarify→metrics→data→features→model (baseline first)→serve/scale→monitor. Think out loud." },
      { q: "What is model drift and how do you detect it?", hint: "Data vs concept drift; monitor input distributions and live quality; trigger retraining (CT)." },
      { q: "Batch vs online vs streaming inference — tradeoffs?", hint: "Latency vs cost vs freshness; precompute vs real-time; feature availability drives it." },
      { q: "How would you A/B test a new model safely?", hint: "Shadow/canary first, then split traffic, guardrail metrics, statistical significance before rollout." },
      { q: "Design a recommendation / search-ranking system.", hint: "Candidate generation → ranking; features, cold start, feedback loops, offline+online metrics." },
    ],
    oneThing: "Production ML is a loop, not a launch: what you tested must be what you ship, and monitoring feeds the next model.",
  },
  {
    id: "behavioral",
    phase: "Phase 7",
    title: "Behavioral & strategy",
    accent: "rose",
    modules: ["behavioral"],
    summary:
      "The part candidates under-prepare and lose offers on. Have crisp, structured stories and thoughtful questions ready — signal that you're someone people want to work with.",
    mustKnow: [
      { q: "Tell me about an ML project you're proud of.", hint: "STAR: problem, your role, decisions & tradeoffs, measurable impact, what you'd change." },
      { q: "Describe a time a model failed in production.", hint: "Ownership, root cause, the fix, and the process/monitoring you added so it can't recur." },
      { q: "How do you prioritize when everything is uncertain?", hint: "Tie to business metric, cheapest-experiment-first, baseline before complexity, communicate tradeoffs." },
      { q: "How do you keep up with a fast-moving field?", hint: "Concrete habits: papers, reproducing results, side projects — show genuine, current curiosity." },
      { q: "What questions do you have for us?", hint: "Ask about data maturity, model lifecycle, team structure, and how success is measured." },
    ],
    oneThing: "Structure every story (STAR), quantify the impact, and own the failures — clarity and judgment read as seniority.",
  },
];

/** 30-second 'explain it to a peer' prompts — rapid self-check across the whole course. */
export const rapidFire: string[] = [
  "Why does more training accuracy not mean a better model?",
  "Given a fraud dataset that's 1% positive, which metric would you optimize and why?",
  "What actually changes in the weights during one gradient-descent step?",
  "In one sentence, what does self-attention compute?",
  "When would you choose RAG over fine-tuning an LLM?",
  "How would you tell if a live model has started to drift?",
  "Why is a strong baseline the most valuable model in a project?",
  "Precision or recall for a cancer screen — and what's the cost of being wrong?",
];
