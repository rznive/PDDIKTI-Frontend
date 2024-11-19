// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Mendeteksi semua file di dalam src yang menggunakan js/jsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
