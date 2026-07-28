import type { Module } from "./types";

export const foundations: Module = {
  id: "foundations",
  title: "AWS Foundations",
  blurb:
    "What AWS actually is, how its global infrastructure is laid out, how accounts and billing work, and the four ways you'll drive it every day.",
  accent: "iris",
  lessons: [
    {
      slug: "what-is-aws",
      title: "What is AWS, and why does everyone use it?",
      summary:
        "The world's largest cloud provider explained from first principles — what you're actually renting, why it won, and how to find your way around 200+ services.",
      minutes: 9,
      blocks: [
        { type: "p", text: "**Amazon Web Services (AWS)** is a collection of on-demand infrastructure and platform services you rent over the internet, billed by the second, gigabyte, or request. Instead of buying servers and racking them in a building you pay for, you call an API and a server exists a minute later — and you can delete it just as fast." },
        { type: "callout", kind: "key", text: "AWS's core promise: **any infrastructure, in minutes, with no up-front cost, in 30+ countries, with an API in front of everything.** Everything else in this course is a variation on that theme." },
        { type: "h2", text: "A one-paragraph history that explains the culture" },
        { type: "p", text: "Amazon built internal services so its own teams could ship without waiting on a central ops group, then in 2006 sold them to the public: **S3** (object storage) in March, **EC2** (virtual servers) in August. Nearly twenty years later AWS runs several hundred services and is the largest cloud provider by revenue. The lineage matters: AWS services are built as **API-first primitives** that compose, not as a single integrated product. That's why there are three ways to run a container and five ways to store a file." },
        { type: "diagram", name: "aws-service-map", caption: "The catalog is enormous, but a cloud engineer lives in six neighbourhoods." },
        { type: "h2", text: "What you're actually renting" },
        { type: "list", items: [
          "**Compute** — virtual machines (EC2), containers (ECS/EKS), functions (Lambda). Anything that executes code.",
          "**Storage** — objects (S3), block disks (EBS), shared file systems (EFS), archives (Glacier).",
          "**Networking** — private networks (VPC), DNS (Route 53), CDN (CloudFront), load balancers (ELB).",
          "**Databases** — relational (RDS, Aurora), key-value (DynamoDB), cache (ElastiCache), warehouse (Redshift).",
          "**Identity & security** — IAM, KMS, Secrets Manager, GuardDuty. The layer that decides who can do what.",
          "**Operations** — CloudWatch, CloudTrail, CloudFormation, Systems Manager. How you observe, audit, and automate the rest.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**On-premises (on-prem)** = servers you own, in a building you pay for — the thing cloud replaces. **Provision** = create a resource ready to use. **API** (Application Programming Interface) = a defined way for one program to ask another to do something; every AWS action is an API call, even when you click a button. **Primitive** = a small, single-purpose building block you combine with others. **Managed service** = something AWS operates for you (patching, backups, failover) so you only configure and use it. **Region** = a geographic cluster of AWS data centers, e.g. `us-east-1`."},
        { type: "h2", text: "Why teams choose AWS" },
        { type: "compare", caption: "The four arguments you'll hear in every architecture meeting.", columns: ["Driver", "What it means in practice"], rows: [
          { label: "Speed", cells: ["A new environment is a script, not a purchase order. Ideas get tested in hours."] },
          { label: "Elasticity", cells: ["Scale to Black Friday traffic and back down the same night; pay only for the peak you actually used."] },
          { label: "Breadth", cells: ["Managed databases, queues, ML, analytics — you assemble rather than build and operate from scratch."] },
          { label: "Reach", cells: ["Deploy to Sydney, São Paulo, and Frankfurt from one console without owning a single building."] },
        ]},
        { type: "h2", text: "The honest trade-offs" },
        { type: "list", items: [
          "**Cost is not automatic.** Cloud is cheaper only if you turn things off, rightsize, and commit where usage is steady. Idle resources bill happily forever.",
          "**Complexity moves, it doesn't vanish.** You stop patching hypervisors and start managing IAM policies, VPC routing, and Terraform state.",
          "**Lock-in is real but priced.** Deep managed services (DynamoDB, Lambda, Step Functions) buy speed today and cost effort to leave later. That's a decision, not a mistake.",
          "**The shared responsibility line is yours to know.** AWS secures the cloud; misconfiguring what you put in it is the #1 cause of breaches.",
        ]},
        { type: "callout", kind: "warn", text: "Beginner trap: assuming a service is 'managed' means 'safe by default'. RDS still needs a private subnet, S3 still needs Block Public Access, and IAM still needs least privilege. Managed removes toil, not responsibility." },
        { type: "h2", text: "How to navigate 200+ services without drowning" },
        { type: "p", text: "You do not need to know every service. For a Cloud Engineer role, roughly **35 services cover 95% of real work** — and this course is built around exactly those. When you meet an unfamiliar one, ask three questions: *what problem category is it in? what does it replace that I'd otherwise run myself? what does it cost per unit?* That's usually enough to place it." },
        { type: "quote", text: "There is no compression algorithm for experience — but there is one for services: learn the primitive, and the wrappers explain themselves.", cite: "A useful way to read the AWS catalog" },
      ],
      takeaways: [
        "AWS rents compute, storage, networking, databases, identity, and operations tooling as API-first primitives.",
        "It launched in 2006 with S3 and EC2 and is now the largest cloud provider; its services compose rather than integrate.",
        "The value is speed, elasticity, breadth, and global reach — but cost control and configuration security stay your job.",
        "About 35 services cover the vast majority of a cloud engineer's day; you don't need the whole catalog.",
      ],
      flashcards: [
        { front: "What were the first two AWS services?", back: "S3 (object storage) and EC2 (virtual servers), both launched in 2006." },
        { front: "Name the six service categories a cloud engineer lives in", back: "Compute, storage, networking, databases, identity/security, and operations (observability + IaC)." },
        { front: "Does 'managed service' mean 'secure by default'?", back: "No. AWS handles the service internals, but you still own configuration: network placement, IAM, encryption, and public access settings." },
      ],
      quiz: [
        { q: "Which statement best describes AWS's design philosophy?", options: ["One integrated product with a single console workflow", "API-first primitives that compose into architectures", "A managed Kubernetes distribution", "A SaaS suite for business users"], answer: 1, explain: "AWS grew from internal building blocks and ships composable, API-first primitives — which is why there are several valid ways to solve most problems." },
        { q: "A team moves to AWS and their bill goes up. What's the most likely cause?", options: ["AWS is inherently more expensive than on-prem", "They left resources running and never rightsized or committed", "They used too few services", "Regions are billed per account"], answer: 1, explain: "Cloud savings come from elasticity and commitment discipline. Lift-and-shift with always-on, oversized resources usually costs more than it should." },
      ],
    },
    {
      slug: "global-infrastructure",
      title: "Global infrastructure: Regions, AZs & the edge",
      summary:
        "Regions, Availability Zones, Local Zones, Outposts and 600+ edge locations — the physical geography that decides your latency, resilience, and compliance story.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Every architectural decision you make on AWS eventually touches geography. Where a resource physically runs determines how fast it answers, what survives a failure, what it costs, and which laws apply to the data." },
        { type: "diagram", name: "regions-az", caption: "A Region contains multiple isolated Availability Zones; each AZ is one or more discrete data centers." },
        { type: "h2", text: "Regions" },
        { type: "p", text: "A **Region** is a named geographic area containing multiple data centers — `us-east-1` (N. Virginia), `eu-west-1` (Ireland), `ap-south-1` (Mumbai). Regions are **fully isolated from each other by design**: nothing replicates between them unless you explicitly configure it. You choose a region on four criteria:" },
        { type: "list", ordered: true, items: [
          "**Latency** — closer to your users means faster responses. Roughly 1 ms per 100 km of fibre, plus hops.",
          "**Compliance / data residency** — GDPR, national data laws, and customer contracts often pin data to a country.",
          "**Service availability** — new services launch in `us-east-1` first and reach smaller regions later, sometimes years later.",
          "**Cost** — the same instance can differ 10–40% between regions; `us-east-1` is usually the cheapest.",
        ]},
        { type: "callout", kind: "tip", text: "`us-east-1` is special: it's the oldest and largest region, the home of global services' control planes (IAM, CloudFront, Route 53, billing), and the place ACM certificates for CloudFront must live. It's also, statistically, the region with the most famous outages." },
        { type: "h2", text: "Availability Zones" },
        { type: "p", text: "Each region has **two or more Availability Zones (AZs)** — one or more discrete data centers with independent power, cooling, and physical security, far enough apart to avoid a shared disaster but close enough (typically under 100 km) for single-digit-millisecond, high-bandwidth private links between them." },
        { type: "callout", kind: "key", text: "A Region is a city. An AZ is a separate building in that city with its own generator. **Deploying across at least two AZs is the single highest-value resilience decision you will make**, and it is usually nearly free." },
        { type: "p", text: "AZ names are **per-account randomised**: your `us-east-1a` is probably not my `us-east-1a`. If you need to reason about the same physical zone across accounts, use the **AZ ID** (`use1-az4`), which is consistent everywhere." },
        { type: "h2", text: "Everything else on the map" },
        { type: "compare", caption: "Beyond the standard region/AZ pair.", columns: ["Construct", "What it is", "Reach for it when"], rows: [
          { label: "Edge locations", cells: ["600+ small PoPs running CloudFront, Route 53, and edge security", "You want static/dynamic content cached close to users worldwide"] },
          { label: "Local Zones", cells: ["A region extension placed in a metro area", "You need single-digit-ms latency in a city with no full region (media, gaming)"] },
          { label: "Wavelength Zones", cells: ["AWS compute inside 5G carrier networks", "Ultra-low-latency mobile apps (AR, connected vehicles)"] },
          { label: "Outposts", cells: ["Physical AWS racks installed in your own data center", "Data must never leave your building but you want the AWS API"] },
          { label: "AWS Regions (GovCloud / China)", cells: ["Separately operated partitions with their own accounts", "Regulated US government or mainland China workloads"] },
        ]},
        { type: "h2", text: "Scope: global, regional, or zonal" },
        { type: "p", text: "Knowing a service's **scope** prevents a whole class of confusing bugs — like wondering why the security group you just made isn't visible, when you're simply in the wrong region." },
        { type: "compare", caption: "Where a resource actually lives.", columns: ["Scope", "Examples", "Consequence"], rows: [
          { label: "Global", cells: ["IAM, Route 53, CloudFront, WAF (for CF), Organizations", "One namespace across all regions; console shows them region-independent"] },
          { label: "Regional", cells: ["S3 buckets, VPCs, RDS, Lambda, DynamoDB tables", "Created in one region; invisible from others unless you replicate"] },
          { label: "Zonal", cells: ["EC2 instances, EBS volumes, subnets, NAT gateways", "Tied to one AZ — losing that AZ loses the resource"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Latency** = the delay between a request and its response, measured in milliseconds. **PoP** (Point of Presence) = a small edge site holding caches, not full services. **Data residency** = a legal requirement that data physically stays inside a country/region. **Control plane** = the APIs that create and configure resources; **data plane** = the part that serves your actual traffic. Control planes fail more often than data planes, which is why running instances often survive a region's API outage. **Blast radius** = how much breaks when one thing fails." },
        { type: "callout", kind: "warn", text: "A single-AZ deployment works perfectly in every demo and fails in the one hour that matters. Subnets are zonal: creating one subnet means one AZ. Always create at least two, in different AZs, from the very first VPC you build." },
        { type: "h2", text: "Practical region strategy" },
        { type: "steps", items: [
          { title: "Pick a primary region", text: "Nearest to your users that has the services you need and satisfies compliance. Standardise on it." },
          { title: "Use ≥2 AZs everywhere", text: "Subnets, ASGs, RDS Multi-AZ, ELB target groups — all spread by default. This is your everyday resilience." },
          { title: "Add a second region only for real requirements", text: "Multi-region doubles operational complexity: data replication, failover testing, IAM and pipeline duplication. Do it for regulated DR or genuinely global latency, not for a feeling of safety." },
          { title: "Push static content to the edge", text: "CloudFront in front of S3/ALB gives most of the global-latency win for a fraction of multi-region cost." },
        ]},
      ],
      takeaways: [
        "Regions are isolated geographic areas; nothing crosses between them unless you configure it.",
        "AZs are independent data centers inside a region — spanning two or more is the cheapest resilience you can buy.",
        "AZ letters are randomised per account; use AZ IDs (use1-az4) to compare across accounts.",
        "Know each resource's scope — global, regional, or zonal — before you design for failure.",
        "Edge locations, Local Zones, Wavelength, and Outposts extend AWS beyond the standard region model.",
      ],
      flashcards: [
        { front: "Region vs Availability Zone", back: "A Region is a geographic area (a city); an AZ is an isolated data center within it (a building with its own power). Regions are isolated from each other; AZs are linked by fast private fibre." },
        { front: "Why can't you compare us-east-1a between two accounts?", back: "AZ letters are randomised per account. Use the AZ ID (e.g. use1-az4), which maps to the same physical zone in every account." },
        { front: "What makes us-east-1 special?", back: "Oldest/largest region, hosts control planes for global services (IAM, CloudFront, Route 53, billing), gets new services first, and CloudFront ACM certificates must be issued there." },
        { front: "When do you need Outposts?", back: "When data must stay physically inside your own facility but you still want AWS APIs and services — AWS ships racks you host on-prem." },
      ],
      quiz: [
        { q: "You create a security group and can't find it later. What is the most likely cause?", options: ["It was deleted automatically", "You're looking in a different region", "Security groups are zonal", "It needs an IAM policy to appear"], answer: 1, explain: "VPCs and security groups are regional resources. The console shows only the currently selected region — the classic 'where did my resource go' moment." },
        { q: "Which gives the biggest resilience improvement for the least cost?", options: ["A second region with active/active traffic", "Spreading across two Availability Zones", "A larger instance type", "Enabling CloudFront"], answer: 1, explain: "Multi-AZ protects against data-center-level failure and is usually near-free, while multi-region multiplies complexity and cost." },
        { q: "A workload needs single-digit-millisecond latency in a metro with no AWS region. What fits best?", options: ["Outposts", "Local Zones", "A second Region", "Wavelength Zone"], answer: 1, explain: "Local Zones place compute and storage in metro areas as an extension of a parent region. Wavelength is specifically inside 5G carrier networks; Outposts is for your own data center." },
      ],
    },
    {
      slug: "accounts-and-organizations",
      title: "Accounts, Organizations & the multi-account model",
      summary:
        "The AWS account is your billing boundary, blast radius, and security perimeter — how to set the first one up safely and why real companies run dozens.",
      minutes: 10,
      blocks: [
        { type: "p", text: "An **AWS account** is not a login. It's an isolated container with its own resources, its own IAM, and its own bill. Understanding the account as a *boundary* is what separates hobby AWS from professional AWS." },
        { type: "h2", text: "The root user, and the first ten minutes" },
        { type: "p", text: "Creating an account produces a **root user** — the email address you signed up with. Root can do absolutely anything, including closing the account and changing billing, and **cannot be restricted by IAM policies or SCPs**. Treat it like the key to a safe deposit box." },
        { type: "steps", items: [
          { title: "Turn on MFA for root", text: "A hardware key or authenticator app. This is the single most important security action in any AWS account." },
          { title: "Stop using root", text: "Create an admin identity in IAM Identity Center (or an IAM user with AdministratorAccess) and use it for daily work." },
          { title: "Delete root access keys", text: "Root should have no programmatic access keys at all. If any exist, remove them." },
          { title: "Set a billing alarm and a Budget", text: "A $10 alarm on day one has saved more students than any other tip in this course." },
          { title: "Fill in alternate contacts", text: "Billing, operations, and security contacts so AWS reaches a team, not one person who left." },
        ]},
        { type: "callout", kind: "warn", text: "There are exactly a handful of tasks that *require* root: closing the account, changing the account name/email, changing support plan, restoring an accidentally-deleted S3 bucket policy that locked everyone out, and a few registrar tasks. Everything else should be done by an IAM role." },
        { type: "h2", text: "Why one account is never enough" },
        { type: "p", text: "Everything inside an account can potentially reach everything else, one bill covers it all, and service quotas are per account. Put production and a developer's experiments in the same account and you've merged their blast radii, their limits, and their cost reporting." },
        { type: "diagram", name: "multi-account-org", caption: "An AWS Organization: a management account, Organizational Units, and SCP guardrails over member accounts." },
        { type: "h2", text: "AWS Organizations" },
        { type: "list", items: [
          "**Management account** (formerly 'master') — creates the org, pays the consolidated bill, and should hold *no workloads*.",
          "**Member accounts** — one per workload/environment boundary, e.g. `payments-prod`, `payments-dev`, `shared-networking`.",
          "**Organizational Units (OUs)** — folders grouping accounts so policies apply to a whole class at once.",
          "**Service Control Policies (SCPs)** — guardrails setting the *maximum* permissions any principal in those accounts can ever have. An SCP never grants access; it only limits it.",
          "**Consolidated billing** — one invoice, and volume/Savings Plan discounts pooled across every account.",
        ]},
        { type: "callout", kind: "key", text: "**SCPs bound what IAM can grant.** Effective permission = (what IAM allows) ∩ (what the SCP allows). Even an account's own administrator cannot exceed the SCP — which is exactly why SCPs are how you stop `prod` from being deleted or `eu-only` accounts from launching in Ohio." },
        { type: "h2", text: "A sane starting structure" },
        { type: "compare", caption: "The layout most organisations converge on.", columns: ["OU", "Accounts inside", "Purpose"], rows: [
          { label: "Security", cells: ["log-archive, audit/security-tooling", "Immutable CloudTrail/Config logs; read-only cross-account security access"] },
          { label: "Infrastructure", cells: ["shared-networking, shared-services", "Transit Gateway, DNS, golden AMIs, CI/CD runners"] },
          { label: "Workloads", cells: ["app-prod, app-staging, app-dev (per app)", "The actual applications, isolated by environment"] },
          { label: "Sandbox", cells: ["per-engineer accounts", "Free experimentation under tight SCPs and low budgets"] },
          { label: "Suspended", cells: ["decommissioned accounts", "Deny-all SCP while data retention runs out"] },
        ]},
        { type: "h2", text: "Control Tower & Landing Zones" },
        { type: "p", text: "**AWS Control Tower** automates the above: it sets up Organizations, an account factory, baseline SCPs (\"guardrails\"), centralized logging, and IAM Identity Center in one workflow. The resulting environment is called a **landing zone**. If you're standing up a new company on AWS today, Control Tower is the default answer; large orgs sometimes build their own landing zone with Terraform for more control." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Blast radius** = how much is affected when something goes wrong; accounts are the strongest blast-radius boundary AWS offers. **Guardrail** = a preventive (SCP) or detective (Config rule) control applied broadly so teams can move fast safely. **Service quota / limit** = a per-account, per-region cap on how many of a thing you can create; many are raisable via a support ticket. **Consolidated billing** = combining member-account usage onto one invoice so volume discounts apply across the whole org. **Principal** = whoever is making a request — a user, a role, or a service." },
        { type: "h2", text: "Account-level hygiene worth knowing" },
        { type: "list", items: [
          "**Service quotas are per account per region.** 'We can't launch more instances' is more often a quota than a capacity problem — check Service Quotas first.",
          "**Tag from day one.** `Environment`, `Owner`, `CostCenter`, `Application`. Retro-tagging thousands of resources is nobody's favourite quarter.",
          "**Enable CloudTrail org-wide** into the log-archive account so audit history survives even if a workload account is compromised.",
          "**Use IAM Identity Center** (formerly AWS SSO) for human access across accounts instead of creating IAM users everywhere.",
        ]},
      ],
      takeaways: [
        "An AWS account is a hard boundary for billing, blast radius, IAM, and service quotas.",
        "Secure root with MFA, remove its access keys, then never use it for daily work.",
        "Organizations groups accounts into OUs; SCPs cap the maximum permissions those accounts can ever have.",
        "A standard structure separates security, shared infrastructure, workloads by environment, and sandboxes.",
        "Control Tower automates a governed multi-account landing zone with logging, guardrails, and an account factory.",
      ],
      flashcards: [
        { front: "Can an SCP grant permissions?", back: "No. SCPs only set the ceiling. Effective access = IAM allow ∩ SCP allow. Without an IAM allow, an SCP alone gives nothing." },
        { front: "What should the Organizations management account run?", back: "Nothing. It pays the bill and owns the org; workloads live in member accounts to limit blast radius." },
        { front: "Name three things only the root user can do", back: "Close the account, change account name/email/root credentials, change the support plan, and restore access after an account-locking bucket/KMS policy mistake." },
        { front: "What is a landing zone?", back: "A pre-governed multi-account AWS environment — Organizations + OUs + guardrails + centralized logging + SSO — typically built with AWS Control Tower." },
      ],
      quiz: [
        { q: "An account admin has AdministratorAccess but still can't launch an instance in ap-south-1. Most likely cause?", options: ["A missing IAM policy", "An SCP restricting regions", "The instance type is retired", "MFA is not enabled"], answer: 1, explain: "SCPs cap what any principal in the account can do, including administrators. Region restrictions are one of the most common SCP guardrails." },
        { q: "What is the strongest isolation boundary AWS offers?", options: ["A VPC", "A tag", "An AWS account", "An IAM group"], answer: 2, explain: "Accounts isolate IAM, quotas, billing, and resources by default. VPCs isolate networking only, within an account." },
        { q: "Where should organization-wide CloudTrail logs be stored?", options: ["In each workload account", "In a dedicated log-archive account", "In the management account", "On an EC2 instance"], answer: 1, explain: "A separate log-archive account with restricted access keeps audit trails intact even if a workload account is compromised." },
      ],
    },
    {
      slug: "ways-to-interact",
      title: "Four ways to drive AWS: Console, CLI, SDK & IaC",
      summary:
        "Every AWS action is an API call. Here's how to make those calls by hand, in scripts, in code, and — the way real teams do it — declaratively.",
      minutes: 10,
      blocks: [
        { type: "p", text: "The Console, the CLI, the SDKs, and CloudFormation all do exactly one thing: **sign and send HTTPS requests to AWS service APIs**. Once that clicks, switching between them is a matter of ergonomics, not of learning four systems." },
        { type: "h2", text: "1. The Management Console" },
        { type: "p", text: "The web UI. Perfect for exploring a new service, reading dashboards, and debugging. **Bad for anything you'll do twice** — clicks aren't reviewable, repeatable, or auditable as intent. Most teams allow console *read* access widely and console *write* access rarely." },
        { type: "h2", text: "2. The AWS CLI" },
        { type: "p", text: "The workhorse for humans and shell scripts. Every command follows `aws <service> <operation> --flags`, and the output is JSON you can pipe through `--query` (JMESPath) or `jq`." },
        { type: "code", lang: "bash", caption: "Everyday CLI moves worth memorising", code: `# who am I, really?
aws sts get-caller-identity

# list running instances with just the fields you care about
aws ec2 describe-instances \\
  --filters "Name=instance-state-name,Values=running" \\
  --query "Reservations[].Instances[].{ID:InstanceId,Type:InstanceType,AZ:Placement.AvailabilityZone}" \\
  --output table

# work in another account by assuming a role
aws sts assume-role \\
  --role-arn arn:aws:iam::222222222222:role/DeployRole \\
  --role-session-name vivek-deploy

# named profiles keep accounts separate
aws s3 ls --profile prod
export AWS_PROFILE=dev` },
        { type: "callout", kind: "tip", text: "`aws sts get-caller-identity` is the `whoami` of AWS. When a command fails with AccessDenied, run it first — nine times out of ten you're in the wrong account or profile, not missing a permission." },
        { type: "h3", text: "How credentials are found" },
        { type: "p", text: "The CLI and SDKs walk a **credential chain**, stopping at the first source that works:" },
        { type: "list", ordered: true, items: [
          "Command-line flags / explicit parameters",
          "Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`)",
          "The shared credentials file (`~/.aws/credentials`) and config (`~/.aws/config`) for the selected profile",
          "SSO / IAM Identity Center cached tokens",
          "Container credentials (ECS task role) or **instance metadata (IMDS) for an EC2 instance profile**",
        ]},
        { type: "callout", kind: "key", text: "On any AWS compute — EC2, ECS, Lambda, EKS — you should have **no stored keys at all**. Attach a role; the SDK picks up temporary credentials automatically and rotates them for you. Long-lived access keys on a server are the most common way AWS credentials leak." },
        { type: "h2", text: "3. SDKs" },
        { type: "p", text: "Language libraries — **boto3** (Python), the AWS SDK for JavaScript v3, Go, Java, Rust and more. They handle request signing (SigV4), retries with exponential backoff, and pagination. Use them when your automation is complex enough to want types, tests, and error handling." },
        { type: "code", lang: "python", caption: "boto3: same call, same credential chain", code: `import boto3

ec2 = boto3.client("ec2", region_name="eu-west-1")

# paginators handle the 'NextToken' loop for you
for page in ec2.get_paginator("describe_instances").paginate():
    for res in page["Reservations"]:
        for i in res["Instances"]:
            print(i["InstanceId"], i["State"]["Name"], i["InstanceType"])

# resource-level API for common services
s3 = boto3.resource("s3")
s3.Bucket("my-reports").upload_file("out.csv", "daily/out.csv")` },
        { type: "h2", text: "4. Infrastructure as Code — how it's actually done" },
        { type: "p", text: "**CloudFormation** (AWS-native YAML/JSON), the **CDK** (real code that synthesises CloudFormation), and **Terraform** (multi-cloud HCL) let you declare the desired state and let the tool compute the changes. This is how production infrastructure is built: reviewable in pull requests, repeatable across environments, and destroyable in one command." },
        { type: "code", lang: "yaml", caption: "A minimal CloudFormation template", code: `AWSTemplateFormatVersion: "2010-09-09"
Description: A private, encrypted, versioned bucket

Resources:
  ReportsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "reports-\${AWS::AccountId}-\${AWS::Region}"
      VersioningConfiguration: { Status: Enabled }
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault: { SSEAlgorithm: AES256 }
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

Outputs:
  BucketName:
    Value: !Ref ReportsBucket` },
        { type: "compare", caption: "Which tool for which job.", columns: ["Tool", "Best for", "Weakness"], rows: [
          { label: "Console", cells: ["Learning, dashboards, one-off debugging", "Not repeatable, not reviewable, drifts from IaC"] },
          { label: "CLI", cells: ["Scripts, quick queries, CI glue", "Imperative — no record of desired state"] },
          { label: "SDK", cells: ["Application code, complex automation, Lambdas", "More code to own than a template"] },
          { label: "IaC", cells: ["All durable infrastructure", "Slower feedback loop; needs state/rollback discipline"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**SigV4** = AWS's request-signing algorithm; SDKs and the CLI do it for you. **Profile** = a named set of credentials/settings in `~/.aws/config`, switched with `--profile` or `AWS_PROFILE`. **IMDS** (Instance Metadata Service) = a link-local endpoint (169.254.169.254) an EC2 instance calls to get its own role credentials — always use IMDSv2. **Pagination** = APIs return results in pages with a `NextToken`; paginators loop for you. **Idempotent** = running it twice leaves the same result, which is why declarative IaC is safer than imperative scripts. **Drift** = when real infrastructure no longer matches the code that's supposed to define it." },
        { type: "callout", kind: "warn", text: "The most common team failure mode: infrastructure created in Terraform, then 'quickly fixed' in the console. The next `apply` reverts the fix or destroys something. Pick a source of truth and make console writes an incident, not a habit." },
        { type: "h2", text: "CloudShell and the everyday loop" },
        { type: "p", text: "**CloudShell** is a browser terminal pre-authenticated as your console identity, with the CLI, Python, and Node already installed — ideal when you're on a machine without credentials. A realistic day looks like: explore in the console → prove the API call in the CLI → encode it in Terraform → review, merge, and let the pipeline apply it." },
      ],
      takeaways: [
        "Console, CLI, SDK, and IaC are four front ends over the same signed HTTPS APIs.",
        "The credential chain resolves flags → env vars → profile → SSO → instance/task role; on AWS compute use roles and store no keys.",
        "`aws sts get-caller-identity` answers 'which identity and account am I in?' and solves most AccessDenied confusion.",
        "SDKs add signing, retries, and pagination; IaC adds review, repeatability, and a source of truth.",
        "Mixing console edits with IaC creates drift — decide where truth lives and enforce it.",
      ],
      flashcards: [
        { front: "What does `aws sts get-caller-identity` return?", back: "The account ID, the ARN, and the user/role ID of whoever the current credentials belong to — the fastest way to confirm which identity you're using." },
        { front: "Order of the AWS credential chain", back: "Explicit params → environment variables → shared credentials/config profile → SSO cache → container/instance role (IMDS)." },
        { front: "Why attach a role instead of storing access keys on EC2?", back: "Roles deliver short-lived credentials via IMDS and rotate them automatically, so there's no long-lived secret on disk to leak." },
        { front: "What is drift?", back: "When live infrastructure diverges from the IaC that defines it — usually caused by manual console changes. Detect it with CloudFormation drift detection or `terraform plan`." },
      ],
      quiz: [
        { q: "An EC2 instance needs to read from S3. What is the correct approach?", options: ["Store an access key in /etc/environment", "Attach an IAM role via an instance profile", "Use the root user's keys", "Make the bucket public"], answer: 1, explain: "Instance profiles deliver temporary, auto-rotating credentials through IMDS — no secrets on disk and no rotation work." },
        { q: "Which tool best suits durable production infrastructure?", options: ["The Console", "Ad-hoc CLI scripts", "Infrastructure as Code", "Manual snapshots"], answer: 2, explain: "IaC makes infrastructure reviewable, repeatable, and reproducible across environments — the console and one-off scripts leave no source of truth." },
        { q: "Your CLI command hits AccessDenied. What's the fastest first check?", options: ["Recreate the IAM user", "Run `aws sts get-caller-identity`", "Restart the shell", "Switch regions"], answer: 1, explain: "It confirms which identity and account you're actually using — frequently the real problem is the wrong profile, not a missing permission." },
      ],
    },
    {
      slug: "shared-responsibility",
      title: "Shared responsibility, compliance & support",
      summary:
        "Where AWS's job ends and yours begins — plus the compliance artefacts, support plans, and service quotas you'll be asked about on the job.",
      minutes: 8,
      blocks: [
        { type: "p", text: "Security on AWS is a partnership with a precisely drawn line. Knowing which side of the line a given control sits on is the difference between a passing audit and a headline." },
        { type: "diagram", name: "shared-responsibility", caption: "AWS secures the cloud; you secure what you put in it. The line moves with the service model." },
        { type: "h2", text: "The line, service by service" },
        { type: "compare", caption: "The more managed the service, the less you own.", columns: ["Service", "AWS handles", "You handle"], rows: [
          { label: "EC2", cells: ["Hypervisor, hardware, facilities, network fabric", "Guest OS patching, security groups, IAM, app, data, encryption"] },
          { label: "RDS", cells: ["OS + DB engine patching, backups, failover mechanics", "Schema, users/grants, network placement, encryption choice, parameter groups"] },
          { label: "Lambda", cells: ["Runtime, scaling, host, OS entirely", "Your code and dependencies, function IAM role, secrets handling"] },
          { label: "S3", cells: ["Durability, physical media, infrastructure", "Bucket policy, Block Public Access, encryption, versioning, who can read it"] },
        ]},
        { type: "callout", kind: "key", text: "AWS is responsible for security **OF** the cloud. You are responsible for security **IN** the cloud. Essentially every publicised 'AWS breach' has been a customer-side misconfiguration — an open bucket, a leaked key, an over-broad role." },
        { type: "h2", text: "Compliance: how you prove it" },
        { type: "list", items: [
          "**AWS Artifact** — self-service portal for AWS's audit reports: SOC 1/2/3, ISO 27001, PCI DSS AoC. These cover AWS's side; your auditors will still test yours.",
          "**Inherited vs shared vs customer controls** — physical security is inherited; patch management is shared (AWS patches RDS, you patch EC2); data classification is entirely yours.",
          "**Regional compliance** — GDPR, HIPAA, FedRAMP and similar programmes constrain which regions and services you may use. AWS publishes services-in-scope lists per programme.",
          "**Evidence comes from your own telemetry** — CloudTrail (who did what), AWS Config (how resources are configured over time), Security Hub (control pass/fail).",
        ]},
        { type: "h2", text: "Support plans" },
        { type: "compare", caption: "What you get for what you pay.", columns: ["Plan", "Response for a production outage", "Notable inclusions"], rows: [
          { label: "Basic (free)", cells: ["No technical support", "Docs, forums, Health Dashboard, core Trusted Advisor checks"] },
          { label: "Developer", cells: ["< 12 business hours", "Business-hours email to a support associate"] },
          { label: "Business", cells: ["< 1 hour", "24×7 phone/chat, full Trusted Advisor, API access, third-party software support"] },
          { label: "Enterprise On-Ramp / Enterprise", cells: ["< 30 min / < 15 min", "Technical Account Manager, well-architected reviews, incident detection & response"] },
        ]},
        { type: "callout", kind: "tip", text: "Business support is the usual threshold for anything with real users — it's the cheapest plan with 24×7 human help and full Trusted Advisor checks. Many teams treat it as a production entry fee." },
        { type: "h2", text: "SLAs and service quotas" },
        { type: "p", text: "Most AWS services publish an **SLA** — typically 99.99% monthly uptime for a multi-AZ deployment of things like EC2 or RDS — with **service credits** as the remedy. Note the asymmetry: an SLA breach refunds a fraction of your bill, not your lost revenue. Availability is something you design for, not something you buy." },
        { type: "p", text: "**Service Quotas** (still often called limits) cap resources per account per region — vCPUs per instance family, VPCs per region, Lambda concurrent executions, and hundreds more. Some are adjustable via a request; some are hard. Check quotas *before* a launch or a load test, not during." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**SLA** (Service Level Agreement) = a contractual uptime promise with credits if missed. **SLO / SLI** = the internal target you hold yourself to, and the measurement behind it. **SOC 2 / ISO 27001 / PCI DSS** = third-party audit standards; AWS holds certifications for its layer, published in Artifact. **Trusted Advisor** = an AWS service that inspects your account for cost, security, fault-tolerance, and quota issues. **Service credit** = a partial bill refund when an SLA is missed." },
        { type: "h2", text: "Questions worth asking about any new service" },
        { type: "steps", items: [
          { title: "Who patches it?", text: "If the answer is 'you', budget for patching and image pipelines." },
          { title: "Where does the data live and how is it encrypted?", text: "Region, at rest (KMS?), in transit (TLS?), and who holds the keys." },
          { title: "What is its failure domain?", text: "Zonal, regional, or global — and what happens to your app when it degrades." },
          { title: "What are its quotas?", text: "Concurrency, throughput, and size limits that will bite under load." },
          { title: "How is it audited?", text: "Does it emit CloudTrail data events, and are they on?" },
        ]},
      ],
      takeaways: [
        "AWS secures the cloud (hardware, facilities, service internals); you secure in the cloud (data, IAM, config, patching where applicable).",
        "The line shifts with the service: on EC2 you patch the OS, on Lambda AWS does.",
        "AWS Artifact supplies AWS's audit reports; your evidence comes from CloudTrail, Config, and Security Hub.",
        "Business support (< 1 hour production response, full Trusted Advisor) is the practical minimum for a live workload.",
        "SLAs refund credits, not revenue — availability is designed, and service quotas must be checked before launch.",
      ],
      flashcards: [
        { front: "Security OF vs IN the cloud", back: "OF = AWS: facilities, hardware, hypervisor, managed-service internals. IN = you: data, IAM, network config, encryption choices, and OS patching on EC2." },
        { front: "What is AWS Artifact?", back: "A self-service portal to download AWS's own compliance reports (SOC, ISO, PCI) to give auditors evidence for AWS's side of the model." },
        { front: "First support plan with 24×7 phone support and full Trusted Advisor?", back: "Business support, with a < 1 hour response target for production-down cases." },
        { front: "Why isn't an SLA the same as availability?", back: "An SLA only refunds service credits when AWS misses a target. Actual availability comes from your design: multi-AZ, retries, health checks, and graceful degradation." },
      ],
      quiz: [
        { q: "Who is responsible for patching the operating system on an EC2 instance?", options: ["AWS", "The customer", "Nobody — it's immutable", "The AMI vendor, always"], answer: 1, explain: "On EC2 (IaaS) guest OS patching is the customer's job; use Systems Manager Patch Manager or immutable AMI rebuilds. AWS patches the OS for managed services like RDS and Lambda." },
        { q: "A load test fails at 1,000 concurrent Lambda executions. Most likely cause?", options: ["A bug in Lambda", "An account service quota", "A missing IAM policy", "The wrong region"], answer: 1, explain: "Concurrent executions are a per-account, per-region quota. Check Service Quotas and request an increase before load testing." },
        { q: "Where do auditors get evidence that AWS's data centers are secure?", options: ["CloudTrail", "AWS Artifact", "Trusted Advisor", "AWS Config"], answer: 1, explain: "Artifact publishes AWS's third-party audit reports. CloudTrail/Config/Security Hub provide evidence about *your* configuration, not AWS's facilities." },
      ],
    },
    {
      slug: "pricing-and-cost-basics",
      title: "How AWS pricing works (and how bills explode)",
      summary:
        "The pricing dimensions behind every service, the four ways to pay for compute, the Free Tier, and the handful of line items that surprise every new team.",
      minutes: 9,
      blocks: [
        { type: "p", text: "You cannot design well on AWS without a rough cost model in your head. Fortunately almost everything reduces to four dimensions: **time running, data stored, data moved, and requests made.**" },
        { type: "h2", text: "The four dimensions" },
        { type: "compare", caption: "Nearly every AWS line item is one of these.", columns: ["Dimension", "Unit", "Typical examples"], rows: [
          { label: "Compute time", cells: ["per second/hour", "EC2 instance-hours, RDS instance-hours, Lambda GB-seconds, Fargate vCPU-hours"] },
          { label: "Storage", cells: ["per GB-month", "S3 objects, EBS volumes, snapshots, RDS storage, log retention"] },
          { label: "Data transfer", cells: ["per GB", "Egress to internet, cross-region, cross-AZ, NAT gateway processing"] },
          { label: "Requests / operations", cells: ["per million", "S3 PUT/GET, API Gateway calls, Lambda invocations, DynamoDB reads/writes"] },
        ]},
        { type: "diagram", name: "ec2-purchase-options", caption: "The compute purchase spectrum: discount rises as flexibility falls." },
        { type: "h2", text: "Paying for compute" },
        { type: "list", items: [
          "**On-demand** — list price, no commitment. Right for spiky, short-lived, or unpredictable work.",
          "**Savings Plans** — commit to a $/hour spend for 1 or 3 years for up to ~72% off. **Compute Savings Plans** are the flexible favourite: they apply across EC2, Fargate, and Lambda, any region, any family.",
          "**Reserved Instances** — the older model, tied to a family/region; still relevant for RDS, ElastiCache, and Redshift where Savings Plans don't apply.",
          "**Spot** — up to ~90% off spare capacity, reclaimed with a 2-minute warning. Excellent for batch, CI runners, big-data, and stateless fleets that tolerate interruption.",
          "**Dedicated Hosts / Instances** — physical isolation for licensing (BYOL) or regulatory reasons; the most expensive option.",
        ]},
        { type: "callout", kind: "key", text: "The standard playbook: **Savings Plans for your steady baseline, on-demand for the variable layer on top, Spot for anything fault-tolerant.** Buying a Savings Plan for peak capacity wastes money; buying none for a 24×7 baseline wastes more." },
        { type: "h2", text: "The Free Tier — and its edges" },
        { type: "list", items: [
          "**12-month free** — e.g. 750 hours/month of a `t2.micro`/`t3.micro`, 30 GB EBS, 5 GB S3 standard.",
          "**Always free** — 1M Lambda requests + 400,000 GB-seconds per month, 25 GB DynamoDB, 10 custom CloudWatch metrics.",
          "**Trials** — short-lived free periods for specific services (e.g. Inspector, some ML services).",
        ]},
        { type: "callout", kind: "warn", text: "Classic Free Tier bill shocks: a **NAT gateway** (~$32/month plus data processing — never free), an **idle Application Load Balancer** (~$16/month), **unattached EBS volumes and old snapshots**, **Elastic IPs not associated with a running instance**, and leaving a large instance running in a region you forgot about. Set a $5 budget alert *today*." },
        { type: "h2", text: "Data transfer: the line item nobody predicts" },
        { type: "list", items: [
          "**Inbound from the internet: free.** Getting data in is never the problem.",
          "**Outbound to the internet: billed per GB**, with a small monthly free allowance and volume tiers.",
          "**Cross-AZ traffic is billed in both directions** — a chatty microservice mesh spread across AZs quietly generates a real bill.",
          "**Cross-region is billed** and is more expensive than cross-AZ.",
          "**NAT gateway charges per hour *and* per GB processed** — routing S3 traffic through NAT instead of a free **gateway VPC endpoint** is one of the most common avoidable costs on AWS.",
          "**CloudFront egress is cheaper than direct EC2/S3 egress**, and traffic from AWS origins to CloudFront is free — a CDN often pays for itself on bandwidth alone.",
        ]},
        { type: "h2", text: "Reading and controlling the bill" },
        { type: "steps", items: [
          { title: "Turn on Cost Explorer", text: "Free, gives daily/monthly breakdowns by service, account, and tag, plus rightsizing and Savings Plan recommendations." },
          { title: "Create AWS Budgets with alerts", text: "Alert at 50/80/100% of forecast. Budgets can also alert on RI/SP coverage and utilisation." },
          { title: "Enforce a tagging policy", text: "`Environment`, `Owner`, `CostCenter`, `Application` — then activate them as cost allocation tags so Cost Explorer can group by them." },
          { title: "Review Trusted Advisor and Compute Optimizer", text: "Idle resources, low-utilisation instances, unassociated Elastic IPs, and rightsizing suggestions." },
          { title: "Make cost a review item", text: "Add 'what will this cost per month at expected load?' to your design review checklist." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Egress** = data leaving AWS toward the internet — what you pay for; **ingress** (inbound) is free. **GB-month** = storing 1 GB for a month, the unit storage is priced in. **GB-second** = Lambda's unit: memory allocated × execution time. **Cost allocation tag** = a tag activated in the billing console so spend can be grouped by team/app. **Rightsizing** = matching instance size to actual utilisation. **CUR** (Cost and Usage Report) = the most detailed billing export, one row per resource per hour, used for chargeback and FinOps analysis." },
        { type: "h2", text: "A quick mental price list" },
        { type: "p", text: "Rough US-East order-of-magnitude figures, useful for napkin maths (always confirm current pricing): a small general-purpose instance runs a few tens of dollars a month on-demand; S3 Standard is around $0.023 per GB-month; internet egress is around $0.09 per GB; a NAT gateway is about $32/month plus per-GB processing; an ALB is about $16/month plus capacity units. Knowing these within an order of magnitude lets you sanity-check a design in a meeting." },
      ],
      takeaways: [
        "Almost all AWS pricing decomposes into compute time, stored GB-months, transferred GB, and request counts.",
        "Cover the steady baseline with Savings Plans, spikes with on-demand, and interruptible work with Spot.",
        "Inbound data is free; egress, cross-AZ, cross-region, and NAT processing all cost money.",
        "The classic Free Tier surprises are NAT gateways, idle load balancers, orphaned EBS volumes/snapshots, and forgotten regions.",
        "Cost Explorer + Budgets + a real tagging policy make spend explainable and controllable.",
      ],
      flashcards: [
        { front: "Which purchase option suits a fault-tolerant batch job?", back: "Spot — up to ~90% cheaper, but instances can be reclaimed with a 2-minute warning, so the workload must checkpoint or restart safely." },
        { front: "Why do teams put a gateway VPC endpoint in front of S3?", back: "Without it, private-subnet traffic to S3 goes through a NAT gateway and is billed per GB processed. A gateway endpoint keeps it on the AWS network and is free." },
        { front: "What's the difference between Savings Plans and Reserved Instances?", back: "Savings Plans commit to a $/hour spend and flex across instance family/region (and cover Fargate and Lambda for Compute SP). RIs commit to a specific configuration, and are still how you discount RDS/ElastiCache/Redshift." },
        { front: "Is data transfer into AWS billed?", back: "No — inbound from the internet is free. Outbound (egress), cross-region, cross-AZ, and NAT gateway processing are what cost money." },
      ],
      quiz: [
        { q: "A microservice fleet spread across 3 AZs shows a large 'EC2-Other' data transfer bill. Best first fix?", options: ["Move to a bigger instance type", "Reduce chatty cross-AZ traffic, e.g. with AZ-aware routing", "Buy Reserved Instances", "Enable S3 versioning"], answer: 1, explain: "Cross-AZ traffic is billed in both directions. AZ-aware routing or co-locating chatty services cuts it; instance size and RIs don't change transfer cost." },
        { q: "Which is NOT part of the AWS Free Tier?", options: ["750 t3.micro hours/month for 12 months", "1M Lambda requests/month always free", "A NAT gateway", "25 GB of DynamoDB storage"], answer: 2, explain: "NAT gateways are never free — roughly $32/month plus per-GB processing, and a very common surprise on a first bill." },
        { q: "Your workload runs 24×7 at a predictable baseline with occasional spikes. Best strategy?", options: ["All on-demand", "All Spot", "Savings Plan for the baseline, on-demand for spikes", "Dedicated Hosts"], answer: 2, explain: "Commit to the steady portion for the discount and absorb variability on-demand — over-committing to peak wastes the commitment." },
      ],
    },
    {
      slug: "well-architected-intro",
      title: "The Well-Architected Framework in one lesson",
      summary:
        "Six pillars AWS uses to review any design — and the concrete questions each one makes you answer before launch.",
      minutes: 8,
      blocks: [
        { type: "p", text: "The **AWS Well-Architected Framework** is the closest thing the industry has to a shared checklist for cloud design. It's not certification theatre: in interviews and design reviews you'll be expected to reason in these six lenses by name." },
        { type: "diagram", name: "well-architected", caption: "Six pillars — every design trades between them; none is free." },
        { type: "h2", text: "The six pillars" },
        { type: "compare", caption: "What each pillar makes you ask.", columns: ["Pillar", "Core question", "Typical AWS answers"], rows: [
          { label: "Operational Excellence", cells: ["Can we run, observe, and improve this safely?", "IaC, CI/CD, runbooks, CloudWatch dashboards, game days"] },
          { label: "Security", cells: ["Who can do what, and how would we know?", "IAM least privilege, KMS, GuardDuty, CloudTrail, private subnets"] },
          { label: "Reliability", cells: ["What happens when a piece fails?", "Multi-AZ, health checks, retries with backoff, queues, tested backups"] },
          { label: "Performance Efficiency", cells: ["Are we using the right resource for the job?", "Rightsized instances, caching, CloudFront, async processing, the right database"] },
          { label: "Cost Optimization", cells: ["Are we paying only for value delivered?", "Savings Plans, Spot, lifecycle policies, autoscaling down, deleting waste"] },
          { label: "Sustainability", cells: ["Are we minimising the resources consumed?", "Higher utilisation, Graviton, efficient storage tiers, region choice"] },
        ]},
        { type: "callout", kind: "key", text: "The pillars conflict on purpose. Multi-region raises reliability and cost. Aggressive rightsizing helps cost and hurts headroom. A good design review names the trade-off explicitly rather than pretending everything can be maximised." },
        { type: "h2", text: "Design principles worth internalising" },
        { type: "list", items: [
          "**Stop guessing capacity.** Autoscale, and measure instead of forecasting.",
          "**Test at production scale.** Cloud makes a full-size test environment affordable and temporary.",
          "**Automate to make experimentation easier.** If a change is one pipeline run away, you'll make better changes more often.",
          "**Allow for evolutionary architectures.** Design so pieces can be replaced, not so the whole thing must be right on day one.",
          "**Drive architectures using data.** Let CloudWatch metrics and cost reports, not opinions, drive the next change.",
          "**Improve through game days.** Deliberately break things in a controlled window and fix what you learn." ,
        ]},
        { type: "h2", text: "Using it in practice" },
        { type: "steps", items: [
          { title: "Run a review before launch", text: "The Well-Architected Tool in the console walks the pillar questions and produces a prioritised list of risks (HRIs — high risk issues)." },
          { title: "Fix the high-risk items, accept the rest", text: "Not every finding must be fixed; the value is that you decided consciously and wrote down why." },
          { title: "Re-review when things change", text: "Traffic 10×, a new region, a compliance obligation, or a major refactor all invalidate old answers." },
          { title: "Use lenses", text: "AWS publishes specialised lenses — Serverless, SaaS, Machine Learning, Data Analytics, Financial Services — with sharper questions for those domains." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**HRI** (High Risk Issue) = a finding the Well-Architected Tool flags as materially threatening your workload. **Game day** = a scheduled exercise where you intentionally fail components to test recovery and runbooks. **Lens** = a domain-specific extension of the framework. **Graviton** = AWS's ARM-based processors, typically ~20% cheaper and more power-efficient for comparable performance. **Runbook** = written steps for handling a known operational situation." },
        { type: "quote", text: "Everything fails, all the time.", cite: "Werner Vogels, CTO of Amazon — the sentence the Reliability pillar is built on" },
        { type: "h2", text: "A 60-second self-review for any design" },
        { type: "list", ordered: true, items: [
          "If one AZ disappears right now, what breaks and for how long?",
          "Who — human or role — can delete the data, and would we see it in CloudTrail?",
          "What is the monthly cost at expected load, and what's the largest single line item?",
          "How does a change reach production, and how do we roll it back in under five minutes?",
          "What do we watch to know it's healthy, and what alarm would wake somebody?",
        ]},
      ],
      takeaways: [
        "The six pillars are Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.",
        "Pillars deliberately trade against each other; good reviews name the trade-off instead of hiding it.",
        "The Well-Architected Tool produces prioritised high-risk issues; lenses tailor the questions per domain.",
        "Core principles: stop guessing capacity, test at scale, automate, evolve, use data, and run game days.",
        "Five questions — AZ failure, who can delete data, monthly cost, rollback path, and alarms — cover most design gaps.",
      ],
      flashcards: [
        { front: "Name the six Well-Architected pillars", back: "Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability." },
        { front: "What is a Well-Architected lens?", back: "A domain-specific extension (Serverless, SaaS, ML, Analytics, Financial Services) that adds sharper review questions for that workload type." },
        { front: "What is a game day?", back: "A planned exercise where you deliberately fail components in a controlled window to validate recovery, alarms, and runbooks." },
        { front: "Which pillar covers CI/CD, runbooks, and dashboards?", back: "Operational Excellence — how you run, observe, and continuously improve the workload." },
      ],
      quiz: [
        { q: "Which pillar most directly covers 'we can roll back a bad deploy in minutes'?", options: ["Security", "Operational Excellence", "Cost Optimization", "Sustainability"], answer: 1, explain: "Deployment safety, rollback, runbooks, and observability sit under Operational Excellence — though reliability benefits too." },
        { q: "A reviewer says your design 'maximises all six pillars'. What's wrong with that claim?", options: ["Nothing, it's the goal", "Pillars trade against each other, so a design must state its trade-offs", "There are only five pillars", "Pillars apply only to serverless"], answer: 1, explain: "Cost, reliability, and performance pull against each other. Well-architected means conscious, documented trade-offs — not maximising everything." },
      ],
    },
  ],
};
