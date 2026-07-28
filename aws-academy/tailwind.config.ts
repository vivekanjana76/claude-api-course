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
        // warm sand canvas — pairs with AWS orange
        canvas: {
          DEFAULT: "#F7F4F0",
          50: "#FFFDFB",
          100: "#F1ECE5",
          200: "#E7E0D7",
          300: "#D6CCC0",
        },
        // AWS "squid ink" family
        ink: {
          DEFAULT: "#1B2430",
          soft: "#33404F",
          muted: "#6A7684",
          faint: "#A0AAB5",
        },
        // primary — AWS orange (token name "iris" kept so shared components need no churn)
        iris: {
          DEFAULT: "#D9600A",
          dark: "#A8460A",
          light: "#FF9900",
          50: "#FDEDE0",
        },
        // secondary — AWS console blue
        teal: {
          DEFAULT: "#0972D3",
          dark: "#065299",
          light: "#539FE5",
          50: "#E4F0FB",
        },
        // accent — AWS storage/analytics green
        amber: {
          DEFAULT: "#6E9B0F",
          dark: "#4F7009",
          light: "#9DC93C",
          50: "#EFF6DC",
        },
        // accent — AWS security red
        rose: {
          DEFAULT: "#DD344C",
          dark: "#A8253A",
          light: "#F0798C",
          50: "#FCE7EA",
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
