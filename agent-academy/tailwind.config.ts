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
        // porcelain canvas with a faint violet tint
        canvas: {
          DEFAULT: "#F3F2F8",
          50: "#FBFAFE",
          100: "#EFEDF7",
          200: "#E3E0F0",
          300: "#D2CEE4",
        },
        ink: {
          DEFAULT: "#15131F",
          soft: "#34304A",
          muted: "#6A6580",
          faint: "#9A95AD",
        },
        // primary — electric iris/violet
        iris: {
          DEFAULT: "#6C4FE0",
          dark: "#4E36B5",
          light: "#9B86F0",
          50: "#EFEBFD",
        },
        // secondary accents
        teal: {
          DEFAULT: "#0FA39A",
          dark: "#0B7E77",
          light: "#5FCFC7",
          50: "#E3F5F3",
        },
        amber: {
          DEFAULT: "#D9892A",
          dark: "#B06C18",
          light: "#E9B266",
          50: "#F8EEDB",
        },
        rose: {
          DEFAULT: "#D6537F",
          dark: "#AE3A62",
          light: "#EC8AAC",
          50: "#FBE9F0",
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
