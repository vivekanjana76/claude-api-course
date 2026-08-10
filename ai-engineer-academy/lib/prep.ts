// Rapid intuition drills for AI Engineer Academy.
// The per-lesson quizzes test recall of one lesson. These drill the judgment
// calls an AI engineer makes across the whole curriculum: which adaptation
// technique to reach for, why a RAG pipeline is returning nonsense, how to
// evaluate a thing that has no single right answer, where a guardrail belongs,
// and what the jargon in the job description actually means.

export type DrillSkill =
  | "adaptation"
  | "debug-rag"
  | "design-eval"
  | "safety"
  | "jargon";

export interface Drill {
  skill: DrillSkill;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface SkillMeta {
  id: DrillSkill;
  label: string;
  blurb: string;
  accent: "iris" | "teal" | "amber" | "rose";
}

export const skills: SkillMeta[] = [
  {
    id: "adaptation",
    label: "Pick the technique",
    blurb:
      "Prompt, retrieve, fine-tune, or agent? Match the failure you're seeing to the rung of the ladder that actually fixes it.",
    accent: "iris",
  },
  {
    id: "debug-rag",
    label: "Debug the pipeline",
    blurb:
      "A retrieval or agent system is returning nonsense. Name the stage that's broken before you touch the prompt.",
    accent: "teal",
  },
  {
    id: "design-eval",
    label: "Design the eval",
    blurb:
      "The round that separates shippers from demoers: how would you know this is good, and what would tell you it regressed?",
    accent: "amber",
  },
  {
    id: "safety",
    label: "Place the guardrail",
    blurb:
      "Injection, exfiltration, PII, runaway tool calls — safety comes from where the control sits, not how the prompt is worded.",
    accent: "rose",
  },
  {
    id: "jargon",
    label: "Decode the jargon",
    blurb:
      "GRPO, TTFT, HNSW, MCP, KV cache — translate the keyword in the job description into the plain idea underneath.",
    accent: "amber",
  },
];

/* ------------------------------------------------------------------ */
/* Drills                                                              */
/* ------------------------------------------------------------------ */

export const drills: Drill[] = [
  {
    skill: "adaptation",
    prompt:
      "Your assistant answers confidently with last year's pricing. Which lever fixes it?",
    options: [
      "Fine-tune on the current price list",
      "Retrieve the current pricing page at query time",
      "Lower the temperature to 0",
      "Add 'be accurate' to the system prompt",
    ],
    answer: 1,
    explain:
      "Stale or missing knowledge is a retrieval problem. Fine-tuning bakes facts in at training time and goes stale the day prices change; temperature and pleading don't add information the model doesn't have.",
  },
  {
    skill: "jargon",
    prompt: "TTFT stands for…",
    options: [
      "Total tokens for training",
      "Time to first token",
      "Tokens through fine-tuning",
      "Time to full text",
    ],
    answer: 1,
    explain:
      "Time to first token measures how long the prefill phase takes before streaming starts — the latency users actually feel. TPOT (time per output token) governs how fast the text then flows.",
  },
];

/* ------------------------------------------------------------------ */
/* Judgment heuristics — a quick reference the drills reinforce        */
/* ------------------------------------------------------------------ */

export interface Heuristic {
  rule: string;
  detail: string;
}

export const heuristics: Heuristic[] = [
  {
    rule: "Climb the adaptation ladder in order.",
    detail:
      "Prompt, then retrieve, then fine-tune, then (essentially never) pretrain. Each rung costs an order of magnitude more effort and lock-in than the one above it, so only descend when you can show the rung above provably cannot get there.",
  },
  {
    rule: "Build the eval before you tune the prompt.",
    detail:
      "Without a golden set, a metric, and a threshold, every prompt change is a vibe. With one, you can measure a regression in minutes and defend the change in review.",
  },
];
