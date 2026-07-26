import type { DiagramName } from "@/lib/types";

/* ---------- shared palette ---------- */
const C = {
  ink: "#0F1826",
  soft: "#293445",
  muted: "#5C6A80",
  line: "#C4D5E8",
  canvas: "#F1F5FB",
  card: "#FFFFFF",
  iris: "#2563EB", // azure blue (primary)
  irisSoft: "#E7EFFD",
  teal: "#0E9BB5", // cyan
  tealSoft: "#E1F5F9",
  amber: "#ED8B00", // AWS orange
  amberSoft: "#FBEED6",
  rose: "#C43E86", // Azure magenta
  roseSoft: "#FAE7F1",
};

/* ---------- primitives ---------- */
function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  fill = C.card,
  stroke = C.line,
  text = C.ink,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  fill?: string;
  stroke?: string;
  text?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={accent ? C.irisSoft : fill}
        stroke={accent ? C.iris : stroke}
        strokeWidth={accent ? 2 : 1.5}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 6 : y + h / 2 + 5}
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize={15}
        fontWeight={600}
        fill={accent ? C.iris : text}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 13}
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize={11.5}
          fill={C.muted}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = C.muted,
  dashed = false,
  flow = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  dashed?: boolean;
  flow?: boolean;
}) {
  const id = `arr-${x1}-${y1}-${x2}-${y2}`.replace(/\./g, "");
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? "5 5" : flow ? "6 6" : undefined}
        markerEnd={`url(#${id})`}
        className={flow ? "animate-flow" : undefined}
      />
    </g>
  );
}

function Cap({ x, y, text, color = C.muted }: { x: number; y: number; text: string; color?: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={color}>
      {text}
    </text>
  );
}

function Frame({ children, h = 320 }: { children: React.ReactNode; h?: number }) {
  return (
    <svg viewBox={`0 0 800 ${h}`} width="100%" className="block">
      {children}
    </svg>
  );
}

/* ---------- diagrams ---------- */

// IaaS / PaaS / SaaS — how much the provider manages vs you.
function ServiceModels() {
  const layers = ["Applications", "Runtime & Data", "OS & Middleware", "Virtualization", "Servers & Network"];
  const cols = [
    { t: "On-prem", providerFrom: 5, c: C.muted },
    { t: "IaaS", providerFrom: 3, c: C.amber },
    { t: "PaaS", providerFrom: 1, c: C.teal },
    { t: "SaaS", providerFrom: 0, c: C.iris },
  ];
  const cw = 165,
    gap = 18,
    x0 = 40,
    rowH = 32,
    y0 = 66;
  return (
    <Frame h={300}>
      {cols.map((col, ci) => {
        const x = x0 + ci * (cw + gap);
        return (
          <g key={ci}>
            <text x={x + cw / 2} y={50} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={col.c}>
              {col.t}
            </text>
            {layers.map((l, li) => {
              const isProvider = li >= col.providerFrom;
              const y = y0 + li * (rowH + 4);
              return (
                <g key={li}>
                  <rect
                    x={x}
                    y={y}
                    width={cw}
                    height={rowH}
                    rx={6}
                    fill={isProvider ? col.c : C.card}
                    opacity={isProvider ? 0.18 : 1}
                    stroke={isProvider ? col.c : C.line}
                    strokeWidth={1.3}
                  />
                  <text x={x + cw / 2} y={y + rowH / 2 + 4} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={isProvider ? col.c : C.soft} fontWeight={isProvider ? 600 : 400}>
                    {ci === 0 ? l : isProvider ? "provider" : "you"}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <Cap x={400} y={286} text="Shaded = the cloud provider manages it. Move right → you manage less." />
    </Frame>
  );
}

// Shared responsibility model.
function SharedResponsibility() {
  return (
    <Frame h={280}>
      <rect x={40} y={60} width={340} height={150} rx={12} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={210} y={90} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={15} fontWeight={700} fill={C.iris}>
        Provider — security OF the cloud
      </text>
      {["Physical data centers", "Hardware & network", "Hypervisor / host OS", "Managed service internals"].map((t, i) => (
        <text key={i} x={210} y={120 + i * 22} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.soft}>
          {t}
        </text>
      ))}
      <rect x={420} y={60} width={340} height={150} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={2} />
      <text x={590} y={90} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={15} fontWeight={700} fill={C.amber}>
        You — security IN the cloud
      </text>
      {["Data & encryption keys", "IAM users, roles, policies", "OS/app patching (on VMs)", "Network & firewall config"].map((t, i) => (
        <text key={i} x={590} y={120 + i * 22} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.soft}>
          {t}
        </text>
      ))}
      <Cap x={400} y={250} text="The line shifts left as you use more managed services (VM → container → serverless)." />
    </Frame>
  );
}

// Regions → Availability Zones → data centers.
function RegionsAz() {
  const azs = [130, 340, 550];
  return (
    <Frame h={300}>
      <rect x={40} y={50} width={720} height={200} rx={16} fill="none" stroke={C.iris} strokeWidth={2} strokeDasharray="7 6" />
      <text x={60} y={44} fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.iris}>
        Region (e.g. us-east-1 / East US)
      </text>
      {azs.map((x, i) => (
        <g key={i}>
          <rect x={x} y={80} width={160} height={140} rx={12} fill={C.card} stroke={C.teal} strokeWidth={1.6} />
          <text x={x + 80} y={104} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.teal}>
            AZ {String.fromCharCode(97 + i)}
          </text>
          {[0, 1].map((d) => (
            <g key={d}>
              <rect x={x + 20 + d * 66} y={122} width={54} height={80} rx={7} fill={C.tealSoft} stroke={C.teal} strokeWidth={1} />
              <text x={x + 47 + d * 66} y={166} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.soft}>
                DC
              </text>
            </g>
          ))}
        </g>
      ))}
      <Cap x={400} y={276} text="A Region holds ≥2 isolated Availability Zones; each AZ is one+ physical data centers. Spread across AZs for HA." />
    </Frame>
  );
}

// AWS ↔ Azure service name mapping.
function AwsVsAzure() {
  const rows = [
    ["Virtual machines", "EC2", "Virtual Machines"],
    ["Serverless functions", "Lambda", "Azure Functions"],
    ["Object storage", "S3", "Blob Storage"],
    ["Managed SQL", "RDS", "Azure SQL Database"],
    ["Kubernetes", "EKS", "AKS"],
    ["Virtual network", "VPC", "VNet"],
  ];
  const y0 = 70;
  return (
    <Frame h={330}>
      <text x={220} y={50} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.muted}>
        Concept
      </text>
      <text x={470} y={50} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.amber}>
        AWS
      </text>
      <text x={660} y={50} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>
        Azure
      </text>
      {rows.map((r, i) => {
        const y = y0 + i * 42;
        return (
          <g key={i}>
            <text x={220} y={y + 18} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fill={C.soft}>
              {r[0]}
            </text>
            <rect x={385} y={y} width={170} height={30} rx={7} fill={C.amberSoft} stroke={C.amber} strokeWidth={1.2} />
            <text x={470} y={y + 19} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.ink}>
              {r[1]}
            </text>
            <rect x={575} y={y} width={170} height={30} rx={7} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.2} />
            <text x={660} y={y + 19} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.ink}>
              {r[2]}
            </text>
          </g>
        );
      })}
      <Cap x={400} y={322} text="Same concepts, different names — learn the pattern once, map it to either cloud." />
    </Frame>
  );
}

// Compute spectrum: VM → container → serverless.
function ComputeSpectrum() {
  const stops = [
    { t: "Bare metal", s: "you rack it", c: C.muted },
    { t: "Virtual machine", s: "EC2 / Azure VM", c: C.amber },
    { t: "Container", s: "ECS / AKS", c: C.teal },
    { t: "Serverless", s: "Lambda / Functions", c: C.iris },
  ];
  const w = 165,
    gap = 15,
    x0 = 45;
  return (
    <Frame h={250}>
      <line x1={45} y1={200} x2={755} y2={200} stroke={C.line} strokeWidth={2} />
      {stops.map((s, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={i}>
            <Node x={x} y={70} w={w} h={70} label={s.t} sub={s.s} fill={C.card} stroke={s.c} />
            <line x1={x + w / 2} y1={140} x2={x + w / 2} y2={196} stroke={s.c} strokeWidth={1.5} strokeDasharray="4 4" />
            <circle cx={x + w / 2} cy={200} r={4} fill={s.c} />
          </g>
        );
      })}
      <text x={70} y={230} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.amber}>
        ← more control, more ops
      </text>
      <text x={730} y={230} textAnchor="end" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.iris}>
        less ops, faster to ship →
      </text>
    </Frame>
  );
}

// Auto scaling group behind a load balancer.
function AutoScaling() {
  return (
    <Frame h={300}>
      <Node x={40} y={125} w={120} h={56} label="Users" fill={C.card} stroke={C.muted} />
      <Node x={230} y={120} w={150} h={66} label="Load balancer" sub="health checks" accent />
      <rect x={445} y={60} width={315} height={190} rx={14} fill="none" stroke={C.teal} strokeWidth={1.6} strokeDasharray="7 6" />
      <text x={602} y={52} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.teal}>
        Auto Scaling Group (min 2 · max 6)
      </text>
      {[0, 1, 2].map((i) => (
        <Node key={i} x={465 + i * 100} y={90} w={80} h={54} label={`VM ${i + 1}`} fill={C.tealSoft} stroke={C.teal} />
      ))}
      <Node x={465} y={170} w={80} h={48} label="+VM" sub="scale out" fill={C.amberSoft} stroke={C.amber} />
      <Arrow x1={162} y1={153} x2={226} y2={153} />
      <Arrow x1={382} y1={153} x2={442} y2={117} color={C.teal} flow />
      <Cap x={602} y={276} text="Target-tracking policy adds/removes VMs on CPU or request count — pay for what you use." />
    </Frame>
  );
}

// Load balancer fanning out to instances across AZs.
function LoadBalancer() {
  const targets = [
    { x: 470, y: 60, az: "AZ-a" },
    { x: 470, y: 135, az: "AZ-b" },
    { x: 470, y: 210, az: "AZ-c" },
  ];
  return (
    <Frame h={300}>
      <Node x={40} y={130} w={120} h={56} label="Client" fill={C.card} stroke={C.muted} />
      <Node x={230} y={122} w={160} h={70} label="Load balancer" sub="L4 (NLB) / L7 (ALB)" accent />
      {targets.map((t, i) => (
        <g key={i}>
          <Node x={t.x} y={t.y} w={160} h={54} label={`Target ${i + 1}`} sub={t.az} fill={C.tealSoft} stroke={C.teal} />
          <Arrow x1={392} y1={157} x2={t.x - 4} y2={t.y + 27} color={C.teal} />
        </g>
      ))}
      <Arrow x1={162} y1={158} x2={226} y2={158} />
      <Cap x={400} y={288} text="Spreads traffic across healthy targets in multiple AZs; a failed target is drained automatically." />
    </Frame>
  );
}

// Object vs block vs file storage.
function StorageTypes() {
  const kinds = [
    { t: "Object", s: "S3 / Blob", d: "flat buckets · HTTP API · massive scale", c: C.iris, ex: "media, backups, data lakes" },
    { t: "Block", s: "EBS / Managed Disk", d: "raw volume attached to one VM", c: C.amber, ex: "boot disks, databases" },
    { t: "File", s: "EFS / Azure Files", d: "shared POSIX/SMB mount", c: C.teal, ex: "shared app files, lift-and-shift" },
  ];
  return (
    <Frame h={280}>
      {kinds.map((k, i) => {
        const x = 45 + i * 245;
        return (
          <g key={i}>
            <rect x={x} y={60} width={225} height={160} rx={14} fill={C.card} stroke={k.c} strokeWidth={1.8} />
            <text x={x + 112} y={92} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={16} fontWeight={700} fill={k.c}>
              {k.t} storage
            </text>
            <text x={x + 112} y={112} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
              {k.s}
            </text>
            <foreignObject x={x + 14} y={126} width={197} height={80}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "#293445", textAlign: "center", lineHeight: 1.5 }}>
                {k.d}
              </div>
            </foreignObject>
            <text x={x + 112} y={208} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontStyle="italic" fill={C.muted}>
              {k.ex}
            </text>
          </g>
        );
      })}
      <Cap x={400} y={262} text="Pick by access pattern: object for scale & HTTP, block for a single fast disk, file for shared mounts." />
    </Frame>
  );
}

// Storage tiers hot → cold.
function StorageTiers() {
  const tiers = [
    { t: "Hot / Standard", s: "ms access · $$$ storage · $ retrieval", c: C.amber },
    { t: "Cool / Infrequent", s: "ms access · $$ storage · $$ retrieval", c: C.teal },
    { t: "Archive / Glacier", s: "mins–hours · $ storage · $$$ retrieval", c: C.iris },
  ];
  return (
    <Frame h={250}>
      {tiers.map((t, i) => {
        const y = 60 + i * 56;
        return (
          <g key={i}>
            <rect x={60} y={y} width={640 - i * 60} height={44} rx={9} fill={C.card} stroke={t.c} strokeWidth={1.6} />
            <text x={80} y={y + 27} fontFamily="var(--font-sans)" fontSize={14} fontWeight={600} fill={t.c}>
              {t.t}
            </text>
            <text x={640 - i * 60 + 40} y={y + 27} fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>
              {t.s}
            </text>
          </g>
        );
      })}
      <Cap x={400} y={240} text="Lifecycle policies move objects hot → cold as they age. Colder = cheaper to store, pricier & slower to read." />
    </Frame>
  );
}

// CDN edge caching.
function Cdn() {
  const edges = [
    { x: 300, y: 55 },
    { x: 300, y: 135 },
    { x: 300, y: 215 },
  ];
  return (
    <Frame h={300}>
      <Node x={600} y={125} w={150} h={70} label="Origin" sub="S3 / app in 1 region" fill={C.amberSoft} stroke={C.amber} />
      {edges.map((e, i) => (
        <g key={i}>
          <Node x={e.x} y={e.y} w={150} h={50} label={`Edge PoP ${i + 1}`} fill={C.irisSoft} stroke={C.iris} />
          <Arrow x1={450} y1={e.y + 25} x2={596} y2={155} color={C.line} dashed />
          <Node x={60} y={e.y} w={130} h={50} label={`User ${i + 1}`} fill={C.card} stroke={C.muted} />
          <Arrow x1={296} y1={e.y + 25} x2={192} y2={e.y + 25} color={C.iris} flow />
        </g>
      ))}
      <Cap x={400} y={284} text="CloudFront / Azure CDN caches at edge PoPs near users; only cache misses hit the origin." />
    </Frame>
  );
}

// VPC anatomy: public + private subnets, IGW, NAT.
function VpcAnatomy() {
  return (
    <Frame h={330}>
      <rect x={40} y={55} width={720} height={225} rx={16} fill="none" stroke={C.iris} strokeWidth={2} />
      <text x={60} y={48} fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>
        VPC / VNet 10.0.0.0/16
      </text>
      <Node x={330} y={20} w={140} h={38} label="Internet Gateway" fill={C.card} stroke={C.muted} />
      <rect x={70} y={80} width={310} height={180} rx={12} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.4} />
      <text x={90} y={102} fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.teal}>
        Public subnet 10.0.1.0/24
      </text>
      <Node x={100} y={118} w={120} h={50} label="Web/LB" fill={C.card} stroke={C.teal} />
      <Node x={240} y={118} w={120} h={50} label="NAT GW" fill={C.amberSoft} stroke={C.amber} />
      <rect x={420} y={80} width={310} height={180} rx={12} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.4} />
      <text x={440} y={102} fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.rose}>
        Private subnet 10.0.2.0/24
      </text>
      <Node x={450} y={118} w={120} h={50} label="App VMs" fill={C.card} stroke={C.rose} />
      <Node x={590} y={118} w={120} h={50} label="Database" fill={C.card} stroke={C.rose} />
      <Arrow x1={400} y1={39} x2={300} y2={78} color={C.muted} />
      <Arrow x1={360} y1={210} x2={448} y2={210} color={C.amber} dashed />
      <Cap x={400} y={306} text="Public subnets route to the IGW; private subnets reach the internet outbound-only via a NAT gateway." />
    </Frame>
  );
}

// Layered network security: WAF, NACL, SG, host.
function SecurityLayers() {
  const layers = [
    { t: "WAF", s: "L7 · blocks bad HTTP (SQLi, XSS)", c: C.iris },
    { t: "Network ACL", s: "subnet · stateless allow/deny", c: C.teal },
    { t: "Security Group / NSG", s: "instance · stateful allow-only", c: C.amber },
    { t: "Host firewall / IAM", s: "OS & identity — last line", c: C.rose },
  ];
  return (
    <Frame h={300}>
      {layers.map((l, i) => {
        const inset = i * 46;
        return (
          <g key={i}>
            <rect x={100 + inset} y={45 + i * 26} width={600 - inset * 2} height={200 - i * 40} rx={12} fill="none" stroke={l.c} strokeWidth={1.6} />
            <text x={110 + inset} y={62 + i * 26} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={l.c}>
              {l.t}
            </text>
            <text x={110 + inset} y={78 + i * 26} fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
              {l.s}
            </text>
          </g>
        );
      })}
      <text x={400} y={175} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.ink}>
        Workload
      </text>
      <Cap x={400} y={286} text="Defense in depth: several independent layers, so one misconfig doesn't expose everything." />
    </Frame>
  );
}

// Hub-and-spoke network topology.
function NetworkTopology() {
  const spokes = [
    { x: 90, y: 60, t: "Prod VNet" },
    { x: 620, y: 60, t: "Dev VNet" },
    { x: 90, y: 210, t: "Shared svcs" },
    { x: 620, y: 210, t: "On-prem (VPN)" },
  ];
  return (
    <Frame h={310}>
      <Node x={320} y={125} w={160} h={70} label="Hub VNet" sub="firewall · gateway" accent />
      {spokes.map((s, i) => (
        <g key={i}>
          <Node x={s.x} y={s.y} w={150} h={54} label={s.t} fill={C.tealSoft} stroke={C.teal} />
          <Arrow x1={s.x + 75} y1={s.y < 150 ? s.y + 54 : s.y} x2={400} y2={s.y < 150 ? 130 : 190} color={C.line} dashed />
        </g>
      ))}
      <Cap x={400} y={296} text="Hub-and-spoke centralizes egress, firewalling, and hybrid connectivity; spokes peer only to the hub." />
    </Frame>
  );
}

// DNS resolution path.
function DnsResolution() {
  const steps = [
    { t: "Client", s: "app.example.com?" },
    { t: "Resolver", s: "recursive" },
    { t: "Route 53 / Azure DNS", s: "authoritative" },
    { t: "Answer", s: "A → 203.0.113.5" },
  ];
  return (
    <Frame h={220}>
      {steps.map((s, i) => {
        const x = 40 + i * 190;
        return (
          <g key={i}>
            <Node x={x} y={80} w={165} h={70} label={s.t} sub={s.s} accent={i === 2} fill={i === 3 ? C.tealSoft : C.card} stroke={i === 3 ? C.teal : C.line} />
            {i < steps.length - 1 && <Arrow x1={x + 165} y1={115} x2={x + 188} y2={115} flow />}
          </g>
        );
      })}
      <Cap x={400} y={190} text="Routing policies (latency, geo, weighted, failover) let DNS steer users to the best healthy endpoint." />
    </Frame>
  );
}

// Multi-AZ high availability.
function AvailabilityMultiAz() {
  return (
    <Frame h={290}>
      <Node x={330} y={30} w={140} h={48} label="Load balancer" accent />
      {[
        { x: 90, az: "AZ-a", role: "primary" },
        { x: 500, az: "AZ-b", role: "standby" },
      ].map((z, i) => (
        <g key={i}>
          <rect x={z.x} y={100} width={210} height={150} rx={14} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.5} />
          <text x={z.x + 105} y={124} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.teal}>
            {z.az}
          </text>
          <Node x={z.x + 30} y={138} w={150} h={44} label="App VM" fill={C.card} stroke={C.teal} />
          <Node x={z.x + 30} y={192} w={150} h={44} label={`DB (${z.role})`} fill={C.card} stroke={i ? C.amber : C.iris} />
          <Arrow x1={400} y1={78} x2={z.x + 105} y2={136} color={C.line} />
        </g>
      ))}
      <Arrow x1={330} y1={214} x2={500} y2={214} color={C.amber} dashed />
      <text x={415} y={208} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.amber}>
        sync replication
      </text>
      <Cap x={400} y={278} text="Span ≥2 AZs so one zone failing over doesn't take the app down; DB fails over to the standby." />
    </Frame>
  );
}

// Well-Architected pillars.
function WellArchitected() {
  const pillars = [
    { t: "Operational\nexcellence", c: C.iris },
    { t: "Security", c: C.rose },
    { t: "Reliability", c: C.teal },
    { t: "Performance\nefficiency", c: C.amber },
    { t: "Cost\noptimization", c: C.iris },
    { t: "Sustainability", c: C.teal },
  ];
  return (
    <Frame h={230}>
      {pillars.map((p, i) => {
        const x = 45 + i * 122;
        return (
          <g key={i}>
            <rect x={x} y={70} width={104} height={90} rx={10} fill={C.card} stroke={p.c} strokeWidth={1.8} />
            <rect x={x} y={70} width={104} height={8} rx={4} fill={p.c} />
            {p.t.split("\n").map((line, li) => (
              <text key={li} x={x + 52} y={112 + li * 16} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.ink}>
                {line}
              </text>
            ))}
          </g>
        );
      })}
      <Cap x={400} y={200} text="The Well-Architected Framework (AWS) / Azure WAF: six lenses to review any design against." />
    </Frame>
  );
}

// Relational vs the four NoSQL families.
function DatabaseTypes() {
  const nosql = [
    { t: "Key–value", s: "DynamoDB · Redis", d: "fast lookups by key" },
    { t: "Document", s: "MongoDB · Cosmos DB", d: "flexible JSON documents" },
    { t: "Wide-column", s: "Cassandra · Bigtable", d: "huge write-heavy tables" },
    { t: "Graph", s: "Neptune · Cosmos Gremlin", d: "relationships & traversal" },
  ];
  return (
    <Frame h={300}>
      {/* relational */}
      <rect x={45} y={54} width={230} height={200} rx={14} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.8} />
      <text x={160} y={84} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={16} fontWeight={700} fill={C.iris}>Relational (SQL)</text>
      <text x={160} y={104} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>RDS · Aurora · Azure SQL</text>
      <foreignObject x={60} y={118} width={200} height={120}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "#293445", textAlign: "center", lineHeight: 1.6 }}>
          Rows &amp; columns · fixed schema · JOINs · <b>ACID</b> transactions. The default when data is structured and consistency matters.
        </div>
      </foreignObject>

      {/* nosql families */}
      {nosql.map((k, i) => {
        const x = 320 + (i % 2) * 235;
        const y = 54 + Math.floor(i / 2) * 102;
        return (
          <g key={i}>
            <rect x={x} y={y} width={215} height={88} rx={12} fill={C.card} stroke={C.teal} strokeWidth={1.6} />
            <text x={x + 107} y={y + 28} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.teal}>{k.t}</text>
            <text x={x + 107} y={y + 47} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>{k.s}</text>
            <text x={x + 107} y={y + 68} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontStyle="italic" fill={C.soft}>{k.d}</text>
          </g>
        );
      })}
      <text x={430} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.teal}>NoSQL — pick the shape that fits your access pattern</text>
      <Cap x={160} y={278} text="SQL for structured, consistent data; NoSQL for scale & flexible shapes." />
    </Frame>
  );
}

// Cache-aside read path.
function CachingLayer() {
  return (
    <Frame h={240}>
      <Node x={40} y={95} w={130} h={56} label="App" sub="needs data" accent />
      <Node x={320} y={45} w={160} h={56} label="Cache" sub="Redis · ElastiCache" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Node x={320} y={150} w={160} h={56} label="Database" sub="RDS · Aurora" fill={C.irisSoft} stroke={C.iris} text={C.iris} />

      {/* 1: check cache */}
      <Arrow x1={172} y1={110} x2={316} y2={80} color={C.teal} flow />
      <text x={235} y={82} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill={C.teal}>1 · check cache</text>

      {/* 2: miss → db */}
      <Arrow x1={172} y1={128} x2={316} y2={176} color={C.iris} dashed />
      <text x={232} y={165} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>2 · on miss, read DB</text>

      {/* 3: populate cache */}
      <Arrow x1={400} y1={148} x2={400} y2={104} color={C.muted} dashed />
      <text x={505} y={130} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>3 · populate cache</text>

      <Cap x={400} y={228} text="Cache-aside: hits are fast & cheap; misses fall through to the database, then refill the cache. Set a TTL to bound staleness." />
    </Frame>
  );
}

// IAM: identities → policy → resources.
function IamModel() {
  const ids = [
    { t: "User", s: "a person" },
    { t: "Group", s: "many users" },
    { t: "Role", s: "assumed temporarily" },
  ];
  return (
    <Frame h={280}>
      <text x={110} y={34} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.iris}>Identities</text>
      {ids.map((k, i) => (
        <g key={i}>
          <rect x={30} y={54 + i * 62} width={160} height={48} rx={11} fill={C.card} stroke={C.iris} strokeWidth={1.6} />
          <text x={110} y={74 + i * 62} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.ink}>{k.t}</text>
          <text x={110} y={91 + i * 62} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>{k.s}</text>
        </g>
      ))}

      {/* policy */}
      <rect x={300} y={90} width={190} height={104} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={1.8} />
      <text x={395} y={118} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.amber}>Policy</text>
      <text x={395} y={138} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill={C.soft}>Allow / Deny</text>
      <text x={395} y={154} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill={C.soft}>action · resource</text>
      <text x={395} y={176} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontStyle="italic" fill={C.muted}>attached to identities</text>

      {/* resources */}
      <text x={660} y={34} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.teal}>Resources</text>
      {["S3 bucket", "EC2 / VM", "Database"].map((r, i) => (
        <g key={i}>
          <rect x={585} y={54 + i * 62} width={165} height={48} rx={11} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.5} />
          <text x={667} y={82 + i * 62} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.ink}>{r}</text>
        </g>
      ))}

      <Arrow x1={192} y1={140} x2={298} y2={140} color={C.iris} />
      <Arrow x1={492} y1={140} x2={583} y2={140} color={C.teal} flow />
      <Cap x={400} y={258} text="Grant the minimum permissions needed — least privilege. Prefer roles (temporary credentials) over long-lived keys." />
    </Frame>
  );
}

// Encryption in transit vs at rest.
function EncryptionFlow() {
  return (
    <Frame h={260}>
      {/* in transit */}
      <text x={200} y={38} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>In transit — TLS/HTTPS</text>
      <Node x={40} y={70} w={130} h={54} label="Client" />
      <Node x={230} y={70} w={130} h={54} label="Server" />
      <Arrow x1={172} y1={88} x2={228} y2={88} color={C.iris} flow />
      <text x={200} y={112} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>encrypted channel</text>
      <text x={200} y={150} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontStyle="italic" fill={C.soft}>protects data moving over the network</text>

      {/* at rest */}
      <text x={600} y={38} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.teal}>At rest — KMS / Key Vault</text>
      <Node x={440} y={70} w={120} h={54} label="Data" sub="plaintext" />
      <rect x={600} y={70} width={120} height={54} rx={12} fill={C.amberSoft} stroke={C.amber} strokeWidth={1.8} />
      <text x={660} y={92} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.amber}>Key</text>
      <text x={660} y={110} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>KMS-managed</text>
      <Arrow x1={562} y1={97} x2={598} y2={97} color={C.amber} />
      <text x={600} y={150} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontStyle="italic" fill={C.soft}>encrypts stored disks, objects & backups</text>

      <Cap x={400} y={230} text="Encrypt data in transit (TLS) and at rest (provider-managed keys). At rest is often on by default; TLS is your job to enforce." />
    </Frame>
  );
}

// Event source triggers a function that writes downstream.
function ServerlessEvent() {
  const sources = [
    { t: "HTTP request", y: 52 },
    { t: "File upload", y: 108 },
    { t: "Queue message", y: 164 },
  ];
  return (
    <Frame h={250}>
      <text x={110} y={32} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.amber}>Event sources</text>
      {sources.map((s, i) => (
        <g key={i}>
          <rect x={30} y={s.y} width={160} height={40} rx={10} fill={C.card} stroke={C.amber} strokeWidth={1.5} />
          <text x={110} y={s.y + 25} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={C.ink}>{s.t}</text>
          <Arrow x1={192} y1={s.y + 20} x2={318} y2={120} color={C.line} />
        </g>
      ))}

      {/* function */}
      <rect x={320} y={86} width={170} height={78} rx={14} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={405} y={118} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={15} fontWeight={700} fill={C.iris}>Function</text>
      <text x={405} y={138} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>Lambda / Azure Functions</text>
      <text x={405} y={153} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fontStyle="italic" fill={C.muted}>runs on demand, then stops</text>

      {/* downstream */}
      {["Database", "Storage", "Notify"].map((d, i) => (
        <g key={i}>
          <rect x={600} y={52 + i * 56} width={160} height={40} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.5} />
          <text x={680} y={77 + i * 56} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={C.ink}>{d}</text>
          <Arrow x1={492} y1={120} x2={598} y2={72 + i * 56} color={C.iris} flow />
        </g>
      ))}
      <Cap x={400} y={230} text="No servers to manage: an event triggers the function, it runs, you pay only for that execution." />
    </Frame>
  );
}

// Orchestrator schedules containers across a pool of nodes.
function ContainerOrchestration() {
  return (
    <Frame h={280}>
      <rect x={280} y={30} width={240} height={58} rx={13} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={400} y={54} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={15} fontWeight={700} fill={C.iris}>Orchestrator</text>
      <text x={400} y={73} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>ECS / EKS / AKS — schedules, heals, scales</text>

      {[0, 1, 2].map((n) => {
        const x = 55 + n * 245;
        return (
          <g key={n}>
            <rect x={x} y={140} width={200} height={120} rx={12} fill={C.canvas} stroke={C.line} strokeWidth={1.5} />
            <text x={x + 100} y={162} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.soft}>Node {n + 1}</text>
            {[0, 1].map((c) => (
              <g key={c}>
                <rect x={x + 18 + c * 92} y={178} width={74} height={64} rx={9} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.4} />
                <text x={x + 55 + c * 92} y={214} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill={C.teal}>container</text>
              </g>
            ))}
            <Arrow x1={400} y1={90} x2={x + 100} y2={136} color={C.line} dashed />
          </g>
        );
      })}
      <Cap x={400} y={274} text="You declare the desired state; the orchestrator places containers on nodes and restarts them if they die." />
    </Frame>
  );
}

// IaC workflow: code → plan → apply → cloud, with state.
function IacWorkflow() {
  const steps = [
    { t: "Write code", s: "*.tf / template", c: C.iris },
    { t: "Plan", s: "preview diff", c: C.amber },
    { t: "Apply", s: "make it real", c: C.teal },
  ];
  return (
    <Frame h={230}>
      {steps.map((s, i) => {
        const x = 40 + i * 210;
        return (
          <g key={i}>
            <Node x={x} y={70} w={170} h={64} label={s.t} sub={s.s} fill={C.card} stroke={s.c} text={s.c} />
            {i < steps.length - 1 && <Arrow x1={x + 172} y1={102} x2={x + 208} y2={102} flow />}
          </g>
        );
      })}
      {/* cloud */}
      <rect x={670} y={70} width={90} height={64} rx={12} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={715} y={107} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>Cloud</text>
      <Arrow x1={632} y1={102} x2={668} y2={102} color={C.teal} flow />

      {/* state */}
      <rect x={250} y={168} width={170} height={42} rx={11} fill={C.canvas} stroke={C.line} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={335} y={194} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.muted}>State file</text>
      <line x1={125} y1={136} x2={300} y2={168} stroke={C.line} strokeWidth={1.3} strokeDasharray="4 4" />
      <Cap x={555} y={196} text="State records what exists, so the tool applies only the diff and detects drift." />
    </Frame>
  );
}

// The three pillars of observability.
function ObservabilityPillars() {
  const pillars = [
    { t: "Metrics", s: "numbers over time", d: "CPU, latency, error rate", c: C.iris },
    { t: "Logs", s: "discrete events", d: "what happened, when", c: C.teal },
    { t: "Traces", s: "request journeys", d: "across services", c: C.amber },
  ];
  return (
    <Frame h={250}>
      {pillars.map((p, i) => {
        const x = 45 + i * 245;
        return (
          <g key={i}>
            <rect x={x} y={50} width={220} height={130} rx={14} fill={C.card} stroke={p.c} strokeWidth={1.8} />
            <text x={x + 110} y={86} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={17} fontWeight={700} fill={p.c}>{p.t}</text>
            <text x={x + 110} y={108} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>{p.s}</text>
            <text x={x + 110} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontStyle="italic" fill={C.soft}>{p.d}</text>
          </g>
        );
      })}
      <Cap x={400} y={210} text="Metrics tell you something is wrong; logs and traces tell you why and where." />
    </Frame>
  );
}

const REGISTRY: Record<DiagramName, () => JSX.Element> = {
  "cloud-service-models": ServiceModels,
  "shared-responsibility": SharedResponsibility,
  "regions-az": RegionsAz,
  "aws-vs-azure": AwsVsAzure,
  "compute-spectrum": ComputeSpectrum,
  autoscaling: AutoScaling,
  "load-balancer": LoadBalancer,
  "storage-types": StorageTypes,
  "storage-tiers": StorageTiers,
  cdn: Cdn,
  "vpc-anatomy": VpcAnatomy,
  "security-layers": SecurityLayers,
  "network-topology": NetworkTopology,
  "dns-resolution": DnsResolution,
  "availability-multi-az": AvailabilityMultiAz,
  "well-architected": WellArchitected,
  "database-types": DatabaseTypes,
  "caching-layer": CachingLayer,
  "iam-model": IamModel,
  "encryption-flow": EncryptionFlow,
  "serverless-event": ServerlessEvent,
  "container-orchestration": ContainerOrchestration,
  "iac-workflow": IacWorkflow,
  "observability-pillars": ObservabilityPillars,
};

export function Diagram({ name, caption }: { name: DiagramName; caption?: string }) {
  const Cmp = REGISTRY[name];
  return (
    <figure className="my-8">
      <div className="rounded-2xl border border-canvas-300 bg-canvas-50 p-4 sm:p-6 shadow-sm">
        {Cmp ? <Cmp /> : <div className="text-ink-muted text-sm">[diagram: {name}]</div>}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-muted italic px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
