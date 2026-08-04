import type { Module } from "./types";

export const iam: Module = {
  id: "iam",
  title: "Identity & Access Management",
  blurb:
    "IAM is the service every other service asks for permission. Users, roles, policy JSON, the evaluation algorithm, STS, and the federation model real companies run on.",
  accent: "rose",
  lessons: [
    {
      slug: "iam-fundamentals",
      title: "IAM fundamentals: principals, policies & ARNs",
      summary:
        "Users, groups, roles, and policies — the four nouns behind every AWS authorization decision, and the naming scheme that identifies everything.",
      minutes: 10,
      blocks: [
        { type: "p", text: "**IAM (Identity and Access Management)** decides, for every single AWS API call, whether the caller is allowed to do that thing to that resource. It is free, global, and involved in literally everything — which is why it's the topic interviewers probe hardest." },
        { type: "diagram", name: "iam-model", caption: "A principal makes a request; IAM evaluates the applicable policies and returns allow or deny." },
        { type: "h2", text: "The vocabulary" },
        { type: "compare", caption: "The four core IAM objects.", columns: ["Object", "What it is", "When to use it"], rows: [
          { label: "User", cells: ["A long-lived identity with a password and/or access keys", "Rarely — legacy break-glass or a third-party tool that can't federate"] },
          { label: "Group", cells: ["A collection of users that shares policies", "Organising IAM users; groups are not principals and cannot be assumed"] },
          { label: "Role", cells: ["An identity with permissions but no credentials, assumed temporarily", "Almost always — humans via SSO, workloads via instance/task roles, cross-account access"] },
          { label: "Policy", cells: ["A JSON document granting or denying actions on resources", "Attached to identities (identity policy) or to resources (resource policy)"] },
        ]},
        { type: "callout", kind: "key", text: "**Roles are the default answer in modern AWS.** A role has no password and no permanent keys: you assume it and receive credentials that expire in 15 minutes to 12 hours. Nothing to leak, nothing to rotate." },
        { type: "h2", text: "Principals" },
        { type: "p", text: "A **principal** is whoever is making the request: an IAM user, an assumed role session, an AWS service (like `lambda.amazonaws.com`), another account, or a federated identity from your company's identity provider. Every request carries a principal, a set of requested actions, target resources, and context (source IP, MFA state, time, tags)." },
        { type: "h2", text: "ARNs — how AWS names everything" },
        { type: "p", text: "An **Amazon Resource Name** uniquely identifies any resource. You'll write thousands of them, so learn the shape:" },
        { type: "code", lang: "text", caption: "ARN anatomy", code: `arn:partition:service:region:account-id:resource

arn:aws:s3:::my-bucket                       # S3 buckets are global: no region/account
arn:aws:s3:::my-bucket/reports/*             # objects use a path
arn:aws:iam::123456789012:role/DeployRole    # IAM is global: no region
arn:aws:ec2:eu-west-1:123456789012:instance/i-0abc123
arn:aws:lambda:us-east-1:123456789012:function:process-orders
arn:aws:dynamodb:us-east-1:123456789012:table/Orders

# partition is 'aws', or 'aws-cn' (China) / 'aws-us-gov' (GovCloud)` },
        { type: "callout", kind: "tip", text: "Notice the double colon in S3 and IAM ARNs — those services are global, so the region and/or account fields are empty. Forgetting this is the most common cause of a policy that silently matches nothing." },
        { type: "h2", text: "Identity policies vs resource policies" },
        { type: "list", items: [
          "**Identity policy** — attached to a user, group, or role. \"This identity may do X.\"",
          "**Resource policy** — attached to the resource itself (S3 bucket policy, SQS queue policy, KMS key policy, Lambda function policy). \"These principals may do X to me.\"",
          "**Same account:** *either* an identity policy or a resource policy allowing the action is enough.",
          "**Cross-account:** you need **both** — the caller's account must allow it *and* the resource policy must allow the caller. This trips up nearly everyone the first time.",
        ]},
        { type: "code", lang: "json", caption: "An S3 bucket policy allowing another account read access", code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowPartnerReads",
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::222222222222:role/PartnerReader" },
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::shared-datasets",
      "arn:aws:s3:::shared-datasets/*"
    ]
  }]
}` },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Principal** = the identity making a request. **ARN** (Amazon Resource Name) = AWS's globally unique ID format for a resource. **Assume a role** = call STS to swap your current identity for a role's temporary credentials. **Trust policy** = the resource policy *on a role* saying who is allowed to assume it. **Least privilege** = grant only the permissions actually needed, and nothing more. **Break-glass** = an emergency identity, tightly locked and monitored, used only when normal access fails." },
        { type: "h2", text: "Why IAM users are going away" },
        { type: "p", text: "IAM users mean long-lived access keys, which end up in `.env` files, CI variables, laptops, and — regularly — public Git repositories. Modern practice replaces them: humans log in through **IAM Identity Center** (SSO) and assume roles; workloads use **instance profiles, task roles, or OIDC federation**; partners get **cross-account roles**. If you find yourself creating an IAM user, pause and ask what would break if you used a role instead." },
        { type: "callout", kind: "warn", text: "AWS scans public GitHub for leaked access keys and will quarantine your account when it finds them — after the crypto miners have already spun up GPU instances in every region. Never commit keys; use `git-secrets` or a pre-commit scanner." },
      ],
      takeaways: [
        "IAM authorises every AWS API call and is global and free — it touches everything you build.",
        "Users are long-lived identities, groups organise users, roles are assumed temporarily, policies are JSON grants.",
        "Roles + temporary credentials are the modern default; IAM users with static keys are a liability.",
        "ARNs identify resources; S3 and IAM ARNs omit region/account, which is a common policy-matching bug.",
        "Same-account access needs one allow (identity or resource policy); cross-account needs both sides to allow it.",
      ],
      flashcards: [
        { front: "Why prefer roles over IAM users?", back: "Roles issue short-lived credentials via STS — nothing permanent to leak or rotate — and can be granted to services, instances, and federated humans." },
        { front: "What's in an ARN?", back: "arn:partition:service:region:account-id:resource — with region and/or account empty for global services like S3 and IAM." },
        { front: "Cross-account access requirements", back: "Both sides must allow it: an identity policy in the caller's account AND a resource policy (or role trust policy) in the target account." },
        { front: "What is a trust policy?", back: "The resource policy attached to an IAM role that defines which principals are allowed to assume it (sts:AssumeRole)." },
      ],
      quiz: [
        { q: "Which IAM object can be attached to an EC2 instance so code on it can call AWS APIs?", options: ["An IAM user", "An IAM group", "An IAM role via an instance profile", "A bucket policy"], answer: 2, explain: "Instance profiles deliver a role's temporary credentials through the instance metadata service — no keys stored on disk." },
        { q: "A role in account A can't read a bucket in account B, even though the role's policy allows s3:GetObject. What's missing?", options: ["MFA", "A bucket policy in account B allowing the role", "A larger instance", "An IAM group"], answer: 1, explain: "Cross-account access requires an allow on both sides: the identity policy in the caller's account and the resource policy in the resource's account." },
        { q: "Which ARN is correctly formed for an S3 bucket?", options: ["arn:aws:s3:us-east-1:123456789012:my-bucket", "arn:aws:s3:::my-bucket", "arn:s3:aws:::my-bucket", "arn:aws:s3:my-bucket"], answer: 1, explain: "S3 bucket names are globally unique, so the region and account fields are empty — hence the triple colon." },
      ],
    },
    {
      slug: "policy-anatomy",
      title: "Reading and writing IAM policy JSON",
      summary:
        "Effect, Action, Resource, Condition, and Principal — plus wildcards, variables, and the condition keys that turn a broad policy into a safe one.",
      minutes: 11,
      blocks: [
        { type: "p", text: "IAM policies are small JSON documents. Once you can read one fluently you can debug most access problems in AWS, because the answer is almost always in a policy somewhere." },
        { type: "code", lang: "json", caption: "The full shape of a policy statement", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadOnlyToTeamPrefix",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::analytics-data",
        "arn:aws:s3:::analytics-data/\${aws:PrincipalTag/Team}/*"
      ],
      "Condition": {
        "Bool": { "aws:SecureTransport": "true" },
        "StringEquals": { "aws:PrincipalOrgID": "o-abc123" }
      }
    }
  ]
}` },
        { type: "h2", text: "The elements" },
        { type: "compare", caption: "What each key does.", columns: ["Element", "Meaning", "Notes"], rows: [
          { label: "Version", cells: ["Policy language version", "Always `2012-10-17`. Omitting it silently disables policy variables."] },
          { label: "Sid", cells: ["Statement ID — a human label", "Optional but hugely helpful when debugging"] },
          { label: "Effect", cells: ["`Allow` or `Deny`", "Deny always wins over Allow"] },
          { label: "Action", cells: ["Service API operations, e.g. `s3:GetObject`", "Wildcards allowed: `s3:Get*`, `s3:*`"] },
          { label: "Resource", cells: ["ARNs the statement applies to", "`*` means every resource — use deliberately"] },
          { label: "Principal", cells: ["Who the statement applies to", "**Only in resource/trust policies**, never in identity policies"] },
          { label: "Condition", cells: ["Extra tests that must pass", "Where least privilege actually gets enforced"] },
        ]},
        { type: "callout", kind: "key", text: "The single most useful habit: **scope `Resource` before you scope `Action`.** `s3:*` on one bucket is usually far safer than `s3:GetObject` on `*`." },
        { type: "h2", text: "Bucket vs object actions — the classic gotcha" },
        { type: "p", text: "Some S3 actions apply to the **bucket** (`s3:ListBucket`, `s3:GetBucketLocation`) and some to **objects** (`s3:GetObject`, `s3:PutObject`). They need different ARNs. Granting `s3:ListBucket` on `arn:aws:s3:::my-bucket/*` silently grants nothing — a bug that has cost many engineers an afternoon." },
        { type: "h2", text: "Conditions: the good part" },
        { type: "list", items: [
          "**`aws:PrincipalOrgID`** — restrict a resource policy to your AWS Organization only. Excellent default on any bucket or KMS key policy.",
          "**`aws:SourceIp`** — limit to office/VPN ranges. Careful: it breaks calls made through AWS services on your behalf.",
          "**`aws:MultiFactorAuthPresent`** — require MFA for sensitive actions like deleting backups.",
          "**`aws:RequestedRegion`** — pin activity to approved regions (very common in SCPs).",
          "**`aws:PrincipalTag` / `aws:ResourceTag`** — attribute-based access control (ABAC): grant access when the principal's `Team` tag equals the resource's `Team` tag.",
          "**`s3:x-amz-server-side-encryption`** — deny uploads that aren't encrypted.",
          "**`aws:SecureTransport`** — deny plain HTTP.",
        ]},
        { type: "code", lang: "json", caption: "ABAC: one policy that scales to every team", code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["ec2:StartInstances", "ec2:StopInstances"],
    "Resource": "arn:aws:ec2:*:*:instance/*",
    "Condition": {
      "StringEquals": {
        "aws:ResourceTag/Team": "\${aws:PrincipalTag/Team}"
      }
    }
  }]
}` },
        { type: "callout", kind: "tip", text: "ABAC is how large organisations avoid writing a policy per team. Tag the principal (via SSO attributes) and tag the resources; one policy then covers every team, and onboarding a new team requires no policy change at all." },
        { type: "h2", text: "Managed vs inline policies" },
        { type: "compare", caption: "Where policy documents live.", columns: ["Type", "Reusable?", "Use for"], rows: [
          { label: "AWS managed", cells: ["Yes — maintained by AWS", "Quick starts and common job functions; often too broad for production"] },
          { label: "Customer managed", cells: ["Yes — you own the versions", "The default choice: versioned, reusable, reviewable in IaC"] },
          { label: "Inline", cells: ["No — embedded in one identity", "A permission that must never be reused or accidentally attached elsewhere"] },
        ]},
        { type: "callout", kind: "warn", text: "`AdministratorAccess`, `PowerUserAccess`, and `*FullAccess` managed policies are convenient and almost always too much. They're fine in a sandbox; in production they're the finding an auditor will open with." },
        { type: "h2", text: "Deny statements worth copying" },
        { type: "code", lang: "json", caption: "Two guardrails you'll see everywhere", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedUploads",
      "Effect": "Deny",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::secure-bucket/*",
      "Condition": {
        "StringNotEquals": { "s3:x-amz-server-side-encryption": "aws:kms" }
      }
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::secure-bucket", "arn:aws:s3:::secure-bucket/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } },
      "Principal": "*"
    }
  ]
}` },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Statement** = one allow/deny rule inside a policy; a policy is a list of them. **Wildcard** = `*` matching any characters — powerful and dangerous. **Policy variable** = `${aws:username}` or `${aws:PrincipalTag/Team}`, substituted at evaluation time. **ABAC** (Attribute-Based Access Control) = granting access by matching tags instead of writing per-team policies. **RBAC** (Role-Based Access Control) = the older model of one role per job function. **Not-Action / NotResource** = inverted matching; correct occasionally, confusing always — prefer explicit lists." },
        { type: "h2", text: "Writing a good policy, in order" },
        { type: "steps", items: [
          { title: "Start from the actual API calls", text: "Run the workload with broad permissions in dev, then read CloudTrail (or IAM Access Analyzer's policy generation) to see exactly which actions were used." },
          { title: "Scope the resources", text: "Replace `*` with concrete ARNs or prefixes. This is where most of the risk reduction happens." },
          { title: "Add conditions", text: "Org ID, region, encryption, TLS, MFA for destructive actions." },
          { title: "Validate", text: "IAM Access Analyzer policy validation flags errors and over-permissive patterns before you deploy." },
          { title: "Test the negative case", text: "Confirm the identity *cannot* do the thing you didn't intend to allow. Untested policies are assumptions." },
        ]},
      ],
      takeaways: [
        "A statement is Effect + Action + Resource, optionally Principal (resource policies only) and Condition.",
        "Scope Resource before Action — `s3:*` on one bucket beats `s3:GetObject` on `*`.",
        "S3 bucket-level and object-level actions need different ARNs; mixing them silently grants nothing.",
        "Conditions (PrincipalOrgID, RequestedRegion, MFA, encryption, TLS) are where least privilege is really enforced.",
        "Prefer customer-managed policies; AWS `*FullAccess` policies are starting points, not production answers.",
      ],
      flashcards: [
        { front: "Which policy elements can contain a Principal?", back: "Only resource-based policies (bucket policies, queue policies, KMS key policies) and role trust policies — never identity policies." },
        { front: "Why does s3:ListBucket on arn:aws:s3:::bucket/* fail?", back: "ListBucket is a bucket-level action and needs the bucket ARN without /*. Object actions like GetObject need the /* form." },
        { front: "What does aws:PrincipalOrgID do?", back: "Restricts a resource policy to principals inside your AWS Organization — a strong default guard on shared buckets and KMS keys." },
        { front: "ABAC in one sentence", back: "Grant access by comparing principal tags to resource tags, so one policy covers every team instead of one policy per team." },
      ],
      quiz: [
        { q: "Which is the safer policy for a data-processing role?", options: ["Allow s3:* on Resource *", "Allow s3:GetObject on Resource *", "Allow s3:* on one specific bucket ARN", "Allow * on *"], answer: 2, explain: "Scoping resources contains blast radius far more effectively than scoping actions across all resources." },
        { q: "You want to block any upload that isn't KMS-encrypted. What do you use?", options: ["An Allow with a Condition", "A Deny with StringNotEquals on s3:x-amz-server-side-encryption", "A bucket ACL", "Block Public Access"], answer: 1, explain: "An explicit Deny with a negative condition guarantees the rule, since Deny always wins over any Allow." },
        { q: "What does the Version field 2012-10-17 control?", options: ["The date the policy was written", "The policy language version, required for policy variables", "The AWS API version", "Nothing"], answer: 1, explain: "It's the IAM policy language version. Omitting it (or using the older 2008 version) disables features like policy variables." },
      ],
    },
    {
      slug: "policy-evaluation",
      title: "How IAM decides: the evaluation algorithm",
      summary:
        "Explicit deny, implicit deny, SCPs, permission boundaries, session policies, and resource policies — the exact order AWS uses, and how to debug AccessDenied.",
      minutes: 10,
      blocks: [
        { type: "p", text: "When something is denied and you can't see why, the answer is always in the evaluation order. Memorise this and IAM stops being mysterious." },
        { type: "diagram", name: "iam-policy-evaluation", caption: "Every request starts denied; policies must actively allow it, and any explicit Deny ends the discussion." },
        { type: "h2", text: "The algorithm" },
        { type: "list", ordered: true, items: [
          "**Default: implicit deny.** Nothing is permitted until something allows it.",
          "**Any explicit `Deny` anywhere → DENY.** Identity policy, resource policy, SCP, boundary, session policy — one Deny ends it.",
          "**SCPs (Organizations)** — if an applicable SCP doesn't allow the action, DENY. SCPs never grant, they only cap.",
          "**Resource-control policies / VPC endpoint policies** — additional org-level or network-level caps must also allow.",
          "**Permission boundary** — if the principal has one and it doesn't allow the action, DENY.",
          "**Session policy** — if credentials were obtained with an inline session policy, it must allow the action too.",
          "**Identity policy or resource policy allows** → ALLOW. (Same account: either is enough. Cross-account: both sides needed.)",
          "**Otherwise → implicit DENY.**",
        ]},
        { type: "callout", kind: "key", text: "Think of it as **intersecting ceilings**: SCP ∩ boundary ∩ session policy ∩ identity policy. The effective permission is what survives every layer — and any single explicit Deny vetoes everything." },
        { type: "h2", text: "The three ceiling mechanisms, compared" },
        { type: "compare", caption: "They look similar and do different jobs.", columns: ["Mechanism", "Set by", "Applies to", "Typical use"], rows: [
          { label: "SCP", cells: ["Org admins", "Every principal in member accounts — the management account is exempt entirely", "Region restrictions, blocking root usage, protecting CloudTrail/Config"] },
          { label: "Permission boundary", cells: ["Account/security admins", "One user or role", "Letting developers create roles safely — the boundary caps what those roles can do"] },
          { label: "Session policy", cells: ["Whoever calls AssumeRole", "That session only", "Temporarily narrowing a broad role for a specific task"] },
        ]},
        { type: "code", lang: "json", caption: "A permission boundary that lets developers create roles safely", code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowedServicesOnly",
      "Effect": "Allow",
      "Action": ["s3:*", "dynamodb:*", "logs:*", "lambda:*"],
      "Resource": "*"
    },
    {
      "Sid": "NeverTouchSecurityControls",
      "Effect": "Deny",
      "Action": ["iam:*", "organizations:*", "cloudtrail:StopLogging", "kms:ScheduleKeyDeletion"],
      "Resource": "*"
    }
  ]
}` },
        { type: "callout", kind: "tip", text: "The delegation pattern: give developers `iam:CreateRole` **with a condition requiring `iam:PermissionsBoundary` to be set to your boundary policy**. They can then move fast creating roles, and none of those roles can ever exceed the boundary." },
        { type: "h2", text: "Debugging AccessDenied, in order" },
        { type: "steps", items: [
          { title: "Read the error message", text: "AWS error strings name the principal ARN, the action, and often the exact policy type that denied it. Read all of it — the answer is frequently right there." },
          { title: "Confirm the identity", text: "`aws sts get-caller-identity`. Wrong profile and wrong account explain a huge share of AccessDenied." },
          { title: "Run the IAM Policy Simulator", text: "It replays the request against all applicable policies and shows which statement decided the outcome." },
          { title: "Check the ceilings", text: "SCP on the OU? A permission boundary on the role? A VPC endpoint policy on the path? These are invisible in the identity's own policy view." },
          { title: "Check the resource side", text: "Bucket policy, KMS key policy, queue policy. A KMS key policy denying your role is a famously confusing 'S3 access denied'." },
          { title: "Check CloudTrail", text: "The event records the full request context — condition keys, source IP, MFA state — which usually explains a failing Condition." },
        ]},
        { type: "callout", kind: "warn", text: "The most under-diagnosed IAM error in AWS: you have full S3 permissions, the bucket policy allows you, and you still get AccessDenied — because the objects are encrypted with a **KMS key whose key policy doesn't include you**. Always check the key policy when SSE-KMS is involved." },
        { type: "h2", text: "Cross-account access, concretely" },
        { type: "code", lang: "json", caption: "Trust policy on the role in the target account (222222222222)", code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::111111111111:role/CIDeployer" },
    "Action": "sts:AssumeRole",
    "Condition": {
      "StringEquals": { "sts:ExternalId": "shared-secret-for-third-parties" },
      "Bool": { "aws:MultiFactorAuthPresent": "true" }
    }
  }]
}` },
        { type: "p", text: "And in the source account, the `CIDeployer` role needs `sts:AssumeRole` permission on that target role ARN. Two policies, two accounts, both required — that's the whole cross-account story." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Implicit deny** = the default state; not mentioned anywhere means denied. **Explicit deny** = a `\"Effect\": \"Deny\"` statement, which overrides every allow. **Permission boundary** = a policy that caps what an identity can do, without granting anything itself. **Session policy** = a policy passed at AssumeRole time that further narrows that session. **External ID** = a shared secret in a trust policy that prevents the 'confused deputy' problem when giving a third party access. **Confused deputy** = tricking a trusted service into using its permissions on an attacker's behalf." },
        { type: "h2", text: "Access Analyzer" },
        { type: "list", items: [
          "**External access findings** — flags any resource (bucket, role, key, queue) reachable from outside your account or organization. Turn this on everywhere.",
          "**Unused access findings** — surfaces roles, users, and permissions nobody has used in 90 days, which is how you actually shrink permissions over time.",
          "**Policy generation** — reads CloudTrail history and drafts a least-privilege policy from what was really used.",
          "**Policy validation** — over 100 checks for errors, security warnings, and over-permissive patterns; wire it into CI.",
        ]},
      ],
      takeaways: [
        "Requests start implicitly denied; any explicit Deny anywhere wins immediately.",
        "Effective permissions are the intersection of SCP, permission boundary, session policy, and identity policy.",
        "SCPs and boundaries never grant — they only cap what an allow can achieve.",
        "Cross-account access needs an allow in both accounts; trust policies can require ExternalId and MFA.",
        "When SSE-KMS is involved, check the KMS key policy — it's the hidden cause of many 'S3 AccessDenied' errors.",
      ],
      flashcards: [
        { front: "Order of IAM evaluation", back: "Implicit deny → explicit Deny wins → SCP must allow → boundary must allow → session policy must allow → identity or resource policy allows → otherwise deny." },
        { front: "Permission boundary vs SCP", back: "SCP caps every principal in an account/OU and is set by org admins; a boundary caps a single user or role and is typically used to let developers create roles safely." },
        { front: "What is an ExternalId for?", back: "A shared secret in a cross-account trust policy that prevents the confused-deputy problem when a third party assumes a role in your account." },
        { front: "Full S3 access but still AccessDenied — what's the classic cause?", back: "The objects use SSE-KMS and the KMS key policy doesn't grant your principal kms:Decrypt/GenerateDataKey." },
      ],
      quiz: [
        { q: "A role's identity policy allows s3:*, but an SCP on its OU denies s3:DeleteObject. What happens on a delete?", options: ["Allowed — identity policy wins", "Denied — explicit Deny in the SCP wins", "Allowed if MFA is present", "Depends on the bucket policy"], answer: 1, explain: "An explicit Deny anywhere in the chain — including an SCP — overrides every Allow." },
        { q: "You want developers to create IAM roles without being able to escalate privileges. Best mechanism?", options: ["An SCP denying iam:*", "A permission boundary required on roles they create", "Removing IAM access entirely", "MFA"], answer: 1, explain: "Require `iam:PermissionsBoundary` on role creation. Developers stay productive while every role they create is capped by your boundary." },
        { q: "What does IAM Access Analyzer's unused access finding help you do?", options: ["Find expensive resources", "Shrink permissions by revealing roles and actions unused for 90 days", "Detect malware", "Rotate keys"], answer: 1, explain: "It surfaces unused roles, users, and permissions so you can right-size access — the practical path to least privilege in an existing account." },
      ],
    },
    {
      slug: "roles-sts-and-workload-identity",
      title: "Roles, STS & how workloads get credentials",
      summary:
        "AssumeRole, instance profiles, task roles, Lambda execution roles, IRSA, and GitHub Actions OIDC — every way code gets AWS credentials without a stored secret.",
      minutes: 11,
      blocks: [
        { type: "p", text: "Every production workload needs AWS credentials, and none of them should have a stored access key. **AWS STS (Security Token Service)** is the machine that makes that possible: it mints temporary credentials on demand." },
        { type: "h2", text: "What STS returns" },
        { type: "code", lang: "json", caption: "The output of sts:AssumeRole", code: `{
  "Credentials": {
    "AccessKeyId": "ASIA...",
    "SecretAccessKey": "...",
    "SessionToken": "...",
    "Expiration": "2026-07-28T14:32:00Z"
  },
  "AssumedRoleUser": {
    "Arn": "arn:aws:sts::222222222222:assumed-role/DeployRole/vivek-deploy"
  }
}` },
        { type: "callout", kind: "tip", text: "Temporary keys start with `ASIA`; long-lived IAM user keys start with `AKIA`. If you see `AKIA` in a running system, someone stored a static key — that's a finding worth raising." },
        { type: "h2", text: "The main STS operations" },
        { type: "compare", caption: "Four ways to get a session.", columns: ["Operation", "Used by", "Notes"], rows: [
          { label: "AssumeRole", cells: ["IAM principals, cross-account access", "The everyday one; 15 min–12 h sessions"] },
          { label: "AssumeRoleWithWebIdentity", cells: ["OIDC providers — GitHub Actions, EKS pods, mobile apps", "How you get credentials with no AWS secret at all"] },
          { label: "AssumeRoleWithSAML", cells: ["Enterprise SAML IdPs (AD FS, Okta)", "Classic corporate federation"] },
          { label: "GetSessionToken", cells: ["MFA-protected calls for IAM users", "Legacy pattern; roles are preferred"] },
        ]},
        { type: "h2", text: "How each compute service gets credentials" },
        { type: "list", items: [
          "**EC2** — an **instance profile** wraps a role; the instance fetches credentials from **IMDS** at `169.254.169.254`. Enforce **IMDSv2** (token-based) to defeat SSRF attacks that otherwise steal role credentials through a vulnerable web app.",
          "**ECS / Fargate** — a **task role** (what your app uses) plus a **task execution role** (what the agent uses to pull images from ECR and write logs). Confusing these two is the most common ECS permissions bug.",
          "**Lambda** — an **execution role**; the runtime injects credentials as environment variables and rotates them automatically.",
          "**EKS** — **IRSA** (IAM Roles for Service Accounts) or **EKS Pod Identity**: a Kubernetes service account is mapped to an IAM role via OIDC, so each pod gets exactly its own permissions instead of sharing the node role.",
          "**CodeBuild / CodePipeline** — service roles per project or pipeline.",
          "**GitHub Actions / GitLab CI** — **OIDC federation**: the CI provider issues a signed identity token, AWS trusts it, and your pipeline assumes a role with zero stored secrets.",
        ]},
        { type: "code", lang: "yaml", caption: "GitHub Actions assuming an AWS role with no secrets", code: `permissions:
  id-token: write      # required to request the OIDC token
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::111111111111:role/GitHubDeploy
          aws-region: eu-west-1
      - run: aws sts get-caller-identity` },
        { type: "code", lang: "json", caption: "The trust policy that makes it safe — note the repo/branch condition", code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::111111111111:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:my-org/my-repo:ref:refs/heads/main"
      }
    }
  }]
}` },
        { type: "callout", kind: "warn", text: "If you omit the `sub` condition, **any GitHub repository in the world** can assume your role. This exact misconfiguration has caused real breaches. Always pin the org, repo, and ideally the branch or environment." },
        { type: "h2", text: "Role chaining and session limits" },
        { type: "list", items: [
          "**Role chaining** (assuming a role from an already-assumed role) caps the session at **1 hour** regardless of the role's maximum duration.",
          "**Max session duration** is per role, 1–12 hours; the console default is 1 hour.",
          "**Session tags** can be passed at AssumeRole time and used in `aws:PrincipalTag` conditions — the backbone of ABAC with SSO.",
          "**Revocation**: you can't cancel an issued session directly, but you can attach an `AWSRevokeOlderSessions` deny policy keyed on `aws:TokenIssueTime` — worth having in your incident runbook.",
        ]},
        { type: "h2", text: "Service roles vs service-linked roles" },
        { type: "p", text: "A **service role** is one you create and hand to a service (e.g. giving CodeBuild permission to write to S3). A **service-linked role** is created and managed by the service itself (e.g. `AWSServiceRoleForAutoScaling`) — you generally can't edit it, and deleting it breaks the service. Recognising the difference stops you from 'cleaning up' a role your infrastructure depends on." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**STS** = the service that issues temporary AWS credentials. **IMDS** (Instance Metadata Service) = the link-local endpoint an EC2 instance queries for its own role credentials; **IMDSv2** requires a session token, blocking SSRF theft. **OIDC** (OpenID Connect) = an identity protocol; AWS can trust an external OIDC issuer such as GitHub or an EKS cluster. **IRSA** = IAM Roles for Service Accounts, the EKS mechanism mapping a Kubernetes service account to an IAM role. **SSRF** (Server-Side Request Forgery) = tricking a server into making requests on the attacker's behalf — historically used to read IMDS. **Role chaining** = assuming a role while already using assumed-role credentials." },
        { type: "h2", text: "A rule you can apply everywhere" },
        { type: "quote", text: "If your code holds an AWS secret, you have chosen the wrong identity mechanism. There is a role for that.", cite: "The practical summary of this entire lesson" },
      ],
      takeaways: [
        "STS issues short-lived credentials (ASIA…) so no workload needs a stored access key.",
        "EC2 uses instance profiles + IMDSv2; ECS uses task roles (plus a separate execution role); Lambda uses an execution role; EKS uses IRSA/Pod Identity.",
        "CI systems should federate via OIDC — and the trust policy must pin the repo/branch `sub` claim.",
        "Role chaining caps sessions at 1 hour; session tags enable ABAC with SSO.",
        "Service-linked roles are managed by AWS services — don't delete them during cleanups.",
      ],
      flashcards: [
        { front: "ECS task role vs task execution role", back: "The task role is what your application code uses. The execution role is what the ECS agent uses to pull the image from ECR and push logs to CloudWatch." },
        { front: "Why enforce IMDSv2?", back: "IMDSv1 answers any HTTP GET, so an SSRF bug in your app can steal role credentials. IMDSv2 requires a PUT-obtained session token with a hop limit, which blocks that path." },
        { front: "How does GitHub Actions authenticate to AWS without secrets?", back: "OIDC federation: GitHub issues a signed token, AWS's OIDC provider trusts it, and the workflow calls AssumeRoleWithWebIdentity — with the trust policy pinned to the repo and branch." },
        { front: "What limits a chained role session to 1 hour?", back: "Role chaining — assuming a role using already-assumed-role credentials — is hard-capped at 1 hour regardless of the role's max session duration." },
      ],
      quiz: [
        { q: "An access key in production starts with AKIA. What does that tell you?", options: ["It's a temporary STS credential", "It's a long-lived IAM user key that should be replaced by a role", "It's a KMS key", "It's expired"], answer: 1, explain: "AKIA prefixes long-lived IAM user keys; ASIA prefixes temporary STS credentials. A static key in production is a rotation and leak risk." },
        { q: "A pod in EKS needs S3 access without granting every pod on the node the same rights. What do you use?", options: ["The node instance profile", "IRSA / EKS Pod Identity", "An IAM user secret in a Kubernetes Secret", "A bucket ACL"], answer: 1, explain: "IRSA maps a Kubernetes service account to an IAM role through OIDC, so permissions are per workload rather than shared across the node." },
        { q: "What must a GitHub OIDC trust policy include to be safe?", options: ["An IP restriction", "A condition on the sub claim pinning org/repo/branch", "MFA", "A password"], answer: 1, explain: "Without the sub condition any GitHub repository could assume the role — pin `repo:org/repo:ref:refs/heads/main` or an environment claim." },
      ],
    },
    {
      slug: "identity-center-and-best-practices",
      title: "IAM Identity Center, federation & IAM hygiene",
      summary:
        "How humans actually log in at scale, plus the operational habits — MFA, rotation, credential reports, least privilege reviews — that keep an account defensible.",
      minutes: 10,
      blocks: [
        { type: "p", text: "Everything so far has been about mechanics. This lesson is about the operating model: how a company of 200 engineers gets safe access to 60 AWS accounts without a single IAM user." },
        { type: "h2", text: "IAM Identity Center (formerly AWS SSO)" },
        { type: "list", items: [
          "**One login portal** for every account in the organization, backed by your existing identity provider (Okta, Entra ID, Google Workspace) or its own built-in directory.",
          "**Permission sets** — reusable policy bundles (e.g. `ReadOnly`, `Developer`, `Billing`) assigned to groups and provisioned into accounts as IAM roles automatically.",
          "**Short-lived credentials by default** — the CLI gets a session, not a key, via `aws sso login`.",
          "**Central offboarding** — remove someone from a group in your IdP and their access to every AWS account disappears at once.",
          "**Attribute passthrough** — IdP attributes (department, team) become session tags, which powers ABAC across all accounts.",
        ]},
        { type: "code", lang: "bash", caption: "The daily engineer workflow with Identity Center", code: `# one-time setup per profile
aws configure sso
# > SSO start URL: https://my-company.awsapps.com/start
# > SSO region: eu-west-1
# > choose account and permission set

# every morning
aws sso login --profile prod-readonly

# then work normally — credentials refresh automatically
aws s3 ls --profile prod-readonly
export AWS_PROFILE=prod-readonly` },
        { type: "callout", kind: "key", text: "The target state for human access: **zero IAM users, SSO for everyone, permission sets per job function, and every session expiring within hours.** If a laptop is stolen, access dies on its own." },
        { type: "h2", text: "Designing permission sets" },
        { type: "compare", caption: "A workable starting set.", columns: ["Permission set", "Scope", "Given to"], rows: [
          { label: "ReadOnly", cells: ["`ReadOnlyAccess` + Athena/CloudWatch query rights", "Everyone, in every account — the default"] },
          { label: "Developer", cells: ["Full rights to app services, no IAM/Org/security-tool changes, region-pinned", "Engineers in dev/staging accounts"] },
          { label: "Operator", cells: ["Restart/scale/deploy actions plus logs and dashboards", "On-call engineers in production"] },
          { label: "SecurityAudit", cells: ["`SecurityAudit` + Security Hub/GuardDuty read", "Security team, every account"] },
          { label: "BreakGlass", cells: ["`AdministratorAccess`, MFA-required, alarms on every use", "Emergencies only, checked out deliberately"] },
        ]},
        { type: "callout", kind: "tip", text: "Alarm on break-glass usage with an EventBridge rule on the `AssumeRole` CloudTrail event that pages the security channel. Nobody should be able to use admin quietly." },
        { type: "h2", text: "The hygiene checklist" },
        { type: "steps", items: [
          { title: "MFA everywhere", text: "Root, break-glass, and every human identity. Prefer hardware keys or authenticator apps over SMS." },
          { title: "No access keys for humans", text: "If a person has an `AKIA` key, there's a workflow to fix. Use SSO or `aws sso login` instead." },
          { title: "Review the credential report monthly", text: "`aws iam generate-credential-report` lists every user, key age, last use, and MFA status. Delete what's unused." },
          { title: "Rotate what you can't remove", text: "Third-party integrations that truly need keys get a documented rotation schedule and a Secrets Manager home." },
          { title: "Turn on Access Analyzer (external + unused)", text: "External findings catch accidental sharing; unused findings drive down permissions over time." },
          { title: "Alarm on the dangerous events", text: "Root login, IAM policy changes, CloudTrail stopped, MFA deactivated, access key created — all should page somebody." },
        ]},
        { type: "code", lang: "bash", caption: "Useful audit one-liners", code: `# every user, key age, MFA status, last use
aws iam generate-credential-report
aws iam get-credential-report --query Content --output text | base64 -d

# which policies does this role actually carry?
aws iam list-attached-role-policies --role-name DeployRole
aws iam list-role-policies --role-name DeployRole

# when was this access key last used, and for what service?
aws iam get-access-key-last-used --access-key-id AKIA...

# simulate before you deploy
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::111111111111:role/DeployRole \\
  --action-names s3:PutObject \\
  --resource-arns "arn:aws:s3:::prod-artifacts/*"` },
        { type: "h2", text: "Least privilege as a process, not an event" },
        { type: "p", text: "Nobody writes a perfect policy up front. The workable loop is: **start broad in dev → observe with CloudTrail and Access Analyzer → generate a tightened policy → apply it in staging → watch for breakage → promote.** Then revisit quarterly using unused-access findings. Teams that try to design least privilege on paper before the app exists usually ship something that blocks the app and gets replaced with `*` in an incident." },
        { type: "callout", kind: "warn", text: "Two permissions deserve special fear because they enable privilege escalation: **`iam:PassRole`** (hand a powerful role to a service you control) and **`iam:CreatePolicyVersion` / `iam:AttachRolePolicy`** (edit your own permissions). Always constrain `PassRole` with a `Resource` list and an `iam:PassedToService` condition." },
        { type: "code", lang: "json", caption: "Constraining PassRole properly", code: `{
  "Effect": "Allow",
  "Action": "iam:PassRole",
  "Resource": "arn:aws:iam::111111111111:role/AppTaskRole-*",
  "Condition": {
    "StringEquals": { "iam:PassedToService": "ecs-tasks.amazonaws.com" }
  }
}` },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**IdP** (Identity Provider) = the system that authenticates your people, e.g. Okta or Entra ID. **Permission set** = an Identity Center bundle of policies that becomes an IAM role inside each assigned account. **SAML / OIDC** = the two federation protocols AWS accepts. **Credential report** = a downloadable CSV of every IAM user's keys, MFA, and last-use dates. **Privilege escalation** = using a granted permission to obtain more permissions than intended. **PassRole** = the permission to hand an IAM role to an AWS service — powerful, and a common escalation path." },
        { type: "h2", text: "The interview answer" },
        { type: "p", text: "Asked \"how do you manage access on AWS?\", a strong answer sounds like: *\"Humans authenticate through our IdP into IAM Identity Center and assume permission sets — no IAM users. Workloads use roles: instance profiles, task roles, IRSA, and OIDC for CI. SCPs enforce org-wide guardrails like region and root restrictions; permission boundaries let teams create their own roles safely. We drive least privilege from CloudTrail and Access Analyzer findings, alarm on root and break-glass usage, and review the credential report monthly.\"*" },
      ],
      takeaways: [
        "IAM Identity Center gives one SSO portal, permission sets per job function, and automatic short-lived credentials across every account.",
        "The target state for humans is zero IAM users and no long-lived access keys.",
        "Break-glass admin access should exist, require MFA, and page someone whenever it's used.",
        "Least privilege is an iterative loop driven by CloudTrail, Access Analyzer, and quarterly unused-access reviews.",
        "Constrain `iam:PassRole` and policy-editing permissions — they're the classic privilege-escalation paths.",
      ],
      flashcards: [
        { front: "What is a permission set?", back: "An IAM Identity Center bundle of policies assigned to groups and provisioned as an IAM role in each assigned account — the SSO equivalent of a job-function role." },
        { front: "What does the IAM credential report show?", back: "Every IAM user with password/key age, last-used dates, and MFA status — the fastest way to find stale credentials to delete." },
        { front: "Why is iam:PassRole dangerous?", back: "It lets a principal hand a powerful role to a service they control (e.g. launch an EC2 instance with an admin role), escalating privileges. Constrain it by Resource and iam:PassedToService." },
        { front: "How should least privilege actually be achieved?", back: "Iteratively: start broad in dev, observe real usage via CloudTrail/Access Analyzer, generate and apply a tightened policy, watch for breakage, and re-review quarterly." },
      ],
      quiz: [
        { q: "A 200-engineer company needs access to 60 AWS accounts. What's the right approach?", options: ["An IAM user per person per account", "IAM Identity Center with permission sets assigned to IdP groups", "Shared root credentials in a password manager", "One admin IAM user shared by the team"], answer: 1, explain: "Identity Center federates your existing IdP, provisions roles per account automatically, issues short-lived credentials, and centralises offboarding." },
        { q: "Which permission most commonly enables privilege escalation?", options: ["s3:GetObject", "iam:PassRole without conditions", "ec2:DescribeInstances", "logs:PutLogEvents"], answer: 1, explain: "Unconstrained PassRole lets someone attach a highly privileged role to a resource they control. Always scope it by role ARN and iam:PassedToService." },
        { q: "What's the best signal that a human identity is configured wrongly?", options: ["It uses a role", "It has a long-lived AKIA access key", "It has ReadOnlyAccess", "It logs in via SSO"], answer: 1, explain: "Humans should get short-lived credentials from SSO. A long-lived key on a person is a leak waiting to happen and can't be centrally revoked quickly." },
      ],
    },
  ],
};
