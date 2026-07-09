// A small DevOps mark: an infinity loop (the Dev↔Ops lifecycle)
// flanked by two flow dots — the continuous delivery this academy teaches.
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
        {/* infinity loop */}
        <path
          d="M12 12c-1.2-2.2-2.6-3.4-4.2-3.4a3 3 0 1 0 0 6C9.4 14.6 10.8 13.4 12 12Zm0 0c1.2 2.2 2.6 3.4 4.2 3.4a3 3 0 1 0 0-6C14.6 9.4 13.2 10.6 12 12Z"
          stroke="#7BA4F5"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* flow dots */}
        <circle cx="6.4" cy="12" r="1.15" fill="#ED8B00" />
        <circle cx="17.6" cy="12" r="1.15" fill="#2563EB" />
      </svg>
    </span>
  );
}
