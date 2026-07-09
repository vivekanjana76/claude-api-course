import type { DiagramName } from "@/lib/types";

/* ---------- shared palette ---------- */
const C = {
  ink: "#0F1826",
  soft: "#293445",
  muted: "#5C6A80",
  line: "#C4D5E8",
  canvas: "#F1F5FB",
  card: "#FFFFFF",
  iris: "#2563EB", // primary blue
  irisSoft: "#E7EFFD",
  teal: "#0E9BB5", // container cyan
  tealSoft: "#E1F5F9",
  amber: "#ED8B00", // kubernetes / warn
  amberSoft: "#FBEED6",
  rose: "#C43E86", // ci/cd magenta
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

function Pill({ x, y, w, label, color }: { x: number; y: number; w: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={30} rx={15} fill={color} opacity={0.14} stroke={color} strokeWidth={1.3} />
      <text x={x + w / 2} y={y + 19} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={color}>
        {label}
      </text>
    </g>
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

// The DevOps infinity loop: plan → code → build → test → release → deploy → operate → monitor.
function DevOpsLifecycle() {
  const dev = ["Plan", "Code", "Build", "Test"];
  const ops = ["Release", "Deploy", "Operate", "Monitor"];
  return (
    <Frame h={300}>
      {/* infinity loop path */}
      <path
        d="M400,150 C400,70 250,70 200,120 C150,170 150,200 200,230 C250,270 380,250 400,150 C420,50 550,70 600,120 C650,170 650,200 600,230 C550,270 400,230 400,150 Z"
        fill="none"
        stroke={C.line}
        strokeWidth={2.5}
        strokeDasharray="7 6"
        className="animate-flow"
      />
      <text x={210} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.iris}>
        Dev
      </text>
      <text x={590} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.amber}>
        Ops
      </text>
      {dev.map((t, i) => (
        <Pill key={t} x={95 + i * 78} y={255} w={72} label={t} color={C.iris} />
      ))}
      {ops.map((t, i) => (
        <Pill key={t} x={470 + i * 78} y={255} w={72} label={t} color={C.amber} />
      ))}
      <circle cx={400} cy={150} r={7} fill={C.rose} />
      <Cap x={400} y={295} text="Continuous flow — the output of monitor feeds back into the next plan." />
    </Frame>
  );
}

// The Three Ways: flow →, feedback ←, learning on top.
function ThreeWays() {
  return (
    <Frame h={300}>
      <Node x={40} y={120} w={150} h={60} label="Dev" sub="build the change" accent />
      <Node x={325} y={120} w={150} h={60} label="Ops" sub="run it" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Node x={610} y={120} w={150} h={60} label="Customer" sub="gets value" fill={C.amberSoft} stroke={C.amber} text={C.amber} />
      {/* First Way: flow */}
      <Arrow x1={190} y1={140} x2={323} y2={140} color={C.iris} flow />
      <Arrow x1={475} y1={140} x2={608} y2={140} color={C.iris} flow />
      <Cap x={400} y={112} text="① First Way — Flow (left → right)" color={C.iris} />
      {/* Second Way: feedback */}
      <Arrow x1={608} y1={165} x2={475} y2={165} color={C.teal} dashed />
      <Arrow x1={323} y1={165} x2={190} y2={165} color={C.teal} dashed />
      <Cap x={400} y={205} text="② Second Way — Feedback (right → left)" color={C.teal} />
      {/* Third Way: learning */}
      <rect x={40} y={40} width={720} height={40} rx={10} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.4} />
      <text x={400} y={65} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.rose}>
        ③ Third Way — Continual learning &amp; experimentation
      </text>
      <Cap x={400} y={270} text="Flow forward, feedback back, and a culture of learning over both." />
    </Frame>
  );
}

// Feature branch → PR → merge to main.
function GitWorkflow() {
  return (
    <Frame h={280}>
      {/* main line */}
      <line x1={60} y1={90} x2={740} y2={90} stroke={C.iris} strokeWidth={3} />
      <text x={60} y={78} fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>
        main
      </text>
      {[140, 300, 620].map((x, i) => (
        <circle key={i} cx={x} cy={90} r={7} fill={C.iris} />
      ))}
      {/* feature branch */}
      <path d="M300,90 C360,90 360,190 420,190 L560,190 C620,190 620,90 620,90" fill="none" stroke={C.teal} strokeWidth={3} />
      <text x={430} y={225} fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.teal}>
        feature/add-login
      </text>
      {[420, 490].map((x, i) => (
        <circle key={i} cx={x} cy={190} r={7} fill={C.teal} />
      ))}
      {/* PR marker */}
      <Pill x={520} y={110} w={120} label="Pull Request" color={C.rose} />
      <Arrow x1={580} y1={140} x2={610} y2={100} color={C.rose} />
      <Cap x={400} y={260} text="Branch off main, commit in isolation, open a PR for review + CI, then merge back." />
    </Frame>
  );
}

// Generic CI/CD pipeline: commit → build → test → package → deploy → monitor.
function CicdPipeline() {
  const stages = [
    { t: "Commit", s: "git push", c: C.iris },
    { t: "Build", s: "compile / image", c: C.teal },
    { t: "Test", s: "unit + scan", c: C.rose },
    { t: "Package", s: "→ registry", c: C.amber },
    { t: "Deploy", s: "staging→prod", c: C.iris },
    { t: "Monitor", s: "observe", c: C.teal },
  ];
  const w = 108,
    gap = 12,
    x0 = 30,
    y = 110;
  return (
    <Frame h={250}>
      {stages.map((st, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={st.t}>
            <Node x={x} y={y} w={w} h={64} label={st.t} sub={st.s} fill={C.card} stroke={st.c} text={st.c} />
            {i < stages.length - 1 && <Arrow x1={x + w} y1={y + 32} x2={x + w + gap} y2={y + 32} color={st.c} flow />}
          </g>
        );
      })}
      <path d="M84,174 C84,215 720,215 720,174" fill="none" stroke={C.line} strokeWidth={1.6} strokeDasharray="5 5" />
      <Cap x={400} y={232} text="A red gate at any stage stops the line; monitoring feeds back to the next commit." />
    </Frame>
  );
}

// Containers vs VMs stack comparison.
function ContainersVsVms() {
  const col = (x: number, title: string, rows: { t: string; c: string; op?: number }[], color: string) => (
    <g>
      <text x={x + 155} y={44} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={color}>
        {title}
      </text>
      {rows.map((r, i) => (
        <g key={i}>
          <rect x={x} y={62 + i * 40} width={310} height={34} rx={7} fill={r.c} opacity={r.op ?? 1} stroke={C.line} strokeWidth={1} />
          <text x={x + 155} y={83 + i * 40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.soft}>
            {r.t}
          </text>
        </g>
      ))}
    </g>
  );
  return (
    <Frame h={340}>
      {col(30, "Virtual Machines", [
        { t: "App A   |   App B", c: C.card },
        { t: "Bins/Libs (×N)", c: C.card },
        { t: "Guest OS (×N)  — heavy", c: C.amberSoft },
        { t: "Hypervisor", c: C.roseSoft },
        { t: "Host OS + Hardware", c: C.tealSoft },
      ], C.amber)}
      {col(460, "Containers", [
        { t: "App A   |   App B", c: C.card },
        { t: "Bins/Libs (per container)", c: C.card },
        { t: "Container runtime", c: C.roseSoft },
        { t: "Shared Host OS kernel", c: C.tealSoft },
        { t: "Hardware", c: C.tealSoft },
      ], C.teal)}
      <Cap x={400} y={322} text="VMs ship a full guest OS each; containers share the host kernel — far smaller and faster." />
    </Frame>
  );
}

// Image layers stack + writable layer.
function ImageLayers() {
  const layers = [
    { t: "CMD [\"node\",\"server.js\"]", c: C.card },
    { t: "COPY . .  (source)", c: C.card },
    { t: "RUN npm ci  (dependencies)", c: C.irisSoft },
    { t: "WORKDIR /app", c: C.card },
    { t: "FROM node:20-slim  (base)", c: C.tealSoft },
  ];
  return (
    <Frame h={320}>
      <text x={250} y={38} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.iris}>
        Image = read-only layers
      </text>
      {/* writable layer */}
      <rect x={95} y={54} width={310} height={30} rx={7} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={250} y={74} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.rose}>
        writable container layer (ephemeral)
      </text>
      {layers.map((l, i) => (
        <g key={i}>
          <rect x={95} y={92 + i * 40} width={310} height={34} rx={7} fill={l.c} stroke={C.line} strokeWidth={1.2} />
          <text x={250} y={113 + i * 40} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill={C.soft}>
            {l.t}
          </text>
        </g>
      ))}
      <Arrow x1={430} y1={200} x2={430} y2={110} color={C.muted} />
      <text x={470} y={150} fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.muted}>
        build order:
      </text>
      <text x={470} y={172} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
        rarely-changing
      </text>
      <text x={470} y={190} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
        at the bottom →
      </text>
      <text x={470} y={208} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
        cache reused
      </text>
      <Cap x={400} y={306} text="Each instruction adds a cached layer; the cache invalidates from the first changed layer up." />
    </Frame>
  );
}

// CI builds → pushes to registry → cluster pulls.
function RegistryFlow() {
  return (
    <Frame h={260}>
      <Node x={40} y={100} w={170} h={70} label="CI pipeline" sub="docker build" fill={C.roseSoft} stroke={C.rose} text={C.rose} />
      <Node x={315} y={95} w={170} h={80} label="Registry" sub="ghcr.io/acme/api:v1.4" accent />
      <Node x={590} y={100} w={170} h={70} label="Cluster / host" sub="docker pull → run" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Arrow x1={210} y1={135} x2={313} y2={135} color={C.rose} flow />
      <text x={262} y={120} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.rose}>
        push
      </text>
      <Arrow x1={485} y1={135} x2={588} y2={135} color={C.teal} flow />
      <text x={537} y={120} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.teal}>
        pull
      </text>
      <Cap x={400} y={225} text="The registry is the handoff point — the versioned source of truth for what gets deployed." />
    </Frame>
  );
}

// Kubernetes architecture: control plane + worker nodes.
function K8sArchitecture() {
  return (
    <Frame h={340}>
      {/* control plane */}
      <rect x={40} y={50} width={300} height={250} rx={14} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.8} />
      <text x={190} y={76} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.iris}>
        Control plane
      </text>
      <Node x={60} y={92} w={260} h={46} label="API server" sub="the front door · kubectl talks here" accent />
      {[
        { t: "etcd", s: "state store" },
        { t: "Scheduler", s: "places pods" },
        { t: "Controllers", s: "reconcile" },
      ].map((c, i) => (
        <Node key={c.t} x={60 + (i % 2) * 135} y={150 + Math.floor(i / 2) * 66} w={125} h={54} label={c.t} sub={c.s} fill={C.card} stroke={C.iris} text={C.iris} />
      ))}
      {/* nodes */}
      <rect x={400} y={50} width={360} height={250} rx={14} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.8} />
      <text x={580} y={76} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.teal}>
        Worker nodes
      </text>
      {[0, 1].map((n) => (
        <g key={n}>
          <rect x={420 + n * 170} y={92} width={150} height={195} rx={10} fill={C.card} stroke={C.teal} strokeWidth={1.4} />
          <text x={495 + n * 170} y={112} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.teal}>
            Node {n + 1}
          </text>
          <Node x={435 + n * 170} y={122} w={120} h={34} label="kubelet" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
          {[0, 1].map((p) => (
            <Node key={p} x={435 + n * 170} y={166 + p * 44} w={120} h={36} label={`Pod ${p + 1}`} fill={C.card} stroke={C.line} />
          ))}
        </g>
      ))}
      <Arrow x1={340} y1={115} x2={420} y2={115} color={C.iris} dashed />
      <Cap x={400} y={324} text="Everything talks through the API server; controllers reconcile actual → desired state." />
    </Frame>
  );
}

// Deployment → ReplicaSet → Pods → containers.
function K8sObjects() {
  return (
    <Frame h={300}>
      <Node x={310} y={40} w={180} h={54} label="Deployment" sub="desired: 3 replicas, image v1.4" accent />
      <Arrow x1={400} y1={94} x2={400} y2={122} color={C.iris} />
      <Node x={310} y={124} w={180} h={50} label="ReplicaSet" sub="keeps 3 pods alive" fill={C.irisSoft} stroke={C.iris} text={C.iris} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow x1={400} y1={174} x2={175 + i * 225} y2={205} color={C.teal} />
          <Node x={110 + i * 225} y={206} w={130} h={58} label={`Pod ${i + 1}`} sub="container(s)" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
        </g>
      ))}
      <Cap x={400} y={288} text="You edit the Deployment; it manages ReplicaSets, which keep the Pods (and their containers) running." />
    </Frame>
  );
}

// Ingress → Service → Pods.
function K8sNetworking() {
  return (
    <Frame h={300}>
      <Node x={40} y={120} w={140} h={60} label="Internet" sub="users" fill={C.card} stroke={C.muted} />
      <Node x={230} y={120} w={140} h={60} label="Ingress" sub="host/path + TLS" fill={C.roseSoft} stroke={C.rose} text={C.rose} />
      <Node x={420} y={120} w={140} h={60} label="Service" sub="stable IP · LB" accent />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Node x={620} y={50 + i * 70} w={140} h={52} label={`Pod ${i + 1}`} sub="app: api" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
          <Arrow x1={560} y1={150} x2={618} y2={76 + i * 70} color={C.teal} />
        </g>
      ))}
      <Arrow x1={180} y1={150} x2={228} y2={150} color={C.muted} flow />
      <Arrow x1={370} y1={150} x2={418} y2={150} color={C.rose} flow />
      <Cap x={400} y={288} text="Ingress routes HTTP to a Service, which load-balances across healthy pods selected by label." />
    </Frame>
  );
}

// HPA scaling replicas between min and max on CPU.
function K8sScaling() {
  return (
    <Frame h={300}>
      <Node x={40} y={125} w={150} h={60} label="HPA" sub="target 70% CPU" fill={C.amberSoft} stroke={C.amber} text={C.amber} />
      <Node x={250} y={125} w={150} h={60} label="Deployment" sub="min 3 · max 20" accent />
      <Arrow x1={190} y1={155} x2={248} y2={155} color={C.amber} flow />
      <text x={219} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={600} fill={C.amber}>
        scale
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <Node
          key={i}
          x={470 + i * 62}
          y={125}
          w={54}
          h={60}
          label="Pod"
          fill={i < 3 ? C.tealSoft : C.card}
          stroke={i < 3 ? C.teal : C.line}
          text={i < 3 ? C.teal : C.muted}
        />
      ))}
      <text x={470 + 3 * 62 - 6} y={112} fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>
        + added on load →
      </text>
      <Cap x={400} y={250} text="The HPA watches metrics and adjusts the replica count; the Cluster Autoscaler adds nodes to fit." />
    </Frame>
  );
}

// Pipeline stages with quality gates.
function PipelineStages() {
  const gates = [
    { t: "Lint + types", c: C.iris },
    { t: "Unit tests", c: C.teal },
    { t: "Security scan", c: C.rose },
    { t: "Build image", c: C.amber },
    { t: "Deploy", c: C.iris },
  ];
  const w = 130,
    gap = 14,
    x0 = 34,
    y = 100;
  return (
    <Frame h={230}>
      {gates.map((g, i) => {
        const x = x0 + i * (w + gap);
        return (
          <g key={g.t}>
            <Node x={x} y={y} w={w} h={58} label={g.t} fill={C.card} stroke={g.c} text={g.c} />
            <text x={x + w / 2} y={y + 78} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={16} fontWeight={700} fill={g.c}>
              ✓
            </text>
            {i < gates.length - 1 && <Arrow x1={x + w} y1={y + 29} x2={x + w + gap} y2={y + 29} color={g.c} flow />}
          </g>
        );
      })}
      <Cap x={400} y={210} text="Every gate must pass (✓) before the change advances — shift checks left to fail fast and cheap." />
    </Frame>
  );
}

// GitHub Actions: event → workflow → jobs → steps.
function GhaWorkflow() {
  return (
    <Frame h={310}>
      <Node x={40} y={130} w={140} h={56} label="Event" sub="push / PR" fill={C.card} stroke={C.muted} />
      <Arrow x1={180} y1={158} x2={228} y2={158} color={C.muted} flow />
      <rect x={230} y={55} width={530} height={210} rx={14} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.6} />
      <text x={495} y={80} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>
        Workflow (.github/workflows/ci.yml)
      </text>
      {/* job test */}
      <Node x={255} y={95} w={210} h={150} label="" sub="" fill={C.card} stroke={C.teal} />
      <text x={360} y={116} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.teal}>
        job: test
      </text>
      {["checkout", "setup-node", "npm ci", "npm test"].map((s, i) => (
        <g key={s}>
          <rect x={272} y={126 + i * 28} width={176} height={22} rx={5} fill={C.tealSoft} stroke={C.teal} strokeWidth={1} />
          <text x={360} y={141 + i * 28} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fill={C.soft}>
            {s}
          </text>
        </g>
      ))}
      {/* job build */}
      <Node x={500} y={95} w={240} h={150} label="" sub="" fill={C.card} stroke={C.amber} />
      <text x={620} y={116} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.amber}>
        job: build-image (needs: test)
      </text>
      {["docker login", "build-push-action", "→ ghcr.io :sha"].map((s, i) => (
        <g key={s}>
          <rect x={520} y={135 + i * 30} width={200} height={24} rx={5} fill={C.amberSoft} stroke={C.amber} strokeWidth={1} />
          <text x={620} y={151 + i * 30} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fill={C.soft}>
            {s}
          </text>
        </g>
      ))}
      <Arrow x1={465} y1={170} x2={500} y2={170} color={C.iris} dashed />
      <Cap x={400} y={292} text="An event triggers the workflow; jobs run on runners with steps that use actions or run commands." />
    </Frame>
  );
}

// Deployment strategies: rolling vs blue-green vs canary.
function DeploymentStrategies() {
  return (
    <Frame h={340}>
      {/* rolling */}
      <text x={130} y={44} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>
        Rolling
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + i * 36} y={60} width={30} height={44} rx={6} fill={i < 2 ? C.irisSoft : C.card} stroke={i < 2 ? C.iris : C.line} strokeWidth={1.4} />
      ))}
      <Cap x={130} y={124} text="replace one by one" />

      {/* blue-green */}
      <text x={400} y={44} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.teal}>
        Blue-green
      </text>
      <rect x={300} y={60} width={80} height={44} rx={7} fill={C.line} opacity={0.3} stroke={C.muted} strokeWidth={1.3} />
      <text x={340} y={87} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.soft}>
        blue
      </text>
      <rect x={420} y={60} width={80} height={44} rx={7} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.6} />
      <text x={460} y={87} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={600} fill={C.teal}>
        green
      </text>
      <Arrow x1={400} y1={112} x2={460} y2={112} color={C.teal} />
      <Cap x={400} y={130} text="switch all traffic at once" />

      {/* canary */}
      <text x={660} y={44} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.rose}>
        Canary
      </text>
      <rect x={585} y={60} width={110} height={44} rx={7} fill={C.line} opacity={0.3} stroke={C.muted} strokeWidth={1.3} />
      <text x={628} y={87} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
        v1 · 95%
      </text>
      <rect x={700} y={60} width={40} height={44} rx={7} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.6} />
      <text x={720} y={87} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9} fontWeight={600} fill={C.rose}>
        5%
      </text>
      <Cap x={660} y={130} text="small slice first, then ramp" />

      {/* summary bar */}
      <rect x={60} y={175} width={680} height={110} rx={12} fill={C.canvas} stroke={C.line} strokeWidth={1.3} />
      <text x={400} y={200} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.soft}>
        Safety ↑   ·   Cost &amp; complexity ↑
      </text>
      <Arrow x1={130} y1={230} x2={670} y2={230} color={C.muted} />
      <text x={130} y={258} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.iris}>
        Rolling
      </text>
      <text x={400} y={258} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.teal}>
        Blue-green
      </text>
      <text x={660} y={258} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.rose}>
        Canary
      </text>
      <Cap x={400} y={278} text="Feature flags cut across all three to separate deploy from release." />
    </Frame>
  );
}

/* ---------- registry ---------- */
const REGISTRY: Record<DiagramName, () => React.ReactElement> = {
  "devops-lifecycle": DevOpsLifecycle,
  "three-ways": ThreeWays,
  "git-workflow": GitWorkflow,
  "cicd-pipeline": CicdPipeline,
  "containers-vs-vms": ContainersVsVms,
  "image-layers": ImageLayers,
  "registry-flow": RegistryFlow,
  "k8s-architecture": K8sArchitecture,
  "k8s-objects": K8sObjects,
  "k8s-networking": K8sNetworking,
  "k8s-scaling": K8sScaling,
  "pipeline-stages": PipelineStages,
  "gha-workflow": GhaWorkflow,
  "deployment-strategies": DeploymentStrategies,
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
