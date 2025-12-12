/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        calc: {
          bg: '#1a1a1a',
          display: '#000000',
          button: '#2d2d2d',
          buttonHover: '#3d3d3d',
          operator: '#ff9500',
          operatorHover: '#ffad33',
          number: '#505050',
          numberHover: '#606060',
        },
      },
    },
  },
  plugins: [],
}

