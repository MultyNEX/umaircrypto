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
          primary: "#060612",
          secondary: "#0c0c1d",
          tertiary: "#141432",
        },
        accent: {
          primary: "#38BDF8",
          secondary: "#A855F7",
          warm: "#F59E0B",
        },
        text: {
          primary: "#F0F0F0",
          secondary: "#8B8B9E",
        },
        border: "#1e1e3a",
        danger: "#FF4757",
        success: "#38BDF8",
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
