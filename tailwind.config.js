/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dbe5f1',
          200: '#b8cce4',
          300: '#8aa9d0',
          400: '#5a82b8',
          500: '#3a629e',
          600: '#2a4d83',
          700: '#1f3a66',
          800: '#16293f',
          900: '#0f1d2e',
          950: '#0a1320',
        },
        teal: {
          50: '#effaf7',
          100: '#d7f2ea',
          200: '#b0e5d6',
          300: '#7dd1bd',
          400: '#48b69d',
          500: '#2a9c84',
          600: '#1d7e6b',
          700: '#196557',
          800: '#175148',
          900: '#14423c',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 29 46 / 0.08), 0 1px 2px -1px rgb(15 29 46 / 0.06)',
        'card-hover': '0 8px 24px -8px rgb(15 29 46 / 0.18), 0 2px 6px -2px rgb(15 29 46 / 0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
        'scale-in': 'scale-in 0.18s ease-out',
      },
    },
  },
  plugins: [],
};
