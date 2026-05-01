import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
        fg: 'rgb(var(--color-fg) / <alpha-value>)',
        'fg-soft': 'rgb(var(--color-fg-soft) / <alpha-value>)',
        'on-brand': 'rgb(var(--color-on-brand) / <alpha-value>)',
        primary: {
          DEFAULT: '#7c3aed',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          DEFAULT: '#22d3ee',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        magenta: {
          DEFAULT: '#ec4899',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        muted: '#a1a1aa',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero':
          'radial-gradient(ellipse at top, rgba(124,58,237,0.25), transparent 60%), radial-gradient(ellipse at bottom right, rgba(34,211,238,0.18), transparent 60%), radial-gradient(ellipse at bottom left, rgba(236,72,153,0.18), transparent 60%)',
        'gradient-brand':
          'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #22d3ee 100%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(34,211,238,0.06))',
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        float: 'float 6s ease-in-out infinite',
        gradient: 'gradient 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(124, 58, 237, 0.6)',
        'glow-cyan': '0 0 40px -10px rgba(34, 211, 238, 0.5)',
        'inner-border': 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
