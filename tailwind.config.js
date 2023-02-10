const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "white",
      black: "black",
      gray: "#221F1F",
      none: "transperant",
      darkblue: "#03001C",
      violet: "#301E67",
      lightBlue: "#5B8FB9",
      skyBlue: "#B6EADA",
      green: "#32CD32",
    },
    fontFamily: {
      janna: ["var(FontVariable)", ...fontFamily.sans],
    },

    screens: {
      "2xl": { max: "1535px" },

      xl: { max: "1279px" },

      lg: { max: "1023px" },

      md: { max: "767px" },

      sm: { max: "639px" },

      desc: { max: "992px" },

      tab: { max: "768px" },

      mob: { max: "576px" },
    },
    extend: {
      spacing: {
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "5/5": "100%",
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
        "10/10": "100%",
        "10vh": "10vh",
        "20vh": "20vh",
        "30vh": "30vh",
        "40vh": "40vh",
        "50vh": "50vh",
        "60vh": "60vh",
        "70vh": "70vh",
        "80vh": "80vh",
        "90vh": "90vh",
      },
      keyframes: {
        headerAnimation: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        fadeIn: {
          to: { opacity: "1" },
        },
        fadeInRight: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0%)", opacity: "1" },
        },
        fadeInLeft: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0%)", opacity: "1" },
        },
        fadeInBottom: {
          "0%": { transform: "translateY(5rem)", opacity: "0" },
          "100%": { transform: "translateX(0%)", opacity: "1" },
        },
        fadeInTop: {
          "0%": { transform: "translateY(-5rem)", opacity: "0" },
          "100%": { transform: "translateX(0%)", opacity: "1" },
        },
      },
      animation: {
        header: "headerAnimation .7s ease-out forwards",
        fadeIn: "fadeIn 1.3s ease-out forwards",
        fadeInRight: "fadeInRight .7s ease-out forwards",
        fadeInLeft: "fadeInLeft .7s ease-out forwards",
        fadeInBottom: "fadeInBottom .7s ease-out forwards",
        fadeInTop: "fadeInTop .7s ease-out forwards",
      },
      backgroundImage: {},
    },
  },
  plugins: [require("tailwind-gradient-mask-image")],
};
