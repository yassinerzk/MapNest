/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
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
        // MapNest custom theme colors
        theme: {
          'midnight': {
            primary: '#121063',
            secondary: '#2C2F8C',
            accent: '#5A5DC9',
          },
          'sunset': {
            primary: '#FF6B6B',
            secondary: '#FFE66D',
            accent: '#F7B267',
          },
          'aqua': {
            primary: '#00B4D8',
            secondary: '#90E0EF',
            accent: '#CAF0F8',
          },
          'forest': {
            primary: '#2D6A4F',
            secondary: '#40916C',
            accent: '#95D5B2',
          },
          'lavender': {
            primary: '#7209B7',
            secondary: '#B5179E',
            accent: '#F72585',
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "pin-drop": {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "60%": { transform: "translateY(5px)", opacity: 0.8 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pin-drop": "pin-drop 0.4s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-in-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))',
        'glass-dark': 'linear-gradient(to right bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
        'midnight-gradient': 'linear-gradient(to right, #121063, #2C2F8C)',
        'sunset-gradient': 'linear-gradient(to right, #FF6B6B, #FFE66D)',
        'aqua-gradient': 'linear-gradient(to right, #00B4D8, #CAF0F8)',
        'forest-gradient': 'linear-gradient(to right, #2D6A4F, #95D5B2)',
        'lavender-gradient': 'linear-gradient(to right, #7209B7, #F72585)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}