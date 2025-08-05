/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Custom colour palette for the expense tracker
        // Updated to deeper, more muted purples to better match the provided sample image.
        moody: {
          DEFAULT: '#2a2154', // primary dark purple for cards and panels
          light: '#42327d',   // lighter version for hovers
          dark: '#15112c',    // darker shade for backgrounds
        },
        smoky: '#ECECEC',       // soft smoky grey for backgrounds (unused in dark theme)
      },
      backgroundImage: {
        // Gradient used for the page background. This creates a smooth blend
        // between our dark, default and light moody colours.
        'moody-gradient': 'linear-gradient(to bottom right, #15112c, #2a2154, #42327d)',
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
