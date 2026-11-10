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
        // Core Brand Palette
        ivory: {
          50: "#FAF9F5",
          100: "#F7F6F0", // Warm Ivory background
          200: "#EFECE2",
          300: "#E5E1D3",
          400: "#D3CEC0",
        },
        ink: {
          950: "#101815",
          900: "#18231F", // Deep Ink primary text
          800: "#273630",
          700: "#3A4A43",
          600: "#50615A",
          500: "#6B7C74",
          400: "#8B9C94",
          300: "#B3C0B9",
          200: "#D6DFD9",
          100: "#ECF1EE",
        },
        forest: {
          950: "#14251E",
          900: "#1C352B",
          800: "#25483B",
          700: "#315C4A", // Forest Green primary brand
          600: "#3E745E",
          500: "#4D8F74",
          400: "#69A88F",
          300: "#8FC2AC",
          200: "#B9DCDE",
          100: "#E2F0E8",
          50: "#F0F7F3",
        },
        sage: {
          900: "#3D5246",
          800: "#516C5D",
          700: "#688876",
          600: "#82A491",
          500: "#A0BFAD",
          400: "#BDD5C7",
          300: "#DCE9DF", // Soft Sage accent surface
          200: "#E8F1EB",
          100: "#F2F7F4",
          50: "#F9FCFA",
        },
        // Semantic Colors
        terracotta: {
          700: "#A53C29",
          600: "#C74E39", // Coral / Error / Urgent alert
          500: "#DC634F",
          100: "#FCEEEB",
          50: "#FEF7F5",
        },
        amber: {
          700: "#A46316",
          600: "#C67D22", // Ochre / Warning / CEFR C1
          500: "#DF9333",
          100: "#FBF2E6",
          50: "#FEFAF5",
        },
        emerald: {
          700: "#1E6845",
          600: "#2A875A", // Success / Mastered
          500: "#37A972",
          100: "#E7F6EE",
          50: "#F3FAF6",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Courier New", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(24, 35, 31, 0.04), 0 1px 2px -1px rgba(24, 35, 31, 0.04)",
        card: "0 2px 6px -1px rgba(24, 35, 31, 0.06), 0 1px 4px -2px rgba(24, 35, 31, 0.04)",
        elevated: "0 10px 25px -5px rgba(24, 35, 31, 0.08), 0 8px 10px -6px rgba(24, 35, 31, 0.04)",
        dropdown: "0 12px 30px -4px rgba(24, 35, 31, 0.12), 0 4px 12px -2px rgba(24, 35, 31, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
