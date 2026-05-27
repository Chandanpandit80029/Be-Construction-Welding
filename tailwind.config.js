/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e7',
          100: '#fde0bf',
          200: '#fccd97',
          300: '#fbb96f',
          400: '#faa647',
          500: '#f97316',  // Main orange
          600: '#d45d0f',
          700: '#b04a0b',
          800: '#8c3808',
          900: '#682705',
        },
        secondary: {
          50: '#e6f0f5',
          100: '#b3d1e0',
          200: '#80b3cc',
          300: '#4d94b8',
          400: '#1a75a3',
          500: '#0c4a6e',  // Main blue
          600: '#0a3d5c',
          700: '#082f4a',
          800: '#062238',
          900: '#041526',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Legacy support for existing components
        'construction-black': {
          DEFAULT: '#09090b',
          50: '#18181b',
        },
        'construction-gray': {
          DEFAULT: '#27272a',
          50: '#3f3f46',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}