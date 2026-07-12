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
];
