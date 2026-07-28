import type { Module } from "./types";

export const databases: Module = {
  id: "databases",
  title: "Databases & analytics",
  blurb:
    "RDS and Aurora, DynamoDB's key model and single-table design, ElastiCache patterns, and the analytics stack — plus how to choose between them without regret.",
  accent: "teal",
  lessons: [
    {
      slug: "choosing-a-database",
      title: "Choosing a database on AWS",
      summary:
        "AWS's purpose-built database philosophy, the questions that actually determine the answer, and the full menu with honest trade-offs.",
      minutes: 9,
      blocks: [
        { type: "p", text: "AWS's position is **purpose-built databases**: rather than forcing every workload into one relational engine, pick the data model that fits the access pattern. That's genuinely good advice and also an invitation to over-engineer, so this lesson is about choosing deliberately." },
        { type: "diagram", name: "database-types", caption: "Relational, key-value, document, in-memory, graph, and warehouse — different shapes for different questions." },
        { type: "h2", text: "The menu" },
        { type: "compare", caption: "AWS's managed database services.", columns: ["Service", "Model", "Reach for it when"], rows: [
          { label: "RDS", cells: ["Relational (Postgres, MySQL, MariaDB, Oracle, SQL Server, Db2)", "Standard OLTP with joins, transactions, and an existing SQL schema"] },
          { label: "Aurora", cells: ["Relational, AWS-built Postgres/MySQL-compatible", "Same as RDS but needing more throughput, faster failover, or serverless scaling"] },
          { label: "DynamoDB", cells: ["Key-value / document", "Known access patterns, huge scale, single-digit-ms latency, serverless"] },
          { label: "ElastiCache", cells: ["In-memory (Redis / Valkey / Memcached)", "Caching, sessions, leaderboards, rate limiting, pub/sub"] },
          { label: "MemoryDB", cells: ["In-memory, durable Redis", "When you want Redis speed as the primary database, not just a cache"] },
          { label: "DocumentDB", cells: ["Document (MongoDB-compatible)", "Existing MongoDB applications you don't want to rewrite"] },
          { label: "Neptune", cells: ["Graph", "Relationships as the primary query: fraud rings, recommendations, knowledge graphs"] },
          { label: "Timestream", cells: ["Time-series", "IoT and metrics with time-ordered writes and rollups"] },
          { label: "Keyspaces", cells: ["Wide-column (Cassandra-compatible)", "Migrating Cassandra without running the cluster"] },
          { label: "Redshift", cells: ["Columnar data warehouse", "Analytical queries over billions of rows"] },
        ]},
        { type: "h2", text: "The questions that decide it" },
        { type: "steps", items: [
          { title: "Do you know your access patterns?", text: "If yes and they're few and stable → DynamoDB is superb. If queries are ad hoc and exploratory → relational, where the query planner does the thinking." },
          { title: "Do you need joins and multi-row transactions?", text: "Relational makes this natural. DynamoDB supports transactions but joins are your application's job." },
          { title: "What's the scale and latency requirement?", text: "DynamoDB delivers consistent single-digit-ms at effectively unlimited scale. RDS scales up, and out only for reads." },
          { title: "OLTP or OLAP?", text: "Many small reads and writes → OLTP (RDS/Aurora/DynamoDB). Aggregations over huge history → OLAP (Redshift, or Athena over S3)." },
          { title: "What does the team already know?", text: "An unremarkable Postgres your team can operate beats an elegant datastore nobody can debug at 3am." },
        ]},
        { type: "callout", kind: "key", text: "The honest default: **start with PostgreSQL on RDS or Aurora.** It handles relational, JSON documents, full-text search, and even vectors (pgvector) well enough that most applications never need anything else. Add a purpose-built store when a specific requirement forces it — not preemptively." },
        { type: "h2", text: "SQL vs NoSQL, without the religion" },
        { type: "compare", caption: "What you actually trade.", columns: ["", "Relational (RDS/Aurora)", "DynamoDB"], rows: [
          { label: "Schema", cells: ["Defined up front, enforced", "Flexible per item; only keys are fixed"] },
          { label: "Queries", cells: ["Any query via SQL, joins, aggregations", "Only by key or index — design the table around queries"] },
          { label: "Scaling", cells: ["Vertical + read replicas; writes bounded by one primary", "Horizontal and effectively unlimited"] },
          { label: "Consistency", cells: ["Strong ACID by default", "Eventually consistent reads by default, strong on request; transactions available"] },
          { label: "Ops model", cells: ["Instance sizing, patch windows, connection limits", "Serverless — no instances, capacity or on-demand"] },
          { label: "Failure mode", cells: ["Slow queries and connection exhaustion", "Hot partitions and throttling"] },
        ]},
        { type: "callout", kind: "warn", text: "The classic mistake in both directions: forcing a relational schema into DynamoDB and then needing a query you never designed for (very painful to fix later), or running a genuinely web-scale key-value workload on a single Postgres primary until writes hit a wall. Both cost a rewrite." },
        { type: "h2", text: "Where the data actually lives" },
        { type: "list", items: [
          "**Operational data** in RDS/Aurora/DynamoDB — small, current, transactional.",
          "**Analytical data** in S3 as Parquet, queried by Athena or loaded into Redshift — big, historical, columnar.",
          "**Cached data** in ElastiCache — hot, disposable, microseconds.",
          "**Search data** in OpenSearch — full-text and log analytics.",
          "The pipeline between them (CDC via DMS, Kinesis, or DynamoDB Streams into a lake) is a standard part of a cloud engineer's job.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**OLTP** (Online Transaction Processing) = many small reads/writes from an application. **OLAP** (Online Analytical Processing) = large aggregate queries over history. **ACID** = Atomicity, Consistency, Isolation, Durability — the transactional guarantees relational databases give. **Access pattern** = the specific queries your app will run; DynamoDB requires you to know them in advance. **CDC** (Change Data Capture) = streaming a database's changes to another system. **Columnar** = storing data by column rather than row, which makes analytical scans far cheaper. **Purpose-built** = AWS's term for using a different database per data shape." },
      ],
      takeaways: [
        "AWS offers purpose-built databases per data model; the discipline is choosing deliberately, not collecting them.",
        "Decide from access patterns, join/transaction needs, scale, OLTP vs OLAP, and team familiarity.",
        "PostgreSQL on RDS/Aurora is the sensible default for most applications.",
        "DynamoDB trades query flexibility for unlimited horizontal scale and serverless operations.",
        "Operational, analytical, cached, and search data usually live in different stores connected by pipelines.",
      ],
      flashcards: [
        { front: "When is DynamoDB the right choice?", back: "When access patterns are known and stable, you need single-digit-ms latency at large scale, and you want serverless operations — accepting that queries not designed for are hard to add." },
        { front: "What's the default database recommendation on AWS?", back: "PostgreSQL on RDS or Aurora — it covers relational, JSON, full-text, and vector needs for the majority of applications." },
        { front: "OLTP vs OLAP", back: "OLTP = many small transactional reads/writes (RDS, Aurora, DynamoDB). OLAP = large analytical aggregations over history (Redshift, Athena over S3)." },
        { front: "What is DocumentDB for?", back: "Running existing MongoDB-compatible applications as a managed service without operating MongoDB clusters yourself." },
      ],
      quiz: [
        { q: "An application needs ad-hoc reporting queries that change frequently. Which fits best?", options: ["DynamoDB", "A relational database", "ElastiCache", "Neptune"], answer: 1, explain: "Ad-hoc and evolving queries need a query planner and joins. DynamoDB requires designing the table around known access patterns." },
        { q: "What is the main scaling limitation of RDS?", options: ["Storage size", "Writes are bounded by a single primary instance", "Number of tables", "Region availability"], answer: 1, explain: "RDS scales reads with replicas and scales vertically, but all writes go through one primary — the ceiling that pushes teams toward sharding or DynamoDB." },
        { q: "Where should years of historical event data for analytics live?", options: ["In the OLTP database", "In S3 as Parquet, queried by Athena or loaded into Redshift", "In ElastiCache", "In DynamoDB"], answer: 1, explain: "Columnar files in S3 are cheap and scan-efficient; keeping analytical history in the transactional database hurts both cost and OLTP performance." },
      ],
    },
    {
      slug: "rds-and-aurora",
      title: "RDS & Aurora: managed relational databases",
      summary:
        "Multi-AZ versus read replicas, backups and point-in-time recovery, Aurora's storage architecture, Serverless v2, and the failover behaviour you must design for.",
      minutes: 11,
      blocks: [
        { type: "p", text: "**Amazon RDS** runs the relational engine for you: provisioning, patching, backups, monitoring, and failover. You still own the schema, the queries, the users, and — importantly — the connection behaviour of your application." },
        { type: "h2", text: "What RDS manages, and what stays yours" },
        { type: "compare", caption: "The shared responsibility line for RDS.", columns: ["AWS", "You"], rows: [
          { label: "OS and engine patching", cells: ["Choosing and applying the maintenance window"] },
          { label: "Automated backups and snapshots", cells: ["Retention policy and testing restores"] },
          { label: "Multi-AZ failover mechanics", cells: ["Application retry logic and connection handling"] },
          { label: "Storage scaling", cells: ["Schema, indexes, and query performance"] },
          { label: "Metrics and logs", cells: ["Parameter groups, users/grants, network placement, encryption"] },
        ]},
        { type: "h2", text: "Multi-AZ vs read replicas — the question everyone gets asked" },
        { type: "diagram", name: "availability-multi-az", caption: "Multi-AZ is a synchronous standby for availability; read replicas are asynchronous copies for scale." },
        { type: "compare", caption: "Two different problems.", columns: ["", "Multi-AZ", "Read replica"], rows: [
          { label: "Purpose", cells: ["Availability and durability", "Read scaling (and cross-region DR)"] },
          { label: "Replication", cells: ["Synchronous", "Asynchronous, with replication lag"] },
          { label: "Readable?", cells: ["Standby is not readable (Multi-AZ **cluster** deployments do add readable standbys)", "Yes — that's the point"] },
          { label: "Failover", cells: ["Automatic, typically 60–120 s, DNS endpoint swings", "Manual promotion"] },
          { label: "Region", cells: ["Same region, different AZ", "Same or different region"] },
        ]},
        { type: "callout", kind: "key", text: "**Multi-AZ is for uptime; read replicas are for throughput.** Production usually wants both. Neither is a backup — a `DROP TABLE` replicates faithfully to every replica and standby in milliseconds." },
        { type: "h2", text: "Backups and recovery" },
        { type: "list", items: [
          "**Automated backups** run daily plus continuous transaction logs, enabling **point-in-time recovery (PITR)** to any second within the retention window (up to 35 days).",
          "**Manual snapshots** persist until you delete them and are what you take before a risky migration.",
          "**A restore creates a new instance** with a new endpoint — recovery is never instantaneous, and your runbook must account for the DNS/config change.",
          "**Cross-region automated backups** and snapshot copies give you regional DR.",
          "**Deletion protection** and **final snapshot on delete** should be on for every production database.",
        ]},
        { type: "h2", text: "Aurora" },
        { type: "p", text: "**Aurora** is AWS's cloud-native reimplementation of Postgres and MySQL protocols on a distributed storage layer. Its architecture is the reason it behaves differently:" },
        { type: "list", items: [
          "**Storage is a shared, distributed volume** replicated **six ways across three AZs**, auto-growing to 128 TB. Compute instances are stateless clients of it.",
          "**Up to 15 read replicas** share that same storage, so replica lag is typically **milliseconds** rather than seconds, and adding a replica doesn't copy data.",
          "**Failover in ~30 seconds or less**, because a replica just becomes the writer against the same storage.",
          "**Backtrack** (MySQL-compatible) rewinds the database in place — a very fast undo for a bad migration.",
          "**Aurora Serverless v2** scales capacity in fine-grained ACUs in seconds, including down to very low levels, for spiky or intermittent workloads.",
          "**Global Database** replicates to other regions with typical sub-second lag and cross-region failover in about a minute.",
          "Roughly 20% more expensive than equivalent RDS — usually worth it for production, rarely worth it for a dev instance.",
        ]},
        { type: "callout", kind: "warn", text: "Aurora's **reader endpoint load-balances across replicas**, and replicas can lag by milliseconds. Read-your-own-writes will occasionally fail. If a flow must see what it just wrote, route that read to the **writer endpoint** — this bug is subtle, intermittent, and infuriating." },
        { type: "h2", text: "Connections: the failure mode nobody warns you about" },
        { type: "list", items: [
          "Every relational engine has a **max connections** limit tied to instance size. Serverless functions and containers that each open their own connection exhaust it quickly.",
          "**RDS Proxy** pools and multiplexes connections, survives failovers transparently, and fetches credentials from Secrets Manager. It's close to mandatory when Lambda talks to RDS.",
          "Set sensible **pool sizes, timeouts, and retries** in the application; a pool of 100 per container across 50 containers is 5,000 connections nobody sized for.",
          "**Failover is not free**: existing connections are dropped. Your driver needs retry logic, or every failover becomes a user-visible outage even though the database recovered in 30 seconds.",
        ]},
        { type: "h2", text: "Performance work" },
        { type: "steps", items: [
          { title: "Turn on Performance Insights", text: "Free for 7 days of history, and shows exactly which SQL statements and wait events dominate load. It's the fastest route to the actual bottleneck." },
          { title: "Enable slow query logging", text: "Then fix the top few queries — usually a missing index or an accidental full table scan." },
          { title: "Right-size deliberately", text: "Memory matters most for cache hit ratio; check `FreeableMemory` and buffer cache metrics before adding CPU." },
          { title: "Use parameter groups", text: "Engine tuning (work_mem, max_connections, timeouts) lives here; some changes require a reboot." },
          { title: "Offload reads", text: "Move reporting and analytics to replicas or a warehouse so they stop competing with transactional traffic." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Multi-AZ** = a synchronous standby in another AZ that takes over automatically. **Read replica** = an asynchronous copy you can read from. **PITR** (Point-In-Time Recovery) = restoring to any second within the backup window. **Parameter group** = the engine configuration attached to an instance. **Endpoint** = the DNS name your app connects to; failover swings it to the new primary. **ACU** (Aurora Capacity Unit) = the scaling unit of Aurora Serverless. **Backtrack** = Aurora MySQL's in-place rewind. **Connection pool** = reusing a limited set of database connections across many requests." },
        { type: "h2", text: "A production RDS checklist" },
        { type: "list", items: [
          "Multi-AZ on, in private/isolated subnets, security group referencing only the app tier.",
          "Encryption at rest with KMS (**can't be added after creation** — you'd restore a snapshot into a new encrypted instance) and TLS enforced in transit.",
          "Automated backups with a retention period that matches your RPO, plus cross-region snapshot copies for DR.",
          "Deletion protection on, final snapshot enabled, credentials in Secrets Manager with rotation.",
          "Performance Insights and Enhanced Monitoring on, alarms on CPU, freeable memory, storage, replica lag, and connection count.",
          "RDS Proxy in front if serverless or highly concurrent clients connect.",
        ]},
      ],
      takeaways: [
        "Multi-AZ provides synchronous standby availability; read replicas provide asynchronous read scale — neither is a backup.",
        "Automated backups plus PITR (up to 35 days) restore to a new instance with a new endpoint — plan for that in runbooks.",
        "Aurora's shared six-way storage across three AZs gives fast failover, 15 low-lag replicas, Serverless v2, and Global Database.",
        "Aurora reader endpoints can lag — route read-your-own-writes to the writer.",
        "Connection exhaustion is the classic RDS outage; use RDS Proxy and real retry logic around failovers.",
      ],
      flashcards: [
        { front: "Multi-AZ vs read replica", back: "Multi-AZ: synchronous standby in another AZ for automatic failover (availability). Read replica: asynchronous copy you can read from (scale), promoted manually." },
        { front: "Why is Aurora failover faster than RDS?", back: "Aurora separates compute from a shared distributed storage volume, so a replica simply becomes the writer against the same data — around 30 seconds instead of 60–120." },
        { front: "What does RDS Proxy solve?", back: "Connection pooling and multiplexing for many short-lived clients (especially Lambda), plus transparent survival of failovers and Secrets Manager integration." },
        { front: "Can you enable encryption on an existing unencrypted RDS instance?", back: "Not in place. You take a snapshot, copy it with encryption enabled, and restore a new encrypted instance — then cut over." },
      ],
      quiz: [
        { q: "A read-heavy reporting workload is slowing the production database. Best first step?", options: ["Enable Multi-AZ", "Add a read replica and point reporting at it", "Increase backup retention", "Enable deletion protection"], answer: 1, explain: "Read replicas offload read traffic. Multi-AZ standbys exist for failover, not for serving reads (except in Multi-AZ cluster deployments)." },
        { q: "Lambda functions exhaust database connections during traffic spikes. Best fix?", options: ["A larger instance", "RDS Proxy", "More read replicas", "Longer timeouts"], answer: 1, explain: "RDS Proxy pools and multiplexes connections so thousands of short-lived function invocations share a small set of real database connections." },
        { q: "A user sometimes doesn't see data they just saved on an Aurora cluster. Why?", options: ["The write failed", "Reads are hitting a replica with millisecond lag", "The cache is stale", "Multi-AZ failed over"], answer: 1, explain: "The reader endpoint balances across replicas that lag slightly. Route read-after-write flows to the writer endpoint." },
      ],
    },
    {
      slug: "dynamodb",
      title: "DynamoDB: keys, indexes & single-table design",
      summary:
        "Partition and sort keys, GSIs and LSIs, capacity modes, hot partitions, streams, and how to model data for a database with no joins.",
      minutes: 12,
      blocks: [
        { type: "p", text: "**DynamoDB** is a fully managed key-value and document database with single-digit-millisecond latency at any scale, no servers, and no connection limits. It's also the service where a bad data model hurts most — because you must design around your queries." },
        { type: "diagram", name: "dynamodb-keys", caption: "Items with the same partition key live together and are sorted by the sort key." },
        { type: "h2", text: "The key model" },
        { type: "list", items: [
          "**Partition key (PK)** — hashed to decide which physical partition stores the item. Determines distribution.",
          "**Sort key (SK)** — optional; items sharing a PK are stored together and ordered by SK. This is what enables range queries.",
          "**Together they form the primary key** and must be unique.",
          "**`GetItem`** fetches one item by full key. **`Query`** fetches many items with one PK and an optional SK condition — fast and cheap. **`Scan`** reads the entire table — slow and expensive, and almost always a design smell.",
        ]},
        { type: "callout", kind: "key", text: "The mental model: **the partition key is a filing cabinet drawer, the sort key is the order of folders inside it.** You can grab one folder instantly, or flip through a contiguous range in a drawer — but finding all red folders across all drawers means opening every drawer (a Scan)." },
        { type: "h2", text: "Secondary indexes" },
        { type: "compare", caption: "GSI vs LSI.", columns: ["", "Global Secondary Index", "Local Secondary Index"], rows: [
          { label: "Keys", cells: ["Any attributes as PK and SK", "Same PK, different SK"] },
          { label: "Created", cells: ["Any time", "Only at table creation"] },
          { label: "Consistency", cells: ["Eventually consistent only", "Strongly consistent reads possible"] },
          { label: "Capacity", cells: ["Its own provisioned capacity", "Shares the table's capacity"] },
          { label: "Limits", cells: ["Up to 20 per table", "5 per table, and caps the partition at 10 GB"] },
        ]},
        { type: "p", text: "In practice **GSIs are what you'll use** — they're flexible, addable later, and don't constrain item collection size. LSIs are a legacy design that force a decision at table creation you probably can't predict." },
        { type: "h2", text: "Capacity modes" },
        { type: "list", items: [
          "**On-demand** — pay per request, scales instantly, zero capacity planning. The right default, and ideal for spiky or unknown traffic.",
          "**Provisioned** — you set read and write capacity units, optionally with auto scaling. Roughly 15–20% cheaper for steady, predictable, high-volume traffic.",
          "**Reserved capacity** further discounts provisioned mode with a 1–3 year commitment.",
          "Switching between modes is allowed (with a cooldown), so start on-demand and move once the pattern is clear.",
        ]},
        { type: "h2", text: "Hot partitions and throttling" },
        { type: "p", text: "DynamoDB spreads data across partitions by PK hash. If one PK receives a disproportionate share of traffic — `PK = \"GLOBAL_COUNTER\"`, or a date key on today's date — that partition throttles while the table looks under-utilised. **Adaptive capacity** absorbs mild imbalance, but the fix is a better key: add a random or calculated suffix (**write sharding**), or choose a naturally high-cardinality key." },
        { type: "callout", kind: "warn", text: "Symptoms of a hot partition: `ProvisionedThroughputExceededException` or throttled requests while consumed capacity sits far below provisioned. Look at CloudWatch Contributor Insights for DynamoDB — it names the offending keys directly." },
        { type: "h2", text: "Single-table design" },
        { type: "p", text: "The advanced DynamoDB pattern stores multiple entity types in one table, using generic key names (`PK`, `SK`) with typed prefixes so one query retrieves a whole object graph." },
        { type: "code", lang: "text", caption: "One table holding users, orders, and items", code: `PK              SK                  attributes
──────────────────────────────────────────────────────────
USER#12         PROFILE             name, email, createdAt
USER#12         ORDER#2026-001      total, status
USER#12         ORDER#2026-002      total, status
ORDER#2026-001  ITEM#sku-9          qty, price
ORDER#2026-001  ITEM#sku-4          qty, price

# Query PK=USER#12                        → profile + all orders, one request
# Query PK=USER#12, SK begins_with ORDER# → just the orders
# Query PK=ORDER#2026-001                 → the order's line items

# GSI1: PK=status, SK=createdAt → "all PENDING orders, newest first"` },
        { type: "callout", kind: "tip", text: "Single-table design is powerful and genuinely harder to read and evolve. It's the right call for high-scale services with well-understood access patterns; for a modest CRUD app, separate tables are clearer and the cost difference is negligible. Choose based on scale, not fashion." },
        { type: "h2", text: "Features worth knowing" },
        { type: "list", items: [
          "**DynamoDB Streams** — an ordered change log of every item modification, consumed by Lambda. The backbone of event-driven architectures, materialised views, and replication.",
          "**TTL** — set an epoch timestamp attribute and DynamoDB deletes expired items free of charge. Perfect for sessions, carts, and temporary tokens.",
          "**Transactions** — `TransactWriteItems` gives ACID across up to 100 items, at twice the capacity cost.",
          "**DAX** — a DynamoDB-native in-memory cache taking reads from milliseconds to microseconds, with no application changes.",
          "**Global Tables** — active-active multi-region replication with last-writer-wins conflict resolution.",
          "**PITR** — continuous backups with restore to any second in the last 35 days.",
          "**Conditional writes** — `attribute_not_exists(PK)` gives optimistic concurrency and idempotency without a lock.",
        ]},
        { type: "code", lang: "python", caption: "Query and conditional write with boto3", code: `import boto3
from boto3.dynamodb.conditions import Key

table = boto3.resource("dynamodb").Table("app")

# all orders for a user, newest first
resp = table.query(
    KeyConditionExpression=Key("PK").eq("USER#12") & Key("SK").begins_with("ORDER#"),
    ScanIndexForward=False,
    Limit=25,
)

# idempotent create — fails if the item already exists
table.put_item(
    Item={"PK": "ORDER#2026-003", "SK": "META", "total": 42},
    ConditionExpression="attribute_not_exists(PK)",
)` },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Item** = one row/record. **Attribute** = one field on an item. **Partition** = the physical storage unit a PK hashes to. **RCU / WCU** = read and write capacity units, DynamoDB's throughput currency. **Hot partition** = one partition receiving disproportionate traffic and throttling. **Write sharding** = adding a suffix to a key to spread writes across partitions. **Item collection** = all items sharing a partition key. **Eventually consistent read** = the default, cheaper read that may briefly return stale data." },
        { type: "h2", text: "Costs and the Scan trap" },
        { type: "p", text: "You pay per read/write and per GB stored. A `Scan` reads every item — so a nightly full-table scan on a 500 GB table is both slow and genuinely expensive. If you need arbitrary analytical queries, **export to S3** (DynamoDB supports full and incremental exports with no capacity impact) and query with Athena. Keep DynamoDB for the access patterns you designed for." },
      ],
      takeaways: [
        "Partition key decides distribution, sort key enables ranges; Query is cheap, Scan is a design smell.",
        "GSIs are flexible and addable later; LSIs are legacy and constrain the table at creation.",
        "On-demand capacity is the right default; provisioned plus auto scaling is cheaper for steady high volume.",
        "Hot partitions throttle while the table looks idle — fix with higher-cardinality keys or write sharding.",
        "Streams, TTL, transactions, DAX, Global Tables, PITR, and conditional writes cover most advanced needs.",
        "For analytics, export to S3 and query with Athena rather than scanning the table.",
      ],
      flashcards: [
        { front: "Query vs Scan in DynamoDB", back: "Query targets one partition key (with an optional sort-key condition) and is fast and cheap. Scan reads the entire table and is slow and expensive — usually a modelling mistake." },
        { front: "GSI vs LSI", back: "GSI: any attributes as keys, created any time, eventually consistent, own capacity, 20 per table. LSI: same PK with a different SK, creation-time only, strongly consistent, shares capacity, caps partitions at 10 GB." },
        { front: "What causes a hot partition?", back: "A partition key with low cardinality or skewed traffic (e.g. today's date, a global counter). One partition throttles while overall utilisation looks low." },
        { front: "What is DynamoDB TTL used for?", back: "Automatically deleting expired items (sessions, carts, tokens) at no cost, based on an epoch timestamp attribute." },
      ],
      quiz: [
        { q: "Requests are throttled but the table's consumed capacity is far below provisioned. What's happening?", options: ["The region is full", "A hot partition — traffic is skewed to one partition key", "The GSI is missing", "TTL is deleting items"], answer: 1, explain: "Capacity is distributed across partitions. A skewed key concentrates traffic on one, which throttles even though the table as a whole is under-utilised." },
        { q: "You need a query by an attribute that isn't the partition key, on an existing table. What do you add?", options: ["An LSI", "A GSI", "A new table", "A scan with a filter"], answer: 1, explain: "LSIs can only be created with the table. A GSI can be added later with any attributes as its keys. A filtered Scan still reads everything and costs accordingly." },
        { q: "Which feature gives you a change log of item modifications for event-driven processing?", options: ["DAX", "DynamoDB Streams", "TTL", "PITR"], answer: 1, explain: "Streams emit an ordered record of every insert, update, and delete, typically consumed by Lambda to build views, replicate, or trigger workflows." },
      ],
    },
    {
      slug: "caching-and-analytics",
      title: "ElastiCache, Redshift & the analytics stack",
      summary:
        "Caching patterns that actually work, and the services that turn operational data into analytics — Athena, Glue, Redshift, OpenSearch, and DMS.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Two jobs sit either side of the operational database: making reads faster (caching) and making history queryable (analytics). Both are routine cloud-engineer work." },
        { type: "h2", text: "ElastiCache" },
        { type: "diagram", name: "caching-layer", caption: "A cache in front of the database absorbs repeated reads and cuts latency to microseconds." },
        { type: "compare", caption: "The two engines.", columns: ["", "Redis / Valkey", "Memcached"], rows: [
          { label: "Data structures", cells: ["Strings, hashes, lists, sets, sorted sets, streams, geo, pub/sub", "Simple key-value only"] },
          { label: "Persistence & replication", cells: ["Snapshots, replicas, automatic failover, Multi-AZ", "None — pure ephemeral cache"] },
          { label: "Scaling", cells: ["Cluster mode shards across nodes", "Horizontal by adding nodes"] },
          { label: "Use for", cells: ["Sessions, leaderboards, rate limiting, queues, pub/sub, locks", "Simple, large, sharded object caches"] },
        ]},
        { type: "p", text: "In practice **Redis (or its Valkey fork) is the default** — the extra data structures and replication make it useful for far more than caching. Choose Memcached only for a straightforward multi-threaded object cache." },
        { type: "h2", text: "Caching patterns" },
        { type: "list", items: [
          "**Cache-aside (lazy loading)** — the app checks the cache, and on a miss reads the database and populates the cache. Simple, resilient, and the most common; the first request after a miss is slow.",
          "**Write-through** — write to the cache and database together. Data is always fresh but every write costs more, and you cache things nobody reads.",
          "**Write-behind** — write to cache, flush to the database asynchronously. Fast, and risks data loss.",
          "**TTL on everything** — the single most important habit. A cache without expiry serves stale data forever after a failed invalidation.",
        ]},
        { type: "code", lang: "python", caption: "Cache-aside with a TTL", code: `import json, redis, boto3

cache = redis.Redis(host="my-cluster.abc.cache.amazonaws.com", port=6379, ssl=True)

def get_product(product_id: str) -> dict:
    key = f"product:{product_id}"
    if (hit := cache.get(key)) is not None:
        return json.loads(hit)

    product = db_fetch_product(product_id)          # the slow path
    cache.setex(key, 300, json.dumps(product))      # 5-minute TTL
    return product` },
        { type: "callout", kind: "warn", text: "Three classic cache failures. **Thundering herd**: a popular key expires and a thousand requests hit the database at once — mitigate with jittered TTLs or a lock on repopulation. **Stale data**: invalidation was missed, so always set a TTL as a backstop. **Cache stampede on cold start**: a restarted empty cache can take the database down; warm critical keys before sending traffic." },
        { type: "h2", text: "Analytics on AWS" },
        { type: "compare", caption: "The analytics stack, top to bottom.", columns: ["Service", "What it does", "Use when"], rows: [
          { label: "S3", cells: ["The data lake — cheap, durable object storage", "Always: raw and curated data lands here"] },
          { label: "AWS Glue", cells: ["Serverless ETL plus a data catalog of schemas", "Cataloguing and transforming lake data"] },
          { label: "Athena", cells: ["Serverless SQL directly over S3, priced per TB scanned", "Ad-hoc analysis without any infrastructure"] },
          { label: "Redshift", cells: ["Columnar MPP data warehouse", "Sustained BI workloads over huge datasets, with concurrency"] },
          { label: "OpenSearch", cells: ["Search and log analytics with dashboards", "Full-text search, log exploration, observability"] },
          { label: "Kinesis / MSK", cells: ["Streaming ingestion", "Real-time event pipelines"] },
          { label: "QuickSight", cells: ["BI dashboards", "Business-facing visualisation"] },
        ]},
        { type: "callout", kind: "key", text: "**Athena's cost is driven by bytes scanned**, so the format matters enormously. Converting CSV/JSON to **Parquet** with **partitioning** (e.g. `year=/month=/day=`) and compression routinely cuts both query time and cost by 90%+. This is the single highest-leverage thing to know about a data lake." },
        { type: "h2", text: "Redshift essentials" },
        { type: "list", items: [
          "**Columnar storage and MPP** — data is distributed across nodes and scanned by column, which is why analytical aggregations are orders of magnitude faster than in a row store.",
          "**Distribution style and sort keys** are the main tuning levers: they decide whether a join happens locally or shuffles data across the network.",
          "**Redshift Serverless** removes cluster sizing for intermittent workloads.",
          "**Redshift Spectrum** queries S3 directly from Redshift, so you keep cold data in the lake and hot data in the warehouse.",
          "**Zero-ETL integrations** stream data from Aurora and DynamoDB into Redshift without building a pipeline.",
        ]},
        { type: "h2", text: "Getting data moved: DMS" },
        { type: "p", text: "**AWS Database Migration Service** copies data between databases, with an initial full load followed by **CDC (change data capture)** to keep the target in sync until you cut over. It handles homogeneous moves (Oracle → Oracle) and, with the **Schema Conversion Tool**, heterogeneous ones (Oracle → PostgreSQL). It's also a legitimate way to continuously feed a data lake or warehouse from an operational database." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Cache-aside** = the application checks the cache first and populates it on a miss. **TTL** = expiry time on a cached entry. **Thundering herd** = many simultaneous requests hitting the database when one hot key expires. **ETL / ELT** = Extract-Transform-Load (or transform after loading). **Parquet** = a compressed columnar file format that makes analytical scans far cheaper. **Partitioning** = organising lake data into path segments so queries scan only relevant files. **MPP** (Massively Parallel Processing) = splitting a query across many nodes. **CDC** (Change Data Capture) = streaming ongoing changes from a source database." },
        { type: "h2", text: "A typical data flow" },
        { type: "code", lang: "text", caption: "Operational to analytical, the common shape", code: `RDS / DynamoDB  ──DMS CDC / Streams──►  Kinesis Firehose
                                              │
                                              ▼
                                   S3 raw zone (JSON)
                                              │  Glue job
                                              ▼
                              S3 curated zone (Parquet, partitioned)
                                        │            │
                              Athena ◄──┘            └──► Redshift Spectrum
                              (ad hoc)                     (BI + QuickSight)` },
      ],
      takeaways: [
        "Redis/Valkey is the default ElastiCache engine; Memcached only for simple sharded object caches.",
        "Cache-aside with a TTL is the standard pattern — always set a TTL, and plan for thundering herd and cold starts.",
        "S3 is the data lake; Glue catalogs and transforms, Athena queries it serverlessly, Redshift serves sustained BI.",
        "Parquet plus partitioning cuts Athena cost and runtime dramatically, because you pay per byte scanned.",
        "DMS moves databases with full load plus CDC, and can continuously feed a lake or warehouse.",
      ],
      flashcards: [
        { front: "What is cache-aside?", back: "The application reads from the cache; on a miss it reads the database, stores the result with a TTL, and returns it. Simple and resilient — the default caching pattern." },
        { front: "What drives Athena's cost?", back: "Bytes scanned. Converting to compressed Parquet and partitioning the data can reduce cost and query time by over 90%." },
        { front: "What is a thundering herd?", back: "A popular cache key expires and many concurrent requests all hit the database at once. Mitigate with jittered TTLs, request coalescing, or a repopulation lock." },
        { front: "What does DMS CDC do?", back: "After the initial full load, it continuously replicates ongoing changes from source to target so you can cut over with minimal downtime." },
      ],
      quiz: [
        { q: "Which caching pattern is the most common default?", options: ["Write-behind", "Cache-aside with a TTL", "No caching", "Write-through only"], answer: 1, explain: "Cache-aside is simple, tolerates cache failures gracefully, and only caches data that's actually requested — with a TTL as the staleness backstop." },
        { q: "Athena queries on a 2 TB JSON dataset are slow and expensive. Best fix?", options: ["Add more Athena capacity", "Convert to partitioned, compressed Parquet", "Move to DynamoDB", "Increase the timeout"], answer: 1, explain: "Athena bills per byte scanned. Columnar Parquet plus partition pruning means queries read a small fraction of the data." },
        { q: "You need to migrate an on-prem Oracle database to Aurora PostgreSQL with minimal downtime. What do you use?", options: ["Snowball only", "DMS with the Schema Conversion Tool and CDC", "A read replica", "S3 sync"], answer: 1, explain: "SCT converts the schema and code; DMS performs the full load then keeps the target in sync via CDC until cutover." },
      ],
    },
  ],
};
