import type { Module } from "./types";

export const foundations: Module = {
  id: "foundations",
  title: "Foundations",
  blurb:
    "What an AI Engineer actually does, how a language model really works under the hood, the 2026 model landscape, and the reference stack every GenAI product is assembled from.",
  accent: "iris",
  lessons: [
    {
      slug: "what-is-an-ai-engineer",
      title: "What is an AI Engineer?",
      summary:
        "A role that barely existed five years ago and is now on every hiring plan — what it is, how it differs from ML engineering and data science, and what you're actually paid to decide.",
      minutes: 9,
      blocks: [
        { type: "p", text: "An **AI Engineer** builds products on top of models somebody else trained. You are not gathering a dataset and running gradient descent; you are taking a general-purpose model — an API call away, or a set of open weights on your own GPUs — and turning it into a system that is *reliable enough to put in front of users*." },
        { type: "callout", kind: "key", text: "The one-line definition: **an AI Engineer turns a probabilistic model into a dependable product.** Everything in this course — prompting, retrieval, tools, evals, guardrails, inference tuning — exists to close the gap between *it worked in the playground* and *it works for 10,000 users at 3 a.m.*" },
        { type: "h2", text: "Why the role appeared" },
        { type: "p", text: "Until about 2022, using machine learning in a product meant training a model: collect labelled data, pick an architecture, train, evaluate, deploy, retrain as it drifts. That work needs an **ML Engineer**, and it takes months. Then pretrained language models became good enough to solve a large class of those problems *with no training at all* — you describe the task in words." },
        { type: "p", text: "That collapsed the time-to-first-working-version from months to an afternoon, and it moved the hard part. The hard part is no longer *can a model do this?* It is **can this model do it consistently, cheaply, safely, and fast enough — and how would we know?** Answering that is the AI Engineer's job, and it is much closer to software and systems engineering than to statistics." },
        { type: "diagram", name: "role-spectrum", caption: "The AI Engineer sits between ML engineering and product software — model as a dependency, not a deliverable." },
        { type: "h2", text: "How the neighbouring roles differ" },
        { type: "compare", caption: "Overlapping, but with genuinely different centres of gravity.", columns: ["Role", "Owns", "Typical artefact", "Core skill"], rows: [
          { label: "Data Scientist", cells: ["Questions and evidence", "An analysis, a metric, an experiment readout", "Statistics and causal reasoning"] },
          { label: "ML Engineer", cells: ["Trained models and their pipelines", "A training pipeline and a served model", "Modelling, feature engineering, MLOps"] },
          { label: "AI Engineer", cells: ["Products built on existing models", "A retrieval/agent system with an eval suite", "Systems design, evaluation, prompt & context engineering"] },
          { label: "Research Engineer", cells: ["The models themselves", "A pretrained or post-trained checkpoint", "Deep learning, distributed training, CUDA"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**LLM** (Large Language Model) = a model trained to predict the next token of text, which turns out to be enough to summarise, translate, code, and reason. **Foundation model** = a large model pretrained on broad data, then adapted to many tasks. **Inference** = running a trained model to get an answer (as opposed to *training* it). **Frontier model** = the most capable models available at a given moment. **Open-weight** = a model whose parameters you can download and run yourself. **GenAI** = generative AI, the umbrella term for models that produce text, images, audio, or video." },
        { type: "h2", text: "What you're actually paid to decide" },
        { type: "p", text: "Almost every day of the job comes down to a handful of recurring trade-offs. Interviewers probe these directly, because they separate people who have shipped from people who have demoed." },
        { type: "list", items: [
          "**Which model, for which request?** Frontier quality costs 10–50× the cheap tier. Most systems route: a small model for classification and extraction, a big one for the hard 5%.",
          "**Prompt, retrieve, or fine-tune?** In that order, almost always. Fine-tuning is the answer to *behaviour and format*, retrieval is the answer to *knowledge*, and people reach for the wrong one constantly.",
          "**How much context, and which context?** Long context windows made it *possible* to stuff everything in; cost, latency, and attention dilution make it a bad idea. Choosing what goes in the window is now its own discipline.",
          "**How do we know it works?** Without an eval suite you are guessing. The single most reliable signal of a strong AI Engineer is that they built the evaluation before they tuned the prompt.",
          "**What happens when it's wrong?** Not *if*. Fallbacks, confidence thresholds, human review, guardrails, and a way to notice failures in production.",
          "**What does it cost per request, and does that survive 100× traffic?** Token maths on a whiteboard is a routine interview task.",
        ]},
        { type: "diagram", name: "ai-engineer-stack", caption: "The four layers of a GenAI product. You rent the model; you own the two layers where quality is decided." },
        { type: "h2", text: "The skills that actually get you hired in 2026" },
        { type: "compare", caption: "What job descriptions ask for, translated.", columns: ["What the JD says", "What it means in practice"], rows: [
          { label: "\"Experience with RAG\"", cells: ["You can chunk, embed, retrieve, rerank — and diagnose why retrieval returned the wrong passage"] },
          { label: "\"Agentic workflows\"", cells: ["You can design a tool-calling loop with termination conditions, retries, and a human-in-the-loop escape hatch"] },
          { label: "\"Prompt / context engineering\"", cells: ["You treat the context window as a budget and can explain what you put in it and why"] },
          { label: "\"Evaluation frameworks\"", cells: ["You have built a golden dataset and an LLM-as-judge rubric, and you know their failure modes"] },
          { label: "\"LLMOps / production experience\"", cells: ["Tracing, cost dashboards, prompt versioning, canary releases, rate-limit and fallback handling"] },
          { label: "\"Familiar with MCP\"", cells: ["You know how tools and data are exposed to a model through a standard protocol, and how to secure that"] },
        ]},
        { type: "callout", kind: "warn", text: "The most common way candidates fail an AI Engineer loop is not weak Python. It's answering *\"how would you know if this is good?\"* with a shrug. Have a real answer — dataset, metric, threshold, regression suite — for every system you describe." },
        { type: "h2", text: "The mindset shift from ordinary software" },
        { type: "p", text: "Traditional software is deterministic: the same input yields the same output, and a bug is reproducible. A language model is a **probabilistic component**. The same prompt can produce different text; correctness is a distribution, not a boolean; and \"fixing\" a failure often means shifting a rate from 8% to 2% rather than eliminating it." },
        { type: "list", items: [
          "You **test statistically**, over a dataset, not with a single assertion.",
          "You **design for being wrong**: validation, retries, constrained outputs, and human review at the right threshold.",
          "You **version prompts like code**, because a prompt edit is a deploy with no type checker behind it.",
          "You **measure before and after**, because intuition about prompt changes is famously unreliable.",
        ]},
        { type: "quote", text: "The model is the easy part. The system around the model is the product.", cite: "The sentence this entire course is an expansion of" },
      ],
      takeaways: [
        "An AI Engineer builds products on models they didn't train — the work is systems engineering, not modelling.",
        "The role exists because pretrained models moved the hard problem from 'can it work?' to 'is it reliable, cheap, safe, and fast enough?'",
        "Daily decisions: which model tier, prompt vs retrieve vs fine-tune, what goes in the context window, how it's evaluated, and what happens when it's wrong.",
        "Hiring signals in 2026: RAG, agents/tool use, context engineering, evals, LLMOps, and MCP.",
        "Models are probabilistic components, so you test over datasets, design for failure, and version prompts like code.",
      ],
      flashcards: [
        { front: "AI Engineer vs ML Engineer", back: "An ML Engineer trains and serves models (data → pipeline → checkpoint). An AI Engineer builds systems on top of existing models (prompting, retrieval, tools, evals, serving), treating the model as a dependency." },
        { front: "The default order for improving an LLM feature", back: "Prompt → retrieve → fine-tune → (rarely) pretrain. Move down a rung only when the rung above provably can't get there — each step costs far more effort and lock-in." },
        { front: "Why can't you unit-test an LLM feature the usual way?", back: "Output is probabilistic, so correctness is a rate over a dataset, not a single assertion. You need a golden set, a metric, a threshold, and a regression run in CI." },
        { front: "What's the strongest signal of a senior AI Engineer in an interview?", back: "They build the evaluation before tuning the prompt, and can state the dataset, the metric, the threshold, and the failure modes of their own eval." },
      ],
      quiz: [
        { q: "A support bot gives outdated answers about your product's pricing. What's the right first move?", options: ["Fine-tune the model on your docs", "Add retrieval over the current pricing docs", "Increase the temperature", "Switch to a larger model"], answer: 1, explain: "Missing or stale *knowledge* is a retrieval problem. Fine-tuning bakes information in at training time and goes stale immediately — it changes behaviour and format, not facts." },
        { q: "Which best describes the core difficulty of AI engineering?", options: ["Designing neural network architectures", "Making a probabilistic component reliable inside a deterministic product", "Labelling large datasets", "Optimising CUDA kernels"], answer: 1, explain: "The model is rented. The engineering is everything that makes its variable output dependable: context, constraints, evaluation, fallbacks, and observability." },
        { q: "Your prompt change 'feels better' in the playground. What should happen before it ships?", options: ["Ship it — playground testing is the eval", "Run it against a golden dataset and compare scores", "Ask a teammate to eyeball ten outputs", "Raise the temperature to check robustness"], answer: 1, explain: "Prompt intuition is unreliable and changes often trade one failure mode for another. A versioned golden set with a scored comparison is the only way to know if you improved anything." },
      ],
    },
  ],
};
