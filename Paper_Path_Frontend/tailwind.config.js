/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1s infinite',
      }
    },
  },
  plugins: [],
}
