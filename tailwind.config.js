/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface2)',
        border: 'var(--border)',
        'border-light': 'var(--border-light)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted2)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent2)',
        'accent-3': 'var(--accent3)',
        'accent-4': 'var(--accent4)',
        red: 'var(--red)',
        blue: 'var(--blue)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(48px, 7vw, 88px)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
