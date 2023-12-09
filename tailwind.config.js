/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1700px",
      },
      colors: {
        navButtonBg: "#FFC9C9",
        arbitrumBg: "rgba(27, 74, 221, 0.87)",
        aaveBg: "#B6509E",
        depositBg: "rgba(255, 201, 201, 0.50)",
        portfolioBottomBg: "#830707",
      },
    },
  },
  plugins: [],
};
