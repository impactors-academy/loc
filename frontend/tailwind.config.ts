import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // LOC brand palette
        // Brand truth is the logo: black stripe-letterform on copper. Sampled from
        // Loc.png it is #C9885C exactly — byte-identical to the Impactors Academy
        // mark, which is why Loc reads as part of the same family.
        loc: {
          // The logo value. Use for the mark and on dark grounds (7.03:1 on black).
          // Do NOT use for text on the light theme — it is only 2.93:1 on white.
          copper: "#C9885C",
          // The working accent for the light theme: the logo's own hue (24°) taken
          // down to a lightness that clears AA. Was #C4714A, an approximation of the
          // logo at 3.62:1 on white — it failed AA everywhere it was used as text.
          terracotta: "#A16036",
          sand: "#F7EDD8",
          // Decorative only — as text on light grounds amber is 2.28:1. Anything
          // sitting ON amber must use loc-night (7.48:1), never white (2.28:1).
          amber: "#D4A44C",
          // The cool anchor, from the org palette (Wada combination #296). Replaces
          // loc-teal #2D6A6A, which sat at 180° — outside the brand's warm family
          // — and was the only hue in the product not derived from the logo. Slate
          // keeps the same job (a cool tone that separates *selected* from the
          // terracotta *primary action*) and is stricter on contrast: white on
          // slate is 12.67:1 against teal's 5.96:1.
          slate: "#1B3644",
          // The heading ink. Was #1A1A2E, a navy at 240° — it carried 65 text
          // usages, so the site's headlines were the one cool thing on a warm
          // cream ground. Same value as --foreground: the logo's hue (24°)
          // taken almost to black. Luminance is effectively unchanged,
          // 16.27:1 on the page against the old 16.37:1.
          night: "#231B15",
          // The body/meta text colour, used across ~40 files. Was #8B7355, which
          // measured 4.31:1 against the page background (--background 37 50% 98%,
          // #FCFAF7) and 4.49:1 on pure white — under AA's 4.5:1 in both cases,
          // while carrying card descriptions and every meta row. Same hue (33°)
          // and saturation, lowered in lightness only: now 5.02:1 on the page
          // background, 5.23:1 on white.
          stone: "#7F694D",
          cream: "#FAF5EC",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
