/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#1D88D5',
          200: '#14639C',
        },
        'background-dark': '#10181F',
        'background-overlay-dark': '#1B2730',
        'text-primary-dark': '#ECF4F7',
        'text-secondary-dark': '#6A7986',
        error: '#ec5990',
      },
      zIndex: {
        '-1': '-1',
      },
    },
    screens: {
      xs: '576px',
      ml: '960px',
      lx: '1152px',
      ...defaultTheme.screens,
    },
  },
  variants: {
    extend: {
      borderColor: ['focus-within'],
    },
  },
  plugins: [],
};
