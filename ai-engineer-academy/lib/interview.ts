import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  {
    topic: "Foundations",
    q: "What does an AI Engineer do that an ML Engineer doesn't?",
    a: "An ML Engineer owns models: data pipelines, training, evaluation of the model itself, and serving the resulting checkpoint. An AI Engineer treats a pretrained model as a dependency and owns the system around it — prompting and context engineering, retrieval, tool use and agent loops, evaluation of the *product* behaviour, guardrails, latency and cost engineering, and production observability. The overlap is deployment and monitoring; the difference is that an AI Engineer's main lever is the context and the surrounding system, not the weights.",
  },
  {
    topic: "Foundations",
    q: "Walk me through the order in which you'd try to improve a weak LLM feature.",
    a: "Prompt first: clarify the instruction, add an output contract, add a few well-chosen examples, and split the task if it's doing two things at once. Then retrieval, if the failures are about missing or stale knowledge. Then fine-tuning, if the failures are about consistent format, tone, or a narrow task the model keeps getting subtly wrong even with good context. Pretraining is essentially never the answer for a product team. The ordering is about cost and reversibility — a prompt change ships in minutes and reverts in seconds; a fine-tune is a new artefact to version, evaluate, and re-do every time the base model changes.",
  },
  {
    topic: "Foundations",
    q: "How would you decide between a frontier model and a small open-weight model?",
    a: "Measure, don't assume. Build an eval set from real traffic, run both, and compare quality on the slices that matter. Then weigh the deltas: frontier models typically win on hard reasoning, long-horizon agent work, and rare edge cases; small open-weight models win on cost per call, tail latency, data residency, and the ability to fine-tune. The usual production answer is both — route the easy majority of requests to the cheap tier and escalate on a confidence signal or a classifier, which often keeps 90%+ of the quality at a fraction of the cost.",
  },
];
