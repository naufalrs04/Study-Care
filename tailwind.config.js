const colors = require('tailwindcss/colors')


module.exports = {
  content: [ 
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          base: '#F9F9F9',
          firstCyan: '#7FD8E8',
          secondCyan: '#0798C5',
          absWhite: '#FFFFFF',
          fontColor: '#A4A4A4',
      },
    },
  },
  plugins: [],
};
