/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/composables/**/*.{js,ts}",
    "./app/plugins/**/*.{js,ts}",
    "./app/utils/**/*.{js,ts}",
    "./app/{App,app}.{js,ts,vue}",
    "./app/{Error,error}.{js,ts,vue}",
    "./app/app.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        latte: '#F5EDE0',
        mocha: {
          100: '#EDE4D6',
          200: '#D9CBAF',
          300: '#C4AD88',
          400: '#A8895E',
          500: '#8D6E42',
          600: '#73573A',
          700: '#5C4530',
          800: '#483728',
          900: '#3A2C21',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      fontFamily: {
        display: ['"Noto Serif TC"', 'serif'],
      }
    },
  },
  plugins: [],
};
