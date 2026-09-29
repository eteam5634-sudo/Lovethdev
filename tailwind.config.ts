import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#05050f",
          elevated: "#0a0a1a",
        },
        accent: {
          purple: "#a855f7",
          cyan: "#22d3ee",
          blue: "#3b82f6",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.1)",
          bg: "rgba(255, 255, 255, 0.04)",
        },
      },
      fontFamily: {
        sans: [
          "Segoe UI",
          "Candara",
          "Optima",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "Cascadia Code",
          "Consolas",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 40px rgba(168, 85, 247, 0.15)",
        "glow-cyan": "0 0 40px rgba(34, 211, 238, 0.12)",
        "glow-sm": "0 0 20px rgba(168, 85, 247, 0.2)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-in": "fade-in 0.7s ease-out forwards",
        "slide-up": "slide-up 0.7s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [],
};

export default config;
