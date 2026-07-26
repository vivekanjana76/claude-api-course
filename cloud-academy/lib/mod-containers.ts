import type { Module } from "./types";

export const containers: Module = {
  id: "containers",
  title: "Containers & Kubernetes",
  blurb:
    "Why containers need orchestration, the managed choices (ECS, Fargate, EKS/AKS), and just enough Kubernetes to be dangerous.",
  accent: "teal",
  lessons: [
    {
      slug: "why-orchestration",
      title: "From containers to orchestration",
      summary:
        "A quick recap of containers, then the problem that appears the moment you run more than a few of them — and why orchestration solves it.",
      minutes: 8,
      blocks: [
        { type: "p", text: "A **container** packages your app with everything it needs to run into one portable, isolated unit that behaves identically on a laptop, in CI, and in the cloud. That solves 'works on my machine.' But running containers in production surfaces a new problem: managing *many* of them across *many* machines." },
        { type: "h2", text: "The problem orchestration solves" },
        { type: "p", text: "One container on one server is easy. Now imagine dozens of services, each needing several replicas for availability, spread across a fleet of machines. By hand you'd have to decide which container runs where, restart the ones that crash, replace them during deploys, scale them under load, and route traffic to healthy ones. That coordination is **orchestration**." },
        { type: "diagram", name: "container-orchestration", caption: "An orchestrator schedules containers onto a pool of nodes and keeps them running at the desired count." },
        { type: "h2", text: "What an orchestrator does for you" },
        { type: "list", items: [
          "**Scheduling** — decides which node has room to run each container.",
          "**Self-healing** — restarts crashed containers and reschedules them off failed nodes.",
          "**Scaling** — runs more or fewer replicas as load changes.",
          "**Rollouts** — replaces old versions with new ones gradually, and rolls back on failure.",
          "**Service discovery & load balancing** — gives containers stable addresses and spreads traffic across healthy replicas.",
        ]},
        { type: "callout", kind: "key", text: "You declare the **desired state** — 'run 5 replicas of this image, keep them healthy' — and the orchestrator continuously makes reality match. This declarative, self-healing loop is the whole point." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Container** = an app packaged with its dependencies into one portable, isolated unit (built as an image). **Image** = the built, shippable snapshot a container runs from. **Orchestration** = automatically placing, healing, scaling, and connecting many containers across many machines. **Node** = one machine (VM) in the pool that runs containers. **Replica** = one of several identical copies of a container run for scale and availability. **Desired state** = the target you declare; the orchestrator works to match it. **Self-healing** = automatically replacing failed containers/nodes." },
      ],
      takeaways: [
        "A container packages an app with its dependencies into a portable, isolated unit — solving 'works on my machine.'",
        "Running many containers across many machines needs coordination: that's orchestration.",
        "Orchestrators handle scheduling, self-healing, scaling, rollouts, and service discovery/load balancing.",
        "You declare desired state; the orchestrator continuously makes reality match it.",
      ],
      flashcards: [
        { front: "What problem does orchestration solve?", back: "Coordinating many containers across many machines: placement, restarting failures, scaling replicas, rolling out new versions, and routing traffic to healthy ones." },
        { front: "What is 'desired state'?", back: "The target you declare (e.g. 'run 5 healthy replicas'); the orchestrator continuously reconciles actual state to match it — the core of self-healing." },
        { front: "What is a node?", back: "One machine (VM) in the orchestrator's pool on which containers are scheduled to run." },
      ],
      quiz: [
        { q: "What is the core job of a container orchestrator?", options: ["Build container images", "Continuously make actual state match a declared desired state across a fleet", "Encrypt data at rest", "Replace the need for containers"], answer: 1, explain: "Orchestrators reconcile actual to desired state — scheduling, healing, scaling, and rolling out containers across nodes." },
        { q: "Why isn't running containers by hand enough in production?", options: ["Containers can't run in the cloud", "You must manually place, restart, scale, and route many containers across many machines", "Containers aren't portable", "It's only a licensing issue"], answer: 1, explain: "At scale the coordination — placement, self-healing, scaling, rollouts, traffic routing — is exactly what orchestration automates." },
      ],
    },
    {
      slug: "managed-container-services",
      title: "Managed container services",
      summary:
        "The cloud's container options — ECS, Fargate, and managed Kubernetes (EKS/AKS/GKE) — and how to choose between them.",
      minutes: 9,
      blocks: [
        { type: "p", text: "You rarely run your own orchestrator from scratch. The clouds offer managed services that handle the control plane and, optionally, the servers too. The choice comes down to how much control you want versus how much operational work you're willing to own." },
        { type: "h2", text: "The main options" },
        { type: "list", items: [
          "**AWS ECS** (Elastic Container Service) — AWS's own simpler orchestrator. Less flexible than Kubernetes but far less to learn; a great default on AWS.",
          "**AWS Fargate** — a **serverless** way to run containers: no nodes to manage at all. Works under ECS or EKS — you just say 'run this container' and AWS provisions the compute.",
          "**Managed Kubernetes** — **AWS EKS**, **Azure AKS**, **Google GKE**: the cloud runs the Kubernetes control plane; you run the industry-standard, portable orchestrator.",
        ]},
        { type: "compare", caption: "Choosing a container service.", columns: ["Option", "You manage", "Best when"], rows: [
          { label: "ECS", cells: ["Containers (+ optional nodes)", "You're on AWS and want simple, not Kubernetes"] },
          { label: "Fargate", cells: ["Just the container", "You want zero node management (serverless containers)"] },
          { label: "EKS / AKS / GKE", cells: ["Kubernetes workloads", "You need portability, ecosystem, or fine control"] },
        ]},
        { type: "h2", text: "Kubernetes vs the simpler options" },
        { type: "p", text: "**Kubernetes (K8s)** is the open-source, cloud-agnostic standard with a vast ecosystem — but it's genuinely complex. ECS and Fargate trade that flexibility for simplicity. A useful heuristic: choose managed Kubernetes when you need **portability across clouds**, a specific ecosystem tool, or fine-grained control; choose ECS/Fargate when you just want to run containers on AWS with minimal overhead." },
        { type: "callout", kind: "warn", text: "Kubernetes is powerful but not free of cost — it's a steep learning curve and real operational weight. Don't adopt it for a handful of services just because it's popular; simpler managed options often ship faster and break less." },
        { type: "callout", kind: "tip", text: "**Fargate is to containers what Lambda is to functions** — serverless compute where you never touch a server. Pair it with ECS or EKS to drop node management entirely while keeping the container model." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Control plane** = the orchestrator's brain that schedules and manages workloads (the managed part). **ECS** = AWS's simpler, non-Kubernetes orchestrator. **Fargate** = serverless containers — run containers with no nodes to manage. **EKS / AKS / GKE** = managed Kubernetes on AWS / Azure / Google. **Kubernetes (K8s)** = the open-source, portable orchestration standard. **Cloud-agnostic** = runs the same across providers, reducing lock-in." },
      ],
      takeaways: [
        "ECS is AWS's simpler orchestrator; Fargate runs containers serverlessly with no nodes to manage.",
        "EKS/AKS/GKE are managed Kubernetes — the cloud runs the control plane, you get the portable standard.",
        "Choose Kubernetes for portability, ecosystem, or fine control; choose ECS/Fargate for simplicity on AWS.",
        "Kubernetes is powerful but heavy — don't adopt it for a few services just because it's popular.",
      ],
      flashcards: [
        { front: "What is AWS Fargate?", back: "A serverless way to run containers — no nodes/servers to manage. It runs under ECS or EKS; you just declare the container and AWS provisions the compute." },
        { front: "ECS vs managed Kubernetes (EKS/AKS)", back: "ECS is AWS's simpler, proprietary orchestrator (less to learn). Managed Kubernetes runs the portable, ecosystem-rich open standard — more powerful but more complex." },
        { front: "When should you pick Kubernetes?", back: "When you need cross-cloud portability, a specific ecosystem tool, or fine-grained control — not just because it's popular for a handful of services." },
      ],
      quiz: [
        { q: "You want to run containers on AWS with no servers or nodes to manage. Which fits best?", options: ["EKS with self-managed nodes", "Fargate", "A raw EC2 instance", "Azure AKS"], answer: 1, explain: "Fargate is serverless containers — AWS provisions the compute so there are no nodes to manage; it runs under ECS or EKS." },
        { q: "What's the main reason to choose managed Kubernetes over ECS?", options: ["It's always cheaper", "Portability across clouds, ecosystem, and fine-grained control", "It removes the need for containers", "It has no learning curve"], answer: 1, explain: "Kubernetes is the portable, ecosystem-rich standard — worth its complexity when you need portability, specific tooling, or fine control." },
      ],
    },
    {
      slug: "kubernetes-core-concepts",
      title: "Kubernetes core concepts",
      summary:
        "Just enough Kubernetes to hold a conversation: pods, deployments, services, and the reconciliation loop.",
      minutes: 9,
      blocks: [
        { type: "p", text: "You don't need to be a Kubernetes operator to work with the cloud, but you should recognize its core objects. They all serve one idea: you write down the state you want, and Kubernetes works to achieve and maintain it." },
        { type: "h2", text: "The objects you'll hear about" },
        { type: "list", items: [
          "**Pod** — the smallest deployable unit: one (or a few tightly coupled) containers that share a network and storage. Pods are disposable and can be replaced at any time.",
          "**Deployment** — declares 'keep N replicas of this pod running' and manages rolling updates and rollbacks. This is what you usually create, not raw pods.",
          "**Service** — a stable network endpoint (a fixed name and IP) that load-balances across the pods behind it, so callers don't care that individual pods come and go.",
          "**Ingress** — routes external HTTP(S) traffic to services, handling host/path rules and TLS.",
          "**Namespace** — a virtual partition to isolate and organize resources within a cluster.",
        ]},
        { type: "h2", text: "The reconciliation loop" },
        { type: "p", text: "Everything in Kubernetes is **declarative**: you submit a manifest describing desired state, and controllers continuously compare desired versus actual and act to close the gap. Kill a pod and the Deployment makes a new one; ask for 5 replicas and the controller keeps exactly 5. This constant **reconciliation** is what makes clusters self-healing." },
        { type: "callout", kind: "key", text: "Two ideas unlock Kubernetes: (1) **pods are cattle, not pets** — disposable and replaceable, never hand-tended; and (2) the **control loop** endlessly drives actual state toward your declared desired state." },
        { type: "callout", kind: "warn", text: "Kubernetes gives you enormous control and equal opportunity to misconfigure — networking, resource limits, and security policies are all yours to get right. On a managed service the control plane is handled, but your workloads still need care." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Pod** = the smallest unit Kubernetes runs — one or a few containers sharing network/storage. **Deployment** = declares and maintains N replicas of a pod, with rolling updates. **Service** = a stable endpoint that load-balances across pods. **Ingress** = routes outside HTTP traffic to services (with TLS). **Namespace** = a partition to isolate resources in a cluster. **Manifest** = a YAML file describing desired state. **Declarative** = you state the end result, not the steps. **Reconciliation loop** = controllers continuously driving actual state to match desired." },
      ],
      takeaways: [
        "A pod is the smallest unit (one or a few containers sharing network/storage) and is disposable — cattle, not pets.",
        "A Deployment keeps N replicas running with rolling updates; a Service gives pods a stable, load-balanced endpoint.",
        "Kubernetes is declarative: you submit manifests of desired state and controllers reconcile actual toward it.",
        "The reconciliation loop is what makes clusters self-healing; managed services run the control plane but not your workloads' correctness.",
      ],
      flashcards: [
        { front: "Pod vs Deployment vs Service", back: "Pod = smallest unit (a container or few). Deployment = keeps N replicas of a pod running with rolling updates. Service = a stable, load-balanced endpoint in front of pods." },
        { front: "What is the Kubernetes reconciliation loop?", back: "Controllers continuously compare desired state (your manifests) to actual state and act to close the gap — recreating pods, maintaining replica counts — which makes clusters self-healing." },
        { front: "Why are pods 'cattle, not pets'?", back: "They're disposable and replaceable — Kubernetes replaces them freely rather than hand-tending any individual one, so apps must tolerate pods coming and going." },
      ],
      quiz: [
        { q: "Which Kubernetes object gives a set of pods a stable, load-balanced network endpoint?", options: ["Pod", "Deployment", "Service", "Namespace"], answer: 2, explain: "A Service provides a fixed name/IP and load-balances across the pods behind it, so callers don't track individual pods." },
        { q: "What does 'declarative + reconciliation loop' mean in Kubernetes?", options: ["You run manual commands to fix each problem", "You declare desired state and controllers continuously drive actual state to match it", "Pods must be tended individually", "It only applies to networking"], answer: 1, explain: "You submit manifests of desired state; controllers endlessly reconcile actual toward desired, which is what makes clusters self-healing." },
      ],
    },
  ],
};
