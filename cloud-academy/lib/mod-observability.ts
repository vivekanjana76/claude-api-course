import type { Module } from "./types";

export const observability: Module = {
  id: "observability",
  title: "Observability & Cost",
  blurb:
    "Seeing inside your systems with metrics, logs, and traces; reviewing designs against the Well-Architected pillars; and keeping the bill under control.",
  accent: "teal",
  lessons: [
    {
      slug: "three-pillars-observability",
      title: "Metrics, logs & traces",
      summary:
        "The three pillars that let you understand a running system — plus alerting and SLOs so problems find you, not your users.",
      minutes: 9,
      blocks: [
        { type: "p", text: "You can't fix what you can't see. **Observability** is your ability to understand a system's internal state from the outside — to answer 'is it healthy?' and 'why is it slow?' without SSHing into a box. It rests on three pillars." },
        { type: "diagram", name: "observability-pillars", caption: "Metrics say something is wrong; logs and traces say why and where." },
        { type: "h2", text: "The three pillars" },
        { type: "list", items: [
          "**Metrics** — numeric measurements over time: CPU, memory, request rate, error rate, latency. Cheap to store and perfect for dashboards and alerts. They tell you *that* something is wrong.",
          "**Logs** — timestamped records of discrete events ('order 123 failed: timeout'). They tell you *what* happened. Centralize them (CloudWatch Logs, Azure Monitor Logs) so you can search across all services.",
          "**Traces** — the end-to-end journey of a single request as it hops across services, with timing at each step. They tell you *where* the time went in a distributed system.",
        ]},
        { type: "callout", kind: "key", text: "Metrics for the alarm, logs and traces for the investigation. A metric fires when latency spikes; a trace shows which service is slow; its logs show the exact error. Together they turn a 3am outage into a 20-minute fix." },
        { type: "h2", text: "The cloud tools" },
        { type: "p", text: "**AWS CloudWatch** and **Azure Monitor** are the built-in homes for metrics, logs, dashboards, and alarms. For distributed tracing there's **AWS X-Ray** and Azure's **Application Insights**. **OpenTelemetry** is the vendor-neutral standard for emitting all three signals, so you're not locked to one backend." },
        { type: "h2", text: "Alerting & SLOs" },
        { type: "p", text: "Monitoring is only useful if problems reach a human. **Alerts** fire when a metric crosses a threshold. Ground them in **SLOs** (Service Level Objectives) — explicit targets like '99.9% of requests succeed under 300ms' — so you alert on user-facing symptoms, not noise." },
        { type: "callout", kind: "warn", text: "Beware **alert fatigue**: page on symptoms that matter (error budget burning, latency SLO breached), not on every CPU blip. Too many alerts and people stop reading them — the one that matters gets missed." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Observability** = understanding a system's internal state from its outputs. **Metric** = a number tracked over time (latency, error rate). **Log** = a timestamped record of a discrete event. **Trace** = one request's end-to-end path across services, with timings. **CloudWatch / Azure Monitor** = the clouds' built-in metrics+logs+alerting. **Distributed tracing** = following a request across many services (X-Ray, App Insights). **OpenTelemetry** = a vendor-neutral standard for emitting metrics/logs/traces. **SLO** = a target for a service's reliability/latency. **Alert fatigue** = so many alerts that people ignore them." },
      ],
      takeaways: [
        "Observability = understanding a system from the outside via metrics, logs, and traces.",
        "Metrics tell you something is wrong; logs tell you what happened; traces tell you where the time went.",
        "CloudWatch/Azure Monitor cover metrics+logs+alarms; X-Ray/App Insights and OpenTelemetry handle tracing.",
        "Alert on SLO-based symptoms, not every blip, to avoid alert fatigue that hides the alert that matters.",
      ],
      flashcards: [
        { front: "The three pillars of observability?", back: "Metrics (numbers over time — that something's wrong), logs (discrete events — what happened), and traces (a request's path across services — where the time went)." },
        { front: "Which pillar do you alert on, and which do you investigate with?", back: "Alert on metrics (cheap, threshold-based); investigate with logs and traces to find what and where." },
        { front: "What is an SLO and why alert on it?", back: "A Service Level Objective is an explicit reliability/latency target (e.g. 99.9% under 300ms). Alerting on SLO breaches focuses on user-facing symptoms instead of noise." },
      ],
      quiz: [
        { q: "A request is slow across a chain of microservices and you need to find which hop is the bottleneck. Which pillar?", options: ["Metrics", "Logs", "Distributed traces", "Billing alerts"], answer: 2, explain: "A trace follows the single request end-to-end with timing at each service, pinpointing where the latency is spent." },
        { q: "What's the best basis for alerting to avoid alert fatigue?", options: ["Alert on every CPU spike", "Alert on SLO-based user-facing symptoms", "Alert on every log line", "Never alert"], answer: 1, explain: "Grounding alerts in SLOs (e.g. latency/error targets) pages people on symptoms that matter, not noise that trains them to ignore alerts." },
      ],
    },
    {
      slug: "well-architected-framework",
      title: "The Well-Architected Framework",
      summary:
        "The pillars cloud providers use to review a design — a checklist for building systems that are secure, reliable, and cost-aware.",
      minutes: 8,
      blocks: [
        { type: "p", text: "How do you know a cloud design is any good? Both AWS and Azure publish a **Well-Architected Framework** — a set of **pillars** to review any workload against. It's less a rulebook than a structured set of questions that surface risks before they become incidents or surprise bills." },
        { type: "diagram", name: "well-architected", caption: "The Well-Architected pillars — a lens for reviewing any cloud workload." },
        { type: "h2", text: "The pillars" },
        { type: "list", items: [
          "**Operational excellence** — can you run, monitor, and improve the system? (IaC, observability, automated deploys.)",
          "**Security** — least privilege, encryption, defense in depth, auditability.",
          "**Reliability** — does it withstand failure and recover? (Multi-AZ, backups, health checks, autoscaling.)",
          "**Performance efficiency** — right-sized, right-service resources that scale with demand.",
          "**Cost optimization** — paying only for what you need, and knowing where the money goes.",
          "**Sustainability** — minimizing the environmental impact of your workloads (a newer pillar).",
        ]},
        { type: "callout", kind: "key", text: "The pillars are trade-offs, not boxes to all max out. More reliability often costs more; the highest performance isn't always the cheapest. Well-Architected is about making those trade-offs **deliberately** and for the workload at hand, not by accident." },
        { type: "h2", text: "Using it" },
        { type: "p", text: "Run a **Well-Architected Review** periodically — walk a workload through the pillar questions, note the risks, and prioritize fixes. It's the same instinct as a code review, applied to architecture: a cheap, structured way to catch the single-AZ database or the wide-open IAM policy before it bites." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Well-Architected Framework** = a provider checklist of pillars to review a cloud design against. **Pillar** = one dimension of the review (security, reliability, cost, …). **Operational excellence** = your ability to run and improve the system. **Reliability** = withstanding and recovering from failure. **Performance efficiency** = using the right, right-sized resources. **Trade-off** = accepting less of one quality to gain another (e.g. cost vs redundancy). **Well-Architected Review** = periodically walking a workload through the pillars to find risks." },
      ],
      takeaways: [
        "The Well-Architected Framework reviews a workload against pillars: operational excellence, security, reliability, performance, cost, sustainability.",
        "The pillars are deliberate trade-offs, not boxes to all maximize — more reliability usually costs more.",
        "Run periodic Well-Architected Reviews to surface risks (single-AZ DB, open IAM) before they cause incidents.",
        "It's code review for architecture: a cheap, structured way to catch design risks early.",
      ],
      flashcards: [
        { front: "Name the Well-Architected pillars.", back: "Operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability — a lens for reviewing any cloud workload." },
        { front: "Why aren't the pillars boxes to all maximize?", back: "They're trade-offs: more reliability usually costs more, top performance isn't always cheapest. The goal is to make those trade-offs deliberately for the workload." },
        { front: "What is a Well-Architected Review?", back: "Periodically walking a workload through the pillar questions to surface and prioritize risks — architecture's equivalent of a code review." },
      ],
      quiz: [
        { q: "What's the right way to think about the Well-Architected pillars?", options: ["Maximize all of them equally", "Make deliberate trade-offs among them for the specific workload", "Only security matters", "Ignore them for small projects"], answer: 1, explain: "The pillars often conflict (reliability vs cost, performance vs cost); Well-Architected is about choosing trade-offs consciously for the workload at hand." },
        { q: "Which pillar covers least privilege, encryption, and auditability?", options: ["Reliability", "Security", "Cost optimization", "Sustainability"], answer: 1, explain: "Those are the hallmarks of the Security pillar; reliability is about withstanding failure, cost is about spend efficiency." },
      ],
    },
    {
      slug: "cost-optimization",
      title: "Cost optimization",
      summary:
        "The levers that keep a cloud bill sane — right-sizing, pricing models, storage tiering, egress, and budgets from day one.",
      minutes: 9,
      blocks: [
        { type: "p", text: "The cloud's pay-as-you-go model is a superpower and a footgun: it's just as easy to spend nothing as to run up a shocking bill on idle resources. **Cost optimization** is the ongoing practice of paying only for value delivered — and it's a first-class engineering concern, not a finance afterthought." },
        { type: "h2", text: "The biggest levers" },
        { type: "list", items: [
          "**Right-sizing** — match instance and database sizes to actual usage; oversized, idle resources are the most common waste.",
          "**Pricing models** — on-demand is flexible but priciest. Use **reserved instances / savings plans** for steady baseline load (big discounts for a commitment), and **spot instances** for interruptible batch work (deep discounts, can be reclaimed).",
          "**Storage tiering & lifecycle** — move cold data to cheaper tiers automatically; don't keep archival data in hot storage.",
          "**Turn off idle resources** — schedule dev/test environments to stop nights and weekends.",
        ]},
        { type: "h2", text: "The sneaky costs" },
        { type: "p", text: "Some of the biggest bills come from things that aren't a server: **data egress** (moving data out to the internet or across regions is billed and often overlooked), **cross-AZ traffic**, idle load balancers and unattached disks, and forgotten resources in unused regions. Chasing these 'invisible' costs often beats shaving compute." },
        { type: "callout", kind: "warn", text: "Egress is the classic surprise. Inbound data is usually free, but sending data *out* — to users, other regions, or the internet — costs money at scale. Architect data flows to minimize cross-region and outbound transfer." },
        { type: "h2", text: "Visibility & governance" },
        { type: "p", text: "You can't optimize what you can't see. From day one: **tag** resources (by team, project, environment) so costs are attributable; set **budgets and billing alerts** so a runaway spend pages you early; and review cost dashboards regularly. **FinOps** is the discipline of making cost a shared, continuous responsibility across engineering and finance." },
        { type: "callout", kind: "key", text: "Cost is a design input, like latency or security. Right-size, commit for steady load, use spot for the interruptible, tier storage, kill idle resources, watch egress — and make spend visible with tags, budgets, and alerts before the bill, not after." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Right-sizing** = matching resource size to actual need. **On-demand** = pay-as-you-go, most flexible and priciest. **Reserved instance / savings plan** = a discount for committing to steady usage. **Spot instance** = deeply discounted spare capacity that can be reclaimed — for interruptible work. **Egress** = data transfer *out* (to the internet/other regions), which is billed. **Tagging** = labeling resources so costs are attributable. **Budget / billing alert** = a threshold that notifies you as spend rises. **FinOps** = the practice of managing cloud cost as a shared, ongoing responsibility." },
      ],
      takeaways: [
        "Right-size resources, use reserved/savings plans for steady load and spot for interruptible work, and tier storage.",
        "Turn off idle dev/test resources; unused instances and disks are the most common waste.",
        "Watch the sneaky costs — data egress, cross-AZ/region transfer, idle load balancers, forgotten regional resources.",
        "Make spend visible from day one: tag resources, set budgets and billing alerts, and practice FinOps.",
      ],
      flashcards: [
        { front: "On-demand vs reserved vs spot pricing", back: "On-demand: flexible, priciest. Reserved/savings plans: big discounts for committing to steady baseline load. Spot: deep discounts on reclaimable spare capacity — for interruptible batch work." },
        { front: "Why is egress a classic surprise cost?", back: "Inbound data is usually free, but sending data out to the internet or across regions is billed and often overlooked — it can dominate a bill at scale." },
        { front: "What are the first cost-governance steps?", back: "Tag resources so costs are attributable, and set budgets + billing alerts so runaway spend pages you early — visibility before the bill, not after." },
      ],
      quiz: [
        { q: "You have a steady, predictable baseline of compute running 24/7. Cheapest sensible pricing?", options: ["On-demand", "Reserved instances / savings plans", "Spot instances only", "Provisioning for peak"], answer: 1, explain: "Reserved instances or savings plans give large discounts in exchange for committing to steady usage — ideal for predictable baseline load." },
        { q: "Which is a commonly overlooked cloud cost?", options: ["Inbound data transfer", "Data egress (outbound / cross-region transfer)", "Reading from a cache", "Tagging resources"], answer: 1, explain: "Egress — moving data out to the internet or across regions — is billed and frequently surprises teams, unlike usually-free inbound transfer." },
      ],
    },
  ],
};
