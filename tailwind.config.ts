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
        bg: {
          primary: "#0A0A0F",
          secondary: "#12121A",
          tertiary: "#1A1A2E",
        },
        accent: {
          primary: "#00D4AA",
          secondary: "#FFD700",
        },
        text: {
          primary: "#F0F0F0",
          secondary: "#8B8B9E",
        },
        border: "#2A2A3E",
        danger: "#FF4757",
        success: "#00D4AA",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
