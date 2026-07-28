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
  | "cloud-service-models"
  | "shared-responsibility"
  | "regions-az"
  | "aws-service-map"
  | "well-architected"
  | "multi-account-org"
  // compute
  | "compute-spectrum"
  | "autoscaling"
  | "load-balancer"
  | "elb-family"
  | "ec2-purchase-options"
  // storage
  | "storage-types"
  | "storage-tiers"
  | "s3-request-flow"
  | "cdn"
  // networking
  | "vpc-anatomy"
  | "security-layers"
  | "network-topology"
  | "dns-resolution"
  | "route53-routing"
  | "hybrid-connectivity"
  | "availability-multi-az"
  // data
  | "database-types"
  | "caching-layer"
  | "dynamodb-keys"
  // security
  | "iam-model"
  | "iam-policy-evaluation"
  | "encryption-flow"
  | "kms-envelope"
  // serverless & integration
  | "serverless-event"
  | "lambda-lifecycle"
  | "event-driven-fanout"
  | "queue-decoupling"
  // containers
  | "container-orchestration"
  | "ecs-vs-eks"
  // delivery & ops
  | "iac-workflow"
  | "cicd-pipeline"
  | "deployment-strategies"
  | "observability-pillars"
  | "cost-levers"
  // architecture
  | "dr-strategies"
  | "migration-7rs"
  | "three-tier-reference";

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
