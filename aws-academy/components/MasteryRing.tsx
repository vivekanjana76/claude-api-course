"use client";

/**
 * A compact progress ring showing a lesson's best quiz score.
 * Colour tiers: teal ≥80%, amber ≥50%, rose below.
 */
export function MasteryRing({
  correct,
  total,
  size = 30,
}: {
  correct: number;
  total: number;
  size?: number;
}) {
  const pct = total ? correct / total : 0;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = pct >= 0.8 ? "#0FA39A" : pct >= 0.5 ? "#D9892A" : "#D6537F";

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      title={`Best quiz score: ${correct}/${total} (${Math.round(pct * 100)}%)`}
      aria-label={`Best quiz score ${correct} of ${total}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="text-canvas-300"
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <span
        className="absolute font-display font-semibold tabular-nums text-ink"
        style={{ fontSize: size * 0.3 }}
      >
        {Math.round(pct * 100)}
      </span>
    </span>
  );
}
