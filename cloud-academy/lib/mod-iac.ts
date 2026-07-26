import type { Module } from "./types";

export const iac: Module = {
  id: "iac",
  title: "IaC & DevOps",
  blurb:
    "Defining infrastructure as code, the tool landscape (CloudFormation, Bicep, Terraform) and state, and shipping changes safely with CI/CD.",
  accent: "iris",
  lessons: [
    {
      slug: "infrastructure-as-code",
      title: "Infrastructure as Code",
      summary:
        "Why you describe cloud infrastructure in version-controlled files instead of clicking through a console — and what that buys you.",
      minutes: 9,
      blocks: [
        { type: "p", text: "You *can* build cloud infrastructure by clicking through a web console. You shouldn't — not for anything real. **Infrastructure as Code (IaC)** means describing your resources (networks, servers, databases, permissions) in text files that you version, review, and apply automatically. The environment becomes reproducible instead of hand-crafted." },
        { type: "diagram", name: "iac-workflow", caption: "Write code → preview the plan → apply it. State lets the tool apply only the diff." },
        { type: "h2", text: "Declarative, not imperative" },
        { type: "p", text: "Good IaC is **declarative**: you describe the *desired end state* ('a network with these two subnets and this database'), and the tool figures out the steps to reach it. You don't write 'create this, then that' — you write what should exist, and the tool reconciles reality to match. This is the same desired-state idea behind Kubernetes and autoscaling." },
        { type: "h2", text: "What IaC buys you" },
        { type: "list", items: [
          "**Reproducibility** — spin up an identical staging or DR environment from the same files, no snowflakes.",
          "**Version control** — infrastructure lives in Git, so every change is diffed, reviewed in a pull request, and revertible.",
          "**Auditability** — the files *are* the documentation of what exists and why it changed.",
          "**Speed & safety** — automated applies replace error-prone manual clicking, and changes are previewed before they land.",
        ]},
        { type: "callout", kind: "key", text: "The core win: infrastructure becomes **software**. It's reviewed, tested, versioned, and reproducible — so environments are consistent and a mistake is a revert, not an outage-and-a-postmortem." },
        { type: "callout", kind: "warn", text: "Once you adopt IaC, stop making changes by hand in the console. Manual tweaks cause **drift** — the real world diverging from your code — which the next apply may silently undo or fight. The code must stay the single source of truth." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Infrastructure as Code (IaC)** = defining your cloud resources in version-controlled text files instead of clicking a console. **Declarative** = you state the desired end result; the tool works out the steps (vs **imperative** = you script each step). **Provision** = create a resource. **Snowflake** = a hand-tweaked, impossible-to-reproduce environment. **Drift** = the deployed reality diverging from what your code says. **Idempotent** = applying the same config repeatedly yields the same result." },
      ],
      takeaways: [
        "IaC describes cloud resources in version-controlled files instead of clicking a console — infrastructure becomes software.",
        "Good IaC is declarative: you state desired end state and the tool reconciles reality to match.",
        "It buys reproducibility, version control/review, auditability, and safe automated applies.",
        "Stop making manual console changes — they cause drift; the code stays the single source of truth.",
      ],
      flashcards: [
        { front: "What is Infrastructure as Code?", back: "Defining cloud resources in version-controlled text files that you review and apply automatically, making environments reproducible instead of hand-built." },
        { front: "Declarative vs imperative IaC", back: "Declarative describes the desired end state and lets the tool find the steps; imperative scripts each step. Good IaC is declarative — the same idea as Kubernetes desired state." },
        { front: "What is drift?", back: "When the deployed infrastructure diverges from what the code says — usually from manual console changes. The next apply may undo or fight it, so avoid out-of-band edits." },
      ],
      quiz: [
        { q: "What's the main advantage of declarative IaC over clicking in the console?", options: ["It's more colorful", "Reproducible, version-controlled, reviewable infrastructure the tool reconciles to a desired state", "It removes the need for a cloud account", "It only works on AWS"], answer: 1, explain: "Declarative IaC makes infrastructure reproducible and reviewable; you declare desired state and the tool makes reality match — a mistake becomes a revert." },
        { q: "Why avoid manual console changes once you use IaC?", options: ["They're slower to click", "They cause drift — reality diverging from the code, which the next apply may undo or fight", "The console is deprecated", "They cost extra"], answer: 1, explain: "Out-of-band edits create drift between the real environment and the code, breaking the single-source-of-truth guarantee IaC relies on." },
      ],
    },
    {
      slug: "iac-tools-and-state",
      title: "IaC tools & state",
      summary:
        "The provider-native tools (CloudFormation, ARM/Bicep) versus multi-cloud Terraform — and the all-important state file.",
      minutes: 9,
      blocks: [
        { type: "p", text: "There are two broad camps of IaC tools: the ones built by each cloud for its own resources, and the cloud-agnostic ones that work across providers. Which you pick depends mostly on whether you live in one cloud or several." },
        { type: "h2", text: "Provider-native" },
        { type: "list", items: [
          "**AWS CloudFormation** — AWS's native IaC, defining resources in JSON/YAML templates. Deep AWS integration, no extra tooling to install.",
          "**Azure ARM templates / Bicep** — Azure's native IaC. **Bicep** is a cleaner, more readable language that compiles down to ARM JSON.",
        ]},
        { type: "h2", text: "Cloud-agnostic" },
        { type: "p", text: "**Terraform** (by HashiCorp) is the dominant multi-cloud tool. You write in its **HCL** language and it manages resources across AWS, Azure, GCP, and hundreds of other providers through a plugin model. Its appeal is one workflow and one language for everything, plus a huge ecosystem. **Pulumi** is a similar idea using general-purpose programming languages." },
        { type: "compare", caption: "Native vs agnostic.", columns: ["", "Provider-native (CFN, Bicep)", "Agnostic (Terraform)"], rows: [
          { label: "Scope", cells: ["One cloud", "Many clouds & services"] },
          { label: "Integration", cells: ["Deepest with its cloud", "Broad via providers/plugins"] },
          { label: "Language", cells: ["YAML/JSON, Bicep", "HCL"] },
          { label: "Best when", cells: ["All-in on one cloud", "Multi-cloud or standard tooling"] },
        ]},
        { type: "h2", text: "The state file" },
        { type: "p", text: "Tools like Terraform keep a **state file** — a record of what they've created and how it maps to your code. State is what lets the tool compute the **diff** on each run: it compares your code to state to reality and applies only what changed, rather than recreating everything. It's also how **drift** is detected." },
        { type: "callout", kind: "warn", text: "State is sensitive and shared. Store it **remotely** (an S3 bucket / Azure Storage backend) with **locking** so two engineers can't apply at once and corrupt it — never commit it to Git, and treat it as secret because it can contain resource details." },
        { type: "h2", text: "Plan before apply" },
        { type: "p", text: "The golden workflow is **plan → apply**: `plan` shows a preview diff of exactly what will be created, changed, or destroyed; you review it (ideally in a pull request); then `apply` executes it. Reading the plan is your last chance to catch a change that would delete a database." },
        { type: "callout", kind: "key", text: "Pick native (CloudFormation/Bicep) when you're all-in on one cloud and want the deepest integration; pick Terraform when you're multi-cloud or want one standard workflow. Either way: remote, locked state and always review the plan." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**CloudFormation** = AWS's native IaC (YAML/JSON templates). **ARM / Bicep** = Azure's native IaC; Bicep is the cleaner language that compiles to ARM. **Terraform** = the leading multi-cloud IaC tool. **HCL** = HashiCorp Configuration Language, Terraform's syntax. **State file** = the tool's record of what it created, used to compute diffs and detect drift. **Backend** = where state is stored (e.g. S3). **Plan** = a preview of the changes an apply would make. **Locking** = preventing concurrent applies from corrupting shared state." },
      ],
      takeaways: [
        "Provider-native tools (CloudFormation, ARM/Bicep) integrate deepest with one cloud; Terraform is the multi-cloud standard.",
        "The state file records what the tool created, letting it apply only the diff and detect drift.",
        "Store state remotely with locking; never commit it to Git and treat it as secret.",
        "Always plan (preview the diff) before apply — it's your last chance to catch a destructive change.",
      ],
      flashcards: [
        { front: "CloudFormation/Bicep vs Terraform", back: "CloudFormation (AWS) and ARM/Bicep (Azure) are provider-native with deepest integration for one cloud. Terraform is cloud-agnostic (HCL) across many providers — pick it for multi-cloud or one standard workflow." },
        { front: "What is the Terraform state file for?", back: "It records what the tool created and how it maps to your code, so each run applies only the diff (create/change/destroy) and can detect drift. Store it remotely with locking." },
        { front: "Why plan before apply?", back: "Plan previews exactly what will be created, changed, or destroyed, so you can review it (in a PR) and catch a change that would delete something critical before it happens." },
      ],
      quiz: [
        { q: "You run workloads across AWS, Azure, and GCP and want one IaC workflow. Best fit?", options: ["CloudFormation", "ARM/Bicep", "Terraform", "Clicking each console"], answer: 2, explain: "Terraform is cloud-agnostic — one language (HCL) and workflow across many providers, ideal for multi-cloud." },
        { q: "Why must Terraform state be stored remotely with locking?", options: ["To make it public", "So concurrent applies don't corrupt the shared state, and it isn't committed to Git", "To speed up the plan", "It's not necessary"], answer: 1, explain: "State is shared and sensitive; remote backends with locking prevent concurrent-apply corruption and keep it out of source control." },
      ],
    },
    {
      slug: "cicd-for-the-cloud",
      title: "CI/CD for cloud deploys",
      summary:
        "Automating build, test, and deployment pipelines — plus the deployment strategies that let you ship without downtime.",
      minutes: 8,
      blocks: [
        { type: "p", text: "IaC describes *what* your infrastructure is; **CI/CD** is *how* changes to your code and infrastructure reach production — automatically, repeatably, and safely. It's the assembly line between a merged pull request and a running deployment." },
        { type: "h2", text: "CI and CD" },
        { type: "list", items: [
          "**CI (Continuous Integration)** — on every change, automatically build the app and run tests, so problems surface in minutes, not after release.",
          "**CD (Continuous Delivery/Deployment)** — automatically take a passing build through to a deployable (or deployed) state, removing slow, error-prone manual releases.",
        ]},
        { type: "p", text: "A typical cloud pipeline (GitHub Actions, GitLab CI, AWS CodePipeline, Azure DevOps) runs: **build → test → (terraform/CFN plan) → deploy to staging → deploy to production**, often with an approval gate before prod." },
        { type: "h2", text: "Deployment strategies" },
        { type: "p", text: "Shipping a new version without downtime is a solved problem — pick a strategy by how much risk you want to take on:" },
        { type: "compare", caption: "Ways to roll out a new version.", columns: ["Strategy", "How", "Trade-off"], rows: [
          { label: "Rolling", cells: ["Replace instances gradually", "Simple; brief version mix"] },
          { label: "Blue-green", cells: ["Stand up v2 alongside v1, switch traffic", "Instant rollback; double the resources briefly"] },
          { label: "Canary", cells: ["Send a small % to v2, watch, then ramp", "Safest; more orchestration"] },
        ]},
        { type: "h2", text: "Immutable infrastructure" },
        { type: "p", text: "The modern default is **immutable infrastructure**: you never patch a running server in place. To deploy a change you build a fresh image or container and replace the old instances entirely. This kills configuration drift and 'snowflake servers' and makes rollback as easy as redeploying the previous image." },
        { type: "callout", kind: "key", text: "CI/CD plus IaC is the DevOps core loop: a reviewed change merges, the pipeline builds and tests it, previews the infra plan, and rolls it out with a safe strategy — every deploy identical, automated, and revertible." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**CI (Continuous Integration)** = auto-build and test on every change. **CD (Continuous Delivery/Deployment)** = auto-progress a passing build toward/into production. **Pipeline** = the automated build→test→deploy sequence. **Blue-green** = run two environments and switch traffic for instant rollback. **Canary** = release to a small slice of users first, then ramp. **Rolling update** = replace instances gradually. **Immutable infrastructure** = replace servers with fresh images rather than patching them in place. **Approval gate** = a required manual sign-off step before a stage runs." },
      ],
      takeaways: [
        "CI auto-builds and tests every change; CD auto-progresses passing builds toward/into production.",
        "A cloud pipeline runs build → test → infra plan → staging → prod, often with an approval gate before prod.",
        "Deployment strategies trade risk for effort: rolling (simple), blue-green (instant rollback), canary (safest).",
        "Immutable infrastructure replaces servers with fresh images instead of patching in place — no drift, easy rollback.",
      ],
      flashcards: [
        { front: "CI vs CD", back: "CI (Continuous Integration) auto-builds and tests on every change so problems surface fast; CD (Continuous Delivery/Deployment) auto-progresses a passing build toward or into production." },
        { front: "Blue-green vs canary deployment", back: "Blue-green runs v2 alongside v1 and switches all traffic at once (instant rollback, double resources). Canary sends a small % to v2, watches, then ramps (safest, more orchestration)." },
        { front: "What is immutable infrastructure?", back: "Never patching a running server in place — you build a fresh image/container and replace old instances entirely, eliminating drift and making rollback a redeploy." },
      ],
      quiz: [
        { q: "Which deployment strategy gives the safest, most gradual rollout with early problem detection?", options: ["Rolling", "Blue-green", "Canary", "Recreate all at once"], answer: 2, explain: "Canary sends a small percentage of traffic to the new version, lets you watch metrics, then ramps up — catching problems before full exposure." },
        { q: "What does immutable infrastructure mean?", options: ["Servers can never be deleted", "You replace servers with fresh images instead of patching them in place", "Infrastructure that never changes", "Only the root user can deploy"], answer: 1, explain: "Immutable infra deploys by building a new image and replacing instances, which eliminates configuration drift and makes rollback a simple redeploy." },
      ],
    },
  ],
};
