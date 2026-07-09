// A small "cloud" mark: a rounded cloud glyph over two provider dots
// (AWS-orange + Azure-blue) — the two clouds this academy teaches.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-ink shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.66}
        height={size * 0.66}
        fill="none"
      >
        {/* cloud body */}
        <path
          d="M7 15.5h9.2a3.1 3.1 0 0 0 .4-6.17 4.3 4.3 0 0 0-8.13-1.2A3.4 3.4 0 0 0 7 15.5Z"
          fill="#7BA4F5"
          stroke="#2563EB"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* provider dots */}
        <circle cx="9.2" cy="19" r="1.5" fill="#ED8B00" />
        <circle cx="14.8" cy="19" r="1.5" fill="#2563EB" />
      </svg>
    </span>
  );
}
