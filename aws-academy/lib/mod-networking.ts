import type { Module } from "./types";

export const networking: Module = {
  id: "networking",
  title: "Networking: VPC, DNS & content delivery",
  blurb:
    "CIDR planning, subnets and routing, security groups vs NACLs, endpoints, Transit Gateway, Route 53 policies, CloudFront — and how to debug a packet that never arrives.",
  accent: "teal",
  lessons: [
    {
      slug: "vpc-anatomy",
      title: "VPC anatomy: CIDR, subnets & route tables",
      summary:
        "Designing an address space you won't regret, the public/private subnet pattern, and the routing rules that decide where every packet goes.",
      minutes: 11,
      blocks: [
        { type: "p", text: "A **VPC (Virtual Private Cloud)** is your own isolated network inside an AWS region: your IP range, your subnets, your routing, your firewalls. Almost every AWS resource lives in one, and almost every 'it can't connect' incident is solved inside it." },
        { type: "diagram", name: "vpc-anatomy", caption: "The standard shape: public subnets for internet-facing things, private subnets for everything else." },
        { type: "h2", text: "CIDR: choosing an address range" },
        { type: "p", text: "A VPC gets an IPv4 **CIDR block** between /16 (65,536 addresses) and /28 (16). You cannot shrink it later — you can only add secondary blocks — so this is a decision to make deliberately." },
        { type: "list", items: [
          "**Use RFC 1918 private space**: `10.0.0.0/8`, `172.16.0.0/12`, or `192.168.0.0/16`.",
          "**Plan for the whole organisation, not this VPC.** Overlapping ranges make VPC peering and on-prem connections impossible later — the single most expensive networking mistake in AWS.",
          "**A common scheme**: `10.<env>.<region-index>.0/16`, e.g. prod-eu = `10.10.0.0/16`, dev-eu = `10.20.0.0/16`. Keep a registry.",
          "**Size generously.** A /16 costs nothing extra. Running out of address space in a busy EKS cluster is a genuinely painful migration.",
        ]},
        { type: "callout", kind: "warn", text: "**AWS reserves 5 IPs in every subnet**: network address, VPC router, DNS, a future-use address, and broadcast. A /28 subnet gives you 11 usable addresses, not 16. This bites when people carve tiny subnets for 'just a few instances'." },
        { type: "h2", text: "Subnets" },
        { type: "p", text: "A subnet is a slice of the VPC CIDR that lives in **exactly one AZ**. That's the crucial property: subnets are how AZ placement actually happens. The distinction between a 'public' and 'private' subnet is not a checkbox — **it is entirely determined by its route table**." },
        { type: "compare", caption: "The three subnet roles in a standard design.", columns: ["Subnet", "Route to 0.0.0.0/0", "Contains"], rows: [
          { label: "Public", cells: ["Internet Gateway", "ALB/NLB, NAT gateways, bastion (if any)"] },
          { label: "Private", cells: ["NAT gateway", "App servers, ECS/EKS nodes, Lambda in-VPC"] },
          { label: "Isolated / data", cells: ["No default route", "RDS, ElastiCache — reachable only from inside the VPC"] },
        ]},
        { type: "code", lang: "text", caption: "A /16 carved for two AZs (leaving room to grow)", code: `VPC            10.10.0.0/16

public-1a      10.10.0.0/20     (4,091 usable)   → IGW
public-1b      10.10.16.0/20                     → IGW
private-1a     10.10.32.0/20                     → NAT-1a
private-1b     10.10.48.0/20                     → NAT-1b
data-1a        10.10.64.0/22                     → local only
data-1b        10.10.68.0/22                     → local only
(reserved      10.10.72.0/21 … for a third AZ and future tiers)` },
        { type: "h2", text: "Route tables" },
        { type: "p", text: "Every subnet is associated with exactly one route table (the VPC's **main** table by default). Routes match by **longest prefix**: the most specific matching destination wins, and the implicit `local` route for the VPC CIDR always exists and always wins for internal traffic." },
        { type: "compare", caption: "Common route targets.", columns: ["Destination", "Target", "Meaning"], rows: [
          { label: "10.10.0.0/16", cells: ["local", "Inside the VPC — automatic, cannot be removed"] },
          { label: "0.0.0.0/0", cells: ["igw-…", "Straight to the internet (makes the subnet public)"] },
          { label: "0.0.0.0/0", cells: ["nat-…", "Outbound-only internet via NAT (private subnet)"] },
          { label: "10.20.0.0/16", cells: ["pcx-… / tgw-…", "Another VPC via peering or Transit Gateway"] },
          { label: "192.168.0.0/16", cells: ["vgw-… / tgw-…", "On-premises via VPN or Direct Connect"] },
          { label: "pl-… (prefix list)", cells: ["vpce-…", "S3/DynamoDB via a gateway endpoint"] },
        ]},
        { type: "h2", text: "Internet Gateway vs NAT Gateway" },
        { type: "list", items: [
          "**Internet Gateway (IGW)** — one per VPC, horizontally scaled, free. Enables **two-way** internet traffic for resources that have a public IP.",
          "**NAT Gateway** — lives in a *public* subnet and gives *private* subnets **outbound-only** internet access. It's zonal: deploy one per AZ or an AZ failure takes out the other AZ's egress too.",
          "**NAT costs real money** — roughly $32/month per gateway plus a per-GB data processing charge. It's frequently the largest surprise on a networking bill.",
          "**Egress-only Internet Gateway** is the IPv6 equivalent of NAT — outbound-only, and free.",
        ]},
        { type: "callout", kind: "key", text: "A resource is reachable from the internet only if **all four** are true: it's in a subnet whose route table points `0.0.0.0/0` at an IGW, it has a public IP or Elastic IP, its security group allows the traffic, and the NACL allows it in **and** out. Debug in that order." },
        { type: "h2", text: "IP addressing" },
        { type: "list", items: [
          "**Private IP** — permanent for the instance's lifetime, used inside the VPC.",
          "**Public IP** — auto-assigned, **changes on stop/start**, and is now billed hourly for every public IPv4 address.",
          "**Elastic IP (EIP)** — a static public IPv4 you own; billed when *not* attached to a running instance (AWS charges for idle reservations).",
          "**IPv6** — free, no NAT required, and increasingly the answer to IPv4 address exhaustion and the new IPv4 charges.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**CIDR** (Classless Inter-Domain Routing) = the `10.0.0.0/16` notation; the number after the slash is how many bits are fixed, so smaller numbers mean bigger ranges. **RFC 1918** = the private IP ranges reserved for internal networks. **Subnet** = a CIDR slice bound to one AZ. **Route table** = rules mapping destination ranges to a target. **IGW** = Internet Gateway. **NAT** (Network Address Translation) = letting many private IPs share one public IP for outbound traffic. **Prefix list** = a named, reusable set of CIDRs you can reference in routes and security groups." },
        { type: "h2", text: "The default VPC" },
        { type: "p", text: "Every account starts with a **default VPC** per region: a /16 with a public subnet in each AZ, an IGW, and instances that get public IPs automatically. It's convenient for a first experiment and **wrong for production** — everything is public by default. Build your own VPC (or let Terraform/CDK do it) for anything real." },
      ],
      takeaways: [
        "A VPC's CIDR can't shrink — plan non-overlapping ranges across the whole organisation up front.",
        "Subnets are AZ-scoped; public vs private is determined purely by the route table's default route.",
        "AWS reserves 5 IPs per subnet, so a /28 yields 11 usable addresses.",
        "IGW allows two-way internet for public IPs; NAT gives private subnets outbound-only access and costs real money per AZ.",
        "Internet reachability needs route + public IP + security group + NACL — check them in that order.",
      ],
      flashcards: [
        { front: "What makes a subnet 'public'?", back: "Its route table has a 0.0.0.0/0 route to an Internet Gateway. Nothing else — there's no public checkbox on a subnet." },
        { front: "How many usable IPs in a /28 subnet?", back: "11. AWS reserves 5 of the 16 addresses in every subnet (network, router, DNS, future use, broadcast)." },
        { front: "Why deploy a NAT gateway per AZ?", back: "NAT gateways are zonal. One shared NAT means an AZ failure kills outbound internet for private subnets in the other AZs, and adds cross-AZ data charges." },
        { front: "Why is overlapping CIDR planning so important?", back: "Overlapping ranges make VPC peering, Transit Gateway attachments, and on-prem VPN/Direct Connect routing impossible without renumbering an entire network." },
      ],
      quiz: [
        { q: "An instance in a private subnet can't reach the internet to download packages. What's missing?", options: ["An Internet Gateway attached to the subnet", "A NAT gateway in a public subnet plus a route to it", "An Elastic IP", "A larger CIDR"], answer: 1, explain: "Private subnets reach the internet outbound through a NAT gateway that itself sits in a public subnet, with a 0.0.0.0/0 route pointing at it." },
        { q: "Two VPCs both use 10.0.0.0/16 and now need to be peered. What happens?", options: ["It works with a route table entry", "Peering fails — overlapping CIDRs can't be routed", "AWS renumbers one automatically", "It works if they're in different regions"], answer: 1, explain: "Overlapping CIDRs cannot be peered because routing is ambiguous. Someone has to renumber — which is why address planning matters from day one." },
        { q: "Which is true of a default VPC?", options: ["It has no internet access", "All its subnets are public with auto-assigned public IPs", "It spans regions", "It can't be deleted"], answer: 1, explain: "Default VPCs are built for convenience: a public subnet per AZ, an IGW, and auto-assign public IP on. That's the wrong posture for production." },
      ],
    },
    {
      slug: "security-groups-and-nacls",
      title: "Security groups, NACLs & network defence",
      summary:
        "Stateful vs stateless firewalls, why security groups can reference each other, and the layered controls that protect a VPC.",
      minutes: 9,
      blocks: [
        { type: "p", text: "AWS gives you two packet filters that look similar and behave very differently. Getting them straight is one of the most reliable ways to sound like you've actually operated a VPC." },
        { type: "diagram", name: "security-layers", caption: "Defence in depth: edge protection, subnet ACLs, instance security groups, and the host itself." },
        { type: "compare", caption: "The comparison that appears in every AWS interview.", columns: ["", "Security group", "Network ACL"], rows: [
          { label: "Attaches to", cells: ["ENI (instance, ALB, RDS, Lambda)", "Subnet"] },
          { label: "State", cells: ["**Stateful** — return traffic is automatically allowed", "**Stateless** — you must allow both directions"] },
          { label: "Rules", cells: ["Allow only (implicit deny)", "Allow **and** deny, evaluated by rule number, first match wins"] },
          { label: "Can reference", cells: ["Other security groups, prefix lists, CIDRs", "CIDRs only"] },
          { label: "Default", cells: ["Deny all inbound, allow all outbound", "Default NACL allows everything both ways"] },
        ]},
        { type: "callout", kind: "key", text: "**Stateful vs stateless is the whole difference.** A security group that allows inbound 443 automatically permits the response. A NACL allowing inbound 443 will still drop the reply unless you also allow the outbound **ephemeral port range (1024–65535)** — the classic NACL bug." },
        { type: "h2", text: "Security groups referencing security groups" },
        { type: "p", text: "The most elegant feature in AWS networking: a security group rule can name **another security group** as its source. Instead of maintaining IP lists that change every deploy, you express intent." },
        { type: "code", lang: "text", caption: "Tiered access with no IP addresses anywhere", code: `sg-alb    inbound  443  from 0.0.0.0/0
sg-app    inbound  8080 from sg-alb        # only the load balancer
sg-db     inbound  5432 from sg-app        # only the app tier
sg-db     inbound  5432 from sg-bastion    # plus break-glass access

# Instances scale in and out; the rules never change.` },
        { type: "callout", kind: "tip", text: "Design security groups **per role**, not per server: `sg-web`, `sg-app`, `sg-db`, `sg-bastion`. Chained by reference, they document your architecture and stay correct as the fleet changes." },
        { type: "h2", text: "When you actually need NACLs" },
        { type: "list", items: [
          "**Explicit deny** — blocking a specific abusive IP range, which security groups cannot express.",
          "**A blast-radius backstop** at subnet level, e.g. an isolated data subnet that must never talk to the internet regardless of any security group misconfiguration.",
          "**Compliance requirements** that mandate subnet-level controls.",
          "Otherwise: **leave the default NACL wide open and do your work in security groups.** Restrictive NACLs are a common source of maddening, intermittent failures because of ephemeral ports.",
        ]},
        { type: "h2", text: "The rest of the defence stack" },
        { type: "compare", caption: "Layered network protection.", columns: ["Control", "Operates at", "Protects against"], rows: [
          { label: "AWS Shield Standard", cells: ["Edge, automatic and free", "Common L3/L4 DDoS floods"] },
          { label: "Shield Advanced", cells: ["Edge, paid subscription", "Large DDoS, with cost protection and a response team"] },
          { label: "AWS WAF", cells: ["CloudFront/ALB/API Gateway", "SQL injection, XSS, bots, rate abuse — L7 attacks"] },
          { label: "Network Firewall", cells: ["VPC, stateful IPS/IDS", "Deep packet inspection, domain filtering, egress control"] },
          { label: "Security groups / NACLs", cells: ["ENI / subnet", "Unauthorised connections inside the VPC"] },
          { label: "GuardDuty", cells: ["Account-wide detection", "Crypto-mining, C2 traffic, credential misuse, recon"] },
        ]},
        { type: "h2", text: "Egress filtering — the underrated control" },
        { type: "p", text: "Most teams carefully restrict inbound traffic and leave outbound as `allow all`. But **exfiltration and malware callbacks are outbound**. Restricting egress — via security group rules, a NAT-less architecture using VPC endpoints, or AWS Network Firewall domain rules — is one of the highest-value hardening steps you can take, and one of the least common." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**ENI** (Elastic Network Interface) = the virtual NIC a security group actually attaches to. **Stateful** = the firewall remembers connections, so replies are automatically allowed. **Ephemeral ports** = the high-numbered source ports (1024–65535) clients use for return traffic. **NACL** (Network Access Control List) = a stateless, numbered subnet-level filter. **DDoS** = distributed denial of service. **WAF** (Web Application Firewall) = an L7 filter for HTTP attacks. **Exfiltration** = stealing data by sending it out of your network." },
        { type: "h2", text: "Debugging connectivity, in order" },
        { type: "steps", items: [
          { title: "Route table", text: "Does a route exist to the destination, and does traffic have a way back?" },
          { title: "Security group — source", text: "Does the caller's SG allow the outbound traffic? (Default is allow all, but hardened setups restrict it.)" },
          { title: "Security group — destination", text: "Does the target's SG allow inbound from the source SG or CIDR on the right port?" },
          { title: "NACLs — both subnets", text: "Inbound **and** outbound, including ephemeral ports on the return path." },
          { title: "The host", text: "Is the process actually listening on that port and interface? `ss -tlnp` answers more incidents than people expect." },
          { title: "DNS", text: "Is the name resolving to what you think? Private hosted zones, split-horizon DNS, and stale caches all mislead." },
          { title: "Reachability Analyzer", text: "The VPC tool that traces a path between two resources and names the exact component blocking it. Use it early, not last." },
        ]},
        { type: "callout", kind: "tip", text: "**VPC Flow Logs** record accepted and rejected traffic per ENI. When a connection silently fails, a `REJECT` entry tells you a security group or NACL dropped it; **no log entry at all** usually means the packet never got routed there in the first place. That distinction saves hours." },
      ],
      takeaways: [
        "Security groups are stateful, allow-only, attach to ENIs, and can reference other security groups.",
        "NACLs are stateless, numbered, subnet-level, and support explicit deny — remember ephemeral ports for return traffic.",
        "Design security groups per role and chain them by reference so rules survive scaling.",
        "Layer Shield, WAF, Network Firewall, and GuardDuty around the VPC controls; don't neglect egress filtering.",
        "Debug in order — route, SGs, NACLs, host, DNS — and use Reachability Analyzer and Flow Logs early.",
      ],
      flashcards: [
        { front: "Security group vs NACL in one line", back: "Security groups are stateful, allow-only, and attach to ENIs; NACLs are stateless, ordered allow/deny rules attached to subnets." },
        { front: "Why does my NACL block responses?", back: "NACLs are stateless — return traffic needs an explicit outbound rule for ephemeral ports 1024–65535." },
        { front: "What can a security group source be?", back: "A CIDR, a prefix list, or **another security group** — the last one lets you write architecture-shaped rules that survive autoscaling." },
        { front: "What does a REJECT in VPC Flow Logs tell you?", back: "A security group or NACL dropped the packet. No log entry at all usually means routing never delivered it to that ENI." },
      ],
      quiz: [
        { q: "You allow inbound 443 in a NACL but responses still fail. Why?", options: ["Security group is blocking it", "NACLs are stateless — outbound ephemeral ports aren't allowed", "The route table is wrong", "TLS is misconfigured"], answer: 1, explain: "NACLs don't track connection state, so the outbound reply on a high-numbered ephemeral port needs its own allow rule." },
        { q: "How should the database tier restrict access to only application servers?", options: ["Allow the app subnet CIDR", "Allow inbound from the app tier's security group", "Allow 0.0.0.0/0 and rely on passwords", "Use a NACL rule per instance IP"], answer: 1, explain: "Referencing the app security group keeps the rule correct as instances scale, and is tighter than a subnet CIDR that could contain other workloads." },
        { q: "Which control best limits data exfiltration from a compromised instance?", options: ["Inbound security group rules", "Egress restrictions and Network Firewall domain filtering", "A larger NACL", "Shield Standard"], answer: 1, explain: "Exfiltration is outbound traffic, so it's blocked by egress rules, VPC endpoints replacing internet paths, and outbound domain filtering." },
      ],
    },
    {
      slug: "vpc-connectivity",
      title: "Connecting VPCs, accounts & data centers",
      summary:
        "Endpoints, PrivateLink, peering, Transit Gateway, VPN and Direct Connect — how private networks reach each other without touching the internet.",
      minutes: 10,
      blocks: [
        { type: "p", text: "One VPC is easy. The interesting work starts when a workload must reach an AWS service privately, another team's VPC, a partner's SaaS, or the company data center." },
        { type: "h2", text: "VPC endpoints: reaching AWS services privately" },
        { type: "compare", caption: "Two kinds, and the cost difference matters.", columns: ["", "Gateway endpoint", "Interface endpoint (PrivateLink)"], rows: [
          { label: "Services", cells: ["S3 and DynamoDB only", "Almost every other AWS service, plus partner and your own services"] },
          { label: "Mechanism", cells: ["A route table entry to a prefix list", "An ENI with a private IP in your subnet"] },
          { label: "Cost", cells: ["**Free**", "Hourly per endpoint per AZ + per-GB processing"] },
          { label: "Why use it", cells: ["Keeps S3 traffic off the NAT gateway — often a large saving", "Private access to SSM, ECR, Secrets Manager, KMS, etc. with no internet path"] },
        ]},
        { type: "callout", kind: "key", text: "**Add a gateway endpoint for S3 (and DynamoDB) to every VPC.** It's free, and without it every byte your private subnets read from S3 is billed as NAT gateway data processing. This is one of the highest-return five-minute changes in AWS." },
        { type: "p", text: "**AWS PrivateLink** generalises interface endpoints: you can publish your own service behind an NLB and let other VPCs or accounts consume it privately, with no peering, no route sharing, and no overlapping-CIDR problems. It's the standard way SaaS vendors offer private connectivity on AWS." },
        { type: "h2", text: "VPC peering" },
        { type: "list", items: [
          "A direct, private, one-to-one link between two VPCs — same or different account, same or different region.",
          "**Not transitive**: if A peers with B and B peers with C, A cannot reach C. Every pair needs its own connection and routes.",
          "**No overlapping CIDRs**, ever.",
          "Cheap and simple for a handful of VPCs; beyond about five it becomes an unmanageable mesh (n(n−1)/2 connections).",
        ]},
        { type: "h2", text: "Transit Gateway" },
        { type: "diagram", name: "network-topology", caption: "Hub-and-spoke: one Transit Gateway replaces a mesh of peering connections." },
        { type: "p", text: "**Transit Gateway (TGW)** is a regional router that VPCs, VPNs, and Direct Connect gateways attach to. It gives transitive routing, **route tables per attachment** for segmentation (prod can't reach dev), cross-region peering, and centralised inspection. It's the standard enterprise topology once you pass a handful of VPCs." },
        { type: "compare", caption: "Choosing a connectivity model.", columns: ["Need", "Use"], rows: [
          { label: "Private access to S3/DynamoDB", cells: ["Gateway endpoint (free)"] },
          { label: "Private access to other AWS services", cells: ["Interface endpoint (PrivateLink)"] },
          { label: "Expose your service to other VPCs/accounts", cells: ["PrivateLink service behind an NLB"] },
          { label: "Two VPCs, simple and cheap", cells: ["VPC peering"] },
          { label: "Many VPCs + on-prem + segmentation", cells: ["Transit Gateway"] },
          { label: "Share subnets across accounts", cells: ["VPC sharing via AWS RAM"] },
        ]},
        { type: "h2", text: "Hybrid: reaching the data center" },
        { type: "diagram", name: "hybrid-connectivity", caption: "VPN over the internet, Direct Connect over private fibre, both terminating on a Transit Gateway." },
        { type: "list", items: [
          "**Site-to-Site VPN** — IPsec tunnels over the internet. Live in under an hour, ~1.25 Gbps per tunnel, and latency varies with the internet. Every AWS VPN gives you two tunnels for redundancy — configure both.",
          "**Direct Connect (DX)** — a dedicated physical circuit from your network to AWS (1/10/100 Gbps or hosted sub-1G). Consistent latency, lower per-GB egress, and **weeks to months to provision**.",
          "**The standard enterprise pattern**: Direct Connect for the primary path with a Site-to-Site VPN as automatic backup, both attached to a Transit Gateway.",
          "**Direct Connect Gateway** lets one circuit reach VPCs in multiple regions.",
          "**Route propagation** with BGP is how routes are exchanged — misconfigured BGP is the usual cause of a hybrid link that's 'up but not working'.",
        ]},
        { type: "callout", kind: "warn", text: "Direct Connect is not redundant by default. A single circuit through a single router in a single location is a single point of failure — and outages happen at the colo, not at AWS. Serious deployments use two circuits at two locations, or one circuit plus a VPN backup." },
        { type: "h2", text: "DNS in hybrid networks" },
        { type: "list", items: [
          "**Route 53 Private Hosted Zones** resolve internal names inside your VPCs.",
          "**Route 53 Resolver endpoints** forward queries between AWS and on-prem: **inbound** endpoints let on-prem resolve AWS names, **outbound** endpoints let AWS resolve on-prem names.",
          "**`enableDnsSupport` and `enableDnsHostnames`** on the VPC must be on for private DNS on endpoints to work — a very common cause of 'the endpoint exists but nothing uses it'.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**VPC endpoint** = a private path from your VPC to a service without traversing the internet. **PrivateLink** = the technology behind interface endpoints, also usable to publish your own service. **Transitive routing** = A reaching C through B; peering doesn't do it, Transit Gateway does. **BGP** (Border Gateway Protocol) = how routers exchange routes over VPN/Direct Connect. **RAM** (Resource Access Manager) = the service for sharing AWS resources such as subnets and TGWs across accounts. **Colo** = a colocation facility where your network physically meets AWS." },
        { type: "h2", text: "A typical enterprise landing-zone network" },
        { type: "code", lang: "text", caption: "What a mature AWS network looks like", code: `                    ┌──────────── on-prem DC ────────────┐
                    │  Direct Connect (primary)          │
                    │  Site-to-Site VPN (backup)         │
                    └──────────────┬─────────────────────┘
                                   │
                        ┌──────────▼──────────┐
                        │  Transit Gateway     │  route tables:
                        │  (per region)        │   prod / non-prod / shared
                        └───┬────────┬─────┬───┘
                            │        │     │
                  ┌─────────▼──┐ ┌───▼───┐ ┌▼──────────────┐
                  │ prod VPC   │ │ dev   │ │ shared-services│
                  │ 10.10/16   │ │10.20  │ │ 10.0/16        │
                  └────────────┘ └───────┘ └────────────────┘
                   + gateway endpoints (S3, DynamoDB) in every VPC
                   + interface endpoints for SSM, ECR, Secrets Manager` },
      ],
      takeaways: [
        "Gateway endpoints for S3/DynamoDB are free and remove NAT data-processing charges — add them everywhere.",
        "Interface endpoints (PrivateLink) give private access to other services, and let you publish your own service privately.",
        "VPC peering is simple but non-transitive and mesh-prone; Transit Gateway is the scalable hub with per-attachment segmentation.",
        "Site-to-Site VPN is fast to deploy; Direct Connect gives consistent latency but takes weeks and needs its own redundancy plan.",
        "Hybrid DNS needs Route 53 Resolver inbound/outbound endpoints and the VPC DNS attributes enabled.",
      ],
      flashcards: [
        { front: "Which VPC endpoints are free?", back: "Gateway endpoints — available only for S3 and DynamoDB. Interface endpoints (PrivateLink) charge hourly per AZ plus per GB." },
        { front: "Is VPC peering transitive?", back: "No. A↔B and B↔C does not give A↔C. Use Transit Gateway when you need transitive routing across many VPCs." },
        { front: "What is AWS PrivateLink used for besides AWS services?", back: "Publishing your own service (behind an NLB) so other VPCs or accounts can consume it privately — no peering and no CIDR coordination." },
        { front: "How do on-prem servers resolve AWS private DNS names?", back: "Through a Route 53 Resolver inbound endpoint; an outbound endpoint handles the reverse direction (AWS resolving on-prem names)." },
      ],
      quiz: [
        { q: "Private subnets pull large volumes from S3 and the NAT bill is huge. Best fix?", options: ["A bigger NAT gateway", "An S3 gateway VPC endpoint", "An interface endpoint for S3", "Move the data to EFS"], answer: 1, explain: "A gateway endpoint routes S3 traffic privately at no cost, bypassing NAT data-processing charges entirely." },
        { q: "You have 12 VPCs across 3 accounts that must all reach on-prem with prod/dev segmentation. Best design?", options: ["Full-mesh VPC peering", "Transit Gateway with separate route tables per environment", "One large shared VPC", "Public IPs with security groups"], answer: 1, explain: "TGW gives transitive routing with per-attachment route tables for segmentation, replacing an unmanageable 66-connection peering mesh." },
        { q: "Which statement about Direct Connect is true?", options: ["It's redundant by default", "It provisions in minutes", "It takes weeks to provision and needs its own redundancy design", "It encrypts traffic automatically"], answer: 2, explain: "DX is a physical circuit — weeks to months to install, not encrypted by default (add MACsec or a VPN over it), and a single circuit is a single point of failure." },
      ],
    },
    {
      slug: "route53-and-cloudfront",
      title: "Route 53, CloudFront & the global edge",
      summary:
        "DNS record types and routing policies, health-check failover, CDN caching behaviours, and the edge services that put your app close to users.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Two global services decide how users find your application and how fast it feels: **Route 53** answers the DNS question, and **CloudFront** serves the response from somewhere near them." },
        { type: "diagram", name: "dns-resolution", caption: "A DNS query walks from resolver to root to TLD to your authoritative Route 53 zone." },
        { type: "h2", text: "Route 53 essentials" },
        { type: "list", items: [
          "**Hosted zone** — a container of records for a domain. **Public** zones answer the internet; **private** zones answer only inside associated VPCs.",
          "**Record types you'll use**: `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias to another name — not allowed at the zone apex), `MX`, `TXT`, `NS`, `SRV`, `CAA`.",
          "**Alias records** are Route 53's superpower: an `A` record pointing directly at an ALB, CloudFront distribution, S3 website, or API Gateway. They work at the zone apex (where CNAMEs cannot), follow changing IPs automatically, and **queries are free**.",
          "**TTL** controls how long resolvers cache an answer. Low TTLs enable fast failover; high TTLs reduce query cost and load. Drop TTLs *before* a planned migration.",
          "Route 53 is also a **domain registrar** and can do **DNSSEC** and query logging.",
        ]},
        { type: "h2", text: "Routing policies" },
        { type: "diagram", name: "route53-routing", caption: "Six ways Route 53 chooses which answer to return." },
        { type: "compare", caption: "Which policy for which job.", columns: ["Policy", "Chooses by", "Use for"], rows: [
          { label: "Simple", cells: ["One record, one answer", "Standard single-target records"] },
          { label: "Weighted", cells: ["Percentage split", "Canary releases, A/B tests, gradual migrations"] },
          { label: "Latency", cells: ["Lowest network latency to the user", "Multi-region apps optimising speed"] },
          { label: "Failover", cells: ["Primary unless its health check fails", "Active-passive DR"] },
          { label: "Geolocation", cells: ["The user's country/continent", "Compliance, localisation, content licensing"] },
          { label: "Geoproximity", cells: ["Distance with an adjustable bias", "Shifting traffic gradually between regions"] },
          { label: "Multivalue answer", cells: ["Up to 8 healthy records at random", "Cheap client-side load spreading with health checks"] },
        ]},
        { type: "callout", kind: "key", text: "**Health checks are what make routing policies useful.** Attach them to records so unhealthy endpoints stop being returned. Route 53 health checks can probe an endpoint, watch a CloudWatch alarm, or aggregate other health checks (calculated health checks) for a whole-stack view." },
        { type: "h2", text: "CloudFront" },
        { type: "diagram", name: "cdn", caption: "Edge caches serve most requests; only misses reach the origin." },
        { type: "list", items: [
          "**600+ edge locations** plus regional edge caches, serving cached content from near the user and terminating TLS at the edge.",
          "**Origins** can be S3 (with OAC), an ALB, an API Gateway, or any HTTP server — including non-AWS ones.",
          "**Cache behaviours** map path patterns to policies: what to cache, which headers/cookies/query strings form the **cache key**, TTLs, and whether to compress.",
          "**Origin shield** adds a mid-tier cache to further reduce origin load.",
          "**Signed URLs / signed cookies** protect private content; **field-level encryption** protects sensitive form fields.",
          "**CloudFront Functions** (lightweight, sub-ms, header manipulation and redirects) and **Lambda@Edge** (heavier, can call other services) run code at the edge.",
        ]},
        { type: "callout", kind: "tip", text: "Caching effectiveness lives or dies on the **cache key**. Forwarding every header and cookie to the origin means every request is unique and nothing caches. Forward only what actually changes the response — that one setting often takes a hit rate from 10% to 90%." },
        { type: "h2", text: "Why a CDN pays for itself" },
        { type: "list", items: [
          "**Lower latency** — content served from tens of milliseconds away instead of across an ocean.",
          "**Cheaper egress** — CloudFront's per-GB rate is lower than direct EC2/S3 egress, and origin→CloudFront transfer is free.",
          "**Origin protection** — cache hits never reach your servers, which absorbs traffic spikes and DDoS.",
          "**Free TLS** with ACM certificates and modern protocol support (HTTP/2, HTTP/3).",
          "**A natural place for WAF**, geo-restriction, and bot control.",
        ]},
        { type: "h2", text: "AWS Global Accelerator" },
        { type: "p", text: "Where CloudFront caches **content**, **Global Accelerator** optimises **connections**. It gives you two static anycast IPs, pulls traffic onto the AWS backbone at the nearest edge, and fails over between regional endpoints in seconds. Use it for non-HTTP protocols, gaming, VoIP, or when you need instant regional failover on a fixed IP — and CloudFront for cacheable web content." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Hosted zone** = the container of DNS records for a domain. **Alias record** = a Route 53-specific record pointing at an AWS resource, valid at the zone apex and free to query. **TTL** (Time To Live) = how long resolvers cache an answer. **Zone apex** = the bare domain (`example.com`) as opposed to `www.example.com`. **Cache key** = the combination of URL, headers, cookies, and query strings CloudFront uses to identify a cached object. **Anycast** = one IP address announced from many locations so users reach the nearest one. **Origin** = the server CloudFront fetches from on a cache miss." },
        { type: "h2", text: "Putting it together for a global app" },
        { type: "steps", items: [
          { title: "Route 53 alias at the apex", text: "`example.com` → CloudFront distribution, with a latency or failover policy if you're multi-region." },
          { title: "CloudFront in front of everything", text: "Static assets from a private S3 bucket via OAC; `/api/*` behaviour to the ALB with caching disabled but compression on." },
          { title: "ACM certificate in us-east-1", text: "Required for CloudFront; regional certs stay in their own region for the ALB." },
          { title: "WAF on the distribution", text: "Managed rule groups plus a rate-based rule as the baseline." },
          { title: "Health checks and failover", text: "Route 53 health checks on regional endpoints so DNS stops returning a dead region." },
        ]},
      ],
      takeaways: [
        "Route 53 alias records point at AWS resources, work at the zone apex, follow changing IPs, and are free to query.",
        "Routing policies — weighted, latency, failover, geolocation, geoproximity, multivalue — become powerful when paired with health checks.",
        "CloudFront caches at 600+ edges, cuts egress cost, protects the origin, and hosts WAF, signed URLs, and edge functions.",
        "Cache-key design determines hit rate more than anything else; forward only headers/cookies that change the response.",
        "Global Accelerator optimises connections (anycast IPs, fast regional failover); CloudFront optimises content.",
      ],
      flashcards: [
        { front: "Why use an alias record instead of a CNAME?", back: "Alias records work at the zone apex, resolve to AWS resources whose IPs change, and cost nothing per query — CNAMEs can't be used at the apex and are billed." },
        { front: "Which Route 53 policy gives active-passive DR?", back: "Failover routing with a health check on the primary: Route 53 returns the secondary only when the primary check fails." },
        { front: "What most affects CloudFront cache hit rate?", back: "The cache key. Forwarding unnecessary headers, cookies, or query strings makes every request unique and prevents caching." },
        { front: "CloudFront vs Global Accelerator", back: "CloudFront caches HTTP content at the edge. Global Accelerator provides static anycast IPs and routes any TCP/UDP traffic over the AWS backbone with fast regional failover." },
      ],
      quiz: [
        { q: "You need example.com (the bare domain) to point at an ALB. What record do you create?", options: ["A CNAME", "An A record with a hard-coded IP", "A Route 53 alias A record", "A TXT record"], answer: 2, explain: "CNAMEs are illegal at the zone apex and ALB IPs change, so an alias A record targeting the load balancer is the only correct option." },
        { q: "A CloudFront distribution has a 5% hit rate. Most likely cause?", options: ["Too few edge locations", "The cache key forwards all headers and cookies", "TLS is enabled", "The origin is an ALB"], answer: 1, explain: "Forwarding everything makes each request unique. Restrict the cache key to headers, cookies, and query strings that actually vary the response." },
        { q: "A UDP-based game needs a fixed IP and sub-minute regional failover. What fits?", options: ["CloudFront", "Route 53 weighted routing", "Global Accelerator", "An interface endpoint"], answer: 2, explain: "Global Accelerator gives static anycast IPs, works with UDP, and shifts traffic between regional endpoints in seconds without waiting for DNS TTLs." },
      ],
    },
  ],
};
