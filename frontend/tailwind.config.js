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
        bankMidnight: "#0B1220",
        bankSteel: "#1E293B",
        bankMint: "#34D399",
        bankCoral: "#FB7185",
        "bank-soft": "#EEF6FF", // keep the hyphenated name
      },
      boxShadow: {
        glow: "0 18px 50px rgba(37, 99, 235, 0.25)",
        panel: "0 12px 45px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        "aurora":
          "radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.28), transparent 50%), radial-gradient(circle at 80% 0, rgba(14, 165, 233, 0.24), transparent 55%), radial-gradient(circle at 50% 80%, rgba(248, 113, 113, 0.2), transparent 55%)",
        "mesh-soft":
          "radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.25), transparent 55%), radial-gradient(circle at 85% 0%, rgba(168, 85, 247, 0.22), transparent 60%), radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.2), transparent 60%)",
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
