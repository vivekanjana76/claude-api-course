import type { Module } from "./types";

export const databases: Module = {
  id: "databases",
  title: "Databases",
  blurb:
    "Relational vs NoSQL, managed database services, the NoSQL families, and caching — how to pick the right data store and keep it fast.",
  accent: "rose",
  lessons: [
    {
      slug: "relational-vs-nosql",
      title: "Relational vs NoSQL",
      summary:
        "The first database decision: when a structured, consistent SQL database beats a flexible, scalable NoSQL one — and vice versa.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Almost every cloud application needs to store data that outlives a single request. The first fork in the road is **relational (SQL)** versus **NoSQL** — and choosing by fashion rather than by fit is one of the most expensive early mistakes a team can make." },
        { type: "diagram", name: "database-types", caption: "Relational on the left; the four NoSQL families on the right. Pick by data shape and access pattern." },
        { type: "h2", text: "Relational databases" },
        { type: "p", text: "A **relational database** stores data as **rows** in **tables** with a fixed **schema** (defined columns and types). Tables relate to each other by keys, and you query with **SQL**, combining tables with **JOINs**. Its defining strength is **ACID** transactions — a group of changes either all succeed or all roll back — which is exactly what you want for money, orders, and inventory." },
        { type: "callout", kind: "key", text: "Reach for relational by default when your data is structured, the relationships matter, and correctness under concurrent writes is non-negotiable (payments, bookings, ledgers). Decades of tooling and strong consistency are on your side." },
        { type: "h2", text: "NoSQL databases" },
        { type: "p", text: "**NoSQL** ('not only SQL') trades the rigid schema and JOINs for **flexibility and horizontal scale**. Instead of one big server you spread data across many nodes, which lets NoSQL stores handle enormous volume and traffic. The cost is usually weaker consistency guarantees and no cross-table JOINs — you design the data around how you'll read it." },
        { type: "compare", caption: "The core trade-offs.", columns: ["Dimension", "Relational (SQL)", "NoSQL"], rows: [
          { label: "Schema", cells: ["Fixed, enforced", "Flexible / schema-less"] },
          { label: "Scaling", cells: ["Mostly vertical (bigger box)", "Horizontal (more nodes)"] },
          { label: "Consistency", cells: ["Strong (ACID)", "Often eventual (tunable)"] },
          { label: "Query", cells: ["SQL + JOINs", "Per-key / per-family, no JOINs"] },
          { label: "Best for", cells: ["Structured, related, transactional data", "Scale, high write volume, flexible shapes"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Schema** = the agreed structure of your data (which columns exist and their types). **ACID** = Atomicity, Consistency, Isolation, Durability — the guarantee that a transaction fully happens or not at all. **JOIN** = an SQL operation that combines rows from two related tables. **Vertical scaling** = making one server bigger (more CPU/RAM). **Horizontal scaling** = adding more servers and spreading the data across them. **Eventual consistency** = replicas converge to the same value shortly after a write, so a read right after a write might see stale data." },
        { type: "callout", kind: "warn", text: "'NoSQL scales better' is only half the story. NoSQL scales *if* your access patterns are simple and known up front. Model it wrong and you'll fight it forever — you can't just add a JOIN later." },
      ],
      takeaways: [
        "Relational (SQL): fixed schema, JOINs, ACID transactions — the default for structured, related, correctness-critical data.",
        "NoSQL: flexible schema and horizontal scale, usually with weaker (tunable) consistency and no JOINs.",
        "Relational tends to scale vertically (bigger box); NoSQL scales horizontally (more nodes).",
        "Choose by data shape and access pattern, not hype — NoSQL only scales well when access patterns are known and simple.",
      ],
      flashcards: [
        { front: "What does ACID guarantee?", back: "Atomicity, Consistency, Isolation, Durability — a transaction either fully commits or fully rolls back, which is why relational DBs suit money and orders." },
        { front: "Vertical vs horizontal scaling", back: "Vertical = one bigger server (typical for SQL). Horizontal = more servers sharing the data (typical for NoSQL)." },
        { front: "Main trade-off of NoSQL vs relational", back: "You gain flexible schema and horizontal scale but usually give up JOINs and strong consistency — so you must design around your read patterns." },
      ],
      quiz: [
        { q: "Which workload most clearly calls for a relational database?", options: ["Storing billions of IoT sensor readings", "A payment ledger needing all-or-nothing transactions", "A session cache", "A social graph of who-follows-whom"], answer: 1, explain: "A payment ledger needs ACID transactions and strong consistency — the defining strength of relational databases." },
        { q: "What do you typically give up when you choose NoSQL for horizontal scale?", options: ["Durability of any kind", "Cross-table JOINs and (often) strong consistency", "The ability to store JSON", "The ability to run in the cloud"], answer: 1, explain: "NoSQL trades JOINs and (usually) strong consistency for flexible schemas and horizontal scalability." },
      ],
    },
    {
      slug: "managed-relational-databases",
      title: "Managed relational databases",
      summary:
        "How RDS, Aurora, and Azure SQL run relational databases for you — plus replicas, Multi-AZ failover, and read scaling.",
      minutes: 9,
      blocks: [
        { type: "p", text: "You almost never run a production database on a raw VM anymore. **Managed database services** take the operational toil — patching, backups, failover, replication — off your plate so you focus on the data, not the server." },
        { type: "h2", text: "The managed relational services" },
        { type: "list", items: [
          "**AWS RDS** (Relational Database Service) — managed **MySQL, PostgreSQL, MariaDB, Oracle, SQL Server**. You pick an engine and a size; AWS handles the rest.",
          "**AWS Aurora** — Amazon's own MySQL/PostgreSQL-compatible engine, rebuilt for the cloud with a distributed storage layer for higher performance and availability.",
          "**Azure SQL Database** — managed SQL Server; **Azure Database for PostgreSQL/MySQL** cover the open-source engines.",
        ]},
        { type: "callout", kind: "key", text: "The managed-service pitch: you get automated backups, point-in-time recovery, patching, monitoring, and one-click high availability. You give up some low-level control and pay a premium — almost always worth it versus running it yourself." },
        { type: "h2", text: "High availability: Multi-AZ" },
        { type: "p", text: "For production you enable **Multi-AZ**: the service keeps a **standby replica** in a second Availability Zone, synchronously kept in sync with the primary. If the primary's AZ fails, the service **fails over** to the standby automatically, usually in under a minute, and your app reconnects to the same endpoint." },
        { type: "diagram", name: "availability-multi-az", caption: "Multi-AZ keeps a synchronous standby in another AZ and fails over automatically." },
        { type: "h2", text: "Scaling reads with replicas" },
        { type: "p", text: "A single primary handles all **writes**. When reads become the bottleneck, add **read replicas** — asynchronous copies you point read-only traffic at (reporting, dashboards, search). This spreads read load, but replicas lag slightly behind the primary, so don't read your own just-written data from one." },
        { type: "callout", kind: "warn", text: "Don't confuse the two. **Multi-AZ standby** is for *availability* (automatic failover) and you don't read from it; **read replicas** are for *scaling reads* and can lag. Many teams run both." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Managed service** = the cloud provider runs and maintains the software for you. **Replica** = a live copy of the database. **Standby** = a replica kept ready purely to take over on failure. **Failover** = automatically switching to the standby when the primary dies. **Read replica** = a copy you send read-only queries to, to offload the primary. **Synchronous** = the write isn't 'done' until the copy has it too (no data loss); **asynchronous** = the copy catches up shortly after (small lag)." },
      ],
      takeaways: [
        "Managed relational services (RDS, Aurora, Azure SQL) handle patching, backups, and failover so you don't run the server.",
        "Aurora is AWS's cloud-native MySQL/PostgreSQL-compatible engine with a distributed storage layer.",
        "Multi-AZ keeps a synchronous standby in another AZ and fails over automatically — for availability, not read scaling.",
        "Read replicas offload read traffic from the primary but lag slightly, so avoid read-after-write from them.",
      ],
      flashcards: [
        { front: "What is AWS RDS?", back: "A managed relational database service running engines like MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server — AWS handles patching, backups, and failover." },
        { front: "Multi-AZ standby vs read replica", back: "Multi-AZ = a synchronous standby in another AZ for automatic failover (availability); you don't read from it. Read replica = an async copy for scaling read traffic; it can lag." },
        { front: "What is Aurora?", back: "AWS's MySQL/PostgreSQL-compatible database engine rebuilt for the cloud with a distributed storage layer for better performance and availability." },
      ],
      quiz: [
        { q: "Your database's reads are overwhelming the primary. What's the standard fix?", options: ["Enable Multi-AZ", "Add read replicas and route read-only traffic to them", "Switch to NoSQL immediately", "Restore from a backup"], answer: 1, explain: "Read replicas offload read-only queries from the primary. Multi-AZ is for failover/availability, not read scaling." },
        { q: "What does Multi-AZ primarily provide?", options: ["Faster reads via caching", "Automatic failover to a standby in another AZ", "Cheaper storage", "Cross-region disaster recovery by default"], answer: 1, explain: "Multi-AZ maintains a synchronous standby in a second AZ and fails over automatically if the primary's AZ goes down." },
      ],
    },
    {
      slug: "nosql-families",
      title: "The NoSQL families",
      summary:
        "Key–value, document, wide-column, and graph — the four NoSQL shapes, their managed services, and when each wins.",
      minutes: 8,
      blocks: [
        { type: "p", text: "'NoSQL' isn't one thing — it's four broad **families**, each optimized for a different data shape and access pattern. Knowing them by heart lets you match a store to a problem in seconds." },
        { type: "h2", text: "Key–value" },
        { type: "p", text: "The simplest model: a giant dictionary mapping a **key** to a **value**, with blazing-fast lookups by key. **AWS DynamoDB** and **Redis** lead here. Perfect for session state, shopping carts, user profiles, and feature flags — anything you fetch by a known id." },
        { type: "h2", text: "Document" },
        { type: "p", text: "Stores self-contained **documents** (usually JSON), each of which can have its own shape. **MongoDB** and **Azure Cosmos DB** are the go-tos. Great for content, catalogs, and user-generated data where the schema varies from record to record." },
        { type: "h2", text: "Wide-column" },
        { type: "p", text: "Tables with rows that can each hold huge, varying sets of columns, built for **massive write throughput** across many nodes. **Apache Cassandra** and **Google Bigtable** are typical. Think time-series, IoT telemetry, and event logging at scale." },
        { type: "h2", text: "Graph" },
        { type: "p", text: "Stores **nodes and the relationships between them** as first-class citizens, so traversing connections ('friends of friends', fraud rings, recommendations) is cheap. **AWS Neptune** and **Cosmos DB (Gremlin)** serve this. Ideal when the relationships *are* the data." },
        { type: "compare", caption: "The four families at a glance.", columns: ["Family", "Shape", "Services", "Sweet spot"], rows: [
          { label: "Key–value", cells: ["key → value", "DynamoDB, Redis", "Sessions, carts, profiles"] },
          { label: "Document", cells: ["JSON documents", "MongoDB, Cosmos DB", "Catalogs, content, varied records"] },
          { label: "Wide-column", cells: ["rows of many columns", "Cassandra, Bigtable", "Time-series, IoT, logs"] },
          { label: "Graph", cells: ["nodes + edges", "Neptune, Cosmos Gremlin", "Social, fraud, recommendations"] },
        ]},
        { type: "callout", kind: "tip", text: "**DynamoDB** and **Cosmos DB** are the flagship serverless NoSQL databases on AWS and Azure — fully managed, auto-scaling, pay-per-use, with single-digit-millisecond latency. When an interviewer says 'a scalable NoSQL store', these are the safe answers." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Key–value store** = a huge dictionary you read/write by key. **Document** = a self-contained record, usually JSON, that carries its own structure. **Wide-column** = tables where each row can have a different, large set of columns. **Graph database** = one that stores relationships directly so following connections is fast. **Partition key** = the field a NoSQL store uses to decide which node your data lives on — choosing it well is the key to even scaling." },
      ],
      takeaways: [
        "Key–value (DynamoDB, Redis): fetch by key, fastest, for sessions/carts/profiles.",
        "Document (MongoDB, Cosmos DB): flexible JSON records, for catalogs and varied content.",
        "Wide-column (Cassandra, Bigtable): massive write throughput, for time-series and logs.",
        "Graph (Neptune, Cosmos Gremlin): relationships as first-class data, for social/fraud/recommendations.",
      ],
      flashcards: [
        { front: "Name the four NoSQL families.", back: "Key–value, document, wide-column, and graph — each optimized for a different data shape and access pattern." },
        { front: "Which family fits IoT time-series at massive write volume?", back: "Wide-column (Cassandra, Bigtable) — built for high write throughput across many nodes." },
        { front: "AWS and Azure flagship serverless NoSQL?", back: "AWS DynamoDB and Azure Cosmos DB — fully managed, auto-scaling, single-digit-ms latency." },
      ],
      quiz: [
        { q: "You need to store user sessions with the fastest possible lookup by session id. Which NoSQL family?", options: ["Graph", "Wide-column", "Key–value", "Document"], answer: 2, explain: "Key–value stores (DynamoDB, Redis) give the fastest lookup by a known key — ideal for sessions." },
        { q: "Which family is purpose-built for querying relationships like 'friends of friends'?", options: ["Document", "Graph", "Key–value", "Wide-column"], answer: 1, explain: "Graph databases (Neptune, Cosmos Gremlin) store nodes and edges directly, making relationship traversal cheap." },
      ],
    },
    {
      slug: "caching-in-memory",
      title: "Caching & in-memory stores",
      summary:
        "Why a cache sits in front of your database, the cache-aside pattern, TTLs, and the invalidation problem.",
      minutes: 8,
      blocks: [
        { type: "p", text: "Databases are durable but comparatively slow, and every query costs money and load. A **cache** — an in-memory store between your app and the database — serves hot data in microseconds and shields the database from repetitive reads." },
        { type: "h2", text: "In-memory stores" },
        { type: "p", text: "The managed caches are **AWS ElastiCache** and **Azure Cache for Redis**, both usually running **Redis** (or Memcached). Because they keep data in RAM, reads are dramatically faster than hitting disk — at the cost of capacity and, unless configured otherwise, durability." },
        { type: "h2", text: "The cache-aside pattern" },
        { type: "p", text: "The most common pattern is **cache-aside** (lazy loading): the app checks the cache first; on a **hit** it returns instantly; on a **miss** it reads the database, stores the result in the cache, and returns it. Subsequent requests for the same data are then fast." },
        { type: "diagram", name: "caching-layer", caption: "Cache-aside: check the cache, fall through to the database on a miss, then repopulate." },
        { type: "h2", text: "TTLs and invalidation" },
        { type: "p", text: "Cached data can go **stale** when the underlying row changes. Two levers manage this: a **TTL** (time-to-live) that expires each entry after N seconds so it's re-fetched, and explicit **invalidation** that deletes or updates the cache entry when you write to the database. TTLs are simple but allow brief staleness; invalidation is precise but easy to get wrong." },
        { type: "callout", kind: "key", text: "Caching is the highest-leverage performance win in most systems — and the classic source of subtle bugs. 'There are only two hard things in computer science: cache invalidation and naming things.' Start with a modest TTL and add explicit invalidation only where staleness actually hurts." },
        { type: "callout", kind: "warn", text: "A cache is not a database. It can evict data under memory pressure or lose it on restart (unless you enable persistence), so never treat it as your source of truth — the database is." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Cache** = a fast, temporary in-memory copy of data you'd otherwise fetch slowly. **Cache hit / miss** = the data was / wasn't already in the cache. **Cache-aside** = the app manages the cache: check it, fall back to the DB on a miss, then fill it. **TTL** (time-to-live) = how long an entry stays before it expires. **Invalidation** = removing/updating a cached entry when the real data changes. **Redis** = the popular in-memory data store behind most managed caches. **Eviction** = the cache dropping entries when it runs out of memory." },
      ],
      takeaways: [
        "A cache (ElastiCache / Azure Cache for Redis, usually Redis) serves hot data from RAM to shield the database and cut latency.",
        "Cache-aside: check cache → on miss read the DB, populate the cache, return — fast on repeat reads.",
        "Manage staleness with TTLs (simple, allows brief staleness) and/or explicit invalidation (precise, error-prone).",
        "A cache is not the source of truth — it can evict or lose data; the database remains authoritative.",
      ],
      flashcards: [
        { front: "Describe the cache-aside pattern.", back: "App checks the cache first; on a hit it returns instantly; on a miss it reads the DB, stores the result in the cache, and returns it." },
        { front: "TTL vs explicit invalidation", back: "TTL expires entries after N seconds (simple, allows brief staleness). Invalidation deletes/updates the cache entry on write (precise but easy to get wrong)." },
        { front: "Managed cache services and engine?", back: "AWS ElastiCache and Azure Cache for Redis, typically running Redis (in-memory), for microsecond reads." },
      ],
      quiz: [
        { q: "In cache-aside, what happens on a cache miss?", options: ["The request fails", "Read the database, store the result in the cache, and return it", "Write directly to the cache only", "Fail over to a replica"], answer: 1, explain: "On a miss the app reads the database, populates the cache with the result, and returns it — so the next read is a hit." },
        { q: "Which statement about caches is true?", options: ["A cache is a durable source of truth", "A cache can evict or lose data, so the database stays authoritative", "Caches make databases unnecessary", "TTLs guarantee data is never stale"], answer: 1, explain: "Caches trade durability for speed — they can evict under memory pressure or lose data on restart, so the database remains the source of truth." },
      ],
    },
  ],
};
