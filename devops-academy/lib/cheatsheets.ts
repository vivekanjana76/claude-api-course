import type { Accent } from "./types";

export interface CheatCommand {
  cmd: string;
  desc: string;
}

export interface CheatSection {
  title: string;
  commands: CheatCommand[];
}

export interface CheatSheet {
  id: string;
  tool: string;
  blurb: string;
  accent: Accent;
  sections: CheatSection[];
}

export const cheatsheets: CheatSheet[] = [
  {
    id: "git",
    tool: "Git",
    blurb: "The version-control commands behind every pipeline — branch, commit, review, and recover.",
    accent: "iris",
    sections: [
      {
        title: "Everyday flow",
        commands: [
          { cmd: "git status", desc: "Show changed, staged, and untracked files." },
          { cmd: "git add -p", desc: "Stage changes interactively, hunk by hunk." },
          { cmd: "git commit -m \"msg\"", desc: "Commit staged changes with a message." },
          { cmd: "git log --oneline --graph", desc: "Compact, visual commit history." },
          { cmd: "git diff / git diff --staged", desc: "See unstaged / staged changes." },
        ],
      },
      {
        title: "Branch & merge",
        commands: [
          { cmd: "git switch -c feature/x", desc: "Create and switch to a new branch." },
          { cmd: "git switch main", desc: "Switch to an existing branch." },
          { cmd: "git merge feature/x", desc: "Merge a branch into the current one." },
          { cmd: "git rebase main", desc: "Replay your commits on top of main (linear history)." },
          { cmd: "git branch -d feature/x", desc: "Delete a merged local branch." },
        ],
      },
      {
        title: "Sync with remotes",
        commands: [
          { cmd: "git pull --rebase", desc: "Fetch and replay local commits on top — avoids merge bubbles." },
          { cmd: "git push -u origin feature/x", desc: "Push a branch and set upstream tracking." },
          { cmd: "git fetch --all --prune", desc: "Update remotes and drop deleted branches." },
        ],
      },
      {
        title: "Undo & recover",
        commands: [
          { cmd: "git restore <file>", desc: "Discard unstaged changes to a file." },
          { cmd: "git reset --soft HEAD~1", desc: "Undo the last commit, keep changes staged." },
          { cmd: "git revert <sha>", desc: "Create a new commit that undoes a commit (safe on shared branches)." },
          { cmd: "git reflog", desc: "See every HEAD move — your safety net to recover 'lost' commits." },
          { cmd: "git stash / git stash pop", desc: "Shelve changes and restore them later." },
        ],
      },
    ],
  },
  {
    id: "docker",
    tool: "Docker",
    blurb: "Build, run, and inspect container images and containers on your machine.",
    accent: "teal",
    sections: [
      {
        title: "Images",
        commands: [
          { cmd: "docker build -t app:1.0 .", desc: "Build an image from the Dockerfile in the current dir." },
          { cmd: "docker images", desc: "List local images." },
          { cmd: "docker pull / docker push app:1.0", desc: "Fetch from / publish to a registry." },
          { cmd: "docker tag app:1.0 registry/app:1.0", desc: "Add a registry-qualified tag before pushing." },
          { cmd: "docker history app:1.0", desc: "Inspect an image's layers and their sizes." },
        ],
      },
      {
        title: "Containers",
        commands: [
          { cmd: "docker run -d -p 8080:80 app:1.0", desc: "Run detached, mapping host:container ports." },
          { cmd: "docker ps / docker ps -a", desc: "List running / all containers." },
          { cmd: "docker logs -f <id>", desc: "Stream a container's logs." },
          { cmd: "docker exec -it <id> sh", desc: "Open an interactive shell inside a running container." },
          { cmd: "docker stop / docker rm <id>", desc: "Stop then remove a container." },
        ],
      },
      {
        title: "Housekeeping & Compose",
        commands: [
          { cmd: "docker system df", desc: "Show disk used by images, containers, and volumes." },
          { cmd: "docker system prune -a", desc: "Reclaim space — remove unused images, networks, and containers." },
          { cmd: "docker compose up -d", desc: "Start a multi-service stack from compose.yaml, detached." },
          { cmd: "docker compose logs -f", desc: "Tail logs across all Compose services." },
          { cmd: "docker compose down", desc: "Stop and remove the whole stack." },
        ],
      },
    ],
  },
  {
    id: "kubectl",
    tool: "kubectl",
    blurb: "Talk to the Kubernetes API server: inspect, apply, debug, and roll out workloads.",
    accent: "amber",
    sections: [
      {
        title: "Inspect",
        commands: [
          { cmd: "kubectl get pods -o wide", desc: "List pods with node and IP details." },
          { cmd: "kubectl get all -n <ns>", desc: "List common resources in a namespace." },
          { cmd: "kubectl describe pod <name>", desc: "Full details + events — the first stop when a pod misbehaves." },
          { cmd: "kubectl get events --sort-by=.lastTimestamp", desc: "Recent cluster events, newest last." },
          { cmd: "kubectl top pod / node", desc: "Live CPU/memory usage (needs metrics-server)." },
        ],
      },
      {
        title: "Apply & manage",
        commands: [
          { cmd: "kubectl apply -f manifest.yaml", desc: "Declaratively create/update from a manifest." },
          { cmd: "kubectl diff -f manifest.yaml", desc: "Preview what an apply would change." },
          { cmd: "kubectl scale deploy/api --replicas=5", desc: "Change a Deployment's replica count." },
          { cmd: "kubectl delete -f manifest.yaml", desc: "Remove the resources a manifest defines." },
          { cmd: "kubectl label pod <name> tier=web", desc: "Add or update a label on a resource." },
        ],
      },
      {
        title: "Debug",
        commands: [
          { cmd: "kubectl logs -f <pod> [-c <container>]", desc: "Stream a pod's (or a container's) logs." },
          { cmd: "kubectl exec -it <pod> -- sh", desc: "Open a shell inside a running pod." },
          { cmd: "kubectl port-forward svc/api 8080:80", desc: "Tunnel a local port to a Service for testing." },
          { cmd: "kubectl get pod <name> -o yaml", desc: "Dump a resource's full live spec and status." },
        ],
      },
      {
        title: "Rollouts",
        commands: [
          { cmd: "kubectl rollout status deploy/api", desc: "Watch a rolling update complete." },
          { cmd: "kubectl rollout undo deploy/api", desc: "Roll back to the previous ReplicaSet — instant recovery." },
          { cmd: "kubectl rollout restart deploy/api", desc: "Restart pods (e.g. to pick up new config)." },
          { cmd: "kubectl rollout history deploy/api", desc: "List a Deployment's revisions." },
        ],
      },
    ],
  },
  {
    id: "terraform",
    tool: "Terraform",
    blurb: "The core Infrastructure-as-Code loop — init, plan, apply — plus state and formatting.",
    accent: "iris",
    sections: [
      {
        title: "Core workflow",
        commands: [
          { cmd: "terraform init", desc: "Download providers and configure the backend. Run first." },
          { cmd: "terraform plan -out=tfplan", desc: "Compute and save the diff between config and real state." },
          { cmd: "terraform apply tfplan", desc: "Apply a saved plan — exactly what you reviewed." },
          { cmd: "terraform destroy", desc: "Tear down everything the configuration manages." },
        ],
      },
      {
        title: "Quality & inspection",
        commands: [
          { cmd: "terraform fmt -recursive", desc: "Canonically format all .tf files." },
          { cmd: "terraform validate", desc: "Check configuration for syntax and internal consistency." },
          { cmd: "terraform show", desc: "Human-readable view of state or a saved plan." },
          { cmd: "terraform output", desc: "Print the root module's output values." },
        ],
      },
      {
        title: "State",
        commands: [
          { cmd: "terraform state list", desc: "List resources tracked in state." },
          { cmd: "terraform state show <addr>", desc: "Show one resource's attributes in state." },
          { cmd: "terraform import <addr> <id>", desc: "Bring an existing real resource under Terraform management." },
          { cmd: "terraform state rm <addr>", desc: "Stop managing a resource without destroying it." },
        ],
      },
    ],
  },
  {
    id: "promql",
    tool: "Prometheus & PromQL",
    blurb: "Query patterns for the de-facto metrics stack — rates, aggregation, and latency quantiles.",
    accent: "rose",
    sections: [
      {
        title: "Selectors & basics",
        commands: [
          { cmd: "http_requests_total", desc: "Select all time series for a metric." },
          { cmd: "http_requests_total{status=\"500\"}", desc: "Filter by an exact label value." },
          { cmd: "http_requests_total{status=~\"5..\"}", desc: "Filter with a regex (all 5xx statuses)." },
          { cmd: "http_requests_total offset 1h", desc: "Evaluate the metric as it was one hour ago." },
        ],
      },
      {
        title: "Rates & aggregation",
        commands: [
          { cmd: "rate(http_requests_total[5m])", desc: "Per-second rate of a counter over 5 minutes." },
          { cmd: "sum by (status) (rate(...[5m]))", desc: "Aggregate a rate, grouping by a label." },
          { cmd: "increase(http_requests_total[1h])", desc: "Total increase of a counter over the window." },
          { cmd: "avg / max / count(...)", desc: "Aggregate across series (optionally with by/without)." },
        ],
      },
      {
        title: "Latency & SLOs",
        commands: [
          { cmd: "histogram_quantile(0.95, sum by (le) (rate(bucket[5m])))", desc: "p95 latency from a histogram." },
          { cmd: "sum(rate(err[5m])) / sum(rate(total[5m]))", desc: "Error ratio — the basis of an SLI." },
          { cmd: "predict_linear(disk_free[1h], 4*3600)", desc: "Extrapolate a gauge 4 hours ahead (capacity alerts)." },
          { cmd: "up == 0", desc: "Targets that are down — a classic alert rule." },
        ],
      },
    ],
  },
];
