/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        atomos: {
          bg: "#000000",
          surface: "#111111",
          surface2: "#18181b",
          surface3: "#1f1f23",
          border: "rgba(255,255,255,0.10)",
          muted: "#a1a1aa",
          soft: "#d4d4d8",
          text: "#ffffff",
          accent: "#00dcc5",
          accentHover: "#14c8b5",
          accentDark: "#003c37",
          success: "#14b86e",
          danger: "#ef4444",
          warning: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,220,197,0.15), 0 10px 30px rgba(0,0,0,0.35)",
        card: "0 18px 40px rgba(0,0,0,0.28)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "atomos-radial":
          "radial-gradient(circle at top, rgba(0,220,197,0.10), transparent 35%)",
      },
      maxWidth: {
        "8xl": "1400px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};