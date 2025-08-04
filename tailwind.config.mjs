/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f3ff',
                'dark-blue': '#050924',
                'cyber-blue': '#0066cc',
                'space-blue': '#01012b',
                'galaxy-blue': '#00aabb'
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'popover': '0 2px 10px rgba(0, 243, 255, 0.15)',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'zoom-in': {
                    '0%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
                'zoom-out': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(0.95)' },
                },
                'slide-in-from-top': {
                    '0%': { transform: 'translateY(-8px)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'slide-in-from-bottom': {
                    '0%': { transform: 'translateY(8px)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'slide-in-from-left': {
                    '0%': { transform: 'translateX(-8px)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'slide-in-from-right': {
                    '0%': { transform: 'translateX(8px)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--bits-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--bits-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.2s ease-in-out',
                'fade-out': 'fade-out 0.2s ease-in-out',
                'zoom-in': 'zoom-in 0.2s ease-in-out',
                'zoom-out': 'zoom-out 0.2s ease-in-out',
                'slide-in-from-top': 'slide-in-from-top 0.2s ease-in-out',
                'slide-in-from-bottom': 'slide-in-from-bottom 0.2s ease-in-out',
                'slide-in-from-left': 'slide-in-from-left 0.2s ease-in-out',
                'slide-in-from-right': 'slide-in-from-right 0.2s ease-in-out',
                'in': 'fade-in 0.2s ease-in-out, zoom-in 0.2s ease-in-out',
                'out': 'fade-out 0.2s ease-in-out, zoom-out 0.2s ease-in-out',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [],
}