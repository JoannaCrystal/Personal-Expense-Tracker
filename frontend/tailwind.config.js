/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Custom colour palette for the expense tracker
        moody: {
          DEFAULT: '#6B4C9A', // primary moody purple
          light: '#8C6BB8',   // lighter version for hovers
          dark: '#4C316C',    // darker shade for accents
        },
        smoky: '#ECECEC',       // soft smoky grey for backgrounds
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        // Softer, neumorphic-style shadows
        neumorph: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
