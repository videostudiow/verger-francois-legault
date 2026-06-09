import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        foreground: "var(--color-text)",
        text: "var(--color-text)",
        accent: "var(--color-accent)",
        muted: "var(--color-muted)",
        deep: "var(--color-deep)",
        "tint-1": "var(--tint-1)",
        "tint-2": "var(--tint-2)",
        "tint-3": "var(--tint-3)",
        "tint-4": "var(--tint-4)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        soft: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
