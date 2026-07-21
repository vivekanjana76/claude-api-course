// An Interview Academy mark: a neural node lighting up (the "aha" of getting
// hired for an AI role) — a central node with signals firing outward.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-ink shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.68}
        height={size * 0.68}
        fill="none"
      >
        {/* connections */}
        <path
          d="M12 12 L6 6.5 M12 12 L18 6.5 M12 12 L6 17.5 M12 12 L18 17.5"
          stroke="#7BA4F5"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {/* outer nodes */}
        <circle cx="6" cy="6.5" r="1.5" fill="#ED8B00" />
        <circle cx="18" cy="6.5" r="1.5" fill="#2563EB" />
        <circle cx="6" cy="17.5" r="1.5" fill="#2563EB" />
        <circle cx="18" cy="17.5" r="1.5" fill="#0E9BB5" />
        {/* core node */}
        <circle cx="12" cy="12" r="2.6" fill="#7BA4F5" />
      </svg>
    </span>
  );
}
