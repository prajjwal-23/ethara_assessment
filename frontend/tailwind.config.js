/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                accent: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                },
                surface: {
                    50: '#fafbff',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    card: 'rgba(255, 255, 255, 0.7)',
                    glass: 'rgba(255, 255, 255, 0.45)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'glow-sm': '0 0 15px -3px rgba(99, 102, 241, 0.15)',
                'glow': '0 0 25px -5px rgba(99, 102, 241, 0.2)',
                'glow-lg': '0 0 40px -8px rgba(99, 102, 241, 0.25)',
                'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
                'glow-rose': '0 0 20px -5px rgba(244, 63, 94, 0.3)',
                'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
                'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
                'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.04)',
            },
            keyframes: {
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-down': {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                'pulse-dot': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.5', transform: 'scale(0.8)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 15px -3px rgba(99, 102, 241, 0.2)' },
                    '50%': { boxShadow: '0 0 25px -3px rgba(99, 102, 241, 0.35)' },
                },
            },
            animation: {
                'slide-up': 'slide-up 0.4s ease-out forwards',
                'slide-down': 'slide-down 0.3s ease-out forwards',
                'fade-in': 'fade-in 0.3s ease-out forwards',
                'scale-in': 'scale-in 0.3s ease-out forwards',
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 3s ease-in-out infinite',
                'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
