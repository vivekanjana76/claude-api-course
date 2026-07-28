import type { Module } from "./types";

export const storage: Module = {
  id: "storage",
  title: "Storage: S3, EFS & data protection",
  blurb:
    "S3 in depth — classes, lifecycle, versioning, replication, and the security settings that keep buckets off the news — plus shared file systems, backup, and data transfer.",
  accent: "amber",
  lessons: [
    {
      slug: "s3-fundamentals",
      title: "S3 fundamentals: buckets, objects & durability",
      summary:
        "The service AWS was built on — how object storage differs from a file system, what eleven nines actually means, and the consistency model that changed in 2020.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**Amazon S3 (Simple Storage Service)** stores objects — blobs of bytes with metadata — addressed by a key inside a bucket, retrieved over HTTPS. It is the backbone of AWS: data lakes, backups, static sites, logs, artifacts, and the storage layer under dozens of other services." },
        { type: "diagram", name: "storage-types", caption: "Object, block, and file storage solve different problems — S3 is the object one." },
        { type: "h2", text: "Object storage is not a file system" },
        { type: "list", items: [
          "**Flat namespace.** There are no real folders. `reports/2026/q1.csv` is just a key that contains slashes; the console renders prefixes as folders for comfort.",
          "**Whole-object writes.** You can't append to or edit part of an object — you replace it. (Multipart upload splits a *single* upload into parts; it still produces one object.)",
          "**HTTP API, not a mount.** Access is `GET`/`PUT` over HTTPS with IAM, not POSIX file operations. Mounting S3 as a drive is possible (Mountpoint for S3) but it isn't a general-purpose file system.",
          "**Effectively unlimited.** Objects up to 5 TB each, unlimited objects per bucket, no capacity to provision.",
        ]},
        { type: "callout", kind: "key", text: "**Bucket names are globally unique across all AWS accounts** and live in one region. `my-data` was taken in 2007. Use a convention like `company-purpose-account-region`." },
        { type: "h2", text: "Durability and availability" },
        { type: "p", text: "S3 Standard is designed for **99.999999999% (eleven nines) durability** — store 10 million objects and you'd statistically expect to lose one every 10,000 years — achieved by replicating across at least three AZs. **Availability** is a separate promise: 99.99% for Standard. Durability means your data still exists; availability means you can reach it right now." },
        { type: "callout", kind: "warn", text: "Eleven nines protects against hardware failure. It does **not** protect against `aws s3 rm --recursive`, a bad deploy, or ransomware. Deletion protection comes from **versioning + MFA delete + Object Lock + a separate backup account** — durability is not backup." },
        { type: "h2", text: "Consistency" },
        { type: "p", text: "Since December 2020, S3 provides **strong read-after-write consistency** for all operations — PUT a new object or overwrite one and the next GET returns the new data, with no cache-delay caveats. Older documentation and blog posts describing 'eventual consistency for overwrites' are outdated, and this is a common interview trap." },
        { type: "h2", text: "Storage classes" },
        { type: "diagram", name: "storage-tiers", caption: "Cheaper storage costs more to retrieve — the fundamental trade." },
        { type: "compare", caption: "The classes you'll actually choose between.", columns: ["Class", "Cost profile", "Use for"], rows: [
          { label: "Standard", cells: ["Highest storage, no retrieval fee", "Active data, websites, anything read regularly"] },
          { label: "Intelligent-Tiering", cells: ["Small monitoring fee, auto-moves tiers", "Unknown or changing access patterns — the safe default at scale"] },
          { label: "Standard-IA", cells: ["~45% cheaper storage, retrieval fee, 30-day minimum", "Backups and data read a few times a year"] },
          { label: "One Zone-IA", cells: ["~20% cheaper than IA, single AZ", "Reproducible data — thumbnails, secondary copies"] },
          { label: "Glacier Instant Retrieval", cells: ["Archive price, millisecond access", "Archives you occasionally need immediately (medical images)"] },
          { label: "Glacier Flexible Retrieval", cells: ["Very cheap, minutes to 12 hours", "Classic archive with tolerable wait"] },
          { label: "Glacier Deep Archive", cells: ["Cheapest storage in AWS, 12–48 h retrieval", "7-year compliance retention, tape replacement"] },
        ]},
        { type: "callout", kind: "tip", text: "**Intelligent-Tiering is the low-risk default** for large buckets with unpredictable access: it moves objects between frequent, infrequent, and archive tiers automatically with no retrieval fees for the main tiers. Use explicit classes only when you genuinely know the access pattern." },
        { type: "h2", text: "Working with S3" },
        { type: "code", lang: "bash", caption: "The commands you'll use weekly", code: `# sync a directory (only changed files)
aws s3 sync ./build s3://my-site --delete

# copy with a storage class and metadata
aws s3 cp big.tar.gz s3://backups/2026/ --storage-class DEEP_ARCHIVE

# a time-limited download link for someone with no AWS account
aws s3 presign s3://reports/q1.pdf --expires-in 3600

# how big is this prefix, really?
aws s3 ls s3://my-bucket/logs/ --recursive --summarize --human-readable | tail -2

# server-side query without downloading (S3 Select)
aws s3api select-object-content --bucket data --key events.csv.gz \\
  --expression "SELECT * FROM s3object s WHERE s._3 = 'ERROR'" \\
  --expression-type SQL --input-serialization '{"CSV":{},"CompressionType":"GZIP"}' \\
  --output-serialization '{"CSV":{}}' out.csv` },
        { type: "h2", text: "Performance" },
        { type: "list", items: [
          "**3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second per prefix** — and prefixes scale horizontally, so spreading keys across prefixes multiplies throughput.",
          "Random key prefixes are **no longer needed** for performance; that advice predates the 2018 partitioning improvements.",
          "**Multipart upload** for anything over ~100 MB — it parallelises, and lets a failed part retry instead of the whole file. Required above 5 GB.",
          "**Transfer Acceleration** routes uploads through the nearest edge location for long-distance transfers.",
          "**Byte-range fetches** let you download parts of a large object in parallel.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Object** = a file plus metadata stored in S3. **Key** = the object's full name/path inside a bucket. **Prefix** = the leading part of a key, used for organisation and for scaling throughput. **Durability** = the probability your data still exists. **Availability** = the probability you can access it right now. **Multipart upload** = splitting one upload into parallel parts. **Presigned URL** = a time-limited signed link granting temporary access to a private object. **Eleven nines** = 99.999999999%." },
        { type: "callout", kind: "warn", text: "**Incomplete multipart uploads are invisible in the console and still bill you.** Every mature bucket should have a lifecycle rule aborting them after 7 days — it's the most commonly missed line in a cost review." },
      ],
      takeaways: [
        "S3 stores objects in a flat namespace with globally unique, region-scoped bucket names.",
        "Standard offers eleven nines of durability across ≥3 AZs — that's hardware protection, not backup.",
        "S3 has been strongly read-after-write consistent since 2020; older 'eventual consistency' advice is obsolete.",
        "Intelligent-Tiering is the safe default for unpredictable access; explicit classes when you know the pattern.",
        "Scale throughput with prefixes, use multipart above ~100 MB, and lifecycle-abort incomplete uploads.",
      ],
      flashcards: [
        { front: "Durability vs availability in S3", back: "Durability (11 nines) = your data still exists. Availability (99.99% for Standard) = you can retrieve it right now. Different guarantees." },
        { front: "Is S3 eventually consistent?", back: "No — since December 2020 all operations are strongly read-after-write consistent, including overwrites and deletes." },
        { front: "What silently costs money in an old bucket?", back: "Incomplete multipart uploads. They don't appear as objects but bill for storage; add a lifecycle rule to abort them after ~7 days." },
        { front: "When should you use One Zone-IA?", back: "For infrequently accessed data you can regenerate — it lives in a single AZ, so an AZ loss destroys it." },
      ],
      quiz: [
        { q: "Which statement about S3 is true today?", options: ["Overwrites are eventually consistent", "All operations are strongly read-after-write consistent", "Only new objects are consistent", "Consistency depends on the region"], answer: 1, explain: "S3 became strongly consistent for all operations in December 2020 — a frequent interview trap because so much old material says otherwise." },
        { q: "A bucket holds logs with unpredictable access patterns and grows to 50 TB. Best class?", options: ["Standard", "Intelligent-Tiering", "Deep Archive", "One Zone-IA"], answer: 1, explain: "Intelligent-Tiering automatically moves objects between access tiers without retrieval fees for the main tiers — ideal when the pattern is unknown." },
        { q: "How do you give an external partner temporary access to one private object?", options: ["Make the bucket public", "Create an IAM user for them", "Generate a presigned URL", "Email the object"], answer: 2, explain: "A presigned URL grants time-limited access to a single object using your credentials, without changing bucket permissions or creating identities." },
      ],
    },
    {
      slug: "s3-security",
      title: "S3 security: keeping buckets off the news",
      summary:
        "Block Public Access, bucket policies, encryption options, Object Lock, and the layered controls that prevent the most famous class of cloud breach.",
      minutes: 10,
      blocks: [
        { type: "p", text: "\"Misconfigured S3 bucket\" has been the headline of more breaches than any other cloud phrase. The controls to prevent it are simple and free — the failure is always that someone didn't apply them." },
        { type: "diagram", name: "s3-request-flow", caption: "Every S3 request passes through several layers; one explicit deny ends it." },
        { type: "h2", text: "Block Public Access — the master switch" },
        { type: "p", text: "**Block Public Access (BPA)** overrides bucket policies and ACLs. It's on by default for new buckets at both account and bucket level, and it should stay on virtually everywhere. Four independent settings block public ACLs, ignore existing public ACLs, block public bucket policies, and restrict public buckets to same-account principals." },
        { type: "callout", kind: "key", text: "**Serve public websites through CloudFront with Origin Access Control, not a public bucket.** The bucket stays private, CloudFront is the only thing allowed to read it, and you gain caching, TLS, and WAF for free. There is almost no remaining good reason to make a bucket public." },
        { type: "h2", text: "The four ways to grant access" },
        { type: "compare", caption: "In rough order of preference.", columns: ["Mechanism", "Good for", "Notes"], rows: [
          { label: "IAM identity policy", cells: ["Your own roles and users", "The default; keep resource ARNs tight"] },
          { label: "Bucket policy", cells: ["Cross-account, service principals, org-wide rules", "The right place for `aws:PrincipalOrgID` and TLS-only denies"] },
          { label: "Presigned URL", cells: ["One-off external access to one object", "Inherits the signer's permissions; keep expiry short"] },
          { label: "ACLs", cells: ["Nothing new", "Legacy. Disable them via Object Ownership = Bucket owner enforced"] },
        ]},
        { type: "code", lang: "json", caption: "A hardened bucket policy worth reusing", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::prod-data", "arn:aws:s3:::prod-data/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    },
    {
      "Sid": "DenyOutsideOrg",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::prod-data", "arn:aws:s3:::prod-data/*"],
      "Condition": {
        "StringNotEquals": { "aws:PrincipalOrgID": "o-abc123" }
      }
    },
    {
      "Sid": "DenyUnencryptedUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::prod-data/*",
      "Condition": {
        "StringNotEquals": { "s3:x-amz-server-side-encryption": "aws:kms" }
      }
    }
  ]
}` },
        { type: "h2", text: "Encryption" },
        { type: "list", items: [
          "**SSE-S3 (AES-256)** — AWS-managed keys, on by default for all new objects since 2023. Zero effort, no key control.",
          "**SSE-KMS** — a KMS key you control: key policies, rotation, and every use logged in CloudTrail. The standard for regulated or sensitive data.",
          "**SSE-KMS with S3 Bucket Keys** — reduces KMS API calls (and cost) by up to 99% for high-volume buckets. Enable it whenever you use SSE-KMS.",
          "**DSSE-KMS** — dual-layer encryption for specific compliance regimes.",
          "**SSE-C / client-side** — you supply or apply the keys; maximum control, maximum operational burden.",
        ]},
        { type: "callout", kind: "warn", text: "With SSE-KMS, readers need **both** `s3:GetObject` *and* `kms:Decrypt` on the key. A KMS key policy that omits the reader is the single most confusing cause of 'AccessDenied' in AWS — the error mentions S3, but the problem is KMS." },
        { type: "h2", text: "Versioning, Object Lock & MFA delete" },
        { type: "list", items: [
          "**Versioning** keeps every version of an object; deletes create a delete marker rather than destroying data. This is your protection against overwrite and deletion mistakes.",
          "**MFA Delete** requires an MFA token to permanently delete a version or disable versioning — configurable only by the root user, which is why it's rare in practice.",
          "**Object Lock (WORM)** makes objects immutable for a retention period. **Governance mode** allows privileged override; **Compliance mode** allows none — not even root. This is the real anti-ransomware and regulatory-retention control.",
          "**Versioning costs money**: every version is billed. Pair it with a lifecycle rule that expires noncurrent versions after 30–90 days.",
        ]},
        { type: "h2", text: "Detection and monitoring" },
        { type: "list", items: [
          "**IAM Access Analyzer for S3** — lists every bucket reachable from outside your account or organization. Check it weekly.",
          "**Amazon Macie** — scans buckets for PII, credentials, and sensitive data, and reports what's exposed.",
          "**CloudTrail data events** — S3 object-level API logging (off by default, costs extra). Enable at least for sensitive buckets; without it you cannot answer 'who downloaded that file?'.",
          "**S3 Storage Lens** — an org-wide dashboard of usage, cost, and security posture across all buckets.",
          "**AWS Config rules** — `s3-bucket-public-read-prohibited`, `s3-bucket-server-side-encryption-enabled`, and friends, deployed as a conformance pack.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**BPA** (Block Public Access) = the account/bucket-level master switch overriding any public grant. **OAC** (Origin Access Control) = the modern way to let only CloudFront read a private bucket. **WORM** (Write Once Read Many) = immutable storage that cannot be altered or deleted before its retention expires. **Delete marker** = the tombstone a delete creates in a versioned bucket, hiding the object without destroying it. **Bucket Key** = an S3 feature that caches a KMS data key to slash KMS request costs. **Macie** = the AWS service that discovers sensitive data in S3." },
        { type: "h2", text: "The checklist for any production bucket" },
        { type: "steps", items: [
          { title: "Block Public Access on, at account level", text: "Then also at bucket level. Grant exceptions only through CloudFront + OAC." },
          { title: "Object Ownership = Bucket owner enforced", text: "Disables ACLs entirely and removes a whole category of misconfiguration." },
          { title: "Default encryption with SSE-KMS + Bucket Keys", text: "Plus a deny on unencrypted uploads and on non-TLS access." },
          { title: "Versioning on, with lifecycle for noncurrent versions", text: "Protects against deletion; the lifecycle rule keeps the bill sane." },
          { title: "Object Lock for backups and compliance data", text: "Compliance mode where regulation or ransomware resistance demands it." },
          { title: "Access logging and Access Analyzer", text: "Server access logs or CloudTrail data events, and a recurring review of external-access findings." },
        ]},
      ],
      takeaways: [
        "Block Public Access overrides policies and ACLs — keep it on and serve public content via CloudFront + OAC.",
        "Prefer IAM policies and bucket policies; disable ACLs with Object Ownership = Bucket owner enforced.",
        "SSE-S3 is on by default; SSE-KMS adds key control and audit — and requires kms:Decrypt on the reader.",
        "Versioning plus lifecycle protects against deletion; Object Lock in compliance mode resists ransomware and satisfies retention rules.",
        "Access Analyzer, Macie, Storage Lens, CloudTrail data events, and Config rules give you detection alongside prevention.",
      ],
      flashcards: [
        { front: "How should a static website be served securely from S3?", back: "Keep the bucket private and put CloudFront in front with Origin Access Control, so only CloudFront can read it — plus TLS, caching, and WAF." },
        { front: "Object Lock governance vs compliance mode", back: "Governance allows privileged users to override retention; compliance allows no one — not even the root user — to delete before expiry." },
        { front: "Why does SSE-KMS cause surprise AccessDenied errors?", back: "Readers need kms:Decrypt on the key in addition to s3:GetObject. If the key policy omits them, S3 returns AccessDenied even though S3 permissions are correct." },
        { front: "What does an S3 Bucket Key do?", back: "Caches a KMS data key at the bucket level, cutting KMS API calls and cost by up to 99% for high-volume SSE-KMS buckets." },
      ],
      quiz: [
        { q: "Which control overrides a bucket policy that grants public read?", options: ["Versioning", "Block Public Access", "Object Lock", "Storage class"], answer: 1, explain: "BPA sits above policies and ACLs — if it's enabled, a public grant simply doesn't take effect." },
        { q: "You must guarantee backups can't be deleted for 7 years, even by an admin. What do you use?", options: ["Versioning only", "Object Lock in compliance mode", "MFA Delete", "Glacier Deep Archive"], answer: 1, explain: "Compliance mode makes objects immutable for the retention period with no override path, which is exactly what regulatory retention and ransomware resistance require." },
        { q: "What must you enable to answer 'who downloaded this object last Tuesday?'", options: ["CloudTrail management events", "CloudTrail data events for S3", "AWS Config", "Storage Lens"], answer: 1, explain: "Management events record bucket-level API calls; object-level reads and writes require data events, which are off by default and billed separately." },
      ],
    },
    {
      slug: "s3-lifecycle-replication-hosting",
      title: "Lifecycle, replication, events & static hosting",
      summary:
        "Automating cost with lifecycle rules, copying data across regions and accounts, triggering work from object events, and serving a website from a bucket.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Once a bucket is secure, the next questions are always the same: how do I stop it getting expensive, how do I get a copy somewhere else, and how do I make something happen when a file lands?" },
        { type: "h2", text: "Lifecycle rules" },
        { type: "p", text: "Lifecycle rules move objects between storage classes or delete them, based on age and filtered by prefix, tag, or size. They run daily, cost nothing to configure, and are the main lever on storage spend." },
        { type: "code", lang: "json", caption: "A realistic lifecycle configuration", code: `{
  "Rules": [
    {
      "ID": "AbortIncompleteUploads",
      "Status": "Enabled",
      "Filter": {},
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    },
    {
      "ID": "TierLogs",
      "Status": "Enabled",
      "Filter": { "Prefix": "logs/" },
      "Transitions": [
        { "Days": 30,  "StorageClass": "STANDARD_IA" },
        { "Days": 90,  "StorageClass": "GLACIER_IR" },
        { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
      ],
      "Expiration": { "Days": 2555 }
    },
    {
      "ID": "TrimOldVersions",
      "Status": "Enabled",
      "Filter": {},
      "NoncurrentVersionExpiration": { "NoncurrentDays": 60 },
      "Expiration": { "ExpiredObjectDeleteMarker": true }
    }
  ]
}` },
        { type: "callout", kind: "warn", text: "Transitions aren't free: each object costs a small per-object transition fee, and IA/Glacier classes have **minimum storage durations** (30 days for IA, 90 for Glacier Flexible, 180 for Deep Archive) plus a **minimum billable object size of 128 KB**. Tiering millions of tiny files can cost *more* than leaving them in Standard." },
        { type: "h2", text: "Replication" },
        { type: "compare", caption: "Two flavours, one mechanism.", columns: ["Type", "What it does", "Typical reason"], rows: [
          { label: "CRR (Cross-Region)", cells: ["Copies objects to a bucket in another region", "DR, latency for global readers, compliance"] },
          { label: "SRR (Same-Region)", cells: ["Copies to another bucket, often another account", "Log aggregation, isolating a backup copy, prod→test data"] },
        ]},
        { type: "list", items: [
          "**Versioning must be enabled on both source and destination.**",
          "Replication is **asynchronous**; **S3 RTC (Replication Time Control)** adds a 15-minute SLA with metrics when you need a guarantee.",
          "By default it replicates only *new* objects — use **Batch Replication** to backfill existing ones.",
          "You can filter by prefix/tag, change storage class on the destination, and change object ownership to the destination account (essential for a true isolated backup).",
          "Delete markers can optionally be replicated; **permanent version deletes are never replicated**, which is what makes a replica useful against accidental deletion.",
        ]},
        { type: "callout", kind: "key", text: "The strongest S3 backup pattern: **SRR or CRR into a separate AWS account** whose credentials your production pipeline does not hold, with **Object Lock** on the destination. Now a compromised production account cannot destroy the backups." },
        { type: "h2", text: "Event notifications" },
        { type: "p", text: "S3 can emit events (`ObjectCreated:*`, `ObjectRemoved:*`, `LifecycleTransition`, and more) to **Lambda, SQS, SNS, or EventBridge**. This is the foundation of most serverless data pipelines: an upload triggers a thumbnailer, a virus scan, an ETL job, or an index update." },
        { type: "code", lang: "python", caption: "A Lambda handling an S3 upload event", code: `import urllib.parse, boto3

s3 = boto3.client("s3")

def handler(event, context):
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(record["s3"]["object"]["key"])
        size = record["s3"]["object"]["size"]
        print(f"new object s3://{bucket}/{key} ({size} bytes)")
        # ... process, then write the result to an OUTPUT bucket
    return {"processed": len(event["Records"])}` },
        { type: "callout", kind: "warn", text: "Never write a processing result back into the **same bucket and prefix** that triggers the function — you'll build an infinite recursion that costs real money before anyone notices. Use a separate output bucket, or a suffix/prefix filter that excludes your own output." },
        { type: "p", text: "Prefer **EventBridge** as the target for anything beyond a single consumer: it supports many rules, content-based filtering, replay, archiving, and cross-account delivery, where direct S3 notifications are limited and easy to overwrite." },
        { type: "h2", text: "Static website hosting" },
        { type: "p", text: "S3 can serve a static site directly, but the production pattern is **CloudFront in front of a private bucket with Origin Access Control**, an ACM certificate, and a Route 53 alias record. That gives HTTPS (S3 website endpoints are HTTP-only), global caching, custom error pages, and WAF." },
        { type: "steps", items: [
          { title: "Upload the build", text: "`aws s3 sync ./dist s3://my-site --delete` from your pipeline." },
          { title: "Keep the bucket private", text: "BPA on; grant only the CloudFront OAC principal `s3:GetObject`." },
          { title: "Create the distribution", text: "Default root object `index.html`, and a custom error response mapping 403/404 to `/index.html` for single-page apps." },
          { title: "Certificate and DNS", text: "ACM certificate **in us-east-1** for CloudFront, then a Route 53 alias record to the distribution." },
          { title: "Invalidate on deploy", text: "`aws cloudfront create-invalidation --paths '/*'` — or better, use content-hashed filenames and only invalidate `index.html`." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Lifecycle rule** = an automatic transition or expiration policy based on object age. **CRR / SRR** = cross-region / same-region replication. **RTC** (Replication Time Control) = a paid 15-minute replication SLA. **Batch Replication** = a job that replicates objects that already existed before replication was enabled. **OAC** (Origin Access Control) = CloudFront's identity for reading a private bucket. **Invalidation** = telling CloudFront to discard cached copies of a path. **Minimum storage duration** = the period you're billed for even if you delete earlier." },
        { type: "h2", text: "Cost-saving moves ranked" },
        { type: "list", ordered: true, items: [
          "Abort incomplete multipart uploads after 7 days — pure waste removal.",
          "Expire noncurrent versions after 30–90 days in versioned buckets.",
          "Move logs and backups to IA and Glacier tiers on a schedule.",
          "Turn on Intelligent-Tiering for large buckets with unknown access.",
          "Serve traffic through CloudFront so egress is cheaper and requests are cached.",
          "Use a gateway VPC endpoint so private-subnet S3 traffic bypasses NAT gateway data charges.",
        ]},
      ],
      takeaways: [
        "Lifecycle rules automate tiering and expiry — mind minimum durations, per-object fees, and the 128 KB rule.",
        "Replication (CRR/SRR) is async, needs versioning on both ends, and only covers new objects unless you run Batch Replication.",
        "Replicating into a separate account with Object Lock is the strongest protection against ransomware and insider deletion.",
        "S3 events to Lambda/SQS/EventBridge power serverless pipelines — never write output back into the triggering prefix.",
        "Static sites belong behind CloudFront + OAC with an ACM certificate in us-east-1, not on a public bucket.",
      ],
      flashcards: [
        { front: "What must be enabled for S3 replication?", back: "Versioning on both source and destination buckets, plus an IAM role S3 can assume to perform the copy." },
        { front: "Does replication copy existing objects?", back: "No — only objects created after replication is configured. Use S3 Batch Replication to backfill the existing ones." },
        { front: "What causes an infinite Lambda loop with S3?", back: "Writing the function's output back into the same bucket/prefix that triggers it. Use a separate output bucket or exclusive prefix filters." },
        { front: "Why must a CloudFront certificate live in us-east-1?", back: "CloudFront is a global service whose certificate control plane runs in us-east-1; ACM certificates for distributions must be issued there regardless of your origin's region." },
      ],
      quiz: [
        { q: "Millions of 20 KB objects are tiered to Glacier and the bill goes up. Why?", options: ["Glacier is more expensive than Standard", "Minimum billable object size (128 KB) plus per-object transition fees", "Replication was enabled", "Versioning was on"], answer: 1, explain: "Small objects are billed at a 128 KB minimum in IA/Glacier classes and each transition costs a per-object fee — tiering tiny files can cost more than leaving them." },
        { q: "What's the strongest protection against a compromised prod account deleting all backups?", options: ["Versioning in the same bucket", "Replication to a separate account with Object Lock", "Deep Archive storage class", "MFA on the console"], answer: 1, explain: "An isolated destination account that production credentials cannot write to, combined with WORM retention, survives compromise of the source account." },
        { q: "Which target should you choose for S3 events with several independent consumers?", options: ["A single Lambda", "SNS only", "EventBridge", "SQS only"], answer: 2, explain: "EventBridge supports many rules, content filtering, archive/replay, and cross-account delivery — direct notifications are limited and easily overwritten." },
      ],
    },
    {
      slug: "file-systems-and-data-protection",
      title: "EFS, FSx, Backup & moving data into AWS",
      summary:
        "Shared file systems when S3 isn't the right shape, centralised backup policies, and the Snow/DataSync/Transfer toolkit for getting data in.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Not every workload can be rewritten to speak S3. Legacy applications, content management systems, and analytics tools often need a **POSIX file system** several machines can mount at once — which is what EFS and FSx are for." },
        { type: "h2", text: "Amazon EFS" },
        { type: "list", items: [
          "**Elastic NFS** — mounts on thousands of EC2 instances, containers, and Lambda functions simultaneously, growing and shrinking automatically with no capacity to provision.",
          "**Regional by default** — mount targets in multiple AZs make it resilient to an AZ failure (One Zone mode is cheaper but single-AZ).",
          "**Storage classes** — Standard and Infrequent Access, with lifecycle management moving files automatically after a set idle period.",
          "**Performance modes** — General Purpose (low latency, the default) vs Max I/O (higher throughput, higher latency); Elastic throughput mode is the modern default.",
          "**Costs meaningfully more per GB than S3** — use it because you need file semantics, not as a bulk store.",
        ]},
        { type: "h2", text: "The FSx family" },
        { type: "compare", caption: "Purpose-built file systems.", columns: ["Service", "Protocol", "Use for"], rows: [
          { label: "FSx for Windows File Server", cells: ["SMB, AD-integrated", "Windows apps, home directories, .NET workloads"] },
          { label: "FSx for Lustre", cells: ["Lustre, S3-linked", "HPC, ML training, high-throughput analytics"] },
          { label: "FSx for NetApp ONTAP", cells: ["NFS, SMB, iSCSI", "Enterprise migrations wanting ONTAP features (snapshots, dedup)"] },
          { label: "FSx for OpenZFS", cells: ["NFS", "Low-latency ZFS workloads with snapshots and clones"] },
        ]},
        { type: "callout", kind: "key", text: "Choosing storage in one line each: **S3** for objects and anything internet-scale; **EBS** for a single instance's disk; **EFS** for a shared Linux file system; **FSx for Windows** for SMB; **FSx for Lustre** for HPC/ML throughput; **instance store** for ephemeral speed." },
        { type: "h2", text: "AWS Backup" },
        { type: "p", text: "**AWS Backup** centralises backup policy across EBS, EFS, RDS, Aurora, DynamoDB, FSx, EC2, S3, and more, so you stop maintaining a snapshot Lambda per service. You define **backup plans** (schedule, retention, lifecycle to cold storage) and apply them to resources by **tag**, which means new resources are protected automatically if they're tagged correctly." },
        { type: "list", items: [
          "**Backup vaults** hold recovery points; **vault lock** makes retention immutable (WORM) — the ransomware defence.",
          "**Cross-region and cross-account copy** for DR and isolation.",
          "**Restore testing** validates that recovery points are actually restorable, on a schedule.",
          "**Backup Audit Manager** reports compliance against your own policies — useful evidence for auditors.",
        ]},
        { type: "callout", kind: "warn", text: "A backup you have never restored is a rumour. Schedule a real restore test at least quarterly, measure how long it actually takes, and write that number down as your true RTO — it's almost always longer than people assume." },
        { type: "h2", text: "Getting data into AWS" },
        { type: "compare", caption: "Match the tool to the volume and the link.", columns: ["Tool", "Best for", "Notes"], rows: [
          { label: "AWS DataSync", cells: ["Ongoing or bulk transfer from NFS/SMB/HDFS/other clouds", "10× faster than open-source copy tools; handles verification and scheduling"] },
          { label: "Storage Gateway", cells: ["Hybrid: on-prem apps using AWS storage transparently", "File/Volume/Tape gateway modes with local caching"] },
          { label: "Transfer Family", cells: ["Partners who insist on SFTP/FTPS/AS2", "Managed endpoints that land files straight in S3"] },
          { label: "Snowball / Snowmobile", cells: ["Tens of TB to petabytes with poor bandwidth", "Physical devices shipped to you — often faster than the wire"] },
          { label: "Direct Connect", cells: ["Sustained high-volume hybrid transfer", "A dedicated circuit; weeks to provision"] },
        ]},
        { type: "callout", kind: "tip", text: "The classic sizing question: at 1 Gbps, 100 TB takes roughly **10 days** of saturated link. Above ~50–100 TB with anything less than a fat, idle pipe, Snowball is usually faster and cheaper. Do the arithmetic before promising a migration date." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**POSIX file system** = the standard file semantics Linux apps expect (directories, permissions, partial writes) — S3 does not provide these. **NFS / SMB** = the Linux and Windows network file-sharing protocols. **Mount target** = the per-AZ network endpoint an EFS file system is mounted through. **Recovery point** = one backup snapshot in AWS Backup. **Vault lock** = immutable retention on a backup vault. **RTO / RPO** = how fast you must recover, and how much data you can afford to lose. **HPC** = high-performance computing." },
        { type: "h2", text: "A storage decision tree" },
        { type: "steps", items: [
          { title: "Is it an object your app can address by key?", text: "→ **S3**. Cheapest, most durable, most integrated. Prefer it whenever the app can be adapted." },
          { title: "Does one instance need a disk?", text: "→ **EBS gp3**. io2 if it needs guaranteed high IOPS." },
          { title: "Do many Linux machines need the same files at once?", text: "→ **EFS**." },
          { title: "Is it Windows/SMB or Active-Directory-integrated?", text: "→ **FSx for Windows File Server**." },
          { title: "Is it HPC or ML training needing extreme throughput against S3 data?", text: "→ **FSx for Lustre**." },
          { title: "Is it ephemeral scratch that must be as fast as possible?", text: "→ **instance store**." },
        ]},
      ],
      takeaways: [
        "EFS is elastic multi-AZ NFS for shared Linux file access; FSx covers Windows/SMB, Lustre/HPC, ONTAP, and OpenZFS.",
        "File systems cost more per GB than S3 — use them for file semantics, not bulk storage.",
        "AWS Backup applies backup plans by tag across services, with vault lock, cross-account copy, and restore testing.",
        "An untested backup is a rumour: schedule restore tests and record the real recovery time as your RTO.",
        "DataSync, Storage Gateway, Transfer Family, Snowball, and Direct Connect each fit a different volume and connectivity profile.",
      ],
      flashcards: [
        { front: "When do you need EFS instead of S3?", back: "When the application needs POSIX file semantics — directories, file locking, partial writes — and several instances must share the same files concurrently." },
        { front: "How does AWS Backup decide what to protect?", back: "Backup plans are assigned to resources by tag (or resource ID), so correctly tagged new resources are protected automatically." },
        { front: "What is vault lock?", back: "An immutable (WORM) retention setting on a backup vault so recovery points can't be deleted early — the core anti-ransomware control for backups." },
        { front: "When is Snowball faster than the network?", back: "Roughly above 50–100 TB on a link that isn't very fast and idle: 100 TB over a saturated 1 Gbps line takes about 10 days." },
      ],
      quiz: [
        { q: "A legacy Windows application needs shared storage with Active Directory permissions. What fits?", options: ["S3", "EFS", "FSx for Windows File Server", "Instance store"], answer: 2, explain: "FSx for Windows File Server provides SMB with native AD integration and Windows ACL semantics — EFS is NFS and S3 isn't a file system at all." },
        { q: "What does AWS Backup's vault lock protect against?", options: ["Region failure", "Early or malicious deletion of recovery points", "Slow restores", "Cost overruns"], answer: 1, explain: "Vault lock enforces immutable retention so backups can't be deleted before their retention expires, even by an administrator." },
        { q: "You must move 200 TB to AWS over a 500 Mbps link with a 3-week deadline. Best option?", options: ["aws s3 sync over the internet", "DataSync over the same link", "Snowball devices", "Direct Connect ordered today"], answer: 2, explain: "200 TB at 500 Mbps saturated is well over a month. Physical Snowball transfer is the practical path; a new Direct Connect circuit also takes weeks to provision." },
      ],
    },
  ],
};
