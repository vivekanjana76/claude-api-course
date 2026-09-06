import type { Module } from "./types";

export const mlops: Module = {
  id: "mlops",
  title: "MLOps & Production",
  blurb:
    "For ML-engineer and senior roles, getting a model to production and keeping it healthy beats deriving math. Serving, monitoring and drift, the production lifecycle, and how to roll out a new model safely.",
  accent: "teal",
  lessons: [
    {
      slug: "serving-and-deployment",
      title: "Serving models in production",
      summary:
        "The gap between a notebook model and a live one — batch vs online vs streaming inference, latency and scale, and the model registry that tracks what's actually deployed.",
      minutes: 10,
      blocks: [
        { type: "p", text: "A model that scores well offline is worth nothing until it's serving predictions reliably. **Deployment** and **serving** are where many ML projects stall, and where ML-engineering interviews spend real time." },
        { type: "h2", text: "Three ways to serve predictions" },
        { type: "compare", caption: "Match the serving pattern to the latency and freshness needs.", columns: ["Pattern", "How", "Use when"], rows: [
          { label: "Batch (offline)", cells: ["Precompute predictions on a schedule, store them", "Recommendations refreshed daily; no need for real-time"] },
          { label: "Online (real-time)", cells: ["A live service returns a prediction per request", "Fraud scoring, search ranking — needs a fresh answer now"] },
          { label: "Streaming", cells: ["React to events continuously", "Real-time features from event streams"] },
        ]},
        { type: "callout", kind: "key", text: "The core tradeoff is latency vs cost vs freshness. Batch is cheap and simple but stale; online is fresh but must meet a latency budget (often tens of milliseconds) under load. Ask 'does this actually need real-time?' — many problems are fine with batch, which is far easier to operate." },
        { type: "h2", text: "What production serving demands" },
        { type: "list", items: [
          "**Latency & throughput** — meet a p99 latency target while handling peak QPS; techniques include model optimization (quantization, distillation), batching requests, and caching.",
          "**Scalability** — autoscale replicas behind a load balancer; GPUs for large models, CPUs where they suffice.",
          "**The training/serving skew trap** — features computed differently in training vs serving silently wreck accuracy. A **feature store** serves the *same* feature logic to both, preventing skew.",
          "**Packaging** — the model plus its preprocessing shipped as one artifact (often a container), so what you tested is what runs.",
        ]},
        { type: "h2", text: "The model registry" },
        { type: "p", text: "A **model registry** (e.g. MLflow) is the versioned source of truth for trained models — each with its metrics, data/code lineage, and stage (staging → production). It's what lets you answer 'which model is live, trained on what, and how do I roll back?' — the ML equivalent of a container registry." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Inference / serving** = using a trained model to make predictions in production. **Latency (p99)** = response time, often measured at the 99th percentile. **QPS** = queries per second. **Quantization** = using lower-precision numbers to shrink/speed a model. **Distillation** = training a small model to mimic a big one. **Training/serving skew** = features differing between training and production. **Model registry** = a versioned store of models and their metadata." },
      ],
      takeaways: [
        "Serving patterns — batch (precomputed, cheap, stale), online (real-time, latency-bound), streaming (event-driven) — trade latency vs cost vs freshness.",
        "Always ask whether a problem truly needs real-time; batch is far simpler to operate when freshness allows.",
        "Production demands latency/throughput targets, autoscaling, and avoiding training/serving skew (a feature store helps).",
        "A model registry versions models with metrics and lineage — the source of truth for what's live and how to roll back.",
      ],
      flashcards: [
        { front: "Batch vs online inference", back: "Batch precomputes predictions on a schedule and stores them — cheap but stale. Online returns a prediction per request in real time — fresh but must meet a latency budget under load." },
        { front: "What is training/serving skew?", back: "When features are computed differently during training vs production serving, silently degrading accuracy. A feature store serving identical logic to both prevents it." },
        { front: "What does a model registry give you?", back: "A versioned source of truth for trained models — metrics, data/code lineage, and deployment stage — so you know what's live, what it was trained on, and how to roll back." },
      ],
      quiz: [
        { q: "A daily-refreshed recommendation list is best served via…", options: ["Online real-time inference", "Batch (precomputed) inference", "Streaming", "It can't be served"], answer: 1, explain: "If freshness of a day is acceptable, batch precomputation is cheaper and simpler than a real-time service." },
        { q: "Training/serving skew is caused by…", options: ["Too many GPUs", "Features computed differently in training vs serving", "A large vocabulary", "High temperature"], answer: 1, explain: "Inconsistent feature logic between training and production quietly breaks accuracy; a feature store keeps them identical." },
        { q: "Quantization and distillation are used mainly to…", options: ["Increase accuracy guarantees", "Reduce model size/latency for serving", "Label data", "Detect drift"], answer: 1, explain: "Both shrink or speed up models so they meet production latency and cost budgets." },
      ],
    },
    {
      slug: "monitoring-and-drift",
      title: "Monitoring & model drift",
      summary:
        "Why a model that was accurate at launch quietly decays — data drift vs concept drift, how to detect them, and the retraining loop that keeps a model healthy.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Unlike normal software, an ML model can be perfectly 'up' — low latency, no errors — while its predictions silently get worse, because the world it learned no longer matches the world it's seeing. Catching that is the point of ML **monitoring**, and **drift** is the reason it decays." },
        { type: "diagram", name: "mlops-loop", caption: "Production ML is a loop: monitoring and new labels feed retraining — continuous training (CT), not a one-time launch." },
        { type: "h2", text: "Two kinds of drift" },
        { type: "compare", caption: "The distinction interviewers want precisely.", columns: ["Type", "What changes", "Example"], rows: [
          { label: "Data drift", cells: ["The input distribution P(X)", "A new user demographic; a sensor recalibrated; more mobile traffic"] },
          { label: "Concept drift", cells: ["The input→output relationship P(y|X)", "Fraud tactics evolve, so the same features now mean something different"] },
        ]},
        { type: "callout", kind: "key", text: "Data drift = the inputs shift; concept drift = the meaning shifts. Data drift you can detect from inputs alone (no labels needed). Concept drift is nastier — the model can look fine on inputs while quietly making worse decisions — and usually needs ground-truth labels to catch." },
        { type: "h2", text: "What to monitor" },
        { type: "list", items: [
          "**Operational metrics** — latency, throughput, error rate (standard software health).",
          "**Input monitoring** — distributions of features vs a training baseline, using tests like population stability index (PSI) or KL divergence to flag data drift.",
          "**Prediction monitoring** — the distribution of the model's outputs (a sudden shift is a red flag).",
          "**Model quality** — live accuracy/precision where labels arrive (even delayed), the ultimate signal of concept drift.",
        ]},
        { type: "callout", kind: "warn", text: "The classic mistake: monitoring only latency and errors. A model can be 100% 'healthy' operationally while its accuracy has collapsed. You must monitor the data and, wherever labels are obtainable, the predictions' quality — not just that the service is running." },
        { type: "h2", text: "Closing the loop: retraining" },
        { type: "p", text: "When drift crosses a threshold, you **retrain** on fresh data and redeploy — ideally automated as **continuous training (CT)**. Deciding *when* to retrain (on a schedule vs triggered by a drift alarm vs by a metric drop) and validating the new model against the current one before promotion is exactly the kind of production judgment senior interviews probe." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Drift** = the world diverging from training data. **Data drift** = shifting inputs P(X). **Concept drift** = shifting input→output relationship P(y|X). **PSI / KL divergence** = statistics that quantify distribution shift. **Ground-truth labels** = the actual outcomes, often arriving with delay. **Continuous training (CT)** = automated retraining pipelines." },
      ],
      takeaways: [
        "A model can be operationally healthy while its predictions silently decay — ML monitoring exists to catch that.",
        "Data drift = inputs shift (detectable without labels); concept drift = the input→output relationship shifts (needs labels, nastier).",
        "Monitor operational metrics, input/prediction distributions (PSI/KL), and live model quality where labels arrive.",
        "Close the loop with retraining — ideally continuous training (CT) — validating the new model before promotion.",
      ],
      flashcards: [
        { front: "Data drift vs concept drift", back: "Data drift: the input distribution P(X) changes (detectable from inputs alone). Concept drift: the relationship P(y|X) changes so the same inputs mean something new (usually needs labels to detect)." },
        { front: "Why isn't monitoring latency and errors enough for ML?", back: "A model can be fully 'up' operationally while its accuracy collapses due to drift. You must also monitor input/output distributions and, where labels exist, live model quality." },
        { front: "What is continuous training (CT)?", back: "Automated retraining pipelines that refresh the model on new data when drift or a metric drop is detected, validating the new model against the current one before promoting it." },
      ],
      quiz: [
        { q: "Fraud tactics evolve so existing features now indicate fraud differently. This is…", options: ["Data drift", "Concept drift", "Training/serving skew", "Overfitting"], answer: 1, explain: "The input→output relationship P(y|X) changed — that's concept drift, typically needing labels to detect." },
        { q: "Which drift can you detect without any labels?", options: ["Concept drift", "Data drift", "Neither", "Both equally"], answer: 1, explain: "Data drift is a shift in the input distribution, detectable by comparing incoming features to a training baseline." },
        { q: "A model shows normal latency and zero errors but its accuracy has dropped. The likely cause is…", options: ["A network outage", "Drift degrading prediction quality", "Too low a learning rate", "Missing positional encodings"], answer: 1, explain: "Operational health doesn't capture prediction quality; drift can degrade accuracy while the service looks fine." },
      ],
    },
    {
      slug: "ml-production-lifecycle",
      title: "The ML production lifecycle",
      summary:
        "What makes MLOps different from DevOps — versioning data as well as code, experiment tracking, reproducibility, and the pipeline that ties it together.",
      minutes: 9,
      blocks: [
        { type: "p", text: "**MLOps** applies DevOps discipline to machine learning, but with a twist: an ML system is defined by **code + data + model**, not just code. That extra dependency reshapes the whole lifecycle and is the crux of 'how is MLOps different from DevOps?'" },
        { type: "h2", text: "Why ML needs more than DevOps" },
        { type: "list", items: [
          "**Data is a dependency.** The same code on different data gives a different model, so you must version datasets, not just code.",
          "**Models decay.** Traditional software doesn't get worse if untouched; models drift, so the lifecycle includes continuous monitoring and retraining.",
          "**Reproducibility is harder.** Reproducing a result needs the exact code, data, hyperparameters, and environment together.",
          "**A third 'CI/CD' — CT.** Alongside continuous integration and delivery, ML adds **continuous training**.",
        ]},
        { type: "diagram", name: "ml-workflow", caption: "The lifecycle is a loop, not a line — monitoring is what closes it." },
        { type: "h2", text: "The pillars of an MLOps setup" },
        { type: "steps", items: [
          { title: "Version everything", text: "Git for code, plus data/model versioning (e.g. DVC) so any result is reproducible from its exact inputs." },
          { title: "Experiment tracking", text: "Log every run's parameters, metrics, and artifacts (MLflow, Weights & Biases) so you can compare and reproduce experiments." },
          { title: "Pipelines", text: "Automate data prep → training → evaluation → deployment as a repeatable pipeline, not manual notebook steps." },
          { title: "Feature store", text: "A central, versioned home for features that serves identical logic to training and production, killing training/serving skew." },
          { title: "CI/CD/CT", text: "Automated testing and deployment of code and models, plus triggered retraining." },
          { title: "Monitoring", text: "Track drift and quality in production, feeding back into retraining (previous lesson)." },
        ]},
        { type: "callout", kind: "key", text: "The one-liner: MLOps = DevOps + data versioning + experiment tracking + model monitoring/retraining. The added complexity all stems from one fact — the model is a product of data, so data and models become first-class, versioned, monitored artifacts alongside code." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**MLOps** = operational practices for ML in production. **Data/model versioning (DVC)** = tracking dataset and model versions like code. **Experiment tracking** = logging runs' params/metrics/artifacts. **Pipeline** = an automated chain of ML steps. **Feature store** = a central serving layer for features. **Reproducibility** = getting the same result from the same code+data+config." },
      ],
      takeaways: [
        "An ML system is code + data + model, so MLOps adds data/model versioning and monitoring on top of DevOps.",
        "Models decay and results are hard to reproduce, so the lifecycle includes experiment tracking and continuous training (CT).",
        "The pillars: version everything, track experiments, automate pipelines, a feature store, CI/CD/CT, and monitoring.",
        "One-liner: MLOps = DevOps + data versioning + experiment tracking + model monitoring/retraining.",
      ],
      flashcards: [
        { front: "How is MLOps different from DevOps?", back: "An ML system depends on data and a trained model, not just code — so MLOps adds data/model versioning, experiment tracking, and model monitoring/retraining (continuous training) on top of DevOps." },
        { front: "Why version data, not just code?", back: "The same code on different data produces a different model. To reproduce or debug a result you need the exact dataset version too — hence tools like DVC." },
        { front: "What is a feature store's role in the lifecycle?", back: "A central, versioned home for features that serves identical feature logic to training and to production serving — eliminating training/serving skew and enabling reuse." },
      ],
      quiz: [
        { q: "The key extra dependency MLOps must manage beyond DevOps is…", options: ["Faster CPUs", "Data (and the resulting model)", "More programming languages", "Larger monitors"], answer: 1, explain: "ML systems are defined by code + data + model, so data and models become versioned, monitored artifacts." },
        { q: "Experiment tracking tools (MLflow, W&B) exist to…", options: ["Serve predictions", "Log run parameters, metrics, and artifacts for comparison/reproducibility", "Replace Git", "Detect drift only"], answer: 1, explain: "They record each run so experiments can be compared and reproduced." },
        { q: "The 'CT' added to CI/CD in ML stands for…", options: ["Continuous testing", "Continuous training", "Container transfer", "Compute throttling"], answer: 1, explain: "Continuous training automates retraining as data changes and drift is detected." },
      ],
    },
    {
      slug: "ab-testing-and-rollout",
      title: "A/B testing & safe rollout",
      summary:
        "Offline metrics don't prove real-world value — how to test a new model on live traffic safely with shadow deployments, canaries, and proper experiment design.",
      minutes: 9,
      blocks: [
        { type: "p", text: "A model that wins on your offline test set can still lose in production — offline metrics are a proxy, and the only truth is live user impact. Knowing how to roll out and **A/B test** a model safely is a hallmark of production maturity." },
        { type: "h2", text: "The rollout ladder" },
        { type: "steps", items: [
          { title: "Shadow deployment", text: "Run the new model alongside the old on real traffic, but don't act on its outputs — just log and compare. Zero user risk; validates behavior and latency at scale." },
          { title: "Canary release", text: "Route a small slice of traffic (say 5%) to the new model, watch guardrail metrics, and ramp up only if healthy." },
          { title: "A/B test", text: "Split traffic between old (control) and new (treatment) and measure the business metric with statistical rigor." },
          { title: "Full rollout", text: "Promote to 100% once the new model wins on the metric that matters — with instant rollback ready." },
        ]},
        { type: "callout", kind: "key", text: "Offline vs online metrics is the crux. Offline (AUC, RMSE) tells you the model predicts well on historical data; online (conversion, revenue, engagement, task success) tells you it actually helps users. They can disagree — a more 'accurate' model can hurt the business metric — which is exactly why you A/B test rather than ship on offline numbers." },
        { type: "h2", text: "Designing a sound A/B test" },
        { type: "list", items: [
          "**One clear primary metric** tied to business value, plus **guardrail metrics** (latency, error rate, revenue) that must not regress.",
          "**Randomized, comparable groups** and enough **sample size / duration** to reach statistical significance — decided *before* you start.",
          "**Watch for pitfalls** — peeking early and stopping when it looks good (inflates false positives), novelty effects, and network effects that break the independence assumption.",
        ]},
        { type: "callout", kind: "tip", text: "Strong answer to 'how would you deploy a new model?': 'Shadow it first to validate safely, then canary to a small traffic slice watching guardrails, then a properly-powered A/B test on the business metric with a pre-registered stopping rule, then full rollout with instant rollback.' It shows you optimize for safety and evidence, not speed." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Shadow deployment** = running a model on live traffic without acting on it. **Canary** = releasing to a small traffic slice first. **A/B test** = a randomized control/treatment comparison. **Control/treatment** = the old and new variants. **Guardrail metric** = a metric that must not regress. **Statistical significance** = confidence the difference is real, not noise. **Peeking** = checking results early, which inflates false positives." },
      ],
      takeaways: [
        "Offline metrics are a proxy; only live user impact (online metrics) proves value — so you A/B test rather than ship on offline numbers.",
        "Roll out safely in stages: shadow (no user risk) → canary (small slice) → A/B test → full rollout, with instant rollback.",
        "A sound A/B test has one primary business metric, guardrails, randomized groups, and a pre-decided sample size/duration.",
        "Beware peeking, novelty effects, and network effects — and never stop early just because it looks good.",
      ],
      flashcards: [
        { front: "Offline vs online metrics — why both?", back: "Offline (AUC, RMSE) shows the model predicts well on historical data; online (conversion, revenue, task success) shows it helps real users. They can disagree, so you validate with a live A/B test." },
        { front: "What is a shadow deployment?", back: "Running the new model on real production traffic but not acting on its outputs — logging and comparing them. It validates behavior and latency at scale with zero user risk before a canary." },
        { front: "Two common A/B testing pitfalls", back: "Peeking (checking results early and stopping when they look good, which inflates false positives) and novelty/network effects that violate the test's assumptions. Fix by pre-registering metric, sample size, and duration." },
      ],
      quiz: [
        { q: "Running a new model on live traffic without acting on its predictions is called…", options: ["Canary release", "Shadow deployment", "A/B test", "Full rollout"], answer: 1, explain: "Shadow deployment logs and compares outputs at scale with zero user risk before any real traffic is routed to it." },
        { q: "You should ultimately decide whether to ship a model based on…", options: ["Offline AUC alone", "The online business metric from an A/B test", "Training loss", "Model size"], answer: 1, explain: "Offline metrics are a proxy; the live business metric is the truth, which is why you A/B test." },
        { q: "Stopping an A/B test early because results 'look good' is dangerous because it…", options: ["Saves too much money", "Inflates false-positive rates (peeking)", "Increases sample size", "Removes guardrails"], answer: 1, explain: "Peeking and early stopping inflate false positives; pre-decide the metric, sample size, and duration." },
      ],
    },
  ],
};
