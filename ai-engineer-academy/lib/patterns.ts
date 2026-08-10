import type { Pattern } from "./types";

export const patterns: Pattern[] = [
  {
    name: "The four-layer GenAI stack",
    tagline: "Product surface → orchestration → model → data & infra.",
    diagram: "ai-engineer-stack",
    when: "The mental model to open any AI system-design answer with — it tells the interviewer where you'll spend your time before you draw a single box.",
    watch: "Teams over-invest in the model layer (which they rent) and under-invest in orchestration and evaluation (which decide the product).",
    accent: "iris",
  },
  {
    name: "Model tiering & routing",
    tagline: "Cheap model for the easy majority, frontier model for the hard tail.",
    diagram: "model-landscape",
    when: "Any high-volume workload where most requests are easy — classification, extraction, routine Q&A — and a minority need real reasoning.",
    watch: "You need a routing signal you trust (classifier, confidence, or complexity heuristic) and an eval per tier, or you silently downgrade quality to save money.",
    accent: "teal",
  },
];
