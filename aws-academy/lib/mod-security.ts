import type { Module } from "./types";

export const security: Module = {
  id: "security",
  title: "Security engineering on AWS",
  blurb:
    "KMS and envelope encryption, secrets and certificates, the detection stack (GuardDuty, Security Hub, Inspector, Macie), and a compliance baseline you can defend.",
  accent: "rose",
  lessons: [
    {
      slug: "encryption-and-kms",
      title: "Encryption, KMS & key management",
      summary:
        "Envelope encryption explained properly, key policies versus IAM, the difference between AWS-managed and customer-managed keys, and TLS everywhere.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Encryption on AWS is mostly a solved problem — the services do the cryptography. What you actually manage is **keys and access to them**, which is where the interesting decisions and the confusing failures live." },
        { type: "diagram", name: "encryption-flow", caption: "Data is encrypted at rest and in transit; the question is always who holds the key." },
        { type: "h2", text: "AWS KMS" },
        { type: "p", text: "**Key Management Service** stores and uses cryptographic keys inside hardware security modules. **KMS keys never leave KMS** — you send it small amounts of data or, far more commonly, ask it to encrypt a data key. Every use is logged in CloudTrail." },
        { type: "compare", caption: "The key types you'll choose between.", columns: ["Type", "Who controls it", "Use when"], rows: [
          { label: "AWS-owned", cells: ["AWS entirely, invisible to you", "Default for some services; no control, no cost, no audit trail"] },
          { label: "AWS-managed (`aws/s3`)", cells: ["AWS, in your account", "Zero-effort encryption; you can see usage but not set the key policy"] },
          { label: "Customer-managed (CMK)", cells: ["You: policy, rotation, deletion, grants", "Anything regulated, cross-account, or needing a strict audit story"] },
          { label: "Imported / custom key store", cells: ["You supply the material or a CloudHSM cluster", "Regulatory requirements about key origin"] },
        ]},
        { type: "h2", text: "Envelope encryption" },
        { type: "diagram", name: "kms-envelope", caption: "A data key encrypts the data locally; KMS encrypts the data key." },
        { type: "p", text: "KMS can only encrypt small payloads directly (4 KB), so services use **envelope encryption**: KMS generates a **data key**, the service encrypts your data locally with it (fast), then stores the **KMS-encrypted copy of the data key** alongside the data. Decryption reverses it: call KMS to unwrap the data key, then decrypt locally. This is why encrypting a 5 TB object is fast and why the audit trail shows key usage rather than data access." },
        { type: "code", lang: "json", caption: "A key policy — the resource policy on a KMS key", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnableIAMPoliciesInThisAccount",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::111111111111:root" },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "AllowApplicationUse",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::111111111111:role/OrdersApiTaskRole" },
      "Action": [
        "kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*",
        "kms:GenerateDataKey*", "kms:DescribeKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": { "kms:ViaService": "s3.eu-west-1.amazonaws.com" }
      }
    },
    {
      "Sid": "AllowKeyAdministration",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::111111111111:role/SecurityAdmin" },
      "Action": ["kms:Create*", "kms:Describe*", "kms:Enable*", "kms:List*",
                 "kms:Put*", "kms:Update*", "kms:Revoke*", "kms:Disable*",
                 "kms:ScheduleKeyDeletion", "kms:CancelKeyDeletion"],
      "Resource": "*"
    }
  ]
}` },
        { type: "callout", kind: "key", text: "**A KMS key policy is authoritative.** Unlike most AWS resources, an IAM policy granting `kms:Decrypt` does nothing unless the key policy also allows it (usually by delegating to the account root as in the first statement). This is why 'I have full admin but can't read this encrypted object' happens." },
        { type: "callout", kind: "warn", text: "Lock yourself out of a key and there is **no recovery path** — AWS cannot decrypt your data for you. Always keep a key-administration statement for a role that still exists, and be extremely careful with key policies in IaC. Scheduled deletion has a mandatory 7–30 day waiting period precisely because this is unrecoverable." },
        { type: "h2", text: "Practical KMS" },
        { type: "list", items: [
          "**Enable automatic annual rotation** on customer-managed keys — old key material is retained so previously encrypted data still decrypts transparently.",
          "**Use `kms:ViaService`** to restrict a key to being used only through a specific service, limiting misuse of the permission.",
          "**Enable S3 Bucket Keys** with SSE-KMS to cut KMS API calls (and cost) by up to 99% on high-volume buckets.",
          "**Multi-Region keys** let you decrypt in another region without re-encrypting — necessary for cross-region DR of encrypted data.",
          "**Grants** provide temporary, scoped key access for AWS services, and are what services use behind the scenes.",
          "**KMS costs** $1/key/month plus per-request charges — usually trivial, but a per-tenant-key design at scale needs sizing.",
        ]},
        { type: "h2", text: "Encryption in transit" },
        { type: "list", items: [
          "**ACM (AWS Certificate Manager)** issues free public TLS certificates that **auto-renew**, usable on CloudFront, ALB, API Gateway, and more. Certificates for CloudFront must be issued in **us-east-1**.",
          "**ACM Private CA** issues internal certificates for service-to-service mTLS.",
          "**Enforce TLS**: a bucket policy denying `aws:SecureTransport: false`, `rds.force_ssl`, and HTTPS-only listeners with a redirect from port 80.",
          "**Certificate expiry is still a classic outage** for anything ACM doesn't manage — alarm on days-to-expiry for every certificate you renew yourself.",
        ]},
        { type: "h2", text: "The encryption baseline to apply everywhere" },
        { type: "steps", items: [
          { title: "EBS encryption by default", text: "One account/region setting means every new volume and snapshot is encrypted." },
          { title: "S3 default encryption", text: "SSE-S3 minimum, SSE-KMS with Bucket Keys for sensitive data, plus a deny on unencrypted uploads." },
          { title: "RDS/Aurora encrypted at creation", text: "It can't be added in place — you'd restore an encrypted copy from a snapshot." },
          { title: "TLS everywhere", text: "ACM certificates, HTTP→HTTPS redirects, and `force_ssl` on databases." },
          { title: "Secrets in Secrets Manager", text: "Encrypted with KMS, rotated, and never in environment variables or image layers." },
          { title: "Config rules to prove it", text: "`encrypted-volumes`, `rds-storage-encrypted`, `s3-default-encryption-kms` as continuous evidence." },
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**KMS key / CMK** = the master key held inside KMS that never leaves it. **Data key** = a short-lived key KMS generates to encrypt your actual data. **Envelope encryption** = encrypting data with a data key and the data key with a KMS key. **Key policy** = the resource policy on a KMS key, which is authoritative. **HSM** (Hardware Security Module) = tamper-resistant hardware that stores keys. **kms:ViaService** = a condition restricting key use to a specific AWS service. **mTLS** = mutual TLS, where both client and server present certificates. **At rest / in transit** = data stored on disk / data crossing a network." },
      ],
      takeaways: [
        "KMS keys never leave KMS; envelope encryption uses short-lived data keys so bulk crypto stays fast and local.",
        "The key policy is authoritative — IAM alone cannot grant access to a KMS key.",
        "Customer-managed keys give policy control, rotation, and audit; AWS-managed keys give zero effort and less control.",
        "ACM provides free auto-renewing public certificates (us-east-1 for CloudFront) and a private CA for internal mTLS.",
        "Apply the baseline: EBS default encryption, S3 default encryption with a deny on unencrypted uploads, encrypted RDS at creation, TLS everywhere, secrets in Secrets Manager.",
      ],
      flashcards: [
        { front: "Why is envelope encryption used?", back: "KMS can only encrypt ~4 KB directly. It generates a data key, the service encrypts data locally with it, and KMS encrypts the data key — fast bulk crypto with centrally controlled keys." },
        { front: "Why can an account admin still get AccessDenied on a KMS key?", back: "The key policy is authoritative. If it doesn't grant access (directly or by delegating to the account root), IAM permissions alone are insufficient." },
        { front: "What does an S3 Bucket Key do?", back: "Caches a data key at bucket level so SSE-KMS objects don't each require a KMS call — cutting KMS request cost by up to 99%." },
        { front: "Where must a CloudFront ACM certificate be issued?", back: "In us-east-1, regardless of where the origin runs — CloudFront's control plane lives there." },
      ],
      quiz: [
        { q: "You need cross-region DR for KMS-encrypted data without re-encrypting it. What do you use?", options: ["A second single-region key", "Multi-Region KMS keys", "AWS-owned keys", "Client-side encryption"], answer: 1, explain: "Multi-Region keys share key material across regions, so a replica in the DR region can decrypt data encrypted in the primary." },
        { q: "What happens if a KMS key policy locks out every principal?", options: ["AWS Support restores access", "The data is unrecoverable", "IAM admin overrides it", "It auto-corrects after 24 hours"], answer: 1, explain: "AWS cannot decrypt your data. Always retain a valid key-administration statement — this is one of the few genuinely unrecoverable AWS mistakes." },
        { q: "Which condition key restricts a KMS key to use through S3 only?", options: ["aws:SourceIp", "kms:ViaService", "aws:PrincipalOrgID", "kms:KeySpec"], answer: 1, explain: "`kms:ViaService` limits key usage to requests made on your behalf by a named service endpoint, narrowing what the permission can be used for." },
      ],
    },
    {
      slug: "threat-detection",
      title: "Threat detection: GuardDuty, Security Hub & friends",
      summary:
        "The AWS detection stack, what each service actually finds, and how to turn a stream of findings into a response that happens automatically.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Prevention fails eventually. Detection is what turns a compromise into an incident you handle in an hour rather than a breach you learn about from a journalist." },
        { type: "h2", text: "The detection services" },
        { type: "compare", caption: "What each one is actually for.", columns: ["Service", "Watches", "Finds"], rows: [
          { label: "GuardDuty", cells: ["CloudTrail, VPC Flow Logs, DNS logs, EKS audit logs, S3 data events, EBS malware scan", "Crypto-mining, C2 traffic, credential exfiltration, recon, anomalous API use"] },
          { label: "Security Hub", cells: ["Findings from GuardDuty, Inspector, Macie, Config, and partners", "A single prioritised view plus automated compliance scoring against standards"] },
          { label: "Inspector", cells: ["EC2, ECR images, Lambda functions", "Software CVEs and network reachability, continuously"] },
          { label: "Macie", cells: ["S3 buckets", "PII, credentials, and sensitive data — and whether it's exposed"] },
          { label: "Detective", cells: ["Aggregated logs and findings", "Investigation graphs — 'what else did this role do?'"] },
          { label: "IAM Access Analyzer", cells: ["Resource policies and access history", "Resources shared externally, and unused permissions"] },
        ]},
        { type: "callout", kind: "key", text: "**GuardDuty is the highest value-per-effort security service on AWS.** It's a one-click enable, requires no agents, costs a fraction of a percent of most bills, and detects the things that actually happen: mining on stolen credentials, instances calling known command-and-control servers, and IAM keys being used from unusual locations." },
        { type: "h2", text: "Turning findings into action" },
        { type: "p", text: "Findings that nobody reads are worse than useless — they create a false sense of coverage. The fix is routing and automation:" },
        { type: "code", lang: "json", caption: "EventBridge rule: page on high-severity GuardDuty findings", code: `{
  "source": ["aws.guardduty"],
  "detail-type": ["GuardDuty Finding"],
  "detail": {
    "severity": [{ "numeric": [">=", 7] }]
  }
}` },
        { type: "steps", items: [
          { title: "Aggregate into Security Hub", text: "Delegate a security account as administrator so every finding from every account lands in one place." },
          { title: "Route by severity", text: "High → page on-call via EventBridge → SNS/PagerDuty. Medium → ticket. Low → dashboard and weekly review." },
          { title: "Automate containment", text: "An SSM Automation or Lambda that isolates an instance (swap to a quarantine security group), disables a suspect access key, or snapshots a volume for forensics." },
          { title: "Suppress deliberately", text: "Known-benign findings get a documented suppression rule, not a habit of ignoring the console." },
          { title: "Review the trend", text: "Finding counts by type over time show whether your baseline is improving or you've simply gone numb." },
        ]},
        { type: "h2", text: "The classic AWS compromise, and how it's caught" },
        { type: "p", text: "The most common real-world AWS incident: an access key leaks (a public repo, a compromised laptop, an SSRF-exposed instance role), and within minutes an attacker launches GPU instances in several regions for crypto-mining. **GuardDuty flags it** (`CryptoCurrency:EC2/BitcoinTool`, unusual API calls, new-region activity), **a Budget or Anomaly Detection alert fires** on the spend, and **CloudTrail shows** exactly which credential was used and what it did." },
        { type: "steps", items: [
          { title: "Contain", text: "Disable or delete the access key, revoke role sessions with an `aws:TokenIssueTime` deny policy, and detach the compromised identity's permissions." },
          { title: "Assess", text: "CloudTrail for every action taken by that principal; Detective to see the wider blast radius." },
          { title: "Eradicate", text: "Terminate resources the attacker created, in every region — check them all, not just the ones you use." },
          { title: "Recover", text: "Rotate anything the credential could read, restore affected data, and verify integrity." },
          { title: "Prevent", text: "Move that workload to a role, enforce IMDSv2, add SCP region restrictions, and add secret scanning to CI." },
        ]},
        { type: "callout", kind: "warn", text: "**Check every region during an incident.** Attackers deliberately use regions you don't monitor. If you don't operate in a region, block it with an SCP — an unused region with no alarms is the ideal place to run something you don't want found." },
        { type: "h2", text: "Application-layer protection" },
        { type: "list", items: [
          "**AWS WAF** — managed rule groups (Core, Known Bad Inputs, SQL database, IP reputation), custom rules, and **rate-based rules**. Deploy in **count mode first** to see what would be blocked before enforcing.",
          "**Shield Standard** — automatic, free L3/L4 DDoS protection at the edge; **Shield Advanced** adds a response team, cost protection, and deeper mitigations for a significant subscription fee.",
          "**AWS Network Firewall** — stateful inspection, IPS rules, and domain filtering for VPC traffic, including egress control.",
          "**Amazon Cognito** — managed user pools with MFA, hosted sign-in, and OIDC/SAML federation, so you don't build authentication yourself.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**C2 (command and control)** = infrastructure malware calls home to. **CVE** = a catalogued software vulnerability. **PII** = personally identifiable information. **Finding** = a single detection result. **Delegated administrator** = an account granted org-wide control of a security service. **Containment** = stopping the attacker's access before investigating. **Count mode** = running WAF rules in observe-only so you can measure false positives. **Rate-based rule** = blocking a source IP that exceeds a request threshold." },
        { type: "h2", text: "A defensible security baseline" },
        { type: "list", items: [
          "GuardDuty, Security Hub, and IAM Access Analyzer enabled in **every account and every region**, aggregated to a security account.",
          "Inspector on all EC2, ECR, and Lambda workloads with CI gating on critical CVEs.",
          "Organization CloudTrail with log-file validation into a locked log-archive account.",
          "SCPs blocking unused regions, root usage, and disabling of security services.",
          "EventBridge rules paging on high-severity findings and on security-critical API calls.",
          "Quarterly incident-response exercises, because a runbook nobody has run is a document, not a capability.",
        ]},
      ],
      takeaways: [
        "GuardDuty is the highest value-per-effort detection service; enable it everywhere and route findings by severity.",
        "Security Hub aggregates findings across accounts and scores you against standards like CIS and AWS FSBP.",
        "Inspector finds CVEs continuously; Macie finds sensitive data; Detective and Access Analyzer support investigation.",
        "The typical AWS compromise is a leaked key used for crypto-mining — contain by disabling the credential, then check every region.",
        "WAF in count mode first, Shield for DDoS, Network Firewall for egress control, and Cognito instead of homemade auth.",
      ],
      flashcards: [
        { front: "What does GuardDuty analyse?", back: "CloudTrail, VPC Flow Logs, DNS logs, EKS audit logs, S3 data events, and EBS volumes for malware — with no agents to deploy." },
        { front: "Why deploy WAF rules in count mode first?", back: "To measure what they *would* block against real traffic and tune out false positives before enforcement breaks legitimate users." },
        { front: "First step when an AWS access key is compromised?", back: "Contain: disable/delete the key and revoke active sessions. Investigate afterwards — every minute of valid credentials is more attacker activity." },
        { front: "Why check unused regions during an incident?", back: "Attackers deliberately operate where you don't monitor. Block unused regions with an SCP so there's nowhere unwatched to hide." },
      ],
      quiz: [
        { q: "An EC2 instance is contacting a known command-and-control domain. Which service detects this?", options: ["AWS Config", "GuardDuty", "Macie", "Trusted Advisor"], answer: 1, explain: "GuardDuty analyses DNS and VPC Flow Logs against threat intelligence, which is exactly how C2 communication is spotted." },
        { q: "Which service tells you an S3 bucket contains customer PII?", options: ["GuardDuty", "Macie", "Inspector", "Security Hub"], answer: 1, explain: "Macie is purpose-built for discovering and classifying sensitive data in S3 and reporting how exposed it is." },
        { q: "Findings pile up unread in Security Hub. What's the fix?", options: ["Turn off GuardDuty", "Route by severity with EventBridge and automate containment", "Increase retention", "Enable more standards"], answer: 1, explain: "Detection only helps if it produces action: page on high severity, ticket on medium, dashboard the rest, and automate the obvious containment steps." },
      ],
    },
    {
      slug: "compliance-and-governance",
      title: "Compliance, governance & the security review",
      summary:
        "Turning security controls into evidence, the frameworks you'll be measured against, and the questions a security review will ask about your design.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Compliance is not a separate activity from engineering — it's the requirement that your controls be **demonstrable**. Everything in this module produces evidence; governance is about making that evidence continuous rather than an annual scramble." },
        { type: "h2", text: "The frameworks you'll meet" },
        { type: "compare", caption: "What each one cares about.", columns: ["Framework", "Focus", "Where it shows up"], rows: [
          { label: "CIS AWS Foundations Benchmark", cells: ["Concrete account hardening checks", "Security Hub standard — the practical starting baseline"] },
          { label: "AWS Foundational Security Best Practices", cells: ["AWS's own control set across services", "Security Hub standard, broader than CIS"] },
          { label: "SOC 2", cells: ["Operating effectiveness of controls over time", "Enterprise sales questionnaires"] },
          { label: "ISO 27001", cells: ["An information security management system", "International enterprise procurement"] },
          { label: "PCI DSS", cells: ["Cardholder data handling and segmentation", "Anything touching payments"] },
          { label: "HIPAA / GDPR", cells: ["Health data / personal data and residency", "Healthcare and EU personal data"] },
        ]},
        { type: "callout", kind: "key", text: "**Start with the CIS AWS Foundations Benchmark in Security Hub.** It's concrete, automatically scored, and its controls (MFA on root, CloudTrail enabled everywhere, no 0.0.0.0/0 on SSH, encryption on, keys rotated) are exactly what a real attacker exploits. Passing CIS is meaningful security, not paperwork." },
        { type: "h2", text: "Where the evidence comes from" },
        { type: "list", items: [
          "**AWS Artifact** — AWS's own SOC/ISO/PCI reports covering their side of the shared responsibility model.",
          "**AWS Config** — configuration history and rule compliance over time; this is what proves a control was in place *continuously*, not just today.",
          "**CloudTrail** — who did what, with log-file validation to prove the record is intact.",
          "**Security Hub** — control-by-control pass/fail with a compliance score you can trend.",
          "**Audit Manager** — automates evidence collection and maps it to specific framework controls, which turns audit prep from weeks into hours.",
          "**Backup Audit Manager** — proves backup and retention policies are actually applied.",
        ]},
        { type: "h2", text: "Governance guardrails" },
        { type: "compare", caption: "Preventive stops it; detective finds it.", columns: ["Type", "Mechanism", "Example"], rows: [
          { label: "Preventive", cells: ["SCPs, permission boundaries, IAM policies", "Deny launching outside approved regions"] },
          { label: "Detective", cells: ["Config rules, GuardDuty, Security Hub", "Flag any unencrypted RDS instance"] },
          { label: "Responsive", cells: ["Config remediation, EventBridge + SSM Automation", "Automatically re-enable Block Public Access"] },
          { label: "Proactive", cells: ["CloudFormation Hooks, policy-as-code in CI", "Fail the pipeline before an open security group is created"] },
        ]},
        { type: "callout", kind: "tip", text: "**Move controls left.** A checkov rule that fails a pull request costs a developer 30 seconds. The same misconfiguration found by Config in production costs an incident ticket, a change request, and a conversation with an auditor. Preventive and proactive controls are cheaper than detective ones in every dimension." },
        { type: "h2", text: "The security review questions" },
        { type: "p", text: "Whether it's a formal review or a senior engineer glancing at your design, these are the questions. Being able to answer them is most of what 'security-minded engineer' means in practice." },
        { type: "list", ordered: true, items: [
          "**Identity** — who and what can access this, and how are those credentials issued and revoked?",
          "**Least privilege** — what's the broadest permission granted, and why is it necessary?",
          "**Network** — what's reachable from the internet, and what's the path from an attacker to the data?",
          "**Data** — what's classified as sensitive, where does it live, and how is it encrypted at rest and in transit?",
          "**Secrets** — where are credentials stored, who can read them, and how do they rotate?",
          "**Logging** — would we see an attacker? Which logs, retained how long, in an account they can't reach?",
          "**Detection** — what alerts, to whom, and what's the response runbook?",
          "**Blast radius** — if this component is fully compromised, what else falls?",
          "**Recovery** — what's the backup, is it immutable, and when did we last restore it successfully?",
          "**Supply chain** — where do dependencies and base images come from, and are they scanned?",
        ]},
        { type: "callout", kind: "warn", text: "The honest failure pattern isn't exotic. It's a leaked long-lived key, an over-broad IAM policy, a public storage bucket, an unpatched dependency, or a missing MFA. Spending review time on advanced threat modelling while an `AdministratorAccess` role has no MFA is optimising the wrong end." },
        { type: "h2", text: "Data protection and privacy" },
        { type: "list", items: [
          "**Classify first** — you cannot protect data proportionally if nobody has said which data matters. A simple public/internal/confidential/restricted scheme is enough to start.",
          "**Residency** — regions are the control; SCPs with `aws:RequestedRegion` enforce it, and Config proves it.",
          "**Deletion** — GDPR-style erasure requests need to reach backups, replicas, logs, and analytics copies. Design for it or discover the gap under a deadline.",
          "**Minimisation** — the safest sensitive data is data you never collected. This is a design decision, not a security control.",
        ]},
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Control** = a specific safeguard (MFA required, encryption on). **Evidence** = proof a control was operating, over a period. **Preventive vs detective** = stopping something vs noticing it. **Shift left** = catching issues earlier in the development lifecycle. **Data classification** = labelling data by sensitivity so protection is proportionate. **Data residency** = legal requirements on where data physically lives. **Supply chain security** = securing the dependencies, images, and pipelines you build from. **Audit Manager** = the AWS service that collects and maps evidence to framework controls." },
        { type: "h2", text: "The one-paragraph version" },
        { type: "quote", text: "Enforce identity with roles and MFA, keep the blast radius small with accounts and least privilege, encrypt everything with keys you control, log everywhere into somewhere the attacker can't reach, detect with GuardDuty and Security Hub, and prove it continuously with Config. Everything else is detail.", cite: "A defensible AWS security posture, compressed" },
      ],
      takeaways: [
        "Compliance means controls that are demonstrable; Config and CloudTrail provide the continuity evidence auditors need.",
        "Start with the CIS AWS Foundations Benchmark in Security Hub — its controls map to real attacks.",
        "Guardrails come in four flavours: preventive, detective, responsive, and proactive — shift as far left as you can.",
        "The security review is ten questions covering identity, network, data, secrets, logging, detection, blast radius, recovery, and supply chain.",
        "Real breaches come from leaked keys, over-broad IAM, public buckets, unpatched dependencies, and missing MFA — fix those first.",
      ],
      flashcards: [
        { front: "Which framework is the practical AWS starting baseline?", back: "The CIS AWS Foundations Benchmark, enabled as a Security Hub standard — concrete, auto-scored controls that map directly to real attack paths." },
        { front: "Preventive vs detective control", back: "Preventive stops the action (an SCP denying a region); detective notices it afterwards (a Config rule flagging an unencrypted volume)." },
        { front: "What does AWS Audit Manager do?", back: "Automates evidence collection from your AWS environment and maps it to specific framework controls, turning audit preparation from weeks into hours." },
        { front: "Why does data classification come first?", back: "You can't protect data proportionally until someone has said which data is sensitive — classification drives encryption, access, retention, and residency decisions." },
      ],
      quiz: [
        { q: "An auditor asks you to prove all EBS volumes were encrypted for the last six months. Which service answers?", options: ["CloudTrail", "AWS Config", "GuardDuty", "Trusted Advisor"], answer: 1, explain: "Config maintains configuration history and rule compliance over time — the continuity evidence auditors require, not just a point-in-time check." },
        { q: "Which control type is cheapest overall?", options: ["Detective in production", "Proactive in CI (policy-as-code)", "Manual quarterly review", "Responsive remediation"], answer: 1, explain: "Blocking a misconfiguration in a pull request costs seconds; the same issue found in production costs an incident, a change process, and an audit finding." },
        { q: "What is most often the actual cause of a cloud breach?", options: ["A zero-day in the hypervisor", "Leaked credentials or an over-permissive IAM policy", "A weak encryption algorithm", "A DDoS attack"], answer: 1, explain: "Customer-side identity and configuration mistakes dominate real incidents — which is why IAM hygiene and secret handling outrank exotic threat modelling." },
      ],
    },
  ],
};
