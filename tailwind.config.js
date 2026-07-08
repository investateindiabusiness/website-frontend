/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Font Families ─────────────────────────────────────────
      fontFamily: {
        heading: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        body:    ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        sans:    ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // ── Colors ────────────────────────────────────────────────
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
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // ── Brand tokens (use instead of bg-[var(--color-accent)]) ──
        brand: {
          orange: "#D48035",
          "orange-hover": "#B45309",
          "orange-light": "#FFF7ED",
          "orange-tag": "#FFB068",
          navy: "#1F2937",
          beige: "#E6E1DE",
          linen: "#E1DCD7",
          "light-bg": "#F8F8F8",
          footer: "#1A1A1C",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
