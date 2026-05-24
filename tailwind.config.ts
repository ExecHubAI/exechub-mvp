import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0d2060",
          mid: "#1a3a7a",
          light: "#2d5599",
        },
        exec: {
          blue: "#4a90d9",
          "blue-pale": "#e8f2fb",
          gold: "#c9a84c",
          "gold-pale": "#fdf6e3",
          off: "#f7f8fc",
          border: "#dde3f0",
          border2: "#c8d0e4",
          muted: "#9aaabb",
          light: "#6b7f9a",
          mid: "#3d4f6a",
        },
      },
      fontFamily: {
        display: ["'Lora'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        riseIn: "riseIn 0.5s ease both",
        blink: "blink 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;