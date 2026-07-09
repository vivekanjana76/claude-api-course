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
        // cool sky-tinted canvas
        canvas: {
          DEFAULT: "#F1F5FB",
          50: "#FBFCFE",
          100: "#EAF1F9",
          200: "#DBE6F2",
          300: "#C4D5E8",
        },
        ink: {
          DEFAULT: "#0F1826",
          soft: "#293445",
          muted: "#5C6A80",
          faint: "#93A0B4",
        },
        // primary — cloud azure blue (token name "iris" kept to avoid churn)
        iris: {
          DEFAULT: "#2563EB",
          dark: "#1A47B8",
          light: "#7BA4F5",
          50: "#E7EFFD",
        },
        // secondary — cloud cyan
        teal: {
          DEFAULT: "#0E9BB5",
          dark: "#0A7387",
          light: "#5AC7DA",
          50: "#E1F5F9",
        },
        // AWS-orange accent
        amber: {
          DEFAULT: "#ED8B00",
          dark: "#B96A05",
          light: "#F6B24E",
          50: "#FBEED6",
        },
        // Azure-magenta accent
        rose: {
          DEFAULT: "#C43E86",
          dark: "#9C2C68",
          light: "#E585B4",
          50: "#FAE7F1",
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
