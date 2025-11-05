// frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bankBlue: "#2563EB",
        bankNavy: "#0F172A",
        bankTeal: "#0EA5E9",
        bankLavender: "#A855F7",
        bankAmber: "#FACC15",
        "bank-soft": "#EEF6FF", // keep the hyphenated name
      },
      boxShadow: {
        glow: "0 10px 40px rgba(37, 99, 235, 0.2)",
      },
      backgroundImage: {
        "aurora": "radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.25), transparent 50%), radial-gradient(circle at 80% 0, rgba(14, 165, 233, 0.22), transparent 55%), radial-gradient(circle at 50% 80%, rgba(248, 113, 113, 0.18), transparent 55%)",
      },
    },
  },
  plugins: [],
};
