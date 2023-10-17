/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1850px",
      },
      colors: {
        themeColor: "#FFC9C9",
        buttonText: "#F6A1A1",
        lineBreakColor: "#FFE6E6",
        secondaryBG: "#FCFCFC",
        labelColor: "#8E8E8E",
        buttonBG: "#EAEBEF",
        textRed: "#FA2E2E",
        claimBtn: "#C8C7C7",
      },
      dropShadow: {
        buttonShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      borderRadius: {
        cardRadius: "30px",
      },
    },
  },
  plugins: [],
};
