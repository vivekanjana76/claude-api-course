import type { Accent } from "./types";

export interface PrepConcept {
  /** A prompt phrased as "can you explain / compare …" */
  q: string;
  /** A one-line memory hook for the answer. */
  hint: string;
}

export interface PrepStage {
  id: string;
  phase: string;
  title: string;
  accent: Accent;
  /** Module ids to review for this stage. */
  modules: string[];
  summary: string;
  mustKnow: PrepConcept[];
  /** The single most important idea to walk away with. */
  oneThing: string;
}

/** The connective narrative — the story an interviewer wants to hear you tell. */
export const bigPicture =
  "Every DevOps topic is one link in a single chain: a developer commits a small change (Git), CI builds it into an immutable, scanned, signed image (CI/CD + security), that image is described declaratively (Kubernetes/Terraform), Git is the source of truth that an agent reconciles into the cluster (GitOps), and observability watches it in production, feeding problems back to the next commit. If you can narrate that loop and explain *why* each link exists, you understand DevOps — the tools are just implementations.";

export const stages: PrepStage[] = [
  {
    id: "foundations",
    phase: "Phase 1",
    title: "Foundations & culture",
    accent: "iris",
    modules: ["foundations"],
    summary:
      "Start with the why. Interviews often open with 'what is DevOps?' — a culture question, not a tools question. Nail the principles and you frame everything after it.",
    mustKnow: [
      { q: "What is DevOps, and how does it differ from the old Dev-vs-Ops split?", hint: "Shared ownership of the whole lifecycle; align on delivering value safely, not change-vs-stability." },
      { q: "Explain the Three Ways (Flow, Feedback, Continual learning).", hint: "Left→right flow, fast right→left feedback, a culture of experimentation over both." },
      { q: "What do the DORA metrics measure?", hint: "Deployment frequency, lead time, change-failure rate, MTTR — speed and stability together." },
      { q: "Why does trunk-based development suit continuous delivery?", hint: "Small, frequent integrations to main via short-lived branches avoid painful big merges." },
    ],
    oneThing: "DevOps is a culture of shared ownership and fast feedback — automation serves it, not the other way around.",
  },
  {
    id: "containers",
    phase: "Phase 2",
    title: "Containers & Kubernetes",
    accent: "teal",
    modules: ["docker", "kubernetes"],
    summary:
      "The packaging and runtime layer. Be fluent in why containers exist, how images are built efficiently, and Kubernetes' reconciliation model — the heart of most infra interviews.",
    mustKnow: [
      { q: "Container vs VM — what's actually shared?", hint: "Containers share the host kernel (isolated by namespaces/cgroups); VMs virtualize hardware and run a full OS." },
      { q: "Why use multi-stage builds and minimal base images?", hint: "Build with a full toolchain, ship only the artifact — smaller, faster, smaller attack surface." },
      { q: "Walk through what happens when you 'kubectl apply' a Deployment.", hint: "Desired state → etcd; controllers/scheduler reconcile reality to match; self-healing via ReplicaSets." },
      { q: "Pod vs Deployment vs Service — what does each give you?", hint: "Pod = smallest unit; Deployment = N replicas + rolling updates; Service = stable virtual IP/DNS." },
      { q: "How do liveness and readiness probes differ?", hint: "Liveness restarts a stuck container; readiness removes a not-ready pod from Service endpoints." },
    ],
    oneThing: "Kubernetes is a reconciliation engine: you declare desired state, controllers continuously close the gap to reality.",
  },
  {
    id: "delivery",
    phase: "Phase 3",
    title: "Delivery: CI/CD, IaC & GitOps",
    accent: "rose",
    modules: ["cicd", "iac", "gitops"],
    summary:
      "How change reaches production safely and repeatably. Interviewers probe deployment strategies, immutability, state, and the pull-based GitOps model.",
    mustKnow: [
      { q: "What's the difference between continuous delivery and continuous deployment?", hint: "Delivery: always deployable, human gate to prod. Deployment: auto all the way, no manual gate." },
      { q: "Compare rolling, blue-green, and canary deployments.", hint: "Rolling: incremental, no extra cost. Blue-green: instant switch, double capacity. Canary: metric-gated ramp." },
      { q: "Why 'build once, promote' the same immutable image?", hint: "Parity — you ship exactly what you tested; inject config per environment, never rebuild per stage." },
      { q: "What problem does Terraform state solve, and why store it remotely?", hint: "Maps declared resources to real ones to compute a plan; remote + locking enables safe team use." },
      { q: "How does GitOps (pull) differ from pushing deploys from CI?", hint: "An in-cluster agent reconciles the repo → cluster; Git is the source of truth and audit log; drift is auto-corrected." },
    ],
    oneThing: "Immutability + declarative source-of-truth make deploys boring: what you tested is what ships, and rollback is instant.",
  },
  {
    id: "operate",
    phase: "Phase 4",
    title: "Operate & secure",
    accent: "amber",
    modules: ["observability", "security"],
    summary:
      "Running what you ship. Expect SRE questions (SLOs, error budgets, incidents) and, increasingly, DevSecOps (shift-left, supply chain, least privilege).",
    mustKnow: [
      { q: "Monitoring vs observability, and the three pillars?", hint: "Known-unknowns vs arbitrary questions; metrics (aggregate), logs (events), traces (request path)." },
      { q: "Explain SLI, SLO, SLA and the error budget.", hint: "Measured / target / contract; budget = 100%−SLO, spent on releases, refilled with reliability work." },
      { q: "What's the first priority during an incident?", hint: "Mitigate before diagnose — roll back / fail over to restore service; root-cause later, blamelessly." },
      { q: "What does 'shift left' security mean, and name the core scans.", hint: "Catch flaws early as PR gates: SAST (code), DAST (running app), SCA (deps), secret scanning." },
      { q: "How do you limit the blast radius of a compromised pod?", hint: "Least-privilege RBAC ServiceAccounts, default-deny NetworkPolicies, policy-as-code — defense in depth." },
    ],
    oneThing: "Reliability and security are engineering problems with numbers and guardrails — SLOs/error budgets and shift-left policy, not heroics.",
  },
];

/** 30-second 'explain it to a peer' prompts — rapid self-check across the whole course. */
export const rapidFire: string[] = [
  "Why are immutable artifacts and fast rollback the foundation of safe, frequent deploys?",
  "What actually makes a container lightweight compared to a VM?",
  "How does a HorizontalPodAutoscaler decide to add or remove pods?",
  "Why should secrets never live in Git, and where should they live instead?",
  "What is drift, and how do Terraform and GitOps each handle it?",
  "Why alert on error-budget burn rate instead of on raw CPU?",
  "What does signing a container image (cosign) actually prove at deploy time?",
  "Why keep metric label cardinality low?",
];
