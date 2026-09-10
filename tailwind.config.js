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
        cookie: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        dark: {
          950: '#07090e',
          900: '#0b0f17',
          850: '#101623',
          800: '#161d2d',
          700: '#1f293d',
          600: '#2b3852',
          500: '#3d4e70',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cookie-glow': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'cookie-glow-lg': '0 0 45px -5px rgba(245, 158, 11, 0.45)',
        'cyber': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
