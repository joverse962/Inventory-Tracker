/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Varela Round"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
