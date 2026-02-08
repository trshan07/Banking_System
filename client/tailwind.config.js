/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        bank: {
          green: '#10b981',
          blue: '#1e40af',
          red: '#ef4444',
          yellow: '#f59e0b'
        }
      },
    },
  },
  plugins: [],
}