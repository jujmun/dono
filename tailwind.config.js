/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Canonical: Space Mono (titles / headings) + Work Sans (body / UI)
        // Logo wordmark stays Fredoka, as before the type swap.
        logo: ["Fredoka_700Bold", "Fredoka", "sans-serif"],
        retro: ["WorkSans_400Regular", "Work Sans", "sans-serif"],
        "retro-bold": ["WorkSans_700Bold", "Work Sans", "sans-serif"],
        "retro-display": ["SpaceMono_700Bold", "Space Mono", "monospace"],
        "retro-mono": [
          "WorkSans_400Regular",
          "Work Sans",
          "sans-serif",
        ],
        "retro-mono-bold": [
          "WorkSans_700Bold",
          "Work Sans",
          "sans-serif",
        ],
        sans: ["WorkSans_400Regular", "Work Sans", "sans-serif"],
        "sans-medium": ["WorkSans_700Bold", "Work Sans", "sans-serif"],
        display: ["SpaceMono_700Bold", "Space Mono", "monospace"],
        "display-medium": ["SpaceMono_700Bold", "Space Mono", "monospace"],
        mono: [
          "WorkSans_400Regular",
          "Work Sans",
          "sans-serif",
        ],
        "mono-medium": [
          "WorkSans_700Bold",
          "Work Sans",
          "sans-serif",
        ],
      },
      colors: {
        "dono-primary": "#159E88",
        "dono-primary-dark": "#0F7A6A",
        "dono-accent": "#F8B400",
        "dono-accent-dark": "#D49A00",
        "dono-cyan": "#211E1A",
        "dono-green": "#159E88",
        "dono-amber": "#F8B400",
        "dono-bg": "#FBEEDD",
        "dono-cream": "#FBEEDD",
        "dono-surface": "#FFF9EF",
        "dono-surface-muted": "#F1E7D6",
        "dono-text": "#211E1A",
        "dono-muted": "#5c574f",
        "dono-border": "#211E1A",
        "retro-cream": "#FBEEDD",
        "retro-paper": "#FFF9EF",
        "retro-ink": "#211E1A",
        "retro-coral": "#F2542D",
        "retro-marigold": "#F8B400",
        "retro-sky": "#2E97D6",
        "retro-mint": "#159E88",
        "retro-pink": "#F17FB3",
        "retro-indigo": "#4D5FE3",
        "retro-tan": "#B98A4E",
        // Mascot palette — keep in sync with DONO_GREEN/DONO_PINK in
        // components/retro/dono-dino.tsx, which needs raw hex for SVG fills.
        "retro-forest": "#2B7B54",
        "retro-blush": "#EC7EA1",
      },
    },
  },
  plugins: [],
};
