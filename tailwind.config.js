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
        "dono-primary": "#1d242f",
        "dono-primary-dark": "#151a22",
        "dono-accent": "#1d242f",
        "dono-accent-dark": "#151a22",
        "dono-cyan": "#1d242f",
        "dono-green": "#3d6b4f",
        "dono-amber": "#1d242f",
        "dono-bg": "#f7f4ed",
        "dono-cream": "#f7f4ed",
        "dono-surface": "#ffffff",
        "dono-surface-muted": "#f0ebe3",
        "dono-text": "#1d242f",
        "dono-muted": "#5e6473",
        "dono-border": "#e8e3da",
      },
    },
  },
  plugins: [],
};
