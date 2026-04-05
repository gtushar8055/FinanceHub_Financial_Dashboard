/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Spatial UI - Light Theme (Warm Stone)
        surface: {
          primary: "#FAFAF9",
          secondary: "#F5F5F4",
          elevated: "rgba(255,255,255,0.8)",
          glass: "rgba(255,255,255,0.6)",
        },
        ink: {
          primary: "#1C1917",
          secondary: "#57534E",
          muted: "#A8A29E",
        },
        accent: {
          positive: "#059669",
          negative: "#DC2626",
          brand: "#D97706",
          brandLight: "#FEF3C7",
        },
        // Dark Theme (Midnight Depth)
        midnight: {
          950: "#09090B",
          900: "#18181B",
          800: "#27272A",
          700: "#3F3F46",
        },
        glow: {
          positive: "#34D399",
          negative: "#F87171",
          brand: "#FBBF24",
        },
        // Legacy colors for compatibility
        cream: {
          50: "#FFFCFA",
          100: "#FFF8F3",
          200: "#FFF1E8",
          300: "#FFE8D9",
        },
        camel: {
          300: "#E0B87A",
          400: "#D4A863",
          500: "#CC9A5A",
          600: "#B8894F",
          700: "#9A7343",
        },
        coffee: {
          400: "#8B6142",
          500: "#7B5234",
          600: "#6B452C",
          700: "#5A3A25",
        },
        cocoa: {
          600: "#5A3E32",
          700: "#4A3228",
          800: "#3D2920",
          900: "#2D1F18",
        },
        primary: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        hero: [
          "clamp(3rem, 10vw, 6rem)",
          { lineHeight: "1", fontWeight: "700" },
        ],
        "hero-sm": [
          "clamp(2rem, 8vw, 4rem)",
          { lineHeight: "1.1", fontWeight: "700" },
        ],
      },
      spacing: {
        section: "6rem",
        "section-sm": "3rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover":
          "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
        glow: "0 0 20px rgb(204 154 90 / 0.15)",
        "glow-lg": "0 0 40px rgb(204 154 90 / 0.2)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        float: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
        "inner-glow": "inset 0 0 20px rgba(217, 119, 6, 0.1)",
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-out-right": "slideOutRight 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "count-up": "countUp 1.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};
