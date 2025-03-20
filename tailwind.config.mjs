/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {
        colors: {
          'neon-blue': '#00f3ff',
          'dark-blue': '#050924',
          'cyber-blue': '#0066cc',
          'space-blue': '#01012b'
        },
        fontFamily: {
          orbitron: ['Orbitron', 'sans-serif'],
          inter: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }