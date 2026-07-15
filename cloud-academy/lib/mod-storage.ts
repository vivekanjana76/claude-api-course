import type { Module } from "./types";

export const storage: Module = {
  id: "storage",
  title: "Storage",
  blurb: "Object, block, and file storage; durability and tiers; and how object storage became the backbone of the cloud.",
  accent: "teal",
  lessons: [
    {
      slug: "storage-types",
      title: "Object, block & file storage",
      summary:
        "The three fundamental storage shapes, how they differ, and how to pick the right one by access pattern.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Cloud storage comes in three fundamental shapes. They're not interchangeable — each is built for a different **access pattern**, and picking wrong means poor performance or needless cost." },
        { type: "diagram", name: "storage-types", caption: "Object, block, and file storage — three shapes for three access patterns." },
        { type: "h2", text: "Object storage" },
        { type: "p", text: "**Object storage** (AWS **S3**, Azure **Blob Storage**) keeps files as **objects** in a flat namespace called a **bucket** (or container), each addressed by a key and reached over HTTP. It's effectively infinite, extremely durable, and cheap — but you read/write whole objects, not parts. It's the default home for media, backups, logs, static websites, and data lakes." },
        { type: "callout", kind: "key", text: "Object storage is the backbone of the cloud. Its combination of near-infinite scale, high durability, low cost, and a simple HTTP API makes it the default place to put almost any blob of data." },
        { type: "h2", text: "Block storage" },
        { type: "p", text: "**Block storage** (AWS **EBS**, Azure **Managed Disks**) is a raw virtual disk attached to a single VM, like an SSD. The OS formats it with a filesystem and reads/writes at the block level, so it's fast and low-latency — the right choice for **boot volumes and databases**. A block volume normally attaches to one VM at a time and lives in a single AZ." },
        { type: "h2", text: "File storage" },
        { type: "p", text: "**File storage** (AWS **EFS**, Azure **Files**) exposes a shared filesystem over NFS or SMB that **many VMs can mount at once**. It's the natural fit for shared application content and lift-and-shift of legacy apps that expect a network file share." },
        { type: "compare", caption: "Choosing by access pattern.", columns: ["Type", "Access", "Shared?", "Typical use"], rows: [
          { label: "Object", cells: ["Whole objects over HTTP", "Yes (many clients)", "Media, backups, data lakes, static sites"] },
          { label: "Block", cells: ["Block-level, needs a filesystem", "One VM at a time", "Boot disks, databases"] },
          { label: "File", cells: ["File-level over NFS/SMB", "Many VMs mount it", "Shared app files, legacy lift-and-shift"] },
        ]},
        { type: "callout", kind: "warn", text: "Don't try to run a database on object storage or serve millions of tiny web requests from a single block volume. Match the shape to the pattern: object for scale & HTTP, block for one fast disk, file for shared mounts." },
        { type: "callout", kind: "note", title: "Jargon, decoded", text: "**Object storage** = storing whole files (called objects) fetched by name over HTTP — think Google Drive at massive scale (S3, Azure Blob). **Block storage** = a raw virtual hard disk you attach to one VM (EBS, Azure Disk). **File storage** = a shared folder several machines mount at once. **Blob** = any lump of data (a Binary Large OBject) — an image, video, or backup. **Durability** = the odds your data is never lost. **HTTP API** = fetching/storing data via web requests instead of a filesystem." },
      ],
      takeaways: [
        "Object storage (S3/Blob): flat buckets, HTTP API, near-infinite scale — the cloud's default blob store.",
        "Block storage (EBS/Managed Disks): a raw fast disk for one VM — boot volumes and databases.",
        "File storage (EFS/Azure Files): a shared NFS/SMB filesystem many VMs mount at once.",
        "Pick by access pattern, not habit: object for scale, block for a single fast disk, file for sharing.",
      ],
      flashcards: [
        { front: "What is object storage and its AWS/Azure names?", back: "Files stored as objects in flat buckets, addressed by key over HTTP; near-infinite and cheap. AWS S3, Azure Blob Storage." },
        { front: "Block vs file storage", back: "Block = a raw disk attached to one VM (EBS/Managed Disk), needs a filesystem. File = a shared NFS/SMB filesystem many VMs mount (EFS/Azure Files)." },
        { front: "Where do backups, media, and data lakes belong?", back: "Object storage — it's cheap, massively scalable, durable, and reachable over a simple HTTP API." },
      ],
      quiz: [
        { q: "You need one fast disk for a database on a single VM. Which storage type?", options: ["Object", "Block", "File", "CDN"], answer: 1, explain: "Block storage (EBS/Managed Disk) is a low-latency raw disk for a single VM — ideal for a database." },
        { q: "Which storage type can many VMs mount at the same time?", options: ["Block", "File", "Boot volume", "Instance store"], answer: 1, explain: "File storage (EFS/Azure Files) exposes a shared NFS/SMB filesystem that multiple VMs mount concurrently." },
      ],
    },
    {
      slug: "durability-tiers-lifecycle",
      title: "Durability, tiers & lifecycle",
      summary:
        "Why object storage almost never loses data, how storage classes trade access speed for cost, and how lifecycle rules automate savings.",
      minutes: 9,
      blocks: [
        { type: "p", text: "Two properties define storage economics and safety: **durability** (will my data still be there?) and **tiering** (how much do I pay to keep it, versus to read it?)." },
        { type: "h2", text: "Durability vs availability" },
        { type: "list", items: [
          "**Durability** = the probability your data is *not lost*. Object storage advertises **eleven nines** (99.999999999%) by transparently replicating every object across multiple devices and AZs. Losing data is astronomically unlikely.",
          "**Availability** = the probability you can *access* it right now. This is lower than durability (e.g. 99.9%) and varies by storage class.",
        ]},
        { type: "callout", kind: "key", text: "Durability and availability are different guarantees. Your data can be perfectly durable (safely stored) yet briefly unavailable (a service blip). Object storage optimizes durability aggressively via cross-AZ replication." },
        { type: "h2", text: "Storage classes / tiers" },
        { type: "p", text: "Not all data is accessed equally. **Storage tiers** let you pay less to store data you rarely read, in exchange for higher retrieval cost or latency." },
        { type: "diagram", name: "storage-tiers", caption: "Hotter tiers cost more to store but are instant and cheap to read; colder tiers invert that." },
        { type: "compare", caption: "Object storage tiers (S3 / Azure Blob).", columns: ["Tier", "Access", "Store cost", "Good for"], rows: [
          { label: "Hot / Standard", cells: ["Instant", "Highest", "Actively used data"] },
          { label: "Cool / Infrequent", cells: ["Instant", "Lower", "Backups, older logs (read rarely)"] },
          { label: "Archive / Glacier", cells: ["Minutes–hours", "Lowest", "Compliance, long-term retention"] },
          { label: "Intelligent-Tiering", cells: ["Instant", "Auto", "Unknown/changing access patterns"] },
        ]},
        { type: "h2", text: "Lifecycle rules" },
        { type: "p", text: "You don't move data by hand. A **lifecycle policy** automatically transitions objects to colder tiers as they age and deletes them past a retention date — e.g. 'after 30 days move to Infrequent Access, after 365 days move to Archive, after 7 years delete.' This is one of the highest-ROI cost optimizations in the cloud." },
        { type: "callout", kind: "tip", text: "Enable **versioning** to keep old copies and recover from accidental overwrites or deletes, and turn on **encryption at rest** (usually the default now). Both cost little and save you from bad days." },
        { type: "callout", kind: "warn", text: "Archive tiers are cheap to store but slow *and* pricey to retrieve. Don't put data you'll read often in Glacier to save a few cents — a large restore can cost far more than you saved." },
      ],
      takeaways: [
        "Durability (won't lose data — 'eleven nines' via cross-AZ replication) differs from availability (can access it now).",
        "Storage tiers trade store cost against retrieval speed/cost: hot for active data, archive for cold retention.",
        "Lifecycle policies auto-transition objects to colder tiers and expire them — a top cost optimization.",
        "Enable versioning and encryption at rest; use archive only for genuinely cold data.",
      ],
      flashcards: [
        { front: "Durability vs availability", back: "Durability = probability data isn't lost (object storage ~11 nines). Availability = probability you can access it right now (lower, varies by class)." },
        { front: "How does object storage achieve eleven nines?", back: "By transparently replicating every object across multiple devices and Availability Zones." },
        { front: "What does a lifecycle policy do?", back: "Automatically transitions objects to cheaper/colder tiers as they age and deletes them past a retention date — automating cost savings." },
      ],
      quiz: [
        { q: "Your data is safely stored but a service blip briefly blocks access. Which property is affected?", options: ["Durability", "Availability", "Elasticity", "Latency of the CDN"], answer: 1, explain: "Durability is about not losing data; availability is about being able to access it right now — the blip hits availability." },
        { q: "Which is the best fit for the Archive/Glacier tier?", options: ["A frequently read product catalog", "Seven-year compliance records read almost never", "Active user uploads", "A website's homepage assets"], answer: 1, explain: "Archive tiers are cheapest to store but slow/costly to retrieve — ideal for rarely accessed long-term retention." },
      ],
    },
  ],
};
