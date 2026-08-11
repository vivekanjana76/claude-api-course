import type { GlossaryTerm } from "./types";

export const glossary: GlossaryTerm[] = [
  { term: "AI Engineer", def: "Someone who builds products on top of models they did not train — prompting, retrieval, tools, evaluation, and serving. Distinct from an ML Engineer, who owns training pipelines.", related: ["ML Engineer", "Foundation model"] },
  { term: "Context window", def: "The maximum number of tokens a model can attend to in one call — system prompt, conversation, retrieved documents, tool definitions, and the reply all share it.", related: ["Token", "Context engineering"], hot: true },
  { term: "Context engineering", def: "Deliberately deciding what occupies the context window and in what form: retrieval, compaction, summarisation, tool descriptions, and memory. The 2026 successor to 'prompt engineering' as the headline skill.", related: ["Context window", "Prompt engineering"], hot: true },
  { term: "Foundation model", def: "A large model pretrained on broad data that can be adapted to many downstream tasks by prompting, retrieval, or fine-tuning.", related: ["LLM", "Open-weight"] },
  { term: "Inference", def: "Running a trained model to produce an output, as opposed to training it. Splits into a parallel prefill phase and a sequential decode phase.", related: ["Prefill", "Decode"] },
  { term: "LLM", def: "Large Language Model — a model trained to predict the next token, which generalises to summarising, translating, coding, and reasoning.", related: ["Token", "Foundation model"] },
  { term: "ML Engineer", def: "Owns training and serving of models: data pipelines, feature engineering, training runs, and MLOps. Overlaps with, but is distinct from, the AI Engineer role.", related: ["AI Engineer"] },
  { term: "Open-weight", def: "A model whose parameters are published for download, so you can run, quantize, and fine-tune it on your own hardware. Not the same as open-source, which would also require training data and code.", related: ["Self-hosting", "Quantization"], hot: true },
  { term: "Prompt engineering", def: "Writing the instructions, examples, and output contract that steer a model. Still necessary, but now one part of the larger discipline of context engineering.", related: ["Context engineering", "Few-shot"] },
  { term: "Token", def: "The unit a model reads and writes — roughly ¾ of an English word. Pricing, context limits, and latency are all measured in tokens.", related: ["Tokenizer", "Context window"] },
];
