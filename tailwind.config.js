/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uw: {
          purple: '#4B2E83',
          gold: '#B7A57A',
        }
      },
      maxWidth: {
        'form': '800px',
      }
    },
  },
  plugins: [],
}