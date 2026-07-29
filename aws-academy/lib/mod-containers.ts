import type { Module } from "./types";

export const containers: Module = {
  id: "containers",
  title: "Containers on AWS",
  blurb:
    "ECR, ECS task definitions and services, Fargate versus EC2 capacity, EKS architecture with IRSA and Karpenter, and how to choose between them honestly.",
  accent: "teal",
  lessons: [
    {
      slug: "containers-and-ecr",
      title: "Containers on AWS & Amazon ECR",
      summary:
        "Why containers won, what a registry does for you, and the image practices — multi-stage builds, scanning, immutable tags — that keep a platform healthy.",
      minutes: 9,
      blocks: [
        { type: "p", text: "A **container** packages an application with its dependencies into an image that runs identically anywhere. Unlike a VM it shares the host kernel, so it starts in milliseconds and costs almost nothing in overhead — which is what makes fine-grained services and fast deploys practical." },
        { type: "diagram", name: "container-orchestration", caption: "An orchestrator schedules containers onto capacity, restarts failures, and scales the count." },
        { type: "h2", text: "Why AWS teams containerise" },
        { type: "list", items: [
          "**Consistency** — the same image runs on a laptop, in CI, and in production, ending 'works on my machine'.",
          "**Density and speed** — many containers per host, starting in under a second instead of minutes.",
          "**Immutable deploys** — you ship a new image rather than mutating a server, which makes rollback trivial.",
          "**Portability** — the same image runs on ECS, EKS, App Runner, or somebody else's cloud.",
          "**A clean unit of scaling** — the orchestrator adds and removes identical copies.",
        ]},
        { type: "h2", text: "Amazon ECR" },
        { type: "p", text: "**Elastic Container Registry** is the managed private Docker registry: IAM-controlled, encrypted, replicated, and integrated with ECS, EKS, and Lambda container images." },
        { type: "list", items: [
          "**Authentication is IAM-based** — `aws ecr get-login-password` exchanges your AWS credentials for a registry token.",
          "**Image scanning** — basic scanning on push, or **enhanced scanning via Amazon Inspector** for continuous CVE detection in stored images.",
          "**Lifecycle policies** — expire untagged and old images automatically, or a busy registry quietly accumulates terabytes.",
          "**Cross-region and cross-account replication** — so a pull in another region isn't a cross-region data charge on every task start.",
          "**Pull-through cache** — proxies and caches public registries (Docker Hub, ECR Public, Quay) so upstream rate limits and outages don't break your deploys.",
          "**ECR Public** — for images you want to publish to the world.",
        ]},
        { type: "code", lang: "bash", caption: "Build, tag, and push an image", code: `ACCOUNT=111111111111
REGION=eu-west-1
REPO=my-service

aws ecr get-login-password --region $REGION \\
  | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$REGION.amazonaws.com

# tag with the git SHA — never rely on :latest in production
TAG=$(git rev-parse --short HEAD)
docker build --platform linux/arm64 -t $REPO:$TAG .
docker tag $REPO:$TAG $ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$REPO:$TAG
docker push $ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$REPO:$TAG` },
        { type: "callout", kind: "warn", text: "**Never deploy `:latest` to production.** It makes rollbacks ambiguous, breaks reproducibility, and means two tasks in the same service can run different code. Tag with the git SHA and enable **tag immutability** on the repository so a tag can never be overwritten." },
        { type: "h2", text: "Image practices that matter" },
        { type: "steps", items: [
          { title: "Multi-stage builds", text: "Compile in a full build image, copy only the artifact into a slim runtime image. Often cuts image size by 10×, which speeds every pull and scale-out." },
          { title: "Start from a minimal base", text: "`distroless`, Alpine, or the AWS-maintained slim images. Fewer packages means a far smaller CVE surface." },
          { title: "Run as a non-root user", text: "One line in the Dockerfile and a large reduction in container-escape impact." },
          { title: "One process, no secrets", text: "Secrets come from Secrets Manager or Parameter Store at runtime — never baked into a layer, where they're recoverable forever." },
          { title: "Build ARM64 for Graviton", text: "Cheaper compute for the same work, and most language runtimes are multi-arch already." },
          { title: "Scan and gate in CI", text: "Fail the pipeline on critical CVEs. A scan nobody blocks on is a report nobody reads." },
        ]},
        { type: "code", lang: "text", caption: "A multi-stage Dockerfile with the essentials", code: `# ---- build stage ----
FROM public.ecr.aws/docker/library/node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM public.ecr.aws/docker/library/node:20-slim
WORKDIR /app
RUN useradd --system --uid 10001 appuser
COPY --from=build --chown=appuser /app/dist ./dist
COPY --from=build --chown=appuser /app/node_modules ./node_modules
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s CMD node dist/healthcheck.js
CMD ["node", "dist/server.js"]` },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Image** = the immutable filesystem template a container is created from. **Layer** = one step of an image, cached and shared between images. **Registry** = where images are stored and pulled from. **Tag** = a human label on an image version; **digest** = its immutable content hash. **Multi-stage build** = using one image to compile and a smaller one to run. **CVE** = a publicly catalogued security vulnerability. **Distroless** = a base image containing only your app and its runtime, no shell or package manager." },
      ],
      takeaways: [
        "Containers give consistency, fast starts, immutable deploys, portability, and a clean scaling unit.",
        "ECR is IAM-authenticated with scanning, lifecycle policies, replication, and a pull-through cache for public registries.",
        "Tag images with the git SHA and enable tag immutability — never deploy `:latest`.",
        "Multi-stage builds on minimal bases, running as non-root with no baked secrets, cut both size and risk.",
        "Build ARM64 images to run on Graviton for cheaper compute.",
      ],
      flashcards: [
        { front: "Why avoid the :latest tag in production?", back: "It's mutable, so rollbacks are ambiguous and two running tasks can be on different code. Use the git SHA plus ECR tag immutability." },
        { front: "What does an ECR pull-through cache do?", back: "Proxies and caches public registries (Docker Hub, ECR Public, Quay) inside your account, so upstream rate limits or outages don't break deployments." },
        { front: "What does a multi-stage build achieve?", back: "Compiling in a full toolchain image and copying only the artifact into a slim runtime image — dramatically smaller images and a smaller vulnerability surface." },
        { front: "How does Docker authenticate to ECR?", back: "Via IAM: `aws ecr get-login-password` exchanges AWS credentials for a short-lived registry token used with `docker login`." },
      ],
      quiz: [
        { q: "Deployments start failing with Docker Hub rate-limit errors. Best fix?", options: ["Retry the pipeline", "Use an ECR pull-through cache", "Pay for more Lambda", "Switch regions"], answer: 1, explain: "A pull-through cache mirrors public images into your ECR, insulating builds and deployments from upstream rate limits and outages." },
        { q: "Which practice most reduces a container image's vulnerability surface?", options: ["Using :latest", "A minimal base image plus multi-stage builds", "Running as root", "Adding more layers"], answer: 1, explain: "Fewer packages means fewer CVEs; multi-stage builds keep compilers and build tooling out of the runtime image entirely." },
        { q: "Where should a container get its database password?", options: ["Baked into an image layer", "From Secrets Manager at runtime", "In the Dockerfile ENV", "In the image tag"], answer: 1, explain: "Anything baked into a layer is recoverable by anyone who pulls the image. Inject secrets at runtime from Secrets Manager or Parameter Store." },
      ],
    },
    {
      slug: "ecs-and-fargate",
      title: "ECS & Fargate: AWS-native orchestration",
      summary:
        "Task definitions, services, and clusters; Fargate versus EC2 capacity; service autoscaling and rolling or blue/green deploys.",
      minutes: 11,
      blocks: [
        { type: "p", text: "**Amazon ECS (Elastic Container Service)** is AWS's own orchestrator. It has a small vocabulary, integrates natively with IAM, ALB, CloudWatch, and Secrets Manager, and has no control-plane fee — which makes it the fastest path from container to production on AWS." },
        { type: "h2", text: "The three concepts" },
        { type: "list", items: [
          "**Task definition** — the blueprint: which container images, CPU and memory, environment variables and secrets, IAM roles, logging, ports, and health checks. Versioned as revisions.",
          "**Task** — one running instance of a task definition. Ephemeral, like a Kubernetes pod.",
          "**Service** — keeps N tasks running, registers them with a load balancer target group, replaces failures, and performs deployments.",
          "**Cluster** — a logical grouping of capacity (Fargate, EC2 instances, or both) that tasks run on.",
        ]},
        { type: "code", lang: "json", caption: "A Fargate task definition with the parts that matter", code: `{
  "family": "orders-api",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "512",
  "memory": "1024",
  "runtimePlatform": { "cpuArchitecture": "ARM64" },
  "executionRoleArn": "arn:aws:iam::111111111111:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::111111111111:role/OrdersApiTaskRole",
  "containerDefinitions": [{
    "name": "app",
    "image": "111111111111.dkr.ecr.eu-west-1.amazonaws.com/orders:9f3a1c2",
    "portMappings": [{ "containerPort": 8080, "protocol": "tcp" }],
    "environment": [{ "name": "LOG_LEVEL", "value": "info" }],
    "secrets": [{
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:eu-west-1:111111111111:secret:prod/db-AbC123"
    }],
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
      "interval": 30, "timeout": 5, "retries": 3, "startPeriod": 60
    },
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/orders-api",
        "awslogs-region": "eu-west-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}` },
        { type: "callout", kind: "key", text: "**Task role vs execution role** — the single most common ECS confusion. The **execution role** is used by the ECS agent to pull the image from ECR, fetch secrets, and write logs. The **task role** is what your application code uses to call AWS APIs. Wrong role, wrong error, and the message rarely says which." },
        { type: "h2", text: "Fargate vs EC2 capacity" },
        { type: "compare", caption: "Two ways to provide compute to a cluster.", columns: ["", "Fargate", "EC2 launch type"], rows: [
          { label: "You manage", cells: ["Nothing — declare CPU/memory per task", "The instances: AMIs, patching, scaling, bin-packing"] },
          { label: "Pricing", cells: ["Per task vCPU/GB-second, ~20–30% premium", "Per instance; Spot and Savings Plans apply"] },
          { label: "Startup", cells: ["Seconds, no capacity to wait for", "Fast if capacity exists, slower if the ASG must scale"] },
          { label: "Constraints", cells: ["No GPU, no privileged mode, no daemon containers, no host networking", "Full control including GPUs, custom kernels, DaemonSet-style agents"] },
          { label: "Choose when", cells: ["Default for most services", "GPUs, very high steady volume where Spot/RIs win, or special host needs"] },
        ]},
        { type: "callout", kind: "tip", text: "**Fargate Spot** gives roughly 70% off for interruption-tolerant tasks. A common production setup is a capacity provider strategy with a small base on regular Fargate for stability and the rest on Fargate Spot for cost." },
        { type: "h2", text: "Networking with awsvpc" },
        { type: "p", text: "On Fargate (and recommended on EC2) each task gets its **own ENI with its own private IP and security group** in your VPC. That means per-service network rules — `sg-orders-api` allowing only the ALB on 8080 — instead of port juggling on a shared host. It also means tasks consume subnet IP addresses, which is a real constraint at scale and another reason to size subnets generously." },
        { type: "h2", text: "Scaling and deployment" },
        { type: "list", items: [
          "**Service auto scaling** uses Application Auto Scaling with target tracking on CPU, memory, or `ALBRequestCountPerTarget` — the last is usually the best signal.",
          "**Rolling update** (default) — controlled by `minimumHealthyPercent` and `maximumPercent`; e.g. 100/200 briefly doubles capacity so no capacity is lost during a deploy.",
          "**Blue/green via CodeDeploy** — a second target group, a test listener, traffic shifting (linear or canary), and automatic rollback on CloudWatch alarms.",
          "**Circuit breaker** — ECS detects a failing deployment and rolls it back automatically. Enable it; it turns a bad deploy into a non-event.",
          "**ECS Exec** — `aws ecs execute-command` gives a shell inside a running task through SSM, with no SSH and full audit logging.",
        ]},
        { type: "code", lang: "bash", caption: "Deploy and debug", code: `# roll out a new task definition revision
aws ecs update-service --cluster prod --service orders-api \\
  --task-definition orders-api:42 --force-new-deployment

# watch it land
aws ecs describe-services --cluster prod --services orders-api \\
  --query "services[0].deployments[].{status:status,desired:desiredCount,running:runningCount}"

# shell into a running task (no SSH, fully logged)
aws ecs execute-command --cluster prod --task 0abc123 \\
  --container app --interactive --command "/bin/sh"` },
        { type: "callout", kind: "warn", text: "Tasks stuck in a `PENDING → STOPPED` loop almost always mean one of four things: the execution role can't pull from ECR, the image architecture doesn't match (ARM64 image on an x86 task or vice versa), the container exits immediately because of a config error, or there's no route to ECR/Secrets Manager from a private subnet. `describe-tasks` shows the `stoppedReason` — read it first." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Task definition** = the versioned blueprint for a set of containers. **Task** = a running instance of it. **Service** = the controller keeping N tasks alive and deploying new versions. **Capacity provider** = how a cluster obtains compute (Fargate, Fargate Spot, or an EC2 ASG). **awsvpc mode** = giving each task its own ENI, IP, and security group. **Bin-packing** = fitting tasks efficiently onto instances. **Circuit breaker** = automatic rollback of a failing deployment." },
      ],
      takeaways: [
        "ECS's vocabulary is small: task definition, task, service, cluster — plus a capacity provider.",
        "Execution role pulls images and secrets; task role is what your application code uses.",
        "Fargate removes node management for a ~20–30% premium; Fargate Spot recovers most of that for tolerant workloads.",
        "awsvpc gives each task its own IP and security group — great isolation, real subnet IP consumption.",
        "Use target tracking on request count, enable the deployment circuit breaker, and debug with ECS Exec and stoppedReason.",
      ],
      flashcards: [
        { front: "ECS task role vs execution role", back: "Execution role: used by the ECS agent to pull from ECR, read secrets, and ship logs. Task role: used by your application code to call AWS APIs." },
        { front: "What does the ECS deployment circuit breaker do?", back: "Detects a deployment whose tasks keep failing and automatically rolls back to the previous task definition revision." },
        { front: "What is Fargate Spot?", back: "Interruption-tolerant Fargate capacity at roughly 70% off, usually combined with a small on-demand base via a capacity provider strategy." },
        { front: "Task stuck PENDING → STOPPED — where do you look?", back: "`aws ecs describe-tasks` and read `stoppedReason`: usually ECR pull permissions, image architecture mismatch, an immediate app crash, or no network path to ECR/Secrets Manager." },
      ],
      quiz: [
        { q: "Your application code gets AccessDenied calling S3 from an ECS task. Which role is wrong?", options: ["The execution role", "The task role", "The instance profile", "The service-linked role"], answer: 1, explain: "The task role provides credentials to the application. The execution role only covers image pulls, secrets retrieval, and log delivery." },
        { q: "You want zero capacity loss during a rolling deploy. What do you configure?", options: ["minimumHealthyPercent 100, maximumPercent 200", "minimumHealthyPercent 0", "A larger task size", "Fargate Spot"], answer: 0, explain: "Keeping 100% healthy while allowing 200% lets ECS start replacements before draining old tasks, so serving capacity never dips." },
        { q: "Which ECS feature replaces SSH for debugging a running container?", options: ["ECS Exec via SSM", "A bastion host", "Session Manager on the host", "CloudWatch Logs"], answer: 0, explain: "`aws ecs execute-command` opens an interactive session inside the container through SSM, with IAM authorisation and audit logging." },
      ],
    },
    {
      slug: "eks-and-choosing",
      title: "EKS, Kubernetes on AWS & choosing an orchestrator",
      summary:
        "EKS architecture, node groups versus Fargate versus Karpenter, IRSA, the add-ons you actually need, and an honest ECS-versus-EKS decision.",
      minutes: 11,
      blocks: [
        { type: "p", text: "**Amazon EKS (Elastic Kubernetes Service)** runs an upstream-conformant Kubernetes control plane for you. You get the entire Kubernetes ecosystem and its portability — and the entire Kubernetes learning curve and operational surface." },
        { type: "h2", text: "The architecture" },
        { type: "list", items: [
          "**Managed control plane** — API server and etcd across three AZs, patched by AWS, billed hourly per cluster (about $73/month) regardless of size.",
          "**Data plane options**: **managed node groups** (EC2 in an ASG with AWS-handled AMI updates and draining), **self-managed nodes**, **Fargate profiles** (per-pod serverless), or **Karpenter** (the modern autoscaler that provisions right-sized nodes directly).",
          "**VPC CNI** — pods get real VPC IP addresses, so security groups and Flow Logs apply to them directly. Powerful, and it consumes subnet IPs quickly.",
          "**IRSA / EKS Pod Identity** — maps a Kubernetes ServiceAccount to an IAM role so each workload has its own AWS permissions instead of sharing the node role.",
          "**Access entries** map IAM principals to Kubernetes RBAC (the modern replacement for editing the `aws-auth` ConfigMap).",
        ]},
        { type: "code", lang: "yaml", caption: "IRSA: a pod with its own IAM identity", code: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: orders-api
  namespace: prod
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::111111111111:role/OrdersApiRole
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-api
  namespace: prod
spec:
  replicas: 3
  selector: { matchLabels: { app: orders-api } }
  template:
    metadata:
      labels: { app: orders-api }
    spec:
      serviceAccountName: orders-api     # ← the pod now assumes that IAM role
      containers:
        - name: app
          image: 111111111111.dkr.ecr.eu-west-1.amazonaws.com/orders:9f3a1c2
          resources:
            requests: { cpu: "250m", memory: "512Mi" }
            limits:   { memory: "512Mi" }
          readinessProbe:
            httpGet: { path: /health, port: 8080 }` },
        { type: "callout", kind: "key", text: "**Always set resource requests.** They're how Kubernetes schedules and how Karpenter or the Cluster Autoscaler decides what capacity to buy. Missing requests produce nodes that look empty while pods are pending, and a cluster nobody can size sensibly." },
        { type: "h2", text: "Karpenter vs Cluster Autoscaler" },
        { type: "p", text: "The **Cluster Autoscaler** scales pre-defined node groups up and down. **Karpenter** watches unschedulable pods and provisions the right instance type directly — mixing families, sizes, and Spot for the best fit in seconds. It typically improves both bin-packing and cost significantly, and it's now the default recommendation for new clusters." },
        { type: "h2", text: "Add-ons you'll actually install" },
        { type: "compare", caption: "The standard EKS baseline.", columns: ["Add-on", "Why"], rows: [
          { label: "AWS Load Balancer Controller", cells: ["Turns Ingress/Service objects into real ALBs and NLBs"] },
          { label: "EBS / EFS CSI drivers", cells: ["Persistent volumes backed by EBS or EFS"] },
          { label: "External DNS", cells: ["Creates Route 53 records from Ingress annotations"] },
          { label: "Karpenter", cells: ["Fast, cost-aware node provisioning"] },
          { label: "Metrics Server", cells: ["Required for Horizontal Pod Autoscaler"] },
          { label: "CloudWatch Container Insights / ADOT", cells: ["Metrics, logs, and traces from the cluster"] },
          { label: "cert-manager, ExternalSecrets", cells: ["TLS certificates and syncing Secrets Manager into Kubernetes secrets"] },
        ]},
        { type: "callout", kind: "warn", text: "That table is the honest cost of EKS: seven or more components you must install, configure, monitor, and **upgrade in step with Kubernetes minor versions roughly every few months**. EKS version support windows are finite, so upgrades are not optional. If nobody owns that work, ECS is the more responsible choice." },
        { type: "h2", text: "ECS vs EKS — deciding honestly" },
        { type: "diagram", name: "ecs-vs-eks", caption: "Simplicity and AWS integration versus portability and ecosystem." },
        { type: "compare", caption: "What actually drives the decision.", columns: ["Factor", "Favours ECS", "Favours EKS"], rows: [
          { label: "Team experience", cells: ["No Kubernetes background", "Existing K8s skills and on-call familiarity"] },
          { label: "Portability", cells: ["Happy to stay on AWS", "Multi-cloud or on-prem parity required"] },
          { label: "Ecosystem needs", cells: ["Standard web services", "Operators, service mesh, Argo, KEDA, Helm charts"] },
          { label: "Operational appetite", cells: ["Minimal — AWS handles more", "You will own add-ons and upgrades"] },
          { label: "Cost", cells: ["No control-plane fee", "$73/month per cluster plus the ops time"] },
          { label: "Hiring", cells: ["AWS-specific skill", "Kubernetes is an industry-portable skill"] },
        ]},
        { type: "callout", kind: "key", text: "A defensible summary for an interview: *\"ECS if the team is small, AWS-only, and wants to ship; EKS if we already run Kubernetes, need its ecosystem, or must stay portable. Both on Fargate when we don't want nodes. The wrong answer is picking EKS for résumé reasons and having nobody to run the upgrades.\"*" },
        { type: "h2", text: "App Runner: the third option" },
        { type: "p", text: "**AWS App Runner** takes a container image or a source repository and gives you a scaled, load-balanced HTTPS service with a URL — no cluster, no load balancer, no task definitions. It scales to a configurable minimum (including near-zero cost when idle). For a small web service or an internal tool it's dramatically less work than either ECS or EKS; the trade-off is limited networking and configuration control." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Control plane** = the Kubernetes API server and etcd that manage cluster state. **Node group** = a managed ASG of worker EC2 instances. **Pod** = the smallest schedulable Kubernetes unit (one or more containers). **IRSA** = IAM Roles for Service Accounts. **CNI** (Container Network Interface) = the plugin giving pods network addresses. **Karpenter** = an AWS-built autoscaler that provisions right-sized nodes on demand. **HPA** (Horizontal Pod Autoscaler) = scales pod replicas on metrics. **Resource requests/limits** = the CPU/memory a pod is guaranteed and capped at. **Operator** = a Kubernetes controller that automates an application's lifecycle." },
        { type: "h2", text: "Running containers well, regardless of orchestrator" },
        { type: "steps", items: [
          { title: "Health checks that mean something", text: "Readiness (can I take traffic?) separate from liveness (should I be restarted?). Conflating them causes restart storms." },
          { title: "Graceful shutdown", text: "Handle SIGTERM, stop accepting new work, finish in-flight requests, then exit — otherwise every deploy drops connections." },
          { title: "Right-size CPU and memory", text: "Over-requesting wastes capacity across every replica; under-requesting causes OOM kills and throttling." },
          { title: "Logs to stdout, structured as JSON", text: "Let the platform ship them; never write log files inside a container." },
          { title: "Secrets at runtime, config via environment", text: "From Secrets Manager or Parameter Store, never in the image." },
          { title: "Spread across AZs", text: "Multiple tasks/pods in at least two AZs, with anti-affinity or ECS spread placement." },
        ]},
      ],
      takeaways: [
        "EKS gives an upstream Kubernetes control plane for ~$73/month per cluster plus the add-ons and upgrades you own.",
        "IRSA (or Pod Identity) gives each pod its own IAM role instead of sharing the node's permissions.",
        "Karpenter provisions right-sized nodes from pending pods and generally beats the Cluster Autoscaler on cost and speed.",
        "Choose ECS for simplicity and AWS-only teams; EKS for existing Kubernetes skills, ecosystem, or portability.",
        "App Runner is a legitimate third option when you want a URL and no cluster at all.",
        "Regardless of orchestrator: real health checks, SIGTERM handling, right-sized resources, JSON logs to stdout, multi-AZ spread.",
      ],
      flashcards: [
        { front: "What is IRSA?", back: "IAM Roles for Service Accounts — annotating a Kubernetes ServiceAccount with a role ARN so pods using it get that role's credentials via OIDC, instead of sharing the node role." },
        { front: "Karpenter vs Cluster Autoscaler", back: "Cluster Autoscaler scales predefined node groups. Karpenter looks at pending pods and provisions right-sized instances (including Spot) directly — faster and usually cheaper." },
        { front: "What does EKS cost before any workload runs?", back: "About $73/month per cluster for the managed control plane, plus the engineering time for add-ons and regular Kubernetes version upgrades." },
        { front: "Readiness vs liveness probes", back: "Readiness decides whether a pod receives traffic; liveness decides whether it should be restarted. Conflating them causes needless restart storms." },
      ],
      quiz: [
        { q: "A pod needs S3 access without granting every pod on the node the same rights. What do you use?", options: ["The node instance profile", "IRSA / EKS Pod Identity", "A Kubernetes Secret with access keys", "A bucket ACL"], answer: 1, explain: "IRSA maps a ServiceAccount to an IAM role via OIDC, scoping permissions per workload rather than per node." },
        { q: "A five-person team with no Kubernetes experience needs to run 8 containerised services on AWS. Best choice?", options: ["EKS with Karpenter", "ECS on Fargate", "Self-managed Kubernetes on EC2", "Lambda"], answer: 1, explain: "ECS on Fargate delivers the outcome with a fraction of the operational surface. EKS adds add-ons and quarterly upgrades that a small team must own." },
        { q: "Pods are Pending and nodes look under-utilised. Likely cause?", options: ["Too few replicas", "Missing or oversized resource requests", "No load balancer", "Wrong region"], answer: 1, explain: "Scheduling is driven by requests. Absent or inflated requests make the scheduler misjudge capacity, leaving pods pending on apparently idle nodes." },
      ],
    },
  ],
};
