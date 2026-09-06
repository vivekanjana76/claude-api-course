import type { Module } from "./types";

export const compute: Module = {
  id: "compute",
  title: "Compute: EC2, Auto Scaling & Load Balancing",
  blurb:
    "Instance families and AMIs, EBS performance, purchase options that cut the bill by 70%, Auto Scaling Groups, and the ELB family that fronts them.",
  accent: "iris",
  lessons: [
    {
      slug: "ec2-fundamentals",
      title: "EC2 fundamentals: instances, AMIs & families",
      summary:
        "What an EC2 instance really is, how to decode instance type names, what an AMI contains, and the launch details that bite people on day one.",
      minutes: 11,
      blocks: [
        { type: "p", text: "**Amazon EC2 (Elastic Compute Cloud)** rents you a virtual machine on AWS hardware. It's the oldest compute service, the one every other compute option is compared against, and still the workhorse of most enterprises on AWS." },
        { type: "diagram", name: "compute-spectrum", caption: "EC2 sits at the control-heavy end: you own the OS and everything above it." },
        { type: "h2", text: "The anatomy of a launch" },
        { type: "list", items: [
          "**AMI (Amazon Machine Image)** — the disk template: OS, pre-installed software, and configuration. Region-scoped; copy it to use elsewhere.",
          "**Instance type** — the hardware shape: vCPUs, memory, network, and storage characteristics.",
          "**Network placement** — VPC, subnet (which fixes the AZ), and whether it gets a public IP.",
          "**Security group** — the instance-level stateful firewall.",
          "**Key pair** — the SSH public key baked in at launch (or skip it entirely and use Session Manager).",
          "**IAM instance profile** — the role granting the instance AWS API permissions.",
          "**User data** — a script that runs on first boot for bootstrapping.",
          "**Storage** — the root EBS volume plus any extra volumes.",
        ]},
        { type: "code", lang: "bash", caption: "User data: bootstrap on first boot", code: `#!/bin/bash
dnf update -y
dnf install -y nginx
systemctl enable --now nginx

# instance metadata (IMDSv2 — always use the token flow)
TOKEN=$(curl -sX PUT "http://169.254.169.254/latest/api/token" \\
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
IID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \\
  http://169.254.169.254/latest/meta-data/instance-id)

echo "<h1>Served by $IID</h1>" > /usr/share/nginx/html/index.html` },
        { type: "callout", kind: "tip", text: "User data runs **once at first boot by default** and its output lands in `/var/log/cloud-init-output.log`. When an instance comes up 'wrong', that log is the first place to look." },
        { type: "h2", text: "Decoding instance type names" },
        { type: "p", text: "`m7g.2xlarge` is not random: **`m`** = family (general purpose), **`7`** = generation, **`g`** = attribute (here Graviton/ARM), **`2xlarge`** = size. Newer generations are almost always cheaper per unit of performance, so `m7i` beats `m5` on price-performance nearly every time." },
        { type: "compare", caption: "The families you'll actually choose between.", columns: ["Family", "Balance", "Typical workloads"], rows: [
          { label: "T (t3, t4g)", cells: ["Burstable, CPU credits", "Dev boxes, low-traffic sites, bastion hosts"] },
          { label: "M (m6i, m7g)", cells: ["Balanced CPU:memory (1:4)", "Web/app servers, small databases — the default"] },
          { label: "C (c6i, c7g)", cells: ["Compute-optimised (1:2)", "Batch processing, encoding, gaming servers, HPC"] },
          { label: "R / X (r6i, x2)", cells: ["Memory-optimised (1:8+)", "In-memory caches, large databases, analytics"] },
          { label: "I / D (i4i, d3)", cells: ["Storage-optimised, local NVMe", "NoSQL, data warehouses, high random IOPS"] },
          { label: "P / G / Inf", cells: ["GPU / accelerators", "ML training and inference, rendering"] },
        ]},
        { type: "callout", kind: "key", text: "**Graviton (`g` suffix) is the easiest cost win on AWS**: AWS's ARM processors typically deliver ~20% better price-performance. If your stack is interpreted (Python, Node, Java, Go) or containerised for multi-arch, switching is often a one-line change." },
        { type: "h2", text: "T-family burst credits — the classic mystery" },
        { type: "p", text: "T instances earn **CPU credits** while idle and spend them when busy. Run out and the instance throttles to its baseline (as low as 5–20% of a vCPU), which looks exactly like an application that mysteriously got slow. **Unlimited mode** (default on `t3`+) lets it keep bursting for a surcharge. Watch the `CPUCreditBalance` CloudWatch metric before blaming your code." },
        { type: "h2", text: "AMIs and golden images" },
        { type: "list", items: [
          "**AWS-provided** — Amazon Linux 2023, Ubuntu, Windows Server. Patched images published regularly.",
          "**Marketplace** — vendor appliances, sometimes with hourly licence fees attached.",
          "**Custom / golden AMIs** — your base image with agents, hardening, and dependencies baked in. Faster boots and consistent fleets.",
          "**EC2 Image Builder / Packer** — pipeline tools that rebuild golden AMIs on a schedule so images don't rot.",
        ]},
        { type: "callout", kind: "warn", text: "AMIs are **region-scoped and account-scoped**. A launch template referencing an AMI ID will fail in another region — parameterise the AMI ID (SSM Parameter Store publishes the latest Amazon Linux AMI IDs at a well-known path) rather than hard-coding it." },
        { type: "h2", text: "Instance lifecycle" },
        { type: "compare", caption: "What happens to state and billing.", columns: ["Action", "Instance store data", "Public IP", "Billing"], rows: [
          { label: "Stop", cells: ["Lost", "Lost (unless Elastic IP)", "Stop paying for compute; still pay for EBS"] },
          { label: "Hibernate", cells: ["Preserved in RAM→EBS", "Lost (unless EIP)", "Same as stop, plus larger root volume"] },
          { label: "Reboot", cells: ["Preserved", "Preserved", "Unchanged"] },
          { label: "Terminate", cells: ["Lost", "Released", "Stops; root volume deleted unless you changed the flag"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**AMI** (Amazon Machine Image) = the template a new instance's disk is created from. **vCPU** = a virtual CPU, usually one hyperthread of a physical core. **User data** = a first-boot script. **IMDS** = the instance metadata endpoint at 169.254.169.254 where an instance learns its own ID, region, and role credentials. **Golden image** = a pre-baked, hardened AMI you launch everything from. **Instance store** = physically attached NVMe that is fast and ephemeral — wiped on stop or terminate. **Bastion host** = a hardened jump box for reaching private instances (largely replaced by Session Manager)." },
        { type: "h2", text: "Connecting without SSH keys" },
        { type: "p", text: "**Systems Manager Session Manager** gives a shell through the SSM agent and IAM — no open port 22, no key pairs, no bastion, and every session logged to CloudTrail and optionally S3. On a modern account this is how you should reach instances." },
        { type: "code", lang: "bash", caption: "Shell into a private instance with no inbound ports", code: `aws ssm start-session --target i-0abc123def456

# port-forward a private database to your laptop
aws ssm start-session --target i-0abc123def456 \\
  --document-name AWS-StartPortForwardingSessionToRemoteHost \\
  --parameters '{"host":["db.internal"],"portNumber":["5432"],"localPortNumber":["5432"]}'` },
      ],
      takeaways: [
        "An EC2 launch = AMI + instance type + subnet/SG + key pair or SSM + instance profile + user data + storage.",
        "Instance type names encode family, generation, attribute, and size — newer generations are cheaper per unit of work.",
        "Graviton (ARM) instances usually give ~20% better price-performance for portable workloads.",
        "T-family instances throttle when CPU credits run out; check CPUCreditBalance before debugging the app.",
        "AMIs are region-scoped; parameterise AMI IDs and rebuild golden images on a schedule.",
        "Session Manager replaces SSH keys and bastions with IAM-controlled, fully logged shells.",
      ],
      flashcards: [
        { front: "What does the 'g' in m7g.large mean?", back: "The instance uses AWS Graviton (ARM) processors — typically ~20% better price-performance than the equivalent x86 type." },
        { front: "Why did my t3.micro suddenly get slow?", back: "It exhausted its CPU credits and throttled to baseline. Check the CPUCreditBalance metric; enable unlimited mode or move to an M-family instance." },
        { front: "Where does user data output go?", back: "/var/log/cloud-init-output.log on the instance — the first place to look when bootstrapping didn't work." },
        { front: "What's lost when you stop an instance?", back: "Instance store (ephemeral NVMe) data and the auto-assigned public IP. EBS volumes and their data persist." },
      ],
      quiz: [
        { q: "Which instance family suits an in-memory cache with a large working set?", options: ["C (compute-optimised)", "R (memory-optimised)", "T (burstable)", "P (GPU)"], answer: 1, explain: "R-family gives roughly 8 GB of RAM per vCPU, which is what memory-heavy workloads like caches and large databases need." },
        { q: "How should you connect to a private instance with no inbound ports open?", options: ["Open port 22 to 0.0.0.0/0", "Use a bastion with a shared key", "Use SSM Session Manager", "Assign an Elastic IP"], answer: 2, explain: "Session Manager tunnels through the SSM agent using IAM for authorisation and logs every session — no inbound ports and no key management." },
        { q: "A launch template works in eu-west-1 but fails in us-east-1. Most likely cause?", options: ["The subnet is full", "The AMI ID is region-specific", "The key pair is expired", "IAM denies it"], answer: 1, explain: "AMI IDs are per region. Resolve them dynamically (e.g. from an SSM public parameter) instead of hard-coding." },
      ],
    },
    {
      slug: "ebs-and-instance-storage",
      title: "Storage for instances: EBS, snapshots & instance store",
      summary:
        "Volume types and when each one wins, IOPS versus throughput, snapshot behaviour, encryption, and the ephemeral storage people lose data to.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**EBS (Elastic Block Store)** provides network-attached virtual disks. They live in **one AZ**, persist independently of the instance, and are the default root volume for EC2." },
        { type: "h2", text: "Volume types" },
        { type: "compare", caption: "Pick by IOPS need, throughput need, and price.", columns: ["Type", "Profile", "Use for"], rows: [
          { label: "gp3", cells: ["3,000 IOPS & 125 MB/s baseline, independently scalable to 16k IOPS / 1,000 MB/s", "The default for almost everything — cheaper and more predictable than gp2"] },
          { label: "gp2", cells: ["IOPS tied to size (3 per GB)", "Legacy; migrate to gp3 for ~20% savings and better baseline"] },
          { label: "io2 Block Express", cells: ["Up to 256k IOPS, sub-ms, 99.999% durability", "Mission-critical databases needing guaranteed IOPS"] },
          { label: "st1", cells: ["Throughput-optimised HDD", "Big sequential reads: log processing, data warehouses"] },
          { label: "sc1", cells: ["Cold HDD, cheapest", "Infrequently accessed bulk data"] },
        ]},
        { type: "callout", kind: "key", text: "**Default to gp3.** It decouples IOPS and throughput from volume size, so you stop over-provisioning a 1 TB disk just to get enough IOPS. Migrating gp2 → gp3 is an online change and usually cuts storage cost immediately." },
        { type: "h2", text: "IOPS vs throughput" },
        { type: "p", text: "**IOPS** is operations per second — what a database doing many small random reads cares about. **Throughput** is MB/s — what a log processor streaming large sequential files cares about. Sizing on the wrong one produces a disk that's expensive and still slow. Also remember the **instance** has its own EBS bandwidth limit: a small instance can bottleneck a fast volume." },
        { type: "h2", text: "Snapshots" },
        { type: "list", items: [
          "**Incremental and stored in S3** (managed by AWS, not visible in your buckets). Only changed blocks are stored after the first snapshot.",
          "**Region-scoped, copyable across regions/accounts** — the standard building block for DR and AMI creation.",
          "**Deleting an old snapshot is safe** — AWS keeps the blocks that later snapshots still need.",
          "**Restores are lazily loaded** unless you enable **Fast Snapshot Restore**; the first reads of a restored volume can be slow.",
          "**Automate them** with Data Lifecycle Manager or AWS Backup — with a retention policy, or snapshots become a silent, growing bill.",
        ]},
        { type: "callout", kind: "warn", text: "Two costly habits: (1) leaving **unattached volumes** behind after terminating instances — they bill forever; (2) accumulating **years of snapshots** with no lifecycle policy. Both are usually in the top five findings of any first cost review." },
        { type: "h2", text: "Encryption" },
        { type: "p", text: "EBS encryption uses **KMS** and is effectively free in performance terms. Enable **encryption by default** at the account/region level so every new volume and snapshot is encrypted without anyone remembering. Snapshots of encrypted volumes are encrypted; to share across accounts you must use a customer-managed KMS key and grant access to it." },
        { type: "h2", text: "Instance store — fast and dangerous" },
        { type: "p", text: "Some instance families include **instance store**: NVMe SSDs physically attached to the host. It delivers enormous IOPS at no extra cost, and **the data is gone the moment the instance stops, hibernates, terminates, or the host fails**. Use it for caches, scratch space, temp files, and shuffle data — never for anything you need to survive." },
        { type: "compare", caption: "Choosing storage for an instance.", columns: ["Need", "Use"], rows: [
          { label: "Boot volume, general workloads", cells: ["gp3 EBS"] },
          { label: "Guaranteed high IOPS database", cells: ["io2 Block Express"] },
          { label: "Shared file system across many instances", cells: ["EFS (NFS) or FSx"] },
          { label: "Ephemeral scratch at maximum speed", cells: ["Instance store"] },
          { label: "Bulk sequential throughput on a budget", cells: ["st1"] },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Block storage** = a raw virtual disk you format with a file system, as opposed to object storage (S3). **IOPS** = input/output operations per second. **Throughput** = data volume per second (MB/s). **Incremental snapshot** = only changed blocks since the last snapshot are stored. **Multi-Attach** = attaching one io2 volume to several instances in the same AZ, only for cluster-aware file systems. **Fast Snapshot Restore** = a paid option that removes the lazy-loading slowness of newly restored volumes." },
        { type: "code", lang: "bash", caption: "Finding waste in five commands", code: `# unattached volumes still costing money
aws ec2 describe-volumes --filters Name=status,Values=available \\
  --query "Volumes[].{ID:VolumeId,Size:Size,AZ:AvailabilityZone,Created:CreateTime}" \\
  --output table

# snapshots older than a year
aws ec2 describe-snapshots --owner-ids self \\
  --query "Snapshots[?StartTime<='2025-07-01'].[SnapshotId,VolumeSize,StartTime]" \\
  --output table

# grow a volume online, then extend the file system on the instance
aws ec2 modify-volume --volume-id vol-0abc --size 200 --volume-type gp3 --iops 6000` },
      ],
      takeaways: [
        "EBS volumes are AZ-scoped network disks; gp3 is the sensible default for nearly everything.",
        "Size for IOPS (random small reads) or throughput (large sequential reads) — they're different problems.",
        "Snapshots are incremental, region-scoped, and need a lifecycle policy or they quietly accumulate cost.",
        "Turn on EBS encryption by default at account level; sharing encrypted snapshots requires a customer-managed KMS key.",
        "Instance store is extremely fast and completely ephemeral — never put durable data on it.",
      ],
      flashcards: [
        { front: "Why migrate gp2 → gp3?", back: "gp3 decouples IOPS/throughput from volume size, giving a 3,000 IOPS baseline at any size and roughly 20% lower cost — and it's an online change." },
        { front: "What happens to instance store data when an instance stops?", back: "It's permanently lost. Instance store survives only reboots, not stop/terminate/host failure." },
        { front: "Are EBS snapshots full copies?", back: "No — they're incremental; only blocks changed since the previous snapshot are stored. Deleting an old snapshot doesn't break newer ones." },
        { front: "Can one EBS volume attach to instances in two AZs?", back: "No. EBS is AZ-scoped. Multi-Attach (io2) allows multiple instances in the *same* AZ, and requires a cluster-aware file system." },
      ],
      quiz: [
        { q: "A database needs consistent 40,000 IOPS with sub-millisecond latency. Which volume type?", options: ["gp2", "st1", "io2 Block Express", "sc1"], answer: 2, explain: "io2 Block Express provides provisioned, guaranteed high IOPS with sub-ms latency and the highest durability of the EBS family." },
        { q: "Where should a Spark shuffle directory live for best performance?", options: ["gp3 EBS", "Instance store NVMe", "S3", "EFS"], answer: 1, explain: "Shuffle data is temporary and IO-intensive — exactly what ephemeral local NVMe is for." },
        { q: "Your bill shows steady EBS charges for terminated servers. Most likely cause?", options: ["Snapshots are incremental", "Unattached volumes were left behind", "gp3 is expensive", "Encryption costs extra"], answer: 1, explain: "Volumes with DeleteOnTermination disabled stay behind in 'available' state and keep billing until deleted." },
      ],
    },
    {
      slug: "purchase-options-and-rightsizing",
      title: "Paying less for compute: Spot, Savings Plans & rightsizing",
      summary:
        "The four purchase models in depth, how Spot interruption really works, and the tooling that tells you which instances are too big.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Compute is usually the largest line on an AWS bill, and it's the one with the biggest available discounts. Getting this right is a visible, high-value contribution in any cloud role." },
        { type: "diagram", name: "ec2-purchase-options", caption: "Discount rises as commitment and interruption tolerance rise." },
        { type: "h2", text: "Savings Plans vs Reserved Instances" },
        { type: "compare", caption: "Both are commitments; they differ in flexibility.", columns: ["", "Compute Savings Plan", "EC2 Instance Savings Plan", "Reserved Instance"], rows: [
          { label: "Commit to", cells: ["$/hour of compute spend", "$/hour within one family+region", "A specific instance config"] },
          { label: "Flexibility", cells: ["Any region, family, OS; covers Fargate & Lambda", "Any size/OS inside that family & region", "Locked; convertible RIs can be exchanged"] },
          { label: "Max discount", cells: ["~66%", "~72%", "~72%"] },
          { label: "Best for", cells: ["Most teams — set and forget", "Stable, known family usage", "RDS, ElastiCache, Redshift, OpenSearch (no SP available)"] },
        ]},
        { type: "callout", kind: "key", text: "Rule of thumb: **commit to your trough, not your peak.** Look at the last 3 months of usage, find the level you never drop below, and buy a 1-year no-upfront Compute Savings Plan for that. On-demand handles everything above it." },
        { type: "h2", text: "Spot, properly understood" },
        { type: "list", items: [
          "Spot is spare capacity at up to ~90% off, priced by supply and demand per instance type per AZ.",
          "AWS reclaims capacity with a **2-minute interruption notice** delivered via instance metadata and an EventBridge event.",
          "**Diversify across instance types and AZs** — a Spot Fleet or ASG with a mixed-instances policy and `capacity-optimized` allocation dramatically lowers interruption rates.",
          "Ideal workloads: CI runners, batch and ETL, rendering, big-data processing, stateless web capacity behind a load balancer, and Karpenter-managed Kubernetes nodes.",
          "Bad workloads: single-instance databases, stateful sessions with no replication, anything where a 2-minute eviction means data loss.",
        ]},
        { type: "code", lang: "bash", caption: "Catch the interruption notice and drain gracefully", code: `#!/bin/bash
TOKEN=$(curl -sX PUT "http://169.254.169.254/latest/api/token" \\
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

while true; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" \\
    -H "X-aws-ec2-metadata-token: $TOKEN" \\
    http://169.254.169.254/latest/meta-data/spot/instance-action)
  if [ "$CODE" = "200" ]; then
    echo "Reclaim notice — draining"
    /usr/local/bin/drain-connections.sh   # deregister from the target group, finish work
    exit 0
  fi
  sleep 5
done` },
        { type: "h2", text: "Rightsizing: the boring win" },
        { type: "steps", items: [
          { title: "Read AWS Compute Optimizer", text: "It analyses CloudWatch history and recommends smaller (or occasionally larger) instance types with projected savings. Free." },
          { title: "Check memory too", text: "CPU alone hides the truth. Install the CloudWatch agent to publish memory metrics, or Compute Optimizer will under-inform you." },
          { title: "Move a generation forward", text: "m5 → m6i/m7i or → Graviton often gives more performance for less money with no architectural change." },
          { title: "Schedule non-production", text: "Stop dev/test outside working hours with Instance Scheduler or an EventBridge + Lambda pair. This alone routinely cuts non-prod spend by 60–70%." },
          { title: "Then commit", text: "Rightsize *before* buying Savings Plans, or you'll lock in a commitment for capacity you didn't need." },
        ]},
        { type: "callout", kind: "warn", text: "Order matters. Buying a 3-year Savings Plan on an oversized fleet locks in the waste. Rightsize, delete idle resources, schedule non-prod — then commit to what's left." },
        { type: "h2", text: "Dedicated Hosts & Instances" },
        { type: "p", text: "**Dedicated Instances** run on hardware not shared with other AWS customers. **Dedicated Hosts** give you the physical server, with visibility of sockets and cores — required for **BYOL** licensing (some Oracle, Windows Server, and SQL Server agreements are priced per physical core). They're expensive; use them for licensing or regulatory isolation, not for performance." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Spot interruption notice** = a 2-minute warning that AWS is reclaiming the instance. **Capacity-optimized allocation** = a Spot strategy that picks pools with the deepest spare capacity, minimising interruptions. **Rightsizing** = matching instance size to real utilisation. **BYOL** (Bring Your Own Licence) = using licences you already own, which sometimes requires dedicated hardware. **Trough** = your minimum sustained usage level — the safe amount to commit to. **Convertible RI** = a reserved instance you can exchange for a different type later." },
        { type: "h2", text: "A realistic optimisation result" },
        { type: "p", text: "A typical first pass on a neglected account: schedule non-prod (−25% of total), rightsize over-provisioned instances (−15%), migrate gp2→gp3 and delete orphaned volumes/snapshots (−5%), then apply a 1-year Compute Savings Plan to the remaining baseline (−25% of what's left). Combined, cutting the bill by 40–50% without touching the architecture is an entirely normal outcome." },
      ],
      takeaways: [
        "Compute Savings Plans are the flexible default; RIs still matter for RDS, ElastiCache, Redshift, and OpenSearch.",
        "Commit to your usage trough, never your peak, and rightsize before you commit.",
        "Spot gives up to ~90% off with a 2-minute reclaim notice; diversify pools and handle the notice to use it safely.",
        "Compute Optimizer plus memory metrics tells you what's oversized; scheduling non-prod is the fastest single win.",
        "Dedicated Hosts exist for licensing and isolation requirements, not performance.",
      ],
      flashcards: [
        { front: "How much warning does a Spot interruption give?", back: "Two minutes, delivered via instance metadata (/spot/instance-action) and an EventBridge event — enough to drain connections and checkpoint work." },
        { front: "Which purchase option covers Fargate and Lambda?", back: "Compute Savings Plans — they apply across EC2, Fargate, and Lambda in any region and family." },
        { front: "Why rightsize before buying Savings Plans?", back: "A commitment locks in spend. Committing to an oversized fleet locks in the waste for 1–3 years." },
        { front: "When do you need a Dedicated Host?", back: "For BYOL licences priced per physical core (some Windows/SQL Server/Oracle terms) or when regulation requires isolated hardware." },
      ],
      quiz: [
        { q: "A CI fleet runs thousands of short, restartable jobs. Best purchase option?", options: ["On-demand", "Spot with diversified pools", "3-year all-upfront RIs", "Dedicated Hosts"], answer: 1, explain: "Restartable, stateless, interruption-tolerant work is the canonical Spot use case — up to 90% cheaper with diversification keeping interruptions low." },
        { q: "What should you do first when asked to cut an AWS bill?", options: ["Buy a 3-year Savings Plan", "Delete idle resources, schedule non-prod, and rightsize", "Move regions", "Switch to a different cloud"], answer: 1, explain: "Eliminate waste and rightsize first; only then commit to the remaining steady baseline, or you lock in the waste." },
        { q: "Which tool recommends smaller instance types based on real utilisation?", options: ["Trusted Advisor only", "AWS Compute Optimizer", "CloudFormation", "Systems Manager"], answer: 1, explain: "Compute Optimizer analyses CloudWatch history for EC2, ASGs, EBS, and Lambda and projects the savings of each recommendation." },
      ],
    },
    {
      slug: "auto-scaling",
      title: "Auto Scaling Groups: elasticity that self-heals",
      summary:
        "Launch templates, scaling policies, health checks, lifecycle hooks and instance refresh — how a fleet grows with demand and replaces its own failures.",
      minutes: 10,
      blocks: [
        { type: "p", text: "An **Auto Scaling Group (ASG)** maintains a target number of healthy instances across multiple AZs. It's two features in one: **elasticity** (match capacity to demand) and **self-healing** (replace anything unhealthy) — and the second is arguably more valuable." },
        { type: "diagram", name: "autoscaling", caption: "The ASG watches a metric, adds or removes instances, and keeps the fleet healthy across AZs." },
        { type: "h2", text: "The pieces" },
        { type: "list", items: [
          "**Launch template** — the versioned blueprint (AMI, type, SG, IAM profile, user data). Prefer it over the older launch configurations, which can't be versioned or use mixed instance types.",
          "**Min / desired / max** — the floor, the current target, and the ceiling. The ASG works to keep `desired` healthy instances running.",
          "**Subnets across AZs** — supply at least two; the ASG balances instances across them automatically.",
          "**Health checks** — EC2 status checks by default; **also enable ELB health checks** so an instance that's running but not serving gets replaced.",
          "**Scaling policies** — how `desired` changes over time.",
          "**Lifecycle hooks** — pause instances entering or leaving so you can bootstrap or drain cleanly.",
        ]},
        { type: "h2", text: "Scaling policies" },
        { type: "compare", caption: "Four ways to decide capacity.", columns: ["Policy", "How it works", "Use when"], rows: [
          { label: "Target tracking", cells: ["Keep a metric at a target, e.g. CPU 50% or requests-per-target 1,000", "Almost always — the simplest and best default"] },
          { label: "Step scaling", cells: ["Add N instances per alarm severity band", "You need different responses to mild vs severe load"] },
          { label: "Simple scaling", cells: ["One adjustment per alarm, with a cooldown", "Legacy; step scaling supersedes it"] },
          { label: "Scheduled", cells: ["Change capacity at set times", "Known patterns — market open, batch windows, business hours"] },
        ]},
        { type: "callout", kind: "key", text: "**Start with target tracking on a load-based metric.** CPU is the usual proxy, but `ALBRequestCountPerTarget` is often better because it tracks the thing users actually generate. Predictive scaling can pre-warm capacity for daily cycles." },
        { type: "h2", text: "Warm-up, cooldown, and the flapping problem" },
        { type: "p", text: "Instances need time to boot, bootstrap, and pass health checks. If the ASG counts them before they're serving, it scales again, overshoots, then scales in — **flapping**. Set the **instance warmup** period to your real time-to-ready, and keep scale-in conservative (scale out fast, scale in slowly). Golden AMIs shorten warmup dramatically." },
        { type: "h2", text: "Lifecycle hooks" },
        { type: "code", lang: "bash", caption: "A terminating hook that drains before the instance dies", code: `# ASG puts the instance in Terminating:Wait and emits an EventBridge event.
# Your automation finishes work, then releases the hook:

aws autoscaling complete-lifecycle-action \\
  --auto-scaling-group-name web-asg \\
  --lifecycle-hook-name drain-hook \\
  --lifecycle-action-result CONTINUE \\
  --instance-id i-0abc123` },
        { type: "list", items: [
          "**Launching hook** — install agents, warm a cache, register with a service mesh before the instance takes traffic.",
          "**Terminating hook** — deregister from the target group, finish in-flight jobs, ship final logs.",
          "**Warm pools** — keep pre-initialised stopped instances ready so scale-out takes seconds instead of minutes, at only storage cost.",
        ]},
        { type: "h2", text: "Instance refresh: rolling out a new AMI" },
        { type: "p", text: "**Instance refresh** replaces the fleet in batches against a new launch template version, honouring a minimum healthy percentage and optional **checkpoints** for a canary-style pause. This is the immutable-infrastructure path on EC2: you don't patch running servers, you replace them with new ones built from a new image." },
        { type: "callout", kind: "warn", text: "Two classic ASG failures. **(1)** Only EC2 health checks enabled — the app hangs but the instance passes status checks, so it keeps receiving traffic forever. **(2)** Termination policies you didn't think about — by default the ASG can terminate any instance, so anything stateful you left on one node disappears. Keep ASG instances stateless." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Desired capacity** = how many instances the ASG currently tries to run. **Warmup** = the grace period before a new instance counts toward metrics. **Cooldown** = a pause after a scaling activity to let the effect land. **Flapping** = repeatedly scaling out and in because feedback is too fast. **Lifecycle hook** = a pause point in launch or termination for your automation. **Warm pool** = pre-initialised stopped instances kept ready for fast scale-out. **Instance refresh** = a rolling fleet replacement onto a new launch-template version." },
        { type: "h2", text: "The stateless requirement" },
        { type: "p", text: "Auto scaling only works if any instance can be destroyed at any moment. That means sessions in **ElastiCache or DynamoDB**, uploads in **S3**, logs shipped to **CloudWatch Logs**, and configuration from **Parameter Store or Secrets Manager** — never on the local disk. Designing for statelessness is what unlocks elasticity, blue/green deploys, and Spot all at once." },
      ],
      takeaways: [
        "ASGs deliver both elasticity and self-healing; the self-healing is often the bigger win.",
        "Use launch templates, span at least two AZs, and enable ELB health checks in addition to EC2 status checks.",
        "Target tracking is the right default policy; request-count-per-target often beats CPU as the signal.",
        "Tune warmup to real time-to-ready and scale in slowly to avoid flapping; warm pools shorten scale-out.",
        "Instance refresh rolls a new AMI through the fleet — immutable infrastructure instead of in-place patching.",
        "None of this works unless instances are stateless: sessions, files, logs, and config belong in shared services.",
      ],
      flashcards: [
        { front: "Why enable ELB health checks on an ASG?", back: "EC2 status checks only prove the instance is running. ELB health checks prove the *application* responds, so a hung app gets replaced instead of quietly serving errors." },
        { front: "What is a lifecycle hook for?", back: "Pausing an instance during launch or termination so automation can bootstrap it, or drain connections and ship logs before it disappears." },
        { front: "What does instance refresh do?", back: "Rolls the ASG onto a new launch-template version in batches, respecting a minimum healthy percentage — the immutable way to deploy an AMI update." },
        { front: "What causes scaling 'flapping'?", back: "Reacting before new instances are ready (warmup too short) or scaling in too aggressively — the ASG overshoots in both directions repeatedly." },
      ],
      quiz: [
        { q: "An instance is running but its app has deadlocked. Which health check catches it?", options: ["EC2 status check", "ELB/target group health check", "Neither", "IAM"], answer: 1, explain: "EC2 status checks only verify the instance and hypervisor. The load balancer health check probes the application endpoint and marks it unhealthy." },
        { q: "Which scaling policy should you reach for first?", options: ["Simple scaling", "Step scaling", "Target tracking", "Manual"], answer: 2, explain: "Target tracking keeps a chosen metric at a target value with minimal configuration and handles both directions sensibly." },
        { q: "Why must ASG instances be stateless?", options: ["To reduce cost", "Because any instance can be terminated at any time", "Because AWS forbids local disks", "To use gp3"], answer: 1, explain: "Scale-in, health-check replacement, refreshes, and Spot reclamation can all destroy an instance without warning — local state would be lost." },
      ],
    },
    {
      slug: "load-balancing",
      title: "Elastic Load Balancing: ALB, NLB & target groups",
      summary:
        "Which load balancer to pick, how listeners and rules route traffic, health checks that tell the truth, and the features people forget ALB gives them free.",
      minutes: 10,
      blocks: [
        { type: "p", text: "A load balancer is the front door: it spreads traffic across healthy targets, removes failed ones, terminates TLS, and gives your application one stable DNS name while instances come and go." },
        { type: "diagram", name: "elb-family", caption: "Choose by the network layer you need to make routing decisions at." },
        { type: "h2", text: "The three load balancers" },
        { type: "compare", caption: "ALB vs NLB vs GWLB.", columns: ["", "ALB", "NLB", "GWLB"], rows: [
          { label: "Layer", cells: ["7 (HTTP/HTTPS/gRPC)", "4 (TCP/UDP/TLS)", "3 (IP, GENEVE)"] },
          { label: "Routing on", cells: ["Path, host, header, query, method, source IP", "Port and protocol only", "Transparent — passes packets to appliances"] },
          { label: "Special powers", cells: ["WAF, Cognito/OIDC auth, redirects, fixed responses, Lambda targets", "Static IP per AZ, Elastic IP support, millions of req/s, ultra-low latency, preserves source IP", "Inserts firewalls/IDS inline"] },
          { label: "Reach for it when", cells: ["Any HTTP app — the default", "Non-HTTP protocols, extreme throughput, or you need a fixed IP", "You run third-party security appliances"] },
        ]},
        { type: "h2", text: "Listeners, rules, and target groups" },
        { type: "p", text: "A **listener** watches a port/protocol. Its **rules** evaluate in priority order and route matching requests to a **target group**. A target group holds targets (instances, IPs, Lambda functions, or another ALB for NLB) and owns the health check configuration. This indirection is what makes blue/green and canary deploys possible: you shift traffic between target groups, not between servers." },
        { type: "code", lang: "text", caption: "A typical ALB rule set", code: `Listener :443 (HTTPS, ACM certificate)
  Rule 10  host = api.example.com,  path = /v2/*   → tg-api-v2   (weight 10%)
  Rule 11  host = api.example.com,  path = /v2/*   → tg-api-v1   (weight 90%)
  Rule 20  host = api.example.com,  path = /*      → tg-api-v1
  Rule 30  path = /admin/*  + OIDC authenticate    → tg-admin
  Rule 40  path = /health                          → fixed 200 response
  Default                                          → tg-web

Listener :80 (HTTP)
  Default  → redirect 301 to HTTPS` },
        { type: "callout", kind: "key", text: "**Weighted target groups on an ALB give you canary releases with no extra tooling.** Send 5% to the new version, watch error rate and latency, then ramp. It's the cheapest progressive-delivery mechanism on AWS." },
        { type: "h2", text: "Health checks that tell the truth" },
        { type: "list", items: [
          "Point the check at an endpoint that **exercises real dependencies** (can it reach the database?) — but keep it cheap enough to run every 30 seconds.",
          "Don't make it *too* deep: a shared database blip can then mark every instance unhealthy at once and take down the whole fleet.",
          "Tune `HealthyThreshold`, `UnhealthyThreshold`, `Interval`, and `Timeout` deliberately; defaults are often too slow to notice failure and too fast to tolerate a GC pause.",
          "Set **deregistration delay** (connection draining, default 300s) to just longer than your slowest request so deploys don't cut live connections.",
        ]},
        { type: "h2", text: "Features people forget ALB includes" },
        { type: "list", items: [
          "**TLS termination with ACM certificates** — free public certs that auto-renew.",
          "**HTTP → HTTPS redirect** and **fixed responses** as rules, so trivial cases never reach your app.",
          "**Built-in authentication** via Cognito or any OIDC provider — put a login in front of an internal tool without writing auth code.",
          "**AWS WAF integration** for managed rule sets against common attacks.",
          "**Sticky sessions** (application-controlled or duration-based cookies) — useful, but prefer externalising session state.",
          "**Access logs to S3** — the raw record of every request, invaluable in incidents.",
          "**Lambda targets** — an ALB can invoke a function directly, no API Gateway needed.",
        ]},
        { type: "callout", kind: "warn", text: "An ALB's IP addresses change; **always use its DNS name**, and in Route 53 use an **alias record** (free, and it tracks the changing IPs). If you need a genuinely static IP — for a partner's firewall allowlist — that's an NLB with Elastic IPs." },
        { type: "h2", text: "Cross-zone load balancing" },
        { type: "diagram", name: "load-balancer", caption: "One stable front door, healthy targets spread across AZs — the shape every load balancer produces." },
        { type: "p", text: "With cross-zone enabled, every load balancer node can send traffic to targets in **any** AZ, which evens out distribution when AZs hold unequal target counts. It's **on by default and free for ALB**; for **NLB it's off by default and incurs cross-AZ data charges** when enabled. That asymmetry is a favourite exam and interview question — and a real bill surprise." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Listener** = a port/protocol the load balancer accepts traffic on. **Target group** = a set of backends plus their health check configuration. **Deregistration delay / connection draining** = the grace period for in-flight requests when a target is removed. **Sticky session** = pinning a client to one backend via a cookie. **Alias record** = a Route 53 record type that points at an AWS resource and follows its changing IPs for free. **GENEVE** = the tunnelling protocol Gateway Load Balancer uses to hand packets to security appliances." },
        { type: "h2", text: "Choosing, in one breath" },
        { type: "p", text: "HTTP or gRPC application? **ALB**. Raw TCP/UDP, a static IP requirement, or extreme throughput? **NLB**. Inline third-party firewalls? **GWLB**. Global traffic steering with instant regional failover on anycast IPs? That's **Global Accelerator**, in front of one of the above." },
      ],
      takeaways: [
        "ALB routes on HTTP content, NLB on TCP/UDP with static IPs and extreme scale, GWLB inserts security appliances inline.",
        "Listener rules route to target groups; weighted target groups give canary deploys without extra tooling.",
        "Health checks should test real readiness without being so deep that one dependency fails the whole fleet.",
        "ALB includes free ACM TLS, redirects, OIDC/Cognito auth, WAF, access logs, and Lambda targets.",
        "Use the DNS name (Route 53 alias), not IPs; cross-zone is free/on for ALB but off/billed for NLB.",
      ],
      flashcards: [
        { front: "When do you need an NLB instead of an ALB?", back: "Non-HTTP protocols (TCP/UDP), a requirement for static/Elastic IPs, source-IP preservation, or extreme throughput and ultra-low latency." },
        { front: "How do you canary-release with an ALB alone?", back: "Weighted target groups: route a small percentage of traffic to the new version's target group, watch metrics, then increase the weight." },
        { front: "Cross-zone load balancing defaults", back: "ALB: on by default and free. NLB: off by default and enabling it adds cross-AZ data transfer charges." },
        { front: "What is deregistration delay?", back: "Connection draining — the time a target keeps serving in-flight requests after being removed from a target group (default 300s)." },
      ],
      quiz: [
        { q: "A partner needs to allowlist a fixed IP for your API. What do you use?", options: ["ALB with an alias record", "NLB with Elastic IPs", "CloudFront", "An EC2 public IP"], answer: 1, explain: "ALB IPs change over time. NLB supports assigning a static Elastic IP per AZ, which is what an allowlist needs." },
        { q: "Which routing decision can an ALB make that an NLB cannot?", options: ["Route by TCP port", "Route by URL path or Host header", "Distribute across AZs", "Perform health checks"], answer: 1, explain: "Content-based routing on path, host, headers, and query strings requires Layer 7 inspection, which only the ALB does." },
        { q: "Deploys are cutting user connections mid-request. What should you tune?", options: ["Health check interval", "Deregistration delay (connection draining)", "Cross-zone load balancing", "Sticky sessions"], answer: 1, explain: "Deregistration delay keeps a removed target serving in-flight requests; set it slightly above your slowest expected request." },
      ],
    },
    {
      slug: "choosing-compute",
      title: "Beyond EC2: Lambda, Fargate, Batch & choosing well",
      summary:
        "The full AWS compute menu — Beanstalk, App Runner, Batch, Lightsail, Outposts — and a decision framework for picking one without regret.",
      minutes: 8,
      blocks: [
        { type: "p", text: "EC2 is the floor, not the destination. AWS offers a ladder of compute abstractions, and picking the right rung is one of the more consequential architectural choices you'll make." },
        { type: "compare", caption: "The compute menu.", columns: ["Service", "You provide", "AWS provides", "Sweet spot"], rows: [
          { label: "EC2", cells: ["OS, runtime, app, scaling config", "Hardware, hypervisor, network", "Legacy apps, licensed software, full control, GPUs"] },
          { label: "ECS on Fargate", cells: ["A container image and a task definition", "Servers, scheduling, patching", "Microservices without a Kubernetes team"] },
          { label: "EKS", cells: ["Containers + Kubernetes manifests", "Managed control plane", "Portable K8s workloads, existing K8s skills"] },
          { label: "Lambda", cells: ["A function and its dependencies", "Everything else, per-request", "Event-driven, spiky, glue, APIs"] },
          { label: "App Runner", cells: ["A container image or source repo", "Build, deploy, scale, TLS, URL", "Small web services with zero ops appetite"] },
          { label: "Elastic Beanstalk", cells: ["An application bundle", "EC2, ASG, ALB, deployment orchestration", "Classic apps wanting PaaS on visible infrastructure"] },
          { label: "AWS Batch", cells: ["A job definition and container", "Queueing, scheduling, Spot fleet management", "Large-scale batch, HPC, scientific computing"] },
          { label: "Lightsail", cells: ["Almost nothing", "A fixed-price bundled VM/stack", "Simple sites, learning, predictable tiny workloads"] },
        ]},
        { type: "diagram", name: "compute-spectrum", caption: "Control on the left, speed and abstraction on the right." },
        { type: "h2", text: "A decision framework" },
        { type: "steps", items: [
          { title: "Is the work event-driven and short?", text: "Under 15 minutes, spiky or infrequent, and glue-shaped → **Lambda**. Scale to zero, pay per invocation." },
          { title: "Is it a long-running service in a container?", text: "Yes, and you don't need Kubernetes → **ECS on Fargate**. Yes, and you do (portability, ecosystem, existing skills) → **EKS**." },
          { title: "Does it need a specific OS, kernel module, GPU, or licence?", text: "→ **EC2**. Some things genuinely require a machine." },
          { title: "Is it a queue of independent compute jobs?", text: "→ **AWS Batch**, backed by Spot for the deepest discount." },
          { title: "Is minimising operational surface the top priority?", text: "→ **App Runner** or Beanstalk, accepting less control." },
        ]},
        { type: "callout", kind: "key", text: "The honest heuristic most teams converge on: **Lambda for events and glue, Fargate for services, EC2 for the things that genuinely need a machine.** EKS when Kubernetes is already a team competency — not because it's fashionable." },
        { type: "h2", text: "What each rung actually costs you" },
        { type: "list", items: [
          "**EC2** — cheapest per unit of sustained compute, most operational work (patching, AMIs, scaling config, capacity planning).",
          "**Fargate** — roughly a 20–30% premium over equivalent EC2, and you stop managing nodes entirely. Frequently a net win once you price engineer time.",
          "**Lambda** — extraordinary for spiky and low-volume workloads, and can become expensive at very high sustained throughput, where containers usually win.",
          "**Managed PaaS (App Runner/Beanstalk)** — least control, fastest start, hardest to customise later.",
        ]},
        { type: "callout", kind: "warn", text: "The migration people regret most is picking EC2 by habit and inheriting patching, AMI pipelines, and scaling config for a stateless service that Fargate would have run with a hundred lines of configuration. Choose the highest abstraction that fits, not the most familiar one." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Serverless** = you never provision or patch a server; you pay only while code runs. **Fargate** = the serverless capacity mode for ECS and EKS — you define CPU/memory per task and AWS supplies the host. **Cold start** = the extra latency when a serverless runtime must initialise before handling a request. **Scale to zero** = costing nothing when idle, something EC2 can never do. **PaaS** (Platform as a Service) = you deploy an app and the platform runs it." },
        { type: "h2", text: "Mixing rungs is normal" },
        { type: "p", text: "Real systems combine them: an ALB in front of **Fargate** services, **Lambda** handling S3 events and scheduled jobs, **Batch on Spot** doing nightly ETL, and two **EC2** instances running a vendor appliance that only ships as an AMI. Nobody wins a prize for using one compute service — the goal is that each workload sits at the abstraction that costs the least total effort." },
      ],
      takeaways: [
        "AWS compute is a ladder: EC2 → ECS/EKS → Fargate → Lambda/App Runner, trading control for speed.",
        "Lambda for event-driven and spiky work, Fargate for long-running services, EC2 when a real machine is required.",
        "AWS Batch plus Spot is the standard answer for large-scale independent job queues.",
        "Fargate's premium over EC2 is usually cheaper than the engineering time it removes.",
        "Production systems mix compute types deliberately — the aim is the lowest total effort per workload.",
      ],
      flashcards: [
        { front: "When is Lambda the wrong choice?", back: "Long-running (>15 min) work, very high sustained throughput where containers are cheaper, or workloads needing specific OS/kernel/GPU control." },
        { front: "ECS on Fargate vs EC2 launch type", back: "Fargate: no nodes to manage, pay per task vCPU/GB, ~20–30% premium. EC2 launch type: you manage the cluster instances but can use Spot/RIs and get cheaper sustained compute." },
        { front: "What is AWS Batch for?", back: "Managing queues of independent compute jobs — it provisions and scales (often Spot) compute environments and schedules containerised jobs onto them." },
        { front: "Which compute options scale to zero?", back: "Lambda (per invocation) and App Runner/Fargate-with-scale-to-zero patterns. EC2 and standard ECS/EKS node groups always cost something while running." },
      ],
      quiz: [
        { q: "A stateless HTTP microservice ships as a container and runs continuously. Best first choice?", options: ["EC2 with an ASG", "ECS on Fargate", "Lambda", "Lightsail"], answer: 1, explain: "Fargate runs long-lived containers with no node management, integrates with ALB and IAM, and avoids Lambda's duration limits." },
        { q: "Which workload is the strongest Lambda fit?", options: ["A 4-hour nightly ETL job", "Resizing images when objects land in S3", "A stateful game server", "A licensed Oracle database"], answer: 1, explain: "Event-driven, short, spiky, and stateless is exactly Lambda's shape — and it costs nothing while no images are arriving." },
        { q: "Why might Fargate be cheaper than EC2 in practice despite a higher unit price?", options: ["It has no data transfer costs", "It removes node patching, scaling, and capacity work from your team", "It includes free storage", "It runs on Spot by default"], answer: 1, explain: "The per-vCPU premium is often smaller than the engineering time spent managing, patching, and right-sizing a cluster of instances." },
      ],
    },
  ],
};
