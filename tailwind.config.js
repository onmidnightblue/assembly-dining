module.exports = {
  theme: {
    extend: {
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "translate(-50%, 20px)", opacity: "0" },
          "100%": { transform: "translate(-50%, 0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        "fade-in": "fade-in 0.3s ease-out",
        "bounce-in": "bounce-in 0.3s ease-out forwards",
      },
    },
  },
};
