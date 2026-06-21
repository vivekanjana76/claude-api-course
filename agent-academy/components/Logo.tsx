// A small "orchestration node" mark: a hub with three satellite agents.
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
        {/* links */}
        <path d="M12 12 L12 5 M12 12 L5.5 16 M12 12 L18.5 16" stroke="#9B86F0" strokeWidth="1.6" strokeLinecap="round" />
        {/* hub */}
        <circle cx="12" cy="12" r="2.6" fill="#6C4FE0" />
        {/* satellites */}
        <circle cx="12" cy="4" r="2" fill="#0FA39A" />
        <circle cx="5" cy="16.5" r="2" fill="#D9892A" />
        <circle cx="19" cy="16.5" r="2" fill="#D6537F" />
      </svg>
    </span>
  );
}
