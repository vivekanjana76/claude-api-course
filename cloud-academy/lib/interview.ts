import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  {
    topic: "Foundations",
    q: "What is cloud computing, in one sentence?",
    a: "The on-demand delivery of compute, storage, and services over the internet with pay-as-you-go pricing — trading owned hardware (capex) for metered usage (opex), with elasticity, global reach, and managed services on top.",
  },
  {
    topic: "Foundations",
    q: "Explain IaaS, PaaS, and SaaS.",
    a: "They're a spectrum of how much the provider manages. IaaS rents raw VMs/disks/networks and you manage the OS up (EC2, Azure VMs). PaaS runs your deployed code with no servers to manage (Elastic Beanstalk, App Service). SaaS is finished software you just use (Microsoft 365). Serverless/FaaS is PaaS pushed to per-invocation billing with nothing running when idle.",
  },
  {
    topic: "Foundations",
    q: "What's the difference between a Region and an Availability Zone?",
    a: "A Region is a geographic area (like a city) chosen for latency, compliance, and cost. An Availability Zone is one or more isolated data centers within a region (like a separate building) with independent power and networking. You deploy across multiple AZs so a single data-center failure doesn't cause downtime.",
  },
  {
    topic: "Foundations",
    q: "Describe the shared responsibility model.",
    a: "Security is split. The provider secures 'of the cloud' — physical facilities, hardware, network, and managed-service internals. You secure 'in the cloud' — your data, IAM configuration, network/firewall rules, and OS patching on VMs. The line shifts left toward the provider as you use more managed services. Most breaches are customer-side misconfigurations.",
  },
  {
    topic: "Foundations",
    q: "Why is data egress a cost concern?",
    a: "Inbound data transfer is usually free, but outbound to the internet (egress) and cross-region traffic are billed per GB. It's easy to overlook and can dominate a bill for data-heavy or multi-region architectures. Mitigate with CDNs (cache at edge), keeping traffic in-region, and minimizing cross-AZ chatter.",
  },
  {
    topic: "Compute",
    q: "When would you choose a VM over a container over serverless?",
    a: "VMs for legacy apps, full OS control, or steady predictable load. Containers for portable microservices and mixed workloads, orchestrated by Kubernetes (EKS/AKS) or ECS. Serverless for spiky, event-driven, or often-idle work — it scales from zero and bills per invocation, at the cost of cold starts and execution limits. Move up the spectrum for less ops, down for more control.",
  },
  {
    topic: "Compute",
    q: "How do autoscaling and load balancing work together?",
    a: "A load balancer is the single front door: it health-checks instances and spreads traffic, hiding failures. An Auto Scaling Group / VM Scale Set keeps the fleet between min and max, adding instances when a metric (e.g. CPU) rises and removing them when it falls. Together — across multiple AZs — they give a web tier that self-heals and self-scales. It only works if instances are stateless.",
  },
  {
    topic: "Compute",
    q: "What is a cold start and how do you mitigate it?",
    a: "A cold start is the latency when a serverless function scales from zero and the platform initializes a new execution environment. Mitigate with provisioned concurrency / pre-warmed instances, smaller deployment packages, lighter runtimes, and keeping functions warm — or use containers for latency-critical steady workloads.",
  },
  {
    topic: "Storage",
    q: "Compare object, block, and file storage.",
    a: "Object (S3/Blob): files as objects in flat buckets over HTTP, near-infinite and cheap — media, backups, data lakes. Block (EBS/Managed Disks): a raw disk attached to one VM, low-latency — boot volumes and databases. File (EFS/Azure Files): a shared NFS/SMB filesystem many VMs mount — shared app content and lift-and-shift. Pick by access pattern.",
  },
  {
    topic: "Storage",
    q: "What's the difference between durability and availability?",
    a: "Durability is the probability data isn't lost — object storage advertises ~eleven nines by replicating across AZs. Availability is the probability you can access it right now (e.g. 99.9%), which is lower and varies by service. Data can be durable (safely stored) yet briefly unavailable during a service blip.",
  },
  {
    topic: "Storage",
    q: "How do you cut storage costs as data ages?",
    a: "Use storage tiers and a lifecycle policy. Keep active data in hot/standard, transition rarely-read data to cool/infrequent, and move cold retention to archive/glacier — automatically, based on age. Just don't cool data you still read often, since archive retrieval is slow and expensive.",
  },
  {
    topic: "Networking",
    q: "Walk through a secure VPC subnet layout.",
    a: "Define the network with a CIDR block (e.g. 10.0.0.0/16) and split it into subnets across AZs. Public subnets route to an Internet Gateway and hold only internet-facing resources like load balancers. App servers and databases go in private subnets with no inbound internet route; they reach out for updates via a NAT gateway. This minimizes the attack surface.",
  },
  {
    topic: "Networking",
    q: "Security group vs NACL — what's the difference?",
    a: "A security group (NSG on Azure) is an instance-level, stateful, allow-only firewall — the primary everyday control; return traffic is auto-allowed and rules can reference other groups. A NACL is a subnet-level, stateless firewall supporting explicit deny — a coarse secondary layer, e.g. to block a bad IP range subnet-wide. Use both for defense in depth.",
  },
  {
    topic: "Networking",
    q: "What does a CDN do and when should you use one?",
    a: "A CDN caches content at global edge locations near users, cutting latency and offloading the origin; cache hits never reach your servers, so it absorbs spikes and DDoS and can terminate TLS at the edge. Use it for global audiences and static-heavy sites. Cache dynamic/personalized content only with carefully tuned TTLs to avoid leaking one user's data to another.",
  },
  {
    topic: "Networking",
    q: "How does managed DNS do more than name resolution?",
    a: "Beyond translating names to IPs, managed DNS (Route 53, Azure DNS/Traffic Manager) applies routing policies: latency-based (nearest fast region), geolocation (by country), weighted (canary/blue-green splits), and failover (health-check the primary and switch to a standby). It's a traffic-steering tool, not just a phone book.",
  },
  {
    topic: "Architecture",
    q: "What is the Well-Architected Framework?",
    a: "A structured review discipline with six pillars — operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability. You pressure-test a design against each lens before launch and periodically after. Azure has an equivalent Well-Architected Framework. It's ongoing, not a one-time gate.",
  },
  {
    topic: "Architecture",
    q: "How do you design for high availability?",
    a: "Remove single points of failure with redundancy across at least two Availability Zones: a load balancer over a multi-AZ, autoscaling, stateless compute fleet, with the database replicated to a standby in another AZ for automatic failover. Add health checks, DNS failover routing, and tested backups. The goal is that any single component or zone failing causes no downtime.",
  },
  {
    topic: "Architecture",
    q: "Name a few of the biggest cloud cost levers.",
    a: "Right-size instances to actual usage; use reserved/savings plans or spot for the right workloads; apply storage lifecycle tiering; minimize egress and cross-region transfer; turn off idle/dev resources on a schedule; and set budgets and billing alerts from day one. Tagging resources makes cost attributable per team or project.",
  },
  {
    topic: "Databases",
    q: "How do you choose between a relational and a NoSQL database?",
    a: "Start from the data and access pattern, not the hype. Choose relational (RDS/Aurora/Azure SQL) when data is structured and related and you need ACID transactions — payments, orders, inventory. Choose NoSQL when you need horizontal scale, flexible schemas, or a specific shape (key–value sessions, document catalogs, wide-column time-series, graph relationships) and your access patterns are known and simple. The trap is picking NoSQL for 'scale' then discovering you need JOINs and strong consistency you gave up.",
  },
  {
    topic: "Databases",
    q: "What's the difference between a Multi-AZ standby and a read replica?",
    a: "A Multi-AZ standby is a synchronous copy in another Availability Zone kept purely for automatic failover — it improves availability and you don't read from it. A read replica is an asynchronous copy you point read-only traffic at to scale reads off the primary; it can lag, so avoid reading your own just-written data from one. They solve different problems and are often used together.",
  },
  {
    topic: "Databases",
    q: "Walk me through adding a cache in front of a database.",
    a: "The common pattern is cache-aside: the app checks an in-memory cache (Redis via ElastiCache or Azure Cache for Redis) first; on a hit it returns instantly, on a miss it reads the database, stores the result in the cache, and returns it. Manage staleness with a TTL and/or explicit invalidation when the underlying row changes. Crucially the cache is not the source of truth — it can evict or lose data — so the database stays authoritative and the app must tolerate a cold cache.",
  },
  {
    topic: "Databases",
    q: "Name the four NoSQL families and a use case for each.",
    a: "Key–value (DynamoDB, Redis) for sessions/carts/profiles fetched by key; document (MongoDB, Cosmos DB) for catalogs and varied JSON records; wide-column (Cassandra, Bigtable) for high-write time-series, IoT, and logs; and graph (Neptune, Cosmos Gremlin) for relationship-heavy data like social networks, fraud rings, and recommendations.",
  },
  {
    topic: "Security",
    q: "What is least privilege and why does it matter?",
    a: "Least privilege means granting an identity only the minimum permissions it needs, starting from zero and adding specific allows. It matters because it contains the blast radius of any compromise: if a credential leaks, it can only touch what it was narrowly allowed to. It's the single highest-leverage IAM practice — broad 'just give admin' grants are how a single stolen key ends up owning the whole account.",
  },
  {
    topic: "Security",
    q: "Why prefer IAM roles over long-lived access keys?",
    a: "A role hands out temporary credentials that automatically expire, so a leaked one has a short useful life; a static access key works forever until someone notices and revokes it. Services like EC2 and Lambda should assume a role rather than carry embedded keys, and roles also enable clean cross-account access. The rule of thumb: no long-lived keys on servers if a role can do the job.",
  },
  {
    topic: "Security",
    q: "How do you protect data in the cloud?",
    a: "On two fronts. In transit: enforce TLS/HTTPS everywhere, including internal service-to-service traffic. At rest: encrypt disks, object storage, database volumes, and backups — often on by default — with keys held in a managed service (AWS KMS / Azure Key Vault) that rotates them and logs every use. Secrets like passwords and API keys go in a secrets manager, never in Git or container images. Layer these with least-privilege IAM and audit logging for defense in depth.",
  },
  {
    topic: "Security",
    q: "Where should application secrets live, and what if one leaks into Git?",
    a: "Secrets belong in a secrets manager (AWS Secrets Manager / Azure Key Vault) — stored encrypted, access-controlled via IAM, fetched at runtime, and ideally auto-rotated. Never commit them to source control, bake them into images, or paste them into plain config. If a secret ever touches Git, rotate it immediately — deleting the commit isn't enough, because it may already have been cloned or scraped by bots within minutes.",
  },
];
