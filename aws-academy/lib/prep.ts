// Rapid intuition drills for AWS Academy.
// Unlike the per-lesson quizzes (which test recall of one lesson), these drill
// the judgment calls an AWS cloud engineer makes across the whole curriculum:
// which compute to run, which data store to pick, where a security control
// belongs, how to narrow a failure, and what the endless AWS acronyms mean.

export type DrillSkill =
  | "compute-picking"
  | "data-picking"
  | "security"
  | "troubleshoot"
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
      "EC2, Fargate, Lambda, or Batch? Match the workload to the rung of the AWS compute ladder that actually fits.",
    accent: "iris",
  },
  {
    id: "data-picking",
    label: "Pick the data store",
    blurb:
      "S3 vs EBS vs EFS, RDS vs DynamoDB, and when a cache belongs in front — chosen by access pattern, not habit.",
    accent: "teal",
  },
  {
    id: "security",
    label: "Place the control",
    blurb:
      "IAM, KMS, security groups, and secrets — security comes from where the control sits, not how it's worded.",
    accent: "rose",
  },
  {
    id: "troubleshoot",
    label: "Narrow the failure",
    blurb:
      "The round that separates candidates: given a symptom, name the next thing you'd check and why.",
    accent: "amber",
  },
  {
    id: "acronyms",
    label: "Decode the acronym",
    blurb:
      "Cut through the alphabet soup — translate the AWS acronym into the plain idea underneath it.",
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
      "A webhook fires unpredictably — sometimes 0/hour, sometimes thousands in a burst. Each call runs ~200 ms. What compute?",
    options: [
      "An EC2 fleet sized for the peak",
      "Lambda",
      "A single large EC2 instance",
      "A dedicated EKS cluster",
    ],
    answer: 1,
    explain:
      "Spiky, short, event-driven work is Lambda's sweet spot: it scales to zero so idle costs nothing, and fans out automatically under a burst. A fleet sized for peak wastes money the other 23 hours.",
  },
  {
    skill: "compute-picking",
    prompt:
      "A steady, high-throughput core API runs 24/7 at predictable load with a tight p99 budget. What compute?",
    options: [
      "Lambda with provisioned concurrency",
      "Containers on ECS Fargate or an EC2 ASG",
      "One Lambda per request, scaled to zero",
      "AWS Batch",
    ],
    answer: 1,
    explain:
      "Past a volume crossover, always-on containers are cheaper than per-invocation billing and avoid cold starts entirely. Lambda shines for spiky work, not steady high throughput.",
  },
  {
    skill: "compute-picking",
    prompt: "You want to run containers on AWS and manage zero servers or nodes. Which?",
    options: ["EC2 with Docker installed", "Fargate", "Self-managed Kubernetes on EC2", "Lambda"],
    answer: 1,
    explain:
      "Fargate is serverless container capacity — you declare CPU and memory per task and AWS supplies the host. It works under both ECS and EKS.",
  },
  {
    skill: "compute-picking",
    prompt:
      "A team of five with no Kubernetes experience needs to run eight containerised services on AWS. Best default?",
    options: [
      "EKS with Karpenter",
      "ECS on Fargate",
      "Self-managed Kubernetes on EC2",
      "Rewrite everything as Lambda functions",
    ],
    answer: 1,
    explain:
      "ECS on Fargate delivers the outcome with a fraction of the operational surface. EKS adds seven-plus add-ons and quarterly version upgrades that somebody must own.",
  },
  {
    skill: "compute-picking",
    prompt: "A nightly ETL job takes 40 minutes and can safely restart. Cheapest sensible option?",
    options: [
      "Lambda with a raised timeout",
      "AWS Batch on Spot",
      "A 24/7 on-demand EC2 instance",
      "API Gateway plus Lambda"],
    answer: 1,
    explain:
      "Lambda's hard limit is 15 minutes. Batch queues and schedules containerised jobs onto compute it provisions — and because the job is restartable, Spot cuts the cost by up to 90%.",
  },
  {
    skill: "compute-picking",
    prompt:
      "Your Lambda is CPU-bound and takes 4 s at 512 MB. You raise it to 2,048 MB and it takes 1 s. What happened to cost?",
    options: [
      "It roughly quadrupled",
      "It stayed about the same, and latency improved 4×",
      "It doubled",
      "Memory doesn't affect CPU"],
    answer: 1,
    explain:
      "CPU scales with memory, and billing is GB-seconds. 4× the memory for 1/4 the duration is roughly cost-neutral — and four times faster. 128 MB is rarely the cheapest setting for real work.",
  },
  {
    skill: "compute-picking",
    prompt: "Which purchase option suits a fault-tolerant CI runner fleet?",
    options: ["On-demand", "Spot with diversified instance pools", "3-year all-upfront RIs", "Dedicated Hosts"],
    answer: 1,
    explain:
      "Restartable, stateless, interruption-tolerant work is the canonical Spot case — up to 90% off, with diversification across types and AZs keeping interruptions rare.",
  },

  /* ---------- Data picking ---------- */
  {
    skill: "data-picking",
    prompt: "Six EC2 instances must read and write the same files concurrently with POSIX semantics. What storage?",
    options: ["S3", "EBS attached to each", "EFS", "Instance store"],
    answer: 2,
    explain:
      "EFS is elastic multi-AZ NFS that many instances can mount at once. EBS volumes attach to a single instance, and S3 isn't a file system.",
  },
  {
    skill: "data-picking",
    prompt: "A Spark job needs the fastest possible scratch space for shuffle data. What storage?",
    options: ["gp3 EBS", "Instance store NVMe", "S3", "EFS"],
    answer: 1,
    explain:
      "Shuffle data is temporary and IO-intensive — exactly what physically attached, ephemeral NVMe is for. Losing it on termination doesn't matter.",
  },
  {
    skill: "data-picking",
    prompt: "Your application needs ad-hoc reporting queries that change every sprint. Which database?",
    options: ["DynamoDB", "RDS/Aurora PostgreSQL", "ElastiCache", "Neptune"],
    answer: 1,
    explain:
      "Evolving, unpredictable queries need a query planner and joins. DynamoDB requires designing the table around known access patterns, so unanticipated queries are painful to add.",
  },
  {
    skill: "data-picking",
    prompt:
      "A DynamoDB table throttles requests while consumed capacity sits far below provisioned. What's wrong?",
    options: [
      "The region is out of capacity",
      "A hot partition — traffic is skewed to one partition key",
      "A GSI is missing",
      "TTL is deleting items"],
    answer: 1,
    explain:
      "Capacity is distributed across partitions. A low-cardinality or skewed key concentrates traffic on one, throttling it while the table looks idle. Fix the key or write-shard it.",
  },
  {
    skill: "data-picking",
    prompt: "Reporting queries are slowing the production database. Cheapest correct fix?",
    options: [
      "Enable Multi-AZ",
      "Add a read replica and point reporting at it",
      "Increase backup retention",
      "Add more application servers"],
    answer: 1,
    explain:
      "Read replicas offload read traffic. Multi-AZ standbys exist for failover, not for serving reads (outside Multi-AZ cluster deployments).",
  },
  {
    skill: "data-picking",
    prompt: "Athena queries on 2 TB of JSON are slow and expensive. Best fix?",
    options: [
      "Provision more Athena capacity",
      "Convert to partitioned, compressed Parquet",
      "Move the data to DynamoDB",
      "Increase the query timeout"],
    answer: 1,
    explain:
      "Athena bills per byte scanned. Columnar Parquet plus partition pruning means a query reads a small fraction of the data — routinely a 90%+ reduction in both cost and time.",
  },
  {
    skill: "data-picking",
    prompt: "Where should years of historical events live for analytics?",
    options: [
      "In the OLTP database",
      "In S3 as partitioned Parquet, queried by Athena or Redshift",
      "In ElastiCache",
      "In CloudWatch Logs"],
    answer: 1,
    explain:
      "Columnar files in S3 are cheap and scan-efficient. Keeping analytical history in the transactional database hurts both cost and OLTP performance.",
  },
  {
    skill: "data-picking",
    prompt: "A bucket of 50 TB has unpredictable access patterns. Which storage class?",
    options: ["Standard", "Intelligent-Tiering", "Glacier Deep Archive", "One Zone-IA"],
    answer: 1,
    explain:
      "Intelligent-Tiering moves objects between access tiers automatically with no retrieval fees on the main tiers — the low-risk default when you can't predict access.",
  },

  /* ---------- Security ---------- */
  {
    skill: "security",
    prompt: "An EC2 instance needs to read from S3. What's the correct mechanism?",
    options: [
      "Store an access key in /etc/environment",
      "Attach an IAM role via an instance profile",
      "Make the bucket public",
      "Use the root user's keys"],
    answer: 1,
    explain:
      "Instance profiles deliver temporary, auto-rotating credentials through IMDS. Nothing is stored on disk and nothing needs rotating.",
  },
  {
    skill: "security",
    prompt:
      "A role has s3:* and the bucket policy allows it, but GetObject returns AccessDenied. Most likely cause?",
    options: [
      "The bucket is in another region",
      "The objects use SSE-KMS and the key policy omits the role",
      "S3 is eventually consistent",
      "Versioning is enabled"],
    answer: 1,
    explain:
      "KMS key policies are authoritative — readers need kms:Decrypt on the key as well as s3:GetObject. The error mentions S3, but the problem is KMS.",
  },
  {
    skill: "security",
    prompt: "How should the database tier restrict access to only the application servers?",
    options: [
      "Allow the app subnet CIDR",
      "Allow inbound from the app tier's security group",
      "Allow 0.0.0.0/0 and rely on passwords",
      "Add a NACL rule per instance IP"],
    answer: 1,
    explain:
      "Referencing the app security group stays correct as instances scale, and is tighter than a subnet CIDR that might contain other workloads.",
  },
  {
    skill: "security",
    prompt: "An admin with AdministratorAccess can't launch an instance in ap-south-1. Why?",
    options: [
      "A missing IAM policy",
      "An SCP restricting regions",
      "The instance type is retired",
      "MFA isn't enabled"],
    answer: 1,
    explain:
      "SCPs cap what any principal in the account can do, including administrators. Region restriction is one of the most common organisation guardrails.",
  },
  {
    skill: "security",
    prompt: "Which permission is the classic privilege-escalation path?",
    options: ["s3:GetObject", "iam:PassRole without conditions", "ec2:DescribeInstances", "logs:PutLogEvents"],
    answer: 1,
    explain:
      "Unconstrained PassRole lets someone attach a highly privileged role to a resource they control. Scope it by role ARN and iam:PassedToService.",
  },
  {
    skill: "security",
    prompt: "You must guarantee backups can't be deleted for seven years, even by an admin. What do you use?",
    options: [
      "Versioning alone",
      "S3 Object Lock in compliance mode",
      "MFA Delete",
      "Glacier Deep Archive"],
    answer: 1,
    explain:
      "Compliance mode makes objects immutable for the retention period with no override path — not even for root. That's what regulatory retention and ransomware resistance require.",
  },
  {
    skill: "security",
    prompt: "How should a GitHub Actions workflow authenticate to AWS?",
    options: [
      "An IAM user's access keys in repository secrets",
      "OIDC federation with the trust policy pinned to the repo and branch",
      "The root user",
      "A shared key in the workflow file"],
    answer: 1,
    explain:
      "OIDC means no stored credentials at all. The `sub` condition is essential — without it, any GitHub repository in the world could assume your role.",
  },
  {
    skill: "security",
    prompt: "Which control most directly limits data exfiltration from a compromised instance?",
    options: [
      "Inbound security group rules",
      "Egress restrictions plus VPC endpoints and domain filtering",
      "A larger NACL",
      "Shield Standard"],
    answer: 1,
    explain:
      "Exfiltration is outbound traffic. Most teams restrict inbound carefully and leave egress wide open — closing it is high-value and uncommon.",
  },

  /* ---------- Troubleshooting ---------- */
  {
    skill: "troubleshoot",
    prompt: "An instance in a private subnet can't reach the internet. What do you check first?",
    options: [
      "The instance type",
      "The route table's 0.0.0.0/0 target and whether a NAT gateway exists in a public subnet",
      "The AMI version",
      "IAM permissions"],
    answer: 1,
    explain:
      "Routing is the first layer. Private subnets need a default route to a NAT gateway that itself sits in a public subnet with an IGW route.",
  },
  {
    skill: "troubleshoot",
    prompt: "A VPC Flow Log shows no entry at all for a connection attempt. What does that suggest?",
    options: [
      "A security group rejected it",
      "The packet never got routed to that ENI",
      "The NACL allowed it",
      "The application crashed"],
    answer: 1,
    explain:
      "A REJECT means a filter dropped it. No entry usually means routing never delivered the packet there — so look at route tables and destination, not firewalls.",
  },
  {
    skill: "troubleshoot",
    prompt: "The site got slow 20 minutes ago. What's your first question?",
    options: [
      "Which instance type are we using?",
      "What changed — deploys, IaC applies, config, traffic, AWS Health?",
      "Should we move regions?",
      "Do we need more AZs?"],
    answer: 1,
    explain:
      "Most incidents follow a change. Deployments, IaC applies, manual console edits, and AWS Health notices resolve a surprising share of incidents in minutes.",
  },
  {
    skill: "troubleshoot",
    prompt: "An ECS task loops PENDING → STOPPED. Where do you look?",
    options: [
      "CloudFront logs",
      "describe-tasks stoppedReason — usually ECR pull permissions, image architecture, or no route to ECR",
      "The Route 53 hosted zone",
      "IAM Access Analyzer"],
    answer: 1,
    explain:
      "stoppedReason names the cause directly. The usual four are execution-role ECR permissions, an ARM/x86 image mismatch, an immediate app crash, or no network path to ECR/Secrets Manager.",
  },
  {
    skill: "troubleshoot",
    prompt: "Instances pass EC2 status checks but users get errors. What's misconfigured?",
    options: [
      "The AMI",
      "The ASG isn't using ELB health checks, so a hung app is never replaced",
      "The instance type is too small",
      "Cross-zone load balancing"],
    answer: 1,
    explain:
      "EC2 status checks only prove the instance is running. ELB health checks probe the application, which is what catches a deadlocked process.",
  },
  {
    skill: "troubleshoot",
    prompt: "SQS messages are being processed twice. Most likely cause?",
    options: [
      "The queue is FIFO",
      "The visibility timeout is shorter than the processing time",
      "Long polling is enabled",
      "The DLQ is full"],
    answer: 1,
    explain:
      "The message becomes visible again while still being processed, so a second consumer picks it up. Set visibility comfortably above processing time — and make consumers idempotent anyway.",
  },
  {
    skill: "troubleshoot",
    prompt: "The bill doubled and most of it is 'EC2-Other'. What is that?",
    options: [
      "Reserved Instance charges",
      "NAT gateway processing, data transfer, and EBS",
      "Lambda invocations",
      "S3 storage"],
    answer: 1,
    explain:
      "EC2-Other is where the costs nobody consciously chose hide. Check NAT data processing, cross-AZ and egress transfer, and orphaned EBS volumes and snapshots.",
  },
  {
    skill: "troubleshoot",
    prompt: "A Lambda times out intermittently at 3 s but usually returns in 200 ms. What do you check?",
    options: [
      "The function's memory only",
      "X-Ray for downstream latency, cold starts, throttles, and database connection exhaustion",
      "The S3 bucket policy",
      "The Route 53 TTL"],
    answer: 1,
    explain:
      "Intermittent tails almost always come from something outside your code: a slow downstream call, a cold start, concurrency throttling, or a saturated connection pool. X-Ray shows which.",
  },

  /* ---------- Acronyms ---------- */
  {
    skill: "acronyms",
    prompt: "IAM stands for…",
    options: [
      "Infrastructure Access Model",
      "Identity and Access Management",
      "Instance Allocation Manager",
      "Internal Audit Module"],
    answer: 1,
    explain:
      "Identity and Access Management — the global, free service that authorises every single AWS API call via users, groups, roles, and policies.",
  },
  {
    skill: "acronyms",
    prompt: "In 'RTO and RPO', RPO means…",
    options: [
      "Recovery Priority Order",
      "Recovery Point Objective — how much data you can afford to lose",
      "Redundant Primary Operation",
      "Regional Provisioning Option"],
    answer: 1,
    explain:
      "RPO is data loss measured in time and drives backup/replication frequency. RTO is how long you can be down and drives standby capacity and automation.",
  },
  {
    skill: "acronyms",
    prompt: "An ARN is…",
    options: [
      "Automated Resource Notification",
      "Amazon Resource Name — the unique identifier for any AWS resource",
      "AWS Route Node",
      "Application Runtime Namespace"],
    answer: 1,
    explain:
      "arn:partition:service:region:account-id:resource. S3 and IAM are global services, so their ARNs leave the region and/or account fields empty.",
  },
  {
    skill: "acronyms",
    prompt: "STS is the service that…",
    options: [
      "Stores static content",
      "Issues temporary credentials when a role is assumed",
      "Tracks service quotas",
      "Sends transactional email"],
    answer: 1,
    explain:
      "Security Token Service. Temporary keys start with ASIA; long-lived IAM user keys start with AKIA — a useful tell when auditing a system.",
  },
  {
    skill: "acronyms",
    prompt: "IRSA in an EKS context means…",
    options: [
      "Instance Reserved Scaling Allocation",
      "IAM Roles for Service Accounts — per-pod AWS permissions via OIDC",
      "Internal Route Security Agent",
      "Immutable Registry Signing Authority"],
    answer: 1,
    explain:
      "Annotating a Kubernetes ServiceAccount with a role ARN gives each pod its own IAM permissions instead of sharing the node's role.",
  },
  {
    skill: "acronyms",
    prompt: "IMDS is…",
    options: [
      "Instance Metadata Service — where an instance reads its own role credentials",
      "Internal Message Delivery System",
      "Infrastructure Monitoring Data Store",
      "Identity Management Directory Service"],
    answer: 0,
    explain:
      "Reachable at 169.254.169.254. Always enforce IMDSv2, whose token requirement blocks SSRF attacks that would otherwise steal role credentials.",
  },
  {
    skill: "acronyms",
    prompt: "A CIDR block like 10.0.0.0/16 describes…",
    options: [
      "A billing tier",
      "A range of IP addresses; a smaller number after the slash means a bigger network",
      "A container image digest",
      "A CloudFront cache rule"],
    answer: 1,
    explain:
      "Classless Inter-Domain Routing notation. /16 gives 65,536 addresses, /24 gives 256 — and AWS reserves 5 IPs in every subnet.",
  },
  {
    skill: "acronyms",
    prompt: "An SCP in AWS Organizations…",
    options: [
      "Grants permissions to member accounts",
      "Caps the maximum permissions any principal in an account can have",
      "Sets a spending limit",
      "Configures a service endpoint"],
    answer: 1,
    explain:
      "Service Control Policies only limit; they never grant. Effective permission is the intersection of the SCP and what IAM allows.",
  },
  {
    skill: "acronyms",
    prompt: "OAC, in the context of S3 and CloudFront, is…",
    options: [
      "Object Access Counter",
      "Origin Access Control — letting only CloudFront read a private bucket",
      "Organizational Account Configuration",
      "Optimised Availability Cluster"],
    answer: 1,
    explain:
      "It's why you never need a public bucket: keep S3 private, allow only the distribution to read it, and gain TLS, caching, and WAF at the same time.",
  },
  {
    skill: "acronyms",
    prompt: "EMF in CloudWatch stands for…",
    options: [
      "Event Metric Filter",
      "Embedded Metric Format — metrics emitted inside structured log lines",
      "Elastic Monitoring Framework",
      "Extended Metrics Feed"],
    answer: 1,
    explain:
      "Write a specially structured JSON log line and CloudWatch extracts metrics from it — no PutMetricData call, and the log context stays attached to the number.",
  },
  {
    skill: "acronyms",
    prompt: "PITR means…",
    options: [
      "Peak Instance Traffic Ratio",
      "Point-In-Time Recovery — restoring to any second in the retention window",
      "Private Internal Transit Route",
      "Provisioned IOPS Throughput Rating"],
    answer: 1,
    explain:
      "Available on RDS, Aurora, and DynamoDB for up to 35 days. Note that a restore creates a new instance or table with a new endpoint.",
  },
  {
    skill: "acronyms",
    prompt: "The 'awsvpc' network mode in ECS means…",
    options: [
      "Tasks share the host's network stack",
      "Each task gets its own ENI, private IP, and security group",
      "Tasks can only reach VPC endpoints",
      "Networking is disabled"],
    answer: 1,
    explain:
      "Per-task network identity means per-service security group rules — and it consumes subnet IP addresses, which matters when sizing subnets.",
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
      "Lambda for event-driven, spiky, short work; Fargate for long-running services; EC2 when you genuinely need the machine (GPU, kernel, licence); Batch on Spot for queues of restartable jobs. Choose the highest abstraction that fits, not the most familiar one.",
  },
  {
    rule: "Choose the data store by access pattern, not habit.",
    detail:
      "S3 for objects, EBS for one instance's disk, EFS for shared POSIX files, instance store for ephemeral speed. RDS/Aurora when queries are ad hoc; DynamoDB when access patterns are known and scale is large. Analytics belongs in S3 as partitioned Parquet, not in the OLTP database.",
  },
  {
    rule: "Roles, never long-lived keys.",
    detail:
      "Instance profiles on EC2, task roles on ECS, execution roles on Lambda, IRSA on EKS, OIDC for CI, IAM Identity Center for humans. An AKIA-prefixed key in a running system is a finding, not a design.",
  },
  {
    rule: "Deny wins, and the ceiling is an intersection.",
    detail:
      "Effective permission = SCP ∩ permission boundary ∩ session policy ∩ identity policy, and any explicit Deny anywhere ends the discussion. When something is denied unexpectedly, check the ceilings and the KMS key policy before the identity policy.",
  },
  {
    rule: "Two AZs before anything clever.",
    detail:
      "Multi-AZ is the highest-value resilience decision on AWS and is usually near-free — including a NAT gateway per AZ. Multi-region costs consistency, operational surface, and money; reach for it only when a real requirement demands it.",
  },
  {
    rule: "Decouple, then assume duplicates.",
    detail:
      "A queue or event bus turns a dependency's outage into a delay. But SQS, SNS, EventBridge, and Lambda all deliver at least once, so every consumer must be idempotent — and retries need exponential backoff with jitter or they become the outage.",
  },
  {
    rule: "Optimise cost in order; commit last.",
    detail:
      "Attribute with tags, eliminate waste, schedule non-production off, rightsize, re-architect the expensive parts (gateway endpoints, CloudFront, lifecycle tiering, Spot) — and only then buy Savings Plans. Committing first locks in the waste for one to three years.",
  },
  {
    rule: "Alarm on symptoms; make every page actionable.",
    detail:
      "Error rate and latency are what users feel; CPU may or may not matter. If the runbook says 'watch it', it's a dashboard, not a page. Deleting a noisy alarm is genuine reliability work, because alert fatigue is how real incidents get missed.",
  },
  {
    rule: "Ask what changed.",
    detail:
      "Most incidents follow a change. Deployments, IaC applies, manual console edits, and the AWS Health Dashboard resolve a large share of incidents before any theorising begins — and stabilising comes before diagnosing.",
  },
];
