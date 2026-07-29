import type { Module } from "./types";

export const observability: Module = {
  id: "observability",
  title: "Observability, operations & cost",
  blurb:
    "CloudWatch metrics, logs and alarms, X-Ray tracing, CloudTrail and Config for audit, incident practice — and the FinOps discipline that keeps the bill honest.",
  accent: "rose",
  lessons: [
    {
      slug: "cloudwatch",
      title: "CloudWatch: metrics, logs, alarms & dashboards",
      summary:
        "The three telemetry pillars on AWS, how to query logs fast, and how to design alarms that page a human only when a human is needed.",
      minutes: 11,
      blocks: [
        { type: "p", text: "**Amazon CloudWatch** is the default telemetry service on AWS: metrics, logs, alarms, dashboards, and events. It's rarely anyone's favourite tool, and it's the one you'll use every day." },
        { type: "diagram", name: "observability-pillars", caption: "Metrics tell you something is wrong; logs and traces tell you what and where." },
        { type: "h2", text: "Metrics" },
        { type: "list", items: [
          "**Namespaces** group metrics (`AWS/EC2`, `AWS/Lambda`, or your own `MyApp/Orders`); **dimensions** are the key-value pairs that identify a specific series.",
          "**Standard resolution is 1 minute; high resolution is 1 second** (billed more). Most AWS services publish at 1 or 5 minutes by default.",
          "**Detailed monitoring** on EC2 gives 1-minute instead of 5-minute metrics — worth enabling for anything autoscaled.",
          "**Memory and disk usage are NOT free EC2 metrics** — the hypervisor can't see inside the guest. Install the **CloudWatch agent** to publish them, which is why so many teams are blind to memory pressure.",
          "**Metric math and anomaly detection** let you build composite signals (error rate as a percentage) and dynamic bands instead of static thresholds.",
        ]},
        { type: "callout", kind: "key", text: "**Embedded Metric Format (EMF)** is the cheapest way to emit custom metrics: write a specially structured JSON log line and CloudWatch extracts metrics from it automatically. No extra API call, no `PutMetricData` cost per data point, and you keep the full log context alongside the number." },
        { type: "code", lang: "python", caption: "Custom metrics via EMF with Powertools", code: `from aws_lambda_powertools import Logger, Metrics, Tracer
from aws_lambda_powertools.metrics import MetricUnit

logger = Logger(service="orders")
metrics = Metrics(namespace="MyApp", service="orders")
tracer = Tracer(service="orders")

@metrics.log_metrics          # flushes EMF on exit
@tracer.capture_lambda_handler
@logger.inject_lambda_context
def handler(event, context):
    order_id = event["orderId"]
    logger.info("processing order", extra={"order_id": order_id})

    metrics.add_metric(name="OrdersProcessed", unit=MetricUnit.Count, value=1)
    metrics.add_metadata(key="order_id", value=order_id)   # searchable, not a dimension
    return {"ok": True}` },
        { type: "h2", text: "Logs" },
        { type: "list", items: [
          "**Log groups** (per application/service) contain **log streams** (per instance, container, or function).",
          "**Set a retention period on every log group.** The default is 'never expire', and forgotten log groups quietly become one of the larger line items on a mature account's bill.",
          "**Logs Insights** is a purpose-built query language over your logs — fast, and priced per GB scanned.",
          "**Metric filters** turn a log pattern into a CloudWatch metric you can alarm on (e.g. counting `ERROR` lines).",
          "**Subscription filters** stream logs in real time to Lambda, Kinesis, or OpenSearch for further processing.",
          "**Log class Infrequent Access** cuts ingestion cost for logs you keep for compliance but rarely query.",
        ]},
        { type: "code", lang: "sql", caption: "Logs Insights queries worth keeping", code: `-- slowest requests in the last hour, with their request IDs
fields @timestamp, @requestId, @duration, path
| filter @type = "REPORT"
| sort @duration desc
| limit 20

-- error rate per minute
fields @timestamp, level
| filter level = "ERROR"
| stats count(*) as errors by bin(1m)

-- follow one request across every service (structured JSON logs)
fields @timestamp, service, level, message
| filter correlation_id = "8f2c1d90-3b41-4a77-9c62-0e5b8a1f2d33"
| sort @timestamp asc

-- Lambda cold starts and their cost
filter @type = "REPORT"
| stats count(*) as invocations,
        count(@initDuration) as cold_starts,
        avg(@initDuration) as avg_init_ms,
        avg(@billedDuration) as avg_billed_ms` },
        { type: "callout", kind: "tip", text: "**Log structured JSON with a correlation ID on every line.** It's a small discipline that converts log searching from grep-and-hope into precise queries — and it's the single biggest quality-of-life improvement in distributed debugging." },
        { type: "h2", text: "Alarms that people trust" },
        { type: "compare", caption: "Alarm design that avoids fatigue.", columns: ["Principle", "In practice"], rows: [
          { label: "Alert on symptoms, not causes", cells: ["Page on error rate and latency (users feel these), not on CPU at 80% (users don't)"] },
          { label: "Every page needs an action", cells: ["If the runbook says 'watch it', it should be a dashboard or ticket, not a page"] },
          { label: "Use composite alarms", cells: ["Combine conditions so one incident produces one page, not fifteen"] },
          { label: "Set `TreatMissingData` deliberately", cells: ["No data can mean healthy *or* completely dead — decide which for each alarm"] },
          { label: "Alarm on the absence of activity", cells: ["A queue that stops being consumed is as bad as one that overflows"] },
          { label: "Test them", cells: ["An alarm that has never fired is an untested assumption"] },
        ]},
        { type: "callout", kind: "warn", text: "**Alert fatigue is a real operational failure mode.** A team that receives 40 noisy pages a week stops reading them, and the one that mattered is missed. Deleting or downgrading a noisy alarm is genuine reliability work — treat it that way." },
        { type: "h2", text: "The metrics worth alarming on" },
        { type: "list", items: [
          "**ALB** — `HTTPCode_Target_5XX_Count`, `TargetResponseTime` p99, `UnHealthyHostCount`, `RejectedConnectionCount`.",
          "**Lambda** — `Errors`, `Throttles`, `Duration` p99 approaching the timeout, `ConcurrentExecutions` against the limit, DLQ depth.",
          "**RDS/Aurora** — `CPUUtilization`, `FreeableMemory`, `DatabaseConnections`, `ReadLatency`/`WriteLatency`, `ReplicaLag`, free storage.",
          "**SQS** — `ApproximateAgeOfOldestMessage` (the best single queue-health signal) and DLQ `ApproximateNumberOfMessagesVisible`.",
          "**ECS/EKS** — running task count vs desired, pending pods, CPU/memory utilisation against requests.",
          "**Billing** — an estimated-charges alarm in `us-east-1`, plus AWS Budgets alerts.",
        ]},
        { type: "h2", text: "Beyond CloudWatch" },
        { type: "p", text: "CloudWatch is the default, not the only option. **Amazon Managed Grafana** and **Managed Prometheus** suit Kubernetes-heavy shops; **OpenSearch** is common for log analytics at scale; Datadog, Grafana Cloud, and Honeycomb are widely used commercially. **ADOT (AWS Distro for OpenTelemetry)** is the vendor-neutral collector that lets you emit once and send anywhere — a good default in 2026 because it keeps your options open." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Namespace / dimension** = how metrics are grouped and identified. **High-resolution metric** = 1-second granularity. **EMF** (Embedded Metric Format) = emitting metrics inside structured log lines. **Metric filter** = turning a log pattern into a metric. **Composite alarm** = an alarm over other alarms. **Correlation ID** = an identifier threaded through every log line of one request. **p99** = the 99th percentile, the slow tail users actually complain about. **Alert fatigue** = ignoring alerts because too many are noise. **ADOT** = AWS's OpenTelemetry distribution." },
      ],
      takeaways: [
        "CloudWatch covers metrics, logs, alarms, and dashboards; memory and disk on EC2 need the agent.",
        "EMF emits custom metrics from structured log lines with no extra API cost and full context.",
        "Set retention on every log group — 'never expire' is a real and avoidable cost.",
        "Alarm on user-visible symptoms, make every page actionable, and set TreatMissingData deliberately.",
        "Structured JSON logs with a correlation ID make Logs Insights queries precise instead of hopeful.",
      ],
      flashcards: [
        { front: "Why isn't EC2 memory usage in CloudWatch by default?", back: "The hypervisor can't see inside the guest OS. Install the CloudWatch agent to publish memory and disk metrics." },
        { front: "What is Embedded Metric Format?", back: "Structured JSON log lines that CloudWatch parses into metrics automatically — custom metrics with no PutMetricData call and full log context retained." },
        { front: "Best single SQS health metric", back: "ApproximateAgeOfOldestMessage — rising age means consumers can't keep up, regardless of queue depth." },
        { front: "Why does TreatMissingData matter?", back: "Missing data can mean 'healthy and idle' or 'completely dead'. The wrong setting either pages constantly or stays silent through an outage." },
      ],
      quiz: [
        { q: "Which alarm is most likely to wake someone for a real user-facing problem?", options: ["CPU > 80% for 5 minutes", "5XX error rate above 1% for 3 minutes", "Disk 60% full", "A deployment finished"], answer: 1, explain: "Error rate is a symptom users experience. CPU is a cause that may or may not matter — alert on symptoms, investigate causes." },
        { q: "Your CloudWatch Logs bill is unexpectedly high. Most likely cause?", options: ["Too many alarms", "Log groups with no retention policy set", "Using Logs Insights once", "Structured logging"], answer: 1, explain: "Log groups never expire by default, so years of debug logs accumulate. Set retention on every group and consider the Infrequent Access log class." },
        { q: "How do you trace one request across five services in CloudWatch Logs?", options: ["Search by timestamp", "Filter on a correlation ID in structured JSON logs", "Read each log stream manually", "Use CloudTrail"], answer: 1, explain: "A correlation ID threaded through structured logs turns cross-service debugging into a single Logs Insights query." },
      ],
    },
    {
      slug: "tracing-audit-and-incidents",
      title: "X-Ray, CloudTrail, Config & running incidents",
      summary:
        "Distributed tracing, the audit trail that answers 'who did this', configuration history for compliance, and how a cloud engineer actually runs an incident.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Metrics and logs tell you *that* something is wrong and roughly where. Tracing tells you where the time went; CloudTrail tells you who changed what; Config tells you what the resource looked like last Tuesday." },
        { type: "h2", text: "AWS X-Ray" },
        { type: "list", items: [
          "**Traces** follow one request across services; each hop is a **segment**, and work inside a service produces **subsegments**.",
          "The **service map** shows call relationships with latency and error rates per edge — usually revealing that the slow part is a downstream call, not your code.",
          "**Sampling** keeps cost sane: trace a small percentage plus every error rather than everything.",
          "**Annotations** are indexed and filterable (customer tier, region); **metadata** is stored but not indexed.",
          "**ADOT / OpenTelemetry** is the modern instrumentation path and can export to X-Ray or a third-party backend without changing application code.",
        ]},
        { type: "callout", kind: "key", text: "Tracing earns its keep the moment you have more than about three services. Without it, 'the API is slow' turns into an afternoon of correlating timestamps across log groups; with it, the service map names the culprit in seconds." },
        { type: "h2", text: "CloudTrail" },
        { type: "list", items: [
          "**Management events** — control-plane API calls (create, modify, delete). Recorded free for the last 90 days in Event History; create a **trail to S3** for longer retention.",
          "**Data events** — object- and item-level operations (S3 GetObject, Lambda Invoke, DynamoDB item access). High volume, off by default, billed — enable selectively for sensitive resources.",
          "**Insights events** — automatic detection of unusual API call rates, which catches both incidents and compromised credentials.",
          "**Organization trails** deliver every account's events to a central log-archive account — the standard governance setup.",
          "**Log file validation** proves the trail hasn't been tampered with, which auditors ask about.",
        ]},
        { type: "code", lang: "bash", caption: "The two CloudTrail questions you'll actually ask", code: `# who deleted this resource?
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=ResourceName,AttributeValue=prod-orders-table \\
  --query "Events[].{Time:EventTime,User:Username,Event:EventName}" --output table

# what has this role been doing in the last hour?
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=Username,AttributeValue=DeployRole \\
  --start-time "$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)" \\
  --query "Events[].{Time:EventTime,Event:EventName}" --output table` },
        { type: "callout", kind: "warn", text: "**CloudTrail is not real-time.** Events typically appear within about 15 minutes, which is fine for audit and wrong for detection. For near-real-time response, drive **EventBridge rules** off the API calls you care about (root login, IAM policy change, CloudTrail stopped, security group opened to 0.0.0.0/0)." },
        { type: "h2", text: "AWS Config" },
        { type: "p", text: "Where CloudTrail records **actions**, **AWS Config** records **state**: a timeline of every resource's configuration, relationships between resources, and continuous evaluation against rules." },
        { type: "list", items: [
          "**Config rules** — managed or custom checks like `s3-bucket-public-read-prohibited`, `rds-storage-encrypted`, `restricted-ssh`.",
          "**Conformance packs** — bundled rule sets mapped to frameworks (CIS, PCI, NIST), deployable org-wide.",
          "**Remediation actions** — an SSM Automation document that fixes a non-compliant resource automatically.",
          "**Configuration timeline** — 'this security group was opened at 14:02 by this role' with the before-and-after diff.",
          "It's genuinely useful and genuinely not free — scope recorded resource types deliberately in large accounts.",
        ]},
        { type: "h2", text: "Running an incident" },
        { type: "steps", items: [
          { title: "Declare it", text: "Name an incident commander and a channel. Ambiguity about who's leading is the most common cause of slow recovery." },
          { title: "Stabilise before you diagnose", text: "Roll back, scale up, fail over, or shed load first. Understanding the root cause can wait; the users can't." },
          { title: "Check what changed", text: "Most incidents follow a change. CloudTrail, the deployment pipeline, and Config's timeline answer 'what happened in the last hour' fastest." },
          { title: "Communicate on a cadence", text: "A short update every 15–30 minutes, even when it's 'still investigating', prevents a second, social incident." },
          { title: "Capture the timeline as you go", text: "Post-hoc reconstruction is unreliable; a running log in the channel becomes the postmortem." },
          { title: "Blameless postmortem", text: "Focus on the system and the safeguards, not the person who typed the command. Produce concrete, owned action items with dates." },
        ]},
        { type: "callout", kind: "key", text: "**The first question in almost every AWS incident is 'what changed?'** Deployments, IaC applies, manual console edits, and AWS's own Health Dashboard. Checking those four before theorising resolves a surprising share of incidents in minutes." },
        { type: "h2", text: "Health, quotas, and advice" },
        { type: "list", items: [
          "**AWS Health Dashboard** — personalised notices about events affecting *your* resources, plus scheduled maintenance and deprecations. Wire it to EventBridge so it reaches your on-call channel.",
          "**Trusted Advisor** — checks across cost, security, fault tolerance, performance, and service limits (full set requires Business support).",
          "**Service Quotas** — track usage against limits and request increases; alarm before you hit them, not after.",
          "**Fault Injection Service (FIS)** — deliberately inject failures (terminate instances, add latency, fail an AZ) to test that your resilience assumptions are real.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Trace / segment** = the record of one request and one service's part of it. **Service map** = a graph of service dependencies with latency and errors. **Sampling** = tracing a subset of requests to control cost. **Management vs data events** = control-plane API calls vs object-level operations in CloudTrail. **Conformance pack** = a bundle of Config rules mapped to a compliance framework. **Incident commander** = the single person coordinating an incident response. **Blameless postmortem** = a review focused on systemic causes rather than individual fault. **MTTR** = mean time to recovery." },
        { type: "h2", text: "What good looks like" },
        { type: "list", items: [
          "Organization CloudTrail into a locked log-archive account, with data events on sensitive buckets.",
          "Config with a conformance pack and automatic remediation for the highest-value rules.",
          "X-Ray or OpenTelemetry tracing on every service, with correlation IDs matching the logs.",
          "EventBridge rules paging on security-critical API calls, not waiting for a weekly report.",
          "Runbooks per alarm, and a quarterly game day using FIS to prove the runbooks still work.",
        ]},
      ],
      takeaways: [
        "X-Ray traces requests across services and its service map usually identifies the slow dependency immediately.",
        "CloudTrail records who called which API; data events cover object-level access and must be enabled deliberately.",
        "Config records resource state over time, evaluates rules, and can auto-remediate — CloudTrail is actions, Config is state.",
        "CloudTrail lags ~15 minutes, so use EventBridge rules for near-real-time security detection.",
        "Incidents: declare, stabilise first, ask what changed, communicate on a cadence, and hold a blameless postmortem.",
      ],
      flashcards: [
        { front: "CloudTrail vs AWS Config", back: "CloudTrail records API actions (who did what, when). Config records resource configuration state over time and evaluates it against rules." },
        { front: "Why not rely on CloudTrail for real-time alerting?", back: "Events can take around 15 minutes to appear. Use EventBridge rules on the specific API calls you care about for near-real-time response." },
        { front: "What's the first question in an AWS incident?", back: "What changed? Check deployments, IaC applies, manual console edits, and the AWS Health Dashboard before theorising." },
        { front: "What is AWS FIS for?", back: "Fault Injection Service deliberately breaks things — terminating instances, adding latency, simulating AZ failure — to verify your resilience design and runbooks actually work." },
      ],
      quiz: [
        { q: "You need to know who deleted a production DynamoDB table. Where do you look?", options: ["CloudWatch Logs", "CloudTrail", "X-Ray", "Trusted Advisor"], answer: 1, explain: "CloudTrail records control-plane API calls including the identity, source IP, and time of the DeleteTable call." },
        { q: "Which service tells you a security group was open to 0.0.0.0/0 for six days last month?", options: ["CloudTrail", "AWS Config", "X-Ray", "CloudWatch"], answer: 1, explain: "Config maintains a configuration timeline and compliance history per resource, so you can see what state it was in and for how long." },
        { q: "What should you do first in a production outage?", options: ["Find the root cause", "Stabilise — roll back, fail over, or scale", "Write the postmortem", "Open a support ticket"], answer: 1, explain: "Restore service first; diagnosis can continue afterwards with the data you've captured. Users care about recovery time, not explanations." },
      ],
    },
    {
      slug: "cost-management",
      title: "Cost management & FinOps",
      summary:
        "Reading the bill, tagging for attribution, the biggest cost traps on AWS, and a repeatable process for cutting spend without breaking things.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Cost is a non-functional requirement like latency or availability, and it's the one a cloud engineer is most often asked about in performance reviews. The good news: the levers are few and the wins are usually large." },
        { type: "diagram", name: "cost-levers", caption: "Six levers cover the vast majority of realistic AWS savings." },
        { type: "h2", text: "The tools" },
        { type: "compare", caption: "What each cost tool is for.", columns: ["Tool", "Answers"], rows: [
          { label: "Cost Explorer", cells: ["Where is the money going, by service, account, tag, and over time — plus rightsizing and Savings Plan recommendations"] },
          { label: "AWS Budgets", cells: ["Alert me before spend, usage, or commitment coverage crosses a line"] },
          { label: "Cost and Usage Report (CUR)", cells: ["Row-per-resource-per-hour detail in S3, queried with Athena for chargeback and deep analysis"] },
          { label: "Compute Optimizer", cells: ["Which instances, volumes, Lambda functions, and ECS tasks are oversized"] },
          { label: "Trusted Advisor", cells: ["Idle load balancers, unassociated Elastic IPs, low-utilisation instances"] },
          { label: "Cost Anomaly Detection", cells: ["ML-based alerts when spend deviates from the pattern — catches mistakes within a day"] },
        ]},
        { type: "callout", kind: "key", text: "**Tagging is the foundation of everything else.** Without `Environment`, `Owner`, `CostCenter`, and `Application` tags — activated as cost allocation tags in the billing console — you can report a total but you cannot tell any team what they spent, and nobody optimises a number they don't own." },
        { type: "h2", text: "The traps that produce surprise bills" },
        { type: "list", items: [
          "**NAT gateways** — hourly per AZ plus per-GB processing. Route S3/DynamoDB through free gateway endpoints and consider interface endpoints for other services.",
          "**Cross-AZ data transfer** — billed in both directions; a chatty service mesh spread across three AZs generates real money.",
          "**Internet egress** — put CloudFront in front so bandwidth is cheaper and cached.",
          "**Idle resources** — stopped instances still bill for EBS; unattached volumes, old snapshots, unused Elastic IPs, empty load balancers, and idle RDS instances all keep charging.",
          "**CloudWatch Logs with no retention** — years of debug logs at full price.",
          "**Forgotten environments and regions** — a load test in `ap-southeast-2` from eight months ago that nobody looks at.",
          "**Over-provisioned non-production** — dev and staging running 24×7 at production size.",
          "**S3 incomplete multipart uploads** — invisible in the console and billed forever without a lifecycle rule.",
        ]},
        { type: "callout", kind: "warn", text: "The two biggest structural traps are **data transfer** and **idle capacity**, because neither appears as a service you consciously chose. They show up as `EC2-Other` and as instances nobody remembers launching. Look there first on any unfamiliar bill." },
        { type: "h2", text: "A repeatable optimisation process" },
        { type: "steps", items: [
          { title: "1. Attribute", text: "Enforce tagging (SCP or Config rule), activate cost allocation tags, and produce a per-team monthly view. Nothing improves until someone owns the number." },
          { title: "2. Eliminate", text: "Delete waste: orphaned volumes and snapshots, idle load balancers and NATs, unused Elastic IPs, old AMIs, forgotten environments. This is pure profit with no trade-off." },
          { title: "3. Schedule", text: "Stop non-production outside working hours. Roughly 128 of 168 weekly hours are outside a 9–5 weekday — the arithmetic is compelling." },
          { title: "4. Rightsize", text: "Act on Compute Optimizer, move to newer generations, migrate gp2 → gp3, and adopt Graviton where the stack allows." },
          { title: "5. Re-architect the expensive parts", text: "Gateway endpoints instead of NAT, CloudFront instead of raw egress, S3 lifecycle tiering, Spot for batch and CI." },
          { title: "6. Commit", text: "Only now buy Savings Plans and RIs for the steady baseline that remains — committing before steps 2–5 locks in waste." },
          { title: "7. Prevent regression", text: "Budgets with alerts, Cost Anomaly Detection, and a cost line in every design review." },
        ]},
        { type: "callout", kind: "tip", text: "Frame savings in engineering terms when you report them: *\"scheduling non-prod and rightsizing cut monthly spend by $18k with no performance change\"* is a promotion-shaped sentence. Cost work is one of the most legible contributions a cloud engineer can make." },
        { type: "h2", text: "FinOps as a practice" },
        { type: "list", items: [
          "**Inform** — accurate, timely, per-team visibility of spend and unit economics (cost per customer, per order, per GB).",
          "**Optimise** — the loop above, run continuously rather than as an annual panic.",
          "**Operate** — budgets, guardrails, and cost as a standing agenda item in architecture review.",
          "**Unit economics beat totals.** A bill that doubles while traffic triples is a success; a flat bill on falling traffic is a problem. Always divide by something meaningful.",
        ]},
        { type: "code", lang: "bash", caption: "Quick cost investigation from the CLI", code: `# top 10 services this month
aws ce get-cost-and-usage \\
  --time-period Start=2026-07-01,End=2026-07-31 \\
  --granularity MONTHLY --metrics UnblendedCost \\
  --group-by Type=DIMENSION,Key=SERVICE \\
  --query "ResultsByTime[0].Groups | sort_by(@, &Metrics.UnblendedCost.Amount) | reverse(@)[:10]"

# spend by team tag
aws ce get-cost-and-usage \\
  --time-period Start=2026-07-01,End=2026-07-31 \\
  --granularity MONTHLY --metrics UnblendedCost \\
  --group-by Type=TAG,Key=Team

# untagged resources — the accountability gap
aws resourcegroupstaggingapi get-resources \\
  --query "ResourceTagMappingList[?length(Tags)==\`0\`].ResourceARN" --output table` },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**FinOps** = the practice of managing cloud spend collaboratively between engineering, finance, and product. **Cost allocation tag** = a tag activated for billing so spend can be grouped by it. **CUR** (Cost and Usage Report) = the most granular billing export. **Unblended cost** = the actual rate charged for each line item. **Unit economics** = cost divided by a business metric (per customer, per request). **Chargeback / showback** = billing teams for their usage, or simply showing them. **EC2-Other** = the billing line that hides NAT, data transfer, and EBS charges." },
        { type: "h2", text: "Cost-aware architecture, briefly" },
        { type: "list", items: [
          "Prefer **managed and serverless** where usage is spiky — scale-to-zero beats idle capacity.",
          "Keep traffic **inside an AZ** where latency and correctness allow.",
          "Use **the right storage tier** and let lifecycle rules move data automatically.",
          "Cache aggressively — a CloudFront or ElastiCache hit is far cheaper than the compute and database work it avoids.",
          "Design so **non-production can be switched off**, which is mostly a matter of statelessness and IaC.",
        ]},
      ],
      takeaways: [
        "Cost Explorer, Budgets, CUR, Compute Optimizer, Trusted Advisor, and Anomaly Detection are the standard toolkit.",
        "Tagging with activated cost allocation tags is the prerequisite for every other cost activity.",
        "The biggest traps are data transfer (NAT, cross-AZ, egress) and idle capacity — both hide in `EC2-Other`.",
        "Optimise in order: attribute, eliminate, schedule, rightsize, re-architect, then commit.",
        "Track unit economics, not just totals — cost per customer or per request tells the real story.",
      ],
      flashcards: [
        { front: "Why optimise before buying Savings Plans?", back: "A commitment locks in spend for 1–3 years. Committing to an oversized, unscheduled fleet locks in the waste you were about to remove." },
        { front: "What hides in the EC2-Other billing line?", back: "NAT gateway processing, data transfer (cross-AZ, cross-region, egress), and EBS charges — the costs nobody consciously chose." },
        { front: "What is Cost Anomaly Detection?", back: "ML-based monitoring that alerts when spend deviates from your historical pattern, catching mistakes within a day instead of at month-end." },
        { front: "Why do unit economics matter more than totals?", back: "A bill that doubles while traffic triples is efficiency improving. Cost per customer or per request reveals that; the total alone doesn't." },
      ],
      quiz: [
        { q: "What must exist before you can attribute AWS spend to teams?", options: ["Savings Plans", "Cost allocation tags activated in the billing console", "A CUR in Parquet", "Reserved Instances"], answer: 1, explain: "Cost Explorer and CUR can only group by tags that have been activated as cost allocation tags — and only on resources that carry them." },
        { q: "Which single change most often produces the fastest large saving?", options: ["Switching regions", "Scheduling non-production environments off outside working hours", "Buying 3-year RIs", "Enabling versioning"], answer: 1, explain: "Non-prod typically runs 24×7 but is used ~40 hours a week. Shutting it down outside those hours routinely cuts non-prod spend by 60–70%." },
        { q: "A private-subnet workload reads terabytes from S3 monthly and the bill is huge. Best fix?", options: ["Buy Savings Plans", "Add an S3 gateway VPC endpoint", "Move to a bigger instance", "Enable Intelligent-Tiering"], answer: 1, explain: "Without a gateway endpoint, that traffic flows through the NAT gateway and is billed per GB processed. The endpoint is free and removes the charge." },
      ],
    },
  ],
};
