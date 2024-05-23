/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-orange": "#FF5722",
        "custom-start": "#2AFADF",
        "custom-end": "#4C83FF",
        "custom1-start": "#C2FFD8",
        "custom1-end": "#C2FFD8",
      },
      screens: {
        custom: "1200px",
      },
    },
  },
  plugins: [],
};
