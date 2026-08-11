import type { DiagramName } from "@/lib/types";

/* ---------- shared palette ---------- */
const C = {
  ink: "#101720",
  soft: "#2C3644",
  muted: "#5A6675",
  line: "#CBD3DB",
  canvas: "#F4F6F7",
  card: "#FFFFFF",
  iris: "#A21CAF", // electric magenta (primary)
  irisSoft: "#FBEAFE",
  teal: "#0E7490", // signal cyan
  tealSoft: "#E0F5FA",
  amber: "#A16207", // cost / latency
  amberSoft: "#FDF3DC",
  rose: "#BE123C", // risk / failure
  roseSoft: "#FDE7EC",
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

function AiEngineerStack() {
  const layers = [
    { label: "Product surface", sub: "chat UI · copilot · batch job · API", c: C.iris, s: C.irisSoft },
    { label: "Orchestration", sub: "prompts · tools · agent loop · memory · retrieval", c: C.teal, s: C.tealSoft },
    { label: "Model layer", sub: "frontier API · open-weight · embeddings · rerankers", c: C.amber, s: C.amberSoft },
    { label: "Data & infra", sub: "vector store · object store · GPUs · gateway · traces", c: C.muted, s: C.canvas },
  ];
  return (
    <Frame h={330}>
      {layers.map((l, i) => {
        const y = 30 + i * 70;
        return (
          <g key={l.label}>
            <rect x={110} y={y} width={580} height={54} rx={12} fill={l.s} stroke={l.c} strokeWidth={1.7} />
            <text x={132} y={y + 24} fontFamily="var(--font-sans)" fontSize={14.5} fontWeight={700} fill={l.c}>
              {l.label}
            </text>
            <text x={132} y={y + 42} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
              {l.sub}
            </text>
          </g>
        );
      })}
      <text x={60} y={70} fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.iris}>
        yours
      </text>
      <text x={60} y={140} fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.teal}>
        yours
      </text>
      <text x={54} y={210} fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.amber}>
        rented
      </text>
      <text x={54} y={280} fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.muted}>
        mixed
      </text>
      <Cap x={400} y={318} text="The AI Engineer owns the middle two layers — where almost all product quality is decided." />
    </Frame>
  );
}

function RoleSpectrum() {
  const roles = [
    { x: 70, label: "Data Scientist", sub: "questions → insight", c: C.muted },
    { x: 250, label: "ML Engineer", sub: "trains & serves models", c: C.teal },
    { x: 430, label: "AI Engineer", sub: "builds on models", c: C.iris },
    { x: 610, label: "Software Engineer", sub: "builds systems", c: C.muted },
  ];
  return (
    <Frame h={280}>
      <line x1={60} y1={200} x2={740} y2={200} stroke={C.line} strokeWidth={2} />
      {roles.map((r) => (
        <g key={r.label}>
          <rect
            x={r.x}
            y={80}
            width={130}
            height={62}
            rx={12}
            fill={r.c === C.iris ? C.irisSoft : C.card}
            stroke={r.c}
            strokeWidth={r.c === C.iris ? 2.2 : 1.5}
          />
          <text x={r.x + 65} y={106} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={r.c}>
            {r.label}
          </text>
          <text x={r.x + 65} y={126} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>
            {r.sub}
          </text>
          <line x1={r.x + 65} y1={142} x2={r.x + 65} y2={194} stroke={C.line} strokeWidth={1.4} strokeDasharray="4 4" />
          <circle cx={r.x + 65} cy={200} r={5} fill={r.c} />
        </g>
      ))}
      <text x={70} y={232} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
        ← statistics, experiments
      </text>
      <text x={740} y={232} textAnchor="end" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
        systems, latency, uptime →
      </text>
      <text x={400} y={52} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        One spectrum, four centres of gravity
      </text>
      <Cap x={400} y={262} text="The AI Engineer sits closest to software engineering: the model is a dependency, not a deliverable." />
    </Frame>
  );
}

function LlmIo() {
  const stages = [
    { label: "Text in", sub: "prompt + context" },
    { label: "Tokenizer", sub: "text → token IDs" },
    { label: "Forward pass", sub: "transformer layers" },
    { label: "Logits", sub: "score per token" },
    { label: "Sampling", sub: "temp · top-p" },
    { label: "Token out", sub: "append & repeat" },
  ];
  return (
    <Frame h={300}>
      {stages.map((s, i) => {
        const x = 24 + i * 128;
        const accent = i === 2 || i === 4;
        return (
          <g key={s.label}>
            <rect
              x={x}
              y={90}
              width={110}
              height={62}
              rx={11}
              fill={accent ? C.irisSoft : C.card}
              stroke={accent ? C.iris : C.line}
              strokeWidth={accent ? 2 : 1.5}
            />
            <text x={x + 55} y={116} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={accent ? C.iris : C.ink}>
              {s.label}
            </text>
            <text x={x + 55} y={134} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
              {s.sub}
            </text>
            {i < stages.length - 1 && <Arrow x1={x + 112} y1={121} x2={x + 126} y2={121} color={C.teal} />}
          </g>
        );
      })}
      {/* autoregressive loop */}
      <path d="M735 152 C 760 215, 120 215, 90 160" fill="none" stroke={C.teal} strokeWidth={1.8} strokeDasharray="6 6" className="animate-flow" />
      <text x={400} y={228} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.teal}>
        every generated token is fed back in — this loop is why output latency is per-token
      </text>
      <text x={400} y={54} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        One model call = one loop per output token
      </text>
      <Cap x={400} y={272} text="Prefill (reading your prompt) happens once and in parallel; decode happens once per output token, in sequence." />
    </Frame>
  );
}

function ModelLandscape() {
  return (
    <Frame h={360}>
      {/* axes */}
      <line x1={110} y1={310} x2={710} y2={310} stroke={C.line} strokeWidth={2} />
      <line x1={110} y1={40} x2={110} y2={310} stroke={C.line} strokeWidth={2} />
      <text x={410} y={340} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>
        cost &amp; latency per call →
      </text>
      <text x={-175} y={30} transform="rotate(-90)" textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>
        capability →
      </text>

      {[
        { x: 150, y: 240, r: 34, label: "Small / edge", sub: "1–8B, on-device", c: C.muted, s: C.canvas },
        { x: 300, y: 190, r: 40, label: "Fast tier", sub: "cheap workhorse", c: C.teal, s: C.tealSoft },
        { x: 470, y: 120, r: 46, label: "Frontier", sub: "hard reasoning", c: C.iris, s: C.irisSoft },
        { x: 620, y: 90, r: 42, label: "Reasoning", sub: "test-time compute", c: C.amber, s: C.amberSoft },
      ].map((b) => (
        <g key={b.label}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.s} stroke={b.c} strokeWidth={2} />
          <text x={b.x} y={b.y - 2} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={b.c}>
            {b.label}
          </text>
          <text x={b.x} y={b.y + 14} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>
            {b.sub}
          </text>
        </g>
      ))}
      <rect x={470} y={252} width={240} height={46} rx={10} fill={C.card} stroke={C.line} strokeWidth={1.4} strokeDasharray="5 4" />
      <text x={590} y={272} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.soft}>
        Open-weight, self-hosted
      </text>
      <text x={590} y={288} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
        moves the cost axis, not the capability axis
      </text>
      <Cap x={400} y={356} text="Route each request to the cheapest tier that still passes your evals — that routing decision is the job." />
    </Frame>
  );
}

const REGISTRY: Record<DiagramName, () => JSX.Element> = {
  "ai-engineer-stack": AiEngineerStack,
  "role-spectrum": RoleSpectrum,
  "llm-io": LlmIo,
  "model-landscape": ModelLandscape,
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
