/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#5b3da1', // Main Nacare Purple
          700: '#4c2f87',
          800: '#3d246d',
          900: '#2e1b54',
        },
        secondary: {
          600: '#6366f1',
        },
        accent: {
          purple: '#5b3da1',
          navy: '#2d3561',
        },
      },
    },
  },
  plugins: [],
};
