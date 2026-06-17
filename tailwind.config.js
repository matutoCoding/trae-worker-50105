/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        forest: {
          50: '#F0F7F2',
          100: '#DBE9E0',
          200: '#B7D3C1',
          300: '#8BBA9B',
          400: '#5D9A74',
          500: '#3D7A56',
          600: '#2D5A3D',
          700: '#244931',
          800: '#1E3B28',
          900: '#183021',
        },
        leaf: {
          400: '#9CCC65',
          500: '#7CB342',
          600: '#558B2F',
        },
        earth: {
          400: '#A1887F',
          500: '#8D6E63',
          600: '#6D4C41',
        },
        sand: {
          50: '#F5F3EF',
          100: '#ECE9E2',
          200: '#DED9CF',
        },
        sky: {
          400: '#4FC3F7',
          500: '#29B6F6',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scaleIn 0.18s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(45, 90, 61, 0.08), 0 4px 16px -4px rgba(45, 90, 61, 0.06)',
        'card': '0 4px 12px -2px rgba(45, 90, 61, 0.1), 0 8px 24px -8px rgba(45, 90, 61, 0.08)',
        'hover': '0 8px 24px -4px rgba(45, 90, 61, 0.15), 0 16px 40px -12px rgba(45, 90, 61, 0.1)',
      },
    },
  },
  plugins: [],
};
