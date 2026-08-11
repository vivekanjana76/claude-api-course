import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // cool graphite canvas — reads as "instrument panel", not "document"
        canvas: {
          DEFAULT: "#F4F6F7",
          50: "#FBFCFD",
          100: "#ECEFF2",
          200: "#E0E5EA",
          300: "#CBD3DB",
        },
        ink: {
          DEFAULT: "#101720",
          soft: "#2C3644",
          muted: "#5A6675",
          faint: "#77828F",
        },
        // primary — electric magenta. Token name "iris" is shared across every
        // academy so the common components need no per-app changes.
        // DEFAULT clears WCAG AA both as text on canvas (5.5:1) and as a
        // background under canvas-50 text (6.2:1); `light` is the neon accent
        // reserved for dark panels and diagram highlights.
        iris: {
          DEFAULT: "#A21CAF",
          dark: "#86198F",
          light: "#E879F9",
          50: "#FBEAFE",
        },
        // secondary — signal cyan
        teal: {
          DEFAULT: "#0E7490",
          dark: "#155E75",
          light: "#22D3EE",
          50: "#E0F5FA",
        },
        // accent — amber, used for cost/latency/throughput callouts
        amber: {
          DEFAULT: "#A16207",
          dark: "#854D0E",
          light: "#FBBF24",
          50: "#FDF3DC",
        },
        // accent — rose, used for risk, failure modes, and safety
        rose: {
          DEFAULT: "#BE123C",
          dark: "#9F1239",
          light: "#FB7185",
          50: "#FDE7EC",
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        prose: "44rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        flow: {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        flow: "flow 1s linear infinite",
        orbit: "orbit 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
