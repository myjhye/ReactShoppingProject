/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}", // { js, jsx } 이렇게 띄워서 쓰면 안됨
  ],
  theme: {
    extend: {
      colors: {
        brand: '#F96162'
      },
      backgroundImage: {
        banner: `url('../public/images/banner.jpg')`
      },
    },
  },
  plugins: [],
}

