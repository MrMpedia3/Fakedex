module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /from-(.*)-(.*)/ },
    { pattern: /to-(.*)-(.*)/ },
    { pattern: /bg-(.*)-(.*)/ },
  ],
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
  extend: {
    keyframes: {
      pulseArrow: {
        '0%, 100%': { opacity: 0.4, transform: 'translateX(0px)' },
        '50%': { opacity: 1, transform: 'translateX(4px)' },
      },
    },
    animation: {
      pulseArrow: 'pulseArrow 1.4s infinite ease-in-out',
    },
  },
},
  plugins: [],
};
