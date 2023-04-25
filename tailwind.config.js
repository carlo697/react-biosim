const defaultColors = require("tailwindcss/colors");

const colors = {
  white: defaultColors.white,
  black: defaultColors.black,
  grey: {
    light: "#d1d1d1",
    mid: "#696969",
    dark: "#1a1a1a",
  },
  red: { DEFAULT: "#ab2f2f" },
  blue: { DEFAULT: "#1e3b95" },
  transparent: defaultColors.transparent,
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors,
    extend: {},
  },
  plugins: [],
};
