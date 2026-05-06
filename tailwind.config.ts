import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFD700",
          gold: "#FFC107",
          softYellow: "#FFF9C4",
          cream: "#FFFBEA",
          white: "#FFFFFF",
          black: "#212121",
          muted: "#6B6B6B",
          border: "#D8D1A8",
        },
        amberSpark: "#FFD700",
        goldSpark: "#FFC107",
        charcoal: "#212121",
        lemon: "#FFF9C4",
        cream: "#FFFBEA",
        inkSoft: "#3A3326",
      },
      borderColor: {
        app: "#D8D1A8",
        ink: "#212121",
      },
      borderRadius: {
        "mobile-card": "16px",
        "mobile-panel": "24px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 10px 24px rgba(33, 33, 33, 0.12)",
        card: "0 8px 22px rgba(33, 33, 33, 0.10)",
        button: "0 10px 18px rgba(255, 193, 7, 0.30)",
        premium: "0 18px 45px rgba(33, 33, 33, 0.16)",
        insetGlow: "inset 0 1px 0 rgba(255, 255, 255, 0.65)",
      },
      maxWidth: {
        mobile: "390px",
      },
      minHeight: {
        dvh: "100dvh",
      },
      spacing: {
        screen: "24px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
