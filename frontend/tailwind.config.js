/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lilita-one': ['"Lilita One"', 'sans-serif'],
        'spice-rice': ['"Spicy Rice"', 'serif'],
        'permanent': ['Permanent Marker', 'cursive'],
        'luckiest': ['Luckiest Guy', 'cursive'],
        'noto': ["Noto Sans Syloti Nagri", 'sans-serif'],
      },
    },
  },
  plugins: [],
}