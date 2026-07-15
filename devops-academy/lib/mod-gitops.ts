import type { Module } from "./types";

export const gitops: Module = {
  id: "gitops",
  title: "GitOps & Argo CD",
  blurb: "Make Git the source of truth for what runs in production: GitOps principles, Argo CD's continuous reconciliation, repo structure, and progressive delivery.",
  accent: "teal",
  lessons: [
    {
      slug: "gitops-principles",
      title: "GitOps principles",
      summary:
        "Declare your whole system in Git and let an in-cluster agent continuously make reality match. The four principles and why pull beats push.",
      minutes: 9,
      blocks: [
        { type: "p", text: "**GitOps** is an operating model for continuous delivery where **Git is the single source of truth** for both infrastructure and applications, and an automated agent continuously reconciles the running system to match what's declared in the repository. It takes the reconciliation idea from Kubernetes and Terraform and applies it to *deployment itself*." },
        { type: "diagram", name: "gitops-loop", caption: "Developers change Git; an in-cluster agent detects the diff and reconciles the cluster to match — continuously." },
        { type: "h2", text: "The four principles" },
        { type: "list", ordered: true, items: [
          "**Declarative.** The entire desired state of the system is described declaratively (Kubernetes manifests, Helm charts, Kustomize).",
          "**Versioned & immutable.** That desired state is stored in Git — versioned, immutable history, with the current commit as the source of truth.",
          "**Pulled automatically.** Software agents automatically pull the desired state from Git (rather than being pushed to).",
          "**Continuously reconciled.** Agents continuously observe actual state and reconcile it toward the desired state, correcting drift.",
        ]},
        { type: "h2", text: "Push vs pull delivery" },
        { type: "p", text: "Traditional CI/CD is **push-based**: a pipeline has credentials to the cluster and runs `kubectl apply` to push changes in. GitOps is **pull-based**: an agent *inside* the cluster watches Git and pulls changes in. That inversion has real advantages." },
        { type: "diagram", name: "push-vs-pull", caption: "Push: the pipeline reaches into the cluster. Pull: an in-cluster agent reaches out to Git." },
        { type: "compare", caption: "Why pull-based GitOps is safer.", columns: ["Aspect", "Push (CI pushes)", "Pull (GitOps agent)"], rows: [
          { label: "Cluster credentials", cells: ["Held by external CI", "Stay inside the cluster"] },
          { label: "Drift", cells: ["Undetected until next deploy", "Continuously corrected"] },
          { label: "Audit trail", cells: ["Scattered in pipeline logs", "The Git history is the record"] },
          { label: "Rollback", cells: ["Re-run a pipeline", "`git revert` to the previous commit"] },
        ]},
        { type: "callout", kind: "key", text: "In GitOps, a deployment is a Git commit. To ship, you merge a change to the manifests repo; to roll back, you revert the commit. The cluster follows Git automatically — so Git is your deploy history, your audit log, and your rollback mechanism, all at once." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Manifest** = a YAML file describing what should run in Kubernetes (which image, how many copies). **GitOps** = making a Git repo the single source of truth so 'change the repo' *is* 'change production.' **Agent** = a program running in the cluster that watches Git and applies changes for you (e.g. Argo CD). **Audit log** = a permanent record of who changed what and when — here, your Git history gives it for free. **Revert** = undo a specific past commit, which in GitOps rolls production back." },
        { type: "callout", kind: "note", text: "GitOps usually splits into two repos: the app source repo (CI builds and pushes an image, then bumps the image tag in…) the config/manifests repo, which the GitOps agent watches. CI still builds; GitOps handles deploy." },
      ],
      takeaways: [
        "GitOps makes Git the single source of truth; an in-cluster agent continuously reconciles the system to match the repo.",
        "The four principles: declarative, versioned & immutable in Git, pulled automatically, continuously reconciled.",
        "Pull-based delivery keeps cluster credentials inside the cluster, corrects drift, and uses Git history as the audit trail.",
        "A deployment is a commit and a rollback is a `git revert` — Git becomes your deploy history and rollback mechanism.",
      ],
      flashcards: [
        { front: "What is GitOps in one sentence?", back: "An operating model where Git is the single source of truth for infrastructure and apps, and an agent continuously reconciles the running system to match the repository." },
        { front: "Push vs pull delivery", back: "Push: external CI holds cluster credentials and runs kubectl apply into the cluster. Pull: an agent inside the cluster watches Git and pulls changes — keeping credentials in-cluster and correcting drift continuously." },
        { front: "How do you deploy and roll back in GitOps?", back: "Deploy by merging a change to the manifests repo; roll back with `git revert` to a previous commit. The cluster follows Git automatically." },
      ],
      quiz: [
        { q: "In GitOps, what is the single source of truth?", options: ["The cluster's live state", "A Git repository of declarative manifests", "The CI server", "A spreadsheet"], answer: 1, explain: "GitOps treats a Git repo of declarative desired state as the source of truth; agents reconcile the cluster to it." },
        { q: "A key security advantage of pull-based GitOps is…", options: ["No need for Git", "Cluster credentials stay inside the cluster instead of in external CI", "It's faster to type", "It removes the need for manifests"], answer: 1, explain: "An in-cluster agent pulling from Git means external pipelines don't need cluster credentials — a smaller attack surface." },
      ],
    },
    {
      slug: "argo-cd",
      title: "Argo CD: continuous reconciliation",
      summary:
        "The most popular GitOps engine for Kubernetes — Applications, sync and health status, auto-sync and self-heal, and how it detects and corrects drift.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**Argo CD** is a declarative GitOps continuous-delivery tool for Kubernetes (Flux is the other major option). It runs *in* your cluster, watches Git repositories, and keeps the cluster in sync with them — with a slick UI, health visualization, and drift detection." },
        { type: "h2", text: "The Application object" },
        { type: "p", text: "The core Argo CD object is an **Application**: it points at a **source** (a Git repo, path, and revision — plain manifests, Kustomize, or Helm) and a **destination** (a cluster and namespace). Argo CD compares the rendered manifests from Git against what's live and reports a status." },
        { type: "code", lang: "yaml", caption: "An Argo CD Application", code: "apiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: api\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/acme/manifests\n    path: apps/api/overlays/prod\n    targetRevision: main\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: api\n  syncPolicy:\n    automated:\n      prune: true       # delete resources removed from Git\n      selfHeal: true    # revert manual cluster changes\n    syncOptions: [CreateNamespace=true]" },
        { type: "diagram", name: "argocd-sync", caption: "Argo CD compares Git (desired) with the cluster (live) and reports Synced/OutOfSync + Healthy/Degraded." },
        { type: "h2", text: "Sync status & health" },
        { type: "p", text: "Argo CD surfaces two orthogonal signals for every Application:" },
        { type: "list", items: [
          "**Sync status** — is the cluster in sync with Git? **Synced** (matches) or **OutOfSync** (Git and cluster differ; someone committed a change, or drift occurred).",
          "**Health status** — are the resources actually healthy? **Healthy**, **Progressing**, **Degraded**, or **Missing** — Argo understands Deployments, pods, Ingresses, and more.",
        ]},
        { type: "callout", kind: "key", text: "Sync ≠ health. An app can be Synced but Degraded (matches Git, but the new image crash-loops) or OutOfSync but Healthy (running fine, but a new commit hasn't been applied yet). Reading both tells you exactly what's happening." },
        { type: "h2", text: "Auto-sync, self-heal & prune" },
        { type: "list", items: [
          "**Automated sync** — Argo applies new commits automatically (no manual click), so merging to Git deploys.",
          "**Self-heal** — if someone changes a resource by hand (drift), Argo reverts it back to Git. Git wins, always.",
          "**Prune** — resources deleted from Git get deleted from the cluster, keeping the two exactly aligned.",
        ]},
        { type: "callout", kind: "warn", text: "Self-heal makes Git authoritative: `kubectl edit` on a managed resource gets undone within seconds. That's the point — but it means emergency manual fixes must also go through Git, or they'll be reverted. Change the repo, not the cluster." },
        { type: "callout", kind: "note", text: "Argo CD is driven declaratively too: you can manage Applications with Applications (the app-of-apps pattern, next lesson), so even your GitOps configuration lives in Git." },
      ],
      takeaways: [
        "Argo CD is an in-cluster GitOps engine that keeps Kubernetes in sync with Git repos (Flux is the other major tool).",
        "Its core object is the Application: a source (repo/path/revision) + destination (cluster/namespace).",
        "It reports two orthogonal signals — sync status (Synced/OutOfSync) and health (Healthy/Degraded/...).",
        "Automated sync deploys on merge; self-heal reverts manual drift; prune deletes resources removed from Git — Git always wins.",
      ],
      flashcards: [
        { front: "What is an Argo CD Application?", back: "The core object pairing a source (Git repo, path, revision — manifests/Kustomize/Helm) with a destination (cluster + namespace). Argo keeps the destination in sync with the source." },
        { front: "Sync status vs health status", back: "Sync: does the cluster match Git? (Synced/OutOfSync). Health: are the resources actually working? (Healthy/Progressing/Degraded/Missing). They're independent — an app can be Synced but Degraded." },
        { front: "What do self-heal and prune do in Argo CD?", back: "Self-heal reverts manual (drift) changes back to Git; prune deletes cluster resources that were removed from Git. Together they make Git strictly authoritative." },
      ],
      quiz: [
        { q: "An Argo CD app shows Synced but Degraded. What does that mean?", options: ["Git and cluster differ", "The cluster matches Git, but the resources aren't healthy (e.g. crash-looping)", "Argo CD is broken", "The repo is empty"], answer: 1, explain: "Sync and health are independent: Synced means it matches Git; Degraded means those matching resources aren't actually healthy." },
        { q: "What does Argo CD's self-heal do?", options: ["Restarts Argo CD", "Reverts manual changes to a resource back to the Git-declared state", "Deletes the cluster", "Pushes to Git"], answer: 1, explain: "Self-heal detects drift from manual changes and reconciles the resource back to what Git declares — Git wins." },
      ],
    },
    {
      slug: "repo-structure-and-app-of-apps",
      title: "Repo structure & the app-of-apps pattern",
      summary:
        "How to organize a GitOps repo across environments with Kustomize or Helm, and how one root Application can manage many others.",
      minutes: 9,
      blocks: [
        { type: "p", text: "GitOps lives or dies by how you structure the config repo. The goals: keep environments **DRY** (no copy-paste), make promotion between environments a small reviewable change, and let one place bootstrap everything." },
        { type: "h2", text: "Environments without duplication" },
        { type: "p", text: "You don't want three near-identical copies of every manifest. Two tools solve this by layering environment-specific values over a shared base:" },
        { type: "compare", caption: "The two dominant ways to template Kubernetes config.", columns: ["Tool", "Approach", "Good for"], rows: [
          { label: "Kustomize", cells: ["A base + per-env overlays that patch it", "Config that's mostly the same with small diffs"] },
          { label: "Helm", cells: ["Templated charts with per-env values files", "Packaging & sharing parameterized apps"] },
        ]},
        { type: "code", lang: "text", caption: "A common Kustomize repo layout", code: "manifests/\n└── apps/api/\n    ├── base/            # shared Deployment, Service, Ingress\n    │   └── kustomization.yaml\n    └── overlays/\n        ├── staging/     # patches: 2 replicas, staging host\n        └── prod/        # patches: 10 replicas, prod host, HPA" },
        { type: "callout", kind: "key", text: "Promotion becomes a diff. To ship v1.5 from staging to prod, you change the image tag in the prod overlay — one line, one PR, one review. The environments stay identical except for the deliberate differences you can see in Git." },
        { type: "h2", text: "The app-of-apps pattern" },
        { type: "p", text: "As you get more Applications, managing them by hand doesn't scale. The **app-of-apps** pattern uses one **root Application** whose source is a directory of *other* Application definitions. Argo syncs the root, which creates all the child apps — so your entire GitOps setup bootstraps from a single Application, itself defined in Git." },
        { type: "diagram", name: "gitops-loop", caption: "A root Application manages child Applications, which manage the workloads — GitOps all the way down." },
        { type: "list", items: [
          "**Bootstrap** a whole cluster's workloads from one root app.",
          "**Consistent** — every app is created the same declarative way.",
          "**Scalable** — add an app by adding a file, not by clicking in a UI.",
        ]},
        { type: "callout", kind: "tip", text: "Separate the app source repo from the config repo. CI builds the image and opens a PR bumping the tag in the config repo; humans review that PR. This keeps the deploy decision (config) distinct from the code change (source) and gives a clean, auditable promotion flow." },
      ],
      takeaways: [
        "Keep environments DRY with Kustomize (base + overlays) or Helm (charts + values), layering per-env differences over a shared base.",
        "Promotion between environments becomes a one-line, reviewable diff (usually an image tag change) in an overlay/values file.",
        "The app-of-apps pattern uses one root Application to manage many child Applications — bootstrapping a whole cluster from Git.",
        "Separate the app source repo from the config repo so CI (build) and GitOps (deploy) stay cleanly decoupled and auditable.",
      ],
      flashcards: [
        { front: "Kustomize vs Helm", back: "Kustomize layers per-environment overlays (patches) over a shared base — great for small diffs. Helm templates parameterized charts with per-env values files — great for packaging and sharing apps." },
        { front: "What is the app-of-apps pattern?", back: "A single root Argo CD Application whose source is a set of other Application definitions. Syncing the root creates all child apps, bootstrapping an entire cluster's workloads from one place in Git." },
        { front: "How does environment promotion work in GitOps?", back: "It's a small, reviewable Git diff — typically bumping the image tag in the target environment's overlay or values file — merged via a PR." },
      ],
      quiz: [
        { q: "How do you avoid duplicating manifests across environments?", options: ["Copy them per environment", "Use Kustomize overlays or Helm values over a shared base", "Store them in a database", "Hardcode everything"], answer: 1, explain: "Kustomize (base + overlays) and Helm (charts + values) layer per-env differences over shared config, keeping it DRY." },
        { q: "The app-of-apps pattern is used to…", options: ["Run multiple clusters", "Manage many Argo CD Applications from one root Application", "Replace Git", "Scale pods"], answer: 1, explain: "A root Application points at a set of child Application definitions, so the whole GitOps setup bootstraps from one declarative source." },
      ],
    },
    {
      slug: "progressive-delivery-and-rollbacks",
      title: "Progressive delivery, rollbacks & secrets",
      summary:
        "Automated canary and blue-green with Argo Rollouts, why Git-based rollback is so powerful, and how to handle secrets safely in a public-ish repo.",
      minutes: 9,
      blocks: [
        { type: "p", text: "GitOps gives you continuous, auditable delivery. Layer on **progressive delivery** for safety, understand its uniquely simple **rollback**, and solve the one awkward problem GitOps creates: **secrets**." },
        { type: "h2", text: "Progressive delivery with Argo Rollouts" },
        { type: "p", text: "A plain Kubernetes Deployment only does rolling updates. **Argo Rollouts** is a drop-in replacement (a `Rollout` resource) that adds automated **canary** and **blue-green** strategies, driven by metrics. It shifts a slice of traffic to the new version, checks analysis metrics (error rate, latency) against a threshold, and either promotes or automatically rolls back." },
        { type: "diagram", name: "deployment-strategies", caption: "Argo Rollouts automates the canary/blue-green shifts you met in the CI/CD module, gated by live metrics." },
        { type: "list", items: [
          "**Automated canary** — ramp traffic 5% → 25% → 50% → 100% with metric checks (analysis) at each step.",
          "**Auto-rollback** — if analysis fails, Rollouts reverts to the stable version with no human in the loop.",
          "**Pairs with GitOps** — the Rollout spec lives in Git; Argo CD syncs it, Argo Rollouts executes the strategy.",
        ]},
        { type: "h2", text: "Rollback is just Git" },
        { type: "callout", kind: "key", text: "Because the desired state is a Git commit, rollback is `git revert`. Revert the commit that bumped the image tag, and the GitOps agent syncs the cluster back to the previous known-good state within seconds — with a clean audit trail of exactly what changed and when. No special rollback tooling needed." },
        { type: "h2", text: "The secrets problem" },
        { type: "p", text: "GitOps says 'put everything in Git' — but you obviously can't commit plaintext passwords. Three common solutions:" },
        { type: "compare", caption: "Keeping secrets out of plaintext Git.", columns: ["Approach", "How it works", "Note"], rows: [
          { label: "Sealed Secrets", cells: ["Encrypt secrets; only the in-cluster controller can decrypt", "Encrypted blob is safe to commit"] },
          { label: "External Secrets Operator", cells: ["Git holds a reference; the operator pulls from Vault/cloud", "Secret never in Git at all"] },
          { label: "SOPS + age/KMS", cells: ["Encrypt values in the file; decrypt at apply time", "Fine-grained, file-level encryption"] },
        ]},
        { type: "callout", kind: "warn", text: "Never commit a raw Kubernetes Secret to Git — base64 is not encryption, and Git history is forever. Use Sealed Secrets, an external secrets operator, or SOPS so the repo only ever contains encrypted or referenced values." },
        { type: "callout", kind: "note", text: "That completes the delivery story: CI builds and tests (GitHub Actions), Terraform provisions the platform, containers run on Kubernetes, and GitOps + Argo CD keep production continuously, safely in sync with Git. The last module makes it observable." },
      ],
      takeaways: [
        "Argo Rollouts adds metric-driven automated canary and blue-green (with auto-rollback) on top of Kubernetes — its spec lives in Git.",
        "GitOps rollback is `git revert`: revert the commit and the agent syncs back to the previous known-good state, with a full audit trail.",
        "Secrets can't be committed in plaintext — use Sealed Secrets, an External Secrets Operator, or SOPS.",
        "Together CI + Terraform + Kubernetes + Argo CD form a complete, auditable path from commit to safe production delivery.",
      ],
      flashcards: [
        { front: "What does Argo Rollouts add over a plain Deployment?", back: "Metric-driven automated canary and blue-green strategies with automatic rollback if analysis (error rate/latency) fails — instead of only rolling updates." },
        { front: "How do you roll back in GitOps?", back: "`git revert` the commit that made the change; the GitOps agent reconciles the cluster back to the previous state automatically, with a clean audit trail." },
        { front: "How do you handle secrets in a GitOps repo?", back: "Never commit raw Secrets. Use Sealed Secrets (encrypted, only the cluster can decrypt), an External Secrets Operator (Git holds a reference to Vault/cloud), or SOPS (encrypt values in-file)." },
      ],
      quiz: [
        { q: "How do you roll back a bad release in GitOps?", options: ["SSH into the servers", "git revert the offending commit and let the agent reconcile", "Delete the cluster", "Manually kubectl apply the old version"], answer: 1, explain: "Reverting the commit returns the desired state to the last known-good version; the GitOps agent syncs the cluster automatically." },
        { q: "Which is a safe way to manage secrets in a GitOps repo?", options: ["Commit base64-encoded Secrets", "Sealed Secrets or an External Secrets Operator", "Put them in the README", "Environment variables in CI logs"], answer: 1, explain: "Base64 isn't encryption; use Sealed Secrets or an external secrets operator so the repo only holds encrypted or referenced values." },
      ],
    },
  ],
};
