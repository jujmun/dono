/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter_400Regular", "Inter", "-apple-system", "sans-serif"],
        "sans-medium": ["Inter_500Medium", "Inter", "-apple-system", "sans-serif"],
        display: ["Fraunces_400Regular", "Fraunces", "Georgia", "serif"],
        "display-medium": [
          "Fraunces_500Medium",
          "Fraunces",
          "Georgia",
          "serif",
        ],
        mono: [
          "JetBrainsMono_400Regular",
          "JetBrains Mono",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
        "mono-medium": [
          "JetBrainsMono_500Medium",
          "JetBrains Mono",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        "dono-primary": "#168456",
        "dono-primary-dark": "#126E49",
        "dono-accent": "#6BAF92",
        "dono-accent-dark": "#126E49",
        "dono-cyan": "#1d242f",
        "dono-green": "#3d6b4f",
        "dono-amber": "#1d242f",
        "dono-bg": "#F7FAF8",
        "dono-cream": "#F7FAF8",
        "dono-surface": "#ffffff",
        "dono-surface-muted": "#E8F5EE",
        "dono-text": "#17211B",
        "dono-muted": "#56615A",
        "dono-border": "#e8e3da",
      },
    },
  },
  plugins: [],
};
