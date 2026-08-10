// A three-layer neural mark: input nodes, a hidden layer, and a single output —
// the smallest picture of the thing this whole academy is about.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-ink shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.72} height={size * 0.72} fill="none">
        {/* edges */}
        <g stroke="#E879F9" strokeWidth="0.9" opacity="0.55">
          <path d="M5 7 12 5.5M5 7 12 12M5 17 12 12M5 17 12 18.5" />
        </g>
        <g stroke="#22D3EE" strokeWidth="0.9" opacity="0.7">
          <path d="M12 5.5 19 12M12 12 19 12M12 18.5 19 12" />
        </g>
        {/* input layer */}
        <circle cx="5" cy="7" r="1.9" fill="#E879F9" />
        <circle cx="5" cy="17" r="1.9" fill="#E879F9" />
        {/* hidden layer */}
        <circle cx="12" cy="5.5" r="1.6" fill="#22D3EE" opacity="0.85" />
        <circle cx="12" cy="12" r="1.6" fill="#22D3EE" opacity="0.85" />
        <circle cx="12" cy="18.5" r="1.6" fill="#22D3EE" opacity="0.85" />
        {/* output */}
        <circle cx="19" cy="12" r="2.2" fill="#FBFCFD" />
      </svg>
    </span>
  );
}
