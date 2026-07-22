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
  teal: "#0E9BB5", // cyan
  tealSoft: "#E1F5F9",
  amber: "#ED8B00", // orange / warn
  amberSoft: "#FBEED6",
  rose: "#C43E86", // magenta
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

// The end-to-end ML lifecycle as a loop.
function MlWorkflow() {
  const steps = [
    { l: "Data", c: C.iris },
    { l: "Features", c: C.teal },
    { l: "Train", c: C.rose },
    { l: "Evaluate", c: C.amber },
    { l: "Deploy", c: C.iris },
    { l: "Monitor", c: C.teal },
  ];
  return (
    <Frame h={220}>
      {steps.map((s, i) => {
        const x = 20 + i * 130;
        return (
          <g key={i}>
            <Node x={x} y={70} w={110} h={54} label={s.l} accent={i === 2} />
            {i < steps.length - 1 && <Arrow x1={x + 110} y1={97} x2={x + 130} y2={97} color={s.c} flow />}
          </g>
        );
      })}
      {/* feedback loop */}
      <path d="M755,124 C775,175 40,175 20,124" fill="none" stroke={C.amber} strokeWidth={1.8} strokeDasharray="6 6" markerEnd="url(#fb)" />
      <defs>
        <marker id="fb" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={C.amber} />
        </marker>
      </defs>
      <Cap x={400} y={198} text="Monitoring feeds problems back into new data & retraining" color={C.amber} />
    </Frame>
  );
}

// Three paradigms of learning.
function LearningTypes() {
  const cols = [
    { t: "Supervised", c: C.iris, s: ["Labeled data (X → y)", "Classification / Regression", "Spam filter, price prediction"] },
    { t: "Unsupervised", c: C.teal, s: ["No labels — find structure", "Clustering / Dim. reduction", "Segmentation, PCA, anomalies"] },
    { t: "Reinforcement", c: C.rose, s: ["Reward signal from actions", "Agent ↔ environment", "Game-play, robotics, RLHF"] },
  ];
  return (
    <Frame h={230}>
      {cols.map((col, i) => {
        const x = 30 + i * 255;
        return (
          <g key={i}>
            <rect x={x} y={20} width={230} height={190} rx={14} fill={col.c} opacity={0.08} stroke={col.c} strokeWidth={1.5} />
            <text x={x + 115} y={50} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={16} fontWeight={700} fill={col.c}>{col.t}</text>
            {col.s.map((line, j) => (
              <text key={j} x={x + 115} y={88 + j * 34} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fill={C.soft}>{line}</text>
            ))}
          </g>
        );
      })}
    </Frame>
  );
}

// Bias–variance tradeoff U-curve.
function BiasVariance() {
  return (
    <Frame h={300}>
      {/* axes */}
      <Arrow x1={70} y1={250} x2={740} y2={250} color={C.muted} />
      <Arrow x1={70} y1={250} x2={70} y2={30} color={C.muted} />
      <Cap x={400} y={285} text="Model complexity →" />
      <text x={26} y={140} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted} transform="rotate(-90 26 140)">Error →</text>
      {/* bias (decreasing) */}
      <path d="M90,70 Q300,240 720,245" fill="none" stroke={C.iris} strokeWidth={2.2} />
      <text x={130} y={70} fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.iris}>Bias²</text>
      {/* variance (increasing) */}
      <path d="M90,245 Q470,240 720,70" fill="none" stroke={C.rose} strokeWidth={2.2} />
      <text x={640} y={70} fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.rose}>Variance</text>
      {/* total error U */}
      <path d="M90,110 Q400,300 720,110" fill="none" stroke={C.amber} strokeWidth={2.6} />
      <text x={400} y={235} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.amber}>Total error</text>
      {/* sweet spot */}
      <line x1={400} y1={60} x2={400} y2={250} stroke={C.teal} strokeWidth={1.4} strokeDasharray="5 5" />
      <circle cx={400} cy={205} r={5} fill={C.teal} />
      <text x={400} y={48} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.teal}>Sweet spot</text>
      <text x={150} y={200} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>underfit</text>
      <text x={650} y={200} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>overfit</text>
    </Frame>
  );
}

// Gradient descent stepping down a loss bowl.
function GradientDescent() {
  const pts = [
    [130, 70], [210, 130], [285, 175], [345, 202], [388, 215], [400, 218],
  ];
  return (
    <Frame h={260}>
      <path d="M80,60 Q400,320 720,60" fill="none" stroke={C.line} strokeWidth={2.4} />
      <text x={400} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.soft}>Loss surface J(θ)</text>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={6} fill={i === pts.length - 1 ? C.teal : C.iris} />
          {i > 0 && <Arrow x1={pts[i - 1][0]} y1={pts[i - 1][1]} x2={p[0]} y2={p[1]} color={C.iris} />}
        </g>
      ))}
      <circle cx={400} cy={218} r={9} fill="none" stroke={C.teal} strokeWidth={2} />
      <text x={430} y={222} fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.teal}>minimum</text>
      <text x={95} y={95} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>start (random θ)</text>
      <text x={400} y={250} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>θ := θ − η ∇J(θ) &nbsp;·&nbsp; step size set by learning rate η</text>
    </Frame>
  );
}

// Train / validation / test split + k-fold.
function DataSplits() {
  return (
    <Frame h={250}>
      <text x={20} y={40} fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.soft}>Hold-out split</text>
      <rect x={20} y={52} width={520} height={40} rx={8} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.4} />
      <text x={280} y={77} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.iris}>Train (70%)</text>
      <rect x={545} y={52} width={110} height={40} rx={8} fill={C.tealSoft} stroke={C.teal} strokeWidth={1.4} />
      <text x={600} y={77} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.teal}>Val 15%</text>
      <rect x={660} y={52} width={110} height={40} rx={8} fill={C.amberSoft} stroke={C.amber} strokeWidth={1.4} />
      <text x={715} y={77} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.amber}>Test 15%</text>

      <text x={20} y={135} fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.soft}>5-fold cross-validation</text>
      {[0, 1, 2, 3, 4].map((row) => (
        <g key={row}>
          {[0, 1, 2, 3, 4].map((col) => {
            const isVal = col === row;
            return (
              <rect key={col} x={20 + col * 152} y={150 + row * 18} width={148} height={14} rx={3}
                fill={isVal ? C.roseSoft : C.canvas} stroke={isVal ? C.rose : C.line} strokeWidth={1.2} />
            );
          })}
        </g>
      ))}
      <text x={790} y={162} textAnchor="end" fontFamily="var(--font-sans)" fontSize={10.5} fill={C.rose}>rose = validation fold</text>
    </Frame>
  );
}

// Confusion matrix 2x2.
function ConfusionMatrix() {
  const cell = (x: number, y: number, big: string, small: string, color: string) => (
    <g>
      <rect x={x} y={y} width={150} height={80} rx={10} fill={color} opacity={0.12} stroke={color} strokeWidth={1.6} />
      <text x={x + 75} y={y + 38} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={15} fontWeight={700} fill={color}>{big}</text>
      <text x={x + 75} y={y + 60} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>{small}</text>
    </g>
  );
  return (
    <Frame h={280}>
      <text x={280} y={30} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.soft}>Predicted</text>
      <text x={360} y={60} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.iris}>Positive</text>
      <text x={520} y={60} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.iris}>Negative</text>
      <text x={175} y={115} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.rose} transform="rotate(-90 175 175)">Actual</text>
      <text x={205} y={118} textAnchor="end" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.rose}>Positive</text>
      <text x={205} y={210} textAnchor="end" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.rose}>Negative</text>
      {cell(290, 75, "TP", "true positive", C.teal)}
      {cell(450, 75, "FN", "false negative", C.amber)}
      {cell(290, 165, "FP", "false positive", C.amber)}
      {cell(450, 165, "TN", "true negative", C.teal)}
      <text x={655} y={110} fontFamily="var(--font-mono)" fontSize={12} fill={C.soft}>Precision = TP/(TP+FP)</text>
      <text x={655} y={140} fontFamily="var(--font-mono)" fontSize={12} fill={C.soft}>Recall = TP/(TP+FN)</text>
      <text x={655} y={170} fontFamily="var(--font-mono)" fontSize={12} fill={C.soft}>F1 = 2·P·R/(P+R)</text>
    </Frame>
  );
}

// ROC curve.
function RocCurve() {
  return (
    <Frame h={300}>
      <Arrow x1={110} y1={255} x2={470} y2={255} color={C.muted} />
      <Arrow x1={110} y1={255} x2={110} y2={40} color={C.muted} />
      <Cap x={290} y={288} text="False Positive Rate →" />
      <text x={70} y={150} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted} transform="rotate(-90 70 150)">True Positive Rate →</text>
      {/* diagonal = random */}
      <line x1={110} y1={255} x2={470} y2={40} stroke={C.muted} strokeWidth={1.4} strokeDasharray="5 5" />
      <text x={430} y={70} fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>random (AUC 0.5)</text>
      {/* good ROC */}
      <path d="M110,255 Q140,90 470,40" fill="none" stroke={C.iris} strokeWidth={2.6} />
      <text x={250} y={95} fontFamily="var(--font-sans)" fontSize={12} fontWeight={700} fill={C.iris}>good classifier</text>
      <text x={520} y={130} fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.soft}>AUC = area under</text>
      <text x={520} y={152} fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.soft}>the ROC curve</text>
      <text x={520} y={182} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>1.0 = perfect ranking</text>
      <text x={520} y={202} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>0.5 = no better than chance</text>
      <text x={520} y={222} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>threshold-independent</text>
    </Frame>
  );
}

// Underfit / good fit / overfit.
function Overfitting() {
  const panel = (ox: number, title: string, color: string, path: string) => (
    <g>
      <rect x={ox} y={40} width={220} height={150} rx={12} fill={C.card} stroke={C.line} strokeWidth={1.4} />
      <text x={ox + 110} y={30} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={color}>{title}</text>
      {/* scatter points */}
      {[[40, 130], [70, 100], [95, 115], [125, 80], [150, 95], [180, 60]].map((p, i) => (
        <circle key={i} cx={ox + p[0]} cy={p[1]} r={4} fill={C.muted} />
      ))}
      <path d={path} fill="none" stroke={color} strokeWidth={2.4} transform={`translate(${ox},0)`} />
    </g>
  );
  return (
    <Frame h={230}>
      {panel(20, "Underfit (high bias)", C.iris, "M35,120 L200,80")}
      {panel(290, "Good fit", C.teal, "M35,135 Q120,95 200,60")}
      {panel(560, "Overfit (high variance)", C.rose, "M35,130 C70,90 85,125 120,80 C150,45 165,110 200,58")}
    </Frame>
  );
}

// A small multilayer perceptron.
function NeuralNet() {
  const layers = [
    { x: 120, n: 3, c: C.iris, label: "Input" },
    { x: 330, n: 4, c: C.teal, label: "Hidden" },
    { x: 540, n: 4, c: C.teal, label: "Hidden" },
    { x: 700, n: 2, c: C.rose, label: "Output" },
  ];
  const yOf = (n: number, i: number) => 60 + i * (180 / Math.max(n - 1, 1));
  return (
    <Frame h={280}>
      {/* connections */}
      {layers.slice(0, -1).map((L, li) => {
        const N = layers[li + 1];
        return L.label && Array.from({ length: L.n }).map((_, i) =>
          Array.from({ length: N.n }).map((_, j) => (
            <line key={`${li}-${i}-${j}`} x1={L.x} y1={yOf(L.n, i)} x2={N.x} y2={yOf(N.n, j)} stroke={C.line} strokeWidth={0.8} opacity={0.7} />
          ))
        );
      })}
      {layers.map((L, li) => (
        <g key={li}>
          {Array.from({ length: L.n }).map((_, i) => (
            <circle key={i} cx={L.x} cy={yOf(L.n, i)} r={13} fill={C.card} stroke={L.c} strokeWidth={2} />
          ))}
          <text x={L.x} y={265} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={L.c}>{L.label}</text>
        </g>
      ))}
      <text x={400} y={28} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>each edge = a weight · each node applies weighted sum → activation</text>
    </Frame>
  );
}

// Forward pass + backpropagation.
function Backprop() {
  return (
    <Frame h={230}>
      {["Input", "Layer 1", "Layer 2", "Loss"].map((l, i) => (
        <g key={i}>
          <Node x={40 + i * 195} y={80} w={150} h={56} label={l} accent={i === 3} />
          {i < 3 && <Arrow x1={40 + i * 195 + 150} y1={100} x2={40 + (i + 1) * 195} y2={100} color={C.iris} />}
        </g>
      ))}
      <text x={400} y={72} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.iris}>Forward pass → predictions & loss</text>
      {/* backward */}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={40 + (i + 1) * 195} y1={150} x2={40 + i * 195 + 150} y2={150} color={C.rose} />
      ))}
      <text x={400} y={185} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.rose}>Backward pass ← gradients via chain rule (∂Loss/∂w)</text>
    </Frame>
  );
}

// Activation function shapes.
function Activations() {
  const panel = (ox: number, name: string, color: string, path: string) => (
    <g>
      <rect x={ox} y={45} width={220} height={140} rx={12} fill={C.card} stroke={C.line} strokeWidth={1.3} />
      <line x1={ox + 20} y1={115} x2={ox + 200} y2={115} stroke={C.line} strokeWidth={1} />
      <line x1={ox + 110} y1={55} x2={ox + 110} y2={175} stroke={C.line} strokeWidth={1} />
      <path d={path} fill="none" stroke={color} strokeWidth={2.6} transform={`translate(${ox},0)`} />
      <text x={ox + 110} y={35} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fontWeight={600} fill={color}>{name}</text>
    </g>
  );
  return (
    <Frame h={210}>
      {panel(20, "ReLU", C.iris, "M20,115 L110,115 L200,60")}
      {panel(290, "Sigmoid", C.teal, "M20,165 C80,165 90,65 200,65")}
      {panel(560, "Tanh", C.rose, "M20,170 C85,170 85,60 200,60")}
    </Frame>
  );
}

// CNN pipeline.
function Cnn() {
  return (
    <Frame h={220}>
      <Node x={20} y={80} w={110} h={60} label="Image" sub="pixels" />
      <Arrow x1={130} y1={110} x2={165} y2={110} color={C.iris} />
      <Node x={165} y={80} w={120} h={60} label="Conv" sub="filters → maps" fill={C.irisSoft} stroke={C.iris} text={C.iris} />
      <Arrow x1={285} y1={110} x2={320} y2={110} color={C.iris} />
      <Node x={320} y={80} w={120} h={60} label="Pool" sub="downsample" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Arrow x1={440} y1={110} x2={475} y2={110} color={C.iris} />
      <Node x={475} y={80} w={130} h={60} label="Conv + Pool" sub="deeper features" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Arrow x1={605} y1={110} x2={640} y2={110} color={C.iris} />
      <Node x={640} y={80} w={140} h={60} label="FC → Softmax" sub="class scores" fill={C.roseSoft} stroke={C.rose} text={C.rose} />
      <text x={400} y={185} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>early layers learn edges → later layers learn objects (hierarchical features)</text>
    </Frame>
  );
}

// RNN sequential vs Transformer parallel.
function RnnVsTransformer() {
  return (
    <Frame h={280}>
      <text x={200} y={30} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.iris}>RNN — sequential</text>
      {["w₁", "w₂", "w₃", "w₄"].map((w, i) => (
        <g key={i}>
          <circle cx={70 + i * 90} cy={90} r={22} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.6} />
          <text x={70 + i * 90} y={95} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fill={C.iris}>{w}</text>
          {i < 3 && <Arrow x1={92 + i * 90} y1={90} x2={48 + (i + 1) * 90} y2={90} color={C.iris} />}
        </g>
      ))}
      <text x={200} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>one step at a time — hard to parallelize</text>

      <text x={600} y={30} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={14} fontWeight={700} fill={C.rose}>Transformer — parallel attention</text>
      {["w₁", "w₂", "w₃", "w₄"].map((w, i) => (
        <g key={i}>
          <circle cx={470 + i * 90} cy={90} r={22} fill={C.roseSoft} stroke={C.rose} strokeWidth={1.6} />
          <text x={470 + i * 90} y={95} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fill={C.rose}>{w}</text>
        </g>
      ))}
      {/* all-pairs attention lines */}
      {[0, 1, 2, 3].map((i) =>
        [0, 1, 2, 3].map((j) => i < j && (
          <line key={`${i}-${j}`} x1={470 + i * 90} y1={112} x2={470 + j * 90} y2={112} stroke={C.rose} strokeWidth={0.8} opacity={0.5} />
        ))
      )}
      <text x={600} y={155} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>every token attends to every other — all at once</text>

      <line x1={400} y1={50} x2={400} y2={175} stroke={C.line} strokeWidth={1.2} strokeDasharray="4 4" />
      <text x={400} y={230} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.soft}>Transformers replaced RNNs because parallel training scales to huge data & long context.</text>
    </Frame>
  );
}

// Self-attention Q/K/V.
function Attention() {
  return (
    <Frame h={260}>
      <Node x={40} y={110} w={120} h={54} label="Token" sub="embedding x" />
      <Arrow x1={160} y1={137} x2={205} y2={137} color={C.iris} />
      {["Query (Q)", "Key (K)", "Value (V)"].map((l, i) => (
        <Node key={i} x={210} y={40 + i * 70} w={140} h={52} label={l} accent fill={C.irisSoft} />
      ))}
      <Arrow x1={350} y1={66} x2={410} y2={120} color={C.teal} />
      <Arrow x1={350} y1={136} x2={410} y2={130} color={C.teal} />
      <Node x={410} y={100} w={170} h={60} label="softmax(Q·Kᵀ/√d)" sub="attention weights" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Arrow x1={580} y1={130} x2={630} y2={130} color={C.rose} />
      <Arrow x1={350} y1={206} x2={630} y2={150} color={C.rose} dashed />
      <Node x={635} y={100} w={140} h={60} label="Weighted Σ" sub="context vector" fill={C.roseSoft} stroke={C.rose} text={C.rose} />
      <text x={400} y={240} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>Q asks &quot;what am I looking for?&quot;, K &quot;what do I offer?&quot;, V carries the actual content.</text>
    </Frame>
  );
}

// Word embeddings in vector space.
function Embeddings() {
  const pts = [
    { x: 180, y: 90, l: "king", c: C.iris },
    { x: 320, y: 70, l: "queen", c: C.rose },
    { x: 180, y: 210, l: "man", c: C.iris },
    { x: 320, y: 190, l: "woman", c: C.rose },
  ];
  return (
    <Frame h={280}>
      <Arrow x1={80} y1={240} x2={460} y2={240} color={C.muted} />
      <Arrow x1={80} y1={240} x2={80} y2={40} color={C.muted} />
      {/* parallel vectors king→queen, man→woman */}
      <Arrow x1={180} y1={90} x2={320} y2={70} color={C.teal} />
      <Arrow x1={180} y1={210} x2={320} y2={190} color={C.teal} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={6} fill={p.c} />
          <text x={p.x + 10} y={p.y + 4} fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={p.c}>{p.l}</text>
        </g>
      ))}
      <text x={500} y={90} fontFamily="var(--font-mono)" fontSize={12.5} fill={C.soft}>king − man</text>
      <text x={500} y={115} fontFamily="var(--font-mono)" fontSize={12.5} fill={C.soft}>+ woman ≈ queen</text>
      <text x={500} y={160} fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>Similar meanings sit close</text>
      <text x={500} y={182} fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>together; relationships</text>
      <text x={500} y={204} fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>become directions.</text>
    </Frame>
  );
}

// LLM training lifecycle.
function LlmLifecycle() {
  const steps = [
    { l: "Pretraining", s: "predict next token", c: C.iris },
    { l: "SFT", s: "instruction demos", c: C.teal },
    { l: "RLHF / DPO", s: "align to preferences", c: C.rose },
    { l: "Deployment", s: "prompt · RAG · tools", c: C.amber },
  ];
  return (
    <Frame h={210}>
      {steps.map((s, i) => {
        const x = 20 + i * 195;
        return (
          <g key={i}>
            <Node x={x} y={75} w={165} h={62} label={s.l} sub={s.s} fill={C.card} stroke={s.c} text={s.c} />
            {i < steps.length - 1 && <Arrow x1={x + 165} y1={106} x2={x + 195} y2={106} color={s.c} flow />}
          </g>
        );
      })}
      <text x={400} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.soft}>From raw text to a helpful, aligned assistant</text>
      <text x={400} y={175} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>base model (knows language) → instruct model (follows tasks) → aligned model (helpful & safe)</text>
    </Frame>
  );
}

// RAG pipeline.
function RagPipeline() {
  return (
    <Frame h={250}>
      <Node x={20} y={100} w={110} h={54} label="Query" accent />
      <Arrow x1={130} y1={127} x2={175} y2={127} color={C.iris} />
      <Node x={175} y={100} w={130} h={54} label="Retriever" sub="embed + search" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Arrow x1={240} y1={100} x2={240} y2={55} color={C.teal} />
      <Node x={170} y={12} w={140} h={44} label="Vector DB" sub="doc embeddings" fill={C.card} stroke={C.teal} text={C.teal} />
      <Arrow x1={305} y1={127} x2={350} y2={127} color={C.iris} />
      <Node x={350} y={100} w={150} h={54} label="Prompt +" sub="retrieved context" fill={C.card} stroke={C.muted} />
      <Arrow x1={500} y1={127} x2={545} y2={127} color={C.iris} />
      <Node x={545} y={100} w={110} h={54} label="LLM" fill={C.roseSoft} stroke={C.rose} text={C.rose} />
      <Arrow x1={655} y1={127} x2={700} y2={127} color={C.iris} />
      <Node x={700} y={100} w={90} h={54} label="Answer" sub="grounded" fill={C.irisSoft} stroke={C.iris} text={C.iris} />
      <text x={400} y={210} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>RAG grounds answers in your data — fights hallucination without retraining the model.</text>
    </Frame>
  );
}

// Agent reasoning loop.
function AgentLoop() {
  return (
    <Frame h={280}>
      <circle cx={400} cy={150} r={110} fill="none" stroke={C.line} strokeWidth={1.4} strokeDasharray="5 5" />
      <Node x={330} y={30} w={140} h={54} label="LLM" sub="reason / plan" fill={C.roseSoft} stroke={C.rose} text={C.rose} />
      <Node x={560} y={123} w={130} h={54} label="Tool call" sub="act" fill={C.irisSoft} stroke={C.iris} text={C.iris} />
      <Node x={330} y={216} w={140} h={54} label="Observation" sub="result" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Node x={110} y={123} w={130} h={54} label="Memory" sub="context" fill={C.card} stroke={C.muted} />
      <Arrow x1={470} y1={70} x2={565} y2={128} color={C.rose} />
      <Arrow x1={600} y1={177} x2={460} y2={230} color={C.iris} />
      <Arrow x1={330} y1={243} x2={230} y2={170} color={C.teal} />
      <Arrow x1={175} y1={123} x2={340} y2={72} color={C.muted} />
      <text x={400} y={155} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.soft}>Think → Act →</text>
      <text x={400} y={172} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fontWeight={600} fill={C.soft}>Observe → repeat</text>
    </Frame>
  );
}

// MLOps loop.
function MlopsLoop() {
  const steps = [
    { l: "Data + Features", c: C.iris },
    { l: "Train + Track", c: C.teal },
    { l: "Registry", c: C.rose },
    { l: "Serve / Deploy", c: C.amber },
    { l: "Monitor + Drift", c: C.iris },
  ];
  return (
    <Frame h={230}>
      {steps.map((s, i) => {
        const x = 15 + i * 158;
        return (
          <g key={i}>
            <Node x={x} y={80} w={140} h={58} label={s.l} accent={i === 1} />
            {i < steps.length - 1 && <Arrow x1={x + 140} y1={109} x2={x + 158} y2={109} color={s.c} flow />}
          </g>
        );
      })}
      <path d="M775,138 C795,195 30,195 15,138" fill="none" stroke={C.amber} strokeWidth={1.8} strokeDasharray="6 6" markerEnd="url(#mfb)" />
      <defs>
        <marker id="mfb" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={C.amber} />
        </marker>
      </defs>
      <text x={400} y={40} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={C.soft}>ML in production is a loop, not a launch</text>
      <Cap x={400} y={215} text="drift & new labels trigger retraining — CI/CD/CT (continuous training)" color={C.amber} />
    </Frame>
  );
}

// ML system design framework.
function SystemDesignFramework() {
  const steps = [
    { l: "1 · Clarify", s: "scope, users, scale" },
    { l: "2 · Metrics", s: "online + offline" },
    { l: "3 · Data", s: "sources, labels" },
    { l: "4 · Features", s: "engineering" },
    { l: "5 · Model", s: "baseline → complex" },
    { l: "6 · Serve", s: "latency, scale, monitor" },
  ];
  return (
    <Frame h={260}>
      {steps.map((s, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 40 + col * 250;
        const y = 40 + row * 105;
        return (
          <g key={i}>
            <rect x={x} y={y} width={220} height={78} rx={12} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.5} />
            <text x={x + 110} y={y + 34} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={15} fontWeight={700} fill={C.iris}>{s.l}</text>
            <text x={x + 110} y={y + 56} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>{s.s}</text>
            {col < 2 && <Arrow x1={x + 220} y1={y + 39} x2={x + 250} y2={y + 39} color={C.iris} />}
          </g>
        );
      })}
      <Arrow x1={260} y1={118} x2={40} y2={145} color={C.iris} dashed />
    </Frame>
  );
}

// Bayes' theorem as a formula + the medical-test intuition.
function BayesTheorem() {
  return (
    <Frame h={250}>
      <rect x={120} y={30} width={560} height={64} rx={12} fill={C.irisSoft} stroke={C.iris} strokeWidth={1.6} />
      <text x={400} y={60} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={20} fontWeight={700} fill={C.iris}>P(A|B) = P(B|A) · P(A) / P(B)</text>
      <text x={400} y={82} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>posterior = likelihood × prior / evidence</text>
      <text x={400} y={128} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={C.soft}>Update a belief with new evidence</text>
      <Node x={60} y={150} w={150} h={54} label="Prior" sub="P(disease) = 1%" fill={C.card} stroke={C.muted} />
      <Arrow x1={210} y1={177} x2={255} y2={177} color={C.teal} />
      <Node x={255} y={150} w={175} h={54} label="+ Evidence" sub="test is positive" fill={C.tealSoft} stroke={C.teal} text={C.teal} />
      <Arrow x1={430} y1={177} x2={475} y2={177} color={C.teal} />
      <Node x={475} y={150} w={175} h={54} label="Posterior" sub="P(disease | +) ≈ 16%" accent fill={C.irisSoft} />
      <text x={400} y={232} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>Base rates dominate: even a good test on a rare disease yields many false positives.</text>
    </Frame>
  );
}

// Normal distribution with the 68-95-99.7 rule.
function NormalDistribution() {
  // bell curve path
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = 100 + i * 6;
    const z = (i - 50) / 12.5;
    const y = 230 - 170 * Math.exp(-0.5 * z * z);
    pts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }
  const bands = [
    { z: 1, c: C.iris, label: "68%", off: 12.5 },
    { z: 2, c: C.teal, label: "95%", off: 25 },
    { z: 3, c: C.amber, label: "99.7%", off: 37.5 },
  ];
  return (
    <Frame h={280}>
      <Arrow x1={90} y1={230} x2={720} y2={230} color={C.muted} />
      {[-3, -2, -1, 0, 1, 2, 3].map((s) => (
        <g key={s}>
          <line x1={400 + s * 75} y1={230} x2={400 + s * 75} y2={236} stroke={C.muted} strokeWidth={1.2} />
          <text x={400 + s * 75} y={252} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill={C.muted}>{s === 0 ? "μ" : `${s > 0 ? "+" : ""}${s}σ`}</text>
        </g>
      ))}
      <path d={pts.join(" ")} fill="none" stroke={C.soft} strokeWidth={2.4} />
      <line x1={400} y1={60} x2={400} y2={230} stroke={C.line} strokeWidth={1.3} strokeDasharray="4 4" />
      {bands.map((b, i) => (
        <text key={i} x={400} y={120 + i * 30} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={b.c}>{`±${b.z}σ → ${b.label}`}</text>
      ))}
      <text x={400} y={30} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12} fill={C.muted}>The 68–95–99.7 rule: share of data within 1/2/3 standard deviations of the mean</text>
    </Frame>
  );
}

// Hypothesis test: null distribution with rejection region and p-value.
function HypothesisTest() {
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = 120 + i * 5.6;
    const z = (i - 50) / 14;
    const y = 210 - 150 * Math.exp(-0.5 * z * z);
    pts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }
  // rejection region right tail (from i=78 → x)
  const tail: string[] = ["M556,210"];
  for (let i = 78; i <= 100; i++) {
    const x = 120 + i * 5.6;
    const z = (i - 50) / 14;
    const y = 210 - 150 * Math.exp(-0.5 * z * z);
    tail.push(`L${x},${y}`);
  }
  tail.push("L680,210 Z");
  return (
    <Frame h={270}>
      <Arrow x1={110} y1={210} x2={720} y2={210} color={C.muted} />
      <path d={pts.join(" ")} fill="none" stroke={C.iris} strokeWidth={2.4} />
      <path d={tail.join(" ")} fill={C.rose} opacity={0.28} stroke={C.rose} strokeWidth={1.2} />
      <text x={400} y={120} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={C.iris}>Null hypothesis H₀</text>
      <text x={400} y={140} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.muted}>&quot;no real effect&quot;</text>
      <line x1={556} y1={60} x2={556} y2={210} stroke={C.rose} strokeWidth={1.3} strokeDasharray="4 4" />
      <text x={620} y={95} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.rose}>rejection</text>
      <text x={620} y={112} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fontWeight={600} fill={C.rose}>region (α)</text>
      <text x={556} y={45} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={C.rose}>critical value</text>
      <text x={400} y={245} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>p-value = P(a result this extreme | H₀ true). If p &lt; α (e.g. 0.05), reject H₀.</text>
    </Frame>
  );
}

// Big-O complexity growth curves.
function BigO() {
  const curves = [
    { f: (x: number) => 200, c: C.teal, label: "O(1)", lx: 620, ly: 205 },
    { f: (x: number) => 205 - 22 * Math.log2(x + 1), c: C.iris, label: "O(log n)", lx: 620, ly: 150 },
    { f: (x: number) => 205 - x * 3.4, c: C.amber, label: "O(n)", lx: 470, ly: 45 },
    { f: (x: number) => 205 - x * Math.log2(x + 1) * 1.15, c: C.rose, label: "O(n log n)", lx: 330, ly: 40 },
    { f: (x: number) => 205 - x * x * 0.34, c: "#B01B4A", label: "O(n²)", lx: 205, ly: 40 },
  ];
  const build = (f: (x: number) => number) => {
    const p: string[] = [];
    for (let x = 0; x <= 44; x++) {
      const y = Math.max(30, f(x));
      p.push(`${x === 0 ? "M" : "L"}${110 + x * 13},${y}`);
    }
    return p.join(" ");
  };
  return (
    <Frame h={250}>
      <Arrow x1={100} y1={210} x2={710} y2={210} color={C.muted} />
      <Arrow x1={110} y1={215} x2={110} y2={25} color={C.muted} />
      <Cap x={400} y={238} text="input size n →" />
      <text x={66} y={120} fontFamily="var(--font-sans)" fontSize={11} fill={C.muted} transform="rotate(-90 66 120)">operations →</text>
      {curves.map((c, i) => (
        <g key={i}>
          <path d={build(c.f)} fill="none" stroke={c.c} strokeWidth={2.4} />
          <text x={c.lx} y={c.ly} fontFamily="var(--font-mono)" fontSize={12} fontWeight={700} fill={c.c}>{c.label}</text>
        </g>
      ))}
    </Frame>
  );
}

// Fairness: same model, different error rates across two groups.
function FairnessMetrics() {
  const groups = [
    { name: "Group A", tpr: 0.90, fpr: 0.10, c: C.iris },
    { name: "Group B", tpr: 0.65, fpr: 0.30, c: C.rose },
  ];
  return (
    <Frame h={250}>
      <text x={400} y={30} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={12.5} fontWeight={600} fill={C.soft}>One model can be accurate overall yet unfair across groups</text>
      {groups.map((g, i) => {
        const x = 90 + i * 360;
        return (
          <g key={i}>
            <text x={x + 150} y={62} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill={g.c}>{g.name}</text>
            {/* TPR bar */}
            <text x={x} y={100} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>True-positive rate</text>
            <rect x={x} y={108} width={300} height={18} rx={6} fill={C.canvas} stroke={C.line} strokeWidth={1} />
            <rect x={x} y={108} width={300 * g.tpr} height={18} rx={6} fill={g.c} opacity={0.75} />
            <text x={x + 300 * g.tpr + 8} y={122} fontFamily="var(--font-mono)" fontSize={11} fill={g.c}>{Math.round(g.tpr * 100)}%</text>
            {/* FPR bar */}
            <text x={x} y={158} fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>False-positive rate</text>
            <rect x={x} y={166} width={300} height={18} rx={6} fill={C.canvas} stroke={C.line} strokeWidth={1} />
            <rect x={x} y={166} width={300 * g.fpr} height={18} rx={6} fill={C.amber} opacity={0.75} />
            <text x={x + 300 * g.fpr + 8} y={180} fontFamily="var(--font-mono)" fontSize={11} fill={C.amber}>{Math.round(g.fpr * 100)}%</text>
          </g>
        );
      })}
      <text x={400} y={222} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11.5} fill={C.muted}>Equalized odds asks these rates to match across groups — often at odds with other fairness definitions.</text>
    </Frame>
  );
}

const REGISTRY: Record<DiagramName, () => React.ReactElement> = {
  "ml-workflow": MlWorkflow,
  "learning-types": LearningTypes,
  "bias-variance": BiasVariance,
  "gradient-descent": GradientDescent,
  "data-splits": DataSplits,
  "confusion-matrix": ConfusionMatrix,
  "roc-curve": RocCurve,
  "overfitting": Overfitting,
  "neural-net": NeuralNet,
  "backprop": Backprop,
  "activations": Activations,
  "cnn": Cnn,
  "rnn-vs-transformer": RnnVsTransformer,
  "attention": Attention,
  "embeddings": Embeddings,
  "llm-lifecycle": LlmLifecycle,
  "rag-pipeline": RagPipeline,
  "agent-loop": AgentLoop,
  "mlops-loop": MlopsLoop,
  "system-design-framework": SystemDesignFramework,
  "bayes-theorem": BayesTheorem,
  "normal-distribution": NormalDistribution,
  "hypothesis-test": HypothesisTest,
  "big-o": BigO,
  "fairness-metrics": FairnessMetrics,
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
