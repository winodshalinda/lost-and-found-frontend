/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary: {
          light: '#4ade80', // emerald-400
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669',   // emerald-600
        },
        secondary: {
          light: '#93c5fd', // blue-300
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',   // blue-600
        },
        background: {
          light: '#d1fae5', // emerald-100
          DEFAULT: '#a7f3d0', // emerald-200
          dark: '#6ee7b7',   // emerald-300
        }
      }
    },
  },
  plugins: [],
}
