/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f2f7f4',
          100: '#d4e8d4',
          200: '#a9d1a9',
          300: '#7dba7d',
          400: '#52a352',
          500: '#4a7c59',
          600: '#3a6347',
          700: '#2b4a35',
          800: '#1b3122',
          900: '#0c1910',
        },
        terra: {
          50:  '#fdf5ee',
          100: '#f8e4cc',
          200: '#f0c899',
          300: '#e8ac66',
          400: '#d98c3a',
          500: '#c17d3c',
          600: '#9a6330',
          700: '#734a24',
          800: '#4d3118',
          900: '#26190c',
        },
        cream: {
          50:  '#fafaf7',
          100: '#f5f0e8',
          200: '#ede4d0',
          300: '#e0d0b0',
          400: '#c8b484',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(74, 124, 89, 0.12)',
        modal: '0 20px 60px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
