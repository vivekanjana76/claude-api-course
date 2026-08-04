import type { Module } from "./types";

export const iac: Module = {
  id: "iac",
  title: "IaC, CI/CD & automation",
  blurb:
    "CloudFormation, CDK and Terraform; pipelines that deploy safely; and Systems Manager and Secrets Manager for the operational work that isn't a deploy.",
  accent: "iris",
  lessons: [
    {
      slug: "infrastructure-as-code",
      title: "Infrastructure as Code: CloudFormation, CDK & Terraform",
      summary:
        "Declarative infrastructure, the three tools you'll meet on AWS, state and drift, and the module structure that survives contact with a real organisation.",
      minutes: 12,
      blocks: [
        { type: "p", text: "**Infrastructure as Code** means your environments are defined in files under version control, reviewed in pull requests, and applied by automation. It's the difference between infrastructure you can rebuild and infrastructure you're afraid to touch." },
        { type: "diagram", name: "iac-workflow", caption: "Write, review, plan, apply — infrastructure changes go through the same discipline as code." },
        { type: "h2", text: "Why it matters more than it sounds" },
        { type: "list", items: [
          "**Reproducibility** — staging genuinely matches production because both come from the same source with different parameters.",
          "**Review** — a security engineer can object to an open security group *before* it exists, in a diff.",
          "**Disaster recovery** — rebuilding a region becomes an `apply` rather than an archaeology project.",
          "**Auditability** — `git log` answers who changed what and why, with a linked ticket.",
          "**Deletion** — tearing down a whole environment is one command, which is what makes ephemeral test environments practical.",
        ]},
        { type: "h2", text: "The three tools" },
        { type: "compare", caption: "What you'll actually encounter on AWS.", columns: ["", "CloudFormation", "CDK", "Terraform"], rows: [
          { label: "Language", cells: ["YAML/JSON", "TypeScript, Python, Java, Go, C#", "HCL"] },
          { label: "State", cells: ["Managed by AWS in the stack", "Same (it synthesises CloudFormation)", "A state file you must store and lock"] },
          { label: "Scope", cells: ["AWS only", "AWS only", "AWS + hundreds of other providers"] },
          { label: "Strengths", cells: ["No extra tooling, native rollback, StackSets", "Loops, conditionals, types, reusable constructs, unit tests", "Multi-cloud, huge module ecosystem, excellent `plan`"] },
          { label: "Weaknesses", cells: ["Verbose; YAML has no real abstraction", "Adds a build step and a synth to debug", "You own state storage, locking, and provider upgrades"] },
        ]},
        { type: "callout", kind: "key", text: "Industry reality: **Terraform is the most common choice in multi-team and multi-cloud organisations; CDK is loved by application teams who want real code; CloudFormation underpins both CDK and SAM and is what AWS Support speaks.** Knowing Terraform plus reading CloudFormation covers virtually every job posting." },
        { type: "h2", text: "CloudFormation concepts you must know" },
        { type: "list", items: [
          "**Stack** — a deployed instance of a template; deleting it deletes its resources.",
          "**Change set** — a preview of what an update will create, modify, or **replace**. Always read it; some property changes silently replace a database.",
          "**Nested stacks and cross-stack outputs** — how you split a large system into composable pieces.",
          "**StackSets** — deploy the same stack across many accounts and regions from the management account. The standard way to roll out baseline guardrails.",
          "**Drift detection** — reports where live resources no longer match the template.",
          "**Deletion policies** — `Retain` or `Snapshot` on stateful resources so a stack delete doesn't take the database with it.",
        ]},
        { type: "callout", kind: "warn", text: "**`UPDATE_ROLLBACK_FAILED` is the CloudFormation state everyone eventually meets.** It usually means a resource was changed outside the stack, so rollback can't reconcile. The fix is `continue-update-rollback` with the problem resources skipped — and then removing whatever caused the manual drift." },
        { type: "h2", text: "Terraform on AWS" },
        { type: "code", lang: "hcl", caption: "Remote state, a module, and a plan-first workflow", code: `terraform {
  required_version = ">= 1.11"      # use_lockfile below needs 1.10+
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }

  # Remote state with locking — never keep state on a laptop
  backend "s3" {
    bucket       = "acme-tfstate-111111111111"
    key          = "prod/network/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true          # S3-native locking (replaces the DynamoDB table)
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Environment = var.environment
      Owner       = var.owner
      ManagedBy   = "terraform"
      Repo        = "acme/infra"
    }
  }
}

module "vpc" {
  source = "../../modules/vpc"

  name            = "prod"
  cidr            = "10.10.0.0/16"
  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  private_subnets = ["10.10.32.0/20", "10.10.48.0/20", "10.10.64.0/20"]
  public_subnets  = ["10.10.0.0/20", "10.10.16.0/20"]

  enable_nat_gateway     = true
  one_nat_gateway_per_az = true      # resilience over a few dollars
}` },
        { type: "h2", text: "State: the thing that bites Terraform users" },
        { type: "list", items: [
          "**State maps your config to real resource IDs.** Lose it and Terraform will try to recreate everything it can no longer see.",
          "**Store it remotely** in S3 with versioning and encryption, and **enable locking** so two engineers can't apply simultaneously.",
          "**Split state by blast radius** — network, data, and application in separate state files. One enormous state file makes every change risky and every plan slow.",
          "**State contains secrets** (database passwords, generated keys) in plain text. Encrypt the bucket, restrict access tightly, and never commit state to Git.",
          "**`terraform import`** brings existing resources under management — essential when adopting IaC in a live account.",
        ]},
        { type: "h2", text: "Structuring a repository that scales" },
        { type: "code", lang: "text", caption: "A layout that works for real teams", code: `infra/
  modules/                    # reusable, versioned building blocks
    vpc/
    ecs-service/
    rds-postgres/
  live/
    prod/
      eu-west-1/
        network/              # own state
        data/                 # own state
        services/             # own state
    staging/
      eu-west-1/
        ...
  policies/                   # OPA/Sentinel or checkov rules
  .github/workflows/
    plan.yml                  # on PR: fmt, validate, tflint, checkov, plan
    apply.yml                 # on merge to main: apply with OIDC role` },
        { type: "callout", kind: "tip", text: "**Environments should differ only by variables**, never by copied-and-edited code. The moment staging has a hand-modified template, it stops being a valid rehearsal for production — and the difference will be discovered during an incident." },
        { type: "h2", text: "Drift, and how to keep it away" },
        { type: "steps", items: [
          { title: "Make console write access rare", text: "Read-only by default; write access through a break-glass role that alarms when used." },
          { title: "Run plan on a schedule", text: "A nightly `terraform plan` (or CloudFormation drift detection) that alerts on unexpected diffs catches drift within a day." },
          { title: "Import, don't recreate", text: "When something was made by hand, import it into state rather than deleting and re-creating it." },
          { title: "Tag ownership", text: "`ManagedBy = terraform` makes it obvious which resources should never be edited manually." },
          { title: "Policy-as-code in CI", text: "checkov, tfsec, or cfn-nag block insecure patterns — public buckets, open security groups, unencrypted volumes — before merge." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Declarative** = you describe the desired end state and the tool works out the steps. **State** = Terraform's record mapping config to real resource IDs. **Drift** = live infrastructure diverging from the code. **Plan / change set** = a preview of what will change before it happens. **Module** = a reusable, parameterised bundle of resources. **StackSet** = CloudFormation deploying one stack across many accounts and regions. **Idempotent** = applying twice gives the same result. **Policy as code** = automated rules that reject non-compliant infrastructure in CI." },
      ],
      takeaways: [
        "IaC buys reproducibility, review, disaster recovery, auditability, and cheap teardown.",
        "Terraform dominates multi-team/multi-cloud work; CDK suits app teams; CloudFormation underpins CDK and SAM.",
        "Always read the plan or change set — some property updates replace resources rather than modifying them.",
        "Terraform state must be remote, encrypted, locked, and split by blast radius; it contains secrets.",
        "Environments should differ only by variables, and drift is prevented by rare console writes plus scheduled plans.",
      ],
      flashcards: [
        { front: "Why must Terraform state be remote and locked?", back: "It maps config to real resource IDs and is shared by the team; without remote storage and locking, concurrent applies corrupt it and a lost state file makes Terraform try to recreate everything." },
        { front: "What is a CloudFormation change set?", back: "A preview of exactly what an update will add, modify, or replace — the safety check before applying, since some property changes trigger resource replacement." },
        { front: "What are StackSets for?", back: "Deploying the same CloudFormation stack across many accounts and regions from the management account — the standard way to roll out org-wide baselines." },
        { front: "How should environments differ in IaC?", back: "Only by variable values. Copied-and-edited templates mean staging stops being a valid rehearsal for production." },
      ],
      quiz: [
        { q: "Someone edits a security group in the console that Terraform manages. What happens on the next apply?", options: ["Terraform adopts the change", "Terraform reverts it to match the code", "The apply fails permanently", "Nothing"], answer: 1, explain: "Terraform reconciles reality to the declared state, so manual changes get reverted — which is why console writes on IaC-managed resources cause incidents." },
        { q: "Which is the biggest risk of one giant Terraform state file?", options: ["Slow plans and a large blast radius for every change", "It costs more", "It can't be encrypted", "Modules stop working"], answer: 0, explain: "Every change plans against everything, applies are slower and riskier, and one bad apply can affect unrelated systems. Split state by blast radius." },
        { q: "How do you bring an existing hand-made resource under Terraform management?", options: ["Delete and recreate it", "terraform import", "Edit the state file by hand", "Use a data source forever"], answer: 1, explain: "`terraform import` (or an import block) records the existing resource in state so it can be managed without destruction." },
      ],
    },
    {
      slug: "cicd-on-aws",
      title: "CI/CD pipelines & safe deployment",
      summary:
        "Building once and promoting, the AWS developer tools, GitHub Actions with OIDC, and the deployment strategies that make releases boring.",
      minutes: 11,
      blocks: [
        { type: "p", text: "A deployment pipeline is the only sanctioned path from commit to production. Its job is to make releases so routine that nobody schedules them for a Friday afternoon with a rollback plan written in Slack." },
        { type: "diagram", name: "cicd-pipeline", caption: "Source → build → test → approve → deploy, with the same artifact promoted through every environment." },
        { type: "h2", text: "The principles" },
        { type: "list", items: [
          "**Build once, promote the same artifact.** The image tested in staging is the exact image deployed to production — same digest, different configuration.",
          "**Everything through the pipeline.** No manual deploys, including 'just this one hotfix'.",
          "**Fast feedback.** Unit tests and linting in minutes; anything slower runs in parallel or later stages.",
          "**Automated rollback.** Tie deployments to alarms so a failing release reverts without a human decision at 2am.",
          "**Least privilege for the pipeline itself.** The deploy role is powerful — scope it per environment, and never let a PR from a fork assume it.",
        ]},
        { type: "h2", text: "The AWS developer tools" },
        { type: "compare", caption: "The native pipeline stack.", columns: ["Service", "Role"], rows: [
          { label: "CodeCommit", cells: ["Managed Git (closed to new customers — most teams use GitHub/GitLab)"] },
          { label: "CodeBuild", cells: ["Managed build runners driven by a buildspec.yml"] },
          { label: "CodeDeploy", cells: ["Deployment orchestration for EC2, ECS, and Lambda — blue/green and canary with alarm rollback"] },
          { label: "CodePipeline", cells: ["The workflow tying stages, approvals, and actions together"] },
          { label: "CodeArtifact", cells: ["Private package registry (npm, pip, Maven) with upstream caching"] },
          { label: "CodeCatalyst", cells: ["An all-in-one hosted dev environment and pipeline product"] },
        ]},
        { type: "callout", kind: "key", text: "Most teams in 2026 run **GitHub Actions or GitLab CI for build and test, authenticate to AWS with OIDC, and use CodeDeploy or Terraform for the deploy itself.** That combination gives you the ecosystem of a mainstream CI tool with AWS-native deployment safety — and no long-lived credentials anywhere." },
        { type: "code", lang: "yaml", caption: "A complete GitHub Actions deploy with no stored secrets", code: `name: deploy
on:
  push: { branches: [main] }

permissions:
  id-token: write      # request the OIDC token
  contents: read

env:
  AWS_REGION: eu-west-1
  ECR_REPO: 111111111111.dkr.ecr.eu-west-1.amazonaws.com/orders

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::111111111111:role/GitHubDeploy
          aws-region: \${{ env.AWS_REGION }}

      - uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push (immutable tag)
        run: |
          TAG=\${GITHUB_SHA::7}
          docker build --platform linux/arm64 -t $ECR_REPO:$TAG .
          docker push $ECR_REPO:$TAG
          echo "IMAGE=$ECR_REPO:$TAG" >> $GITHUB_ENV

      - name: Scan the image
        run: |
          aws ecr wait image-scan-complete --repository-name orders \\
            --image-id imageTag=\${GITHUB_SHA::7}

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster prod --service orders-api \\
            --force-new-deployment
          aws ecs wait services-stable --cluster prod --services orders-api` },
        { type: "h2", text: "Deployment strategies" },
        { type: "diagram", name: "deployment-strategies", caption: "Rolling, blue/green, and canary trade cost, speed, and blast radius." },
        { type: "compare", caption: "Choosing a release mechanism.", columns: ["Strategy", "How", "Rollback", "Cost"], rows: [
          { label: "Rolling", cells: ["Replace instances/tasks in batches", "Roll forward or redeploy the old version — slow", "Cheap"] },
          { label: "Blue/green", cells: ["Stand up a full new environment, switch traffic", "Instant — switch back", "~2× briefly"] },
          { label: "Canary", cells: ["Shift 5–10% of traffic, watch, then ramp", "Instant, and only a fraction was exposed", "Small overhead"] },
          { label: "Feature flags", cells: ["Deploy dark, enable per-user or per-cohort", "Toggle off, no deploy needed", "Complexity in code"] },
        ]},
        { type: "callout", kind: "warn", text: "Every one of these depends on **health checks and alarms that actually fail when the app is broken**. A canary with an endpoint that returns 200 whether or not the database is reachable will happily promote a broken release to 100%. Automated rollback is only as good as the signal it watches." },
        { type: "h2", text: "Database changes: the hard part" },
        { type: "p", text: "Code rolls back; schema migrations usually don't. The standard discipline is **expand/contract**: deploy a backwards-compatible schema change first (add the nullable column), then the code that uses it, then — in a later release, once rollback is no longer needed — remove the old path. Never combine a destructive migration with the deploy that depends on it." },
        { type: "h2", text: "A pipeline that reflects real practice" },
        { type: "steps", items: [
          { title: "On pull request", text: "Lint, unit tests, `terraform plan`, policy checks (checkov/tfsec), dependency and container scanning. Nothing deploys." },
          { title: "On merge to main", text: "Build the artifact once, tag it with the commit SHA, push to ECR/CodeArtifact, and record provenance." },
          { title: "Deploy to staging automatically", text: "Then run integration and smoke tests against the real environment." },
          { title: "Promote to production", text: "Manual approval or fully automated on green checks; canary or blue/green traffic shifting with alarms attached." },
          { title: "Verify and watch", text: "Post-deploy smoke tests, then an automatic rollback window where CloudWatch alarms can revert the release." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Artifact** = the built, versioned thing you deploy (a container image, a zip). **Promotion** = moving that same artifact to the next environment. **buildspec.yml** = CodeBuild's build definition file. **OIDC federation** = authenticating CI to AWS with a short-lived signed token instead of stored keys. **Canary** = releasing to a small share of traffic first. **Expand/contract** = a two-phase migration pattern keeping schema changes backwards compatible. **Provenance** = a verifiable record of how an artifact was built." },
      ],
      takeaways: [
        "Build the artifact once and promote it; environments differ by configuration, never by rebuild.",
        "GitHub Actions/GitLab CI with OIDC into AWS plus CodeDeploy or Terraform is the mainstream pattern.",
        "Rolling is cheap, blue/green rolls back instantly, canary limits blast radius, feature flags decouple release from deploy.",
        "Automated rollback is only as good as the health checks and alarms it watches.",
        "Use expand/contract for schema changes — migrations don't roll back the way code does.",
      ],
      flashcards: [
        { front: "Why build once and promote?", back: "So the artifact tested in staging is bit-for-bit what runs in production. Rebuilding per environment can introduce differences that testing never covered." },
        { front: "How should CI authenticate to AWS?", back: "OIDC federation with a role whose trust policy pins the repo and branch — no long-lived access keys stored in the CI system." },
        { front: "What is expand/contract?", back: "A schema migration pattern: deploy a backwards-compatible change, then the code using it, then remove the old path in a later release — so any single deploy can roll back." },
        { front: "When is blue/green worth the cost?", back: "When you need instant rollback and can afford roughly double capacity briefly — typically for user-facing production services." },
      ],
      quiz: [
        { q: "A canary deployment promoted a broken release to 100%. Most likely cause?", options: ["The canary percentage was too low", "The health check/alarms didn't detect the failure", "Blue/green would have prevented it", "The artifact was rebuilt"], answer: 1, explain: "Progressive delivery relies entirely on the signal. A health endpoint that returns 200 regardless of dependencies makes rollback automation useless." },
        { q: "Which pairing is the most common modern AWS CI/CD setup?", options: ["CodeCommit + CodePipeline only", "GitHub Actions with OIDC + CodeDeploy/Terraform", "Manual console deploys", "Jenkins with stored access keys"], answer: 1, explain: "Mainstream CI tooling for build/test, OIDC for credential-free AWS access, and AWS-native deployment services for safe traffic shifting." },
        { q: "Why are database migrations riskier than code deploys?", options: ["They take longer", "They usually can't be rolled back, so the code rollback path breaks", "They need more CPU", "They can't be automated"], answer: 1, explain: "Dropping a column or changing a type is destructive. Expand/contract keeps each deploy independently reversible." },
      ],
    },
    {
      slug: "systems-manager-and-secrets",
      title: "Systems Manager, Parameter Store & Secrets Manager",
      summary:
        "Fleet management without SSH, configuration and secrets done properly, and the automation that handles the operational work between deploys.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Not every operational task is a deployment. Patching, running a command across a fleet, storing configuration, rotating credentials, and executing runbooks are daily work — and **AWS Systems Manager (SSM)** is the toolbox for all of it." },
        { type: "h2", text: "The Systems Manager capabilities that matter" },
        { type: "compare", caption: "SSM is many tools under one name.", columns: ["Capability", "What it does", "Why you'll use it"], rows: [
          { label: "Session Manager", cells: ["Browser or CLI shell into an instance via the SSM agent", "No SSH keys, no bastion, no port 22 — every session logged"] },
          { label: "Run Command", cells: ["Execute a script across many instances by tag", "Fleet-wide operations without a config management tool"] },
          { label: "Patch Manager", cells: ["Scan and install OS patches on a schedule with maintenance windows", "Demonstrable patch compliance for auditors"] },
          { label: "Parameter Store", cells: ["Hierarchical config and secret storage", "Application configuration, free for standard parameters"] },
          { label: "Automation", cells: ["Multi-step runbooks with approvals", "Codifying 'the thing we do when X happens'"] },
          { label: "State Manager", cells: ["Enforces a desired configuration continuously", "Keeping agents installed and settings correct"] },
          { label: "Inventory & Fleet Manager", cells: ["What software is on every instance", "Answering 'are we exposed to this CVE?' in minutes"] },
        ]},
        { type: "code", lang: "bash", caption: "Fleet operations without SSH", code: `# patch every production instance during the maintenance window
aws ssm send-command \\
  --document-name "AWS-RunPatchBaseline" \\
  --targets "Key=tag:Environment,Values=prod" \\
  --parameters "Operation=Install" \\
  --max-concurrency "10%" --max-errors "5%"

# interactive shell, fully audited, no inbound ports
aws ssm start-session --target i-0abc123

# which instances are missing the agent (and therefore invisible)?
aws ssm describe-instance-information \\
  --query "InstanceInformationList[].{ID:InstanceId,Ping:PingStatus,Agent:AgentVersion}" \\
  --output table` },
        { type: "h2", text: "Parameter Store vs Secrets Manager" },
        { type: "compare", caption: "Both store values; they solve different problems.", columns: ["", "Parameter Store", "Secrets Manager"], rows: [
          { label: "Cost", cells: ["Standard parameters free; advanced ~$0.05/month", "~$0.40 per secret per month plus API calls"] },
          { label: "Rotation", cells: ["None built in", "Automatic rotation with Lambda, native for RDS/Redshift/DocumentDB"] },
          { label: "Size", cells: ["4 KB standard, 8 KB advanced", "64 KB"] },
          { label: "Cross-account / replication", cells: ["Limited", "Resource policies and multi-region replication"] },
          { label: "Use for", cells: ["Config, feature flags, ARNs, non-rotating values, SecureString secrets on a budget", "Database credentials, API keys, anything requiring rotation or sharing"] },
        ]},
        { type: "callout", kind: "key", text: "Practical rule: **configuration and low-risk values in Parameter Store; anything that must rotate or be shared across accounts in Secrets Manager.** Both integrate directly with ECS task definitions, Lambda, and CloudFormation — so applications never need a secret in an environment variable you set by hand." },
        { type: "code", lang: "python", caption: "Fetching config and secrets at runtime", code: `import boto3, json
from functools import lru_cache

ssm = boto3.client("ssm")
sm = boto3.client("secretsmanager")

@lru_cache(maxsize=32)                     # cache: these are billed per call
def get_param(name: str, decrypt: bool = True) -> str:
    return ssm.get_parameter(Name=name, WithDecryption=decrypt)["Parameter"]["Value"]

@lru_cache(maxsize=8)
def get_secret(name: str) -> dict:
    return json.loads(sm.get_secret_value(SecretId=name)["SecretString"])

LOG_LEVEL = get_param("/orders/prod/log-level")
db = get_secret("prod/orders/db")          # {"username": ..., "password": ...}` },
        { type: "callout", kind: "warn", text: "Two habits worth building: **cache parameter and secret reads** (both are billed per API call and a hot Lambda can generate thousands per minute), and **never log the value**. A secret printed once into CloudWatch Logs is a secret you must now rotate and audit." },
        { type: "h2", text: "Rotation, properly" },
        { type: "steps", items: [
          { title: "Enable rotation on the secret", text: "For RDS, Secrets Manager provides the rotation Lambda; for others you supply one implementing the four-step contract." },
          { title: "Use the multi-user strategy where possible", text: "Two alternating database users mean rotation never leaves a window where the old credential is invalid and the new one isn't live yet." },
          { title: "Make applications fetch, not cache forever", text: "Refresh on a TTL or on an authentication failure so a rotated credential is picked up without a restart." },
          { title: "Alarm on rotation failure", text: "A silently failed rotation leaves you with a credential everyone believes has changed." },
          { title: "Prefer no secret at all", text: "IAM database authentication for RDS/Aurora removes the password entirely — the best secret is the one that doesn't exist." },
        ]},
        { type: "h2", text: "AppConfig: configuration as a deployable" },
        { type: "p", text: "**AWS AppConfig** (part of Systems Manager) treats configuration and feature flags as something you *deploy* — with validation, gradual rollout, and automatic rollback on a CloudWatch alarm. It's the right home for values that change more often than code: rate limits, feature toggles, and behavioural switches. Changing a flag becomes a controlled release rather than an edit somebody makes in the console." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**SSM agent** = the daemon on an instance that lets Systems Manager manage it; no agent means the instance is invisible to SSM. **Maintenance window** = a scheduled period when disruptive operations are allowed. **SecureString** = a Parameter Store value encrypted with KMS. **Rotation** = automatically replacing a credential on a schedule. **Runbook / Automation document** = codified multi-step operational procedure. **Feature flag** = a switch that changes behaviour without deploying code. **IAM database authentication** = connecting to RDS with an IAM-generated token instead of a password." },
        { type: "h2", text: "What good operational automation looks like" },
        { type: "list", items: [
          "**No SSH keys anywhere** — Session Manager for access, with session logs in S3 and CloudTrail.",
          "**Patching on a schedule** with maintenance windows and a compliance report you can show an auditor.",
          "**Every secret in Secrets Manager with rotation**, referenced by ARN from task definitions and functions.",
          "**Runbooks as Automation documents** so the 3am procedure is executable, reviewed, and identical every time.",
          "**Golden AMIs built by a pipeline** (Image Builder or Packer) rather than instances patched in place forever.",
        ]},
      ],
      takeaways: [
        "Systems Manager covers shell access, fleet commands, patching, inventory, runbooks, and configuration.",
        "Session Manager removes SSH keys, bastions, and inbound ports while logging every session.",
        "Parameter Store for configuration and cheap secrets; Secrets Manager when rotation or cross-account sharing is needed.",
        "Cache parameter/secret lookups, never log values, and prefer IAM database authentication over passwords.",
        "AppConfig makes configuration and feature flags a validated, gradually rolled-out, automatically rolled-back deployment.",
      ],
      flashcards: [
        { front: "Parameter Store or Secrets Manager?", back: "Parameter Store for configuration and low-risk values (standard tier is free). Secrets Manager when you need automatic rotation, larger values, or cross-account/multi-region sharing." },
        { front: "What does Session Manager replace?", back: "SSH keys, bastion hosts, and inbound port 22 — access is authorised by IAM and every session is logged to CloudTrail and optionally S3." },
        { front: "Why use the multi-user rotation strategy?", back: "Two alternating database users mean there's never a window where the old credential has been invalidated but the new one isn't in use yet." },
        { front: "What is AWS AppConfig for?", back: "Deploying configuration and feature flags with validation, gradual rollout, and automatic rollback on a CloudWatch alarm — configuration treated as a release." },
      ],
      quiz: [
        { q: "An auditor asks who accessed a production instance and what they ran. Where do you look?", options: ["The SSH logs on the host", "Session Manager logs in CloudTrail/S3", "The security group", "The AMI"], answer: 1, explain: "Session Manager records session activity to CloudTrail and optionally S3/CloudWatch Logs, which is precisely why it replaces SSH in regulated environments." },
        { q: "A Lambda's bill is dominated by Secrets Manager API calls. What's the fix?", options: ["Move the secret to an env var", "Cache the secret in the init phase with a TTL refresh", "Disable rotation", "Use a bigger memory setting"], answer: 1, explain: "Fetch once during initialisation and refresh on a TTL or auth failure — putting the secret in a plaintext environment variable trades cost for a security problem." },
        { q: "Which removes the database password entirely for RDS?", options: ["Parameter Store SecureString", "IAM database authentication", "A longer password", "KMS encryption"], answer: 1, explain: "IAM database authentication issues short-lived connection tokens from IAM, so there's no stored password to rotate or leak." },
      ],
    },
  ],
};
