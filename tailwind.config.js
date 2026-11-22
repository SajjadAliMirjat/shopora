/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#15181E', soft: '#3A404B' },
        muted: '#5B6270',
        paper: '#F5F6F8',
        line: '#E3E6EB',
        accent: {
          DEFAULT: '#3347E0',
          dark: '#2638B8',
          soft: '#ECEEFC',
        },
        success: '#14804A',
        danger: '#C62F3B',
        star: '#E6A100',
      },
      boxShadow: {
        card: '0 1px 2px rgba(21,24,30,0.04), 0 8px 24px -12px rgba(21,24,30,0.14)',
        lift: '0 2px 4px rgba(21,24,30,0.05), 0 18px 40px -16px rgba(21,24,30,0.22)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        drawerIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        drawerInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        popIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        toast: 'toastIn 220ms ease-out',
        drawer: 'drawerIn 240ms cubic-bezier(0.22,1,0.36,1)',
        'drawer-right': 'drawerInRight 240ms cubic-bezier(0.22,1,0.36,1)',
        fade: 'fadeIn 180ms ease-out',
        pop: 'popIn 220ms cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
};
