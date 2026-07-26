// Rapid intuition drills for Cloud Academy.
// Unlike the per-lesson quizzes (which test recall of one lesson), these drill
// the judgment calls a cloud engineer makes across the whole curriculum:
// which compute to run, which data store to pick, where a security control
// belongs, and what the endless cloud acronyms actually mean.

export type DrillSkill =
  | "compute-picking"
  | "data-picking"
  | "security"
  | "acronyms";

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
    id: "compute-picking",
    label: "Pick the compute",
    blurb:
      "VM, container, or serverless? Match the workload to the rung of the compute spectrum that fits.",
    accent: "iris",
  },
  {
    id: "data-picking",
    label: "Pick the data store",
    blurb:
      "Object vs block vs file, SQL vs NoSQL, and when to put a cache in front — chosen by access pattern, not habit.",
    accent: "teal",
  },
  {
    id: "security",
    label: "Place the control",
    blurb:
      "Least privilege, encryption, and secrets — security comes from where the control sits, not how it's worded.",
    accent: "rose",
  },
  {
    id: "acronyms",
    label: "Decode the acronym",
    blurb:
      "Cut through the alphabet soup — translate the cloud acronym into the plain idea underneath it.",
    accent: "amber",
  },
];

/* ------------------------------------------------------------------ */
/* Drills                                                              */
/* ------------------------------------------------------------------ */

export const drills: Drill[] = [
  /* ---------- Compute picking ---------- */
  {
    skill: "compute-picking",
    prompt:
      "A webhook fires unpredictably — sometimes 0/hour, sometimes thousands in a burst. Each call runs ~200ms. What compute?",
    options: [
      "A fleet of always-on VMs sized for the peak",
      "A serverless function (Lambda / Azure Functions)",
      "A single large VM",
      "A dedicated Kubernetes cluster",
    ],
    answer: 1,
    explain:
      "Spiky, short, event-driven work is the serverless sweet spot: it scales to zero (you pay nothing at idle) and fans out automatically under a burst. Always-on VMs sized for peak waste money the rest of the time.",
  },
  {
    skill: "compute-picking",
    prompt:
      "A steady, high-throughput core API runs 24/7 at predictable load and needs tight tail latency. What compute?",
    options: [
      "Serverless functions",
      "Containers on ECS/EKS (or VMs)",
      "One function per request, scaled to zero",
      "Whatever is newest",
    ],
    answer: 1,
    explain:
      "Past a cost crossover, always-on containers/VMs are cheaper than per-invocation billing, and they avoid cold-start latency that would blow a tight p99 budget. Serverless shines for spiky work, not steady high volume.",
  },
  {
    skill: "compute-picking",
    prompt:
      "You want to run containers on AWS but manage zero servers or nodes. Which service?",
    options: ["EC2 with Docker installed", "Fargate", "A self-managed Kubernetes cluster", "Lambda"],
    answer: 1,
    explain:
      "Fargate is serverless containers — AWS provisions the compute, so there are no nodes to patch or scale. It runs under ECS or EKS. (Lambda runs functions, not arbitrary long-lived containers.)",
  },
  {
    skill: "compute-picking",
    prompt:
      "A team of five needs to run a handful of services and ship fast. They keep hearing 'use Kubernetes.' Best default?",
    options: [
      "Adopt full self-managed Kubernetes immediately",
      "Start simple (ECS/Fargate or a PaaS); reach for Kubernetes only when portability or fine control demands it",
      "Rewrite everything as serverless functions",
      "Run one giant VM by hand",
    ],
    answer: 1,
    explain:
      "Kubernetes is powerful but carries real operational weight and a steep learning curve. For a few services, simpler managed options ship faster and break less. Adopt K8s for portability, ecosystem, or fine control — not popularity.",
  },
  {
    skill: "compute-picking",
    prompt:
      "Reading the compute spectrum from bare metal → VM → container → serverless, moving right generally means…",
    options: [
      "More control and more operational work",
      "Less operational work and faster to ship, but less control",
      "Always cheaper at every scale",
      "Worse availability",
    ],
    answer: 1,
    explain:
      "Rightward trades control for convenience: the provider manages more, you plan/patch less and ship faster — but you give up low-level control and can hit limits (and cost crossovers). Pick the rung that fits the workload.",
  },

  /* ---------- Data picking ---------- */
  {
    skill: "data-picking",
    prompt:
      "You need one fast, low-latency disk for a database running on a single VM. Which storage type?",
    options: ["Object storage (S3/Blob)", "Block storage (EBS/Managed Disk)", "File storage (EFS/Azure Files)", "A CDN"],
    answer: 1,
    explain:
      "Block storage is a raw, low-latency volume attached to one VM — exactly what a database wants. Object storage is for blobs over HTTP; file storage is a shared mount for many VMs.",
  },
  {
    skill: "data-picking",
    prompt:
      "Media uploads, backups, and a data lake need a cheap, near-infinite, durable home reached over HTTP. Which storage?",
    options: ["Block storage", "Object storage (S3 / Azure Blob)", "File storage", "A relational database"],
    answer: 1,
    explain:
      "Object storage is the cloud's default blob store: flat buckets, an HTTP API, eleven-nines durability, and very low cost. It's the backbone for media, backups, logs, static sites, and data lakes.",
  },
  {
    skill: "data-picking",
    prompt:
      "A payment ledger needs all-or-nothing transactions and strong consistency. SQL or NoSQL?",
    options: [
      "NoSQL, for horizontal scale",
      "Relational (SQL) — for ACID transactions",
      "A key–value cache",
      "Object storage",
    ],
    answer: 1,
    explain:
      "Money demands ACID: a group of changes commits fully or not at all. That's the defining strength of relational databases. NoSQL trades JOINs and (usually) strong consistency for scale — the wrong trade for a ledger.",
  },
  {
    skill: "data-picking",
    prompt:
      "You need the fastest possible lookup of user sessions by a known session id, at huge scale. Which fits best?",
    options: [
      "A relational database with JOINs",
      "A key–value store (DynamoDB / Redis)",
      "A graph database",
      "Object storage",
    ],
    answer: 1,
    explain:
      "Fetching by a known key is exactly what key–value stores do best — single-digit-millisecond lookups that scale horizontally. Sessions, carts, and profiles are the classic key–value use case.",
  },
  {
    skill: "data-picking",
    prompt:
      "The same DB rows are read constantly and reads are overwhelming the primary. First move?",
    options: [
      "Put a cache (cache-aside) in front and/or add read replicas",
      "Enable Multi-AZ",
      "Immediately migrate to NoSQL",
      "Restore from backup",
    ],
    answer: 0,
    explain:
      "Repeated hot reads are what caches and read replicas are for: a cache serves them from memory, read replicas offload them from the primary. Multi-AZ is for failover/availability, not read scaling.",
  },

  /* ---------- Security placement ---------- */
  {
    skill: "security",
    prompt:
      "An EC2 instance needs read access to one S3 bucket. How should you grant it?",
    options: [
      "Embed an admin user's access keys on the instance",
      "Attach an IAM role scoped to read-only on that bucket",
      "Make the bucket public",
      "Use the root account's keys",
    ],
    answer: 1,
    explain:
      "A scoped IAM role gives temporary, least-privilege credentials with no long-lived keys to leak. Embedding static keys — especially admin or root — is how one compromised instance owns the account.",
  },
  {
    skill: "security",
    prompt:
      "Where should a database password your app needs at runtime live?",
    options: [
      "In the repo's config file",
      "In a secrets manager (AWS Secrets Manager / Azure Key Vault), fetched at runtime",
      "Baked into the container image",
      "In a public S3 bucket",
    ],
    answer: 1,
    explain:
      "Secrets belong in a managed secrets store: encrypted, IAM-controlled, fetched at runtime, ideally auto-rotated. Committed secrets are scraped from public repos within minutes — and deleting the commit isn't enough, you must rotate.",
  },
  {
    skill: "security",
    prompt:
      "You must guarantee stored backups are unreadable if a disk snapshot is stolen. What provides that?",
    options: [
      "Encryption in transit (TLS)",
      "Encryption at rest with a managed key (KMS / Key Vault)",
      "A security group",
      "A load balancer",
    ],
    answer: 1,
    explain:
      "Encryption at rest scrambles stored data so stolen media is useless without the key. TLS protects data moving over the network, not data sitting on a disk. Keep keys in KMS/Key Vault, never hard-coded.",
  },
  {
    skill: "security",
    prompt:
      "Which best captures 'least privilege'?",
    options: [
      "Give everyone admin so nothing is blocked",
      "Grant the minimum permissions needed, starting from zero",
      "Only the root account has access",
      "Encrypt everything and skip IAM",
    ],
    answer: 1,
    explain:
      "Least privilege starts from no access and adds only the specific allows required. It contains the blast radius of any leaked credential — the single highest-leverage IAM habit. Broad 'just give admin' grants are the classic breach enabler.",
  },
  {
    skill: "security",
    prompt:
      "What's the core idea of defense in depth?",
    options: [
      "One very strong firewall is enough",
      "Layer independent controls (identity, network, data, detection) so one failure isn't a breach",
      "Encrypt at rest and ignore everything else",
      "Only root needs MFA",
    ],
    answer: 1,
    explain:
      "No single control is sufficient. Defense in depth layers least-privilege IAM, network segmentation, encryption, secrets management, and audit logging so that when one layer fails, another still catches the attack.",
  },

  /* ---------- Acronym decoder ---------- */
  {
    skill: "acronyms",
    prompt: "'IaaS vs PaaS vs SaaS' — the axis these describe is…",
    options: [
      "How fast the network is",
      "How much of the stack the provider manages vs you (infrastructure → platform → whole app)",
      "Which cloud provider you use",
      "The pricing model only",
    ],
    answer: 1,
    explain:
      "They're points on a 'who manages the stack' spectrum: IaaS (you get VMs/networking, manage the rest), PaaS (provider runs the platform, you deploy code), SaaS (provider runs the whole app). More-managed means less control and less ops.",
  },
  {
    skill: "acronyms",
    prompt: "'VPC' (AWS) / 'VNet' (Azure), decoded, is…",
    options: [
      "A type of virtual machine",
      "Your own isolated, private network inside the cloud",
      "A database service",
      "A billing construct",
    ],
    answer: 1,
    explain:
      "A VPC/VNet is your walled-off private network in the cloud, carved into subnets (public and private). It's the boundary inside which your resources live and talk to each other.",
  },
  {
    skill: "acronyms",
    prompt: "'IAM' stands for and does what?",
    options: [
      "Internet Access Manager — controls bandwidth",
      "Identity and Access Management — decides who can do what to which resource",
      "Infrastructure Automation Module",
      "Instance Allocation Method",
    ],
    answer: 1,
    explain:
      "IAM is the cloud's login-and-permissions system — identities (users/roles), policies (JSON allow/deny), and least privilege. It's the single most important security control; get it wrong and one leaked key owns the account.",
  },
  {
    skill: "acronyms",
    prompt: "'CDN' (Content Delivery Network), in plain terms, is…",
    options: [
      "A database replication feature",
      "A network of edge caches near users that serve static content fast and offload the origin",
      "A container orchestrator",
      "A type of VPN",
    ],
    answer: 1,
    explain:
      "A CDN caches content at edge locations close to users, cutting latency and shielding your origin from load. Great for static assets, media, and cacheable API responses — CloudFront (AWS) / Azure CDN / Front Door.",
  },
  {
    skill: "acronyms",
    prompt: "'AZ' (Availability Zone) vs 'Region' — the difference is…",
    options: [
      "They're the same thing",
      "A Region is a geographic area containing multiple isolated AZs (independent data centers) you spread across for HA",
      "An AZ is bigger than a Region",
      "A Region is a single building",
    ],
    answer: 1,
    explain:
      "A Region (e.g. us-east-1) is a geographic area made of multiple Availability Zones — physically separate data centers with independent power/network. Spreading across AZs is how you survive a single-zone failure.",
  },
  {
    skill: "acronyms",
    prompt: "'KMS' (Key Management Service), decoded, is…",
    options: [
      "A Kubernetes management service",
      "A managed service that creates, stores, rotates, and controls access to encryption keys, with audit logging",
      "A key-value database",
      "A monitoring dashboard",
    ],
    answer: 1,
    explain:
      "KMS (Azure's equivalent is Key Vault) holds your encryption keys so they never live in code or config, integrates with services to encrypt data at rest, rotates keys, and logs every use for audit.",
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
    rule: "Pick the compute rung that fits the workload.",
    detail:
      "Serverless for spiky/event-driven/glue work; containers or VMs for steady, high-throughput, long-running, or latency-critical services. Move right on the spectrum for less ops, left for more control.",
  },
  {
    rule: "Choose the data store by access pattern, not habit.",
    detail:
      "Object for blobs over HTTP, block for one fast disk, file for shared mounts. SQL for structured/transactional data, NoSQL for scale and known simple access. Cache hot reads; the database stays the source of truth.",
  },
  {
    rule: "Guarantees live in code and config, not in prompts or hope.",
    detail:
      "Enforce hard limits at the tool/service boundary: scoped IAM roles, encryption at rest, secrets in a manager. A stolen key should only reach what least privilege allowed.",
  },
  {
    rule: "Prefer roles over long-lived keys.",
    detail:
      "Temporary credentials that auto-expire beat static access keys that work forever. Give servers and workloads a scoped role; lock root away behind MFA.",
  },
  {
    rule: "Layer your defenses.",
    detail:
      "Least-privilege identity, network segmentation, encryption in transit and at rest, managed secrets, and audit logging — so no single failure becomes a breach.",
  },
  {
    rule: "Design for failure and cost from day one.",
    detail:
      "Spread across AZs for availability; right-size, tier storage, mind egress, and set budgets/alerts. Durability, availability, and cost are design inputs, not afterthoughts.",
  },
];
