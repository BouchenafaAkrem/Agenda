/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sombre: {
          background: '#1E1E1E',
          text: '#C8C8C8',
        },
      },
    },
  },
  plugins: [],
};