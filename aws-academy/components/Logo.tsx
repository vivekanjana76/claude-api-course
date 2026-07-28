// An isometric cube mark in AWS orange on squid ink — the "building block"
// every AWS architecture is assembled from.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-ink shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.68} height={size * 0.68} fill="none">
        {/* top face */}
        <path d="M12 3.2 20 7.6 12 12 4 7.6Z" fill="#FF9900" />
        {/* left face */}
        <path d="M4 7.6 12 12v8.8L4 16.4Z" fill="#D9600A" />
        {/* right face */}
        <path d="M20 7.6 12 12v8.8l8-4.4Z" fill="#A8460A" />
        {/* smile swoosh under the cube */}
        <path
          d="M3 20.6c3 1.7 6 2.5 9 2.5s6-.8 9-2.5"
          stroke="#FF9900"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}
