import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FBF8F2",
          100: "#F5EFE0",
          200: "#EBE2CC"
        },
        gold: {
          400: "#D4A24C",
          500: "#B8860B",
          600: "#8B6914",
          700: "#6B4F0F"
        },
        emerald: {
          600: "#0F4F3C",
          700: "#0A3D2D"
        },
        ink: {
          900: "#1A1A1A",
          800: "#2D2D2D",
          700: "#404040"
        },
        muted: {
          500: "#737373",
          400: "#A3A3A3",
          300: "#D4D4D4"
        },
        danger: {
          500: "#DC2626",
          100: "#FEE2E2"
        },
        warning: {
          500: "#D97706",
          100: "#FEF3C7"
        },
        success: {
          500: "#16A34A",
          100: "#DCFCE7"
        },
        info: {
          500: "#2563EB",
          100: "#DBEAFE"
        },
        cream: "#F1E7DC",
        creamSoft: "#FFF8F1",
        burgundy: "#6F2C39",
        teal: "#36665F",
        goldDark: "#C4964B",
        coral: "#D78C79",
        beige: "#D4BFAB",
        mutedMauve: "#8C7D7F"
      },
      boxShadow: {
        card: "0 24px 60px rgba(184, 134, 11, 0.08)",
        soft: "0 10px 30px rgba(26, 26, 26, 0.06)"
      },
      backgroundImage: {
        aura:
          "radial-gradient(circle at top left, rgba(212,162,76,0.16), transparent 30%), radial-gradient(circle at top right, rgba(15,79,60,0.10), transparent 34%), linear-gradient(180deg, #FBF8F2 0%, #F5EFE0 48%, #FBF8F2 100%)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
