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
  | "request-response"
  | "tokens"
  | "context-window"
  | "model-tiers"
  | "temperature"
  | "streaming"
  | "multimodal"
  | "message-roles"
  | "prompt-anatomy"
  | "caching"
  | "eval-loop"
  | "tool-loop"
  | "agentic-loop"
  | "agent-vs-workflow"
  | "mcp"
  | "managed-agents"
  | "rag-pipeline"
  | "embeddings"
  | "thinking"
  | "server-tools"
  | "context-management";

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

export interface Module {
  id: string;
  title: string;
  blurb: string;
  accent: "clay" | "sage" | "ochre" | "slateblue";
  lessons: Lesson[];
}

export interface GlossaryTerm {
  term: string;
  def: string;
  related?: string[];
}

export interface InterviewQA {
  q: string;
  a: string;
  topic: string;
}
