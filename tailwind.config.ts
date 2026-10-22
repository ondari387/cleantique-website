import type { Config } from "tailwindcss";

/**
 * Cleantique design tokens.
 * Brand values are taken verbatim from the live site's Elementor kit (Oct 2026):
 *   accent_1 #F2D701 (yellow), accent_2 #3CA200 (green), accent_3 #E8F5D3 (mint),
 *   accent_4 #F4F6F0 (off-white), heading ink #161A14, body text #5A6154.
 * Darker greens are derived shades used only where text contrast requires them
 * (#3CA200 on white is 3.3:1, below WCAG AA for body-size text).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{md,json}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3CA200",
          50: "#F4F6F0",
          100: "#E8F5D3",
          200: "#CDEAA6",
          300: "#90C73E",
          500: "#3CA200",
          600: "#338A00",
          700: "#2B7400",
          800: "#1E4D06",
          900: "#173A06",
        },
        sun: { DEFAULT: "#F2D701", 600: "#D9C100", 100: "#FDF8CC" },
        ink: { DEFAULT: "#161A14", soft: "#33372F" },
        muted: { DEFAULT: "#4B5345", light: "#5A6154" },
        line: "#DCE3D2",
        paper: "#F4F6F0",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        ui: ["var(--font-parkinsans)", "system-ui", "sans-serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.35rem, 1.6rem + 3.2vw, 4.1rem)", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2rem, 1.5rem + 2.2vw, 3.1rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.6rem, 1.3rem + 1.3vw, 2.3rem)", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
      },
      borderRadius: { card: "14px", pill: "999px" },
      maxWidth: { prose: "68ch" },
      boxShadow: {
        lift: "0 1px 2px rgba(22,26,20,.06), 0 8px 24px -12px rgba(22,26,20,.18)",
      },
    },
  },
  plugins: [],
};

export default config;
