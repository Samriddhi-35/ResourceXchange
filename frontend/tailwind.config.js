/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
      },
      colors: {
        "blue-950": "#060F13",
        "blueback":"#EBF4F8",
        "highlight":" #3895BD",
        "Neutral/600":"#636869",
        "Neutral/100":"#E8E8E7",
        "Blue/800":"#60AACA",
        "Blue/600":"#2D7797",

      },
    },
  },
  plugins: [],
};