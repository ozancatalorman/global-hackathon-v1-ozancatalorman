/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",   // safe extra
    "./src/**/*.{js,ts,jsx,tsx}"      // safe extra
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: "var(--font-brand)",
      },
    },
  },
  plugins: [],
};