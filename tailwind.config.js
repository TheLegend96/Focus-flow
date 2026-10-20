/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dial: {
          red: '#f43f5e',
          lightRed: '#ffe4e6',
          bg: '#fafafa',
        }
      }
    },
  },
  plugins: [],
}
