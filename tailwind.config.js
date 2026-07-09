/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "dono-primary": "#0d5c4b",
        "dono-primary-dark": "#094539",
        "dono-accent": "#e8724a",
        "dono-accent-dark": "#d45e38",
        "dono-bg": "#fafaf8",
        "dono-surface": "#ffffff",
        "dono-surface-muted": "#f3f2ef",
        "dono-text": "#1a2b2a",
        "dono-muted": "#6b7c7a",
        "dono-border": "#e5e3de",
      },
    },
  },
  plugins: [],
};
