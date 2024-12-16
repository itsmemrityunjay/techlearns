/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        customBlue: '#203955',  // Add your custom color
        customOrange: '#eaa727', // Another custom color
      },
    },
  },
  plugins: [require("daisyui")],
};
