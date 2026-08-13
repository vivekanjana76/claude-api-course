export type CalloutKind = "key" | "note" | "tip" | "warn" | "story";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; kind: CalloutKind; title?: string; text: string }
  | { type: "code"; lang: string; caption?: string; code: string }
  | { type: "diagram"; name: DiagramName; caption?: string }
  | {
      type: "compare";
      caption?: string;
      columns: string[];
      rows: { label: string; cells: string[] }[];
    }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "quote"; text: string; cite?: string };

export type DiagramName =
  // foundations
  | "ai-engineer-stack"
  | "role-spectrum"
  | "llm-io"
  | "model-landscape"
  | "failure-modes"
  // prompting & context
  | "prompt-anatomy"
  | "context-budget"
  | "structured-output-loop"
  | "reasoning-dial"
  // embeddings & retrieval
  | "embedding-space"
  | "chunking-strategies"
  | "ann-index"
  | "hybrid-rerank"
  // rag
  | "rag-pipeline"
  | "agentic-rag"
  | "graph-rag"
  | "rag-triad"
  // agents
  | "tool-call-loop"
  | "agent-loop"
  | "agent-memory"
  | "multi-agent-topologies"
  // mcp & interop
  | "mcp-architecture"
  | "mcp-primitives"
  // adaptation
  | "adaptation-ladder"
  | "lora"
  | "alignment-pipeline"
  | "distillation"
  // inference & serving
  | "inference-latency"
  | "kv-cache"
  | "quantization-spectrum"
  | "serving-stack"
  // evaluation
  | "eval-pyramid"
  | "llm-judge"
  | "eval-loop"
  // production
  | "production-architecture"
  | "caching-layers"
  | "llm-observability"
  | "deploy-lifecycle"
  // safety & governance
  | "prompt-injection"
  | "guardrail-layers"
  | "data-governance"
  // multimodal
  | "multimodal-io"
  | "voice-pipeline"
  // system design
  | "design-framework"
  | "assistant-reference"
  | "cost-model";

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index
  explain: string;
}

export interface Lesson {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: Block[];
  takeaways: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export type Accent = "iris" | "teal" | "amber" | "rose";

export interface Module {
  id: string;
  title: string;
  blurb: string;
  accent: Accent;
  lessons: Lesson[];
}

export interface GlossaryTerm {
  term: string;
  def: string;
  related?: string[];
  /**
   * Marks a term that is *currently* hot in AI Engineer job descriptions and
   * interview loops. The glossary page can filter to these alone so you can
   * revise the vocabulary of the moment without reading all 200+ entries.
   */
  hot?: boolean;
}

export interface InterviewQA {
  q: string;
  a: string;
  topic: string;
}

export interface Pattern {
  name: string;
  tagline: string;
  diagram: DiagramName;
  when: string;
  watch: string;
  accent: Accent;
}
