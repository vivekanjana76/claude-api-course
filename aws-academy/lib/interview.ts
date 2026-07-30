import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  // ── Foundations ──
  {
    topic: "Foundations",
    q: "Explain Regions, Availability Zones, and edge locations.",
    a: "A Region is a geographic area (us-east-1) containing multiple Availability Zones. An AZ is one or more discrete data centers with independent power, cooling, and networking, linked to the others by low-latency private fibre. Edge locations are 600+ smaller points of presence running CloudFront and Route 53. Regions are isolated from each other by design — nothing replicates between them unless you configure it. Practically: spread across at least two AZs for resilience, choose a Region for latency, compliance, service availability, and cost, and use edge locations to get content near users without going multi-region.",
  },
  {
    topic: "Foundations",
    q: "What is the shared responsibility model?",
    a: "AWS is responsible for security *of* the cloud — physical facilities, hardware, the hypervisor, and the internals of managed services. The customer is responsible for security *in* the cloud — data, IAM configuration, network and firewall rules, encryption choices, and OS patching on EC2. The line moves with the service: on EC2 you patch the guest OS, on RDS AWS patches the engine, on Lambda AWS owns everything below your code. Essentially every publicised 'AWS breach' has been a customer-side misconfiguration.",
  },
  {
    topic: "Foundations",
    q: "Why do organisations run many AWS accounts instead of one?",
    a: "The account is the strongest isolation boundary AWS offers — for IAM, service quotas, billing, and blast radius. Separate accounts mean a developer experiment can't reach production, one workload's quota exhaustion doesn't affect another, and cost is attributable by construction. AWS Organizations groups accounts into OUs with SCPs setting the maximum permissions, consolidated billing pools volume discounts, and Control Tower automates the whole landing zone with an account factory.",
  },
  {
    topic: "Foundations",
    q: "How does AWS pricing generally work, and what surprises people?",
    a: "Nearly everything reduces to compute time, storage GB-months, data transferred, and requests made. The surprises are almost always data transfer and idle capacity: NAT gateways bill hourly plus per GB processed, cross-AZ traffic is billed in both directions, internet egress is billed while ingress is free, and stopped instances still bill for their EBS volumes. On a bill you've never seen before, check the EC2-Other line first — that's where NAT, transfer, and EBS hide.",
  },

  // ── IAM & security ──
  {
    topic: "IAM & security",
    q: "Walk me through how IAM decides whether a request is allowed.",
    a: "Every request starts as an implicit deny. Then: any explicit Deny anywhere — identity policy, resource policy, SCP, permission boundary, or session policy — immediately denies. Otherwise an applicable SCP must allow it, any permission boundary must allow it, any session policy must allow it, and finally an identity policy or resource policy must explicitly allow it. Effective permission is the intersection of every layer. Same-account access needs an allow from either the identity or the resource policy; cross-account needs both sides.",
  },
  {
    topic: "IAM & security",
    q: "Why prefer IAM roles over IAM users?",
    a: "Roles issue short-lived credentials through STS, so there's no permanent secret to leak, rotate, or find in a public repository. Every AWS compute service can assume a role natively — instance profiles on EC2, task roles on ECS, execution roles on Lambda, IRSA on EKS — and CI systems can federate via OIDC. Humans should reach AWS through IAM Identity Center and permission sets. If I see an AKIA-prefixed key in a running system, that's a finding: it's a long-lived user key that should be a role.",
  },
  {
    topic: "IAM & security",
    q: "I have s3:* permissions and the bucket policy allows me, but I still get AccessDenied. Why?",
    a: "Most commonly the objects are encrypted with SSE-KMS and the KMS key policy doesn't grant my principal kms:Decrypt or kms:GenerateDataKey. KMS key policies are authoritative — IAM alone cannot grant key access. Other candidates: Block Public Access if the access is public, an explicit Deny in the bucket policy or an SCP, a VPC endpoint policy restricting the path, or a permission boundary on the role. I'd confirm the identity with sts get-caller-identity, then use the IAM Policy Simulator and check the key policy.",
  },
  {
    topic: "IAM & security",
    q: "How do you give a GitHub Actions pipeline access to AWS?",
    a: "OIDC federation, not stored keys. Register GitHub's OIDC provider in IAM, create a role whose trust policy allows sts:AssumeRoleWithWebIdentity from that provider, and — critically — condition on the `sub` claim pinning the org, repo, and branch or environment. The workflow requests id-token: write permission and uses configure-aws-credentials. Without the sub condition, any GitHub repository in the world could assume the role, which has caused real breaches.",
  },
  {
    topic: "IAM & security",
    q: "What's the difference between an SCP and a permission boundary?",
    a: "Both cap permissions and neither grants anything. An SCP is set by organization administrators and applies to every principal in the member accounts under an OU — used for region restrictions, protecting CloudTrail and security services, and blocking root usage. A permission boundary applies to a single user or role and is typically used for delegation: give developers iam:CreateRole with a condition requiring your boundary policy, so they can create roles freely but none can exceed the boundary.",
  },
  {
    topic: "IAM & security",
    q: "How would you respond to a leaked AWS access key?",
    a: "Contain first: disable or delete the key immediately and revoke active sessions with an aws:TokenIssueTime deny policy. Then assess with CloudTrail — every action that credential took — and Detective for the wider picture. Eradicate: terminate resources the attacker created, checking every region, not just the ones we use, because attackers deliberately use unmonitored regions. Recover: rotate anything the credential could read, and verify data integrity. Finally prevent: move that workload to a role, enforce IMDSv2, add SCP region restrictions, and put secret scanning in CI.",
  },
  {
    topic: "IAM & security",
    q: "Explain envelope encryption and why KMS uses it.",
    a: "KMS can only encrypt about 4 KB directly, and moving bulk data to a central service would be slow. So KMS generates a data key, the service encrypts your data locally with it, and KMS encrypts the data key. The stored object is the encrypted data plus the encrypted data key. Decryption calls KMS to unwrap the data key, then decrypts locally. This gives fast bulk cryptography with centrally controlled, rotatable, CloudTrail-audited master keys that never leave KMS.",
  },

  // ── Networking ──
  {
    topic: "Networking",
    q: "What makes a subnet public or private?",
    a: "Its route table. A public subnet has a 0.0.0.0/0 route to an Internet Gateway; a private subnet routes 0.0.0.0/0 to a NAT gateway for outbound-only access, or has no default route at all if it's fully isolated. There's no 'public' checkbox on a subnet. For something to be reachable from the internet you need all four of: an IGW route, a public IP or Elastic IP, a permitting security group, and permitting NACLs in both directions.",
  },
  {
    topic: "Networking",
    q: "Security groups versus NACLs?",
    a: "Security groups are stateful, allow-only, attach to ENIs, and can reference other security groups as sources — so you can write sg-db allows 5432 from sg-app, and it stays correct as instances scale. NACLs are stateless, numbered, attach to subnets, and support explicit deny. Because NACLs are stateless, allowing inbound 443 isn't enough — you also need outbound ephemeral ports 1024–65535 for the reply, which is the classic NACL bug. In practice I do the work in security groups and use NACLs only for explicit denies or a subnet-level backstop.",
  },
  {
    topic: "Networking",
    q: "An EC2 instance in a private subnet can't reach the internet. How do you debug it?",
    a: "In order: check the route table for a 0.0.0.0/0 route pointing at a NAT gateway; confirm the NAT gateway exists and sits in a *public* subnet with an IGW route; check the instance's security group allows outbound; check NACLs on both subnets in both directions including ephemeral ports; verify DNS resolution works; then check on the host whether traffic is even being attempted. VPC Reachability Analyzer traces the path and names the blocking component directly, and Flow Logs distinguish a REJECT (a filter dropped it) from no entry at all (routing never delivered it).",
  },
  {
    topic: "Networking",
    q: "When would you use Transit Gateway instead of VPC peering?",
    a: "Peering is fine for two or three VPCs — it's simple and cheap — but it's non-transitive, so every pair needs its own connection and routes, and a mesh grows as n(n−1)/2. Transit Gateway is a regional hub that VPCs, VPNs, and Direct Connect attach to, giving transitive routing plus separate route tables per attachment for segmentation (prod can't reach dev). Once you're beyond a handful of VPCs or need on-prem connectivity with segmentation, TGW is the answer. Neither works with overlapping CIDRs.",
  },
  {
    topic: "Networking",
    q: "What's the cheapest way to cut a large NAT gateway bill?",
    a: "Add a gateway VPC endpoint for S3 and DynamoDB. They're free, implemented as a route table entry, and stop that traffic being billed as NAT data processing — which for data-heavy workloads is often the single largest line item. Beyond that: interface endpoints for other heavily used services, keeping chatty traffic within an AZ, and checking whether private subnets genuinely need internet egress at all.",
  },
  {
    topic: "Networking",
    q: "ALB versus NLB — how do you choose?",
    a: "ALB is Layer 7: it routes on path, host, headers, and query strings, and gives you free ACM TLS, HTTP→HTTPS redirects, OIDC/Cognito authentication, WAF, access logs, weighted target groups for canaries, and Lambda targets. NLB is Layer 4: TCP/UDP, static Elastic IPs, source-IP preservation, extreme throughput, and ultra-low latency. Use ALB for HTTP applications, NLB when you need a fixed IP for a partner allowlist, non-HTTP protocols, or millions of requests per second. Note the asymmetry: cross-zone load balancing is on and free for ALB, off and billed for NLB.",
  },

  // ── Compute & containers ──
  {
    topic: "Compute",
    q: "Multi-AZ versus read replicas — what's the difference?",
    a: "Multi-AZ is about availability: a synchronous standby in another AZ with automatic failover in roughly 60–120 seconds (about 30 for Aurora), and in the classic form the standby isn't readable. Read replicas are about throughput: asynchronous copies you can read from, promoted manually, and available cross-region for DR. Production usually wants both. Crucially neither is a backup — a DROP TABLE replicates to every replica and standby in milliseconds.",
  },
  {
    topic: "Compute",
    q: "How does an Auto Scaling Group decide to add or remove instances, and what goes wrong?",
    a: "Usually target tracking: hold a metric at a target value, most often CPU or ALBRequestCountPerTarget — the latter tracks what users actually generate. What goes wrong: only enabling EC2 status checks, so a hung application keeps receiving traffic because the instance is technically alive; warmup set shorter than real time-to-ready, causing flapping; and stateful instances, so scale-in destroys sessions or files. The ASG's self-healing is arguably more valuable than its elasticity.",
  },
  {
    topic: "Compute",
    q: "When would you choose Lambda over Fargate, or EC2?",
    a: "Lambda for event-driven, spiky, short work — under 15 minutes, scaling to zero, billed per millisecond. Fargate for long-running containerised services where I don't want to manage nodes; roughly a 20–30% premium over EC2 that's usually cheaper than the engineering time it removes. EC2 when I genuinely need the machine: GPUs, a specific kernel, licensed software, or very high sustained volume where Spot and Savings Plans win. Real systems mix all three deliberately.",
  },
  {
    topic: "Compute",
    q: "Explain Lambda cold starts and what you'd do about them.",
    a: "A cold start is Lambda creating a new execution environment: downloading the package, starting the runtime, and running your init code. Warm invocations skip all three. Fixes in order of value: create SDK clients and load config in the init phase so warm invocations reuse them; shrink the deployment package; use ARM64; use SnapStart for JVM; and if a latency-critical path genuinely needs it, provisioned concurrency to keep environments warm — which costs money while idle. Note that the old multi-second VPC penalty was fixed in 2019; advice claiming otherwise is outdated.",
  },
  {
    topic: "Compute",
    q: "ECS or EKS?",
    a: "ECS if the team has no Kubernetes background, we're staying on AWS, and we want to ship — small vocabulary, deep IAM/ALB/CloudWatch integration, no control-plane fee. EKS if we already run Kubernetes, need its ecosystem (operators, Helm, Argo, KEDA), or require portability. The honest cost of EKS isn't the ~$73/month control plane, it's owning seven or more add-ons and upgrading them alongside Kubernetes minor versions every few months. Both run on Fargate if we don't want nodes. The wrong reason to choose EKS is that it looks better on a CV.",
  },
  {
    topic: "Compute",
    q: "What's the difference between an ECS task role and task execution role?",
    a: "The execution role is used by the ECS agent to pull the image from ECR, fetch secrets from Secrets Manager, and write logs to CloudWatch. The task role is what the application code inside the container uses to call AWS APIs. Confusing them is the most common ECS permissions bug, and the error messages rarely say which one is at fault — if the task won't start it's usually the execution role; if the app gets AccessDenied at runtime it's the task role.",
  },

  // ── Storage & data ──
  {
    topic: "Storage & data",
    q: "How would you secure an S3 bucket holding sensitive data?",
    a: "Block Public Access on at account and bucket level; Object Ownership set to bucket-owner-enforced to disable ACLs entirely; default encryption with SSE-KMS plus S3 Bucket Keys; a bucket policy denying non-TLS access, denying unencrypted uploads, and restricting to aws:PrincipalOrgID; versioning on with a lifecycle rule expiring noncurrent versions; Object Lock in compliance mode if it's backup or regulated data; and CloudTrail data events plus IAM Access Analyzer and Macie for detection. If it needs to be public-facing, it goes behind CloudFront with Origin Access Control rather than being made public.",
  },
  {
    topic: "Storage & data",
    q: "Is S3 eventually consistent?",
    a: "No — that's outdated. Since December 2020 S3 provides strong read-after-write consistency for all operations, including overwrites and deletes. A lot of blog content and older documentation still describes the eventual-consistency behaviour, which makes this a common interview trap in both directions.",
  },
  {
    topic: "Storage & data",
    q: "How do you protect S3 data against accidental deletion and ransomware?",
    a: "Durability protects against hardware failure, not against a delete command. The layers are: versioning so deletes create a delete marker; Object Lock in compliance mode for immutable retention that not even root can override; and replication into a separate AWS account whose credentials the production pipeline doesn't hold. That last one is the important structural control — if a compromised production account can reach the backups, they aren't backups. Then test a restore on a schedule.",
  },
  {
    topic: "Storage & data",
    q: "When is DynamoDB the right choice, and when is it wrong?",
    a: "Right when access patterns are known and stable, you need consistent single-digit-millisecond latency at large scale, and you want serverless operations with no connection limits. Wrong when queries are ad hoc and evolving, or you need joins and rich aggregation — DynamoDB makes you design the table around the queries, and adding an unanticipated access pattern later can mean a GSI at best or a migration at worst. If I need analytics over DynamoDB data, I export to S3 and query with Athena rather than scanning the table.",
  },
  {
    topic: "Storage & data",
    q: "What is a hot partition and how do you fix it?",
    a: "DynamoDB distributes data by hashing the partition key. If one key takes a disproportionate share of traffic — a global counter, or today's date — that partition throttles while overall consumed capacity looks low. Adaptive capacity absorbs mild skew, but the real fix is a better key: choose something with high cardinality, or write-shard by appending a random or calculated suffix and querying across the shards. CloudWatch Contributor Insights for DynamoDB names the offending keys directly.",
  },
  {
    topic: "Storage & data",
    q: "How would you cut Athena costs on a large data lake?",
    a: "Athena bills per byte scanned, so the answer is scan less: convert CSV/JSON to compressed Parquet, partition by the columns queries filter on (usually date), keep files reasonably sized to avoid small-file overhead, and select only the columns needed. That combination routinely reduces both cost and runtime by over 90%. Beyond that, Glue catalogs the schema and workgroup query limits stop a runaway query from scanning a terabyte by accident.",
  },

  // ── Operations & reliability ──
  {
    topic: "Operations",
    q: "The website is slow. Walk me through your investigation.",
    a: "First establish the symptom precisely: all users or some, all endpoints or one, since when, and what the actual latency and status codes are. Then ask what changed — deployments, IaC applies, config changes, traffic shifts, AWS Health notices — because most incidents follow a change. Then narrow by layer: Route 53 and CloudFront, then ALB target response time and 5XX and target health, then application logs by correlation ID, then X-Ray to see where the time goes, then RDS Performance Insights for slow queries or connection saturation. I'd mitigate before fully understanding — roll back, scale out, or shed load — because recovery comes before root cause.",
  },
  {
    topic: "Operations",
    q: "What makes a good CloudWatch alarm?",
    a: "It alerts on a symptom users feel — error rate, latency, queue age — rather than a cause like CPU that may or may not matter. Every page has an action; if the runbook says 'watch it', it's a dashboard not a page. TreatMissingData is set deliberately, because no data can mean healthy-and-idle or completely-dead. Composite alarms collapse one incident into one page rather than fifteen. And it's been tested — an alarm that has never fired is an untested assumption. Deleting noisy alarms is genuine reliability work, because alert fatigue causes missed incidents.",
  },
  {
    topic: "Operations",
    q: "CloudTrail versus AWS Config?",
    a: "CloudTrail records actions — who called which API, when, from where. Config records state — what each resource's configuration was over time, how resources relate, and whether they comply with rules. For 'who deleted the table?' use CloudTrail; for 'was this volume encrypted for the whole of last quarter?' use Config, because auditors want continuity, not a point-in-time check. Also worth knowing: CloudTrail can lag around 15 minutes, so for real-time security response you drive EventBridge rules off the specific API calls instead.",
  },
  {
    topic: "Operations",
    q: "How do you design a deployment so a bad release isn't an outage?",
    a: "Build the artifact once and promote the identical artifact through environments, so what was tested is what ships. Deploy progressively — canary via weighted target groups or blue/green via CodeDeploy — with CloudWatch alarms wired to automatic rollback. Enable the ECS deployment circuit breaker. Keep database migrations backwards compatible using expand/contract, because schema changes don't roll back the way code does. And make sure the health checks genuinely fail when the application is broken, since all of this automation is only as good as that signal.",
  },
  {
    topic: "Operations",
    q: "What are RTO and RPO, and how do they drive DR design?",
    a: "RTO is how long we can be down; RPO is how much data we can lose. Both are business decisions — my job is to price the options. They select a strategy from the ladder: backup and restore (hours, cheapest), pilot light (data replicating, compute off, tens of minutes), warm standby (a scaled-down live copy, minutes), and multi-site active/active (near zero, most expensive and hardest). I'd also say plainly that a DR plan that has never been executed is a hypothesis — the quarterly restore-and-failover exercise is what turns it into a measured number, and it always finds something the first time.",
  },
  {
    topic: "Operations",
    q: "When is multi-region genuinely justified?",
    a: "For a regulatory requirement, genuine global latency needs, or a business-critical RTO that multi-AZ can't meet. Not for reassurance. Multi-region brings data consistency problems, doubled operational surface — deploys, IAM, monitoring, and quotas in both places — cross-region transfer costs, and failover logic that must be regularly tested or it won't work when needed. Multi-AZ handles the failures that actually happen most often, and CloudFront gets you most of the global latency benefit for a fraction of the cost.",
  },

  // ── Architecture & cost ──
  {
    topic: "Architecture",
    q: "Design a scalable, highly available web application on AWS.",
    a: "Route 53 alias to CloudFront with WAF and an ACM certificate, then an ALB in public subnets across two AZs. Application tier as ECS Fargate services or an EC2 ASG in private subnets, stateless, autoscaling on request count per target. Data tier in isolated subnets: RDS or Aurora Multi-AZ with read replicas if reads dominate, plus ElastiCache for sessions and hot reads. S3 for static assets and uploads, reached via a gateway endpoint. Secrets in Secrets Manager, config in Parameter Store. CloudWatch and X-Ray for telemetry, CloudTrail and Config for audit. Everything in Terraform, deployed by a pipeline. The marks are in the details: why two AZs, why the app tier is private, why sessions aren't local, what happens when an AZ fails, and what it costs per month.",
  },
  {
    topic: "Architecture",
    q: "How do you decouple services, and why does it matter?",
    a: "Put a queue or event bus between them. SQS buffers work for one consumer group and gives retries, a DLQ, and backpressure so a spike becomes a longer queue rather than an outage. SNS or EventBridge fan out one event to many independent consumers — with SQS queues in front of each so a slow consumer can't lose messages. EventBridge adds content-based routing, so adding a sixth consumer is a new rule rather than a change to the producer. The consequence is that a downstream outage becomes a delay instead of a cascading failure — but every consumer must be idempotent, because all of these deliver at least once.",
  },
  {
    topic: "Architecture",
    q: "How would you handle a request that takes ten minutes to process?",
    a: "Not synchronously — API Gateway has a 29-second integration timeout regardless of the Lambda timeout. The pattern is: accept the request, return 202 Accepted with a job ID, put a message on SQS, and let a worker fleet process it — Fargate or Batch if it exceeds Lambda's 15 minutes. The client polls a status endpoint or receives a webhook or WebSocket notification. Step Functions is the right orchestrator if the work has multiple steps needing retries and compensating actions.",
  },
  {
    topic: "Architecture",
    q: "What causes a retry storm and how do you prevent it?",
    a: "A downstream service slows, every client retries a few times, load multiplies, it fails completely, and the retries continue — a self-inflicted outage that outlasts the original problem. Prevention: exponential backoff with jitter so retries don't synchronise, a hard cap on total attempts, circuit breakers that stop calling a failing dependency, timeouts on everything, and bounded connection pools. AWS SDKs implement adaptive retries already, so the common mistake is wrapping a naive retry loop around a client that's already retrying.",
  },
  {
    topic: "Cost",
    q: "The AWS bill doubled last month. How do you investigate?",
    a: "Cost Explorer grouped by service to find what moved, then by linked account and by tag to find who. If it's EC2-Other, that's NAT gateway processing, data transfer, or EBS. I'd check for a new region — forgotten load tests and, occasionally, compromised credentials show up as activity in regions we don't use. Cost Anomaly Detection findings and the daily granularity view usually pinpoint the day it started, which maps to a deployment or a configuration change. Then it's the usual suspects: an autoscaling group with a raised maximum, a log group with no retention, snapshots accumulating, or something left running after a test.",
  },
  {
    topic: "Cost",
    q: "You're asked to cut cloud spend by 30%. What's your plan?",
    a: "In order, because the order matters. First attribute: enforce tagging and produce a per-team view, since nothing improves until someone owns the number. Second eliminate waste — orphaned volumes and snapshots, idle load balancers and NAT gateways, unused Elastic IPs, forgotten environments. Third schedule non-production off outside working hours, which alone often cuts non-prod by 60–70%. Fourth rightsize using Compute Optimizer, move to newer generations and Graviton, and migrate gp2 to gp3. Fifth re-architect the expensive parts: gateway endpoints instead of NAT, CloudFront instead of raw egress, S3 lifecycle tiering, Spot for batch. Only then commit with Savings Plans — buying a commitment before the first five steps locks in the waste.",
  },
  {
    topic: "Cost",
    q: "Savings Plans, Reserved Instances, or Spot?",
    a: "Compute Savings Plans for the steady baseline — commit to a dollar per hour for one or three years, and they flex across instance family, region, EC2, Fargate, and Lambda. Reserved Instances still matter for RDS, ElastiCache, Redshift, and OpenSearch where Savings Plans don't apply. Spot for anything interruption-tolerant — CI runners, batch, big data, stateless capacity — at up to 90% off with a two-minute reclaim notice, provided you diversify across instance types and AZs and actually handle the notice. The rule is: commit to your trough, never your peak, and rightsize before committing.",
  },

  // ── Ways of working ──
  {
    topic: "Ways of working",
    q: "Why does Infrastructure as Code matter, and what goes wrong with it?",
    a: "It gives reproducibility, review before resources exist, disaster recovery as an apply rather than an archaeology project, an audit trail in git, and cheap teardown for ephemeral environments. What goes wrong: drift from manual console changes, which is why console write access should be rare and scheduled plans should alert on unexpected diffs; one enormous state file making every change slow and risky, so split state by blast radius; and environments that diverge because someone hand-edited staging, which quietly invalidates it as a rehearsal for production.",
  },
  {
    topic: "Ways of working",
    q: "How do you approach least privilege realistically?",
    a: "Iteratively, because nobody writes a perfect policy up front. Start broader in dev, observe actual usage through CloudTrail and IAM Access Analyzer's policy generation, tighten and apply in staging, watch for breakage, then promote. Then use Access Analyzer's unused-access findings quarterly to shrink further. Scope resources before actions — s3:* on one bucket is usually safer than s3:GetObject on everything — and pay particular attention to iam:PassRole and policy-editing permissions, which are the classic privilege-escalation paths. Teams that try to design least privilege on paper before the application exists usually ship something that blocks the app and gets replaced with a wildcard during an incident.",
  },
  {
    topic: "Ways of working",
    q: "How would you onboard a new team onto AWS safely?",
    a: "Give them their own accounts under an OU with SCP guardrails — approved regions, no disabling security services, no root usage. Access through IAM Identity Center permission sets rather than IAM users. A landing-zone baseline already applied: CloudTrail and Config to the log archive account, GuardDuty on, networking and DNS from the shared services account. IaC from day one with a starter repository and reusable modules, plus policy-as-code in CI so insecure patterns fail the pull request rather than reaching production. And a budget with alerts, because cost feedback should arrive in days, not at month end.",
  },
  {
    topic: "Ways of working",
    q: "Tell me about a time something you built broke in production.",
    a: "Use STAR and be specific. Situation and task briefly, then spend most of the answer on what *you* did — how you detected it, what you checked, how you mitigated before diagnosing, how you communicated — and finish with a quantified result and what changed afterwards. The strongest versions name a real mistake, own it without deflecting, and describe a systemic fix rather than 'I was more careful next time'. Interviewers are assessing ownership and judgement under pressure, not whether you've ever broken anything — everyone has.",
  },
];
