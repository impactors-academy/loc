import type { Config } from "tailwindcss";

const config: Config = {
  // Kept as the strategy a dark theme *would* use, not as a live feature: LOC
  // has no theme toggle and no `dark:` utilities anywhere, and app/manifest.ts
  // states the site is light on purpose. The unreachable `.dark` token block in
  // globals.css was deleted rather than left to drift.
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
        // LOC brand palette — wired to --loc-* CSS custom properties in globals.css.
        // Every hex lives in one place (:root); Tailwind references the variable.
        loc: {
          copper:     "var(--loc-copper)",
          terracotta: "var(--loc-terracotta)",
          sand:       "var(--loc-sand)",
          amber:      "var(--loc-amber)",
          slate:      "var(--loc-slate)",
          night:      "var(--loc-night)",
          stone:      "var(--loc-stone)",
          cream:      "var(--loc-cream)",
        },
      },
      fontFamily: {
        heading: ["var(--font-clash)", "system-ui", "sans-serif"],
        sans: ["var(--font-general)", "system-ui", "sans-serif"],
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
      transitionTimingFunction: {
        loc: "var(--loc-ease)",
      },
      transitionDuration: {
        loc: "var(--loc-duration)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
