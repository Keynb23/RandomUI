import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Main colors
        "light-blue": "#93E6E6",
        "pink-purple": "#AA3E98",
        Emerald: "#33CA7F",

        // Supporting colors
        "frosted-blue": "#84C7D0",
        "lavender-purple": "#9368B7",

        // Accent colors
        "ink-black": "#011627",
        FloralWhite: "#FAF7ED",
        AzureMist: "#E9FCFD",
        VintageGrape: "#5F5069",
        // Neutral colors
        snow: "#F9F9F9",
        Black: "#080708",
      },

      //   Typography
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSizes: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
      },
      fontWeights: {
        thin: "100",
        xl: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
    },
  },
  plugins: [],
};

export default config;
