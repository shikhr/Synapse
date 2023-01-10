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
        element: '10',
        dropdown: '20',
        sticky: '30',
        overlay: '40',
        modal: '50',
        popover: '70',
        tooltip: '80',
        sudo: '999',
      },
      keyframes: {
        slidefromleft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        slidefromleft: 'slidefromleft 200ms linear',
      },
    },
    screens: {
      xs: '576px',
      ml: '990px',
      lx: '1200px',
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
