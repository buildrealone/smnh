module.exports = {
  content: [
    "./pages/**/*.{js,ts,tsx}", 
    "./components/**/*.{js,ts,tsx}"
  ],

  plugins: [require("@tailwindcss/forms"), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
}
