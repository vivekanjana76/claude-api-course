import type { Module } from "./types";

export const networking: Module = {
  id: "networking",
  title: "Networking",
  blurb: "Virtual networks, subnets, firewalls, DNS, and CDNs — the plumbing that connects everything securely.",
  accent: "rose",
  lessons: [
    {
      slug: "vpc-vnet-subnets",
      title: "Virtual networks & subnets",
      summary:
        "Your private, isolated slice of the cloud network — VPC on AWS, VNet on Azure — and how public and private subnets shape what's reachable.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Every cloud resource lives inside a **virtual network** — your own private, isolated section of the provider's network. On AWS it's a **VPC** (Virtual Private Cloud); on Azure a **VNet** (Virtual Network). It's the foundational security and connectivity boundary for everything you build." },
        { type: "diagram", name: "vpc-anatomy", caption: "A VPC/VNet with a public subnet (routes to the internet) and a private subnet (outbound-only via NAT)." },
        { type: "h2", text: "CIDR blocks & subnets" },
        { type: "p", text: "A virtual network is defined by a **CIDR block** — a private IP range like `10.0.0.0/16` (65,536 addresses). You carve it into **subnets**, each a smaller range (`10.0.1.0/24` = 256 addresses) that lives in **one Availability Zone**. Subnets are how you segment tiers and place resources across AZs for resilience." },
        { type: "callout", kind: "note", text: "A `/16` gives you ~65k addresses; a `/24` gives 256. The smaller the number after the slash, the *bigger* the network. Plan ranges so they don't overlap with other networks you'll connect to later." },
        { type: "h2", text: "Public vs private subnets" },
        { type: "list", items: [
          "**Public subnet** — its route table sends internet-bound traffic to an **Internet Gateway**. Put things that must be reachable from the internet here: load balancers, bastion hosts.",
          "**Private subnet** — no direct internet route. Put app servers and databases here so they can't be reached from the internet directly.",
          "**NAT Gateway** — lets private resources reach *out* to the internet (for updates, APIs) while staying unreachable *inbound*. One-way outbound access.",
        ]},
        { type: "callout", kind: "key", text: "The classic secure layout: public subnets hold only the load balancer; app servers and databases sit in private subnets and reach the internet outbound-only through a NAT gateway. Minimize what's directly exposed." },
        { type: "h2", text: "Connecting networks" },
        { type: "compare", caption: "Ways to link your network to others.", columns: ["Need", "AWS", "Azure"], rows: [
          { label: "Link two cloud networks", cells: ["VPC Peering / Transit Gateway", "VNet Peering"] },
          { label: "Connect to on-prem (encrypted internet)", cells: ["Site-to-Site VPN", "VPN Gateway"] },
          { label: "Private dedicated line", cells: ["Direct Connect", "ExpressRoute"] },
        ]},
      ],
      takeaways: [
        "A VPC (AWS) / VNet (Azure) is your isolated private network — the core connectivity and security boundary.",
        "You define it with a CIDR block and split it into subnets, each in one Availability Zone.",
        "Public subnets route to an Internet Gateway; private subnets reach out only via a NAT gateway.",
        "Secure layout: load balancer in public subnets; app and DB in private subnets.",
      ],
      flashcards: [
        { front: "VPC vs VNet", back: "Same concept, different name: your private, isolated virtual network in the cloud. VPC on AWS, VNet on Azure." },
        { front: "Public vs private subnet", back: "Public: route table sends internet traffic to an Internet Gateway (reachable inbound). Private: no direct internet route; reaches out only via a NAT gateway." },
        { front: "What does a NAT gateway do?", back: "Lets resources in a private subnet make outbound internet connections (updates, APIs) while remaining unreachable from the internet inbound." },
      ],
      quiz: [
        { q: "Where should a database live in a well-designed network?", options: ["A public subnet with a public IP", "A private subnet, reached only from inside the network", "On the Internet Gateway", "In the CDN"], answer: 1, explain: "Databases belong in private subnets with no direct internet exposure; only internal resources reach them." },
        { q: "A private app server needs to download OS updates but must not be reachable from the internet. What enables this?", options: ["An Internet Gateway", "A NAT gateway", "A public IP", "A second VPC"], answer: 1, explain: "A NAT gateway provides outbound-only internet access for private subnets, keeping them unreachable inbound." },
      ],
    },
    {
      slug: "firewalls-security-groups",
      title: "Firewalls: security groups & NACLs",
      summary:
        "Layered network defenses — instance-level security groups, subnet-level NACLs, and application-layer WAFs — and how they combine.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Inside a virtual network, traffic is controlled by **virtual firewalls** operating at different layers. Using several together is **defense in depth**: one misconfiguration shouldn't expose everything." },
        { type: "diagram", name: "security-layers", caption: "Independent layers — WAF, NACL, security group, host — each a separate barrier." },
        { type: "h2", text: "Security groups (the workhorse)" },
        { type: "p", text: "A **security group** (AWS) / **Network Security Group** (Azure NSG) is a firewall attached to an instance or NIC. Key properties:" },
        { type: "list", items: [
          "**Allow-only** — you write rules for what's *permitted*; everything else is denied by default. (AWS security groups have no deny rules.)",
          "**Stateful** — if you allow an inbound request, the response is automatically allowed back out. You don't write return rules.",
          "**Reference other groups** — a rule can allow traffic *from another security group* (e.g. 'DB accepts 5432 only from the app tier'), not just IP ranges — cleaner and self-adjusting as instances scale.",
        ]},
        { type: "callout", kind: "key", text: "Security groups are your primary, everyday firewall. Rule of thumb: open the *narrowest* ports to the *smallest* source. The web tier allows 443 from anywhere; the DB tier allows its port only from the app tier's security group." },
        { type: "h2", text: "Network ACLs" },
        { type: "p", text: "A **Network ACL** (NACL) is a firewall at the **subnet** boundary. Unlike security groups it's **stateless** (you must allow both directions explicitly) and supports **explicit deny** rules — useful for blocking a known-bad IP range across a whole subnet. Most designs rely on security groups and use NACLs as a coarse secondary layer." },
        { type: "compare", caption: "Security group vs NACL.", columns: ["Property", "Security Group / NSG", "Network ACL"], rows: [
          { label: "Scope", cells: ["Instance / NIC", "Subnet"] },
          { label: "State", cells: ["Stateful (returns auto-allowed)", "Stateless (allow both ways)"] },
          { label: "Rules", cells: ["Allow only", "Allow and deny"] },
          { label: "Typical role", cells: ["Primary, fine-grained control", "Coarse subnet-wide guardrail"] },
        ]},
        { type: "h2", text: "The application layer: WAF" },
        { type: "p", text: "Network firewalls don't understand HTTP. A **Web Application Firewall** (AWS WAF, Azure WAF on Application Gateway/Front Door) inspects requests at **Layer 7** and blocks attacks like SQL injection and cross-site scripting, and enforces rate limits. It complements — doesn't replace — security groups." },
        { type: "callout", kind: "warn", text: "The most common cloud incident is an overly-open security group — e.g. a database or SSH port left open to `0.0.0.0/0` (the whole internet). Audit for wide-open ports relentlessly; never expose management ports to the world." },
      ],
      takeaways: [
        "Use layered firewalls (defense in depth) so one bad rule doesn't expose everything.",
        "Security groups/NSGs are instance-level, stateful, allow-only — your primary everyday firewall.",
        "NACLs are subnet-level, stateless, and support explicit deny — a coarse secondary guardrail.",
        "A WAF inspects HTTP (L7) to block SQLi/XSS and rate-limit; it complements network firewalls.",
      ],
      flashcards: [
        { front: "Security group: stateful or stateless? Allow or deny?", back: "Stateful (return traffic auto-allowed) and allow-only (everything not permitted is denied). Instance-level firewall." },
        { front: "Security group vs NACL", back: "Security group: instance-level, stateful, allow-only — primary. NACL: subnet-level, stateless, allow+deny — coarse secondary layer." },
        { front: "What does a WAF protect against?", back: "Layer-7 web attacks like SQL injection and XSS, plus rate limiting — things network firewalls can't see." },
      ],
      quiz: [
        { q: "You allow inbound HTTPS on a security group. Do you need a rule for the response traffic?", options: ["Yes, an explicit outbound rule", "No — security groups are stateful, so responses are auto-allowed", "Only on Azure", "Only for TCP"], answer: 1, explain: "Security groups are stateful: allowing a request automatically allows its response back out." },
        { q: "Which control best blocks SQL injection attempts?", options: ["A security group", "A NACL", "A Web Application Firewall (WAF)", "A NAT gateway"], answer: 2, explain: "SQL injection is an HTTP/Layer-7 attack; only a WAF inspects request content to block it." },
      ],
    },
    {
      slug: "dns-and-cdn",
      title: "DNS & content delivery",
      summary:
        "How managed DNS routes users to the right endpoint with smart policies, and how CDNs cache content at the edge for speed.",
      minutes: 8,
      blocks: [
        { type: "p", text: "Two services sit between your users and your infrastructure and shape every request's speed: **DNS** (which turns a name into an address, and can steer traffic) and the **CDN** (which serves content from near the user)." },
        { type: "h2", text: "Managed DNS" },
        { type: "p", text: "**DNS** translates a human name (`app.example.com`) into an IP address. Managed DNS services — AWS **Route 53**, **Azure DNS** — are the authoritative source for your domain and add powerful **routing policies** far beyond a simple lookup." },
        { type: "diagram", name: "dns-resolution", caption: "A resolver walks the chain to the authoritative service, which can apply routing policies." },
        { type: "list", items: [
          "**Latency-based** — send each user to the region that responds fastest for them.",
          "**Geolocation** — route by the user's country (compliance, localization).",
          "**Weighted** — split traffic by percentage, ideal for canary/blue-green rollouts.",
          "**Failover** — health-check the primary and automatically switch to a standby if it's down.",
        ]},
        { type: "callout", kind: "key", text: "Managed DNS is a traffic-steering tool, not just a phone book. Latency and failover routing let a single domain serve users from the nearest healthy region automatically." },
        { type: "h2", text: "Content Delivery Networks" },
        { type: "p", text: "A **CDN** (AWS **CloudFront**, **Azure CDN / Front Door**) caches your content at hundreds of **edge locations** worldwide. A user in Tokyo hits a nearby edge PoP instead of your origin in Virginia, cutting latency dramatically and offloading traffic from your servers." },
        { type: "diagram", name: "cdn", caption: "Users hit a nearby edge PoP; only cache misses travel back to the origin." },
        { type: "list", items: [
          "**Lower latency** — content served from close by, not across an ocean.",
          "**Less origin load** — cache hits never reach your servers, so a viral spike is absorbed at the edge.",
          "**Built-in protection** — CDNs absorb and mitigate DDoS traffic and add TLS at the edge.",
        ]},
        { type: "callout", kind: "tip", text: "CDNs cache static content (images, JS, video) effortlessly. For dynamic responses, tune cache headers (TTLs) carefully — caching a personalized page can leak one user's data to another." },
      ],
      takeaways: [
        "Managed DNS (Route 53 / Azure DNS) resolves names and steers traffic via latency, geo, weighted, and failover policies.",
        "Failover routing health-checks the primary and auto-switches to a standby endpoint.",
        "A CDN caches content at global edge locations, cutting latency and offloading the origin.",
        "CDNs also absorb DDoS and terminate TLS at the edge; cache dynamic content only with careful TTLs.",
      ],
      flashcards: [
        { front: "Name two DNS routing policies and their use", back: "Latency-based (fastest region per user), failover (auto-switch to standby if primary is unhealthy); also geolocation and weighted (canary)." },
        { front: "How does a CDN reduce latency?", back: "It caches content at edge locations near users, so requests are served locally instead of traveling to a distant origin." },
        { front: "Why does a CDN help during a traffic spike?", back: "Cache hits are served at the edge and never reach the origin, so the origin sees far less load and absorbs spikes (and DDoS) better." },
      ],
      quiz: [
        { q: "Which DNS routing policy automatically sends users to a standby when the primary fails a health check?", options: ["Weighted", "Geolocation", "Failover", "Latency-based"], answer: 2, explain: "Failover routing health-checks the primary endpoint and switches traffic to a standby if it's unhealthy." },
        { q: "A cache hit at a CDN edge location means the request…", options: ["Travels to the origin server", "Is served from the edge without reaching the origin", "Is blocked", "Triggers autoscaling"], answer: 1, explain: "On a cache hit the edge PoP serves the content directly, so the origin is never contacted — cutting latency and load." },
      ],
    },
  ],
};
