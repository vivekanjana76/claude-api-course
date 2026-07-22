import type { Module } from "./types";

export const responsible: Module = {
  id: "responsible",
  title: "Responsible AI",
  blurb:
    "Increasingly asked across every AI role, and essential in regulated industries. How models become unfair and how to measure it, how to explain black-box predictions, and the privacy and security risks — especially for LLMs — that you must design against.",
  accent: "rose",
  lessons: [
    {
      slug: "fairness-and-bias",
      title: "Fairness & bias in ML",
      summary:
        "How models inherit and amplify bias, the competing mathematical definitions of fairness (and why you can't satisfy them all), and how to mitigate it.",
      minutes: 10,
      blocks: [
        { type: "p", text: "As ML makes decisions about loans, hiring, and healthcare, **fairness** has become a real interview topic — especially at large or regulated companies. The core message: a model that's accurate overall can still be systematically unfair to some groups, and you need to detect and address that." },
        { type: "h2", text: "Where bias comes from" },
        { type: "p", text: "Models don't invent bias — they learn it from data and choices. The main sources:" },
        { type: "list", items: [
          "**Historical / label bias** — the training data reflects past discrimination (e.g. a hiring model trained on decisions that favored one group learns to repeat them).",
          "**Sampling / representation bias** — some groups are under-represented, so the model performs worse for them (a face system trained mostly on light-skinned faces).",
          "**Measurement / proxy bias** — a feature stands in for a protected attribute (ZIP code proxying for race), so 'removing race' doesn't remove the bias.",
          "**Feedback-loop bias** — the model's own decisions shape future data (predictive policing sending patrols where it already predicted crime).",
        ]},
        { type: "callout", kind: "warn", text: "The naive fix — 'just remove the protected attribute' (fairness through unawareness) — usually fails, because other features act as proxies for it. Interviewers probe this: dropping 'gender' won't help if 'college' or purchase history correlates with it. You have to measure outcomes across groups, not just hide the label." },
        { type: "h2", text: "Competing definitions of fairness" },
        { type: "p", text: "There's no single definition of 'fair,' and the main ones can conflict:" },
        { type: "diagram", name: "fairness-metrics", caption: "The same model can hit different true- and false-positive rates across groups — the core fairness problem." },
        { type: "compare", caption: "Common group-fairness criteria.", columns: ["Definition", "Requires", "Tension"], rows: [
          { label: "Demographic parity", cells: ["Equal positive-prediction rates across groups", "May force different treatment of truly different groups"] },
          { label: "Equalized odds", cells: ["Equal true- and false-positive rates across groups", "Hard to hit alongside calibration"] },
          { label: "Equal opportunity", cells: ["Equal true-positive (recall) across groups", "A relaxation of equalized odds"] },
          { label: "Calibration", cells: ["A given score means the same thing per group", "Often incompatible with equalized odds"] },
        ]},
        { type: "callout", kind: "key", text: "The impossibility result is the sophisticated point to raise: except in trivial cases, you cannot simultaneously satisfy calibration and equalized odds when base rates differ across groups. So 'fairness' is a choice about which definition matters for the context and the harm involved — not a box you tick. Naming this tradeoff signals real maturity." },
        { type: "h2", text: "Mitigation" },
        { type: "list", items: [
          "**Pre-processing** — rebalance or reweight the training data to reduce representation gaps.",
          "**In-processing** — add fairness constraints or penalties to the training objective.",
          "**Post-processing** — adjust decision thresholds per group to equalize the chosen metric.",
          "**Process** — audit with fairness metrics across groups, document with model cards, and keep humans in the loop for high-stakes decisions.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Protected attribute** = a legally/ethically sensitive feature (race, gender, age). **Proxy** = a feature correlated with a protected attribute. **Demographic parity** = equal positive rates across groups. **Equalized odds** = equal true/false-positive rates across groups. **Calibration** = a score means the same probability across groups. **Fairness through unawareness** = the (weak) idea of just dropping the protected attribute." },
      ],
      takeaways: [
        "Models inherit bias from data: historical/label, sampling/representation, measurement/proxy, and feedback-loop bias.",
        "'Just remove the protected attribute' fails because other features proxy for it — you must measure outcomes across groups.",
        "Fairness has competing definitions (demographic parity, equalized odds, equal opportunity, calibration) that can't all hold at once (the impossibility result).",
        "Mitigate via pre-/in-/post-processing plus process: audit with fairness metrics, model cards, and human oversight.",
      ],
      flashcards: [
        { front: "Why doesn't removing the protected attribute make a model fair?", back: "Other features act as proxies (ZIP code for race, purchase history for gender), so the bias persists. 'Fairness through unawareness' is weak — you must measure and address outcomes across groups." },
        { front: "Name two conflicting fairness definitions", back: "Equalized odds (equal true/false-positive rates across groups) and calibration (a score means the same per group). The impossibility result shows you generally can't satisfy both when base rates differ." },
        { front: "Three technical points to mitigate bias", back: "Pre-processing (reweight/rebalance data), in-processing (fairness constraints in training), and post-processing (per-group thresholds) — plus auditing, model cards, and human oversight." },
      ],
      quiz: [
        { q: "A model trained on historically biased hiring decisions will tend to…", options: ["Correct the past bias", "Learn and repeat the bias", "Be automatically fair", "Ignore the labels"], answer: 1, explain: "Models learn the patterns in their training data, including historical discrimination encoded in the labels." },
        { q: "Dropping the 'race' feature to ensure fairness often fails because…", options: ["The model needs it for accuracy", "Other features act as proxies for it", "It's illegal", "It reduces variance"], answer: 1, explain: "Correlated features (like ZIP code) proxy for the protected attribute, so bias persists — you must measure group outcomes." },
        { q: "The 'impossibility result' in fairness says you generally can't simultaneously satisfy…", options: ["Accuracy and recall", "Calibration and equalized odds (with differing base rates)", "Precision and F1", "Bias and variance"], answer: 1, explain: "Except in trivial cases, calibration and equalized odds are mathematically incompatible when group base rates differ." },
      ],
    },
    {
      slug: "explainability",
      title: "Explainability & interpretability",
      summary:
        "Why 'the model said so' isn't enough — interpretable vs black-box models, and the SHAP and LIME techniques for explaining any prediction.",
      minutes: 9,
      blocks: [
        { type: "p", text: "In high-stakes and regulated settings you often must explain *why* a model made a decision — to build trust, debug, satisfy regulation (a right to explanation), and catch bias. **Explainability** (also called interpretability or XAI) is how, and it's a growing interview theme." },
        { type: "h2", text: "Interpretable vs black-box models" },
        { type: "p", text: "There's a rough tradeoff between how powerful a model is and how easily a human can understand it:" },
        { type: "compare", caption: "The interpretability spectrum.", columns: ["", "Interpretable (glass-box)", "Black-box"], rows: [
          { label: "Examples", cells: ["Linear/logistic regression, a shallow tree", "Deep nets, gradient-boosted ensembles, LLMs"] },
          { label: "You can read…", cells: ["Coefficients / the decision path directly", "Not directly — need post-hoc explanations"] },
          { label: "Tradeoff", cells: ["Transparent but sometimes less accurate", "Often more accurate but opaque"] },
        ]},
        { type: "callout", kind: "tip", text: "A mature stance: prefer an inherently interpretable model when the stakes are high and the accuracy gap is small — you don't always need a black box. Reach for post-hoc explanations when a complex model's performance genuinely justifies the opacity. 'Interpretable-first, explain-if-necessary' is a strong line." },
        { type: "h2", text: "The two techniques to know: SHAP and LIME" },
        { type: "p", text: "Both are **model-agnostic post-hoc** methods — they explain any trained model without changing it, by attributing a prediction to the input features." },
        { type: "list", items: [
          "**LIME** (Local Interpretable Model-agnostic Explanations) — to explain one prediction, it perturbs the input many times, sees how the output changes, and fits a simple interpretable model (like a linear one) *locally* around that point. Fast and intuitive, but the explanation can be unstable.",
          "**SHAP** (SHapley Additive exPlanations) — grounded in cooperative game theory, it fairly attributes the prediction among the features as **Shapley values**, with strong consistency guarantees (contributions sum to the prediction). More principled and stable, but more compute-heavy.",
        ]},
        { type: "callout", kind: "key", text: "The one-line contrast: LIME fits a simple local surrogate model around a single prediction (fast, approximate); SHAP uses game-theoretic Shapley values to fairly divide the prediction among features (principled, consistent, but costlier). Both are local and model-agnostic; SHAP also aggregates into global feature importance." },
        { type: "p", text: "Simpler tools still matter too: **feature importance** from tree models, **partial dependence plots** (how the prediction changes as one feature varies), and for images, **saliency maps** highlighting influential pixels." },
        { type: "callout", kind: "warn", text: "Caveat worth stating: post-hoc explanations are approximations of a black box, not ground truth — they can mislead, and two methods can disagree. They're for insight and debugging, not a guarantee of what the model 'really' did. For truly critical decisions, an interpretable model is safer." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Interpretability/XAI** = understanding why a model predicts what it does. **Glass-box vs black-box** = inherently readable vs opaque models. **Post-hoc** = explaining a model after training, without changing it. **Model-agnostic** = works for any model type. **Shapley value** = a game-theoretic fair attribution of a payout among contributors. **Saliency map** = a heatmap of influential input pixels." },
      ],
      takeaways: [
        "Explainability builds trust, aids debugging, satisfies regulation, and helps catch bias.",
        "There's an interpretability↔accuracy tradeoff: prefer glass-box models (linear, shallow trees) when stakes are high and the accuracy gap is small.",
        "SHAP (game-theoretic Shapley values — principled, consistent, costlier) and LIME (local surrogate model — fast, approximate) explain any model post-hoc.",
        "Post-hoc explanations are approximations, not ground truth — use them for insight, and prefer interpretable models for critical decisions.",
      ],
      flashcards: [
        { front: "SHAP vs LIME in one line", back: "LIME fits a simple interpretable model locally around one prediction (fast, approximate, can be unstable). SHAP uses game-theoretic Shapley values to fairly attribute the prediction to each feature (principled, consistent, costlier)." },
        { front: "What does 'model-agnostic post-hoc' mean?", back: "The explanation method works on any already-trained model without modifying it, treating it as a black box and analyzing inputs vs outputs — like SHAP and LIME." },
        { front: "The interpretability–accuracy tradeoff", back: "Simple models (linear, shallow trees) are transparent but sometimes less accurate; complex models (deep nets, ensembles, LLMs) are often more accurate but opaque, needing post-hoc explanations." },
      ],
      quiz: [
        { q: "SHAP values are based on…", options: ["Neural network gradients only", "Cooperative game theory (Shapley values)", "Random sampling of labels", "Clustering"], answer: 1, explain: "SHAP fairly attributes a prediction among features using Shapley values from cooperative game theory, with consistency guarantees." },
        { q: "LIME explains a prediction by…", options: ["Retraining the model", "Fitting a simple interpretable model locally around that input", "Removing features permanently", "Using a bigger network"], answer: 1, explain: "LIME perturbs the input and fits a simple local surrogate model to approximate the black box near that point." },
        { q: "A key caveat about post-hoc explanations is that they…", options: ["Are always exactly correct", "Are approximations that can mislead or disagree", "Require labels", "Only work on linear models"], answer: 1, explain: "They approximate a black box and can be unstable or conflicting — useful for insight, not a guarantee of the model's true reasoning." },
      ],
    },
    {
      slug: "privacy-and-llm-security",
      title: "Privacy, security & LLM safety",
      summary:
        "The risks you must design against — training-data privacy leaks, and the LLM-specific attacks (prompt injection, jailbreaks, data leakage) that every GenAI engineer is now expected to know.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Responsible AI isn't only fairness — it's protecting people's data and defending the system against misuse. With LLMs now in production, **security** questions have become standard in GenAI interviews. Knowing the attack surface sets you apart." },
        { type: "h2", text: "Privacy" },
        { type: "list", items: [
          "**Memorization & leakage** — large models can memorize and regurgitate training data, including personal information; a real risk if you train on sensitive data.",
          "**PII handling** — personally identifiable information must be minimized, anonymized, or removed; know that anonymization can be reversed via linkage attacks.",
          "**Differential privacy** — a formal guarantee: add calibrated noise so no single individual's data measurably changes the output, bounding what can be learned about any one person. The principled way to train on sensitive data.",
          "**Federated learning** — train across devices without centralizing raw data (the model comes to the data), reducing exposure.",
        ]},
        { type: "h2", text: "LLM-specific security risks" },
        { type: "p", text: "LLMs introduce a new attack surface that classic ML doesn't have. The ones to name:" },
        { type: "compare", caption: "The top LLM security risks (OWASP-style).", columns: ["Risk", "What it is", "Defense"], rows: [
          { label: "Prompt injection", cells: ["Malicious instructions in user input or retrieved content hijack the model", "Separate/label untrusted input, least privilege, output validation"] },
          { label: "Jailbreaking", cells: ["Crafted prompts bypass safety guardrails", "Robust alignment, input/output filters, red-teaming"] },
          { label: "Sensitive-data disclosure", cells: ["The model reveals secrets or PII in context/training", "Don't put secrets in context; scrub outputs"] },
          { label: "Insecure output handling", cells: ["Trusting LLM output that then runs code / SQL", "Treat output as untrusted; sandbox and validate"] },
        ]},
        { type: "callout", kind: "key", text: "Prompt injection is the signature LLM vulnerability, and the key insight is that the model can't reliably tell instructions from data — everything is just text in the context. Indirect prompt injection is especially nasty: a malicious instruction hidden in a web page or document your RAG system retrieves can hijack the model. Defenses are defense-in-depth (least privilege for tools, validating outputs, isolating untrusted content), not a single fix." },
        { type: "callout", kind: "warn", text: "Never trust an LLM's output blindly in a system that acts on it. If the model's text is passed to a shell, database, or another tool, treat it like untrusted user input — validate and sandbox — or an injection becomes remote code execution. This is 'insecure output handling'." },
        { type: "h2", text: "Governance & the wrap-up" },
        { type: "p", text: "Beyond specific attacks, responsible deployment means **governance**: documenting models and datasets (**model cards**, **datasheets**), guardrails and content filters, human oversight for consequential actions, monitoring for misuse, and awareness of regulation (the EU AI Act's risk tiers, GDPR's data rights). You don't need to be a lawyer — showing you *think* about these signals maturity." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**PII** = personally identifiable information. **Differential privacy** = a formal noise-based guarantee bounding what's learnable about any individual. **Federated learning** = training without centralizing raw data. **Prompt injection** = malicious instructions smuggled into an LLM's context. **Jailbreak** = bypassing safety guardrails. **Model card** = a document describing a model's intended use, performance, and limitations. **Red-teaming** = adversarially probing a system for failures." },
      ],
      takeaways: [
        "Privacy risks: models can memorize and leak training data; handle PII carefully (anonymization can be reversed), and use differential privacy or federated learning for sensitive data.",
        "LLMs add a new attack surface: prompt injection, jailbreaking, sensitive-data disclosure, and insecure output handling.",
        "Prompt injection is the signature risk — the model can't separate instructions from data; indirect injection via retrieved content is especially dangerous. Defend in depth.",
        "Never act on LLM output without validation; wrap deployment in governance — model cards, guardrails, human oversight, and regulatory awareness.",
      ],
      flashcards: [
        { front: "What is prompt injection and why is it hard to fully prevent?", back: "Malicious instructions smuggled into an LLM's context (via user input or retrieved content) that hijack its behavior. It's hard to stop because the model can't reliably distinguish instructions from data — everything is text. Defense is layered: least privilege, isolating untrusted input, validating output." },
        { front: "What is differential privacy?", back: "A formal guarantee that adds calibrated noise so that no single individual's data measurably changes the model's output — bounding what can be learned about any one person. The principled way to train on sensitive data." },
        { front: "Why must you validate LLM output before acting on it?", back: "If the output is passed to a shell, database, or tool, an attacker's prompt injection can turn into code/command execution ('insecure output handling'). Treat LLM output as untrusted input — validate and sandbox." },
      ],
      quiz: [
        { q: "The signature security risk unique to LLM applications is…", options: ["SQL injection only", "Prompt injection", "Buffer overflow", "Overfitting"], answer: 1, explain: "Prompt injection smuggles malicious instructions into the model's context; the model can't reliably separate instructions from data." },
        { q: "Differential privacy protects individuals by…", options: ["Encrypting the model", "Adding calibrated noise so any one person's data barely affects the output", "Deleting all data", "Using a bigger model"], answer: 1, explain: "It bounds how much the output can depend on any single individual's data, giving a formal privacy guarantee." },
        { q: "If an LLM's output is executed as a database query, you should…", options: ["Trust it since the model is smart", "Treat it as untrusted input and validate/sandbox it", "Skip validation for speed", "Log it only"], answer: 1, explain: "Insecure output handling turns prompt injection into code execution — always validate and sandbox LLM output that drives actions." },
      ],
    },
  ],
};
