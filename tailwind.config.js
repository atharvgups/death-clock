/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      cursor: {
        'shovel': 'url("/cursors/shovel.png"), auto',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
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
        'vaporwave-darkPurple': '#18122B',
        'vaporwave-neonPink': '#D946EF',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fog-move": {
          "0%": { transform: "translate(0%, 0%)" },
          "100%": { transform: "translate(100%, -20%)" },
        },
        "fog-move-reverse": {
          "0%": { transform: "translate(100%, -20%)" },
          "100%": { transform: "translate(0%, 0%)" },
        },
        "float-particle": {
          "0%, 100%": { 
            transform: 'translateY(0) translateX(0)',
            opacity: '0.2'
          },
          "50%": { 
            transform: 'translateY(-20px) translateX(10px)',
            opacity: '0.5'
          }
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'fog-1': {
          '0%': { transform: 'translateX(-100%) translateZ(0)' },
          '100%': { transform: 'translateX(100%) translateZ(0)' },
        },
        'fog-2': {
          '0%': { transform: 'translateX(100%) translateZ(0)' },
          '100%': { transform: 'translateX(-100%) translateZ(0)' },
        },
        lightning: {
          '0%': { filter: 'brightness(1)' },
          '10%': { filter: 'brightness(2)' },
          '20%': { filter: 'brightness(1)' },
          '30%': { filter: 'brightness(2)' },
          '40%, 100%': { filter: 'brightness(1)' },
        },
        'shadow-pulse': {
          '0%, 100%': { 
            transform: 'scale(2) translateY(0)',
            opacity: '0.2'
          },
          '50%': { 
            transform: 'scale(2.2) translateY(-10px)',
            opacity: '0.3'
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fog-slow": "fog-move 60s linear infinite",
        "fog-slow-reverse": "fog-move-reverse 90s linear infinite",
        "fog-fast": "fog-move 30s linear infinite",
        "fog-fast-reverse": "fog-move-reverse 45s linear infinite",
        "float-particle": "float-particle 8s ease-in-out infinite",
        "flicker": "flicker 3s ease-in-out infinite",
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fog-1': 'fog-1 60s linear infinite',
        'fog-2': 'fog-2 45s linear infinite',
        'lightning': 'lightning 200ms ease-in-out',
        'shadow-pulse': 'shadow-pulse 8s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 