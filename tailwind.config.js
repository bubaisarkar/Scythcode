/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#667eea",
          "secondary": "#764ba2", 
          "accent": "#f093fb",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f7f8fc",
          "base-300": "#edf2f7",
          "info": "#4facfe",
          "success": "#43e97b",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
      "dark",
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}