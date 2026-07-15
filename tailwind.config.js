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
        "dono-primary": "#2f6844",
        "dono-primary-dark": "#245538",
        "dono-accent": "#6BAF92",
        "dono-accent-dark": "#245538",
        "dono-cyan": "#1c2420",
        "dono-green": "#2f6844",
        "dono-amber": "#1c2420",
        "dono-bg": "#f4f7f3",
        "dono-cream": "#f4f7f3",
        "dono-surface": "#ffffff",
        "dono-surface-muted": "#eaf1ea",
        "dono-text": "#1c2420",
        "dono-muted": "#56615A",
        "dono-border": "#e8e3da",
      },
    },
  },
  plugins: [],
};
