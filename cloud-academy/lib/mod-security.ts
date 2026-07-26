import type { Module } from "./types";

export const security: Module = {
  id: "security",
  title: "Identity & Security",
  blurb:
    "Who can do what (IAM & least privilege), protecting data with encryption and key management, and handling secrets safely.",
  accent: "amber",
  lessons: [
    {
      slug: "iam-least-privilege",
      title: "IAM: identities, roles & least privilege",
      summary:
        "The cloud's front door: users, groups, roles, and policies — and why least privilege is the rule that prevents most breaches.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**IAM** (Identity and Access Management) is the system that decides **who** can do **what** to **which** resource. It's the single most important security control in the cloud — get it right and most attacks fizzle; get it wrong and one leaked key owns your account." },
        { type: "diagram", name: "iam-model", caption: "Identities get permissions via policies; least privilege keeps those permissions minimal." },
        { type: "h2", text: "The building blocks" },
        { type: "list", items: [
          "**User** — a single identity for a person or an application, with long-lived credentials (a password or access keys).",
          "**Group** — a bundle of users you attach permissions to once (e.g. 'Developers'), so you manage access by team, not per person.",
          "**Role** — an identity with permissions that is **assumed temporarily**, handing out short-lived credentials. Services, workloads, and cross-account access should use roles, not user keys.",
          "**Policy** — a JSON document that grants or denies specific **actions** on specific **resources**. Policies attach to users, groups, or roles.",
        ]},
        { type: "callout", kind: "key", text: "Prefer **roles over long-lived keys**. A role hands out temporary credentials that auto-expire, so a leaked one is far less dangerous than a static access key that works forever. Give your EC2 instances and Lambda functions a role, never embedded keys." },
        { type: "h2", text: "Least privilege" },
        { type: "p", text: "**Least privilege** means granting the *minimum* permissions an identity needs to do its job — nothing more. Start from zero and add specific allows, rather than granting broad access and trying to claw it back. This one principle contains the blast radius of any compromise: a stolen credential can only touch what it was narrowly allowed to." },
        { type: "callout", kind: "warn", text: "Never use the **root / global admin** account for daily work, and put **MFA** on it. Root can do anything, including locking you out — create individual admin identities with scoped permissions and lock root away." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**IAM** = the cloud's login-and-permissions system (who can do what). **Identity** = a user, group, role, or service that can be granted access. **Role** = a temporary identity you 'assume' to get short-lived credentials — safer than permanent keys. **Policy** = a JSON rulebook of allowed/denied actions. **Least privilege** = give the smallest set of permissions that still works. **MFA** (multi-factor authentication) = requiring a second factor (a code/app) on top of a password. **Root account** = the all-powerful original account owner — protect it fiercely. **Principal** = whoever is making the request (the identity being authorized)." },
      ],
      takeaways: [
        "IAM decides who can do what to which resource — the cloud's most important control.",
        "Users are people/apps, groups bundle users, roles give temporary credentials, policies are JSON allow/deny rules.",
        "Prefer roles (short-lived credentials) over long-lived access keys for services and workloads.",
        "Least privilege — grant the minimum needed — contains the blast radius of any compromise; protect root with MFA.",
      ],
      flashcards: [
        { front: "IAM user vs role", back: "A user is a permanent identity with long-lived credentials; a role is assumed temporarily and hands out short-lived credentials — preferred for services and cross-account access." },
        { front: "What is least privilege?", back: "Granting an identity the minimum permissions it needs, starting from zero and adding specific allows — it limits the damage of any leaked credential." },
        { front: "What is an IAM policy?", back: "A JSON document that allows or denies specific actions on specific resources, attached to users, groups, or roles." },
      ],
      quiz: [
        { q: "An EC2 instance needs to read from an S3 bucket. What's the best way to grant it?", options: ["Embed an admin user's access keys on the instance", "Attach an IAM role with read-only access to that bucket", "Make the bucket public", "Use the root account's keys"], answer: 1, explain: "A scoped IAM role gives the instance temporary, least-privilege credentials with no long-lived keys to leak." },
        { q: "Which best describes least privilege?", options: ["Give everyone admin to move fast", "Grant the minimum permissions needed, adding specific allows from zero", "Only the root account has access", "Encrypt all data at rest"], answer: 1, explain: "Least privilege starts from no access and grants only the specific permissions required, limiting the blast radius of a compromise." },
      ],
    },
    {
      slug: "encryption-key-management",
      title: "Encryption & key management",
      summary:
        "Protecting data in transit and at rest, and how managed key services (KMS, Key Vault) hold the keys so you don't have to.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Access control decides who gets in; **encryption** protects the data itself so that even if bytes are intercepted or a disk is stolen, they're unreadable without the key. There are two fronts: data **in transit** and data **at rest**." },
        { type: "diagram", name: "encryption-flow", caption: "Encrypt data moving over the network (TLS) and data sitting on disk (managed keys)." },
        { type: "h2", text: "In transit" },
        { type: "p", text: "**Encryption in transit** protects data moving across the network using **TLS** (the S in HTTPS). It stops eavesdropping and tampering between client and server. Enforce HTTPS everywhere, redirect plain HTTP, and use TLS for internal service-to-service traffic too — the network is never assumed safe." },
        { type: "h2", text: "At rest" },
        { type: "p", text: "**Encryption at rest** scrambles stored data — disks, object storage, database volumes, backups — so a stolen physical drive or snapshot is useless. On modern clouds this is often **on by default**; the interesting question is *who controls the key*." },
        { type: "h2", text: "Managed key services" },
        { type: "p", text: "**AWS KMS** (Key Management Service) and **Azure Key Vault** create, store, rotate, and control access to encryption keys, so keys never sit in your code or config. Services integrate with them directly — 'encrypt this bucket/volume with this KMS key' — and every key use is logged for audit. You can let the provider manage keys, or bring your own for stricter control." },
        { type: "compare", caption: "The two encryption fronts.", columns: ["", "In transit", "At rest"], rows: [
          { label: "Protects against", cells: ["Eavesdropping on the network", "Stolen disks / snapshots"] },
          { label: "Mechanism", cells: ["TLS / HTTPS", "Disk/object encryption with a key"] },
          { label: "Key service", cells: ["TLS certificates", "KMS / Key Vault"] },
          { label: "Default?", cells: ["You enforce it", "Often on by default"] },
        ]},
        { type: "callout", kind: "key", text: "Encrypt both in transit and at rest, and keep keys in a managed service (KMS / Key Vault) — never hard-coded. Managed keys give you rotation, fine-grained access control, and an audit trail of every use for free." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Encryption** = scrambling data so only someone with the key can read it. **In transit** = data moving over the network; **at rest** = data stored on disk. **TLS** = the protocol behind HTTPS that encrypts a network connection. **KMS / Key Vault** = a managed service that creates, stores, and controls encryption keys. **Key rotation** = periodically replacing a key to limit exposure. **BYOK** (bring your own key) = supplying your own key material instead of provider-generated. **Envelope encryption** = encrypting data with a data key, then encrypting that key with a master key in KMS." },
      ],
      takeaways: [
        "Encrypt data in transit with TLS/HTTPS (you enforce it) and at rest on disks/objects/backups (often default).",
        "The key question for at-rest encryption is who controls the key.",
        "Managed key services (AWS KMS, Azure Key Vault) create, store, rotate, and audit keys so they're never in your code.",
        "Managed keys give rotation, fine-grained access control, and an audit trail of every use.",
      ],
      flashcards: [
        { front: "Encryption in transit vs at rest", back: "In transit protects data moving over the network (TLS/HTTPS) against eavesdropping; at rest protects stored data (disks, objects, backups) against stolen media." },
        { front: "What does AWS KMS / Azure Key Vault do?", back: "Creates, stores, rotates, and controls access to encryption keys — with audit logging — so keys never live in your code or config." },
        { front: "Is encryption at rest usually on by default?", back: "Often yes on modern clouds; the important decision is who manages and controls the key (provider-managed vs bring-your-own)." },
      ],
      quiz: [
        { q: "Which protects data against being read off a stolen disk snapshot?", options: ["Encryption in transit (TLS)", "Encryption at rest", "A security group", "A load balancer"], answer: 1, explain: "Encryption at rest scrambles stored data, so a stolen disk or snapshot is unreadable without the key." },
        { q: "Where should encryption keys live?", options: ["Hard-coded in the app config", "In a managed key service like KMS or Key Vault", "In a public S3 bucket", "In the database alongside the data"], answer: 1, explain: "Managed key services store keys securely, control access, rotate them, and log every use — never hard-code keys." },
      ],
    },
    {
      slug: "secrets-and-security-posture",
      title: "Secrets & security posture",
      summary:
        "Handling API keys, passwords, and connection strings safely — plus the defense-in-depth habits that harden a cloud account.",
      minutes: 8,
      blocks: [
        { type: "p", text: "Applications need **secrets** — database passwords, API keys, connection strings, tokens. Where those secrets live is a make-or-break security decision, and it's one teams get wrong constantly by committing them to source control." },
        { type: "h2", text: "Secrets management" },
        { type: "p", text: "A **secrets manager** — **AWS Secrets Manager** / **Azure Key Vault** (secrets), or the lighter **SSM Parameter Store** — stores secrets encrypted, controls access via IAM, and lets applications fetch them at runtime. The best of them also **rotate** secrets automatically (e.g. cycling a database password on a schedule) so a leaked value has a short shelf life." },
        { type: "callout", kind: "warn", text: "Never commit secrets to Git, bake them into container images, or paste them into environment variables in plain config. Leaked keys in public repos are scraped within minutes. If a secret ever touches source control, rotate it immediately — deleting the commit is not enough." },
        { type: "h2", text: "Defense in depth" },
        { type: "p", text: "No single control is enough; **defense in depth** layers many so that one failure doesn't mean a breach." },
        { type: "diagram", name: "security-layers", caption: "Layered controls — identity, network, and data — so no single failure is fatal." },
        { type: "list", items: [
          "**Identity** — least-privilege IAM, MFA everywhere, no shared or root credentials.",
          "**Network** — private subnets, security groups/NACLs, and a WAF for public endpoints (covered in Networking).",
          "**Data** — encryption in transit and at rest, secrets in a manager, backups.",
          "**Detection** — audit logs (CloudTrail / Azure Activity Log), config monitoring, and alerts on anomalous activity.",
        ]},
        { type: "h2", text: "The account baseline" },
        { type: "p", text: "A minimal hardening checklist for any new account: enable MFA on all users and root, turn on account-wide audit logging, enforce encryption defaults, apply least-privilege IAM, and set up billing and security alerts. These few steps prevent the majority of real-world incidents." },
        { type: "callout", kind: "key", text: "Security is layered and continuous, not a one-time setting. Combine least-privilege identity, encryption, managed secrets, and audit logging — and assume any single layer can fail, so another catches it." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Secret** = a sensitive value like a password, API key, or token. **Secrets manager** = a service that stores secrets encrypted and hands them to apps at runtime (AWS Secrets Manager, Azure Key Vault). **Secret rotation** = automatically replacing a secret on a schedule. **Defense in depth** = layering multiple independent controls. **Audit log** = a record of every action taken in the account (CloudTrail / Azure Activity Log). **CloudTrail** = AWS's service that logs API calls for audit and forensics. **Security posture** = the overall strength of your security controls." },
      ],
      takeaways: [
        "Store secrets in a secrets manager (AWS Secrets Manager / Azure Key Vault) with IAM access control and automatic rotation — never in Git or images.",
        "If a secret touches source control, rotate it immediately; deleting the commit isn't enough.",
        "Defense in depth layers identity, network, data, and detection controls so one failure isn't a breach.",
        "A new-account baseline: MFA everywhere, audit logging on, encryption defaults, least-privilege IAM, billing/security alerts.",
      ],
      flashcards: [
        { front: "Where should application secrets live?", back: "In a secrets manager (AWS Secrets Manager / Azure Key Vault) — encrypted, IAM-controlled, fetched at runtime, ideally auto-rotated. Never in Git or container images." },
        { front: "What is defense in depth?", back: "Layering multiple independent security controls (identity, network, data, detection) so that the failure of any one layer doesn't cause a breach." },
        { front: "A secret leaked into a Git commit — what now?", back: "Rotate it immediately. Removing the commit isn't enough because it may already have been cloned or scraped." },
      ],
      quiz: [
        { q: "You need your app to use a database password securely. Best approach?", options: ["Commit it to the repo's config file", "Store it in a secrets manager and fetch it at runtime with an IAM role", "Email it to the team", "Put it in a public S3 bucket"], answer: 1, explain: "A secrets manager stores it encrypted with IAM-controlled access and can rotate it; the app fetches it at runtime via a role." },
        { q: "What is the core idea of defense in depth?", options: ["One very strong firewall is enough", "Layer multiple controls so one failure isn't a breach", "Encrypt everything and ignore IAM", "Only the root account needs MFA"], answer: 1, explain: "Defense in depth layers identity, network, data, and detection controls so that a single failure is caught by another layer." },
      ],
    },
  ],
};
