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
          DEFAULT: '#E11D48', // rose-600
          dark: '#BE123C',    // rose-700
          light: '#FB7185'    // rose-400
        },
        secondary: {
          DEFAULT: '#FECDD3', // rose-200
          dark: '#FDA4AF',    // rose-300
          light: '#FEE2E2'    // rose-100
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}