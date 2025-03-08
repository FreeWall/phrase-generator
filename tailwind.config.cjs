/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        main: '#2F3439',
        lighter: '#363b40',
        darker: '#272C31',
        body: '#ced1d5',
        conversion: '#2E88B0',
        conversionHover: '#287090',
        conversionText: '#40B4E8',
        placeholder: '#858688',
      },
      keyframes: {
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
};
