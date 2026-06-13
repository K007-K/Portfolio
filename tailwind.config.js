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
          900: '#050507',
          800: '#0A0A0D',
          700: '#12121A',
          border: '#1E1E2A',
        },
        aurora: {
          red: '#FF3B30',
          blue: '#4F6BF6',
          purple: '#8B5CF6'
        },
        text: {
          primary: '#E8E8ED',
          secondary: '#8A8A99',
          dark: '#050507'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Outfit"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 10vw, 12rem)', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
        'display': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}
