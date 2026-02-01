import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Treasure-inspired palette
        treasure: {
          ruby: "#DC2626",      // Primary red
          magenta: "#C026D3",   // Magic purple-pink
          gold: "#F59E0B",      // Treasure gold
          amber: "#FBBF24",     // Light gold accent
          navy: "#0F172A",      // Deep background
          midnight: "#1E1B4B", // Purple-tinted dark
          cosmic: "#312E81",    // Indigo accent
          star: "#FDE68A",      // Star glow
        },
        magic: {
          50: "#FDF4FF",
          100: "#FAE8FF",
          200: "#F5D0FE",
          300: "#F0ABFC",
          400: "#E879F9",
          500: "#D946EF",
          600: "#C026D3",
          700: "#A21CAF",
          800: "#86198F",
          900: "#701A75",
        },
      },
      backgroundImage: {
        'treasure-gradient': 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 50%, #1E1B4B 100%)',
        'magic-glow': 'radial-gradient(ellipse at center, rgba(192, 38, 211, 0.15) 0%, transparent 70%)',
        'star-field': 'radial-gradient(2px 2px at 20px 30px, #FDE68A, transparent), radial-gradient(2px 2px at 40px 70px, #FDE68A, transparent), radial-gradient(1px 1px at 90px 40px, #F59E0B, transparent), radial-gradient(2px 2px at 130px 80px, #FDE68A, transparent)',
      },
      boxShadow: {
        'magic': '0 0 20px rgba(192, 38, 211, 0.3)',
        'ruby': '0 0 20px rgba(220, 38, 38, 0.3)',
        'gold': '0 0 15px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
