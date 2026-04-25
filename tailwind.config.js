/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"DM Sans"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono:    ['"Courier New"', 'monospace'],
      },
      colors: {
        garm: {
          black: '#0A0A0A',
          white: '#F5F3EF',
          cream: '#EDE9E2',
          orange: '#FF4D00',
          gray: '#8A8A8A',
          'light-gray': '#D9D5CE',
        }
      },
      letterSpacing: {
        'widest-2': '0.2em',
        'widest-3': '0.3em',
      }
    },
  },
  plugins: [],
};
