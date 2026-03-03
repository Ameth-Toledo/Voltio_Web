/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    'md:col-span-1',
    'md:col-span-2',
    'text-orange-400',
    'text-blue-400',
    'text-yellow-400',
  ],
  theme: {
    extend: {
      animation: {
        spotlight: 'spotlight 2s ease .75s 1 forwards',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}