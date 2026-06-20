import type { DiagramName } from "@/lib/types";

/* ---------- shared palette ---------- */
const C = {
  ink: "#1A1915",
  soft: "#3D3A33",
  muted: "#6B665B",
  line: "#C9C3B2",
  cream: "#FAF9F5",
  card: "#FFFFFF",
  clay: "#CC785C",
  claySoft: "#F7EBE5",
  sage: "#6A7C5C",
  sageSoft: "#EAEEE4",
  ochre: "#C99A3A",
  ochreSoft: "#F6EFDC",
  blue: "#5B6B82",
  blueSoft: "#E6EAF0",
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
        fill={accent ? C.claySoft : fill}
        stroke={accent ? C.clay : stroke}
        strokeWidth={accent ? 2 : 1.5}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 6 : y + h / 2 + 5}
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize={15}
        fontWeight={600}
        fill={accent ? C.clay : text}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 14}
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

/* ---------- individual diagrams ---------- */

function RequestResponse() {
  return (
    <Frame h={240}>
      <Node x={40} y={90} w={170} h={70} label="Your App" sub="builds the request" />
      <Node x={315} y={70} w={170} h={110} label="Claude" sub="/v1/messages" accent />
      <Node x={590} y={90} w={170} h={70} label="Your App" sub="uses the reply" />
      <Arrow x1={215} y1={115} x2={310} y2={115} flow />
      <Cap x={262} y={102} text="messages + tools" />
      <Arrow x1={485} y1={135} x2={585} y2={135} flow color={C.clay} />
      <Cap x={535} y={172} text="content + stop_reason + usage" color={C.clay} />
    </Frame>
  );
}

function Tokens() {
  const toks = ["Build", "ing", " with", " Claude", " is", " fun"];
  return (
    <Frame h={200}>
      <text x={400} y={50} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={22} fill={C.ink}>
        &quot;Building with Claude is fun&quot;
      </text>
      <Arrow x1={400} y1={66} x2={400} y2={96} />
      {toks.map((t, i) => {
        const w = 92;
        const gap = 8;
        const total = toks.length * w + (toks.length - 1) * gap;
        const x = 400 - total / 2 + i * (w + gap);
        return (
          <g key={i}>
            <rect x={x} y={110} width={w} height={46} rx={8} fill={i % 2 ? C.claySoft : C.sageSoft} stroke={C.line} />
            <text x={x + w / 2} y={138} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fill={C.soft}>
              {t.trim() || "·"}
            </text>
          </g>
        );
      })}
      <Cap x={400} y={185} text="6 tokens — the unit of pricing, limits, and speed" />
    </Frame>
  );
}

function ContextWindow() {
  const segs = [
    { label: "System", w: 130, fill: C.sageSoft },
    { label: "History", w: 200, fill: C.blueSoft },
    { label: "Documents", w: 180, fill: C.ochreSoft },
    { label: "Reply (max_tokens)", w: 150, fill: C.claySoft },
  ];
  let cx = 70;
  return (
    <Frame h={220}>
      <text x={400} y={45} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={600} fill={C.ink}>
        One shared token budget (the context window)
      </text>
      <rect x={66} y={80} width={668} height={70} rx={12} fill="none" stroke={C.clay} strokeWidth={2} />
      {segs.map((s, i) => {
        const el = (
          <g key={i}>
            <rect x={cx} y={86} width={s.w} height={58} rx={8} fill={s.fill} stroke={C.line} />
            <text x={cx + s.w / 2} y={120} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={C.soft}>
              {s.label}
            </text>
          </g>
        );
        cx += s.w + 2;
        return el;
      })}
      <Cap x={400} y={180} text="Instructions + history + retrieved data + the answer all compete for the same space" />
    </Frame>
  );
}

function ModelTiers() {
  const tiers = [
    { label: "Haiku", sub: "fast · cheap", y: 168, fill: C.sageSoft, stroke: C.sage },
    { label: "Sonnet", sub: "balanced", y: 128, fill: C.blueSoft, stroke: C.blue },
    { label: "Opus", sub: "powerful", y: 88, fill: C.ochreSoft, stroke: C.ochre },
    { label: "Fable", sub: "frontier", y: 48, fill: C.claySoft, stroke: C.clay },
  ];
  return (
    <Frame h={260}>
      {tiers.map((t, i) => (
        <g key={i}>
          <rect x={250} y={t.y} width={300 - i * 0} height={34} rx={8} fill={t.fill} stroke={t.stroke} strokeWidth={1.5} />
          <text x={266} y={t.y + 22} fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.ink}>
            {t.label}
          </text>
          <text x={520} y={t.y + 22} textAnchor="end" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>
            {t.sub}
          </text>
        </g>
      ))}
      <Arrow x1={200} y1={210} x2={200} y2={52} color={C.muted} />
      <text x={150} y={135} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted} transform="rotate(-90 150 135)">
        more intelligence →
      </text>
      <Arrow x1={595} y1={52} x2={595} y2={210} color={C.muted} />
      <text x={650} y={135} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted} transform="rotate(90 650 135)">
        more cost &amp; latency →
      </text>
    </Frame>
  );
}

function Temperature() {
  const low = [10, 70, 18, 8, 4, 2, 1];
  const high = [22, 30, 20, 16, 14, 12, 10];
  function Bars({ ox, data, title, color }: { ox: number; data: number[]; title: string; color: string }) {
    return (
      <g>
        <text x={ox + 130} y={50} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.ink}>
          {title}
        </text>
        {data.map((v, i) => (
          <rect key={i} x={ox + i * 36} y={170 - v * 1.6} width={26} height={v * 1.6} rx={4} fill={color} />
        ))}
        <line x1={ox - 6} y1={170} x2={ox + 250} y2={170} stroke={C.line} />
      </g>
    );
  }
  return (
    <Frame h={220}>
      <Bars ox={80} data={low} title="Low temperature — focused" color={C.sage} />
      <Bars ox={460} data={high} title="High temperature — varied" color={C.clay} />
      <Cap x={400} y={205} text="Probability over the next possible tokens" />
    </Frame>
  );
}

function Streaming() {
  return (
    <Frame h={230}>
      <text x={200} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.muted}>
        Without streaming
      </text>
      <rect x={60} y={60} width={280} height={50} rx={10} fill={C.cream} stroke={C.line} />
      <circle cx={110} cy={85} r={6} className="animate-pulse-soft" fill={C.muted} />
      <text x={200} y={90} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>
        waiting… full reply at once
      </text>

      <text x={600} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.clay}>
        With streaming
      </text>
      {["The", " sea", " was", " calm", "…"].map((t, i) => (
        <g key={i}>
          <rect x={460 + i * 56} y={60} width={50} height={50} rx={8} fill={C.claySoft} stroke={C.clay} opacity={0.5 + i * 0.1} />
          <text x={485 + i * 56} y={90} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill={C.soft}>
            {t.trim() || "…"}
          </text>
        </g>
      ))}
      <Cap x={600} y={140} text="tokens arrive incrementally" color={C.clay} />
      <Cap x={400} y={195} text="Same answer — streaming shows progress and avoids timeouts on long outputs" />
    </Frame>
  );
}

function Multimodal() {
  return (
    <Frame h={230}>
      <Node x={70} y={70} w={150} h={60} label="🖼  Image" sub="base64 or URL" />
      <Node x={70} y={150} w={150} h={50} label="📝  Text" sub="your question" />
      <Node x={320} y={95} w={160} h={90} label="One message" sub="content: [blocks]" accent />
      <Node x={580} y={100} w={160} h={80} label="Claude" sub="reasons over both" />
      <Arrow x1={222} y1={100} x2={316} y2={125} />
      <Arrow x1={222} y1={175} x2={316} y2={155} />
      <Arrow x1={482} y1={140} x2={576} y2={140} flow color={C.clay} />
    </Frame>
  );
}

function MessageRoles() {
  return (
    <Frame h={300}>
      <rect x={60} y={40} width={680} height={44} rx={10} fill={C.sageSoft} stroke={C.sage} />
      <text x={80} y={67} fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.ink}>
        system
      </text>
      <text x={400} y={67} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fill={C.soft}>
        sets persona, rules, and output format for the whole chat
      </text>

      <RoleBubble x={60} y={110} w={420} label="user" text="I'm going to Tokyo." align="left" />
      <RoleBubble x={320} y={170} w={420} label="assistant" text="Great! How many days?" align="right" />
      <RoleBubble x={60} y={230} w={420} label="user" text="Five days." align="left" />
    </Frame>
  );
}
function RoleBubble({
  x,
  y,
  w,
  label,
  text,
  align,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  text: string;
  align: "left" | "right";
}) {
  const user = label === "user";
  return (
    <g>
      <rect x={x} y={y} width={w} height={44} rx={12} fill={user ? C.card : C.claySoft} stroke={user ? C.line : C.clay} />
      <text
        x={align === "left" ? x + 16 : x + w - 16}
        y={y + 18}
        textAnchor={align === "left" ? "start" : "end"}
        fontFamily="var(--font-sans)"
        fontSize={11}
        fontWeight={700}
        fill={user ? C.muted : C.clay}
      >
        {label}
      </text>
      <text
        x={align === "left" ? x + 16 : x + w - 16}
        y={y + 34}
        textAnchor={align === "left" ? "start" : "end"}
        fontFamily="var(--font-sans)"
        fontSize={13}
        fill={C.soft}
      >
        {text}
      </text>
    </g>
  );
}

function PromptAnatomy() {
  const rows = [
    { label: "Role", sub: "You are a senior tax advisor…", fill: C.claySoft },
    { label: "Context", sub: "<document> … </document>", fill: C.blueSoft },
    { label: "Rules", sub: "If unsure, say so. Never invent prices.", fill: C.sageSoft },
    { label: "Format", sub: "Return JSON: { … }", fill: C.ochreSoft },
    { label: "Examples", sub: "input → output (few-shot)", fill: C.cream },
  ];
  return (
    <Frame h={300}>
      {rows.map((r, i) => (
        <g key={i}>
          <rect x={140} y={30 + i * 50} width={520} height={40} rx={8} fill={r.fill} stroke={C.line} />
          <text x={160} y={55 + i * 50} fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.ink}>
            {r.label}
          </text>
          <text x={640} y={55 + i * 50} textAnchor="end" fontFamily="var(--font-mono)" fontSize={11.5} fill={C.muted}>
            {r.sub}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function Caching() {
  return (
    <Frame h={250}>
      <text x={200} y={36} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.ink}>
        Request 1
      </text>
      <rect x={60} y={50} width={200} height={50} rx={8} fill={C.blueSoft} stroke={C.blue} />
      <text x={160} y={80} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.soft}>
        stable prefix (cache write)
      </text>
      <rect x={264} y={50} width={90} height={50} rx={8} fill={C.claySoft} stroke={C.clay} />
      <text x={309} y={80} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.soft}>
        new
      </text>

      <text x={200} y={150} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.ink}>
        Request 2+
      </text>
      <rect x={60} y={164} width={200} height={50} rx={8} fill={C.sageSoft} stroke={C.sage} strokeDasharray="5 4" />
      <text x={160} y={194} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.sage}>
        reused (~10% cost)
      </text>
      <rect x={264} y={164} width={90} height={50} rx={8} fill={C.claySoft} stroke={C.clay} />
      <text x={309} y={194} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.soft}>
        new
      </text>

      <line x1={430} y1={50} x2={430} y2={214} stroke={C.line} />
      <text x={610} y={110} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fill={C.soft}>
        Prefix match:
      </text>
      <text x={610} y={134} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>
        reuse stops at the first
      </text>
      <text x={610} y={152} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>
        byte that differs
      </text>
    </Frame>
  );
}

function EvalLoop() {
  const steps = [
    { x: 70, label: "Dataset", fill: C.blueSoft },
    { x: 230, label: "Run prompt", fill: C.cream },
    { x: 390, label: "Grade", fill: C.ochreSoft },
    { x: 550, label: "Measure", fill: C.sageSoft },
  ];
  return (
    <Frame h={220}>
      {steps.map((s, i) => (
        <g key={i}>
          <Node x={s.x} y={70} w={130} h={60} label={s.label} fill={s.fill} />
          {i < steps.length - 1 && <Arrow x1={s.x + 130} y1={100} x2={s.x + 160} y2={100} />}
        </g>
      ))}
      <Arrow x1={615} y1={134} x2={135} y2={150} color={C.clay} dashed />
      <Cap x={400} y={185} text="Refine and repeat — improvement with evidence, not vibes" color={C.clay} />
    </Frame>
  );
}

function ToolLoop() {
  return (
    <Frame h={260}>
      <Node x={300} y={30} w={200} h={70} label="Claude" sub="'call get_weather(Paris)'" accent />
      <Node x={560} y={130} w={200} h={70} label="Your code" sub="runs the function" />
      <Node x={300} y={185} w={200} h={60} label="Claude" sub="writes final answer" accent />
      <Node x={40} y={130} w={200} h={70} label="tool_result" sub="{ '72°F, sunny' }" fill={C.sageSoft} />
      <Arrow x1={500} y1={75} x2={595} y2={128} />
      <Cap x={560} y={112} text="tool_use" />
      <Arrow x1={560} y1={200} x2={245} y2={165} />
      <Cap x={400} y={150} text="result" />
      <Arrow x1={140} y1={200} x2={300} y2={215} />
    </Frame>
  );
}

function AgenticLoop() {
  const cx = 400;
  const cy = 150;
  const r = 92;
  const labels = [
    { a: -90, t: "Observe" },
    { a: 0, t: "Think" },
    { a: 90, t: "Act" },
    { a: 180, t: "Result" },
  ];
  return (
    <Frame h={300}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.clay} strokeWidth={2} strokeDasharray="6 7" className="animate-flow" />
      {labels.map((l, i) => {
        const rad = (l.a * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={36} fill={C.claySoft} stroke={C.clay} strokeWidth={1.5} />
            <text x={x} y={y + 5} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.ink}>
              {l.t}
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={16} fill={C.muted}>
        the loop
      </text>
      <Cap x={cx} y={285} text="Repeats until stop_reason = end_turn" />
    </Frame>
  );
}

function AgentVsWorkflow() {
  return (
    <Frame h={260}>
      <text x={200} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.sage}>
        Workflow
      </text>
      {["A", "B", "C"].map((s, i) => (
        <g key={i}>
          <Node x={60 + i * 100} y={70} w={80} h={50} label={s} fill={C.sageSoft} />
          {i < 2 && <Arrow x1={140 + i * 100} y1={95} x2={160 + i * 100} y2={95} />}
        </g>
      ))}
      <Cap x={200} y={150} text="your code fixes the steps" color={C.sage} />

      <text x={600} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.clay}>
        Agent
      </text>
      <Node x={520} y={70} w={160} h={50} label="model decides" fill={C.claySoft} stroke={C.clay} />
      <Arrow x1={560} y1={120} x2={520} y2={160} color={C.clay} />
      <Arrow x1={600} y1={120} x2={600} y2={160} color={C.clay} />
      <Arrow x1={640} y1={120} x2={680} y2={160} color={C.clay} />
      <Cap x={600} y={185} text="trajectory chosen at runtime" color={C.clay} />
    </Frame>
  );
}

function Mcp() {
  const clients = ["Claude app", "Your agent", "IDE"];
  const servers = ["GitHub", "Database", "Slack"];
  return (
    <Frame h={300}>
      {clients.map((c, i) => (
        <Node key={c} x={50} y={50 + i * 75} w={150} h={56} label={c} fill={C.blueSoft} />
      ))}
      <Node x={320} y={110} w={160} h={80} label="MCP" sub="common protocol" accent />
      {servers.map((s, i) => (
        <Node key={s} x={600} y={50 + i * 75} w={150} h={56} label={s} fill={C.sageSoft} />
      ))}
      {clients.map((_, i) => (
        <Arrow key={i} x1={200} y1={78 + i * 75} x2={318} y2={150} />
      ))}
      {servers.map((_, i) => (
        <Arrow key={i} x1={482} y1={150} x2={598} y2={78 + i * 75} color={C.sage} />
      ))}
      <Cap x={400} y={215} text="Build a connector once — every MCP-aware client can use it" />
    </Frame>
  );
}

function ManagedAgents() {
  return (
    <Frame h={270}>
      <Node x={50} y={100} w={170} h={80} label="Agent" sub="model · system · tools" accent />
      <Cap x={135} y={205} text="created once (versioned)" />
      <Arrow x1={222} y1={140} x2={300} y2={140} />
      <Cap x={262} y={126} text="referenced by" />
      <Node x={305} y={100} w={160} h={80} label="Session" sub="one run" fill={C.blueSoft} />
      <Arrow x1={467} y1={140} x2={545} y2={140} />
      <rect x={548} y={70} width={210} height={140} rx={14} fill={C.sageSoft} stroke={C.sage} strokeDasharray="5 4" />
      <text x={653} y={95} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.ink}>
        Hosted container
      </text>
      <Node x={568} y={110} w={80} h={40} label="bash" fill={C.card} />
      <Node x={658} y={110} w={80} h={40} label="files" fill={C.card} />
      <Node x={568} y={158} w={170} h={40} label="code execution" fill={C.card} />
    </Frame>
  );
}

function RagPipeline() {
  return (
    <Frame h={290}>
      <Node x={40} y={120} w={140} h={60} label="Question" fill={C.cream} />
      <Node x={230} y={120} w={150} h={60} label="Retrieve" sub="vector search" fill={C.blueSoft} />
      <Node x={230} y={30} w={150} h={60} label="Knowledge base" sub="embedded chunks" fill={C.ochreSoft} />
      <Node x={430} y={120} w={150} h={60} label="Augment" sub="inject context" fill={C.sageSoft} />
      <Node x={630} y={110} w={130} h={80} label="Claude" sub="grounded answer" accent />
      <Arrow x1={182} y1={150} x2={226} y2={150} />
      <Arrow x1={305} y1={90} x2={305} y2={116} dashed color={C.ochre} />
      <Arrow x1={382} y1={150} x2={426} y2={150} />
      <Arrow x1={582} y1={150} x2={626} y2={150} flow color={C.clay} />
      <Cap x={400} y={245} text="Retrieve relevant chunks → inject into the prompt → answer from your facts (with citations)" />
    </Frame>
  );
}

function Embeddings() {
  const pts = [
    { x: 250, y: 90, t: "cancel plan", c: C.clay },
    { x: 290, y: 120, t: "end subscription", c: C.clay },
    { x: 270, y: 70, t: "stop billing", c: C.clay },
    { x: 560, y: 200, t: "reset password", c: C.blue },
    { x: 600, y: 175, t: "forgot login", c: C.blue },
  ];
  return (
    <Frame h={280}>
      <text x={400} y={36} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={600} fill={C.ink}>
        Meaning space — similar meanings cluster
      </text>
      <rect x={60} y={50} width={680} height={200} rx={14} fill={C.cream} stroke={C.line} />
      <ellipse cx={275} cy={95} rx={95} ry={62} fill={C.claySoft} opacity={0.5} />
      <ellipse cx={585} cy={188} rx={95} ry={48} fill={C.blueSoft} opacity={0.6} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={6} fill={p.c} />
          <text x={p.x + 10} y={p.y + 4} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
            {p.t}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function Thinking() {
  return (
    <Frame h={230}>
      <rect x={60} y={60} width={400} height={110} rx={12} fill={C.sageSoft} stroke={C.sage} strokeDasharray="5 4" />
      <text x={80} y={88} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.sage}>
        thinking block
      </text>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={80} y1={108 + i * 18} x2={420} y2={108 + i * 18} stroke={C.sage} strokeWidth={2} opacity={0.4} className="animate-pulse-soft" />
      ))}
      <Arrow x1={460} y1={115} x2={520} y2={115} flow color={C.clay} />
      <Node x={524} y={80} w={220} h={70} label="Final answer" sub="more reliable" accent />
      <Cap x={400} y={205} text="Reason first (scratchpad), then answer — depth controlled by effort" />
    </Frame>
  );
}

function ServerTools() {
  return (
    <Frame h={250}>
      <Node x={60} y={95} w={150} h={60} label="Your request" sub="declare the tool" />
      <rect x={300} y={50} width={200} height={150} rx={14} fill={C.claySoft} stroke={C.clay} />
      <text x={400} y={78} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.ink}>
        Anthropic runs it
      </text>
      <Node x={320} y={92} w={160} h={36} label="web search" fill={C.card} />
      <Node x={320} y={136} w={160} h={36} label="code execution" fill={C.card} />
      <Node x={590} y={95} w={150} h={60} label="Result inline" sub="no loop for you" fill={C.sageSoft} />
      <Arrow x1={212} y1={125} x2={296} y2={125} />
      <Arrow x1={504} y1={125} x2={586} y2={125} flow color={C.clay} />
    </Frame>
  );
}

function ContextManagement() {
  return (
    <Frame h={250}>
      <Node x={50} y={95} w={160} h={70} label="Caching" sub="reuse stable prefix" fill={C.blueSoft} />
      <Node x={320} y={95} w={160} h={70} label="Context editing" sub="prune stale blocks" fill={C.ochreSoft} />
      <Node x={590} y={95} w={160} h={70} label="Compaction" sub="summarize history" fill={C.sageSoft} />
      <text x={400} y={45} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={600} fill={C.ink}>
        Keeping long runs inside the window
      </text>
      <Cap x={400} y={205} text="Plus the memory tool for state that persists across sessions" />
    </Frame>
  );
}

const REGISTRY: Record<DiagramName, () => JSX.Element> = {
  "request-response": RequestResponse,
  tokens: Tokens,
  "context-window": ContextWindow,
  "model-tiers": ModelTiers,
  temperature: Temperature,
  streaming: Streaming,
  multimodal: Multimodal,
  "message-roles": MessageRoles,
  "prompt-anatomy": PromptAnatomy,
  caching: Caching,
  "eval-loop": EvalLoop,
  "tool-loop": ToolLoop,
  "agentic-loop": AgenticLoop,
  "agent-vs-workflow": AgentVsWorkflow,
  mcp: Mcp,
  "managed-agents": ManagedAgents,
  "rag-pipeline": RagPipeline,
  embeddings: Embeddings,
  thinking: Thinking,
  "server-tools": ServerTools,
  "context-management": ContextManagement,
};

export function Diagram({ name, caption }: { name: DiagramName; caption?: string }) {
  const Cmp = REGISTRY[name];
  return (
    <figure className="my-8">
      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-4 sm:p-6 shadow-sm">
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
