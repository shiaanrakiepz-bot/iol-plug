import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  // relative:true resolves the globs against this config file, not the
  // process CWD — the dev server may be launched from the parent folder.
  content: { relative: true, files: ["./src/**/*.{ts,tsx}"] },
  theme: {
    extend: {
      colors: {
        iol: {
          red: "#E1131D",
          redDark: "#B00E16",
        },
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          overlay: "var(--surface-overlay)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          dim: "var(--ink-dim)",
          faint: "var(--ink-faint)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.75rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 8px 32px rgba(0,0,0,0.35)",
        lift: "0 16px 48px rgba(0,0,0,0.5)",
        glow: "0 0 24px var(--accent-soft)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
