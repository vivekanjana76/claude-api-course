import type { Module } from "./types";

export const serverless: Module = {
  id: "serverless",
  title: "Serverless & application integration",
  blurb:
    "Lambda's execution model, API Gateway, and the messaging backbone — SQS, SNS, EventBridge and Step Functions — that lets services talk without depending on each other.",
  accent: "amber",
  lessons: [
    {
      slug: "lambda-deep-dive",
      title: "Lambda: the execution model that explains everything",
      summary:
        "How a function is actually run, why cold starts happen, how concurrency really works, and the configuration choices that decide cost and latency.",
      minutes: 12,
      blocks: [
        { type: "p", text: "**AWS Lambda** runs your code in response to events, with no servers to provision and billing per millisecond of execution. Almost every Lambda question — performance, cost, timeouts, mysterious behaviour — is answered by understanding its execution model." },
        { type: "diagram", name: "lambda-lifecycle", caption: "Cold start = download, runtime start, and init. Warm invocations skip straight to the handler." },
        { type: "h2", text: "The execution environment" },
        { type: "list", ordered: true, items: [
          "**Download** your deployment package (zip or container image) — cold start only.",
          "**Start the runtime** (a Firecracker microVM plus the language runtime) — cold start only.",
          "**Run initialisation code** — everything outside your handler function. Cold start only.",
          "**Invoke the handler** — this happens on every request.",
          "**Freeze** the environment. The next invocation for the same function may reuse it (a **warm** start), skipping steps 1–3.",
        ]},
        { type: "callout", kind: "key", text: "**One execution environment handles exactly one request at a time.** Ten concurrent requests means ten environments. This is why Lambda has no connection pooling in the usual sense, and why 'concurrency' is the metric that matters most." },
        { type: "code", lang: "python", caption: "Where to put what — this structure matters", code: `import os, json, boto3

# ── INIT (cold start only) ─────────────────────────────
# Create clients here so warm invocations reuse them.
# This single change often halves warm latency.
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])
CONFIG = json.loads(os.environ.get("CONFIG", "{}"))

def handler(event, context):
    # ── HANDLER (every invocation) ─────────────────────
    # Never cache request-specific state in globals: the
    # environment is reused and you'll leak data between callers.
    user_id = event["pathParameters"]["userId"]
    item = table.get_item(Key={"PK": f"USER#{user_id}", "SK": "PROFILE"})
    return {
        "statusCode": 200,
        "body": json.dumps(item.get("Item", {})),
    }` },
        { type: "h2", text: "Cold starts, honestly" },
        { type: "list", items: [
          "Typical cold start: **tens of milliseconds to a couple of hundred** for Python/Node/Go; **often over a second** for JVM/.NET with heavy frameworks.",
          "**A VPC-attached Lambda no longer suffers the old multi-second ENI penalty** — that was fixed in 2019 with shared Hyperplane ENIs. Outdated advice still claims otherwise.",
          "**Provisioned concurrency** keeps environments initialised and warm — it eliminates cold starts for latency-critical paths, at a cost even when idle.",
          "**SnapStart** (Java, and expanding) snapshots the initialised environment for order-of-magnitude faster starts.",
          "**Smaller packages start faster.** Trim dependencies, use layers for shared libraries, and prefer ARM64 (Graviton) — cheaper and often quicker.",
        ]},
        { type: "h2", text: "Memory is the performance dial" },
        { type: "p", text: "Lambda has one sizing knob: **memory from 128 MB to 10,240 MB — and CPU scales proportionally with it.** A function that's CPU-bound at 512 MB may run four times faster at 2,048 MB, and because you're billed for GB-seconds, **the faster, larger configuration is often the same price or cheaper**. Use **AWS Lambda Power Tuning** (an open-source Step Functions app) to find the cost/latency sweet spot instead of guessing." },
        { type: "callout", kind: "tip", text: "The counter-intuitive rule: **raising memory can lower your bill.** Doubling memory doubles the per-ms price but can more than halve the duration, and it always improves latency. 128 MB is rarely the cheapest choice for anything doing real work." },
        { type: "h2", text: "Concurrency" },
        { type: "compare", caption: "Three concurrency controls you must know.", columns: ["Control", "What it does", "Use for"], rows: [
          { label: "Account concurrency limit", cells: ["Default 1,000 concurrent executions per region (raisable)", "The ceiling everything shares"] },
          { label: "Reserved concurrency", cells: ["Guarantees a function that many slots and caps it there", "Protecting a downstream database from a runaway function"] },
          { label: "Provisioned concurrency", cells: ["Pre-initialised environments, always warm", "Latency-critical APIs; costs money while idle"] },
        ]},
        { type: "callout", kind: "warn", text: "**Reserved concurrency is a cap as well as a guarantee.** Setting it to 0 disables the function entirely (a useful emergency stop). Setting it too low silently throttles traffic; setting it on one function reduces the unreserved pool available to every other function in the account." },
        { type: "h2", text: "Invocation models" },
        { type: "compare", caption: "How the caller waits — and what retries look like.", columns: ["Model", "Examples", "Retry behaviour"], rows: [
          { label: "Synchronous", cells: ["API Gateway, ALB, direct Invoke", "None by Lambda — the caller handles failure"] },
          { label: "Asynchronous", cells: ["S3 events, SNS, EventBridge", "2 automatic retries, then the destination or DLQ"] },
          { label: "Poll-based", cells: ["SQS, Kinesis, DynamoDB Streams, MSK", "Lambda polls in batches; failures return to the queue/shard"] },
        ]},
        { type: "callout", kind: "key", text: "**Every Lambda must be idempotent.** Retries are automatic and at-least-once delivery is the norm across SQS, SNS, and EventBridge. Use an idempotency key with a conditional DynamoDB write, or the Powertools idempotency utility, so a duplicate invocation is a no-op instead of a double charge." },
        { type: "h2", text: "Limits worth memorising" },
        { type: "list", items: [
          "**15-minute maximum timeout** — longer work belongs in Step Functions, ECS, or Batch.",
          "**Payload**: 6 MB synchronous, 256 KB asynchronous — pass large data via S3 pointers.",
          "**Deployment package**: 50 MB zipped direct upload, 250 MB unzipped, 10 GB as a container image.",
          "**/tmp**: 512 MB by default, configurable to 10 GB — ephemeral, but shared across warm invocations.",
          "**Environment variables**: 4 KB total — put real secrets in Secrets Manager or Parameter Store, not here.",
        ]},
        { type: "h2", text: "Operating Lambda well" },
        { type: "steps", items: [
          { title: "Structured JSON logging", text: "With a correlation ID on every line so CloudWatch Logs Insights can reconstruct a request across functions." },
          { title: "Enable X-Ray tracing", text: "It shows where the milliseconds actually go — usually a downstream call, not your code." },
          { title: "Alarm on the right metrics", text: "`Errors`, `Throttles`, `Duration` p99 against the timeout, `ConcurrentExecutions` against the limit, and DLQ depth." },
          { title: "Configure a DLQ or on-failure destination", text: "Otherwise failed asynchronous events vanish silently after their retries." },
          { title: "Use AWS Lambda Powertools", text: "Logging, tracing, metrics, idempotency, batch processing, and parameter fetching — production patterns you'd otherwise rebuild badly." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Cold start** = the latency of creating and initialising a new execution environment. **Warm start** = reusing an existing one. **Concurrency** = how many invocations are running at the same time. **Provisioned concurrency** = pre-warmed environments you pay to keep ready. **Idempotent** = handling the same request twice produces the same result. **DLQ** (Dead Letter Queue) = where messages go after retries are exhausted. **Firecracker** = the lightweight microVM technology Lambda and Fargate run on. **Layer** = a shared package of libraries mounted into a function." },
      ],
      takeaways: [
        "Lambda's lifecycle — download, runtime, init, invoke, freeze — explains cold starts and client reuse.",
        "One environment serves one request at a time, so concurrency is the metric that matters.",
        "Memory scales CPU proportionally; more memory often costs the same or less and always improves latency.",
        "Reserved concurrency both guarantees and caps; provisioned concurrency removes cold starts for a price.",
        "Retries are automatic and delivery is at-least-once, so every function must be idempotent.",
        "Know the limits: 15 minutes, 6 MB sync payload, 10 GB image, 4 KB env vars.",
      ],
      flashcards: [
        { front: "Where should AWS SDK clients be created in a Lambda?", back: "Outside the handler, in the init phase, so warm invocations reuse the connection instead of re-establishing it every request." },
        { front: "Why can increasing Lambda memory reduce cost?", back: "CPU scales with memory, so the function finishes faster. Since billing is GB-seconds, a shorter, larger run can cost the same or less — and is always faster." },
        { front: "What does reserved concurrency do?", back: "Guarantees a function that many concurrent slots *and* caps it there — also removing them from the shared account pool. Setting it to 0 disables the function." },
        { front: "Why must Lambda functions be idempotent?", back: "Async invocations retry twice automatically and SQS/SNS/EventBridge deliver at least once, so the same event can legitimately arrive more than once." },
      ],
      quiz: [
        { q: "A Lambda's warm latency is dominated by re-creating a database client. What's the fix?", options: ["Increase the timeout", "Move client creation outside the handler", "Add reserved concurrency", "Use a bigger deployment package"], answer: 1, explain: "Initialisation code runs only on cold starts, so clients created there are reused by every warm invocation of that environment." },
        { q: "A job takes 40 minutes. Which service should run it?", options: ["Lambda with a raised timeout", "Step Functions orchestrating Fargate or Batch", "API Gateway", "SNS"], answer: 1, explain: "Lambda's hard limit is 15 minutes. Long-running work belongs in containers (ECS/Fargate) or Batch, often orchestrated by Step Functions." },
        { q: "Async invocations are failing and the events disappear. What's missing?", options: ["Provisioned concurrency", "A DLQ or on-failure destination", "A larger memory setting", "X-Ray"], answer: 1, explain: "After two automatic retries an async event is discarded unless a dead-letter queue or on-failure destination is configured to capture it." },
      ],
    },
    {
      slug: "api-gateway",
      title: "API Gateway & serverless APIs",
      summary:
        "REST vs HTTP vs WebSocket APIs, authorizers, throttling and caching, and when a load balancer or AppSync is the better front door.",
      minutes: 9,
      blocks: [
        { type: "p", text: "**Amazon API Gateway** is a managed front door for APIs: it terminates TLS, authenticates callers, throttles abuse, transforms requests, and routes to Lambda, HTTP endpoints, or AWS services directly." },
        { type: "h2", text: "Three flavours" },
        { type: "compare", caption: "Pick the cheapest one that does what you need.", columns: ["", "HTTP API", "REST API", "WebSocket API"], rows: [
          { label: "Cost", cells: ["~70% cheaper", "Baseline", "Per message + connection minutes"] },
          { label: "Latency", cells: ["Lower", "Higher", "n/a"] },
          { label: "Auth", cells: ["JWT/OIDC, Lambda, IAM", "Everything, plus Cognito user pools and resource policies", "Lambda authorizer on connect"] },
          { label: "Extras", cells: ["Simple, fast, CORS built in", "Request/response transformation, API keys + usage plans, caching, WAF, private APIs, canary stages", "Bidirectional messaging"] },
          { label: "Choose when", cells: ["Most new APIs — the default", "You need transformation, usage plans, caching, or private endpoints", "Chat, live dashboards, notifications"] },
        ]},
        { type: "callout", kind: "key", text: "**Start with HTTP APIs.** They cover the common case at a fraction of the price. Move to REST APIs only when you specifically need request transformation, API keys with usage plans, response caching, private endpoints, or WAF integration." },
        { type: "h2", text: "Authorization options" },
        { type: "list", items: [
          "**IAM (SigV4)** — for service-to-service and internal callers who already have AWS credentials.",
          "**JWT authorizer** — validates tokens from Cognito or any OIDC provider natively, with no code to maintain. The default for user-facing APIs.",
          "**Lambda authorizer** — your own function returns an IAM policy; caches results by token. Use for custom schemes or legacy auth.",
          "**Cognito user pool authorizer** (REST) — tight integration with Cognito-managed sign-up/sign-in.",
          "**Resource policies** — restrict an API to a VPC endpoint, an account, or an IP range.",
        ]},
        { type: "h2", text: "Protecting the backend" },
        { type: "list", items: [
          "**Throttling** — account-level, stage-level, and per-route rate and burst limits. Set them deliberately: an unthrottled API is a direct path to your database's connection limit.",
          "**Usage plans + API keys** (REST) — per-customer quotas and rate limits, the standard way to run a partner API.",
          "**Caching** (REST) — TTL-based response caching at the gateway, which removes load from Lambda entirely for repeated GETs.",
          "**WAF** — managed rules and rate-based blocking in front of the API.",
          "**Request validation** — reject malformed payloads at the gateway using a JSON schema, before you pay for a Lambda invocation.",
        ]},
        { type: "code", lang: "yaml", caption: "A SAM template: HTTP API, JWT auth, and a Lambda", code: `AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: python3.12
    Architectures: [arm64]        # Graviton: cheaper and usually faster
    Timeout: 10
    MemorySize: 512
    Tracing: Active               # X-Ray

Resources:
  Api:
    Type: AWS::Serverless::HttpApi
    Properties:
      Auth:
        DefaultAuthorizer: JwtAuth
        Authorizers:
          JwtAuth:
            IdentitySource: $request.header.Authorization
            JwtConfiguration:
              issuer: https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_abc123
              audience: [my-client-id]

  GetUser:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.handler
      CodeUri: src/
      Environment:
        Variables:
          TABLE_NAME: !Ref UsersTable
      Policies:
        - DynamoDBReadPolicy: { TableName: !Ref UsersTable }
      Events:
        GetUser:
          Type: HttpApi
          Properties:
            ApiId: !Ref Api
            Path: /users/{userId}
            Method: GET

  UsersTable:
    Type: AWS::Serverless::SimpleTable` },
        { type: "h2", text: "When API Gateway isn't the answer" },
        { type: "compare", caption: "Other front doors.", columns: ["Option", "Better when"], rows: [
          { label: "ALB → Lambda", cells: ["You already run an ALB, want simple routing, and high steady volume (ALB is cheaper at scale)"] },
          { label: "Lambda Function URL", cells: ["A single function needs a public HTTPS endpoint with no gateway features"] },
          { label: "AppSync (GraphQL)", cells: ["Clients need flexible queries, real-time subscriptions, and offline sync"] },
          { label: "CloudFront + origin", cells: ["Global caching and edge security are the priority"] },
        ]},
        { type: "callout", kind: "warn", text: "API Gateway has a **29-second default integration timeout** (raisable on REST APIs via a quota request; HTTP APIs cap at 30 seconds and cannot be raised). A Lambda configured for 60 seconds behind it will still return a 504 at 29. For long operations, return `202 Accepted` immediately with a job ID and let the client poll or receive a webhook — a pattern worth reaching for before you hit the wall." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Stage** = a deployed version of an API (dev/prod) with its own URL and settings. **Authorizer** = the component deciding whether a caller may proceed. **JWT** (JSON Web Token) = a signed token carrying identity claims. **Usage plan** = per-key quotas and rate limits. **Burst** vs **rate** = how many requests can arrive at once vs sustained per second. **SAM** (Serverless Application Model) = a CloudFormation extension with concise serverless resource types. **Function URL** = a built-in HTTPS endpoint on a Lambda, no gateway required." },
      ],
      takeaways: [
        "HTTP APIs are the cheaper, faster default; REST APIs add transformation, usage plans, caching, private endpoints, and WAF.",
        "JWT authorizers cover most user-facing auth with no code; IAM auth suits service-to-service calls.",
        "Throttling, request validation, and caching protect the backend and cut cost before invoking Lambda.",
        "The 29-second integration timeout forces an async accept-and-poll pattern for long operations.",
        "ALB, Function URLs, AppSync, and CloudFront are legitimate alternative front doors.",
      ],
      flashcards: [
        { front: "HTTP API vs REST API", back: "HTTP APIs are ~70% cheaper and lower latency for the common case. REST APIs add request/response transformation, API keys and usage plans, response caching, private endpoints, and WAF." },
        { front: "What's API Gateway's integration timeout?", back: "29 seconds by default — raisable on REST APIs by quota request, hard-capped at 30 s on HTTP APIs. Longer work needs an asynchronous pattern: return 202 with a job ID and let the client poll or be notified." },
        { front: "Which authorizer needs no code?", back: "The JWT authorizer — it validates tokens from Cognito or any OIDC issuer natively. Lambda authorizers are for custom or legacy schemes." },
        { front: "When is AppSync a better choice than API Gateway?", back: "When clients need flexible GraphQL queries, real-time subscriptions, or offline sync with conflict resolution." },
      ],
      quiz: [
        { q: "You need per-customer quotas and rate limits on a partner API. What do you use?", options: ["HTTP API with JWT", "REST API with usage plans and API keys", "A Lambda Function URL", "AppSync"], answer: 1, explain: "Usage plans tied to API keys are a REST API feature and are the standard mechanism for per-customer quotas." },
        { q: "A request takes 45 seconds to process behind API Gateway. What happens?", options: ["It works fine", "504 at 29 seconds", "Lambda retries it", "The gateway queues it"], answer: 1, explain: "The default integration timeout is 29 seconds regardless of the Lambda timeout, so the caller gets a 504. Raising the REST quota buys a little headroom; 45 s of work wants an async accept-and-poll design." },
        { q: "Which is the cheapest way to protect Lambda from malformed payloads?", options: ["Validate inside the function", "Request validation with a JSON schema at the gateway", "A WAF rule per field", "A Lambda authorizer"], answer: 1, explain: "Gateway-level request validation rejects bad payloads before any Lambda invocation is billed or executed." },
      ],
    },
    {
      slug: "messaging-and-events",
      title: "SQS, SNS & EventBridge: decoupling services",
      summary:
        "Queues, topics, and event buses — what each one guarantees, when to use which, and the delivery semantics that decide your error handling.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Direct synchronous calls between services create a chain where every dependency's outage is your outage. Messaging breaks that chain: the producer hands off, the consumer processes when it can, and a failure becomes a retry instead of an incident." },
        { type: "diagram", name: "queue-decoupling", caption: "A queue turns a synchronous dependency into an asynchronous one — the front end stays up when workers stall." },
        { type: "h2", text: "The three services" },
        { type: "compare", caption: "One-to-one, one-to-many, and routed.", columns: ["", "SQS", "SNS", "EventBridge"], rows: [
          { label: "Shape", cells: ["Queue — one consumer group pulls", "Topic — pushes to all subscribers", "Bus — routes by rules to many targets"] },
          { label: "Delivery", cells: ["Pull, at-least-once (FIFO: exactly-once processing)", "Push, at-least-once", "Push, at-least-once"] },
          { label: "Retention", cells: ["Up to 14 days", "None — no subscriber, no message", "Archive + replay available"] },
          { label: "Filtering", cells: ["n/a", "Message attribute filter policies", "Rich content-based rules on the whole event"] },
          { label: "Best for", cells: ["Buffering work, smoothing spikes, retries", "Fan-out notifications, SMS/email/push", "Event-driven architecture, SaaS and AWS service events, scheduling"] },
        ]},
        { type: "h2", text: "SQS in practice" },
        { type: "list", items: [
          "**Standard queues** — nearly unlimited throughput, at-least-once delivery, best-effort ordering. The default.",
          "**FIFO queues** — strict ordering within a message group and exactly-once processing, at lower throughput. Use when order genuinely matters (financial ledgers, sequential state changes).",
          "**Visibility timeout** — after a consumer receives a message it's hidden for this period. If processing isn't finished and the message isn't deleted, it becomes visible again and is redelivered. **Set it to comfortably exceed your processing time**, or you'll process everything twice.",
          "**Long polling** (`WaitTimeSeconds` up to 20) — dramatically cheaper and lower-latency than short polling. Always enable it.",
          "**Dead-letter queue** with a `maxReceiveCount` — after N failed attempts the message moves to the DLQ instead of poisoning the queue forever.",
          "**Message size** is 256 KB; use the Extended Client Library with S3 for larger payloads.",
        ]},
        { type: "callout", kind: "warn", text: "The most common SQS bug: a **visibility timeout shorter than the processing time**. The message reappears mid-processing, a second consumer picks it up, and you get duplicate side effects that look like a mysterious data corruption. Set visibility to at least 6× your Lambda timeout when using Lambda as the consumer." },
        { type: "h2", text: "SNS fan-out" },
        { type: "diagram", name: "event-driven-fanout", caption: "One publish, many independent consumers — none of which the producer knows about." },
        { type: "p", text: "The canonical pattern is **SNS → multiple SQS queues**: each consumer gets its own queue with its own retry and DLQ behaviour, and a slow or broken consumer can't affect the others. SNS alone (without queues) means a failed delivery is retried on SNS's schedule and can be lost; the queue gives each consumer durability." },
        { type: "h2", text: "EventBridge — the modern default" },
        { type: "list", items: [
          "**Event buses** receive events from AWS services, your own applications, and SaaS partners (Datadog, Zendesk, Shopify).",
          "**Rules** match on event content — not just a topic name — with rich pattern matching, and route to up to 5 targets each.",
          "**Targets** include Lambda, SQS, SNS, Step Functions, ECS tasks, API destinations (any external HTTPS endpoint), and more.",
          "**Schema registry** discovers event shapes and generates typed bindings.",
          "**Archive and replay** lets you reprocess past events — impossible with SNS and a genuine operational superpower after a bug.",
          "**EventBridge Scheduler** replaces cron Lambdas: millions of one-off or recurring schedules with time zones and flexible windows.",
          "**EventBridge Pipes** connects a source to a target with optional filtering and enrichment, replacing a lot of glue code.",
        ]},
        { type: "code", lang: "json", caption: "An EventBridge rule matching only high-value failed orders", code: `{
  "source": ["com.mycompany.orders"],
  "detail-type": ["OrderStatusChanged"],
  "detail": {
    "status": ["FAILED"],
    "total": [{ "numeric": [">", 1000] }],
    "region": ["eu-west-1", "eu-central-1"]
  }
}` },
        { type: "callout", kind: "key", text: "**Rule of thumb: SQS to buffer work, SNS to broadcast to known subscribers, EventBridge to route events by content.** For a new event-driven system, EventBridge is usually the right backbone — it has the filtering, the AWS-service integrations, the schedule, and the replay." },
        { type: "h2", text: "Delivery semantics and idempotency" },
        { type: "p", text: "All three services are **at-least-once** by default. That means duplicates are not an edge case — they're a design assumption. Make every consumer idempotent with an idempotency key, a conditional write, or a dedupe table with TTL. \"We'll add idempotency if we see duplicates\" is a promise to debug something painful later." },
        { type: "h2", text: "Step Functions: orchestrating the pieces" },
        { type: "p", text: "**AWS Step Functions** coordinates multiple steps into a state machine with built-in retries, error handling, parallelism, and a visual execution history — replacing brittle chains of Lambdas calling Lambdas." },
        { type: "list", items: [
          "**Standard workflows** — up to a year, exactly-once execution, full history. For business processes and long-running orchestration.",
          "**Express workflows** — up to 5 minutes, at-least-once, very high volume and much cheaper. For high-throughput event processing.",
          "**Direct SDK integrations** with 200+ services means many steps need no Lambda at all.",
          "**Retry, Catch, and Choice states** give you declarative error handling with exponential backoff — code you'd otherwise write badly.",
          "**Saga pattern** — compensating transactions when a distributed workflow fails halfway (refund the payment if shipping fails).",
        ]},
        { type: "code", lang: "json", caption: "A state machine with retry and a compensating catch", code: `{
  "StartAt": "ChargeCard",
  "States": {
    "ChargeCard": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:eu-west-1:111111111111:function:charge",
      "Retry": [{
        "ErrorEquals": ["States.TaskFailed"],
        "IntervalSeconds": 2, "MaxAttempts": 3, "BackoffRate": 2
      }],
      "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "NotifyFailure" }],
      "Next": "ReserveStock"
    },
    "ReserveStock": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:updateItem",
      "Parameters": { "TableName": "stock", "Key": {"sku": {"S.$": "$.sku"}} },
      "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "RefundCard" }],
      "Next": "Done"
    },
    "RefundCard": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:eu-west-1:111111111111:function:refund",
      "Next": "NotifyFailure"
    },
    "NotifyFailure": { "Type": "Task", "Resource": "arn:aws:states:::sns:publish", "End": true },
    "Done": { "Type": "Succeed" }
  }
}` },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Visibility timeout** = how long a received SQS message stays hidden from other consumers. **Long polling** = waiting up to 20 s for a message instead of returning empty immediately. **DLQ** = where messages land after repeated failures. **Fan-out** = one message delivered to many consumers. **At-least-once** = a message may be delivered more than once, so consumers must be idempotent. **Saga** = a distributed transaction pattern using compensating actions instead of rollback. **Backpressure** = letting a queue absorb load so downstream systems aren't overwhelmed." },
      ],
      takeaways: [
        "SQS buffers work for one consumer group; SNS broadcasts to subscribers; EventBridge routes by event content.",
        "Set SQS visibility timeout well above processing time and always enable long polling and a DLQ.",
        "SNS → SQS fan-out gives each consumer independent durability, retries, and failure isolation.",
        "EventBridge adds content filtering, AWS/SaaS integrations, scheduling, archive and replay — the best default backbone.",
        "All three are at-least-once, so idempotent consumers are mandatory, not optional.",
        "Step Functions replaces Lambda-calling-Lambda chains with declarative retries, catches, and visible execution history.",
      ],
      flashcards: [
        { front: "What happens if SQS visibility timeout is too short?", back: "The message becomes visible again while still being processed, so another consumer picks it up — producing duplicate side effects that look like data corruption." },
        { front: "Why put SQS queues between SNS and consumers?", back: "Each consumer gets durable buffering, independent retries, and its own DLQ, so a slow or broken consumer can't lose messages or affect the others." },
        { front: "What can EventBridge do that SNS cannot?", back: "Match on event content with rich rules, integrate AWS service and SaaS events, schedule invocations, and archive and replay past events." },
        { front: "Standard vs Express Step Functions workflows", back: "Standard: up to 1 year, exactly-once, full history — for business processes. Express: up to 5 minutes, at-least-once, far cheaper — for high-volume event processing." },
      ],
      quiz: [
        { q: "A traffic spike overwhelms a downstream service. Which pattern helps most?", options: ["Add more API Gateway stages", "Put an SQS queue between them for backpressure", "Increase Lambda memory", "Use SNS instead"], answer: 1, explain: "A queue absorbs the spike and lets consumers process at their own rate — the classic backpressure and decoupling pattern." },
        { q: "Five teams each need to react independently to 'order placed', and new teams will be added. Best design?", options: ["Direct calls to each team's API", "EventBridge (or SNS→SQS) fan-out", "One shared SQS queue", "A database polling job"], answer: 1, explain: "Fan-out means the producer knows nothing about consumers; adding a sixth team is a new rule or subscription, not a code change." },
        { q: "Why must SQS consumers be idempotent?", options: ["SQS is unreliable", "Standard queues deliver at least once, so duplicates are expected", "Messages expire", "FIFO requires it"], answer: 1, explain: "At-least-once delivery plus redelivery on visibility timeout means the same message can legitimately be processed more than once." },
      ],
    },
  ],
};
