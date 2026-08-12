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

function FailureModes() {
  const cells = [
    { x: 40, label: "Knowledge cutoff", sub: "confident but out of date", fix: "→ retrieval", c: C.teal, s: C.tealSoft },
    { x: 232, label: "Plausible continuation", sub: "invented cites, APIs, IDs", fix: "→ grounding + validation", c: C.iris, s: C.irisSoft },
    { x: 424, label: "Context dilution", sub: "ignores part of the prompt", fix: "→ shorten, reorder, split", c: C.amber, s: C.amberSoft },
    { x: 616, label: "Capability gap", sub: "same edge case, every time", fix: "→ examples or fine-tune", c: C.rose, s: C.roseSoft },
  ];
  return (
    <Frame h={280}>
      <text x={400} y={38} textAnchor="middle" fontFamily="var(--font-display)" fontSize={14} fontWeight={700} fill={C.ink}>
        &ldquo;It hallucinated&rdquo; is four different bugs
      </text>
      {cells.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={68} width={148} height={110} rx={13} fill={c.s} stroke={c.c} strokeWidth={1.8} />
          <text x={c.x + 74} y={96} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={c.c}>
            {c.label}
          </text>
          <text x={c.x + 74} y={118} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>
            {c.sub}
          </text>
          <line x1={c.x + 24} y1={134} x2={c.x + 124} y2={134} stroke={c.c} strokeWidth={1} opacity={0.4} />
          <text x={c.x + 74} y={156} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={600} fill={C.ink}>
            {c.fix}
          </text>
        </g>
      ))}
      <rect x={40} y={200} width={724} height={40} rx={10} fill={C.card} stroke={C.line} strokeWidth={1.4} strokeDasharray="5 4" />
      <text x={402} y={225} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
        Diagnose which one you have before you change anything — the four fixes are not interchangeable.
      </text>
      <Cap x={400} y={268} text="Most stuck teams are applying the fix for one column to a failure from another." />
    </Frame>
  );
}

function PromptAnatomy() {
  const parts = [
    { label: "Role / system prompt", sub: "who it is, standing rules", c: C.iris, stable: true },
    { label: "Tool definitions", sub: "only the ones this request needs", c: C.iris, stable: true },
    { label: "Context / documents", sub: "delimited, reranked, few", c: C.teal, stable: false },
    { label: "Examples (few-shot)", sub: "format + edge cases", c: C.teal, stable: false },
    { label: "Output contract", sub: "a literal schema, not prose", c: C.amber, stable: false },
    { label: "The input", sub: "last, adjacent to generation", c: C.amber, stable: false },
  ];
  return (
    <Frame h={340}>
      <text x={252} y={30} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13} fontWeight={700} fill={C.ink}>
        Order by stability, top to bottom
      </text>
      {parts.map((p, i) => {
        const y = 44 + i * 46;
        return (
          <g key={p.label}>
            <rect x={64} y={y} width={376} height={38} rx={9} fill={p.stable ? C.irisSoft : C.card} stroke={p.c} strokeWidth={1.6} />
            <text x={80} y={y + 17} fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={p.c}>
              {p.label}
            </text>
            <text x={80} y={y + 31} fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
              {p.sub}
            </text>
          </g>
        );
      })}
      {/* cache bracket */}
      <path d="M452 46 h14 v86 h-14" fill="none" stroke={C.iris} strokeWidth={1.8} />
      <text x={474} y={84} fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>
        cacheable prefix
      </text>
      <text x={474} y={101} fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
        identical across requests →
      </text>
      <text x={474} y={116} fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
        big input-cost + TTFT win
      </text>

      <rect x={468} y={162} width={290} height={112} rx={11} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.6} />
      <text x={484} y={184} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.rose}>
        The classic own goal
      </text>
      <text x={484} y={205} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
        A timestamp or request ID at the
      </text>
      <text x={484} y={221} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
        very top changes one token — and
      </text>
      <text x={484} y={237} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
        invalidates the entire cached prefix
      </text>
      <text x={484} y={253} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
        on every single request.
      </text>
      <Cap x={400} y={324} text="The same ordering that reads clearly to a model is the ordering that caches well." />
    </Frame>
  );
}

function ContextBudget() {
  const blocks = [
    { label: "system + policies", w: 70, c: C.iris, s: C.irisSoft },
    { label: "tools", w: 55, c: C.iris, s: C.irisSoft },
    { label: "conversation history", w: 130, c: C.teal, s: C.tealSoft },
    { label: "retrieved documents", w: 230, c: C.teal, s: C.tealSoft },
    { label: "tool results", w: 105, c: C.amber, s: C.amberSoft },
    { label: "reply headroom", w: 100, c: C.rose, s: C.roseSoft },
  ];
  let x = 50;
  return (
    <Frame h={300}>
      <text x={400} y={38} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        One context window, allocated on purpose
      </text>
      {blocks.map((b) => {
        const bx = x;
        x += b.w + 4;
        return (
          <g key={b.label}>
            <rect x={bx} y={62} width={b.w} height={54} rx={8} fill={b.s} stroke={b.c} strokeWidth={1.6} />
            <text
              x={bx + b.w / 2}
              y={94}
              textAnchor="middle"
              fontFamily="var(--font-sans)"
              fontSize={9.5}
              fontWeight={600}
              fill={b.c}
            >
              {b.label.length > 16 ? b.label.split(" ")[0] : b.label}
            </text>
          </g>
        );
      })}
      <line x1={50} y1={128} x2={750} y2={128} stroke={C.line} strokeWidth={1.4} />
      <text x={50} y={146} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>
        0 tokens
      </text>
      <text x={750} y={146} textAnchor="end" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>
        context limit
      </text>

      {[
        { x: 50, t: "SELECT", d: "retrieve just in time,", d2: "not just in case", c: C.iris },
        { x: 230, t: "COMPRESS", d: "summarise, dedupe,", d2: "strip boilerplate", c: C.teal },
        { x: 410, t: "ORDER", d: "stable first,", d2: "decisive last", c: C.amber },
        { x: 590, t: "EVICT", d: "drop what is no", d2: "longer load-bearing", c: C.rose },
      ].map((o) => (
        <g key={o.t}>
          <rect x={o.x} y={176} width={160} height={72} rx={11} fill={C.card} stroke={o.c} strokeWidth={1.6} />
          <text x={o.x + 80} y={200} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={o.c}>
            {o.t}
          </text>
          <text x={o.x + 80} y={219} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>
            {o.d}
          </text>
          <text x={o.x + 80} y={234} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>
            {o.d2}
          </text>
        </g>
      ))}
      <Cap x={400} y={282} text="Ask of any block: what would break if we deleted this? If nobody can say, delete it." />
    </Frame>
  );
}

function StructuredOutputLoop() {
  return (
    <Frame h={310}>
      <Node x={30} y={70} w={150} h={62} label="Constrain" sub="tool / grammar" accent />
      <Arrow x1={182} y1={101} x2={214} y2={101} color={C.teal} />
      <Node x={216} y={70} w={150} h={62} label="Parse" sub="into a typed model" />
      <Arrow x1={368} y1={101} x2={400} y2={101} color={C.teal} />
      <Node x={402} y={70} w={160} h={62} label="Validate" sub="schema + semantics" />
      <Arrow x1={564} y1={101} x2={596} y2={101} color={C.teal} />
      <Node x={598} y={70} w={172} h={62} label="Use it" sub="downstream, safely" fill={C.tealSoft} stroke={C.teal} />

      {/* repair path */}
      <path d="M482 134 v34 h-260 v-34" fill="none" stroke={C.amber} strokeWidth={1.8} strokeDasharray="6 5" />
      <rect x={286} y={152} width={196} height={34} rx={9} fill={C.amberSoft} stroke={C.amber} strokeWidth={1.6} />
      <text x={384} y={173} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.amber}>
        repair once, with the error
      </text>

      {/* fail path */}
      <path d="M562 134 v88 h-140" fill="none" stroke={C.rose} strokeWidth={1.8} />
      <rect x={230} y={204} width={192} height={36} rx={9} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.6} />
      <text x={326} y={226} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.rose}>
        second failure → fail loudly
      </text>
      <text x={442} y={262} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>
        human queue · fallback model · null result — never a hopeful parse
      </text>
      <Cap x={400} y={296} text="A grammar guarantees the output parses. Only semantic checks tell you it is right." />
    </Frame>
  );
}

function ReasoningDial() {
  return (
    <Frame h={330}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        Accuracy vs thinking tokens, by task type
      </text>
      {/* axes */}
      <line x1={110} y1={270} x2={700} y2={270} stroke={C.line} strokeWidth={2} />
      <line x1={110} y1={60} x2={110} y2={270} stroke={C.line} strokeWidth={2} />
      <text x={405} y={296} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
        thinking tokens (billed as output, generated sequentially) →
      </text>
      <text x={-165} y={30} transform="rotate(-90)" textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>
        accuracy →
      </text>

      {/* hard task curve — rises */}
      <path d="M110 250 C 260 250, 330 110, 690 88" fill="none" stroke={C.iris} strokeWidth={2.6} />
      <text x={556} y={78} fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>
        planning · multi-step maths · debugging
      </text>

      {/* easy task curve — flat */}
      <path d="M110 128 C 300 126, 480 126, 690 126" fill="none" stroke={C.teal} strokeWidth={2.6} strokeDasharray="7 5" />
      <text x={498} y={148} fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.teal}>
        extraction · classification · lookup
      </text>

      {/* cost line */}
      <path d="M110 268 L 690 190" fill="none" stroke={C.amber} strokeWidth={2} strokeDasharray="4 4" />
      <text x={596} y={210} fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.amber}>
        cost &amp; latency
      </text>
      <Cap x={400} y={320} text="Same dial, opposite economics — which is why reasoning effort is a routing decision, not a global setting." />
    </Frame>
  );
}

function EmbeddingSpace() {
  const pts = [
    { x: 190, y: 110, label: "cancel my plan", c: C.iris },
    { x: 226, y: 138, label: "end subscription", c: C.iris },
    { x: 164, y: 152, label: "stop being billed", c: C.iris },
    { x: 400, y: 96, label: "upgrade tier", c: C.teal },
    { x: 438, y: 130, label: "add seats", c: C.teal },
    { x: 610, y: 190, label: "eu data regions", c: C.amber },
    { x: 648, y: 148, label: "sso setup", c: C.amber },
  ];
  return (
    <Frame h={310}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        Similar meaning → nearby points
      </text>
      <rect x={40} y={52} width={720} height={182} rx={14} fill={C.card} stroke={C.line} strokeWidth={1.4} />
      {/* neighbourhood halo */}
      <ellipse cx={195} cy={133} rx={92} ry={62} fill={C.irisSoft} opacity={0.85} />
      <ellipse cx={419} cy={113} rx={78} ry={50} fill={C.tealSoft} opacity={0.85} />
      <ellipse cx={629} cy={169} rx={80} ry={56} fill={C.amberSoft} opacity={0.85} />
      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={5.5} fill={p.c} />
          <text x={p.x} y={p.y - 12} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>
            {p.label}
          </text>
        </g>
      ))}
      {/* the query */}
      <circle cx={205} cy={128} r={9} fill="none" stroke={C.iris} strokeWidth={2.4} />
      <text x={205} y={214} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.iris}>
        query lands here
      </text>
      <text x={419} y={200} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.teal}>
        billing, different intent
      </text>
      <text x={629} y={220} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.amber}>
        unrelated topics
      </text>
      <rect x={40} y={250} width={720} height={34} rx={9} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.4} />
      <text x={400} y={272} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
        Weak spots: exact IDs (INV-90412), negation (&ldquo;without a renewal clause&rdquo;), and numeric comparison.
      </text>
    </Frame>
  );
}

function ChunkingStrategies() {
  const strategies = [
    { label: "Fixed size", c: C.rose, cuts: [0.24, 0.48, 0.72], note: "cuts mid-sentence, mid-table" },
    { label: "Fixed + overlap", c: C.amber, cuts: [0.26, 0.5, 0.74], note: "boundaries survive, still arbitrary" },
    { label: "Structure-aware", c: C.iris, cuts: [0.18, 0.44, 0.79], note: "follows headings and sections" },
    { label: "Small-to-big", c: C.teal, cuts: [0.14, 0.3, 0.44, 0.62, 0.79], note: "search small, return the parent" },
  ];
  return (
    <Frame h={330}>
      <text x={400} y={32} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        Four ways to cut the same document
      </text>
      {strategies.map((s, i) => {
        const y = 52 + i * 68;
        return (
          <g key={s.label}>
            <text x={44} y={y + 24} fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={s.c}>
              {s.label}
            </text>
            <rect x={186} y={y} width={480} height={36} rx={7} fill={C.canvas} stroke={s.c} strokeWidth={1.6} />
            {s.cuts.map((c, j) => (
              <line
                key={j}
                x1={186 + 480 * c}
                y1={y}
                x2={186 + 480 * c}
                y2={y + 36}
                stroke={s.c}
                strokeWidth={2}
                strokeDasharray={i === 1 ? "4 3" : undefined}
              />
            ))}
            {i === 3 && (
              <rect x={186} y={y + 40} width={480} height={12} rx={4} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.2} />
            )}
            <text x={678} y={y + 23} fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
              {s.note}
            </text>
          </g>
        );
      })}
      <Cap x={400} y={318} text="Chunk on the author's own units of meaning — headings, clauses, functions — whenever the document has them." />
    </Frame>
  );
}

function AnnIndex() {
  const layers = [
    { y: 78, n: 3, label: "layer 2 — sparse, long hops" },
    { y: 148, n: 6, label: "layer 1 — medium" },
    { y: 218, n: 12, label: "layer 0 — every vector" },
  ];
  return (
    <Frame h={320}>
      <text x={400} y={36} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        HNSW: search coarse, then fine
      </text>
      {layers.map((l, li) => (
        <g key={l.y}>
          <rect x={140} y={l.y - 26} width={520} height={52} rx={11} fill={C.card} stroke={C.line} strokeWidth={1.3} />
          <text x={128} y={l.y + 4} textAnchor="end" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
            L{2 - li}
          </text>
          {Array.from({ length: l.n }).map((_, i) => {
            const x = 170 + (i * 460) / (l.n - 1);
            const onPath = (li === 0 && i === 1) || (li === 1 && i === 3) || (li === 2 && i === 7);
            return (
              <circle key={i} cx={x} cy={l.y} r={onPath ? 7 : 4.5} fill={onPath ? C.iris : C.line} />
            );
          })}
          <text x={676} y={l.y + 4} fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>
            {l.label.split("—")[1]}
          </text>
        </g>
      ))}
      {/* descent path */}
      <path d="M323 78 L 446 148 L 598 218" fill="none" stroke={C.iris} strokeWidth={2.2} strokeDasharray="6 4" className="animate-flow" />
      <text x={196} y={272} fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.teal}>
        ef_search = how many candidates you explore → your live recall/latency dial
      </text>
      <Cap x={400} y={300} text="Approximate means you can silently miss results — always measure recall@k against exact search." />
    </Frame>
  );
}

function HybridRerank() {
  return (
    <Frame h={330}>
      <Node x={30} y={40} w={140} h={54} label="Query" sub="rewritten if a follow-up" accent />

      <rect x={214} y={22} width={190} height={50} rx={11} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.7} />
      <text x={309} y={44} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.teal}>Vector search</text>
      <text x={309} y={60} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>meaning · top 50</text>

      <rect x={214} y={92} width={190} height={50} rx={11} fill={C.amberSoft} stroke={C.amber} strokeWidth={1.7} />
      <text x={309} y={114} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.amber}>BM25 keyword</text>
      <text x={309} y={130} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>exact terms · top 50</text>

      <Arrow x1={172} y1={62} x2={210} y2={47} color={C.teal} />
      <Arrow x1={172} y1={72} x2={210} y2={117} color={C.amber} />

      <Node x={438} y={52} w={140} h={60} label="RRF fuse" sub="rank, not score" />
      <Arrow x1={406} y1={47} x2={434} y2={72} color={C.muted} />
      <Arrow x1={406} y1={117} x2={434} y2={92} color={C.muted} />

      <Node x={612} y={52} w={158} h={60} label="Rerank" sub="cross-encoder → 5–10" accent />
      <Arrow x1={580} y1={82} x2={608} y2={82} color={C.iris} />

      {/* funnel numbers */}
      <text x={309} y={172} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>~100 candidates</text>
      <text x={508} y={172} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>50 fused</text>
      <text x={691} y={172} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.iris}>5–10 sent</text>

      <rect x={30} y={200} width={356} height={78} rx={12} fill={C.card} stroke={C.teal} strokeWidth={1.5} />
      <text x={48} y={224} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.teal}>Retrieval optimises recall</text>
      <text x={48} y={245} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>Is the right passage in the set at all?</text>
      <text x={48} y={264} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>If not, nothing downstream can save you.</text>

      <rect x={414} y={200} width={356} height={78} rx={12} fill={C.card} stroke={C.iris} strokeWidth={1.5} />
      <text x={432} y={224} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.iris}>Reranking optimises precision</text>
      <text x={432} y={245} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>Is it at position 1 instead of 30?</text>
      <text x={432} y={264} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>Usually the biggest single RAG win.</text>
      <Cap x={400} y={308} text="Retrieve wide, narrow hard. Retrieving only 5 up front loses the answers ranked 6–50 forever." />
    </Frame>
  );
}

function RagPipeline() {
  return (
    <Frame h={340}>
      {/* offline */}
      <rect x={30} y={40} width={740} height={104} rx={13} fill={C.canvas} stroke={C.line} strokeWidth={1.4} strokeDasharray="6 5" />
      <text x={48} y={62} fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.muted}>
        OFFLINE — ingestion, runs on a schedule
      </text>
      {["Parse", "Clean", "Chunk", "Enrich", "Embed"].map((s, i) => {
        const x = 48 + i * 128;
        return (
          <g key={s}>
            <rect x={x} y={76} width={104} height={44} rx={9} fill={C.card} stroke={C.teal} strokeWidth={1.5} />
            <text x={x + 52} y={103} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.teal}>
              {s}
            </text>
            <Arrow x1={x + 106} y1={98} x2={x + 122} y2={98} color={C.line} />
          </g>
        );
      })}
      <rect x={688} y={70} width={66} height={56} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={721} y={94} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={700} fill={C.teal}>index</text>
      <text x={721} y={108} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9} fill={C.muted}>+ metadata</text>

      {/* online */}
      <rect x={30} y={162} width={740} height={112} rx={13} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.6} />
      <text x={48} y={184} fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>
        ONLINE — per request
      </text>
      {["Rewrite", "Retrieve", "Rerank", "Assemble", "Generate", "Verify"].map((s, i) => {
        const x = 44 + i * 121;
        return (
          <g key={s}>
            <rect x={x} y={200} width={102} height={44} rx={9} fill={C.card} stroke={C.iris} strokeWidth={1.5} />
            <text x={x + 51} y={227} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.iris}>
              {s}
            </text>
            {i < 5 && <Arrow x1={x + 104} y1={222} x2={x + 119} y2={222} color={C.iris} />}
          </g>
        );
      })}
      {/* index feeds retrieval */}
      <path d="M721 128 v46 h-460 v22" fill="none" stroke={C.teal} strokeWidth={1.8} strokeDasharray="5 4" className="animate-flow" />
      <Cap x={400} y={300} text="Most teams build the online row first, then discover every real problem lives in the offline one." />
    </Frame>
  );
}

function AgenticRag() {
  return (
    <Frame h={330}>
      <Node x={40} y={130} w={130} h={56} label="Question" />
      <Arrow x1={172} y1={158} x2={214} y2={158} color={C.muted} />
      <rect x={216} y={106} width={190} height={104} rx={13} fill={C.irisSoft} stroke={C.iris} strokeWidth={2.2} />
      <text x={311} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>Model</text>
      <text x={311} y={162} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>decides: search?</text>
      <text x={311} y={178} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>reads · grades · retries</text>

      <rect x={452} y={62} width={180} height={48} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.6} />
      <text x={542} y={92} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.teal}>search(documents)</text>
      <rect x={452} y={122} width={180} height={48} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.6} />
      <text x={542} y={152} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.teal}>query(database)</text>
      <rect x={452} y={182} width={180} height={48} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.6} />
      <text x={542} y={212} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.teal}>fetch(api)</text>

      <Arrow x1={408} y1={140} x2={448} y2={96} color={C.teal} flow />
      <Arrow x1={408} y1={158} x2={448} y2={146} color={C.teal} flow />
      <Arrow x1={408} y1={176} x2={448} y2={206} color={C.teal} flow />
      {/* results back */}
      <path d="M636 86 h44 v134 h-44" fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M680 152 h-262" fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />

      <rect x={216} y={238} width={416} height={40} rx={10} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.6} />
      <text x={424} y={263} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.rose}>
        hard limits: max calls · token budget · timeout · no repeat queries
      </text>
      <Cap x={400} y={310} text="Depth on hard questions, in exchange for predictability. The limits are not optional." />
    </Frame>
  );
}

function GraphRag() {
  const nodes = [
    { x: 540, y: 92, l: "Acme Ltd", c: C.iris },
    { x: 664, y: 148, l: "Sub A", c: C.teal },
    { x: 600, y: 226, l: "Sanctioned", c: C.rose },
    { x: 472, y: 190, l: "Contract", c: C.amber },
  ];
  return (
    <Frame h={320}>
      <text x={214} y={36} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13} fontWeight={700} fill={C.ink}>
        Vector RAG
      </text>
      <text x={586} y={36} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13} fontWeight={700} fill={C.ink}>
        GraphRAG
      </text>
      <line x1={400} y1={52} x2={400} y2={276} stroke={C.line} strokeWidth={1.4} strokeDasharray="5 5" />

      {/* left: passages */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={92} y={72 + i * 56} width={244} height={42} rx={9} fill={C.card} stroke={C.teal} strokeWidth={1.5} />
          <text x={214} y={98 + i * 56} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
            {["passage mentioning Acme", "passage mentioning Sub A", "passage mentioning sanctions"][i]}
          </text>
        </g>
      ))}
      <text x={214} y={262} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.rose}>
        no passage states the connection
      </text>

      {/* right: graph */}
      <line x1={540} y1={92} x2={664} y2={148} stroke={C.muted} strokeWidth={1.8} />
      <line x1={664} y1={148} x2={600} y2={226} stroke={C.muted} strokeWidth={1.8} />
      <line x1={540} y1={92} x2={472} y2={190} stroke={C.muted} strokeWidth={1.8} />
      {nodes.map((n) => (
        <g key={n.l}>
          <circle cx={n.x} cy={n.y} r={30} fill={C.card} stroke={n.c} strokeWidth={2} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={700} fill={n.c}>
            {n.l}
          </text>
        </g>
      ))}
      <text x={604} y={124} fontFamily="var(--font-sans)" fontSize={9} fill={C.muted}>owns</text>
      <text x={646} y={196} fontFamily="var(--font-sans)" fontSize={9} fill={C.muted}>listed</text>
      <text x={586} y={262} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.iris}>
        traverse the edges to find it
      </text>
      <Cap x={400} y={302} text="Expensive to build and maintain — adopt only when a real question class is unreachable by similarity." />
    </Frame>
  );
}

function RagTriad() {
  return (
    <Frame h={330}>
      <Node x={40} y={40} w={150} h={54} label="Question" />
      <Node x={40} y={140} w={150} h={54} label="Context" sub="retrieved" fill={C.tealSoft} stroke={C.teal} />
      <Node x={40} y={240} w={150} h={54} label="Answer" fill={C.irisSoft} stroke={C.iris} />

      {[
        { y: 48, t: "Context relevance", d: "Is the retrieved context relevant to the question?", b: "→ blames RETRIEVAL: chunking, embeddings, ranking", c: C.teal },
        { y: 138, t: "Groundedness", d: "Is every claim in the answer supported by the context?", b: "→ blames GENERATION: it went beyond its sources", c: C.iris },
        { y: 228, t: "Answer relevance", d: "Does the answer address the question that was asked?", b: "→ blames GENERATION: correct but off-target", c: C.amber },
      ].map((m) => (
        <g key={m.t}>
          <rect x={244} y={m.y} width={512} height={72} rx={12} fill={C.card} stroke={m.c} strokeWidth={1.7} />
          <text x={264} y={m.y + 25} fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={m.c}>
            {m.t}
          </text>
          <text x={264} y={m.y + 44} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
            {m.d}
          </text>
          <text x={264} y={m.y + 61} fontFamily="var(--font-sans)" fontSize={10} fontWeight={600} fill={C.muted}>
            {m.b}
          </text>
        </g>
      ))}
      <line x1={116} y1={96} x2={116} y2={138} stroke={C.line} strokeWidth={1.6} />
      <line x1={116} y1={196} x2={116} y2={238} stroke={C.line} strokeWidth={1.6} />
      <Cap x={400} y={318} text="One blended 'quality' score cannot tell you which of these three broke." />
    </Frame>
  );
}

function ToolCallLoop() {
  return (
    <Frame h={310}>
      <rect x={40} y={60} width={300} height={180} rx={14} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.8} />
      <text x={190} y={86} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.iris}>
        MODEL — produces text only
      </text>
      <rect x={64} y={104} width={252} height={44} rx={9} fill={C.card} stroke={C.iris} strokeWidth={1.4} />
      <text x={190} y={131} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
        &ldquo;call search_orders(since=2026-01-01)&rdquo;
      </text>
      <rect x={64} y={166} width={252} height={44} rx={9} fill={C.card} stroke={C.iris} strokeWidth={1.4} />
      <text x={190} y={193} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
        continues with the result in context
      </text>

      <rect x={460} y={60} width={300} height={180} rx={14} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.8} />
      <text x={610} y={86} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.teal}>
        YOUR CODE — the trust boundary
      </text>
      {["1. validate arguments", "2. authorise as the end user", "3. execute with a timeout"].map((s, i) => (
        <g key={s}>
          <rect x={484} y={100 + i * 44} width={252} height={36} rx={8} fill={C.card} stroke={C.teal} strokeWidth={1.3} />
          <text x={610} y={123 + i * 44} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.soft}>
            {s}
          </text>
        </g>
      ))}

      <Arrow x1={344} y1={126} x2={456} y2={118} color={C.iris} flow />
      <text x={400} y={110} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={700} fill={C.iris}>tool_use</text>
      <Arrow x1={456} y1={190} x2={344} y2={188} color={C.teal} flow />
      <text x={400} y={210} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={700} fill={C.teal}>tool_result</text>

      <rect x={40} y={256} width={720} height={34} rx={9} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.4} />
      <text x={400} y={278} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.rose}>
        The model never executes anything. Every security control lives on the right-hand side.
      </text>
    </Frame>
  );
}

function AgentLoop() {
  return (
    <Frame h={330}>
      <Node x={40} y={140} w={124} h={54} label="Task" />
      <Arrow x1={166} y1={167} x2={196} y2={167} color={C.muted} />
      <rect x={198} y={116} width={168} height={102} rx={13} fill={C.irisSoft} stroke={C.iris} strokeWidth={2.2} />
      <text x={282} y={148} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>Model</text>
      <text x={282} y={170} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>reason → choose</text>
      <text x={282} y={188} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>next action</text>

      <Arrow x1={368} y1={167} x2={404} y2={167} color={C.teal} />
      <Node x={406} y={140} w={150} h={54} label="Execute tool" fill={C.tealSoft} stroke={C.teal} />
      <path d="M481 194 v46 h-199 v-20" fill="none" stroke={C.teal} strokeWidth={1.9} strokeDasharray="6 5" className="animate-flow" />
      <text x={382} y={258} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.teal}>observe, then loop</text>

      <Arrow x1={558} y1={152} x2={596} y2={128} color={C.iris} />
      <Node x={598} y={100} w={162} h={54} label="Answer" sub="normal exit" accent />

      {/* the four exits */}
      <text x={648} y={186} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.rose}>
        forced exits
      </text>
      {["step limit", "token budget", "wall-clock timeout", "no progress"].map((e, i) => (
        <g key={e}>
          <rect x={572} y={196 + i * 26} width={188} height={22} rx={6} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.2} />
          <text x={666} y={211 + i * 26} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={600} fill={C.rose}>
            {e}
          </text>
        </g>
      ))}
      <Cap x={330} y={306} text="All four exits, not whichever one you remembered — and label partial results as incomplete." />
    </Frame>
  );
}

function AgentMemory() {
  const rows = [
    { t: "Working", life: "one run", store: "the context window", ex: "current sub-goal, last tool result", c: C.iris },
    { t: "Session", life: "one conversation", store: "history + summary", ex: "what the user asked ten turns ago", c: C.teal },
    { t: "Long-term", life: "indefinite", store: "database, retrieved", ex: "“prefers metric units”", c: C.amber },
    { t: "External state", life: "owned by the system", store: "files, records", ex: "the draft document, the open ticket", c: C.rose },
  ];
  return (
    <Frame h={306}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        &ldquo;Memory&rdquo; is four systems wearing one name
      </text>
      {["type", "lifetime", "where it lives", "example"].map((h, i) => (
        <text key={h} x={[70, 232, 396, 570][i]} y={62} fontFamily="var(--font-sans)" fontSize={10} fontWeight={700} fill={C.muted}>
          {h.toUpperCase()}
        </text>
      ))}
      {rows.map((r, i) => {
        const y = 74 + i * 50;
        return (
          <g key={r.t}>
            <rect x={54} y={y} width={696} height={42} rx={9} fill={C.card} stroke={r.c} strokeWidth={1.5} />
            <text x={70} y={y + 26} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={r.c}>{r.t}</text>
            <text x={232} y={y + 26} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>{r.life}</text>
            <text x={396} y={y + 26} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>{r.store}</text>
            <text x={570} y={y + 26} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.muted}>{r.ex}</text>
          </g>
        );
      })}
      <Cap x={400} y={296} text="The file system is the underused one: unlimited, inspectable, resumable, a few tokens per reference." />
    </Frame>
  );
}

function MultiAgentTopologies() {
  return (
    <Frame h={300}>
      {/* single */}
      <text x={110} y={48} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.teal}>Single agent</text>
      <circle cx={110} cy={110} r={26} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={110} y1={136} x2={70 + i * 40} y2={176} stroke={C.line} strokeWidth={1.5} />
          <rect x={54 + i * 40 - 14} y={176} width={28} height={20} rx={5} fill={C.card} stroke={C.line} strokeWidth={1.2} />
        </g>
      ))}
      <text x={110} y={222} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>right far more often</text>
      <text x={110} y={236} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>than people expect</text>

      {/* supervisor */}
      <text x={310} y={48} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>Supervisor</text>
      <circle cx={310} cy={92} r={24} fill={C.irisSoft} stroke={C.iris} strokeWidth={2.2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={310} y1={116} x2={254 + i * 56} y2={160} stroke={C.iris} strokeWidth={1.6} />
          <circle cx={254 + i * 56} cy={176} r={17} fill={C.card} stroke={C.iris} strokeWidth={1.6} />
        </g>
      ))}
      <text x={310} y={222} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={700} fill={C.iris}>the one that works</text>
      <text x={310} y={236} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>context isolation + parallelism</text>

      {/* pipeline */}
      <text x={520} y={48} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.amber}>Pipeline</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={462 + i * 58} cy={128} r={20} fill={C.amberSoft} stroke={C.amber} strokeWidth={1.8} />
          {i < 2 && <Arrow x1={484 + i * 58} y1={128} x2={498 + i * 58} y2={128} color={C.amber} />}
        </g>
      ))}
      <text x={520} y={222} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>this is a workflow —</text>
      <text x={520} y={236} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>write it as one</text>

      {/* swarm */}
      <text x={700} y={48} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.rose}>Swarm</text>
      {[
        [700, 88], [656, 148], [744, 148], [700, 186],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={16} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.6} />
      ))}
      <g stroke={C.rose} strokeWidth={1.2} opacity={0.7}>
        <line x1={700} y1={88} x2={656} y2={148} />
        <line x1={700} y1={88} x2={744} y2={148} />
        <line x1={656} y1={148} x2={744} y2={148} />
        <line x1={656} y1={148} x2={700} y2={186} />
        <line x1={744} y1={148} x2={700} y2={186} />
        <line x1={700} y1={88} x2={700} y2={186} />
      </g>
      <text x={700} y={222} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={700} fill={C.rose}>rarely converges</text>
      <text x={700} y={236} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>avoid in production</text>

      <Cap x={400} y={276} text="Split for context isolation, parallelism, or differing permissions — never for job titles." />
    </Frame>
  );
}

function McpArchitecture() {
  const servers = [
    { l: "GitHub", s: "issues, PRs, code" },
    { l: "Postgres", s: "read-only queries" },
    { l: "Internal API", s: "orders, billing" },
  ];
  return (
    <Frame h={330}>
      {/* host */}
      <rect x={40} y={48} width={300} height={186} rx={14} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={190} y={74} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.iris}>
        HOST — the AI application
      </text>
      <rect x={68} y={90} width={244} height={44} rx={10} fill={C.card} stroke={C.iris} strokeWidth={1.5} />
      <text x={190} y={117} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.soft}>
        model + permission decisions
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={68} y={148 + i * 28} width={244} height={22} rx={6} fill={C.canvas} stroke={C.line} strokeWidth={1.2} />
          <text x={190} y={163 + i * 28} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>
            client {i + 1} — one per server
          </text>
        </g>
      ))}

      {/* servers */}
      {servers.map((sv, i) => (
        <g key={sv.l}>
          <rect x={520} y={54 + i * 62} width={240} height={50} rx={11} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.7} />
          <text x={640} y={76 + i * 62} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.teal}>
            {sv.l} MCP server
          </text>
          <text x={640} y={92 + i * 62} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>
            {sv.s}
          </text>
          <Arrow x1={318} y1={159 + i * 28} x2={514} y2={79 + i * 62} color={C.teal} dashed />
        </g>
      ))}
      <text x={418} y={240} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={700} fill={C.teal}>
        JSON-RPC over stdio or Streamable HTTP
      </text>
      <rect x={40} y={258} width={720} height={36} rx={9} fill={C.card} stroke={C.line} strokeWidth={1.4} strokeDasharray="5 4" />
      <text x={400} y={281} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
        N×M integrations become N+M — write the server once, every host can use it.
      </text>
    </Frame>
  );
}

function McpPrimitives() {
  const prims = [
    { t: "Tools", who: "the MODEL decides", ex: "search_orders(since, status)", c: C.iris, s: C.irisSoft },
    { t: "Resources", who: "the APPLICATION attaches", ex: "orders://recent", c: C.teal, s: C.tealSoft },
    { t: "Prompts", who: "the USER triggers", ex: "/investigate_order", c: C.amber, s: C.amberSoft },
  ];
  return (
    <Frame h={320}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        Three primitives, three controllers
      </text>
      {prims.map((p, i) => {
        const x = 40 + i * 246;
        return (
          <g key={p.t}>
            <rect x={x} y={54} width={228} height={104} rx={13} fill={p.s} stroke={p.c} strokeWidth={1.9} />
            <text x={x + 114} y={82} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={p.c}>
              {p.t}
            </text>
            <text x={x + 114} y={104} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill={C.soft}>
              {p.who}
            </text>
            <text x={x + 114} y={132} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9.5} fill={C.muted}>
              {p.ex}
            </text>
          </g>
        );
      })}
      <text x={400} y={190} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.rose}>
        every call must still pass through your checks
      </text>
      {["validate arguments", "authenticate the user", "authorise per tool", "rate limit", "bound the result", "log for audit"].map((c, i) => (
        <g key={c}>
          <rect x={44 + (i % 3) * 246} y={204 + Math.floor(i / 3) * 40} width={228} height={30} rx={8} fill={C.card} stroke={C.rose} strokeWidth={1.4} />
          <text x={158 + (i % 3) * 246} y={224 + Math.floor(i / 3) * 40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill={C.rose}>
            {c}
          </text>
        </g>
      ))}
      <Cap x={400} y={306} text="MCP standardises how capabilities are exposed. It never decides who may use them." />
    </Frame>
  );
}

function AdaptationLadder() {
  const rungs = [
    { t: "Prompting & context", w: "minutes → days", f: "instructions, format, reasoning approach", c: C.iris },
    { t: "Retrieval (RAG)", w: "days → weeks", f: "missing, private, or changing knowledge", c: C.teal },
    { t: "Fine-tuning", w: "weeks", f: "behaviour, tone, narrow accuracy, cost & latency", c: C.amber },
    { t: "Continued pretraining", w: "months + serious compute", f: "a genuinely novel domain or language", c: C.rose },
  ];
  return (
    <Frame h={320}>
      <text x={400} y={32} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        Descend only when the rung above provably can&rsquo;t get there
      </text>
      {rungs.map((r, i) => {
        const y = 52 + i * 60;
        const w = 380 + i * 84;
        return (
          <g key={r.t}>
            <rect x={62} y={y} width={w} height={48} rx={11} fill={C.card} stroke={r.c} strokeWidth={1.9} />
            <text x={82} y={y + 21} fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={r.c}>
              {r.t}
            </text>
            <text x={82} y={y + 38} fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
              {r.f}
            </text>
            <text x={62 + w + 12} y={y + 30} fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill={C.muted}>
              {r.w}
            </text>
          </g>
        );
      })}
      <text x={44} y={168} transform="rotate(-90 44 168)" textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.muted}>
        effort, cost, lock-in →
      </text>
      <Cap x={400} y={306} text="Knowledge problems go up the ladder to retrieval; behaviour problems go down to fine-tuning." />
    </Frame>
  );
}

function Lora() {
  return (
    <Frame h={300}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        Train the difference, not the weights
      </text>
      {/* frozen base */}
      <rect x={70} y={66} width={190} height={150} rx={13} fill={C.canvas} stroke={C.muted} strokeWidth={2} />
      <text x={165} y={94} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.muted}>
        W — base weight
      </text>
      <text x={165} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.soft}>4096 × 4096</text>
      <text x={165} y={160} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.soft}>16.7M parameters</text>
      <text x={165} y={192} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.muted}>❄ frozen</text>

      <text x={296} y={148} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={22} fontWeight={700} fill={C.ink}>+</text>

      {/* lora matrices */}
      <rect x={332} y={90} width={54} height={102} rx={9} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={359} y={136} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>A</text>
      <text x={359} y={154} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9} fill={C.muted}>4096×8</text>
      <text x={402} y={148} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={18} fontWeight={700} fill={C.ink}>×</text>
      <rect x={420} y={122} width={110} height={38} rx={9} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={475} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>B</text>
      <text x={475} y={154} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9} fill={C.muted}>8×4096</text>

      <text x={430} y={208} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>
        65K parameters trained — 0.4%
      </text>

      <text x={556} y={148} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={20} fontWeight={700} fill={C.ink}>=</text>
      <rect x={584} y={66} width={176} height={150} rx={13} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={672} y={112} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.teal}>
        adapted model
      </text>
      <text x={672} y={144} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>adapter ≈ tens of MB</text>
      <text x={672} y={164} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>swappable per request</text>
      <text x={672} y={188} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={700} fill={C.teal}>one base, many tenants</text>
      <Cap x={400} y={266} text="QLoRA does the same over a 4-bit base — large-model fine-tuning on a single GPU." />
    </Frame>
  );
}

function AlignmentPipeline() {
  const stages = [
    { t: "Pretraining", d: "trillions of tokens", g: "language, knowledge, reasoning substrate", c: C.muted, s: C.canvas },
    { t: "SFT", d: "demonstrations", g: "how to follow instructions", c: C.teal, s: C.tealSoft },
    { t: "Preference optimisation", d: "comparisons", g: "which plausible answer people prefer", c: C.iris, s: C.irisSoft },
  ];
  return (
    <Frame h={310}>
      {stages.map((st, i) => {
        const x = 30 + i * 258;
        return (
          <g key={st.t}>
            <rect x={x} y={56} width={228} height={100} rx={13} fill={st.s} stroke={st.c} strokeWidth={1.9} />
            <text x={x + 114} y={84} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={st.c}>
              {st.t}
            </text>
            <text x={x + 114} y={106} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill={C.soft}>
              {st.d}
            </text>
            <text x={x + 114} y={132} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>
              {st.g}
            </text>
            {i < 2 && <Arrow x1={x + 230} y1={106} x2={x + 254} y2={106} color={C.line} />}
          </g>
        );
      })}
      <text x={400} y={186} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.ink}>
        three routes through the last stage
      </text>
      {[
        { t: "RLHF / PPO", d: "learned reward model + RL", c: C.amber },
        { t: "DPO", d: "preference pairs, no RL loop", c: C.iris },
        { t: "GRPO", d: "group-relative + verifiable rewards", c: C.teal },
      ].map((m, i) => (
        <g key={m.t}>
          <rect x={30 + i * 258} y={200} width={228} height={54} rx={11} fill={C.card} stroke={m.c} strokeWidth={1.6} />
          <text x={144 + i * 258} y={222} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={m.c}>
            {m.t}
          </text>
          <text x={144 + i * 258} y={240} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
            {m.d}
          </text>
        </g>
      ))}
      <Cap x={400} y={288} text="Sycophancy, verbosity bias, and refusal calibration are all artefacts of this last stage." />
    </Frame>
  );
}

function Distillation() {
  return (
    <Frame h={310}>
      <rect x={40} y={54} width={180} height={82} rx={13} fill={C.irisSoft} stroke={C.iris} strokeWidth={2} />
      <text x={130} y={84} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.iris}>Teacher</text>
      <text x={130} y={104} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>frontier model</text>
      <text x={130} y={121} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>accurate · slow · costly</text>

      <Node x={40} y={168} w={180} h={62} label="Real inputs" sub="from production traffic" fill={C.tealSoft} stroke={C.teal} />
      <Arrow x1={222} y1={199} x2={252} y2={140} color={C.teal} />
      <Arrow x1={222} y1={96} x2={252} y2={112} color={C.iris} />

      <rect x={256} y={90} width={168} height={112} rx={12} fill={C.card} stroke={C.amber} strokeWidth={1.8} />
      <text x={340} y={116} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.amber}>Filter hard</text>
      {["verify what you can", "drop what you can't", "read 50 at random"].map((l, i) => (
        <text key={l} x={340} y={140 + i * 20} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>
          {l}
        </text>
      ))}

      <Arrow x1={426} y1={146} x2={456} y2={146} color={C.amber} />
      <rect x={460} y={104} width={168} height={84} rx={12} fill={C.tealSoft} stroke={C.teal} strokeWidth={2} />
      <text x={544} y={134} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={C.teal}>Student</text>
      <text x={544} y={154} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>small model + LoRA</text>
      <text x={544} y={171} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={700} fill={C.teal}>10–50× cheaper</text>

      <Arrow x1={630} y1={146} x2={660} y2={146} color={C.teal} />
      <rect x={664} y={104} width={106} height={84} rx={12} fill={C.card} stroke={C.iris} strokeWidth={1.7} />
      <text x={717} y={134} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>Route</text>
      <text x={717} y={154} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.soft}>student first</text>
      <text x={717} y={170} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.soft}>escalate on doubt</text>
      {/* escalation back to teacher */}
      <path d="M717 104 v-38 h-560 v-10" fill="none" stroke={C.iris} strokeWidth={1.5} strokeDasharray="5 4" />

      <rect x={40} y={244} width={730} height={34} rx={9} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.4} />
      <text x={405} y={266} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.soft}>
        The student matches the teacher where you measured — not in general. Check provider terms before distilling.
      </text>
    </Frame>
  );
}

function InferenceLatency() {
  return (
    <Frame h={320}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        One request&rsquo;s latency budget
      </text>
      {/* timeline */}
      <rect x={50} y={66} width={110} height={40} rx={8} fill={C.canvas} stroke={C.muted} strokeWidth={1.5} />
      <text x={105} y={91} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>queue</text>

      <rect x={164} y={66} width={200} height={40} rx={8} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.8} />
      <text x={264} y={84} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.teal}>PREFILL</text>
      <text x={264} y={99} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>whole prompt, in parallel</text>

      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={370 + i * 32} y={66} width={28} height={40} rx={5} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.4} />
      ))}
      <text x={558} y={130} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>
        DECODE — one token at a time, sequentially
      </text>

      {/* markers */}
      <line x1={364} y1={54} x2={364} y2={118} stroke={C.teal} strokeWidth={2} strokeDasharray="4 3" />
      <text x={364} y={48} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.teal}>
        ← TTFT
      </text>
      <line x1={754} y1={54} x2={754} y2={118} stroke={C.iris} strokeWidth={2} strokeDasharray="4 3" />
      <text x={700} y={48} fontFamily="var(--font-sans)" fontSize={11} fontWeight={700} fill={C.iris}>
        total ↑
      </text>

      {[
        { t: "PREFILL", b: "compute-bound (FLOPs)", s: "scales with INPUT length", f: "shorter prompts · prompt caching", c: C.teal, x: 50 },
        { t: "DECODE", b: "memory-bandwidth-bound", s: "scales with OUTPUT length", f: "smaller model · quantization · speculative decoding", c: C.iris, x: 408 },
      ].map((p) => (
        <g key={p.t}>
          <rect x={p.x} y={158} width={342} height={104} rx={12} fill={C.card} stroke={p.c} strokeWidth={1.7} />
          <text x={p.x + 18} y={184} fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={p.c}>{p.t}</text>
          <text x={p.x + 18} y={206} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>{p.b}</text>
          <text x={p.x + 18} y={226} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>{p.s}</text>
          <text x={p.x + 18} y={248} fontFamily="var(--font-sans)" fontSize={10} fontWeight={600} fill={C.muted}>fix: {p.f}</text>
        </g>
      ))}
      <Cap x={400} y={300} text="Total ≈ TTFT + (output tokens × TPOT) — which is why output length is the biggest lever you control." />
    </Frame>
  );
}

function KvCache() {
  return (
    <Frame h={320}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        What actually fills the GPU
      </text>
      {/* memory bar */}
      <rect x={60} y={58} width={680} height={58} rx={11} fill={C.canvas} stroke={C.line} strokeWidth={1.5} />
      <rect x={62} y={60} width={150} height={54} rx={10} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.6} />
      <text x={137} y={84} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.teal}>weights</text>
      <text x={137} y={101} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>fixed, loaded once</text>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={220 + i * 64} y={60} width={58} height={54} rx={9} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.5} />
      ))}
      <text x={476} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>
        KV cache — one growing block per concurrent sequence
      </text>

      <rect x={60} y={162} width={330} height={100} rx={12} fill={C.card} stroke={C.amber} strokeWidth={1.7} />
      <text x={78} y={186} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.amber}>bytes per token</text>
      <text x={78} y={208} fontFamily="var(--font-mono)" fontSize={10} fill={C.soft}>2 × layers × kv_heads ×</text>
      <text x={78} y={224} fontFamily="var(--font-mono)" fontSize={10} fill={C.soft}>head_dim × bytes</text>
      <text x={78} y={248} fontFamily="var(--font-sans)" fontSize={10.5} fontWeight={600} fill={C.muted}>≈ 128 KB/token on a typical 8B</text>

      <rect x={410} y={162} width={330} height={100} rx={12} fill={C.card} stroke={C.teal} strokeWidth={1.7} />
      <text x={428} y={186} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.teal}>what buys concurrency</text>
      {["GQA / MQA → fewer kv_heads", "FP8 KV cache → half the bytes", "shorter contexts → linear win"].map((l, i) => (
        <text key={l} x={428} y={208 + i * 19} fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
          {l}
        </text>
      ))}
      <Cap x={400} y={300} text="&ldquo;How many users fit on this GPU?&rdquo; is almost always a KV-cache question, not a weights question." />
    </Frame>
  );
}

function QuantizationSpectrum() {
  const levels = [
    { l: "FP32", x: 60, mem: 100, q: "reference", c: C.muted },
    { l: "BF16", x: 200, mem: 50, q: "the baseline", c: C.teal },
    { l: "FP8", x: 340, mem: 25, q: "near-lossless", c: C.teal },
    { l: "INT8", x: 480, mem: 25, q: "small loss", c: C.amber },
    { l: "INT4", x: 620, mem: 12, q: "real trade-off", c: C.rose },
  ];
  return (
    <Frame h={320}>
      <text x={400} y={34} textAnchor="middle" fontFamily="var(--font-display)" fontSize={13.5} fontWeight={700} fill={C.ink}>
        Fewer bits: smaller and faster, until it isn&rsquo;t
      </text>
      {levels.map((lv) => (
        <g key={lv.l}>
          <rect x={lv.x} y={190 - lv.mem} width={120} height={lv.mem} rx={6} fill={lv.c} opacity={0.25} />
          <rect x={lv.x} y={190 - lv.mem} width={120} height={lv.mem} rx={6} fill="none" stroke={lv.c} strokeWidth={1.8} />
          <text x={lv.x + 60} y={210} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={lv.c}>
            {lv.l}
          </text>
          <text x={lv.x + 60} y={228} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.muted}>
            {lv.q}
          </text>
        </g>
      ))}
      <line x1={50} y1={192} x2={756} y2={192} stroke={C.line} strokeWidth={1.6} />
      <text x={40} y={120} transform="rotate(-90 40 120)" textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>
        memory →
      </text>
      <rect x={60} y={250} width={680} height={44} rx={10} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.5} />
      <text x={400} y={269} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.rose}>
        Loss concentrates in the tail — hard reasoning, long context, rare languages, code correctness.
      </text>
      <text x={400} y={286} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>
        Average benchmark scores systematically understate it. Evaluate by slice.
      </text>
    </Frame>
  );
}

function ServingStack() {
  const layers = [
    { l: "Client", s: "OpenAI-compatible HTTP, streaming", c: C.muted, sf: C.canvas },
    { l: "Gateway / router", s: "auth · rate limits · model routing · fallback", c: C.iris, sf: C.irisSoft },
    { l: "Serving engine", s: "continuous batching · PagedAttention · prefix cache · speculative decoding", c: C.teal, sf: C.tealSoft },
    { l: "Runtime & kernels", s: "CUDA · FlashAttention · quantized matmul", c: C.amber, sf: C.amberSoft },
    { l: "GPU", s: "memory capacity → concurrency · bandwidth → decode speed", c: C.rose, sf: C.roseSoft },
  ];
  return (
    <Frame h={330}>
      {layers.map((ly, i) => {
        const y = 34 + i * 56;
        return (
          <g key={ly.l}>
            <rect x={110} y={y} width={580} height={46} rx={11} fill={ly.sf} stroke={ly.c} strokeWidth={1.8} />
            <text x={132} y={y + 21} fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={ly.c}>
              {ly.l}
            </text>
            <text x={132} y={y + 37} fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>
              {ly.s}
            </text>
            {i < layers.length - 1 && (
              <line x1={400} y1={y + 46} x2={400} y2={y + 56} stroke={C.line} strokeWidth={1.6} />
            )}
          </g>
        );
      })}
      <Cap x={400} y={324} text="Default to vLLM on GPUs and Ollama locally; go further only for a need you have measured." />
    </Frame>
  );
}

function EvalPyramid() {
  const layers = [
    { l: "Human review", s: "the ground truth everything else calibrates against", w: 200, c: C.rose, sf: C.roseSoft, cost: "expensive · weekly sample" },
    { l: "LLM judges", s: "groundedness · helpfulness · rubric compliance", w: 340, c: C.iris, sf: C.irisSoft, cost: "moderate · pre-release" },
    { l: "Reference metrics", s: "exact match · F1 · recall@k · numeric accuracy", w: 480, c: C.teal, sf: C.tealSoft, cost: "cheap · every PR" },
    { l: "Assertions", s: "parses · schema · citations exist · no PII · under budget", w: 620, c: C.amber, sf: C.amberSoft, cost: "free · every request" },
  ];
  return (
    <Frame h={310}>
      {layers.map((ly, i) => {
        const y = 44 + i * 58;
        const x = 400 - ly.w / 2;
        return (
          <g key={ly.l}>
            <rect x={x} y={y} width={ly.w} height={48} rx={10} fill={ly.sf} stroke={ly.c} strokeWidth={1.8} />
            <text x={400} y={y + 21} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={ly.c}>
              {ly.l}
            </text>
            <text x={400} y={y + 38} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.soft}>
              {ly.s}
            </text>
            <text x={x + ly.w + 12} y={y + 30} fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>
              {ly.cost}
            </text>
          </g>
        );
      })}
      <Cap x={400} y={296} text="Most teams start at the second layer from the top. Build the free, unambiguous base first." />
    </Frame>
  );
}

function LlmJudge() {
  return (
    <Frame h={320}>
      <Node x={30} y={62} w={150} h={56} label="Output" sub="to be scored" />
      <Node x={30} y={140} w={150} h={56} label="Sources" sub="+ the question" fill={C.tealSoft} stroke={C.teal} />
      <Arrow x1={182} y1={92} x2={216} y2={116} color={C.muted} />
      <Arrow x1={182} y1={168} x2={216} y2={144} color={C.teal} />

      <rect x={218} y={62} width={216} height={134} rx={13} fill={C.irisSoft} stroke={C.iris} strokeWidth={2.1} />
      <text x={326} y={88} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.iris}>
        Judge
      </text>
      {["independent binary criteria", "evidence quote required", "different model family", "neutral wording"].map((l, i) => (
        <text key={l} x={326} y={110 + i * 20} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>
          {l}
        </text>
      ))}

      <Arrow x1={436} y1={128} x2={470} y2={128} color={C.iris} />
      <rect x={474} y={62} width={140} height={134} rx={12} fill={C.card} stroke={C.line} strokeWidth={1.5} />
      {["grounded ✓", "answers_q ✓", "cites_ok ✗", "refusal ✓", "in_policy ✓"].map((l, i) => (
        <text key={l} x={544} y={90 + i * 24} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fill={C.soft}>
          {l}
        </text>
      ))}

      <rect x={634} y={62} width={136} height={134} rx={12} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.8} />
      <text x={702} y={92} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.rose}>
        calibration
      </text>
      <text x={702} y={116} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>200 human</text>
      <text x={702} y={132} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fill={C.soft}>labels</text>
      <text x={702} y={158} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.rose}>87%</text>
      <text x={702} y={176} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fill={C.muted}>agreement</text>

      <text x={400} y={228} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.ink}>
        the biases you must mitigate
      </text>
      {["verbosity", "position", "self-preference", "confident style", "leniency drift"].map((b, i) => (
        <g key={b}>
          <rect x={40 + i * 148} y={242} width={136} height={28} rx={7} fill={C.card} stroke={C.amber} strokeWidth={1.4} />
          <text x={108 + i * 148} y={261} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10} fontWeight={600} fill={C.amber}>
            {b}
          </text>
        </g>
      ))}
      <Cap x={400} y={300} text="Report agreement alongside the score, always — an uncalibrated judge is an unlabelled instrument." />
    </Frame>
  );
}

function EvalLoop() {
  return (
    <Frame h={320}>
      <rect x={40} y={54} width={330} height={172} rx={14} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.9} />
      <text x={205} y={80} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.teal}>
        OFFLINE — gates the release
      </text>
      {["golden set, sliced", "assertions + metrics + judges", "cost & latency budgets", "explicit pass bars"].map((l, i) => (
        <g key={l}>
          <rect x={64} y={96 + i * 32} width={282} height={26} rx={7} fill={C.card} stroke={C.teal} strokeWidth={1.2} />
          <text x={205} y={114 + i * 32} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>{l}</text>
        </g>
      ))}

      <rect x={430} y={54} width={330} height={172} rx={14} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.9} />
      <text x={595} y={80} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={700} fill={C.iris}>
        ONLINE — measures the truth
      </text>
      {["canary → A/B by user", "regeneration & escalation rates", "guardrail metrics", "sampled judging + drift watch"].map((l, i) => (
        <g key={l}>
          <rect x={454} y={96 + i * 32} width={282} height={26} rx={7} fill={C.card} stroke={C.iris} strokeWidth={1.2} />
          <text x={595} y={114 + i * 32} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.soft}>{l}</text>
        </g>
      ))}

      <Arrow x1={374} y1={110} x2={426} y2={110} color={C.teal} flow />
      <text x={400} y={100} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={9.5} fontWeight={700} fill={C.teal}>ship</text>
      <path d="M595 226 v34 h-390 v-34" fill="none" stroke={C.iris} strokeWidth={2} strokeDasharray="6 5" className="animate-flow" />
      <text x={400} y={276} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={700} fill={C.iris}>
        every production failure becomes a permanent CI case
      </text>
      <Cap x={400} y={306} text="That return path is what makes an eval suite compound instead of go stale." />
    </Frame>
  );
}

const REGISTRY: Record<DiagramName, () => JSX.Element> = {
  "ai-engineer-stack": AiEngineerStack,
  "role-spectrum": RoleSpectrum,
  "llm-io": LlmIo,
  "model-landscape": ModelLandscape,
  "failure-modes": FailureModes,
  "prompt-anatomy": PromptAnatomy,
  "context-budget": ContextBudget,
  "structured-output-loop": StructuredOutputLoop,
  "reasoning-dial": ReasoningDial,
  "embedding-space": EmbeddingSpace,
  "chunking-strategies": ChunkingStrategies,
  "ann-index": AnnIndex,
  "hybrid-rerank": HybridRerank,
  "rag-pipeline": RagPipeline,
  "agentic-rag": AgenticRag,
  "graph-rag": GraphRag,
  "rag-triad": RagTriad,
  "tool-call-loop": ToolCallLoop,
  "agent-loop": AgentLoop,
  "agent-memory": AgentMemory,
  "multi-agent-topologies": MultiAgentTopologies,
  "mcp-architecture": McpArchitecture,
  "mcp-primitives": McpPrimitives,
  "adaptation-ladder": AdaptationLadder,
  lora: Lora,
  "alignment-pipeline": AlignmentPipeline,
  distillation: Distillation,
  "inference-latency": InferenceLatency,
  "kv-cache": KvCache,
  "quantization-spectrum": QuantizationSpectrum,
  "serving-stack": ServingStack,
  "eval-pyramid": EvalPyramid,
  "llm-judge": LlmJudge,
  "eval-loop": EvalLoop,
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
