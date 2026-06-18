import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Refined public-facing palette
        parchment: '#F5F0E8',
        'parchment-dark': '#EDE5D4',
        forest: '#2C4A1E',
        'forest-mid': '#3D6929',
        'forest-light': '#567A3A',
        bark: '#6B3B1A',
        'bark-light': '#8C5230',
        harvest: '#C8881A',
        'harvest-light': '#DFA030',
        sage: '#8FAF7A',
        stone: '#7A6A54',
        'stone-light': '#A89880',
        ink: '#1A1209',
        'ink-mid': '#4A3B28',
        'ink-light': '#8C7A60',
        rule: '#DDD0BC',
        // Legacy admin palette (keep working)
        manila: '#E8DCC0',
        'soil-red': '#8C3D24',
        'maize-gold': '#E0A52E',
        'sukuma-green': '#45633A',
        'charcoal-ink': '#2A2118',
        'light-manila': '#F2EAD4',
        'dark-manila': '#D4C4A0',
        'light-soil': '#A84F35',
        'dark-soil': '#6B2D18',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
        // Legacy
        heading: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'heading': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subheading': ['1.125rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(26,18,9,0.06), 0 4px 12px rgba(26,18,9,0.06)',
        'card-hover': '0 4px 8px rgba(26,18,9,0.08), 0 16px 32px rgba(26,18,9,0.1)',
        'nav': '0 1px 0 rgba(26,18,9,0.08)',
      },
      keyframes: {
        'ken-burns': {
          '0%':   { transform: 'scale(1.0) translate(0%, 0%)' },
          '100%': { transform: 'scale(1.12) translate(-1.5%, -1%)' },
        },
        'ken-burns-alt': {
          '0%':   { transform: 'scale(1.0) translate(0%, 0%)' },
          '100%': { transform: 'scale(1.1) translate(1%, -1.5%)' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 6s ease-in-out forwards',
        'ken-burns-alt': 'ken-burns-alt 6s ease-in-out forwards',
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
