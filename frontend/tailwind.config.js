// frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "bankBlue": "#0B63D6",
        "bank-soft": "#EEF6FF",   // keep the hyphenated name
      },
    },
  },
  plugins: [],
};
