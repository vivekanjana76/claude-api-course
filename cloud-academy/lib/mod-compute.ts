import type { Module } from "./types";

export const compute: Module = {
  id: "compute",
  title: "Compute",
  blurb: "Virtual machines, autoscaling, load balancing, and the spectrum from VMs to containers to serverless.",
  accent: "amber",
  lessons: [
    {
      slug: "virtual-machines",
      title: "Virtual machines: EC2 & Azure VMs",
      summary:
        "The workhorse of the cloud — renting a virtual server by the second, choosing the right size, and understanding what an image and instance type are.",
      minutes: 9,
      blocks: [
        { type: "p", text: "A **virtual machine (VM)** is a software-defined computer running on the provider's physical hardware. It's the most familiar unit of compute: it looks and behaves like a server you'd rack yourself, but you launch it in a minute and pay by the second. On AWS these are **EC2 instances**; on Azure, **Virtual Machines**." },
        { type: "h2", text: "The three choices when you launch a VM" },
        { type: "list", ordered: true, items: [
          "**An image** — the OS and pre-installed software to boot from. AWS calls it an **AMI** (Amazon Machine Image); Azure calls it a **VM Image**. Start from a base OS or a custom golden image.",
          "**An instance type / size** — the CPU, memory, and network profile. AWS uses families like `t3.micro` (burstable) or `m6i.large` (general); Azure uses `B`, `D`, `E`, `F` series. Bigger = more resources = higher cost.",
          "**A network placement** — which VPC/VNet, subnet, and Availability Zone it lives in, plus its security group / NSG rules.",
        ]},
        { type: "callout", kind: "tip", text: "Instance families are specialized: general-purpose (balanced), compute-optimized (CPU-heavy), memory-optimized (databases, caches), and accelerated (GPUs for ML). Match the family to the bottleneck, not just the vCPU count." },
        { type: "h2", text: "What runs where" },
        { type: "compare", caption: "The same VM concepts, two vocabularies.", columns: ["Concept", "AWS", "Azure"], rows: [
          { label: "Virtual server", cells: ["EC2 instance", "Virtual Machine"] },
          { label: "Boot image", cells: ["AMI", "VM Image / Gallery"] },
          { label: "Attached disk", cells: ["EBS volume", "Managed Disk"] },
          { label: "Instance metadata", cells: ["IMDS", "IMDS"] },
          { label: "Bulk group", cells: ["Auto Scaling Group", "VM Scale Set"] },
        ]},
        { type: "h2", text: "Stateless by default" },
        { type: "p", text: "Treat VMs as **disposable**. Anything on the local/root disk can vanish if the instance is terminated or fails. Keep important data on separate durable storage (a database, object storage, or a persistent volume) so you can replace a VM at any time without losing state. This mindset — 'cattle, not pets' — is what makes autoscaling and self-healing possible." },
        { type: "callout", kind: "warn", text: "Don't SSH in and hand-configure a production VM ('snowflake server'). Bake configuration into the image or a startup script so every replacement is identical and reproducible." },
      ],
      takeaways: [
        "A VM is a rented virtual server billed by the second — EC2 on AWS, Virtual Machines on Azure.",
        "Launching one means choosing an image (OS), an instance type/size, and a network placement.",
        "Instance families specialize: general, compute-, memory-optimized, and GPU/accelerated.",
        "Treat VMs as disposable 'cattle'; keep state on durable storage so any VM can be replaced.",
      ],
      flashcards: [
        { front: "AWS vs Azure name for a virtual server", back: "AWS: EC2 instance. Azure: Virtual Machine. Both are software-defined servers billed by the second." },
        { front: "What is an AMI / VM Image?", back: "A boot image bundling the OS and pre-installed software that a VM starts from." },
        { front: "'Cattle, not pets' — what does it mean?", back: "Treat VMs as disposable and identical; keep state elsewhere so any instance can be replaced without loss, enabling autoscaling and self-healing." },
      ],
      quiz: [
        { q: "Which three choices define a VM launch?", options: ["Region, password, IP", "Image, instance type/size, network placement", "CDN, DNS, TLS", "Bucket, key, policy"], answer: 1, explain: "You pick what to boot (image), how big (instance type), and where it lives (network/subnet/AZ)." },
        { q: "Why keep important data off a VM's local disk?", options: ["Local disks are slow", "The VM is disposable — local data is lost if it's terminated or fails", "It's cheaper", "Encryption requires it"], answer: 1, explain: "VMs are disposable; durable data belongs on separate storage so any VM can be replaced safely." },
      ],
    },
    {
      slug: "autoscaling-load-balancing",
      title: "Autoscaling & load balancing",
      summary:
        "How a fleet of VMs grows and shrinks with demand behind a load balancer that spreads traffic and routes around failures.",
      minutes: 10,
      blocks: [
        { type: "p", text: "One VM is a single point of failure and a fixed ceiling. Real applications run a **fleet** of identical VMs behind a **load balancer**, and let **autoscaling** adjust the fleet size automatically. Together they give you resilience *and* elasticity." },
        { type: "h2", text: "Load balancing" },
        { type: "p", text: "A **load balancer** is the single front door for your app. It distributes incoming requests across healthy instances, runs **health checks**, and stops sending traffic to any instance that fails — so a crashed VM is invisible to users." },
        { type: "diagram", name: "load-balancer", caption: "The load balancer spreads traffic across healthy targets in multiple AZs." },
        { type: "compare", caption: "Layer 4 vs Layer 7 load balancing.", columns: ["Type", "Works on", "AWS / Azure"], rows: [
          { label: "L7 (application)", cells: ["HTTP paths, hostnames, headers", "ALB / Application Gateway"] },
          { label: "L4 (network)", cells: ["Raw TCP/UDP, ultra-fast", "NLB / Load Balancer"] },
        ]},
        { type: "h2", text: "Autoscaling" },
        { type: "p", text: "An **Auto Scaling Group** (AWS) or **VM Scale Set** (Azure) keeps the fleet between a minimum and maximum count and scales on a policy — typically **target tracking** (e.g. 'keep average CPU at 50%'). Traffic rises, it launches more VMs; traffic falls, it terminates some. You pay only for what the moment demands." },
        { type: "diagram", name: "autoscaling", caption: "The scaling group adds VMs as load rises and removes them as it falls." },
        { type: "list", items: [
          "**Dynamic / target-tracking** — scale to hit a metric like CPU or request count. The default choice.",
          "**Scheduled** — scale ahead of a known pattern (business hours, a sale).",
          "**Predictive** — ML forecasts load and pre-warms capacity before the spike.",
        ]},
        { type: "callout", kind: "key", text: "Autoscaling + a load balancer + multiple AZs is the canonical resilient web tier. It self-heals (replaces failed VMs), self-scales (matches demand), and survives an AZ outage — all without a human." },
        { type: "callout", kind: "warn", text: "Scaling out only helps stateless apps. If a VM holds a user's session in memory, adding VMs breaks users randomly. Store session state in a shared cache or database, or enable sticky sessions." },
      ],
      takeaways: [
        "A load balancer is the app's front door: it spreads traffic and health-checks instances, hiding failures.",
        "L7 balancers route on HTTP (paths/hosts); L4 balancers move raw TCP/UDP fast.",
        "Auto Scaling Groups / VM Scale Sets keep a fleet between min and max and scale on a metric.",
        "The resilient web tier = autoscaling + load balancer + multiple AZs; it self-heals and self-scales.",
      ],
      flashcards: [
        { front: "What does a load balancer's health check do?", back: "It probes each instance and stops routing traffic to any that fail, so crashed VMs are invisible to users." },
        { front: "Target-tracking autoscaling", back: "A policy that adds/removes VMs to keep a metric (e.g. average CPU 50%) at target — the default dynamic scaling approach." },
        { front: "Why must apps be stateless to scale out?", back: "If session state lives in a VM's memory, adding/removing VMs loses or misroutes users. Keep state in a shared cache/DB instead." },
      ],
      quiz: [
        { q: "An instance crashes behind a load balancer. What do users experience?", options: ["A site-wide outage", "Nothing — the LB stops routing to it after a failed health check", "Slower DNS", "A billing spike"], answer: 1, explain: "Health checks let the load balancer route around failed instances, so a single crash is invisible." },
        { q: "Which is required for horizontal autoscaling to work correctly?", options: ["A larger instance type", "Stateless app instances (shared session storage)", "A reserved instance", "A private subnet"], answer: 1, explain: "Adding/removing instances only works cleanly if no per-user state lives on individual instances." },
      ],
    },
    {
      slug: "containers-and-serverless",
      title: "Containers & serverless compute",
      summary:
        "Moving up the compute spectrum: lightweight containers for portability and serverless functions for zero-ops, event-driven code.",
      minutes: 10,
      blocks: [
        { type: "p", text: "VMs aren't the only way to run code. Modern compute is a **spectrum** from full VMs (most control, most ops) to serverless functions (least ops, fastest to ship). Choosing the right rung is a core architecture decision." },
        { type: "diagram", name: "compute-spectrum", caption: "From bare metal to serverless — each step trades control for less operational burden." },
        { type: "h2", text: "Containers" },
        { type: "p", text: "A **container** packages your app with its dependencies into a lightweight, portable image that runs identically on any host. Unlike a VM, containers share the host OS kernel, so they start in milliseconds and pack densely onto a machine. **Docker** is the standard image format." },
        { type: "list", items: [
          "**Registry** — stores your images: AWS **ECR**, Azure **ACR**.",
          "**Orchestrator** — schedules containers across a cluster, restarts failures, scales: **Kubernetes** (EKS / AKS) or AWS's simpler **ECS**.",
          "**Serverless containers** — run a container without managing any servers: AWS **Fargate**, Azure **Container Apps**.",
        ]},
        { type: "callout", kind: "note", text: "Containers solve 'it works on my machine' by shipping the environment with the code. They're the default packaging for microservices and the substrate Kubernetes orchestrates. A full module covers containers and Kubernetes in depth." },
        { type: "h2", text: "Serverless functions" },
        { type: "p", text: "**Serverless functions** (AWS **Lambda**, Azure **Functions**) take it further: you upload a function, and the platform runs it **in response to events** — an HTTP request, a file upload, a message on a queue — scaling from zero to thousands of concurrent executions automatically. You pay per invocation and per millisecond of execution; **nothing runs (or bills) when idle**." },
        { type: "compare", caption: "Choosing a compute rung.", columns: ["Option", "Best for", "Watch out for"], rows: [
          { label: "VM", cells: ["Legacy apps, full OS control, steady load", "You own patching & scaling logic"] },
          { label: "Container", cells: ["Microservices, portability, mixed workloads", "Orchestration complexity (k8s)"] },
          { label: "Serverless", cells: ["Spiky/event-driven work, glue code, APIs", "Cold starts, time/size limits, per-call cost at scale"] },
        ]},
        { type: "callout", kind: "warn", text: "Serverless isn't free of trade-offs: a **cold start** adds latency when a function scales from zero, executions have time and memory limits, and at very high sustained volume per-invocation pricing can cost more than a reserved VM. Great for spiky and event-driven work, less so for constant heavy load." },
      ],
      takeaways: [
        "Compute is a spectrum: bare metal → VM → container → serverless, trading control for less ops.",
        "Containers package app + dependencies to run identically anywhere; orchestrated by Kubernetes (EKS/AKS) or ECS.",
        "Serverless functions (Lambda/Functions) run event-driven code, scale from zero, and bill per invocation.",
        "Pick the rung by workload: steady/full-control → VM; portable microservices → containers; spiky/event-driven → serverless.",
      ],
      flashcards: [
        { front: "Container vs VM (key difference)", back: "Containers share the host OS kernel, so they're lightweight and start in ms; VMs virtualize a full OS. Containers ship app + dependencies for identical runs anywhere." },
        { front: "What triggers a serverless function?", back: "Events — HTTP requests, file uploads, queue messages, schedules — with automatic scaling from zero and per-invocation billing." },
        { front: "What is a cold start?", back: "The extra latency when a serverless function scales up from zero and the platform must initialize a new execution environment." },
      ],
      quiz: [
        { q: "What makes containers start much faster than VMs?", options: ["They use less storage", "They share the host OS kernel instead of virtualizing a full OS", "They run only on GPUs", "They skip networking"], answer: 1, explain: "Containers share the host kernel and package just the app + deps, so they start in milliseconds versus a VM booting a full OS." },
        { q: "Which workload is the best fit for serverless functions?", options: ["A constant, CPU-heavy 24/7 service", "A spiky, event-driven API that's often idle", "A large in-memory database", "A monolith needing full OS control"], answer: 1, explain: "Serverless shines for spiky, event-driven, often-idle work — it scales from zero and bills only per invocation." },
      ],
    },
  ],
};
