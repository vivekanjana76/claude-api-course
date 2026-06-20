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
        cream: {
          DEFAULT: "#F0EEE6",
          50: "#FAF9F5",
          100: "#F4F2EB",
          200: "#E8E5D8",
          300: "#DAD6C4",
        },
        ink: {
          DEFAULT: "#1A1915",
          soft: "#3D3A33",
          muted: "#6B665B",
          faint: "#928C7E",
        },
        clay: {
          DEFAULT: "#CC785C",
          dark: "#A8593F",
          light: "#E0A088",
          50: "#F7EBE5",
        },
        sage: {
          DEFAULT: "#6A7C5C",
          light: "#A8B89A",
        },
        ochre: "#C99A3A",
        slateblue: "#5B6B82",
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        flow: "flow 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
