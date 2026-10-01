import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B2035",
        "navy-2": "#0F2B45",
        blue: {
          DEFAULT: "#1268E8",
          light: "#3C8CFF",
        },
        paper: "#F6F8FB",
        ink: "#0B2035",
        mute: "#5A6B7D",
        line: "#DEE6EF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
