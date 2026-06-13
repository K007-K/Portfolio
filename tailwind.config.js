/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          900: 'var(--space-900)',
          800: 'var(--space-800)',
          700: 'var(--space-700)',
          border: 'var(--space-border)',
        },
        aurora: {
          red: 'var(--aurora-red)',
          blue: 'var(--aurora-blue)',
          purple: 'var(--aurora-purple)'
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          dark: 'var(--text-dark)'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Outfit"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        hero: ['"Anton"', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 10vw, 12rem)', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
        'display': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite'
      }
    },
  },
  plugins: [],
}
