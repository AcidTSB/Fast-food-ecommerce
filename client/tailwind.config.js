module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        primary: '#FF6347', // Example primary color
        secondary: '#4B0082', // Example secondary color
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};