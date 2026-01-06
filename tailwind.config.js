/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scan-laser': 'scan-laser 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'shake': 'shake 0.2s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        'scan-laser': {
          '0%': { top: '-2%' },
          '100%': { top: '102%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      }
    },
  },
  plugins: [],
}
