/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rice: {
          blue: '#003366',
          gold: '#C6A567',
        }
      },
      maxWidth: {
        'form': '800px',
      }
    },
  },
  plugins: [],
}