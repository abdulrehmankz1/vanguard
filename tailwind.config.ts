import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0F0F0F",
        foreground: "#F0EDE6",
        muted: "#3A3A3A",
        accent: "#C8F400",
        urgent: "#FF2D20",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        editorial: ["var(--font-dm-serif)", "serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
        label: ["var(--font-barlow)", "sans-serif"],
        grotesk: ["var(--font-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brutal: "-0.02em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
