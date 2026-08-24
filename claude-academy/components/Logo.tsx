// A small Claude mark: a conversational spark — the burst of radiating strokes
// that stands for a model turn, with a clay core for the prompt that started it.
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
        {/* radiating turn strokes */}
        <g stroke="#CC785C" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 3.4v4.1" />
          <path d="M12 16.5v4.1" />
          <path d="M3.4 12h4.1" />
          <path d="M16.5 12h4.1" />
          <path d="m6.2 6.2 2.9 2.9" />
          <path d="m14.9 14.9 2.9 2.9" />
          <path d="m17.8 6.2-2.9 2.9" />
          <path d="m9.1 14.9-2.9 2.9" />
        </g>
        {/* the prompt at the centre */}
        <circle cx="12" cy="12" r="2.3" fill="#C99A3A" />
      </svg>
    </span>
  );
}
