/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // If using Pages Router
  ],
  theme: {
    extend: {
      colors: {
        'light-text': '#333333', 
        'light-bg': '#f9f9f9',   
      },
    },
  },
  plugins: [],
};