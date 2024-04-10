/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        neo: {
          black: "#02060D",
          gray: {
            1: "#303030"
          },
          blue: "#4891FF"
        }
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

