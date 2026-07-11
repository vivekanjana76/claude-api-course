import type { InterviewQA } from "./types";

export const interviewQA: InterviewQA[] = [
  {
    topic: "Foundations",
    q: "What is DevOps, in one sentence?",
    a: "DevOps is a culture and set of practices that unite software development and operations to build, ship, and run software continuously and reliably — through shared ownership of the whole lifecycle, heavy automation, small frequent releases, and fast feedback from production. It's a way of working, not a tool or a job title.",
  },
  {
    topic: "Foundations",
    q: "How is DevOps different from the traditional Dev-and-Ops split?",
    a: "Traditionally developers were rewarded for change and operations for stability — conflicting goals that produced risky big-bang releases and finger-pointing when things broke. DevOps aligns everyone on safely delivering value continuously: the team that builds a service also runs it, work is automated end to end, changes are small and frequent, and failures are treated as blameless learning opportunities.",
  },
  {
    topic: "Foundations",
    q: "What are the four DORA metrics and why do they matter?",
    a: "Deployment frequency and lead time for changes measure speed; change failure rate and mean time to restore (MTTR) measure stability. They matter because the DORA research shows elite teams score well on all four at once — speed and stability rise together, not at each other's expense. They're read as a balanced set, not gamed individually.",
  },
  {
    topic: "Foundations",
    q: "Explain CI, continuous delivery, and continuous deployment.",
    a: "Continuous Integration automatically builds and tests every change as it merges to main frequently. Continuous Delivery goes further: every passing change is deployable and auto-goes to staging, but a human approves the production release. Continuous Deployment removes even that approval — every passing change auto-releases to production. Delivery keeps the deploy button; deployment removes it. Both need rock-solid automated testing.",
  },
  {
    topic: "Foundations",
    q: "What branching strategy suits continuous delivery, and why?",
    a: "Trunk-based development with short-lived feature branches: small changes merged to main daily (behind feature flags if needed). It keeps main always releasable and gives fast feedback. Long-lived branches (GitFlow) cause painful merge conflicts and delay integration — the opposite of the 'flow' DevOps optimizes for. GitFlow still fits versioned or on-prem software with discrete releases.",
  },
  {
    topic: "Docker",
    q: "What's the difference between a container and a virtual machine?",
    a: "A VM virtualizes hardware: a hypervisor runs multiple guest OSes, each a full OS with its own kernel — gigabytes, minutes to boot. A container virtualizes the OS: containers share the host kernel and isolate processes with Linux namespaces and cgroups — megabytes, milliseconds to start. Containers trade a little isolation strength (shared kernel) for huge gains in speed, density, and portability.",
  },
  {
    topic: "Docker",
    q: "What is a Docker image made of, and why does layer order matter?",
    a: "An image is a stack of read-only, content-addressed layers, one per Dockerfile instruction, plus metadata; a running container adds a thin writable layer on top. Order matters because the build cache invalidates from the first changed layer downward. Put rarely-changing steps (installing dependencies) early and often-changing steps (copying source) late, so a code change doesn't re-run the dependency install.",
  },
  {
    topic: "Docker",
    q: "What problem do multi-stage builds solve?",
    a: "They let you build with a full toolchain in one stage but ship only the finished artifact in a tiny runtime stage. The compiler, dev dependencies, and source never reach production — often shrinking an image from hundreds of megabytes to tens, with a much smaller attack surface (no shell or package manager for an attacker to use).",
  },
  {
    topic: "Docker",
    q: "Where should a container's persistent data live, and why?",
    a: "In a volume or an external managed database — never in the container's writable layer, which is ephemeral and lost when the container is removed. Containers are designed to be disposable cattle; decoupling state from the container is what makes scaling, rescheduling, and rolling updates safe.",
  },
  {
    topic: "Kubernetes",
    q: "What is Kubernetes and what is its core idea?",
    a: "Kubernetes is an open-source container orchestrator that schedules, scales, heals, and rolls out containers across a cluster. Its core idea is declarative reconciliation: you declare desired state (e.g. 'run 3 replicas of this image') and controllers continuously observe actual state, compare it to desired, and act to close the gap — restarting, rescheduling, and scaling on their own. You declare the what; it handles the how.",
  },
  {
    topic: "Kubernetes",
    q: "Walk through the main Kubernetes components.",
    a: "The control plane is the brain: the API server (front door everything talks through), etcd (the state store and source of truth), the scheduler (assigns pods to nodes), and the controller manager (runs reconciliation loops). Worker nodes run the containers via kubelet (node agent), a container runtime (containerd/CRI-O), and kube-proxy (networking). Managed services like EKS/AKS/GKE run the control plane for you.",
  },
  {
    topic: "Kubernetes",
    q: "Why not point traffic directly at a pod? What solves it?",
    a: "Pods are ephemeral — created, destroyed, and rescheduled with changing IPs. A Service solves it by giving a set of label-selected pods a stable virtual IP and DNS name and load-balancing across the healthy ones. Clients talk to the Service; pods behind it can scale and move transparently. For external HTTP, an Ingress routes by host/path to Services and terminates TLS.",
  },
  {
    topic: "Kubernetes",
    q: "Explain liveness vs readiness probes.",
    a: "A liveness probe asks 'is the app alive?' — on failure Kubernetes restarts the container, recovering from deadlocks. A readiness probe asks 'is it ready for traffic?' — on failure the pod is removed from Service endpoints (no traffic) but not restarted. 'Liveness restarts, readiness routes.' Correct readiness probes are what make rolling updates genuinely zero-downtime.",
  },
  {
    topic: "Kubernetes",
    q: "How do you configure an app and handle secrets in Kubernetes?",
    a: "Keep configuration out of the image so the same image runs in every environment. ConfigMaps hold non-sensitive config, Secrets hold sensitive values, both injected as env vars or mounted files. Crucially, Secrets are only base64-encoded by default — not encrypted — so enable encryption at rest, restrict with RBAC, and for real security use an external manager like Vault, Sealed Secrets, or a cloud secrets store.",
  },
  {
    topic: "Kubernetes",
    q: "How does autoscaling work in Kubernetes?",
    a: "The Horizontal Pod Autoscaler adjusts a Deployment's replica count based on CPU, memory, or custom metrics between a min and max — but only if containers declare resource requests, since it computes utilization against them. The HPA scales pods; the Cluster Autoscaler scales nodes to fit those pods. Together they let the cluster grow and shrink with demand.",
  },
  {
    topic: "CI/CD",
    q: "What does 'build once, deploy everywhere' mean and why does it matter?",
    a: "Build the artifact (typically a container image) a single time and promote that identical, immutable image through staging to production — never rebuild per environment. It matters because rebuilding risks shipping something different from what passed your tests. Configuration differences are injected at runtime, not baked in, so the tested bits stay identical everywhere.",
  },
  {
    topic: "CI/CD",
    q: "Describe a good GitHub Actions CI pipeline.",
    a: "A workflow in .github/workflows/ triggered on push and pull_request. A `test` job checks out code, sets up the runtime, installs deps, and runs lint/type/unit tests. A `build-image` job with `needs: test` runs only if tests pass, logs into a registry with the automatic GITHUB_TOKEN, and builds and pushes a container tagged with the commit SHA — an immutable, traceable artifact. Pin action versions, use least-privilege permissions, and inject secrets via ${{ secrets.* }}.",
  },
  {
    topic: "CI/CD",
    q: "What is the test pyramid and the anti-pattern to avoid?",
    a: "The test pyramid recommends many fast, cheap unit tests at the base, fewer integration tests in the middle, and few slow end-to-end tests at the top. The anti-pattern is the 'ice-cream cone' — mostly slow, flaky E2E tests and few unit tests, which is slow to run and hard to debug. Push tests down the pyramid so most bugs are caught cheaply and quickly.",
  },
  {
    topic: "CI/CD",
    q: "Compare rolling, blue-green, and canary deployments.",
    a: "Rolling replaces old pods with new ones incrementally — zero downtime, no extra cost, Kubernetes' default. Blue-green stands up a full new version alongside the old and switches all traffic at once — instant rollback but needs double capacity. Canary shifts a small percentage of traffic to the new version, watches metrics, then ramps up — the safest, limiting a bad deploy's blast radius, but it needs traffic shifting and good metrics.",
  },
  {
    topic: "CI/CD",
    q: "Why are feature flags and fast rollback so important?",
    a: "Feature flags decouple deploy from release: you ship code dark and enable it for a cohort at runtime with an instant kill switch — no redeploy. Fast, reliable rollback (redeploy the previous known-good immutable image, or `kubectl rollout undo`) is the single most important operational property: if you can revert in seconds, every deploy becomes low-stakes, which is what lets teams ship frequently and safely.",
  },
  {
    topic: "Security",
    q: "What is DevSecOps and what does 'shift left' mean?",
    a: "DevSecOps embeds security into the pipeline as a continuous, automated, shared responsibility rather than a gate at the end. 'Shift left' means moving security checks as early as possible — into the IDE, the pull request, and the build — because a flaw caught in code review costs minutes while the same flaw in production can cost a breach. In practice it's SAST, SCA, secret scanning, and image scanning wired in as required PR checks, plus a culture where developers own the security of what they build and the security team provides secure defaults and guardrails.",
  },
  {
    topic: "Security",
    q: "Explain SAST, DAST, and SCA — and which tends to be highest value.",
    a: "SAST (Static Application Security Testing) analyzes your source code without running it — fast, runs on every PR, but can be noisy. DAST (Dynamic) probes the running app from the outside like an attacker — fewer false positives but needs a deployed environment. SCA (Software Composition Analysis) inventories your third-party dependencies and flags known CVEs. SCA is often the highest value because most of your codebase is dependencies and most breaches exploit a known CVE in one of them.",
  },
  {
    topic: "Security",
    q: "How would you secure a container software supply chain?",
    a: "Trust the whole chain, not just your code: use minimal base images (distroless/alpine) to shrink the attack surface; scan images for CVEs in CI (Trivy/Grype) and fail on fixable high/critical findings; pin and deliberately update dependencies rather than using `latest`; generate an SBOM per build so you can instantly answer 'are we affected?' when a CVE drops; and sign artifacts with cosign/Sigstore, verifying the signature at deploy so only genuine, untampered images run. SLSA provides a maturity framework of provenance guarantees on top.",
  },
  {
    topic: "Security",
    q: "Where should secrets live, and why not in Git?",
    a: "Never in source code or Git: history is permanent (deleting the line later doesn't remove it), repos get cloned and leaked, and you lose independent rotation and auditing. Keep the plaintext in a system built to protect it — HashiCorp Vault or a cloud secret manager — reference it by name, and inject it at runtime. External Secrets syncs a manager into Kubernetes Secrets; Sealed Secrets encrypt a secret so only the cluster can decrypt it, making it safe to commit for GitOps. Note that Kubernetes Secrets are only base64-encoded, not encrypted. Rotate regularly and grant least privilege.",
  },
  {
    topic: "Security",
    q: "What runtime controls limit the blast radius of a compromised pod?",
    a: "Defense in depth with least privilege: give each workload its own narrowly-scoped ServiceAccount via RBAC (never bind cluster-admin), so a breached pod can do little through the API. Use NetworkPolicies to replace the default flat network with zero-trust — default-deny a namespace and allow only required connections, so one foothold can't reach everything. Enforce configuration rules with policy-as-code (OPA/Gatekeeper, Kyverno, Pod Security Admission) at the admission stage so risky configs (privileged containers, unsigned images) are simply rejected. These layers compose so a breach must defeat several.",
  },
  {
    topic: "Kubernetes",
    q: "Helm vs Kustomize — when would you reach for each?",
    a: "Both solve 'how do I manage manifests across environments,' but differently. Helm is a package manager: a Chart is a templated, versioned, parameterized bundle you install/upgrade as one release — great for packaging and sharing apps (including third-party ones) and for values-driven configuration. Kustomize is template-free: you keep plain YAML as a base and apply per-environment overlays/patches, which keeps manifests readable and is built into kubectl. A common approach is Kustomize for your own apps' env differences and Helm for packaging or installing off-the-shelf software; some teams even render Helm and patch with Kustomize.",
  },
  {
    topic: "Kubernetes",
    q: "What is a service mesh and what problem does it solve?",
    a: "A service mesh (Istio, Linkerd) is an infrastructure layer that handles service-to-service communication concerns — mutual TLS, retries, timeouts, traffic splitting for canaries, and rich telemetry — via sidecar proxies injected next to each app container, without changing application code. It's worth it when you have many microservices and need consistent zero-trust encryption, fine-grained traffic control, and observability across them. The trade-off is real operational complexity, so it's overkill for a handful of services.",
  },
  {
    topic: "Foundations",
    q: "What is the Twelve-Factor App methodology?",
    a: "A set of principles for building portable, scalable, cloud-native services. The greatest hits: store config in the environment (not in code), treat backing services as attached resources, keep processes stateless and share nothing, build/release/run as separate stages, dispose of processes fast for elastic scaling, keep dev and prod as similar as possible, and treat logs as event streams. It predates containers but maps almost perfectly onto how you build a good container image and Kubernetes workload.",
  },
  {
    topic: "SRE",
    q: "What is chaos engineering, and why do it?",
    a: "Chaos engineering is deliberately injecting failures into a system — killing pods, adding network latency, exhausting a resource — to verify it degrades gracefully and to surface hidden weaknesses before they cause a real outage. You do it because distributed systems fail in ways you can't fully predict; the only way to know your redundancy, timeouts, and auto-healing actually work is to test them. Run it as controlled experiments with a hypothesis, a small blast radius, and good observability so you learn without causing a real incident.",
  },
  {
    topic: "Foundations",
    q: "What is platform engineering and how does it relate to DevOps?",
    a: "Platform engineering builds an internal, self-service platform (an Internal Developer Platform) that gives product teams paved-road tooling and 'golden paths' — templated pipelines, environments, and infrastructure — so they can ship without becoming Kubernetes or Terraform experts. It's a response to DevOps' cognitive-load problem: 'you build it, you run it' can overwhelm teams, so a platform team abstracts the complexity behind a good developer experience. Done well, the secure, compliant path is also the easiest one, which is exactly where shift-left security wants to be.",
  },
];
