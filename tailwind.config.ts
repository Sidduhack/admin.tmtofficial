import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        abyss: {
          black: "#030307",
          charcoal: "#0A0A12",
          elevated: "#11111A",
        },
        neon: {
          cyan: "#00FFFF",
          violet: "#BC13FE",
          gold: "#FFD700",
        },
        ghost: {
          white: "#F0F0F5",
          muted: "#6B6B7A",
        },
        glass: {
          white: "rgba(255,255,255,0.08)",
          border: "rgba(0,255,255,0.15)",
          hover: "rgba(0,255,255,0.05)",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-ibm-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-sm": ["clamp(1.25rem, 2.5vw, 2rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", letterSpacing: "0.005em" }],
        "body-base": ["1rem", { lineHeight: "1.65", letterSpacing: "0.005em" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.01em" }],
        "caption": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em", textTransform: "uppercase" }],
      },
      spacing: {
        "space-4xs": "0.125rem",
        "space-3xs": "0.25rem",
        "space-2xs": "0.375rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "3rem",
        "space-3xl": "4rem",
        "space-4xl": "6rem",
        "space-5xl": "8rem",
      },
      borderRadius: {
        "radius-sm": "0.375rem",
        "radius-md": "0.5rem",
        "radius-lg": "0.75rem",
        "radius-xl": "1rem",
        "radius-2xl": "1.5rem",
        "radius-full": "9999px",
      },
      boxShadow: {
        "glow-cyan": "0 0 40px rgba(0, 255, 255, 0.15), 0 0 80px rgba(0, 255, 255, 0.08)",
        "glow-violet": "0 0 40px rgba(188, 19, 254, 0.15), 0 0 80px rgba(188, 19, 254, 0.08)",
        "glow-gold": "0 0 40px rgba(255, 215, 0, 0.15), 0 0 80px rgba(255, 215, 0, 0.08)",
        "depth-1": "0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "depth-2": "0 8px 24px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)",
        "depth-3": "0 16px 48px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)",
      },
      backdropBlur: {
        "glass": "20px",
        "glass-lg": "40px",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(ellipse at center, rgba(0,255,255,0.1) 0%, transparent 70%)",
        "radial-violet": "radial-gradient(ellipse at center, rgba(188,19,254,0.1) 0%, transparent 70%)",
        "mesh-gradient": "conic-gradient(from 180deg at 50% 50%, rgba(0,255,255,0.1) 0deg, rgba(188,19,254,0.1) 180deg, rgba(0,255,255,0.1) 360deg)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
        "reveal-up": "revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal-scale": "revealScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "magnetic": "magnetic 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3", filter: "brightness(1)" },
          "50%": { opacity: "0.6", filter: "brightness(1.3)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        revealScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        magnetic: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(var(--mx, 0), var(--my, 0)) scale(1.02)" },
        },
      },
      transitionDuration: {
        "0": "0ms",
        "75": "75ms",
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
        "700": "700ms",
        "1000": "1000ms",
      },
      transitionTimingFunction: {
        "cinematic": "cubic-bezier(0.16, 1, 0.3, 1)",
        "cinematic-out": "cubic-bezier(0.33, 1, 0.68, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "magnetic": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      zIndex: {
        "layer-0": "0",
        "layer-1": "10",
        "layer-2": "20",
        "layer-3": "30",
        "layer-4": "40",
        "layer-5": "50",
        "modal-backdrop": "100",
        "modal": "110",
        "toast": "120",
        "tooltip": "130",
        "cursor": "140",
      },
    },
  },
  plugins: [],
};
export default config;